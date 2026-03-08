import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CustomerDocument = HydratedDocument<Customer>;

@Schema({ timestamps: true })
export class Customer {
  @Prop({ required: true })
  businessId: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  email?: string;

  @Prop()
  notes?: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
CustomerSchema.index(
  { businessId: 1, phone: 1 },
  { unique: true, partialFilterExpression: { isActive: true } },
);
CustomerSchema.index({ businessId: 1, fullName: 1 });
