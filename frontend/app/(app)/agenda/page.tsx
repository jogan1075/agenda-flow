'use client';

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { formatISO } from 'date-fns';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ErrorDialog } from '@/components/ui/error-dialog';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { SectionHeader } from '@/components/section-header';
import { api } from '@/lib/api';
import { buildAvailableSlots } from '@/lib/availability';
import { useBusinessId } from '@/lib/use-business-id';
import { cn } from '@/lib/utils';

type AppointmentPayload = {
  customerId: string;
  professionalId: string;
  serviceId: string;
  startsAt: string;
  endsAt: string;
};

type CustomerCreatePayload = {
  businessId: string;
  fullName: string;
  phone: string;
  email?: string;
  isActive: boolean;
};

export default function AgendaPage() {
  const businessId = useBusinessId();
  const queryClient = useQueryClient();
  const today = formatISO(new Date(), { representation: 'date' });
  const [availabilityDate, setAvailabilityDate] = useState(today);
  const [availabilityServiceId, setAvailabilityServiceId] = useState('');
  const [availabilityProfessionalId, setAvailabilityProfessionalId] = useState('');
  const [selectedSlotStart, setSelectedSlotStart] = useState('');
  const [editingAppointmentId, setEditingAppointmentId] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [errorDialogMessage, setErrorDialogMessage] = useState('');
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ fullName: '', phone: '', email: '' });
  const [pendingCreatePayload, setPendingCreatePayload] = useState<Record<string, unknown> | null>(null);

  const from = `${availabilityDate}T00:00:00.000Z`;
  const to = `${availabilityDate}T23:59:59.000Z`;

  const appointmentsQuery = useQuery({
    queryKey: ['appointments', businessId, from, to],
    queryFn: () => api.listAppointments(businessId, from, to),
    enabled: !!businessId,
  });

  const customersQuery = useQuery({
    queryKey: ['customers', businessId],
    queryFn: () => api.listCustomers(businessId),
    enabled: !!businessId,
  });

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

  const { register, handleSubmit, reset, setValue, getValues, watch } = useForm<AppointmentPayload>({
    defaultValues: {
      customerId: '',
      professionalId: '',
      serviceId: '',
      startsAt: '',
      endsAt: '',
    },
  });

  const refreshAppointments = async () => {
    await queryClient.invalidateQueries({ queryKey: ['appointments', businessId] });
  };

  const createMutation = useMutation({
    mutationFn: api.createAppointment,
    onSuccess: async () => {
      await refreshAppointments();
      setSelectedSlotStart('');
      setFormMessage('Cita creada correctamente.');
      reset();
    },
    onError: (error) => {
      const detail = error instanceof Error ? error.message : 'Error desconocido';
      setErrorDialogMessage(`No se pudo crear la cita: ${detail}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
      api.updateAppointment(id, payload),
    onSuccess: async () => {
      await refreshAppointments();
      setSelectedSlotStart('');
      setEditingAppointmentId('');
      setFormMessage('Cita actualizada correctamente.');
      reset();
    },
    onError: (error) => {
      const detail = error instanceof Error ? error.message : 'Error desconocido';
      setErrorDialogMessage(`No se pudo actualizar la cita: ${detail}`);
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => api.updateAppointment(id, { status: 'cancelled' }),
    onSuccess: async () => {
      await refreshAppointments();
      setSelectedSlotStart('');
      setFormMessage('Cita cancelada. El bloque volvió a estar disponible.');
    },
    onError: (error) => {
      const detail = error instanceof Error ? error.message : 'Error desconocido';
      setErrorDialogMessage(`No se pudo eliminar/cancelar la cita: ${detail}`);
    },
  });
  const createCustomerMutation = useMutation({
    mutationFn: api.createCustomer,
    onError: (error) => {
      const detail = error instanceof Error ? error.message : 'Error desconocido';
      setErrorDialogMessage(`No se pudo crear el cliente: ${detail}`);
    },
  });

  const customersById = useMemo(
    () => new Map((customersQuery.data ?? []).map((c) => [String(c._id), String(c.fullName)])),
    [customersQuery.data],
  );

  const selectedService = useMemo(
    () => (servicesQuery.data ?? []).find((s) => String(s._id) === availabilityServiceId),
    [servicesQuery.data, availabilityServiceId],
  );
  const selectedProfessional = useMemo(
    () => (professionalsQuery.data ?? []).find((p) => String(p._id) === availabilityProfessionalId),
    [professionalsQuery.data, availabilityProfessionalId],
  );
  const professionalsForAvailability = useMemo(() => {
    if (!availabilityServiceId) {
      return professionalsQuery.data ?? [];
    }
    return (professionalsQuery.data ?? []).filter((professional) =>
      ((professional.serviceIds as Array<unknown> | undefined) ?? []).map(String).includes(availabilityServiceId),
    );
  }, [professionalsQuery.data, availabilityServiceId]);
  const formServiceId = watch('serviceId');
  const professionalsForForm = useMemo(() => {
    if (!formServiceId) {
      return professionalsQuery.data ?? [];
    }
    return (professionalsQuery.data ?? []).filter((professional) =>
      ((professional.serviceIds as Array<unknown> | undefined) ?? []).map(String).includes(formServiceId),
    );
  }, [professionalsQuery.data, formServiceId]);

  useEffect(() => {
    if (!availabilityProfessionalId) return;
    const stillAvailable = professionalsForAvailability.some(
      (professional) => String(professional._id) === availabilityProfessionalId,
    );
    if (!stillAvailable) {
      setAvailabilityProfessionalId('');
    }
  }, [availabilityProfessionalId, professionalsForAvailability]);

  useEffect(() => {
    const formProfessionalId = getValues('professionalId');
    if (!formProfessionalId) return;
    const stillAvailable = professionalsForForm.some((professional) => String(professional._id) === formProfessionalId);
    if (!stillAvailable) {
      setValue('professionalId', '');
    }
  }, [professionalsForForm, getValues, setValue]);

  const availableSlots = useMemo(() => {
    if (!selectedService || !availabilityProfessionalId) return [];

    return buildAvailableSlots({
      date: availabilityDate,
      durationMinutes: Number(selectedService.durationMinutes ?? 60),
      professionalId: availabilityProfessionalId,
      schedule: Array.isArray(selectedProfessional?.weeklySchedule)
        ? (selectedProfessional.weeklySchedule as Array<{
            day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
            startTime: string;
            endTime: string;
          }>)
        : [],
      appointments: (appointmentsQuery.data ?? [])
        .filter((a) => String(a._id) !== editingAppointmentId)
        .map((a) => ({
          professionalId: String(a.professionalId),
          startsAt: String(a.startsAt),
          endsAt: String(a.endsAt),
          status: String(a.status),
        })),
      maxSlots: 20,
    });
  }, [
    selectedService,
    selectedProfessional,
    availabilityProfessionalId,
    availabilityDate,
    appointmentsQuery.data,
    editingAppointmentId,
  ]);

  const toLocalDatetimeInput = (iso: string) => {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '';
    const pad = (v: number) => String(v).padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const toLocalDateInput = (iso: string) => {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return today;
    const pad = (v: number) => String(v).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  };

  const beginEdit = (appointment: Record<string, unknown>) => {
    const startsAt = String(appointment.startsAt);
    const endsAt = String(appointment.endsAt);
    setEditingAppointmentId(String(appointment._id));
    setAvailabilityDate(toLocalDateInput(startsAt));
    setAvailabilityServiceId(String(appointment.serviceId));
    setAvailabilityProfessionalId(String(appointment.professionalId));
    setSelectedSlotStart(startsAt);

    setValue('customerId', String(appointment.customerId));
    setValue('professionalId', String(appointment.professionalId));
    setValue('serviceId', String(appointment.serviceId));
    setValue('startsAt', toLocalDatetimeInput(startsAt));
    setValue('endsAt', toLocalDatetimeInput(endsAt));
    setFormMessage('Modo edición activo. Selecciona nuevo bloque y guarda cambios.');
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Agenda" subtitle="Visualiza disponibilidad y gestiona citas" />

      <Card>
        <h3 className="mb-3 text-sm font-semibold text-zinc-700">Disponibilidad por profesional</h3>
        <div className="grid gap-3 md:grid-cols-4">
          <Input
            type="date"
            value={availabilityDate}
            onChange={(event) => {
              setAvailabilityDate(event.target.value);
              setSelectedSlotStart('');
            }}
          />
          <Select
            value={availabilityServiceId}
            onChange={(event) => {
              setAvailabilityServiceId(event.target.value);
              setAvailabilityProfessionalId('');
              setSelectedSlotStart('');
            }}
          >
            <option value="">Selecciona servicio</option>
            {(servicesQuery.data ?? []).map((service) => (
              <option key={String(service._id)} value={String(service._id)}>
                {String(service.name)} ({String(service.durationMinutes)} min)
              </option>
            ))}
          </Select>
          <Select
            value={availabilityProfessionalId}
            onChange={(event) => {
              setAvailabilityProfessionalId(event.target.value);
              setSelectedSlotStart('');
            }}
          >
            <option value="">Selecciona profesional</option>
            {professionalsForAvailability.map((professional) => (
              <option key={String(professional._id)} value={String(professional._id)}>
                {String(professional.fullName)}
              </option>
            ))}
          </Select>
          <p className="flex items-center text-xs text-zinc-500">Slots entre 09:00 y 19:00</p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
          {availableSlots.length === 0 ? (
            <p className="col-span-full text-sm text-zinc-500">No hay horarios disponibles con la selección actual.</p>
          ) : (
            availableSlots.map((slot) => (
              <button
                key={slot.startsAt}
                type="button"
                className={cn(
                  'rounded-lg border px-3 py-2 text-left text-xs transition',
                  selectedSlotStart === slot.startsAt
                    ? 'border-zinc-900 bg-zinc-900 text-white'
                    : 'border-zinc-200 bg-zinc-50 hover:border-zinc-400 hover:bg-zinc-100',
                )}
                onClick={() => {
                  setSelectedSlotStart(slot.startsAt);
                  if (!getValues('customerId') && (customersQuery.data?.length ?? 0) === 1) {
                    setValue('customerId', String(customersQuery.data?.[0]?._id ?? ''));
                  }
                  setValue('serviceId', availabilityServiceId);
                  setValue('professionalId', availabilityProfessionalId);
                  setValue('startsAt', toLocalDatetimeInput(slot.startsAt), { shouldDirty: true, shouldValidate: true });
                  setValue('endsAt', toLocalDatetimeInput(slot.endsAt), { shouldDirty: true, shouldValidate: true });
                }}
              >
                <p className={cn('font-semibold', selectedSlotStart === slot.startsAt ? 'text-white' : 'text-zinc-800')}>
                  {new Date(slot.startsAt).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className={cn(selectedSlotStart === slot.startsAt ? 'text-zinc-200' : 'text-zinc-500')}>
                  {new Date(slot.startsAt).toLocaleDateString('es-CL')}
                </p>
              </button>
            ))
          )}
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 text-sm font-semibold text-zinc-700">
          {editingAppointmentId ? 'Modificar cita' : 'Agendar cita manual'}
        </h3>
        <form
          className="grid gap-3 md:grid-cols-2"
          onSubmit={handleSubmit(async (values) => {
            if (!businessId) return;
            const customerId = String(values.customerId ?? '').trim();
            const professionalId = String(values.professionalId ?? '').trim();
            const serviceId = String(values.serviceId ?? '').trim();
            const startsAt = String(values.startsAt ?? '').trim();
            const endsAt = String(values.endsAt ?? '').trim();
            const customerIdFromSingle =
              !customerId && (customersQuery.data?.length ?? 0) === 1
                ? String(customersQuery.data?.[0]?._id ?? '')
                : customerId;

            if (!professionalId || !serviceId || !startsAt || !endsAt) {
              setFormMessage('Completa cliente, profesional, servicio, inicio y fin de la cita.');
              return;
            }

            const payload = {
              customerId: customerIdFromSingle,
              professionalId,
              serviceId,
              startsAt: new Date(startsAt).toISOString(),
              endsAt: new Date(endsAt).toISOString(),
            };

            if (!editingAppointmentId && !customerIdFromSingle) {
              setPendingCreatePayload({
                ...payload,
                businessId,
                source: 'manual',
                status: 'confirmed',
              });
              setShowCustomerModal(true);
              return;
            }

            if (editingAppointmentId) {
              await updateMutation.mutateAsync({ id: editingAppointmentId, payload });
            } else {
              await createMutation.mutateAsync({
                ...payload,
                customerId: customerIdFromSingle,
                businessId,
                source: 'manual',
                status: 'confirmed',
              });
            }
          })}
        >
          <Select {...register('customerId')}>
            <option value="">Cliente (o crear nuevo al guardar)</option>
            {(customersQuery.data ?? []).map((customer) => (
              <option key={String(customer._id)} value={String(customer._id)}>
                {String(customer.fullName)}
              </option>
            ))}
          </Select>
          <Select {...register('professionalId')}>
            <option value="">Profesional</option>
            {professionalsForForm.map((professional) => (
              <option key={String(professional._id)} value={String(professional._id)}>
                {String(professional.fullName)}
              </option>
            ))}
          </Select>
          <Select
            {...register('serviceId')}
            onChange={(event) => {
              setValue('serviceId', event.target.value, { shouldDirty: true, shouldValidate: true });
              setValue('professionalId', '');
            }}
          >
            <option value="">Servicio</option>
            {(servicesQuery.data ?? []).map((service) => (
              <option key={String(service._id)} value={String(service._id)}>
                {String(service.name)}
              </option>
            ))}
          </Select>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Input type="datetime-local" {...register('startsAt')} />
            <Input type="datetime-local" {...register('endsAt')} />
          </div>
          <Button className="md:col-span-2" disabled={createMutation.isPending || updateMutation.isPending}>
            {editingAppointmentId ? 'Guardar cambios' : 'Crear Cita'}
          </Button>
          {editingAppointmentId ? (
            <Button
              type="button"
              variant="outline"
              className="md:col-span-2"
              onClick={() => {
                setEditingAppointmentId('');
                setSelectedSlotStart('');
                setFormMessage('Edición cancelada.');
                reset();
              }}
            >
              Cancelar edición
            </Button>
          ) : null}
          {formMessage ? (
            <p className="md:col-span-2 rounded-lg bg-zinc-100 p-2 text-xs text-zinc-700">{formMessage}</p>
          ) : null}
        </form>
      </Card>

      <Card>
        <h3 className="mb-3 text-sm font-semibold text-zinc-700">Citas de la fecha seleccionada</h3>
        <div className="overflow-x-auto">
          <table className="min-w-[760px] text-sm">
            <thead className="text-left text-zinc-500">
              <tr>
                <th className="py-2">Hora</th>
                <th>Cliente</th>
                <th>Estado</th>
                <th>Origen</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {(appointmentsQuery.data ?? []).map((appointment) => (
                <tr
                  key={String(appointment._id)}
                  className={cn(
                    'border-t border-zinc-100',
                    editingAppointmentId === String(appointment._id) ? 'bg-amber-50' : '',
                  )}
                >
                  <td className="py-2">{new Date(String(appointment.startsAt)).toLocaleString('es-CL')}</td>
                  <td>{customersById.get(String(appointment.customerId)) ?? String(appointment.customerId)}</td>
                  <td>{String(appointment.status)}</td>
                  <td>{String(appointment.source)}</td>
                  <td>
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" variant="outline" onClick={() => beginEdit(appointment)}>
                        Modificar
                      </Button>
                      <Button
                        type="button"
                        variant="danger"
                        disabled={String(appointment.status) === 'cancelled' || cancelMutation.isPending}
                        onClick={() => {
                          void cancelMutation.mutateAsync(String(appointment._id));
                          if (editingAppointmentId === String(appointment._id)) {
                            setEditingAppointmentId('');
                            reset();
                          }
                        }}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {showCustomerModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md space-y-3">
            <h3 className="text-base font-semibold text-zinc-800">Crear cliente y continuar</h3>
            <Input
              placeholder="Nombre del cliente"
              value={newCustomer.fullName}
              onChange={(event) => setNewCustomer((prev) => ({ ...prev, fullName: event.target.value }))}
            />
            <Input
              placeholder="Telefono (+569...)"
              value={newCustomer.phone}
              onChange={(event) => setNewCustomer((prev) => ({ ...prev, phone: event.target.value }))}
            />
            <Input
              placeholder="Email (opcional)"
              type="email"
              value={newCustomer.email}
              onChange={(event) => setNewCustomer((prev) => ({ ...prev, email: event.target.value }))}
            />
            <div className="flex gap-2">
              <Button
                disabled={createCustomerMutation.isPending}
                onClick={async () => {
                  if (!businessId || !pendingCreatePayload) return;
                  if (!newCustomer.fullName.trim() || !newCustomer.phone.trim()) {
                    setErrorDialogMessage('Para crear cliente debes completar nombre y telefono.');
                    return;
                  }

                  const created = (await createCustomerMutation.mutateAsync({
                    businessId,
                    fullName: newCustomer.fullName.trim(),
                    phone: newCustomer.phone.trim(),
                    email: newCustomer.email.trim() || undefined,
                    isActive: true,
                  } as CustomerCreatePayload)) as Record<string, unknown>;

                  const customerId = String(created._id ?? '');
                  if (!customerId) {
                    setErrorDialogMessage('No se pudo obtener el ID del cliente creado.');
                    return;
                  }

                  await createMutation.mutateAsync({
                    ...pendingCreatePayload,
                    customerId,
                  });
                  setShowCustomerModal(false);
                  setPendingCreatePayload(null);
                  setNewCustomer({ fullName: '', phone: '', email: '' });
                  await queryClient.invalidateQueries({ queryKey: ['customers', businessId] });
                }}
              >
                Crear cliente y agendar
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCustomerModal(false);
                  setPendingCreatePayload(null);
                }}
              >
                Cancelar
              </Button>
            </div>
          </Card>
        </div>
      ) : null}

      <ErrorDialog message={errorDialogMessage} onClose={() => setErrorDialogMessage('')} />
    </div>
  );
}
