# Changelog - Grid Node Tycoon

---

## 2026-04-06

### Fase 8: Pulido Final, Audio y Soporte Móvil

**Acciones realizadas:**

1. **audioManager.ts creado:**
   - Sistema de audio usando Web Audio API nativo (sin librerías extra)
   - Funciones: `playDropSound()`, `playCashSound()`, `playErrorSound()`, `playSuccessSound()`, `playPurchaseSound()`, `playBotSound()`
   - Cooldown para evitar spam de sonidos

2. **Soporte táctil móvil:**
   - MouseSensor + TouchSensor configurados en DndContext
   - TouchSensor con delay de 250ms para evitar scroll accidental
   - Drag & Drop funcional en pantallas táctiles

3. **Integración de audio:**
   - `playDropSound()` - al colocar item en grid
   - `playPurchaseSound()` - al comprar en tienda
   - `playCashSound()` - al vender en exchange y bots
   - `playErrorSound()` - errores (fondos insuficientes, etc)
   - `playSuccessSound()` - expansión de grid

**Build:** ✓ OK (955KB - warning chunk)

**Repo:** https://github.com/gamminminingjeez-cpu/miningjeez

---

## Registros Anteriores

### Expansión del Tablero
- Grid dinámico 5x5 → 10x10
- Botón EXPANDIR con costo exponencial

### Trading Bots
- Bots de Grid Spot para venta automática
- Toggle ON/OFF con monitoreo

### Offline Earnings
- Modal de bienvenida con ganancias offline
- 50% eficiencia offline

### Exchange / Mercado
- Gráficos Recharts en tiempo real
- Fluctuación de precios

### Tienda, Game Loop, Drag & Drop, Layout, Auth
- Ver commits anteriores
