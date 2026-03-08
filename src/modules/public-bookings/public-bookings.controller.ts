import { Body, Controller, Post } from '@nestjs/common';
import { CreatePublicBookingDto } from './dto/create-public-booking.dto';
import { PublicBookingsService } from './public-bookings.service';

@Controller('public-bookings')
export class PublicBookingsController {
  constructor(private readonly publicBookingsService: PublicBookingsService) {}

  @Post('reserve')
  reserve(@Body() dto: CreatePublicBookingDto) {
    return this.publicBookingsService.reserve(dto);
  }
}
