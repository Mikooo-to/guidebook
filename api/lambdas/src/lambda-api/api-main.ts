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

/**
 * raw dynamodb access
 */
// const client = new DynamoDBClient({});
// const dynamo = DynamoDBDocumentClient.from(client);
// const articlesTableName = process.env.ARTICLES_TABLE_NAME;

/**
 * typeDORM access
 */

console.log(process.env.AWS_REGION);
console.log(process.env.DYNAMODB_ENDPOINT);
console.log(process.env.AWS_ACCESS_KEY_ID);
console.log(process.env.AWS_SECRET_ACCESS_KEY);
console.log(process.env.GUIDEBOOK_TABLE_NAME);

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

const api = createAPI();

api.get('/articles', async (req: Request, res: Response) => {
  const article = new Article();
  article.content = 'content 1';
  article.name = 'name 1';
  article.section = 'section 1';
  article.status = 'status 1';

  const result = await dbConnection.entityManager.create(article);

  res.status(200).send(result);
});

export const mainHandler = async (
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  debugger;
  console.log('-----------EVENT-----------');
  console.log(event);
  console.log('=========END EVENT=========');
  return await api.run(event, context);
};
