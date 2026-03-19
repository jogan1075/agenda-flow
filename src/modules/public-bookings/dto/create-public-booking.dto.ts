import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePublicBookingDto {
  @ApiProperty({ example: '64f2b3c1e4b0a1d2c3e4f5a6' })
  @IsString()
  @IsNotEmpty()
  businessId: string;

  @ApiProperty({ example: 'Camila Soto' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: '+56912345678' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({ example: 'camila@email.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '64f2b3c1e4b0a1d2c3e4f5a6' })
  @IsString()
  @IsNotEmpty()
  professionalId: string;

  @ApiProperty({ example: '64f2b3c1e4b0a1d2c3e4f5a6' })
  @IsString()
  @IsNotEmpty()
  serviceId: string;

  @ApiProperty({ example: '2026-03-18T12:00:00.000Z' })
  @IsDateString()
  startsAt: string;

  @ApiProperty({ example: '2026-03-18T13:00:00.000Z' })
  @IsDateString()
  endsAt: string;
}
