import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceItem, ServiceItemDocument } from './service.schema';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(ServiceItem.name)
    private readonly serviceItemModel: Model<ServiceItemDocument>,
  ) {}

  create(dto: CreateServiceDto) {
    return this.serviceItemModel.create(dto);
  }

  listByBusiness(businessId: string) {
    return this.serviceItemModel.find({ businessId, isActive: true }).sort({ createdAt: -1 });
  }

  async update(id: string, dto: UpdateServiceDto) {
    const updated = await this.serviceItemModel.findByIdAndUpdate(id, dto, { new: true });
    if (!updated) {
      throw new NotFoundException('Service not found');
    }
    return updated;
  }

  async remove(id: string) {
    const removed = await this.serviceItemModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!removed) {
      throw new NotFoundException('Service not found');
    }
    return removed;
  }
}
