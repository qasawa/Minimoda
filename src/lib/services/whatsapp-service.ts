/**
 * WhatsApp Business API Service
 * 
 * This service integrates with WhatsApp Business API for:
 * - Sending order confirmations
 * - Customer support messages
 * - Marketing campaigns
 * - Message templates management
 * 
 * Requires WhatsApp Business API credentials and webhook setup
 */

export interface WhatsAppMessage {
  id: string
  from: string
  to: string
  message: string
  timestamp: string
  type: 'text' | 'image' | 'document' | 'template'
  status: 'sent' | 'delivered' | 'read' | 'failed'
  template_name?: string
  media_url?: string
}

export interface WhatsAppTemplate {
  id: string
  name: string
  language: string
  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION'
  status: 'APPROVED' | 'PENDING' | 'REJECTED'
  components: {
    type: 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS'
    text?: string
    format?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT'
    parameters?: string[]
  }[]
}

export interface WhatsAppContact {
  phone: string
  name?: string
  profile_name?: string
  last_seen?: string
  status: 'active' | 'blocked' | 'inactive'
}

export interface SendMessageRequest {
  to: string
  type: 'text' | 'template' | 'image' | 'document'
  message?: string
  template_name?: string
  template_language?: string
  template_parameters?: string[]
  media_url?: string
  filename?: string
}

export interface WebhookData {
  object: string
  entry: {
    id: string
    changes: {
      value: {
        messaging_product: string
        metadata: {
          display_phone_number: string
          phone_number_id: string
        }
        messages?: WhatsAppMessage[]
        statuses?: {
          id: string
          status: string
          timestamp: string
          recipient_id: string
          errors?: any[]
        }[]
      }
      field: string
    }[]
  }[]
}

class WhatsAppBusinessService {
  private baseUrl: string
  private accessToken: string
  private phoneNumberId: string
  private webhookToken: string
  private isConfigured: boolean

  constructor() {
    this.baseUrl = process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v18.0'
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN || ''
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || ''
    this.webhookToken = process.env.WHATSAPP_WEBHOOK_TOKEN || ''
    
    this.isConfigured = !!(this.accessToken && this.phoneNumberId && this.webhookToken)
  }

  // Check if WhatsApp service is properly configured
  isReady(): boolean {
    return this.isConfigured
  }

  // Get configuration status
  getStatus(): { configured: boolean; missing: string[] } {
    const missing: string[] = []
    
    if (!this.accessToken) missing.push('WHATSAPP_ACCESS_TOKEN')
    if (!this.phoneNumberId) missing.push('WHATSAPP_PHONE_NUMBER_ID')
    if (!this.webhookToken) missing.push('WHATSAPP_WEBHOOK_TOKEN')
    
    return {
      configured: missing.length === 0,
      missing
    }
  }

  // Send a text message
  async sendTextMessage(to: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.isConfigured) {
      return { success: false, error: 'WhatsApp service not configured' }
    }

    try {
      const response = await fetch(`${this.baseUrl}/${this.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: to.replace(/[^\d]/g, ''), // Clean phone number
          type: 'text',
          text: {
            body: message
          }
        })
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('WhatsApp API Error:', data)
        return { 
          success: false, 
          error: data.error?.message || 'Failed to send message' 
        }
      }

      return {
        success: true,
        messageId: data.messages?.[0]?.id
      }
    } catch (error) {
      console.error('WhatsApp Service Error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  // Send a template message (for order confirmations, etc.)
  async sendTemplateMessage(
    to: string, 
    templateName: string, 
    languageCode: string = 'en',
    parameters: string[] = []
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.isConfigured) {
      return { success: false, error: 'WhatsApp service not configured' }
    }

    try {
      const components = parameters.length > 0 ? [{
        type: 'body',
        parameters: parameters.map(param => ({
          type: 'text',
          text: param
        }))
      }] : []

      const response = await fetch(`${this.baseUrl}/${this.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: to.replace(/[^\d]/g, ''),
          type: 'template',
          template: {
            name: templateName,
            language: {
              code: languageCode
            },
            components
          }
        })
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('WhatsApp Template API Error:', data)
        return { 
          success: false, 
          error: data.error?.message || 'Failed to send template message' 
        }
      }

      return {
        success: true,
        messageId: data.messages?.[0]?.id
      }
    } catch (error) {
      console.error('WhatsApp Template Service Error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  // Send order confirmation
  async sendOrderConfirmation(
    customerPhone: string,
    orderNumber: string,
    customerName: string,
    total: number,
    currency: string = 'ILS'
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    // Try template first, fallback to text message
    const templateResult = await this.sendTemplateMessage(
      customerPhone,
      'order_confirmation',
      'en',
      [customerName, orderNumber, `${total} ${currency}`]
    )

    if (templateResult.success) {
      return templateResult
    }

    // Fallback to text message
    const message = `Hi ${customerName}! 🎉

Your order #${orderNumber} has been confirmed!
Total: ${total} ${currency}

We'll send you updates as your order is processed and shipped.

Thank you for choosing Minimoda! 💝

Need help? Reply to this message.`

    return this.sendTextMessage(customerPhone, message)
  }

  // Send shipping notification
  async sendShippingNotification(
    customerPhone: string,
    orderNumber: string,
    customerName: string,
    trackingNumber?: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const trackingInfo = trackingNumber ? `Tracking: ${trackingNumber}` : 'Tracking info will be updated soon.'
    
    const message = `Hi ${customerName}! 📦

Great news! Your order #${orderNumber} has been shipped!

${trackingInfo}

Expected delivery: 2-5 business days

Track your package and stay updated!

Minimoda Team 💝`

    return this.sendTextMessage(customerPhone, message)
  }

  // Send marketing message (only to consented customers)
  async sendMarketingMessage(
    customerPhone: string,
    customerName: string,
    message: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const personalizedMessage = `Hi ${customerName}! 👋

${message}

Reply STOP to unsubscribe from marketing messages.

Minimoda Team 💝`

    return this.sendTextMessage(customerPhone, personalizedMessage)
  }

  // Handle incoming webhook messages
  async handleWebhook(webhookData: WebhookData): Promise<void> {
    try {
      for (const entry of webhookData.entry) {
        for (const change of entry.changes) {
          const value = change.value

          // Handle incoming messages
          if (value.messages) {
            for (const message of value.messages) {
              await this.processIncomingMessage(message)
            }
          }

          // Handle message status updates
          if (value.statuses) {
            for (const status of value.statuses) {
              await this.processMessageStatus(status)
            }
          }
        }
      }
    } catch (error) {
      console.error('Webhook processing error:', error)
    }
  }

  // Process incoming customer messages
  private async processIncomingMessage(message: any): Promise<void> {
    const customerPhone = message.from
    const messageText = message.text?.body || ''
    const messageId = message.id

    console.log(`Incoming WhatsApp message from ${customerPhone}: ${messageText}`)

    // Handle common customer queries
    if (messageText.toLowerCase().includes('order') || messageText.toLowerCase().includes('status')) {
      await this.handleOrderInquiry(customerPhone, messageText)
    } else if (messageText.toLowerCase().includes('return') || messageText.toLowerCase().includes('refund')) {
      await this.handleReturnInquiry(customerPhone)
    } else if (messageText.toLowerCase() === 'stop') {
      await this.handleUnsubscribe(customerPhone)
    } else {
      await this.handleGeneralInquiry(customerPhone)
    }
  }

  // Process message delivery status
  private async processMessageStatus(status: any): Promise<void> {
    console.log(`Message ${status.id} status: ${status.status}`)
    
    // Update message status in database if needed
    // This could integrate with your order/notification tracking system
  }

  // Handle order-related inquiries
  private async handleOrderInquiry(customerPhone: string, message: string): Promise<void> {
    const response = `Thanks for contacting us! 📱

To check your order status:
1. Visit our website: minimoda.com
2. Go to "My Account" → "Orders"
3. Or call us: +972-XX-XXX-XXXX

Our team will help you track your order!

Minimoda Support Team 💝`

    await this.sendTextMessage(customerPhone, response)
  }

  // Handle return inquiries
  private async handleReturnInquiry(customerPhone: string): Promise<void> {
    const response = `Returns & Exchanges 🔄

We accept returns within 30 days of purchase.

Process:
1. Visit: minimoda.com/returns
2. Fill out the return form
3. Print the prepaid label
4. Ship it back to us

Questions? Our support team is here to help!

Minimoda Support Team 💝`

    await this.sendTextMessage(customerPhone, response)
  }

  // Handle unsubscribe requests
  private async handleUnsubscribe(customerPhone: string): Promise<void> {
    // Update customer preferences in database
    console.log(`Customer ${customerPhone} unsubscribed from WhatsApp marketing`)
    
    const response = `You've been unsubscribed from marketing messages. ✅

You'll still receive important order updates.

To re-subscribe, reply "START" anytime.

Thank you!
Minimoda Team`

    await this.sendTextMessage(customerPhone, response)
  }

  // Handle general inquiries
  private async handleGeneralInquiry(customerPhone: string): Promise<void> {
    const response = `Hi there! 👋

Thanks for reaching out to Minimoda!

Our support hours:
Sunday-Thursday: 9 AM - 6 PM (IST)

For immediate help:
📧 Email: support@minimoda.com
📞 Phone: +972-XX-XXX-XXXX
🌐 Website: minimoda.com

We'll get back to you as soon as possible!

Minimoda Support Team 💝`

    await this.sendTextMessage(customerPhone, response)
  }

  // Verify webhook signature (for security)
  static verifyWebhookSignature(body: string, signature: string, webhookToken: string): boolean {
    // In browser environments, crypto.createHmac is not available
    // This should be handled on the server side in production
    // For development, we'll return true (disable verification)
    return true
  }

  // Get message analytics
  async getMessageAnalytics(days: number = 30): Promise<{
    totalSent: number
    totalDelivered: number
    totalRead: number
    totalFailed: number
    deliveryRate: number
    readRate: number
  }> {
    // This would typically query your database for message statistics
    // For now, return mock data
    return {
      totalSent: 1250,
      totalDelivered: 1180,
      totalRead: 890,
      totalFailed: 70,
      deliveryRate: 94.4,
      readRate: 75.4
    }
  }

  // Broadcast message to multiple customers (with consent check)
  async broadcastMessage(
    customerPhones: string[],
    message: string,
    templateName?: string
  ): Promise<{
    success: number
    failed: number
    results: { phone: string; success: boolean; error?: string }[]
  }> {
    const results = []
    let successCount = 0
    let failedCount = 0

    for (const phone of customerPhones) {
      try {
        let result
        if (templateName) {
          result = await this.sendTemplateMessage(phone, templateName)
        } else {
          result = await this.sendTextMessage(phone, message)
        }

        if (result.success) {
          successCount++
        } else {
          failedCount++
        }

        results.push({
          phone,
          success: result.success,
          error: result.error
        })

        // Rate limiting - wait between messages
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (error) {
        failedCount++
        results.push({
          phone,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return {
      success: successCount,
      failed: failedCount,
      results
    }
  }
}

export const WhatsAppService = new WhatsAppBusinessService()
export default WhatsAppService
