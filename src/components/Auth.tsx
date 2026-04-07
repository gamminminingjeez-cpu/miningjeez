import { useState } from 'react'
import { supabase } from '../lib/supabase'

type AuthMode = 'login' | 'register'

export function Auth() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        setMessage('¡Registro exitoso! Revisa tu email para confirmar.')
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cyber-bg flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-mono font-bold text-cyber-cyan text-glow-cyan mb-2">
            Grid Node Tycoon
          </h1>
          <p className="text-cyber-purple font-mono text-sm">
            {mode === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-cyber-green font-mono text-sm mb-2">
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-cyber-bg border border-cyber-border rounded px-4 py-3
                         text-white font-mono placeholder:text-gray-600
                         focus:outline-none focus:border-cyber-cyan focus:shadow-glow-cyan
                         transition-all"
              placeholder="miner@gridnode.io"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-cyber-green font-mono text-sm mb-2">
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-cyber-bg border border-cyber-border rounded px-4 py-3
                         text-white font-mono placeholder:text-gray-600
                         focus:outline-none focus:border-cyber-cyan focus:shadow-glow-cyan
                         transition-all"
              placeholder="••••••••"
            />
          </div>

          {/* Error/Message */}
          {error && (
            <div className="bg-red-500/20 border border-cyber-red text-cyber-red
                            font-mono text-sm p-3 rounded">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-500/20 border border-cyber-green text-cyber-green
                            font-mono text-sm p-3 rounded">
              {message}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-cyber font-mono py-3 disabled:opacity-50
                       disabled:cursor-not-allowed"
          >
            {loading ? 'PROCESANDO...' : mode === 'login' ? 'ENTRAR' : 'REGISTRARSE'}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login')
              setError(null)
              setMessage(null)
            }}
            className="text-cyber-purple font-mono text-sm hover:text-cyber-cyan
                       transition-colors underline"
          >
            {mode === 'login'
              ? '¿No tienes cuenta? Regístrate'
              : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>

        {/* Credentials Warning */}
        <div className="mt-6 border-t border-cyber-border pt-4">
          <p className="text-gray-500 font-mono text-xs text-center">
            ⚠️ Configura .env.local con tus credenciales de Supabase
          </p>
        </div>
      </div>
    </div>
  )
}
