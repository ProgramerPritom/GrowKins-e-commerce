const fs = require('fs');
const path = 'D:/Frontend Work/Pritom-folder/utills-server/.env';

let envContent = `PORT=5000
GROWKINS_GOOGLE_SHEET_ID=1TuqwgHk9BalXzOgwZbVynDWpAjyZ0SkZVjEnXVdIEsk
GROWKINS_GOOGLE_DRIVE_FOLDER_ID=1kgGRy6hy4ePhWJ4qqaNQkBZ3zlfml6V6
GROWKINS_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbwHXsiJwcdZF03nXGGExnR2_ycT_Lmr1f4DBm2qkATe_jOXdXLvg1sI8aY0CBriKYgc8Q/exec
`;

fs.writeFileSync(path, envContent, 'utf8');
console.log('[OK] utills-server .env updated with Apps Script URL!');
