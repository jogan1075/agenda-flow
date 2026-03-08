import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AppointmentDocument = HydratedDocument<Appointment>;

@Schema({ timestamps: true })
export class Appointment {
  @Prop({ required: true })
  businessId: string;

  @Prop({ required: true })
  customerId: string;

  @Prop({ required: true })
  professionalId: string;

  @Prop({ required: true })
  serviceId: string;

  @Prop({ required: true, enum: ['manual', 'web', 'whatsapp'] })
  source: 'manual' | 'web' | 'whatsapp';

  @Prop({ required: true, enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no_show'] })
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';

  @Prop({ required: true })
  startsAt: Date;

  @Prop({ required: true })
  endsAt: Date;

  @Prop()
  notes?: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
AppointmentSchema.index({ businessId: 1, startsAt: 1 });
AppointmentSchema.index({ professionalId: 1, startsAt: 1, endsAt: 1 });
AppointmentSchema.index({ customerId: 1, startsAt: -1 });
