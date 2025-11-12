'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { OrderService, OrderFilters } from '@/lib/services/order-service'
import { formatCurrency } from '@/lib/utils/currency'
import { Order, OrderStatus, PaymentStatus } from '@/lib/types'
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Package, 
  Truck, 
  CheckCircle,
  XCircle,
  Clock,
  MoreHorizontal,
  RefreshCw
} from 'lucide-react'

interface OrderManagementProps {
  locale: string
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800', 
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-orange-100 text-orange-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  returned: 'bg-gray-100 text-gray-800'
}

const paymentStatusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800'
}

export default function OrderManagement({ locale }: OrderManagementProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<OrderFilters>({})
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderDetail, setShowOrderDetail] = useState(false)

  const itemsPerPage = 20
  const isRTL = locale === 'he' || locale === 'ar'

  // Load orders
  useEffect(() => {
    loadOrders()
  }, [filters, currentPage])

  // Filter orders based on search
  useEffect(() => {
    if (!searchQuery) {
      setFilteredOrders(orders)
      return
    }

    const filtered = orders.filter(order =>
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_phone.includes(searchQuery)
    )
    setFilteredOrders(filtered)
  }, [orders, searchQuery])

  const loadOrders = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { data, error, count } = await OrderService.getOrders({
        ...filters,
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage
      })

      if (error) {
        setError(error)
        return
      }

      setOrders(data || [])
      setTotalCount(count || 0)
    } catch (err) {
      setError('Failed to load orders')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId: string, status: OrderStatus) => {
    try {
      const { error } = await OrderService.updateOrderStatus(orderId, status)
      if (error) {
        alert(`Error: ${error}`)
        return
      }

      // Refresh orders
      await loadOrders()
      alert('Order status updated successfully!')
    } catch (err) {
      alert('Failed to update order status')
    }
  }

  const handleBulkAction = async (action: string) => {
    if (selectedOrders.size === 0) {
      alert('Please select orders first')
      return
    }

    const orderIds = Array.from(selectedOrders)

    switch (action) {
      case 'export':
        exportOrders(orderIds)
        break
      case 'mark_shipped':
        await bulkUpdateStatus(orderIds, 'shipped')
        break
      case 'mark_delivered':
        await bulkUpdateStatus(orderIds, 'delivered')
        break
      case 'delete':
        if (confirm('Are you sure you want to delete selected orders?')) {
          await bulkDelete(orderIds)
        }
        break
    }
  }

  const bulkUpdateStatus = async (orderIds: string[], status: OrderStatus) => {
    try {
      for (const orderId of orderIds) {
        await OrderService.updateOrderStatus(orderId, status)
      }
      setSelectedOrders(new Set())
      await loadOrders()
      alert(`${orderIds.length} orders updated successfully!`)
    } catch (err) {
      alert('Failed to update orders')
    }
  }

  const bulkDelete = async (orderIds: string[]) => {
    try {
      for (const orderId of orderIds) {
        await OrderService.cancelOrder(orderId, 'Bulk delete')
      }
      setSelectedOrders(new Set())
      await loadOrders()
      alert(`${orderIds.length} orders deleted successfully!`)
    } catch (err) {
      alert('Failed to delete orders')
    }
  }

  const exportOrders = (orderIds: string[]) => {
    const ordersToExport = orders.filter(order => orderIds.includes(order.id))
    const csv = convertToCSV(ordersToExport)
    downloadCSV(csv, 'orders.csv')
  }

  const convertToCSV = (orders: Order[]) => {
    const headers = ['Order Number', 'Customer', 'Date', 'Total', 'Status', 'Payment Status']
    const rows = orders.map(order => [
      order.order_number,
      order.customer_name,
      new Date(order.created_at).toLocaleDateString(),
      formatCurrency(order.total_amount),
      order.order_status,
      order.payment_status
    ])

    return [headers, ...rows].map(row => row.join(',')).join('\n')
  }

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const toggleOrderSelection = (orderId: string) => {
    const newSelection = new Set(selectedOrders)
    if (newSelection.has(orderId)) {
      newSelection.delete(orderId)
    } else {
      newSelection.add(orderId)
    }
    setSelectedOrders(newSelection)
  }

  const selectAllOrders = () => {
    if (selectedOrders.size === filteredOrders.length) {
      setSelectedOrders(new Set())
    } else {
      setSelectedOrders(new Set(filteredOrders.map(order => order.id)))
    }
  }

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'confirmed': return <CheckCircle className="w-4 h-4" />
      case 'processing': return <Package className="w-4 h-4" />
      case 'shipped': return <Truck className="w-4 h-4" />
      case 'delivered': return <CheckCircle className="w-4 h-4" />
      case 'cancelled': return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const totalPages = Math.ceil(totalCount / itemsPerPage)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {locale === 'he' ? 'ניהול הזמנות' : 
             locale === 'ar' ? 'إدارة الطلبات' : 
             'Order Management'}
          </h1>
          <p className="text-gray-600 mt-1">
            {locale === 'he' ? `${totalCount} הזמנות` :
             locale === 'ar' ? `${totalCount} طلب` :
             `${totalCount} orders`}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>
              {locale === 'he' ? 'סינון' : locale === 'ar' ? 'تصفية' : 'Filter'}
            </span>
          </button>

          <button
            onClick={loadOrders}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>
              {locale === 'he' ? 'רענן' : locale === 'ar' ? 'تحديث' : 'Refresh'}
            </span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className={`absolute top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 ${
            isRTL ? 'right-3' : 'left-3'
          }`} />
          <input
            type="text"
            placeholder={
              locale === 'he' ? 'חפש לפי מספר הזמנה, שם לקוח או טלפון...' :
              locale === 'ar' ? 'البحث بواسطة رقم الطلب أو اسم العميل أو الهاتف...' :
              'Search by order number, customer name or phone...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500 transition-all ${
              isRTL ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4'
            }`}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white border border-gray-200 rounded-lg p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {locale === 'he' ? 'סטטוס הזמנה' : 
                     locale === 'ar' ? 'حالة الطلب' : 
                     'Order Status'}
                  </label>
                  <select
                    value={filters.status?.[0] || ''}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value ? [e.target.value as OrderStatus] : undefined })}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Payment Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {locale === 'he' ? 'סטטוס תשלום' : 
                     locale === 'ar' ? 'حالة الدفع' : 
                     'Payment Status'}
                  </label>
                  <select
                    value={filters.payment_status?.[0] || ''}
                    onChange={(e) => setFilters({ ...filters, payment_status: e.target.value ? [e.target.value as PaymentStatus] : undefined })}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
                  >
                    <option value="">All Payment Status</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>

                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {locale === 'he' ? 'מתאריך' : 
                     locale === 'ar' ? 'من تاريخ' : 
                     'From Date'}
                  </label>
                  <input
                    type="date"
                    value={filters.date_from || ''}
                    onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {locale === 'he' ? 'עד תאריך' : 
                     locale === 'ar' ? 'إلى تاريخ' : 
                     'To Date'}
                  </label>
                  <input
                    type="date"
                    value={filters.date_to || ''}
                    onChange={(e) => setFilters({ ...filters, date_to: e.target.value })}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setFilters({})}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {locale === 'he' ? 'נקה' : locale === 'ar' ? 'مسح' : 'Clear'}
                </button>
                <button
                  onClick={() => {
                    setCurrentPage(1)
                    loadOrders()
                  }}
                  className="px-4 py-2 text-white bg-sage-600 rounded-lg hover:bg-sage-700 transition-colors"
                >
                  {locale === 'he' ? 'החל' : locale === 'ar' ? 'تطبيق' : 'Apply'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bulk Actions */}
      {selectedOrders.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-sage-50 border border-sage-200 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-sage-700">
              {locale === 'he' ? `${selectedOrders.size} הזמנות נבחרו` :
               locale === 'ar' ? `تم اختيار ${selectedOrders.size} طلبات` :
               `${selectedOrders.size} orders selected`}
            </span>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleBulkAction('export')}
                className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>

              <button
                onClick={() => handleBulkAction('mark_shipped')}
                className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Truck className="w-4 h-4" />
                <span>Mark Shipped</span>
              </button>

              <button
                onClick={() => handleBulkAction('mark_delivered')}
                className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Mark Delivered</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Orders Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600"></div>
            <p className="mt-2 text-gray-600">Loading orders...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">
            <p>Error: {error}</p>
            <button
              onClick={loadOrders}
              className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="w-12 p-4">
                    <input
                      type="checkbox"
                      checked={selectedOrders.size === filteredOrders.length && filteredOrders.length > 0}
                      onChange={selectAllOrders}
                      className="rounded border-gray-300 text-sage-600 focus:ring-sage-500"
                    />
                  </th>
                  <th className="text-left p-4 font-medium text-gray-900">Order #</th>
                  <th className="text-left p-4 font-medium text-gray-900">Customer</th>
                  <th className="text-left p-4 font-medium text-gray-900">Date</th>
                  <th className="text-left p-4 font-medium text-gray-900">Total</th>
                  <th className="text-left p-4 font-medium text-gray-900">Status</th>
                  <th className="text-left p-4 font-medium text-gray-900">Payment</th>
                  <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedOrders.has(order.id)}
                        onChange={() => toggleOrderSelection(order.id)}
                        className="rounded border-gray-300 text-sage-600 focus:ring-sage-500"
                      />
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => {
                          setSelectedOrder(order)
                          setShowOrderDetail(true)
                        }}
                        className="font-medium text-sage-600 hover:text-sage-700 transition-colors"
                      >
                        {order.order_number}
                      </button>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-gray-900">{order.customer_name}</div>
                        <div className="text-sm text-gray-500">{order.customer_phone}</div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-900">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-medium text-gray-900">
                      {formatCurrency(order.total_amount)}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.order_status]}`}>
                        {getStatusIcon(order.order_status)}
                        <span className="ml-1.5 capitalize">{order.order_status}</span>
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${paymentStatusColors[order.payment_status]}`}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order)
                            setShowOrderDetail(true)
                          }}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <div className="relative group">
                          <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                            <div className="py-1">
                              <button
                                onClick={() => handleStatusUpdate(order.id, 'confirmed')}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                Mark Confirmed
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(order.id, 'shipped')}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                Mark Shipped
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(order.id, 'delivered')}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                Mark Delivered
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                Cancel Order
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} orders
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i
              if (page > totalPages) return null
              
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                    page === currentPage
                      ? 'bg-sage-600 text-white border-sage-600'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              )
            })}

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      <AnimatePresence>
        {showOrderDetail && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowOrderDetail(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    Order {selectedOrder.order_number}
                  </h2>
                  <button
                    onClick={() => setShowOrderDetail(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Order Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Name:</span> {selectedOrder.customer_name}</div>
                      <div><span className="font-medium">Phone:</span> {selectedOrder.customer_phone}</div>
                      {selectedOrder.customer_email && (
                        <div><span className="font-medium">Email:</span> {selectedOrder.customer_email}</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Order Information</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Date:</span> {new Date(selectedOrder.created_at).toLocaleDateString()}</div>
                      <div><span className="font-medium">Status:</span> 
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${statusColors[selectedOrder.order_status]}`}>
                          {selectedOrder.order_status}
                        </span>
                      </div>
                      <div><span className="font-medium">Payment:</span> 
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${paymentStatusColors[selectedOrder.payment_status]}`}>
                          {selectedOrder.payment_status}
                        </span>
                      </div>
                      <div><span className="font-medium">Total:</span> {formatCurrency(selectedOrder.total_amount)}</div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {selectedOrder.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-600">
                            Size: {item.size} | Quantity: {item.quantity}
                          </div>
                        </div>
                        <div className="font-medium">
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowOrderDetail(false)}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      // Handle print invoice
                      window.print()
                    }}
                    className="px-4 py-2 text-white bg-sage-600 rounded-lg hover:bg-sage-700 transition-colors"
                  >
                    Print Invoice
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
