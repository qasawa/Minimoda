'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SearchService, SearchSuggestion } from '@/lib/services/search-service'
import { useRouter } from 'next/navigation'
import { useDebounce } from '@/lib/hooks/use-debounce'
import { Search, X, Clock, TrendingUp, Filter } from 'lucide-react'

interface EnhancedSearchProps {
  locale: string
  placeholder?: string
  onSearch?: (query: string) => void
  showFilters?: boolean
  compact?: boolean
}

export default function EnhancedSearch({ 
  locale, 
  placeholder, 
  onSearch,
  showFilters = false,
  compact = false 
}: EnhancedSearchProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [trendingSearches, setTrendingSearches] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  
  const debouncedQuery = useDebounce(query, 300)

  // Load recent and trending searches on mount
  useEffect(() => {
    loadSearchData()
  }, [locale]) // eslint-disable-line react-hooks/exhaustive-deps

  // Handle search suggestions
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      loadSuggestions(debouncedQuery)
    } else {
      setSuggestions([])
    }
  }, [debouncedQuery, locale]) // eslint-disable-line react-hooks/exhaustive-deps

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const loadSearchData = async () => {
    try {
      // Load recent searches from localStorage
      const recent = localStorage.getItem(`recent-searches-${locale}`)
      if (recent) {
        setRecentSearches(JSON.parse(recent))
      }

      // Load trending searches
      const trending = await SearchService.getTrendingSearches(locale, 5)
      setTrendingSearches(trending)
    } catch (error) {
      console.error('Error loading search data:', error)
    }
  }

  const loadSuggestions = async (searchQuery: string) => {
    setIsLoading(true)
    try {
      const suggestions = await SearchService.getAutocompleteSuggestions(searchQuery, locale)
      setSuggestions(suggestions)
    } catch (error) {
      console.error('Error loading suggestions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return

    // Add to recent searches
    const recent = JSON.parse(localStorage.getItem(`recent-searches-${locale}`) || '[]')
    const updatedRecent = [searchQuery, ...recent.filter((item: string) => item !== searchQuery)]
      .slice(0, 5) // Keep only 5 recent searches
    localStorage.setItem(`recent-searches-${locale}`, JSON.stringify(updatedRecent))
    setRecentSearches(updatedRecent)

    // Navigate to search results or call callback
    if (onSearch) {
      onSearch(searchQuery)
    } else {
      router.push(`/${locale}/products?search=${encodeURIComponent(searchQuery)}`)
    }

    setIsOpen(false)
    setQuery('')
  }, [locale, onSearch, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setIsOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(query)
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'category') {
      router.push(`/${locale}/products?category=${suggestion.text}`)
    } else if (suggestion.type === 'brand') {
      router.push(`/${locale}/products?brand=${suggestion.text}`)
    } else {
      handleSearch(suggestion.text)
    }
    setIsOpen(false)
  }

  const clearRecentSearches = () => {
    localStorage.removeItem(`recent-searches-${locale}`)
    setRecentSearches([])
  }

  const isRTL = locale === 'he' || locale === 'ar'

  return (
    <div ref={searchRef} className={`relative ${compact ? 'w-full max-w-md' : 'w-full'}`}>
      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder || (
              locale === 'he' ? 'חפש מוצרים...' :
              locale === 'ar' ? 'ابحث عن المنتجات...' :
              'Search products...'
            )}
            className={`
              w-full px-4 bg-white/95 backdrop-blur-sm border border-white/30 rounded-full
              focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 focus:bg-white
              transition-all duration-200 shadow-sm hover:bg-white placeholder-gray-500
              ${isRTL ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4'}
              ${compact ? 'py-1.5 text-sm' : 'py-2.5 text-sm'}
            `}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
          
          <div className={`absolute top-1/2 transform -translate-y-1/2 ${
            isRTL ? 'right-3' : 'left-3'
          }`}>
            <Search className={`w-4 h-4 text-gray-400 ${isLoading ? 'animate-pulse' : ''}`} />
          </div>

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setSuggestions([])
                inputRef.current?.focus()
              }}
              className={`absolute top-1/2 transform -translate-y-1/2 ${
                isRTL ? 'left-4' : 'right-4'
              } text-gray-400 hover:text-gray-600 transition-colors`}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {showFilters && (
          <button
            type="button"
            className="ml-3 px-4 py-3 bg-sage-100 text-sage-700 rounded-xl hover:bg-sage-200 transition-colors flex items-center space-x-2"
            onClick={() => {
              // Handle filter button click
              router.push(`/${locale}/products`)
            }}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">
              {locale === 'he' ? 'סינון' : locale === 'ar' ? 'تصفية' : 'Filter'}
            </span>
          </button>
        )}
      </form>

      {/* Search Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden"
          >
            {/* Search Suggestions */}
            {suggestions.length > 0 && (
              <div className="border-b border-gray-100">
                <div className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {locale === 'he' ? 'הצעות' : locale === 'ar' ? 'اقتراحات' : 'Suggestions'}
                </div>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    <div className="flex-shrink-0">
                      {suggestion.type === 'product' && <Search className="w-4 h-4 text-gray-400" />}
                      {suggestion.type === 'category' && <div className="w-4 h-4 bg-blue-100 rounded text-xs flex items-center justify-center text-blue-600">C</div>}
                      {suggestion.type === 'brand' && <div className="w-4 h-4 bg-green-100 rounded text-xs flex items-center justify-center text-green-600">B</div>}
                    </div>
                    <span className="flex-1 text-gray-700">{suggestion.text}</span>
                    {suggestion.count && (
                      <span className="text-xs text-gray-400">({suggestion.count})</span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Recent Searches */}
            {!query && recentSearches.length > 0 && (
              <div className="border-b border-gray-100">
                <div className="p-3 flex items-center justify-between">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center space-x-2">
                    <Clock className="w-3 h-3" />
                    <span>
                      {locale === 'he' ? 'חיפושים אחרונים' : 
                       locale === 'ar' ? 'عمليات بحث حديثة' : 
                       'Recent Searches'}
                    </span>
                  </div>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {locale === 'he' ? 'נקה' : locale === 'ar' ? 'مسح' : 'Clear'}
                  </button>
                </div>
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(search)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="flex-1 text-gray-700">{search}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Trending Searches */}
            {!query && trendingSearches.length > 0 && (
              <div>
                <div className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center space-x-2">
                  <TrendingUp className="w-3 h-3" />
                  <span>
                    {locale === 'he' ? 'טרנדים' : 
                     locale === 'ar' ? 'الأكثر بحثاً' : 
                     'Trending'}
                  </span>
                </div>
                {trendingSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(search)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    <TrendingUp className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    <span className="flex-1 text-gray-700">{search}</span>
                    <span className="text-xs text-orange-500">#{index + 1}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!suggestions.length && !recentSearches.length && !trendingSearches.length && query.length >= 2 && (
              <div className="p-6 text-center text-gray-500">
                <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">
                  {locale === 'he' ? 'לא נמצאו תוצאות' :
                   locale === 'ar' ? 'لم يتم العثور على نتائج' :
                   'No results found'}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
