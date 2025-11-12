
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  User, 
  Settings, 
  Heart, 
  ShoppingBag, 
  MapPin, 
  CreditCard, 
  LogOut,
  Edit,
  Plus,
  Package,
  Star,
  Loader
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { NavigationMaisonette } from '@/components/sections/navigation-maisonette'
import { FooterMaisonette } from '@/components/sections/footer-maisonette'
import { CustomerAuthModal } from '@/components/auth/customer-auth-modal'
import { getDictionary } from '@/lib/utils/getDictionary'
import { CustomerAuthService } from '@/lib/services/customer-auth-service'
import type { CustomerProfile } from '@/lib/services/customer-auth-service'
import { Locale } from '@/lib/types'

interface AccountPageProps {
  params: { locale: Locale }
}

export default function AccountPage({ params }: AccountPageProps) {
  const { locale } = params
  const router = useRouter()
  const [customer, setCustomer] = useState<CustomerProfile | null>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [dictionary, setDictionary] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load dictionary
        const dict = await getDictionary(locale)
        setDictionary(dict)

        // Check authentication
        const { user, session } = await CustomerAuthService.getCurrentCustomer()
        
        if (!user || !session) {
          setIsAuthenticated(false)
          setShowAuthModal(true)
          setIsLoading(false)
          return
        }

        setIsAuthenticated(true)
        setCustomer(user)

        // Load customer orders
        const customerOrders = await CustomerAuthService.getCustomerOrders(user.id)
        setOrders(customerOrders)

      } catch (error) {
        console.error('Error loading account data:', error)
        setIsAuthenticated(false)
        setShowAuthModal(true)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [locale])

  const handleAuthSuccess = () => {
    setShowAuthModal(false)
    // Reload the page to fetch authenticated user data
    window.location.reload()
  }

  const handleLogout = async () => {
    await CustomerAuthService.logout()
    router.push(`/${locale}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-maisonette-cream flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-coral-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading your account...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !customer || !dictionary) {
    return (
      <>
        <div className="min-h-screen bg-maisonette-cream">
          <NavigationMaisonette locale={locale} dictionary={dictionary || {}} />
          
          <main className="pt-24 pb-16 flex items-center justify-center">
            <div className="text-center">
              <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {locale === 'he' ? 'נדרשת התחברות' : 
                 locale === 'ar' ? 'مطلوب تسجيل الدخول' : 
                 'Login Required'}
              </h1>
              <p className="text-gray-600 mb-6">
                {locale === 'he' ? 'אנא התחבר לחשבון שלך כדי לצפות בדף החשבון' : 
                 locale === 'ar' ? 'يرجى تسجيل الدخول إلى حسابك لعرض صفحة الحساب' : 
                 'Please sign in to your account to view your account page'}
              </p>
              <Button 
                onClick={() => setShowAuthModal(true)}
                className="bg-coral-500 hover:bg-coral-600"
              >
                {locale === 'he' ? 'התחבר' : 
                 locale === 'ar' ? 'تسجيل الدخول' : 
                 'Sign In'}
              </Button>
            </div>
          </main>

          <FooterMaisonette locale={locale} dictionary={dictionary || {}} />
        </div>

        <CustomerAuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          locale={locale}
          onSuccess={handleAuthSuccess}
        />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-maisonette-cream">
      <NavigationMaisonette locale={locale} dictionary={dictionary} />
      
      <main className="pt-24 pb-16">
        <AccountContent 
          locale={locale} 
          dictionary={dictionary} 
          customer={customer}
          orders={orders}
          onLogout={handleLogout}
        />
      </main>

      <FooterMaisonette locale={locale} dictionary={dictionary} />
    </div>
  )
}

interface AccountContentProps {
  locale: Locale
  dictionary: any
  customer: CustomerProfile
  orders: any[]
  onLogout: () => void
}

function AccountContent({ locale, dictionary, customer, orders, onLogout }: AccountContentProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const menuItems = [
    {
      id: 'overview',
      icon: User,
      label: locale === 'he' ? 'סקירה כללית' : locale === 'ar' ? 'نظرة عامة' : 'Overview'
    },
    {
      id: 'orders',
      icon: Package,
      label: locale === 'he' ? 'ההזמנות שלי' : locale === 'ar' ? 'طلباتي' : 'My Orders',
      count: customer.order_count
    },
    {
      id: 'wishlist',
      icon: Heart,
      label: locale === 'he' ? 'רשימת משאלות' : locale === 'ar' ? 'قائمة الأمنيات' : 'Wishlist',
      count: 0 // TODO: Get actual wishlist count
    },
    {
      id: 'addresses',
      icon: MapPin,
      label: locale === 'he' ? 'כתובות' : locale === 'ar' ? 'العناوين' : 'Addresses'
    },
    {
      id: 'payment',
      icon: CreditCard,
      label: locale === 'he' ? 'תשלומים' : locale === 'ar' ? 'المدفوعات' : 'Payment Methods'
    },
    {
      id: 'settings',
      icon: Settings,
      label: locale === 'he' ? 'הגדרות' : locale === 'ar' ? 'الإعدادات' : 'Settings'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'shipped': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return locale === 'he' ? 'נמסר' : locale === 'ar' ? 'تم التسليم' : 'Delivered'
      case 'shipped': return locale === 'he' ? 'נשלח' : locale === 'ar' ? 'تم الشحن' : 'Shipped'
      case 'processing': return locale === 'he' ? 'מעובד' : locale === 'ar' ? 'قيد المعالجة' : 'Processing'
      default: return status
    }
  }

  return (
    <div className="container mx-auto px-4 lg:px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="relative w-24 h-24 mx-auto mb-4">
          <div className="w-24 h-24 bg-gradient-to-br from-coral-400 to-coral-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {(customer.name || customer.email || customer.phone || 'U').charAt(0).toUpperCase()}
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 bg-coral-500 rounded-full flex items-center justify-center text-white hover:bg-coral-600 transition-colors">
            <Edit className="h-4 w-4" />
          </button>
        </div>
        <h1 className="text-4xl font-playfair font-bold mb-2 text-gray-900">
          {locale === 'he' ? `שלום, ${customer.name || 'לקוח'}` : 
           locale === 'ar' ? `أهلاً، ${customer.name || 'عميل'}` : 
           `Hello, ${customer.name || 'Customer'}`}
        </h1>
        <p className="text-gray-600 font-lexend">
          {locale === 'he' ? `חבר מאז ${new Date(customer.created_at).getFullYear()}` : 
           locale === 'ar' ? `عضو منذ ${new Date(customer.created_at).getFullYear()}` : 
           `Member since ${new Date(customer.created_at).getFullYear()}`}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Menu */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id
                
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-coral-100 text-coral-700 font-semibold' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.count && (
                      <Badge className="bg-coral-500 text-white">
                        {item.count}
                      </Badge>
                    )}
                  </button>
                )
              })}
              
              <hr className="my-4" />
              
              <button 
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>
                  {locale === 'he' ? 'התנתק' : locale === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}
                </span>
              </button>
            </nav>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-coral-100 rounded-xl flex items-center justify-center">
                      <ShoppingBag className="h-6 w-6 text-coral-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{customer.order_count}</p>
                      <p className="text-gray-600 text-sm">
                        {locale === 'he' ? 'הזמנות' : locale === 'ar' ? 'طلبات' : 'Orders'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Star className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">₪{customer.total_spent.toFixed(0)}</p>
                      <p className="text-gray-600 text-sm">
                        {locale === 'he' ? 'סך הוצא' : locale === 'ar' ? 'إجمالي الإنفاق' : 'Total Spent'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Heart className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{customer.loyalty_points}</p>
                      <p className="text-gray-600 text-sm">
                        {locale === 'he' ? 'נקודות' : locale === 'ar' ? 'نقاط' : 'Points'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-playfair font-bold">
                    {locale === 'he' ? 'הזמנות אחרונות' : 
                     locale === 'ar' ? 'الطلبات الأخيرة' : 
                     'Recent Orders'}
                  </h2>
                  <Button variant="outline" onClick={() => setActiveTab('orders')}>
                    {locale === 'he' ? 'צפה בהכל' : locale === 'ar' ? 'عرض الكل' : 'View All'}
                  </Button>
                </div>

                <div className="space-y-4">
                  {orders.length > 0 ? orders.slice(0, 3).map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">{order.order_number}</span>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusText(order.status)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{new Date(order.created_at).toLocaleDateString()}</span>
                          <span>
                            {order.items?.length || 0} {locale === 'he' ? 'פריטים' : locale === 'ar' ? 'عناصر' : 'items'}
                          </span>
                          <span className="font-semibold text-gray-900">₪{Number(order.total_amount).toFixed(0)}</span>
                        </div>
                      </div>

                      <Button variant="outline" size="sm">
                        {locale === 'he' ? 'פרטים' : locale === 'ar' ? 'التفاصيل' : 'Details'}
                      </Button>
                    </motion.div>
                  )) : (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">
                        {locale === 'he' ? 'אין הזמנות עדיין' : 
                         locale === 'ar' ? 'لا توجد طلبات بعد' : 
                         'No orders yet'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h2 className="text-2xl font-playfair font-bold mb-6">
                {locale === 'he' ? 'ההזמנות שלי' : 
                 locale === 'ar' ? 'طلباتي' : 
                 'My Orders'}
              </h2>
              <p className="text-gray-600">
                {locale === 'he' ? 'כאן תוכלו לצפות בכל ההזמנות שלכם ולעקוב אחר הסטטוס שלהן.' : 
                 locale === 'ar' ? 'هنا يمكنكم عرض جميع طلباتكم وتتبع حالتها.' : 
                 'Here you can view all your orders and track their status.'}
              </p>
            </motion.div>
          )}

          {activeTab === 'wishlist' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-playfair font-bold">
                  {locale === 'he' ? 'רשימת משאלות' : 
                   locale === 'ar' ? 'قائمة الأمنيات' : 
                   'My Wishlist'}
                </h2>
                <Link href={`/${locale}/wishlist`}>
                  <Button>
                    {locale === 'he' ? 'צפה בהכל' : locale === 'ar' ? 'عرض الكل' : 'View All'}
                  </Button>
                </Link>
              </div>
              <p className="text-gray-600">
                {locale === 'he' ? 'שמרו והתארגנו עם הפריטים שאתם הכי אוהבים.' : 
                 locale === 'ar' ? 'احفظوا ونظموا العناصر التي تحبونها أكثر.' : 
                 'Save and organize your favorite items.'}
              </p>
            </motion.div>
          )}

          {/* Render other tabs similarly */}
          {['addresses', 'payment', 'settings'].includes(activeTab) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h2 className="text-2xl font-playfair font-bold mb-6">
                {menuItems.find(item => item.id === activeTab)?.label}
              </h2>
              <p className="text-gray-600 mb-6">
                {locale === 'he' ? 'הדף הזה בבנייה. נחזור בקרוב עם תכונות נוספות!' : 
                 locale === 'ar' ? 'هذه الصفحة قيد الإنشاء. سنعود قريباً بمزيد من الميزات!' : 
                 'This section is under construction. Coming soon with more features!'}
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {locale === 'he' ? 'הוסף חדש' : locale === 'ar' ? 'إضافة جديد' : 'Add New'}
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
