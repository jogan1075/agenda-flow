'use client';

import { useEffect, useMemo, useState } from 'react';
import { addDays, formatISO } from 'date-fns';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { api } from '@/lib/api';
import { buildAvailableSlots, Slot } from '@/lib/availability';
import { cn } from '@/lib/utils';

type BookingForm = {
  businessId: string;
  fullName: string;
  phone: string;
  email: string;
  serviceId: string;
  professionalId: string;
};

type DayOption = {
  key: string;
  label: string;
  isoDate: string;
};

function normalizePhone(phone: string) {
  const cleaned = phone.replace(/[^\d+]/g, '');
  return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
}

function dayNameFromDate(date: Date) {
  const names = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return names[date.getDay()] as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
}

function isNowWithinBusinessHours(day: string, openingHours: Array<Record<string, unknown>>) {
  const now = new Date();
  const row = openingHours.find((item) => String(item.day) === day);
  if (!row || row.isOpen === false) return false;

  const opens = String(row.opensAt ?? '09:00').split(':').map(Number);
  const closes = String(row.closesAt ?? '19:00').split(':').map(Number);

  const start = new Date(now);
  start.setHours(opens[0] ?? 9, opens[1] ?? 0, 0, 0);

  const end = new Date(now);
  end.setHours(closes[0] ?? 19, closes[1] ?? 0, 0, 0);

  return now >= start && now <= end;
}

function weekOptionsFromToday() {
  return Array.from({ length: 7 }).map((_, index) => {
    const date = addDays(new Date(), index);
    return {
      key: formatISO(date, { representation: 'date' }),
      isoDate: formatISO(date, { representation: 'date' }),
      label: date.toLocaleDateString('es-CL', { weekday: 'short', day: '2-digit', month: '2-digit' }),
    } satisfies DayOption;
  });
}

export default function ReservasPage() {
  const queryClient = useQueryClient();
  const [businessIdFromStorage] = useState(() => {
    const fromEnv = process.env.NEXT_PUBLIC_DEFAULT_BUSINESS_ID ?? '';
    if (typeof window === 'undefined') return '';
    return window.localStorage.getItem('public_booking_business_id') ?? fromEnv;
  });

  const [form, setForm] = useState<BookingForm>({
    businessId: businessIdFromStorage,
    fullName: '',
    phone: '',
    email: '',
    serviceId: '',
    professionalId: '',
  });
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [summary, setSummary] = useState<Record<string, unknown> | null>(null);
  const [message, setMessage] = useState('');

  const businessQuery = useQuery({
    queryKey: ['public-business', form.businessId],
    queryFn: () => api.getBusinesses(form.businessId),
    enabled: !!form.businessId,
  });

  const todayIso = formatISO(new Date(), { representation: 'date' });
  const from = `${todayIso}T00:00:00.000Z`;
  const to = `${formatISO(addDays(new Date(), 7), { representation: 'date' })}T23:59:59.000Z`;

  const servicesQuery = useQuery({
    queryKey: ['public-services', form.businessId],
    queryFn: () => api.listServices(form.businessId),
    enabled: !!form.businessId,
  });

  const professionalsQuery = useQuery({
    queryKey: ['public-professionals', form.businessId],
    queryFn: () => api.listProfessionals(form.businessId),
    enabled: !!form.businessId,
  });

  const appointmentsQuery = useQuery({
    queryKey: ['public-appointments', form.businessId, from, to],
    queryFn: () => api.listAppointments(form.businessId, from, to),
    enabled: !!form.businessId,
  });

  const selectedService = useMemo(
    () => (servicesQuery.data ?? []).find((service) => String(service._id) === form.serviceId),
    [servicesQuery.data, form.serviceId],
  );
  const serviceNameById = useMemo(
    () => new Map((servicesQuery.data ?? []).map((service) => [String(service._id), String(service.name)])),
    [servicesQuery.data],
  );

  const selectedProfessional = useMemo(
    () => (professionalsQuery.data ?? []).find((professional) => String(professional._id) === form.professionalId),
    [professionalsQuery.data, form.professionalId],
  );
  const availableServices = useMemo(() => {
    if (!selectedProfessional) {
      return servicesQuery.data ?? [];
    }

    const serviceIds = new Set(
      ((selectedProfessional.serviceIds as Array<unknown> | undefined) ?? []).map((serviceId) => String(serviceId)),
    );
    if (serviceIds.size === 0) {
      return servicesQuery.data ?? [];
    }

    return (servicesQuery.data ?? []).filter((service) => serviceIds.has(String(service._id)));
  }, [selectedProfessional, servicesQuery.data]);

  const weekDays = useMemo(() => weekOptionsFromToday(), []);

  useEffect(() => {
    if (!selectedProfessional) return;

    const professionalServiceIds = Array.from(
      new Set(
        ((selectedProfessional.serviceIds as Array<unknown> | undefined) ?? []).map((serviceId) => String(serviceId)),
      ),
    );
    if (professionalServiceIds.length === 1) {
      const [onlyServiceId] = professionalServiceIds;
      if (form.serviceId !== onlyServiceId) {
        setForm((prev) => ({ ...prev, serviceId: onlyServiceId }));
        setSelectedSlot(null);
      }
      return;
    }

    if (professionalServiceIds.length > 1 && form.serviceId && !professionalServiceIds.includes(form.serviceId)) {
      setForm((prev) => ({ ...prev, serviceId: '' }));
      setSelectedSlot(null);
    }
  }, [selectedProfessional, form.serviceId]);

  const preselectedDay = useMemo(() => {
    if (!selectedService || !form.professionalId) return todayIso;

    const openingHours = ((businessQuery.data as Record<string, unknown> | undefined)?.openingHours ?? []) as Array<
      Record<string, unknown>
    >;
    const appointments = (appointmentsQuery.data ?? []).map((appointment) => ({
      professionalId: String(appointment.professionalId),
      startsAt: String(appointment.startsAt),
      endsAt: String(appointment.endsAt),
      status: String(appointment.status),
    }));
    const professionalSchedule = Array.isArray(selectedProfessional?.weeklySchedule)
      ? (selectedProfessional.weeklySchedule as Array<{
          day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
          startTime: string;
          endTime: string;
        }>)
      : [];
    const now = new Date();

    const hasFutureSlotsInDate = (dateIso: string) =>
      buildAvailableSlots({
        date: dateIso,
        durationMinutes: Number(selectedService.durationMinutes ?? 60),
        professionalId: form.professionalId,
        schedule: professionalSchedule,
        appointments,
        maxSlots: 30,
      }).some((slot) => new Date(slot.startsAt) > now);

    const today = new Date();
    const currentDayIso = formatISO(today, { representation: 'date' });
    const todayName = dayNameFromDate(today);
    const hasValidTodayHours = isNowWithinBusinessHours(todayName, openingHours);

    if (hasValidTodayHours && hasFutureSlotsInDate(currentDayIso)) {
      return currentDayIso;
    }

    const candidates = weekDays.slice(1).map((day) => day.isoDate);
    const nextWithSlots = candidates.find((dateIso) => hasFutureSlotsInDate(dateIso));
    if (nextWithSlots) return nextWithSlots;

    const tomorrow = formatISO(addDays(today, 1), { representation: 'date' });
    return tomorrow;
  }, [
    selectedService,
    selectedProfessional,
    form.professionalId,
    businessQuery.data,
    appointmentsQuery.data,
    todayIso,
    weekDays,
  ]);

  const displaySelectedDay = selectedDay || preselectedDay;

  const slotsForSelectedDay = useMemo(() => {
    if (!selectedService || !form.professionalId) return [];

    const now = new Date();
    return buildAvailableSlots({
      date: displaySelectedDay,
      durationMinutes: Number(selectedService.durationMinutes ?? 60),
      professionalId: form.professionalId,
      schedule: Array.isArray(selectedProfessional?.weeklySchedule)
        ? (selectedProfessional.weeklySchedule as Array<{
            day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
            startTime: string;
            endTime: string;
          }>)
        : [],
      appointments: (appointmentsQuery.data ?? []).map((appointment) => ({
        professionalId: String(appointment.professionalId),
        startsAt: String(appointment.startsAt),
        endsAt: String(appointment.endsAt),
        status: String(appointment.status),
      })),
      maxSlots: 30,
    }).filter((slot) => new Date(slot.startsAt) > now);
  }, [selectedService, selectedProfessional, form.professionalId, displaySelectedDay, appointmentsQuery.data]);

  const bookingMutation = useMutation({
    mutationFn: () => {
      if (!selectedSlot) throw new Error('Selecciona un horario');

      return api.reservePublic({
        businessId: form.businessId,
        fullName: form.fullName,
        phone: normalizePhone(form.phone),
        email: form.email || undefined,
        serviceId: form.serviceId,
        professionalId: form.professionalId,
        startsAt: selectedSlot.startsAt,
        endsAt: selectedSlot.endsAt,
      });
    },
    onSuccess: (result) => {
      setSummary(result.summary as Record<string, unknown>);
      const notifications = result.notifications;
      const waText = notifications?.whatsappSent ? 'WhatsApp enviado' : 'WhatsApp no enviado';
      const emailText = notifications?.emailSent
        ? 'Correo enviado'
        : `Correo no enviado (${notifications?.emailReason ?? 'sin detalle'})`;
      setMessage(`Reserva confirmada. ${waText}. ${emailText}.`);
      queryClient.invalidateQueries({ queryKey: ['public-appointments', form.businessId] });
    },
    onError: (error) => {
      const detail = error instanceof Error ? error.message : 'Error desconocido';
      setMessage(`No se pudo confirmar la reserva: ${detail}`);
    },
  });

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_10%_10%,#fef9c3_0%,#f8fafc_35%,#ffffff_100%)] p-4">
      <div className="mx-auto max-w-5xl space-y-6 py-6 md:py-8">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Reserva Online</p>
          <h1 className="text-3xl font-semibold text-zinc-900">Agenda tu cita</h1>
          <p className="text-sm text-zinc-500">Elige profesional, servicio, semana y horario disponible.</p>
        </div>

        <Card className="space-y-3">
          <Input
            placeholder="Sucursal (informativo)"
            value={String((businessQuery.data as Record<string, unknown> | undefined)?.name ?? '')}
            disabled
          />
        </Card>

        <Card className="space-y-3">
          <h2 className="text-sm font-semibold text-zinc-700">1) Elige profesional</h2>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {(professionalsQuery.data ?? []).map((professional) => {
              const isActive = String(professional._id) === form.professionalId;
              return (
                <button
                  key={String(professional._id)}
                  type="button"
                  className={cn(
                    'rounded-xl border p-3 text-left transition',
                    isActive ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-200 bg-white hover:border-zinc-400',
                  )}
                  onClick={() => {
                    setForm((prev) => ({ ...prev, professionalId: String(professional._id) }));
                    setSelectedDay('');
                    setSelectedSlot(null);
                  }}
                >
                  <div className="mb-2 h-16 w-16 overflow-hidden rounded-full border border-zinc-200 bg-zinc-50">
                    {professional.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={String(professional.photoUrl)} alt={String(professional.fullName)} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-zinc-400">Sin foto</div>
                    )}
                  </div>
                  <p className={cn('font-medium', isActive ? 'text-white' : 'text-zinc-900')}>{String(professional.fullName)}</p>
                  <p className={cn('mt-1 text-xs', isActive ? 'text-zinc-200' : 'text-zinc-500')}>
                    {((professional.serviceIds as Array<unknown> | undefined) ?? [])
                      .map((serviceId) => serviceNameById.get(String(serviceId)) ?? String(serviceId))
                      .join(', ') || 'Sin servicios asociados'}
                  </p>
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="space-y-3">
          <h2 className="text-sm font-semibold text-zinc-700">2) Elige servicio</h2>
          <Select
            value={form.serviceId}
            onChange={(event) => {
              setForm((prev) => ({ ...prev, serviceId: event.target.value }));
              setSelectedSlot(null);
            }}
          >
            <option value="">Selecciona servicio</option>
            {availableServices.map((service) => (
              <option key={String(service._id)} value={String(service._id)}>
                {String(service.name)} - {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(Number(service.price ?? 0))} ({String(service.durationMinutes)} min)
              </option>
            ))}
          </Select>
        </Card>

        <Card className="space-y-3">
          <h2 className="text-sm font-semibold text-zinc-700">3) Elige dia de la semana en curso</h2>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-7">
            {weekDays.map((day) => (
              <button
                key={day.key}
                type="button"
                className={cn(
                  'rounded-lg border px-3 py-2 text-xs font-medium transition',
                  displaySelectedDay === day.isoDate
                    ? 'border-zinc-900 bg-zinc-900 text-white'
                    : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-400',
                )}
                onClick={() => {
                  setSelectedDay(day.isoDate);
                  setSelectedSlot(null);
                }}
              >
                {day.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-zinc-500">Preseleccionado automaticamente segun horario actual del local.</p>
        </Card>

        <Card>
          <h2 className="mb-3 text-sm font-semibold text-zinc-700">4) Horarios disponibles</h2>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
            {slotsForSelectedDay.length === 0 ? (
              <p className="col-span-full text-sm text-zinc-500">No hay horarios disponibles para este dia.</p>
            ) : (
              slotsForSelectedDay.map((slot) => (
                <button
                  key={slot.startsAt}
                  type="button"
                  className={cn(
                    'rounded-lg border px-3 py-2 text-left transition',
                    selectedSlot?.startsAt === slot.startsAt
                      ? 'border-zinc-900 bg-zinc-900 text-white'
                      : 'border-zinc-200 bg-zinc-50 hover:border-zinc-400',
                  )}
                  onClick={() => setSelectedSlot(slot)}
                >
                  <p className="text-sm font-semibold">
                    {new Date(slot.startsAt).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className={cn('text-xs', selectedSlot?.startsAt === slot.startsAt ? 'text-zinc-200' : 'text-zinc-500')}>
                    {new Date(slot.startsAt).toLocaleDateString('es-CL')}
                  </p>
                </button>
              ))
            )}
          </div>
        </Card>

        {selectedSlot ? (
          <Card className="space-y-3">
            <h2 className="text-sm font-semibold text-zinc-700">5) Completa tus datos de contacto</h2>
            <div className="grid gap-3 md:grid-cols-3">
              <Input
                placeholder="Nombre"
                value={form.fullName}
                onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
              />
              <Input
                placeholder="Telefono WhatsApp (+569...)"
                value={form.phone}
                onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
              />
              <Input
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              />
            </div>
            <Button
              disabled={bookingMutation.isPending}
              onClick={() => {
                if (!form.businessId || !form.professionalId || !form.serviceId || !selectedSlot) {
                  setMessage('Completa profesional, servicio y horario antes de reservar.');
                  return;
                }
                if (!form.fullName.trim() || !form.phone.trim()) {
                  setMessage('Completa nombre y telefono para confirmar la reserva.');
                  return;
                }
                setMessage('');
                bookingMutation.mutate();
              }}
            >
              Confirmar reserva
            </Button>
          </Card>
        ) : null}

        {summary ? (
          <Card className="space-y-2 border-emerald-200 bg-emerald-50">
            <h3 className="text-lg font-semibold text-emerald-900">Resumen de tu reserva</h3>
            <p className="text-sm text-emerald-900">Servicio: {String(summary.serviceName ?? '-')}</p>
            <p className="text-sm text-emerald-900">Profesional: {String(summary.professionalName ?? '-')}</p>
            <p className="text-sm text-emerald-900">Fecha: {String(summary.date ?? '-')}</p>
            <p className="text-sm text-emerald-900">Hora: {String(summary.time ?? '-')}</p>
            <p className="text-sm text-emerald-900">
              Monto: {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(Number(summary.servicePrice ?? 0))}
            </p>
          </Card>
        ) : null}

        {message ? <p className="rounded-lg bg-zinc-100 p-3 text-sm text-zinc-700">{message}</p> : null}

        <Button variant="outline" onClick={() => window.location.assign('/login')}>
          Ir al panel interno
        </Button>
      </div>
    </div>
  );
}
