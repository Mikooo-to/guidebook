import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';

import { Construct } from 'constructs';
import {
  domainName,
  frontendBucketName,
  LAMBDAS,
  projectName,
  subDomainNameApi,
  subDomainNameFrontend,
  userDeploerName,
  websiteIndexDocument,
} from './const';
import { ArticlesDynamoDbTable } from './db-tables/articles-table';
import { GuidebookDynamoDbTable } from './db-tables/guidebook-table';

export class MyStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // user to deploy code
    const userDeploer = new iam.User(this, `${projectName}Deployer`, {
      userName: userDeploerName,
    });

    /**
     *  Database
     */
    const articlesTable = new ArticlesDynamoDbTable(this);
    const guidebookTable = new GuidebookDynamoDbTable(this);

    /**
     *  FRONTEND
     */

    // Bucket for storing frontend code
    const bucketForFrontend = new s3.Bucket(this, frontendBucketName, {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      bucketName: subDomainNameFrontend,
      autoDeleteObjects: true,
      blockPublicAccess: {
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      },
      cors: [{ allowedMethods: [s3.HttpMethods.GET], allowedOrigins: ['*'] }],
      websiteIndexDocument: websiteIndexDocument,
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

    /**
     *  BACKEND
     */

    // Use the default VPC
    const vpc = ec2.Vpc.fromLookup(this, 'VPC', {
      isDefault: true,
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
    lambdaCommonRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        'service-role/AWSLambdaVPCAccessExecutionRole',
      ),
    );

    // Create a layer for node_modules
    const nodeModulesLayer = new lambda.LayerVersion(this, 'NodeModulesLayer', {
      code: lambda.Code.fromAsset(LAMBDAS.layerNodeModules.path), // Adjust this path as needed
      compatibleRuntimes: [lambda.Runtime.NODEJS_20_X], // Adjust for your Node.js version
      description: 'Node modules layer',
    });

    // Lambda functions - main api
    const lambdaFnApi = new lambda.Function(this, `lambdaFnApi`, {
      code: lambda.AssetCode.fromAsset(LAMBDAS.api.path),
      layers: [nodeModulesLayer],
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: LAMBDAS.api.handler,
      role: lambdaCommonRole,
      environment: {
        ARTICLES_TABLE_NAME: articlesTable.table.tableName,
        GUIDEBOOK_TABLE_NAME: guidebookTable.table.tableName,
      },
    });

    // Api
    const api = new apigateway.LambdaRestApi(this, 'guidebook-main-api', {
      handler: lambdaFnApi,
      proxy: true,
      endpointTypes: [apigateway.EndpointType.REGIONAL],
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

    articlesTable.table.grantFullAccess(lambdaFnApi);
    guidebookTable.table.grantFullAccess(lambdaFnApi);

    /**
     *  HOSTING
     */

    //Lookup the zone based on domain name
    const zone = route53.HostedZone.fromLookup(this, 'lublinlifeZone', {
      domainName: domainName,
    });

    // get sertificate for api
    const certificate = new acm.Certificate(this, 'ApiCertificate', {
      domainName: subDomainNameApi,
      validation: acm.CertificateValidation.fromDns(zone),
    });

    const apiGatewayDomainName = new apigateway.DomainName(
      this,
      'ApiDomainName',
      {
        domainName: subDomainNameApi,
        certificate: certificate,
        endpointType: apigateway.EndpointType.REGIONAL,
        securityPolicy: apigateway.SecurityPolicy.TLS_1_2,
      },
    );
    new apigateway.BasePathMapping(this, 'ApiPathMapping', {
      domainName: apiGatewayDomainName,
      restApi: api,
    });

    //Add frontend subdomain to Route53
    const cNameFront = new route53.ARecord(this, 'ukrLublinlifeSubdomain', {
      zone: zone,
      recordName: subDomainNameFrontend,
      target: route53.RecordTarget.fromAlias(
        new targets.BucketWebsiteTarget(bucketForFrontend),
      ),
    });

    //Add api subdomain to Route53
    const cNameApi = new route53.ARecord(this, 'apiUkrLublinlifeSubdomain', {
      zone: zone,
      recordName: subDomainNameApi,
      target: route53.RecordTarget.fromAlias(
        new targets.ApiGatewayDomain(apiGatewayDomainName),
      ),
    });

    /**
     *  Output
     */

    new cdk.CfnOutput(this, 'Bucket Url', {
      value: bucketForFrontend.bucketWebsiteUrl,
    });
    new cdk.CfnOutput(this, 'Bucket Name For Frontend', {
      value: bucketForFrontend.bucketName,
    });
    new cdk.CfnOutput(this, 'lambdaFnApi Arn', {
      value: lambdaFnApi.functionArn,
    });
    new cdk.CfnOutput(this, 'User deployer Name', {
      value: userDeploer.userName,
    });
    new cdk.CfnOutput(this, 'tableArticles', {
      value: articlesTable.table.tableName,
    });
    new cdk.CfnOutput(this, 'tableGuidebook', {
      value: guidebookTable.table.tableName,
    });
  }
}
