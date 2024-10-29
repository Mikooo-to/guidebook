# DEPRECATED

use aws-cdk in the folder ../cdk to deploy project.
this folder is only for history.

## Api deployer user and resources creation

Use `deploy-runner.sh` scrypt for some basic CF stack manipulations, run `deploy-runner.sh help` for details

### Create new config

- Create new template and parameters file

  > Use `dev-deploy-user-parameters.json` and `dev-deploy-user-template.yml` as example

- run scrypt to deploy

```shell
./cloudformation/deploy-runner.sh create <cloud-formation-stack-name>
```

### Update existing config

- Update config files:
  `<cloud-formation-stack-name>-parameters.json`
  `<cloud-formation-stack-name>-template.yml`

- run update scrypt

```shell
./cloudformation/deploy-runner.sh update <cloud-formation-stack-name>
```

