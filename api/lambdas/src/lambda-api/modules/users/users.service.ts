import { Section } from '../../entities/section.entity';
import { User } from '../../entities/user.entity';
import { TListResponce } from '../articles/articles.service';
import { BaseService } from '../baseService';
import { CreateUserDto } from './dto/createUser.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from './constants';

export class UsersService extends BaseService {
  async create(userDto: CreateUserDto): Promise<User> {
    if (userDto.role === UserRole.SUPERADMIN) {
      throw new Error('Creation of new superadmins not allowed');
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
    const user = await this.dbConnection.entityManager.find<User>(User, {
      email,
    });
    if (user.items.length > 1) {
      throw new Error(
        'Multiple users found with the same email. Delete one of them from the database.',
      );
    }
    return user.items[0];
  }
}
