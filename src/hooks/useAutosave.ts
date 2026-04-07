import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '../store/useGameStore'
import { supabase } from '../lib/supabase'

const SAVE_INTERVAL = 30000 // 30 seconds
const OFFLINE_RATE_MULTIPLIER = 0.5 // Only 50% of earnings while offline

export function useAutosave(userId: string | undefined) {
  const { sSol, sXrp } = useGameStore()
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle')
  const [lastSync, setLastSync] = useState<Date | null>(null)
  
  const accumulatedSolRef = useRef(0)
  const accumulatedXrpRef = useRef(0)
  const lastSaveRef = useRef(Date.now())
  const isInitializedRef = useRef(false)

  // Accumulate crypto in memory (not saving to DB yet)
  useEffect(() => {
    if (!userId) return

    const store = useGameStore.getState()
    const currentSol = store.sSol
    const currentXrp = store.sXrp
    
    // Track accumulation
    accumulatedSolRef.current = currentSol
    accumulatedXrpRef.current = currentXrp
  }, [sSol, sXrp, userId])

  // Sync to Supabase
  const syncToDatabase = async () => {
    if (!userId) return
    
    setSyncStatus('syncing')
    
    try {
      // Calculate accumulated crypto since last save
      const store = useGameStore.getState()
      const accumulatedSol = accumulatedSolRef.current
      const accumulatedXrp = accumulatedXrpRef.current
      
      // Upsert wallet (add accumulated amounts)
      const { error: walletError } = await supabase
        .from('player_wallets')
        .upsert({
          user_id: userId,
          credits: store.credits,
          s_sol: accumulatedSol,
          s_xrp: accumulatedXrp,
          last_updated: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })

      if (walletError) throw walletError

      // Sync grid state
      for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
          const item = store.grid[y]?.[x]?.item
          if (item) {
            await supabase
              .from('grid_state')
              .upsert({
                user_id: userId,
                pos_x: x,
                pos_y: y,
                item_id: item.id,
                instance_id: item.instanceId
              }, {
                onConflict: 'user_id,pos_x,pos_y'
              })
          } else {
            // Clear empty cells
            await supabase
              .from('grid_state')
              .delete()
              .eq('user_id', userId)
              .eq('pos_x', x)
              .eq('pos_y', y)
          }
        }
      }

      setSyncStatus('synced')
      setLastSync(new Date())
      
      // Reset accumulated tracking after successful sync
      accumulatedSolRef.current = 0
      accumulatedXrpRef.current = 0
      lastSaveRef.current = Date.now()
      
      // Reset to idle after 2 seconds
      setTimeout(() => setSyncStatus('idle'), 2000)
      
    } catch (error) {
      console.error('Autosave failed:', error)
      setSyncStatus('error')
      setTimeout(() => setSyncStatus('idle'), 3000)
    }
  }

  // Periodic autosave
  useEffect(() => {
    if (!userId || isInitializedRef.current) return
    isInitializedRef.current = true

    const interval = setInterval(() => {
      syncToDatabase()
    }, SAVE_INTERVAL)

    return () => {
      clearInterval(interval)
      // Final sync on unmount
      syncToDatabase()
    }
  }, [userId])

  return { syncStatus, lastSync, syncNow: syncToDatabase }
}

// Load data from Supabase on login
export async function loadPlayerData(userId: string) {
  try {
    // Load wallet
    const { data: wallet, error: walletError } = await supabase
      .from('player_wallets')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (walletError && walletError.code !== 'PGRST116') throw walletError

    // Load grid state
    const { data: gridData, error: gridError } = await supabase
      .from('grid_state')
      .select('*')
      .eq('user_id', userId)

    if (gridError) throw gridError

    // Load inventory
    const { data: inventoryData, error: invError } = await supabase
      .from('inventory')
      .select('*')
      .eq('user_id', userId)

    if (invError) throw invError

    // Load profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (profileError && profileError.code !== 'PGRST116') throw profileError

    return {
      wallet: wallet || { credits: 1000, s_sol: 0, s_xrp: 0 },
      grid: gridData || [],
      inventory: inventoryData || [],
      profile: profile || null
    }
  } catch (error) {
    console.error('Failed to load player data:', error)
    return null
  }
}

// Calculate offline earnings
export function calculateOfflineEarnings(
  lastUpdated: string | null,
  hashrate: number,
  isOverloaded: boolean,
  isThrottling: boolean
): { sSol: number; sXrp: number } {
  if (!lastUpdated) return { sSol: 0, sXrp: 0 }
  
  const now = Date.now()
  const lastTime = new Date(lastUpdated).getTime()
  const secondsOffline = Math.min((now - lastTime) / 1000, 86400) // Max 24 hours
  
  if (secondsOffline < 10 || hashrate === 0 || isOverloaded) {
    return { sSol: 0, sXrp: 0 }
  }
  
  let efficiency = 1
  if (isThrottling) efficiency = 0.5
  
  const SOL_PER_TH = 0.001
  const XRP_PER_TH = 0.0001
  
  return {
    sSol: hashrate * SOL_PER_TH * secondsOffline * efficiency * OFFLINE_RATE_MULTIPLIER,
    sXrp: hashrate * XRP_PER_TH * secondsOffline * efficiency * OFFLINE_RATE_MULTIPLIER
  }
}
