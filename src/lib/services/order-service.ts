import { supabase } from '../supabase/client'
import { Order, OrderItem, OrderStatus, PaymentStatus } from '../types'
import { WhatsAppService } from './whatsapp-service'

export interface CreateOrderData {
  customer_name: string
  customer_phone: string
  customer_email?: string
  shipping_address: {
    street: string
    city: string
    postal_code?: string
    country: string
    apartment?: string
    floor?: string
    instructions?: string
  }
  billing_address?: any
  items: OrderItem[]
  payment_method: 'credit_card' | 'cash_on_delivery' | 'bank_transfer'
  discount_code?: string
  notes?: string
}

export interface OrderFilters {
  status?: OrderStatus[]
  payment_status?: PaymentStatus[]
  date_from?: string
  date_to?: string
  customer_phone?: string
  order_number?: string
  limit?: number
  offset?: number
}

export class OrderService {
  
  // Create a new order
  static async createOrder(orderData: CreateOrderData): Promise<{ data: Order | null; error: string | null }> {
    try {
      if (!supabase) {
        return { data: null, error: 'Database service not available' }
      }

      // Generate order number
      const { data: orderNumberData } = await supabase.rpc('generate_order_number')
      const orderNumber = orderNumberData || `MIN${Date.now()}`

      // Calculate totals
      const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const shippingCost = subtotal >= 300 ? 0 : 30 // Free shipping over ₪300
      const taxAmount = subtotal * 0.17 // 17% VAT
      const discountAmount = 0 // TODO: Implement discount logic
      const totalAmount = subtotal + shippingCost + taxAmount - discountAmount

      // Create order
      const { data, error } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_name: orderData.customer_name,
          customer_phone: orderData.customer_phone,
          customer_email: orderData.customer_email,
          shipping_address: orderData.shipping_address,
          billing_address: orderData.billing_address || orderData.shipping_address,
          items: orderData.items,
          subtotal,
          shipping_cost: shippingCost,
          tax_amount: taxAmount,
          discount_amount: discountAmount,
          total_amount: totalAmount,
          payment_method: orderData.payment_method,
          payment_status: orderData.payment_method === 'cash_on_delivery' ? 'pending' : 'pending',
          order_status: 'pending',
          notes: orderData.notes
        })
        .select()
        .single()

      if (error) {
        return { data: null, error: error.message }
      }

      // Update customer data if exists
      await this.updateCustomerData(orderData.customer_phone, {
        name: orderData.customer_name,
        email: orderData.customer_email,
        total_spent: totalAmount
      })

      // Send notifications
      await this.sendOrderNotifications(data)

      return { data, error: null }
    } catch (error) {
      return { data: null, error: (error as Error).message }
    }
  }

  // Get orders with filters
  static async getOrders(filters: OrderFilters = {}): Promise<{ data: Order[] | null; error: string | null; count?: number }> {
    try {
      if (!supabase) {
        return { data: null, error: 'Database service not available' }
      }

      let query = supabase
        .from('orders')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })

      // Apply filters
      if (filters.status?.length) {
        query = query.in('order_status', filters.status)
      }
      if (filters.payment_status?.length) {
        query = query.in('payment_status', filters.payment_status)
      }
      if (filters.date_from) {
        query = query.gte('created_at', filters.date_from)
      }
      if (filters.date_to) {
        query = query.lte('created_at', filters.date_to)
      }
      if (filters.customer_phone) {
        query = query.ilike('customer_phone', `%${filters.customer_phone}%`)
      }
      if (filters.order_number) {
        query = query.ilike('order_number', `%${filters.order_number}%`)
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

  // Get single order by ID
  static async getOrder(orderId: string): Promise<{ data: Order | null; error: string | null }> {
    try {
      if (!supabase) {
        return { data: null, error: 'Database service not available' }
      }

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single()

      if (error) {
        return { data: null, error: error.message }
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error: (error as Error).message }
    }
  }

    // Update order status
  static async updateOrderStatus(
    orderId: string, 
    status: OrderStatus, 
    trackingNumber?: string,
    estimatedDelivery?: string
  ): Promise<{ data: Order | null; error: string | null }> {
    try {
      if (!supabase) {
        return { data: null, error: 'Database service not available' }
      }

      const updateData: any = { 
        order_status: status,
        updated_at: new Date().toISOString()
      }
      
      if (trackingNumber) {
        updateData.tracking_number = trackingNumber
      }
      if (estimatedDelivery) {
        updateData.estimated_delivery = estimatedDelivery
      }
      if (status === 'delivered') {
        updateData.actual_delivery = new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId)
        .select()
        .single()

      if (error) {
        return { data: null, error: error.message }
      }

      // Send status update notifications
      await this.sendStatusUpdateNotifications(data, status)

      return { data, error: null }
    } catch (error) {
      return { data: null, error: (error as Error).message }
    }
  }

  // Update payment status
  static async updatePaymentStatus(
    orderId: string, 
    paymentStatus: PaymentStatus
  ): Promise<{ data: Order | null; error: string | null }> {
    try {
      if (!supabase) {
        return { data: null, error: 'Database service not available' }
      }

      const { data, error } = await supabase
        .from('orders')
        .update({ 
          payment_status: paymentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single()

      if (error) {
        return { data: null, error: error.message }
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error: (error as Error).message }
    }
  }

  // Cancel order
  static async cancelOrder(orderId: string, reason?: string): Promise<{ data: Order | null; error: string | null }> {
    try {
      if (!supabase) {
        return { data: null, error: 'Database service not available' }
      }

      const { data, error } = await supabase
        .from('orders')
        .update({ 
          order_status: 'cancelled',
          notes: reason ? `Cancelled: ${reason}` : 'Cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single()

      if (error) {
        return { data: null, error: error.message }
      }

      // Restore inventory
      await this.restoreInventoryFromOrder(data)

      return { data, error: null }
    } catch (error) {
      return { data: null, error: (error as Error).message }
    }
  }

  // Get order analytics
  static async getOrderAnalytics(dateFrom?: string, dateTo?: string) {
    try {
      if (!supabase) {
        return { data: null, error: 'Database service not available' }
      }

      let query = supabase
        .from('orders')
        .select('total_amount, order_status, payment_status, created_at')

      if (dateFrom) {
        query = query.gte('created_at', dateFrom)
      }
      if (dateTo) {
        query = query.lte('created_at', dateTo)
      }

      const { data, error } = await query

      if (error) {
        return { data: null, error: error.message }
      }

      // Calculate analytics
      const totalRevenue = data.reduce((sum, order) => 
        order.payment_status === 'completed' ? sum + parseFloat(order.total_amount) : sum, 0
      )
      
      const ordersByStatus = data.reduce((acc, order) => {
        acc[order.order_status] = (acc[order.order_status] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const averageOrderValue = data.length > 0 ? totalRevenue / data.length : 0

      return {
        data: {
          totalRevenue,
          totalOrders: data.length,
          averageOrderValue,
          ordersByStatus,
          conversionRate: data.length > 0 ? (ordersByStatus.completed || 0) / data.length : 0
        },
        error: null
      }
    } catch (error) {
      return { data: null, error: (error as Error).message }
    }
  }

  // Private helper methods
  private static async updateCustomerData(phone: string, data: any) {
    try {
      if (!supabase) return

      const { data: existing } = await supabase
        .from('customers')
        .select('*')
        .eq('phone', phone)
        .single()

      if (existing) {
        await supabase
          .from('customers')
          .update({
            name: data.name || existing.name,
            email: data.email || existing.email,
            total_spent: (parseFloat(existing.total_spent) || 0) + (data.total_spent || 0),
            order_count: (existing.order_count || 0) + 1,
            last_order_date: new Date().toISOString()
          })
          .eq('phone', phone)
      } else {
        await supabase
          .from('customers')
          .insert({
            phone,
            name: data.name,
            email: data.email,
            total_spent: data.total_spent || 0,
            order_count: 1,
            last_order_date: new Date().toISOString()
          })
      }
    } catch (error) {
      console.error('Error updating customer data:', error)
    }
  }

  private static async sendOrderNotifications(order: Order) {
    try {
      console.log('Sending order notifications for:', order.order_number)
      
      // Send WhatsApp order confirmation
      if (WhatsAppService.isReady() && order.customer_phone) {
        const result = await WhatsAppService.sendOrderConfirmation(
          order.customer_phone,
          order.order_number,
          order.customer_name,
          order.total_amount,
          '₪'
        )
        
        if (result.success) {
          console.log('WhatsApp order confirmation sent successfully')
        } else {
          console.error('Failed to send WhatsApp confirmation:', result.error)
        }
      }
      
      // TODO: Implement SMS and Email notifications as fallback
    } catch (error) {
      console.error('Error sending order notifications:', error)
    }
  }

  private static async sendStatusUpdateNotifications(order: Order, status: OrderStatus) {
    try {
      console.log('Sending status update notifications for:', order.order_number, status)
      
      // Send WhatsApp status updates for shipped orders
      if (WhatsAppService.isReady() && order.customer_phone && status === 'shipped') {
        const result = await WhatsAppService.sendShippingNotification(
          order.customer_phone,
          order.order_number,
          order.customer_name,
          order.tracking_number || undefined
        )
        
        if (result.success) {
          console.log('WhatsApp shipping notification sent successfully')
        } else {
          console.error('Failed to send WhatsApp shipping notification:', result.error)
        }
      }
      
      // TODO: Implement SMS and Email status notifications
    } catch (error) {
      console.error('Error sending status update notifications:', error)
    }
  }

  private static async restoreInventoryFromOrder(order: Order) {
    try {
      if (!supabase) return

      for (const item of order.items as OrderItem[]) {
        // Get current stock first
        const { data: current } = await supabase
          .from('inventory')
          .select('stock_quantity')
          .eq('product_id', item.product_id)
          .eq('size', item.size)
          .eq('color_index', item.color_index)
          .single()

        if (current) {
          await supabase
            .from('inventory')
            .update({
              stock_quantity: current.stock_quantity + item.quantity,
              last_updated: new Date().toISOString()
            })
            .eq('product_id', item.product_id)
            .eq('size', item.size)
            .eq('color_index', item.color_index)
        }
      }
    } catch (error) {
      console.error('Error restoring inventory:', error)
    }
  }
}
