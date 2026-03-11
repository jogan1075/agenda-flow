'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MarketingLayout } from '@/components/marketing-layout';

export default function PlanesPage() {
  const [billing, setBilling] = useState<'mensual' | 'anual'>('mensual');
  const formatCLP = (amount: number) => `$ ${amount.toLocaleString('es-CL')}`;
  const plans = [
    {
      name: 'Individual',
      mensual: { amount: 19990, desc: 'Ideal para independientes que quieren ordenar su agenda.' },
      anual: { desc: 'Pago anual equivalente a 10 meses.' },
      perks: ['1 agenda', 'Reservas online', 'Recordatorios automáticos'],
    },
    {
      name: 'Básico',
      mensual: { amount: 39990, desc: 'Para negocios que necesitan control y administración.' },
      anual: { desc: 'Pago anual equivalente a 10 meses.' },
      perks: ['5 agendas', 'Caja y comisiones', 'Inventarios básicos'],
    },
    {
      name: 'Premium',
      mensual: { amount: 69990, desc: 'Más fidelización y herramientas de marketing.' },
      anual: { desc: 'Pago anual equivalente a 10 meses.' },
      perks: ['10 agendas', 'Email marketing', 'Encuestas de satisfacción'],
      highlight: true,
    },
    {
      name: 'Pro',
      mensual: { amount: 119990, desc: 'Marca propia y personalización avanzada.' },
      anual: { desc: 'Pago anual equivalente a 10 meses.' },
      perks: ['15 agendas', 'App personalizada', 'Integraciones / API'],
    },
  ];

  return (
    <MarketingLayout>
      <section className="relative mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Planes</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">Compara nuestros planes</h1>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 text-xs">
              <button
                type="button"
                className={`rounded-full px-3 py-1 font-semibold transition ${
                  billing === 'mensual' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
                onClick={() => setBilling('mensual')}
              >
                Mensual
              </button>
              <button
                type="button"
                className={`rounded-full px-3 py-1 font-semibold transition ${
                  billing === 'anual' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
                onClick={() => setBilling('anual')}
              >
                Anual (paga 10 meses)
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-4">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-3xl border p-6 shadow-sm ${
                  plan.highlight ? 'border-slate-300 bg-slate-50' : 'border-slate-100 bg-white'
                }`}
              >
                <p className="text-sm font-semibold text-slate-900">{plan.name}</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  {billing === 'mensual'
                    ? formatCLP(plan.mensual.amount)
                    : formatCLP(plan.mensual.amount * 10)}
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  {billing === 'mensual' ? plan.mensual.desc : plan.anual.desc}
                </p>
                <div className="mt-4 grid gap-2 text-xs text-slate-600">
                  {plan.perks.map((perk) => (
                    <span key={perk} className="rounded-full border border-slate-100 bg-white px-3 py-2">
                      {perk}
                    </span>
                  ))}
                </div>
                <Link
                  href="/login"
                  className={`mt-6 inline-flex w-full items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition ${
                    plan.highlight
                      ? 'bg-[var(--af-action)] text-white hover:brightness-110'
                      : 'border border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {plan.highlight ? 'Elegir plan' : 'Hablar con ventas'}
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-3xl border border-slate-100 bg-white p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Comparación rápida</p>
            <div className="mt-4 overflow-auto">
              <table className="min-w-[720px] text-left text-xs text-slate-600">
                <thead className="text-slate-500">
                  <tr>
                    <th className="py-2 pr-4">Funciones clave</th>
                    <th className="py-2 pr-4">Individual</th>
                    <th className="py-2 pr-4">Básico</th>
                    <th className="py-2 pr-4">Premium</th>
                    <th className="py-2 pr-4">Pro</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Sitio web de reservas', 'Incluido', 'Incluido', 'Incluido', 'Incluido'],
                    ['Agenda online de citas y clases', 'Incluido', 'Incluido', 'Incluido', 'Incluido'],
                    ['Recordatorios automáticos', 'Sí', 'Sí', 'Sí', 'Sí'],
                    ['Email marketing', 'No', 'Opcional', 'Incluido', 'Incluido'],
                    ['Encuestas de satisfacción', 'No', 'No', 'Incluido', 'Incluido'],
                    ['Integraciones / API', 'No', 'No', 'No', 'Incluido'],
                  ].map((row) => (
                    <tr key={row[0]} className="border-t border-slate-100">
                      {row.map((cell, idx) => (
                        <td key={`${row[0]}-${idx}`} className="py-2 pr-4">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-10">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Productos adicionales</p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {[
                { title: 'WhatsApp', text: 'Recordatorios automáticos y confirmaciones por WhatsApp.' },
                { title: 'Videoconferencia', text: 'Atiende consultas online sin salir de AgendaFlow.' },
                { title: 'Facturación electrónica', text: 'Emisión automática de documentos tributarios.' },
                { title: 'Charly Marketing', text: 'Asistente digital para atraer más reservas.' },
                { title: 'Boleta de honorarios', text: 'Emite boletas directo desde el sistema.' },
                { title: 'POS integrado', text: 'Cobra con tarjeta y sincroniza ventas.' },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
