'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  Package, 
  Search, 
  Filter, 
  AlertTriangle, 
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Edit2,
  Plus,
  Minus,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAdmin } from '@/lib/contexts/admin-context'
import { InventoryService, InventoryAlert } from '@/lib/services/inventory-service'
import { productService } from '@/lib/supabase/products-service'
import { formatCurrency } from '@/lib/utils/currency'

interface InventoryItem {
  id: string
  product_id: string
  product_name: string
  size: string
  color_name: string
  color_index: number
  stock_quantity: number
  reserved_quantity: number
  low_stock_threshold: number
  cost_per_unit: number
  last_updated: string
}

interface Product {
  id: string
  name: { en: string; he: string; ar: string }
  category: string
  images: string[]
}

export default function InventoryAdminPage() {
  const { setActiveSection } = useAdmin()
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [alerts, setAlerts] = useState<InventoryAlert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [editStock, setEditStock] = useState(0)

  useEffect(() => {
    setActiveSection('inventory')
    loadInventoryData()
  }, [setActiveSection])

  const loadInventoryData = async () => {
    setIsLoading(true)
    try {
      // Load products for display names
      const productsData = await productService.getAll('en')
      setProducts(productsData)

      // Load inventory data
      const { data: inventoryData, error: inventoryError } = await InventoryService.getInventory()
      
      if (inventoryError) {
        console.error('Error loading inventory:', inventoryError)
        return
      }

      // Combine inventory with product data
      const enrichedInventory = (inventoryData || []).map((item: any) => {
        const product = productsData.find(p => p.id === item.product_id)
        return {
          ...item,
          product_name: product?.name?.en || 'Unknown Product',
          color_name: product?.colors?.[item.color_index]?.name?.en || `Color ${item.color_index + 1}`
        }
      })

      setInventory(enrichedInventory)

      // Load inventory alerts
      const { data: alertsData } = await InventoryService.getInventoryAlerts()
      setAlerts(alertsData || [])

    } catch (error) {
      console.error('Error loading inventory data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateStock = async (itemId: string, newQuantity: number, operation: 'set' | 'add' | 'subtract') => {
    try {
      let finalQuantity = newQuantity
      
      if (operation === 'add') {
        const item = inventory.find(i => i.id === itemId)
        finalQuantity = (item?.stock_quantity || 0) + newQuantity
      } else if (operation === 'subtract') {
        const item = inventory.find(i => i.id === itemId)
        finalQuantity = Math.max(0, (item?.stock_quantity || 0) - newQuantity)
      }

      const item = inventory.find(i => i.id === itemId)
      if (!item) {
        alert('Inventory item not found')
        return
      }
      
      const { error } = await InventoryService.updateStock(
        item.product_id, 
        item.size, 
        item.color_index, 
        finalQuantity, 
        `Manual adjustment via admin panel`
      )
      
      if (error) {
        alert(`Error updating stock: ${error}`)
        return
      }

      // Reload data
      await loadInventoryData()
      alert('Stock updated successfully!')
      
    } catch (error) {
      alert('Failed to update stock')
    }
  }

  const openEditModal = (item: InventoryItem) => {
    setEditingItem(item)
    setEditStock(item.stock_quantity)
    setShowEditModal(true)
  }

  const saveStockUpdate = async () => {
    if (!editingItem) return
    
    await updateStock(editingItem.id, editStock, 'set')
    setShowEditModal(false)
    setEditingItem(null)
  }

  // Filter inventory
  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      const matchesSearch = 
        item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.size.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.color_name.toLowerCase().includes(searchTerm.toLowerCase())
      
      let matchesStatus = true
      if (filterStatus === 'low_stock') {
        matchesStatus = item.stock_quantity <= item.low_stock_threshold
      } else if (filterStatus === 'out_of_stock') {
        matchesStatus = item.stock_quantity === 0
      } else if (filterStatus === 'in_stock') {
        matchesStatus = item.stock_quantity > item.low_stock_threshold
      }
      
      return matchesSearch && matchesStatus
    })
  }, [inventory, searchTerm, filterStatus])

  const getStockStatus = (item: InventoryItem) => {
    if (item.stock_quantity === 0) return { status: 'out_of_stock', color: 'bg-red-100 text-red-800' }
    if (item.stock_quantity <= item.low_stock_threshold) return { status: 'low_stock', color: 'bg-yellow-100 text-yellow-800' }
    return { status: 'in_stock', color: 'bg-green-100 text-green-800' }
  }

  const stats = {
    totalItems: inventory.length,
    outOfStock: inventory.filter(item => item.stock_quantity === 0).length,
    lowStock: inventory.filter(item => item.stock_quantity > 0 && item.stock_quantity <= item.low_stock_threshold).length,
    totalValue: inventory.reduce((sum, item) => sum + (item.stock_quantity * item.cost_per_unit), 0)
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage your product inventory</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={loadInventoryData}
            variant="outline"
            disabled={isLoading}
            className="border-purple-200 text-purple-600 hover:bg-purple-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
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
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
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
              <p className="text-sm text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
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
              <p className="text-sm text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.lowStock}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
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
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalValue)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </motion.div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h3 className="font-semibold text-red-800">Inventory Alerts ({alerts.length})</h3>
          </div>
          <div className="space-y-2">
            {alerts.slice(0, 3).map((alert, index) => (
              <p key={index} className="text-sm text-red-700">
                • {alert.product_name} ({alert.size}, {alert.color_name}) - {alert.severity} stock alert
              </p>
            ))}
            {alerts.length > 3 && (
              <p className="text-sm text-red-600">+ {alerts.length - 3} more alerts</p>
            )}
          </div>
        </motion.div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products, sizes, colors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
              />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
          >
            <option value="all">All Items</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg border overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Product</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Variant</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Stock</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Reserved</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Value</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item, index) => {
                const stockStatus = getStockStatus(item)
                return (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">{item.product_name}</div>
                      <div className="text-sm text-gray-500">ID: {item.product_id}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm">
                        <div>Size: {item.size}</div>
                        <div>Color: {item.color_name}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className={`font-bold ${item.stock_quantity === 0 ? 'text-red-600' : item.stock_quantity <= item.low_stock_threshold ? 'text-yellow-600' : 'text-green-600'}`}>
                        {item.stock_quantity}
                      </div>
                      <div className="text-xs text-gray-500">Threshold: {item.low_stock_threshold}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-600">{item.reserved_quantity}</div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge className={stockStatus.color}>
                        {stockStatus.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium">{formatCurrency(item.stock_quantity * item.cost_per_unit)}</div>
                      <div className="text-xs text-gray-500">{formatCurrency(item.cost_per_unit)}/unit</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(item)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateStock(item.id, 1, 'add')}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateStock(item.id, 1, 'subtract')}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Edit Stock Modal */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Update Stock</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product: {editingItem.product_name}
                </label>
                <p className="text-sm text-gray-500">
                  {editingItem.size} • {editingItem.color_name}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Stock: {editingItem.stock_quantity}
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Stock Quantity
                </label>
                <input
                  type="number"
                  value={editStock}
                  onChange={(e) => setEditStock(parseInt(e.target.value) || 0)}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button
                onClick={saveStockUpdate}
                className="bg-coral-500 hover:bg-coral-600 flex-1"
              >
                Update Stock
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowEditModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
