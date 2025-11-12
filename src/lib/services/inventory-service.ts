import { supabase } from '../supabase/client'
import { Product, InventoryItem } from '../types'

export interface InventoryAlert {
  id: string
  product_id: string
  product_name: string
  size: string
  color_name: string
  current_stock: number
  threshold: number
  severity: 'low' | 'critical' | 'out_of_stock'
}

export interface StockMovement {
  product_id: string
  size: string
  color_index: number
  quantity_change: number
  movement_type: 'restock' | 'sale' | 'adjustment' | 'return'
  reason?: string
  reference_order_id?: string
}

export interface InventoryFilters {
  product_id?: string
  low_stock_only?: boolean
  out_of_stock_only?: boolean
  category?: string
  search?: string
  limit?: number
  offset?: number
}

export class InventoryService {
  
  // Get inventory with filters
  static async getInventory(filters: InventoryFilters = {}): Promise<{ data: any[] | null; error: string | null; count?: number }> {
    try {
      if (!supabase) {
        return { data: null, error: 'Database service not available' }
      }

      let query = supabase
        .from('inventory')
        .select(`
          *,
          products (
            id,
            name_he,
            name_ar,
            name_en,
            category,
            sku,
            colors,
            images
          )
        `, { count: 'exact' })
        .order('last_updated', { ascending: false })

      // Apply filters
      if (filters.product_id) {
        query = query.eq('product_id', filters.product_id)
      }
      
      if (filters.low_stock_only) {
        // Filter for items where stock is less than or equal to their threshold
        query = query.filter('stock_quantity', 'lte', 10) // Use fixed threshold for now
      }
      
      if (filters.out_of_stock_only) {
        query = query.eq('stock_quantity', 0)
      }

      // Pagination
      if (filters.limit) {
        query = query.limit(filters.limit)
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1)
      }

      const { data, error, count } = await query

      if (error) {
        return { data: null, error: error.message }
      }

      return { data, error: null, count: count || 0 }
    } catch (error) {
      return { data: null, error: (error as Error).message }
    }
  }

  // Get inventory alerts
  static async getInventoryAlerts(): Promise<{ data: InventoryAlert[] | null; error: string | null }> {
    try {
      if (!supabase) {
        return { data: null, error: 'Database service not available' }
      }

      const { data, error } = await supabase
        .from('inventory')
        .select(`
          *,
          products (
            id,
            name_he,
            name_ar,
            name_en,
            colors
          )
        `)
        .filter('stock_quantity', 'lte', 10)
        .order('stock_quantity', { ascending: true })

      if (error) {
        return { data: null, error: error.message }
      }

      // Transform data into alerts
      const alerts: InventoryAlert[] = data.map(item => {
        const product = item.products as any
        const colors = product.colors || []
        const colorName = colors[item.color_index]?.name?.he || `Color ${item.color_index + 1}`
        
        let severity: 'low' | 'critical' | 'out_of_stock' = 'low'
        if (item.stock_quantity === 0) {
          severity = 'out_of_stock'
        } else if (item.stock_quantity <= Math.floor(item.low_stock_threshold / 2)) {
          severity = 'critical'
        }

        return {
          id: item.id,
          product_id: item.product_id,
          product_name: product.name_he,
          size: item.size,
          color_name: colorName,
          current_stock: item.stock_quantity,
          threshold: item.low_stock_threshold,
          severity
        }
      })

      return { data: alerts, error: null }
    } catch (error) {
      return { data: null, error: (error as Error).message }
    }
  }

  // Update stock levels
  static async updateStock(
    productId: string,
    size: string,
    colorIndex: number,
    newQuantity: number,
    reason?: string
  ): Promise<{ data: InventoryItem | null; error: string | null }> {
    try {
      if (!supabase) {
        return { data: null, error: 'Database service not available' }
      }

      const { data, error } = await supabase
        .from('inventory')
        .update({
          stock_quantity: newQuantity,
          last_updated: new Date().toISOString()
        })
        .eq('product_id', productId)
        .eq('size', size)
        .eq('color_index', colorIndex)
        .select()
        .single()

      if (error) {
        return { data: null, error: error.message }
      }

      // Log stock movement
      await this.logStockMovement({
        product_id: productId,
        size,
        color_index: colorIndex,
        quantity_change: newQuantity - (data.stock_quantity || 0),
        movement_type: 'adjustment',
        reason
      })

      return { data, error: null }
    } catch (error) {
      return { data: null, error: (error as Error).message }
    }
  }

  // Bulk update stock levels
  static async bulkUpdateStock(updates: Array<{
    product_id: string
    size: string
    color_index: number
    quantity: number
    reason?: string
  }>): Promise<{ success: boolean; error: string | null }> {
    try {
      for (const update of updates) {
        const result = await this.updateStock(
          update.product_id,
          update.size,
          update.color_index,
          update.quantity,
          update.reason
        )
        
        if (result.error) {
          return { success: false, error: result.error }
        }
      }

      return { success: true, error: null }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }

  // Restock items
  static async restockItems(restocks: Array<{
    product_id: string
    size: string
    color_index: number
    quantity_to_add: number
    cost_per_unit?: number
  }>): Promise<{ success: boolean; error: string | null }> {
    try {
      if (!supabase) {
        return { success: false, error: 'Database service not available' }
      }

      for (const restock of restocks) {
        // Get current stock
        const { data: current } = await supabase
          .from('inventory')
          .select('stock_quantity')
          .eq('product_id', restock.product_id)
          .eq('size', restock.size)
          .eq('color_index', restock.color_index)
          .single()

        if (!current) {
          continue
        }

        const newQuantity = current.stock_quantity + restock.quantity_to_add

        const updateData: any = {
          stock_quantity: newQuantity,
          last_updated: new Date().toISOString(),
          last_restocked: new Date().toISOString()
        }

        if (restock.cost_per_unit) {
          updateData.cost_per_unit = restock.cost_per_unit
        }

        const { error } = await supabase
          .from('inventory')
          .update(updateData)
          .eq('product_id', restock.product_id)
          .eq('size', restock.size)
          .eq('color_index', restock.color_index)

        if (error) {
          return { success: false, error: error.message }
        }

        // Log stock movement
        await this.logStockMovement({
          product_id: restock.product_id,
          size: restock.size,
          color_index: restock.color_index,
          quantity_change: restock.quantity_to_add,
          movement_type: 'restock'
        })
      }

      return { success: true, error: null }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }

  // Update low stock thresholds
  static async updateLowStockThreshold(
    productId: string,
    size: string,
    colorIndex: number,
    threshold: number
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      if (!supabase) {
        return { success: false, error: 'Database service not available' }
      }

      const { error } = await supabase
        .from('inventory')
        .update({
          low_stock_threshold: threshold,
          last_updated: new Date().toISOString()
        })
        .eq('product_id', productId)
        .eq('size', size)
        .eq('color_index', colorIndex)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, error: null }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }

  // Get stock movements history
  static async getStockMovements(productId?: string, limit: number = 100): Promise<{ data: any[] | null; error: string | null }> {
    try {
      // This would require a separate stock_movements table in a full implementation
      // For now, we'll return a placeholder
      return { data: [], error: null }
    } catch (error) {
      return { data: null, error: (error as Error).message }
    }
  }

  // Check if product variant is in stock
  static async checkStock(
    productId: string,
    size: string,
    colorIndex: number,
    requestedQuantity: number = 1
  ): Promise<{ inStock: boolean; availableQuantity: number; error: string | null }> {
    try {
      if (!supabase) {
        return { inStock: false, availableQuantity: 0, error: 'Database service not available' }
      }

      const { data, error } = await supabase
        .from('inventory')
        .select('stock_quantity, reserved_quantity')
        .eq('product_id', productId)
        .eq('size', size)
        .eq('color_index', colorIndex)
        .single()

      if (error) {
        return { inStock: false, availableQuantity: 0, error: error.message }
      }

      const availableQuantity = (data.stock_quantity || 0) - (data.reserved_quantity || 0)
      const inStock = availableQuantity >= requestedQuantity

      return { inStock, availableQuantity, error: null }
    } catch (error) {
      return { inStock: false, availableQuantity: 0, error: (error as Error).message }
    }
  }

  // Reserve stock for order
  static async reserveStock(items: Array<{
    product_id: string
    size: string
    color_index: number
    quantity: number
  }>): Promise<{ success: boolean; error: string | null }> {
    try {
      if (!supabase) {
        return { success: false, error: 'Database service not available' }
      }

      for (const item of items) {
        // Get current reserved quantity
        const { data: current } = await supabase
          .from('inventory')
          .select('reserved_quantity')
          .eq('product_id', item.product_id)
          .eq('size', item.size)
          .eq('color_index', item.color_index)
          .single()

        if (!current) {
          return { success: false, error: 'Inventory item not found' }
        }

        const newReservedQuantity = (current.reserved_quantity || 0) + item.quantity

        const { error } = await supabase
          .from('inventory')
          .update({
            reserved_quantity: newReservedQuantity,
            last_updated: new Date().toISOString()
          })
          .eq('product_id', item.product_id)
          .eq('size', item.size)
          .eq('color_index', item.color_index)

        if (error) {
          return { success: false, error: error.message }
        }
      }

      return { success: true, error: null }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }

  // Release reserved stock
  static async releaseReservedStock(items: Array<{
    product_id: string
    size: string
    color_index: number
    quantity: number
  }>): Promise<{ success: boolean; error: string | null }> {
    try {
      if (!supabase) {
        return { success: false, error: 'Database service not available' }
      }

      for (const item of items) {
        // Get current reserved quantity
        const { data: current } = await supabase
          .from('inventory')
          .select('reserved_quantity')
          .eq('product_id', item.product_id)
          .eq('size', item.size)
          .eq('color_index', item.color_index)
          .single()

        if (!current) {
          return { success: false, error: 'Inventory item not found' }
        }

        const newReservedQuantity = Math.max(0, (current.reserved_quantity || 0) - item.quantity)

        const { error } = await supabase
          .from('inventory')
          .update({
            reserved_quantity: newReservedQuantity,
            last_updated: new Date().toISOString()
          })
          .eq('product_id', item.product_id)
          .eq('size', item.size)
          .eq('color_index', item.color_index)

        if (error) {
          return { success: false, error: error.message }
        }
      }

      return { success: true, error: null }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }

  // Get inventory summary
  static async getInventorySummary(): Promise<{ data: any | null; error: string | null }> {
    try {
      if (!supabase) {
        return { data: null, error: 'Database service not available' }
      }

      const { data, error } = await supabase
        .from('inventory')
        .select('stock_quantity, reserved_quantity, low_stock_threshold')

      if (error) {
        return { data: null, error: error.message }
      }

      const totalItems = data.length
      const totalStock = data.reduce((sum, item) => sum + item.stock_quantity, 0)
      const totalReserved = data.reduce((sum, item) => sum + item.reserved_quantity, 0)
      const lowStockItems = data.filter(item => item.stock_quantity <= item.low_stock_threshold).length
      const outOfStockItems = data.filter(item => item.stock_quantity === 0).length

      return {
        data: {
          totalItems,
          totalStock,
          totalReserved,
          availableStock: totalStock - totalReserved,
          lowStockItems,
          outOfStockItems,
          stockValue: 0 // Would need cost calculation
        },
        error: null
      }
    } catch (error) {
      return { data: null, error: (error as Error).message }
    }
  }

  // Private helper methods
  private static async logStockMovement(movement: StockMovement) {
    try {
      // In a full implementation, this would log to a stock_movements table
      console.log('Stock movement logged:', movement)
    } catch (error) {
      console.error('Error logging stock movement:', error)
    }
  }
}
