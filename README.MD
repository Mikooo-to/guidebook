## repository consists of
/frontend     - frontend
/api          - api based on lambda function and dynamodb
/infra        - infrastructure do automatically deploy frontend and api and other necessary stuff at aws using cdk
/docker-local - docker configuration to start api and db locally. Api accesable only using labda function manual invocation
/sam-local    - alternative way to start api locally (enable api access using http calls, not only manual invocation)

## To start locally, 
see instructions at  /docker-local/README.MD and /sam-local/README.MD


## To deploy use aws cdk: 

## first (once), get aws cli according to aws docs (google it ) and then configure aws profile
```shell
aws configure --profile guidebook
```

## then (once) install local cdk
```bash
npm i -g aws-cdk-lib
npm i -g aws-cdk 
```

## then (once)  if deploing to a new aws account/zone bootstrap cdk for that account:
```bash
cdk bootstrap --profile guidebook
```
it will create necessary roles in your aws account/zone  (CloudFormationExecutionRole, ...etc)

## then cd to infra/cdk 
```bash
cd infra/cdk
```

### Compile ts code
```bash
npm run build
```

## (optional) then preview cloudformation template using  guidebook profile
```bash
cdk synth --profile guidebook
```

## deploy cdk stack
```bash
cdk deploy --profile guidebook
```

## Credentials for ci/cd deployer user

Go to the aws console and create aws credentials for the user guidebook-deployer.

## set up github actions secrets and variables using created credentials

set secrets
`REACT_APP_APIGATEWAY_KEY` - the key you can retrieve using command `aws apigateway get-api-key --api-key <<key_id_from_cdk_deploy_output>> --include-value --query value --output text ` or at the aws API Gateway console 
`AWS_ACCESS_KEY_ID` - key id for this app that you must get at the aws console IAM Security credentials
`AWS_SECRET_ACCESS_KEY` - secret key value for this app that you must get at the aws console IAM Security credentials

and variables
`AWS_REGION` - the region where athe app will be deployed at
`AWS_S3_BUCKET_NAME` - bucket name to deploy frontend. (Must be the same as 'frontendBucketName' in infra/cdk/lib/const.ts) 
`REACT_APP_API_URL` - url of the api (Must be 'https://..... subdomain like 'subDomainNameApi' in infra/cdk/lib/const.ts)
`LAMBDA_MAIN_ARN` - arn of the main lambda function.

Now you can deploy by merging to github master leveraging github actions workflows

<!--
## Outdated - How to make a new deployment using only cloudformation
<!-- ## first, get aws cli and configure aws profile
```shell
aws configure --profile guidebook
```

## then create cloudformation stack
```shell
./infra/cloudformation/deploy-runner.sh update <cloud-formation-stack-name>
``` -->


# USEFUL INFO
## get the list of  availabe aurora serverless DB engines
```sh
aws rds describe-db-engine-versions | jq '.DBEngineVersions[] | select(.SupportedEngineModes != null and .SupportedEngineModes[] == "serverless" and .Engine == "aurora-postgresql")'
```
