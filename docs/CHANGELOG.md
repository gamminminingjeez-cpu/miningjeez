# Changelog - Grid Node Tycoon

---

## 2026-04-06

### Trading Bots Implementados (Late Game Automation)

**Acciones realizadas:**

1. **TradingBotPanel.tsx creado:**
   - Toggle ciberpunk (rojo OFF / verde ON)
   - Input para precio objetivo
   - Indicador "MONITOREANDO MERCADO" animado
   - Stats: precio actual, balance, ganancia potencial, distancia %

2. **Store actualizado (useGameStore.ts):**
   - Estado `bots: { sSOL: {active, targetPrice}, sXRP: {active, targetPrice} }`
   - Funciones `setBotActive()` y `setBotTargetPrice()`
   - Validación de precios negativos

3. **useGameLoop actualizado:**
   - Lógica de venta automática cuando precio >= targetPrice
   - Toast de confirmación cuando bot ejecuta venta
   - Soporte para ambos bots (SOL y XRP)

4. **ExchangePanel actualizado:**
   - Sección de Trading Bots integrada
   - Paneles de bots al lado de los gráficos

**Funcionalidades:**
- Bots de Grid Spot para venta automática
- Configurar precio objetivo por moneda
- Toggle ON/OFF con animaciones
- Monitoreo de mercado en tiempo real
- Ejecución automática al alcanzar precio objetivo

**Build:** ✓ OK (952KB - warning chunk)

**Repo:** https://github.com/gamminminingjeez-cpu/miningjeez

---

## Registros Anteriores

### Offline Earnings Modal
- Modal premium con contador animado
- Cálculo de ganancias offline

### Exchange / Mercado Cripto
- Recharts para gráficos financieros
- Fluctuación de precios

### Tienda, Game Loop, Drag & Drop, Layout, Auth
- Ver commits anteriores
