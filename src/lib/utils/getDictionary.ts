import type { Locale } from '@/lib/types'

const dictionaries = {
  en: () => import('../translations/en.json').then((module) => module.default),
  he: () => import('../translations/he.json').then((module) => module.default),
  ar: () => import('../translations/ar.json').then((module) => module.default),
}

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]()
}
