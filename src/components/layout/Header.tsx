import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Coins, Zap, Cloud, CloudOff, RefreshCw, Check } from 'lucide-react'
import { clsx } from 'clsx'

interface AnimatedNumberProps {
  value: number
  decimals?: number
  prefix?: string
}

function AnimatedNumber({ value, decimals = 2, prefix = '' }: AnimatedNumberProps) {
  const motionValue = useMotionValue(value)
  const springValue = useSpring(motionValue, { stiffness: 100, damping: 30 })
  const displayValue = useTransform(springValue, (v) => 
    prefix + v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  )

  return <motion.span>{displayValue}</motion.span>
}

interface HeaderProps {
  credits?: number
  sSol?: number
  sXrp?: number
  syncStatus?: 'idle' | 'syncing' | 'synced' | 'error'
  lastSync?: Date | null
}

function SyncIndicator({ status }: { status: 'idle' | 'syncing' | 'synced' | 'error' }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={clsx(
        'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono',
        status === 'idle' && 'bg-slate-800/50 text-slate-400',
        status === 'syncing' && 'bg-cyan-500/20 text-cyan-400',
        status === 'synced' && 'bg-green-500/20 text-green-400',
        status === 'error' && 'bg-red-500/20 text-red-400'
      )}
    >
      {status === 'idle' && <Cloud className="w-3 h-3" />}
      {status === 'syncing' && <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <RefreshCw className="w-3 h-3" />
      </motion.div>}
      {status === 'synced' && <Check className="w-3 h-3" />}
      {status === 'error' && <CloudOff className="w-3 h-3" />}
      <span>
        {status === 'idle' && 'Sincronizado'}
        {status === 'syncing' && 'Guardando...'}
        {status === 'synced' && 'Guardado'}
        {status === 'error' && 'Error'}
      </span>
    </motion.div>
  )
}

export function Header({ credits = 1000, sSol = 0, sXrp = 0, syncStatus = 'idle' }: HeaderProps) {
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

      {/* Sync Indicator */}
      <SyncIndicator status={syncStatus} />

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
              $<AnimatedNumber value={credits} decimals={2} />
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
              <AnimatedNumber value={sSol} decimals={6} />
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
              <AnimatedNumber value={sXrp} decimals={6} />
            </p>
          </div>
        </motion.div>
      </div>
    </motion.header>
  )
}
