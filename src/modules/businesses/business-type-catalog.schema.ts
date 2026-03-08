import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BusinessTypeCatalogDocument = HydratedDocument<BusinessTypeCatalog>;

@Schema({ timestamps: true })
export class BusinessTypeCatalog {
  @Prop({ required: true, unique: true, uppercase: true })
  key: string;

  @Prop({ required: true })
  label: string;

  @Prop({ type: [String], default: [] })
  subcategories: string[];

  @Prop({ default: true })
  isActive: boolean;
}

export const BusinessTypeCatalogSchema = SchemaFactory.createForClass(BusinessTypeCatalog);
BusinessTypeCatalogSchema.index({ key: 1 }, { unique: true });
