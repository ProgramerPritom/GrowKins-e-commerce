const fs = require('fs');
const path = 'D:/Frontend Work/Pritom-folder/utills-server/src/services/growkins/sheetsService.js';

let content = fs.readFileSync(path, 'utf8');

// Replace the restrictive filtering condition
content = content.replace(
  `      // Filter out empty rows without an ID or name\n      if (obj.id || obj.name || obj.orderNumber) {\n        data.push(obj);\n      }`,
  `      // Filter out empty rows\n      const hasData = obj.id || obj.name || obj.orderNumber || obj.key || obj.productId || headers.some(h => obj[h] !== undefined && obj[h] !== null && obj[h] !== '');\n      if (hasData) {\n        data.push(obj);\n      }`
);

fs.writeFileSync(path, content, 'utf8');
console.log('[OK] sheetsService.js updated successfully!');
