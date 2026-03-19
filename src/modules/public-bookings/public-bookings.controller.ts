import { Body, Controller, Get, Headers, Param, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreatePublicBookingDto } from './dto/create-public-booking.dto';
import { PublicBookingsService } from './public-bookings.service';

@ApiTags('PublicBookings')
@Controller('public-bookings')
export class PublicBookingsController {
  constructor(private readonly publicBookingsService: PublicBookingsService) {}

  @Get('businesses')
  @ApiOkResponse({ description: 'Lista negocios habilitados' })
  listBusinesses() {
    return this.publicBookingsService.listBusinesses();
  }

  @Get('businesses/:id/branches')
  @ApiParam({ name: 'id', description: 'Business ID' })
  @ApiOkResponse({ description: 'Sucursales del negocio' })
  listBranches(@Param('id') id: string) {
    return this.publicBookingsService.listBranches(id);
  }

  @Get('businesses/:id/services')
  @ApiParam({ name: 'id', description: 'Business ID' })
  @ApiOkResponse({ description: 'Servicios del negocio' })
  listServices(@Param('id') id: string) {
    return this.publicBookingsService.listServicesByBusiness(id);
  }

  @Get('businesses/:id/professionals')
  @ApiParam({ name: 'id', description: 'Business ID' })
  @ApiQuery({ name: 'serviceId', required: false })
  @ApiOkResponse({ description: 'Profesionales del negocio' })
  listProfessionals(@Param('id') id: string, @Query('serviceId') serviceId?: string) {
    return this.publicBookingsService.listProfessionalsByBusiness(id, serviceId);
  }

  @Get('availability')
  @ApiQuery({ name: 'businessId', required: true })
  @ApiQuery({ name: 'professionalId', required: true })
  @ApiQuery({ name: 'serviceId', required: true })
  @ApiQuery({ name: 'limit', required: false })
  @ApiOkResponse({ description: 'Horarios disponibles para el profesional y servicio' })
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
  @ApiBody({ type: CreatePublicBookingDto })
  @ApiOkResponse({ description: 'Reserva creada' })
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
