import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer, CustomerDocument } from './customer.schema';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name)
    private readonly customerModel: Model<CustomerDocument>,
  ) {}

  async create(dto: CreateCustomerDto) {
    const normalizedPhone = this.normalizePhone(dto.phone);
    const existing = await this.customerModel.findOne({
      businessId: dto.businessId,
      phone: normalizedPhone,
    });

    // Si ya existe activo con el mismo telefono, actuamos como upsert y actualizamos datos.
    if (existing?.isActive) {
      const updatedExisting = await this.customerModel.findByIdAndUpdate(
        existing.id,
        {
          fullName: dto.fullName,
          phone: normalizedPhone,
          email: dto.email,
          notes: dto.notes,
          isActive: true,
        },
        { new: true },
      );

      if (!updatedExisting) {
        throw new NotFoundException('Customer not found');
      }

      return updatedExisting;
    }

    // Si existe inactivo con el mismo telefono, lo reactivamos en vez de crear uno nuevo.
    if (existing) {
      const reactivated = await this.customerModel.findByIdAndUpdate(
        existing.id,
        {
          fullName: dto.fullName,
          phone: normalizedPhone,
          email: dto.email,
          notes: dto.notes,
          isActive: true,
        },
        { new: true },
      );

      if (!reactivated) {
        throw new NotFoundException('Customer not found');
      }

      return reactivated;
    }

    try {
      return await this.customerModel.create({
        ...dto,
        phone: normalizedPhone,
        isActive: true,
      });
    } catch (error) {
      this.handleDuplicatePhoneError(error);
      throw error;
    }
  }

  listByBusiness(businessId: string, search?: string) {
    const query: Record<string, unknown> = {
      businessId,
      isActive: { $ne: false },
    };

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    return this.customerModel.find(query).sort({ fullName: 1 });
  }

  async update(id: string, dto: UpdateCustomerDto) {
    const { businessId: _ignoredBusinessId, phone, ...rest } = dto;
    const existingCustomer = await this.customerModel.findById(id);
    if (!existingCustomer) {
      throw new NotFoundException('Customer not found');
    }

    const targetPhone = phone ? this.normalizePhone(phone) : existingCustomer.phone;
    const duplicateActive = await this.customerModel.findOne({
      _id: { $ne: id },
      businessId: existingCustomer.businessId,
      phone: targetPhone,
      isActive: true,
    });

    if (duplicateActive) {
      throw new ConflictException('Ya existe un cliente activo con ese telefono en este negocio.');
    }

    try {
      const updated = await this.customerModel.findByIdAndUpdate(
        id,
        {
          ...rest,
          ...(phone ? { phone: targetPhone } : {}),
        },
        { new: true },
      );

      if (!updated) {
        throw new NotFoundException('Customer not found');
      }
      return updated;
    } catch (error) {
      this.handleDuplicatePhoneError(error);
      throw error;
    }
  }

  async remove(id: string) {
    const removed = await this.customerModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!removed) {
      throw new NotFoundException('Customer not found');
    }
    return removed;
  }

  private normalizePhone(phone: string) {
    const cleaned = phone.replace(/[^\d+]/g, '');
    if (!cleaned) return phone;
    return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
  }

  private handleDuplicatePhoneError(error: unknown) {
    const code = (error as { code?: number })?.code;
    if (code === 11000) {
      throw new ConflictException('Ya existe un cliente activo con ese telefono en este negocio.');
    }
  }
}
