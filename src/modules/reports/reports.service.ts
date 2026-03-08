import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appointment, AppointmentDocument } from '../appointments/appointment.schema';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Appointment.name)
    private readonly appointmentModel: Model<AppointmentDocument>,
  ) {}

  async basicSummary(businessId: string, from: string, to: string) {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    const [byStatus, totalAppointments] = await Promise.all([
      this.appointmentModel.aggregate([
        {
          $match: {
            businessId,
            startsAt: { $gte: fromDate, $lte: toDate },
          },
        },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]),
      this.appointmentModel.countDocuments({
        businessId,
        startsAt: { $gte: fromDate, $lte: toDate },
      }),
    ]);

    return {
      businessId,
      from,
      to,
      totalAppointments,
      byStatus,
    };
  }
}
