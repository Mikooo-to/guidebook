# The purpose of sam-local is to start start the Lambda function locally.

first, make sure dynamodb service is up and running (`docker ps` should contatin gd_db listenting to port 8000) If not, see ../docker-local/README.MD how to start it


## Using sam local start-api - Since template has an API event, this command would be more appropriate as it starts a local API Gateway endpoint:

Before running either command, make sure to:
Bsam local start-api --docker-network gb_default --warm-containers EAGERuild your application first:
```bash
sam build
```
 
* To start api with lazy warm containers (Containers are built on first invoke and kept warm ) with debug port 9229 (to attach debugger):
```bash
sam local start-api --docker-network gb_default --warm-containers LAZY
```

* or for eager containers start:

```bash
sam local start-api --docker-network gb_default --warm-containers EAGER
```

* You can add '--debug-port 9229' parameter to allow debugger like
```bash
sam local start-api --docker-network gb_default --warm-containers EAGER --debug-port 9229
```
But Remember to only add the --debug-port parameter when you actually need to debug your code, as it will always cause the execution to pause until a debugger is attached.



## Note! !!!!!!!!!!! ATTENTION !!!!!!!!!!!

If you make any changes to your Lambda function code, you'll need to 
1. build your function first (`npm run build` in the api/lambdas folder )
2. run `sam build` in the sam-local folder !!!

Yes, you need separately build function code and then run `sam build`.

## ENV vars for local start

Note that env vars for local sam are defined in the template.yaml file
