import { useEffect, useState } from 'react'
import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { motion } from 'framer-motion'
import { Toaster, toast } from 'sonner'
import { Header } from './components/layout/Header'
import { Sidebar } from './components/layout/Sidebar'
import { GridBoard } from './components/layout/GridBoard'
import { InventoryPanel } from './components/layout/InventoryPanel'
import { ExchangePanel } from './components/layout/ExchangePanel'
import { OfflineEarningsModal } from './components/layout/OfflineEarningsModal'
import { useAuthStore } from './store/useAuthStore'
import { useGameStore } from './store/useGameStore'
import { supabase } from './lib/supabase'
import { getInitialInventory } from './lib/mockData'
import { useAutosave, loadPlayerData, calculateOfflineEarnings } from './hooks/useAutosave'
import { mockCatalog } from './lib/mockData'
import { setToastFunction } from './hooks/useGameLoop'
import type { GridItem } from './types/game'

// Set up toast function for game loop
setToastFunction((message, options) => toast(message, options))

function App() {
  const { user, setSession, clearSession } = useAuthStore()
  const { 
    inventory, grid, placeItem, totalHashrate, totalConsumption, energyLimit, avgTemperature, 
    setInventory, credits, sSol, sXrp, setGrid, setCredits 
  } = useGameStore()
  const [isLoading, setIsLoading] = useState(true)
  const [isHydrated, setIsHydrated] = useState(false)
  const [isExchangeOpen, setIsExchangeOpen] = useState(false)
  const [offlineEarnings, setOfflineEarnings] = useState<{
    sSol: number
    sXrp: number
    secondsOffline: number
  } | null>(null)

  // Autosave hook
  const { syncStatus, lastSync, syncNow } = useAutosave(user?.id)

  // Hydrate game state from Supabase on login
  useEffect(() => {
    if (!user) {
      setIsHydrated(false)
      return
    }

    const hydrate = async () => {
      setIsLoading(true)
      
      // Try to load existing data
      const data = await loadPlayerData(user.id)
      
      if (data) {
        // Restore wallet
        useGameStore.setState({
          credits: data.wallet?.credits ?? 1000,
          sSol: data.wallet?.s_sol ?? 0,
          sXrp: data.wallet?.s_xrp ?? 0
        })

        // Restore grid from grid_state
        const newGrid = Array(5).fill(null).map((_, y) =>
          Array(5).fill(null).map((_, x) => ({ x, y, item: null as GridItem | null }))
        )
        
        if (data.grid && data.grid.length > 0) {
          for (const cell of data.grid) {
            const itemId = cell.item_id
            const catalogItem = mockCatalog.find(i => i.id === itemId)
            if (catalogItem && cell.pos_x >= 0 && cell.pos_x < 5 && cell.pos_y >= 0 && cell.pos_y < 5) {
              newGrid[cell.pos_y][cell.pos_x] = {
                x: cell.pos_x,
                y: cell.pos_y,
                item: { ...catalogItem, instanceId: cell.instance_id }
              }
            }
          }
        }
        setGrid(newGrid)
        
        // Restore inventory
        if (data.inventory && data.inventory.length > 0) {
          const invItems = data.inventory
            .map((inv: { item_id: string; instance_id: string }) => {
              const catalogItem = mockCatalog.find(i => i.id === inv.item_id)
              if (catalogItem) {
                return { ...catalogItem, instanceId: inv.instance_id }
              }
              return null
            })
            .filter(Boolean) as GridItem[]
          setInventory(invItems)
        } else {
          // Give initial items if empty
          setInventory(getInitialInventory())
        }

        // Calculate offline earnings BEFORE restoring grid stats
        if (data.wallet?.last_updated) {
          // Get the hashrate from the grid BEFORE calculating stats
          let storedHashrate = 0
          for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 5; x++) {
              const item = newGrid[y]?.[x]?.item
              if (item?.type === 'gpu') {
                storedHashrate += item.hashrate
              }
            }
          }
          
          const now = Date.now()
          const lastTime = new Date(data.wallet.last_updated).getTime()
          const secondsOffline = Math.min((now - lastTime) / 1000, 86400)
          
          const isOverloaded = false // Can't know without stored energy limit
          const isThrottling = false
          
          const { sSol: offlineSol, sXrp: offlineXrp } = calculateOfflineEarnings(
            data.wallet.last_updated,
            storedHashrate,
            isOverloaded,
            isThrottling
          )
          
          if ((offlineSol > 0 || offlineXrp > 0) && secondsOffline > 60) {
            // Show offline earnings modal instead of toast
            setOfflineEarnings({ sSol: offlineSol, sXrp: offlineXrp, secondsOffline })
          }
        }
      } else {
        // New player - give initial inventory
        setInventory(getInitialInventory())
      }
      
      // Recalculate stats after hydration
      useGameStore.getState().calculateStats()
      
      setIsHydrated(true)
      setIsLoading(false)
    }

    hydrate()
  }, [user])

  // Auth effect
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(session)
      } else {
        clearSession()
      }
    })

    return () => subscription.unsubscribe()
  }, [setSession, clearSession])

  // Handle purchase
  const handlePurchase = async (item: GridItem) => {
    if (credits < item.price) {
      toast.error('Fondos insuficientes')
      return
    }

    const newCredits = credits - item.price
    setCredits(newCredits)

    const newInventory = [...inventory, item]
    setInventory(newInventory)

    if (user) {
      try {
        await supabase
          .from('player_wallets')
          .upsert({ user_id: user.id, credits: newCredits }, { onConflict: 'user_id' })

        await supabase
          .from('inventory')
          .insert({ user_id: user.id, item_id: item.id, instance_id: item.instanceId, status: 'en_inventario' })

        toast.success('¡Compra exitosa!', {
          description: `${item.name} agregado a tu inventario`,
          style: { background: '#1e293b', border: '1px solid rgba(34, 197, 94, 0.5)', color: '#4ade80' }
        })
      } catch (error) {
        console.error('Purchase save failed:', error)
      }
    }
  }

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
          syncNow()
        }
      }
    }
  }

  // Handle close offline modal
  const handleCloseOfflineModal = () => {
    setOfflineEarnings(null)
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

  if (isLoading || !isHydrated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-cyan-400 font-mono text-xl animate-pulse">
            SINCRONIZANDO CON SERVIDOR...
          </p>
        </div>
      </div>
    )
  }

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
            credits={credits}
            sSol={sSol}
            sXrp={sXrp}
            syncStatus={syncStatus}
            lastSync={lastSync}
            onExchangeClick={() => setIsExchangeOpen(true)}
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
                isOverheating={isThrottling}
              />
            </motion.main>
          </div>

          {/* Inventory Panel at bottom with tabs */}
          <InventoryPanel 
            items={inventory} 
            credits={credits}
            onPurchase={handlePurchase}
          />

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

      {/* Exchange Modal */}
      <ExchangePanel 
        isOpen={isExchangeOpen}
        onClose={() => setIsExchangeOpen(false)}
        userId={user.id}
      />

      {/* Offline Earnings Modal */}
      <OfflineEarningsModal
        isOpen={offlineEarnings !== null}
        onClose={handleCloseOfflineModal}
        earnings={offlineEarnings || { sSol: 0, sXrp: 0, secondsOffline: 0 }}
      />

      {/* Toaster for notifications */}
      <Toaster 
        theme="dark" 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            border: '1px solid rgba(34, 211, 238, 0.3)',
            color: '#e5e5e5'
          }
        }}
      />
    </DndContext>
  )
}

export default App
