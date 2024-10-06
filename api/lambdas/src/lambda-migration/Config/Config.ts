export type TConstants = {
  DB_USER: string | undefined;
  DB_HOST: string | undefined;
  DB_DATABASE: string | undefined;
  DB_PASSWORD: string | undefined;
  DB_PORT: number | undefined;
};

export class Config {
  constructor(public constants: TConstants) {}
}
