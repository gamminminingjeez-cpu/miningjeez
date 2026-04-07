# Changelog - Grid Node Tycoon

---

## 2026-04-06

### Fase 4: Drag & Drop Implementado

**Acciones realizadas:**

1. **Dependencias:**
   - `@dnd-kit/core` y `@dnd-kit/utilities` instalados

2. **Mock Data (`src/lib/mockData.tsx`):**
   - Catálogo de items: GPU RTX 3060, GPU RTX 4090, Cooler Fan, Refrigeración Líquida, PSU 500W, PSU 1000W
   - Función `getInitialInventory()` para items iniciales del jugador

3. **Store de Juego (`src/store/useGameStore.ts`):**
   - Estado del grid (5x5)
   - Inventario del jugador
   - Stats calculados: Hashrate, Consumo, Cooling, Límite Energía, Temperatura
   - Actions: `setInventory`, `placeItem`, `removeItem`, `calculateStats`

4. **Componentes UI:**
   - `InventoryPanel.tsx` - Panel inferior con items arrastrables
   - `GridBoard.tsx` - Grid 5x5 con celdas droppable
   - Uso de `useDraggable` y `useDroppable` de dnd-kit

5. **App.tsx actualizado:**
   - DndContext con sensores (PointerSensor)
   - Handler `onDragEnd` para colocar items del inventario al grid
   - Stats pasan al Sidebar en tiempo real

**Tipos unificados (`src/types/game.ts`):**
- `GridItem` interface
- `GridCell` interface

**Funcionalidad:**
- Arrastrar items del inventario al grid
- Stats se actualizan al colocar items
- Visual feedback con hover y glow effects

**Build:** ✓ OK (553KB - optimizaciones de chunking pendientes)

**Repo:** https://github.com/gamminminingjeez-cpu/miningjeez

---

## Registros Anteriores

### Fase 3: Layout y Core UI
- Header, Sidebar, GridBoard con glassmorphism
- Framer Motion para animaciones
- Tema cyberpunk configurado
- Build OK

### Fase 1: Setup y Auth
- Proyecto inicializado
- Supabase + Zustand
- Auth UI
- Build OK
