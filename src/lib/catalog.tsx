import { Cpu, Snowflake, Zap } from 'lucide-react'
import type { GridItem } from '../types/game'

export interface StoreItem {
  id: string
  itemId: string
  name: string
  type: 'gpu' | 'cooler' | 'psu'
  hashrate: number
  consumption: number
  tempBase: number
  cooling: number
  price: number
  icon: React.ReactNode
  description: string
  stock: number // -1 = unlimited
}

export const storeCatalog: StoreItem[] = [
  {
    id: 'store-gpu-1',
    itemId: 'gpu-basic',
    name: 'GPU RTX 3060',
    type: 'gpu',
    hashrate: 1,
    consumption: 100,
    tempBase: 70,
    cooling: 0,
    price: 100,
    icon: <Cpu className="w-6 h-6" />,
    description: 'Mining básica - Ideal para empezar',
    stock: -1
  },
  {
    id: 'store-gpu-2',
    itemId: 'gpu-advanced',
    name: 'GPU RTX 4090',
    type: 'gpu',
    hashrate: 3,
    consumption: 200,
    tempBase: 80,
    cooling: 0,
    price: 300,
    icon: <Cpu className="w-6 h-6" />,
    description: 'Alto rendimiento - Mayor hash',
    stock: -1
  },
  {
    id: 'store-cooler-1',
    itemId: 'cooler-basic',
    name: 'Cooler Fan',
    type: 'cooler',
    hashrate: 0,
    consumption: 10,
    tempBase: 25,
    cooling: -10,
    price: 30,
    icon: <Snowflake className="w-6 h-6" />,
    description: 'Reduce temp de GPUs adyacentes -10°C',
    stock: -1
  },
  {
    id: 'store-cooler-2',
    itemId: 'cooler-advanced',
    name: 'Refrigeración Líquida',
    type: 'cooler',
    hashrate: 0,
    consumption: 25,
    tempBase: 20,
    cooling: -25,
    price: 150,
    icon: <Snowflake className="w-6 h-6" />,
    description: 'Reducción extrema -25°C',
    stock: -1
  },
  {
    id: 'store-psu-1',
    itemId: 'psu-500',
    name: 'PSU 500W',
    type: 'psu',
    hashrate: 0,
    consumption: 500,
    tempBase: 30,
    cooling: 0,
    price: 50,
    icon: <Zap className="w-6 h-6" />,
    description: 'Límite de energía +500W',
    stock: -1
  },
  {
    id: 'store-psu-2',
    itemId: 'psu-1000',
    name: 'PSU 1000W',
    type: 'psu',
    hashrate: 0,
    consumption: 1000,
    tempBase: 35,
    cooling: 0,
    price: 100,
    icon: <Zap className="w-6 h-6" />,
    description: 'Límite de energía +1000W',
    stock: -1
  }
]

// Convert store item to grid item
export function storeItemToGridItem(storeItem: StoreItem, instanceId: string): GridItem {
  return {
    instanceId,
    id: storeItem.itemId,
    name: storeItem.name,
    type: storeItem.type,
    hashrate: storeItem.hashrate,
    consumption: storeItem.consumption,
    tempBase: storeItem.tempBase,
    cooling: storeItem.cooling,
    price: storeItem.price,
    icon: storeItem.icon
  }
}
