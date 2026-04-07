import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bot, DollarSign } from 'lucide-react'
import { clsx } from 'clsx'
import { useGameStore } from '../../store/useGameStore'

interface TradingBotPanelProps {
  currency: 'sSOL' | 'sXRP'
  currentPrice: number
  balance: number
  onActivate: (active: boolean) => void
  onTargetPriceChange: (price: number) => void
}

export function TradingBotPanel({
  currency,
  currentPrice,
  balance,
  onActivate,
  onTargetPriceChange
}: TradingBotPanelProps) {
  const { bots } = useGameStore()
  const bot = currency === 'sSOL' ? bots.sSOL : bots.sXRP
  
  const [inputPrice, setInputPrice] = useState(bot.targetPrice.toString())

  const handlePriceChange = (value: string) => {
    setInputPrice(value)
    const numValue = parseFloat(value)
    if (!isNaN(numValue) && numValue >= 0) {
      onTargetPriceChange(numValue)
    }
  }

  const potentialEarnings = balance * bot.targetPrice
  const priceDistance = bot.targetPrice > 0 
    ? ((bot.targetPrice - currentPrice) / currentPrice * 100).toFixed(1)
    : '0'

  return (
    <div className={clsx(
      'p-4 rounded-xl border transition-all duration-300',
      bot.active 
        ? 'bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/40' 
        : 'bg-slate-900/50 border-slate-700/50'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={clsx(
            'w-8 h-8 rounded-lg flex items-center justify-center',
            bot.active ? 'bg-green-500/20' : 'bg-slate-800'
          )}>
            <Bot className={clsx(
              'w-4 h-4',
              bot.active ? 'text-green-400' : 'text-slate-400'
            )} />
          </div>
          <div>
            <p className="text-sm font-mono font-bold text-white">
              Bot {currency === 'sSOL' ? '$sSOL' : '$sXRP'}
            </p>
            <p className="text-xs text-slate-400">
              Grid Spot Trading
            </p>
          </div>
        </div>

        {/* Toggle */}
        <button
          onClick={() => onActivate(!bot.active)}
          className={clsx(
            'relative w-12 h-6 rounded-full transition-colors duration-300',
            bot.active ? 'bg-green-500' : 'bg-slate-700'
          )}
        >
          <motion.div
            animate={{ x: bot.active ? 24 : 2 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg"
          />
        </button>
      </div>

      {/* Status indicator */}
      {bot.active && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4"
        >
          <div className="flex items-center gap-2 text-xs text-green-400 font-mono">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [1, 0.5, 1]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-green-400"
            />
            MONITOREANDO MERCADO
          </div>
        </motion.div>
      )}

      {/* Target price input */}
      <div className="mb-4">
        <label className="block text-xs text-slate-400 font-mono mb-2">
          PRECIO OBJETIVO (USDT)
        </label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="number"
            value={inputPrice}
            onChange={(e) => handlePriceChange(e.target.value)}
            min="0"
            step="0.01"
            className={clsx(
              'w-full pl-9 pr-4 py-2 rounded-lg font-mono text-sm',
              'bg-slate-800 border transition-colors',
              'focus:outline-none',
              bot.active 
                ? 'border-green-500/50 focus:border-green-400' 
                : 'border-slate-600 focus:border-cyan-500'
            )}
            placeholder="0.00"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-2 text-xs font-mono">
        <div className="flex justify-between">
          <span className="text-slate-400">Precio actual:</span>
          <span className="text-white">${currentPrice.toFixed(4)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Balance:</span>
          <span className="text-white">{balance.toFixed(6)} {currency === 'sSOL' ? '$sSOL' : '$sXRP'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Ganancia potencial:</span>
          <span className="text-green-400">${potentialEarnings.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Distancia al objetivo:</span>
          <span className={bot.active && parseFloat(priceDistance) > 0 ? 'text-cyan-400' : 'text-slate-500'}>
            {parseFloat(priceDistance) > 0 ? '+' : ''}{priceDistance}%
          </span>
        </div>
      </div>
    </div>
  )
}
