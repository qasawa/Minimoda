#!/usr/bin/env node

/**
 * Setup admin user for the admin panel
 * This script will create the admin user and necessary tables
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration!')
  console.log('Please set the following environment variables:')
  console.log('- NEXT_PUBLIC_SUPABASE_URL')
  console.log('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

/**
 * Create admin tables and setup admin user
 */
async function setupAdmin() {
  console.log('🚀 Setting up admin user and tables...')

  try {
    // Check if admin tables exist (they should be created by schema.sql)
    console.log('📝 Checking admin tables...')
    const { data: tables, error: checkError } = await supabase
      .from('admin_users')
      .select('count(*)', { count: 'exact', head: true })

    if (checkError && checkError.code === 'PGRST116') {
      console.log('⚠️  Admin tables not found. Please run the updated schema.sql first.')
      console.log('   Copy the updated schema from supabase/schema.sql to your Supabase SQL Editor and run it.')
      return
    }

    // Create the admin user in Supabase Auth
    console.log('👤 Creating admin user in Supabase Auth...')
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@minimoda.com',
      password: 'minimoda2024',
      email_confirm: true
    })

    if (authError && authError.code === 'email_exists') {
      console.log('✅ Admin user already exists in Supabase Auth')
    } else if (authError) {
      console.error('❌ Error creating auth user:', authError)
      return
    } else {
      console.log('✅ Admin user created in Supabase Auth')
    }

    // Create admin profile
    console.log('📊 Creating admin profile...')
    const { error: profileError } = await supabase
      .from('admin_users')
      .upsert({
        email: 'admin@minimoda.com',
        role: 'super_admin',
        permissions: [
          'products.read',
          'products.write',
          'products.delete',
          'orders.read',
          'orders.write',
          'orders.delete',
          'customers.read',
          'customers.write',
          'analytics.read',
          'inventory.read',
          'inventory.write',
          'admin.read',
          'admin.write'
        ],
        is_active: true,
        two_factor_enabled: false
      }, {
        onConflict: 'email'
      })

    if (profileError) {
      console.error('❌ Error creating admin profile:', profileError)
      return
    }

    console.log('✅ Admin setup completed successfully!')
    console.log('\n📊 Admin Credentials:')
    console.log('- Email: admin@minimoda.com')
    console.log('- Password: minimoda2024')
    console.log('- Role: super_admin')
    console.log('\n🔗 Admin Login: http://localhost:3000/admin/login')

  } catch (error) {
    console.error('💥 Setup failed:', error)
    process.exit(1)
  }
}

// Run the setup
if (require.main === module) {
  setupAdmin()
}

module.exports = { setupAdmin }
