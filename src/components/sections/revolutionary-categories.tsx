'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { RevolutionaryCategorySystem, AGE_GROUPS, ACTIVITY_CATEGORIES } from '@/lib/utils/revolutionary-category-system'
import { getDictionary } from '@/lib/utils/getDictionary'
import { useAnimationCapability } from '@/lib/utils/performance'

interface RevolutionaryCategoriesProps {
  locale: string
  dict: Awaited<ReturnType<typeof getDictionary>>
}

// PRIMARY NAVIGATION: Age-First Categories
const ageCategories = [
  {
    id: 'newborn',
    image: '/Pictures/full-length-portrait-cute-little-girl-hat.jpg',
    href: '/age/newborn',
    ageRange: '0-3M',
    gradient: 'from-pink-100 via-rose-50 to-pink-100',
    textColor: 'text-pink-800',
    borderColor: 'border-pink-200',
    hoverGradient: 'hover:from-pink-200 hover:to-rose-100'
  },
  {
    id: 'baby',
    image: '/Pictures/full-length-portrait-cute-little-girl-hat.jpg',
    href: '/age/baby',
    ageRange: '3-24M',
    gradient: 'from-blue-100 via-sky-50 to-blue-100',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-200',
    hoverGradient: 'hover:from-blue-200 hover:to-sky-100'
  },
  {
    id: 'toddler',
    image: '/Pictures/full-shot-kids-posing-together.jpg',
    href: '/age/toddler',
    ageRange: '2-4Y',
    gradient: 'from-green-100 via-emerald-50 to-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-200',
    hoverGradient: 'hover:from-green-200 hover:to-emerald-100'
  },
  {
    id: 'little-kids',
    image: '/Pictures/low-angle-little-boy-posing.jpg',
    href: '/age/little-kids',
    ageRange: '4-8Y',
    gradient: 'from-purple-100 via-violet-50 to-purple-100',
    textColor: 'text-purple-800',
    borderColor: 'border-purple-200',
    hoverGradient: 'hover:from-purple-200 hover:to-violet-100'
  },
  {
    id: 'big-kids',
    image: '/Pictures/low-angle-little-boy-posing.jpg',
    href: '/age/big-kids',
    ageRange: '8-14Y',
    gradient: 'from-orange-100 via-amber-50 to-orange-100',
    textColor: 'text-orange-800',
    borderColor: 'border-orange-200',
    hoverGradient: 'hover:from-orange-200 hover:to-amber-100'
  }
]

// SECONDARY: Activity-Based Categories
const activityCategories = [
  {
    id: 'school-mode',
    icon: '🎒',
    gradient: 'from-blue-500 to-cyan-500',
    href: '/activity/school-mode'
  },
  {
    id: 'play-wild',
    icon: '🏃',
    gradient: 'from-green-500 to-emerald-500',
    href: '/activity/play-wild'
  },
  {
    id: 'dream-time',
    icon: '😴',
    gradient: 'from-purple-500 to-violet-500',
    href: '/activity/dream-time'
  },
  {
    id: 'celebration-ready',
    icon: '✨',
    gradient: 'from-pink-500 to-rose-500',
    href: '/activity/celebration-ready'
  },
  {
    id: 'weather-warriors',
    icon: '🌦️',
    gradient: 'from-teal-500 to-cyan-500',
    href: '/activity/weather-warriors'
  },
  {
    id: 'eco-conscious',
    icon: '🌱',
    gradient: 'from-emerald-500 to-green-500',
    href: '/activity/eco-conscious'
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12
    }
  }
}

const hoverVariants = {
  hover: {
    scale: 1.05,
    y: -8,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 10
    }
  }
}

export default function RevolutionaryCategories({ locale, dict }: RevolutionaryCategoriesProps) {
  const canAnimate = useAnimationCapability()
  const isRTL = locale === 'ar' || locale === 'he'
  
  // Get localized data from our revolutionary system
  const ageGroups = RevolutionaryCategorySystem.getAgeGroups()
  const activities = RevolutionaryCategorySystem.getActivityCategories()

  return (
    <section className="py-12 lg:py-20 bg-gradient-to-b from-white to-kiddora-cream relative overflow-hidden">
      {/* Revolutionary Web3-Inspired Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-kiddora-pink/30 to-kiddora-teal/30 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-kiddora-blue/30 to-kiddora-teal/30 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-r from-kiddora-pink/20 to-kiddora-blue/20 rounded-full blur-xl animate-pulse delay-2000" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Revolutionary Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl lg:text-5xl font-extrabold text-kiddora-dark mb-6 font-heading">
            {locale === 'he' ? 'קנו לפי גיל - כמו שההורים חושבים! 🎯' : 
             locale === 'ar' ? 'تسوقوا حسب العمر - كما يفكر الوالدون! 🎯' : 
             'Shop by Age - How Parents Actually Think! 🎯'}
          </h2>
          <p className="text-xl text-kiddora-gray max-w-3xl mx-auto font-body leading-relaxed">
            {locale === 'he' ? 'אנחנו יודעים שהדבר הראשון שאתם חושבים עליו זה הגיל. אז למה לא להתחיל משם?' :
             locale === 'ar' ? 'نحن نعلم أن أول شيء تفكرون به هو العمر. فلماذا لا نبدأ من هناك؟' :
             'We know the first thing you think about is age. So why not start there? 🌈'}
          </p>
        </motion.div>

        {/* AGE-FIRST NAVIGATION - Revolutionary Primary Categories */}
        <div className="mb-12 sm:mb-16 md:mb-20">
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-kiddora-dark mb-3 sm:mb-4 font-heading">
              {locale === 'he' ? 'בחרו לפי גיל הילד' : 
               locale === 'ar' ? 'اختاروا حسب عمر الطفل' : 
               'Choose by Your Kid\'s Age'}
            </h3>
            <p className="text-base sm:text-lg text-kiddora-gray">
              {locale === 'he' ? 'כל גיל צריך משהו אחר - אנחנו מבינים את זה' :
               locale === 'ar' ? 'كل عمر يحتاج شيئاً مختلفاً - نحن نفهم ذلك' :
               'Every age needs something different - we get it'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 lg:gap-8 max-w-7xl mx-auto">
            {ageCategories.map((category, index) => {
              const ageGroup = ageGroups.find(group => group.id === category.id)
              if (!ageGroup) return null

              return (
                <div
                  key={category.id}
                  className="group"
                >
                  <Link 
                    href={`/${locale}${category.href}`}
                    className="block"
                  >
                    <div
                      className={`relative bg-gradient-to-br ${category.gradient} rounded-3xl border-2 ${category.borderColor}`}
                    >
                      {/* Age Badge */}
                      <div className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 z-10">
                        <div 
                          className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold ${category.textColor} bg-white/90`}
                        >
                          {category.ageRange}
                        </div>
                      </div>

                      {/* Category Image */}
                      <div className="relative aspect-square overflow-hidden">
                        <Image
                          src={category.image}
                          alt={ageGroup.name[locale as keyof typeof ageGroup.name] || ageGroup.name.en}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 20vw"
                        />
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      </div>

                      {/* Category Content */}
                      <div className="p-3 sm:p-4 md:p-6">
                        <div className="text-center">
                          <h3 className={`${category.textColor} font-bold text-sm sm:text-base lg:text-lg xl:text-xl mb-2 sm:mb-3
                            ${isRTL ? 'font-arabic' : ''}`}
                            style={{ 
                              fontFamily: locale === 'ar' ? 'var(--font-tajawal)' : 
                                         locale === 'he' ? 'var(--font-rubik)' : 
                                         'inherit' 
                            }}
                          >
                            {ageGroup.name[locale as keyof typeof ageGroup.name] || ageGroup.name.en}
                          </h3>
                          
                          <p className={`text-gray-700 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed
                            ${isRTL ? 'font-arabic' : ''}`}
                            style={{ 
                              fontFamily: locale === 'ar' ? 'var(--font-tajawal)' : 
                                         locale === 'he' ? 'var(--font-rubik)' : 
                                         'inherit' 
                            }}
                          >
                            {ageGroup.description[locale as keyof typeof ageGroup.description] || ageGroup.description.en}
                          </p>
                          
                          {/* Explore Button */}
                          <div className="opacity-100">
                            <div className={`inline-block px-3 sm:px-4 md:px-6 py-1 sm:py-2 ${category.textColor} bg-white/90 font-semibold text-xs sm:text-sm uppercase tracking-wider rounded-full border border-white/50`}>
                              {locale === 'he' ? 'גלו עכשיו' : locale === 'ar' ? 'اكتشفوا الآن' : 'EXPLORE NOW'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
        </div>

        {/* ACTIVITY-BASED SECONDARY NAVIGATION */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-kiddora-dark mb-4 font-heading">
              {locale === 'he' ? '🎭 או קנו לפי פעילות' : 
               locale === 'ar' ? '🎭 أو تسوقوا حسب النشاط' : 
               '🎭 Or Shop by Activity'}
            </h3>
            <p className="text-lg text-kiddora-gray">
              {locale === 'he' ? 'כי לפעמים אתם יודעים בדיוק למה אתם צריכים בגדים' :
               locale === 'ar' ? 'لأنكم أحياناً تعرفون بالضبط لماذا تحتاجون الملابس' :
               'Because sometimes you know exactly what you need clothes for'}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
            {activityCategories.map((activity) => {
              const activityData = activities.find(act => act.id === activity.id)
              if (!activityData) return null

              return (
                <motion.div
                  key={activity.id}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="group"
                >
                  <Link 
                    href={`/${locale}${activity.href}`}
                    className="block"
                  >
                    <div className={`relative bg-gradient-to-br ${activity.gradient} rounded-2xl p-6 text-center text-white shadow-lg group-hover:shadow-xl transition-all duration-300 overflow-hidden`}>
                      {/* Activity Icon */}
                      <motion.div 
                        className="text-4xl mb-3"
                        animate={{ 
                          rotate: [0, 5, -5, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          duration: 3, 
                          repeat: Infinity, 
                          ease: "easeInOut" 
                        }}
                      >
                        {activity.icon}
                      </motion.div>
                      
                      <h4 className={`font-bold text-lg mb-2 ${isRTL ? 'font-arabic' : ''}`}
                        style={{ 
                          fontFamily: locale === 'ar' ? 'var(--font-tajawal)' : 
                                     locale === 'he' ? 'var(--font-rubik)' : 
                                     'inherit' 
                        }}
                      >
                        {activityData.name[locale as keyof typeof activityData.name] || activityData.name.en}
                      </h4>
                      
                      <p className={`text-white/90 text-sm ${isRTL ? 'font-arabic' : ''}`}
                        style={{ 
                          fontFamily: locale === 'ar' ? 'var(--font-tajawal)' : 
                                     locale === 'he' ? 'var(--font-rubik)' : 
                                     'inherit' 
                        }}
                      >
                        {activityData.parentNeed[locale as keyof typeof activityData.parentNeed] || activityData.parentNeed.en}
                      </p>

                      {/* Hover Sparkle Effect */}
                      <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                        style={{
                          background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8) 0%, transparent 70%)'
                        }}
                      />
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* STYLE QUIZ CTA */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Link href={`/${locale}/style-quiz`}>
            <motion.div 
              className="inline-block bg-gray-900 text-white px-12 py-6 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 group"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center gap-4">
                <div className="text-left">
                  <h3 className="text-xl font-bold mb-1">
                    {locale === 'he' ? 'לא בטוחים מה מתאים?' : 
                     locale === 'ar' ? 'لستم متأكدين مما يناسب؟' : 
                     'Not sure what fits?'}
                  </h3>
                  <p className="text-white/90">
                    {locale === 'he' ? 'נענה על 3 שאלות ונמצא בשבילכם!' :
                     locale === 'ar' ? 'أجيبوا على 3 أسئلة وسنجد لكم!' :
                     'Answer 3 questions and we\'ll find for you!'}
                  </p>
                </div>
                <motion.span
                  className="text-2xl group-hover:translate-x-2 transition-transform duration-300"
                >
                  →
                </motion.span>
              </div>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
