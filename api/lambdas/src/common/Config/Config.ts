export type TConstants = {
  ADMIN_PASSWORD: string;
  DB_USER: string;
  DB_HOST: string;
  DB_DATABASE: string;
  DB_PASSWORD: string;
  DB_PORT: number;
};

export class Config {
  constructor(public constants: TConstants) {}
}
