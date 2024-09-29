import { Handler } from 'aws-cdk-lib/aws-lambda';

export const projectName = 'guidebook';
export const frontendBucketName = `${projectName}-frontend`;
export const userDeploerName = `${projectName}-deployer`;
export const subDomainName = 'ukr.lublin.life';

export const LAMBDAS: Record<
  'api' | 'migration' | 'layerNodeModules' | 'layerCommon',
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
    path: '../../api/lambdas/node_modules',
    handler: '',
  },
  layerCommon: {
    path: '../../api/lambdas/build/common',
    handler: '',
  },
};
