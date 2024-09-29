import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Logger } from './Logger/Logger.js';
import { Config } from '../common/Config/Config';
import { DatabaseVersionControl } from './Dbvc/database-version-control';
import { Postgres } from '../common/Postgres/postgres';

const config = new Config({
  DB_DATABASE: process.env['DB_DATABASE'],
  DB_HOST: process.env['DB_HOST'],
  DB_PASSWORD: process.env['DB_PASSWORD'],
  DB_USER: process.env['DB_USER'],
  DB_PORT: Number(process.env['DB_PORT']),
});
const logger = new Logger();
const pg = new Postgres(config);
const dbvc = new DatabaseVersionControl(pg, logger);

export const migrationHandler = async (
  event: any,
): Promise<APIGatewayProxyResult> => {
  console.log('[migrationHandler event]', event);
  try {
    dbvc.init();
    console.log('no errors');
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify('DB init and Migration ok'),
    };
  } catch (error) {
    console.log(logger.getErrorLogs());
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify('DB init failed '),
    };
  }
};
