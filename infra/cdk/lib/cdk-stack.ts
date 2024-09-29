import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';

import { Construct } from 'constructs';
import {
  frontendBucketName,
  LAMBDAS,
  projectName,
  subDomainName,
  userDeploerName,
} from './const';

export class MyStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // user to deploy code
    const userDeploer = new iam.User(this, `${projectName}Deployer`, {
      userName: userDeploerName,
    });

    /**
     *  FRONTEND
     */

    // Bucket for storing frontend code
    const bucketForFrontend = new s3.Bucket(this, frontendBucketName, {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      bucketName: subDomainName,
      autoDeleteObjects: true,
      blockPublicAccess: {
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      },
      cors: [{ allowedMethods: [s3.HttpMethods.GET], allowedOrigins: ['*'] }],
      websiteIndexDocument: 'index.html',
    });

    bucketForFrontend.addToResourcePolicy(
      new iam.PolicyStatement({
        sid: 'PublicReadForGetBucketObjects',
        effect: iam.Effect.ALLOW,
        principals: [new iam.AnyPrincipal()],
        actions: ['s3:GetObject'],
        resources: [`arn:aws:s3:::${bucketForFrontend.bucketName}/*`],
      }),
    );

    //Lookup the zone based on domain name
    const zone = route53.HostedZone.fromLookup(this, 'lublinlifeZone', {
      domainName: 'lublin.life',
    });

    //Add the Subdomain to Route53
    const cName = new route53.ARecord(this, 'ukrLublinlifeSubdomain', {
      zone: zone,
      recordName: subDomainName,
      target: route53.RecordTarget.fromAlias(
        new targets.BucketWebsiteTarget(bucketForFrontend),
      ),

      // domainName: bucketForFrontend.bucketWebsiteDomainName,
    });

    /**
     *  BACKEND
     */

    // Use the default VPC
    const vpc = ec2.Vpc.fromLookup(this, 'VPC', {
      isDefault: true,
    });

    // Create a security group for the database and assigin it to lambdas to allow access to the db
    const dbSecurityGroup = new ec2.SecurityGroup(this, 'DbSecurityGroup', {
      vpc,
      allowAllOutbound: true,
      description: 'Security group for Aurora database',
    });

    // allow inbound traffic from anywhere to the db
    dbSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(5432), // allow inbound traffic on port 5432 (postgres)
      'allow inbound traffic from anywhere to the db on port 5432',
    );

    // Lambda functions
    const lambdaCommonRole = new iam.Role(this, `${projectName}-lambdarole`, {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    lambdaCommonRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'logs:CreateLogGroup',
          'logs:CreateLogStream',
          'logs:PutLogEvents',
        ],
        resources: ['*'],
      }),
    );
    lambdaCommonRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        'service-role/AWSLambdaBasicExecutionRole',
      ),
    );
    lambdaCommonRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        'service-role/AWSLambdaVPCAccessExecutionRole',
      ),
    );
    lambdaCommonRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        'service-role/AWSLambdaVPCAccessExecutionRole',
      ),
    );

    const secrets = secretsmanager.Secret.fromSecretAttributes(
      this,
      'GuidebookSecrets',
      {
        secretCompleteArn:
          'arn:aws:secretsmanager:eu-central-1:652460108554:secret:GuidebookStackDatabaseSecre-Vu6XMIWgXDtz-sTA8Pp',
      },
    );

    // Create a layer for node_modules
    const nodeModulesLayer = new lambda.LayerVersion(this, 'NodeModulesLayer', {
      code: lambda.Code.fromAsset(LAMBDAS.layerNodeModules.path), // Adjust this path as needed
      compatibleRuntimes: [lambda.Runtime.NODEJS_20_X], // Adjust for your Node.js version
      description: 'Node modules layer',
    });

    // Lambda functions - migration
    const lambdaFnMigration = new lambda.Function(this, `lambdaFnMigration`, {
      code: lambda.AssetCode.fromAsset(LAMBDAS.migration.path),
      layers: [nodeModulesLayer],
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: LAMBDAS.migration.handler,
      timeout: cdk.Duration.seconds(30),
      role: lambdaCommonRole,
      vpc: vpc, // Add this line to associate the Lambda with the VPC
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC }, // Choose appropriate subnet type
      allowPublicSubnet: true, //Lambda Functions in a public subnet can NOT access the internet. If you are aware of this limitation and would still like to place the function in a public subnet, set `allowPublicSubnet` to true
      securityGroups: [dbSecurityGroup], // Add this line to use the same security group as the DB
      environment: {
        DB_USER: secrets
          .secretValueFromJson('username')
          .unsafeUnwrap()
          .toString(),
        DB_PASSWORD: secrets
          .secretValueFromJson('password')
          .unsafeUnwrap()
          .toString(),
        DB_HOST: secrets.secretValueFromJson('host').unsafeUnwrap().toString(),
        DB_PORT: secrets.secretValueFromJson('port').unsafeUnwrap().toString(),
        DB_DATABASE: secrets
          .secretValueFromJson('dbname')
          .unsafeUnwrap()
          .toString(),
        DB_ENGINE: secrets
          .secretValueFromJson('engine')
          .unsafeUnwrap()
          .toString(),
      },
    });

    // Lambda functions - main api
    const lambdaFnApi = new lambda.Function(this, `lambdaFnApi`, {
      code: lambda.AssetCode.fromAsset(LAMBDAS.api.path),
      layers: [nodeModulesLayer],
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: LAMBDAS.api.handler,
      role: lambdaCommonRole,
      environment: {
        DB_USER: secrets
          .secretValueFromJson('username')
          .unsafeUnwrap()
          .toString(),
        DB_PASSWORD: secrets
          .secretValueFromJson('password')
          .unsafeUnwrap()
          .toString(),
        DB_HOST: secrets.secretValueFromJson('host').unsafeUnwrap().toString(),
        DB_PORT: secrets.secretValueFromJson('port').unsafeUnwrap().toString(),
        DB_DATABASE: secrets
          .secretValueFromJson('dbname')
          .unsafeUnwrap()
          .toString(),
        DB_ENGINE: secrets
          .secretValueFromJson('engine')
          .unsafeUnwrap()
          .toString(),
      },
    });

    const api = new apigateway.LambdaRestApi(this, 'guidebook-main-api', {
      handler: lambdaFnApi,
      proxy: true,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    // user policy to deploy code
    userDeploer.attachInlinePolicy(
      new iam.Policy(this, `${projectName}DeployerPolicy`, {
        policyName: `publish-to-${projectName}`,
        statements: [
          new iam.PolicyStatement({
            actions: ['s3:*'],
            effect: iam.Effect.ALLOW,
            resources: [
              bucketForFrontend.bucketArn,
              `${bucketForFrontend.bucketArn}/*`,
            ],
          }),
          new iam.PolicyStatement({
            actions: ['lambda:UpdateFunctionCode'],
            effect: iam.Effect.ALLOW,
            resources: [lambdaFnApi.functionArn],
          }),
        ],
      }),
    );

    new cdk.CfnOutput(this, 'Bucket Url', {
      value: bucketForFrontend.bucketWebsiteUrl,
    });
    new cdk.CfnOutput(this, 'Bucket Name For Frontend', {
      value: bucketForFrontend.bucketName,
    });
    new cdk.CfnOutput(this, 'lambdaFnApi Arn', {
      value: lambdaFnApi.functionArn,
    });
    new cdk.CfnOutput(this, 'lambdaFnMigration Arn', {
      value: lambdaFnMigration.functionArn,
    });

    // =========================================
    // =========================================

    const dbCluster = new rds.ServerlessCluster(this, 'Database', {
      engine: rds.DatabaseClusterEngine.auroraPostgres({
        version: rds.AuroraPostgresEngineVersion.VER_13_12,
      }),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      securityGroups: [dbSecurityGroup],
      scaling: {
        autoPause: cdk.Duration.minutes(5),
        minCapacity: rds.AuroraCapacityUnit.ACU_2,
        maxCapacity: rds.AuroraCapacityUnit.ACU_2,
      },
      defaultDatabaseName: 'guidebook',
      credentials: rds.Credentials.fromGeneratedSecret('postgres'), // This will create the secret automatically
    });

    // allow access from lambda functions to the db cluseter
    dbCluster.connections.allowFrom(lambdaFnMigration, ec2.Port.tcp(5432));
    // todo: access from api
    const dbClusterArn = dbCluster.clusterArn;
    const dbSecretArn = dbCluster.secret?.secretArn;
    if (!dbSecretArn) throw new Error(`dbCluster.secret?.secretArn not found`);
    lambdaCommonRole.addToPolicy(
      new iam.PolicyStatement({
        actions: [
          'rds-data:ExecuteStatement',
          'rds-data:BatchExecuteStatement',
          'rds-data:BeginTransaction',
          'rds-data:CommitTransaction',
          'rds-data:RollbackTransaction',
        ],
        resources: [dbClusterArn],
      }),
    );

    lambdaCommonRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ['secretsmanager:GetSecretValue'],
        resources: [dbSecretArn],
      }),
    );

    new cdk.CfnOutput(this, 'DBEndpoint', {
      value: dbCluster.clusterEndpoint.hostname,
      description: 'The endpoint of the database',
    });

    new cdk.CfnOutput(this, 'DBCredentialsSecret', {
      value: dbCluster.secret?.secretName ?? 'Secret not found',
      description: 'The secret name for database credentials',
    });
  }
}
