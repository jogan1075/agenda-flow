import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ReminderDocument = HydratedDocument<Reminder>;

@Schema({ timestamps: true })
export class Reminder {
  @Prop({ required: true })
  appointmentId: string;

  @Prop({ required: true, enum: ['email', 'whatsapp'] })
  channel: 'email' | 'whatsapp';

  @Prop({ required: true })
  scheduledFor: Date;

  @Prop({ required: true, enum: ['pending', 'processing', 'sent', 'failed'], default: 'pending' })
  status: 'pending' | 'processing' | 'sent' | 'failed';

  @Prop()
  providerMessageId?: string;

  @Prop({ default: 0 })
  attempts: number;

  @Prop()
  lastError?: string;
}

export const ReminderSchema = SchemaFactory.createForClass(Reminder);
ReminderSchema.index({ status: 1, scheduledFor: 1 });
