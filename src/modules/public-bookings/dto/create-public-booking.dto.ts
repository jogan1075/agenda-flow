import { IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePublicBookingDto {
  @IsString()
  @IsNotEmpty()
  businessId: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  @IsNotEmpty()
  professionalId: string;

  @IsString()
  @IsNotEmpty()
  serviceId: string;

  @IsDateString()
  startsAt: string;

  @IsDateString()
  endsAt: string;
}
