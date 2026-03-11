import { PublicReservas } from '@/components/public-reservas';

export default async function PublicReservasPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const { businessId } = await params;
  return <PublicReservas initialBusinessId={businessId} />;
}
