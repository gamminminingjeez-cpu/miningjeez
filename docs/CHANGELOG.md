# Changelog - Grid Node Tycoon

---

## 2026-04-06

### Expansión del Tablero Implementada (Grid Dinámico)

**Acciones realizadas:**

1. **Store actualizado (useGameStore.ts):**
   - Estado `gridSize` dinámico (5 por defecto, hasta 10 máximo)
   - Función `expandGrid()` que incrementa gridSize +1
   - Costo exponencial: `(gridSize + 1) * 10000` USDT
   - Grid se recrea con el nuevo tamaño al expandir
   - Lógica de bounds check para placement de items

2. **GridBoard actualizado:**
   - Props: `gridSize`, `expandCost`, `canExpand`, `onExpandClick`
   - Grid dinámico: `gridTemplateColumns: repeat(${gridSize}, minmax(0, 1fr))`
   - Botón "EXPANDIR" que muestra costo y disponibilidad
   - Tamaño máximo 10x10

3. **App.tsx actualizado:**
   - Carga `grid_size` desde Supabase al hydrating
   - Handler `handleExpand` que conecta con Supabase
   - Validación de fondos y actualización de wallet

4. **SQL necesario (ejecutar en Supabase):**
   ```sql
   ALTER TABLE public.player_wallets
   ADD COLUMN grid_size integer DEFAULT 5;
   ```

**Costo de expansión:**
- 5x5 → 6x6: 60,000 USDT
- 6x6 → 7x7: 70,000 USDT
- 7x7 → 8x8: 80,000 USDT
- ... hasta 10x10

**Build:** ✓ OK (953KB - warning chunk)

**Repo:** https://github.com/gamminminingjeez-cpu/miningjeez

---

## Registros Anteriores

### Trading Bots
- Toggle ON/OFF con monitoreo de mercado
- Ejecución automática al alcanzar precio objetivo

### Offline Earnings Modal
- Modal premium con contador animado
- 50% eficiencia offline

### Exchange / Mercado Cripto
- Recharts para gráficos financieros
- Fluctuación de precios cada 5s

### Tienda, Game Loop, Drag & Drop, Layout, Auth
- Ver commits anteriores
