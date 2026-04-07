import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Gift, X } from 'lucide-react'
import { useGameStore } from '../../store/useGameStore'

interface OfflineEarningsModalProps {
  isOpen: boolean
  onClose: () => void
  earnings: {
    sSol: number
    sXrp: number
    secondsOffline: number
  }
}

function AnimatedCounter({ value, decimals = 6 }: { value: number; decimals?: number }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const duration = 1500 // 1.5 seconds
    const steps = 30
    const stepDuration = duration / steps
    const increment = value / steps
    let current = 0
    let step = 0

    const timer = setInterval(() => {
      step++
      current = Math.min(value, increment * step)
      setDisplayValue(current)
      
      if (step >= steps) {
        clearInterval(timer)
        setDisplayValue(value)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [value])

  return <span>{displayValue.toFixed(decimals)}</span>
}

export function OfflineEarningsModal({ isOpen, onClose, earnings }: OfflineEarningsModalProps) {
  const { addCrypto, priceSOL, priceXRP } = useGameStore()
  
  const totalValueSOL = earnings.sSol * priceSOL
  const totalValueXRP = earnings.sXrp * priceXRP
  const totalValue = totalValueSOL + totalValueXRP

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${Math.floor(seconds)} segundos`
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutos`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} horas`
    return `${Math.floor(seconds / 86400)} días`
  }

  const handleClaim = () => {
    // Add the crypto to the wallet
    addCrypto(earnings.sSol, earnings.sXrp)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/30 rounded-2xl overflow-hidden"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent pointer-events-none" />
              
              {/* Header */}
              <div className="relative pt-8 pb-4 px-6 text-center border-b border-slate-800/50">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/30"
                >
                  <Gift className="w-8 h-8 text-white" />
                </motion.div>
                
                <h2 className="text-2xl font-bold text-white mt-4 mb-1">
                  ¡Tu granja siguió trabajando!
                </h2>
                <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Minaste durante {formatTime(earnings.secondsOffline)}</span>
                </div>
              </div>

              {/* Content */}
              <div className="relative p-6 space-y-4">
                {/* Earnings */}
                <div className="grid grid-cols-2 gap-4">
                  {/* SOL */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="p-4 rounded-xl bg-gradient-to-br from-purple-900/30 to-purple-950/50 border border-purple-500/30"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <span className="text-[8px] font-bold text-white">S</span>
                      </div>
                      <span className="text-xs text-purple-300 font-mono">$sSOL</span>
                    </div>
                    <p className="text-xl font-bold font-mono text-purple-400">
                      +<AnimatedCounter value={earnings.sSol} decimals={6} />
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      ≈ ${totalValueSOL.toFixed(2)} USDT
                    </p>
                  </motion.div>

                  {/* XRP */}
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="p-4 rounded-xl bg-gradient-to-br from-cyan-900/30 to-cyan-950/50 border border-cyan-500/30"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                        <span className="text-[8px] font-bold text-white">X</span>
                      </div>
                      <span className="text-xs text-cyan-300 font-mono">$sXRP</span>
                    </div>
                    <p className="text-xl font-bold font-mono text-cyan-400">
                      +<AnimatedCounter value={earnings.sXrp} decimals={6} />
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      ≈ ${totalValueXRP.toFixed(2)} USDT
                    </p>
                  </motion.div>
                </div>

                {/* Total */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="p-4 rounded-xl bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/30 text-center"
                >
                  <p className="text-xs text-yellow-300/70 font-mono mb-1">VALOR TOTAL ESTIMADO</p>
                  <p className="text-2xl font-bold font-mono text-yellow-400">
                    ≈ ${totalValue.toFixed(2)} USDT
                  </p>
                </motion.div>

                {/* Claim button */}
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClaim}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-bold font-mono text-lg shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-shadow"
                >
                  RECLAMAR GANANCIAS
                </motion.button>

                {/* Note */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-xs text-slate-500 text-center"
                >
                  Nota: Las ganancias offline se calculan al 50% de eficiencia
                </motion.p>
              </div>

              {/* Close button */}
              <button
                onClick={handleClaim}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
