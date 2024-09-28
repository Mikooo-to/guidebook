import { CommonLogger } from '../../common/CommonLogger/CommonLogger';

export class Logger extends CommonLogger {
  private errorLogs: string;
  constructor() {
    super({ prefix: 'Migration' });
  }

  public error(message: any): void;
  public error(message: string): void {
    this.errorLogs =
      this.errorLogs +
      `\n ${new Date().toISOString} [${
        this.config.prefix
      }] JSON.stringify(message)`;
    super.error(message);
  }

  public getErrorLogs(): string {
    return this.errorLogs;
  }
}
