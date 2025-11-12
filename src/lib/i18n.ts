export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'he', 'ar'],
} as const

export type Locale = (typeof i18n)['locales'][number]

export const languages = {
  en: { name: 'English', dir: 'ltr' },
  he: { name: 'עברית', dir: 'rtl' },
  ar: { name: 'العربية', dir: 'rtl' },
} as const
