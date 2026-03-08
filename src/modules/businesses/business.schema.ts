import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BILLING_PLANS, BILLING_STATUSES } from './dto/update-business-subscription.dto';

export type BusinessDocument = HydratedDocument<Business>;

export class BusinessBranch {
  @Prop({ required: true })
  name: string;

  @Prop()
  address?: string;

  @Prop()
  phone?: string;

  @Prop({ default: true })
  isActive: boolean;
}

export class BusinessOpeningHour {
  @Prop({ required: true, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] })
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

  @Prop({ default: true })
  isOpen: boolean;

  @Prop()
  opensAt?: string;

  @Prop()
  closesAt?: string;
}

@Schema({ timestamps: true })
export class Business {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  phone?: string;

  @Prop()
  address?: string;

  @Prop({ default: 'America/Santiago' })
  timezone: string;

  @Prop({ default: 'CLP' })
  currency: string;

  @Prop({ type: String })
  businessCategory?: string;

  @Prop({ type: String })
  businessSubcategory?: string;

  @Prop({ type: [BusinessBranch], default: [] })
  branches: BusinessBranch[];

  @Prop({ type: [BusinessOpeningHour], default: [] })
  openingHours: BusinessOpeningHour[];

  @Prop()
  whatsappWelcomeMessage?: string;

  @Prop()
  whatsappReminderTemplate?: string;

  @Prop()
  whatsappLocationText?: string;

  @Prop()
  whatsappLocationUrl?: string;

  @Prop({ default: true })
  whatsappAiEnabled: boolean;

  @Prop({ type: String, enum: BILLING_PLANS, default: 'trial' })
  billingPlan: (typeof BILLING_PLANS)[number];

  @Prop({ type: String, enum: BILLING_STATUSES, default: 'trialing' })
  billingStatus: (typeof BILLING_STATUSES)[number];

  @Prop({ type: Date })
  trialEndsAt?: Date;

  @Prop({ type: Date })
  subscriptionStartsAt?: Date;

  @Prop({ type: Date })
  subscriptionEndsAt?: Date;

  @Prop({ default: true })
  isEnabled: boolean;
}

export const BusinessSchema = SchemaFactory.createForClass(Business);
