'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  addDays,
  addWeeks,
  compareAsc,
  endOfDay,
  endOfWeek,
  format,
  isSameDay,
  parseISO,
  startOfDay,
  startOfWeek,
} from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SectionHeader } from '@/components/section-header';
import { api } from '@/lib/api';
import { useBusinessId } from '@/lib/use-business-id';
import { cn } from '@/lib/utils';

type Appointment = Record<string, unknown> & {
  _id?: string;
  customerId?: string;
  professionalId?: string;
  serviceId?: string;
  startsAt?: string;
  endsAt?: string;
  status?: string;
};

export default function CalendarioPage() {
  const businessId = useBusinessId();
  const [weekAnchor, setWeekAnchor] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selectedProfessionalId, setSelectedProfessionalId] = useState('');

  const weekStart = startOfWeek(weekAnchor, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(weekAnchor, { weekStartsOn: 1 });
  const from = startOfDay(weekStart).toISOString();
  const to = endOfDay(weekEnd).toISOString();

  const professionalsQuery = useQuery({
    queryKey: ['professionals', businessId],
    queryFn: () => api.listProfessionals(businessId),
    enabled: !!businessId,
  });

  const servicesQuery = useQuery({
    queryKey: ['services', businessId],
    queryFn: () => api.listServices(businessId),
    enabled: !!businessId,
  });

  const customersQuery = useQuery({
    queryKey: ['customers', businessId],
    queryFn: () => api.listCustomers(businessId),
    enabled: !!businessId,
  });

  const appointmentsQuery = useQuery({
    queryKey: ['appointments', businessId, from, to],
    queryFn: () => api.listAppointments(businessId, from, to),
    enabled: !!businessId,
  });

  const serviceNameById = useMemo(
    () => new Map((servicesQuery.data ?? []).map((s) => [String(s._id), String(s.name)])),
    [servicesQuery.data],
  );

  const customerNameById = useMemo(
    () => new Map((customersQuery.data ?? []).map((c) => [String(c._id), String(c.fullName)])),
    [customersQuery.data],
  );

  const professionalsById = useMemo(
    () => new Map((professionalsQuery.data ?? []).map((p) => [String(p._id), p])),
    [professionalsQuery.data],
  );

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, index) => addDays(weekStart, index));
  }, [weekStart]);

  const filteredAppointments = useMemo(() => {
    const items = (appointmentsQuery.data ?? []) as Appointment[];
    return items.filter((appointment) => {
      if (!selectedProfessionalId) return true;
      return String(appointment.professionalId) === selectedProfessionalId;
    });
  }, [appointmentsQuery.data, selectedProfessionalId]);

  const appointmentsByDay = useMemo(() => {
    return weekDays.map((day) =>
      filteredAppointments
        .filter((appointment) => {
          if (!appointment.startsAt) return false;
          return isSameDay(parseISO(String(appointment.startsAt)), day);
        })
        .sort((a, b) => compareAsc(new Date(String(a.startsAt)), new Date(String(b.startsAt)))),
    );
  }, [filteredAppointments, weekDays]);

  return (
    <div className="space-y-6">
      <SectionHeader title="Calendario semanal" subtitle="Filtra por profesional y revisa todas las citas de la semana." />

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Semana</p>
            <p className="text-lg font-semibold text-zinc-900">
              {format(weekStart, 'dd MMM')} - {format(weekEnd, 'dd MMM yyyy')}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => setWeekAnchor(addWeeks(weekAnchor, -1))}>
              Semana anterior
            </Button>
            <Button type="button" variant="outline" onClick={() => setWeekAnchor(new Date())}>
              Semana actual
            </Button>
            <Button type="button" variant="outline" onClick={() => setWeekAnchor(addWeeks(weekAnchor, 1))}>
              Semana siguiente
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setSelectedProfessionalId('')}
            className={cn(
              'flex items-center gap-3 rounded-full border px-3 py-2 text-sm transition',
              !selectedProfessionalId
                ? 'border-zinc-900 bg-zinc-900 text-white'
                : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300',
            )}
          >
            <span className="h-9 w-9 rounded-full bg-zinc-100 text-[11px] font-semibold text-zinc-500 flex items-center justify-center">
              Todos
            </span>
            <span className="font-medium">Todos los profesionales</span>
          </button>
          {(professionalsQuery.data ?? []).map((professional) => {
            const id = String(professional._id);
            const active = selectedProfessionalId === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedProfessionalId(id)}
                className={cn(
                  'flex items-center gap-3 rounded-full border px-3 py-2 text-sm transition',
                  active
                    ? 'border-zinc-900 bg-zinc-900 text-white'
                    : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300',
                )}
              >
                <span className="h-9 w-9 overflow-hidden rounded-full border border-zinc-200 bg-zinc-50">
                  {professional.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={String(professional.photoUrl)} alt={String(professional.fullName)} className="h-full w-full object-cover" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-[10px] text-zinc-400">N/A</span>
                  )}
                </span>
                <span className="font-medium">{String(professional.fullName)}</span>
              </button>
            );
          })}
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <div className="grid min-w-[960px] grid-cols-7 gap-3">
            {weekDays.map((day, index) => (
              <div key={day.toISOString()} className="rounded-2xl border border-zinc-100 bg-white p-3">
                <div className="mb-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">{format(day, 'EEE')}</p>
                  <p className="text-sm font-semibold text-zinc-900">{format(day, 'dd MMM')}</p>
                </div>
                <div className="space-y-3">
                  {appointmentsByDay[index]?.length ? (
                    appointmentsByDay[index].map((appointment) => {
                      const startsAt = appointment.startsAt ? new Date(String(appointment.startsAt)) : null;
                      const endsAt = appointment.endsAt ? new Date(String(appointment.endsAt)) : null;
                      const professional = professionalsById.get(String(appointment.professionalId));
                      return (
                        <div key={String(appointment._id)} className="rounded-xl border border-zinc-100 bg-zinc-50 p-3">
                          <p className="text-xs text-zinc-500">
                            {startsAt ? format(startsAt, 'HH:mm') : '--:--'} -{' '}
                            {endsAt ? format(endsAt, 'HH:mm') : '--:--'}
                          </p>
                          <p className="mt-1 text-sm font-semibold text-zinc-900">
                            {customerNameById.get(String(appointment.customerId)) ?? 'Cliente sin nombre'}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {serviceNameById.get(String(appointment.serviceId)) ?? 'Servicio'} ·{' '}
                            {professional ? String(professional.fullName) : 'Profesional'}
                          </p>
                          <span
                            className={cn(
                              'mt-2 inline-flex rounded-full px-2 py-0.5 text-[11px]',
                              String(appointment.status) === 'cancelled'
                                ? 'bg-rose-50 text-rose-600'
                                : 'bg-emerald-50 text-emerald-700',
                            )}
                          >
                            {String(appointment.status ?? 'confirmed')}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <p className="rounded-lg bg-zinc-50 p-2 text-xs text-zinc-400">Sin citas</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
