import { useEffect } from 'react'
import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { motion } from 'framer-motion'
import { Header } from './components/layout/Header'
import { Sidebar } from './components/layout/Sidebar'
import { GridBoard } from './components/layout/GridBoard'
import { InventoryPanel } from './components/layout/InventoryPanel'
import { useAuthStore } from './store/useAuthStore'
import { useGameStore } from './store/useGameStore'
import { supabase } from './lib/supabase'
import { getInitialInventory } from './lib/mockData'

function App() {
  const { user, setSession, clearSession } = useAuthStore()
  const { inventory, grid, placeItem, totalHashrate, totalConsumption, energyLimit, avgTemperature, setInventory } = useGameStore()

  // Initialize inventory with mock data on mount
  useEffect(() => {
    if (user && inventory.length === 0) {
      const initialItems = getInitialInventory()
      setInventory(initialItems)
    }
  }, [user])

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

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (over) {
      const idStr = over.id.toString()
      const parts = idStr.split('-')
      if (parts.length === 2) {
        const x = parseInt(parts[0], 10)
        const y = parseInt(parts[1], 10)
        if (!isNaN(x) && !isNaN(y)) {
          placeItem(active.id.toString(), x, y)
        }
      }
    }
  }

  if (!user) {
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

  // Calculate derived stats
  const isOverloaded = totalConsumption > energyLimit
  const isThrottling = avgTemperature >= 90

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
        {/* Ambient glow effects */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        </div>

        {/* Main container */}
        <div className="relative z-10 flex flex-col h-screen p-4 gap-4">
          {/* Header */}
          <Header
            credits={1000}
            sSol={0}
            sXrp={0}
          />

          {/* Main content */}
          <div className="flex flex-1 gap-4 overflow-hidden">
            {/* Sidebar */}
            <Sidebar
              hashrate={totalHashrate}
              energyUsed={totalConsumption}
              energyLimit={energyLimit}
              temperature={avgTemperature}
              isOverloaded={isOverloaded}
              isThrottling={isThrottling}
            />

            {/* Center area with Grid */}
            <motion.main
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex-1 flex flex-col items-center justify-center gap-4"
            >
              <GridBoard
                gridSize={5}
                gridState={grid.map(row => row.map(cell => cell.item))}
              />
            </motion.main>
          </div>

          {/* Inventory Panel at bottom */}
          <InventoryPanel items={inventory} />

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
    </DndContext>
  )
}

export default App
