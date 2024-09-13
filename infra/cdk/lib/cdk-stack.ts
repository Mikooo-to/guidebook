import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
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
  }
}
