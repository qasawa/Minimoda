'use client'

import React from 'react'
import OrderManagement from '@/components/admin/order-management'
import { useAdmin } from '@/lib/contexts/admin-context'

export default function OrdersAdminPage() {
  const { setActiveSection } = useAdmin()

  React.useEffect(() => {
    setActiveSection('orders')
  }, [setActiveSection])

  return <OrderManagement locale="en" />
}
