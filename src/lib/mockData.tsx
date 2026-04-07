import { Cpu, Snowflake, Zap } from 'lucide-react'
import type { GridItem } from '../types/game'

export const mockCatalog: GridItem[] = [
  {
    instanceId: 'gpu-basic',
    id: 'gpu-basic',
    name: 'GPU RTX 3060',
    type: 'gpu',
    hashrate: 1,
    consumption: 100,
    tempBase: 70,
    cooling: 0,
    price: 100,
    icon: <Cpu className="w-6 h-6" />,
  },
  {
    instanceId: 'gpu-advanced',
    id: 'gpu-advanced',
    name: 'GPU RTX 4090',
    type: 'gpu',
    hashrate: 3,
    consumption: 200,
    tempBase: 80,
    cooling: 0,
    price: 300,
    icon: <Cpu className="w-6 h-6" />,
  },
  {
    instanceId: 'cooler-basic',
    id: 'cooler-basic',
    name: 'Cooler Fan',
    type: 'cooler',
    hashrate: 0,
    consumption: 10,
    tempBase: 25,
    cooling: -10,
    price: 30,
    icon: <Snowflake className="w-6 h-6" />,
  },
  {
    instanceId: 'cooler-advanced',
    id: 'cooler-advanced',
    name: 'Refrigeración Líquida',
    type: 'cooler',
    hashrate: 0,
    consumption: 25,
    tempBase: 20,
    cooling: -25,
    price: 150,
    icon: <Snowflake className="w-6 h-6" />,
  },
  {
    instanceId: 'psu-500',
    id: 'psu-500',
    name: 'PSU 500W',
    type: 'psu',
    hashrate: 0,
    consumption: 500,
    tempBase: 30,
    cooling: 0,
    price: 50,
    icon: <Zap className="w-6 h-6" />,
  },
  {
    instanceId: 'psu-1000',
    id: 'psu-1000',
    name: 'PSU 1000W',
    type: 'psu',
    hashrate: 0,
    consumption: 1000,
    tempBase: 35,
    cooling: 0,
    price: 100,
    icon: <Zap className="w-6 h-6" />,
  }
]

// Initial inventory for new players
export const getInitialInventory = (): GridItem[] => [
  { ...mockCatalog[0] },
  { ...mockCatalog[2] },
  { ...mockCatalog[4] },
]
