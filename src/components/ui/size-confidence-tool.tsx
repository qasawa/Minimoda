'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Ruler, TrendingUp, AlertCircle, CheckCircle, Calculator } from 'lucide-react'
import { Button } from './button'
import type { Product, Locale } from '@/lib/types'

interface SizeConfidenceToolProps {
  product: Product
  locale: Locale
  onSizeRecommendation?: (size: string, confidence: number) => void
}

interface ChildMeasurements {
  currentAge: number // months
  height?: number // cm
  weight?: number // kg
  currentClothingSize?: string
}

export function SizeConfidenceTool({ product, locale, onSizeRecommendation }: SizeConfidenceToolProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [measurements, setMeasurements] = useState<ChildMeasurements>({
    currentAge: 12
  })
  const [recommendedSize, setRecommendedSize] = useState<string | null>(null)
  const [confidence, setConfidence] = useState<number>(0)
  const [growthPrediction, setGrowthPrediction] = useState<string | null>(null)

  const isRTL = locale === 'ar' || locale === 'he'

  const getLocalizedText = (key: string) => {
    const texts = {
      sizePredictor: {
        en: 'Size Predictor',
        he: 'מנבא מידות',
        ar: 'متنبئ القياسات'
      },
      findPerfectFit: {
        en: 'Find Perfect Fit',
        he: 'מצא גזרה מושלמת',
        ar: 'اعثر على القياس المثالي'
      },
      childAge: {
        en: "Child's Age",
        he: 'גיל הילד',
        ar: 'عمر الطفل'
      },
      months: {
        en: 'months',
        he: 'חודשים',
        ar: 'شهور'
      },
      height: {
        en: 'Height (cm)',
        he: 'גובה (ס"מ)',
        ar: 'الطول (سم)'
      },
      weight: {
        en: 'Weight (kg)',
        he: 'משקל (ק"ג)',
        ar: 'الوزن (كغ)'
      },
      currentSize: {
        en: 'Current clothing size',
        he: 'מידת בגדים נוכחית',
        ar: 'مقاس الملابس الحالي'
      },
      calculate: {
        en: 'Calculate Size',
        he: 'חשב מידה',
        ar: 'احسب القياس'
      },
      recommended: {
        en: 'Recommended',
        he: 'מומלץ',
        ar: 'موصى به'
      },
      confidence: {
        en: 'Confidence',
        he: 'רמת ביטחון',
        ar: 'مستوى الثقة'
      },
      willFitFor: {
        en: 'Will fit for approximately',
        he: 'יתאים למשך כ',
        ar: 'سيناسب لمدة تقريباً'
      },
      monthsText: {
        en: 'months',
        he: 'חודשים',
        ar: 'شهور'
      },
      tryAgain: {
        en: 'Try Again',
        he: 'נסה שוב',
        ar: 'حاول مرة أخرى'
      },
      optional: {
        en: 'optional',
        he: 'אופציונלי',
        ar: 'اختياري'
      }
    }
    return texts[key as keyof typeof texts]?.[locale] || texts[key as keyof typeof texts]?.en || key
  }

  const calculateSizeRecommendation = () => {
    const { currentAge, height, weight, currentClothingSize } = measurements
    
    // Basic size prediction algorithm
    let predictedSize = ''
    let confidenceScore = 50 // Base confidence
    let fittingMonths = 6 // Default fitting duration

    // Age-based prediction
    if (currentAge <= 3) {
      predictedSize = '0-3M'
      fittingMonths = 2
    } else if (currentAge <= 6) {
      predictedSize = '3-6M'
      fittingMonths = 3
    } else if (currentAge <= 12) {
      predictedSize = '6-12M'
      fittingMonths = 4
    } else if (currentAge <= 18) {
      predictedSize = '12-18M'
      fittingMonths = 5
    } else if (currentAge <= 24) {
      predictedSize = '18-24M'
      fittingMonths = 6
    } else if (currentAge <= 36) {
      predictedSize = '2T'
      fittingMonths = 8
    } else if (currentAge <= 48) {
      predictedSize = '3T'
      fittingMonths = 10
    } else {
      predictedSize = '4T'
      fittingMonths = 12
    }

    // Adjust confidence based on additional data
    if (height) confidenceScore += 20
    if (weight) confidenceScore += 15
    if (currentClothingSize) confidenceScore += 25

    // Factor in product-specific fit guide
    if (product.fitGuide) {
      if (product.fitGuide.runsLarge) {
        // Recommend one size smaller
        const sizeIndex = product.sizes.indexOf(predictedSize)
        if (sizeIndex > 0) {
          predictedSize = product.sizes[sizeIndex - 1]
        }
      } else if (product.fitGuide.runsSmall) {
        // Recommend one size larger
        const sizeIndex = product.sizes.indexOf(predictedSize)
        if (sizeIndex < product.sizes.length - 1) {
          predictedSize = product.sizes[sizeIndex + 1]
        }
      }
      
      if (product.fitGuide.expectedWearMonths) {
        fittingMonths = product.fitGuide.expectedWearMonths
      }
      
      if (product.fitGuide.trueToSize) confidenceScore += 10
    }

    // Ensure we have this size available
    if (!product.sizes.includes(predictedSize)) {
      // Find closest available size
      const availableSizes = product.sizes
      predictedSize = availableSizes[Math.floor(availableSizes.length / 2)] || availableSizes[0]
      confidenceScore -= 15
    }

    // Cap confidence at 95%
    confidenceScore = Math.min(confidenceScore, 95)

    setRecommendedSize(predictedSize)
    setConfidence(confidenceScore)
    setGrowthPrediction(`${fittingMonths}`)
    
    if (onSizeRecommendation) {
      onSizeRecommendation(predictedSize, confidenceScore)
    }
  }

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50'
    if (score >= 60) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getConfidenceIcon = (score: number) => {
    if (score >= 80) return CheckCircle
    if (score >= 60) return AlertCircle
    return AlertCircle
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="interactive glow-on-hover"
      >
        <Calculator className="w-4 h-4 mr-2" />
        {getLocalizedText('sizePredictor')}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {step === 1 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <Ruler className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-gray-900">
                      {getLocalizedText('findPerfectFit')}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {/* Age Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {getLocalizedText('childAge')} *
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={measurements.currentAge}
                          onChange={(e) => setMeasurements(prev => ({
                            ...prev,
                            currentAge: parseInt(e.target.value) || 0
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          min="0"
                          max="120"
                        />
                        <span className="absolute right-3 top-2 text-gray-500 text-sm">
                          {getLocalizedText('months')}
                        </span>
                      </div>
                    </div>

                    {/* Height Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {getLocalizedText('height')} <span className="text-gray-400">({getLocalizedText('optional')})</span>
                      </label>
                      <input
                        type="number"
                        value={measurements.height || ''}
                        onChange={(e) => setMeasurements(prev => ({
                          ...prev,
                          height: parseFloat(e.target.value) || undefined
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        min="0"
                        max="200"
                        placeholder="85"
                      />
                    </div>

                    {/* Weight Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {getLocalizedText('weight')} <span className="text-gray-400">({getLocalizedText('optional')})</span>
                      </label>
                      <input
                        type="number"
                        value={measurements.weight || ''}
                        onChange={(e) => setMeasurements(prev => ({
                          ...prev,
                          weight: parseFloat(e.target.value) || undefined
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        min="0"
                        max="100"
                        step="0.1"
                        placeholder="12.5"
                      />
                    </div>

                    {/* Current Size */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {getLocalizedText('currentSize')} <span className="text-gray-400">({getLocalizedText('optional')})</span>
                      </label>
                      <select
                        value={measurements.currentClothingSize || ''}
                        onChange={(e) => setMeasurements(prev => ({
                          ...prev,
                          currentClothingSize: e.target.value || undefined
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">Select current size</option>
                        {product.sizes.map(size => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        calculateSizeRecommendation()
                        setStep(2)
                      }}
                      className="flex-1"
                      disabled={!measurements.currentAge}
                    >
                      {getLocalizedText('calculate')}
                    </Button>
                  </div>
                </div>
              )}

              {step === 2 && recommendedSize && (
                <div className="space-y-6">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-gray-900">
                      {getLocalizedText('recommended')}
                    </h3>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {recommendedSize}
                    </div>
                    
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(confidence)}`}>
                      {(() => {
                        const Icon = getConfidenceIcon(confidence)
                        return <Icon className="w-4 h-4" />
                      })()}
                      {confidence}% {getLocalizedText('confidence')}
                    </div>
                  </div>

                  {growthPrediction && (
                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                      <p className="text-blue-800">
                        {getLocalizedText('willFitFor')} <strong>{growthPrediction}</strong> {getLocalizedText('monthsText')}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setStep(1)
                        setRecommendedSize(null)
                        setConfidence(0)
                      }}
                      className="flex-1"
                    >
                      {getLocalizedText('tryAgain')}
                    </Button>
                    <Button
                      onClick={() => setIsOpen(false)}
                      className="flex-1"
                    >
                      Done
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
