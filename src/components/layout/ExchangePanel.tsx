import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts'
import { TrendingUp, TrendingDown, X, DollarSign, ArrowDownRight, Bot } from 'lucide-react'
import { clsx } from 'clsx'
import { toast } from 'sonner'
import { useGameStore } from '../../store/useGameStore'
import { supabase } from '../../lib/supabase'
import { TradingBotPanel } from './TradingBotPanel'

interface ExchangePanelProps {
  isOpen: boolean
  onClose: () => void
  userId: string
}

export function ExchangePanel({ isOpen, onClose, userId }: ExchangePanelProps) {
  const { 
    sSol, sXrp, credits, 
    priceSOL, priceXRP, priceHistory,
    sellCrypto,
    setBotActive, setBotTargetPrice
  } = useGameStore()
  
  const [prevPrices, setPrevPrices] = useState({ sol: priceSOL, xrp: priceXRP })
  const [selling, setSelling] = useState<'sSol' | 'sXrp' | null>(null)

  useEffect(() => {
    setPrevPrices({ sol: priceSOL, xrp: priceXRP })
  }, [priceSOL, priceXRP])

  const solTrend = priceSOL >= prevPrices.sol ? 'up' : 'down'
  const xrpTrend = priceXRP >= prevPrices.xrp ? 'up' : 'down'

  const handleSell = async (currency: 'sSol' | 'sXrp') => {
    const amount = currency === 'sSol' ? sSol : sXrp
    const price = currency === 'sSol' ? priceSOL : priceXRP
    
    if (amount <= 0) {
      toast.error('No tienes monedas para vender')
      return
    }

    setSelling(currency)
    
    const earnings = amount * price
    const success = sellCrypto(amount, currency)
    
    if (success) {
      try {
        await supabase
          .from('player_wallets')
          .upsert({ 
            user_id: userId, 
            credits: credits + earnings,
            s_sol: currency === 'sSol' ? 0 : sSol,
            s_xrp: currency === 'sXrp' ? 0 : sXrp
          }, { onConflict: 'user_id' })
      } catch (error) {
        console.error('Sale save failed:', error)
      }
      
      toast.success(
        currency === 'sSol' 
          ? `¡${amount.toFixed(6)} $sSOL vendidos!` 
          : `¡${amount.toFixed(6)} $sXRP vendidos!`,
        { description: `Recibiste ${earnings.toFixed(2)} USDT` }
      )
    }
    
    setSelling(null)
  }

  const formatPrice = (price: number) => price.toFixed(4)

  const chartData = priceHistory.map((point, index) => ({
    time: index,
    priceSOL: point.priceSOL,
    priceXRP: point.priceXRP
  }))

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[700px] md:max-h-[85vh] bg-slate-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Crypto Exchange</h2>
                  <p className="text-xs text-slate-400">Mercado de criptomonedas</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Charts */}
              <div className="space-y-4">
                {/* SOL Chart */}
                <div className="glass-panel p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <span className="text-[8px] font-bold text-white">S</span>
                      </div>
                      <span className="text-sm font-mono text-white">$sSOL</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={clsx(
                        'text-lg font-bold font-mono',
                        solTrend === 'up' ? 'text-green-400' : 'text-red-400'
                      )}>
                        ${formatPrice(priceSOL)}
                      </span>
                      {solTrend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                  </div>
                  <div className="h-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorSOL" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <YAxis domain={['dataMin', 'dataMax']} hide />
                        <XAxis hide />
                        <Tooltip 
                          contentStyle={{ 
                            background: '#1e293b', 
                            border: '1px solid rgba(168, 85, 247, 0.3)',
                            borderRadius: '8px',
                            color: '#e5e5e5'
                          }}
                          labelStyle={{ display: 'none' }}
                          formatter={(value) => [`$${Number(value).toFixed(4)}`, 'Precio']}
                        />
                        <Area
                          type="monotone"
                          dataKey="priceSOL"
                          stroke="#a855f7"
                          strokeWidth={2}
                          fill="url(#colorSOL)"
                          isAnimationActive={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* XRP Chart */}
                <div className="glass-panel p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                        <span className="text-[8px] font-bold text-white">X</span>
                      </div>
                      <span className="text-sm font-mono text-white">$sXRP</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={clsx(
                        'text-lg font-bold font-mono',
                        xrpTrend === 'up' ? 'text-green-400' : 'text-red-400'
                      )}>
                        ${formatPrice(priceXRP)}
                      </span>
                      {xrpTrend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                  </div>
                  <div className="h-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorXRP" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <YAxis domain={['dataMin', 'dataMax']} hide />
                        <XAxis hide />
                        <Tooltip 
                          contentStyle={{ 
                            background: '#1e293b', 
                            border: '1px solid rgba(34, 211, 238, 0.3)',
                            borderRadius: '8px',
                            color: '#e5e5e5'
                          }}
                          labelStyle={{ display: 'none' }}
                          formatter={(value) => [`$${Number(value).toFixed(4)}`, 'Precio']}
                        />
                        <Area
                          type="monotone"
                          dataKey="priceXRP"
                          stroke="#22d3ee"
                          strokeWidth={2}
                          fill="url(#colorXRP)"
                          isAnimationActive={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Trading Bots Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Bot className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white font-mono">TRADING BOTS</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <TradingBotPanel
                    currency="sSOL"
                    currentPrice={priceSOL}
                    balance={sSol}
                    onActivate={(active) => setBotActive('sSOL', active)}
                    onTargetPriceChange={(price) => setBotTargetPrice('sSOL', price)}
                  />
                  <TradingBotPanel
                    currency="sXRP"
                    currentPrice={priceXRP}
                    balance={sXrp}
                    onActivate={(active) => setBotActive('sXRP', active)}
                    onTargetPriceChange={(price) => setBotTargetPrice('sXRP', price)}
                  />
                </div>
              </div>

              {/* Sell Panels */}
              <div className="grid grid-cols-2 gap-4">
                {/* Sell SOL */}
                <div className="glass-panel p-4 border border-purple-500/30">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <span className="text-[6px] font-bold text-white">S</span>
                      </div>
                      <span className="text-xs font-mono text-slate-400">$sSOL</span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="text-xs text-slate-400 mb-1">Balance</p>
                    <p className="text-xl font-bold font-mono text-purple-400">
                      {sSol.toFixed(6)}
                    </p>
                    <p className="text-xs text-slate-500">
                      ≈ {(sSol * priceSOL).toFixed(2)} USDT
                    </p>
                  </div>
                  <button
                    onClick={() => handleSell('sSol')}
                    disabled={selling !== null || sSol <= 0}
                    className={clsx(
                      'w-full py-2 rounded-lg font-mono text-sm flex items-center justify-center gap-2 transition-all',
                      sSol > 0 
                        ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/40' 
                        : 'bg-slate-800/50 text-slate-500 cursor-not-allowed'
                    )}
                  >
                    {selling === 'sSol' ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <ArrowDownRight className="w-4 h-4" />
                      </motion.div>
                    ) : (
                      'VENDER TODO'
                    )}
                  </button>
                </div>

                {/* Sell XRP */}
                <div className="glass-panel p-4 border border-cyan-500/30">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                        <span className="text-[6px] font-bold text-white">X</span>
                      </div>
                      <span className="text-xs font-mono text-slate-400">$sXRP</span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="text-xs text-slate-400 mb-1">Balance</p>
                    <p className="text-xl font-bold font-mono text-cyan-400">
                      {sXrp.toFixed(6)}
                    </p>
                    <p className="text-xs text-slate-500">
                      ≈ {(sXrp * priceXRP).toFixed(2)} USDT
                    </p>
                  </div>
                  <button
                    onClick={() => handleSell('sXrp')}
                    disabled={selling !== null || sXrp <= 0}
                    className={clsx(
                      'w-full py-2 rounded-lg font-mono text-sm flex items-center justify-center gap-2 transition-all',
                      sXrp > 0 
                        ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/40' 
                        : 'bg-slate-800/50 text-slate-500 cursor-not-allowed'
                    )}
                  >
                    {selling === 'sXrp' ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <ArrowDownRight className="w-4 h-4" />
                      </motion.div>
                    ) : (
                      'VENDER TODO'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
