'use client';

import { addDays, formatISO } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from '@/components/ui/card';
import { SectionHeader } from '@/components/section-header';
import { api } from '@/lib/api';
import { useBusinessId } from '@/lib/use-business-id';

export default function ReportesPage() {
  const isBrowser = typeof window !== 'undefined';
  const businessId = useBusinessId();
  const from = formatISO(new Date(), { representation: 'date' }) + 'T00:00:00.000Z';
  const to = formatISO(addDays(new Date(), 30), { representation: 'date' }) + 'T23:59:59.000Z';

  const reportQuery = useQuery({
    queryKey: ['basic-report', businessId, from, to],
    queryFn: () => api.basicReport(businessId, from, to),
    enabled: !!businessId,
  });

  return (
    <div className="space-y-6">
      <SectionHeader title="Reportes" subtitle="Métricas de operación" />
      <Card className="h-[320px]">
        {isBrowser ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={reportQuery.data?.byStatus ?? []}>
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#18181b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : null}
      </Card>
    </div>
  );
}
