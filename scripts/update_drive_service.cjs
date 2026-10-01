const fs = require('fs');
const path = 'D:/Frontend Work/Pritom-folder/utills-server/src/services/growkins/driveService.js';

const code = `const { google } = require('googleapis');
const { Readable } = require('stream');
const { getGoogleAuth } = require('./googleAuth');

const drive = google.drive('v3');

function getFolderId() {
  return process.env.GROWKINS_GOOGLE_DRIVE_FOLDER_ID || null;
}

function getAppsScriptUrl() {
  return process.env.GROWKINS_GOOGLE_APPS_SCRIPT_URL || null;
}

/**
 * Upload image buffer to Google Drive
 * Supports both Google Apps Script Web App Bridge (for free personal 15GB Gmail quota)
 * and Google Drive v3 API (for Google Workspace Shared Drives / OAuth).
 */
async function uploadImageToDrive(fileBuffer, originalName, mimeType) {
  const folderId = getFolderId();
  const appsScriptUrl = getAppsScriptUrl();

  // Method 1: Google Apps Script Bridge (Runs with personal Gmail 15GB storage, 0 quota issues)
  if (appsScriptUrl) {
    try {
      const base64Data = fileBuffer.toString('base64');
      const payload = {
        folderId: folderId,
        fileName: \`growkins_\${Date.now()}_\${originalName}\`,
        mimeType: mimeType || 'image/jpeg',
        base64: base64Data
      };

      const response = await fetch(appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const resData = await response.json();
      if (resData.success && resData.fileId) {
        const fileId = resData.fileId;
        const directUrl = \`https://lh3.googleusercontent.com/d/\${fileId}\`;
        return {
          id: fileId,
          name: resData.fileName || originalName,
          url: directUrl,
          directUrl,
          webViewLink: resData.webViewLink || \`https://drive.google.com/file/d/\${fileId}/view\`,
          createdAt: new Date().toISOString()
        };
      }
    } catch (scriptErr) {
      console.warn('[GoogleAppsScript Bridge Error]:', scriptErr.message);
    }
  }

  // Method 2: Direct Google Drive API (Service Account / OAuth / Shared Drive)
  const auth = getGoogleAuth();
  const fileMetadata = {
    name: \`growkins_\${Date.now()}_\${originalName}\`,
    parents: folderId ? [folderId] : []
  };

  const bufferStream = new Readable();
  bufferStream.push(fileBuffer);
  bufferStream.push(null);

  const media = {
    mimeType: mimeType || 'image/jpeg',
    body: bufferStream
  };

  const response = await drive.files.create({
    auth,
    supportsAllDrives: true,
    resource: fileMetadata,
    media: media,
    fields: 'id, name, webViewLink, webContentLink'
  });

  const fileId = response.data.id;

  // Make file publicly readable
  try {
    await drive.permissions.create({
      auth,
      fileId: fileId,
      supportsAllDrives: true,
      requestBody: {
        role: 'reader',
        type: 'anyone'
      }
    });
  } catch (permErr) {
    console.warn('[GoogleDrive] Could not set public permission:', permErr.message);
  }

  const directUrl = \`https://lh3.googleusercontent.com/d/\${fileId}\`;

  return {
    id: fileId,
    name: response.data.name,
    url: directUrl,
    directUrl,
    webViewLink: response.data.webViewLink,
    createdAt: new Date().toISOString()
  };
}

/**
 * Delete a file from Google Drive
 */
async function deleteImageFromDrive(fileId) {
  const auth = getGoogleAuth();
  await drive.files.delete({
    auth,
    supportsAllDrives: true,
    fileId
  });
  return { id: fileId, deleted: true };
}

module.exports = {
  uploadImageToDrive,
  deleteImageFromDrive
};
`;

fs.writeFileSync(path, code, 'utf8');
console.log('[OK] Enhanced driveService.js written successfully!');
