import type { ReactNode } from 'react'

export interface GridItem {
  instanceId: string
  id: string
  name: string
  type: 'gpu' | 'cooler' | 'psu'
  icon: ReactNode
  tempBase: number
  cooling: number
  hashrate: number
  consumption: number
  price: number
}

export interface GridCell {
  x: number
  y: number
  item: GridItem | null
}
