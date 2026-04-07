import { useEffect } from 'react'
import { supabase } from './lib/supabase'
import { useAuthStore } from './store/useAuthStore'
import { Auth } from './components/Auth'

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

  if (!user) {
    return <Auth />
  }

  // User is logged in - show game placeholder
  return (
    <div className="min-h-screen bg-cyber-bg flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-mono font-bold text-cyber-cyan text-glow-cyan mb-4">
          Grid Node Tycoon
        </h1>
        <p className="text-xl text-cyber-purple font-mono text-glow-purple mb-2">
          Bienvenido, {user.email}
        </p>
        <div className="glass-panel p-6 inline-block">
          <p className="text-cyber-green font-mono">✓ Supabase Connected</p>
          <p className="text-cyber-green font-mono">✓ Session Active</p>
          <p className="text-cyber-green font-mono">✓ Zustand Store Active</p>
          <p className="text-cyber-green font-mono">✓ Ready to Play</p>
        </div>
        <div className="mt-6">
          <button
            onClick={() => supabase.auth.signOut()}
            className="btn-cyber"
          >
            CERRAR SESIÓN
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
