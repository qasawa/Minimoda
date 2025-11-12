#!/usr/bin/env node

/**
 * Setup Supabase database schema
 * This script will create all necessary tables and indexes
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

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
 * Main setup function
 */
async function setupDatabase() {
  console.log('🚀 Setting up Supabase database schema...')

  try {
    // Read the schema file
    const schemaPath = path.join(__dirname, '../supabase/schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')

    console.log('📝 Executing database schema...')
    
    // Execute the schema
    const { data, error } = await supabase.rpc('exec_sql', { sql: schema })

    if (error) {
      console.error('❌ Error setting up database:', error)
      process.exit(1)
    }

    console.log('✅ Database schema setup completed successfully!')
    console.log('\n📊 Created tables:')
    console.log('- products')
    console.log('- inventory') 
    console.log('- customers')
    console.log('- orders')
    console.log('- analytics')
    console.log('\n🔗 You can now run: node scripts/import-products.js')

  } catch (error) {
    console.error('💥 Setup failed:', error)
    process.exit(1)
  }
}

// Run the setup
if (require.main === module) {
  setupDatabase()
}

module.exports = { setupDatabase }