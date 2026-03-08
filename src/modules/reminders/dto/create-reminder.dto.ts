import { IsDateString, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateReminderDto {
  @IsString()
  @IsNotEmpty()
  appointmentId: string;

  @IsIn(['email', 'whatsapp'])
  channel: 'email' | 'whatsapp';

  @IsDateString()
  scheduledFor: string;

  @IsOptional()
  @IsIn(['pending', 'processing', 'sent', 'failed'])
  status?: 'pending' | 'processing' | 'sent' | 'failed';

  @IsOptional()
  @IsString()
  providerMessageId?: string;
}
