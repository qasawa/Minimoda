import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { i18n } from './lib/i18n'
import type { Locale } from './lib/types'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Skip locale redirect for admin routes, API routes, static files, and Pictures folder
  if (pathname.startsWith('/admin') || 
      pathname.startsWith('/api') || 
      pathname.startsWith('/_next') ||
      pathname.startsWith('/Pictures') ||
      pathname.startsWith('/public') ||
      pathname.includes('.')) {
    return NextResponse.next()
  }
  
  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request)
    
    return NextResponse.redirect(
      new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
    )
  }
}

function getLocale(request: NextRequest): Locale {
  // Get locale from cookie if exists
  const localeCookie = request.cookies.get('locale')?.value
  if (localeCookie && i18n.locales.includes(localeCookie as Locale)) {
    return localeCookie as Locale
  }
  
  // Otherwise use Accept-Language header
  const acceptLanguage = request.headers.get('Accept-Language')
  if (acceptLanguage) {
    const detectedLocale = acceptLanguage
      .split(',')
      .map(lang => lang.split(';')[0].trim().split('-')[0])
      .find(lang => i18n.locales.includes(lang as Locale))
    
    if (detectedLocale) return detectedLocale as Locale
  }
  
  return i18n.defaultLocale
}

export const config = {
  matcher: [
    // Skip all internal paths (_next), API routes, admin routes, Pictures folder, and static files
    '/((?!_next|api|admin|Pictures|favicon.ico|sw.js|manifest.json|.*\\.).*)',
  ]
}
