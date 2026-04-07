import { useEffect } from 'react'
import { supabase } from './lib/supabase'
import { useAuthStore } from './store/useAuthStore'
import { DashboardLayout } from './components/layout/DashboardLayout'

function App() {
  const { user, setSession, clearSession } = useAuthStore()

  useEffect(() => {
    // Check current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(session)
      } else {
        clearSession()
      }
    })

    return () => subscription.unsubscribe()
  }, [setSession, clearSession])

  // Show loading state
  if (!user && !supabase) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-cyan-400 font-mono text-xl animate-pulse">
            CARGANDO SISTEMA...
          </p>
        </div>
      </div>
    )
  }

  // Show dashboard if logged in
  if (user) {
    return <DashboardLayout />
  }

  // Auth screen handled inside DashboardLayout
  return <DashboardLayout />
}

export default App
