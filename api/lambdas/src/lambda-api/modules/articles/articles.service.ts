import { DocumentClientTypes } from '@typedorm/document-client';
import { Article } from '../../entities/article.entity';
import { BaseService } from '../baseService';
import { CreateArticleDto } from './dto/article.dto';

export type TListResponce<T> = {
  items: Array<T>;
  cursor?: DocumentClientTypes.Key | undefined;
};

export class ArticlesService extends BaseService {
  async create(articleDto: CreateArticleDto): Promise<Article> {
    const article = Object.assign(new Article(), articleDto);
    const result = await this.dbConnection.entityManager.create<Article>(
      article,
    );
    return result;
  }

  async findAll(): Promise<TListResponce<Article>> {
    const res = await this.dbConnection.entityManager.find<Article>(
      Article,
      {},
    );
    return res;
  }
}
