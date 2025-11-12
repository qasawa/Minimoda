'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Send, Users, ExternalLink, Settings, AlertCircle, CheckCircle, XCircle, BarChart3, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { WhatsAppService } from '@/lib/services/whatsapp-service'

interface MessageAnalytics {
  totalSent: number
  totalDelivered: number
  totalRead: number
  totalFailed: number
  deliveryRate: number
  readRate: number
}

export function WhatsAppCenter() {
  const [isConnected, setIsConnected] = useState(false)
  const [configStatus, setConfigStatus] = useState<{ configured: boolean; missing: string[] }>({ configured: false, missing: [] })
  const [analytics, setAnalytics] = useState<MessageAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [testMessage, setTestMessage] = useState('')
  const [testPhone, setTestPhone] = useState('')
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    checkConnection()
    loadAnalytics()
  }, [])

  const checkConnection = async () => {
    try {
      const ready = WhatsAppService.isReady()
      const status = WhatsAppService.getStatus()
      setIsConnected(ready)
      setConfigStatus(status)
    } catch (error) {
      console.error('Error checking WhatsApp connection:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadAnalytics = async () => {
    try {
      if (WhatsAppService.isReady()) {
        const data = await WhatsAppService.getMessageAnalytics()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Error loading analytics:', error)
    }
  }

  const sendTestMessage = async () => {
    if (!testPhone || !testMessage) return
    
    setIsSending(true)
    try {
      const result = await WhatsAppService.sendTextMessage(testPhone, testMessage)
      if (result.success) {
        alert('Test message sent successfully!')
        setTestMessage('')
        setTestPhone('')
        loadAnalytics() // Refresh analytics
      } else {
        alert(`Failed to send message: ${result.error}`)
      }
    } catch (error) {
      alert('Error sending test message')
    } finally {
      setIsSending(false)
    }
  }

  const sendOrderConfirmation = async () => {
    const phone = prompt('Enter customer phone number (with country code):')
    if (!phone) return

    setIsSending(true)
    try {
      const result = await WhatsAppService.sendOrderConfirmation(
        phone,
        'ORD12345',
        'Test Customer',
        299,
        '₪'
      )
      if (result.success) {
        alert('Order confirmation sent!')
        loadAnalytics()
      } else {
        alert(`Failed to send: ${result.error}`)
      }
    } catch (error) {
      alert('Error sending order confirmation')
    } finally {
      setIsSending(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }
  return (
    <div className="space-y-6">
      {/* Integration Status */}
      <div className={`bg-gradient-to-r ${isConnected ? 'from-green-50 to-emerald-50 border-green-200' : 'from-yellow-50 to-orange-50 border-yellow-200'} border rounded-lg p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-3 ${isConnected ? 'bg-green-100' : 'bg-yellow-100'} rounded-full`}>
              {isConnected ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">WhatsApp Business Integration</h3>
              <p className="text-gray-600">
                {isConnected 
                  ? 'Connected and ready to send messages!'
                  : 'Connect your WhatsApp Business account for customer communication'
                }
              </p>
              {!isConnected && configStatus.missing.length > 0 && (
                <p className="text-sm text-yellow-700 mt-1">
                  Missing: {configStatus.missing.join(', ')}
                </p>
              )}
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={isConnected 
              ? "text-green-700 border-green-300 bg-green-50" 
              : "text-yellow-700 border-yellow-300 bg-yellow-50"
            }
          >
            {isConnected ? 'Connected' : 'Not Connected'}
          </Badge>
        </div>
      </div>

      {/* Analytics Dashboard */}
      {isConnected && analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Messages Sent</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.totalSent.toLocaleString()}</p>
                </div>
                <Send className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Delivery Rate</p>
                  <p className="text-2xl font-bold text-green-600">{analytics.deliveryRate}%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Read Rate</p>
                  <p className="text-2xl font-bold text-purple-600">{analytics.readRate}%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Failed</p>
                  <p className="text-2xl font-bold text-red-600">{analytics.totalFailed}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Zap className="h-6 w-6 text-blue-600" />
              <h4 className="font-semibold text-gray-900">Quick Actions</h4>
            </div>
            
            <div className="space-y-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                disabled={!isConnected || isSending}
                onClick={sendOrderConfirmation}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                {isSending ? 'Sending...' : 'Send Test Order Confirmation'}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                disabled={!isConnected}
                onClick={() => {
                  alert('Feature coming soon: Broadcast marketing messages to customers who have opted in.')
                }}
              >
                <Users className="h-4 w-4 mr-2" />
                Broadcast Messages
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                disabled={!isConnected}
                onClick={() => {
                  alert('Feature coming soon: Real-time customer support chat interface.')
                }}
              >
                <Send className="h-4 w-4 mr-2" />
                Customer Support
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Send className="h-6 w-6 text-green-600" />
              <h4 className="font-semibold text-gray-900">Send Test Message</h4>
            </div>
            
            <div className="space-y-3">
              <input
                type="tel"
                placeholder="Phone number (e.g., +972501234567)"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={!isConnected}
              />
              
              <textarea
                placeholder="Test message..."
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={!isConnected}
              />
              
              <Button 
                variant="default"
                size="sm" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!isConnected || !testPhone || !testMessage || isSending}
                onClick={sendTestMessage}
              >
                {isSending ? 'Sending...' : 'Send Test Message'}
              </Button>
            </div>
            
            {!isConnected && (
              <p className="text-xs text-gray-500 mt-3">
                Features will be enabled after WhatsApp Business integration
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Setup Instructions */}
      {!isConnected && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Settings className="h-6 w-6 text-blue-600" />
              <h4 className="font-semibold text-gray-900">Setup WhatsApp Business API</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-gray-900 mb-2">1. Get WhatsApp Business API Access</h5>
                <p className="text-gray-600 text-sm mb-3">
                  Apply for WhatsApp Business API access through Meta Business or an official partner.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => window.open('https://business.whatsapp.com/', '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  WhatsApp Business
                </Button>
              </div>
              
              <div>
                <h5 className="font-medium text-gray-900 mb-2">2. Configure Environment Variables</h5>
                <p className="text-gray-600 text-sm mb-3">
                  Add your WhatsApp credentials to your environment variables:
                </p>
                <div className="bg-gray-100 p-3 rounded text-xs font-mono">
                  <div>WHATSAPP_ACCESS_TOKEN=your_token</div>
                  <div>WHATSAPP_PHONE_NUMBER_ID=your_id</div>
                  <div>WHATSAPP_WEBHOOK_TOKEN=your_webhook</div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-2">Features you&apos;ll get:</h5>
              <ul className="space-y-1 text-sm text-blue-700">
                <li>• Automated order confirmations and shipping updates</li>
                <li>• Two-way customer support messaging</li>
                <li>• Marketing campaigns (with customer consent)</li>
                <li>• Message analytics and delivery tracking</li>
                <li>• Template message management</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Benefits */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
          Why Use WhatsApp Business?
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">2.4B+</div>
            <div className="text-sm text-gray-600">Global Users</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">98%</div>
            <div className="text-sm text-gray-600">Open Rate</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">5x</div>
            <div className="text-sm text-gray-600">Higher Engagement</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">24/7</div>
            <div className="text-sm text-gray-600">Availability</div>
          </div>
        </div>
      </div>

      {/* Real Integration Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-medium text-sm">
            Real WhatsApp Business API Integration - Send actual messages to customers
          </span>
        </div>
      </div>
    </div>
  )
}