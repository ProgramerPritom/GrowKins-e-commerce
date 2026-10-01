const path = require('path');
process.env.NODE_PATH = 'D:/Frontend Work/Pritom-folder/utills-server/node_modules';
require('module').Module._initPaths();
require('dotenv').config({ path: 'D:/Frontend Work/Pritom-folder/utills-server/.env' });

const sheetsService = require('D:/Frontend Work/Pritom-folder/utills-server/src/services/growkins/sheetsService');

async function testPhase2() {
  console.log('========================================================');
  console.log('       GROWKINS PHASE 2: DATA MIGRATION VERIFICATION    ');
  console.log('========================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Verify Products Sheet
  console.log('--- Checking Products Worksheet ---');
  const products = await sheetsService.getAllRows('Products', true);
  assert(products.length >= 12, `Products sheet populated: found ${products.length} products`);

  const sampleProduct = products.find(p => p.id === 'busy-cube-montessori') || products[0];
  assert(sampleProduct && sampleProduct.name, `Sample product retrieved: "${sampleProduct?.name}"`);
  assert(typeof sampleProduct.price === 'number' && sampleProduct.price > 0, `Product price is parsed as number: ৳${sampleProduct.price}`);
  assert(sampleProduct.inventory && typeof sampleProduct.inventory === 'object', `Product inventory is parsed as JSON object`);
  assert(Array.isArray(sampleProduct.images), `Product images is parsed as Array with ${sampleProduct.images?.length} images`);

  // 2. Verify Categories Sheet
  console.log('\n--- Checking Categories Worksheet ---');
  const categories = await sheetsService.getAllRows('Categories', true);
  assert(categories.length >= 7, `Categories sheet populated: found ${categories.length} categories`);
  assert(categories.some(c => c.name === 'Sensory' || c.name === 'Open-ended play'), `Found standard categories in sheet`);

  // 3. Verify Collections Sheet
  console.log('\n--- Checking Collections Worksheet ---');
  const collections = await sheetsService.getAllRows('Collections', true);
  assert(collections.length >= 3, `Collections sheet populated: found ${collections.length} collections`);

  // 4. Verify Settings Sheet
  console.log('\n--- Checking Settings Worksheet ---');
  const settings = await sheetsService.getAllRows('Settings', true);
  const deliverySetting = settings.find(s => s.key === 'delivery');
  const storeSetting = settings.find(s => s.key === 'store');
  const checkoutSetting = settings.find(s => s.key === 'checkout');

  assert(deliverySetting && deliverySetting.value, `Delivery settings found in Settings sheet`);
  const parsedDelivery = typeof deliverySetting.value === 'object' ? deliverySetting.value : JSON.parse(deliverySetting.value);
  assert(Array.isArray(parsedDelivery.zones) && parsedDelivery.zones.length >= 2, `Delivery zones parsed correctly with ${parsedDelivery.zones?.length} zones`);

  assert(storeSetting && storeSetting.value, `Store settings found in Settings sheet`);
  assert(checkoutSetting && checkoutSetting.value, `Checkout settings found in Settings sheet`);

  // 5. Verify Reviews Sheet
  console.log('\n--- Checking Reviews Worksheet ---');
  const reviews = await sheetsService.getAllRows('Reviews', true);
  assert(reviews.length >= 3, `Reviews sheet populated: found ${reviews.length} reviews`);

  console.log('\n========================================================');
  console.log(`  PHASE 2 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('========================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

testPhase2().catch(err => {
  console.error('Phase 2 Test Error:', err);
  process.exit(1);
});
