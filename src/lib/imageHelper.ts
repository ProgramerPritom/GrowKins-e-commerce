/**
 * Universal Image URL Helper for GrowKins
 * Seamlessly resolves Google Drive links, local /items/... assets, and external CDN URLs
 */

export function getOptimizedImageUrl(url: string | undefined | null): string {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return '/items/busy-cube.jfif'; // default fallback
  }

  const cleanUrl = url.trim();

  // 1. Google Drive direct ID / link transforms:
  // e.g., https://drive.google.com/file/d/1aB2c3D4e5F6/view?usp=sharing
  const fileIdMatch = cleanUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileIdMatch && fileIdMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}`;
  }

  // e.g., https://drive.google.com/open?id=1aB2c3D4e5F6 or ?id=1aB2c3D4e5F6
  const queryIdMatch = cleanUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (queryIdMatch && queryIdMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${queryIdMatch[1]}`;
  }

  // e.g., https://drive.google.com/uc?id=1aB2c3D4e5F6
  const ucIdMatch = cleanUrl.match(/\/uc\?(?:export=view&)?id=([a-zA-Z0-9_-]+)/);
  if (ucIdMatch && ucIdMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${ucIdMatch[1]}`;
  }

  // 2. If it's already a direct lh3 googleusercontent link or full http/https, return as-is
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
    return cleanUrl;
  }

  // 3. Local relative paths (e.g. /items/busy-cube.jfif)
  return cleanUrl;
}

export function extractDriveFileId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
                url.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
                url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}
