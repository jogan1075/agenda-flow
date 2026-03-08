import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Professional, ProfessionalDocument } from '../professionals/professional.schema';
import { Appointment, AppointmentDocument } from './appointment.schema';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name)
    private readonly appointmentModel: Model<AppointmentDocument>,
    @InjectModel(Professional.name)
    private readonly professionalModel: Model<ProfessionalDocument>,
  ) {}

  async create(dto: CreateAppointmentDto) {
    const startsAt = new Date(dto.startsAt);
    const endsAt = new Date(dto.endsAt);

    if (endsAt <= startsAt) {
      throw new BadRequestException('Invalid appointment range');
    }

    await this.assertProfessionalServiceLink(dto.businessId, dto.professionalId, dto.serviceId);

    const overlap = await this.appointmentModel.findOne({
      professionalId: dto.professionalId,
      status: { $nin: ['cancelled'] },
      startsAt: { $lt: endsAt },
      endsAt: { $gt: startsAt },
    });

    if (overlap) {
      throw new BadRequestException('Professional already has an appointment in this range');
    }

    return this.appointmentModel.create({
      ...dto,
      startsAt,
      endsAt,
    });
  }

  listByBusiness(businessId: string, from?: string, to?: string) {
    const query: Record<string, unknown> = { businessId };

    if (from || to) {
      query.startsAt = {};
      if (from) (query.startsAt as Record<string, Date>).$gte = new Date(from);
      if (to) (query.startsAt as Record<string, Date>).$lte = new Date(to);
    }

    return this.appointmentModel.find(query).sort({ startsAt: 1 });
  }

  async update(id: string, dto: UpdateAppointmentDto) {
    const current = await this.appointmentModel.findById(id);
    if (!current) {
      throw new NotFoundException('Appointment not found');
    }

    const businessId = dto.businessId ?? current.businessId;
    const professionalId = dto.professionalId ?? current.professionalId;
    const serviceId = dto.serviceId ?? current.serviceId;
    await this.assertProfessionalServiceLink(businessId, professionalId, serviceId);

    const payload: Record<string, unknown> = { ...dto };
    if (dto.startsAt) payload.startsAt = new Date(dto.startsAt);
    if (dto.endsAt) payload.endsAt = new Date(dto.endsAt);

    const updated = await this.appointmentModel.findByIdAndUpdate(id, payload, { new: true });
    if (!updated) {
      throw new NotFoundException('Appointment not found');
    }
    return updated;
  }

  private async assertProfessionalServiceLink(businessId: string, professionalId: string, serviceId: string) {
    const professional = await this.professionalModel.findOne({
      _id: professionalId,
      businessId,
      isActive: true,
    });

    if (!professional) {
      throw new BadRequestException('Professional not found for this business');
    }

    const assignedServiceIds = (professional.serviceIds ?? []).map((item) => String(item));
    if (!assignedServiceIds.includes(serviceId)) {
      throw new BadRequestException('Professional is not associated with the selected service');
    }
  }
}
