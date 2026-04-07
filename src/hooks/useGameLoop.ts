import { useEffect, useRef } from 'react'
import { useGameStore } from '../store/useGameStore'

const TICK_INTERVAL = 1000 // 1 second
const SAVE_INTERVAL = 30000 // Save to DB every 30 seconds
const MARKET_UPDATE_INTERVAL = 5000 // Update market prices every 5 seconds
const PRICE_FLUCTUATION = 0.05 // ±5% max fluctuation

// Crypto generation rates per TH/s per second
const SOL_PER_TH_PER_SEC = 0.001
const XRP_PER_TH_PER_SEC = 0.0001

function fluctuatePrice(currentPrice: number): number {
  const change = (Math.random() - 0.5) * 2 * PRICE_FLUCTUATION // -5% to +5%
  const newPrice = currentPrice * (1 + change)
  // Clamp to reasonable bounds (50% to 200% of starting price)
  const startPrice = currentPrice > 1 ? 2.00 : 0.50
  return Math.max(startPrice * 0.5, Math.min(startPrice * 2, newPrice))
}

export function useGameLoop() {
  const { 
    totalHashrate, isOverloaded, isThrottling, 
    addCrypto, credits, sSol, sXrp,
    priceSOL, priceXRP, updateMarketPrices
  } = useGameStore()
  
  const lastSaveRef = useRef(Date.now())
  const lastMarketUpdateRef = useRef(Date.now())
  const tickRef = useRef<number | null>(null)

  useEffect(() => {
    const gameLoop = () => {
      const now = Date.now()
      
      // Generate crypto
      if (totalHashrate > 0 && !isOverloaded) {
        const efficiency = isThrottling ? 0.5 : 1
        const sSolGenerated = totalHashrate * SOL_PER_TH_PER_SEC * efficiency
        const sXrpGenerated = totalHashrate * XRP_PER_TH_PER_SEC * efficiency
        addCrypto(sSolGenerated, sXrpGenerated)
      }
      
      // Update market prices every 5 seconds
      if (now - lastMarketUpdateRef.current >= MARKET_UPDATE_INTERVAL) {
        lastMarketUpdateRef.current = now
        const newSOL = fluctuatePrice(priceSOL)
        const newXRP = fluctuatePrice(priceXRP)
        updateMarketPrices(newSOL, newXRP)
      }
      
      // Periodic save
      if (now - lastSaveRef.current >= SAVE_INTERVAL) {
        lastSaveRef.current = now
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
  }, [totalHashrate, isOverloaded, isThrottling, addCrypto, credits, sSol, sXrp, priceSOL, priceXRP, updateMarketPrices])
}
