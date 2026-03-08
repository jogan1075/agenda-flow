import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Appointment, AppointmentSchema } from '../appointments/appointment.schema';
import { Business, BusinessSchema } from '../businesses/business.schema';
import { Customer, CustomerSchema } from '../customers/customer.schema';
import { Reminder, ReminderSchema } from './reminder.schema';
import { RemindersController } from './reminders.controller';
import { RemindersScheduler } from './reminders.scheduler';
import { RemindersService } from './reminders.service';
import { WhatsAppService } from './whatsapp.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reminder.name, schema: ReminderSchema },
      { name: Appointment.name, schema: AppointmentSchema },
      { name: Customer.name, schema: CustomerSchema },
      { name: Business.name, schema: BusinessSchema },
    ]),
  ],
  controllers: [RemindersController],
  providers: [RemindersService, WhatsAppService, RemindersScheduler],
  exports: [WhatsAppService],
})
export class RemindersModule {}
