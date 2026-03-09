'use client';

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ErrorDialog } from '@/components/ui/error-dialog';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { SectionHeader } from '@/components/section-header';
import { api } from '@/lib/api';
import { getSession, setSession } from '@/lib/session';
import { useBusinessId } from '@/lib/use-business-id';

type BranchForm = {
  name: string;
  address: string;
  phone: string;
  isActive: boolean;
};

type OpeningHourForm = {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  isOpen: boolean;
  opensAt: string;
  closesAt: string;
};

type ConfigFormValues = {
  name: string;
  businessEmail: string;
  phone: string;
  address: string;
  timezone: string;
  currency: string;
  paymentMode: 'manual' | 'mercadopago';
  manualPaymentMethods: Array<'cash' | 'transfer'>;
  mercadoPagoAccessToken: string;
  mercadoPagoPublicKey: string;
  mercadoPagoWebhookSecret: string;
  businessCategory: string;
  businessSubcategory: string;
  whatsappWelcomeMessage: string;
  whatsappReminderTemplate: string;
  whatsappLocationText: string;
  whatsappLocationUrl: string;
};

const days: Array<{ key: OpeningHourForm['day']; label: string }> = [
  { key: 'monday', label: 'Lunes' },
  { key: 'tuesday', label: 'Martes' },
  { key: 'wednesday', label: 'Miercoles' },
  { key: 'thursday', label: 'Jueves' },
  { key: 'friday', label: 'Viernes' },
  { key: 'saturday', label: 'Sabado' },
  { key: 'sunday', label: 'Domingo' },
];

function defaultOpeningHours(): OpeningHourForm[] {
  return [
    { day: 'monday', isOpen: true, opensAt: '09:00', closesAt: '19:00' },
    { day: 'tuesday', isOpen: true, opensAt: '09:00', closesAt: '19:00' },
    { day: 'wednesday', isOpen: true, opensAt: '09:00', closesAt: '19:00' },
    { day: 'thursday', isOpen: true, opensAt: '09:00', closesAt: '19:00' },
    { day: 'friday', isOpen: true, opensAt: '09:00', closesAt: '19:00' },
    { day: 'saturday', isOpen: false, opensAt: '09:00', closesAt: '14:00' },
    { day: 'sunday', isOpen: false, opensAt: '09:00', closesAt: '14:00' },
  ];
}

export default function ConfiguracionPage() {
  const router = useRouter();
  const businessId = useBusinessId();
  const queryClient = useQueryClient();
  const session = getSession();
  const role = session?.role ?? 'staff';
  const canManage = role === 'owner' || role === 'admin';

  const businessQuery = useQuery({
    queryKey: ['business', businessId],
    queryFn: () => api.getBusinesses(businessId),
    enabled: !!businessId,
  });

  const catalogQuery = useQuery({
    queryKey: ['business-type-catalog'],
    queryFn: () => api.getBusinessTypeCatalog(),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => api.updateBusiness(businessId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['business', businessId] });
      setMessage('Configuracion guardada correctamente.');
    },
    onError: (error) => {
      const detail = error instanceof Error ? error.message : 'Error desconocido';
      setErrorDialogMessage(`No se pudo guardar la configuracion: ${detail}`);
    },
  });

  const createBusinessMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => api.createBusiness(payload),
    onSuccess: (created) => {
      const createdBusiness = created as Record<string, unknown>;
      const createdBusinessId = String(createdBusiness._id ?? '');
      if (session && createdBusinessId) {
        setSession({
          ...session,
          businessId: createdBusinessId,
        });
      }
      router.push('/dashboard');
      router.refresh();
    },
    onError: (error) => {
      const detail = error instanceof Error ? error.message : 'Error desconocido';
      setErrorDialogMessage(`No se pudo crear el negocio: ${detail}`);
    },
  });

  const [message, setMessage] = useState('');
  const [errorDialogMessage, setErrorDialogMessage] = useState('');
  const [form, setForm] = useState<ConfigFormValues>({
    name: '',
    businessEmail: '',
    phone: '',
    address: '',
    timezone: 'America/Santiago',
    currency: 'CLP',
    paymentMode: 'manual',
    manualPaymentMethods: ['cash', 'transfer'],
    mercadoPagoAccessToken: '',
    mercadoPagoPublicKey: '',
    mercadoPagoWebhookSecret: '',
    businessCategory: '',
    businessSubcategory: '',
    whatsappWelcomeMessage: '',
    whatsappReminderTemplate: '',
    whatsappLocationText: '',
    whatsappLocationUrl: '',
  });
  const [branches, setBranches] = useState<BranchForm[]>([]);
  const [openingHours, setOpeningHours] = useState<OpeningHourForm[]>(defaultOpeningHours());

  useEffect(() => {
    const business = businessQuery.data as Record<string, unknown> | undefined;
    if (!business) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({
      name: String(business.name ?? ''),
      businessEmail: String(business.email ?? ''),
      phone: String(business.phone ?? ''),
      address: String(business.address ?? ''),
      timezone: String(business.timezone ?? 'America/Santiago'),
      currency: String(business.currency ?? 'CLP'),
      paymentMode: String(business.paymentMode ?? 'manual') === 'mercadopago' ? 'mercadopago' : 'manual',
      manualPaymentMethods: Array.isArray(business.manualPaymentMethods)
        ? (business.manualPaymentMethods as Array<string>)
            .map((method) => (method === 'transfer' ? 'transfer' : method === 'cash' ? 'cash' : null))
            .filter((method): method is 'cash' | 'transfer' => !!method)
        : ['cash', 'transfer'],
      mercadoPagoAccessToken: '',
      mercadoPagoPublicKey: String(business.mercadoPagoPublicKey ?? ''),
      mercadoPagoWebhookSecret: '',
      businessCategory: String(business.businessCategory ?? ''),
      businessSubcategory: String(business.businessSubcategory ?? ''),
      whatsappWelcomeMessage: String(business.whatsappWelcomeMessage ?? ''),
      whatsappReminderTemplate: String(business.whatsappReminderTemplate ?? ''),
      whatsappLocationText: String(business.whatsappLocationText ?? ''),
      whatsappLocationUrl: String(business.whatsappLocationUrl ?? ''),
    });

    setBranches(
      Array.isArray(business.branches)
        ? (business.branches as Array<Record<string, unknown>>).map((branch) => ({
            name: String(branch.name ?? ''),
            address: String(branch.address ?? ''),
            phone: String(branch.phone ?? ''),
            isActive: branch.isActive !== false,
          }))
        : [],
    );

    if (Array.isArray(business.openingHours) && business.openingHours.length > 0) {
      const incoming = business.openingHours as Array<Record<string, unknown>>;
      setOpeningHours(
        days.map((day) => {
          const row = incoming.find((item) => String(item.day) === day.key);
          return {
            day: day.key,
            isOpen: row?.isOpen !== false,
            opensAt: String(row?.opensAt ?? '09:00'),
            closesAt: String(row?.closesAt ?? '19:00'),
          };
        }),
      );
    } else {
      setOpeningHours(defaultOpeningHours());
    }
  }, [businessQuery.data]);

  const subcategories = useMemo(() => {
    const catalog = catalogQuery.data ?? {};
    return catalog[form.businessCategory] ?? [];
  }, [catalogQuery.data, form.businessCategory]);

  const categories = useMemo(() => Object.keys(catalogQuery.data ?? {}), [catalogQuery.data]);

  if (!canManage) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Configuracion" subtitle="Permisos de administracion" />
        <Card>
          <p className="text-sm text-zinc-600">Solo Owner o Manager/Admin pueden administrar la configuracion del negocio.</p>
        </Card>
      </div>
    );
  }

  if (!businessId) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Crear Negocio" subtitle="Primero crea tu negocio para comenzar a usar el manager" />
        <Card className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <Input
              placeholder="Nombre del negocio"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            />
            <Input
              placeholder="Email del negocio"
              value={form.businessEmail}
              onChange={(event) => setForm((prev) => ({ ...prev, businessEmail: event.target.value }))}
            />
            <Input
              placeholder="Telefono principal"
              value={form.phone}
              onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
            />
            <Input
              placeholder="Direccion principal"
              value={form.address}
              onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
            />
          </div>
          <Button
            disabled={createBusinessMutation.isPending}
            onClick={() => {
              if (!form.name.trim()) {
                setErrorDialogMessage('El nombre del negocio es obligatorio.');
                return;
              }

              const defaultBusinessEmail =
                form.businessEmail.trim() || session?.email || `owner+${Date.now()}@negocio.local`;

              createBusinessMutation.mutate({
                ownerEmail: session?.email,
                name: form.name.trim(),
                email: defaultBusinessEmail.toLowerCase(),
                phone: form.phone.trim() || undefined,
                address: form.address.trim() || undefined,
                timezone: form.timezone,
                currency: form.currency,
                paymentMode: form.paymentMode,
                manualPaymentMethods:
                  form.paymentMode === 'manual' && form.manualPaymentMethods.length === 0
                    ? ['cash']
                    : form.manualPaymentMethods,
                ...(form.mercadoPagoAccessToken.trim()
                  ? { mercadoPagoAccessToken: form.mercadoPagoAccessToken.trim() }
                  : {}),
                ...(form.mercadoPagoPublicKey.trim()
                  ? { mercadoPagoPublicKey: form.mercadoPagoPublicKey.trim() }
                  : {}),
                ...(form.mercadoPagoWebhookSecret.trim()
                  ? { mercadoPagoWebhookSecret: form.mercadoPagoWebhookSecret.trim() }
                  : {}),
              });
            }}
          >
            Crear negocio y continuar
          </Button>
          {message ? <p className="rounded-lg bg-zinc-100 p-2 text-xs text-zinc-700">{message}</p> : null}
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader title="Configuracion" subtitle="Negocio, sucursales, horarios y WhatsApp" />

      <Card className="space-y-3">
        <h3 className="text-sm font-semibold text-zinc-700">Datos del negocio</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <Input
            placeholder="Nombre del negocio"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          />
          <Input
            placeholder="Email del negocio"
            value={form.businessEmail}
            onChange={(event) => setForm((prev) => ({ ...prev, businessEmail: event.target.value }))}
          />
          <Input
            placeholder="Telefono principal"
            value={form.phone}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
          />
          <Input
            placeholder="Direccion principal"
            value={form.address}
            onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
          />
          <Input
            placeholder="Zona horaria"
            value={form.timezone}
            onChange={(event) => setForm((prev) => ({ ...prev, timezone: event.target.value }))}
          />
          <Input
            placeholder="Moneda"
            value={form.currency}
            onChange={(event) => setForm((prev) => ({ ...prev, currency: event.target.value.toUpperCase() }))}
          />
          <Input placeholder="Business ID" value={businessId} disabled />
        </div>
      </Card>

      <Card className="space-y-3">
        <h3 className="text-sm font-semibold text-zinc-700">Forma de pago</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <Select
            value={form.paymentMode}
            onChange={(event) => {
              const mode = event.target.value === 'mercadopago' ? 'mercadopago' : 'manual';
              setForm((prev) => ({
                ...prev,
                paymentMode: mode,
                manualPaymentMethods: mode === 'manual' ? prev.manualPaymentMethods : [],
              }));
            }}
          >
            <option value="manual">Manual (efectivo o transferencia)</option>
            <option value="mercadopago">Medio de pago (MercadoPago)</option>
          </Select>
          {form.paymentMode === 'manual' ? (
            <div className="flex flex-col gap-2 rounded-lg border border-zinc-200 px-3 py-2">
              <label className="flex items-center gap-2 text-xs text-zinc-600">
                <input
                  type="checkbox"
                  checked={form.manualPaymentMethods.includes('cash')}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      manualPaymentMethods: event.target.checked
                        ? Array.from(new Set([...prev.manualPaymentMethods, 'cash']))
                        : prev.manualPaymentMethods.filter((item) => item !== 'cash'),
                    }))
                  }
                />
                Efectivo
              </label>
              <label className="flex items-center gap-2 text-xs text-zinc-600">
                <input
                  type="checkbox"
                  checked={form.manualPaymentMethods.includes('transfer')}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      manualPaymentMethods: event.target.checked
                        ? Array.from(new Set([...prev.manualPaymentMethods, 'transfer']))
                        : prev.manualPaymentMethods.filter((item) => item !== 'transfer'),
                    }))
                  }
                />
                Transferencia
              </label>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                Las reservas se pagaran por MercadoPago.
              </div>
              <Input
                placeholder="MercadoPago Access Token"
                type="password"
                value={form.mercadoPagoAccessToken}
                onChange={(event) => setForm((prev) => ({ ...prev, mercadoPagoAccessToken: event.target.value }))}
              />
              <Input
                placeholder="MercadoPago Public Key"
                value={form.mercadoPagoPublicKey}
                onChange={(event) => setForm((prev) => ({ ...prev, mercadoPagoPublicKey: event.target.value }))}
              />
              <Input
                placeholder="MercadoPago Webhook Secret"
                type="password"
                value={form.mercadoPagoWebhookSecret}
                onChange={(event) => setForm((prev) => ({ ...prev, mercadoPagoWebhookSecret: event.target.value }))}
              />
              <p className="text-xs text-zinc-500">
                Si no deseas actualizar credenciales, deja los campos en blanco.
              </p>
            </div>
          )}
        </div>
      </Card>

      <Card className="space-y-3">
        <h3 className="text-sm font-semibold text-zinc-700">Tipo de negocio</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <Select
            value={form.businessCategory}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, businessCategory: event.target.value, businessSubcategory: '' }))
            }
          >
            <option value="">Selecciona categoria</option>
            {categories.map((value) => (
              <option key={value} value={value}>
                {value.replaceAll('_', ' ')}
              </option>
            ))}
          </Select>
          <Select
            value={form.businessSubcategory}
            onChange={(event) => setForm((prev) => ({ ...prev, businessSubcategory: event.target.value }))}
          >
            <option value="">Selecciona subcategoria</option>
            {subcategories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      <Card className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-700">Sucursales</h3>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setBranches((prev) => [...prev, { name: '', address: '', phone: '', isActive: true }])
            }
          >
            Agregar sucursal
          </Button>
        </div>

        {branches.length === 0 ? (
          <p className="text-sm text-zinc-500">Sin sucursales cargadas.</p>
        ) : (
          <div className="space-y-3">
            {branches.map((branch, index) => (
              <div key={`${branch.name}-${index}`} className="rounded-xl border border-zinc-100 p-3">
                <div className="grid gap-2 md:grid-cols-4">
                  <Input
                    placeholder="Nombre sucursal"
                    value={branch.name}
                    onChange={(event) =>
                      setBranches((prev) =>
                        prev.map((item, idx) => (idx === index ? { ...item, name: event.target.value } : item)),
                      )
                    }
                  />
                  <Input
                    placeholder="Direccion"
                    value={branch.address}
                    onChange={(event) =>
                      setBranches((prev) =>
                        prev.map((item, idx) => (idx === index ? { ...item, address: event.target.value } : item)),
                      )
                    }
                  />
                  <Input
                    placeholder="Telefono"
                    value={branch.phone}
                    onChange={(event) =>
                      setBranches((prev) =>
                        prev.map((item, idx) => (idx === index ? { ...item, phone: event.target.value } : item)),
                      )
                    }
                  />
                  <div className="flex items-center justify-between gap-2 rounded-lg border border-zinc-200 px-3 py-2">
                    <label className="text-xs text-zinc-600">Activa</label>
                    <input
                      type="checkbox"
                      checked={branch.isActive}
                      onChange={(event) =>
                        setBranches((prev) =>
                          prev.map((item, idx) =>
                            idx === index ? { ...item, isActive: event.target.checked } : item,
                          ),
                        )
                      }
                    />
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => setBranches((prev) => prev.filter((_, idx) => idx !== index))}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="space-y-3">
        <h3 className="text-sm font-semibold text-zinc-700">Dias y horarios de atencion</h3>
        <div className="space-y-2">
          {openingHours.map((row) => (
            <div key={row.day} className="grid items-center gap-2 rounded-lg border border-zinc-100 p-2 sm:grid-cols-[140px_110px_1fr_1fr]">
              <p className="text-sm font-medium text-zinc-700">{days.find((day) => day.key === row.day)?.label}</p>
              <label className="flex items-center gap-2 text-xs text-zinc-600">
                <input
                  type="checkbox"
                  checked={row.isOpen}
                  onChange={(event) =>
                    setOpeningHours((prev) =>
                      prev.map((item) => (item.day === row.day ? { ...item, isOpen: event.target.checked } : item)),
                    )
                  }
                />
                Abierto
              </label>
              <Input
                type="time"
                value={row.opensAt}
                disabled={!row.isOpen}
                onChange={(event) =>
                  setOpeningHours((prev) =>
                    prev.map((item) => (item.day === row.day ? { ...item, opensAt: event.target.value } : item)),
                  )
                }
              />
              <Input
                type="time"
                value={row.closesAt}
                disabled={!row.isOpen}
                onChange={(event) =>
                  setOpeningHours((prev) =>
                    prev.map((item) => (item.day === row.day ? { ...item, closesAt: event.target.value } : item)),
                  )
                }
              />
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-3">
        <h3 className="text-sm font-semibold text-zinc-700">WhatsApp y automatizaciones</h3>
        <Input
          placeholder="Mensaje de bienvenida"
          value={form.whatsappWelcomeMessage}
          onChange={(event) => setForm((prev) => ({ ...prev, whatsappWelcomeMessage: event.target.value }))}
        />
        <Input
          placeholder="Template recordatorio"
          value={form.whatsappReminderTemplate}
          onChange={(event) => setForm((prev) => ({ ...prev, whatsappReminderTemplate: event.target.value }))}
        />
        <Input
          placeholder="Texto ubicacion"
          value={form.whatsappLocationText}
          onChange={(event) => setForm((prev) => ({ ...prev, whatsappLocationText: event.target.value }))}
        />
        <Input
          placeholder="URL ubicacion"
          value={form.whatsappLocationUrl}
          onChange={(event) => setForm((prev) => ({ ...prev, whatsappLocationUrl: event.target.value }))}
        />
      </Card>

      <Card>
        <div className="flex flex-wrap gap-2">
          <Button
            disabled={updateMutation.isPending}
            onClick={() => {
              const { businessEmail, ...restForm } = form;
              const manualPaymentMethods =
                restForm.paymentMode === 'manual' && restForm.manualPaymentMethods.length === 0
                  ? ['cash']
                  : restForm.manualPaymentMethods;
              const credentialPatch: Record<string, unknown> = {};
              if (restForm.mercadoPagoAccessToken.trim()) {
                credentialPatch.mercadoPagoAccessToken = restForm.mercadoPagoAccessToken.trim();
              }
              if (restForm.mercadoPagoPublicKey.trim()) {
                credentialPatch.mercadoPagoPublicKey = restForm.mercadoPagoPublicKey.trim();
              }
              if (restForm.mercadoPagoWebhookSecret.trim()) {
                credentialPatch.mercadoPagoWebhookSecret = restForm.mercadoPagoWebhookSecret.trim();
              }
              const payload = {
                ...restForm,
                email: businessEmail || undefined,
                manualPaymentMethods,
                branches: branches.filter((branch) => branch.name.trim().length > 0),
                openingHours,
                ...credentialPatch,
              };
              updateMutation.mutate(payload);
            }}
          >
            Guardar configuracion del negocio
          </Button>
          <Button variant="outline" onClick={() => updateMutation.mutate({ whatsappAiEnabled: true })}>
            Activar IA
          </Button>
        </div>
        {message ? <p className="mt-3 rounded-lg bg-zinc-100 p-2 text-xs text-zinc-700">{message}</p> : null}
      </Card>
      <ErrorDialog message={errorDialogMessage} onClose={() => setErrorDialogMessage('')} />
    </div>
  );
}
