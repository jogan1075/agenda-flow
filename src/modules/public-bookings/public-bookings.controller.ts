import { Body, Controller, Get, Headers, Param, Post, Query } from '@nestjs/common';
import { CreatePublicBookingDto } from './dto/create-public-booking.dto';
import { PublicBookingsService } from './public-bookings.service';

@Controller('public-bookings')
export class PublicBookingsController {
  constructor(private readonly publicBookingsService: PublicBookingsService) {}

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
