import { IsBoolean, IsDateString, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  @IsNotEmpty()
  businessId: string;

  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsString()
  @IsNotEmpty()
  professionalId: string;

  @IsString()
  @IsNotEmpty()
  serviceId: string;

  @IsIn(['manual', 'web', 'whatsapp'])
  source: 'manual' | 'web' | 'whatsapp';

  @IsIn(['pending', 'confirmed', 'cancelled', 'completed', 'no_show'])
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';

  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;

  @IsDateString()
  startsAt: string;

  @IsDateString()
  endsAt: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
