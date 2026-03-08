'use client';

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { SectionHeader } from '@/components/section-header';
import { api } from '@/lib/api';
import { getSession } from '@/lib/session';

type BillingPlan = 'trial' | 'monthly' | 'semiannual' | 'annual';
type BillingStatus = 'trialing' | 'active' | 'past_due' | 'cancelled';

const billingPlans: BillingPlan[] = ['trial', 'monthly', 'semiannual', 'annual'];
const billingStatuses: BillingStatus[] = ['trialing', 'active', 'past_due', 'cancelled'];

export default function SuperAdminPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const session = getSession();
  const token = session?.token ?? '';
  const role = session?.role ?? 'staff';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const [categoryLabel, setCategoryLabel] = useState('');
  const [categoryKey, setCategoryKey] = useState('');
  const [subcategoryDrafts, setSubcategoryDrafts] = useState<Record<string, string>>({});

  const [businessDrafts, setBusinessDrafts] = useState<
    Record<string, { billingPlan: BillingPlan; billingStatus: BillingStatus; isEnabled: boolean }>
  >({});

  const canAccess = role === 'super_admin';

  const catalogQuery = useQuery({
    queryKey: ['superadmin-catalog'],
    queryFn: () => api.getBusinessTypeCatalogForSuperAdmin(token),
    enabled: canAccess && !!token,
  });

  const businessesQuery = useQuery({
    queryKey: ['superadmin-businesses'],
    queryFn: () => api.listBusinessesForSuperAdmin(token),
    enabled: canAccess && !!token,
  });

  useEffect(() => {
    const businesses = businessesQuery.data ?? [];
    if (!businesses.length) {
      return;
    }

    setBusinessDrafts((prev) => {
      const next = { ...prev };
      for (const business of businesses) {
        const id = String(business._id ?? '');
        if (!id || next[id]) continue;

        next[id] = {
          billingPlan: String(business.billingPlan ?? 'trial') as BillingPlan,
          billingStatus: String(business.billingStatus ?? 'trialing') as BillingStatus,
          isEnabled: business.isEnabled !== false,
        };
      }
      return next;
    });
  }, [businessesQuery.data]);

  const refreshSuperAdminData = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['superadmin-catalog'] }),
      queryClient.invalidateQueries({ queryKey: ['superadmin-businesses'] }),
      queryClient.invalidateQueries({ queryKey: ['business-type-catalog'] }),
    ]);
  };

  const createOwnerMutation = useMutation({
    mutationFn: () =>
      api.createOwnerBySuperAdmin(
        {
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          password,
        },
        token,
      ),
    onSuccess: () => {
      setMessage('Cuenta owner creada correctamente.');
      setFullName('');
      setEmail('');
      setPassword('');
    },
    onError: (error) => {
      const detail = error instanceof Error ? error.message : 'Error desconocido';
      setMessage(`No se pudo crear la cuenta: ${detail}`);
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: () => api.createBusinessCategory({ key: categoryKey.trim() || undefined, label: categoryLabel.trim() }, token),
    onSuccess: async () => {
      setMessage('Categoria creada correctamente.');
      setCategoryKey('');
      setCategoryLabel('');
      await refreshSuperAdminData();
    },
    onError: (error) => {
      const detail = error instanceof Error ? error.message : 'Error desconocido';
      setMessage(`No se pudo crear categoria: ${detail}`);
    },
  });

  const addSubcategoryMutation = useMutation({
    mutationFn: ({ categoryKey: key, name }: { categoryKey: string; name: string }) =>
      api.addBusinessSubcategory(key, { name }, token),
    onSuccess: async () => {
      setMessage('Subcategoria agregada correctamente.');
      await refreshSuperAdminData();
    },
    onError: (error) => {
      const detail = error instanceof Error ? error.message : 'Error desconocido';
      setMessage(`No se pudo agregar subcategoria: ${detail}`);
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ key, payload }: { key: string; payload: Record<string, unknown> }) => api.updateBusinessCategory(key, payload, token),
    onSuccess: async () => {
      setMessage('Categoria actualizada correctamente.');
      await refreshSuperAdminData();
    },
    onError: (error) => {
      const detail = error instanceof Error ? error.message : 'Error desconocido';
      setMessage(`No se pudo actualizar categoria: ${detail}`);
    },
  });

  const updateBusinessMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
      api.updateBusinessSubscription(id, payload, token),
    onSuccess: async () => {
      setMessage('Negocio actualizado correctamente.');
      await refreshSuperAdminData();
    },
    onError: (error) => {
      const detail = error instanceof Error ? error.message : 'Error desconocido';
      setMessage(`No se pudo actualizar negocio: ${detail}`);
    },
  });

  const catalogItems = useMemo(() => catalogQuery.data ?? [], [catalogQuery.data]);
  const businesses = useMemo(() => businessesQuery.data ?? [], [businessesQuery.data]);

  if (!canAccess) {
    return (
      <div className="space-y-6">
        <SectionHeader title="SuperAdmin" subtitle="Acceso restringido" />
        <Card>
          <p className="text-sm text-zinc-600">Solo un super admin puede acceder a este modulo.</p>
          <Button className="mt-3" variant="outline" onClick={() => router.push('/dashboard')}>
            Volver
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="SuperAdmin"
        subtitle="Gestion de owners, catalogo de rubros y control de suscripciones por negocio"
      />

      <Card className="space-y-3">
        <h3 className="text-sm font-semibold text-zinc-700">Crear cuenta owner</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <Input placeholder="Nombre completo" value={fullName} onChange={(event) => setFullName(event.target.value)} />
          <Input placeholder="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <Input
            placeholder="Contrasena inicial"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <Button
          disabled={createOwnerMutation.isPending}
          onClick={() => {
            if (!fullName.trim() || !email.trim() || password.length < 6) {
              setMessage('Completa nombre, email y contrasena de al menos 6 caracteres.');
              return;
            }
            createOwnerMutation.mutate();
          }}
        >
          Crear cuenta owner
        </Button>
      </Card>

      <Card className="space-y-4">
        <h3 className="text-sm font-semibold text-zinc-700">Catalogo de tipos de negocio (DB)</h3>

        <div className="grid gap-2 md:grid-cols-[1fr_220px_180px]">
          <Input
            placeholder="Nombre visible categoria (ej: Estetica y Belleza)"
            value={categoryLabel}
            onChange={(event) => setCategoryLabel(event.target.value)}
          />
          <Input
            placeholder="Clave opcional (ej: ESTETICA_Y_BELLEZA)"
            value={categoryKey}
            onChange={(event) => setCategoryKey(event.target.value)}
          />
          <Button
            disabled={createCategoryMutation.isPending}
            onClick={() => {
              if (!categoryLabel.trim()) {
                setMessage('Ingresa nombre de categoria.');
                return;
              }
              createCategoryMutation.mutate();
            }}
          >
            Agregar categoria
          </Button>
        </div>

        <div className="space-y-3">
          {catalogItems.map((item) => {
            const key = String(item.key ?? '');
            const label = String(item.label ?? key);
            const isActive = item.isActive !== false;
            const subcategories = Array.isArray(item.subcategories)
              ? (item.subcategories as Array<unknown>).map((value) => String(value))
              : [];

            return (
              <div key={key} className="rounded-xl border border-zinc-100 p-3">
                <div className="grid gap-2 md:grid-cols-[1fr_220px_160px]">
                  <Input
                    value={label}
                    onChange={(event) => {
                      const nextLabel = event.target.value;
                      const current = catalogItems.find((row) => String(row.key) === key);
                      if (!current) return;
                      current.label = nextLabel;
                      queryClient.setQueryData(['superadmin-catalog'], [...catalogItems]);
                    }}
                  />
                  <Input value={key} disabled />
                  <label className="flex items-center justify-between rounded-lg border border-zinc-200 px-3 py-2 text-xs text-zinc-600">
                    Activa
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(event) =>
                        updateCategoryMutation.mutate({ key, payload: { isActive: event.target.checked } })
                      }
                    />
                  </label>
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                  {subcategories.map((subcategory) => (
                    <span key={`${key}-${subcategory}`} className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700">
                      {subcategory}
                    </span>
                  ))}
                </div>

                <div className="mt-3 grid gap-2 md:grid-cols-[1fr_200px_200px]">
                  <Input
                    placeholder="Nueva subcategoria"
                    value={subcategoryDrafts[key] ?? ''}
                    onChange={(event) =>
                      setSubcategoryDrafts((prev) => ({
                        ...prev,
                        [key]: event.target.value,
                      }))
                    }
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      const name = (subcategoryDrafts[key] ?? '').trim();
                      if (!name) {
                        setMessage('Ingresa subcategoria para agregar.');
                        return;
                      }

                      addSubcategoryMutation.mutate({ categoryKey: key, name });
                      setSubcategoryDrafts((prev) => ({ ...prev, [key]: '' }));
                    }}
                  >
                    Agregar subcategoria
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const current = catalogItems.find((row) => String(row.key) === key);
                      if (!current) return;

                      updateCategoryMutation.mutate({
                        key,
                        payload: {
                          label: String(current.label ?? ''),
                          subcategories,
                        },
                      });
                    }}
                  >
                    Guardar categoria
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="space-y-3">
        <h3 className="text-sm font-semibold text-zinc-700">Suscripciones y bloqueo por no pago</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-zinc-500">
              <tr>
                <th className="py-2">Negocio</th>
                <th>Email</th>
                <th>Plan</th>
                <th>Estado</th>
                <th>Habilitado</th>
                <th>Accion</th>
              </tr>
            </thead>
            <tbody>
              {businesses.map((business) => {
                const id = String(business._id ?? '');
                const draft = businessDrafts[id] ?? {
                  billingPlan: 'trial' as BillingPlan,
                  billingStatus: 'trialing' as BillingStatus,
                  isEnabled: true,
                };

                return (
                  <tr key={id} className="border-t border-zinc-100">
                    <td className="py-2">{String(business.name ?? '-')}</td>
                    <td>{String(business.email ?? '-')}</td>
                    <td>
                      <Select
                        value={draft.billingPlan}
                        onChange={(event) =>
                          setBusinessDrafts((prev) => ({
                            ...prev,
                            [id]: { ...draft, billingPlan: event.target.value as BillingPlan },
                          }))
                        }
                      >
                        {billingPlans.map((plan) => (
                          <option key={plan} value={plan}>
                            {plan}
                          </option>
                        ))}
                      </Select>
                    </td>
                    <td>
                      <Select
                        value={draft.billingStatus}
                        onChange={(event) =>
                          setBusinessDrafts((prev) => ({
                            ...prev,
                            [id]: { ...draft, billingStatus: event.target.value as BillingStatus },
                          }))
                        }
                      >
                        {billingStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </Select>
                    </td>
                    <td>
                      <label className="flex items-center gap-2 text-xs text-zinc-600">
                        <input
                          type="checkbox"
                          checked={draft.isEnabled}
                          onChange={(event) =>
                            setBusinessDrafts((prev) => ({
                              ...prev,
                              [id]: { ...draft, isEnabled: event.target.checked },
                            }))
                          }
                        />
                        Activo
                      </label>
                    </td>
                    <td>
                      <Button
                        variant="outline"
                        disabled={updateBusinessMutation.isPending}
                        onClick={() =>
                          updateBusinessMutation.mutate({
                            id,
                            payload: {
                              billingPlan: draft.billingPlan,
                              billingStatus: draft.billingStatus,
                              isEnabled: draft.isEnabled,
                            },
                          })
                        }
                      >
                        Guardar
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {message ? <p className="rounded-lg bg-zinc-100 p-2 text-xs text-zinc-700">{message}</p> : null}
    </div>
  );
}
