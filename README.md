# Sistema de Gestión Presupuestal - Colegio Bilingüe Lacordaire

Sistema completo de gestión presupuestal, requisiciones, inventario y activos para instituciones educativas.

## 📁 Estructura del Proyecto

```
secop-app/
├── app/                          # Páginas de Next.js (App Router)
│   ├── activos/                  # Gestión de activos fijos
│   ├── aprobaciones/             # Aprobación de requisiciones
│   ├── aprobaciones-presupuesto/ # Aprobación de presupuestos
│   ├── areas/                    # Gestión de áreas
│   ├── caja-menor/               # Gestión de caja menor
│   ├── calificaciones/           # Calificaciones generales
│   ├── calificaciones-proveedores/ # Calificaciones de proveedores
│   ├── calificaciones-tesoreria/ # Calificaciones de tesorería
│   ├── calificar-consultor/      # Calificación de consultores
│   ├── compras/                  # Registro de compras
│   ├── conceptos/                # Gestión de conceptos
│   ├── dashboard/                # Panel principal
│   ├── inventario/               # Control de inventario
│   ├── partidas-no-presupuestadas/ # Partidas no presupuestadas
│   ├── presupuestos/             # Gestión presupuestal
│   ├── proveedores/              # Gestión de proveedores
│   ├── proyeccion/               # Proyecciones presupuestales
│   ├── proyectos-inversion/      # Proyectos de inversión
│   ├── reportes/                 # Reportes y análisis
│   ├── requisiciones/            # Solicitudes de compra
│   ├── solicitar-presupuesto/    # Solicitudes de presupuesto
│   ├── supervision-consultor/    # Supervisión de consultores
│   ├── tesoreria/                # Gestión de tesorería
│   ├── traslados-activos/        # Traslados de activos
│   ├── globals.css               # Estilos globales de la app
│   ├── layout.tsx                # Layout raíz
│   └── page.tsx                  # Página de inicio/login
│
├── components/                   # Componentes React reutilizables
│   ├── activos/                  # Componentes de activos
│   │   ├── consulta-activos.tsx
│   │   └── registro-activos.tsx
│   ├── admin/                    # Componentes administrativos
│   │   └── gestionar-conceptos.tsx
│   ├── caja-menor/               # Componentes de caja menor
│   │   ├── historial-caja-menor.tsx
│   │   └── registrar-caja-menor.tsx
│   ├── compras/                  # Componentes de compras
│   │   ├── historial-compras.tsx
│   │   └── registrar-compra.tsx
│   ├── inventario/               # Componentes de inventario
│   │   ├── consulta-inventario.tsx
│   │   ├── entrada-inventario.tsx
│   │   ├── productos-inventario.tsx
│   │   └── salida-inventario.tsx
│   ├── layout/                   # Componentes de layout
│   │   ├── app-layout.tsx        # Layout principal con sidebar
│   │   ├── page-layout.tsx       # Layout de páginas
│   │   ├── sidebar.tsx           # Barra lateral de navegación
│   │   └── index.ts
│   ├── presupuestos/             # Componentes de presupuestos
│   │   └── aprobar-solicitudes.tsx
│   ├── reportes/                 # Componentes de reportes
│   │   ├── reporte-activos.tsx
│   │   ├── reporte-compras.tsx
│   │   ├── reporte-consultor.tsx
│   │   ├── reporte-ejecucion-actual.tsx
│   │   ├── reporte-ejecucion.tsx
│   │   ├── reporte-movimientos.tsx
│   │   ├── reporte-partidas-no-presupuestadas.tsx
│   │   ├── reporte-presupuestal.tsx
│   │   ├── reporte-proveedores.tsx
│   │   └── reporte-tesoreria.tsx
│   ├── requisiciones/            # Componentes de requisiciones
│   │   ├── crear-requisicion.tsx
│   │   ├── flujo-requisicion.tsx
│   │   └── historial-requisiciones.tsx
│   ├── tesoreria/                # Componentes de tesorería
│   │   ├── gestor-soportes.tsx
│   │   ├── historial-soportes.tsx
│   │   ├── monitor-caja-menor.tsx
│   │   ├── solicitudes-caja-menor.tsx
│   │   └── timeline-trazabilidad.tsx
│   ├── traslados/                # Componentes de traslados
│   │   ├── aprobacion-traslados.tsx
│   │   ├── historial-traslados.tsx
│   │   └── solicitud-traslado.tsx
│   ├── ui/                       # Componentes UI base (shadcn/ui)
│   │   └── [57 componentes]      # Accordion, Alert, Button, etc.
│   ├── numeracion-initializer.tsx # Inicializador de numeración
│   └── theme-provider.tsx        # Proveedor de tema
│
├── config/                       # Configuración y constantes
│   ├── constants.ts              # Constantes globales
│   ├── cuentas-contables.ts      # Catálogo de cuentas contables
│   ├── envs.ts                   # Variables de entorno
│   └── index.ts
│
├── hooks/                        # Hooks personalizados
│   ├── use-auth-user.ts          # Hook de usuario autenticado
│   ├── use-local-storage.ts      # Hook para localStorage
│   ├── use-presupuesto.ts        # Hook para presupuestos
│   ├── use-requisiciones.ts      # Hook para requisiciones
│   └── index.ts
│
├── lib/                          # Librerías y utilidades
│   ├── api.ts                    # Cliente API
│   ├── auditoria.ts              # Funciones de auditoría
│   ├── caja-menor.ts             # Lógica de caja menor
│   ├── data.ts                   # Datos iniciales y mock data
│   ├── numeracion.ts             # Sistema de numeración
│   ├── utils.ts                  # Utilidades generales
│   ├── validations.ts            # Esquemas de validación (Zod)
│   └── index.ts
│
├── schema/                       # Esquemas de validación
│   └── auth.schema.ts            # Esquema de autenticación
│
├── services/                     # Capa de servicios (API/Storage)
│   ├── activo.service.ts         # Servicio de activos
│   ├── auth.service.ts           # Servicio de autenticación
│   ├── calificacion.service.ts   # Servicio de calificaciones
│   ├── presupuesto.service.ts    # Servicio de presupuestos
│   ├── proveedor.service.ts      # Servicio de proveedores
│   ├── requisicion.service.ts    # Servicio de requisiciones
│   ├── storage.service.ts        # Servicio de almacenamiento
│   └── index.ts
│
├── store/                        # Estado global (Zustand)
│   └── auth.store.ts             # Store de autenticación
│
├── types/                        # Definiciones de tipos TypeScript
│   ├── activo.ts                 # Tipos de activos
│   ├── auditoria.ts              # Tipos de auditoría
│   ├── caja-menor.ts             # Tipos de caja menor
│   ├── calificacion.ts           # Tipos de calificaciones
│   ├── compra.ts                 # Tipos de compras
│   ├── inventario.ts             # Tipos de inventario
│   ├── presupuesto.ts            # Tipos de presupuestos
│   ├── proveedor.ts              # Tipos de proveedores
│   ├── requisicion.ts            # Tipos de requisiciones
│   ├── user.ts                   # Tipos de usuarios
│   └── index.ts
│
├── public/                       # Archivos estáticos
│   ├── apple-icon.png
│   ├── icon-dark-32x32.png
│   ├── icon-light-32x32.png
│   ├── icon.svg
│   ├── placeholder-logo.png
│   ├── placeholder-logo.svg
│   ├── placeholder-user.jpg
│   ├── placeholder.jpg
│   └── placeholder.svg
│
├── styles/                       # Estilos globales
│   └── globals.css
│
├── components.json               # Configuración de shadcn/ui
├── env.d.ts                      # Declaraciones de tipos de entorno
├── next.config.mjs               # Configuración de Next.js
├── next-env.d.ts                 # Tipos de Next.js
├── package.json                  # Dependencias del proyecto
├── pnpm-lock.yaml                # Lock file de pnpm
├── postcss.config.mjs            # Configuración de PostCSS
└── tsconfig.json                 # Configuración de TypeScript
```

## 🎯 Características Principales

### Gestión Presupuestal
- Control de presupuestos por área
- Solicitudes de presupuesto
- Aprobaciones y rechazos
- Seguimiento de ejecución presupuestal

### Requisiciones
- Creación de requisiciones de compra
- Flujo de aprobación multinivel
- Seguimiento de estado
- Calificación de proveedores

### Inventario
- Control de productos
- Entradas y salidas
- Ubicaciones y categorías
- Alertas de stock

### Activos Fijos
- Registro de activos
- Traslados entre áreas
- Historial de movimientos
- Estados y mantenimiento

### Caja Menor
- Solicitudes de caja menor
- Aprobaciones y reembolsos
- Control de saldo
- Gestión de soportes

### Reportes
- Reporte de ejecución presupuestal
- Reporte de compras
- Reporte de proveedores
- Reporte de activos
- Reporte de tesorería

## 🔧 Tecnologías Utilizadas

- **Framework**: Next.js 16.0.10 (App Router)
- **Lenguaje**: TypeScript 5.9.3
- **UI**: React 18.3.1
- **Estilos**: Tailwind CSS 4.1.18
- **Componentes**: shadcn/ui (Radix UI)
- **Estado Global**: Zustand 5.0.9
- **Validación**: Zod 3.25.76
- **Formularios**: React Hook Form 7.68.0
- **HTTP Client**: Axios 1.13.2
- **Iconos**: Lucide React 0.454.0
- **Gráficos**: Recharts 2.15.4
- **Notificaciones**: Sonner 1.7.4
- **Temas**: Next Themes 0.4.6
- **Fechas**: date-fns 4.1.0
- **Carruseles**: Embla Carousel 8.5.1
- **Utilidades**: clsx, tailwind-merge, class-variance-authority

## 🎨 Sistema de Layout

El proyecto implementa un **sistema de layout modular** que proporciona:

- ✅ **Sidebar automático** en todas las páginas privadas mediante `AppLayout`
- ✅ **Autenticación centralizada** con Microsoft OAuth
- ✅ **Componentes reutilizables** (PageHeader, PageContainer, Sidebar)
- ✅ **Hooks personalizados** para auth y gestión de estado
- ✅ **Loading states consistentes**
- ✅ **Inicialización automática** del sistema de numeración
- ✅ **Notificaciones toast** globales con Sonner

### Uso Rápido

```typescript
'use client';

import { useAuthUser } from '@/hooks';
import { PageHeader, PageContainer } from '@/components/layout/page-layout';

export default function MiPagina() {
  const { user, isLoading } = useAuthUser();

  if (isLoading) return <div>Cargando...</div>;
  if (!user) return null;

  return (
    <>
      <PageHeader title="Mi Página" description="Descripción" />
      <PageContainer>
        {/* Contenido de la página */}
      </PageContainer>
    </>
  );
}
```

## 📦 Instalación y Configuración

### Requisitos Previos

- Node.js 18+ 
- pnpm (recomendado) o npm

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd secop-app

# Instalar dependencias
pnpm install

# Configurar variables de entorno
# Crear archivo .env.local con:
# NEXT_PUBLIC_API_URL=<url-del-backend>

# Ejecutar en desarrollo
pnpm dev

# El servidor estará disponible en http://localhost:3000
```

### Scripts Disponibles

```bash
# Desarrollo
pnpm dev          # Inicia el servidor de desarrollo

# Producción
pnpm build        # Compila la aplicación para producción
pnpm start        # Ejecuta la aplicación compilada

# Calidad de código
pnpm lint         # Ejecuta ESLint
```

## 🔑 Autenticación

El sistema utiliza **autenticación OAuth con Microsoft** para garantizar la seguridad y facilitar el acceso con cuentas institucionales.

### Flujo de Autenticación

1. El usuario accede a la página de login
2. Hace clic en "Iniciar sesión con Microsoft"
3. Es redirigido al portal de Microsoft para autenticarse
4. Una vez autenticado, es redirigido de vuelta a la aplicación
5. El sistema valida el token y crea la sesión del usuario

### Gestión de Sesión

- La sesión se mantiene mediante tokens JWT
- El estado de autenticación se gestiona con Zustand (`auth.store.ts`)
- Los hooks `useAuthUser` permiten acceder al usuario actual en cualquier componente

## 📝 Aliases de Importación

El proyecto utiliza aliases de TypeScript para facilitar las importaciones:

```typescript
import { User } from '@/types';
import { useAuthUser } from '@/hooks';
import { presupuestoService } from '@/services';
import { AREAS } from '@/config';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth.store';
```

### Aliases Disponibles

- `@/types` - Tipos TypeScript
- `@/components` - Componentes React
- `@/hooks` - Hooks personalizados
- `@/lib` - Utilidades y librerías
- `@/services` - Servicios de datos
- `@/config` - Configuración y constantes
- `@/store` - Estado global (Zustand)
- `@/schema` - Esquemas de validación
- `@/app` - Páginas de la aplicación
- `@/styles` - Estilos globales
- `@/public` - Archivos estáticos

Todos los aliases están configurados en `tsconfig.json` y permiten importaciones absolutas desde cualquier archivo del proyecto.

## 🏗️ Arquitectura

El proyecto sigue una arquitectura en capas modular y escalable:

### Capa de Presentación (`/app` y `/components`)
- **`/app`**: Páginas de Next.js 16 usando App Router
- **`/components`**: Componentes React organizados por módulo funcional
  - Componentes de dominio (activos, compras, inventario, etc.)
  - Componentes de layout (sidebar, page-layout)
  - Componentes UI base (shadcn/ui)

### Capa de Lógica de Negocio
- **`/services`**: Servicios que abstraen la lógica de acceso a datos (API REST)
- **`/lib`**: Funciones auxiliares, validaciones y utilidades generales
- **`/hooks`**: Hooks personalizados para lógica reutilizable

### Capa de Estado
- **`/store`**: Estado global con Zustand (autenticación, etc.)
- **React State**: Estado local en componentes

### Capa de Datos
- **`/types`**: Definiciones centralizadas de tipos TypeScript
- **`/schema`**: Esquemas de validación con Zod
- **`/config`**: Constantes, configuraciones y catálogos

### Flujo de Datos

```
Usuario → Componente → Hook → Service → API Backend
                ↓
              Store (Zustand)
                ↓
          Componentes suscritos
```

### Principios de Diseño

- **Separación de responsabilidades**: Cada capa tiene un propósito específico
- **Reutilización**: Componentes y hooks compartidos
- **Type Safety**: TypeScript estricto en todo el proyecto
- **Validación**: Zod para validación de datos en runtime
- **Modularidad**: Código organizado por funcionalidad

## 🔒 Roles y Permisos

El sistema implementa un control de acceso basado en roles (RBAC):

### Roles Disponibles

| Rol | Descripción | Permisos Principales |
|-----|-------------|---------------------|
| **Administrador** | Acceso completo al sistema | Gestión de usuarios, configuración, todos los módulos |
| **Responsable de Área** | Gestión de su área específica | Solicitudes de presupuesto, requisiciones de su área |
| **Rector** | Aprobaciones de alto nivel | Aprobación de presupuestos y requisiciones importantes |
| **Consultor** | Gestión de requisiciones | Aprobación de requisiciones, calificación de proveedores |
| **Tesorería** | Gestión financiera | Gestión de pagos, reportes financieros, calificaciones |
| **Caja Menor** | Gestión de caja menor | Solicitudes y aprobaciones de caja menor |
| **Auditoría** | Consulta y supervisión | Acceso de solo lectura a todos los módulos |
| **Contratista** | Acceso limitado | Consulta de información específica |

### Control de Acceso

- Los permisos se validan tanto en el frontend como en el backend
- El sidebar muestra solo las opciones disponibles para cada rol
- Las rutas protegidas verifican el rol del usuario
- Los componentes se adaptan según los permisos del usuario

## 📚 Módulos Principales

### Gestión Presupuestal
- **Presupuestos**: Control y seguimiento de presupuestos por área
- **Solicitar Presupuesto**: Formulario de solicitud de presupuesto
- **Aprobaciones Presupuesto**: Flujo de aprobación de solicitudes
- **Proyección**: Proyecciones presupuestales futuras
- **Partidas No Presupuestadas**: Gestión de gastos no contemplados

### Requisiciones y Compras
- **Requisiciones**: Creación y seguimiento de requisiciones de compra
- **Aprobaciones**: Flujo de aprobación multinivel
- **Compras**: Registro y seguimiento de órdenes de compra
- **Proveedores**: Gestión de proveedores y su información

### Inventario y Activos
- **Inventario**: Control de productos, entradas y salidas
- **Activos**: Registro y seguimiento de activos fijos
- **Traslados de Activos**: Gestión de movimientos entre áreas

### Tesorería y Caja Menor
- **Tesorería**: Gestión de pagos y soportes
- **Caja Menor**: Solicitudes y reembolsos de caja menor
- **Calificaciones Tesorería**: Evaluación de procesos de pago

### Calificaciones
- **Calificaciones Proveedores**: Evaluación de desempeño de proveedores
- **Calificar Consultor**: Evaluación de consultores
- **Supervisión Consultor**: Seguimiento de trabajos de consultoría

### Reportes y Análisis
- **Reporte de Ejecución**: Análisis de ejecución presupuestal
- **Reporte de Compras**: Detalle de compras realizadas
- **Reporte de Proveedores**: Análisis de proveedores
- **Reporte de Activos**: Inventario de activos fijos
- **Reporte de Tesorería**: Estado financiero y pagos
- **Reporte de Movimientos**: Trazabilidad de operaciones

### Administración
- **Dashboard**: Panel de control con indicadores clave
- **Áreas**: Gestión de áreas de la institución
- **Conceptos**: Catálogo de conceptos presupuestales
- **Proyectos de Inversión**: Gestión de proyectos de inversión

## 🔧 Características Técnicas

### Optimizaciones de Rendimiento
- **Server Components**: Uso de React Server Components donde es posible
- **Code Splitting**: Carga dinámica de componentes
- **Image Optimization**: Optimización automática de imágenes con Next.js
- **Font Optimization**: Fuentes optimizadas automáticamente

### Accesibilidad
- Componentes accesibles de Radix UI
- Navegación por teclado
- ARIA labels apropiados
- Contraste de colores adecuado

### Responsive Design
- Diseño adaptable a todos los tamaños de pantalla
- Mobile-first approach
- Sidebar colapsable en dispositivos móviles

### Seguridad
- Autenticación OAuth con Microsoft
- Tokens JWT para sesiones
- Validación de datos en cliente y servidor
- Protección de rutas según roles

## 🤝 Contribución

Este es un proyecto privado del Colegio Bilingüe Lacordaire. Para contribuir:

1. Crea una rama desde `main`
2. Realiza tus cambios siguiendo las convenciones del proyecto
3. Asegúrate de que el código pase el linter (`pnpm lint`)
4. Crea un Pull Request con descripción detallada

### Convenciones de Código

- **Nombres de archivos**: kebab-case (ej: `mi-componente.tsx`)
- **Componentes**: PascalCase (ej: `MiComponente`)
- **Funciones y variables**: camelCase (ej: `miVariable`)
- **Constantes**: UPPER_SNAKE_CASE (ej: `MI_CONSTANTE`)
- **Tipos e Interfaces**: PascalCase (ej: `MiTipo`)

## 📄 Licencia

Proyecto privado - Colegio Bilingüe Lacordaire

---

**Versión**: 0.1.0  
**Última actualización**: Diciembre 2025

