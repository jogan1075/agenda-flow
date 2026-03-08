import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { Professional, ProfessionalDocument } from './professional.schema';

@Injectable()
export class ProfessionalsService {
  constructor(
    @InjectModel(Professional.name)
    private readonly professionalModel: Model<ProfessionalDocument>,
  ) {}

  create(dto: CreateProfessionalDto) {
    return this.professionalModel.create(dto);
  }

  listByBusiness(businessId: string) {
    return this.professionalModel.find({ businessId, isActive: true }).sort({ fullName: 1 });
  }

  async update(id: string, dto: UpdateProfessionalDto) {
    const updated = await this.professionalModel.findByIdAndUpdate(id, dto, { new: true });
    if (!updated) {
      throw new NotFoundException('Professional not found');
    }
    return updated;
  }

  async remove(id: string) {
    const removed = await this.professionalModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!removed) {
      throw new NotFoundException('Professional not found');
    }
    return removed;
  }
}
