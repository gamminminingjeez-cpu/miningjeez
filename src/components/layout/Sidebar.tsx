import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Cpu, Zap, Thermometer, Activity, AlertTriangle } from 'lucide-react'

interface AnimatedNumberProps {
  value: number
  decimals?: number
  suffix?: string
}

function AnimatedNumber({ value, decimals = 2, suffix = '' }: AnimatedNumberProps) {
  const motionValue = useMotionValue(value)
  const springValue = useSpring(motionValue, { stiffness: 100, damping: 30 })
  const displayValue = useTransform(springValue, (v) => 
    v.toFixed(decimals) + suffix
  )

  return <motion.span>{displayValue}</motion.span>
}

interface StatItemProps {
  label: string
  value: number
  max?: number
  icon: React.ReactNode
  color: 'cyan' | 'purple' | 'green' | 'red' | 'yellow'
  suffix?: string
  decimals?: number
  isOverload?: boolean
  isThrottling?: boolean
}

function StatItem({ 
  label, 
  value, 
  max, 
  icon, 
  color, 
  suffix = '', 
  decimals = 2,
  isOverload = false, 
  isThrottling = false 
}: StatItemProps) {
  const colorClasses = {
    cyan: 'text-cyan-400 border-cyan-500/30',
    purple: 'text-purple-400 border-purple-500/30',
    green: 'text-green-400 border-green-500/30',
    red: 'text-red-400 border-red-500/30',
    yellow: 'text-yellow-400 border-yellow-500/30',
  }

  const barColorClasses = {
    cyan: 'bg-cyan-400',
    purple: 'bg-purple-400',
    green: 'bg-green-400',
    red: 'bg-red-400',
    yellow: 'bg-yellow-400',
  }

  const percentage = max ? Math.min((value / max) * 100, 100) : 0

  return (
    <motion.div 
      layout
      className={`p-4 rounded-lg bg-cyber-bg/50 border ${colorClasses[color]} ${isOverload || isThrottling ? 'animate-pulse' : ''}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={colorClasses[color].split(' ')[0]}>
            {icon}
          </div>
          <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">{label}</span>
        </div>
        {isThrottling && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-[10px] px-2 py-0.5 rounded bg-red-500/30 text-red-400 font-mono flex items-center gap-1"
          >
            <AlertTriangle className="w-3 h-3" /> THROTTLING
          </motion.span>
        )}
        {isOverload && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-[10px] px-2 py-0.5 rounded bg-red-500/30 text-red-400 font-mono flex items-center gap-1"
          >
            <AlertTriangle className="w-3 h-3" /> OVERLOAD
          </motion.span>
        )}
      </div>
      <div className="flex items-end gap-2">
        <span className={`text-2xl font-bold font-mono ${colorClasses[color].split(' ')[0]}`}>
          <AnimatedNumber value={value} decimals={decimals} suffix={suffix} />
        </span>
      </div>
      {max && (
        <div className="mt-2 h-2 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`h-full ${barColorClasses[color]} ${isOverload || isThrottling ? 'animate-pulse' : ''}`}
          />
        </div>
      )}
    </motion.div>
  )
}

interface SidebarProps {
  hashrate?: number
  energyUsed?: number
  energyLimit?: number
  temperature?: number
  isOverloaded?: boolean
  isThrottling?: boolean
}

export function Sidebar({
  hashrate = 0,
  energyUsed = 0,
  energyLimit = 500,
  temperature = 25,
  isOverloaded = false,
  isThrottling = false
}: SidebarProps) {
  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-72 flex flex-col gap-4"
    >
      {/* Title */}
      <div className="glass-panel px-4 py-3">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          SYSTEM STATUS
        </h2>
      </div>

      {/* Stats */}
      <div className="flex flex-col gap-3">
        <StatItem
          label="Hashrate"
          value={hashrate}
          suffix=" TH/s"
          icon={<Cpu className="w-4 h-4" />}
          color="cyan"
          decimals={1}
        />

        <StatItem
          label="Energía"
          value={energyUsed}
          max={energyLimit}
          suffix="W"
          icon={<Zap className="w-4 h-4" />}
          color={isOverloaded ? 'red' : energyUsed > energyLimit * 0.8 ? 'yellow' : 'green'}
          isOverload={isOverloaded}
          decimals={0}
        />

        <StatItem
          label="Temperatura"
          value={temperature}
          max={100}
          suffix="°C"
          icon={<Thermometer className="w-4 h-4" />}
          color={isThrottling ? 'red' : temperature > 80 ? 'yellow' : 'green'}
          isThrottling={isThrottling}
          decimals={1}
        />
      </div>

      {/* Warning indicators */}
      {(isOverloaded || isThrottling) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-4 border-red-500/50 bg-red-500/10"
        >
          <p className="text-red-400 font-mono text-xs text-center flex items-center justify-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            SISTEMA EN PELIGRO
          </p>
          <p className="text-red-300/70 font-mono text-[10px] text-center mt-1">
            {isOverloaded && 'Consumo excede límite de energía'}
            {isThrottling && 'GPU en thermal throttling'}
          </p>
        </motion.div>
      )}
    </motion.aside>
  )
}
