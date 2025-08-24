import { BaseService } from "../baseService";
import { AuthDto } from "./dto/auth.dto";
import { User } from "../../entities/user.entity";
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import type { StringValue } from "ms";
import { UsersService } from "../users/users.service";
import { AuthResponse } from "./dto/auth.response";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_TTL = process.env.JWT_TTL as StringValue;

export class AuthService extends BaseService {
  usersService = new UsersService(this.dbConnection);
   
  async login(authDto: AuthDto): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(authDto.email);
    if (!user) {
      throw new Error('User not found');
    }
    if (!user.password) {
      throw new Error('User password not found');
    }
    const isPasswordMatched = await bcrypt.compare(
      authDto.password,
      user.password,
    );
    if (!isPasswordMatched) {
      throw new Error('Invalid password');
    }
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }
    if (!JWT_TTL) {
      throw new Error('JWT_TTL is not defined');
    }
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_TTL });
    return { accessToken: token };
  }
}