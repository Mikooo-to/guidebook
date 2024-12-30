## How to deploy this project, 
see /README.MD  (in the root folder of the project)

## Run project locally 
see file ../docker-local/README.MD

## Common information about aws CDK, useful commands

code is located in the folder ./lib

The `cdk.json` file tells the CDK Toolkit how to execute your app.

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npm run cdk:deploy` build and deploy this stack to your default AWS account/region
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template
