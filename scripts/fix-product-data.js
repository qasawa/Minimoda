#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the products file
const productsPath = path.join(__dirname, '../src/lib/data/products.ts');
let content = fs.readFileSync(productsPath, 'utf8');

// Function to add missing fields to products
function addMissingFields() {
  // Define default values for missing fields
  const defaultFields = {
    stock: () => Math.floor(Math.random() * 30) + 5, // Random stock between 5-34
    tags: {
      'girls': ['dress', 'pretty', 'fashion'],
      'boys': ['active', 'adventure', 'cool'],
      'baby': ['soft', 'gentle', 'adorable'],
      'unisex': ['comfortable', 'quality', 'versatile']
    },
    createdAt: () => {
      const now = new Date();
      const daysAgo = Math.floor(Math.random() * 60); // 0-60 days ago
      const date = new Date(now - daysAgo * 24 * 60 * 60 * 1000);
      return date.toISOString();
    },
    isNew: () => Math.random() < 0.3, // 30% chance of being new
    isSale: () => Math.random() < 0.4 // 40% chance of being on sale
  };

  // Regex to find products that need fields added
  const productRegex = /(\{[\s\S]*?category: '[^']*'[\s\S]*?\}),?(?=\s*\{|\s*\])/g;
  
  content = content.replace(productRegex, (match) => {
    let product = match;
    
    // Check if stock is missing
    if (!product.includes('stock:')) {
      const stockValue = defaultFields.stock();
      product = product.replace(/(\}),?$/, `,\n    stock: ${stockValue}$1`);
    }
    
    // Check if tags is missing
    if (!product.includes('tags:')) {
      // Extract category to determine appropriate tags
      const categoryMatch = product.match(/category: '([^']*)'/)
      const category = categoryMatch ? categoryMatch[1] : 'unisex';
      const tags = defaultFields.tags[category] || defaultFields.tags.unisex;
      const tagsString = JSON.stringify(tags);
      product = product.replace(/(\}),?$/, `,\n    tags: ${tagsString}$1`);
    }
    
    // Check if createdAt is missing
    if (!product.includes('createdAt:')) {
      const createdAt = defaultFields.createdAt();
      product = product.replace(/(\}),?$/, `,\n    createdAt: '${createdAt}'$1`);
    }
    
    // Check if isNew is missing
    if (!product.includes('isNew:')) {
      const isNew = defaultFields.isNew();
      product = product.replace(/(\}),?$/, `,\n    isNew: ${isNew}$1`);
    }
    
    // Add isSale if missing and not already set
    if (!product.includes('isSale:')) {
      const isSale = defaultFields.isSale();
      product = product.replace(/(\}),?$/, `,\n    isSale: ${isSale}$1`);
    }
    
    return product;
  });
  
  return content;
}

// Apply the fixes
content = addMissingFields();

// Write the updated content back
fs.writeFileSync(productsPath, content, 'utf8');

console.log('✅ Product data fields have been updated!');
