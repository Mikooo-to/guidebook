## repository consists of
/frontend
/api
/infra

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

## then compile ts code
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
`AWS_ACCESS_KEY_ID`
`AWS_SECRET_ACCESS_KEY`
and variables
`AWS_REGION`
`AWS_S3_BUCKET_NAME` - bucket name to deploy frontend. Must be the same as 'frontendBucketName' in infra/cdk/lib/const.ts 

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
