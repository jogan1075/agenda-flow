import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  businessId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsNumber()
  @IsPositive()
  durationMinutes: number;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
