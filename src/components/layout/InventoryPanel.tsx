import { useDraggable } from '@dnd-kit/core'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import type { GridItem } from '../../types/game'

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
}

export function InventoryPanel({ items }: InventoryPanelProps) {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-panel p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-purple-500" />
          INVENTARIO
        </h2>
        <span className="text-xs text-slate-400 font-mono">{items.length} items</span>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        {items.map((item) => (
          <DraggableItem key={item.instanceId} {...item} />
        ))}

        {items.length === 0 && (
          <div className="text-center py-8 text-slate-500 font-mono text-sm">
            Inventario vacío - Compra items en la tienda
          </div>
        )}
      </div>
    </motion.div>
  )
}
