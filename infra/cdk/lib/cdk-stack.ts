import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

const projectName = 'guidebook'
const frontendBucketName = `${projectName}-frontend`
// const lambdasBucketName = `${projectName}-lambdas`
const userDeploerName = `${projectName}-deployer`
const lambdasPath = `../../api/lambdas/build`
const handlers = {
  getArticles: 'main.getArticlesHandler'
}
const envVariables = {
        TABLE: 'some table name example',
        BUCKET: 'some bucket name example'
      }


export class MyStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    // user to deploy code
    const userDeploer = new iam.User(this, `${projectName}Deployer`, {
      userName: userDeploerName
    })    

    // Bucket for storing frontend code
    const bucketForFrontend = new s3.Bucket(this, frontendBucketName, {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: {
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false
      },
      cors: [{allowedMethods: [s3.HttpMethods.GET], allowedOrigins: ['*']}],
      websiteIndexDocument: 'index.html',
    })
    
    bucketForFrontend.addToResourcePolicy(new iam.PolicyStatement({
      sid: 'PublicReadForGetBucketObjects',
      effect: iam.Effect.ALLOW,
      principals: [new iam.AnyPrincipal()],
      actions: ['s3:GetObject'],
      resources: [`arn:aws:s3:::${bucketForFrontend.bucketName}/*`],
    }))
        
    
    // Lambda function - get articles
    const lambdaCommonRole = new iam.Role(this, `${projectName}-lambdarole`, {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com")
    })
    
    lambdaCommonRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "rekognition:*",
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
        ],
        resources: ['*']
      })
    )
    
    const lambdaFnMain = new lambda.Function(this, `main`, {
      code: lambda.AssetCode.fromAsset(lambdasPath),
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: handlers.getArticles,
      role: lambdaCommonRole,
      environment: envVariables
    })

    
    // user policy to deploy code
    userDeploer.attachInlinePolicy(new iam.Policy(this, `${projectName}DeployerPolicy`, {
      policyName: `publish-to-${projectName}`,
      statements: [
        new iam.PolicyStatement({
          actions: ['s3:*'],
          effect: iam.Effect.ALLOW,
          resources: [
            bucketForFrontend.bucketArn,
            `${bucketForFrontend.bucketArn}/*`,
          ]
        })
      ]
    }))
    
    new cdk.CfnOutput(this, "Bucket Url", { value: bucketForFrontend.bucketWebsiteUrl });    
    new cdk.CfnOutput(this, "Bucket Name For Frontend", { value: bucketForFrontend.bucketName });
    new cdk.CfnOutput(this, "lambdaFnMain Arn", { value: lambdaFnMain.functionArn });    
  }
}
