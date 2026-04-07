import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { Auth } from './components/Auth'
import type { Session } from '@supabase/supabase-js'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-cyber-cyan font-mono text-xl animate-pulse">
            CARGANDO...
          </p>
        </div>
      </div>
    )
  }

  if (!session) {
    return <Auth />
  }

  // User is logged in - show game placeholder
  return (
    <div className="min-h-screen bg-cyber-bg flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-mono font-bold text-cyber-cyan text-glow-cyan mb-4">
          Grid Node Tycoon
        </h1>
        <p className="text-xl text-cyber-purple font-mono text-glow-purple mb-4">
          Bienvenido, {session.user.email}
        </p>
        <div className="glass-panel p-6 inline-block">
          <p className="text-cyber-green font-mono">✓ Supabase Connected</p>
          <p className="text-cyber-green font-mono">✓ Session Active</p>
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
