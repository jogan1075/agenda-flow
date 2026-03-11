import { redirect } from 'next/navigation';
import { PublicReservas } from '@/components/public-reservas';

export default async function ReservasPage({
  searchParams,
}: {
  searchParams?: Promise<{ businessId?: string; business?: string }>;
}) {
  const resolved = searchParams ? await searchParams : undefined;
  const businessId = resolved?.businessId ?? resolved?.business;
  if (businessId) {
    redirect(`/reservas/${businessId}`);
  }
  return <PublicReservas />;
}
