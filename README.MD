# repository consists of
/frontend
/api
/infra

##
first, get aws cli and configure aws profile
```shell
aws configure --profile guidebook
```

##
then create cloudformation stack
```shell
./infra/cloudformation/deploy-runner.sh update <cloud-formation-stack-name>
```

##
then you can deploy by merging to github master leveraging github workflows