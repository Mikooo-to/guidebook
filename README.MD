## repository consists of

/frontend     - frontend

/api          - api based on lambda function and dynamodb

/infra        - infrastructure do automatically deploy frontend and api and other necessary stuff at aws using cdk

/docker-local - docker configuration to start api and db locally. Api accesable only using labda function manual invocation

/sam-local    - alternative way to start api locally (enable api access using http calls, not only manual invocation)


## To start locally, 
see instructions at  /docker-local/README.MD and /sam-local/README.MD


# To deploy we use aws cdk for infrastrucutre creation and github actions for code deployment: 

## Before all, some preparations:
You must decide which aws region you will use for deployment
let's assume that is 'eu-central-1'

You must have some registered domain and hosted zone in route53
let's assume that is 'for-test.click'

You must have an aws user with enough permissions to manipulate with necessary aws resources (I used non-root user, but with maximum permissoins)
you must generate access key for this user and have `Access key ID` and `Secret access key`,  to enter them while configuring aws profile (see below).

Adjust constants in the file  `infra/cdk/lib/const.ts`
let's assume that default project name will be 'zeroblog'.


## first (once), get aws cli according to aws docs (google it ) and then configure aws profile
You will be asked to enter `Access key ID` and `Secret access key` and aws region.
This keys will be stored at your local aws profile which will be used aws cdk to create infrastructure.

```shell
aws configure --profile zeroblog
```


## then (once) install local cdk
```bash
npm i -g aws-cdk-lib
npm i -g aws-cdk 
```

## then cd to infra/cdk 
```bash
cd infra/cdk/
```


### Compile ts code
```bash
npm run build
```

## then (once) bootstrap cdk for that account:
```bash
cdk bootstrap --profile zeroblog
```
it will create necessary roles in your aws account/region  (CloudFormationExecutionRole, ...etc)


## (optional) then preview cloudformation template using  zeroblog profile
```bash
cdk synth --profile zeroblog
```

## create infrastructure using cdk stack
```bash
cdk deploy --profile zeroblog
```
then you'll see several output values. 

Find value of ZeroblogStack.UserDeployerName and remember it (by defuault it will be zeroblog-
deployer)

Find value of ZeroblogStack.LambdaLayerArn and remember it 

Find value of ZeroblogStack.LambdaFnApiArn and remember it (will be something like arn:aws:lambda:eu-central-1:652460108554:function:ZeroblogStack-lambdaFnApi0E02146C-fvY4vVZhKfH7)

Find value of ZeroblogStack.ApiKeyId and use this value in the command 

```bash
aws apigateway get-api-key --api-key <<key_id_from_cdk_deploy_output>> --include-value --query value --output text
```
to get value of the generated key and remember it for further use as REACT_APP_APIGATEWAY_KEY

## At the aws console IAM Security credentials, create credentials for deployer user  (by defuault it will be `zeroblog-deployer`)

This user is created with minimal permissions to deploy code via github actions.
Go to the aws console and create aws credentials for the user zeroblog-deployer (will be used as AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY).

## deploy code using github actions 

set  github actions secrets and variables
`REACT_APP_APIGATEWAY_KEY` - the key you've retrieved before with command `aws apigateway get-api-key --api-key <<key_id_from_cdk_deploy_output>> --include-value --query value --output text ` or at the aws API Gateway console 
`AWS_ACCESS_KEY_ID` - key id for user zeroblog-deployer
`AWS_SECRET_ACCESS_KEY` - secret key value for user zeroblog-deployer

and variables
`AWS_REGION` - the region where the app infrastructure is deployed
`AWS_S3_BUCKET_NAME` - bucket name to deploy frontend. (Must be the same as 'subDomainNameFrontend' in infra/cdk/lib/const.ts) 
`REACT_APP_API_URL` - url of the api (Must be like 'https://api.blog.for-test.click', use subDomainNameApi from infra/cdk/lib/const.ts)
`LAMBDA_MAIN_API_ARN` - arn of the main lambda function (lambdaFnApiArn you've got from output before).
`LAMBDA_LAYER_ARN` - arn of the main lambda function (LambdaLayerArn you've got from output before)

Now you can deploy api and frontend code by merging feature branches to the master branch leveraging github actions workflows

## deploy code using aws cdk
You still able to deploy code using cws cdk, for example to rebuild api and lambda layer containing node_modules (if you need to update packages) and redeploy all changes, do:
Note: not forget to set relevant env variables values at the respected .env files (for backend and frontend)

bash at api/src/lambda-api
```bash
cd api/src/lambda-api
npm run build
npm run build:layer
```
bash at infra/cdk
```bash
npm run build
cdk deploy
```

# USEFUL INFO
## get the list of  availabe aurora serverless DB engines
```sh
aws rds describe-db-engine-versions | jq '.DBEngineVersions[] | select(.SupportedEngineModes != null and .SupportedEngineModes[] == "serverless" and .Engine == "aurora-postgresql")'
```
