import { Config } from '../Config/Config';
import { Pool } from 'pg';

export class Postgres {
  public readonly pool: Pool;
  constructor(private config: Config) {
    this.pool = new Pool({
      user: this.config.constants.DB_USER,
      host: this.config.constants.DB_HOST,
      database: this.config.constants.DB_DATABASE,
      password: this.config.constants.DB_PASSWORD,
      port: this.config.constants.DB_PORT,
    });
  }
}
