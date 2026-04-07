import { motion } from 'framer-motion'
import { Coins, Zap } from 'lucide-react'

interface HeaderProps {
  credits?: number
  sSol?: number
  sXrp?: number
}

export function Header({ credits = 1000, sSol = 0, sXrp = 0 }: HeaderProps) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="glass-panel px-6 py-4 flex items-center justify-between"
    >
      {/* Logo / Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Grid Node Tycoon</h1>
          <p className="text-xs text-slate-400">Mining Simulator v1.0</p>
        </div>
      </div>

      {/* Wallet Stats */}
      <div className="flex items-center gap-6">
        {/* Credits */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyber-bg/50 border border-yellow-500/30"
        >
          <Coins className="w-5 h-5 text-yellow-400" />
          <div className="text-right">
            <p className="text-xs text-slate-400 font-mono">CRÉDITOS</p>
            <p className="text-sm font-bold text-yellow-400 font-mono">
              {credits.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </motion.div>

        {/* $sSOL */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyber-bg/50 border border-purple-500/30"
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-[8px] font-bold text-white">S</span>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 font-mono">$sSOL</p>
            <p className="text-sm font-bold text-purple-400 font-mono">
              {sSol.toFixed(6)}
            </p>
          </div>
        </motion.div>

        {/* $sXRP */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyber-bg/50 border border-cyan-500/30"
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
            <span className="text-[8px] font-bold text-white">X</span>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 font-mono">$sXRP</p>
            <p className="text-sm font-bold text-cyan-400 font-mono">
              {sXrp.toFixed(6)}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.header>
  )
}
