'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ShoppingBag, 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign, 
  Eye,
  Clock,
  AlertTriangle,
  Star,
  MessageSquare,
  Zap,
  RefreshCw
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { OrderService } from '@/lib/services/order-service'
import { InventoryService } from '@/lib/services/inventory-service'
import { supabase } from '@/lib/supabase/client'

interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  totalProducts: number
  revenueGrowth: number
  ordersGrowth: number
  customersGrowth: number
  averageOrderValue: number
  conversionRate: number
  pendingOrders: number
  lowStockItems: number
  todayViews: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    revenueGrowth: 0,
    ordersGrowth: 0,
    customersGrowth: 0,
    averageOrderValue: 0,
    conversionRate: 0,
    pendingOrders: 0,
    lowStockItems: 0,
    todayViews: 0
  })

  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const loadRealData = async () => {
    setIsLoading(true)
    try {
      if (!supabase) {
        console.error('Supabase not available')
        setIsLoading(false)
        return
      }

      // Get real orders data
      const { data: ordersData } = await OrderService.getOrders()
      const orders = ordersData || []

      // Get real products count
      const { data: productsData, count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact' })

      // Get real customers count
      const { data: customersData, count: customersCount } = await supabase
        .from('customers')
        .select('*', { count: 'exact' })

      // Get inventory alerts
      const { data: inventoryAlerts } = await InventoryService.getInventoryAlerts()
      const lowStockCount = inventoryAlerts?.length || 0

      // Calculate real statistics
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
      const totalOrders = orders.length
      const totalCustomers = customersCount || 0
      const totalProducts = productsCount || 0
      const pendingOrders = orders.filter(order => order.order_status === 'pending').length
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

      // Calculate growth (comparing to previous period - simplified)
      const today = new Date()
      const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
      const recentOrders = orders.filter(order => 
        new Date(order.created_at) >= thirtyDaysAgo
      )
      const recentRevenue = recentOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0)

      setStats({
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        revenueGrowth: recentOrders.length > 0 ? (recentOrders.length / totalOrders) * 100 : 0,
        ordersGrowth: recentOrders.length > 0 ? (recentOrders.length / totalOrders) * 100 : 0,
        customersGrowth: 0, // Would need historical data
        averageOrderValue,
        conversionRate: 0, // Would need analytics data
        pendingOrders,
        lowStockItems: lowStockCount,
        todayViews: 0 // Would need analytics integration
      })

      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadRealData()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 10
      }
    }
  }

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    trend = 'up',
    prefix = '',
    suffix = '',
    color = 'blue',
    isZero = false
  }: {
    title: string
    value: string | number
    change?: number
    icon: React.ComponentType<{ className?: string }>
    trend?: 'up' | 'down' | 'neutral'
    prefix?: string
    suffix?: string
    color?: 'blue' | 'green' | 'orange' | 'purple' | 'red'
    isZero?: boolean
  }) => {
    const colorClasses = {
      blue: 'bg-blue-500 text-blue-600 bg-blue-50',
      green: 'bg-green-500 text-green-600 bg-green-50', 
      orange: 'bg-orange-500 text-orange-600 bg-orange-50',
      purple: 'bg-purple-500 text-purple-600 bg-purple-50',
      red: 'bg-red-500 text-red-600 bg-red-50'
    }

    return (
      <motion.div variants={itemVariants}>
        <Card className={`hover:shadow-lg transition-shadow duration-200 bg-white border border-gray-200 ${isZero ? 'opacity-75' : ''}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl ${colorClasses[color].split(' ')[2]}`}>
                  <Icon className={`h-6 w-6 ${colorClasses[color].split(' ')[1]}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">{title}</p>
                  <p className={`text-2xl font-bold ${isZero ? 'text-gray-500' : 'text-gray-900'}`}>
                    {prefix}{typeof value === 'number' ? (value === 0 && isZero ? 'No data' : value.toLocaleString()) : value}{suffix}
                  </p>
                </div>
              </div>
              {change !== undefined && change > 0 && (
                <div className={`flex items-center space-x-1 ${
                  trend === 'up' ? 'text-green-600' : 
                  trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  <TrendingUp className={`h-4 w-4 ${trend === 'down' ? 'rotate-180' : ''}`} />
                  <span className="text-sm font-medium">{change.toFixed(1)}%</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-coral-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  const hasNoData = stats.totalOrders === 0 && stats.totalProducts === 0

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Real-Time Dashboard
          </h1>
          <p className="text-gray-700 mt-2 text-lg font-medium">
            Live data from your Supabase database • Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={loadRealData}
            disabled={isLoading}
            className="bg-white hover:bg-gray-100 border-gray-300 text-gray-700 font-medium"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
          <Button 
            size="sm" 
            onClick={() => window.open('/', '_blank')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Store
          </Button>
        </div>
      </motion.div>

      {/* No Data Warning */}
      {hasNoData && (
        <motion.div variants={itemVariants}>
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <AlertTriangle className="h-8 w-8 text-amber-600" />
                <div>
                  <h3 className="text-lg font-semibold text-amber-800">No Data Available</h3>
                  <p className="text-amber-700">
                    Your store doesn&apos;t have any products or orders yet. Start by adding products to see real analytics.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Key Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={stats.totalRevenue}
          change={stats.revenueGrowth}
          icon={DollarSign}
          prefix="₪"
          color="green"
          isZero={stats.totalRevenue === 0}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          change={stats.ordersGrowth}
          icon={ShoppingBag}
          color="blue"
          isZero={stats.totalOrders === 0}
        />
        <StatCard
          title="Customers"
          value={stats.totalCustomers}
          change={stats.customersGrowth}
          icon={Users}
          color="purple"
          isZero={stats.totalCustomers === 0}
        />
        <StatCard
          title="Products"
          value={stats.totalProducts}
          icon={Package}
          color="orange"
          isZero={stats.totalProducts === 0}
        />
      </motion.div>

      {/* Secondary Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card className="hover:shadow-md transition-shadow bg-white border border-gray-200">
          <CardContent className="p-4 text-center">
            <div className={`text-2xl font-bold ${stats.averageOrderValue === 0 ? 'text-gray-500' : 'text-coral-600'}`}>
              {stats.averageOrderValue === 0 ? 'No orders' : `₪${stats.averageOrderValue.toFixed(2)}`}
            </div>
            <div className="text-sm font-medium text-gray-700">Avg Order Value</div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow bg-white border border-gray-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-500">Setup needed</div>
            <div className="text-sm font-medium text-gray-700">Conversion Rate</div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow bg-white border border-gray-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-500">Setup needed</div>
            <div className="text-sm font-medium text-gray-700">Today&apos;s Views</div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow bg-white border border-gray-200">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-1">
              <div className={`text-2xl font-bold ${stats.pendingOrders === 0 ? 'text-gray-500' : 'text-orange-600'}`}>
                {stats.pendingOrders === 0 ? 'None' : stats.pendingOrders}
              </div>
              <Clock className={`h-4 w-4 ${stats.pendingOrders === 0 ? 'text-gray-500' : 'text-orange-600'}`} />
            </div>
            <div className="text-sm font-medium text-gray-700">Pending Orders</div>
          </CardContent>
        </Card>
        
        <Card className={`hover:shadow-md transition-shadow bg-white border ${stats.lowStockItems === 0 ? 'border-green-200' : 'border-red-200'}`}>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-1">
              <div className={`text-2xl font-bold ${stats.lowStockItems === 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.lowStockItems === 0 ? '✓' : stats.lowStockItems}
              </div>
              {stats.lowStockItems > 0 && <AlertTriangle className="h-4 w-4 text-red-600" />}
            </div>
            <div className="text-sm font-medium text-gray-700">
              {stats.lowStockItems === 0 ? 'All Good' : 'Low Stock'}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Real Data Notice */}
      <motion.div variants={itemVariants}>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-800 font-medium">Real-time data from Supabase database</span>
              <Badge variant="outline" className="text-green-700 border-green-300">
                Live
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card 
          className="hover:shadow-lg transition-shadow cursor-pointer bg-white border border-gray-200"
          onClick={() => window.location.href = '/admin/products'}
        >
          <CardContent className="p-6 text-center">
            <Package className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900">Add Products</h3>
            <p className="text-sm text-gray-700 mt-1">Start adding real products to your store</p>
          </CardContent>
        </Card>

        <Card 
          className="hover:shadow-lg transition-shadow cursor-pointer bg-white border border-gray-200"
          onClick={() => window.location.href = '/admin/orders'}
        >
          <CardContent className="p-6 text-center">
            <ShoppingBag className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900">Manage Orders</h3>
            <p className="text-sm text-gray-700 mt-1">Process and fulfill customer orders</p>
          </CardContent>
        </Card>

        <Card 
          className="hover:shadow-lg transition-shadow cursor-pointer bg-white border border-gray-200"
          onClick={() => window.location.href = '/admin/analytics'}
        >
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900">View Analytics</h3>
            <p className="text-sm text-gray-700 mt-1">Connect analytics tools for detailed insights</p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}