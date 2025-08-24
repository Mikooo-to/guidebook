import { Expose } from "class-transformer";

export class AuthResponse {
  @Expose()
  accessToken: string;
}
