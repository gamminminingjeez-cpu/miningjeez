# Changelog - Grid Node Tycoon

---

## 2026-04-06

### Fase 7: Offline Earnings y Bienvenida Implementados

**Acciones realizadas:**

1. **OfflineEarningsModal.tsx creado:**
   - Modal premium glassmorphism con animación de entrada
   - Contador animado para mostrar ganancias
   - Muestra tiempo offline, $sSOL y $sXRP ganados
   - Botón "RECLAMAR GANANCIAS"
   - Valor total estimado en USDT

2. **Cálculo de ganancias offline:**
   - Al hacer login, compara `last_updated` con hora actual
   - Calcula producción basada en hashrate del grid guardado
   - Solo muestra modal si pasaron >60 segundos y hay ganancias
   - 50% de eficiencia (como en GDD)

3. **App.tsx actualizado:**
   - Estado `offlineEarnings` para el modal
   - Lógica de cálculo de hashrate desde grid restaurado
   - Integración con OfflineEarningsModal

**Funcionalidades:**
- Ganancias offline al volver al juego
- Modal de bienvenida premium
- Animaciones de contador
- Eficiencia 50% mientras offline

**Build:** ✓ OK (948KB - warning chunk size)

**Repo:** https://github.com/gamminminingjeez-cpu/miningjeez

---

## Registros Anteriores

### Exchange / Mercado Cripto
- Recharts para gráficos financieros
- Fluctuación de precios cada 5s
- Venta de cryptos con Supabase

### Tienda
- Sonner notificaciones
- Tabs Inventario/Tienda

### Game Loop y Sinergias
- Motor de stats, adyacencias

### Drag & Drop, Layout, Auth
- Ver commits anteriores
