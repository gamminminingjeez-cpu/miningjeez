# Roadmap de Desarrollo - MiningJeez

> Última actualización: 2026-04-06

---

## Fases de Desarrollo

### Fase 1: Fundamentos y Autenticación
**Objetivo:** Configurar el proyecto, autenticación de usuarios y estructura base.

- [ ] Inicializar proyecto (Next.js / React / otro)
- [ ] Configurar Supabase Client
- [ ] Implementar sistema de autenticación (login/registro)
- [ ] Crear estructura de carpetas del proyecto
- [ ] Configurar variables de entorno (.env)
- [ ] Documentar arquitectura en GDD.md

**Entregable:** Usuarios pueden registrarse e iniciar sesión.

---

### Fase 2: Base de Datos del Inventario
**Objetivo:** Diseñar y crear las tablas de base de datos para el inventario.

- [ ] Diseñar schema de base de datos
- [ ] Crear tabla `profiles` (extensión de auth.users)
- [ ] Crear tabla `inventory` (items del jugador)
- [ ] Crear tabla `items` (catálogo de items disponibles)
- [ ] Configurar Row Level Security (RLS)
- [ ] Implementar API de inventario (CRUD)

**Entregable:** Sistema de inventario funcional con persistencia en Supabase.

---

### Fase 3: Tablero de Juego
**Objetivo:** Implementar la interfaz visual del tablero/mapa.

- [ ] Diseñar layout del tablero (grid, slots)
- [ ] Crear componente de celda/slot
- [ ] Implementar renderizado de items en el tablero
- [ ]添加 drag-and-drop o interacción con items
- [ ] Conectar tablero con datos del inventario
- [ ] Estilizar y hacer responsive

**Entregable:** Tablero visible con items del inventario cargados.

---

### Fase 4: Core Loop y Mecánicas
**Objetivo:** Implementar las mecánicas de juego principales.

- [ ] Implementar lógica del Core Loop
- [ ] Sistema de obtención de recursos
- [ ] Sistema de consumo/gasto de recursos
- [ ] Validación de acciones del jugador
- [ ] Feedback visual y/u sonoro

**Entregable:** El juego es playable con el loop básico.

---

### Fase 5: UI/UX y Polish
**Objetivo:** Mejorar la interfaz y experiencia de usuario.

- [ ] Diseñar HUD (recursos, stats)
- [ ] Implementar transiciones y animaciones
- [ ] Agregar efectos visuales
- [ ] Optimizar rendimiento
- [ ] Tests de usabilidad

---

### Fase 6: Deployment y Producción
**Objetivo:** Publicar el juego.

- [ ] Configurar build de producción
- [ ] Desplegar a hosting (Vercel / Railway / otro)
- [ ] Configurar dominio
- [ ] Tests finales

---

## Notas

[Agregar notas sobre decisiones técnicas, dependencias, blockers]

---

## Documentación Relacionada

- GDD.md - Game Design Document
- CHANGELOG.md - Historial de cambios
