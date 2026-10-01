const path = require('path');
process.env.NODE_PATH = 'D:/Frontend Work/Pritom-folder/utills-server/node_modules';
require('module').Module._initPaths();
require('dotenv').config({ path: 'D:/Frontend Work/Pritom-folder/utills-server/.env' });

const sheetsService = require('D:/Frontend Work/Pritom-folder/utills-server/src/services/growkins/sheetsService');

async function runPhase1Tests() {
  console.log('========================================================');
  console.log('       GROWKINS BACKEND PHASE 1: AUTOMATED TEST SUITE   ');
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

  // Test 1: Ensure all worksheets exist
  console.log('--- Test Group 1: Worksheets Check & Creation ---');
  const requiredSheets = [
    { name: 'Products', headers: ['id', 'name', 'slug', 'price', 'status', 'createdAt'] },
    { name: 'Orders', headers: ['id', 'orderNumber', 'customer', 'deliveryAddress', 'items', 'total', 'status', 'paymentStatus'] },
    { name: 'Categories', headers: ['id', 'name', 'slug', 'status'] },
    { name: 'Collections', headers: ['id', 'name', 'slug', 'status'] },
    { name: 'Media', headers: ['id', 'name', 'url', 'directUrl'] },
    { name: 'Settings', headers: ['key', 'value', 'updatedAt'] },
    { name: 'Reviews', headers: ['id', 'productId', 'productName', 'rating', 'status'] },
    { name: 'Customers', headers: ['id', 'name', 'phone', 'email', 'status'] }
  ];

  for (const s of requiredSheets) {
    try {
      await sheetsService.ensureWorksheet(s.name, s.headers);
      assert(true, `Worksheet "${s.name}" is present and ready`);
    } catch (e) {
      assert(false, `Worksheet "${s.name}" failed: ${e.message}`);
    }
  }

  // Test 2: Validation Logic
  console.log('\n--- Test Group 2: Validation Layer ---');
  const { validateProduct, validateOrder, validateCategory } = require('D:/Frontend Work/Pritom-folder/utills-server/src/controllers/growkins/validation');

  const invalidProd = validateProduct({ price: -10 });
  assert(!invalidProd.isValid && invalidProd.errors.name && invalidProd.errors.price, 'Product validator rejects missing name & negative price');

  const validProd = validateProduct({ name: 'Wooden Puzzle', price: 950, status: 'active' });
  assert(validProd.isValid, 'Product validator accepts valid payload');

  const invalidOrder = validateOrder({ customer: {}, items: [] });
  assert(!invalidOrder.isValid && invalidOrder.errors.name && invalidOrder.errors.phone, 'Order validator rejects missing recipient and empty items');

  const validOrder = validateOrder({
    customer: { name: 'Rahim Khan', phone: '01711223344' },
    deliveryAddress: { fullName: 'Rahim Khan', phone: '01711223344', streetAddress: 'House 10, Road 5, Dhanmondi' },
    items: [{ productId: 'prod_1', name: 'Wooden Toy', price: 800, quantity: 1 }]
  });
  assert(validOrder.isValid, 'Order validator accepts complete COD order');

  // Test 3: Settings Default Fallback & Persistence
  console.log('\n--- Test Group 3: Settings Persistence in Google Sheets ---');
  try {
    const testSetting = {
      storeName: 'GrowKins Bangladesh',
      hotline: '+880 1700-000000',
      testRunId: 'test_' + Date.now()
    };
    await sheetsService.appendRow('Settings', {
      key: 'store_test',
      value: JSON.stringify(testSetting),
      updatedAt: new Date().toISOString()
    });

    const rows = await sheetsService.getAllRows('Settings', true);
    const stored = rows.find(r => r.key === 'store_test');
    assert(stored && stored.key === 'store_test', 'Google Sheets Settings row append and fetch works');

    // Clean up test setting
    await sheetsService.deleteRow('Settings', 'key', 'store_test');
    assert(true, 'Test row cleanup from Google Sheets succeeds');
  } catch (err) {
    assert(false, `Settings test failed: ${err.message}`);
  }

  console.log('\n========================================================');
  console.log(`  PHASE 1 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('========================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runPhase1Tests().catch(err => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
