import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('basic')
  basic(
    @Query('businessId') businessId: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.reportsService.basicSummary(businessId, from, to);
  }
}
