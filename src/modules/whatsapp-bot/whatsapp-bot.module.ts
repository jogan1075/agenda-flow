import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Appointment, AppointmentSchema } from '../appointments/appointment.schema';
import { Business, BusinessSchema } from '../businesses/business.schema';
import { Customer, CustomerSchema } from '../customers/customer.schema';
import { Reminder, ReminderSchema } from '../reminders/reminder.schema';
import { WhatsAppService } from '../reminders/whatsapp.service';
import { Professional, ProfessionalSchema } from '../professionals/professional.schema';
import { ServiceItem, ServiceItemSchema } from '../services/service.schema';
import { AiAssistantService } from './ai-assistant.service';
import { WhatsAppBotController } from './whatsapp-bot.controller';
import { WhatsAppBotService } from './whatsapp-bot.service';
import { WhatsAppSession, WhatsAppSessionSchema } from './whatsapp-session.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WhatsAppSession.name, schema: WhatsAppSessionSchema },
      { name: Business.name, schema: BusinessSchema },
      { name: Customer.name, schema: CustomerSchema },
      { name: ServiceItem.name, schema: ServiceItemSchema },
      { name: Professional.name, schema: ProfessionalSchema },
      { name: Appointment.name, schema: AppointmentSchema },
      { name: Reminder.name, schema: ReminderSchema },
    ]),
  ],
  controllers: [WhatsAppBotController],
  providers: [WhatsAppBotService, WhatsAppService, AiAssistantService],
})
export class WhatsAppBotModule {}
