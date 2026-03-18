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
import { MercadoPagoService } from './mercadopago.service';

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
    private readonly mercadoPagoService: MercadoPagoService,
  ) {}

  async listBusinesses() {
    return this.businessModel
      .find({ isEnabled: true })
      .select({
        name: 1,
        email: 1,
        phone: 1,
        address: 1,
        businessCategory: 1,
        businessSubcategory: 1,
        branches: 1,
      })
      .sort({ createdAt: -1 })
      .lean();
  }

  async listBranches(businessId: string) {
    const business = await this.businessModel.findById(businessId).select({ branches: 1, isEnabled: 1 }).lean();
    if (!business) {
      throw new NotFoundException('Negocio no encontrado');
    }
    if (business.isEnabled === false) {
      throw new BadRequestException('Este negocio esta temporalmente deshabilitado');
    }
    return business.branches ?? [];
  }

  async listServicesByBusiness(businessId: string) {
    const business = await this.businessModel.findById(businessId).select({ isEnabled: 1 }).lean();
    if (!business) {
      throw new NotFoundException('Negocio no encontrado');
    }
    if (business.isEnabled === false) {
      throw new BadRequestException('Este negocio esta temporalmente deshabilitado');
    }
    return this.serviceItemModel.find({ businessId, isActive: true }).sort({ name: 1 }).lean();
  }

  async listProfessionalsByBusiness(businessId: string, serviceId?: string) {
    const business = await this.businessModel.findById(businessId).select({ isEnabled: 1 }).lean();
    if (!business) {
      throw new NotFoundException('Negocio no encontrado');
    }
    if (business.isEnabled === false) {
      throw new BadRequestException('Este negocio esta temporalmente deshabilitado');
    }

    const query: Record<string, unknown> = { businessId, isActive: true };
    if (serviceId) {
      query.serviceIds = serviceId;
    }

    return this.professionalModel.find(query).sort({ fullName: 1 }).lean();
  }

  async getAvailability(input: {
    businessId: string;
    professionalId: string;
    serviceId: string;
    limit?: number;
  }) {
    const { businessId, professionalId, serviceId } = input;
    const limit = input.limit && input.limit > 0 ? Math.min(input.limit, 50) : 10;

    const [business, service, professional] = await Promise.all([
      this.businessModel.findById(businessId),
      this.serviceItemModel.findOne({ _id: serviceId, businessId, isActive: true }),
      this.professionalModel.findOne({ _id: professionalId, businessId, isActive: true }),
    ]);

    if (!business) throw new NotFoundException('Negocio no encontrado');
    if (business.isEnabled === false) {
      throw new BadRequestException('Este negocio esta temporalmente deshabilitado');
    }
    if (!service) throw new NotFoundException('Servicio no encontrado');
    if (!professional) throw new NotFoundException('Profesional no encontrado');
    if (!(professional.serviceIds ?? []).map((item) => String(item)).includes(serviceId)) {
      throw new BadRequestException('El profesional no esta asociado al servicio seleccionado');
    }

    const durationMs = service.durationMinutes * 60 * 1000;
    const now = new Date();
    const startCursor = new Date(now.getTime() + 30 * 60 * 1000);
    const slots: Array<{ startsAt: string; endsAt: string }> = [];
    const openingHours = business.openingHours ?? [];
    const dayKeys: Array<'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday'> = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];

    for (let dayOffset = 0; dayOffset < 7 && slots.length < limit; dayOffset += 1) {
      const dayBase = new Date(startCursor);
      dayBase.setDate(dayBase.getDate() + dayOffset);
      dayBase.setHours(0, 0, 0, 0);

      const dayKey = dayKeys[dayBase.getDay()];
      const dayConfig = openingHours.find((item) => item.day === dayKey);
      if (!dayConfig || dayConfig.isOpen === false) {
        continue;
      }

      const { opensAt, closesAt } = this.normalizeHours(dayConfig.opensAt, dayConfig.closesAt);
      if (!opensAt || !closesAt) continue;

      let cursor = new Date(dayBase);
      cursor.setHours(opensAt.hours, opensAt.minutes, 0, 0);
      const closeAt = new Date(dayBase);
      closeAt.setHours(closesAt.hours, closesAt.minutes, 0, 0);

      while (cursor.getTime() + durationMs <= closeAt.getTime() && slots.length < limit) {
        if (cursor >= startCursor) {
          const slotEnd = new Date(cursor.getTime() + durationMs);
          const overlap = await this.appointmentModel.findOne({
            businessId,
            professionalId,
            status: { $nin: ['cancelled'] },
            startsAt: { $lt: slotEnd },
            endsAt: { $gt: cursor },
          });
          if (!overlap) {
            slots.push({ startsAt: cursor.toISOString(), endsAt: slotEnd.toISOString() });
          }
        }
        cursor = new Date(cursor.getTime() + durationMs);
      }
    }

    return slots;
  }

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
    if (business.isEnabled === false) {
      throw new BadRequestException('Este negocio esta temporalmente deshabilitado');
    }
    if (!service) throw new NotFoundException('Servicio no encontrado');
    if (!professional) throw new NotFoundException('Profesional no encontrado');
    if (!(professional.serviceIds ?? []).map((item) => String(item)).includes(dto.serviceId)) {
      throw new BadRequestException('El profesional no esta asociado al servicio seleccionado');
    }

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

    if (business.paymentMode === 'mercadopago') {
      if (!business.mercadoPagoAccessToken) {
        throw new BadRequestException('MercadoPago no esta configurado en este negocio');
      }

      const appointment = await this.appointmentModel.create({
        businessId: dto.businessId,
        customerId: customer.id,
        professionalId: dto.professionalId,
        serviceId: dto.serviceId,
        source: 'web',
        status: 'pending',
        isPaid: false,
        paymentProvider: 'mercadopago',
        paymentStatus: 'pending',
        startsAt,
        endsAt,
      });

      const preference = await this.mercadoPagoService.createPreference(
        business.mercadoPagoAccessToken,
        this.buildMercadoPagoPreference({
          business,
          service,
          customer,
          appointmentId: appointment.id,
        }),
      );

      await this.appointmentModel.findByIdAndUpdate(appointment.id, {
        paymentPreferenceId: preference.id,
        paymentProvider: 'mercadopago',
        paymentStatus: 'pending',
      });

      const summary = this.buildSummary(appointment, business, service, professional, customer);

      return {
        appointment,
        summary,
        notifications: {
          whatsappSent: false,
          emailSent: false,
          emailReason: 'payment_pending',
        },
        payment: {
          provider: 'mercadopago',
          preferenceId: preference.id,
          initPoint: preference.init_point,
          sandboxInitPoint: preference.sandbox_init_point,
        },
      };
    }

    const appointment = await this.appointmentModel.create({
      businessId: dto.businessId,
      customerId: customer.id,
      professionalId: dto.professionalId,
      serviceId: dto.serviceId,
      source: 'web',
      status: 'confirmed',
      isPaid: false,
      startsAt,
      endsAt,
    });

    const summary = this.buildSummary(appointment, business, service, professional, customer);

    const notifications = await this.sendNotifications(summary, business, service, customer);

    return {
      appointment,
      summary,
      notifications,
    };
  }

  private normalizeHours(opensAt?: string, closesAt?: string) {
    const parse = (value?: string) => {
      if (!value) return null;
      const [hourStr, minuteStr] = value.split(':');
      const hours = Number(hourStr);
      const minutes = Number(minuteStr ?? '0');
      if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
      return { hours, minutes };
    };

    return {
      opensAt: parse(opensAt ?? '09:00'),
      closesAt: parse(closesAt ?? '19:00'),
    };
  }

  async handleMercadoPagoWebhook(
    businessId: string,
    payload: Record<string, unknown>,
    headers: Record<string, string>,
  ) {
    if (!businessId) {
      return { received: true };
    }

    const business = await this.businessModel.findById(businessId);
    if (!business?.mercadoPagoAccessToken) {
      return { received: true };
    }

    const paymentId = String((payload as Record<string, any>)?.data?.id ?? (payload as Record<string, any>)?.id ?? '');
    if (!paymentId) {
      return { received: true };
    }

    const payment = await this.mercadoPagoService.getPayment(business.mercadoPagoAccessToken, paymentId);
    const status = String(payment.status ?? 'unknown');
    const metadata = (payment.metadata ?? {}) as Record<string, unknown>;
    const appointmentId = String(metadata.appointment_id ?? payment.external_reference ?? '');
    if (!appointmentId) {
      return { received: true };
    }

    const appointment = await this.appointmentModel.findById(appointmentId);
    if (!appointment) {
      return { received: true };
    }

    const patch: Record<string, unknown> = {
      paymentProvider: 'mercadopago',
      paymentId,
      paymentStatus: status,
    };

    const shouldNotify = status === 'approved' && !appointment.isPaid;
    if (status === 'approved') {
      patch.isPaid = true;
      patch.status = 'confirmed';
      patch.paidAt = new Date();
    }

    await this.appointmentModel.findByIdAndUpdate(appointmentId, patch, { new: true });

    if (shouldNotify) {
      const [service, professional, customer] = await Promise.all([
        this.serviceItemModel.findById(appointment.serviceId),
        this.professionalModel.findById(appointment.professionalId),
        this.customerModel.findById(appointment.customerId),
      ]);
      if (service && professional && customer) {
        const summary = this.buildSummary(appointment, business, service, professional, customer);
        await this.sendNotifications(summary, business, service, customer);
      }
    }

    return { received: true };
  }

  async getSummaryByAppointmentId(appointmentId: string) {
    const appointment = await this.appointmentModel.findById(appointmentId);
    if (!appointment) {
      throw new NotFoundException('Reserva no encontrada');
    }

    const [business, service, professional, customer] = await Promise.all([
      this.businessModel.findById(appointment.businessId),
      this.serviceItemModel.findById(appointment.serviceId),
      this.professionalModel.findById(appointment.professionalId),
      this.customerModel.findById(appointment.customerId),
    ]);

    if (!business || !service || !professional || !customer) {
      throw new NotFoundException('No se pudo construir el resumen de la reserva');
    }

    return {
      appointment,
      summary: this.buildSummary(appointment, business, service, professional, customer),
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

  private buildSummary(
    appointment: AppointmentDocument,
    business: BusinessDocument,
    service: ServiceItemDocument,
    professional: ProfessionalDocument,
    customer: CustomerDocument,
  ) {
    const date = appointment.startsAt.toLocaleDateString('es-CL');
    const time = appointment.startsAt.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });

    return {
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
  }

  private async sendNotifications(
    summary: ReturnType<PublicBookingsService['buildSummary']>,
    business: BusinessDocument,
    service: ServiceItemDocument,
    customer: CustomerDocument,
  ) {
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
          professionalName: summary.professionalName,
          date: summary.date,
          time: summary.time,
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
      whatsappSent,
      emailSent,
      emailReason,
    };
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

  private buildMercadoPagoPreference(input: {
    business: BusinessDocument;
    service: ServiceItemDocument;
    customer: CustomerDocument;
    appointmentId: string;
  }) {
    const publicBookingUrl = this.getPublicBookingBaseUrl();
    const apiBaseUrl = this.getApiBaseUrl();

    const successUrl = `${publicBookingUrl}/reservas?payment=success`;
    const failureUrl = `${publicBookingUrl}/reservas?payment=failure`;
    const pendingUrl = `${publicBookingUrl}/reservas?payment=pending`;
    const notificationUrl = `${apiBaseUrl}/api/public-bookings/mercadopago/webhook?businessId=${input.business.id}`;

    return {
      items: [
        {
          title: input.service.name,
          quantity: 1,
          unit_price: Number(input.service.price ?? 0),
          currency_id: input.business.currency ?? 'CLP',
        },
      ],
      payer: {
        name: input.customer.fullName,
        email: input.customer.email ?? undefined,
      },
      back_urls: {
        success: successUrl,
        failure: failureUrl,
        pending: pendingUrl,
      },
      auto_return: 'approved',
      notification_url: notificationUrl,
      external_reference: input.appointmentId,
      metadata: {
        appointment_id: input.appointmentId,
        business_id: input.business.id,
        customer_id: input.customer.id,
        service_id: input.service.id,
      },
    };
  }

  private getPublicBookingBaseUrl() {
    const raw = String(
      process.env.PUBLIC_BOOKING_URL ?? process.env.FRONTEND_URL ?? process.env.RENDER_EXTERNAL_URL ?? 'http://localhost:3001',
    ).trim();
    return raw.replace(/\/+$/, '');
  }

  private getApiBaseUrl() {
    const raw = String(
      process.env.PUBLIC_API_URL ?? process.env.RENDER_EXTERNAL_URL ?? 'http://localhost:3000',
    ).trim();
    return raw.replace(/\/+$/, '');
  }
}
