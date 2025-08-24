// docs to read
// https://www.npmjs.com/package/lambda-api#simple-example
// https://github.com/typedorm/typedorm
// https://medium.com/nextfaze/supercharge-%EF%B8%8F-your-dynamodb-single-table-design-pattern-with-typedorm-39168d0d2e29

import 'reflect-metadata';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import createAPI, { NextFunction, Request, Response } from 'lambda-api';
import { createConnection } from '@typedorm/core';
import { mainTable } from './db/tables';
import { Article } from './entities/article.entity';
import { Section } from './entities/section.entity';
import { DocumentClientV3 } from '@typedorm/document-client';
import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { SectionsController } from './modules/sections/sections.controller';
import { ArticlesController } from './modules/articles/articles.controller';
import { UsersController } from './modules/users/users.controller';
import { User } from './entities/user.entity';

/**
 * typeDORM access
 */

console.log(process.env.AWS_REGION);
console.log(process.env.DYNAMODB_ENDPOINT);
console.log(process.env.MAIN_TABLE_NAME);

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
  table: mainTable({ tableName: process.env.MAIN_TABLE_NAME! }),
  entities: [Article, Section, User],
  documentClient,
});

const api = createAPI();

api.use((req: Request, res: Response, next: NextFunction) => {
  res.cors({
    origin: '*',
    methods: 'GET, POST, PUT, DELETE',
    headers: 'Content-Type, Authorization',
    maxAge: 86400,
  });
  next();
});

const sectionsController = new SectionsController({
  api,
  dbConnection,
  path: '/sections',
});

const articlesController = new ArticlesController({
  api,
  dbConnection,
  path: '/articles',
});

const usersController = new UsersController({
  api,
  dbConnection,
  path: '/users',
});

export const mainHandler = async (
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  // console.log('-----------EVENT-----------');
  // console.log(event);
  // console.log('=========END EVENT=========');
  return await api.run(event, context);
};
