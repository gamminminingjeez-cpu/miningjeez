import { useDroppable } from '@dnd-kit/core'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import { Cpu, Snowflake, Zap, AlertTriangle } from 'lucide-react'
import type { GridItem } from '../../types/game'

interface CellProps {
  x: number
  y: number
  item: GridItem | null
  isOverheating?: boolean
}

function Cell({ x, y, item, isOverheating = false }: CellProps) {
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
        item && !isOverheating && 'bg-gradient-to-br from-slate-800 to-slate-900 border-cyan-500/50',
        item && isOverheating && 'bg-gradient-to-br from-slate-900 to-red-950/50 border-red-500/70',
        isOver && !item && 'border-cyan-400 shadow-glow-cyan bg-slate-800/90 scale-105'
      )}
      animate={
        isOverheating && item?.type === 'gpu'
          ? {
              boxShadow: [
                '0 0 15px rgba(239, 68, 68, 0.4)',
                '0 0 25px rgba(239, 68, 68, 0.8)',
                '0 0 15px rgba(239, 68, 68, 0.4)',
              ],
            }
          : {}
      }
      transition={
        isOverheating
          ? { duration: 1, repeat: Infinity, ease: 'easeInOut' }
          : { duration: 0.2 }
      }
    >
      {item ? (
        <div className="text-center">
          <div className={clsx(
            'w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-1 relative',
            item.type === 'gpu' && !isOverheating && 'bg-gradient-to-br from-purple-600 to-pink-600',
            item.type === 'gpu' && isOverheating && 'bg-gradient-to-br from-red-600 to-orange-600',
            item.type === 'cooler' && 'bg-gradient-to-br from-cyan-600 to-blue-600',
            item.type === 'psu' && 'bg-gradient-to-br from-yellow-600 to-orange-600'
          )}>
            <div className="text-white">{renderIcon(item.type)}</div>
            {isOverheating && item.type === 'gpu' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
              >
                <AlertTriangle className="w-3 h-3 text-white" />
              </motion.div>
            )}
          </div>
          <p className={clsx(
            'text-[9px] font-mono truncate w-full px-1',
            isOverheating ? 'text-red-400' : 'text-cyan-400'
          )}>
            {item.name}
          </p>
          {isOverheating && item.type === 'gpu' && (
            <p className="text-[8px] font-mono text-red-500 mt-0.5">HOT!</p>
          )}
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
  gridSize: number
  gridState?: (GridItem | null)[][]
  isOverheating?: boolean
  onExpandClick?: () => void
  expandCost?: number
  canExpand?: boolean
}

export function GridBoard({ 
  gridSize, 
  gridState, 
  isOverheating = false,
  onExpandClick,
  expandCost,
  canExpand = false
}: GridBoardProps) {
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
          <span className={clsx(
            'w-3 h-3 rounded-full',
            isOverheating ? 'bg-red-500 animate-pulse' : 'bg-cyan-400 animate-pulse'
          )} />
          THE GRID
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-mono">{gridSize}x{gridSize} SLOTS</span>
          {expandCost !== undefined && onExpandClick && (
            <button
              onClick={onExpandClick}
              disabled={!canExpand}
              className={clsx(
                'px-3 py-1 rounded-lg text-xs font-mono transition-all',
                canExpand
                  ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/40 border border-cyan-500/50'
                  : 'bg-slate-800/50 text-slate-500 border border-slate-700/50 cursor-not-allowed'
              )}
            >
              EXPANDIR ({expandCost.toLocaleString()} USDT)
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
      >
        {displayGrid.map((row, y) =>
          row.map((cell, x) => (
            <Cell
              key={`${x}-${y}`}
              x={x}
              y={y}
              item={cell || null}
              isOverheating={isOverheating}
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
