import { useEffect, useRef } from 'react'
import { useGameStore } from '../store/useGameStore'

const TICK_INTERVAL = 1000 // 1 second
const SAVE_INTERVAL = 30000 // Save to DB every 30 seconds

// Crypto generation rates per TH/s per second
const SOL_PER_TH_PER_SEC = 0.001
const XRP_PER_TH_PER_SEC = 0.0001

export function useGameLoop() {
  const { totalHashrate, isOverloaded, isThrottling, addCrypto, credits, sSol, sXrp } = useGameStore()
  const lastSaveRef = useRef(Date.now())
  const tickRef = useRef<number | null>(null)

  useEffect(() => {
    const gameLoop = () => {
      // Only generate crypto if hashrate > 0 and no overload
      if (totalHashrate > 0 && !isOverloaded) {
        let efficiency = 1
        if (isThrottling) {
          efficiency = 0.5 // 50% efficiency during throttling
        }
        
        const sSolGenerated = totalHashrate * SOL_PER_TH_PER_SEC * efficiency
        const sXrpGenerated = totalHashrate * XRP_PER_TH_PER_SEC * efficiency
        
        addCrypto(sSolGenerated, sXrpGenerated)
      }
      
      // Periodic save (placeholder for Supabase sync)
      const now = Date.now()
      if (now - lastSaveRef.current >= SAVE_INTERVAL) {
        lastSaveRef.current = now
        // Future: sync to Supabase here
        console.log('Auto-save triggered', { credits, sSol, sXrp })
      }
      
      tickRef.current = window.setTimeout(gameLoop, TICK_INTERVAL)
    }
    
    tickRef.current = window.setTimeout(gameLoop, TICK_INTERVAL)
    
    return () => {
      if (tickRef.current) {
        clearTimeout(tickRef.current)
      }
    }
  }, [totalHashrate, isOverloaded, isThrottling, addCrypto, credits, sSol, sXrp])
}
