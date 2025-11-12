'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, BarChart3, Calendar, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { OrderService } from '@/lib/services/order-service'

interface RevenueData {
  date: string
  revenue: number
}

export function RealtimeChart() {
  const [data, setData] = useState<RevenueData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalRevenue, setTotalRevenue] = useState(0)

  useEffect(() => {
    loadRevenueData()
  }, [])

  const loadRevenueData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Get analytics data from orders
      const { data: analyticsData, error: analyticsError } = await OrderService.getOrderAnalytics()
      
      if (analyticsError) {
        setError(analyticsError)
        return
      }

      if (analyticsData) {
        setTotalRevenue(analyticsData.totalRevenue || 0)
        
        // Convert to chart data (simplified)
        const revenueByDay: RevenueData[] = []
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date()
          date.setDate(date.getDate() - (6 - i))
          return date.toISOString().split('T')[0]
        })

        last7Days.forEach(date => {
          revenueByDay.push({
            date,
            revenue: Math.random() * 1000 // This would be real data from orders grouped by date
          })
        })

        setData(revenueByDay)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load revenue data')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="h-64 w-full flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"
          />
          <p className="text-gray-600">Loading revenue analytics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-64 w-full flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
          <p className="text-red-600 font-medium mb-2">Failed to load analytics</p>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={loadRevenueData}
            className="mx-auto"
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  // For now, show a notice about connecting analytics instead of fake charts
  return (
    <div className="h-64 w-full">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 h-full flex flex-col justify-center items-center text-center border border-blue-200">
        <BarChart3 className="h-16 w-16 text-blue-500 mb-4" />
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Real Analytics Coming Soon
        </h3>
        
        <p className="text-gray-600 mb-4 max-w-md">
          Connect your analytics service to see real revenue charts, conversion rates, and detailed insights.
        </p>

        <div className="flex items-center space-x-4 mb-4">
          <Badge variant="outline" className="text-blue-700 border-blue-300">
            <TrendingUp className="h-3 w-3 mr-1" />
            Current Revenue: ₪{totalRevenue.toFixed(2)}
          </Badge>
          
          <Badge variant="outline" className="text-green-700 border-green-300">
            <Calendar className="h-3 w-3 mr-1" />
            Real Orders: {data.length > 0 ? 'Available' : 'No data yet'}
          </Badge>
        </div>

        <div className="space-y-2 text-sm text-gray-500">
          <p>• Connect Google Analytics for detailed visitor insights</p>
          <p>• Add conversion tracking for better performance metrics</p>
          <p>• Real-time revenue updates from your order data</p>
        </div>

        <Button 
          variant="outline" 
          size="sm"
          className="mt-4 border-blue-300 text-blue-700 hover:bg-blue-50"
          onClick={() => {
            // Could open analytics setup modal
            alert('Analytics setup coming soon!')
          }}
        >
          Setup Analytics
        </Button>
      </div>
    </div>
  )
}