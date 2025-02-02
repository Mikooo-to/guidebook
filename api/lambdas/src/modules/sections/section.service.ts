import { Section } from '../../entities/section.entity';
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

  async findAll(): Promise<Section[]> {
    const { items } = await this.dbConnection.entityManager.find<Section>(
      Section,
      {},
    );
    return items;
  }
}
