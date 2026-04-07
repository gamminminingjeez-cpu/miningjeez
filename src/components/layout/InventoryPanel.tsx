import { useState } from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import { Package, ShoppingBag } from 'lucide-react'
import { useDraggable } from '@dnd-kit/core'
import type { GridItem } from '../../types/game'
import { StoreTab } from './StoreTab'

function DraggableItem(item: GridItem) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.instanceId,
    data: item,
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      whileHover={{ scale: 1.05, zIndex: 20 }}
      whileTap={{ scale: 0.95 }}
      className={clsx(
        'relative p-3 rounded-lg cursor-grab active:cursor-grabbing',
        'bg-slate-900/80 border transition-all duration-200',
        isDragging
          ? 'border-cyan-400 shadow-glow-cyan opacity-50'
          : 'border-slate-700/50 hover:border-cyan-500/50',
        'select-none touch-none'
      )}
      layout
    >
      {/* Icon */}
      <div className={clsx(
        'w-10 h-10 rounded-lg flex items-center justify-center mb-2',
        item.type === 'gpu' && 'bg-gradient-to-br from-purple-600 to-pink-600',
        item.type === 'cooler' && 'bg-gradient-to-br from-cyan-600 to-blue-600',
        item.type === 'psu' && 'bg-gradient-to-br from-yellow-600 to-orange-600'
      )}>
        <div className="text-white">{item.icon}</div>
      </div>

      {/* Name */}
      <p className="text-xs font-mono text-white truncate mb-1">{item.name}</p>

      {/* Stats badges */}
      <div className="flex flex-wrap gap-1">
        {item.hashrate > 0 && (
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-mono">
            {item.hashrate} TH/s
          </span>
        )}
        {item.consumption > 0 && (
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 font-mono">
            {item.consumption}W
          </span>
        )}
        {item.cooling < 0 && (
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono">
            {item.cooling}°C
          </span>
        )}
      </div>

      {/* Type indicator */}
      <div className={clsx(
        'absolute top-2 right-2 text-[8px] px-1.5 py-0.5 rounded font-mono uppercase',
        item.type === 'gpu' && 'bg-purple-500/30 text-purple-300',
        item.type === 'cooler' && 'bg-cyan-500/30 text-cyan-300',
        item.type === 'psu' && 'bg-yellow-500/30 text-yellow-300'
      )}>
        {item.type}
      </div>
    </motion.div>
  )
}

interface InventoryPanelProps {
  items: GridItem[]
  credits: number
  onPurchase: (item: GridItem) => void
}

type Tab = 'inventory' | 'store'

export function InventoryPanel({ items, credits, onPurchase }: InventoryPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('inventory')

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-panel p-4"
    >
      {/* Tabs */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 relative bg-slate-900/50 rounded-lg p-1 flex">
          {/* Active tab indicator */}
          <motion.div
            layoutId="activeTab"
            className="absolute inset-y-1 rounded-md"
            style={{
              width: 'calc(50% - 4px)',
              left: activeTab === 'inventory' ? '4px' : undefined,
              right: activeTab === 'store' ? '4px' : undefined,
              background: 'rgba(34, 211, 238, 0.1)',
              border: '1px solid rgba(34, 211, 238, 0.3)'
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          />

          <button
            onClick={() => setActiveTab('inventory')}
            className={clsx(
              'flex-1 relative z-10 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-mono transition-colors',
              activeTab === 'inventory' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
            )}
          >
            <Package className="w-4 h-4" />
            MI INVENTARIO
            <span className="ml-1 text-xs opacity-60">({items.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('store')}
            className={clsx(
              'flex-1 relative z-10 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-mono transition-colors',
              activeTab === 'store' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
            )}
          >
            <ShoppingBag className="w-4 h-4" />
            TIENDA
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'inventory' ? (
        <div className="flex flex-wrap gap-3 justify-center max-h-48 overflow-y-auto">
          {items.map((item) => (
            <DraggableItem key={item.instanceId} {...item} />
          ))}

          {items.length === 0 && (
            <div className="text-center py-8 text-slate-500 font-mono text-sm w-full">
              Inventario vacío - Compra items en la tienda
            </div>
          )}
        </div>
      ) : (
        <StoreTab credits={credits} onPurchase={onPurchase} />
      )}
    </motion.div>
  )
}
