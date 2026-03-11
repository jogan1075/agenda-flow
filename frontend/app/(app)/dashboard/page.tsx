'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { addDays, formatISO } from 'date-fns';
import { Card } from '@/components/ui/card';
import { SectionHeader } from '@/components/section-header';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { useBusinessId } from '@/lib/use-business-id';

type SalesRow = {
  id: string;
  startsAt: string;
  customerName: string;
  professionalName: string;
  professionalId: string;
  commissionPercent: number;
  amount: number;
  status: string;
};

function toCurrency(value: number) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(value);
}

function statusTag(status: string) {
  if (status === 'cancelled') return { text: 'Anulada', className: 'bg-rose-50 text-rose-600' };
  if (status === 'pending') return { text: 'Pago parcial', className: 'bg-amber-50 text-amber-700' };
  return { text: 'Pagada', className: 'bg-emerald-50 text-emerald-700' };
}

export default function DashboardPage() {
  const businessId = useBusinessId();
  const from = formatISO(addDays(new Date(), -30), { representation: 'date' }) + 'T00:00:00.000Z';
  const to = formatISO(addDays(new Date(), 1), { representation: 'date' }) + 'T23:59:59.000Z';

  const businessQuery = useQuery({
    queryKey: ['business', businessId],
    queryFn: () => api.getBusinesses(businessId),
    enabled: !!businessId,
  });

  const appointmentsQuery = useQuery({
    queryKey: ['dashboard-appointments', businessId, from, to],
    queryFn: () => api.listAppointments(businessId, from, to),
    enabled: !!businessId,
  });

  const servicesQuery = useQuery({
    queryKey: ['dashboard-services', businessId],
    queryFn: () => api.listServices(businessId),
    enabled: !!businessId,
  });

  const customersQuery = useQuery({
    queryKey: ['dashboard-customers', businessId],
    queryFn: () => api.listCustomers(businessId),
    enabled: !!businessId,
  });

  const professionalsQuery = useQuery({
    queryKey: ['dashboard-professionals', businessId],
    queryFn: () => api.listProfessionals(businessId),
    enabled: !!businessId,
  });

  const isBeauty = String((businessQuery.data as Record<string, unknown> | undefined)?.businessCategory ?? '') === 'ESTETICA_Y_BELLEZA';

  const serviceMap = useMemo(
    () => new Map((servicesQuery.data ?? []).map((service) => [String(service._id), Number(service.price ?? 0)])),
    [servicesQuery.data],
  );
  const customerMap = useMemo(
    () => new Map((customersQuery.data ?? []).map((customer) => [String(customer._id), String(customer.fullName ?? 'Cliente')])),
    [customersQuery.data],
  );
  const professionalMap = useMemo(
    () =>
      new Map(
        (professionalsQuery.data ?? []).map((professional) => [
          String(professional._id),
          {
            fullName: String(professional.fullName ?? 'Profesional'),
            commissionPercent: Number(professional.commissionPercent ?? 0),
          },
        ]),
      ),
    [professionalsQuery.data],
  );

  const salesRows = useMemo(() => {
    return (appointmentsQuery.data ?? [])
      .map((appointment) => {
        const serviceId = String(appointment.serviceId ?? '');
        const professionalId = String(appointment.professionalId ?? '');

        return {
          id: String(appointment._id),
          startsAt: String(appointment.startsAt),
          customerName: customerMap.get(String(appointment.customerId)) ?? 'Cliente',
          professionalName: professionalMap.get(professionalId)?.fullName ?? 'Profesional',
          professionalId,
          commissionPercent: professionalMap.get(professionalId)?.commissionPercent ?? 0,
          amount: serviceMap.get(serviceId) ?? 0,
          status: String(appointment.status ?? 'confirmed'),
        } satisfies SalesRow;
      })
      .sort((a, b) => (a.startsAt < b.startsAt ? 1 : -1));
  }, [appointmentsQuery.data, customerMap, professionalMap, serviceMap]);

  const totalSalesAmount = useMemo(
    () => salesRows.filter((row) => row.status !== 'cancelled').reduce((acc, row) => acc + row.amount, 0),
    [salesRows],
  );

  const commissionRows = useMemo(() => {
    const result = new Map<string, { professionalName: string; totalSales: number; commissionAmount: number }>();

    salesRows.forEach((row) => {
      if (row.status === 'cancelled') return;

      const key = row.professionalId || row.professionalName;
      const current = result.get(key) ?? {
        professionalName: row.professionalName,
        totalSales: 0,
        commissionAmount: 0,
      };

      current.totalSales += row.amount;
      current.commissionAmount += row.amount * (row.commissionPercent / 100);
      result.set(key, current);
    });

    return Array.from(result.values()).sort((a, b) => b.totalSales - a.totalSales);
  }, [salesRows]);

  const downloadCommissionsCsv = () => {
    const header = 'Profesional,Ventas totales,Monto comision\n';
    const rows = commissionRows
      .map((row) => `${row.professionalName},${Math.round(row.totalSales)},${Math.round(row.commissionAmount)}`)
      .join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'detalle-comisiones.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Dashboard" subtitle="Ventas, agenda y productividad" />

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-zinc-600">Comparte este enlace para que tus clientes reserven online.</p>
          <Button
            variant="outline"
            onClick={() => {
              if (!businessId) return;
              window.open(`/r/${businessId}`, '_blank');
            }}
          >
            Ver pagina de reservas
          </Button>
        </div>
      </Card>

      {!isBeauty ? (
        <Card>
          <p className="text-sm text-zinc-600">
            Este tablero de ventas/comisiones esta optimizado para Estetica y Belleza. Selecciona ese tipo de negocio en
            Configuracion para habilitar el detalle completo.
          </p>
        </Card>
      ) : null}

      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-zinc-500">Ventas (ultimos 30 dias)</p>
            <h3 className="text-2xl font-semibold text-emerald-500 md:text-4xl">{toCurrency(totalSalesAmount)}</h3>
          </div>
          <Button variant="outline" className="w-full sm:w-auto" onClick={downloadCommissionsCsv}>
            Exportar
          </Button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-zinc-100">
          <table className="min-w-[760px] text-sm">
            <thead className="bg-zinc-50 text-left text-zinc-500">
              <tr>
                <th className="px-4 py-3">Fecha de venta</th>
                <th className="px-4 py-3">Monto</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Profesional</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {salesRows.slice(0, 12).map((row) => {
                const tag = statusTag(row.status);
                return (
                  <tr key={row.id} className="border-t border-zinc-100">
                    <td className="px-4 py-3">{new Date(row.startsAt).toLocaleString('es-CL')}</td>
                    <td className="px-4 py-3 font-semibold text-zinc-800">{toCurrency(row.amount)}</td>
                    <td className="px-4 py-3">{row.customerName}</td>
                    <td className="px-4 py-3">{row.professionalName}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs ${tag.className}`}>{tag.text}</span>
                    </td>
                  </tr>
                );
              })}
              {salesRows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-4 text-center text-zinc-500">
                    Aun no hay ventas registradas en el rango.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-2xl font-semibold text-zinc-900 md:text-3xl">Detalle de comisiones</h3>
          <Button variant="outline" className="w-full sm:w-auto" onClick={downloadCommissionsCsv}>
            Descargar reporte
          </Button>
        </div>
        <div className="overflow-x-auto rounded-xl border border-zinc-100">
          <table className="min-w-[560px] text-sm">
            <thead className="bg-zinc-50 text-left text-zinc-500">
              <tr>
                <th className="px-4 py-3">Profesional</th>
                <th className="px-4 py-3">Ventas totales</th>
                <th className="px-4 py-3">Monto comision</th>
              </tr>
            </thead>
            <tbody>
              {commissionRows.map((row) => (
                <tr key={row.professionalName} className="border-t border-zinc-100">
                  <td className="px-4 py-3">{row.professionalName}</td>
                  <td className="px-4 py-3">{toCurrency(row.totalSales)}</td>
                  <td className="px-4 py-3 font-semibold text-zinc-800">{toCurrency(row.commissionAmount)}</td>
                </tr>
              ))}
              {commissionRows.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-4 text-center text-zinc-500">
                    Sin comisiones para mostrar.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
