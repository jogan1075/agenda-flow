'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Calendar, ChartBar, LogOut, Menu, MessageSquare, Scissors, UserSquare2, Users, X } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { clearSession, getSession } from '@/lib/session';
import { cn } from '@/lib/utils';

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: ChartBar },
  { href: '/agenda', label: 'Agenda', icon: Calendar },
  { href: '/clientes', label: 'Clientes', icon: Users },
  { href: '/servicios', label: 'Servicios', icon: Scissors },
  { href: '/profesionales', label: 'Profesionales', icon: UserSquare2 },
  { href: '/reportes', label: 'Reportes', icon: ChartBar },
];
const superAdminNav = [{ href: '/superadmin', label: 'SuperAdmin', icon: Users }];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<ReturnType<typeof getSession> | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const role = session?.role ?? 'staff';
  const hasBusiness = !!session?.businessId;
  const canManageSettings = role === 'owner' || role === 'admin' || role === 'super_admin';
  const baseNav = hasBusiness ? nav : [];
  const navItems = isHydrated
    ? [
        ...baseNav,
        ...(canManageSettings ? [{ href: '/configuracion', label: 'Configuracion', icon: MessageSquare }] : []),
        ...(role === 'super_admin' ? superAdminNav : []),
      ]
    : [];

  useEffect(() => {
    setSession(getSession());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    if (!session) router.replace('/login');
  }, [isHydrated, session, router]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_0%_0%,#dbeafe_0,#f8fafc_40%,#fafaf9_100%)]">
      <button
        type="button"
        className="fixed left-4 top-4 z-50 rounded-full border border-zinc-200 bg-white p-3 text-zinc-700 shadow-lg md:hidden"
        onClick={() => setMobileMenuOpen((prev) => !prev)}
        aria-label="Abrir menu"
      >
        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {mobileMenuOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/30 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Cerrar menu"
          />
          <aside className="fixed left-0 top-0 z-50 h-full w-[280px] border-r border-zinc-200 bg-white p-4 shadow-xl md:hidden">
            <div className="mb-6 mt-12 px-2">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">SaaS Reservas</p>
              <h1 className="text-xl font-semibold text-zinc-900">Control Central</h1>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={`mobile-${item.href}`}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition',
                      pathname === item.href ? 'bg-zinc-900 text-white' : 'text-zinc-700 hover:bg-zinc-100',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <Button
              variant="outline"
              className="mt-6 w-full"
              onClick={() => {
                clearSession();
                router.replace('/login');
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </Button>
          </aside>
        </>
      ) : null}

      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 gap-4 p-3 pt-16 md:gap-6 md:grid-cols-[260px_1fr] md:p-4 md:pt-4">
        <aside className="hidden rounded-2xl border border-zinc-200 bg-white/90 p-4 shadow-sm backdrop-blur md:block">
          <div className="mb-6 px-2">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">SaaS Reservas</p>
            <h1 className="text-xl font-semibold text-zinc-900">Control Central</h1>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition',
                    pathname === item.href ? 'bg-zinc-900 text-white' : 'text-zinc-700 hover:bg-zinc-100',
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <Button
            variant="outline"
            className="mt-6 w-full"
            onClick={() => {
              clearSession();
              router.replace('/login');
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </Button>
        </aside>
        <main className="rounded-2xl border border-zinc-200 bg-white/80 p-3 shadow-sm backdrop-blur md:p-6">{children}</main>
      </div>
    </div>
  );
}
