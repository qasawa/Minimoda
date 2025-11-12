'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit2, 
  Trash2,
  Eye,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAdmin } from '@/lib/contexts/admin-context'
import { productService } from '@/lib/supabase/products-service'
import { InventoryService } from '@/lib/services/inventory-service'
import { ImageUpload } from '@/components/ui/image-upload'

interface ProductWithStock {
  id: string
  name: { en: string; he: string; ar: string }
  category: string
  price: number
  stock: number
  status: 'active' | 'draft' | 'out_of_stock' | 'low_stock' | 'in_stock' | 'unknown'
  images: string[]
  sales: number
  views: number
  available?: number
  reserved?: number
}

export default function ProductsAdminPage() {
  const { setActiveSection } = useAdmin()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [adminProducts, setAdminProducts] = useState<ProductWithStock[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [productImages, setProductImages] = useState<string[]>([])

  // Load products from database
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await productService.getAll('en')
        const transformedProducts: ProductWithStock[] = products.map(product => ({
          ...product,
          stock: 0, // Will be updated from inventory service
          status: product.isSale ? 'active' : 'active', // All products from DB are active
          sales: 0, // Will be updated from order data
          views: 0 // Will be updated from analytics
        }))
        
        // Get real inventory and sales data for each product
        for (const product of transformedProducts) {
          try {
            // Get real inventory data using InventoryService
            const { data: inventory, error } = await InventoryService.getInventory()
            if (!error && inventory) {
              const productInventory = inventory.filter(item => item.product_id === product.id)
              const totalStock = productInventory.reduce((sum, item) => sum + (item.stock_quantity || 0), 0)
              const reservedStock: number = 0 // Reserved quantity not implemented yet
              
              // Add dynamic properties
              product.stock = totalStock
              product.reserved = reservedStock
              product.available = totalStock - reservedStock
              
              // Set status based on stock and low stock thresholds
              const hasLowStock = productInventory.some(item => 
                item.stock_quantity <= (item.low_stock_threshold || 5)
              )
              
              if (totalStock === 0) {
                product.status = 'out_of_stock'
              } else if (hasLowStock) {
                product.status = 'low_stock'
              } else {
                product.status = 'in_stock'
              }
            } else {
              product.stock = 0
              product.available = 0
              product.reserved = 0
              product.status = 'unknown'
            }
          } catch (error) {
            console.log(`Could not load inventory for product ${product.id}`)
            product.stock = 0
            product.available = 0 
            product.reserved = 0
            product.status = 'unknown'
          }
        }
        setAdminProducts(transformedProducts)
      } catch (error) {
        console.error('Error loading products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [])

  // Filter products
  const filteredProducts = useMemo(() => {
    return adminProducts.filter(product => {
      const matchesSearch = product.name.en.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = filterCategory === 'all' || product.category === filterCategory
      const matchesStatus = filterStatus === 'all' || product.status === filterStatus
      
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [adminProducts, searchTerm, filterCategory, filterStatus])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>
      case 'out_of_stock':
        return <Badge className="bg-red-100 text-red-800">Out of Stock</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  React.useEffect(() => {
    setActiveSection('products')
  }, [setActiveSection])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage your product inventory and listings</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => window.open('/en/brands', '_blank')}
            variant="outline"
            className="border-purple-200 text-purple-600 hover:bg-purple-50"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Brands Page
          </Button>
          <Button 
            className="bg-coral-500 hover:bg-coral-600"
            onClick={() => setShowAddProduct(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
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
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{adminProducts.length}</p>
            </div>
            <Package className="h-8 w-8 text-coral-500" />
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
              <p className="text-sm text-gray-600">Active Products</p>
              <p className="text-2xl font-bold text-gray-900">
                {adminProducts.filter(p => p.status === 'active').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
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
              <p className="text-2xl font-bold text-gray-900">
                {adminProducts.filter(p => p.stock < 10).length}
              </p>
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
              <p className="text-sm text-gray-600">Draft Products</p>
              <p className="text-2xl font-bold text-gray-900">
                {adminProducts.filter(p => p.status === 'draft').length}
              </p>
            </div>
            <Edit2 className="h-8 w-8 text-blue-500" />
          </div>
        </motion.div>
      </div>

      {/* Quick Category Navigation */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Website Category Pages</h3>
        <p className="text-sm text-gray-600 mb-4">Preview how your products appear on the website</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button 
            onClick={() => window.open('/en/boys', '_blank')}
            variant="outline"
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            Boys Collection
          </Button>
          <Button 
            onClick={() => window.open('/en/girls', '_blank')}
            variant="outline"
            className="border-pink-200 text-pink-600 hover:bg-pink-50"
          >
            Girls Collection
          </Button>
          <Button 
            onClick={() => window.open('/en/category/baby', '_blank')}
            variant="outline"
            className="border-yellow-200 text-yellow-600 hover:bg-yellow-50"
          >
            Baby Collection
          </Button>
          <Button 
            onClick={() => window.open('/en/new', '_blank')}
            variant="outline"
            className="border-green-200 text-green-600 hover:bg-green-50"
          >
            New Arrivals
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
              />
            </div>
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
          >
            <option value="all">All Categories</option>
            <option value="boys">Boys</option>
            <option value="girls">Girls</option>
            <option value="baby">Baby</option>
            <option value="unisex">Unisex</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
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
                <th className="text-left py-3 px-6 font-medium text-gray-700">Category</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Price</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Stock</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Performance</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={product.images[0]} 
                        alt={product.name.en}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{product.name.en}</div>
                        <div className="text-sm text-gray-500">ID: {product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant="outline">{product.category}</Badge>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium">₪{product.price}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className={`font-medium ${product.stock < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                      {product.stock}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {getStatusBadge(product.status)}
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-3 w-3" />
                        <span>{product.sales} sales</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Eye className="h-3 w-3" />
                        <span>{product.views} views</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Product</h2>
            
            <form onSubmit={async (e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              
              // Parse smart categories
              const smartCategoriesSelect = formData.getAll('smart_categories')
              const smartCategories = Array.from(smartCategoriesSelect)
              
              // Parse tags
              const tagsInput = formData.get('tags') as string
              const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()) : []
              
              // Auto-add sale tag if on sale
              const isSale = formData.get('is_sale') === 'on'
              const finalTags = [...tags]
              if (isSale && !finalTags.includes('sale')) {
                finalTags.push('sale')
              }
              
              // Auto-add new tag if new arrival
              const isNew = formData.get('is_new') === 'on'
              if (isNew && !finalTags.includes('new')) {
                finalTags.push('new')
              }

              const productData = {
                name_en: formData.get('name_en'),
                name_he: formData.get('name_he') || formData.get('name_en') || '',
                name_ar: formData.get('name_ar') || formData.get('name_en') || '',
                description_en: formData.get('description_en'),
                description_he: formData.get('description_he') || formData.get('description_en') || '',
                description_ar: formData.get('description_ar') || formData.get('description_en') || '',
                price: parseFloat(formData.get('price') as string),
                original_price: parseFloat(formData.get('original_price') as string) || null,
                category: formData.get('category'),
                brand: formData.get('brand') || null,
                images: productImages.length > 0 ? productImages : ['https://via.placeholder.com/400'],
                colors: ['Default'],
                sizes: (formData.get('sizes') as string)?.split(',').map(s => s.trim()) || ['One Size'],
                is_sale: isSale,
                is_new: isNew,
                is_featured: formData.get('is_featured') === 'on',
                is_active: true,
                age_group: formData.get('age_group') || '2-8',
                sort_order: adminProducts.length + 1,
                // NEW: Smart category and tag support
                smart_categories: smartCategories,
                tags: finalTags
              }
              
              try {
                await productService.create(productData)
                // Reload products
                const products = await productService.getAll('en')
                const transformedProducts: ProductWithStock[] = products.map(product => ({
                  ...product,
                  stock: Math.floor(Math.random() * 100) + 1,
                  status: product.isSale ? 'active' : Math.random() > 0.8 ? 'draft' : 'active',
                  sales: Math.floor(Math.random() * 500),
                  views: Math.floor(Math.random() * 2000)
                }))
                setAdminProducts(transformedProducts)
                setProductImages([])
                setShowAddProduct(false)
                alert('Product added successfully!')
              } catch (error) {
                console.error('Error adding product:', error)
                alert('Error adding product. Please try again.')
              }
            }} className="space-y-4">
              
              {/* Product Names - All Languages */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Product Names</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      English Name *
                    </label>
                    <input
                      type="text"
                      name="name_en"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                      placeholder="Enter English name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hebrew Name (עברית)
                    </label>
                    <input
                      type="text"
                      name="name_he"
                      dir="rtl"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                      placeholder="הכנס שם בעברית"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Arabic Name (العربية)
                    </label>
                    <input
                      type="text"
                      name="name_ar"
                      dir="rtl"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                      placeholder="أدخل الاسم بالعربية"
                    />
                  </div>
                </div>
              </div>

              {/* Smart Category Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Category & Targeting</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Primary Category *
                    </label>
                    <select 
                      name="category" 
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                    >
                      <option value="">Select Primary Category</option>
                      <option value="boys">Boys - Basic boys clothing</option>
                      <option value="girls">Girls - Basic girls clothing</option>
                      <option value="baby">Baby - Infant clothing 0-24mo</option>
                      <option value="unisex">Unisex - Gender neutral items</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Smart Categories *
                    </label>
                    <select 
                      name="smart_categories" 
                      multiple
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-coral-500 focus:border-coral-500 h-32"
                      title="Hold Ctrl/Cmd to select multiple"
                    >
                      <option value="boys-zone">Boys Zone - Active wear for boys</option>
                      <option value="girls-world">Girls World - Fashion for girls</option>
                      <option value="tiny-treasures">Tiny Treasures - Baby essentials</option>
                      <option value="smart-deals">Smart Deals - 30%+ off items</option>
                      <option value="special-moments">Special Moments - Holiday/formal wear</option>
                      <option value="cozy-corner">Cozy Corner - Pajamas/loungewear</option>
                      <option value="new-drops">New Drops - Latest arrivals</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple categories</p>
                  </div>
                </div>
              </div>

              {/* Tags System */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Tags *
                </label>
                <input
                  type="text"
                  name="tags"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                  placeholder="e.g., casual, cotton, formal, dressy, pajamas, sleepwear, holiday, special"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate tags with commas. Required for smart categories:
                  <br />• <strong>Special Moments:</strong> formal, holiday, special, dressy
                  <br />• <strong>Cozy Corner:</strong> pajamas, sleepwear, loungewear, home
                  <br />• <strong>Smart Deals:</strong> Will auto-add &apos;sale&apos; tag if on sale
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                    placeholder="Enter brand name (e.g. Nike, Adidas)"
                  />
                </div>
              </div>

              {/* Product Descriptions - All Languages */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Product Descriptions</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      English Description *
                    </label>
                    <textarea
                      name="description_en"
                      required
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                      placeholder="Enter English description"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hebrew Description (עברית)
                    </label>
                    <textarea
                      name="description_he"
                      rows={3}
                      dir="rtl"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                      placeholder="הכנס תיאור בעברית"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Arabic Description (العربية)
                    </label>
                    <textarea
                      name="description_ar"
                      rows={3}
                      dir="rtl"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                      placeholder="أدخل الوصف بالعربية"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₪) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Original Price (₪)
                  </label>
                  <input
                    type="number"
                    name="original_price"
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age Group
                  </label>
                  <select 
                    name="age_group"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                  >
                    <option value="0-2">0-2 years</option>
                    <option value="2-8">2-8 years</option>
                    <option value="8-14">8-14 years</option>
                    <option value="14+">14+ years</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images *
                </label>
                <ImageUpload
                  value={productImages}
                  onChange={setProductImages}
                  maxFiles={4}
                  accept="image/*"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sizes (comma separated)
                </label>
                <input
                  type="text"
                  name="sizes"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                  placeholder="XS, S, M, L, XL"
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center">
                  <input type="checkbox" name="is_sale" className="mr-2" />
                  <span className="text-sm text-gray-700">On Sale</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="is_new" className="mr-2" />
                  <span className="text-sm text-gray-700">New Arrival</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="is_featured" className="mr-2" />
                  <span className="text-sm text-gray-700">Featured</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="bg-coral-500 hover:bg-coral-600 flex-1">
                  Add Product
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowAddProduct(false)
                    setProductImages([])
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
