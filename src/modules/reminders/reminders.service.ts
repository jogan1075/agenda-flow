import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appointment, AppointmentDocument } from '../appointments/appointment.schema';
import { Business, BusinessDocument } from '../businesses/business.schema';
import { Customer, CustomerDocument } from '../customers/customer.schema';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { Reminder, ReminderDocument } from './reminder.schema';
import { WhatsAppService } from './whatsapp.service';

@Injectable()
export class RemindersService {
  constructor(
    @InjectModel(Reminder.name)
    private readonly reminderModel: Model<ReminderDocument>,
    @InjectModel(Appointment.name)
    private readonly appointmentModel: Model<AppointmentDocument>,
    @InjectModel(Customer.name)
    private readonly customerModel: Model<CustomerDocument>,
    @InjectModel(Business.name)
    private readonly businessModel: Model<BusinessDocument>,
    private readonly whatsAppService: WhatsAppService,
  ) {}

  create(dto: CreateReminderDto) {
    return this.reminderModel.create({
      ...dto,
      scheduledFor: new Date(dto.scheduledFor),
      status: dto.status ?? 'pending',
      attempts: 0,
    });
  }

  listPending(until?: string) {
    const query: Record<string, unknown> = { status: 'pending' };
    if (until) {
      query.scheduledFor = { $lte: new Date(until) };
    }

    return this.reminderModel.find(query).sort({ scheduledFor: 1 });
  }

  async update(id: string, dto: UpdateReminderDto) {
    const payload: Record<string, unknown> = { ...dto };
    if (dto.scheduledFor) payload.scheduledFor = new Date(dto.scheduledFor);

    const updated = await this.reminderModel.findByIdAndUpdate(id, payload, { new: true });
    if (!updated) {
      throw new NotFoundException('Reminder not found');
    }
    return updated;
  }

  async processPendingWhatsAppReminders(limit = 50) {
    let processed = 0;
    let sent = 0;
    let failed = 0;

    for (let i = 0; i < limit; i += 1) {
      const reminder = await this.claimNextDueWhatsAppReminder();
      if (!reminder) {
        break;
      }

      processed += 1;

      try {
        const appointment = await this.appointmentModel.findById(reminder.appointmentId);
        if (!appointment) {
          throw new Error('Appointment not found');
        }

        const customer = await this.customerModel.findById(appointment.customerId);
        if (!customer) {
          throw new Error('Customer not found');
        }

        const business = await this.businessModel.findById(appointment.businessId);
        const message = this.buildReminderMessage({
          customerName: customer.fullName,
          businessName: business?.name ?? 'tu centro',
          startsAt: appointment.startsAt,
          template: business?.whatsappReminderTemplate,
        });

        const sendResult = await this.whatsAppService.sendMessage(customer.phone, message);

        await this.reminderModel.findByIdAndUpdate(reminder.id, {
          status: 'sent',
          providerMessageId: sendResult.providerMessageId,
        });

        sent += 1;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown reminder send error';
        await this.reminderModel.findByIdAndUpdate(reminder.id, {
          status: 'failed',
          lastError: message,
          $inc: { attempts: 1 },
        });
        failed += 1;
      }
    }

    return { processed, sent, failed };
  }

  private claimNextDueWhatsAppReminder() {
    return this.reminderModel.findOneAndUpdate(
      {
        channel: 'whatsapp',
        status: 'pending',
        scheduledFor: { $lte: new Date() },
      },
      {
        $set: { status: 'processing' },
      },
      { new: true, sort: { scheduledFor: 1 } },
    );
  }

  private buildReminderMessage(input: {
    customerName: string;
    businessName: string;
    startsAt: Date;
    template?: string;
  }): string {
    const start = new Date(input.startsAt);
    const date = start.toLocaleDateString('es-CL');
    const time = start.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });

    if (input.template) {
      return input.template
        .replaceAll('{{cliente}}', input.customerName)
        .replaceAll('{{negocio}}', input.businessName)
        .replaceAll('{{fecha}}', date)
        .replaceAll('{{hora}}', time);
    }

    return `Hola ${input.customerName}, te recordamos tu cita en ${input.businessName} el ${date} a las ${time}. Responde este mensaje si necesitas reprogramar.`; // eslint-disable-line max-len
  }
}
