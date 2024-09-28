import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Logger } from './Logger/Logger';
import { Config } from '../common/Config/Config';
import { DatabaseVersionControl } from './Dbvc/database-version-control';
import { Postgres } from '../common/Postgres/postgres';
import { getSecret } from '../common/Tools/Tools';

const logger = new Logger();
const config = new Config({
  ADMIN_PASSWORD: await getSecret('ADMIN_PASSWORD'),
  DB_DATABASE: 'test',
  DB_HOST: 'test',
  DB_PASSWORD: 'test',
  DB_USER: 'test',
  DB_PORT: 5432,
});
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
