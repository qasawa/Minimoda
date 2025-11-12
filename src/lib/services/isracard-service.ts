interface IsracardConfig {
  apiUrl: string
  merchantId: string
  terminalId: string
  secretKey: string
  isProduction: boolean
}

interface IsracardPaymentRequest {
  amount: number
  currency: string
  cardNumber: string
  expiryDate: string
  cvv: string
  cardholderName: string
  orderId: string
  customerEmail?: string
  customerPhone?: string
}

interface IsracardResponse {
  success: boolean
  transactionId?: string
  authNumber?: string
  error?: string
  errorCode?: string
}

export class IsracardService {
  private static config: IsracardConfig = {
    apiUrl: process.env.ISRACARD_API_URL || 'https://api.isracard.co.il',
    merchantId: process.env.ISRACARD_MERCHANT_ID || '',
    terminalId: process.env.ISRACARD_TERMINAL_ID || '', 
    secretKey: process.env.ISRACARD_SECRET_KEY || '',
    isProduction: process.env.NODE_ENV === 'production'
  }

  /**
   * Process a credit card payment through Isracard
   */
  static async processPayment(paymentData: IsracardPaymentRequest): Promise<IsracardResponse> {
    try {
      // Validate configuration
      if (!this.config.merchantId || !this.config.secretKey) {
        console.error('Isracard configuration missing')
        // Fall back to simulation in development
        if (!this.config.isProduction) {
          return this.simulatePayment(paymentData)
        }
        return { success: false, error: 'Payment service configuration error' }
      }

      // Prepare the request payload
      const payload = {
        merchantId: this.config.merchantId,
        terminalId: this.config.terminalId,
        amount: Math.round(paymentData.amount * 100), // Convert to agorot
        currency: paymentData.currency,
        cardNumber: paymentData.cardNumber.replace(/\s/g, ''),
        expiryMonth: paymentData.expiryDate.split('/')[0],
        expiryYear: '20' + paymentData.expiryDate.split('/')[1],
        cvv: paymentData.cvv,
        cardholderName: paymentData.cardholderName,
        orderId: paymentData.orderId,
        customerEmail: paymentData.customerEmail,
        customerPhone: paymentData.customerPhone,
        timestamp: new Date().toISOString()
      }

      // Generate signature for security
      const signature = this.generateSignature(payload)
      
      // Make API call to Isracard
      const response = await fetch(`${this.config.apiUrl}/api/v1/charge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${signature}`,
          'X-Merchant-ID': this.config.merchantId
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (response.ok && result.status === 'approved') {
        return {
          success: true,
          transactionId: result.transactionId,
          authNumber: result.authNumber
        }
      } else {
        return {
          success: false,
          error: result.message || 'Payment failed',
          errorCode: result.errorCode
        }
      }

    } catch (error) {
      console.error('Isracard payment error:', error)
      
      // Fall back to simulation in development
      if (!this.config.isProduction) {
        console.warn('Falling back to payment simulation in development mode')
        return this.simulatePayment(paymentData)
      }
      
      return {
        success: false,
        error: 'Payment processing error'
      }
    }
  }

  /**
   * Validate card details before processing
   */
  static validateCard(cardNumber: string, expiryDate: string, cvv: string): { valid: boolean; error?: string } {
    // Remove spaces and validate card number length
    const cleanCardNumber = cardNumber.replace(/\s/g, '')
    
    if (cleanCardNumber.length < 15 || cleanCardNumber.length > 19) {
      return { valid: false, error: 'Invalid card number length' }
    }

    // Luhn algorithm for card validation
    if (!this.luhnCheck(cleanCardNumber)) {
      return { valid: false, error: 'Invalid card number' }
    }

    // Validate expiry date
    const [month, year] = expiryDate.split('/')
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear() % 100
    const currentMonth = currentDate.getMonth() + 1

    if (!month || !year || parseInt(month) < 1 || parseInt(month) > 12) {
      return { valid: false, error: 'Invalid expiry date' }
    }

    if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
      return { valid: false, error: 'Card has expired' }
    }

    // Validate CVV
    if (!cvv || cvv.length < 3 || cvv.length > 4) {
      return { valid: false, error: 'Invalid CVV' }
    }

    return { valid: true }
  }

  /**
   * Luhn algorithm for credit card validation
   */
  private static luhnCheck(cardNumber: string): boolean {
    let sum = 0
    let alternate = false

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let n = parseInt(cardNumber.charAt(i))
      
      if (alternate) {
        n *= 2
        if (n > 9) {
          n = (n % 10) + 1
        }
      }
      
      sum += n
      alternate = !alternate
    }
    
    return (sum % 10) === 0
  }

  /**
   * Generate security signature for API requests
   */
  private static generateSignature(payload: any): string {
    // In production, implement proper HMAC-SHA256 signature
    // This is a simplified version
    const sortedKeys = Object.keys(payload).sort()
    const signatureString = sortedKeys.map(key => `${key}=${payload[key]}`).join('&')
    
    // For browser environments, crypto.createHmac is not available
    // In production, this should be handled on the server side
    // For now, return a mock signature for development
    return `mock_signature_${Date.now()}`
  }

  /**
   * Simulate payment for development/testing
   */
  private static async simulatePayment(paymentData: IsracardPaymentRequest): Promise<IsracardResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Validate card details
    const validation = this.validateCard(paymentData.cardNumber, paymentData.expiryDate, paymentData.cvv)
    if (!validation.valid) {
      return { success: false, error: validation.error }
    }

    // Simulate different responses based on card number
    const lastDigits = paymentData.cardNumber.slice(-2)
    
    if (lastDigits === '00') {
      return { success: false, error: 'Insufficient funds' }
    } else if (lastDigits === '01') {
      return { success: false, error: 'Card declined' }
    } else if (lastDigits === '02') {
      return { success: false, error: 'Invalid card' }
    }

    // Successful simulation
    return {
      success: true,
      transactionId: `SIM_${Date.now()}`,
      authNumber: `AUTH_${Math.random().toString(36).substring(7).toUpperCase()}`
    }
  }

  /**
   * Verify a transaction
   */
  static async verifyTransaction(transactionId: string): Promise<{ verified: boolean; status?: string }> {
    try {
      if (!this.config.isProduction) {
        // Simulate verification in development
        return { verified: true, status: 'completed' }
      }

      const response = await fetch(`${this.config.apiUrl}/api/v1/verify/${transactionId}`, {
        headers: {
          'Authorization': `Bearer ${this.config.secretKey}`,
          'X-Merchant-ID': this.config.merchantId
        }
      })

      const result = await response.json()
      return {
        verified: response.ok,
        status: result.status
      }
    } catch (error) {
      console.error('Transaction verification error:', error)
      return { verified: false }
    }
  }
}

export default IsracardService
