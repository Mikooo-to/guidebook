# Purpose of the docker-local is to provide environment for local development. Not needed for production

## LOCAL DB
Local DB with predefined structure is included into this repository. You cans start it with just 

```bash
docker compose up db -d
```

Yet, if the structure or name has changed, you need to (re-)create table in the local dynamodb using UI at http://localhost:8001/
use data from api/lambdas/src/lambda-api/db/tables.ts to get necessary params of the data table


# API - you can start api eather using docker compose(see below) or start api using sam (see ../sam-local/README.MD - prefferable way)
to start in the docker, run
```bash
docker compose build
docker compose up
```
Note: 
- you need to rebuild container every time you change dependencies (package.json) (because of using layer to provike node_modules)
- you need to restart container every time code changes

Then you can invoke lambda fuction from local machine, for example:

```bash
curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{"payload":"hello world!"}'
```
or 
```bash
curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d @event-mocks/get-articles.json
```

