import { Request, Response } from 'lambda-api';
import { BaseController } from '../baseController';
import { TControllerParams } from '../controllerParams.type';
import { ArticlesService } from './articles.service';
import { instanceToPlain } from 'class-transformer';
import { CreateArticleDto } from './dto/article.dto';
import { validateOrRejectRequest } from '../../shared/validation-tools';

export class ArticlesController extends BaseController {
  constructor({ api, dbConnection, path }: TControllerParams) {
    const articlesService = new ArticlesService(dbConnection);

    api.post(`${path}`, async (req: Request, res: Response) => {
      this.checkTokenAuth(req, res);
      const articleDto = await validateOrRejectRequest<CreateArticleDto>(
        req,
        res,
        CreateArticleDto,
      );
      if (!articleDto) return;

      const article = await articlesService.create(articleDto);

      res.status(201).send(instanceToPlain(article));
    });

    api.get(`${path}`, async (req: Request, res: Response) => {
      try {
        const articles = await articlesService.findAll();
        res.status(200).send(articles);
      } catch (error: any) {
        console.log(error);
        res.status(500).json({
          message: 'Internal server error',
          errors: error,
        });
      }
    });

    super(api, dbConnection);
  }
}
