import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type WhatsAppSessionDocument = HydratedDocument<WhatsAppSession>;

@Schema({ timestamps: true })
export class WhatsAppSession {
  @Prop({ required: true })
  businessId: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true, default: 'IDLE' })
  state: string;

  @Prop({ type: Object, default: {} })
  context: Record<string, unknown>;

  @Prop({ default: '' })
  lastUserMessage: string;
}

export const WhatsAppSessionSchema = SchemaFactory.createForClass(WhatsAppSession);
WhatsAppSessionSchema.index({ businessId: 1, phone: 1 }, { unique: true });
