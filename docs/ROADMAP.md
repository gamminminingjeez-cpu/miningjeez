# Roadmap de Desarrollo - Grid Node Tycoon

> Última actualización: 2026-04-06

---

## Resumen del Stack

- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth + Realtime)
- **DB URL:** https://qeqellfnbhkbulkqyobr.supabase.co

---

## Fase 1: Fundamentos y Autenticación
**Objetivo:** Configurar el proyecto, autenticación de usuarios y estructura base.

- [ ] Inicializar proyecto Vite + React + TypeScript
- [ ] Configurar Tailwind CSS con tema cyberpunk (bg-gray-900, acentos neón)
- [ ] Configurar Supabase Client (`@supabase/supabase-js`)
- [ ] Implementar sistema de autenticación (login/registro con email/password)
- [ ] Crear estructura de carpetas del proyecto (`/components`, `/hooks`, `/lib`, `/types`)
- [ ] Configurar variables de entorno (.env.local)
- [ ] Crear tabla `profiles` en Supabase
- [ ] Implementar hook de autenticación (`useAuth`)
- [ ] Crear página de Login y Register
- [ ] Proteger rutas privadas

**Entregable:** Usuarios pueden registrarse e iniciar sesión.

---

## Fase 2: Base de Datos del Inventario
**Objetivo:** Diseñar y crear las tablas de base de datos para el inventario.

- [ ] Crear tabla `items_catalog` (catálogo de items: GPUs, PSUs, Coolers)
- [ ] Crear tabla `player_wallets` (USDT, $sSOL, $sXRP)
- [ ] Crear tabla `inventory` (items del jugador con status)
- [ ] Crear tabla `grid_state` (estado del tablero por usuario)
- [ ] Configurar Row Level Security (RLS) en todas las tablas
- [ ] Implementar API de inventario (CRUD)
- [ ] Implementar API del wallet (obtener saldo, actualizar)
- [ ] Implementar lógica de inicialización de wallet para nuevos usuarios (trigger)

**Entregable:** Sistema de inventario y wallet funcional con persistencia en Supabase.

---

## Fase 3: Tablero de Juego (The Grid)
**Objetivo:** Implementar la interfaz visual del tablero 5x5.

- [ ] Crear componente `Grid` (tablero 5x5)
- [ ] Crear componente `Cell` (celda individual con coordenadas x, y)
- [ ] Implementar drag & drop de inventario → tablero
- [ ] Guardar estado del grid en `grid_state`
- [ ] Renderizar items del catálogo en las celdas
- [ ] Implementar lógica de sinergias por adyacencia (Cooler → GPU = -15°C)
- [ ] Mostrar temperatura, consumo, hashrate en tiempo real
- [ ] Implementar regla de apagado por límite de energía excedido
- [ ] Implementar Thermal Throttling (90°C = -50% eficiencia, 100°C = off)

**Entregable:** Tablero 5x5 funcional con drag & drop y sinergias.

---

## Fase 4: Core Loop y Mecánicas de Minado
**Objetivo:** Implementar las mecánicas de juego principales.

- [ ] Implementar timer de minado (cada X segundos se genera crypto)
- [ ] Implementar cálculo de hashrate total basado en items del grid
- [ ] Implementar cálculo de consumo total de energía
- [ ] Implementar cálculo de temperatura promedio con sinergias
- [ ] Implementar lógica de apagado por exceso de energía
- [ ] Implementar lógica de thermal throttling y shutdown
- [ ] Actualizar wallet del jugador cada tick de minado
- [ ] Implementar mercado: vender $sSOL/$sXRP por USDT
- [ ] Implementar tienda: comprar items con USDT

**Entregable:** El juego es jugable con el loop completo (minar → vender → comprar).

---

## Fase 5: UI/UX y Panel de Control
**Objetivo:** Mejorar la interfaz y experiencia de usuario.

- [ ] Diseñar HUD con stats: USDT, $sSOL, $sXRP, Hashrate, Consumo, Temp
- [ ] Crear panel de inventario con filtros por tipo de item
- [ ] Crear modal/menu de tienda
- [ ] Crear panel del mercado (venta de cryptos)
- [ ] Implementar transiciones y animaciones (entrada de items, venta, compra)
- [ ] Diseño responsive (mobile-friendly)
- [ ] Agregar efectos visuales cyberpunk (glow, glassmorphism)
- [ ] Optimizar rendimiento

**Entregable:** UI completa con HUD, inventario, tienda y mercado.

---

## Fase 6: Progresión yXP
**Objetivo:** Implementar sistema de niveles y fases de progresión.

- [ ] Implementar tabla `profiles.level`
- [ ] Sistema de XP por acciones (comprar, minar, vender)
- [ ] Fase 1 (Nivel 1-10): Solo minado $sSOL, ventiladores básicos
- [ ] Fase 2 (Nivel 11-20): Desbloquear $sXRP, refrigeración líquida
- [ ] Fase 3 (Nivel 21+): Bots de auto-venta, racks avanzados
- [ ] Fluctuación de precios en el mercado (automatizada)

---

## Fase 7: Deployment y Producción
**Objetivo:** Publicar el juego.

- [ ] Configurar build de producción (Vite build)
- [ ] Desplegar a Vercel
- [ ] Configurar variables de entorno en producción
- [ ] Tests finales de autenticación y gameplay
- [ ] Documentación README

---

## Dependencias npm

```json
{
  "@supabase/supabase-js": "^2.x",
  "react": "^18.x",
  "react-dom": "^18.x",
  "typescript": "^5.x",
  "vite": "^5.x",
  "tailwindcss": "^3.x",
  "@dnd-kit/core": "^6.x"  // Para drag & drop
}
```

---

## Documentación Relacionada

- GDD.md - Game Design Document completo
- CHANGELOG.md - Historial de cambios
