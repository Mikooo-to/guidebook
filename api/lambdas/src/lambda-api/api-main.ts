// https://www.npmjs.com/package/lambda-api#simple-example
// https://github.com/typedorm/typedorm
// https://medium.com/nextfaze/supercharge-%EF%B8%8F-your-dynamodb-single-table-design-pattern-with-typedorm-39168d0d2e29

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import createAPI, { Request, Response } from 'lambda-api';
import { createConnection } from '@typedorm/core';
import { guidebookTable } from './db/tables';
import { Article } from './entities/article.entity';
import { Section } from './entities/section.entity';

/**
 * raw dynamodb access
 */
// const client = new DynamoDBClient({});
// const dynamo = DynamoDBDocumentClient.from(client);
// const articlesTableName = process.env.ARTICLES_TABLE_NAME;

/**
 * typeDORM access
 */

const dbConnection = createConnection({
  table: guidebookTable,
  entities: [Article, Section],
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
  return await api.run(event, context);
};
