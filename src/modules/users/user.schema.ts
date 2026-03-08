import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  businessId: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true, enum: ['owner', 'admin', 'staff'], default: 'owner' })
  role: 'owner' | 'admin' | 'staff';
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ businessId: 1, email: 1 }, { unique: true });
