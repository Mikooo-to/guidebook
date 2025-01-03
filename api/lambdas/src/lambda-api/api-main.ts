// https://www.npmjs.com/package/lambda-api#simple-example
// https://github.com/typedorm/typedorm
// https://medium.com/nextfaze/supercharge-%EF%B8%8F-your-dynamodb-single-table-design-pattern-with-typedorm-39168d0d2e29
import 'reflect-metadata';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import createAPI, { Request, Response } from 'lambda-api';
import { createConnection } from '@typedorm/core';
import { guidebookTable } from './db/tables';
import { Article } from './entities/article.entity';
import { Section } from './entities/section.entity';
import { DocumentClientV3 } from '@typedorm/document-client';
import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';

/**
 * raw dynamodb access - jsut simple test
 */
// const client = new DynamoDBClient({});
// const dynamo = DynamoDBDocumentClient.from(client);
// const articlesTableName = process.env.ARTICLES_TABLE_NAME;

/**
 * typeDORM access
 */

console.log(process.env.AWS_REGION);
console.log(process.env.DYNAMODB_ENDPOINT);
console.log(process.env.GUIDEBOOK_TABLE_NAME);

// access credentials need only for local dynamodb. Remote Prod works using IAM permissions which are defined in the cdk.
const dynamoDBClientConfig: DynamoDBClientConfig =
  process.env.NODE_ENV === 'local'
    ? {
        region: process.env.AWS_REGION,
        endpoint: process.env.DYNAMODB_ENDPOINT,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
      }
    : {};

const documentClient = new DocumentClientV3(
  new DynamoDBClient(dynamoDBClientConfig),
);

const dbConnection = createConnection({
  table: guidebookTable({ tableName: process.env.GUIDEBOOK_TABLE_NAME! }),
  entities: [Article, Section],
  documentClient,
});

const secretsManager = new SecretsManagerClient({
  region: process.env.AWS_REGION,
});

// // Not needed anymore - rely on apigateway key - left as example of accessing secrets
// 
// const validateApiKey = async (providedApiKey: string): Promise<boolean> => {
//   if (process.env.NODE_ENV === 'local') {
//     return providedApiKey === process.env.API_KEY;
//   }
//   try {
//     const command = new GetSecretValueCommand({
//       SecretId: process.env.API_KEY_SECRET_ARN,
//     });
//     const response = await secretsManager.send(command);
//     const storedApiKey = response.SecretString;
//     return providedApiKey === storedApiKey;
//   } catch (error) {
//     console.error('Error validating API key:', error);
//     return false;
//   }
// };

const api = createAPI();

api.post('/articles', async (req: Request, res: Response) => {
  const { content, name, section, status } = req.body;
  const article = new Article();
  Object.assign(article, { content, name, section, status });
  const result = await dbConnection.entityManager.create(article);
  res.status(200).send(result);
});

api.get('/articles', async (req: Request, res: Response) => {
  const result = await dbConnection.entityManager.find(Article, {});
  res.status(200).send(result);
});

export const mainHandler = async (
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  debugger;
  // // Not needed anymore - rely on apigateway key
  //
  // const apiKey = event.headers['x-api-key'] || event.headers['X-Api-Key'];
  // if (!apiKey || !(await validateApiKey(apiKey))) {
  //   return {
  //     statusCode: 401,
  //     body: JSON.stringify({ message: 'Invalid API key' }),
  //   };
  // }
  console.log('-----------EVENT-----------');
  console.log(event);
  console.log('=========END EVENT=========');
  return await api.run(event, context);
};
