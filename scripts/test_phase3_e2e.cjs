const path = require('path');
process.env.NODE_PATH = 'D:/Frontend Work/Pritom-folder/utills-server/node_modules';
require('module').Module._initPaths();
require('dotenv').config({ path: 'D:/Frontend Work/Pritom-folder/utills-server/.env' });

const sheetsService = require('D:/Frontend Work/Pritom-folder/utills-server/src/services/growkins/sheetsService');
const productCtrl = require('D:/Frontend Work/Pritom-folder/utills-server/src/controllers/growkins/productController');
const orderCtrl = require('D:/Frontend Work/Pritom-folder/utills-server/src/controllers/growkins/orderController');
const miscCtrl = require('D:/Frontend Work/Pritom-folder/utills-server/src/controllers/growkins/miscController');
const { validateProduct, validateOrder } = require('D:/Frontend Work/Pritom-folder/utills-server/src/controllers/growkins/validation');

// Mock request / response helpers for controller testing
function createMockReq(params = {}, body = {}, query = {}) {
  return { params, body, query };
}

function createMockRes() {
  return {
    statusCode: 200,
    data: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.data = payload;
      return this;
    }
  };
}

async function runEndToEndTests() {
  console.log('========================================================');
  console.log('     GROWKINS PHASE 3 & 4: FULL END-TO-END SUITE       ');
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

  // ----------------------------------------------------
  // Test 1: Product Validation & CRUD in Google Sheets
  // ----------------------------------------------------
  console.log('--- Test 1: Product Validation & Google Sheets CRUD ---');
  const invalidProdRes = createMockRes();
  await productCtrl.createProduct(createMockReq({}, { price: -500 }), invalidProdRes, (err) => {});
  assert(invalidProdRes.statusCode === 422 && invalidProdRes.data?.errors?.name, 'Product validation rejects invalid product (HTTP 422)');

  const testProdPayload = {
    name: 'E2E Test Wooden Rainbow Stacker',
    price: 1650,
    compareAtPrice: 2100,
    category: 'Stacking toys',
    status: 'active',
    sku: 'GK-E2E-999',
    inventory: { quantity: 20, trackInventory: true }
  };
  const createProdRes = createMockRes();
  await productCtrl.createProduct(createMockReq({}, testProdPayload), createProdRes, console.error);
  assert(createProdRes.statusCode === 201 && createProdRes.data?.data?.id, `Product created with ID: ${createProdRes.data?.data?.id}`);

  const createdId = createProdRes.data?.data?.id;

  // Read list
  const listProdRes = createMockRes();
  await productCtrl.listProducts(createMockReq({}, {}, { search: 'E2E Test' }), listProdRes, console.error);
  assert(listProdRes.data?.data?.some(p => p.id === createdId), 'Created product found in Google Sheets search query');

  // Update Product Price
  const updateProdRes = createMockRes();
  await productCtrl.updateProduct(createMockReq({ id: createdId }, { price: 1750, name: 'E2E Test Wooden Rainbow Stacker (Updated)' }), updateProdRes, console.error);
  assert(updateProdRes.data?.data?.price === 1750, 'Product price updated to ৳1750 in Google Sheets');

  // Clean up product
  const deleteProdRes = createMockRes();
  await productCtrl.deleteProduct(createMockReq({ id: createdId }), deleteProdRes, console.error);
  assert(deleteProdRes.data?.success === true, 'Test product deleted from Google Sheets');

  // ----------------------------------------------------
  // Test 2: Cash on Delivery (COD) Order Flow & Status Transitions
  // ----------------------------------------------------
  console.log('\n--- Test 2: Storefront COD Order Lifecycle ---');
  const testOrderPayload = {
    customer: {
      name: 'Tanvir Hossain',
      phone: '01719876543',
      email: 'tanvir@example.com'
    },
    deliveryAddress: {
      fullName: 'Tanvir Hossain',
      phone: '01719876543',
      deliveryZone: 'inside-dhaka',
      district: 'Dhaka',
      thanaArea: 'Gulshan 2',
      streetAddress: 'House 14, Road 45, Gulshan-2'
    },
    items: [
      {
        productId: 'busy-cube-montessori',
        name: 'Busy Cube – Montessori Sensory Activity Cube',
        price: 1250,
        quantity: 2,
        total: 2500,
        image: '/items/busy-cube.jfif'
      }
    ],
    subtotal: 2500,
    deliveryFee: 0, // Free delivery over 2500 BDT
    total: 2500,
    paymentMethod: 'Cash on Delivery'
  };

  const createOrderRes = createMockRes();
  await orderCtrl.createOrder(createMockReq({}, testOrderPayload), createOrderRes, console.error);
  assert(createOrderRes.statusCode === 201 && createOrderRes.data?.data?.orderNumber, `COD Order placed: ${createOrderRes.data?.data?.orderNumber}`);

  const orderId = createOrderRes.data?.data?.id;

  // Status transition: pending -> confirmed
  const confirmRes = createMockRes();
  await orderCtrl.updateOrderStatus(createMockReq({ id: orderId }, { status: 'confirmed', note: 'Customer confirmed via phone call' }), confirmRes, console.error);
  assert(confirmRes.data?.data?.status === 'confirmed', 'Order status progressed to "confirmed"');

  // Status transition: confirmed -> shipped
  const shippedRes = createMockRes();
  await orderCtrl.updateOrderStatus(createMockReq({ id: orderId }, { status: 'shipped', note: 'Handed over to RedX courier (Consignment: RX-8821)' }), shippedRes, console.error);
  assert(shippedRes.data?.data?.status === 'shipped', 'Order status progressed to "shipped"');

  // Status transition: shipped -> delivered + cod_collected
  const deliveredRes = createMockRes();
  await orderCtrl.updateOrderStatus(createMockReq({ id: orderId }, { status: 'delivered', note: 'Recipient received parcel and paid cash' }), deliveredRes, console.error);
  assert(deliveredRes.data?.data?.status === 'delivered', 'Order status progressed to "delivered"');

  const paymentRes = createMockRes();
  await orderCtrl.updatePaymentStatus(createMockReq({ id: orderId }, { paymentStatus: 'cod_collected' }), paymentRes, console.error);
  assert(paymentRes.data?.data?.paymentStatus === 'cod_collected', 'COD Payment status marked as "cod_collected" in Google Sheets');

  // Verify timeline contains events
  const verifyOrderRes = createMockRes();
  await orderCtrl.getOrderById(createMockReq({ id: orderId }), verifyOrderRes, console.error);
  assert(Array.isArray(verifyOrderRes.data?.data?.timeline) && verifyOrderRes.data?.data?.timeline.length >= 4, `Order timeline logged ${verifyOrderRes.data?.data?.timeline.length} history events`);

  // Clean up test order from sheet
  await sheetsService.deleteRow('Orders', 'id', orderId);
  console.log('Test order cleaned up.');

  // ----------------------------------------------------
  // Test 3: Settings Management in Google Sheets
  // ----------------------------------------------------
  console.log('\n--- Test 3: Delivery & Store Settings Management ---');
  const getDeliveryRes = createMockRes();
  await miscCtrl.getDelivery(createMockReq(), getDeliveryRes, console.error);
  assert(getDeliveryRes.data?.data?.zones?.length >= 2, 'Delivery settings retrieved with Dhaka (৳70) & Outside Dhaka (৳130)');

  const getStoreRes = createMockRes();
  await miscCtrl.getSetting(createMockReq({ type: 'store' }), getStoreRes, console.error);
  assert(getStoreRes.data?.data?.currencySymbol === '৳', 'Store currency symbol verified as "৳" (BDT)');

  // ----------------------------------------------------
  // Test 4: Dashboard Aggregation
  // ----------------------------------------------------
  console.log('\n--- Test 4: Admin Dashboard Metrics ---');
  const dashRes = createMockRes();
  await miscCtrl.getDashboardSummary(createMockReq(), dashRes, console.error);
  assert(dashRes.data?.data?.productsCount >= 12, `Dashboard reports ${dashRes.data?.data?.productsCount} active products in Google Sheets`);

  console.log('\n========================================================');
  console.log(`  PHASE 3 & 4 E2E SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('========================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runEndToEndTests().catch(err => {
  console.error('Fatal E2E Test Error:', err);
  process.exit(1);
});
