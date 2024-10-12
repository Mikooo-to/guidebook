// ??  https://www.npmjs.com/package/lambda-api#simple-example
// ?? https://github.com/typedorm/typedorm
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

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const articlesTableName = process.env.ARTICLES_TABLE_NAME;

const api = createAPI();

api.get('/articles', async (req: Request, res: Response) => {
  const articles = await dynamo.send(
    new ScanCommand({ TableName: articlesTableName }),
  );
  res.status(200).send(articles);
});

export const mainHandler = async (
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  return await api.run(event, context);
};
