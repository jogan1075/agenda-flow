export type AppointmentLike = {
  professionalId: string;
  startsAt: string;
  endsAt: string;
  status: string;
};

export type Slot = {
  startsAt: string;
  endsAt: string;
};

export type ProfessionalSchedule = {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime: string;
  endTime: string;
};

export function buildAvailableSlots(input: {
  date: string;
  durationMinutes: number;
  professionalId: string;
  appointments: AppointmentLike[];
  schedule?: ProfessionalSchedule[];
  startHour?: number;
  endHour?: number;
  maxSlots?: number;
}) {
  const {
    date,
    durationMinutes,
    professionalId,
    appointments,
    schedule = [],
    startHour = 9,
    endHour = 19,
    maxSlots = 16,
  } = input;

  if (!date || !professionalId || durationMinutes <= 0) return [] as Slot[];

  const dayStart = new Date(`${date}T00:00:00`);
  if (Number.isNaN(dayStart.getTime())) return [] as Slot[];

  const dayNames: ProfessionalSchedule['day'][] = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];
  const selectedDayName = dayNames[dayStart.getDay()];
  const daySchedule = schedule.find((item) => item.day === selectedDayName);

  if (schedule.length > 0 && !daySchedule) {
    return [] as Slot[];
  }

  const [scheduleStartHour, scheduleStartMinute] = (daySchedule?.startTime ?? '').split(':').map(Number);
  const [scheduleEndHour, scheduleEndMinute] = (daySchedule?.endTime ?? '').split(':').map(Number);
  const effectiveStartHour =
    Number.isFinite(scheduleStartHour) && Number.isFinite(scheduleStartMinute) ? scheduleStartHour : startHour;
  const effectiveEndHour =
    Number.isFinite(scheduleEndHour) && Number.isFinite(scheduleEndMinute) ? scheduleEndHour : endHour;
  const effectiveStartMinute =
    Number.isFinite(scheduleStartHour) && Number.isFinite(scheduleStartMinute) ? scheduleStartMinute : 0;
  const effectiveEndMinute =
    Number.isFinite(scheduleEndHour) && Number.isFinite(scheduleEndMinute) ? scheduleEndMinute : 0;

  const busy = appointments
    .filter((a) => a.professionalId === professionalId && a.status !== 'cancelled')
    .map((a) => ({
      start: new Date(a.startsAt),
      end: new Date(a.endsAt),
    }));

  const slots: Slot[] = [];
  const stepMinutes = 30;
  const durationMs = durationMinutes * 60 * 1000;

  for (let hour = effectiveStartHour; hour < effectiveEndHour + 1; hour += 1) {
    for (let minute = 0; minute < 60; minute += stepMinutes) {
      if (hour === effectiveStartHour && minute < effectiveStartMinute) {
        continue;
      }
      if (hour === effectiveEndHour && minute >= effectiveEndMinute) {
        continue;
      }

      const start = new Date(dayStart);
      start.setHours(hour, minute, 0, 0);
      const end = new Date(start.getTime() + durationMs);

      if (end.getHours() > effectiveEndHour || (end.getHours() === effectiveEndHour && end.getMinutes() > effectiveEndMinute)) {
        continue;
      }

      const overlaps = busy.some((b) => start < b.end && end > b.start);
      if (!overlaps) {
        slots.push({ startsAt: start.toISOString(), endsAt: end.toISOString() });
      }

      if (slots.length >= maxSlots) {
        return slots;
      }
    }
  }

  return slots;
}
