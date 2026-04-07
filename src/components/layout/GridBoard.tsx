import { useDroppable } from '@dnd-kit/core'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import { Cpu, Snowflake, Zap } from 'lucide-react'
import type { GridItem } from '../../types/game'

interface CellProps {
  x: number
  y: number
  item: GridItem | null
}

function Cell({ x, y, item }: CellProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `${x}-${y}`,
    data: { x, y },
  })

  const renderIcon = (type: string) => {
    switch (type) {
      case 'gpu':
        return <Cpu className="w-6 h-6" />
      case 'cooler':
        return <Snowflake className="w-6 h-6" />
      case 'psu':
        return <Zap className="w-6 h-6" />
      default:
        return null
    }
  }

  return (
    <motion.div
      ref={setNodeRef}
      whileHover={{ scale: item ? 1 : 1.05 }}
      className={clsx(
        'w-full aspect-square rounded-lg border transition-all duration-200',
        'flex items-center justify-center relative',
        !item && 'bg-slate-900/80 border-slate-700/50 cursor-pointer',
        item && 'bg-gradient-to-br from-slate-800 to-slate-900 border-cyan-500/50',
        isOver && !item && 'border-cyan-400 shadow-glow-cyan bg-slate-800/90 scale-105'
      )}
    >
      {item ? (
        <div className="text-center">
          <div className={clsx(
            'w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-1',
            item.type === 'gpu' && 'bg-gradient-to-br from-purple-600 to-pink-600',
            item.type === 'cooler' && 'bg-gradient-to-br from-cyan-600 to-blue-600',
            item.type === 'psu' && 'bg-gradient-to-br from-yellow-600 to-orange-600'
          )}>
            <div className="text-white">{renderIcon(item.type)}</div>
          </div>
          <p className="text-[9px] font-mono text-cyan-400 truncate w-full px-1">
            {item.name}
          </p>
        </div>
      ) : (
        <span className={clsx(
          'text-[10px] font-mono transition-colors',
          isOver ? 'text-cyan-400' : 'text-slate-600'
        )}>
          {x},{y}
        </span>
      )}

      {/* Drop indicator */}
      {isOver && !item && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 border-2 border-dashed border-cyan-400 rounded-lg flex items-center justify-center"
        >
          <span className="text-cyan-400 text-xs font-mono">DROP</span>
        </motion.div>
      )}
    </motion.div>
  )
}

interface GridBoardProps {
  gridSize?: number
  gridState?: (GridItem | null)[][]
}

export function GridBoard({ gridSize = 5, gridState }: GridBoardProps) {
  // Initialize empty grid if not provided
  const displayGrid = gridState || Array(gridSize).fill(null).map(() => Array(gridSize).fill(null))

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-panel p-6"
    >
      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
          THE GRID
        </h2>
        <span className="text-xs text-slate-400 font-mono">{gridSize}x{gridSize} SLOTS</span>
      </div>

      {/* Grid */}
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
      >
        {displayGrid.map((row, y) =>
          row.map((cell, x) => (
            <Cell
              key={`${x}-${y}`}
              x={x}
              y={y}
              item={cell || null}
            />
          ))
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Cpu className="w-4 h-4 text-purple-400" />
          <span>GPU</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Snowflake className="w-4 h-4 text-cyan-400" />
          <span>COOLER</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span>PSU</span>
        </div>
      </div>
    </motion.div>
  )
}
