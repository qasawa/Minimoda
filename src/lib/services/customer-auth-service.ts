/**
 * CUSTOMER AUTHENTICATION SERVICE
 * Handles customer login, registration, session management, and profile data
 */

import { supabase } from '../supabase/client'
import type { User, Session } from '@supabase/supabase-js'

export interface CustomerProfile {
  id: string
  phone: string
  name?: string
  email?: string
  preferred_language: 'he' | 'ar' | 'en'
  birth_date?: string
  addresses: Address[]
  kids_profiles: KidProfile[]
  preferences?: any
  loyalty_points: number
  total_spent: number
  order_count: number
  last_order_date?: string
  marketing_consent: boolean
  whatsapp_consent: boolean
  sms_consent: boolean
  created_at: string
  updated_at: string
}

export interface Address {
  id: string
  type: 'home' | 'work' | 'other'
  name?: string
  street: string
  city: string
  postal_code?: string
  country: string
  is_default: boolean
}

export interface KidProfile {
  id: string
  name: string
  birth_date: string
  gender: 'boy' | 'girl' | 'unisex'
  size_preferences?: {
    clothing?: string
    shoes?: string
  }
}

export interface CustomerLoginCredentials {
  email?: string
  phone?: string
  password?: string
  // For phone-based auth (common in Israel)
  verification_code?: string
}

export interface CustomerAuthResponse {
  success: boolean
  user?: CustomerProfile
  session?: Session | null
  error?: string
  requiresVerification?: boolean
}

export class CustomerAuthService {
  private static readonly SESSION_KEY = 'customer_session'

  /**
   * Register new customer with email/password or phone
   */
  static async register(credentials: {
    email?: string
    phone?: string
    password?: string
    name?: string
    preferred_language?: 'he' | 'ar' | 'en'
  }): Promise<CustomerAuthResponse> {
    try {
      if (!supabase) {
        return { success: false, error: 'Authentication service not available' }
      }

      let authData
      if (credentials.email && credentials.password) {
        // Email/password registration
        const { data, error } = await supabase.auth.signUp({
          email: credentials.email,
          password: credentials.password,
          options: {
            data: {
              name: credentials.name,
              preferred_language: credentials.preferred_language || 'he'
            }
          }
        })

        if (error) {
          return { success: false, error: error.message }
        }

        authData = data
      } else if (credentials.phone) {
        // Phone-based registration (for WhatsApp integration)
        const { data, error } = await supabase.auth.signInWithOtp({
          phone: credentials.phone,
          options: {
            data: {
              name: credentials.name,
              preferred_language: credentials.preferred_language || 'he'
            }
          }
        })

        if (error) {
          return { success: false, error: error.message }
        }

        return { 
          success: true, 
          requiresVerification: true,
          error: 'Verification code sent to your phone'
        }
      } else {
        return { success: false, error: 'Email or phone number required' }
      }

      if (!authData.user) {
        return { success: false, error: 'Registration failed' }
      }

      // Create customer profile
      const { data: profile, error: profileError } = await supabase
        .from('customers')
        .insert({
          id: authData.user.id,
          phone: credentials.phone || '',
          name: credentials.name,
          email: credentials.email,
          preferred_language: credentials.preferred_language || 'he',
          marketing_consent: false,
          whatsapp_consent: !!credentials.phone,
          sms_consent: false
        })
        .select()
        .single()

      if (profileError) {
        // Clean up auth user if profile creation fails
        await supabase.auth.admin.deleteUser(authData.user.id)
        return { success: false, error: 'Failed to create customer profile' }
      }

      return {
        success: true,
        user: profile,
        session: authData.session,
        error: credentials.email ? 'Please check your email to confirm your account' : undefined
      }

    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }

  /**
   * Login customer with email/password or phone
   */
  static async login(credentials: CustomerLoginCredentials): Promise<CustomerAuthResponse> {
    try {
      if (!supabase) {
        return { success: false, error: 'Authentication service not available' }
      }

      let authData
      if (credentials.email && credentials.password) {
        // Email/password login
        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password
        })

        if (error) {
          return { success: false, error: error.message }
        }

        authData = data
      } else if (credentials.phone && credentials.verification_code) {
        // Phone verification
        const { data, error } = await supabase.auth.verifyOtp({
          phone: credentials.phone,
          token: credentials.verification_code,
          type: 'sms'
        })

        if (error) {
          return { success: false, error: error.message }
        }

        authData = data
      } else if (credentials.phone) {
        // Send phone verification
        const { error } = await supabase.auth.signInWithOtp({
          phone: credentials.phone
        })

        if (error) {
          return { success: false, error: error.message }
        }

        return { 
          success: true, 
          requiresVerification: true,
          error: 'Verification code sent to your phone'
        }
      } else {
        return { success: false, error: 'Email/password or phone number required' }
      }

      if (!authData.user) {
        return { success: false, error: 'Login failed' }
      }

      // Get customer profile
      const profile = await this.getCustomerProfile(authData.user.id)
      if (!profile) {
        // Create profile if doesn't exist (for legacy users)
        const { data: newProfile } = await supabase
          .from('customers')
          .insert({
            id: authData.user.id,
            phone: credentials.phone || '',
            email: credentials.email || authData.user.email,
            preferred_language: 'he'
          })
          .select()
          .single()

        return {
          success: true,
          user: newProfile,
          session: authData.session
        }
      }

      return {
        success: true,
        user: profile,
        session: authData.session
      }

    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }

  /**
   * Get current authenticated customer
   */
  static async getCurrentCustomer(): Promise<{
    user: CustomerProfile | null
    session: Session | null
    error: string | null
  }> {
    try {
      if (!supabase) {
        return { user: null, session: null, error: 'Authentication service not available' }
      }

      const { data: { session }, error } = await supabase.auth.getSession()

      if (error || !session?.user) {
        return { user: null, session: null, error: error?.message || 'Not authenticated' }
      }

      // Get customer profile
      const profile = await this.getCustomerProfile(session.user.id)
      return { user: profile, session, error: null }

    } catch (error) {
      return { user: null, session: null, error: (error as Error).message }
    }
  }

  /**
   * Get customer profile by ID
   */
  static async getCustomerProfile(userId: string): Promise<CustomerProfile | null> {
    try {
      if (!supabase) {
        return null
      }

      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', userId)
        .single()

      if (error || !data) {
        return null
      }

      return data
    } catch (error) {
      console.error('Error fetching customer profile:', error)
      return null
    }
  }

  /**
   * Update customer profile
   */
  static async updateProfile(updates: Partial<CustomerProfile>): Promise<{
    success: boolean
    user?: CustomerProfile
    error?: string
  }> {
    try {
      if (!supabase) {
        return { success: false, error: 'Service not available' }
      }

      const { user } = await this.getCurrentCustomer()
      if (!user) {
        return { success: false, error: 'Not authenticated' }
      }

      const { data, error } = await supabase
        .from('customers')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, user: data }

    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }

  /**
   * Logout customer
   */
  static async logout(): Promise<{ error: string | null }> {
    try {
      if (!supabase) {
        return { error: 'Authentication service not available' }
      }

      const { error } = await supabase.auth.signOut()
      
      // Clear local session
      if (typeof window !== 'undefined') {
        localStorage.removeItem(this.SESSION_KEY)
      }

      return { error: error?.message || null }

    } catch (error) {
      return { error: (error as Error).message }
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!supabase) {
        return { success: false, error: 'Service not available' }
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }

    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }

  /**
   * Get customer orders
   */
  static async getCustomerOrders(customerId: string, limit = 10): Promise<any[]> {
    try {
      if (!supabase) {
        return []
      }

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching orders:', error)
        return []
      }

      return data || []

    } catch (error) {
      console.error('Error fetching customer orders:', error)
      return []
    }
  }

  /**
   * Check if user is authenticated (for middleware/guards)
   */
  static async isAuthenticated(): Promise<boolean> {
    try {
      const { user } = await this.getCurrentCustomer()
      return !!user
    } catch {
      return false
    }
  }
}
