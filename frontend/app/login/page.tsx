'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ApiError, api } from '@/lib/api';
import { setSession } from '@/lib/session';

const schema = z.object({
  businessId: z.string().min(1, 'Business ID requerido'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const loginMutation = useMutation({
    mutationFn: api.login,
    onSuccess: (data, vars) => {
      setSession({ token: data.accessToken, businessId: data.user.businessId, email: vars.email, role: data.user.role });
      router.push('/dashboard');
    },
  });

  const errorMessage =
    loginMutation.error instanceof ApiError
      ? loginMutation.error.message
      : loginMutation.isError
        ? 'No se pudo conectar con la API'
        : '';

  return (
    <div className="flex min-h-screen items-center justify-center bg-[conic-gradient(from_180deg_at_50%_50%,#fef3c7_0%,#dbeafe_45%,#fafaf9_100%)] p-4">
      <Card className="w-full max-w-md space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">SaaS Reservas</p>
          <h1 className="text-2xl font-semibold">Ingresar al panel</h1>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit((values) => loginMutation.mutate(values))}>
          <div>
            <Input placeholder="Business ID" {...register('businessId')} />
            {errors.businessId && <p className="mt-1 text-xs text-red-600">{errors.businessId.message}</p>}
          </div>
          <div>
            <Input placeholder="Email" type="email" {...register('email')} />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <Input placeholder="Password" type="password" {...register('password')} />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
          </div>
          {loginMutation.isError && <p className="rounded-lg bg-red-50 p-2 text-xs text-red-700">{errorMessage}</p>}
          <Button className="w-full" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? 'Ingresando...' : 'Ingresar'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
