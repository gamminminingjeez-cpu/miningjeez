import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import { ShoppingCart } from 'lucide-react'
import { storeCatalog, storeItemToGridItem } from '../../lib/catalog'
import type { GridItem } from '../../types/game'
import { toast } from 'sonner'

interface StoreTabProps {
  credits: number
  onPurchase: (item: GridItem) => void
}

export function StoreTab({ credits, onPurchase }: StoreTabProps) {
  const handleBuy = (storeItem: typeof storeCatalog[0]) => {
    if (credits < storeItem.price) {
      toast.error('Fondos insuficientes', {
        description: `Necesitas ${storeItem.price} USDT pero tienes ${credits.toFixed(2)} USDT`,
        style: {
          background: '#1e293b',
          border: '1px solid rgba(239, 68, 68, 0.5)',
          color: '#f87171'
        }
      })
      return
    }

    // Generate unique instance ID
    const instanceId = `${storeItem.itemId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const gridItem = storeItemToGridItem(storeItem, instanceId)
    
    onPurchase(gridItem)
    
    toast.success('¡Compra exitosa!', {
      description: `${storeItem.name} agregado a tu inventario`,
      style: {
        background: '#1e293b',
        border: '1px solid rgba(34, 197, 94, 0.5)',
        color: '#4ade80'
      }
    })
  }

  return (
    <div className="flex flex-wrap gap-3 justify-center max-h-48 overflow-y-auto">
      {storeCatalog.map((item) => {
        const canAfford = credits >= item.price
        
        return (
          <motion.div
            key={item.id}
            whileHover={{ scale: canAfford ? 1.05 : 1 }}
            className={clsx(
              'relative p-3 rounded-lg border transition-all duration-200 w-32',
              canAfford 
                ? 'bg-slate-900/80 border-slate-700/50 cursor-pointer hover:border-cyan-500/50' 
                : 'bg-slate-900/40 border-slate-800/50 cursor-not-allowed opacity-60'
            )}
          >
            {/* Icon */}
            <div className={clsx(
              'w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2',
              item.type === 'gpu' && 'bg-gradient-to-br from-purple-600 to-pink-600',
              item.type === 'cooler' && 'bg-gradient-to-br from-cyan-600 to-blue-600',
              item.type === 'psu' && 'bg-gradient-to-br from-yellow-600 to-orange-600'
            )}>
              <div className="text-white">{item.icon}</div>
            </div>

            {/* Name */}
            <p className="text-xs font-mono text-white truncate text-center mb-1">{item.name}</p>

            {/* Price */}
            <p className={clsx(
              'text-sm font-bold font-mono text-center mb-2',
              canAfford ? 'text-yellow-400' : 'text-red-400'
            )}>
              ${item.price}
            </p>

            {/* Buy button */}
            <button
              onClick={() => handleBuy(item)}
              disabled={!canAfford}
              className={clsx(
                'w-full py-1.5 rounded text-xs font-mono flex items-center justify-center gap-1 transition-all',
                canAfford 
                  ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/40' 
                  : 'bg-slate-800/50 text-slate-500 cursor-not-allowed'
              )}
            >
              <ShoppingCart className="w-3 h-3" />
              COMPRAR
            </button>

            {/* Type badge */}
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
      })}
    </div>
  )
}
