'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SectionHeader } from '@/components/section-header';
import { api } from '@/lib/api';
import { getSession } from '@/lib/session';

export default function SuperAdminPage() {
  const router = useRouter();
  const session = getSession();
  const role = session?.role ?? 'staff';
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const createOwnerMutation = useMutation({
    mutationFn: () =>
      api.createOwnerBySuperAdmin(
        {
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          password,
        },
        session?.token ?? '',
      ),
    onSuccess: () => {
      setMessage('Cuenta owner creada. El cliente ya puede iniciar sesión y crear su negocio.');
      setFullName('');
      setEmail('');
      setPassword('');
    },
    onError: (error) => {
      const detail = error instanceof Error ? error.message : 'Error desconocido';
      setMessage(`No se pudo crear la cuenta: ${detail}`);
    },
  });

  if (role !== 'super_admin') {
    return (
      <div className="space-y-6">
        <SectionHeader title="SuperAdmin" subtitle="Acceso restringido" />
        <Card>
          <p className="text-sm text-zinc-600">Solo un super admin puede crear administradores de negocio.</p>
          <Button className="mt-3" variant="outline" onClick={() => router.push('/dashboard')}>
            Volver
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="SuperAdmin"
        subtitle="Crear cuenta owner para que el cliente configure su negocio desde cero"
      />

      <Card className="space-y-3">
        <div className="grid gap-3 md:grid-cols-3">
          <Input placeholder="Nombre completo" value={fullName} onChange={(event) => setFullName(event.target.value)} />
          <Input placeholder="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <Input
            placeholder="Contraseña inicial"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <Button
          disabled={createOwnerMutation.isPending}
          onClick={() => {
            if (!fullName.trim() || !email.trim() || password.length < 6) {
              setMessage('Completa nombre, email y una contraseña de al menos 6 caracteres.');
              return;
            }
            createOwnerMutation.mutate();
          }}
        >
          Crear cuenta owner
        </Button>
        {message ? <p className="rounded-lg bg-zinc-100 p-2 text-xs text-zinc-700">{message}</p> : null}
      </Card>
    </div>
  );
}
