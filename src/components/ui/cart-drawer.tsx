'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/contexts/cart-context'
import { X, Plus, Minus, ShoppingBag } from 'lucide-react'
import type { Locale } from '@/lib/i18n'

interface CartDrawerProps {
  locale: Locale
  dictionary: any
}

export function CartDrawer({ locale, dictionary }: CartDrawerProps) {
  const { 
    items, 
    isOpen, 
    closeCart, 
    updateQuantity, 
    removeFromCart,
    getTotalPrice 
  } = useCart()
  
  const isRTL = locale === 'he' || locale === 'ar'
  
  // Spring physics for smooth sliding
  const springConfig = { stiffness: 300, damping: 30 }
  const x = useSpring(0, springConfig)
  
  useEffect(() => {
    if (isOpen) {
      x.set(0)
      document.body.style.overflow = 'hidden'
    } else {
      x.set(isRTL ? -100 : 100)
      document.body.style.overflow = ''
    }
    
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, x, isRTL])

  const opacity = useTransform(x, 
    isRTL ? [-100, 0] : [0, 100], 
    [0, 1]
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Drawer */}
          <motion.div
            className={cn(
              "fixed top-0 bottom-0 w-full max-w-md bg-white z-50",
              "shadow-2xl flex flex-col",
              isRTL ? "left-0" : "right-0"
            )}
            initial={{ x: isRTL ? "-100%" : "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: isRTL ? "-100%" : "100%" }}
            transition={springConfig}
            style={{ x, opacity }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                {dictionary.common.cart}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeCart}
                className="rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-4">{dictionary.common.emptyCart}</p>
                  <Button onClick={closeCart} variant="outline">
                    {dictionary.common.continueShopping}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <motion.div
                      key={`${item.product.id}-${item.selectedSize}-${item.selectedColorIndex}`}
                      initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      {/* Product Image */}
                      <div className="relative w-20 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.product.colors[item.selectedColorIndex].images[0] || item.product.images[0]}
                          alt={item.product.name[locale]}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm line-clamp-1">
                          {item.product.name[locale]}
                        </h3>
                        <p className="text-xs text-gray-600 mt-1">
                          {item.product.colors[item.selectedColorIndex].name[locale]} • {item.selectedSize}
                        </p>
                        <p className="font-semibold mt-2">${item.product.price}</p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={() => removeFromCart(
                            item.product.id, 
                            item.selectedSize, 
                            item.selectedColorIndex
                          )}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(
                              item.product.id,
                              item.selectedSize,
                              item.selectedColorIndex,
                              item.quantity - 1
                            )}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(
                              item.product.id,
                              item.selectedSize,
                              item.selectedColorIndex,
                              item.quantity + 1
                            )}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t p-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{dictionary.common.subtotal}</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{dictionary.common.shipping}</span>
                    <span className="text-green-600">{dictionary.common.free || 'Free'}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                    <span>{dictionary.common.total}</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => {
                    closeCart()
                    window.location.href = `/${locale}/checkout`
                  }}
                >
                  {dictionary.common.checkout}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={closeCart}
                >
                  {dictionary.common.continueShopping}
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
