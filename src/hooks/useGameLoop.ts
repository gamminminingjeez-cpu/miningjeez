import { useEffect, useRef } from 'react'
import { useGameStore } from '../store/useGameStore'
import { audioManager } from '../lib/audioManager'

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

// Store for toast function - will be set from App.tsx
let toastFunction: ((message: string, options?: any) => void) | null = null
export const setToastFunction = (fn: (message: string, options?: any) => void) => {
  toastFunction = fn
}

export function useGameLoop() {
  const { 
    totalHashrate, isOverloaded, isThrottling, 
    addCrypto, credits, sSol, sXrp,
    priceSOL, priceXRP, updateMarketPrices,
    bots, sellCrypto
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
        
        // Check trading bots AFTER prices are updated
        // SOL Bot
        if (bots.sSOL.active && sSol > 0 && newSOL >= bots.sSOL.targetPrice) {
          const success = sellCrypto(sSol, 'sSol')
          if (success) {
            audioManager.playCashSound()
            toastFunction?.(`🤖 Bot $sSOL ejecutado: Venta automática completada`, {
              description: `Vendiste ${sSol.toFixed(6)} $sSOL a $${newSOL.toFixed(4)}`,
              style: {
                background: '#1e293b',
                border: '1px solid rgba(34, 197, 94, 0.5)',
                color: '#4ade80'
              }
            })
          }
        }
        
        // XRP Bot
        if (bots.sXRP.active && sXrp > 0 && newXRP >= bots.sXRP.targetPrice) {
          const success = sellCrypto(sXrp, 'sXrp')
          if (success) {
            audioManager.playCashSound()
            toastFunction?.(`🤖 Bot $sXRP ejecutado: Venta automática completada`, {
              description: `Vendiste ${sXrp.toFixed(6)} $sXRP a $${newXRP.toFixed(4)}`,
              style: {
                background: '#1e293b',
                border: '1px solid rgba(34, 197, 94, 0.5)',
                color: '#4ade80'
              }
            })
          }
        }
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
  }, [totalHashrate, isOverloaded, isThrottling, addCrypto, credits, sSol, sXrp, priceSOL, priceXRP, updateMarketPrices, bots, sellCrypto])
}
