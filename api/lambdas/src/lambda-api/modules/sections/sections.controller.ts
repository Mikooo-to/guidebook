import { API, Request, Response } from 'lambda-api';
import { BaseController } from '../baseController';
import { Section } from '../../entities/section.entity';
import { TControllerParams } from '../controllerParams.type';
import { validateOrRejectRequest } from '../../shared/validation-tools';
import { CreateSectionDto } from './dto/section.dto';
import { SectionsService } from './section.service';

export class SectionsController extends BaseController {
  constructor({ api, dbConnection, path }: TControllerParams) {
    const sectionsService = new SectionsService(dbConnection);
    api.post(`${path}`, async (req: Request, res: Response) => {
      const sectionDto = await validateOrRejectRequest(
        req,
        res,
        CreateSectionDto,
      );
      if (!sectionDto) return;

      const section = await sectionsService.create(sectionDto);

      res.status(201).send(section);
    });

    api.get(`${path}`, async (req: Request, res: Response) => {
      const result = await sectionsService.findAll();
      res.status(200).send(result);
    });

    super(api, dbConnection);
  }
}
