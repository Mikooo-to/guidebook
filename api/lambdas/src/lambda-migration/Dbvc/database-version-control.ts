import { readFileSync } from 'fs';
import { Postgres } from '../../common/Postgres/postgres';
import { Logger } from '../Logger/Logger';

export class DatabaseVersionControl {
  constructor(private pg: Postgres, private logger: Logger) {
    logger.log(
      'Database Version Control. Use .init() to migrate DB to version mentioned in the first row of the table database_version_control.version',
    );
  }
  public async init() {
    this.logger.log('Starting DB initialization and migration');
    try {
      const exists = await this.getIsDbInit();

      if (!exists) {
        this.logger.log('Creating database schema');
        await this.loadVersion1();
      }

      const version = +(await this.getSchemaVersion());
      this.logger.log('Database schema version: ' + version);

      switch (version) {
        case 1:
          this.logger.log('Updating database to version 1');
          await this.loadVersion1();
        // note that there is no break needed in the switch's cases
        default:
          this.logger.error('Database version is current');
      }
    } catch (e) {
      this.logger.error(e);
    }

    this.logger.log('Database version check complete');
  }

  private async getIsDbInit(): Promise<boolean> {
    const res = await this.pg.pool.query(
      `
      SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE  table_name   = 'database_version_control');
    `,
      [],
    );

    return res.rows[0].exists;
  }

  private async getSchemaVersion(): Promise<number> {
    const res = await this.pg.pool.query(
      `
      select version 
      from database_version_control 
      order by version 
      desc limit 1;
    `,
      [],
    );

    const version = res.rows[0].version;

    if (version) {
      return version;
    }

    return 0;
  }

  private async loadVersion1(): Promise<void> {
    // schema
    await this.runSqlFile('./migration/v1/v1.schema.sql');

    // update db version
    await this.setVersionNumber(1);

    // call vesion-specific seeders if needed
    // await this.registerUser(
    //   'admin@crowd.rocks',
    //   'Admin',
    //   this.config.constants.ADMIN_PASSWORD || 'asdfasdf',
    // );
    // if (process.env.NODE_ENV !== 'prod' && !exists) {
    //   await this.dataloader.loadSiteTextData();
    // }
  }

  private async setVersionNumber(version: number): Promise<void> {
    await this.pg.pool.query(
      `
      insert into database_version_control(version) values($1);
    `,
      [version],
    );
  }

  private async runSqlFile(path: string): Promise<void> {
    try {
      this.logger.log('loading SQL: ' + path);
      const data = readFileSync(path, 'utf8');

      await this.pg.pool.query(data, []);
    } catch (err) {
      this.logger.error(err);
    }
  }
}
