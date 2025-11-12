'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { Product } from '@/lib/types'

interface CartItem {
  product: Product
  quantity: number
  selectedSize: string
  selectedColorIndex: number
}

interface CartContextType {
  items: CartItem[]
  isOpen: boolean
  addToCart: (product: Product, size: string, colorIndex: number) => void
  removeFromCart: (productId: string, size: string, colorIndex: number) => void
  updateQuantity: (productId: string, size: string, colorIndex: number, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const addToCart = useCallback((product: Product, size: string, colorIndex: number) => {
    setItems(prev => {
      const existingItem = prev.find(
        item => 
          item.product.id === product.id && 
          item.selectedSize === size && 
          item.selectedColorIndex === colorIndex
      )

      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id && 
          item.selectedSize === size && 
          item.selectedColorIndex === colorIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [...prev, {
        product,
        quantity: 1,
        selectedSize: size,
        selectedColorIndex: colorIndex
      }]
    })
  }, [])

  const removeFromCart = useCallback((productId: string, size: string, colorIndex: number) => {
    setItems(prev => prev.filter(
      item => !(
        item.product.id === productId && 
        item.selectedSize === size && 
        item.selectedColorIndex === colorIndex
      )
    ))
  }, [])

  const updateQuantity = useCallback((productId: string, size: string, colorIndex: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, colorIndex)
      return
    }

    setItems(prev => prev.map(item =>
      item.product.id === productId && 
      item.selectedSize === size && 
      item.selectedColorIndex === colorIndex
        ? { ...item, quantity }
        : item
    ))
  }, [removeFromCart])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])
  const toggleCart = useCallback(() => setIsOpen(prev => !prev), [])

  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }, [items])

  const getTotalPrice = useCallback(() => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  }, [items])

  return (
    <CartContext.Provider value={{
      items,
      isOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
      toggleCart,
      getTotalItems,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
