'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Phone, Lock, User, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CustomerAuthService } from '@/lib/services/customer-auth-service'
import type { Locale } from '@/lib/types'

interface CustomerAuthModalProps {
  isOpen: boolean
  onClose: () => void
  locale: Locale
  onSuccess?: () => void
  initialMode?: 'login' | 'register'
}

export function CustomerAuthModal({ 
  isOpen, 
  onClose, 
  locale, 
  onSuccess,
  initialMode = 'login' 
}: CustomerAuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'phone-verify'>(initialMode)
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Form data
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [verificationCode, setVerificationCode] = useState('')

  const isRTL = locale === 'he' || locale === 'ar'

  const texts = {
    en: {
      login: 'Sign In',
      register: 'Create Account',
      email: 'Email',
      phone: 'Phone Number',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      name: 'Full Name',
      verificationCode: 'Verification Code',
      loginButton: 'Sign In',
      registerButton: 'Create Account',
      verifyButton: 'Verify',
      switchToRegister: "Don't have an account? Sign up",
      switchToLogin: 'Already have an account? Sign in',
      useEmail: 'Use Email',
      usePhone: 'Use Phone',
      forgotPassword: 'Forgot Password?',
      phoneHelper: 'Enter your phone number to receive a verification code',
      verificationHelper: 'Enter the verification code sent to your phone',
      close: 'Close'
    },
    he: {
      login: 'התחברות',
      register: 'יצירת חשבון',
      email: 'אימייל',
      phone: 'מספר טלפון',
      password: 'סיסמה',
      confirmPassword: 'אשר סיסמה',
      name: 'שם מלא',
      verificationCode: 'קוד אימות',
      loginButton: 'התחבר',
      registerButton: 'צור חשבון',
      verifyButton: 'אמת',
      switchToRegister: 'אין לך חשבון? הירשם',
      switchToLogin: 'יש לך חשבון? התחבר',
      useEmail: 'השתמש באימייל',
      usePhone: 'השתמש בטלפון',
      forgotPassword: 'שכחת סיסמה?',
      phoneHelper: 'הזן את מספר הטלפון שלך לקבלת קוד אימות',
      verificationHelper: 'הזן את קוד האימות שנשלח לטלפון שלך',
      close: 'סגור'
    },
    ar: {
      login: 'تسجيل الدخول',
      register: 'إنشاء حساب',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      name: 'الاسم الكامل',
      verificationCode: 'رمز التحقق',
      loginButton: 'تسجيل الدخول',
      registerButton: 'إنشاء حساب',
      verifyButton: 'تحقق',
      switchToRegister: 'ليس لديك حساب؟ سجل',
      switchToLogin: 'لديك حساب؟ سجل الدخول',
      useEmail: 'استخدم البريد الإلكتروني',
      usePhone: 'استخدم الهاتف',
      forgotPassword: 'نسيت كلمة المرور؟',
      phoneHelper: 'أدخل رقم هاتفك لتلقي رمز التحقق',
      verificationHelper: 'أدخل رمز التحقق المرسل إلى هاتفك',
      close: 'إغلاق'
    }
  }

  const t = texts[locale]

  useEffect(() => {
    if (isOpen) {
      setError('')
      setSuccess('')
    }
  }, [isOpen, mode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      if (mode === 'register') {
        // Validation
        if (authMethod === 'email') {
          if (!email || !password || !name) {
            setError('Please fill in all fields')
            setIsLoading(false)
            return
          }
          if (password !== confirmPassword) {
            setError('Passwords do not match')
            setIsLoading(false)
            return
          }
        } else {
          if (!phone || !name) {
            setError('Please fill in all fields')
            setIsLoading(false)
            return
          }
        }

        const result = await CustomerAuthService.register({
          email: authMethod === 'email' ? email : undefined,
          phone: authMethod === 'phone' ? phone : undefined,
          password: authMethod === 'email' ? password : undefined,
          name,
          preferred_language: locale
        })

        if (result.success) {
          if (result.requiresVerification) {
            setMode('phone-verify')
            setSuccess(result.error || 'Verification code sent')
          } else {
            setSuccess('Account created successfully!')
            setTimeout(() => {
              onSuccess?.()
              onClose()
            }, 1500)
          }
        } else {
          setError(result.error || 'Registration failed')
        }

      } else if (mode === 'login') {
        const result = await CustomerAuthService.login({
          email: authMethod === 'email' ? email : undefined,
          phone: authMethod === 'phone' ? phone : undefined,
          password: authMethod === 'email' ? password : undefined
        })

        if (result.success) {
          if (result.requiresVerification) {
            setMode('phone-verify')
            setSuccess(result.error || 'Verification code sent')
          } else {
            setSuccess('Login successful!')
            setTimeout(() => {
              onSuccess?.()
              onClose()
            }, 1500)
          }
        } else {
          setError(result.error || 'Login failed')
        }

      } else if (mode === 'phone-verify') {
        if (!verificationCode) {
          setError('Please enter verification code')
          setIsLoading(false)
          return
        }

        const result = await CustomerAuthService.login({
          phone,
          verification_code: verificationCode
        })

        if (result.success) {
          setSuccess('Verification successful!')
          setTimeout(() => {
            onSuccess?.()
            onClose()
          }, 1500)
        } else {
          setError(result.error || 'Verification failed')
        }
      }

    } catch (error) {
      setError('An unexpected error occurred')
    }

    setIsLoading(false)
  }

  const resetForm = () => {
    setEmail('')
    setPhone('')
    setPassword('')
    setConfirmPassword('')
    setName('')
    setVerificationCode('')
    setError('')
    setSuccess('')
  }

  const switchMode = () => {
    resetForm()
    setMode(mode === 'login' ? 'register' : 'login')
  }

  const switchAuthMethod = () => {
    resetForm()
    setAuthMethod(authMethod === 'email' ? 'phone' : 'email')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {mode === 'phone-verify' ? t.verificationCode :
                 mode === 'register' ? t.register : t.login}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {mode !== 'phone-verify' && (
                <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
                  <button
                    type="button"
                    onClick={() => setAuthMethod('email')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors ${
                      authMethod === 'email' 
                        ? 'bg-white text-coral-600 shadow-sm' 
                        : 'text-gray-600'
                    }`}
                  >
                    <Mail className="h-4 w-4" />
                    {t.useEmail}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMethod('phone')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors ${
                      authMethod === 'phone' 
                        ? 'bg-white text-coral-600 shadow-sm' 
                        : 'text-gray-600'
                    }`}
                  >
                    <Phone className="h-4 w-4" />
                    {t.usePhone}
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'phone-verify' ? (
                  <>
                    <p className="text-sm text-gray-600 mb-4">
                      {t.verificationHelper}
                    </p>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.verificationCode}
                      </label>
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                        placeholder="123456"
                        maxLength={6}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {mode === 'register' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.name}
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                            placeholder={t.name}
                            required
                          />
                        </div>
                      </div>
                    )}

                    {authMethod === 'email' ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.email}
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                            placeholder={t.email}
                            required
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t.phone}
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                              placeholder="+972-50-123-4567"
                              required
                            />
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">
                          {t.phoneHelper}
                        </p>
                      </>
                    )}

                    {authMethod === 'email' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t.password}
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                              placeholder={t.password}
                              required
                              minLength={6}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>

                        {mode === 'register' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {t.confirmPassword}
                            </label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                                placeholder={t.confirmPassword}
                                required
                                minLength={6}
                              />
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-600">{success}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-coral-500 hover:bg-coral-600 text-white py-3"
                >
                  {isLoading ? 'Loading...' : 
                   mode === 'phone-verify' ? t.verifyButton :
                   mode === 'register' ? t.registerButton : t.loginButton}
                </Button>
              </form>

              {mode !== 'phone-verify' && (
                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={switchMode}
                    className="text-coral-600 hover:text-coral-700 text-sm font-medium"
                  >
                    {mode === 'login' ? t.switchToRegister : t.switchToLogin}
                  </button>

                  {mode === 'login' && authMethod === 'email' && (
                    <div className="mt-2">
                      <button
                        type="button"
                        className="text-gray-600 hover:text-gray-700 text-sm"
                      >
                        {t.forgotPassword}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
