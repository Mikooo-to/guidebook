import { Connection } from '@typedorm/core';
import { API } from 'lambda-api';

export class BaseController {
  constructor(protected api: API, protected dbConnection: Connection) {}
}
