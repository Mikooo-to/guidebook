# repository consists of
/frontend
/api
/infra


# How to make a new deployment
<!-- ## first, get aws cli and configure aws profile
```shell
aws configure --profile guidebook
```

## then create cloudformation stack
```shell
./infra/cloudformation/deploy-runner.sh update <cloud-formation-stack-name>
``` -->


use aws cdk: 
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
cdk bootstrap
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

## then go to the aws console and create aws credentials for the user ***-deployer

you can deploy by merging to github master leveraging github workflows using created credentials as secrets