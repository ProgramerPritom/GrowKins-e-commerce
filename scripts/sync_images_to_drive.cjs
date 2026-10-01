const fs = require('fs');
const path = require('path');

process.env.NODE_PATH = 'D:/Frontend Work/Pritom-folder/utills-server/node_modules';
require('module').Module._initPaths();
require('dotenv').config({ path: 'D:/Frontend Work/Pritom-folder/utills-server/.env' });

const driveService = require('D:/Frontend Work/Pritom-folder/utills-server/src/services/growkins/driveService');
const sheetsService = require('D:/Frontend Work/Pritom-folder/utills-server/src/services/growkins/sheetsService');

function getMimeType(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.jfif') return 'image/jpeg';
  if (ext === '.png') return 'image/png';
  if (ext === '.svg') return 'image/svg+xml';
  if (ext === '.webp') return 'image/webp';
  return 'application/octet-stream';
}

async function syncAllImages() {
  console.log('========================================================');
  console.log('    GROWKINS: GOOGLE DRIVE IMAGE SYNC & MIGRATION       ');
  console.log('========================================================\n');

  // Discover local images in public/items, public/, and src/assets
  const searchDirs = [
    path.join(__dirname, '../public/items'),
    path.join(__dirname, '../src/assets/items'),
    path.join(__dirname, '../src/assets')
  ];

  const localFiles = new Map(); // cleanName -> fullPath

  searchDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      const items = fs.readdirSync(dir);
      items.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isFile()) {
          const ext = path.extname(file).toLowerCase();
          if (['.jpg', '.jpeg', '.jfif', '.png', '.webp', '.svg'].includes(ext)) {
            const cleanName = path.basename(file);
            if (!localFiles.has(cleanName)) {
              localFiles.set(cleanName, fullPath);
            }
          }
        }
      });
    }
  });

  console.log(`Discovered ${localFiles.size} local images to sync with Google Drive.`);

  // Upload to Google Drive and record
  const uploadedMap = new Map();

  for (const [cleanName, filePath] of localFiles.entries()) {
    console.log(` ⬆ Uploading to Drive: ${cleanName}...`);
    const fileBuffer = fs.readFileSync(filePath);
    const mimeType = getMimeType(cleanName);

    try {
      const res = await driveService.uploadImageToDrive(fileBuffer, cleanName, mimeType);
      console.log(` ✅ SUCCESS: ${cleanName} -> ID: ${res.id}`);
      uploadedMap.set(cleanName, res.url);
      uploadedMap.set(`/items/${cleanName}`, res.url);

      // Record in Media sheet
      try {
        await sheetsService.appendRow('Media', {
          id: res.id,
          name: cleanName,
          url: res.url,
          directUrl: res.directUrl,
          size: fileBuffer.length,
          mimeType,
          createdAt: new Date().toISOString()
        }, ['id', 'name', 'url', 'directUrl', 'size', 'mimeType', 'createdAt']);
      } catch (sheetErr) {
        console.warn(`[Media Sheet Log Warning]:`, sheetErr.message);
      }
    } catch (err) {
      console.error(` ❌ Upload Failed for ${cleanName}:`, err.message);
    }
  }

  // Update Google Sheets Products URLs to point to Drive CDN URLs
  console.log('\n--- Updating Products Worksheet Image URLs in Google Sheets ---');
  const products = await sheetsService.getAllRows('Products', true);
  let updatedCount = 0;

  for (const prod of products) {
    let changed = false;
    const images = Array.isArray(prod.images) ? [...prod.images] : [];

    images.forEach(img => {
      if (typeof img.url === 'string') {
        const basename = path.basename(img.url);
        if (uploadedMap.has(basename)) {
          img.url = uploadedMap.get(basename);
          changed = true;
        } else if (uploadedMap.has(img.url)) {
          img.url = uploadedMap.get(img.url);
          changed = true;
        }
      }
    });

    let featuredImage = prod.featuredImage;
    if (featuredImage && typeof featuredImage === 'string') {
      const fb = path.basename(featuredImage);
      if (uploadedMap.has(fb)) {
        featuredImage = uploadedMap.get(fb);
        changed = true;
      }
    }

    if (changed) {
      await sheetsService.updateRow('Products', 'id', prod.id, {
        images,
        featuredImage: featuredImage || (images[0]?.url || ''),
        updatedAt: new Date().toISOString()
      });
      console.log(` 🔄 Updated images for: "${prod.name}" with Drive CDN links`);
      updatedCount++;
    }
  }

  // Save local mapping
  const mapPath = path.join(__dirname, '../src/data/driveImageMap.json');
  const mapObj = Object.fromEntries(uploadedMap);
  fs.writeFileSync(mapPath, JSON.stringify(mapObj, null, 2), 'utf8');
  console.log(`\n💾 Saved Drive Image Mapping to: src/data/driveImageMap.json`);

  console.log('\n========================================================');
  console.log(`  SYNC COMPLETE: ${uploadedMap.size / 2} Images Uploaded to Drive, ${updatedCount} Products Updated`);
  console.log('========================================================');
}

syncAllImages().catch(err => {
  console.error('Fatal Sync Error:', err);
  process.exit(1);
});
