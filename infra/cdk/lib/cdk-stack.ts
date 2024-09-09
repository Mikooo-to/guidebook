import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

const projectName = 'guidebook'
const frontendBucketName = 'guidebook.lublin.life'


export class MyStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Bucket for storing frontend code
    const bucketFrontend = new s3.Bucket(this, frontendBucketName, {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      blockPublicAccess: {
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false
      },
      websiteIndexDocument: 'index.html',
    })
    
    // bucket policy to allow all to access site
    const bucketPolicyStatement = new iam.PolicyStatement({
      sid: 'PublicReadForGetBucketObjects',
      effect: iam.Effect.ALLOW,
      principals: [new iam.AnyPrincipal()],
      actions: ['s3:GetObject'],
      resources: [`arn:aws:s3:::${bucketFrontend.bucketName}/*`],
    });    
    bucketFrontend.addToResourcePolicy(bucketPolicyStatement)
    
    // user policy to deploy code
    const userDeployerPolicy = new iam.Policy(this, `${projectName}DeployerPolicy`, {
      policyName: `publish-to-${frontendBucketName}`,
      statements: [
        new iam.PolicyStatement({
          actions: ['s3:*'],
          effect: iam.Effect.ALLOW,
          resources: [
            bucketFrontend.bucketArn,
            `${bucketFrontend.bucketArn}/*`,
          ]
        })
      ]
    })
    
    // user to deploy code
    const userDeploer = new iam.User(this, `${projectName}Deployer`, {
      userName: `${projectName}-deployer`
    })
    
    userDeploer.attachInlinePolicy(userDeployerPolicy)
    
    new cdk.CfnOutput(this, "Bucket For Frontend Poilcy", { value: bucketPolicyStatement.sid || ''});    
    new cdk.CfnOutput(this, "Bucket For Frontend", { value: bucketFrontend.bucketName });
    new cdk.CfnOutput(this, "Bucket Url", { value: bucketFrontend.bucketWebsiteUrl });    
  }
}
