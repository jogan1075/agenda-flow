import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Business, BusinessDocument } from '../businesses/business.schema';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { Professional, ProfessionalDocument } from './professional.schema';

@Injectable()
export class ProfessionalsService {
  constructor(
    @InjectModel(Professional.name)
    private readonly professionalModel: Model<ProfessionalDocument>,
    @InjectModel(Business.name)
    private readonly businessModel: Model<BusinessDocument>,
  ) {}

  async create(dto: CreateProfessionalDto) {
    const payload = await this.applyBusinessRules(dto.businessId, dto);
    return this.professionalModel.create(payload);
  }

  listByBusiness(businessId: string, serviceId?: string) {
    const query: Record<string, unknown> = { businessId, isActive: true };
    if (serviceId) {
      query.serviceIds = serviceId;
    }
    return this.professionalModel.find(query).sort({ fullName: 1 });
  }

  async update(id: string, dto: UpdateProfessionalDto) {
    const current = await this.professionalModel.findById(id);
    if (!current) {
      throw new NotFoundException('Professional not found');
    }

    const payload = await this.applyBusinessRules(current.businessId, dto);
    const updated = await this.professionalModel.findByIdAndUpdate(id, payload, { new: true });
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

  private async applyBusinessRules(
    businessId: string,
    dto: Partial<CreateProfessionalDto>,
  ): Promise<Partial<CreateProfessionalDto>> {
    const business = await this.businessModel.findById(businessId);
    const isBeauty = String(business?.businessCategory ?? '') === 'ESTETICA_Y_BELLEZA';

    if (!isBeauty) {
      return {
        ...dto,
        photoUrl: undefined,
        commissionPercent: 0,
      };
    }

    return dto;
  }
}
