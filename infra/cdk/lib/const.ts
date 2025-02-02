// any name
export const projectName = 'guidebook';

// define your registered domain
export const domainName = 'lublin.life';

// these resources will be created automatically
export const subDomainNameFrontend = 'ukr.lublin.life';
export const subDomainNameApi = 'api.ukr.lublin.life';
export const userDeploerName = `${projectName}-deployer`;
export const websiteIndexDocument = 'index.html';
export const allowOrigins = [
  'http://ukr.lublin.life',
  'https://ukr.lublin.life',
  'http://localhost:3000',
];

// you can leave this unchanged
export const LAMBDAS: Record<
  'api' | 'layerNodeModules',
  { path: string; handler: string }
> = {
  api: {
    path: '../../api/lambdas/build/lambda-api',
    handler: 'api-main.mainHandler',
  },
  layerNodeModules: {
    path: '../../api/lambdas/build_lambda_layer/layer.zip',
    handler: '',
  },
};
