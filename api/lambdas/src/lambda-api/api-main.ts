import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);
const articlesTableName = process.env.ARTICLES_TABLE_NAME;

export const apiMainHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  console.log('[apiMainHandler params]', event.body);
  console.log('[event.path]', event.path);
  console.log('[event.pathParameters]', event.pathParameters);

  const res = await dynamo.send(
    new ScanCommand({ TableName: articlesTableName }),
  );

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(res.Items),
  };
};
