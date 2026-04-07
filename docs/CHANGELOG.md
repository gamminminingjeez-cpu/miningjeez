# Changelog - Grid Node Tycoon

---

## 2026-04-06

### Día 1: Inicialización del Proyecto y GDD

**Acciones realizadas:**
- Se clonó el repositorio vacío `gamminminingjeez-cpu/miningjeez`
- Se creó la carpeta `/docs` para documentación del proyecto
- Se crearon los archivos base de documentación:
  - `GDD.md` - Game Design Document completo (v1.0.0)
  - `ROADMAP.md` - Roadmap de desarrollo por 6 fases
  - `CHANGELOG.md` - Este archivo

**GDD Completado con:**
- High-Concept: Simulador de granja de minería cyberpunk
- Core Loop: Minar → Liquidar → Expandir → Optimizar
- Economía: USDT (créditos), $sSOL, $sXRP
- Grid Stats: Hashrate, Consumo, Límite energía, Temperatura
- Tablero 5x5 con sistema de coordenadas y sinergias por adyacencia
- Schema de base de datos: profiles, player_wallets, inventory, grid_state, items_catalog
- Progresión en 3 fases (Niveles 1-10, 11-20, 21+)
- Stack: React + TypeScript + Vite + Tailwind CSS + Supabase

**Notas:**
- Repositorio: https://github.com/gamminminingjeez-cpu/miningjeez
- Supabase: https://qeqellfnbhkbulkqyobr.supabase.co
- Metodología: Auth → Inventario → Tablero → Core Loop → UI → Deploy

**Próximo paso:**
- Inicializar proyecto Vite + React + TypeScript + Tailwind
- Configurar Supabase Client
- Implementar autenticación (login/registro)

---

*Para registrar nuevos cambios, agregar una nueva entrada al inicio con la fecha y describir las acciones realizadas.*
