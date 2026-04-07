import { create } from 'zustand'
import type { GridItem, GridCell } from '../types/game'

interface GameState {
  // Grid state (5x5)
  grid: GridCell[][]
  
  // Inventory
  inventory: GridItem[]
  
  // Wallet
  credits: number
  sSol: number
  sXrp: number
  
  // Computed stats
  totalHashrate: number
  totalConsumption: number
  totalCooling: number
  energyLimit: number
  avgTemperature: number
  
  // Status flags
  isOverloaded: boolean
  isThrottling: boolean
  
  // Actions
  setInventory: (items: GridItem[]) => void
  setCredits: (credits: number) => void
  placeItem: (instanceId: string, x: number, y: number) => void
  removeItem: (x: number, y: number) => void
  calculateStats: () => void
  addCrypto: (sSol: number, sXrp: number) => void
  sellCrypto: (amount: number, currency: 'sSol' | 'sXrp') => boolean
  resetGame: () => void
}

const GRID_SIZE = 5
const SYNERGY_COOLING_PER_ADJACENT_COOLER = 15 // °C reduction per adjacent cooler

const createEmptyGrid = (): GridCell[][] =>
  Array(GRID_SIZE).fill(null).map((_, y) =>
    Array(GRID_SIZE).fill(null).map((_, x) => ({ x, y, item: null }))
  )

const getAdjacentPositions = (x: number, y: number): [number, number][] => {
  const adjacent: [number, number][] = []
  if (x > 0) adjacent.push([x - 1, y])
  if (x < GRID_SIZE - 1) adjacent.push([x + 1, y])
  if (y > 0) adjacent.push([x, y - 1])
  if (y < GRID_SIZE - 1) adjacent.push([x, y + 1])
  return adjacent
}

export const useGameStore = create<GameState>((set, get) => ({
  grid: createEmptyGrid(),
  inventory: [],
  credits: 1000,
  sSol: 0,
  sXrp: 0,
  totalHashrate: 0,
  totalConsumption: 0,
  totalCooling: 0,
  energyLimit: 500,
  avgTemperature: 25,
  isOverloaded: false,
  isThrottling: false,

  setInventory: (items) => set({ inventory: items }),

  setCredits: (credits) => set({ credits }),

  placeItem: (instanceId, x, y) => {
    const { inventory, grid } = get()
    
    const itemIndex = inventory.findIndex(item => item.instanceId === instanceId)
    if (itemIndex === -1) return
    
    if (grid[y][x].item) return
    
    const item = inventory[itemIndex]
    const newInventory = inventory.filter((_, i) => i !== itemIndex)
    const newGrid = grid.map(row => [...row])
    newGrid[y][x] = { x, y, item }
    
    set({ inventory: newInventory, grid: newGrid })
    get().calculateStats()
  },

  removeItem: (x, y) => {
    const { grid, inventory } = get()
    const cell = grid[y][x]
    if (!cell.item) return
    
    const newInventory = [...inventory, cell.item]
    const newGrid = grid.map(row => [...row])
    newGrid[y][x] = { x, y, item: null }
    
    set({ inventory: newInventory, grid: newGrid })
    get().calculateStats()
  },

  calculateStats: () => {
    const { grid } = get()
    
    let totalHashrate = 0
    let totalConsumption = 0
    let totalCooling = 0
    let energyLimit = 0
    let gpuCount = 0
    let gpuTotalTemp = 0
    const gpuTemps: number[] = []
    
    // First pass: collect PSU capacity and base stats
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const item = grid[y][x].item
        if (!item) continue
        
        if (item.type === 'psu') {
          energyLimit += item.consumption
        } else {
          totalConsumption += item.consumption
          if (item.type === 'cooler') {
            totalCooling += Math.abs(item.cooling)
          }
          if (item.type === 'gpu') {
            totalHashrate += item.hashrate
            gpuTotalTemp += item.tempBase
            gpuCount++
            gpuTemps.push(item.tempBase)
          }
        }
      }
    }
    
    // Second pass: calculate adjacency synergies for each GPU
    let adjacencyBonus = 0
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const item = grid[y][x].item
        if (!item || item.type !== 'gpu') continue
        
        const adjacentPositions = getAdjacentPositions(x, y)
        let coolerCount = 0
        
        for (const [ax, ay] of adjacentPositions) {
          const adjacentItem = grid[ay][ax].item
          if (adjacentItem?.type === 'cooler') {
            coolerCount++
          }
        }
        
        // Each adjacent cooler gives synergy bonus
        adjacencyBonus += coolerCount * SYNERGY_COOLING_PER_ADJACENT_COOLER
      }
    }
    
    // Calculate final temperature with synergy bonus
    let avgTemp = 25
    if (gpuCount > 0) {
      avgTemp = (gpuTotalTemp / gpuCount) - totalCooling - (adjacencyBonus / gpuCount)
    }
    
    // Clamp temperature
    avgTemp = Math.max(25, Math.min(100, avgTemp))
    
    // Default energy limit
    if (energyLimit === 0) energyLimit = 500
    
    // Check overload (consumption > limit)
    const isOverloaded = totalConsumption > energyLimit
    
    // Check thermal throttling (temp >= 90)
    const isThrottling = avgTemp >= 90
    
    // Apply multipliers
    let effectiveHashrate = totalHashrate
    if (isOverloaded) {
      effectiveHashrate = 0 // blackout!
    } else if (isThrottling) {
      effectiveHashrate = totalHashrate * 0.5 // 50% efficiency
    }
    
    set({
      totalHashrate: effectiveHashrate,
      totalConsumption,
      totalCooling,
      energyLimit,
      avgTemperature: avgTemp,
      isOverloaded,
      isThrottling
    })
  },

  addCrypto: (sSol, sXrp) => {
    const { sSol: currentSol, sXrp: currentXrp } = get()
    set({
      sSol: currentSol + sSol,
      sXrp: currentXrp + sXrp
    })
  },

  sellCrypto: (amount, currency) => {
    const { sSol, sXrp, credits } = get()
    
    if (currency === 'sSol' && sSol >= amount) {
      // Price: 1 sSol = 0.50 USDT
      const earnings = amount * 0.50
      set({ sSol: sSol - amount, credits: credits + earnings })
      return true
    }
    if (currency === 'sXrp' && sXrp >= amount) {
      // Price: 1 sXrp = 2.00 USDT
      const earnings = amount * 2.00
      set({ sXrp: sXrp - amount, credits: credits + earnings })
      return true
    }
    return false
  },

  resetGame: () => {
    set({
      grid: createEmptyGrid(),
      inventory: [],
      credits: 1000,
      sSol: 0,
      sXrp: 0,
      totalHashrate: 0,
      totalConsumption: 0,
      totalCooling: 0,
      energyLimit: 500,
      avgTemperature: 25,
      isOverloaded: false,
      isThrottling: false
    })
  }
}))
