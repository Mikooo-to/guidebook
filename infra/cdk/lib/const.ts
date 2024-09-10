export const projectName = 'guidebook'
export const frontendBucketName = `guidebook-frontend`
export const userDeploerName = `${projectName}-deployer`
export const lambdasPath = `../../api/lambdas/build`
export const handlers = {
  getArticles: 'main.getArticlesHandler'
}
export const envVariables = {
        TABLE: 'some table name example',
        BUCKET: 'some bucket name example'
      }