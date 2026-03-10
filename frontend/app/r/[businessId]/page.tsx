import { PublicReservas } from '@/components/public-reservas';

export default function PublicReservasPage({ params }: { params: { businessId: string } }) {
  return <PublicReservas initialBusinessId={params.businessId} />;
}
