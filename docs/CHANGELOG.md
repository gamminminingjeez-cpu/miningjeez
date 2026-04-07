# Changelog - Grid Node Tycoon

---

## 2026-04-06

### Estado Actual: Fase 1 Completa - Fase 2 Iniciada

**Acciones realizadas:**

1. **Infraestructura del Proyecto (Fase 1 - Setup):**
   - Proyecto Vite + React + TypeScript inicializado
   - Tailwind CSS v3 con tema ciberpunk configurado
   - Estructura de carpetas: `components/`, `hooks/`, `lib/`, `pages/`, `store/`, `types/`
   - Build verificado correctamente

2. **Supabase y Autenticación (Fase 1 - Auth):**
   - `@supabase/supabase-js` instalado
   - `src/lib/supabase.ts` - Cliente de Supabase configurado
   - `.env.local` con variables placeholder
   - `src/components/Auth.tsx` - UI de Login/Register ciberpunk
   - Build OK

3. **Estado Global con Zustand (Fase 1 - Final):**
   - `zustand` instalado
   - `src/store/useAuthStore.ts` - Store de autenticación creado
   - `App.tsx` refactorizado con Zustand y `onAuthStateChange`
   - Sesión se actualiza automáticamente al iniciar/cerrar sesión
   - Build OK

**Schema SQL para ejecutar en Supabase (pending user):**
```sql
-- 1. Tabla de Perfiles
CREATE TABLE public.profiles (...);

-- 2. Tabla de Billeteras (1000 créditos iniciales)
CREATE TABLE public.player_wallets (...);

-- 3. Trigger para creación automática
CREATE OR REPLACE FUNCTION public.handle_new_user()...;
CREATE TRIGGER on_auth_user_created...;
```

**Stack:**
- React 18 + TypeScript + Vite 5
- Tailwind CSS 3 (tema ciberpunk)
- Supabase Client + Zustand
- Build: ✓ OK

**Repo:** https://github.com/gamminminingjeez-cpu/miningjeez
**Supabase:** https://qeqellfnbhkbulkqyobr.supabase.co

**Próximo paso:**
- Ejecutar SQL en Supabase para crear tables (profiles, player_wallets)
- Crear hooks usePlayer, useWallet
- Avanzar a Fase 2

---

*Para registrar nuevos cambios, agregar una nueva entrada al inicio con la fecha.*
