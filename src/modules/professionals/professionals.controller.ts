import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { ProfessionalsService } from './professionals.service';

@Controller('professionals')
export class ProfessionalsController {
  constructor(private readonly professionalsService: ProfessionalsService) {}

  @Post()
  create(@Body() dto: CreateProfessionalDto) {
    return this.professionalsService.create(dto);
  }

  @Get()
  list(@Query('businessId') businessId: string) {
    return this.professionalsService.listByBusiness(businessId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProfessionalDto) {
    return this.professionalsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.professionalsService.remove(id);
  }
}
