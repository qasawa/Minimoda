'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Poppins, Playfair_Display, Inter } from 'next/font/google'
import { AdminProvider } from '@/lib/contexts/admin-context'
import { AdminNavigation } from '@/components/admin/navigation'
import { AdminAuthService } from '@/lib/services/admin-auth-service'
import { AdminSidebar } from '@/components/admin/sidebar'
import '@/app/globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700']
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700', '800', '900']
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
})

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      if (pathname === '/admin/login') {
        setIsLoading(false)
        return
      }

      // Validate session with secure auth service
      const { valid, user } = await AdminAuthService.validateSession()
      
      if (!valid) {
        router.push('/admin/login')
      } else {
        setIsAuthenticated(true)
      }
      
      setIsLoading(false)
    }

    checkAuth()
  }, [pathname, router])

  // Show login page without admin layout
  if (pathname === '/admin/login') {
    return (
      <html lang="en" className={`${poppins.variable} ${playfair.variable} ${inter.variable}`}>
        <body>{children}</body>
      </html>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <html lang="en" className={`${poppins.variable} ${playfair.variable} ${inter.variable}`}>
        <body className="bg-gradient-to-br from-navy-50 via-cream-50 to-soft-blue-50 flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-navy-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-navy-600">Loading admin panel...</p>
          </div>
        </body>
      </html>
    )
  }

  // Protected routes
  if (!isAuthenticated) {
    return null
  }

  return (
    <html lang="en" className={`${poppins.variable} ${playfair.variable} ${inter.variable}`}>
      <body className="bg-gray-100">
        <AdminProvider>
          <div className="flex h-screen">
            {/* Sidebar */}
            <AdminSidebar />
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Top Navigation */}
              <AdminNavigation />
              
              {/* Page Content */}
              <main className="flex-1 overflow-auto bg-gray-50">
                <div className="p-6">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </AdminProvider>
      </body>
    </html>
  )
}
