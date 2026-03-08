# SaaS de Reservas - MVP Comercial

## Objetivo
Lanzar una version vendible con 10 funcionalidades clave:

1. Registro de negocio
2. Creacion de servicios
3. Creacion de profesionales
4. Agenda calendario
5. Crear citas
6. Reservas web
7. Reservas por WhatsApp
8. Recordatorios automaticos
9. Gestion de clientes
10. Reportes basicos

## Alcance funcional (v1)

### 1) Registro de negocio
- Alta de cuenta (email + password).
- Datos de negocio: nombre, telefono, direccion, zona horaria.
- Configuracion basica: moneda, horario de atencion.

### 2) Creacion de servicios
- Nombre, duracion, precio, categoria.
- Estado activo/inactivo.
- Servicios asignables por profesional.

### 3) Creacion de profesionales
- Datos base: nombre, email, telefono.
- Especialidades (servicios permitidos).
- Horario semanal por profesional.

### 4) Agenda calendario
- Vista diaria/semanal.
- Filtros por profesional/servicio.
- Bloques de ocupado/disponible.

### 5) Crear citas
- Creacion manual desde agenda.
- Reagendar/cancelar.
- Estados: pendiente, confirmada, cancelada, completada, no_show.

### 6) Reservas web
- Link publico del negocio.
- Seleccion de servicio + profesional + horario.
- Confirmacion de reserva.

### 7) Reservas por WhatsApp
- Boton directo a WhatsApp en pagina de reservas.
- Flujo semiautomatico: mensaje prellenado con datos base.
- (v2) Bot conversacional + integracion API.

### 8) Recordatorios automaticos
- Recordatorio 24h y 2h antes de la cita.
- Canales: email (v1), WhatsApp (v1.5/v2 segun proveedor).
- Plantillas editables por negocio.

### 9) Gestion de clientes
- Ficha cliente: nombre, telefono, email, notas.
- Historial de citas por cliente.
- Busqueda por nombre/telefono.

### 10) Reportes basicos
- Citas por estado (periodo).
- Ingresos por periodo.
- Top servicios y ocupacion por profesional.

## Fases recomendadas

## Fase 1 (Semanas 1-2)
- Auth + negocio + servicios + profesionales.
- Base calendario (lectura de disponibilidad).

## Fase 2 (Semanas 3-4)
- CRUD de citas + reservas web.
- Gestion de clientes.

## Fase 3 (Semanas 5-6)
- Recordatorios automaticos.
- Reportes basicos.
- Boton/flujo WhatsApp.

## Criterios de salida para vender
- Un negocio puede operar su agenda diaria completa.
- Puede captar reservas online sin intervencion manual.
- Puede enviar recordatorios y reducir no-show.
- Puede medir ocupacion e ingresos basicos.

