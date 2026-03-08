'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SectionHeader } from '@/components/section-header';
import { api } from '@/lib/api';
import { useBusinessId } from '@/lib/use-business-id';

type ServiceForm = {
  name: string;
  category: string;
  durationMinutes: number;
  price: number;
};

export default function ServiciosPage() {
  const businessId = useBusinessId();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState('');
  const [message, setMessage] = useState('');

  const servicesQuery = useQuery({
    queryKey: ['services', businessId],
    queryFn: () => api.listServices(businessId),
    enabled: !!businessId,
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['services', businessId] });

  const patchServiceInCache = (updated: Record<string, unknown>) => {
    const updatedId = String(updated._id ?? '');
    if (!updatedId) return;

    queryClient.setQueriesData<Array<Record<string, unknown>>>(
      { queryKey: ['services', businessId] },
      (prev) => {
        if (!prev) return prev;
        return prev.map((item) => (String(item._id) === updatedId ? { ...item, ...updated } : item));
      },
    );
  };

  const removeServiceFromCache = (id: string) => {
    queryClient.setQueriesData<Array<Record<string, unknown>>>(
      { queryKey: ['services', businessId] },
      (prev) => {
        if (!prev) return prev;
        return prev.filter((item) => String(item._id) !== id);
      },
    );
  };

  const createMutation = useMutation({
    mutationFn: api.createService,
    onSuccess: async (created) => {
      const createdService = created as Record<string, unknown>;
      queryClient.setQueriesData<Array<Record<string, unknown>>>(
        { queryKey: ['services', businessId] },
        (prev) => (prev ? [createdService, ...prev] : [createdService]),
      );
      await refresh();
      setMessage('Servicio creado correctamente.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
      api.updateService(id, payload),
    onSuccess: async (updated) => {
      patchServiceInCache(updated as Record<string, unknown>);
      await refresh();
      setEditingId('');
      setMessage('Servicio actualizado correctamente.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteService(id),
    onSuccess: async (_deleted, id) => {
      removeServiceFromCache(id);
      await refresh();
      setMessage('Servicio eliminado correctamente.');
    },
  });

  const { register, handleSubmit, reset, setValue } = useForm<ServiceForm>({
    defaultValues: { name: '', category: '', durationMinutes: 60, price: 0 },
  });

  return (
    <div className="space-y-6">
      <SectionHeader title="Servicios" subtitle="Catálogo comercial" />
      <Card>
        <form
          className="grid gap-3 md:grid-cols-5"
          onSubmit={handleSubmit(async (values) => {
            if (!businessId) return;

            if (editingId) {
              await updateMutation.mutateAsync({ id: editingId, payload: values });
            } else {
              await createMutation.mutateAsync({ ...values, businessId, isActive: true });
            }

            reset();
          })}
        >
          <Input placeholder="Nombre" {...register('name')} />
          <Input placeholder="Categoría" {...register('category')} />
          <Input type="number" placeholder="Duración" {...register('durationMinutes', { valueAsNumber: true })} />
          <Input type="number" placeholder="Precio" {...register('price', { valueAsNumber: true })} />
          <Button>{editingId ? 'Guardar cambios' : 'Crear'}</Button>
          {editingId ? (
            <Button
              type="button"
              variant="outline"
              className="md:col-span-5"
              onClick={() => {
                setEditingId('');
                reset();
              }}
            >
              Cancelar edición
            </Button>
          ) : null}
          {message ? <p className="md:col-span-5 rounded-lg bg-zinc-100 p-2 text-xs text-zinc-700">{message}</p> : null}
        </form>
      </Card>
      <Card>
        <table className="min-w-full text-sm">
          <thead className="text-left text-zinc-500">
            <tr>
              <th className="py-2">Servicio</th>
              <th>Categoría</th>
              <th>Duración</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {(servicesQuery.data ?? []).map((s) => (
              <tr key={String(s._id)} className="border-t border-zinc-100">
                <td className="py-2">{String(s.name)}</td>
                <td>{String(s.category ?? '-')}</td>
                <td>{String(s.durationMinutes)} min</td>
                <td>${String(s.price)}</td>
                <td>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingId(String(s._id));
                        setValue('name', String(s.name ?? ''));
                        setValue('category', String(s.category ?? ''));
                        setValue('durationMinutes', Number(s.durationMinutes ?? 60));
                        setValue('price', Number(s.price ?? 0));
                      }}
                    >
                      Modificar
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      disabled={deleteMutation.isPending}
                      onClick={() => deleteMutation.mutate(String(s._id))}
                    >
                      Eliminar
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
