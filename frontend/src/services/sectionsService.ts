import { TSection } from '../types/Section';
import { BaseService } from './baseService';

export class SectionsService extends BaseService<TSection> {
  get = async () => {
    const response = await fetch(`${this.apiUrl}/sections`, {
      ...this.init,
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = (await response.json()).items as TSection[];
    return json;
  };

  post = async (data: TSection) => {
    const response = await fetch(`${this.apiUrl}/sections`, {
      ...this.init,
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.status !== 201) {
      throw new Error(`Response status is bad (not 201): ${response.status}`);
    }
  };

  prepare(data: Partial<TSection>): TSection {
    const defaultArticleData: TSection = {
      name: 'defaultSection',
      status: 'draft',
    };
    return {
      ...defaultArticleData,
      ...data,
    };
  }
}
