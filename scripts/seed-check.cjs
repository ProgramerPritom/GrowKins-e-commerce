require('dotenv').config({ path: 'D:\\Work Project\\Work-project\\utills-server\\.env' });
const fs = require('fs');

const { appendRow, getAllRows } = require('D:\\Work Project\\Work-project\\utills-server\\src\\services\\growkins\\sheetsService');

// Extract products from src/data/products.ts
const productsFilePath = 'd:\\Work Project\\Work-project\\GrowKins\\src\\data\\products.ts';
const content = fs.readFileSync(productsFilePath, 'utf8');

// We can parse or import the PRODUCTS data by evaluating or using a structured parser
// Or we can dynamically transpile with esbuild/ts or require a small compiled bundle
console.log('Seeding initial products to Google Sheet...');

async function seed() {
  const existing = await getAllRows('Products');
  if (existing.length > 0) {
    console.log(\`Google Sheet already has \${existing.length} products. Skipping seeding to prevent duplicates.\`);
    return;
  }

  // Let's load the static products
  // We can write a quick runner via tsx or node with typescript
}

seed();
