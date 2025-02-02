import { Connection } from '@typedorm/core';
import { API } from 'lambda-api';

export type TControllerParams = {
  api: API;
  dbConnection: Connection;
  path: string;
};
