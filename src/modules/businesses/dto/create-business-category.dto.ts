import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBusinessCategoryDto {
  @IsOptional()
  @IsString()
  key?: string;

  @IsString()
  @IsNotEmpty()
  label: string;
}
