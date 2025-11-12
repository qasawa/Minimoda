'use client'

import Link from 'next/link'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings,
  MessageSquare,
  Truck,
  Tag,
  Sparkles,
  Archive
} from 'lucide-react'
import { useAdmin } from '@/lib/contexts/admin-context'

const menuItems = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    section: 'dashboard'
  },
  {
    name: 'Products',
    href: '/admin/products',
    icon: Package,
    section: 'products'
  },
  {
    name: 'Inventory',
    href: '/admin/inventory',
    icon: Archive,
    section: 'inventory'
  },
  {
    name: 'Orders',
    href: '/admin/orders',
    icon: ShoppingCart,
    section: 'orders'
  },
  {
    name: 'Customers',
    href: '/admin/customers',
    icon: Users,
    section: 'customers'
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    section: 'analytics'
  },
  {
    name: 'WhatsApp',
    href: '/admin/whatsapp',
    icon: MessageSquare,
    section: 'whatsapp'
  },
  {
    name: 'Shipping',
    href: '/admin/shipping',
    icon: Truck,
    section: 'shipping'
  },
  {
    name: 'Promotions',
    href: '/admin/promotions',
    icon: Tag,
    section: 'promotions'
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    section: 'settings'
  }
]

export function AdminSidebar() {
  const { activeSection, setActiveSection } = useAdmin()

  return (
    <aside className="w-72 bg-gray-900 text-white flex flex-col shadow-2xl">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-2xl font-bold text-white">Kiddora</span>
            <p className="text-sm text-gray-300">Admin Portal</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.section
          
          return (
            <Link
              key={item.section}
              href={item.href}
              onClick={() => setActiveSection(item.section)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <div className={`p-2 rounded-lg ${
                isActive ? 'bg-white/20' : 'bg-white/5'
              }`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="font-medium">{item.name}</span>
              {isActive && (
                <div className="ml-auto w-1 h-6 bg-white rounded-full" />
              )}
            </Link>
          )
        })}
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={() => {
            localStorage.removeItem('adminAuth')
            window.location.href = '/admin/login'
          }}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          <span className="text-sm">Sign Out</span>
        </button>
        <div className="text-xs text-gray-400 mt-3 text-center">
          Version 2.0.0
        </div>
      </div>
    </aside>
  )
}
