# Game Design Document (GDD) - Grid Node Tycoon

**Versión:** 1.0.0
**Última actualización:** 2026-04-06
**Stack Técnico:** React, TypeScript, Vite, Tailwind CSS, Supabase.

---

## 1. High-Concept y Estética

Un simulador web isométrico (o top-down en 2D) de gestión de granjas de minería.

- **Estilo Visual:** Ciberpunk oscuro. Fondos oscuros (`bg-gray-900`), acentos en neón (cian, púrpura, verde terminal).
- **UI/UX:** Paneles de cristal esmerilado (Glassmorphism), menús limpios y modulares.
- **Objetivo:** Optimizar una cuadrícula (grid) con componentes de hardware, gestionando el calor, la energía y el espacio para maximizar la producción de criptomonedas virtuales y venderlas en un mercado dinámico.

---

## 2. Core Loop (Bucle Central)

1. **Minar:** Los componentes en el tablero generan `$sSOL` y `$sXRP` por segundo.
2. **Liquidar:** Vender las criptos extraídas por `Créditos (USDT)` en el mercado del juego.
3. **Expandir:** Comprar nuevos racks, GPUs, fuentes de alimentación (PSU) y sistemas de refrigeración (Coolers).
4. **Optimizar (Puzzle):** Ubicar las piezas en el tablero. Buscar sinergias por adyacencia (ej. Cooler al lado de GPU) y evitar penalizaciones (sobrecalentamiento y apagones).

---

## 3. Economía y Atributos de Juego

El estado global del jugador debe trackear los siguientes valores matemáticos:

### Monedas

| Moneda | Descripción |
|--------|-------------|
| **Créditos (USDT)** | Moneda fiat del juego. Sirve para comprar hardware. |
| **$sSOL** | Criptomoneda de minado rápido, bajo valor en el mercado. |
| **$sXRP** | Criptomoneda de minado lento, alto valor en el mercado. |

### Métricas del Tablero (Grid Stats)

| Métrica | Descripción | Regla |
|---------|-------------|-------|
| **Hashrate Total (TH/s)** | Determina cuántas criptos se minan por segundo. | — |
| **Consumo de Energía Total (W)** | Suma del consumo de todos los equipos. | — |
| **Límite de Energía (W)** | Capacidad máxima dada por las Fuentes de Alimentación instaladas. | Si Consumo > Límite, la granja se apaga (Hashrate = 0). |
| **Temperatura Promedio (°C)** | Temperatura promedio de los componentes. | Si una GPU supera los 90°C → Thermal Throttling (-50% eficiencia). Si llega a 100°C → se apaga. |

---

## 4. El Tablero (The Grid)

- **Tamaño Inicial:** Cuadrícula de 5x5 espacios (El Garaje).
- **Sistema de Coordenadas:** Cada celda tiene una posición `(x, y)`.
- **Reglas de Colocación:** Un componente ocupa un espacio `(1x1)`. Los jugadores arrastran (Drag & Drop) desde el inventario al tablero.
- **Sinergias de Adyacencia (Crucial para la IA):** El código debe evaluar las celdas vecinas (Arriba, Abajo, Izquierda, Derecha).

### Sinergias por Adyacencia

| Componente Vecino | Efecto |
|-------------------|--------|
| Cooler adyacente a GPU | Temperatura de GPU reducida en 15°C |
| [Otras sinergias...] | [DescripciÃ³n] |

---

## 5. Catálogo de Items (Draft)

### Hardware de Minería

| Item | Hashrate (TH/s) | Consumo (W) | Temperatura Base (°C) | Precio (USDT) |
|------|-----------------|-------------|------------------------|---------------|
| GPU básica | 1 | 100 | 70 | 100 |
| GPU avanzada | 3 | 200 | 80 | 300 |
| GPU de gama alta | 5 | 350 | 85 | 600 |

### Fuentes de Alimentación (PSU)

| Item | Potencia (W) | Precio (USDT) |
|------|--------------|---------------|
| PSU 500W | 500 | 50 |
| PSU 1000W | 1000 | 100 |
| PSU 2000W | 2000 | 200 |

### Sistemas de Refrigeración

| Item | Enfriamiento (°C) | Precio (USDT) |
|------|-------------------|---------------|
| Cooler básico | -10 | 30 |
| Refrigeración líquida | -25 | 150 |

---

## 6. Estructura de Base de Datos (Supabase Schema)

### Tablas

1. **`profiles`**: `id` (UUID, auth), `username`, `level`.
2. **`player_wallets`**: `user_id`, `credits` (float), `s_sol` (float), `s_xrp` (float), `last_updated` (timestamp).
3. **`inventory`**: `id`, `user_id`, `item_id` (referencia al catálogo), `quantity`, `status` (en_inventario, en_tablero).
4. **`grid_state`**: `id`, `user_id`, `pos_x`, `pos_y`, `item_id` (componente colocado en esa coordenada).
5. **`items_catalog`** (referencia): `id`, `name`, `type`, `hashrate`, `consumption`, `temp_base`, `price`.

### Row Level Security (RLS)

- Cada usuario solo puede leer/modificar sus propios datos: `profiles`, `player_wallets`, `inventory`, `grid_state`.

---

## 7. Progresión

| Fase | Niveles | Desbloqueos |
|------|---------|-------------|
| **Fase 1** | 1-10 | Enfriamiento por ventiladores, cables de baja calidad (generan calor extra), minado exclusivo de $sSOL. |
| **Fase 2** | 11-20 | Refrigeración líquida, racks de servidores, desbloqueo de minado de $sXRP. Mercado con fluctuación de precios automatizada. |
| **Fase 3** | 21+ | Bots de Grid Spot para venta automática, granjas de inmersión en aceite. |

---

## 8. Stack Tecnológico

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend/DB:** Supabase (PostgreSQL + Auth + Realtime)
- **Estilo:** Ciberpunk oscuro, Glassmorphism
- **Paleta de colores:**
  - Fondo: `bg-gray-900`
  - Acentos: Cyan (`#00FFFF`), Purple (`#A855F7`), Verde terminal (`#22C55E`)

---

## 9. Autenticación

- Supabase Auth (email/password)
- Perfil vinculado a `profiles` table

---

## 10. Roadmap de Desarrollo

Ver `ROADMAP.md`

---

## 11. Changelog

Ver `CHANGELOG.md`
