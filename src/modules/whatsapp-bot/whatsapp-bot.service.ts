import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appointment, AppointmentDocument } from '../appointments/appointment.schema';
import { Business, BusinessDocument } from '../businesses/business.schema';
import { Customer, CustomerDocument } from '../customers/customer.schema';
import { Professional, ProfessionalDocument } from '../professionals/professional.schema';
import { Reminder, ReminderDocument } from '../reminders/reminder.schema';
import { WhatsAppService } from '../reminders/whatsapp.service';
import { ServiceItem, ServiceItemDocument } from '../services/service.schema';
import { AiAssistantService } from './ai-assistant.service';
import { BotIntent, InboundMessage } from './whatsapp-bot.types';
import { WhatsAppSession, WhatsAppSessionDocument } from './whatsapp-session.schema';

@Injectable()
export class WhatsAppBotService {
  constructor(
    @InjectModel(WhatsAppSession.name)
    private readonly sessionModel: Model<WhatsAppSessionDocument>,
    @InjectModel(Business.name)
    private readonly businessModel: Model<BusinessDocument>,
    @InjectModel(Customer.name)
    private readonly customerModel: Model<CustomerDocument>,
    @InjectModel(ServiceItem.name)
    private readonly serviceModel: Model<ServiceItemDocument>,
    @InjectModel(Professional.name)
    private readonly professionalModel: Model<ProfessionalDocument>,
    @InjectModel(Appointment.name)
    private readonly appointmentModel: Model<AppointmentDocument>,
    @InjectModel(Reminder.name)
    private readonly reminderModel: Model<ReminderDocument>,
    private readonly whatsAppService: WhatsAppService,
    private readonly aiAssistantService: AiAssistantService,
  ) {}

  async handleIncomingMessage(businessId: string, inbound: InboundMessage) {
    const business = await this.businessModel.findById(businessId);
    if (!business) {
      throw new BadRequestException('Business not found');
    }

    const phone = this.normalizePhone(inbound.phone);
    const text = (inbound.text ?? '').trim();
    const message = inbound.buttonId ? inbound.buttonId : text;

    let session = await this.sessionModel.findOne({ businessId, phone });
    if (!session) {
      session = await this.sessionModel.create({ businessId, phone, state: 'IDLE', context: {} });
    }

    await this.ensureCustomer(businessId, phone);

    if (!message) {
      await this.sendMainMenu(businessId, phone, business.whatsappWelcomeMessage);
      return { ok: true, state: session.state };
    }

    await this.routeConversation({ business, session, phone, message, rawText: text });
    return { ok: true };
  }

  async sendLocationMessage(businessId: string, to: string) {
    const business = await this.businessModel.findById(businessId);
    if (!business) throw new BadRequestException('Business not found');

    const label = business.whatsappLocationText ?? `Ubicacion de ${business.name}`;
    const url = business.whatsappLocationUrl;

    if (!url) {
      await this.whatsAppService.sendMessage(to, 'Aun no tenemos una ubicacion configurada.');
      return;
    }

    await this.whatsAppService.sendLocation(to, label, url);
  }

  private async routeConversation(input: {
    business: BusinessDocument;
    session: WhatsAppSessionDocument;
    phone: string;
    message: string;
    rawText: string;
  }) {
    const normalized = input.message.toLowerCase();
    const mappedMenuIntent = this.mapMenuOption(normalized);
    const finalIntent = mappedMenuIntent ?? this.detectIntent(normalized);

    if (normalized === 'menu' || normalized === 'ayuda') {
      await this.updateSession(input.session, 'IDLE', {});
      await this.sendMainMenu(input.business.id, input.phone);
      return;
    }

    if (input.session.state === 'AWAITING_SERVICE') {
      await this.handleServiceSelection(input.business.id, input.session, input.phone, normalized);
      return;
    }

    if (input.session.state === 'AWAITING_PROFESSIONAL') {
      await this.handleProfessionalSelection(input.business.id, input.session, input.phone, normalized);
      return;
    }

    if (input.session.state === 'AWAITING_SLOT') {
      await this.handleSlotSelection(input.business.id, input.session, input.phone, normalized);
      return;
    }

    if (input.session.state === 'AWAITING_CONFIRMATION') {
      await this.handleConfirmation(input.business.id, input.session, input.phone, normalized);
      return;
    }

    if (input.session.state === 'AWAITING_CANCEL_SELECTION') {
      await this.handleCancelSelection(input.business.id, input.session, input.phone, normalized);
      return;
    }

    if (input.session.state === 'AWAITING_RESCHEDULE_SELECTION') {
      await this.handleRescheduleSelection(input.business.id, input.session, input.phone, normalized);
      return;
    }

    if (finalIntent === 'book' || finalIntent === 'availability') {
      await this.startBookingFlow(input.business.id, input.phone, input.session);
      return;
    }

    if (finalIntent === 'cancel') {
      await this.startCancelFlow(input.business.id, input.phone, input.session);
      return;
    }

    if (finalIntent === 'reschedule') {
      await this.startRescheduleFlow(input.business.id, input.phone, input.session);
      return;
    }

    if (finalIntent === 'location') {
      await this.sendLocationMessage(input.business.id, input.phone);
      await this.sendMainMenu(input.business.id, input.phone);
      return;
    }

    if (input.business.whatsappAiEnabled) {
      const aiText = await this.aiAssistantService.suggestReply({
        businessName: input.business.name,
        userMessage: input.rawText,
        contextSummary: `Estado conversacion: ${input.session.state}`,
      });

      if (aiText) {
        await this.whatsAppService.sendMessage(input.phone, aiText);
        await this.sendMainMenu(input.business.id, input.phone);
        return;
      }
    }

    await this.sendMainMenu(input.business.id, input.phone);
  }

  private detectIntent(message: string): BotIntent {
    if (/(reserv|agend|cita|hora|book)/i.test(message)) return 'book';
    if (/(dispon|horario|slot)/i.test(message)) return 'availability';
    if (/(cancel|anular)/i.test(message)) return 'cancel';
    if (/(reprogram|cambiar|mover)/i.test(message)) return 'reschedule';
    if (/(ubic|direcci|mapa|donde)/i.test(message)) return 'location';
    if (/(ayuda|menu|opcion)/i.test(message)) return 'help';
    return 'unknown';
  }

  private mapMenuOption(message: string): BotIntent | null {
    if (message === '1') return 'book';
    if (message === '2') return 'availability';
    if (message === '3') return 'cancel';
    if (message === '4') return 'reschedule';
    if (message === '5') return 'location';
    return null;
  }

  private async sendMainMenu(businessId: string, phone: string, customWelcome?: string) {
    const text =
      customWelcome ??
      'Hola, soy tu asistente de reservas. Elige una opcion:\n1) Reservar cita\n2) Consultar disponibilidad\n3) Cancelar cita\n4) Reprogramar cita\n5) Ver ubicacion';

    await this.whatsAppService.sendButtons(phone, text, [
      { id: 'book', title: 'Reservar' },
      { id: 'availability', title: 'Disponibilidad' },
      { id: 'cancel', title: 'Cancelar' },
    ]);

    await this.updateSessionByPhone(businessId, phone, 'IDLE', {});
  }

  private async startBookingFlow(
    businessId: string,
    phone: string,
    session: WhatsAppSessionDocument,
  ) {
    const services = await this.serviceModel.find({ businessId, isActive: true }).sort({ name: 1 }).limit(10);

    if (services.length === 0) {
      await this.whatsAppService.sendMessage(phone, 'No hay servicios disponibles por ahora.');
      return;
    }

    const lines = services.map((s, idx) => `${idx + 1}) ${s.name} (${s.durationMinutes} min)`);
    await this.whatsAppService.sendMessage(phone, `Que servicio necesitas?\n${lines.join('\n')}`);

    await this.updateSession(session, 'AWAITING_SERVICE', {
      serviceOptions: services.map((s) => ({ id: s.id, name: s.name })),
    });
  }

  private async handleServiceSelection(
    businessId: string,
    session: WhatsAppSessionDocument,
    phone: string,
    value: string,
  ) {
    const options = (session.context?.serviceOptions as Array<{ id: string; name: string }>) ?? [];
    const selected = this.pickByIndexOrName(options, value);

    if (!selected) {
      await this.whatsAppService.sendMessage(phone, 'No entendi el servicio. Responde con el numero.');
      return;
    }

    const professionals = await this.professionalModel
      .find({ businessId, isActive: true, $or: [{ serviceIds: selected.id }, { serviceIds: { $size: 0 } }] })
      .sort({ fullName: 1 })
      .limit(10);

    if (professionals.length === 0) {
      await this.whatsAppService.sendMessage(phone, 'No hay profesionales disponibles para ese servicio.');
      await this.updateSession(session, 'IDLE', {});
      return;
    }

    const lines = professionals.map((p, idx) => `${idx + 1}) ${p.fullName}`);
    await this.whatsAppService.sendMessage(phone, `Con quien prefieres atenderte?\n${lines.join('\n')}`);

    await this.updateSession(session, 'AWAITING_PROFESSIONAL', {
      ...session.context,
      selectedServiceId: selected.id,
      selectedServiceName: selected.name,
      professionalOptions: professionals.map((p) => ({ id: p.id, name: p.fullName })),
    });
  }

  private async handleProfessionalSelection(
    businessId: string,
    session: WhatsAppSessionDocument,
    phone: string,
    value: string,
  ) {
    const professionals =
      (session.context?.professionalOptions as Array<{ id: string; name: string }>) ?? [];
    const selectedProfessional = this.pickByIndexOrName(professionals, value);

    if (!selectedProfessional) {
      await this.whatsAppService.sendMessage(phone, 'No entendi el profesional. Responde con el numero.');
      return;
    }

    const serviceId = String(session.context?.selectedServiceId ?? '');
    const slots = await this.getNextAvailableSlots(businessId, selectedProfessional.id, serviceId, 5);

    if (slots.length === 0) {
      await this.whatsAppService.sendMessage(phone, 'No hay disponibilidad cercana. Intenta luego o elige otro profesional.');
      await this.updateSession(session, 'IDLE', {});
      return;
    }

    const lines = slots.map((slot, idx) => `${idx + 1}) ${this.formatDateTime(slot.startsAt)}`);
    await this.whatsAppService.sendMessage(
      phone,
      `Estos son los proximos horarios disponibles:\n${lines.join('\n')}\nResponde con el numero.`,
    );

    await this.updateSession(session, 'AWAITING_SLOT', {
      ...session.context,
      selectedProfessionalId: selectedProfessional.id,
      selectedProfessionalName: selectedProfessional.name,
      slotOptions: slots,
    });
  }

  private async handleSlotSelection(
    businessId: string,
    session: WhatsAppSessionDocument,
    phone: string,
    value: string,
  ) {
    const slots =
      (session.context?.slotOptions as Array<{ startsAt: string; endsAt: string }>) ?? [];
    const selected = this.pickByIndex(slots, value);

    if (!selected) {
      await this.whatsAppService.sendMessage(phone, 'No entendi el horario. Responde con el numero.');
      return;
    }

    const confirmationText = `Confirmas tu reserva para ${this.formatDateTime(selected.startsAt)}?`;
    await this.whatsAppService.sendButtons(phone, confirmationText, [
      { id: 'confirm_yes', title: 'Confirmar' },
      { id: 'confirm_no', title: 'Cancelar' },
    ]);

    await this.updateSession(session, 'AWAITING_CONFIRMATION', {
      ...session.context,
      selectedSlot: selected,
      flow: 'BOOK',
    });

    void businessId;
  }

  private async handleConfirmation(
    businessId: string,
    session: WhatsAppSessionDocument,
    phone: string,
    value: string,
  ) {
    const accepted = ['1', 'si', 'sí', 'confirmar', 'confirm_yes', 'ok'].includes(value);
    if (!accepted) {
      await this.whatsAppService.sendMessage(phone, 'Reserva cancelada. Si quieres, escribe "menu" para empezar otra vez.');
      await this.updateSession(session, 'IDLE', {});
      return;
    }

    const customer = await this.customerModel.findOne({ businessId, phone }).sort({ createdAt: -1 });
    if (!customer) {
      await this.whatsAppService.sendMessage(phone, 'No pude identificar tu ficha de cliente.');
      await this.updateSession(session, 'IDLE', {});
      return;
    }

    const slot = session.context?.selectedSlot as { startsAt: string; endsAt: string };
    if (!slot) {
      await this.whatsAppService.sendMessage(phone, 'No hay un horario seleccionado.');
      await this.updateSession(session, 'IDLE', {});
      return;
    }

    const appointment = await this.appointmentModel.create({
      businessId,
      customerId: customer.id,
      professionalId: String(session.context?.selectedProfessionalId ?? ''),
      serviceId: String(session.context?.selectedServiceId ?? ''),
      source: 'whatsapp',
      status: 'confirmed',
      startsAt: new Date(slot.startsAt),
      endsAt: new Date(slot.endsAt),
    });

    await this.reminderModel.create({
      appointmentId: appointment.id,
      channel: 'whatsapp',
      scheduledFor: new Date(new Date(slot.startsAt).getTime() - 24 * 60 * 60 * 1000),
      status: 'pending',
      attempts: 0,
    });

    await this.whatsAppService.sendMessage(
      phone,
      `Reserva confirmada para ${this.formatDateTime(slot.startsAt)}. ID de cita: ${appointment.id}`,
    );

    await this.sendMainMenu(businessId, phone);
  }

  private async startCancelFlow(
    businessId: string,
    phone: string,
    session: WhatsAppSessionDocument,
  ) {
    const customer = await this.customerModel.findOne({ businessId, phone }).sort({ createdAt: -1 });
    if (!customer) {
      await this.whatsAppService.sendMessage(phone, 'No encontre citas asociadas a tu telefono.');
      return;
    }

    const upcoming = await this.appointmentModel
      .find({
        businessId,
        customerId: customer.id,
        status: { $in: ['pending', 'confirmed'] },
        startsAt: { $gte: new Date() },
      })
      .sort({ startsAt: 1 })
      .limit(5);

    if (upcoming.length === 0) {
      await this.whatsAppService.sendMessage(phone, 'No tienes citas futuras para cancelar.');
      return;
    }

    const lines = upcoming.map((a, idx) => `${idx + 1}) ${this.formatDateTime(a.startsAt)}`);
    await this.whatsAppService.sendMessage(phone, `Que cita deseas cancelar?\n${lines.join('\n')}`);

    await this.updateSession(session, 'AWAITING_CANCEL_SELECTION', {
      appointmentOptions: upcoming.map((a) => ({ id: a.id, startsAt: a.startsAt })),
    });
  }

  private async handleCancelSelection(
    businessId: string,
    session: WhatsAppSessionDocument,
    phone: string,
    value: string,
  ) {
    const options =
      (session.context?.appointmentOptions as Array<{ id: string; startsAt: string }>) ?? [];
    const selected = this.pickByIndex(options, value);

    if (!selected) {
      await this.whatsAppService.sendMessage(phone, 'No entendi la cita. Responde con el numero.');
      return;
    }

    await this.appointmentModel.findByIdAndUpdate(selected.id, { status: 'cancelled' });
    await this.whatsAppService.sendMessage(phone, `Cita cancelada: ${this.formatDateTime(selected.startsAt)}.`);
    await this.sendMainMenu(businessId, phone);
  }

  private async startRescheduleFlow(
    businessId: string,
    phone: string,
    session: WhatsAppSessionDocument,
  ) {
    const customer = await this.customerModel.findOne({ businessId, phone }).sort({ createdAt: -1 });
    if (!customer) {
      await this.whatsAppService.sendMessage(phone, 'No encontre citas asociadas a tu telefono.');
      return;
    }

    const upcoming = await this.appointmentModel
      .find({
        businessId,
        customerId: customer.id,
        status: { $in: ['pending', 'confirmed'] },
        startsAt: { $gte: new Date() },
      })
      .sort({ startsAt: 1 })
      .limit(5);

    if (upcoming.length === 0) {
      await this.whatsAppService.sendMessage(phone, 'No tienes citas futuras para reprogramar.');
      return;
    }

    const lines = upcoming.map((a, idx) => `${idx + 1}) ${this.formatDateTime(a.startsAt)}`);
    await this.whatsAppService.sendMessage(phone, `Que cita deseas reprogramar?\n${lines.join('\n')}`);

    await this.updateSession(session, 'AWAITING_RESCHEDULE_SELECTION', {
      appointmentOptions: upcoming.map((a) => ({
        id: a.id,
        startsAt: a.startsAt,
        serviceId: a.serviceId,
        professionalId: a.professionalId,
      })),
    });
  }

  private async handleRescheduleSelection(
    businessId: string,
    session: WhatsAppSessionDocument,
    phone: string,
    value: string,
  ) {
    const options =
      (session.context?.appointmentOptions as Array<{
        id: string;
        startsAt: string;
        serviceId: string;
        professionalId: string;
      }>) ?? [];

    const selected = this.pickByIndex(options, value);
    if (!selected) {
      await this.whatsAppService.sendMessage(phone, 'No entendi la cita. Responde con el numero.');
      return;
    }

    const slots = await this.getNextAvailableSlots(
      businessId,
      selected.professionalId,
      selected.serviceId,
      3,
    );

    if (slots.length === 0) {
      await this.whatsAppService.sendMessage(phone, 'No hay horarios para reprogramar en este momento.');
      await this.sendMainMenu(businessId, phone);
      return;
    }

    const newSlot = slots[0];
    await this.appointmentModel.findByIdAndUpdate(selected.id, {
      startsAt: new Date(newSlot.startsAt),
      endsAt: new Date(newSlot.endsAt),
      status: 'confirmed',
    });

    await this.whatsAppService.sendMessage(
      phone,
      `Cita reprogramada para ${this.formatDateTime(newSlot.startsAt)}.`,
    );

    await this.sendMainMenu(businessId, phone);
  }

  private async ensureCustomer(businessId: string, phone: string) {
    const existing = await this.customerModel.findOne({ businessId, phone });
    if (existing) return existing;

    return this.customerModel.create({
      businessId,
      phone,
      fullName: `Cliente ${phone.slice(-4)}`,
    });
  }

  private async getNextAvailableSlots(
    businessId: string,
    professionalId: string,
    serviceId: string,
    limit: number,
  ) {
    const service = await this.serviceModel.findById(serviceId);
    if (!service) return [];

    const durationMs = service.durationMinutes * 60 * 1000;
    const now = new Date();
    const startCursor = new Date(now.getTime() + 30 * 60 * 1000);
    const slots: Array<{ startsAt: string; endsAt: string }> = [];

    for (let dayOffset = 0; dayOffset < 7 && slots.length < limit; dayOffset += 1) {
      const dayBase = new Date(startCursor);
      dayBase.setDate(dayBase.getDate() + dayOffset);
      dayBase.setHours(9, 0, 0, 0);

      for (let hour = 9; hour < 19 && slots.length < limit; hour += 1) {
        const slotStart = new Date(dayBase);
        slotStart.setHours(hour, 0, 0, 0);
        if (slotStart < startCursor) continue;

        const slotEnd = new Date(slotStart.getTime() + durationMs);

        const overlap = await this.appointmentModel.findOne({
          businessId,
          professionalId,
          status: { $nin: ['cancelled'] },
          startsAt: { $lt: slotEnd },
          endsAt: { $gt: slotStart },
        });

        if (!overlap) {
          slots.push({ startsAt: slotStart.toISOString(), endsAt: slotEnd.toISOString() });
        }
      }
    }

    return slots;
  }

  private pickByIndexOrName<T extends { id: string; name: string }>(
    options: T[],
    value: string,
  ): T | null {
    const byIndex = this.pickByIndex(options, value);
    if (byIndex) return byIndex;

    return options.find((opt) => opt.name.toLowerCase() === value.toLowerCase()) ?? null;
  }

  private pickByIndex<T>(options: T[], value: string): T | null {
    const index = Number(value);
    if (Number.isNaN(index) || index < 1 || index > options.length) return null;
    return options[index - 1] ?? null;
  }

  private formatDateTime(date: string | Date): string {
    const d = new Date(date);
    return `${d.toLocaleDateString('es-CL')} ${d.toLocaleTimeString('es-CL', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
  }

  private normalizePhone(phone: string): string {
    const cleaned = phone.replace(/[^\d+]/g, '');
    if (cleaned.startsWith('+')) return cleaned;
    return `+${cleaned}`;
  }

  private async updateSession(
    session: WhatsAppSessionDocument,
    state: string,
    context: Record<string, unknown>,
  ) {
    session.state = state;
    session.context = context;
    await session.save();
  }

  private async updateSessionByPhone(
    businessId: string,
    phone: string,
    state: string,
    context: Record<string, unknown>,
  ) {
    await this.sessionModel.findOneAndUpdate(
      { businessId, phone },
      { state, context },
      { upsert: true, new: true },
    );
  }
}
