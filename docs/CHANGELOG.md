# Changelog - Grid Node Tycoon

---

## 2026-04-06

### Día 1: Proyecto Inicializado y Supabase Conectado

**Acciones realizadas:**

1. **Documentación:**
   - Se creó `/docs/GDD.md` con Game Design Document completo v1.0.0
   - Se creó `/docs/ROADMAP.md` con 7 fases detalladas
   - Se creó `/docs/CHANGELOG.md` (este archivo)

2. **Infraestructura del Proyecto (Fase 1 - Setup):**
   - Se inicializó proyecto Vite + React + TypeScript
   - Se instaló y configuró Tailwind CSS v3 con tema ciberpunk
   - Se crearon carpetas: `components/`, `hooks/`, `lib/`, `pages/`, `store/`, `types/`
   - Se configuró `tailwind.config.js` con colores cyberpunk (cyan, purple, green)
   - Se configuró `index.css` con estilos base y utilidades glassmorphism
   - Compilación exitosa (build verificado)

3. **Supabase y Autenticación (Fase 1 - Auth):**
   - Se instaló `@supabase/supabase-js`
   - Se creó `src/lib/supabase.ts` - Cliente de Supabase configurado
   - Se creó `.env.local` con variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` (vacías)
   - Se creó `src/components/Auth.tsx` - UI de Login/Register con diseño ciberpunk
   - Se actualizó `App.tsx` para detectar sesión y mostrar Auth o contenido según corresponda
   - Se agregó lógica de `onAuthStateChange` para detectar cambios de sesión en tiempo real
   - Se agregó botón "Cerrar Sesión"

**Stack configurado:**
- React 18 + TypeScript
- Vite 5
- Tailwind CSS 3
- Supabase Client (@supabase/supabase-js)

**Estado del proyecto:** Compila correctamente, auth preparado.

**Notas:**
- Repo: https://github.com/gamminminingjeez-cpu/miningjeez
- Supabase: https://qeqellfnbhkbulkqyobr.supabase.co
- **Pendiente:** Usuario debe agregar credenciales reales en `.env.local`

**Próximo paso:**
- Agregar credenciales de Supabase en `.env.local`
- Crear tablas en Supabase (profiles, player_wallets, inventory, grid_state)
- Continuar con Fase 2 del Roadmap

---

## Registros Anteriores

### 2026-04-06 - Inicialización (上午)
- Repositorio clonado y documentación base creada.
