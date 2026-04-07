# Changelog - Grid Node Tycoon

---

## 2026-04-06

### Exchange / Mercado Cripto Implementado

**Acciones realizadas:**

1. **Recharts instalado** - Librería de gráficos financieros

2. **Store actualizado (`useGameStore.ts`):**
   - Estado de precios de mercado: `priceSOL`, `priceXRP`
   - `priceHistory` array (últimos 20 valores)
   - `updateMarketPrices()` action
   - `sellCrypto()` action

3. **useGameLoop actualizado:**
   - Fluctuación de precios cada 5 segundos (±5%)
   - Precios se mantienen en rango 50%-200% del valor inicial

4. **ExchangePanel.tsx creado:**
   - Modal con gráficos AreaChart de Recharts
   - Gráficos para $sSOL (púrpura) y $sXRP (cian)
   - Indicador de tendencia (arriba/abajo)
   - Paneles de venta con botón "VENDER TODO"
   - Sincronización con Supabase al vender

5. **Header actualizado:**
   - Botón "MERCADO" que abre el Exchange

**Funcionalidades:**
- Gráficos de precios en tiempo real
- Fluctuación de mercado cada 5 segundos
- Vender $sSOL y $sXRP por USDT
- Precios afectan la ganancia

**Build:** ✓ OK (942KB - warning de chunk size)

**Repo:** https://github.com/gamminminingjeez-cpu/miningjeez

---

## Registros Anteriores

### Fase 6 (Parcial): Tienda
- Sonner para notificaciones
- Tabs Inventario/Tienda
- Sistema de compras

### Fase 5: Game Loop y Sinergias
- Motor de stats
- Adyacencias cooler → GPU
- useGameLoop hook

### Fase 4: Drag & Drop
- dnd-kit
- Inventario draggable, Grid droppable

### Fase 3: Layout UI
- Glassmorphism, framer-motion

### Fase 1: Setup y Auth
- Proyecto, Supabase, Zustand
