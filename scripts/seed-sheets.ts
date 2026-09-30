// @ts-ignore
import dotenv from 'D:/Work Project/Work-project/utills-server/node_modules/dotenv/lib/main.js';
dotenv.config({ path: 'D:\\Work Project\\Work-project\\utills-server\\.env' });

import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_COLLECTIONS, INITIAL_STORE_SETTINGS, INITIAL_DELIVERY_SETTINGS } from '../src/lib/mockDb/seedData';
// @ts-ignore
import { getAllRows, appendRow } from 'D:/Work Project/Work-project/utills-server/src/services/growkins/sheetsService';

async function seedData() {
  console.log('--- SEEDING INITIAL GROWKINS DATA TO GOOGLE SHEET ---');

  // 1. Seed Products
  const existingProducts = await getAllRows('Products');
  if (existingProducts.length === 0) {
    console.log(`Seeding ${INITIAL_PRODUCTS.length} initial products...`);
    for (const prod of INITIAL_PRODUCTS) {
      await appendRow('Products', prod);
      console.log(`+ Added Product: ${prod.name}`);
    }
  } else {
    console.log(`Products sheet already contains ${existingProducts.length} rows.`);
  }

  // 2. Seed Categories
  const existingCats = await getAllRows('Categories');
  if (existingCats.length === 0) {
    console.log(`Seeding ${INITIAL_CATEGORIES.length} initial categories...`);
    for (const cat of INITIAL_CATEGORIES) {
      await appendRow('Categories', cat);
      console.log(`+ Added Category: ${cat.name}`);
    }
  } else {
    console.log(`Categories sheet already contains ${existingCats.length} rows.`);
  }

  // 3. Seed Collections
  const existingCols = await getAllRows('Collections');
  if (existingCols.length === 0) {
    console.log(`Seeding ${INITIAL_COLLECTIONS.length} initial collections...`);
    for (const col of INITIAL_COLLECTIONS) {
      await appendRow('Collections', col);
      console.log(`+ Added Collection: ${col.name}`);
    }
  } else {
    console.log(`Collections sheet already contains ${existingCols.length} rows.`);
  }

  // 4. Seed Settings
  const existingSettings = await getAllRows('Settings');
  if (existingSettings.length === 0) {
    console.log('Seeding initial store and delivery settings...');
    await appendRow('Settings', { key: 'store', value: INITIAL_STORE_SETTINGS, updatedAt: new Date().toISOString() });
    await appendRow('Settings', { key: 'delivery', value: INITIAL_DELIVERY_SETTINGS, updatedAt: new Date().toISOString() });
    console.log('+ Added Store & Delivery settings');
  } else {
    console.log(`Settings sheet already has ${existingSettings.length} rows.`);
  }

  console.log('\n*** SEEDING COMPLETED SUCCESSFULLY! YOUR GOOGLE SHEET IS NOW FULLY POPULATED! ***');
  process.exit(0);
}

seedData().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
