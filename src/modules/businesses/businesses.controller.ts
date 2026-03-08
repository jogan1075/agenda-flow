import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BusinessesService } from './businesses.service';
import { AddBusinessSubcategoryDto } from './dto/add-business-subcategory.dto';
import { CreateBusinessDto } from './dto/create-business.dto';
import { CreateBusinessCategoryDto } from './dto/create-business-category.dto';
import { UpdateBusinessCategoryDto } from './dto/update-business-category.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { UpdateBusinessSubscriptionDto } from './dto/update-business-subscription.dto';

@Controller('businesses')
export class BusinessesController {
  constructor(
    private readonly businessesService: BusinessesService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  create(@Body() dto: CreateBusinessDto) {
    return this.businessesService.create(dto);
  }

  @Get('catalog/types')
  getTypeCatalog() {
    return this.businessesService.getBusinessTypeCatalog();
  }

  @Get('admin/catalog')
  getTypeCatalogForSuperAdmin(@Headers('authorization') authorization: string | undefined) {
    this.assertSuperAdmin(authorization);
    return this.businessesService.getBusinessTypeCatalogForSuperAdmin();
  }

  @Post('admin/catalog/categories')
  createBusinessCategory(
    @Headers('authorization') authorization: string | undefined,
    @Body() dto: CreateBusinessCategoryDto,
  ) {
    this.assertSuperAdmin(authorization);
    return this.businessesService.createBusinessCategory(dto);
  }

  @Post('admin/catalog/categories/:categoryKey/subcategories')
  addBusinessSubcategory(
    @Headers('authorization') authorization: string | undefined,
    @Param('categoryKey') categoryKey: string,
    @Body() dto: AddBusinessSubcategoryDto,
  ) {
    this.assertSuperAdmin(authorization);
    return this.businessesService.addBusinessSubcategory(categoryKey, dto);
  }

  @Patch('admin/catalog/categories/:categoryKey')
  updateBusinessCategory(
    @Headers('authorization') authorization: string | undefined,
    @Param('categoryKey') categoryKey: string,
    @Body() dto: UpdateBusinessCategoryDto,
  ) {
    this.assertSuperAdmin(authorization);
    return this.businessesService.updateBusinessCategory(categoryKey, dto);
  }

  @Get('admin/list')
  listBusinessesForSuperAdmin(@Headers('authorization') authorization: string | undefined) {
    this.assertSuperAdmin(authorization);
    return this.businessesService.findAllForSuperAdmin();
  }

  @Patch('admin/:id/subscription')
  updateBusinessSubscription(
    @Headers('authorization') authorization: string | undefined,
    @Param('id') id: string,
    @Body() dto: UpdateBusinessSubscriptionDto,
  ) {
    this.assertSuperAdmin(authorization);
    return this.businessesService.updateSubscriptionBySuperAdmin(id, dto);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.businessesService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBusinessDto) {
    return this.businessesService.update(id, dto);
  }

  private assertSuperAdmin(authorizationHeader: string | undefined) {
    const token = authorizationHeader?.startsWith('Bearer ')
      ? authorizationHeader.replace('Bearer ', '').trim()
      : '';

    if (!token) {
      throw new UnauthorizedException('Missing bearer token');
    }

    try {
      const payload = this.jwtService.verify<{ role?: string }>(token);
      if (payload.role !== 'super_admin') {
        throw new UnauthorizedException('Only super admin can access this endpoint');
      }
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException('Invalid or expired token');
    }
  }
}
