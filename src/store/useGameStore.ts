import { create } from 'zustand'
import type { GridItem, GridCell } from '../types/game'

interface PricePoint {
  time: number
  priceSOL: number
  priceXRP: number
}

interface TradingBot {
  active: boolean
  targetPrice: number
}

interface GameState {
  // Grid state (dynamic size)
  gridSize: number
  grid: GridCell[][]
  
  // Inventory
  inventory: GridItem[]
  
  // Wallet
  credits: number
  sSol: number
  sXrp: number
  
  // Market prices
  priceSOL: number
  priceXRP: number
  priceHistory: PricePoint[]
  
  // Trading bots
  bots: {
    sSOL: TradingBot
    sXRP: TradingBot
  }
  
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
  setGridSize: (size: number) => void
  setInventory: (items: GridItem[]) => void
  setCredits: (credits: number) => void
  setGrid: (grid: GridCell[][]) => void
  placeItem: (instanceId: string, x: number, y: number) => void
  removeItem: (x: number, y: number) => void
  calculateStats: () => void
  addCrypto: (sSol: number, sXrp: number) => void
  sellCrypto: (amount: number, currency: 'sSol' | 'sXrp') => boolean
  updateMarketPrices: (sol: number, xrp: number) => void
  setBotActive: (currency: 'sSOL' | 'sXRP', active: boolean) => void
  setBotTargetPrice: (currency: 'sSOL' | 'sXRP', price: number) => void
  expandGrid: () => boolean
  resetGame: () => void
}

const DEFAULT_GRID_SIZE = 5
const MAX_GRID_SIZE = 10
const SYNERGY_COOLING_PER_ADJACENT_COOLER = 15
const MAX_PRICE_HISTORY = 20

const createGrid = (size: number): GridCell[][] =>
  Array(size).fill(null).map((_, y) =>
    Array(size).fill(null).map((_, x) => ({ x, y, item: null }))
  )

const getAdjacentPositions = (x: number, y: number, gridSize: number): [number, number][] => {
  const adjacent: [number, number][] = []
  if (x > 0) adjacent.push([x - 1, y])
  if (x < gridSize - 1) adjacent.push([x + 1, y])
  if (y > 0) adjacent.push([x, y - 1])
  if (y < gridSize - 1) adjacent.push([x, y + 1])
  return adjacent
}

export const useGameStore = create<GameState>((set, get) => ({
  gridSize: DEFAULT_GRID_SIZE,
  grid: createGrid(DEFAULT_GRID_SIZE),
  inventory: [],
  credits: 1000,
  sSol: 0,
  sXrp: 0,
  
  // Market starting prices
  priceSOL: 0.50,
  priceXRP: 2.00,
  priceHistory: [{ time: Date.now(), priceSOL: 0.50, priceXRP: 2.00 }],
  
  // Trading bots
  bots: {
    sSOL: { active: false, targetPrice: 0.60 },
    sXRP: { active: false, targetPrice: 2.50 }
  },
  
  totalHashrate: 0,
  totalConsumption: 0,
  totalCooling: 0,
  energyLimit: 500,
  avgTemperature: 25,
  isOverloaded: false,
  isThrottling: false,

  setGridSize: (size) => set({ gridSize: size }),

  setInventory: (items) => set({ inventory: items }),

  setCredits: (credits) => set({ credits }),

  setGrid: (grid) => set({ grid }),

  placeItem: (instanceId, x, y) => {
    const { inventory, grid, gridSize } = get()
    
    // Bounds check
    if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) return
    
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
    const { grid, inventory, gridSize } = get()
    
    // Bounds check
    if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) return
    
    const cell = grid[y][x]
    if (!cell.item) return
    
    const newInventory = [...inventory, cell.item]
    const newGrid = grid.map(row => [...row])
    newGrid[y][x] = { x, y, item: null }
    
    set({ inventory: newInventory, grid: newGrid })
    get().calculateStats()
  },

  calculateStats: () => {
    const { grid, gridSize } = get()
    
    let totalHashrate = 0
    let totalConsumption = 0
    let totalCooling = 0
    let energyLimit = 0
    let gpuCount = 0
    let gpuTotalTemp = 0
    
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const item = grid[y]?.[x]?.item
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
          }
        }
      }
    }
    
    let adjacencyBonus = 0
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const item = grid[y]?.[x]?.item
        if (!item || item.type !== 'gpu') continue
        
        const adjacentPositions = getAdjacentPositions(x, y, gridSize)
        let coolerCount = 0
        
        for (const [ax, ay] of adjacentPositions) {
          const adjacentItem = grid[ay]?.[ax]?.item
          if (adjacentItem?.type === 'cooler') {
            coolerCount++
          }
        }
        
        adjacencyBonus += coolerCount * SYNERGY_COOLING_PER_ADJACENT_COOLER
      }
    }
    
    let avgTemp = 25
    if (gpuCount > 0) {
      avgTemp = (gpuTotalTemp / gpuCount) - totalCooling - (adjacencyBonus / gpuCount)
    }
    
    avgTemp = Math.max(25, Math.min(100, avgTemp))
    
    if (energyLimit === 0) energyLimit = 500
    
    const isOverloaded = totalConsumption > energyLimit
    const isThrottling = avgTemp >= 90
    
    let effectiveHashrate = totalHashrate
    if (isOverloaded) {
      effectiveHashrate = 0
    } else if (isThrottling) {
      effectiveHashrate = totalHashrate * 0.5
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
    const { sSol, sXrp, credits, priceSOL, priceXRP } = get()
    
    if (currency === 'sSol' && sSol >= amount) {
      const earnings = amount * priceSOL
      set({ sSol: sSol - amount, credits: credits + earnings })
      return true
    }
    if (currency === 'sXrp' && sXrp >= amount) {
      const earnings = amount * priceXRP
      set({ sXrp: sXrp - amount, credits: credits + earnings })
      return true
    }
    return false
  },

  updateMarketPrices: (sol, xrp) => {
    const { priceHistory } = get()
    const newPoint = { time: Date.now(), priceSOL: sol, priceXRP: xrp }
    const newHistory = [...priceHistory, newPoint].slice(-MAX_PRICE_HISTORY)
    set({ priceSOL: sol, priceXRP: xrp, priceHistory: newHistory })
  },

  setBotActive: (currency, active) => {
    const { bots } = get()
    if (currency === 'sSOL') {
      set({ bots: { ...bots, sSOL: { ...bots.sSOL, active } } })
    } else {
      set({ bots: { ...bots, sXRP: { ...bots.sXRP, active } } })
    }
  },

  setBotTargetPrice: (currency, price) => {
    const { bots } = get()
    if (price < 0) return
    if (currency === 'sSOL') {
      set({ bots: { ...bots, sSOL: { ...bots.sSOL, targetPrice: price } } })
    } else {
      set({ bots: { ...bots, sXRP: { ...bots.sXRP, targetPrice: price } } })
    }
  },

  expandGrid: () => {
    const { gridSize, credits } = get()
    
    if (gridSize >= MAX_GRID_SIZE) return false
    
    // Exponential cost: gridSize * 10000
    const cost = (gridSize + 1) * 10000
    
    if (credits < cost) return false
    
    const newSize = gridSize + 1
    const newGrid = createGrid(newSize)
    
    set({
      gridSize: newSize,
      grid: newGrid,
      credits: credits - cost
    })
    
    return true
  },

  resetGame: () => {
    set({
      gridSize: DEFAULT_GRID_SIZE,
      grid: createGrid(DEFAULT_GRID_SIZE),
      inventory: [],
      credits: 1000,
      sSol: 0,
      sXrp: 0,
      priceSOL: 0.50,
      priceXRP: 2.00,
      priceHistory: [{ time: Date.now(), priceSOL: 0.50, priceXRP: 2.00 }],
      bots: {
        sSOL: { active: false, targetPrice: 0.60 },
        sXRP: { active: false, targetPrice: 2.50 }
      },
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
