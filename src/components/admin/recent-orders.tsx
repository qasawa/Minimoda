'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, Package, CheckCircle, AlertCircle, Truck, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { OrderService } from '@/lib/services/order-service'

interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  total_amount: number
  order_status: string
  created_at: string
  items: any[]
}

export function RecentOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadRecentOrders()
  }, [])

  const loadRecentOrders = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { data, error: orderError } = await OrderService.getOrders({
        limit: 5,
        status: [] // All statuses
      })

      if (orderError) {
        setError(orderError)
        return
      }

      setOrders(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recent orders')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />
      case 'shipped':
        return <Truck className="h-4 w-4" />
      case 'delivered':
        return <Package className="h-4 w-4" />
      case 'cancelled':
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'confirmed':
        return 'text-blue-600 bg-blue-100'
      case 'shipped':
        return 'text-purple-600 bg-purple-100'
      case 'delivered':
        return 'text-green-600 bg-green-100'
      case 'cancelled':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
      return diffInMinutes <= 1 ? 'Just now' : `${diffInMinutes} min ago`
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div>
                <div className="h-4 bg-gray-300 rounded w-24 mb-1"></div>
                <div className="h-3 bg-gray-300 rounded w-16"></div>
              </div>
            </div>
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
          <p className="text-red-600 font-medium">Failed to load recent orders</p>
          <p className="text-sm text-gray-500 mt-1">{error}</p>
          <button 
            onClick={loadRecentOrders}
            className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-center">
        <div>
          <Package className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 font-medium">No orders yet</p>
          <p className="text-sm text-gray-500 mt-1">
            Recent orders will appear here once customers start purchasing
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {orders.map((order, index) => (
        <motion.div
          key={order.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${getStatusColor(order.order_status)}`}>
              {getStatusIcon(order.order_status)}
            </div>
            <div>
              <p className="font-medium text-gray-900">
                #{order.order_number}
              </p>
              <p className="text-sm text-gray-600">
                {order.customer_name || order.customer_phone}
              </p>
              <p className="text-xs text-gray-500">
                {getTimeAgo(order.created_at)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-900">
              ₪{order.total_amount.toFixed(2)}
            </p>
            <Badge 
              variant="outline" 
              className={`text-xs ${getStatusColor(order.order_status)} border-0`}
            >
              {order.order_status}
            </Badge>
          </div>
        </motion.div>
      ))}
      
      {orders.length > 0 && (
        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-1 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            <span>Live orders from your database</span>
          </div>
        </div>
      )}
    </div>
  )
}