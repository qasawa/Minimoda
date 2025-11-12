'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  Edit2, 
  Plus, 
  Globe,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAdmin } from '@/lib/contexts/admin-context'

interface ShippingZone {
  id: string
  name: string
  regions: string[]
  freeShippingThreshold: number
  standardRate: number
  expressRate: number
  estimatedDays: string
  status: 'active' | 'inactive'
}

export default function ShippingAdminPage() {
  const { setActiveSection } = useAdmin()
  const [selectedZone, setSelectedZone] = useState<string>('')

  // Mock shipping zones data
  const shippingZones: ShippingZone[] = [
    {
      id: 'israel-central',
      name: 'Central Israel',
      regions: ['Tel Aviv', 'Ramat Gan', 'Givatayim', 'Herzliya', 'Petah Tikva'],
      freeShippingThreshold: 200,
      standardRate: 25,
      expressRate: 45,
      estimatedDays: '1-2 days',
      status: 'active'
    },
    {
      id: 'israel-north',
      name: 'Northern Israel',
      regions: ['Haifa', 'Nazareth', 'Tiberias', 'Safed', 'Akko'],
      freeShippingThreshold: 250,
      standardRate: 35,
      expressRate: 55,
      estimatedDays: '2-3 days',
      status: 'active'
    },
    {
      id: 'israel-south',
      name: 'Southern Israel',
      regions: ['Beer Sheva', 'Eilat', 'Arad', 'Dimona'],
      freeShippingThreshold: 300,
      standardRate: 40,
      expressRate: 65,
      estimatedDays: '2-4 days',
      status: 'active'
    },
    {
      id: 'west-bank',
      name: 'West Bank',
      regions: ['Ramallah', 'Bethlehem', 'Hebron', 'Nablus'],
      freeShippingThreshold: 350,
      standardRate: 50,
      expressRate: 80,
      estimatedDays: '3-5 days',
      status: 'inactive'
    }
  ]

  React.useEffect(() => {
    setActiveSection('shipping')
  }, [setActiveSection])

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? <Badge className="bg-green-100 text-green-800">Active</Badge>
      : <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shipping Zones</h1>
          <p className="text-gray-600 mt-1">Manage shipping rates and delivery zones</p>
        </div>
        <Button className="bg-coral-500 hover:bg-coral-600">
          <Plus className="h-4 w-4 mr-2" />
          Add Zone
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Zones</p>
              <p className="text-2xl font-bold text-gray-900">
                {shippingZones.filter(z => z.status === 'active').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg border p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Shipping Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                ₪{Math.round(shippingZones.reduce((sum, z) => sum + z.standardRate, 0) / shippingZones.length)}
              </p>
            </div>
            <Truck className="h-8 w-8 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg border p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Free Shipping</p>
              <p className="text-2xl font-bold text-gray-900">₪200+</p>
            </div>
            <Package className="h-8 w-8 text-purple-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg border p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Coverage</p>
              <p className="text-2xl font-bold text-gray-900">
                {shippingZones.reduce((sum, z) => sum + z.regions.length, 0)} cities
              </p>
            </div>
            <Globe className="h-8 w-8 text-coral-500" />
          </div>
        </motion.div>
      </div>

      {/* Shipping Zones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg border overflow-hidden"
      >
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Shipping Zones</h3>
          <p className="text-gray-600 text-sm mt-1">Configure shipping rates for different regions</p>
        </div>

        <div className="divide-y">
          {shippingZones.map((zone, index) => (
            <motion.div
              key={zone.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-gray-900">{zone.name}</h4>
                    {getStatusBadge(zone.status)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Coverage</p>
                      <div className="flex items-center text-sm text-gray-700">
                        <MapPin className="h-4 w-4 mr-1" />
                        {zone.regions.slice(0, 3).join(', ')}
                        {zone.regions.length > 3 && ` +${zone.regions.length - 3} more`}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Delivery Time</p>
                      <div className="flex items-center text-sm text-gray-700">
                        <Clock className="h-4 w-4 mr-1" />
                        {zone.estimatedDays}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-900">Standard Shipping</p>
                      <p className="text-lg font-bold text-coral-600">₪{zone.standardRate}</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-900">Express Shipping</p>
                      <p className="text-lg font-bold text-blue-600">₪{zone.expressRate}</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-900">Free Shipping</p>
                      <p className="text-lg font-bold text-green-600">₪{zone.freeShippingThreshold}+</p>
                    </div>
                  </div>
                </div>

                <div className="ml-6">
                  <Button variant="ghost" size="sm">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Shipping Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-lg border p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Global Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Free Shipping Threshold
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₪</span>
              <input
                type="number"
                defaultValue={200}
                className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Processing Time
            </label>
            <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500">
              <option>1-2 business days</option>
              <option>2-3 business days</option>
              <option>3-5 business days</option>
              <option>Same day</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button className="bg-coral-500 hover:bg-coral-600">
            Save Settings
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
