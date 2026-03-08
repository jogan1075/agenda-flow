'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SectionHeader } from '@/components/section-header';
import { ApiError, api } from '@/lib/api';
import { useBusinessId } from '@/lib/use-business-id';

type CustomerForm = {
  fullName: string;
  phone: string;
  email: string;
};

export default function ClientesPage() {
  const businessId = useBusinessId();
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState('');
  const [message, setMessage] = useState('');
  const queryClient = useQueryClient();

  const customersQuery = useQuery({
    queryKey: ['customers', businessId],
    queryFn: () => api.listCustomers(businessId),
    enabled: !!businessId,
    initialData: [],
  });

  const filteredCustomers = useMemo(() => {
    const list = (customersQuery.data ?? []) as Array<Record<string, unknown>>;
    const term = search.trim().toLowerCase();
    if (!term) return list;
    return list.filter((item) => {
      const name = String(item.fullName ?? '').toLowerCase();
      const phone = String(item.phone ?? '').toLowerCase();
      return name.includes(term) || phone.includes(term);
    });
  }, [customersQuery.data, search]);

  const refresh = async () => {
    if (!businessId) return;
    const latest = await api.listCustomers(businessId);
    queryClient.setQueryData(['customers', businessId], latest);
    await queryClient.invalidateQueries({ queryKey: ['customers', businessId] });
  };

  const normalizePhone = (phone: string) => {
    const cleaned = phone.replace(/[^\d+]/g, '');
    if (!cleaned) return '';
    return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
  };

  const createMutation = useMutation({
    mutationFn: api.createCustomer,
    onSuccess: async () => {
      setSearch('');
      await refresh();
      setMessage('Cliente creado correctamente.');
    },
    onError: (error) => {
      const msg = error instanceof ApiError ? error.message : 'No se pudo crear el cliente.';
      setMessage(msg);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
      api.updateCustomer(id, payload),
    onSuccess: async () => {
      setSearch('');
      await refresh();
      setMessage('Cliente actualizado correctamente.');
      setEditingId('');
    },
    onError: (error) => {
      const msg = error instanceof ApiError ? error.message : 'No se pudo actualizar el cliente.';
      setMessage(msg);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteCustomer(id),
    onSuccess: async () => {
      setSearch('');
      await refresh();
      setMessage('Cliente eliminado correctamente.');
    },
    onError: (error) => {
      const msg = error instanceof ApiError ? error.message : 'No se pudo eliminar el cliente.';
      setMessage(msg);
    },
  });

  const { register, handleSubmit, reset, setValue } = useForm<CustomerForm>({
    defaultValues: { fullName: '', phone: '', email: '' },
  });

  return (
    <div className="space-y-6">
      <SectionHeader title="Clientes" subtitle="Gestión y búsqueda rápida" />
      <Card>
        <form
          className="grid gap-3 md:grid-cols-4"
          onSubmit={handleSubmit(async (values) => {
            if (!businessId) return;
            const fullName = values.fullName.trim();
            const phone = normalizePhone(values.phone);
            const email = values.email.trim();

            if (!fullName || !phone) {
              setMessage('Nombre y teléfono son obligatorios.');
              return;
            }

            if (editingId) {
              await updateMutation.mutateAsync({ id: editingId, payload: { fullName, phone, email } });
            } else {
              await createMutation.mutateAsync({ fullName, phone, email, businessId });
            }

            reset();
          })}
        >
          <Input placeholder="Nombre" {...register('fullName')} />
          <Input placeholder="Teléfono" {...register('phone')} />
          <Input placeholder="Email" type="email" {...register('email')} />
          <Button disabled={createMutation.isPending || updateMutation.isPending}>
            {editingId ? 'Guardar cambios' : 'Agregar'}
          </Button>
          {editingId ? (
            <Button
              type="button"
              variant="outline"
              className="md:col-span-4"
              onClick={() => {
                setEditingId('');
                reset();
              }}
            >
              Cancelar edición
            </Button>
          ) : null}
          {message ? <p className="md:col-span-4 rounded-lg bg-zinc-100 p-2 text-xs text-zinc-700">{message}</p> : null}
        </form>
      </Card>
      <Card>
        <div className="mb-3">
          <Input placeholder="Buscar por nombre o teléfono" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="mb-3 flex items-center justify-between text-xs text-zinc-500">
          <span>Total visibles: {filteredCustomers.length}</span>
          {customersQuery.isFetching ? <span>Actualizando...</span> : null}
        </div>
        {customersQuery.isError ? (
          <p className="mb-3 rounded-lg bg-red-50 p-2 text-xs text-red-700">Error cargando clientes.</p>
        ) : null}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-zinc-500">
              <tr>
                <th className="py-2">Nombre</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((c) => (
                <tr key={String(c._id)} className="border-t border-zinc-100">
                  <td className="py-2">{String(c.fullName)}</td>
                  <td>{String(c.phone)}</td>
                  <td>{String(c.email ?? '-')}</td>
                  <td>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditingId(String(c._id));
                          setValue('fullName', String(c.fullName ?? ''));
                          setValue('phone', String(c.phone ?? ''));
                          setValue('email', String(c.email ?? ''));
                        }}
                      >
                        Modificar
                      </Button>
                      <Button
                        type="button"
                        variant="danger"
                        disabled={deleteMutation.isPending}
                        onClick={() => deleteMutation.mutate(String(c._id))}
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
    </div>
  );
}
