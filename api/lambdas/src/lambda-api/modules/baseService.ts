import { Connection } from '@typedorm/core';

export class BaseService {
  constructor(protected dbConnection: Connection) {}
}
