export abstract class BaseService<T> {
  protected init: RequestInit = {};
  protected apiUrl: string = '';
  protected key: string = '';

  constructor() {
    this.apiUrl = process.env.REACT_APP_API_URL || '';
    this.key = process.env.REACT_APP_APIGATEWAY_KEY || '';
    if (!this.key || !this.apiUrl) {
      throw new Error('api key or url not found');
    }
    this.init = {
      headers: {
        'x-api-key': this.key,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Origin: window.location.origin,
      },
    };
  }
  abstract get(): Promise<T[]>;
  abstract post(data: T): any;
  abstract prepare(data: Partial<T>): T;
}
