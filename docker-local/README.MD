# Purpose of the docker-local is to provide environment for local development. Not needed for production

## API
to start cd to docker-local folder and there
```bash
docker compose build
docker compose up
```
Note: 
- you need to rebuild container every time you change dependencies (package.json)
- you need to restart container every time code changes

Then you can access lambda fuction from local machine, for example:

```bash
curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{"payload":"hello world!"}'
```