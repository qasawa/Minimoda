import { supabase } from '@/lib/supabase/client'

interface AdminUser {
  id: string
  email: string
  role: 'super_admin' | 'admin' | 'manager'
  permissions: string[]
  last_login: string
}

interface LoginCredentials {
  email: string
  password: string
  twoFactorCode?: string
}

interface AuthResponse {
  success: boolean
  user?: AdminUser
  error?: string
  requiresTwoFactor?: boolean
}

export class AdminAuthService {
  private static readonly SESSION_KEY = 'admin_session'
  private static readonly SESSION_DURATION = 4 * 60 * 60 * 1000 // 4 hours

  /**
   * Authenticate admin user with email and password
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      if (!supabase) {
        return { success: false, error: 'Database connection not available' }
      }
      
      // Use Supabase auth for secure authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (!data.user) {
        return { success: false, error: 'Authentication failed' }
      }

      // Check if user is admin
      const { data: adminProfile, error: profileError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', credentials.email)
        .eq('is_active', true)
        .single()

      if (profileError || !adminProfile) {
        // Sign out if not admin
        if (supabase) {
          await supabase.auth.signOut()
        }
        return { success: false, error: 'Unauthorized access' }
      }

      // Check 2FA if enabled
      if (adminProfile.two_factor_enabled && !credentials.twoFactorCode) {
        return { 
          success: false, 
          requiresTwoFactor: true,
          error: 'Two-factor authentication required'
        }
      }

      if (adminProfile.two_factor_enabled && credentials.twoFactorCode) {
        const isValidCode = await this.verify2FA(adminProfile.id, credentials.twoFactorCode)
        if (!isValidCode) {
          return { success: false, error: 'Invalid two-factor code' }
        }
      }

      // Update last login
      await supabase
        .from('admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', adminProfile.id)

      // Create secure session
      const sessionData = {
        userId: adminProfile.id,
        email: adminProfile.email,
        role: adminProfile.role,
        permissions: adminProfile.permissions || [],
        timestamp: Date.now(),
        sessionId: this.generateSessionId()
      }

      // Store session securely
      sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData))

      // Log admin access
      await this.logAdminActivity(adminProfile.id, 'login', { ip: await this.getClientIP() })

      return {
        success: true,
        user: {
          id: adminProfile.id,
          email: adminProfile.email,
          role: adminProfile.role,
          permissions: adminProfile.permissions || [],
          last_login: new Date().toISOString()
        }
      }

    } catch (error) {
      console.error('Admin login error:', error)
      return { success: false, error: 'Authentication service error' }
    }
  }

  /**
   * Verify 2FA code
   */
  private static async verify2FA(userId: string, code: string): Promise<boolean> {
    try {
      // In production, integrate with TOTP library (speakeasy, authenticator)
      // For now, check against stored backup codes or temp codes
      if (!supabase) {
        return false
      }
      
      const { data } = await supabase
        .from('admin_2fa_codes')
        .select('*')
        .eq('user_id', userId)
        .eq('code', code)
        .eq('used', false)
        .gte('expires_at', new Date().toISOString())
        .single()

      if (data) {
        // Mark code as used
        await supabase
          .from('admin_2fa_codes')
          .update({ used: true })
          .eq('id', data.id)
        
        return true
      }

      return false
    } catch {
      return false
    }
  }

  /**
   * Check if current session is valid
   */
  static async validateSession(): Promise<{ valid: boolean; user?: AdminUser }> {
    try {
      const sessionData = sessionStorage.getItem(this.SESSION_KEY)
      if (!sessionData) {
        return { valid: false }
      }

      const session = JSON.parse(sessionData)
      
      // Check session expiry
      if (Date.now() - session.timestamp > this.SESSION_DURATION) {
        this.logout()
        return { valid: false }
      }

      // Verify user still exists and is active
      if (!supabase) {
        return { valid: false }
      }
      
      const { data: adminUser, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', session.userId)
        .eq('is_active', true)
        .single()

      if (error || !adminUser) {
        this.logout()
        return { valid: false }
      }

      // Check Supabase session
      if (!supabase) {
        return { valid: false }
      }
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        this.logout()
        return { valid: false }
      }

      return {
        valid: true,
        user: {
          id: adminUser.id,
          email: adminUser.email,
          role: adminUser.role,
          permissions: adminUser.permissions || [],
          last_login: adminUser.last_login
        }
      }

    } catch (error) {
      console.error('Session validation error:', error)
      this.logout()
      return { valid: false }
    }
  }

  /**
   * Logout admin user
   */
  static async logout(): Promise<void> {
    try {
      const sessionData = sessionStorage.getItem(this.SESSION_KEY)
      if (sessionData) {
        const session = JSON.parse(sessionData)
        await this.logAdminActivity(session.userId, 'logout')
      }

      // Clear session
      sessionStorage.removeItem(this.SESSION_KEY)
      
      // Sign out from Supabase
      if (supabase) {
        await supabase.auth.signOut()
      }

    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  /**
   * Check if user has specific permission
   */
  static async hasPermission(permission: string): Promise<boolean> {
    const { valid, user } = await this.validateSession()
    if (!valid || !user) return false

    return user.role === 'super_admin' || user.permissions.includes(permission)
  }

  /**
   * Get current admin user
   */
  static async getCurrentUser(): Promise<AdminUser | null> {
    const { valid, user } = await this.validateSession()
    return valid ? user || null : null
  }

  /**
   * Log admin activity for security audit
   */
  private static async logAdminActivity(userId: string, action: string, metadata?: any): Promise<void> {
    try {
      if (supabase) {
        await supabase.from('admin_activity_logs').insert({
          user_id: userId,
          action,
          metadata: metadata || {},
          ip_address: await this.getClientIP(),
          user_agent: navigator.userAgent,
          timestamp: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error('Failed to log admin activity:', error)
    }
  }

  /**
   * Generate secure session ID
   */
  private static generateSessionId(): string {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }

  /**
   * Get client IP address (simplified)
   */
  private static async getClientIP(): Promise<string> {
    try {
      // In production, use proper IP detection service
      const response = await fetch('https://api.ipify.org?format=json')
      const data = await response.json()
      return data.ip
    } catch {
      return 'unknown'
    }
  }

  /**
   * Change admin password
   */
  static async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!supabase) {
        return { success: false, error: 'Database connection not available' }
      }
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        return { success: false, error: error.message }
      }

      // Log password change
      const user = await this.getCurrentUser()
      if (user) {
        await this.logAdminActivity(user.id, 'password_change')
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Failed to change password' }
    }
  }
}

export default AdminAuthService
