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

## Estructura del Código

- `src/modules/*`: Módulos de negocio (Customers, Products, Orders, etc.).
- `src/common/*`: Filtros globales, Prisma service, DTOs compartidos.
- `prisma/schema.prisma`: Modelo de datos y relaciones.
- `prisma/seed.ts`: Datos iniciales para el catálogo.
