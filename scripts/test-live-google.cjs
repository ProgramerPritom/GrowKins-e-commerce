const path = require('path');
require('dotenv').config({ path: 'D:\\Work Project\\Work-project\\utills-server\\.env' });

const { google } = require('googleapis');
const { getGoogleAuth } = require('D:\\Work Project\\Work-project\\utills-server\\src\\services\\growkins\\googleAuth');
const sheetsService = require('D:\\Work Project\\Work-project\\utills-server\\src\\services\\growkins\\sheetsService');

async function testConnection() {
  console.log('Testing GrowKins Google Sheets & Drive Connection...');
  console.log('Sheet ID:', process.env.GROWKINS_GOOGLE_SHEET_ID);
  console.log('Drive Folder ID:', process.env.GROWKINS_GOOGLE_DRIVE_FOLDER_ID);

  try {
    const auth = getGoogleAuth();
    console.log('Google Auth loaded successfully!');

    // 1. Test Google Sheets
    const sheets = google.sheets('v4');
    const sheetMeta = await sheets.spreadsheets.get({
      auth,
      spreadsheetId: process.env.GROWKINS_GOOGLE_SHEET_ID
    });
    console.log('SUCCESS: Connected to Google Sheet!');
    console.log('Spreadsheet Title:', sheetMeta.data.properties.title);
    console.log('Current Sheets/Tabs:', sheetMeta.data.sheets.map(s => s.properties.title));

    // Ensure our standard tabs exist
    console.log('\nEnsuring standard tabs exist (Products, Orders, Categories, Collections, Media, Settings)...');
    await sheetsService.ensureWorksheet('Products', [
      'id', 'name', 'slug', 'subtitle', 'sku', 'tag', 'price', 'compareAtPrice',
      'currency', 'status', 'category', 'ageGroup', 'ageBadge', 'interests',
      'benefits', 'materials', 'occasions', 'description', 'storyDescription',
      'whatsInside', 'playTips', 'dimensions', 'careInstructions', 'safetyNotes',
      'inventory', 'images', 'featuredImage', 'rating', 'reviewCount', 'featured',
      'seo', 'createdAt', 'updatedAt'
    ]);
    await sheetsService.ensureWorksheet('Orders', [
      'id', 'orderNumber', 'customer', 'deliveryAddress', 'items',
      'subtotal', 'deliveryFee', 'discount', 'total', 'currency',
      'paymentMethod', 'paymentStatus', 'status', 'notes', 'gift',
      'timeline', 'createdAt', 'updatedAt'
    ]);
    await sheetsService.ensureWorksheet('Categories', [
      'id', 'name', 'slug', 'description', 'image', 'icon', 'productCount', 'status', 'sortOrder'
    ]);
    await sheetsService.ensureWorksheet('Collections', [
      'id', 'name', 'slug', 'description', 'image', 'badge', 'productIds', 'status', 'sortOrder'
    ]);
    await sheetsService.ensureWorksheet('Media', [
      'id', 'name', 'url', 'directUrl', 'size', 'mimeType', 'createdAt'
    ]);
    await sheetsService.ensureWorksheet('Settings', [
      'key', 'value', 'updatedAt'
    ]);
    console.log('SUCCESS: All required sheets & headers are verified!');

    // 2. Test Google Drive
    const drive = google.drive('v3');
    const folderMeta = await drive.files.get({
      auth,
      fileId: process.env.GROWKINS_GOOGLE_DRIVE_FOLDER_ID,
      fields: 'id, name, mimeType'
    });
    console.log('\nSUCCESS: Connected to Google Drive folder!');
    console.log('Drive Folder Name:', folderMeta.data.name);

    console.log('\n*** ALL TESTS PASSED SUCCESSFULLY! EVERYTHING IS FULLY OPERATIONAL! ***');
    process.exit(0);
  } catch (err) {
    console.error('\nERROR during connection test:', err.message);
    if (err.errors) console.error('Details:', err.errors);
    process.exit(1);
  }
}

testConnection();
