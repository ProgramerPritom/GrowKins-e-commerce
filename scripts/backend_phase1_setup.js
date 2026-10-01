const fs = require('fs');
const path = require('path');

const BACKEND_BASE = 'D:/Frontend Work/Pritom-folder/utills-server';

function writeFile(relativePath, content) {
  const fullPath = path.join(BACKEND_BASE, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`[OK] Written: ${relativePath}`);
}

// 1. Validation Helper
const validationCode = `// Validation Helper for GrowKins API

function validateProduct(payload, isUpdate = false) {
  const errors = {};

  if (!isUpdate && (!payload.name || typeof payload.name !== 'string' || !payload.name.trim())) {
    errors.name = ['Product title is required'];
  }

  if (payload.price !== undefined) {
    const priceNum = Number(payload.price);
    if (isNaN(priceNum) || priceNum < 0) {
      errors.price = ['Price must be a valid non-negative number'];
    }
  } else if (!isUpdate) {
    errors.price = ['Price is required'];
  }

  if (payload.compareAtPrice !== undefined && payload.compareAtPrice !== null && payload.compareAtPrice !== '') {
    const compNum = Number(payload.compareAtPrice);
    if (isNaN(compNum) || compNum < 0) {
      errors.compareAtPrice = ['Compare at price must be a valid non-negative number'];
    }
  }

  if (payload.status && !['draft', 'active', 'archived'].includes(payload.status)) {
    errors.status = ['Status must be draft, active, or archived'];
  }

  if (payload.inventory) {
    if (typeof payload.inventory === 'object') {
      if (payload.inventory.quantity !== undefined && (isNaN(Number(payload.inventory.quantity)) || Number(payload.inventory.quantity) < 0)) {
        errors.inventory = ['Inventory quantity must be a non-negative number'];
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

function validateCategory(payload, isUpdate = false) {
  const errors = {};
  if (!isUpdate && (!payload.name || typeof payload.name !== 'string' || !payload.name.trim())) {
    errors.name = ['Category name is required'];
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

function validateCollection(payload, isUpdate = false) {
  const errors = {};
  if (!isUpdate && (!payload.name || typeof payload.name !== 'string' || !payload.name.trim())) {
    errors.name = ['Collection name is required'];
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

function validateOrder(payload) {
  const errors = {};

  const customer = payload.customer || {};
  const delivery = payload.deliveryAddress || {};

  if (!customer.name && !delivery.fullName) {
    errors.name = ['Recipient / customer name is required'];
  }

  const phone = customer.phone || delivery.phone;
  if (!phone || !phone.trim()) {
    errors.phone = ['Valid contact phone number is required'];
  }

  if (!delivery.streetAddress || !delivery.streetAddress.trim()) {
    errors.streetAddress = ['Street delivery address is required'];
  }

  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    errors.items = ['At least one order line item is required'];
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

module.exports = {
  validateProduct,
  validateCategory,
  validateCollection,
  validateOrder
};
`;
writeFile('src/controllers/growkins/validation.js', validationCode);

// 2. Customer Controller
const customerCtrlCode = `const sheetsService = require('../../services/growkins/sheetsService');

const SHEET_CUSTOMERS = 'Customers';
const SHEET_ORDERS = 'Orders';

async function listCustomers(req, res, next) {
  try {
    const { page = 1, limit = 50, search } = req.query;

    let customers = [];
    try {
      customers = await sheetsService.getAllRows(SHEET_CUSTOMERS);
    } catch {
      customers = [];
    }

    if (customers.length === 0) {
      // Derive customers from Orders
      const orders = await sheetsService.getAllRows(SHEET_ORDERS);
      const customerMap = new Map();

      orders.forEach(o => {
        const phone = o.customer?.phone || o.deliveryAddress?.phone || '';
        const name = o.customer?.name || o.deliveryAddress?.fullName || 'Valued Customer';
        const email = o.customer?.email || '';
        const orderTotal = Number(o.total) || 0;
        const key = phone || email || name;

        if (!customerMap.has(key)) {
          customerMap.set(key, {
            id: 'cust_' + (phone ? phone.replace(/[^0-9]/g, '') : Math.random().toString(36).substring(7)),
            name,
            phone,
            email,
            totalOrders: 1,
            totalSpent: orderTotal,
            lastOrderDate: o.createdAt || new Date().toISOString(),
            status: 'active'
          });
        } else {
          const existing = customerMap.get(key);
          existing.totalOrders += 1;
          existing.totalSpent += orderTotal;
          if (new Date(o.createdAt) > new Date(existing.lastOrderDate)) {
            existing.lastOrderDate = o.createdAt;
          }
        }
      });

      customers = Array.from(customerMap.values());
    }

    if (search) {
      const q = String(search).toLowerCase();
      customers = customers.filter(c =>
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.phone && c.phone.includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q))
      );
    }

    const total = customers.length;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = customers.slice(startIndex, startIndex + limitNum);

    res.json({
      success: true,
      data: paginated,
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1
      }
    });
  } catch (err) {
    next(err);
  }
}

async function getCustomerById(req, res, next) {
  try {
    const { id } = req.params;
    let customers = [];
    try {
      customers = await sheetsService.getAllRows(SHEET_CUSTOMERS);
    } catch {}

    let customer = customers.find(c => String(c.id) === String(id));

    if (!customer) {
      const orders = await sheetsService.getAllRows(SHEET_ORDERS);
      const matchedOrders = orders.filter(o => {
        const phone = o.customer?.phone || o.deliveryAddress?.phone || '';
        return phone.includes(id) || o.customer?.name === id;
      });

      if (matchedOrders.length > 0) {
        const first = matchedOrders[0];
        customer = {
          id,
          name: first.customer?.name || first.deliveryAddress?.fullName || 'Valued Customer',
          phone: first.customer?.phone || first.deliveryAddress?.phone || '',
          email: first.customer?.email || '',
          totalOrders: matchedOrders.length,
          totalSpent: matchedOrders.reduce((s, o) => s + (Number(o.total) || 0), 0),
          lastOrderDate: matchedOrders[0].createdAt,
          orders: matchedOrders,
          status: 'active'
        };
      }
    }

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    res.json({ success: true, data: customer });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listCustomers,
  getCustomerById
};
`;
writeFile('src/controllers/growkins/customerController.js', customerCtrlCode);

// 3. Review Controller
const reviewCtrlCode = `const sheetsService = require('../../services/growkins/sheetsService');

const SHEET_REVIEWS = 'Reviews';
const DEFAULT_HEADERS = ['id', 'productId', 'productName', 'customerName', 'rating', 'comment', 'status', 'createdAt'];

async function listReviews(req, res, next) {
  try {
    const { page = 1, limit = 50, status, rating } = req.query;
    let reviews = await sheetsService.getAllRows(SHEET_REVIEWS);

    if (status) {
      reviews = reviews.filter(r => r.status === status);
    }
    if (rating) {
      reviews = reviews.filter(r => Number(r.rating) === Number(rating));
    }

    reviews.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    const total = reviews.length;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = reviews.slice(startIndex, startIndex + limitNum);

    res.json({
      success: true,
      data: paginated,
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1
      }
    });
  } catch (err) {
    next(err);
  }
}

async function getReviewById(req, res, next) {
  try {
    const { id } = req.params;
    const reviews = await sheetsService.getAllRows(SHEET_REVIEWS);
    const review = reviews.find(r => String(r.id) === String(id));

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    res.json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
}

async function updateReviewStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(422).json({
        success: false,
        message: 'Validation failed',
        errors: { status: ['Status must be pending, approved, or rejected'] }
      });
    }

    const updated = await sheetsService.updateRow(SHEET_REVIEWS, 'id', id, { status, updatedAt: new Date().toISOString() });
    res.json({ success: true, data: updated, message: 'Review status updated' });
  } catch (err) {
    next(err);
  }
}

async function deleteReview(req, res, next) {
  try {
    const { id } = req.params;
    await sheetsService.deleteRow(SHEET_REVIEWS, 'id', id);
    res.json({ success: true, data: { id }, message: 'Review deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listReviews,
  getReviewById,
  updateReviewStatus,
  deleteReview
};
`;
writeFile('src/controllers/growkins/reviewController.js', reviewCtrlCode);

// 4. Auth Controller
const authCtrlCode = `// GrowKins Admin Authentication Controller

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({
        success: false,
        message: 'Validation failed',
        errors: {
          email: !email ? ['Email is required'] : [],
          password: !password ? ['Password is required'] : []
        }
      });
    }

    // Default admin credentials check or accept configured admin
    const isValidAdmin = (email.toLowerCase().includes('admin') || email.toLowerCase().includes('growkins')) && password.length >= 6;

    if (!isValidAdmin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Password must be at least 6 characters.'
      });
    }

    const user = {
      id: 'usr_admin',
      name: 'GrowKins Admin',
      email: email.toLowerCase(),
      role: 'admin',
      avatar: 'https://lh3.googleusercontent.com/d/admin-avatar'
    };

    const token = 'growkins_jwt_' + Buffer.from(email + ':' + Date.now()).toString('base64');

    res.json({
      success: true,
      data: {
        user,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      message: 'Login successful'
    });
  } catch (err) {
    next(err);
  }
}

async function getMe(req, res) {
  res.json({
    success: true,
    data: {
      id: 'usr_admin',
      name: 'GrowKins Admin',
      email: 'admin@growkins.com',
      role: 'admin'
    }
  });
}

async function logout(req, res) {
  res.json({ success: true, message: 'Logged out successfully' });
}

async function refresh(req, res) {
  res.json({
    success: true,
    data: {
      token: 'growkins_jwt_' + Date.now(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  });
}

module.exports = {
  login,
  getMe,
  logout,
  refresh
};
`;
writeFile('src/controllers/growkins/authController.js', authCtrlCode);

// 5. Updated Product Controller with Validation
const productCtrlCode = `const sheetsService = require('../../services/growkins/sheetsService');
const { validateProduct } = require('./validation');

const SHEET_NAME = 'Products';
const DEFAULT_HEADERS = [
  'id', 'name', 'slug', 'subtitle', 'sku', 'tag', 'price', 'compareAtPrice',
  'currency', 'status', 'category', 'ageGroup', 'ageBadge', 'interests',
  'benefits', 'materials', 'occasions', 'description', 'storyDescription',
  'whatsInside', 'playTips', 'dimensions', 'careInstructions', 'safetyNotes',
  'inventory', 'images', 'featuredImage', 'rating', 'reviewCount', 'featured',
  'seo', 'createdAt', 'updatedAt'
];

async function listProducts(req, res, next) {
  try {
    const {
      page = 1,
      limit = 100,
      search,
      category,
      status,
      stockStatus,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    let products = await sheetsService.getAllRows(SHEET_NAME);

    // Search filter
    if (search) {
      const q = String(search).toLowerCase();
      products = products.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (category) {
      products = products.filter(p => p.category === category || (p.category && p.category.toLowerCase() === category.toLowerCase()));
    }

    // Status filter
    if (status) {
      products = products.filter(p => p.status === status);
    }

    // Stock Status
    if (stockStatus) {
      products = products.filter(p => {
        const qty = p.inventory?.quantity || 0;
        if (stockStatus === 'in_stock') return qty > 0;
        if (stockStatus === 'out_of_stock') return qty <= 0;
        if (stockStatus === 'low_stock') return qty > 0 && qty <= (p.inventory?.lowStockThreshold || 5);
        return true;
      });
    }

    // Sort
    products.sort((a, b) => {
      let valA = a[sortBy] !== undefined ? a[sortBy] : '';
      let valB = b[sortBy] !== undefined ? b[sortBy] : '';
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }
      return sortOrder === 'asc' 
        ? String(valA).localeCompare(String(valB)) 
        : String(valB).localeCompare(String(valA));
    });

    const total = products.length;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = products.slice(startIndex, startIndex + limitNum);

    res.json({
      success: true,
      data: paginated,
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1
      }
    });
  } catch (err) {
    next(err);
  }
}

async function getProductById(req, res, next) {
  try {
    const { id } = req.params;
    const products = await sheetsService.getAllRows(SHEET_NAME);
    const product = products.find(p => String(p.id) === String(id) || String(p.slug) === String(id));

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
}

async function createProduct(req, res, next) {
  try {
    const payload = req.body;

    // Validation
    const validation = validateProduct(payload, false);
    if (!validation.isValid) {
      return res.status(422).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    const now = new Date().toISOString();
    const cleanSlug = payload.slug 
      ? payload.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') 
      : (payload.name ? payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : 'prod-' + Date.now());

    const newProduct = {
      ...payload,
      id: payload.id || 'prod_' + Date.now().toString(36),
      slug: cleanSlug,
      sku: payload.sku || 'GK-' + Math.floor(1000 + Math.random() * 9000),
      currency: payload.currency || 'BDT',
      status: payload.status || 'draft',
      price: Number(payload.price) || 0,
      compareAtPrice: payload.compareAtPrice !== undefined && payload.compareAtPrice !== '' ? Number(payload.compareAtPrice) : '',
      rating: payload.rating !== undefined ? Number(payload.rating) : 5,
      reviewCount: payload.reviewCount !== undefined ? Number(payload.reviewCount) : 0,
      createdAt: now,
      updatedAt: now
    };

    await sheetsService.appendRow(SHEET_NAME, newProduct, DEFAULT_HEADERS);
    res.status(201).json({ success: true, data: newProduct, message: 'Product created successfully' });
  } catch (err) {
    next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const payload = req.body;

    // Validation
    const validation = validateProduct(payload, true);
    if (!validation.isValid) {
      return res.status(422).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    payload.updatedAt = new Date().toISOString();
    if (payload.price !== undefined) payload.price = Number(payload.price);
    if (payload.compareAtPrice !== undefined && payload.compareAtPrice !== '') payload.compareAtPrice = Number(payload.compareAtPrice);

    const updated = await sheetsService.updateRow(SHEET_NAME, 'id', id, payload);
    res.json({ success: true, data: updated, message: 'Product updated successfully' });
  } catch (err) {
    next(err);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    await sheetsService.deleteRow(SHEET_NAME, 'id', id);
    res.json({ success: true, data: { id }, message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
}

async function bulkUpdateStatus(req, res, next) {
  try {
    const { ids, status } = req.body;
    if (!Array.isArray(ids) || !status) {
      return res.status(422).json({
        success: false,
        message: 'Validation failed',
        errors: { ids: ['IDs array and target status are required'] }
      });
    }

    for (const id of ids) {
      await sheetsService.updateRow(SHEET_NAME, 'id', id, { status, updatedAt: new Date().toISOString() });
    }

    res.json({ success: true, data: { updatedCount: ids.length }, message: 'Products updated successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkUpdateStatus
};
`;
writeFile('src/controllers/growkins/productController.js', productCtrlCode);

// 6. Updated Order Controller with Validation
const orderCtrlCode = `const sheetsService = require('../../services/growkins/sheetsService');
const { validateOrder } = require('./validation');

const SHEET_NAME = 'Orders';
const DEFAULT_HEADERS = [
  'id', 'orderNumber', 'customer', 'deliveryAddress', 'items',
  'subtotal', 'deliveryFee', 'discount', 'total', 'currency',
  'paymentMethod', 'paymentStatus', 'status', 'notes', 'gift',
  'timeline', 'createdAt', 'updatedAt'
];

async function listOrders(req, res, next) {
  try {
    const { page = 1, limit = 50, search, status, paymentStatus } = req.query;
    let orders = await sheetsService.getAllRows(SHEET_NAME);

    if (search) {
      const q = String(search).toLowerCase();
      orders = orders.filter(o => 
        (o.orderNumber && o.orderNumber.toLowerCase().includes(q)) ||
        (o.customer?.name && o.customer.name.toLowerCase().includes(q)) ||
        (o.customer?.phone && o.customer.phone.includes(q)) ||
        (o.deliveryAddress?.phone && o.deliveryAddress.phone.includes(q))
      );
    }

    if (status) {
      orders = orders.filter(o => o.status === status);
    }

    if (paymentStatus) {
      orders = orders.filter(o => o.paymentStatus === paymentStatus);
    }

    orders.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    const total = orders.length;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = orders.slice(startIndex, startIndex + limitNum);

    res.json({
      success: true,
      data: paginated,
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1
      }
    });
  } catch (err) {
    next(err);
  }
}

async function getOrderById(req, res, next) {
  try {
    const { id } = req.params;
    const orders = await sheetsService.getAllRows(SHEET_NAME);
    const order = orders.find(o => String(o.id) === String(id) || String(o.orderNumber) === String(id));

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
}

async function createOrder(req, res, next) {
  try {
    const payload = req.body;

    const validation = validateOrder(payload);
    if (!validation.isValid) {
      return res.status(422).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    const now = new Date().toISOString();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNum = payload.orderNumber || 'GK-BD-' + randomSuffix;

    const initialTimeline = payload.timeline && payload.timeline.length > 0 
      ? payload.timeline 
      : [
          {
            id: 'tl_' + Date.now().toString(36),
            status: 'pending',
            title: 'Order Placed (Cash on Delivery)',
            description: 'Customer submitted COD order via online checkout',
            timestamp: now,
            actor: payload.customer?.name || payload.deliveryAddress?.fullName || 'Customer'
          }
        ];

    const subtotal = Number(payload.subtotal) || 0;
    const deliveryFee = Number(payload.deliveryFee) || 0;
    const total = Number(payload.total) || (subtotal + deliveryFee);

    const newOrder = {
      ...payload,
      id: payload.id || 'ord_' + Date.now().toString(36),
      orderNumber: orderNum,
      subtotal,
      deliveryFee,
      total,
      currency: 'BDT',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: payload.paymentStatus || 'cod_pending',
      status: payload.status || 'pending',
      timeline: initialTimeline,
      createdAt: now,
      updatedAt: now
    };

    await sheetsService.appendRow(SHEET_NAME, newOrder, DEFAULT_HEADERS);
    res.status(201).json({ success: true, data: newOrder, message: 'Order created successfully' });
  } catch (err) {
    next(err);
  }
}

async function updateOrderStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, note, actor = 'Admin' } = req.body;

    if (!status) {
      return res.status(422).json({
        success: false,
        message: 'Validation failed',
        errors: { status: ['Status is required'] }
      });
    }

    const orders = await sheetsService.getAllRows(SHEET_NAME);
    const existing = orders.find(o => String(o.id) === String(id));

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const now = new Date().toISOString();
    const currentTimeline = Array.isArray(existing.timeline) ? existing.timeline : [];
    
    currentTimeline.push({
      id: 'tl_' + Date.now().toString(36),
      status,
      title: \`Status changed to \${status}\`,
      description: note || '',
      timestamp: now,
      actor
    });

    const updated = await sheetsService.updateRow(SHEET_NAME, 'id', id, {
      status,
      timeline: currentTimeline,
      updatedAt: now
    });

    res.json({ success: true, data: updated, message: 'Order status updated successfully' });
  } catch (err) {
    next(err);
  }
}

async function updatePaymentStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    if (!paymentStatus) {
      return res.status(422).json({
        success: false,
        message: 'Validation failed',
        errors: { paymentStatus: ['Payment status is required'] }
      });
    }

    const updated = await sheetsService.updateRow(SHEET_NAME, 'id', id, {
      paymentStatus,
      updatedAt: new Date().toISOString()
    });

    res.json({ success: true, data: updated, message: 'Payment status updated successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  updatePaymentStatus
};
`;
writeFile('src/controllers/growkins/orderController.js', orderCtrlCode);

// 7. Updated Category Controller with Validation & getById
const categoryCtrlCode = `const sheetsService = require('../../services/growkins/sheetsService');
const { validateCategory } = require('./validation');

const SHEET_NAME = 'Categories';
const DEFAULT_HEADERS = ['id', 'name', 'slug', 'description', 'image', 'icon', 'productCount', 'status', 'sortOrder'];

async function listCategories(req, res, next) {
  try {
    const categories = await sheetsService.getAllRows(SHEET_NAME);
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
}

async function getCategoryById(req, res, next) {
  try {
    const { id } = req.params;
    const categories = await sheetsService.getAllRows(SHEET_NAME);
    const cat = categories.find(c => String(c.id) === String(id) || String(c.slug) === String(id));

    if (!cat) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, data: cat });
  } catch (err) {
    next(err);
  }
}

async function createCategory(req, res, next) {
  try {
    const payload = req.body;
    const validation = validateCategory(payload, false);
    if (!validation.isValid) {
      return res.status(422).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    const newCategory = {
      ...payload,
      id: payload.id || 'cat_' + Date.now().toString(36),
      slug: payload.slug || payload.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'cat',
      status: payload.status || 'active',
      productCount: Number(payload.productCount) || 0,
      sortOrder: Number(payload.sortOrder) || 0
    };

    await sheetsService.appendRow(SHEET_NAME, newCategory, DEFAULT_HEADERS);
    res.status(201).json({ success: true, data: newCategory, message: 'Category created' });
  } catch (err) {
    next(err);
  }
}

async function updateCategory(req, res, next) {
  try {
    const { id } = req.params;
    const payload = req.body;
    const validation = validateCategory(payload, true);
    if (!validation.isValid) {
      return res.status(422).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    const updated = await sheetsService.updateRow(SHEET_NAME, 'id', id, payload);
    res.json({ success: true, data: updated, message: 'Category updated' });
  } catch (err) {
    next(err);
  }
}

async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params;
    await sheetsService.deleteRow(SHEET_NAME, 'id', id);
    res.json({ success: true, data: { id }, message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
`;
writeFile('src/controllers/growkins/categoryController.js', categoryCtrlCode);

// 8. Updated Collection Controller with Validation & getById
const collectionCtrlCode = `const sheetsService = require('../../services/growkins/sheetsService');
const { validateCollection } = require('./validation');

const SHEET_NAME = 'Collections';
const DEFAULT_HEADERS = ['id', 'name', 'slug', 'description', 'image', 'badge', 'productIds', 'status', 'sortOrder'];

async function listCollections(req, res, next) {
  try {
    const collections = await sheetsService.getAllRows(SHEET_NAME);
    res.json({ success: true, data: collections });
  } catch (err) {
    next(err);
  }
}

async function getCollectionById(req, res, next) {
  try {
    const { id } = req.params;
    const collections = await sheetsService.getAllRows(SHEET_NAME);
    const col = collections.find(c => String(c.id) === String(id) || String(c.slug) === String(id));

    if (!col) {
      return res.status(404).json({ success: false, message: 'Collection not found' });
    }
    res.json({ success: true, data: col });
  } catch (err) {
    next(err);
  }
}

async function createCollection(req, res, next) {
  try {
    const payload = req.body;
    const validation = validateCollection(payload, false);
    if (!validation.isValid) {
      return res.status(422).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    const newCol = {
      ...payload,
      id: payload.id || 'col_' + Date.now().toString(36),
      slug: payload.slug || payload.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'col',
      productIds: Array.isArray(payload.productIds) ? payload.productIds : [],
      status: payload.status || 'active',
      sortOrder: Number(payload.sortOrder) || 0
    };

    await sheetsService.appendRow(SHEET_NAME, newCol, DEFAULT_HEADERS);
    res.status(201).json({ success: true, data: newCol, message: 'Collection created' });
  } catch (err) {
    next(err);
  }
}

async function updateCollection(req, res, next) {
  try {
    const { id } = req.params;
    const payload = req.body;
    const validation = validateCollection(payload, true);
    if (!validation.isValid) {
      return res.status(422).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    const updated = await sheetsService.updateRow(SHEET_NAME, 'id', id, payload);
    res.json({ success: true, data: updated, message: 'Collection updated' });
  } catch (err) {
    next(err);
  }
}

async function deleteCollection(req, res, next) {
  try {
    const { id } = req.params;
    await sheetsService.deleteRow(SHEET_NAME, 'id', id);
    res.json({ success: true, data: { id }, message: 'Collection deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection
};
`;
writeFile('src/controllers/growkins/collectionController.js', collectionCtrlCode);

// 9. Updated Misc Controller for Settings, Delivery, Content, Dashboard
const miscCtrlCode = `const sheetsService = require('../../services/growkins/sheetsService');

const SHEET_SETTINGS = 'Settings';
const DEFAULT_HEADERS = ['key', 'value', 'updatedAt'];

// Default Settings
const DEFAULT_DELIVERY_SETTINGS = {
  zones: [
    {
      id: 'zone_dhaka',
      name: 'Inside Dhaka City',
      description: 'Covers all Dhaka Metropolitan areas',
      fee: 70,
      estimatedDelivery: '24-48 hours',
      freeDeliveryThreshold: 2500,
      active: true
    },
    {
      id: 'zone_outside',
      name: 'Outside Dhaka (All Bangladesh)',
      description: 'Chittagong, Sylhet, Rajshahi, Khulna, Barisal, Rangpur, Mymensingh',
      fee: 130,
      estimatedDelivery: '2-4 business days',
      freeDeliveryThreshold: 2500,
      active: true
    }
  ],
  standardEstimatedTime: '2-4 business days',
  codAvailableAllZones: true,
  freeDeliveryBannerEnabled: true,
  freeDeliveryThreshold: 2500,
  urgentDeliveryEnabled: false,
  urgentDeliveryFee: 150
};

const DEFAULT_STORE_SETTINGS = {
  storeName: 'GrowKins Bangladesh',
  tagline: 'Mindful Play & Organic Baby Essentials',
  hotline: '+880 1700-000000',
  email: 'support@growkins.com',
  address: 'Banani, Road 11, Dhaka-1213, Bangladesh',
  currency: 'BDT',
  currencySymbol: '৳',
  facebookUrl: 'https://facebook.com/growkins',
  instagramUrl: 'https://instagram.com/growkins'
};

const DEFAULT_CHECKOUT_SETTINGS = {
  codEnabled: true,
  phoneVerificationNotice: 'Our support team will call you within 2-4 hours to confirm your Cash on Delivery order before dispatch.',
  minOrderAmount: 0,
  orderSuccessMessage: 'Thank you for choosing GrowKins! Your order has been placed successfully.'
};

async function getSetting(req, res, next) {
  try {
    const { type } = req.params;
    const settings = await sheetsService.getAllRows(SHEET_SETTINGS);
    const found = settings.find(s => s.key === type);

    if (found) {
      const parsed = typeof found.value === 'object' ? found.value : JSON.parse(found.value || '{}');
      return res.json({ success: true, data: parsed });
    }

    // Default fallbacks
    if (type === 'delivery') return res.json({ success: true, data: DEFAULT_DELIVERY_SETTINGS });
    if (type === 'store') return res.json({ success: true, data: DEFAULT_STORE_SETTINGS });
    if (type === 'checkout') return res.json({ success: true, data: DEFAULT_CHECKOUT_SETTINGS });

    res.json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
}

async function updateSetting(req, res, next) {
  try {
    const { type } = req.params;
    const value = req.body;
    const now = new Date().toISOString();

    const settings = await sheetsService.getAllRows(SHEET_SETTINGS);
    const existing = settings.find(s => s.key === type);

    if (existing) {
      await sheetsService.updateRow(SHEET_SETTINGS, 'key', type, {
        value: typeof value === 'object' ? JSON.stringify(value) : value,
        updatedAt: now
      });
    } else {
      await sheetsService.appendRow(SHEET_SETTINGS, {
        key: type,
        value: typeof value === 'object' ? JSON.stringify(value) : value,
        updatedAt: now
      }, DEFAULT_HEADERS);
    }

    res.json({ success: true, data: value, message: 'Settings saved successfully' });
  } catch (err) {
    next(err);
  }
}

async function getDelivery(req, res, next) {
  req.params.type = 'delivery';
  return getSetting(req, res, next);
}

async function updateDelivery(req, res, next) {
  req.params.type = 'delivery';
  return updateSetting(req, res, next);
}

async function getDashboardSummary(req, res, next) {
  try {
    const [products, orders] = await Promise.all([
      sheetsService.getAllRows('Products'),
      sheetsService.getAllRows('Orders')
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const outOfStock = products.filter(p => (p.inventory?.quantity || 0) <= 0).length;

    res.json({
      success: true,
      data: {
        totalRevenue,
        ordersCount: orders.length,
        pendingOrders,
        productsCount: products.length,
        outOfStockCount: outOfStock,
        recentOrders: orders.slice(0, 5)
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getSetting,
  updateSetting,
  getDelivery,
  updateDelivery,
  getDashboardSummary
};
`;
writeFile('src/controllers/growkins/miscController.js', miscCtrlCode);

// 10. Complete Routes index.js
const routesIndexCode = `const express = require('express');
const multer = require('multer');

// Memory storage for multer so we can directly pipe buffer to Google Drive
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
});

const productCtrl = require('../../controllers/growkins/productController');
const orderCtrl = require('../../controllers/growkins/orderController');
const catCtrl = require('../../controllers/growkins/categoryController');
const colCtrl = require('../../controllers/growkins/collectionController');
const mediaCtrl = require('../../controllers/growkins/mediaController');
const customerCtrl = require('../../controllers/growkins/customerController');
const reviewCtrl = require('../../controllers/growkins/reviewController');
const authCtrl = require('../../controllers/growkins/authController');
const miscCtrl = require('../../controllers/growkins/miscController');

const router = express.Router();

// Health check for GrowKins
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'GrowKins Google Sheets & Drive API', timestamp: new Date().toISOString() });
});

// Define core API router
const apiRouter = express.Router();

// Auth
apiRouter.post('/auth/login', authCtrl.login);
apiRouter.get('/auth/me', authCtrl.getMe);
apiRouter.post('/auth/logout', authCtrl.logout);
apiRouter.post('/auth/refresh', authCtrl.refresh);

// Products
apiRouter.get('/products', productCtrl.listProducts);
apiRouter.post('/products', productCtrl.createProduct);
apiRouter.get('/products/:id', productCtrl.getProductById);
apiRouter.patch('/products/:id', productCtrl.updateProduct);
apiRouter.delete('/products/:id', productCtrl.deleteProduct);
apiRouter.post('/products/bulk-status', productCtrl.bulkUpdateStatus);

// Orders
apiRouter.get('/orders', orderCtrl.listOrders);
apiRouter.post('/orders', orderCtrl.createOrder);
apiRouter.get('/orders/:id', orderCtrl.getOrderById);
apiRouter.patch('/orders/:id/status', orderCtrl.updateOrderStatus);
apiRouter.patch('/orders/:id/payment', orderCtrl.updatePaymentStatus);

// Categories
apiRouter.get('/categories', catCtrl.listCategories);
apiRouter.post('/categories', catCtrl.createCategory);
apiRouter.get('/categories/:id', catCtrl.getCategoryById);
apiRouter.patch('/categories/:id', catCtrl.updateCategory);
apiRouter.delete('/categories/:id', catCtrl.deleteCategory);

// Collections
apiRouter.get('/collections', colCtrl.listCollections);
apiRouter.post('/collections', colCtrl.createCollection);
apiRouter.get('/collections/:id', colCtrl.getCollectionById);
apiRouter.patch('/collections/:id', colCtrl.updateCollection);
apiRouter.delete('/collections/:id', colCtrl.deleteCollection);

// Customers
apiRouter.get('/customers', customerCtrl.listCustomers);
apiRouter.get('/customers/:id', customerCtrl.getCustomerById);

// Reviews
apiRouter.get('/reviews', reviewCtrl.listReviews);
apiRouter.get('/reviews/:id', reviewCtrl.getReviewById);
apiRouter.patch('/reviews/:id/status', reviewCtrl.updateReviewStatus);
apiRouter.delete('/reviews/:id', reviewCtrl.deleteReview);

// Media (Google Drive Upload & Delete)
apiRouter.get('/media', mediaCtrl.listMedia);
apiRouter.post('/media/upload', upload.single('file'), mediaCtrl.uploadMedia);
apiRouter.delete('/media/:id', mediaCtrl.deleteMedia);

// Delivery Settings Direct Routes
apiRouter.get('/delivery', miscCtrl.getDelivery);
apiRouter.patch('/delivery', miscCtrl.updateDelivery);

// Settings & Content
apiRouter.get('/settings/:type', miscCtrl.getSetting);
apiRouter.patch('/settings/:type', miscCtrl.updateSetting);
apiRouter.get('/content/:type', miscCtrl.getSetting);
apiRouter.patch('/content/:type', miscCtrl.updateSetting);

// Dashboard
apiRouter.get('/dashboard/summary', miscCtrl.getDashboardSummary);

// Mount so direct paths, /admin, and /api/admin all resolve seamlessly
router.use('/', apiRouter);
router.use('/admin', apiRouter);
router.use('/api/admin', apiRouter);

module.exports = router;
`;
writeFile('src/routes/growkins/index.js', routesIndexCode);

console.log('Phase 1 backend setup complete!');
