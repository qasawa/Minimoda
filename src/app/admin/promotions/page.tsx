'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Tag, 
  Percent, 
  Plus, 
  Edit2, 
  MoreHorizontal,
  Calendar,
  Target,
  TrendingUp,
  Gift,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAdmin } from '@/lib/contexts/admin-context'

interface Promotion {
  id: string
  name: string
  type: 'percentage' | 'fixed' | 'bogo' | 'free_shipping'
  value: number
  code: string
  description: string
  startDate: string
  endDate: string
  usageLimit: number
  usageCount: number
  status: 'active' | 'scheduled' | 'expired' | 'draft'
  targetAudience: string
}

export default function PromotionsAdminPage() {
  const { setActiveSection } = useAdmin()
  const [filterStatus, setFilterStatus] = useState('all')

  // Mock promotions data
  const promotions: Promotion[] = [
    {
      id: 'PROMO-001',
      name: 'New Year Sale',
      type: 'percentage',
      value: 25,
      code: 'NEWYEAR25',
      description: '25% off on all items for new year celebration',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      usageLimit: 1000,
      usageCount: 234,
      status: 'active',
      targetAudience: 'All customers'
    },
    {
      id: 'PROMO-002',
      name: 'Free Shipping Weekend',
      type: 'free_shipping',
      value: 0,
      code: 'FREESHIP',
      description: 'Free shipping on orders above ₪100',
      startDate: '2024-01-15',
      endDate: '2024-01-17',
      usageLimit: 500,
      usageCount: 89,
      status: 'scheduled',
      targetAudience: 'VIP customers'
    },
    {
      id: 'PROMO-003',
      name: 'Buy 2 Get 1 Free',
      type: 'bogo',
      value: 1,
      code: 'BOGO3',
      description: 'Buy 2 items and get 1 free from baby collection',
      startDate: '2023-12-01',
      endDate: '2023-12-31',
      usageLimit: 200,
      usageCount: 178,
      status: 'expired',
      targetAudience: 'New parents'
    },
    {
      id: 'PROMO-004',
      name: 'Spring Collection Launch',
      type: 'fixed',
      value: 50,
      code: 'SPRING50',
      description: '₪50 off on spring collection items',
      startDate: '2024-03-01',
      endDate: '2024-03-31',
      usageLimit: 300,
      usageCount: 0,
      status: 'draft',
      targetAudience: 'Fashion enthusiasts'
    }
  ]

  const filteredPromotions = promotions.filter(promo => 
    filterStatus === 'all' || promo.status === filterStatus
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>
      case 'expired':
        return <Badge className="bg-gray-100 text-gray-800">Expired</Badge>
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'percentage':
        return <Percent className="h-4 w-4" />
      case 'fixed':
        return <Tag className="h-4 w-4" />
      case 'bogo':
        return <Gift className="h-4 w-4" />
      case 'free_shipping':
        return <Zap className="h-4 w-4" />
      default:
        return <Tag className="h-4 w-4" />
    }
  }

  React.useEffect(() => {
    setActiveSection('promotions')
  }, [setActiveSection])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Promotions</h1>
          <p className="text-gray-600 mt-1">Create and manage discount codes and campaigns</p>
        </div>
        <Button className="bg-coral-500 hover:bg-coral-600">
          <Plus className="h-4 w-4 mr-2" />
          Create Promotion
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Promotions</p>
              <p className="text-2xl font-bold text-gray-900">
                {promotions.filter(p => p.status === 'active').length}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg border p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Usage</p>
              <p className="text-2xl font-bold text-gray-900">
                {promotions.reduce((sum, p) => sum + p.usageCount, 0)}
              </p>
            </div>
            <Target className="h-8 w-8 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg border p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Discount</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(promotions.filter(p => p.type === 'percentage').reduce((sum, p) => sum + p.value, 0) / promotions.filter(p => p.type === 'percentage').length || 0)}%
              </p>
            </div>
            <Percent className="h-8 w-8 text-purple-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg border p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">
                {promotions.filter(p => p.status === 'scheduled').length}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-coral-500" />
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="scheduled">Scheduled</option>
              <option value="expired">Expired</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Promotions List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg border overflow-hidden"
      >
        <div className="divide-y">
          {filteredPromotions.map((promotion, index) => (
            <motion.div
              key={promotion.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 hover:bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-coral-100 rounded-lg">
                      {getTypeIcon(promotion.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{promotion.name}</h3>
                      <p className="text-sm text-gray-600">{promotion.description}</p>
                    </div>
                    {getStatusBadge(promotion.status)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Code</p>
                      <p className="font-mono text-sm font-medium bg-gray-100 px-2 py-1 rounded inline-block">
                        {promotion.code}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Discount</p>
                      <p className="text-sm font-medium text-gray-900">
                        {promotion.type === 'percentage' ? `${promotion.value}%` :
                         promotion.type === 'fixed' ? `₪${promotion.value}` :
                         promotion.type === 'bogo' ? `Buy 2 Get ${promotion.value} Free` :
                         'Free Shipping'}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Duration</p>
                      <p className="text-sm text-gray-900">
                        {new Date(promotion.startDate).toLocaleDateString()} - {new Date(promotion.endDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Usage</p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-900">
                          {promotion.usageCount} / {promotion.usageLimit}
                        </p>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-coral-500 h-2 rounded-full" 
                            style={{ width: `${(promotion.usageCount / promotion.usageLimit) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-xs text-gray-500">Target: {promotion.targetAudience}</p>
                  </div>
                </div>

                <div className="ml-6 flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
