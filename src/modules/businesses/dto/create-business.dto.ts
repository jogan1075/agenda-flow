import { IsArray, IsBoolean, IsDateString, IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BILLING_PLANS, BILLING_STATUSES } from './update-business-subscription.dto';

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
  @IsOptional()
  @IsEmail()
  ownerEmail?: string;

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
  @IsString()
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

  @IsOptional()
  @IsIn(BILLING_PLANS)
  billingPlan?: (typeof BILLING_PLANS)[number];

  @IsOptional()
  @IsIn(BILLING_STATUSES)
  billingStatus?: (typeof BILLING_STATUSES)[number];

  @IsOptional()
  @IsDateString()
  trialEndsAt?: string;

  @IsOptional()
  @IsDateString()
  subscriptionStartsAt?: string;

  @IsOptional()
  @IsDateString()
  subscriptionEndsAt?: string;

  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;
}
