'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useAdmin } from '@/lib/contexts/admin-context'
import { WhatsAppCenter } from '@/components/admin/whatsapp-center'

export default function WhatsAppAdminPage() {
  const { setActiveSection } = useAdmin()

  React.useEffect(() => {
    setActiveSection('whatsapp')
  }, [setActiveSection])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">WhatsApp Center</h1>
        <p className="text-gray-600 mt-1">Manage customer communications and support</p>
      </div>

      {/* WhatsApp Center Component */}
      <WhatsAppCenter />
    </motion.div>
  )
}
