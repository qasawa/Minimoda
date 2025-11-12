'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { languages } from '@/lib/i18n'
import { cn } from '@/lib/utils/cn'
import { Globe, ChevronDown } from 'lucide-react'

interface LanguageToggleProps {
  currentLocale: string
}

export function LanguageToggle({ currentLocale }: LanguageToggleProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/')
    segments[1] = newLocale
    const newPath = segments.join('/')
    
    // Set cookie for persistence
    document.cookie = `locale=${newLocale};path=/;max-age=31536000`
    
    router.push(newPath)
    setIsOpen(false)
  }


  
  // Language display mapping
  const languageDisplay = {
    en: 'EN',
    he: 'HE', 
    ar: 'AR'
  }
  
  const languageNames = {
    en: 'English',
    he: 'עברית',
    ar: 'العربية'
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-medium",
          "rounded-full transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-white/30",
          "bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20",
          "hover:scale-105"
        )}
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="h-3.5 w-3.5" />
        <span className="font-medium text-xs">{languageDisplay[currentLocale as keyof typeof languageDisplay]}</span>
        <ChevronDown 
          className={cn(
            "h-3 w-3 transition-transform duration-200",
            isOpen && "rotate-180"
          )} 
        />
      </button>

      {isOpen && (
        <div className={cn(
          "absolute top-full mt-2 min-w-[140px]",
          "bg-white rounded-xl shadow-lg border border-gray-100",
          "overflow-hidden",
          "animate-in fade-in slide-in-from-top-2 duration-200",
          "right-0 z-50"
        )}>
          {Object.entries(languages).map(([locale]) => (
            <button
              key={locale}
              onClick={() => switchLocale(locale)}
              className={cn(
                "w-full px-4 py-3 text-sm text-left flex items-center gap-3",
                "hover:bg-maisonette-blue-50 transition-colors",
                "focus:outline-none focus:bg-maisonette-blue-50",
                "text-gray-700",
                currentLocale === locale && "bg-maisonette-blue-100 text-maisonette-blue-800 font-semibold"
              )}
              lang={locale}
            >
              <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded uppercase">
                {languageDisplay[locale as keyof typeof languageDisplay]}
              </span>
              <span>
                {languageNames[locale as keyof typeof languageNames]}
              </span>
              {currentLocale === locale && (
                <span className="ml-auto text-maisonette-blue-600">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
