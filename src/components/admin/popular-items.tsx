'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Package, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface PopularItem {
  product_id: string
  product_name: string
  total_sold: number
  revenue: number
}

export function PopularItems() {
  const [items, setItems] = useState<PopularItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPopularItems()
  }, [])

  const loadPopularItems = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      if (!supabase) {
        setError('Database connection not available')
        return
      }

      // Query to get popular items from real orders
      const { data, error: queryError } = await supabase
        .from('order_items')
        .select(`
          product_id,
          products!inner(name_en),
          quantity,
          price
        `)
        .limit(100)

      if (queryError) {
        setError(queryError.message)
        return
      }

      // Aggregate the data
      const itemMap = new Map<string, { name: string, quantity: number, revenue: number }>()
      
      data?.forEach(item => {
        const productId = item.product_id
        const productName = (item.products as any)?.name_en || 'Unknown Product'
        const quantity = item.quantity || 0
        const revenue = (item.price || 0) * quantity

        if (itemMap.has(productId)) {
          const existing = itemMap.get(productId)!
          existing.quantity += quantity
          existing.revenue += revenue
        } else {
          itemMap.set(productId, {
            name: productName,
            quantity,
            revenue
          })
        }
      })

      // Convert to array and sort by quantity sold
      const popularItems: PopularItem[] = Array.from(itemMap.entries())
        .map(([productId, data]) => ({
          product_id: productId,
          product_name: data.name,
          total_sold: data.quantity,
          revenue: data.revenue
        }))
        .sort((a, b) => b.total_sold - a.total_sold)
        .slice(0, 5)

      setItems(popularItems)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load popular items')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-24"></div>
            <div className="h-4 bg-gray-300 rounded w-16"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-center">
        <div>
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600 font-medium">Failed to load popular items</p>
          <p className="text-sm text-gray-500 mt-1">{error}</p>
          <button 
            onClick={loadPopularItems}
            className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-center">
        <div>
          <Package className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 font-medium">No sales data yet</p>
          <p className="text-sm text-gray-500 mt-1">
            Popular items will appear here once you have orders
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <motion.div
          key={item.product_id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              index === 0 ? 'bg-yellow-500' : 
              index === 1 ? 'bg-gray-400' : 
              index === 2 ? 'bg-orange-500' : 'bg-blue-500'
            }`} />
            <div>
              <p className="font-medium text-gray-900 truncate max-w-[150px]">
                {item.product_name}
              </p>
              <p className="text-sm text-gray-500">
                ₪{item.revenue.toFixed(2)} revenue
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-1 text-green-600">
              <span className="font-semibold">{item.total_sold}</span>
              <span className="text-xs">sold</span>
            </div>
          </div>
        </motion.div>
      ))}
      
      {items.length > 0 && (
        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-1 text-xs text-gray-500">
            <TrendingUp className="h-3 w-3" />
            <span>Real sales data from your store</span>
          </div>
        </div>
      )}
    </div>
  )
}