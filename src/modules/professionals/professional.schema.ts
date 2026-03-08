import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProfessionalDocument = HydratedDocument<Professional>;

export class WeeklyScheduleItem {
  @Prop({ required: true, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] })
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

  @Prop({ required: true })
  startTime: string;

  @Prop({ required: true })
  endTime: string;
}

@Schema({ timestamps: true })
export class Professional {
  @Prop({ required: true })
  businessId: string;

  @Prop({ required: true })
  fullName: string;

  @Prop()
  email?: string;

  @Prop()
  phone?: string;

  @Prop()
  photoUrl?: string;

  @Prop({ min: 0, max: 100, default: 0 })
  commissionPercent: number;

  @Prop({ type: [String], default: [] })
  serviceIds: string[];

  @Prop({ type: [WeeklyScheduleItem], default: [] })
  weeklySchedule: WeeklyScheduleItem[];

  @Prop({ default: true })
  isActive: boolean;
}

export const ProfessionalSchema = SchemaFactory.createForClass(Professional);
ProfessionalSchema.index({ businessId: 1, fullName: 1 });
