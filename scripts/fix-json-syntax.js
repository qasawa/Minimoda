#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the products file
const productsPath = path.join(__dirname, '../src/lib/data/products.ts');
let content = fs.readFileSync(productsPath, 'utf8');

console.log('Fixing JSON syntax errors in products data...');

// Fix all the broken syntax patterns
content = content
  // Fix missing closing braces and brackets
  .replace(/,\s*stock:/g, ',\n    stock:')
  .replace(/,\s*tags:/g, ',\n    tags:')
  .replace(/,\s*createdAt:/g, ',\n    createdAt:')
  .replace(/,\s*isNew:/g, ',\n    isNew:')
  .replace(/,\s*isSale:/g, ',\n    isSale:')
  
  // Fix broken object endings like "} {" to "}, {"
  .replace(/}\s*{/g, '}, {')
  
  // Fix color object syntax errors
  .replace(/images: \['[^']+'\] ,\s*stock:/g, (match) => {
    return match.replace('] ,', ']')
  })
  
  // Fix trailing commas before closing brackets
  .replace(/,(\s*)\]/g, '$1]')
  
  // Fix object endings that are malformed
  .replace(/,\s*stock: \d+,\s*tags: \[[^\]]+\],\s*createdAt: '[^']+',\s*(?:isNew: (?:true|false),?\s*)?(?:isSale: (?:true|false))?\s*}/g, (match) => {
    // Extract the fields
    const stockMatch = match.match(/stock: (\d+)/);
    const tagsMatch = match.match(/tags: (\[[^\]]+\])/);
    const createdAtMatch = match.match(/createdAt: '([^']+)'/);
    const isNewMatch = match.match(/isNew: (true|false)/);
    const isSaleMatch = match.match(/isSale: (true|false)/);
    
    let result = '';
    if (stockMatch) result += `,\n    stock: ${stockMatch[1]}`;
    if (tagsMatch) result += `,\n    tags: ${tagsMatch[1]}`;
    if (createdAtMatch) result += `,\n    createdAt: '${createdAtMatch[1]}'`;
    if (isNewMatch) result += `,\n    isNew: ${isNewMatch[1]}`;
    if (isSaleMatch) result += `,\n    isSale: ${isSaleMatch[1]}`;
    
    return result + '\n  }';
  })
  
  // Ensure proper product object separation
  .replace(/}\s*\{/g, '},\n  {')
  
  // Fix array ending
  .replace(/}\s*\]/g, '}\n]');

// Write the fixed content back
fs.writeFileSync(productsPath, content, 'utf8');

console.log('✅ JSON syntax errors have been fixed!');
