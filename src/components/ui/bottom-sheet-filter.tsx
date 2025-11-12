'use client'

import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { X, Check } from 'lucide-react'
import { useState } from 'react'
import type { Locale } from '@/lib/i18n'

interface FilterOption {
  id: string
  label: { en: string; he: string; ar: string }
  options: Array<{
    value: string
    label: { en: string; he: string; ar: string }
  }>
}

interface BottomSheetFilterProps {
  isOpen: boolean
  onClose: () => void
  filters: FilterOption[]
  locale: Locale
  onApply: (filters: Record<string, string[]>) => void
}

export function BottomSheetFilter({ isOpen, onClose, filters, locale, onApply }: BottomSheetFilterProps) {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
  
  const handleDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.y > 100) {
      onClose()
    }
  }

  const toggleFilter = (filterId: string, value: string) => {
    setSelectedFilters(prev => {
      const current = prev[filterId] || []
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value]
      
      return { ...prev, [filterId]: updated }
    })

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(5)
    }
  }

  const handleApply = () => {
    onApply(selectedFilters)
    onClose()
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10)
    }
  }

  const clearAll = () => {
    setSelectedFilters({})
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10)
    }
  }

  const titles = {
    en: { title: 'Filters', apply: 'Apply', clear: 'Clear All' },
    he: { title: 'סינון', apply: 'החל', clear: 'נקה הכל' },
    ar: { title: 'تصفية', apply: 'تطبيق', clear: 'مسح الكل' }
  }

  const t = titles[locale] || titles.en

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag="y"
            dragDirectionLock
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[80vh]"
          >
            {/* Handle */}
            <div className="flex justify-center py-3">
              <div className="w-12 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 pb-4 border-b border-gray-200">
              <button
                onClick={clearAll}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                {t.clear}
              </button>
              <h2 className="text-xl font-semibold">{t.title}</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Filter Options */}
            <div className="overflow-y-auto max-h-[60vh] px-6 py-4">
              {filters.map((filter) => (
                <div key={filter.id} className="mb-6">
                  <h3 className="font-semibold mb-3">
                    {filter.label[locale] || filter.label.en}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {filter.options.map((option) => {
                      const isSelected = selectedFilters[filter.id]?.includes(option.value)
                      return (
                        <motion.button
                          key={option.value}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleFilter(filter.id, option.value)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            isSelected
                              ? 'bg-navy-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {option.label[locale] || option.label.en}
                          {isSelected && (
                            <Check className="inline-block ml-1 h-3 w-3" />
                          )}
                        </motion.button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Apply Button */}
            <div className="p-6 border-t border-gray-200">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleApply}
                className="w-full py-4 bg-gradient-to-r from-navy-500 to-navy-600 text-white font-semibold rounded-2xl shadow-lg"
              >
                {t.apply}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
