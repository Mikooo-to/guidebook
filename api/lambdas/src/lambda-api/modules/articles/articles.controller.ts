import { Request, Response } from 'lambda-api';
import { BaseController } from '../baseController';
import { TControllerParams } from '../controllerParams.type';
import { ArticlesService } from './articles.service';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { CreateArticleDto } from './dto/article.dto';
import { validateOrReject } from 'class-validator';

export class ArticlesController extends BaseController {
  constructor({ api, dbConnection, path }: TControllerParams) {
    const articlesService = new ArticlesService(dbConnection);

    api.post(`${path}`, async (req: Request, res: Response) => {
      try {
        const articleDto = plainToInstance(CreateArticleDto, req.body, {
          excludeExtraneousValues: true,
          strategy: 'excludeAll',
        });
        await validateOrReject(articleDto, {
          whitelist: true,
        });

        const article = await articlesService.create(articleDto);

        res.status(201).send(instanceToPlain(article));
      } catch (error) {
        res.status(400).json({
          message: 'Validation failed',
          errors: error,
        });
      }
    });

    api.get(`${path}`, async (req: Request, res: Response) => {
      const articles = await articlesService.findAll();
      res.status(200).send(articles);
    });

    super(api, dbConnection);
  }
}
