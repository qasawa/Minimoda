'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { CreditCard, Truck, Shield, ChevronRight, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/contexts/cart-context'
import { OrderService, CreateOrderData } from '@/lib/services/order-service'
import { formatCurrency } from '@/lib/utils/currency'
import { IsracardService } from '@/lib/services/isracard-service'

interface CheckoutContentProps {
  locale: string
  dictionary: any
}

export function CheckoutContent({ locale, dictionary }: CheckoutContentProps) {
  const router = useRouter()
  const { items, removeFromCart, updateQuantity, clearCart } = useCart()
  const [step, setStep] = useState(1) // 1: Cart Review, 2: Shipping, 3: Payment, 4: Success
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderError, setOrderError] = useState('')
  const [completedOrderId, setCompletedOrderId] = useState('')
  
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Israel'
  })

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    paymentMethod: 'credit_card' as 'credit_card' | 'cash_on_delivery' | 'bank_transfer'
  })
  
  const isRTL = locale === 'ar' || locale === 'he'
  
  // Calculate totals in ILS (₪)
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const shipping = subtotal >= 300 ? 0 : 30 // Free shipping over ₪300 (Israeli standard)
  const tax = subtotal * 0.17 // 17% VAT (Israel)
  const total = subtotal + shipping + tax

  // Process order with real Isracard integration
  const processOrder = async () => {
    if (!shippingInfo.firstName || !shippingInfo.lastName || !shippingInfo.phone || !shippingInfo.address) {
      setOrderError('Please fill in all required shipping information')
      return
    }

    if (paymentInfo.paymentMethod === 'credit_card' && (!paymentInfo.cardNumber || !paymentInfo.expiryDate || !paymentInfo.cvv)) {
      setOrderError('Please fill in all payment information')
      return
    }

    setIsProcessing(true)
    setOrderError('')

    try {
      // Prepare order data
      const orderData: CreateOrderData = {
        customer_name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
        customer_phone: shippingInfo.phone,
        customer_email: shippingInfo.email,
        shipping_address: {
          street: shippingInfo.address,
          city: shippingInfo.city,
          postal_code: shippingInfo.postalCode,
          country: shippingInfo.country,
          instructions: ''
        },
        items: items.map(item => ({
          name: item.product.name[locale as keyof typeof item.product.name] || item.product.name.en,
          product_id: item.product.id,
          product_name: item.product.name[locale as keyof typeof item.product.name] || item.product.name.en,
          size: item.selectedSize,
          color_name: item.product.colors[item.selectedColorIndex]?.name?.en || 'Default',
          color_index: item.selectedColorIndex,
          quantity: item.quantity,
          price: item.product.price,
          image_url: item.product.images[0]
        })),
        payment_method: paymentInfo.paymentMethod
      }

      // Process Isracard payment if credit card selected
      if (paymentInfo.paymentMethod === 'credit_card') {
        // Validate card details first
        const cardValidation = IsracardService.validateCard(
          paymentInfo.cardNumber,
          paymentInfo.expiryDate,
          paymentInfo.cvv
        )

        if (!cardValidation.valid) {
          throw new Error(cardValidation.error || 'Invalid card details')
        }

        // Process real Isracard payment
        const paymentResult = await IsracardService.processPayment({
          cardNumber: paymentInfo.cardNumber,
          expiryDate: paymentInfo.expiryDate,
          cvv: paymentInfo.cvv,
          cardholderName: paymentInfo.cardholderName,
          amount: total,
          currency: 'ILS',
          orderId: `ORDER_${Date.now()}`,
          customerEmail: shippingInfo.email,
          customerPhone: shippingInfo.phone
        })

        if (!paymentResult.success) {
          throw new Error(paymentResult.error || 'Payment failed')
        }

        // Store transaction details in notes for verification
        orderData.notes = `Payment Reference: ${paymentResult.transactionId}, Auth: ${paymentResult.authNumber}`
      }

      // Create order in database
      const { data: order, error } = await OrderService.createOrder(orderData)

      if (error) {
        throw new Error(error)
      }

      // Success!
      setCompletedOrderId(order?.order_number || '')
      clearCart()
      setStep(4) // Go to success page

    } catch (error) {
      setOrderError(error instanceof Error ? error.message : 'Failed to process order')
    } finally {
      setIsProcessing(false)
    }
  }



  if (items.length === 0 && step === 1) {
    return (
      <div className="container-responsive mx-auto py-16 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-fredoka font-bold text-gray-900 mb-4">
            {dictionary.common.emptyCart}
          </h1>
          <p className="text-gray-600 mb-8">
            {dictionary.checkout.emptyCartMessage || 'Your cart is empty. Let\'s find something amazing for your little ones!'}
          </p>
          <Button
            size="lg"
            onClick={() => router.push(`/${locale}/products`)}
            className="bg-coral-500 hover:bg-coral-600"
          >
            <ArrowLeft className={cn("h-5 w-5", isRTL ? "ms-2" : "me-2")} />
            {dictionary.common.continueShopping}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container-responsive mx-auto py-8">
      {/* Progress Steps */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div className={cn(
            "flex items-center",
            step >= 1 ? "text-coral-500" : "text-gray-400"
          )}>
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center font-bold",
              step >= 1 ? "bg-coral-500 text-white" : "bg-gray-200"
            )}>
              1
            </div>
            <span className="ms-3 font-medium hidden sm:inline">
              {dictionary.checkout.reviewCart || 'Review Cart'}
            </span>
          </div>
          
          <div className={cn(
            "flex-1 h-1 mx-4",
            step >= 2 ? "bg-coral-500" : "bg-gray-200"
          )} />
          
          <div className={cn(
            "flex items-center",
            step >= 2 ? "text-coral-500" : "text-gray-400"
          )}>
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center font-bold",
              step >= 2 ? "bg-coral-500 text-white" : "bg-gray-200"
            )}>
              2
            </div>
            <span className="ms-3 font-medium hidden sm:inline">
              {dictionary.checkout.shipping || 'Shipping'}
            </span>
          </div>
          
          <div className={cn(
            "flex-1 h-1 mx-4",
            step >= 3 ? "bg-coral-500" : "bg-gray-200"
          )} />
          
          <div className={cn(
            "flex items-center",
            step >= 3 ? "text-coral-500" : "text-gray-400"
          )}>
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center font-bold",
              step >= 3 ? "bg-coral-500 text-white" : "bg-gray-200"
            )}>
              3
            </div>
            <span className="ms-3 font-medium hidden sm:inline">
              {dictionary.checkout.payment || 'Payment'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-sm p-6"
            >
              <h2 className="text-2xl font-fredoka font-bold mb-6">
                {dictionary.checkout.cartItems || 'Cart Items'}
              </h2>
              
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.selectedColorIndex}-${item.selectedSize}`} className="flex gap-4 pb-4 border-b">
                    <div className="relative w-24 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name[locale as keyof typeof item.product.name]}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.product.name[locale as keyof typeof item.product.name]}</h3>
                      <p className="text-sm text-gray-600">
                        Size: {item.selectedSize} • Color: {item.product.colors[item.selectedColorIndex]?.hex || 'Unknown'}
                      </p>
                      <p className="font-bold text-coral-500 mt-1">{formatCurrency(item.product.price)}</p>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center border rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColorIndex, Math.max(0, item.quantity - 1))}
                          className="p-2 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="px-4 font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColorIndex, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColorIndex)}
                        className="text-sm text-coral-500 hover:text-coral-600"
                      >
                        {dictionary.common.remove || 'Remove'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/${locale}/products`)}
                >
                  <ArrowLeft className={cn("h-4 w-4", isRTL ? "ms-2" : "me-2")} />
                  {dictionary.common.continueShopping}
                </Button>
                <Button
                  onClick={() => setStep(2)}
                  className="bg-coral-500 hover:bg-coral-600"
                >
                  {dictionary.checkout.continueToShipping || 'Continue to Shipping'}
                  <ChevronRight className={cn("h-4 w-4", isRTL ? "me-2" : "ms-2")} />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-sm p-6"
            >
              <h2 className="text-2xl font-fredoka font-bold mb-6">
                {dictionary.checkout.shippingInfo || 'Shipping Information'}
              </h2>
              
              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {dictionary.checkout.firstName || 'First Name'}
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.firstName}
                      onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {dictionary.checkout.lastName || 'Last Name'}
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.lastName}
                      onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {dictionary.checkout.email || 'Email'}
                  </label>
                  <input
                    type="email"
                    value={shippingInfo.email}
                    onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500 email"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {dictionary.checkout.phone || 'Phone'}
                  </label>
                  <input
                    type="tel"
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {dictionary.checkout.address || 'Address'}
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                    required
                  />
                </div>
                
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {dictionary.checkout.city || 'City'}
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {dictionary.checkout.postalCode || 'Postal Code'}
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.postalCode}
                      onChange={(e) => setShippingInfo({...shippingInfo, postalCode: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                      required
                    />
                  </div>
                </div>
              </form>
              
              <div className="mt-6 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                >
                  <ArrowLeft className={cn("h-4 w-4", isRTL ? "ms-2" : "me-2")} />
                  {dictionary.common.back || 'Back'}
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  className="bg-coral-500 hover:bg-coral-600"
                >
                  {dictionary.checkout.continueToPayment || 'Continue to Payment'}
                  <ChevronRight className={cn("h-4 w-4", isRTL ? "me-2" : "ms-2")} />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-sm p-6"
            >
              <h2 className="text-2xl font-fredoka font-bold mb-6">
                {dictionary.checkout.paymentMethod || 'Payment Method'}
              </h2>
              
              <div className="space-y-4">
                {/* Payment Method Selection */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Payment Method</h3>
                  <div className="space-y-2">
                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="credit_card"
                        checked={paymentInfo.paymentMethod === 'credit_card'}
                        onChange={(e) => setPaymentInfo({...paymentInfo, paymentMethod: e.target.value as any})}
                        className="mr-3"
                      />
                      <CreditCard className="h-5 w-5 mr-2 text-coral-500" />
                      <span>Credit/Debit Card (Isracard)</span>
                    </label>
                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash_on_delivery"
                        checked={paymentInfo.paymentMethod === 'cash_on_delivery'}
                        onChange={(e) => setPaymentInfo({...paymentInfo, paymentMethod: e.target.value as any})}
                        className="mr-3"
                      />
                      <Truck className="h-5 w-5 mr-2 text-coral-500" />
                      <span>Cash on Delivery</span>
                    </label>
                  </div>
                </div>

                {/* Credit Card Form (only show if credit card selected) */}
                {paymentInfo.paymentMethod === 'credit_card' && (
                  <div className="border-2 border-coral-500 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <CreditCard className="h-6 w-6 text-coral-500" />
                      <span className="font-semibold">Isracard Payment</span>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          value={paymentInfo.cardholderName}
                          onChange={(e) => setPaymentInfo({...paymentInfo, cardholderName: e.target.value})}
                          placeholder="John Doe"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500 rtl:text-right"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={paymentInfo.cardNumber}
                          onChange={(e) => {
                            // Format card number with spaces
                            const value = e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim()
                            setPaymentInfo({...paymentInfo, cardNumber: value})
                          }}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500 rtl:text-right"
                        />
                      </div>
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            value={paymentInfo.expiryDate}
                            onChange={(e) => {
                              // Format as MM/YY
                              let value = e.target.value.replace(/\D/g, '')
                              if (value.length >= 2) {
                                value = value.substring(0, 2) + '/' + value.substring(2, 4)
                              }
                              setPaymentInfo({...paymentInfo, expiryDate: value})
                            }}
                            placeholder="MM/YY"
                            maxLength={5}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500 rtl:text-right"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            value={paymentInfo.cvv}
                            onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value.replace(/\D/g, '')})}
                            placeholder="123"
                            maxLength={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500 rtl:text-right"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Display */}
                {orderError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{orderError}</p>
                  </div>
                )}
                
                {/* Security badges */}
                <div className="flex items-center justify-center gap-4 py-4">
                  <Shield className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {dictionary.checkout.securePayment || 'Your payment information is secure and encrypted'}
                  </span>
                </div>
              </div>
              
              <div className="mt-6 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                >
                  <ArrowLeft className={cn("h-4 w-4", isRTL ? "ms-2" : "me-2")} />
                  {dictionary.common.back || 'Back'}
                </Button>
                <Button
                  onClick={processOrder}
                  disabled={isProcessing}
                  className="bg-coral-500 hover:bg-coral-600 disabled:bg-gray-400"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    dictionary.checkout.placeOrder || 'Place Order'
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-sm p-6 text-center"
            >
              <div className="max-w-md mx-auto">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </motion.div>
                
                <h2 className="text-2xl font-fredoka font-bold text-gray-900 mb-4">
                  Order Placed Successfully!
                </h2>
                
                <p className="text-gray-600 mb-6">
                  Thank you for your order! Your order number is{' '}
                  <span className="font-semibold text-coral-600">#{completedOrderId}</span>
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Order confirmation sent to your email</span>
                  </div>
                  <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
                    <Truck className="h-4 w-4 text-blue-500" />
                    <span>Estimated delivery: 3-5 business days</span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/${locale}/products`)}
                    className="flex-1"
                  >
                    Continue Shopping
                  </Button>
                  <Button
                    onClick={() => router.push(`/${locale}/account`)}
                    className="bg-coral-500 hover:bg-coral-600 flex-1"
                  >
                    Track Order
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
            <h3 className="text-xl font-fredoka font-bold mb-4">
              {dictionary.checkout.orderSummary || 'Order Summary'}
            </h3>
            
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.selectedColorIndex}-${item.selectedSize}`} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.product.name[locale as keyof typeof item.product.name]} x{item.quantity}
                  </span>
                  <span className="font-medium currency">{formatCurrency(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{dictionary.common.subtotal}</span>
                <span className="font-medium currency">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{dictionary.common.shipping}</span>
                <span className="font-medium currency">
                  {shipping === 0 ? dictionary.common.free || 'Free' : formatCurrency(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">VAT (17%)</span>
                <span className="font-medium currency">{formatCurrency(tax)}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-coral-500">
                  {dictionary.checkout.freeShippingAt || 'Free shipping on orders over ₪300'}
                </p>
              )}
            </div>
            
            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>{dictionary.common.total}</span>
                <span className="text-coral-500 currency">{formatCurrency(total)}</span>
              </div>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Truck className="h-5 w-5 text-mint-500" />
                <span>{dictionary.checkout.fastShipping || 'Fast 2-3 day shipping'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Shield className="h-5 w-5 text-mint-500" />
                <span>{dictionary.checkout.secureCheckout || 'Secure checkout'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
