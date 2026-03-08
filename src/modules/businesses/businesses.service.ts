import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DEFAULT_BUSINESS_TYPE_CATALOG } from './business-types';
import { BusinessTypeCatalog, BusinessTypeCatalogDocument } from './business-type-catalog.schema';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { AddBusinessSubcategoryDto } from './dto/add-business-subcategory.dto';
import { CreateBusinessCategoryDto } from './dto/create-business-category.dto';
import { UpdateBusinessCategoryDto } from './dto/update-business-category.dto';
import {
  BILLING_PLANS,
  BILLING_STATUSES,
  UpdateBusinessSubscriptionDto,
} from './dto/update-business-subscription.dto';
import { Business, BusinessDocument } from './business.schema';
import { User, UserDocument } from '../users/user.schema';

@Injectable()
export class BusinessesService implements OnModuleInit {
  constructor(
    @InjectModel(Business.name)
    private readonly businessModel: Model<BusinessDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(BusinessTypeCatalog.name)
    private readonly businessTypeCatalogModel: Model<BusinessTypeCatalogDocument>,
  ) {}

  async onModuleInit() {
    await this.ensureCatalogSeed();
  }

  async create(dto: CreateBusinessDto) {
    const { ownerEmail, ...businessDto } = dto;
    const normalized = await this.normalizeBusinessType(dto.businessCategory, dto.businessSubcategory);
    const billingPlan = dto.billingPlan ?? 'trial';
    const billingStatus = dto.billingStatus ?? (billingPlan === 'trial' ? 'trialing' : 'active');

    const business = await this.businessModel.create({
      ...businessDto,
      email: dto.email.toLowerCase(),
      ...normalized,
      branches: dto.branches ?? [],
      openingHours: dto.openingHours ?? this.defaultOpeningHours(),
      billingPlan,
      billingStatus,
      trialEndsAt: dto.trialEndsAt ? new Date(dto.trialEndsAt) : billingPlan === 'trial' ? this.defaultTrialEndsAt() : undefined,
      subscriptionStartsAt: dto.subscriptionStartsAt ? new Date(dto.subscriptionStartsAt) : undefined,
      subscriptionEndsAt: dto.subscriptionEndsAt ? new Date(dto.subscriptionEndsAt) : undefined,
      isEnabled: dto.isEnabled ?? true,
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

  async findAllForSuperAdmin() {
    return this.businessModel
      .find({}, {
        name: 1,
        email: 1,
        phone: 1,
        businessCategory: 1,
        businessSubcategory: 1,
        billingPlan: 1,
        billingStatus: 1,
        trialEndsAt: 1,
        subscriptionStartsAt: 1,
        subscriptionEndsAt: 1,
        isEnabled: 1,
        createdAt: 1,
      })
      .sort({ createdAt: -1 })
      .lean();
  }

  async update(id: string, dto: UpdateBusinessDto) {
    const normalized = await this.normalizeBusinessType(dto.businessCategory, dto.businessSubcategory);

    const business = await this.businessModel.findByIdAndUpdate(
      id,
      {
        ...dto,
        ...(dto.email ? { email: dto.email.toLowerCase() } : {}),
        ...normalized,
        ...(dto.openingHours ? { openingHours: dto.openingHours } : {}),
        ...(dto.branches ? { branches: dto.branches } : {}),
        ...(dto.trialEndsAt !== undefined ? { trialEndsAt: dto.trialEndsAt ? new Date(dto.trialEndsAt) : undefined } : {}),
        ...(dto.subscriptionStartsAt !== undefined
          ? { subscriptionStartsAt: dto.subscriptionStartsAt ? new Date(dto.subscriptionStartsAt) : undefined }
          : {}),
        ...(dto.subscriptionEndsAt !== undefined
          ? { subscriptionEndsAt: dto.subscriptionEndsAt ? new Date(dto.subscriptionEndsAt) : undefined }
          : {}),
      },
      { new: true },
    );

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    return business;
  }

  async updateSubscriptionBySuperAdmin(id: string, dto: UpdateBusinessSubscriptionDto) {
    const patch: Record<string, unknown> = {};

    if (dto.billingPlan) {
      patch.billingPlan = dto.billingPlan;
    }
    if (dto.billingStatus) {
      patch.billingStatus = dto.billingStatus;
    }
    if (dto.isEnabled !== undefined) {
      patch.isEnabled = dto.isEnabled;
    }
    if (dto.trialEndsAt !== undefined) {
      patch.trialEndsAt = dto.trialEndsAt ? new Date(dto.trialEndsAt) : undefined;
    }
    if (dto.subscriptionStartsAt !== undefined) {
      patch.subscriptionStartsAt = dto.subscriptionStartsAt ? new Date(dto.subscriptionStartsAt) : undefined;
    }
    if (dto.subscriptionEndsAt !== undefined) {
      patch.subscriptionEndsAt = dto.subscriptionEndsAt ? new Date(dto.subscriptionEndsAt) : undefined;
    }

    if (Object.keys(patch).length === 0) {
      throw new BadRequestException('No changes received');
    }

    const updated = await this.businessModel.findByIdAndUpdate(id, patch, { new: true });
    if (!updated) {
      throw new NotFoundException('Business not found');
    }

    return updated;
  }

  async getBusinessTypeCatalog() {
    await this.ensureCatalogSeed();

    const categories = await this.businessTypeCatalogModel.find({ isActive: true }).sort({ label: 1 }).lean();
    const result: Record<string, string[]> = {};

    for (const category of categories) {
      result[category.key] = category.subcategories ?? [];
    }

    return result;
  }

  async getBusinessTypeCatalogForSuperAdmin() {
    await this.ensureCatalogSeed();

    return this.businessTypeCatalogModel.find().sort({ label: 1 }).lean();
  }

  async createBusinessCategory(dto: CreateBusinessCategoryDto) {
    await this.ensureCatalogSeed();

    const key = this.normalizeCategoryKey(dto.key || dto.label);

    const existing = await this.businessTypeCatalogModel.findOne({ key });
    if (existing) {
      throw new BadRequestException('Category key already exists');
    }

    return this.businessTypeCatalogModel.create({
      key,
      label: dto.label.trim(),
      subcategories: [],
      isActive: true,
    });
  }

  async addBusinessSubcategory(categoryKey: string, dto: AddBusinessSubcategoryDto) {
    const key = this.normalizeCategoryKey(categoryKey);
    const name = dto.name.trim();

    if (!name) {
      throw new BadRequestException('Subcategory is required');
    }

    const category = await this.businessTypeCatalogModel.findOne({ key });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const exists = category.subcategories.some((item) => item.toLowerCase() === name.toLowerCase());
    if (!exists) {
      category.subcategories = [...category.subcategories, name];
      await category.save();
    }

    return category;
  }

  async updateBusinessCategory(categoryKey: string, dto: UpdateBusinessCategoryDto) {
    const key = this.normalizeCategoryKey(categoryKey);

    const patch: Record<string, unknown> = {};
    if (dto.label !== undefined) {
      patch.label = dto.label.trim();
    }
    if (dto.isActive !== undefined) {
      patch.isActive = dto.isActive;
    }
    if (dto.subcategories !== undefined) {
      patch.subcategories = Array.from(
        new Set(
          dto.subcategories
            .map((item) => item.trim())
            .filter((item) => item.length > 0),
        ),
      );
    }

    if (Object.keys(patch).length === 0) {
      throw new BadRequestException('No changes received');
    }

    const updated = await this.businessTypeCatalogModel.findOneAndUpdate({ key }, patch, { new: true });
    if (!updated) {
      throw new NotFoundException('Category not found');
    }

    return updated;
  }

  private async normalizeBusinessType(category?: string, subcategory?: string) {
    if (!category) {
      if (subcategory !== undefined) {
        return {
          businessSubcategory: undefined,
        };
      }
      return {};
    }

    const normalizedCategory = this.normalizeCategoryKey(category);
    const catalog = await this.businessTypeCatalogModel.findOne({ key: normalizedCategory, isActive: true }).lean();
    if (!catalog) {
      return {
        businessCategory: undefined,
        businessSubcategory: undefined,
      };
    }

    const normalizedSubcategory = (catalog.subcategories ?? []).includes(subcategory ?? '') ? subcategory : undefined;

    return {
      businessCategory: normalizedCategory,
      businessSubcategory: normalizedSubcategory,
    };
  }

  private async ensureCatalogSeed() {
    const count = await this.businessTypeCatalogModel.estimatedDocumentCount();
    if (count > 0) {
      return;
    }

    await this.businessTypeCatalogModel.insertMany(
      DEFAULT_BUSINESS_TYPE_CATALOG.map((item) => ({
        key: item.key,
        label: item.label,
        subcategories: item.subcategories,
        isActive: true,
      })),
    );
  }

  private normalizeCategoryKey(input: string) {
    return input
      .trim()
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
  }

  private defaultTrialEndsAt() {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date;
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

export { BILLING_PLANS, BILLING_STATUSES };
