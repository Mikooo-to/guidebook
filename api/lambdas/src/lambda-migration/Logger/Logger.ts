type LoggerConfig = {
  prefix: string;
};

export class Logger {
  private errorLogs: string;
  constructor(protected config: LoggerConfig) {}

  public log(message: string): void {
    console.log(`[${this.config.prefix}] ${message}`);
  }

  public error(message: any): void;
  public error(message: string): void {
    const messageString =
      typeof message == 'string' ? message : JSON.stringify(message);
    this.addToErrorLogs(messageString);
    console.error(`[${this.config.prefix}] ${messageString}`);
  }

  public getErrorLogs(): string {
    return this.errorLogs;
  }

  // PRIVATE
  private addToErrorLogs(log: string): void {
    this.errorLogs =
      this.errorLogs +
      `\n ${new Date().toISOString} [${this.config.prefix}] ${log}`;
  }
}
