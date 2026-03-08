'use client';

import { ChangeEvent, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ErrorDialog } from '@/components/ui/error-dialog';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { SectionHeader } from '@/components/section-header';
import { api } from '@/lib/api';
import { useBusinessId } from '@/lib/use-business-id';

type WeekDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

type ScheduleItem = {
  day: WeekDay;
  enabled: boolean;
  startTime: string;
  endTime: string;
};

type ProfessionalForm = {
  fullName: string;
  email: string;
  phone: string;
  serviceId: string;
  commissionPercent: string;
  photoUrl: string;
  schedulePreset: 'part_time' | 'full_time' | 'weekends';
};

const DAYS: Array<{ key: WeekDay; label: string }> = [
  { key: 'monday', label: 'Lunes' },
  { key: 'tuesday', label: 'Martes' },
  { key: 'wednesday', label: 'Miercoles' },
  { key: 'thursday', label: 'Jueves' },
  { key: 'friday', label: 'Viernes' },
  { key: 'saturday', label: 'Sabado' },
  { key: 'sunday', label: 'Domingo' },
];

function baseSchedule(): ScheduleItem[] {
  return DAYS.map((day) => ({
    day: day.key,
    enabled: day.key !== 'sunday',
    startTime: '09:00',
    endTime: '19:00',
  }));
}

function getScheduleFromPreset(preset: ProfessionalForm['schedulePreset']): ScheduleItem[] {
  return DAYS.map((day) => {
    const enabled =
      preset === 'full_time'
        ? true
        : preset === 'weekends'
          ? day.key === 'saturday' || day.key === 'sunday'
          : day.key !== 'saturday' && day.key !== 'sunday';

    return {
      day: day.key,
      enabled,
      startTime: '09:00',
      endTime: '19:00',
    };
  });
}

function normalizeScheduleForPayload(schedule: ScheduleItem[]) {
  return schedule
    .filter((item) => item.enabled)
    .map((item) => ({
      day: item.day,
      startTime: item.startTime,
      endTime: item.endTime,
    }));
}

function scheduleText(schedule: unknown): string {
  if (!Array.isArray(schedule) || schedule.length === 0) {
    return 'Sin horario configurado';
  }

  const readable = schedule
    .map((item) => {
      const row = item as { day?: string; startTime?: string; endTime?: string };
      const label = DAYS.find((day) => day.key === row.day)?.label ?? row.day ?? 'Dia';
      return `${label}: ${row.startTime ?? '--:--'}-${row.endTime ?? '--:--'}`;
    })
    .join(' | ');

  return readable;
}

export default function ProfesionalesPage() {
  const businessId = useBusinessId();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState('');
  const [message, setMessage] = useState('');
  const [errorDialogMessage, setErrorDialogMessage] = useState('');
  const [form, setForm] = useState<ProfessionalForm>({
    fullName: '',
    email: '',
    phone: '',
    serviceId: '',
    commissionPercent: '0',
    photoUrl: '',
    schedulePreset: 'part_time',
  });
  const [weeklySchedule, setWeeklySchedule] = useState<ScheduleItem[]>(baseSchedule);
  const [selectedPhotoName, setSelectedPhotoName] = useState('');

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

  const businessQuery = useQuery({
    queryKey: ['business', businessId],
    queryFn: () => api.getBusinesses(businessId),
    enabled: !!businessId,
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['professionals', businessId] });

  const createMutation = useMutation({
    mutationFn: api.createProfessional,
    onSuccess: async () => {
      await refresh();
      resetForm();
      setMessage('Profesional creado correctamente.');
    },
    onError: (error) => {
      const detail = error instanceof Error ? error.message : 'Error desconocido';
      setErrorDialogMessage(`No se pudo crear el profesional: ${detail}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
      api.updateProfessional(id, payload),
    onSuccess: async () => {
      await refresh();
      resetForm();
      setMessage('Profesional actualizado correctamente.');
    },
    onError: (error) => {
      const detail = error instanceof Error ? error.message : 'Error desconocido';
      setErrorDialogMessage(`No se pudo actualizar el profesional: ${detail}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteProfessional(id),
    onSuccess: async () => {
      await refresh();
      setMessage('Profesional eliminado correctamente.');
    },
  });

  const selectedCount = useMemo(() => weeklySchedule.filter((day) => day.enabled).length, [weeklySchedule]);
  const serviceNameById = useMemo(
    () => new Map((servicesQuery.data ?? []).map((service) => [String(service._id), String(service.name)])),
    [servicesQuery.data],
  );
  const isBeautyBusiness = useMemo(() => {
    const business = businessQuery.data as Record<string, unknown> | undefined;
    return String(business?.businessCategory ?? '') === 'ESTETICA_Y_BELLEZA';
  }, [businessQuery.data]);

  const resetForm = () => {
    setEditingId('');
    setForm({
      fullName: '',
      email: '',
      phone: '',
      serviceId: '',
      commissionPercent: '0',
      photoUrl: '',
      schedulePreset: 'part_time',
    });
    setWeeklySchedule(baseSchedule());
    setSelectedPhotoName('');
  };

  const handlePhotoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedPhotoName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      setForm((prev) => ({ ...prev, photoUrl: result }));
    };
    reader.readAsDataURL(file);
  };

  const submitForm = async () => {
    if (!businessId) return;

    const fullName = form.fullName.trim();
    if (!fullName) {
      setErrorDialogMessage('El nombre del profesional es obligatorio.');
      return;
    }
    if (!form.serviceId) {
      setErrorDialogMessage('Selecciona al menos un servicio para el profesional.');
      return;
    }

    const payload = {
      businessId,
      fullName,
      email: form.email.trim() || undefined,
      phone: form.phone.trim() || undefined,
      photoUrl: isBeautyBusiness ? form.photoUrl || undefined : undefined,
      commissionPercent: isBeautyBusiness ? Number(form.commissionPercent || '0') : 0,
      weeklySchedule: normalizeScheduleForPayload(weeklySchedule),
      isActive: true,
      serviceIds: [form.serviceId],
    };

    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
  };

  const loadForEdit = (professional: Record<string, unknown>) => {
    const schedule = Array.isArray(professional.weeklySchedule)
      ? (professional.weeklySchedule as Array<{ day: WeekDay; startTime: string; endTime: string }>).reduce(
          (acc, row) => {
            const existing = acc.find((item) => item.day === row.day);
            if (!existing) return acc;
            existing.enabled = true;
            existing.startTime = row.startTime;
            existing.endTime = row.endTime;
            return acc;
          },
          DAYS.map((day) => ({
            day: day.key,
            enabled: false,
            startTime: '09:00',
            endTime: '19:00',
          })),
        )
      : baseSchedule();

    setEditingId(String(professional._id));
    setForm({
      fullName: String(professional.fullName ?? ''),
      email: String(professional.email ?? ''),
      phone: String(professional.phone ?? ''),
      serviceId: String((professional.serviceIds as Array<unknown> | undefined)?.[0] ?? ''),
      commissionPercent: String(professional.commissionPercent ?? '0'),
      photoUrl: String(professional.photoUrl ?? ''),
      schedulePreset: 'part_time',
    });
    setWeeklySchedule(schedule);
    setMessage('Modo edicion activo.');
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Profesionales"
        subtitle={
          isBeautyBusiness
            ? 'Perfil, comision y horario laboral'
            : 'Perfil y horario laboral (sin foto ni comision para este rubro)'
        }
      />
      <Card>
        <div className="grid gap-3 md:grid-cols-5">
          <Input
            placeholder="Nombre"
            value={form.fullName}
            onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
          />
          <Input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          />
          <Input
            placeholder="Telefono"
            value={form.phone}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
          />
          <Select
            value={form.serviceId}
            onChange={(event) => setForm((prev) => ({ ...prev, serviceId: event.target.value }))}
          >
            <option value="">Servicio que presta</option>
            {(servicesQuery.data ?? []).map((service) => (
              <option key={String(service._id)} value={String(service._id)}>
                {String(service.name)}
              </option>
            ))}
          </Select>
          {isBeautyBusiness ? (
            <Input
              type="number"
              min={0}
              max={100}
              placeholder="Comision % (ej: 35)"
              value={form.commissionPercent}
              onChange={(event) => setForm((prev) => ({ ...prev, commissionPercent: event.target.value }))}
            />
          ) : null}
        </div>
        {isBeautyBusiness ? (
          <>
            <p className="mt-2 text-xs text-zinc-500">
              Hint: ingresa un valor entre 0 y 100. Ejemplo: <span className="font-medium">35</span> ={' '}
              <span className="font-medium">35%</span> de comision.
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-4">
              <label className="group relative h-24 w-24 cursor-pointer overflow-hidden rounded-full border border-zinc-300 bg-zinc-50">
                {form.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.photoUrl} alt="Foto profesional" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center px-2 text-center text-[11px] text-zinc-500">
                    Subir foto
                  </div>
                )}
                <div className="absolute inset-0 hidden items-center justify-center bg-black/40 text-[11px] font-medium text-white group-hover:flex">
                  Cambiar
                </div>
                <input className="hidden" type="file" accept="image/*" onChange={handlePhotoUpload} />
              </label>
              <div>
                <p className="text-xs text-zinc-500">Haz click en la foto para subir o cambiar imagen.</p>
                <p className="truncate text-xs text-zinc-500">
                  {selectedPhotoName || (form.photoUrl ? 'Imagen cargada' : 'Sin archivo seleccionado')}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="mt-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-600">
            Para este tipo de negocio no se usa foto ni comision del profesional.
          </div>
        )}

        <div className="mt-4 rounded-xl border border-zinc-200 p-3">
          <div className="grid gap-3 md:grid-cols-3">
            <Select
              value={form.schedulePreset}
              onChange={(event) => {
                const preset = event.target.value as ProfessionalForm['schedulePreset'];
                setForm((prev) => ({ ...prev, schedulePreset: preset }));
                setWeeklySchedule(getScheduleFromPreset(preset));
              }}
            >
              <option value="part_time">Part time (Lunes a Viernes)</option>
              <option value="full_time">Full time (Semana completa)</option>
              <option value="weekends">Solo fines de semana</option>
            </Select>
            <p className="text-xs text-zinc-500 md:col-span-2 flex items-center">
              Dias activos: {selectedCount}. Ajusta manualmente dia por dia si lo necesitas.
            </p>
          </div>

          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {weeklySchedule.map((item) => (
              <div
                key={item.day}
                className="flex flex-col gap-2 rounded-lg border border-zinc-100 p-2 sm:flex-row sm:items-center"
              >
                <label className="flex min-w-32 items-center gap-2 text-sm text-zinc-700">
                  <input
                    type="checkbox"
                    checked={item.enabled}
                    onChange={(event) =>
                      setWeeklySchedule((prev) =>
                        prev.map((row) => (row.day === item.day ? { ...row, enabled: event.target.checked } : row)),
                      )
                    }
                  />
                  {DAYS.find((day) => day.key === item.day)?.label}
                </label>
                <div className="grid w-full grid-cols-2 gap-2">
                  <Input
                    type="time"
                    value={item.startTime}
                    disabled={!item.enabled}
                    onChange={(event) =>
                      setWeeklySchedule((prev) =>
                        prev.map((row) => (row.day === item.day ? { ...row, startTime: event.target.value } : row)),
                      )
                    }
                  />
                  <Input
                    type="time"
                    value={item.endTime}
                    disabled={!item.enabled}
                    onChange={(event) =>
                      setWeeklySchedule((prev) =>
                        prev.map((row) => (row.day === item.day ? { ...row, endTime: event.target.value } : row)),
                      )
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={() => void submitForm()} disabled={createMutation.isPending || updateMutation.isPending}>
            {editingId ? 'Guardar cambios' : 'Agregar profesional'}
          </Button>
          {editingId ? (
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancelar edicion
            </Button>
          ) : null}
        </div>
        {message ? <p className="mt-3 rounded-lg bg-zinc-100 p-2 text-xs text-zinc-700">{message}</p> : null}
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-[860px] text-sm">
            <thead className="text-left text-zinc-500">
              <tr>
                <th className="py-2">Profesional</th>
                <th>Servicio</th>
                <th>Comision</th>
                <th>Horario</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {(professionalsQuery.data ?? []).map((professional) => (
                <tr key={String(professional._id)} className="border-t border-zinc-100">
                  <td className="py-2">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 overflow-hidden rounded-full border border-zinc-200 bg-zinc-50">
                        {professional.photoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={String(professional.photoUrl)}
                            alt={String(professional.fullName)}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] text-zinc-400">N/A</div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-zinc-900">{String(professional.fullName)}</p>
                        <p className="text-xs text-zinc-500">{String(professional.phone ?? '-')}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    {((professional.serviceIds as Array<unknown> | undefined) ?? [])
                      .map((serviceId) => serviceNameById.get(String(serviceId)) ?? String(serviceId))
                      .join(', ') || '-'}
                  </td>
                  <td>{String(professional.commissionPercent ?? 0)}%</td>
                  <td className="max-w-xl text-xs text-zinc-600">{scheduleText(professional.weeklySchedule)}</td>
                  <td>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" onClick={() => loadForEdit(professional)}>
                        Modificar
                      </Button>
                      <Button
                        type="button"
                        variant="danger"
                        disabled={deleteMutation.isPending}
                        onClick={() => deleteMutation.mutate(String(professional._id))}
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
      <ErrorDialog message={errorDialogMessage} onClose={() => setErrorDialogMessage('')} />
    </div>
  );
}
