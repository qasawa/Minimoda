'use client'

import { useState, useEffect } from 'react'
import { Bell, Search, User, Menu, Calendar, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'

export function AdminNavigation() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [adminData, setAdminData] = useState<any>(null)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    const auth = localStorage.getItem('adminAuth')
    if (auth) {
      setAdminData(JSON.parse(auth))
    }
    return () => clearInterval(timer)
  }, [])

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
          
          <div>
            <h1 className="text-2xl font-playfair font-semibold text-gray-900">
              Welcome Back!
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {currentTime.toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                {currentTime.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products, orders..."
              className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all"
            />
          </div>
          
          {/* Notifications */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="outline" 
              size="sm" 
              className="relative bg-gray-50 hover:bg-gray-100 border-gray-200 rounded-xl"
            >
              <Bell className="h-4 w-4 text-gray-600" />
              <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                3
              </Badge>
            </Button>
          </motion.div>
          
          {/* User Profile */}
          <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-navy-50 to-soft-blue-50 rounded-xl">
            <div className="w-8 h-8 bg-navy-500 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">Admin</p>
              <p className="text-xs text-gray-600">{adminData?.email || 'admin@minimoda.com'}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
