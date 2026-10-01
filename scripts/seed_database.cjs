const path = require('path');
const fs = require('fs');

process.env.NODE_PATH = 'D:/Frontend Work/Pritom-folder/utills-server/node_modules';
require('module').Module._initPaths();
require('dotenv').config({ path: 'D:/Frontend Work/Pritom-folder/utills-server/.env' });

const { buildSync } = require('D:/Frontend Work/Pritom-folder/GrowKins-e-commerce/node_modules/esbuild');
const sheetsService = require('D:/Frontend Work/Pritom-folder/utills-server/src/services/growkins/sheetsService');

async function seedDatabase() {
  console.log('========================================================');
  console.log('        SEEDING GROWKINS GOOGLE SHEETS DATABASE         ');
  console.log('========================================================\n');

  // 1. Bundle seedData.ts to a temporary CJS file
  const tempOut = path.join(__dirname, 'temp_seed_bundle.cjs');
  console.log('Bundling seedData.ts with esbuild...');

  buildSync({
    entryPoints: [path.join(__dirname, '../src/lib/mockDb/seedData.ts')],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    outfile: tempOut,
  });

  console.log('Bundle complete. Loading seed data...');
  const seedData = require(tempOut);

  const {
    INITIAL_PRODUCTS,
    INITIAL_CATEGORIES,
    INITIAL_COLLECTIONS,
    INITIAL_DELIVERY_SETTINGS,
    INITIAL_STORE_SETTINGS,
    INITIAL_CHECKOUT_SETTINGS,
    INITIAL_REVIEWS
  } = seedData;

  console.log(`Loaded:
  - Products: ${INITIAL_PRODUCTS.length}
  - Categories: ${INITIAL_CATEGORIES.length}
  - Collections: ${INITIAL_COLLECTIONS.length}
  - Reviews: ${INITIAL_REVIEWS.length}`);

  // 2. Ensure and seed Categories
  console.log('\n--- 1. Seeding Categories ---');
  await sheetsService.ensureWorksheet('Categories', ['id', 'name', 'slug', 'description', 'image', 'icon', 'productCount', 'status', 'sortOrder']);
  const existingCats = await sheetsService.getAllRows('Categories', true);
  const existingCatIds = new Set(existingCats.map(c => c.id));

  for (const cat of INITIAL_CATEGORIES) {
    if (!existingCatIds.has(cat.id)) {
      await sheetsService.appendRow('Categories', cat);
      console.log(` + Added Category: ${cat.name}`);
    } else {
      console.log(` = Category exists: ${cat.name}`);
    }
  }

  // 3. Ensure and seed Collections
  console.log('\n--- 2. Seeding Collections ---');
  await sheetsService.ensureWorksheet('Collections', ['id', 'name', 'slug', 'description', 'image', 'badge', 'productIds', 'status', 'sortOrder']);
  const existingCols = await sheetsService.getAllRows('Collections', true);
  const existingColIds = new Set(existingCols.map(c => c.id));

  for (const col of INITIAL_COLLECTIONS) {
    if (!existingColIds.has(col.id)) {
      await sheetsService.appendRow('Collections', col);
      console.log(` + Added Collection: ${col.name}`);
    } else {
      console.log(` = Collection exists: ${col.name}`);
    }
  }

  // 4. Ensure and seed Settings
  console.log('\n--- 3. Seeding Settings ---');
  await sheetsService.ensureWorksheet('Settings', ['key', 'value', 'updatedAt']);
  const existingSettings = await sheetsService.getAllRows('Settings', true);
  const existingSettingKeys = new Set(existingSettings.map(s => s.key));

  const settingsToSeed = [
    { key: 'delivery', value: INITIAL_DELIVERY_SETTINGS },
    { key: 'store', value: INITIAL_STORE_SETTINGS },
    { key: 'checkout', value: INITIAL_CHECKOUT_SETTINGS }
  ];

  for (const set of settingsToSeed) {
    if (!existingSettingKeys.has(set.key)) {
      await sheetsService.appendRow('Settings', {
        key: set.key,
        value: JSON.stringify(set.value),
        updatedAt: new Date().toISOString()
      });
      console.log(` + Added Setting: ${set.key}`);
    } else {
      console.log(` = Setting exists: ${set.key}`);
    }
  }

  // 5. Ensure and seed Products
  console.log('\n--- 4. Seeding Products ---');
  const productHeaders = [
    'id', 'name', 'slug', 'subtitle', 'sku', 'tag', 'price', 'compareAtPrice',
    'currency', 'status', 'category', 'ageGroup', 'ageBadge', 'interests',
    'benefits', 'materials', 'occasions', 'description', 'storyDescription',
    'whatsInside', 'playTips', 'dimensions', 'careInstructions', 'safetyNotes',
    'inventory', 'images', 'featuredImage', 'rating', 'reviewCount', 'featured',
    'seo', 'createdAt', 'updatedAt'
  ];
  await sheetsService.ensureWorksheet('Products', productHeaders);
  const existingProds = await sheetsService.getAllRows('Products', true);
  const existingProdIds = new Set(existingProds.map(p => p.id));

  for (const prod of INITIAL_PRODUCTS) {
    if (!existingProdIds.has(prod.id)) {
      await sheetsService.appendRow('Products', prod, productHeaders);
      console.log(` + Added Product: ${prod.name} (৳${prod.price})`);
    } else {
      console.log(` = Product exists: ${prod.name}`);
    }
  }

  // 6. Ensure and seed Reviews
  console.log('\n--- 5. Seeding Reviews ---');
  await sheetsService.ensureWorksheet('Reviews', ['id', 'productId', 'productName', 'customerName', 'rating', 'comment', 'status', 'createdAt']);
  const existingReviews = await sheetsService.getAllRows('Reviews', true);
  const existingReviewIds = new Set(existingReviews.map(r => r.id));

  for (const rev of INITIAL_REVIEWS.slice(0, 10)) {
    if (!existingReviewIds.has(rev.id)) {
      await sheetsService.appendRow('Reviews', rev);
      console.log(` + Added Review for: ${rev.productName || rev.productId}`);
    }
  }

  // Cleanup temp file
  try {
    fs.unlinkSync(tempOut);
  } catch {}

  console.log('\n========================================================');
  console.log('   GOOGLE SHEETS SEEDING COMPLETED SUCCESSFULLY!        ');
  console.log('========================================================');
}

seedDatabase().catch(err => {
  console.error('Fatal Seeding Error:', err);
  process.exit(1);
});
