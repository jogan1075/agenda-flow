import { redirect } from 'next/navigation';

export default function HomePage() {
  const appMode = process.env.NEXT_PUBLIC_APP_MODE;
  if (appMode === 'reservas') {
    redirect('/reservas');
  }
  redirect('/login');
}
