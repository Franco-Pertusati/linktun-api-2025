📌 Proyecto: LinkTun API
Un acortador de enlaces con soporte para usuarios anónimos y registrados.

Los usuarios anónimos pueden crear enlaces con vencimiento de 30 minutos.

Los usuarios registrados pueden crear enlaces con vencimientos personalizados (o sin vencimiento).

Características clave:

Autenticación con JWT

Rutas para registro (/auth/register) y login (/auth/login).

BearerAuth para proteger las rutas que requieren usuario autenticado.

Documentación con OpenAPI/Swagger

Archivo openapi.yaml con:

Encabezado (info, servers, tags).

Definición de esquemas (schemas) para usuarios, enlaces y errores.

Todas las rutas y respuestas posibles (200, 201, 400, 401, 409, 500).

Soporte para validación de requests/responses con express-openapi-validator.

Estructura escalable de proyecto

Separación de responsabilidades en carpetas: routes, controllers, services, models, middlewares, etc.

Uso de Prisma ORM para manejar base de datos PostgreSQL.

Base de datos

PostgreSQL instalado localmente.

Prisma ORM para migraciones y queries.

Esquemas para usuarios y, más adelante, para enlaces.