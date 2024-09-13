import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

const projectName = 'guidebook';
const frontendBucketName = `${projectName}-frontend`;
const userDeploerName = `${projectName}-deployer`;
const lambdasPath = `../../api/lambdas/build`;
const handlers = {
  main: 'main.mainHandler',
};

export class MyStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // user to deploy code
    const userDeploer = new iam.User(this, `${projectName}Deployer`, {
      userName: userDeploerName,
    });

    // Bucket for storing frontend code
    const bucketForFrontend = new s3.Bucket(this, frontendBucketName, {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
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

    const table = new dynamodb.Table(this, 'articles-table', {
      partitionKey: {
        name: 'partitionId',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      readCapacity: 1,
      writeCapacity: 1,
    });
    const readScaling = table.autoScaleReadCapacity({
      minCapacity: 1,
      maxCapacity: 2,
    });
    readScaling.scaleOnUtilization({ targetUtilizationPercent: 75 });
    const writeScaling = table.autoScaleWriteCapacity({
      minCapacity: 1,
      maxCapacity: 2,
    });
    writeScaling.scaleOnUtilization({ targetUtilizationPercent: 75 });

    table.addLocalSecondaryIndex({
      indexName: 'user',
      sortKey: { name: 'user', type: dynamodb.AttributeType.STRING },
    });
    table.addLocalSecondaryIndex({
      indexName: 'section',
      sortKey: { name: 'section', type: dynamodb.AttributeType.STRING },
    });

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

    // Lambda functions - main
    const lambdaFnMain = new lambda.Function(this, `lambdaFnMain`, {
      code: lambda.AssetCode.fromAsset(lambdasPath),
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: handlers.main,
      role: lambdaCommonRole,
      environment: {
        TABLE: table.tableName,
      },
    });

    table.grantFullAccess(lambdaFnMain);

    const api = new apigateway.LambdaRestApi(this, 'articles-api', {
      handler: lambdaFnMain,
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
            resources: [lambdaFnMain.functionArn],
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
    new cdk.CfnOutput(this, 'lambdaFnMain Arn', {
      value: lambdaFnMain.functionArn,
    });
    new cdk.CfnOutput(this, 'table', { value: table.tableName });

    // =========================================
    // =========================================
    // Use the default VPC
    const vpc = ec2.Vpc.fromLookup(this, 'VPC', {
      isDefault: true,
    });

    // // Create a new public subnet
    // const publicSubnet = new ec2.PublicSubnet(this, 'MyPublicSubnet', {
    //   vpcId: vpc.vpcId,
    //   availabilityZone: `${this.region}a`, // e.g., 'eu-central-1a'
    //   cidrBlock: '172.31.48.0/20', // Make sure this doesn't overlap with existing subnets
    // });

    // // Create an Internet Gateway if it doesn't exist
    // const igw = new ec2.CfnInternetGateway(this, 'MyInternetGateway');
    // new ec2.CfnVPCGatewayAttachment(this, 'MyVPCGatewayAttachment', {
    //   vpcId: vpc.vpcId,
    //   internetGatewayId: igw.ref,
    // });

    // // Create a route table for the public subnet
    // const publicRouteTable = new ec2.CfnRouteTable(this, 'MyPublicRouteTable', {
    //   vpcId: vpc.vpcId,
    // });

    // // Associate the route table with the public subnet
    // new ec2.CfnSubnetRouteTableAssociation(
    //   this,
    //   'MySubnetRouteTableAssociation',
    //   {
    //     routeTableId: publicRouteTable.ref,
    //     subnetId: publicSubnet.subnetId,
    //   },
    // );

    // // Add a route to the Internet Gateway
    // new ec2.CfnRoute(this, 'MyPublicRoute', {
    //   routeTableId: publicRouteTable.ref,
    //   destinationCidrBlock: '0.0.0.0/0',
    //   gatewayId: igw.ref,
    // });

    // Create a security group for the database
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
    // ------------------
    //   ---------------
    // aws rds describe-db-engine-versions | jq '.DBEngineVersions[] | select(.SupportedEngineModes != null and .SupportedEngineModes[] == "serverless" and .Engine == "aurora-postgresql")'
    // -------------
    // -------------

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
