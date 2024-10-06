import { APIGatewayProxyResult } from 'aws-lambda';
import { DatabaseVersionControl } from './Dbvc/database-version-control';
import { Config } from './Config/Config';
import { Logger } from './Logger/Logger';
import { Client } from 'pg';

const config = new Config({
  DB_DATABASE: process.env['DB_DATABASE'],
  DB_HOST: process.env['DB_HOST'],
  DB_PASSWORD: process.env['DB_PASSWORD'],
  DB_USER: process.env['DB_USER'],
  DB_PORT: Number(process.env['DB_PORT']),
});
const logger = new Logger({ prefix: 'Migration' });

export const migrationHandler = async (
  event: any,
): Promise<APIGatewayProxyResult> => {
  const client = new Client({
    user: config.constants.DB_USER,
    host: config.constants.DB_HOST,
    database: config.constants.DB_DATABASE,
    password: config.constants.DB_PASSWORD,
    port: config.constants.DB_PORT,
  });

  const connectionPromise = client.connect();
  console.log('[migrationHandler event:]', event);
  await connectionPromise;
  console.log('[client connected:]', client);
  const dbvc = new DatabaseVersionControl(client, logger);
  try {
    await dbvc.init();
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
