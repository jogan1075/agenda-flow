import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ServiceItemDocument = HydratedDocument<ServiceItem>;

@Schema({ timestamps: true })
export class ServiceItem {
  @Prop({ required: true })
  businessId: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  category?: string;

  @Prop({ required: true, min: 1 })
  durationMinutes: number;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const ServiceItemSchema = SchemaFactory.createForClass(ServiceItem);
ServiceItemSchema.index({ businessId: 1, name: 1 });
