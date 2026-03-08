import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateBusinessCategoryDto {
  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subcategories?: string[];
}
