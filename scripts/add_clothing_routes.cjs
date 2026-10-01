const fs = require('fs');
const path = require('path');

const BACKEND_BASE = 'D:/Frontend Work/Pritom-folder/utills-server';

const clothingCtrlCode = `// Clothing Controller for GrowKins
const sheetsService = require('../../services/growkins/sheetsService');

async function getProducts(req, res, next) {
  try {
    const products = await sheetsService.getAllRows('Products');
    // Filter apparel or return all products
    const apparel = products.filter(p => p.category === 'Apparel & Rompers' || p.category?.toLowerCase().includes('apparel') || Array.isArray(p.images));
    res.json({
      success: true,
      products: apparel.length > 0 ? apparel : products,
      total: apparel.length > 0 ? apparel.length : products.length
    });
  } catch (err) {
    next(err);
  }
}

async function getCategories(req, res, next) {
  try {
    const categories = await sheetsService.getAllRows('Categories');
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
}

async function getCollections(req, res, next) {
  try {
    const collections = await sheetsService.getAllRows('Collections');
    res.json({ success: true, data: collections });
  } catch (err) {
    next(err);
  }
}

async function getLooks(req, res, next) {
  res.json({ success: true, data: [] });
}

async function getSizeGuides(req, res, next) {
  res.json({ success: true, data: [] });
}

module.exports = {
  getProducts,
  getCategories,
  getCollections,
  getLooks,
  getSizeGuides
};
`;

fs.writeFileSync(path.join(BACKEND_BASE, 'src/controllers/growkins/clothingController.js'), clothingCtrlCode, 'utf8');

// Update routes/growkins/index.js to include clothing routes
const routesPath = path.join(BACKEND_BASE, 'src/routes/growkins/index.js');
let routesContent = fs.readFileSync(routesPath, 'utf8');

if (!routesContent.includes('clothingCtrl')) {
  routesContent = routesContent.replace(
    `const miscCtrl = require('../../controllers/growkins/miscController');`,
    `const miscCtrl = require('../../controllers/growkins/miscController');\nconst clothingCtrl = require('../../controllers/growkins/clothingController');`
  );

  routesContent = routesContent.replace(
    `// Delivery Settings Direct Routes`,
    `// Clothing Routes\napiRouter.get('/clothing/products', clothingCtrl.getProducts);\napiRouter.get('/clothing/categories', clothingCtrl.getCategories);\napiRouter.get('/clothing/collections', clothingCtrl.getCollections);\napiRouter.get('/clothing/lookbooks', clothingCtrl.getLooks);\napiRouter.get('/clothing/size-guides', clothingCtrl.getSizeGuides);\n\n// Delivery Settings Direct Routes`
  );

  fs.writeFileSync(routesPath, routesContent, 'utf8');
  console.log('[OK] Clothing routes mounted in utills-server');
}
