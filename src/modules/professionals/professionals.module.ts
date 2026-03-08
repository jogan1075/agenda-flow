import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Professional, ProfessionalSchema } from './professional.schema';
import { ProfessionalsController } from './professionals.controller';
import { ProfessionalsService } from './professionals.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Professional.name, schema: ProfessionalSchema }])],
  controllers: [ProfessionalsController],
  providers: [ProfessionalsService],
  exports: [ProfessionalsService],
})
export class ProfessionalsModule {}
