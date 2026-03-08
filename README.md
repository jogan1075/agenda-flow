# Backend MVP Reservas (NestJS + MongoDB)

## Requisitos
- Node.js 20+
- MongoDB local o en la nube

## Configuracion
1. Copia variables de entorno:

```bash
cp .env.example .env
```

2. Ajusta `MONGODB_URI` en `.env`.

## Ejecutar

```bash
npm install
npm run start:dev
```

API base: `http://localhost:3000/api`

## Configuracion WhatsApp (recordatorios)
- `WHATSAPP_PROVIDER=twilio` o `meta`
- Si usas Twilio:
  - `TWILIO_ACCOUNT_SID`
  - `TWILIO_AUTH_TOKEN`
  - `TWILIO_WHATSAPP_FROM` (ejemplo: `+14155238886`)
- Si usas Meta Cloud API:
  - `META_WHATSAPP_ACCESS_TOKEN`
  - `META_WHATSAPP_PHONE_NUMBER_ID`
  - `META_WEBHOOK_VERIFY_TOKEN`
- IA en atencion automatica (opcional):
  - `OPENAI_API_KEY`

El scheduler corre cada minuto y procesa recordatorios `pending` con:
- `channel = whatsapp`
- `scheduledFor <= now`

## Bot de reservas por WhatsApp
Funciones cubiertas:
- Reserva por WhatsApp
- Consulta de disponibilidad
- Confirmacion automatica
- Cancelacion por WhatsApp
- Reprogramacion por WhatsApp
- Recordatorios automaticos
- Mensajes personalizados por negocio
- Envio de ubicacion
- Confirmacion con botones (Meta; en Twilio hay fallback a texto)
- Atencion automatica con IA (si hay `OPENAI_API_KEY`)

Webhooks:
- `POST /api/whatsapp-bot/webhook/twilio/:businessId`
- `POST /api/whatsapp-bot/webhook/twilio?businessId=...`
- `GET /api/whatsapp-bot/webhook/meta` (verificacion Meta)
- `POST /api/whatsapp-bot/webhook/meta/:businessId`
- `POST /api/whatsapp-bot/webhook/meta?businessId=...`

Utilidad:
- `POST /api/whatsapp-bot/send-location/:businessId?to=+569...`

## Modulos incluidos (MVP)
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/businesses`
- `GET /api/businesses/:id`
- `PATCH /api/businesses/:id`
  - Permite configurar:
    - `whatsappWelcomeMessage`
    - `whatsappReminderTemplate` (placeholders: `{{cliente}}`, `{{negocio}}`, `{{fecha}}`, `{{hora}}`)
    - `whatsappLocationText`
    - `whatsappLocationUrl`
    - `whatsappAiEnabled`
- `POST /api/services`
- `GET /api/services?businessId=...`
- `PATCH /api/services/:id`
- `DELETE /api/services/:id`
- `POST /api/professionals`
- `GET /api/professionals?businessId=...`
- `PATCH /api/professionals/:id`
- `DELETE /api/professionals/:id`
- `POST /api/customers`
- `GET /api/customers?businessId=...&search=...`
- `PATCH /api/customers/:id`
- `DELETE /api/customers/:id`
- `POST /api/appointments`
- `GET /api/appointments?businessId=...&from=...&to=...`
- `PATCH /api/appointments/:id`
- `POST /api/reminders`
- `GET /api/reminders/pending?until=...`
- `PATCH /api/reminders/:id`
- `POST /api/reminders/process-now?limit=50`
- `GET /api/reports/basic?businessId=...&from=...&to=...`

## Notas
- Validacion global activada con `ValidationPipe`.
- `appointments` valida traslape de citas por profesional.
- La autenticacion devuelve JWT, pero aun no se aplican guards por endpoint (siguiente paso recomendado).
- `reminders` usa flujo seguro `pending -> processing -> sent/failed` para evitar duplicados.

## Deploy en Render Free (sin pago)
Este repo incluye [render.yaml](/Users/jonathan.munoz/Documents/New%20project/render.yaml) para crear 2 servicios Free:
- `reservas-api` (NestJS)
- `reservas-web` (Next.js unificado: manager + reservas cliente)

Pasos:
1. Sube el repo a GitHub.
2. En Render: `New` -> `Blueprint` -> conecta el repo.
3. Render leerá `render.yaml` y propondrá los 2 servicios.
4. Completa variables `sync: false` (Mongo, Twilio/Meta, SMTP, etc.).
5. En `reservas-web`, ajusta `NEXT_PUBLIC_API_URL` al dominio real de `reservas-api`.
6. Opcional: define `NEXT_PUBLIC_DEFAULT_BUSINESS_ID` para que `/reservas` no pida business ID manual.

Rutas:
- Manager: `/login` y panel interno
- Cliente: `/reservas`
