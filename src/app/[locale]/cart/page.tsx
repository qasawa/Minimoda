

'use client'

import { motion } from 'framer-motion'
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, Truck, Gift } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { NavigationMaisonette } from '@/components/sections/navigation-maisonette'
import { FooterMaisonette } from '@/components/sections/footer-maisonette'
import { useCart } from '@/lib/contexts/cart-context'
import { getDictionary } from '@/lib/utils/getDictionary'
import { Locale } from '@/lib/types'

interface CartPageProps {
  params: { locale: Locale }
}

export default async function CartPage({ params }: CartPageProps) {
  const { locale } = params
  const dictionary = await getDictionary(locale)

  return (
    <div className="min-h-screen bg-maisonette-cream">
      <NavigationMaisonette locale={locale} dictionary={dictionary} />
      
      <main className="pt-24 pb-16">
        <CartContent locale={locale} dictionary={dictionary} />
      </main>

      <FooterMaisonette locale={locale} dictionary={dictionary} />
    </div>
  )
}

function CartContent({ locale, dictionary }: { locale: Locale, dictionary: any }) {
  const { items, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } = useCart()
  const totalPrice = getTotalPrice()
  const totalItems = getTotalItems()
  const freeShippingThreshold = 200
  const shippingCost = totalPrice >= freeShippingThreshold ? 0 : 25
  const shippingNeeded = Math.max(0, freeShippingThreshold - totalPrice)
  const finalTotal = totalPrice + shippingCost

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 lg:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h1 className="text-4xl font-playfair font-bold mb-4 text-gray-900">
            {locale === 'he' ? 'העגלה שלכם ריקה' : 
             locale === 'ar' ? 'سلتكم فارغة' : 
             'Your cart is empty'}
          </h1>
          <p className="text-xl text-gray-600 mb-8 font-lexend">
            {locale === 'he' ? 'הוסיפו פריטים מדהימים לעגלה' : 
             locale === 'ar' ? 'أضيفوا عناصر رائعة إلى السلة' : 
             'Add some amazing items to your cart'}
          </p>
          <Link href={`/${locale}/products`}>
            <Button className="bg-gradient-to-r from-coral-500 to-orange-500 hover:from-coral-600 hover:to-orange-600 text-white px-8 py-4 text-lg rounded-2xl">
              {locale === 'he' ? 'התחילו לקנות' : 
               locale === 'ar' ? 'ابدئوا التسوق' : 
               'Start Shopping'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 lg:px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-4 bg-gradient-to-r from-coral-500 to-pink-500 bg-clip-text text-transparent">
          {locale === 'he' ? 'עגלת הקניות שלכם' : 
           locale === 'ar' ? 'سلة التسوق الخاصة بكم' : 
           'Your Shopping Cart'}
        </h1>
        <p className="text-xl text-gray-600 font-lexend">
          {totalItems} {locale === 'he' ? 'פריטים' : locale === 'ar' ? 'عناصر' : 'items'} • ₪{totalPrice}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={`${item.product.id}-${item.selectedSize}-${item.selectedColorIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center gap-4">
                  {/* Product Image */}
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name[locale] || item.product.name.en}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="font-poppins font-semibold text-lg mb-1">
                      {item.product.name[locale] || item.product.name.en}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {locale === 'he' ? 'מידה:' : locale === 'ar' ? 'المقاس:' : 'Size:'} {item.selectedSize}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">₪{item.product.price}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColorIndex, Math.max(0, item.quantity - 1))}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    
                    <span className="w-12 text-center font-semibold">{item.quantity}</span>
                    
                    <button
                      onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColorIndex, item.quantity + 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColorIndex)}
                    className="w-8 h-8 rounded-full border border-red-300 flex items-center justify-center hover:bg-red-50 transition-colors text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg sticky top-24"
          >
            <h2 className="text-2xl font-playfair font-bold mb-6">
              {locale === 'he' ? 'סיכום הזמנה' : 
               locale === 'ar' ? 'ملخص الطلب' : 
               'Order Summary'}
            </h2>

            {/* Free Shipping Progress */}
            {shippingNeeded > 0 && (
              <div className="mb-6 p-4 bg-coral-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="h-4 w-4 text-coral-500" />
                  <span className="text-sm font-medium text-coral-700">
                    ₪{shippingNeeded.toFixed(2)} {locale === 'he' ? 'למשלוח חינם' : locale === 'ar' ? 'للشحن المجاني' : 'for free shipping'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-coral-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((totalPrice / freeShippingThreshold) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Price Breakdown */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {locale === 'he' ? 'סכום משני' : locale === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}
                </span>
                <span className="font-semibold">₪{totalPrice}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {locale === 'he' ? 'משלוח' : locale === 'ar' ? 'الشحن' : 'Shipping'}
                </span>
                <span className={`font-semibold ${shippingCost === 0 ? 'text-green-600' : ''}`}>
                  {shippingCost === 0 
                    ? (locale === 'he' ? 'חינם' : locale === 'ar' ? 'مجاني' : 'Free')
                    : `₪${shippingCost}`
                  }
                </span>
              </div>
              
              <hr className="border-gray-200" />
              
              <div className="flex justify-between text-xl font-bold">
                <span>
                  {locale === 'he' ? 'סך הכל' : locale === 'ar' ? 'المجموع' : 'Total'}
                </span>
                <span>₪{finalTotal}</span>
              </div>
            </div>

            {/* Gift Options */}
            <div className="mb-6 p-4 border border-gray-200 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="h-4 w-4 text-coral-500" />
                <span className="font-medium">
                  {locale === 'he' ? 'אפשרויות מתנה' : locale === 'ar' ? 'خيارات الهدايا' : 'Gift Options'}
                </span>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded" />
                <span>
                  {locale === 'he' ? 'עטיפת מתנה (₪15)' : 
                   locale === 'ar' ? 'تغليف الهدايا (15 شيكل)' : 
                   'Gift wrapping (₪15)'}
                </span>
              </label>
            </div>

            {/* Checkout Button */}
            <Link href={`/${locale}/checkout`}>
              <Button className="w-full bg-gradient-to-r from-coral-500 to-orange-500 hover:from-coral-600 hover:to-orange-600 text-white py-4 text-lg font-semibold rounded-2xl mb-4">
                {locale === 'he' ? 'המשך לתשלום' : 
                 locale === 'ar' ? 'المتابعة للدفع' : 
                 'Proceed to Checkout'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            {/* Continue Shopping */}
            <Link href={`/${locale}/products`}>
              <Button variant="outline" className="w-full">
                {locale === 'he' ? 'המשיכו לקנות' : 
                 locale === 'ar' ? 'متابعة التسوق' : 
                 'Continue Shopping'}
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
