'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface AdminContextType {
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  activeSection: string
  setActiveSection: (section: string) => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [activeSection, setActiveSection] = useState('dashboard')

  return (
    <AdminContext.Provider 
      value={{
        isLoading,
        setIsLoading,
        activeSection,
        setActiveSection
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}
