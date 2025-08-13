import { Section } from '../../entities/section.entity';
import { TListResponce } from '../articles/articles.service';
import { BaseService } from '../baseService';
import { CreateSectionDto } from './dto/section.dto';

export class SectionsService extends BaseService {
  async create(sectionDto: CreateSectionDto): Promise<Section> {
    const section = Object.assign(new Section(), sectionDto);
    const result = await this.dbConnection.entityManager.create<Section>(
      section,
    );
    return result;
  }

  async findAll(): Promise<TListResponce<Section>> {
    const res = await this.dbConnection.entityManager.find<Section>(
      Section,
      {},
    );
    return res;
  }
}
