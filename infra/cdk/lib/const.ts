import { Handler } from 'aws-cdk-lib/aws-lambda';

export const projectName = 'guidebook';
export const frontendBucketName = `${projectName}-frontend`;
export const userDeploerName = `${projectName}-deployer`;
export const domainName = 'lublin.life';
export const subDomainNameFrontend = 'ukr.lublin.life';
export const subDomainNameApi = 'api.ukr.lublin.life';
export const websiteIndexDocument = 'index.html';

export const LAMBDAS: Record<
  'api' | 'migration' | 'layerNodeModules',
  { path: string; handler: string }
> = {
  api: {
    path: '../../api/lambdas/build/lambda-api',
    handler: 'api-main.mainHandler',
  },
  migration: {
    path: '../../api/lambdas/build/lambda-migration',
    handler: 'migration-main.migrationHandler',
  },
  layerNodeModules: {
    path: '../../api/lambdas/build_lambda_layer/layer.zip',
    handler: '',
  },
};
