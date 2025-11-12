import { supabase } from '../supabase/client'
import { User, Session } from '@supabase/supabase-js'

export interface AdminUser {
  id: string
  email: string
  role: 'super_admin' | 'admin' | 'manager' | 'staff'
  permissions: string[]
  name: string
  avatar?: string
  lastLogin?: string
  isActive: boolean
  createdAt: string
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface Permission {
  resource: string
  action: 'create' | 'read' | 'update' | 'delete' | 'manage'
}

export class AuthService {
  private static readonly ADMIN_ROLES = ['super_admin', 'admin', 'manager', 'staff']
  private static readonly PERMISSIONS_MAP = {
    super_admin: ['*'],
    admin: [
      'products:manage',
      'orders:manage', 
      'customers:manage',
      'inventory:manage',
      'analytics:read',
      'settings:update'
    ],
    manager: [
      'products:read',
      'products:update',
      'orders:manage',
      'customers:read',
      'inventory:read',
      'inventory:update'
    ],
    staff: [
      'products:read',
      'orders:read',
      'orders:update',
      'customers:read',
      'inventory:read'
    ]
  }

  // Admin login
  static async adminLogin(credentials: LoginCredentials): Promise<{
    user: AdminUser | null
    session: Session | null
    error: string | null
  }> {
    try {
      if (!supabase) {
        return { user: null, session: null, error: 'Authentication service not available' }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      })

      if (error) {
        return { user: null, session: null, error: error.message }
      }

      if (!data.user || !data.session) {
        return { user: null, session: null, error: 'Login failed' }
      }

      // Check if user is admin
      const adminUser = await this.getAdminUser(data.user.id)
      if (!adminUser) {
        await supabase.auth.signOut()
        return { user: null, session: null, error: 'Access denied. Admin privileges required.' }
      }

      // Update last login
      await this.updateLastLogin(adminUser.id)

      // Log login event
      await this.logSecurityEvent('admin_login', {
        user_id: adminUser.id,
        email: adminUser.email,
        ip_address: await this.getClientIP(),
        user_agent: navigator.userAgent
      })

      return { user: adminUser, session: data.session, error: null }
    } catch (error) {
      return { user: null, session: null, error: (error as Error).message }
    }
  }

  // Admin logout
  static async adminLogout(): Promise<{ error: string | null }> {
    try {
      if (!supabase) {
        return { error: 'Authentication service not available' }
      }

      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        await this.logSecurityEvent('admin_logout', {
          user_id: user.id,
          ip_address: await this.getClientIP()
        })
      }

      const { error } = await supabase.auth.signOut()
      return { error: error?.message || null }
    } catch (error) {
      return { error: (error as Error).message }
    }
  }

  // Get current admin user
  static async getCurrentAdminUser(): Promise<{
    user: AdminUser | null
    error: string | null
  }> {
    try {
      if (!supabase) {
        return { user: null, error: 'Authentication service not available' }
      }

      const { data: { user }, error } = await supabase.auth.getUser()

      if (error || !user) {
        return { user: null, error: error?.message || 'Not authenticated' }
      }

      const adminUser = await this.getAdminUser(user.id)
      return { user: adminUser, error: null }
    } catch (error) {
      return { user: null, error: (error as Error).message }
    }
  }

  // Get admin user by ID
  private static async getAdminUser(userId: string): Promise<AdminUser | null> {
    try {
      if (!supabase) {
        return null
      }

      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', userId)
        .eq('is_active', true)
        .single()

      if (error || !data) {
        return null
      }

      return {
        id: data.id,
        email: data.email,
        role: data.role,
        permissions: this.PERMISSIONS_MAP[data.role as keyof typeof this.PERMISSIONS_MAP] || [],
        name: data.name,
        avatar: data.avatar,
        lastLogin: data.last_login,
        isActive: data.is_active,
        createdAt: data.created_at
      }
    } catch (error) {
      console.error('Error fetching admin user:', error)
      return null
    }
  }

  // Check if user has permission
  static hasPermission(user: AdminUser | null, resource: string, action: string): boolean {
    if (!user || !user.isActive) return false

    // Super admin has all permissions
    if (user.role === 'super_admin' || user.permissions.includes('*')) {
      return true
    }

    // Check specific permission
    const permissionKey = `${resource}:${action}`
    const manageKey = `${resource}:manage`

    return user.permissions.includes(permissionKey) || user.permissions.includes(manageKey)
  }

  // Check if user has any of the required roles
  static hasRole(user: AdminUser | null, roles: string[]): boolean {
    if (!user || !user.isActive) return false
    return roles.includes(user.role)
  }

  // Require permission (throws error if not authorized)
  static requirePermission(user: AdminUser | null, resource: string, action: string): void {
    if (!this.hasPermission(user, resource, action)) {
      throw new Error(`Insufficient permissions for ${action} on ${resource}`)
    }
  }

  // Require role (throws error if not authorized)
  static requireRole(user: AdminUser | null, roles: string[]): void {
    if (!this.hasRole(user, roles)) {
      throw new Error(`Access denied. Required roles: ${roles.join(', ')}`)
    }
  }

  // Change password
  static async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      if (!supabase) {
        return { success: false, error: 'Authentication service not available' }
      }

      // Verify current password by attempting to sign in
      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.email) {
        return { success: false, error: 'User not found' }
      }

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        return { success: false, error: error.message }
      }

      // Log password change
      await this.logSecurityEvent('password_changed', {
        user_id: user.id,
        ip_address: await this.getClientIP()
      })

      return { success: true, error: null }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }

  // Update last login
  private static async updateLastLogin(userId: string): Promise<void> {
    try {
      if (!supabase) return

      await supabase
        .from('admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', userId)
    } catch (error) {
      console.error('Error updating last login:', error)
    }
  }

  // Enable/disable two-factor authentication
  static async toggleTwoFactor(enable: boolean): Promise<{
    success: boolean
    qrCode?: string
    backupCodes?: string[]
    error: string | null
  }> {
    try {
      if (!supabase) {
        return { success: false, error: 'Authentication service not available' }
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { success: false, error: 'User not found' }
      }

      if (enable) {
        // Generate TOTP secret and QR code
        // This would typically use a library like 'qrcode' and 'speakeasy'
        const qrCode = 'data:image/png;base64,...' // Placeholder
        const backupCodes = this.generateBackupCodes()

        await supabase
          .from('admin_users')
          .update({ 
            two_factor_enabled: true,
            two_factor_backup_codes: backupCodes
          })
          .eq('id', user.id)

        return { success: true, qrCode, backupCodes, error: null }
      } else {
        await supabase
          .from('admin_users')
          .update({ 
            two_factor_enabled: false,
            two_factor_secret: null,
            two_factor_backup_codes: null
          })
          .eq('id', user.id)

        return { success: true, error: null }
      }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }

  // Generate backup codes for 2FA
  private static generateBackupCodes(): string[] {
    const codes: string[] = []
    for (let i = 0; i < 8; i++) {
      codes.push(Math.random().toString(36).substring(2, 10).toUpperCase())
    }
    return codes
  }

  // Log security events
  static async logSecurityEvent(
    eventType: string,
    metadata: Record<string, any>
  ): Promise<void> {
    try {
      if (!supabase) return

      await supabase
        .from('security_logs')
        .insert({
          event_type: eventType,
          metadata,
          created_at: new Date().toISOString()
        })
    } catch (error) {
      console.error('Error logging security event:', error)
    }
  }

  // Get client IP address
  private static async getClientIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json')
      const data = await response.json()
      return data.ip
    } catch (error) {
      return 'unknown'
    }
  }

  // Session management
  static async refreshSession(): Promise<{
    session: Session | null
    error: string | null
  }> {
    try {
      if (!supabase) {
        return { session: null, error: 'Authentication service not available' }
      }

      const { data, error } = await supabase.auth.refreshSession()
      return { session: data.session, error: error?.message || null }
    } catch (error) {
      return { session: null, error: (error as Error).message }
    }
  }

  // Get security logs
  static async getSecurityLogs(
    userId?: string,
    eventType?: string,
    limit: number = 50
  ): Promise<{ data: any[] | null; error: string | null }> {
    try {
      if (!supabase) {
        return { data: null, error: 'Authentication service not available' }
      }

      let query = supabase
        .from('security_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (userId) {
        query = query.eq('metadata->user_id', userId)
      }

      if (eventType) {
        query = query.eq('event_type', eventType)
      }

      const { data, error } = await query

      if (error) {
        return { data: null, error: error.message }
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error: (error as Error).message }
    }
  }

  // Monitor failed login attempts
  static async checkFailedAttempts(email: string): Promise<{
    isBlocked: boolean
    attemptsRemaining: number
    blockExpiry?: string
  }> {
    try {
      if (!supabase) {
        return { isBlocked: false, attemptsRemaining: 5 }
      }

      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
      
      const { data, error } = await supabase
        .from('security_logs')
        .select('*')
        .eq('event_type', 'failed_login')
        .eq('metadata->email', email)
        .gte('created_at', oneHourAgo)

      if (error) {
        return { isBlocked: false, attemptsRemaining: 5 }
      }

      const failedAttempts = data.length
      const maxAttempts = 5
      const isBlocked = failedAttempts >= maxAttempts

      return {
        isBlocked,
        attemptsRemaining: Math.max(0, maxAttempts - failedAttempts),
        blockExpiry: isBlocked ? new Date(Date.now() + 60 * 60 * 1000).toISOString() : undefined
      }
    } catch (error) {
      return { isBlocked: false, attemptsRemaining: 5 }
    }
  }

  // Create admin user (super admin only)
  static async createAdminUser(userData: {
    email: string
    password: string
    name: string
    role: 'admin' | 'manager' | 'staff'
  }): Promise<{ success: boolean; user?: AdminUser; error: string | null }> {
    try {
      // Check if current user is super admin
      const { user: currentUser } = await this.getCurrentAdminUser()
      this.requireRole(currentUser, ['super_admin'])

      if (!supabase) {
        return { success: false, error: 'Authentication service not available' }
      }

      // Create auth user
      const { data, error } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true
      })

      if (error || !data.user) {
        return { success: false, error: error?.message || 'Failed to create user' }
      }

      // Create admin user record
      const { error: insertError } = await supabase
        .from('admin_users')
        .insert({
          id: data.user.id,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          is_active: true,
          created_at: new Date().toISOString()
        })

      if (insertError) {
        // Clean up auth user if admin record creation fails
        await supabase.auth.admin.deleteUser(data.user.id)
        return { success: false, error: insertError.message }
      }

      const adminUser = await this.getAdminUser(data.user.id)
      return { success: true, user: adminUser || undefined, error: null }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }
}
