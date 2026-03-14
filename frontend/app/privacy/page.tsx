import Link from 'next/link';
import { MarketingLayout } from '@/components/marketing-layout';

export default function PrivacyPolicyPage() {
  return (
    <MarketingLayout>
      <section className="mx-auto max-w-4xl px-6 pb-16">
        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">AgendaFlow</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">Política de privacidad</h1>
          <p className="mt-2 text-sm text-slate-500">Última actualización: 14 de marzo de 2026</p>

          <div className="mt-8 space-y-6 text-sm text-slate-600">
            <p>
              En AgendaFlow respetamos tu privacidad. Esta política explica qué información recolectamos, cómo la
              usamos y las opciones que tienes sobre tus datos.
            </p>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Información que recopilamos</h2>
              <ul className="mt-2 list-disc space-y-2 pl-5">
                <li>Datos de contacto necesarios para gestionar reservas.</li>
                <li>Información del negocio, servicios y profesionales configurados por la cuenta.</li>
                <li>Mensajes enviados por WhatsApp, email o web para confirmar y recordar citas.</li>
              </ul>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Cómo usamos la información</h2>
              <ul className="mt-2 list-disc space-y-2 pl-5">
                <li>Procesar reservas, confirmar citas y enviar recordatorios.</li>
                <li>Generar reportes de ventas y comisiones para el negocio.</li>
                <li>Mejorar la calidad del servicio y prevenir fraude.</li>
              </ul>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Contacto</h2>
              <p className="mt-2">
                Para consultas sobre privacidad, escribe a{' '}
                <Link href="mailto:soporte@agendaflow.com" className="font-semibold text-[var(--af-primary)]">
                  soporte@agendaflow.com
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
