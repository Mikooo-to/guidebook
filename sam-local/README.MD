# The purpose of sam-local is to start start the Lambda function locally.

first, make sure dynamodb service is up and running (`docker ps` should contatin gd_db listenting to port 8000) If not, see ../docker-local/README.MD how to start it


## Using sam local start-api - Since template has an API event, this command would be more appropriate as it starts a local API Gateway endpoint:

```bash
sam local start-api --docker-network gb_default
```

Before running either command, make sure to:
Build your application first:

```bash
sam build
```

## Note!

Remember that template includes environment variables for local testing, including DynamoDB endpoint configuration. Make sure local DynamoDB container (gb_db) is running since your template references it at http://gb_db:8000. If not, see ../docker-local/README.MD how to start it

If you make any changes to your Lambda function code, you'll need to run sam build again before starting the local server.