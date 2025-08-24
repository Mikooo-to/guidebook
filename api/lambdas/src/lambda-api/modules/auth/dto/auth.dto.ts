import { Expose } from "class-transformer";
import { IsString } from "class-validator";

export class AuthDto {
  @Expose()
  @IsString()
  email: string;
  
  @Expose()
  @IsString()
  password: string;
}
