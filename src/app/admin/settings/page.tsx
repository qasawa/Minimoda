'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, 
  Save, 
  Globe, 
  Palette, 
  Bell,
  Shield,
  Mail,
  Smartphone,
  CreditCard,
  Truck,
  Users
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAdmin } from '@/lib/contexts/admin-context'

export default function SettingsAdminPage() {
  const { setActiveSection } = useAdmin()
  const [activeTab, setActiveTab] = useState('general')

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'payments', name: 'Payments', icon: CreditCard },
    { id: 'shipping', name: 'Shipping', icon: Truck },
    { id: 'security', name: 'Security', icon: Shield }
  ]

  React.useEffect(() => {
    setActiveSection('settings')
  }, [setActiveSection])

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Store Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                  <input 
                    type="text" 
                    defaultValue="Minimoda" 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Store Email</label>
                  <input 
                    type="email" 
                    defaultValue="hello@minimoda.com" 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    defaultValue="+972-50-123-4567" 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Store Address</label>
                  <input 
                    type="text" 
                    defaultValue="Tel Aviv, Israel" 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Business Hours</h3>
              <div className="space-y-3">
                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                  <div key={day} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 w-20">{day}</span>
                    <div className="flex items-center space-x-2">
                      <input type="time" defaultValue="09:00" className="px-3 py-1 border rounded" />
                      <span>to</span>
                      <input type="time" defaultValue="18:00" className="px-3 py-1 border rounded" />
                      <input type="checkbox" defaultChecked={day !== 'Friday' && day !== 'Saturday'} />
                      <span className="text-sm text-gray-500">Open</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Theme Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                  <div className="flex items-center space-x-3">
                    <input type="color" defaultValue="#e11d48" className="w-12 h-10 border rounded" />
                    <input type="text" defaultValue="#e11d48" className="flex-1 px-4 py-2 border rounded-lg" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="text-gray-500">
                      <Settings className="mx-auto h-12 w-12 mb-2" />
                      <p>Upload your logo</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Layout Options</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Dark Mode</p>
                    <p className="text-sm text-gray-500">Enable dark theme for the store</p>
                  </div>
                  <input type="checkbox" className="toggle" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">RTL Support</p>
                    <p className="text-sm text-gray-500">Enable right-to-left language support</p>
                  </div>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>
              </div>
            </div>
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
              <div className="space-y-4">
                {[
                  { title: 'New Orders', description: 'Get notified when new orders are placed' },
                  { title: 'Low Stock Alerts', description: 'Alert when products are running low' },
                  { title: 'Customer Messages', description: 'Notifications for WhatsApp and contact form' },
                  { title: 'Weekly Reports', description: 'Receive weekly sales and analytics reports' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">WhatsApp Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
                  <input 
                    type="tel" 
                    defaultValue="+972-50-123-4567" 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Auto-reply Message</label>
                  <textarea 
                    defaultValue="Hello! Thanks for contacting Minimoda. We'll get back to you soon!"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 'payments':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Methods</h3>
              <div className="space-y-4">
                {[
                  { name: 'Credit Cards', enabled: true, description: 'Visa, Mastercard, American Express' },
                  { name: 'PayPal', enabled: true, description: 'PayPal payments' },
                  { name: 'Bank Transfer', enabled: false, description: 'Direct bank transfers' },
                  { name: 'Cash on Delivery', enabled: true, description: 'Pay when you receive' }
                ].map((method, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{method.name}</p>
                      <p className="text-sm text-gray-500">{method.description}</p>
                    </div>
                    <input type="checkbox" defaultChecked={method.enabled} className="toggle" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Currency Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default Currency</label>
                  <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500">
                    <option value="ILS">Israeli Shekel (₪)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
                  <input 
                    type="number" 
                    defaultValue="17" 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 'shipping':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Default Shipping</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Free Shipping Threshold</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₪</span>
                    <input 
                      type="number" 
                      defaultValue="200" 
                      className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Standard Shipping Rate</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₪</span>
                    <input 
                      type="number" 
                      defaultValue="25" 
                      className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Options</h3>
              <div className="space-y-4">
                {[
                  { name: 'Standard Delivery', time: '2-3 business days', price: '₪25' },
                  { name: 'Express Delivery', time: '1-2 business days', price: '₪45' },
                  { name: 'Same Day Delivery', time: 'Same day (Tel Aviv only)', price: '₪65' }
                ].map((option, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{option.name}</p>
                      <p className="text-sm text-gray-500">{option.time} - {option.price}</p>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Admin Access</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
                  <input 
                    type="email" 
                    defaultValue="admin@minimoda.com" 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Change Password</label>
                  <div className="space-y-3">
                    <input 
                      type="password" 
                      placeholder="Current password"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                    />
                    <input 
                      type="password" 
                      placeholder="New password"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                    />
                    <input 
                      type="password" 
                      placeholder="Confirm new password"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Security Options</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500">Add an extra layer of security</p>
                  </div>
                  <input type="checkbox" className="toggle" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Login Notifications</p>
                    <p className="text-sm text-gray-500">Get notified of admin logins</p>
                  </div>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your store configuration and preferences</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-coral-500 text-coral-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.name}
                </button>
              )
            })}
          </nav>
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6"
        >
          {renderTabContent()}
        </motion.div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="bg-coral-500 hover:bg-coral-600">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}
