import { Expose } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { User } from '../../../entities/user.entity';

export class CreateUserDto implements Partial<User> {
  @Expose()
  @IsEmail()
  @MinLength(4)
  email: string;

  @Expose()
  @IsString()
  @MinLength(6)
  password: string;

  @Expose()
  @IsString()
  role: string;
}
