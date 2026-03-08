import { IsBoolean, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BUSINESS_CATEGORIES } from '../business-types';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class BranchDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

class OpeningHourDto {
  @IsIn(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

  @IsOptional()
  @IsBoolean()
  isOpen?: boolean;

  @IsOptional()
  @IsString()
  opensAt?: string;

  @IsOptional()
  @IsString()
  closesAt?: string;
}

export class CreateBusinessDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsIn(BUSINESS_CATEGORIES)
  businessCategory?: string;

  @IsOptional()
  @IsString()
  businessSubcategory?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BranchDto)
  branches?: BranchDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OpeningHourDto)
  openingHours?: OpeningHourDto[];

  @IsOptional()
  @IsString()
  whatsappWelcomeMessage?: string;

  @IsOptional()
  @IsString()
  whatsappReminderTemplate?: string;

  @IsOptional()
  @IsString()
  whatsappLocationText?: string;

  @IsOptional()
  @IsString()
  whatsappLocationUrl?: string;

  @IsOptional()
  @IsBoolean()
  whatsappAiEnabled?: boolean;
}
