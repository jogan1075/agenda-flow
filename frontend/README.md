# Frontend SaaS Reservas

## Stack
- Next.js + TypeScript
- Tailwind CSS
- TanStack Query
- React Hook Form + Zod

## Ejecutar

```bash
cp .env.example .env.local
npm install
npm run dev
```

Abrir: `http://localhost:3000/login`

## Flujo recomendado
1. Inicia backend en `http://localhost:3000` (o cambia `NEXT_PUBLIC_API_URL`).
2. Inicia frontend en otro puerto: `npm run dev -- --port 3001`.
3. Ingresa con `businessId`, email y password creados en backend.

## Módulos incluidos
- Login
- Dashboard
- Agenda (crear/listar citas + disponibilidad por profesional)
- Clientes
- Servicios
- Profesionales
- Reportes
- Configuración WhatsApp
- Reserva pública para clientes: `/reservas` (elige servicio + profesional + horario disponible)
