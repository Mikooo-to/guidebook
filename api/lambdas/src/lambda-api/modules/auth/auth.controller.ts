import { BaseController } from '../baseController';
import { TControllerParams } from '../controllerParams.type';
import { Request, Response } from 'lambda-api';
import { AuthDto } from './dto/auth.dto';
import { validateOrRejectRequest } from '../../shared/validation-tools';
import { AuthService } from './auth.service';
import { AuthResponse } from './dto/auth.response';
import { plainToInstance } from 'class-transformer';

export class AuthController extends BaseController {
  constructor({ api, dbConnection, path }: TControllerParams) {
    const authService = new AuthService(dbConnection);
    super(api, dbConnection);
    api.post(`${path}/login`, async (req: Request, res: Response) => {
      const authDto = await validateOrRejectRequest(
        req,
        res,
        AuthDto,
      );
      if (!authDto) return;

      const token = await authService.login(authDto);
      const tokenResponse = plainToInstance(AuthResponse, token, {
        excludeExtraneousValues: true,
      });

      res.status(201).send(tokenResponse);
    });
  }
}
