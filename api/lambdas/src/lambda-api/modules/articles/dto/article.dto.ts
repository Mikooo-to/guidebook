import { Expose } from 'class-transformer';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { Article } from '../../../entities/article.entity';

export class CreateArticleDto implements Partial<Article> {
  @Expose()
  @IsString()
  @MinLength(1)
  name: string;

  @Expose()
  @IsString()
  @MinLength(1)
  sectionId: string;

  @Expose()
  @IsString()
  @MinLength(1)
  content: string;

  @Expose()
  @IsString()
  @MinLength(1)
  status: string;

  @Expose()
  @IsOptional()
  @IsString()
  userId?: string;
}
