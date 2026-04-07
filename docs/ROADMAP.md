# Roadmap de Desarrollo - Grid Node Tycoon

**Estado actual:** Iniciando Fase 1.

*Instrucción estricta para la IA:* Este documento dicta el orden cronológico del desarrollo. No se debe comenzar a programar una Fase sin haber completado y testeado con éxito la Fase anterior. Al completar una tarea, se debe registrar en el `CHANGELOG.md`.

---

## Fase 1: Infraestructura y Autenticación (Setup Inicial)

*Objetivo: Tener la aplicación corriendo, conectada a la base de datos y con sistema de usuarios.*

- [ ] Inicializar proyecto con Vite, React, TypeScript y Tailwind CSS.
- [ ] Configurar variables de entorno (`.env.local`) para la conexión con Supabase.
- [ ] Implementar la interfaz de Login / Registro (UI minimalista ciberpunk).
- [ ] Configurar Supabase Auth y proteger las rutas principales del juego (solo usuarios logueados pueden ver el tablero).
- [ ] Implementar un estado global (ej. Zustand o Context API) para manejar la sesión del usuario.

---

## Fase 2: Modelado de Base de Datos y Estado Global

*Objetivo: Crear el esquema de datos donde vivirá la información del jugador antes de dibujar la interfaz.*

- [ ] Crear tabla `profiles` en Supabase (vinculada al Auth).
- [ ] Crear tabla `player_wallets` (Créditos, $sSOL, $sXRP, última fecha de conexión).
- [ ] Crear base de datos de catálogo (Items disponibles en el juego: GPUs, Coolers, PSU).
- [ ] Crear tablas `inventory` y `grid_state` para guardar lo que el jugador posee y dónde lo ha colocado.
- [ ] Crear los hooks en React (`usePlayer`, `useInventory`) para leer esta información en tiempo real desde Supabase.

---

## Fase 3: Layout y Core UI (La Pantalla Principal)

*Objetivo: Maquetar la interfaz sin lógica compleja, solo visualización de datos.*

- [ ] Crear el `Sidebar Izquierdo`: Paneles de estadísticas (Hashrate, Energía consumida vs Límite, Temperatura media).
- [ ] Crear el `Header`: Mostrar el saldo actual del jugador (Créditos y Criptos).
- [ ] Crear el `Panel Inferior`: Interfaz con pestañas para el "Inventario" (piezas compradas) y la "Tienda" (piezas para comprar).
- [ ] Crear el componente visual del `Grid` (Tablero 5x5 vacío), aplicando estilos de glassmorphism y dark mode.

---

## Fase 4: Interactividad y Drag & Drop

*Objetivo: Permitir al jugador mover piezas.*

- [ ] Implementar librería de Drag & Drop (ej. `@dnd-kit/core` o equivalente en React).
- [ ] Lógica para arrastrar un ítem desde el Inventario y soltarlo en una celda vacía del Grid.
- [ ] Lógica para devolver un ítem del Grid al Inventario.
- [ ] Función para guardar el nuevo estado del `grid_state` en Supabase de forma eficiente tras cada movimiento.

---

## Fase 5: El "Game Loop" y Sinergias (El Motor del Juego)

*Objetivo: Darle vida al juego, hacer que los números suban y las reglas se apliquen.*

- [ ] Programar la función de cálculo del tablero (evaluar adyacencias). Si una GPU toca un Cooler, bajar su temperatura.
- [ ] Programar la penalización de energía (Si Consumo > PSU, Hashrate = 0).
- [ ] Implementar el "Tick" (Game Loop temporal). Un `useEffect` que cada X segundos sume `$sSOL` o `$sXRP` al estado global basado en el Hashrate activo.
- [ ] Sincronizar de forma optimizada: Guardar el progreso de minado en Supabase periódicamente (ej. cada 30 segundos) en lugar de cada segundo para no saturar la base de datos.

---

## Fase 6: Economía y Mercado

*Objetivo: Que el jugador pueda gastar lo que mina.*

- [ ] Programar la lógica de la "Tienda": Restar Créditos y añadir el componente al `inventory` en Supabase.
- [ ] Interfaz de Mercado (Exchange): Una gráfica o panel donde el jugador pueda vender `$sSOL` y `$sXRP` por Créditos.
- [ ] Implementar un algoritmo básico de fluctuación de precios (variación pseudoaleatoria cada cierto tiempo).

---

## Fase 7: Automatización y Pulido (Late Game)

*Objetivo: Retención a largo plazo y detalles visuales.*

- [ ] Lógica de "Cálculo Offline": Cuando el jugador inicia sesión, comparar la hora actual con `last_updated` y otorgarle los recursos minados mientras estuvo desconectado.
- [ ] Sistema de mejoras (Expandir el tablero de 5x5 a 8x8 o superior comprando espacio).
- [ ] Bots de Trading (permitir configurar ventas automáticas en el mercado cuando se alcance cierto precio).
- [ ] Pulido visual: Animaciones de Framer Motion, partículas o indicadores visuales cuando un equipo está sobrecalentado.

---

## Stack Tecnológico

- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Backend/DB:** Supabase (PostgreSQL + Auth + Realtime)
- **Drag & Drop:** @dnd-kit/core
- **Estado Global:** Zustand o Context API
- **Animaciones:** Framer Motion (opcional en Fase 7)
- **DB URL:** https://qeqellfnbhkbulkqyobr.supabase.co
- **Repo:** https://github.com/gamminminingjeez-cpu/miningjeez

---

## Documentación Relacionada

- `GDD.md` - Game Design Document completo
- `CHANGELOG.md` - Historial de cambios
