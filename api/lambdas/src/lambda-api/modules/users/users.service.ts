import { Section } from '../../entities/section.entity';
import { User } from '../../entities/user.entity';
import { TListResponce } from '../articles/articles.service';
import { BaseService } from '../baseService';
import { CreateUserDto } from './dto/createUser.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from './constants';

export class UsersService extends BaseService {
  async create(userDto: CreateUserDto): Promise<User> {
    if (userDto.role === UserRole.ADMIN) {
      throw new Error('Creation of new admins is not allowed');
    }
    userDto.password = bcrypt.hashSync(userDto.password, 8);
    const user = Object.assign(new User(), userDto);
    const result = await this.dbConnection.entityManager.create<User>(user);
    return result;
  }

  async findAll(): Promise<TListResponce<User>> {
    const res = await this.dbConnection.entityManager.find<User>(User, {});
    return res;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.dbConnection.entityManager.findOne<User>(User, {
      email,
    });
    return user;
  }
}
