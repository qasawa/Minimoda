#!/usr/bin/env node

/**
 * Import products from mock data to Supabase database
 * This script will populate the products table with our expanded inventory
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')
// Import products data
let products
try {
  // Try to import from compiled JS first
  products = require('../src/lib/data/products.js').products
} catch {
  // Fallback to parsing TS file manually
  const fs = require('fs')
  const path = require('path')
  const productsFile = fs.readFileSync(path.join(__dirname, '../src/lib/data/products.ts'), 'utf8')
  
  // Extract the products array using regex (simple parser)
  const match = productsFile.match(/export const products[^=]*=\s*(\[[\s\S]*\])/m)
  if (match) {
    // Use eval for simplicity (only for build script)
    products = eval(match[1])
  } else {
    throw new Error('Could not parse products.ts file')
  }
}

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
 * Transform product data from frontend format to database format
 */
function transformProduct(product) {
  // Generate a proper SKU
  const sku = `MIN-${product.id.toString().padStart(3, '0')}`
  
  // Calculate cost (assuming 60% markup)
  const cost = product.price * 0.6
  
  return {
    // Don't include id - let PostgreSQL generate UUIDs automatically
    // id: product.id,
    name_he: product.name.he,
    name_ar: product.name.ar,
    name_en: product.name.en,
    description_he: product.description.he,
    description_ar: product.description.ar,
    description_en: product.description.en,
    price: product.price,
    cost: cost,
    original_price: product.originalPrice || null,
    is_sale: product.isSale || false,
    is_new: product.isNew || false,
    is_featured: product.featured || false,
    is_active: true,
    category: product.category,
    subcategory: null,
    season: 'all_seasons',
    age_group: product.age || 'all_ages',
    gender: product.category === 'girls' ? 'female' : 
            product.category === 'boys' ? 'male' : 
            product.category === 'baby' ? 'unisex' : 'unisex',
    brand: product.brand || 'MINIMODA',
    sku: sku,
    barcode: null,
    material: 'cotton_blend',
    care_symbols: ['machine_wash', 'tumble_dry_low'],
    sizes: product.sizes || [],
    colors: product.colors || [],
    images: product.images || [],
    sort_order: parseInt(product.id),
    tags: product.tags || [],
    weight: 200, // grams
    dimensions: { length: 20, width: 15, height: 5 }, // cm
    seo_title_he: product.name.he,
    seo_title_ar: product.name.ar,
    seo_title_en: product.name.en,
    seo_description_he: product.description.he,
    seo_description_ar: product.description.ar,
    seo_description_en: product.description.en,
    rating: Math.random() * 2 + 3, // Random rating between 3-5
    review_count: Math.floor(Math.random() * 50) + 1,
    variants: []
  }
}

/**
 * Create inventory records for each product
 */
function createInventoryRecord(productUUID, originalProductId, sizeVariants, colorCount = 1) {
  const inventoryRecords = []
  
  sizeVariants.forEach(size => {
    // Create inventory for each color variant
    for (let colorIndex = 0; colorIndex < colorCount; colorIndex++) {
      const stockQty = Math.floor(Math.random() * 40) + 10 // Random stock 10-50
      inventoryRecords.push({
        product_id: productUUID,
        size: size,
        color_index: colorIndex,
        stock_quantity: stockQty,
        reserved_quantity: 0,
        available_quantity: stockQty,
        low_stock_threshold: 5,
        reorder_point: 10,
        location: 'main_warehouse',
        supplier_sku: `SUP-${originalProductId}-${size}-${colorIndex}`,
        cost_per_unit: Math.random() * 20 + 10, // Random cost 10-30
        last_restocked: new Date().toISOString()
      })
    }
  })
  
  return inventoryRecords
}

/**
 * Main import function
 */
async function importProducts() {
  console.log('🚀 Starting product import...')
  console.log(`📦 Found ${products.length} products to import`)

  try {
    // Clear existing products first
    console.log('🧹 Clearing existing products...')
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all except placeholder
    
    if (deleteError) {
      console.warn('⚠️ Warning clearing products:', deleteError.message)
    }

    // Transform and insert products
    console.log('📝 Transforming product data...')
    const transformedProducts = products.map(transformProduct)

    console.log('💾 Inserting products into database...')
    const { data: insertedProducts, error: insertError } = await supabase
      .from('products')
      .insert(transformedProducts)
      .select()

    if (insertError) {
      console.error('❌ Error inserting products:', insertError)
      process.exit(1)
    }

    console.log(`✅ Successfully imported ${transformedProducts.length} products`)

    // Create inventory records using the inserted products with their new UUIDs
    console.log('📦 Creating inventory records...')
    const inventoryRecords = []
    
    for (let i = 0; i < products.length; i++) {
      const product = products[i]
      const insertedProduct = insertedProducts[i]
      
      if (product.sizes && product.sizes.length > 0 && insertedProduct) {
        const colorCount = product.colors ? product.colors.length : 1
        const records = createInventoryRecord(
          insertedProduct.id, 
          product.id, 
          product.sizes, 
          colorCount
        )
        inventoryRecords.push(...records)
      }
    }

    if (inventoryRecords.length > 0) {
      const { error: inventoryError } = await supabase
        .from('inventory')
        .insert(inventoryRecords)

      if (inventoryError) {
        console.warn('⚠️ Warning creating inventory:', inventoryError.message)
      } else {
        console.log(`✅ Created ${inventoryRecords.length} inventory records`)
      }
    }

    // Create analytics data
    console.log('📊 Creating sample analytics data...')
    const analyticsData = products.slice(0, 10).map(product => ({
      event_type: 'product_view',
      product_id: product.id, // Use original string ID for frontend compatibility
      session_id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_agent: 'Import Script',
      event_data: {
        views: Math.floor(Math.random() * 500) + 50,
        clicks: Math.floor(Math.random() * 100) + 10,
        sales: Math.floor(Math.random() * 20) + 1
      }
    }))

    const { error: analyticsError } = await supabase
      .from('analytics')
      .insert(analyticsData)

    if (analyticsError) {
      console.warn('⚠️ Warning creating analytics:', analyticsError.message)
    } else {
      console.log(`✅ Created analytics for ${analyticsData.length} products`)
    }

    console.log('🎉 Product import completed successfully!')
    console.log('\n📊 Import Summary:')
    console.log(`- Products: ${transformedProducts.length}`)
    console.log(`- Inventory records: ${inventoryRecords.length}`)
    console.log(`- Analytics records: ${analyticsData.length}`)
    console.log('\n🔗 Admin Dashboard: http://localhost:3000/admin')

  } catch (error) {
    console.error('💥 Import failed:', error)
    process.exit(1)
  }
}

// Run the import
if (require.main === module) {
  importProducts()
}

module.exports = { importProducts, transformProduct }
