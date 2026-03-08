import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Appointment, AppointmentSchema } from '../appointments/appointment.schema';
import { Business, BusinessSchema } from '../businesses/business.schema';
import { Customer, CustomerSchema } from '../customers/customer.schema';
import { Professional, ProfessionalSchema } from '../professionals/professional.schema';
import { RemindersModule } from '../reminders/reminders.module';
import { ServiceItem, ServiceItemSchema } from '../services/service.schema';
import { EmailService } from './email.service';
import { PublicBookingsController } from './public-bookings.controller';
import { PublicBookingsService } from './public-bookings.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
      { name: Customer.name, schema: CustomerSchema },
      { name: Business.name, schema: BusinessSchema },
      { name: ServiceItem.name, schema: ServiceItemSchema },
      { name: Professional.name, schema: ProfessionalSchema },
    ]),
    RemindersModule,
  ],
  controllers: [PublicBookingsController],
  providers: [PublicBookingsService, EmailService],
})
export class PublicBookingsModule {}
