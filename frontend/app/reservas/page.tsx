import { redirect } from 'next/navigation';
import { PublicReservas } from '@/components/public-reservas';

export default function ReservasPage({
  searchParams,
}: {
  searchParams?: { businessId?: string; business?: string };
}) {
  const businessId = searchParams?.businessId ?? searchParams?.business;
  if (businessId) {
    redirect(`/reservas/${businessId}`);
  }
  return <PublicReservas />;
}
