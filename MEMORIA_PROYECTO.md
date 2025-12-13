# Memoria del Proyecto: WebFactory

## Índice

1. [Descripción General](#1-descripción-general)
2. [Objetivos del Proyecto](#2-objetivos-del-proyecto)
3. [Tecnologías Utilizadas](#3-tecnologías-utilizadas)
4. [Arquitectura del Sistema](#4-arquitectura-del-sistema)
5. [Modelo de Datos](#5-modelo-de-datos)
6. [Funcionalidades Implementadas](#6-funcionalidades-implementadas)
7. [Flujo de Compra y Despliegue](#7-flujo-de-compra-y-despliegue)
8. [Estructura del Proyecto](#8-estructura-del-proyecto)
9. [Configuración y Despliegue](#9-configuración-y-despliegue)
10. [Conclusiones](#10-conclusiones)

---

## 1. Descripción General

**WebFactory** es una plataforma de e-commerce especializada en la venta de plantillas web. Los usuarios pueden navegar por un catálogo de plantillas, personalizarlas con sus propios datos (nombre de empresa, colores, logo, etc.), realizar el pago y obtener automáticamente su sitio web desplegado en la nube.

### Características Principales

- **Catálogo de plantillas web** organizadas por categorías
- **Formularios dinámicos** de configuración según el tipo de plantilla
- **Sistema de autenticación** con email/contraseña
- **Carrito de compras** persistente
- **Pagos integrados** con PayPal
- **Despliegue automático** a AWS S3 tras el pago
- **Panel de administración** para gestionar usuarios, productos y órdenes

---

## 2. Objetivos del Proyecto

### Objetivo Principal
Desarrollar una aplicación web completa que permita a usuarios sin conocimientos técnicos obtener un sitio web profesional de forma rápida y sencilla.

### Objetivos Específicos

1. **Implementar un e-commerce funcional** con catálogo, carrito y checkout
2. **Crear un sistema de personalización** mediante formularios dinámicos
3. **Automatizar el despliegue** de sitios web estáticos
4. **Integrar pasarela de pago** (PayPal)
5. **Desarrollar panel de administración** para gestión de contenidos
6. **Aplicar buenas prácticas** de desarrollo (TypeScript, arquitectura modular)

---

## 3. Tecnologías Utilizadas

### Frontend

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **Next.js** | 16.0.7 | Framework React con App Router |
| **React** | 19.2.1 | Biblioteca de UI |
| **TypeScript** | 5.x | Tipado estático |
| **Tailwind CSS** | 4.x | Estilos utility-first |
| **Zustand** | 5.0.9 | Gestión de estado global |
| **React Hook Form** | 7.68.0 | Gestión de formularios |
| **Swiper** | 12.0.3 | Carruseles de imágenes |
| **React Icons** | 5.5.0 | Iconos |

### Backend

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **Next.js Server Actions** | - | Lógica de servidor |
| **Prisma ORM** | 7.1.0 | Acceso a base de datos |
| **PostgreSQL** | 18.x | Base de datos relacional |
| **Better Auth** | 1.4.5 | Autenticación |

### Servicios Externos

| Servicio | Uso |
|----------|-----|
| **AWS S3** | Almacenamiento y hosting de webs desplegadas |
| **PayPal** | Procesamiento de pagos |
| **Cloudinary** | Gestión de imágenes |
| **Docker** | Contenedor para PostgreSQL en desarrollo |

---

## 4. Arquitectura del Sistema

### Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTE                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Browser   │  │   Zustand   │  │  React      │              │
│  │             │◀─│   Store     │◀─│  Components │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      NEXT.JS SERVER                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   App       │  │   Server    │  │   API       │              │
│  │   Router    │──│   Actions   │──│   Routes    │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│                              │                                   │
│                     ┌────────┴────────┐                         │
│                     ▼                 ▼                         │
│              ┌───────────┐     ┌───────────┐                    │
│              │  Prisma   │     │  Better   │                    │
│              │   ORM     │     │   Auth    │                    │
│              └───────────┘     └───────────┘                    │
└─────────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
   ┌────────────┐      ┌────────────┐      ┌────────────┐
   │ PostgreSQL │      │   AWS S3   │      │   PayPal   │
   │            │      │            │      │    API     │
   └────────────┘      └────────────┘      └────────────┘
```

### Patrón de Arquitectura

El proyecto sigue una **arquitectura por capas**:

1. **Capa de Presentación**: Componentes React con Next.js App Router
2. **Capa de Aplicación**: Server Actions para lógica de negocio
3. **Capa de Datos**: Prisma ORM para acceso a PostgreSQL
4. **Capa de Infraestructura**: AWS S3 para despliegue

---

## 5. Modelo de Datos

### Diagrama Entidad-Relación

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│   Category   │       │   Product    │       │ ProductImage │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │◀──────│ categoryId   │──────▶│ productId    │
│ name         │       │ id (PK)      │       │ id (PK)      │
└──────────────┘       │ title        │       │ url          │
                       │ description  │       └──────────────┘
                       │ price        │
                       │ slug         │
                       │ templateType │
                       │ formFields   │
                       │ features     │
                       └──────────────┘
                              │
                              ▼
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    User      │       │    Order     │       │  OrderItem   │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │◀──────│ userId       │──────▶│ orderId      │
│ name         │       │ id (PK)      │       │ productId    │
│ email        │       │ total        │       │ id (PK)      │
│ password     │       │ isPaid       │       │ siteConfig   │
│ role         │       │ paidAt       │       │ deployStatus │
└──────────────┘       └──────────────┘       │ deployUrl    │
      │                       │               │ subdomain    │
      ▼                       ▼               └──────────────┘
┌──────────────┐       ┌──────────────┐
│ UserAddress  │       │ OrderAddress │
├──────────────┤       ├──────────────┤
│ userId (FK)  │       │ orderId (FK) │
│ firstName    │       │ firstName    │
│ lastName     │       │ lastName     │
│ address      │       │ address      │
│ city         │       │ city         │
│ countryId    │       │ countryId    │
└──────────────┘       └──────────────┘
```

### Enums

```typescript
// Tipos de plantilla disponibles
enum TemplateType {
  corporate    // Web corporativa
  portfolio    // Portfolio personal
  landing      // Landing page
  blog         // Blog
  ecommerce    // Tienda online
}

// Estados del despliegue
enum DeploymentStatus {
  pending      // Pendiente
  deployed     // Desplegado
  failed       // Error
}

// Roles de usuario
enum Role {
  Admin
  User
}
```

---

## 6. Funcionalidades Implementadas

### 6.1 Autenticación y Autorización

- **Registro de usuarios** con email y contraseña
- **Inicio de sesión** con persistencia de sesión
- **Protección de rutas** según autenticación
- **Control de acceso** basado en roles (Admin/User)
- **Cierre de sesión**

### 6.2 Catálogo de Productos

- **Listado de plantillas** con paginación
- **Filtrado por tipo** de plantilla (corporate, portfolio, etc.)
- **Página de detalle** con imágenes, descripción y características
- **Galería de imágenes** con carrusel

### 6.3 Configuración de Plantillas

- **Formularios dinámicos** basados en el esquema del producto
- **Tipos de campos**: texto, textarea, color, imagen, URL, email, teléfono
- **Validación en cliente** de campos requeridos y formatos
- **Previsualización** del producto durante la configuración

### 6.4 Carrito de Compras

- **Añadir productos** con configuración personalizada
- **Persistencia** en localStorage mediante Zustand
- **Actualizar cantidad** de productos
- **Eliminar productos** del carrito
- **Resumen** con subtotal, IVA y total

### 6.5 Proceso de Checkout

- **Formulario de dirección** de facturación
- **Guardado de dirección** para futuros pedidos
- **Selección de país** desde base de datos
- **Confirmación de orden** antes del pago

### 6.6 Pagos con PayPal

- **Integración con PayPal SDK**
- **Creación de órdenes** en PayPal
- **Verificación de pagos** mediante API
- **Actualización de estado** de la orden

### 6.7 Despliegue Automático

- **Compilación** de plantillas Next.js
- **Generación de variables** de entorno personalizadas
- **Subida a AWS S3** del sitio compilado
- **Generación de URL** única para cada despliegue
- **Eliminación de despliegues** desde la UI

### 6.8 Panel de Administración

- **Gestión de usuarios**: listado, cambio de roles
- **Gestión de productos**: CRUD completo
- **Gestión de órdenes**: listado y detalle
- **Acceso restringido** a usuarios Admin

### 6.9 Gestión de Órdenes

- **Listado de órdenes** del usuario
- **Detalle de orden** con productos y estado
- **Estado de despliegue** por producto
- **Enlace a web desplegada**

### 6.10 Aspectos Legales

- **Política de privacidad**
- **Aviso legal**
- **Política de cookies** con consentimiento

---

## 7. Flujo de Compra y Despliegue

### Diagrama de Flujo

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Catálogo   │───▶│  Configurar │───▶│   Carrito   │───▶│  Checkout   │
│  Plantillas │    │   Plantilla │    │             │    │  Dirección  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                                                │
                                                                ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Web        │◀───│  Despliegue │◀───│    Pago     │◀───│  Confirmar  │
│  Desplegada │    │   a S3      │    │   PayPal    │    │    Orden    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### Descripción de Pasos

1. **Catálogo**: Usuario navega por las plantillas disponibles
2. **Configurar**: Rellena formulario con datos de su negocio
3. **Carrito**: Revisa productos y configuraciones
4. **Dirección**: Introduce dirección de facturación
5. **Confirmar**: Verifica la orden completa
6. **Pago**: Realiza pago con PayPal
7. **Despliegue**: Sistema compila y sube la web automáticamente
8. **Web Desplegada**: Usuario accede a su nueva web

### Proceso de Despliegue (Detalle Técnico)

```typescript
// 1. Obtener configuración del cliente
const siteConfig = orderItem.siteConfig;

// 2. Generar subdominio único
const subdomain = generateSubdomain(siteName, orderItemId);
// Ejemplo: "mi-empresa-abc12345"

// 3. Localizar plantilla fuente
const sourceDir = findTemplateSource(templateType, slug);

// 4. Copiar plantilla a directorio temporal
const buildDir = prepareBuildDirectory(sourceDir, subdomain);

// 5. Generar archivo .env con configuración
configureEnvironment(buildDir, siteConfig);

// 6. Compilar proyecto Next.js
await buildProject(buildDir); // npm install && npm run build

// 7. Subir a S3
await uploadDirToS3(outDir, subdomain);

// 8. Guardar URL en base de datos
updateDeploymentStatus(orderItemId, 'deployed', finalUrl);
```

---

## 8. Estructura del Proyecto

```
proyecto-daw/
├── prisma/
│   ├── schema.prisma          # Esquema de base de datos
│   ├── seed.ts                # Datos iniciales
│   └── migrations/            # Migraciones de BD
│
├── src/
│   ├── app/                   # App Router de Next.js
│   │   ├── (shop)/            # Rutas de la tienda
│   │   │   ├── page.tsx       # Página principal
│   │   │   ├── product/       # Detalle de producto
│   │   │   ├── cart/          # Carrito
│   │   │   ├── checkout/      # Proceso de compra
│   │   │   ├── orders/        # Órdenes del usuario
│   │   │   ├── profile/       # Perfil de usuario
│   │   │   └── admin/         # Panel de administración
│   │   ├── auth/              # Autenticación
│   │   ├── api/               # API routes
│   │   └── legal/             # Páginas legales
│   │
│   ├── actions/               # Server Actions
│   │   ├── product/           # CRUD de productos
│   │   ├── order/             # Gestión de órdenes
│   │   ├── payments/          # Integración PayPal
│   │   ├── deploy/            # Despliegue a S3
│   │   ├── user/              # Gestión de usuarios
│   │   ├── address/           # Direcciones
│   │   ├── category/          # Categorías
│   │   └── country/           # Países
│   │
│   ├── components/            # Componentes React
│   │   ├── ui/                # Componentes de UI
│   │   ├── products/          # Componentes de productos
│   │   ├── product/           # Componentes de detalle
│   │   ├── orders/            # Componentes de órdenes
│   │   └── providers/         # Providers (PayPal)
│   │
│   ├── store/                 # Zustand stores
│   │   ├── cart/              # Estado del carrito
│   │   ├── address/           # Estado de dirección
│   │   └── ui/                # Estado de UI
│   │
│   ├── lib/                   # Configuración
│   │   ├── auth.ts            # Configuración Better Auth
│   │   ├── auth-client.ts     # Cliente de autenticación
│   │   └── prisma.ts          # Cliente Prisma
│   │
│   ├── interfaces/            # Tipos TypeScript
│   └── utils/                 # Utilidades
│
├── templates/                 # Plantillas web
│   ├── sources/               # Código fuente
│   └── builds/                # Builds temporales
│
├── public/                    # Archivos estáticos
└── generated/                 # Cliente Prisma generado
```

### Módulo de Despliegue (Detalle)

```
src/actions/deploy/
├── index.ts                   # Exportaciones
├── deploy-website.ts          # Lógica principal
├── delete-deployment.ts       # Eliminar despliegue
├── types.ts                   # Interfaces
├── subdomain-generator.ts     # Generación de subdominios
├── env-generator.ts           # Generación de .env
├── deployment-status.ts       # Actualización de estados
├── template-builder.ts        # Compilación
├── file-utils.ts              # Utilidades de archivos
└── s3-client.ts               # Cliente AWS S3
```

---

## 9. Configuración y Despliegue

### Variables de Entorno Requeridas

```env
# Base de datos
DATABASE_URL="postgresql://user:password@localhost:5432/webfactory"

# Autenticación
BETTER_AUTH_SECRET="clave-secreta-generada"
BETTER_AUTH_URL="http://localhost:3000"

# AWS S3
AWS_REGION="eu-west-1"
AWS_ACCESS_KEY_ID="tu-access-key"
AWS_SECRET_ACCESS_KEY="tu-secret-key"
AWS_S3_BUCKET="nombre-del-bucket"

# Dominio de despliegue
DEPLOY_DOMAIN="tudominio.com"

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID="client-id"
PAYPAL_CLIENT_SECRET="client-secret"
PAYPAL_OAUTH_URL="https://api-m.sandbox.paypal.com/v1/oauth2/token"
PAYPAL_ORDERS_URL="https://api-m.sandbox.paypal.com/v2/checkout/orders"

# Cloudinary (imágenes)
CLOUDINARY_URL="cloudinary://..."
```

### Instalación en Desarrollo

```bash
# 1. Clonar repositorio
git clone https://github.com/DiegoChilleron/proyecto-daw.git
cd proyecto-daw

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.template .env
# Editar .env con tus valores

# 4. Levantar base de datos
docker compose up -d

# 5. Ejecutar migraciones
npx prisma migrate dev

# 6. Ejecutar seed (datos iniciales)
npm run seed

# 7. Iniciar servidor de desarrollo
npm run dev
```

### Despliegue en Producción

```bash
# 1. Compilar aplicación
npm run build

# 2. Ejecutar migraciones en producción
npm run prisma:deploy

# 3. Iniciar servidor
npm run start
```

---

## 10. Conclusiones

### Objetivos Alcanzados

✅ **E-commerce funcional** con catálogo, carrito y checkout  
✅ **Sistema de personalización** mediante formularios dinámicos  
✅ **Despliegue automático** a AWS S3  
✅ **Integración con PayPal** para pagos  
✅ **Panel de administración** completo  
✅ **Autenticación segura** con Better Auth  
✅ **Código tipado** con TypeScript  
✅ **Arquitectura modular** y mantenible  

### Tecnologías Aprendidas

- **Next.js 16** con App Router y Server Actions
- **Prisma ORM** para gestión de base de datos
- **Better Auth** para autenticación moderna
- **AWS S3 SDK** para almacenamiento en la nube
- **PayPal SDK** para procesamiento de pagos
- **Zustand** para gestión de estado
- **Tailwind CSS 4** para estilos

### Posibles Mejoras Futuras

1. **Notificaciones por email** cuando se complete el despliegue
2. **Editor visual** para personalizar plantillas
3. **Previsualización en tiempo real** de los cambios
4. **Más proveedores de pago** (Stripe, Bizum)
5. **Analytics** para las webs desplegadas
6. **Dominios personalizados** para cada cliente
7. **Tests automatizados** (Jest, Playwright)

---

## Información del Proyecto

- **Nombre**: WebFactory - Creador de Webs
- **Autor**: Diego Chillerón
- **Repositorio**: https://github.com/DiegoChilleron/proyecto-daw
- **Licencia**: Privado
- **Fecha**: Diciembre 2025

---

*Documento generado como memoria del proyecto de Desarrollo de Aplicaciones Web (DAW)*
