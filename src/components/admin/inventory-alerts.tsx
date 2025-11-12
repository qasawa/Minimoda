'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Package, CheckCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { InventoryService, InventoryAlert } from '@/lib/services/inventory-service'

export function InventoryAlerts() {
  const [alerts, setAlerts] = useState<InventoryAlert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadInventoryAlerts()
  }, [])

  const loadInventoryAlerts = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { data, error: alertsError } = await InventoryService.getInventoryAlerts()

      if (alertsError) {
        setError(alertsError)
        return
      }

      setAlerts(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load inventory alerts')
    } finally {
      setIsLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'out_of_stock':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'critical':
        return 'text-red-600 bg-red-100 border-red-200'
      case 'low':
        return 'text-orange-600 bg-orange-100 border-orange-200'
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200'
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div>
                <div className="h-4 bg-gray-300 rounded w-24 mb-1"></div>
                <div className="h-3 bg-gray-300 rounded w-16"></div>
              </div>
            </div>
            <div className="h-6 bg-gray-300 rounded w-12"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-center">
        <div>
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600 font-medium">Failed to load inventory alerts</p>
          <p className="text-sm text-gray-500 mt-1">{error}</p>
          <button 
            onClick={loadInventoryAlerts}
            className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (alerts.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-center">
        <div>
          <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <p className="text-green-600 font-medium">All inventory levels good!</p>
          <p className="text-sm text-gray-500 mt-1">
            No low stock alerts at this time
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert, index) => {
        const severity = alert.severity
        
        return (
          <motion.div
            key={`${alert.product_id}-${alert.size}-${alert.color_name}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center justify-between p-3 rounded-lg border ${getSeverityColor(severity)} transition-colors`}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-white">
                {alert.current_stock === 0 ? (
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                ) : (
                  <Package className="h-4 w-4 text-orange-600" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900 truncate max-w-[150px]">
                  {alert.product_name}
                </p>
                <p className="text-sm text-gray-600">
                  Size: {alert.size} • Color: {alert.color_name}
                </p>
              </div>
            </div>
            <div className="text-right">
              <Badge 
                variant="outline" 
                className={`${
                  alert.current_stock === 0 ? 'bg-red-50 text-red-700 border-red-200' :
                  alert.current_stock <= 5 ? 'bg-orange-50 text-orange-700 border-orange-200' :
                  'bg-yellow-50 text-yellow-700 border-yellow-200'
                }`}
              >
                {alert.current_stock === 0 ? 'Out of Stock' : `${alert.current_stock} left`}
              </Badge>
              <p className="text-xs text-gray-500 mt-1">
                Threshold: {alert.threshold}
              </p>
            </div>
          </motion.div>
        )
      })}
      
      <div className="pt-3 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-1 text-xs text-gray-500">
          <AlertTriangle className="h-3 w-3" />
          <span>Real inventory data from your database</span>
        </div>
      </div>
    </div>
  )
}