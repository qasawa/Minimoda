module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'he', 'ar'],
  },
  fallbackLng: {
    default: ['en'],
  },
  supportedLngs: ['en', 'he', 'ar'],
  reloadOnPrerender: process.env.NODE_ENV === 'development',
}
