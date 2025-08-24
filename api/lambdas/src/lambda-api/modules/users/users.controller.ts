import { API, Request, Response } from 'lambda-api';
import { BaseController } from '../baseController';
import { TControllerParams } from '../controllerParams.type';
import { validateOrRejectRequest } from '../../shared/validation-tools';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
import { plainToInstance } from 'class-transformer';
import { UserResponse } from './dto/user.response';

export class UsersController extends BaseController {
  constructor({ api, dbConnection, path }: TControllerParams) {
    const sectionsService = new UsersService(dbConnection);
    api.post(`${path}`, async (req: Request, res: Response) => {
      const userDto = await validateOrRejectRequest(
        req,
        res,
        CreateUserDto,
      );
      if (!userDto) return;

      const user = await sectionsService.create(userDto);
      const userResponse = plainToInstance(UserResponse, user, {
        excludeExtraneousValues: true,
      });

      res.status(201).send(userResponse);
    });

    super(api, dbConnection);
  }
}
