import { Expose } from 'class-transformer';
import { IsString, MinLength } from 'class-validator';
import { Section } from '../../../entities/section.entity';

export class CreateSectionDto implements Partial<Section> {
  @Expose()
  @IsString()
  @MinLength(1)
  name: string;

  @Expose()
  @IsString()
  @MinLength(1)
  status: string;
}
