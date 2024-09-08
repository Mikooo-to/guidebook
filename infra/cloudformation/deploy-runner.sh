#!/bin/bash

if [ -z "$1" ]
  then
    echo "option 'command' is absent. Call 'deploy-runner.sh help' for details"
    exit 1
fi

if [ -z "$2" ] && [ $1 != "help" ]
  then
    echo "option 'cloud-formation-stack-name' is absent. Call 'deploy-runner.sh help' for details"
    exit 1
fi

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)

. $SCRIPT_DIR/deploy-runner-config

PROFILE_PARAM="--profile $AWS_PROFILE"
if [ -z $AWS_PROFILE ]
  then
    PROFILE_PARAM=""
fi

# case environment
case $1 in
create)
aws cloudformation create-stack $PROFILE_PARAM --region $REGION --stack-name $APP_ID-$2 --capabilities CAPABILITY_IAM --template-body file://$SCRIPT_DIR/$2-template.yml --parameters file://$SCRIPT_DIR/$2-parameters.json

if [ $? -eq 0 ]
then
  echo " - waiting for stack creation to complete"
  aws cloudformation wait stack-create-complete $PROFILE_PARAM --stack-name $APP_ID-$2 --region $REGION
  echo "Stack creation completed."
  aws cloudformation $PROFILE_PARAM describe-stacks --region $REGION --stack-name $APP_ID-$2 --query Stacks[].Outputs --output table

else
  echo "Stack creation failed"
fi
;;
update)
aws cloudformation update-stack $PROFILE_PARAM --region $REGION --stack-name $APP_ID-$2 --capabilities CAPABILITY_IAM --template-body file://$SCRIPT_DIR/$2-template.yml --parameters file://$SCRIPT_DIR/$2-parameters.json

if [ $? -eq 0 ]
then
  echo " - waiting for stack update to complete"
  aws cloudformation wait stack-update-complete $PROFILE_PARAM --stack-name $APP_ID-$2 --region $REGION
  echo "Stack update completed."
  aws cloudformation describe-stacks $PROFILE_PARAM --region $REGION --stack-name $APP_ID-$2 --query Stacks[].Outputs --output table

else
  echo "Stack update failed"
fi
;;
outputs)
echo "aws cloudformation describe-stacks $PROFILE_PARAM --region $REGION --stack-name $APP_ID-$2 --query Stacks[].Outputs --output table"
aws cloudformation describe-stacks $PROFILE_PARAM --region $REGION --stack-name $APP_ID-$2 --query Stacks[].Outputs --output table
;;
delete)
aws cloudformation delete-stack $PROFILE_PARAM --region $REGION --stack-name $APP_ID-$2

if [ $? -eq 0 ]
then
  echo " - waiting for deletion to complete"
  aws cloudformation wait stack-delete-complete $PROFILE_PARAM --region $REGION --stack-name $APP_ID-$2
fi
;;
help)
echo Dummy Croud-Formation command runner helper script
echo The script notation is: deploy-runner.sh [command] [cloud-formation-stack-name]
echo "Set your environment variables in 'deploy-runner-config' file"
echo
echo "- command: [create|update|delete|outputs]"
echo
echo "- cloud-formation-stack-name: your desired stack name for Cloud Formation. Be aware that your template file name"
echo "looks like <stack-name>-template.yml and parameters file name is <stack-name>-parameters.json".
echo
echo "To change aws region please update this file with your destination REGION option"
echo
;;
*)
echo "undefined option 'command'. Call 'deploy-runner.sh help' for details"
;;
esac
