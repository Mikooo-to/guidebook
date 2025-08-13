import { TArticle } from '../types/Article';
import { BaseService } from './baseService';

export class ArticlesService extends BaseService<TArticle> {
  get = async () => {
    const response = await fetch(`${this.apiUrl}/articles`, {
      ...this.init,
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const res = await response.json();
    if (!res.items) {
      console.error('[res]', res);
      throw new Error('No items in response');
    }
    return res.items as TArticle[];
  };

  post = async (data: TArticle) => {
    const response = await fetch(`${this.apiUrl}/articles`, {
      ...this.init,
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.status !== 201) {
      throw new Error(`Response status is bad (not 201): ${response.status}`);
    }
  };

  prepare(data: Partial<TArticle>): TArticle {
    const defaultArticleData: TArticle = {
      sectionId: 'defaultSectionId',
      content: 'no content',
      name: 'no name',
      status: 'ready',
    };
    return {
      ...defaultArticleData,
      ...data,
    };
  }
}
