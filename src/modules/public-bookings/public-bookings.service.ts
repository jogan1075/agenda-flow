import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appointment, AppointmentDocument } from '../appointments/appointment.schema';
import { Business, BusinessDocument } from '../businesses/business.schema';
import { Customer, CustomerDocument } from '../customers/customer.schema';
import { Professional, ProfessionalDocument } from '../professionals/professional.schema';
import { ServiceItem, ServiceItemDocument } from '../services/service.schema';
import { WhatsAppService } from '../reminders/whatsapp.service';
import { CreatePublicBookingDto } from './dto/create-public-booking.dto';
import { EmailService } from './email.service';

@Injectable()
export class PublicBookingsService {
  constructor(
    @InjectModel(Appointment.name)
    private readonly appointmentModel: Model<AppointmentDocument>,
    @InjectModel(Customer.name)
    private readonly customerModel: Model<CustomerDocument>,
    @InjectModel(Business.name)
    private readonly businessModel: Model<BusinessDocument>,
    @InjectModel(ServiceItem.name)
    private readonly serviceItemModel: Model<ServiceItemDocument>,
    @InjectModel(Professional.name)
    private readonly professionalModel: Model<ProfessionalDocument>,
    private readonly whatsappService: WhatsAppService,
    private readonly emailService: EmailService,
  ) {}

  async reserve(dto: CreatePublicBookingDto) {
    const startsAt = new Date(dto.startsAt);
    const endsAt = new Date(dto.endsAt);

    if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime()) || endsAt <= startsAt) {
      throw new BadRequestException('Rango de cita invalido');
    }

    const [business, service, professional] = await Promise.all([
      this.businessModel.findById(dto.businessId),
      this.serviceItemModel.findOne({ _id: dto.serviceId, businessId: dto.businessId, isActive: true }),
      this.professionalModel.findOne({ _id: dto.professionalId, businessId: dto.businessId, isActive: true }),
    ]);

    if (!business) throw new NotFoundException('Negocio no encontrado');
    if (!service) throw new NotFoundException('Servicio no encontrado');
    if (!professional) throw new NotFoundException('Profesional no encontrado');

    const overlap = await this.appointmentModel.findOne({
      professionalId: dto.professionalId,
      status: { $nin: ['cancelled'] },
      startsAt: { $lt: endsAt },
      endsAt: { $gt: startsAt },
    });

    if (overlap) {
      throw new BadRequestException('El bloque horario ya no esta disponible');
    }

    const customer = await this.upsertCustomer(dto);

    const appointment = await this.appointmentModel.create({
      businessId: dto.businessId,
      customerId: customer.id,
      professionalId: dto.professionalId,
      serviceId: dto.serviceId,
      source: 'web',
      status: 'confirmed',
      startsAt,
      endsAt,
    });

    const date = startsAt.toLocaleDateString('es-CL');
    const time = startsAt.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });

    const summary = {
      appointmentId: appointment.id,
      businessName: business.name,
      customerName: customer.fullName,
      customerPhone: customer.phone,
      customerEmail: customer.email,
      serviceName: service.name,
      servicePrice: service.price,
      professionalName: professional.fullName,
      startsAt: appointment.startsAt,
      endsAt: appointment.endsAt,
      date,
      time,
    };

    const whatsappMessage = this.buildSummaryMessage(summary);

    let whatsappSent = false;
    let emailSent = false;
    let emailReason = 'not_requested';

    try {
      await this.whatsappService.sendMessage(customer.phone, whatsappMessage);
      whatsappSent = true;
    } catch {
      whatsappSent = false;
    }

    if (customer.email) {
      try {
        const result = await this.emailService.sendBookingConfirmation({
          to: customer.email,
          customerName: customer.fullName,
          businessName: business.name,
          serviceName: service.name,
          professionalName: professional.fullName,
          date,
          time,
        });
        emailSent = result.sent;
        emailReason = result.reason ?? (result.sent ? 'sent' : 'unknown');
      } catch {
        emailSent = false;
        emailReason = 'smtp_error';
      }
    } else {
      emailReason = 'missing_customer_email';
    }

    return {
      appointment,
      summary,
      notifications: {
        whatsappSent,
        emailSent,
        emailReason,
      },
    };
  }

  private async upsertCustomer(dto: CreatePublicBookingDto) {
    const normalizedPhone = this.normalizePhone(dto.phone);

    const existing = await this.customerModel.findOne({ businessId: dto.businessId, phone: normalizedPhone });
    if (existing) {
      existing.fullName = dto.fullName;
      existing.email = dto.email;
      existing.phone = normalizedPhone;
      existing.isActive = true;
      await existing.save();
      return existing;
    }

    return this.customerModel.create({
      businessId: dto.businessId,
      fullName: dto.fullName,
      phone: normalizedPhone,
      email: dto.email,
      isActive: true,
    });
  }

  private normalizePhone(phone: string) {
    const cleaned = phone.replace(/[^\d+]/g, '');
    if (!cleaned) return phone;
    return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
  }

  private buildSummaryMessage(summary: {
    customerName: string;
    businessName: string;
    serviceName: string;
    professionalName: string;
    date: string;
    time: string;
  }) {
    return `Hola ${summary.customerName}, tu reserva fue confirmada en ${summary.businessName}.\nServicio: ${summary.serviceName}\nProfesional: ${summary.professionalName}\nFecha: ${summary.date}\nHora: ${summary.time}`;
  }
}
