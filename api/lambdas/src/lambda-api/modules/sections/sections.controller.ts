import { API, Request, Response } from 'lambda-api';
import { BaseController } from '../baseController';
import { Section } from '../../entities/section.entity';
import { TControllerParams } from '../controllerParams.type';

export class SectionsController extends BaseController {
  constructor({ api, dbConnection, path }: TControllerParams) {
    api.post(`${path}`, async (req: Request, res: Response) => {
      const { name, status } = req.body;
      const section = new Section();
      Object.assign(section, { name, status });
      const result = await dbConnection.entityManager.create(section);
      res.status(201).send(result);
    });

    api.get(`${path}`, async (req: Request, res: Response) => {
      const result = await dbConnection.entityManager.find(Section, {});
      res.status(200).send(result);
    });

    super(api, dbConnection);
  }
}
