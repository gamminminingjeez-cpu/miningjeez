import { useState } from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

interface CellProps {
  x: number
  y: number
  item?: { id: string; name: string; type: string }
  onHover?: (x: number, y: number) => void
}

function Cell({ x, y, item, onHover }: CellProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      whileHover={{ scale: 1.08, zIndex: 10 }}
      onHoverStart={() => {
        setIsHovered(true)
        onHover?.(x, y)
      }}
      onHoverEnd={() => setIsHovered(false)}
      className={clsx(
        'w-full aspect-square rounded-lg border transition-all duration-200',
        'flex items-center justify-center cursor-pointer',
        item
          ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-cyan-500/50 shadow-glow-cyan'
          : 'bg-slate-900/80 border-slate-700/50',
        isHovered && !item && 'border-cyan-400/80 shadow-glow-cyan bg-slate-800/80'
      )}
    >
      {item && (
        <div className="text-center">
          <div className="text-2xl mb-1">
            {item.type === 'gpu' && '🖥️'}
            {item.type === 'cooler' && '❄️'}
            {item.type === 'psu' && '⚡'}
          </div>
          <p className="text-[10px] font-mono text-cyan-400 truncate w-full px-1">
            {item.name}
          </p>
        </div>
      )}
      {!item && (
        <span className={clsx(
          'text-xs font-mono transition-colors',
          isHovered ? 'text-cyan-400/60' : 'text-slate-600'
        )}>
          {x},{y}
        </span>
      )}
    </motion.div>
  )
}

interface GridBoardProps {
  gridSize?: number
  gridState?: Array<Array<{ id: string; name: string; type: string } | null>>
  onCellHover?: (x: number, y: number) => void
}

export function GridBoard({ gridSize = 5, gridState, onCellHover }: GridBoardProps) {
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
              item={cell || undefined}
              onHover={onCellHover}
            />
          ))
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>🖥️ GPU</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>❄️ COOLER</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>⚡ PSU</span>
        </div>
      </div>
    </motion.div>
  )
}
