# Prograde CCTV & Automation Backend (MVP)

Backend robusto desarrollado en NestJS para la gestión de clientes, requerimientos de servicios, citas y catálogo de productos con carrito de compras.

## Tecnologías

- **NestJS** (Framework)
- **Prisma** (ORM)
- **PostgreSQL** (Database)
- **Docker** (Infraestructura)
- **Swagger** (Documentación API)

## Requisitos Previos

- Docker y Docker Compose instalados.
- Node.js v18+ (opcional para ejecución local).

## Pasos para Ejecutar

1. **Variables de Entorno**: El proyecto incluye un `.env.example`. Para desarrollo, puedes copiarlo a `.env`.
   ```bash
   cp .env.example .env
   ```

2. **Levantar Infraestructura (Docker)**:
   ```bash
   docker compose up -d
   ```

3. **Ejecutar Migraciones y Seed**:
   Si tienes Node instalado localmente:
   ```bash
   npm install
   npx prisma migrate dev --name init
   npm run seed
   ```
   O vía Docker:
   ```bash
   docker exec -it prograde-api npx prisma migrate deploy
   docker exec -it prograde-api npm run seed
   ```

## Configuración de Correo (SMTP)

El sistema utiliza un módulo de correo para notificar a clientes y técnicos sobre nuevas citas. Para configurarlo, asegúrate de tener las siguientes variables en tu `.env`:

```env
SMTP_HOST=tu_servidor_smtp
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu_usuario
SMTP_PASS=tu_password
SMTP_FROM="Seguridad Integral <no-reply@tu-dominio.com>"
TECH_EMAIL=correo_tecnico@tu-dominio.com
APP_PUBLIC_URL=http://localhost:3000
```

> [!NOTE]
> Si las variables no están configuradas, el sistema registrará un error en los logs pero permitirá que la cita se guarde correctamente (fail-safe).

4. **Documentación API**:
   Accede a `http://localhost:3000/api/docs` para ver y probar todos los endpoints.

## Endpoints Principales

### Productos
- `GET /api/products`: Catálogo paginado con filtros de categoría.
- `GET /api/products/:id`: Detalle del producto.

### Clientes y Direcciones
- `POST /api/customers`: Registrar cliente.
- `GET /api/customers`: Listado paginado.
- `GET /api/customers/:id`: Detalle con direcciones.

### Leads (Requerimientos)
- `POST /api/leads`: Registro de requerimiento (CCTV, Domótica, etc.).
- `GET /api/leads`: Listado con filtros de urgencia y tipo.

### Citas
- `POST /api/appointments`: Agendar cita.
- `GET /api/appointments`: Calendario de citas.

### Ordenes y Carrito
- `GET /api/orders/cart?customerId=...`: Obtener o crear carrito activo.
- `POST /api/orders/cart/items`: Agregar producto al carrito.
- `POST /api/orders/cart/submit`: Convertir carrito en solicitud formal.
- `GET /api/orders`: Listar órdenes enviadas.

## Flujo del Funnel y Instrumentación (Lead Events)

El sistema está instrumentado para rastrear el viaje del cliente a través de un "funnel" de ventas, registrando cada acción significativa en la tabla `lead_events`.

### Proceso Sugerido para el Frontend:

1.  **Paso 1: Identificación (Customer)**
    *   `POST /api/customers`
    *   **Idempotente**: Si el email ya existe, devuelve el cliente actual.
    *   **Evento**: `CUSTOMER_CREATED` (Incluye UTMs y Referrer).
    *   **Retorno**: `customerId`.

2.  **Paso 2: Calificación (Lead)**
    *   `POST /api/leads`
    *   Captura necesidades (CCTV, Domótica, etc.).
    *   **Evento**: `LEAD_CREATED`.
    *   **Retorno**: `leadId`.

3.  **Paso 3: Compromiso (Appointment)**
    *   `POST /api/appointments`
    *   Agenda visita técnica o llamada.
    *   **Evento**: `APPOINTMENT_SCHEDULED`.
    *   **Retorno**: `appointmentId`.

4.  **Paso 4: Intención de Compra (Order DRAFT)**
    *   `POST /api/orders`
    *   Crea una cotización en borrador con productos de Syscom.
    *   **Retorno**: `orderId`.

5.  **Paso 5: Conversión (Order SUBMITTED)**
    *   `PATCH /api/orders/:id/submit`
    *   Finaliza el borrador, dispara correo de cotización al cliente.
    *   **Evento**: `ORDER_SUBMITTED`.

### Contratos de Respuesta y Errores
- **201 Created / 200 OK**: Devuelve el objeto completo con su ID (uuid).
- **400 Bad Request**: Datos de entrada inválidos (ej. teléfono != 10 dígitos).
- **404 Not Found**: Recurso no encontrado.
- **409 Conflict**: Intento de duplicación en estados no permitidos (ej. enviar una orden ya enviada).

## Estructura del Código

- `src/modules/leadevents`: Servicio interno para registro de eventos (no expuesto vía REST).
- `src/modules/*`: Módulos de negocio (Customers, Products, Orders, etc.).
- `src/common/*`: Filtros globales, Prisma service, DTOs compartidos.
- `src/modules/mail`: Módulo de gestión de correos con plantillas Handlebars.
- `prisma/schema.prisma`: Modelo de datos y relaciones.
- `prisma/seed.ts`: Datos iniciales para el catálogo.
