import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { Business, BusinessDocument } from './business.schema';
import { BUSINESS_TYPE_CATALOG, BusinessCategory } from './business-types';
import { User, UserDocument } from '../users/user.schema';

@Injectable()
export class BusinessesService {
  constructor(
    @InjectModel(Business.name)
    private readonly businessModel: Model<BusinessDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(dto: CreateBusinessDto) {
    const { ownerEmail, ...businessDto } = dto;
    const normalized = this.normalizeBusinessType(dto.businessCategory, dto.businessSubcategory);
    const business = await this.businessModel.create({
      ...businessDto,
      email: dto.email.toLowerCase(),
      ...normalized,
      branches: dto.branches ?? [],
      openingHours: dto.openingHours ?? this.defaultOpeningHours(),
    });

    if (ownerEmail) {
      await this.userModel.findOneAndUpdate(
        { email: ownerEmail.toLowerCase() },
        { businessId: business.id },
        { new: true },
      );
    }

    return business;
  }

  findById(id: string) {
    return this.businessModel.findById(id);
  }

  async update(id: string, dto: UpdateBusinessDto) {
    const normalized = this.normalizeBusinessType(dto.businessCategory, dto.businessSubcategory);

    const business = await this.businessModel.findByIdAndUpdate(
      id,
      {
        ...dto,
        ...(dto.email ? { email: dto.email.toLowerCase() } : {}),
        ...normalized,
        ...(dto.openingHours ? { openingHours: dto.openingHours } : {}),
        ...(dto.branches ? { branches: dto.branches } : {}),
      },
      { new: true },
    );

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    return business;
  }

  getBusinessTypeCatalog() {
    return BUSINESS_TYPE_CATALOG;
  }

  private normalizeBusinessType(category?: string, subcategory?: string) {
    if (!category) {
      if (subcategory !== undefined) {
        return {
          businessSubcategory: undefined,
        };
      }
      return {};
    }

    const allowedSubcategories = [
      ...(BUSINESS_TYPE_CATALOG[category as BusinessCategory] ?? []),
    ] as string[];
    const normalizedSubcategory = allowedSubcategories.includes(subcategory ?? '') ? subcategory : undefined;

    return {
      businessCategory: category,
      businessSubcategory: normalizedSubcategory,
    };
  }

  private defaultOpeningHours() {
    return [
      { day: 'monday', isOpen: true, opensAt: '09:00', closesAt: '19:00' },
      { day: 'tuesday', isOpen: true, opensAt: '09:00', closesAt: '19:00' },
      { day: 'wednesday', isOpen: true, opensAt: '09:00', closesAt: '19:00' },
      { day: 'thursday', isOpen: true, opensAt: '09:00', closesAt: '19:00' },
      { day: 'friday', isOpen: true, opensAt: '09:00', closesAt: '19:00' },
      { day: 'saturday', isOpen: false, opensAt: '09:00', closesAt: '14:00' },
      { day: 'sunday', isOpen: false, opensAt: '09:00', closesAt: '14:00' },
    ];
  }
}
