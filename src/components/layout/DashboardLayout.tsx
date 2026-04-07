import { motion } from 'framer-motion'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { GridBoard } from './GridBoard'
import { useAuthStore } from '../../store/useAuthStore'
import { Auth } from '../Auth'
import { supabase } from '../../lib/supabase'

interface DashboardLayoutProps {
  credits?: number
  sSol?: number
  sXrp?: number
  hashrate?: number
  energyUsed?: number
  energyLimit?: number
  temperature?: number
  gridState?: Array<Array<{ id: string; name: string; type: string } | null>>
}

export function DashboardLayout({
  credits = 1000,
  sSol = 0,
  sXrp = 0,
  hashrate = 0,
  energyUsed = 0,
  energyLimit = 500,
  temperature = 25,
  gridState,
}: DashboardLayoutProps) {
  const { user } = useAuthStore()

  const isOverloaded = energyUsed > energyLimit
  const isThrottling = temperature >= 90

  if (!user) {
    return <Auth />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* Ambient glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Main container */}
      <div className="relative z-10 flex flex-col h-screen p-4 gap-4">
        {/* Header */}
        <Header credits={credits} sSol={sSol} sXrp={sXrp} />

        {/* Main content */}
        <div className="flex flex-1 gap-4 overflow-hidden">
          {/* Sidebar */}
          <Sidebar
            hashrate={hashrate}
            energyUsed={energyUsed}
            energyLimit={energyLimit}
            temperature={temperature}
            isOverloaded={isOverloaded}
            isThrottling={isThrottling}
          />

          {/* Center area */}
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex-1 flex items-center justify-center"
          >
            <GridBoard
              gridState={gridState}
            />
          </motion.main>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-center justify-between text-xs text-slate-500 font-mono"
        >
          <span>GRID NODE TYCOON v1.0</span>
          <span>{user.email}</span>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-red-400/70 hover:text-red-400 transition-colors"
          >
            CERRAR SESIÓN
          </button>
        </motion.footer>
      </div>
    </div>
  )
}
