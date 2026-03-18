import { Body, Controller, Get, Headers, Param, Post, Query } from '@nestjs/common';
import { CreatePublicBookingDto } from './dto/create-public-booking.dto';
import { PublicBookingsService } from './public-bookings.service';

@Controller('public-bookings')
export class PublicBookingsController {
  constructor(private readonly publicBookingsService: PublicBookingsService) {}

  @Get('businesses')
  listBusinesses() {
    return this.publicBookingsService.listBusinesses();
  }

  @Get('businesses/:id/branches')
  listBranches(@Param('id') id: string) {
    return this.publicBookingsService.listBranches(id);
  }

  @Get('businesses/:id/services')
  listServices(@Param('id') id: string) {
    return this.publicBookingsService.listServicesByBusiness(id);
  }

  @Get('businesses/:id/professionals')
  listProfessionals(@Param('id') id: string, @Query('serviceId') serviceId?: string) {
    return this.publicBookingsService.listProfessionalsByBusiness(id, serviceId);
  }

  @Get('availability')
  availability(
    @Query('businessId') businessId: string,
    @Query('professionalId') professionalId: string,
    @Query('serviceId') serviceId: string,
    @Query('limit') limit?: string,
  ) {
    return this.publicBookingsService.getAvailability({
      businessId,
      professionalId,
      serviceId,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Post('reserve')
  reserve(@Body() dto: CreatePublicBookingDto) {
    return this.publicBookingsService.reserve(dto);
  }

  @Post('mercadopago/webhook')
  handleMercadoPagoWebhook(
    @Query('businessId') businessId: string,
    @Body() payload: Record<string, unknown>,
    @Headers() headers: Record<string, string>,
  ) {
    return this.publicBookingsService.handleMercadoPagoWebhook(businessId, payload, headers);
  }

  @Get('summary/:id')
  getSummary(@Param('id') id: string) {
    return this.publicBookingsService.getSummaryByAppointmentId(id);
  }
}
