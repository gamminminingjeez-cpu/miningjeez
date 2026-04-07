# Changelog - Grid Node Tycoon

---

## 2026-04-06

### Fase 6: Tienda y Economía

**Acciones realizadas:**

1. **Sonner instalado** - Sistema de notificaciones toast premium

2. **Componentes de Tienda:**
   - `src/lib/catalog.tsx` - Catálogo de items comprables con precios
   - `src/components/layout/StoreTab.tsx` - UI de tienda con tarjetas de compra
   - `InventoryPanel.tsx` refactorizado con tabs (Inventario / Tienda)
   - Animación de tab activa con `layoutId` de framer-motion

3. **Lógica de Compra:**
   - Verificación de fondos antes de compra
   - Deducción de créditos en Zustand
   - Guardado en Supabase (wallet + inventory)
   - Toasts de éxito/error

4. **Header actualizado:**
   - Indicador de sincronización con iconos animados
   - Estados: idle, syncing, synced, error

5. **Toaster configurado** con tema oscuro cyberpunk

**Funcionalidades:**
- Pestañas MI INVENTARIO / TIENDA
- Comprar items con Créditos USDT
- Notificaciones toast de éxito/error
- Items no comprables se ven deshabilitados

**Build:** ✓ OK (597KB)

**Repo:** https://github.com/gamminminingjeez-cpu/miningjeez

---

## Registros Anteriores

### Fase 5: Game Loop y Sinergias
- Motor de cálculo de stats (hashrate, energía, temp)
- Algoritmo de adyacencia (cooler → GPU = -15°C)
- useGameLoop hook con tick de 1 segundo
- Sidebar con números animados (odómetro)
- Grid con alertas de sobrecalentamiento

### Fase 4: Drag & Drop
- dnd-kit instalado
- Inventario draggable
- Grid droppable

### Fase 3: Layout UI
- Glassmorphism, framer-motion, tema cyberpunk

### Fase 1: Setup y Auth
- Proyecto inicializado, Supabase, Zustand
