'use client'

import { motion } from 'framer-motion'
import { Shield, Heart, Sparkles, Clock, Award, Baby } from 'lucide-react'
import type { Product, Locale } from '@/lib/types'

interface KidsProductFeaturesProps {
  product: Product
  locale: Locale
  className?: string
}

export function KidsProductFeatures({ product, locale, className = '' }: KidsProductFeaturesProps) {
  const isRTL = locale === 'ar' || locale === 'he'

  const getAgeDisplayText = () => {
    if (!product.ageRange) return null
    
    const { min, max, developmentStage } = product.ageRange
    const minYears = Math.floor(min / 12)
    const maxYears = Math.floor(max / 12)
    
    if (locale === 'he') {
      return developmentStage === 'newborn' ? 'ילוד' :
             developmentStage === 'infant' ? 'תינוק' :
             developmentStage === 'toddler' ? 'פעוט' :
             developmentStage === 'preschool' ? 'גן ילדים' :
             `${minYears}-${maxYears} שנים`
    } else if (locale === 'ar') {
      return developmentStage === 'newborn' ? 'مولود جديد' :
             developmentStage === 'infant' ? 'رضيع' :
             developmentStage === 'toddler' ? 'طفل صغير' :
             developmentStage === 'preschool' ? 'ما قبل المدرسة' :
             `${minYears}-${maxYears} سنوات`
    } else {
      return developmentStage === 'newborn' ? 'Newborn' :
             developmentStage === 'infant' ? 'Infant' :
             developmentStage === 'toddler' ? 'Toddler' :
             developmentStage === 'preschool' ? 'Preschool' :
             `${minYears}-${maxYears} years`
    }
  }

  const getFitGuideText = () => {
    if (!product.fitGuide) return null
    
    if (product.fitGuide.runsLarge) {
      return locale === 'he' ? 'גזרה גדולה' :
             locale === 'ar' ? 'مقاس كبير' :
             'Runs Large'
    }
    if (product.fitGuide.runsSmall) {
      return locale === 'he' ? 'גזרה קטנה' :
             locale === 'ar' ? 'مقاس صغير' :
             'Runs Small'
    }
    if (product.fitGuide.trueToSize) {
      return locale === 'he' ? 'גזרה מדויקת' :
             locale === 'ar' ? 'مقاس دقيق' :
             'True to Size'
    }
    return null
  }

  const getSafetyFeatures = () => {
    if (!product.safetyFeatures) return []
    
    const features = []
    if (product.safetyFeatures.chokeHazardFree) {
      features.push({
        icon: Shield,
        text: locale === 'he' ? 'בטוח לתינוקות' :
              locale === 'ar' ? 'آمن للأطفال' :
              'Choke-Free'
      })
    }
    if (product.safetyFeatures.organicMaterials) {
      features.push({
        icon: Heart,
        text: locale === 'he' ? 'חומרים אורגניים' :
              locale === 'ar' ? 'مواد عضوية' :
              'Organic'
      })
    }
    if (product.safetyFeatures.hypoallergenic) {
      features.push({
        icon: Sparkles,
        text: locale === 'he' ? 'היפואלרגני' :
              locale === 'ar' ? 'مضاد للحساسية' :
              'Hypoallergenic'
      })
    }
    return features
  }

  const getDurabilityDisplay = () => {
    if (!product.durabilityScore) return null
    
    const score = product.durabilityScore
    const level = score >= 8 ? 'high' : score >= 6 ? 'medium' : 'low'
    
    const text = locale === 'he' ? 
      (level === 'high' ? 'עמידות גבוהה' : level === 'medium' ? 'עמידות בינונית' : 'עמידות בסיסית') :
      locale === 'ar' ?
      (level === 'high' ? 'مقاومة عالية' : level === 'medium' ? 'مقاومة متوسطة' : 'مقاومة أساسية') :
      (level === 'high' ? 'High Durability' : level === 'medium' ? 'Medium Durability' : 'Basic Durability')
    
    return { score, level, text }
  }

  const getExpectedWearText = () => {
    if (!product.fitGuide?.expectedWearMonths) return null
    
    const months = product.fitGuide.expectedWearMonths
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12
    
    if (locale === 'he') {
      return years > 0 ? `${years} שנה ו-${remainingMonths} חודשים` : `${months} חודשים`
    } else if (locale === 'ar') {
      return years > 0 ? `${years} سنة و ${remainingMonths} شهر` : `${months} شهور`
    } else {
      return years > 0 ? `${years}y ${remainingMonths}m` : `${months} months`
    }
  }

  const ageText = getAgeDisplayText()
  const fitGuideText = getFitGuideText()
  const safetyFeatures = getSafetyFeatures()
  const durabilityDisplay = getDurabilityDisplay()
  const expectedWearText = getExpectedWearText()

  if (!ageText && !fitGuideText && safetyFeatures.length === 0 && !durabilityDisplay && !expectedWearText) {
    return null
  }

  return (
    <motion.div
      className={`space-y-3 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Age Range */}
      {ageText && (
        <motion.div
          className="flex items-center gap-2 text-sm text-purple-600"
          whileHover={{ scale: 1.02 }}
        >
          <Baby className="w-4 h-4" />
          <span className="font-medium">{ageText}</span>
        </motion.div>
      )}

      {/* Fit Guide */}
      {fitGuideText && (
        <motion.div
          className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
          whileHover={{ scale: 1.05 }}
        >
          <Sparkles className="w-3 h-3" />
          {fitGuideText}
        </motion.div>
      )}

      {/* Expected Wear Duration */}
      {expectedWearText && (
        <motion.div
          className="flex items-center gap-2 text-sm text-emerald-600"
          whileHover={{ scale: 1.02 }}
        >
          <Clock className="w-4 h-4" />
          <span>
            {locale === 'he' ? 'יחזיק למשך: ' :
             locale === 'ar' ? 'يدوم لمدة: ' :
             'Lasts: '}
            <span className="font-medium">{expectedWearText}</span>
          </span>
        </motion.div>
      )}

      {/* Safety Features */}
      {safetyFeatures.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {safetyFeatures.map((feature, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <feature.icon className="w-3 h-3" />
              {feature.text}
            </motion.div>
          ))}
        </div>
      )}

      {/* Durability Score */}
      {durabilityDisplay && (
        <motion.div
          className="flex items-center gap-2 text-sm"
          whileHover={{ scale: 1.02 }}
        >
          <Award className={`w-4 h-4 ${
            durabilityDisplay.level === 'high' ? 'text-gold-500' :
            durabilityDisplay.level === 'medium' ? 'text-silver-500' :
            'text-bronze-500'
          }`} />
          <span className="text-gray-600">{durabilityDisplay.text}</span>
          <div className="flex gap-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`w-1 h-3 rounded-full ${
                  i < durabilityDisplay.score ? 'bg-purple-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Parent Reviews Summary */}
      {product.parentReviews?.overallRating && (
        <motion.div
          className="flex items-center gap-2 text-sm text-amber-600"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i < Math.floor(product.parentReviews!.overallRating!) ? 'bg-amber-400' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <span>
            {product.parentReviews.totalReviews} {
              locale === 'he' ? 'ביקורות הורים' :
              locale === 'ar' ? 'مراجعات الوالدين' :
              'parent reviews'
            }
          </span>
        </motion.div>
      )}
    </motion.div>
  )
}
