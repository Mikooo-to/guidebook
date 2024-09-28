type LoggerConfig = {
  prefix: string;
};

export class CommonLogger {
  constructor(protected config: LoggerConfig) {}

  public log(message: string): void {
    console.log(`[${this.config.prefix}] ${message}`);
  }

  public error(message: any): void;
  public error(message: string): void {
    if (typeof message == 'string') {
      console.error(`[${this.config.prefix}] ${message}`);
    } else {
      console.error(`[${this.config.prefix}] ${JSON.stringify(message)}`);
    }
  }
}
