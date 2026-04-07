import { create } from 'zustand'
import type { GridItem, GridCell } from '../types/game'

interface GameState {
  // Grid state (5x5)
  grid: GridCell[][]
  
  // Inventory
  inventory: GridItem[]
  
  // Computed stats
  totalHashrate: number
  totalConsumption: number
  totalCooling: number
  energyLimit: number
  avgTemperature: number
  
  // Actions
  setInventory: (items: GridItem[]) => void
  placeItem: (instanceId: string, x: number, y: number) => void
  removeItem: (x: number, y: number) => void
  calculateStats: () => void
}

const GRID_SIZE = 5

const createEmptyGrid = (): GridCell[][] =>
  Array(GRID_SIZE).fill(null).map((_, y) =>
    Array(GRID_SIZE).fill(null).map((_, x) => ({ x, y, item: null }))
  )

export const useGameStore = create<GameState>((set, get) => ({
  grid: createEmptyGrid(),
  inventory: [],
  totalHashrate: 0,
  totalConsumption: 0,
  totalCooling: 0,
  energyLimit: 500,
  avgTemperature: 25,

  setInventory: (items) => set({ inventory: items }),

  placeItem: (instanceId, x, y) => {
    const { inventory, grid } = get()
    
    // Find item in inventory
    const itemIndex = inventory.findIndex(item => item.instanceId === instanceId)
    if (itemIndex === -1) return
    
    // Check if cell is empty
    if (grid[y][x].item) return
    
    const item = inventory[itemIndex]
    
    // Remove from inventory
    const newInventory = inventory.filter((_, i) => i !== itemIndex)
    
    // Place on grid
    const newGrid = grid.map(row => [...row])
    newGrid[y][x] = { x, y, item }
    
    set({ inventory: newInventory, grid: newGrid })
    get().calculateStats()
  },

  removeItem: (x, y) => {
    const { grid, inventory } = get()
    const cell = grid[y][x]
    if (!cell.item) return
    
    // Add back to inventory
    const newInventory = [...inventory, cell.item]
    
    // Clear grid cell
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
    
    // Calculate base stats from grid items
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const item = grid[y][x].item
        if (!item) continue
        
        if (item.type === 'psu') {
          energyLimit += item.consumption // PSU consumption is actually its capacity
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
    
    // Apply synergies (simpler: just total cooling affects temp)
    // For every cooler adjacent to a GPU, we get extra cooling bonus
    // But we'll simplify: totalCooling is the sum of all cooler cooling
    
    // Calculate average temperature
    let avgTemp = 25
    if (gpuCount > 0) {
      avgTemp = (gpuTotalTemp / gpuCount) - totalCooling
    }
    
    // Clamp temperature
    avgTemp = Math.max(25, Math.min(100, avgTemp))
    
    // Energy limit defaults to 500 if no PSU
    if (energyLimit === 0) energyLimit = 500
    
    set({
      totalHashrate,
      totalConsumption,
      totalCooling,
      energyLimit,
      avgTemperature: avgTemp
    })
  }
}))
