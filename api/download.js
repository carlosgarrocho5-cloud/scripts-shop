// api/download.js
import { promises as fs } from 'fs';
import path from 'path';

// =============================================
// CONFIG: Map your product IDs → real file paths
// =============================================
const PRODUCT_FILES = {
  // FiveM Scripts
  1: '/scripts/fivem/1-Premium-Car-Services/resource.zip',
  2: '/scripts/fivem/2-Advanced-Mechanic-Tablet/resource.zip',
  3: '/scripts/fivem/3-vehicle-shop/resource.zip',
  7: '/scripts/fivem/7-hospital-system/resource.zip',
  8: '/scripts/fivem/8-drug-system/resource.zip',

  // Minecraft Plugins
  4: '/scripts/minecraft/4-skyblock-advanced/skyblock-advanced-v2.1.0.jar',
  5: '/scripts/minecraft/5-prison-pro/prison-pro-v3.2.1.jar',
  9: '/scripts/minecraft/9-factions-plus/factions-plus-v4.8.2.jar',

  // Roblox
  6: '/scripts/roblox/6-tycoon-kit/tycoon-kit-v3.5.rbxm',
  10: '/scripts/roblox/10-obby-kit/obby-checkpoint-system-v2.1.rbxm',

  // Add as many as you want
};

// Optional: nicer filenames (recommended)
const NICE_FILENAMES = {
  1: 'Advanced_Police_System_v1.8_FiveM.zip',
  2: 'Custom_Job_Framework_v2.3_FiveM.zip',
  3: 'Vehicle_Shop_Pro_v1.9_FiveM.zip',
  4: 'Skyblock_Advanced_v2.1.0.jar',
  5: 'Prison_Pro_v3.2.1.jar',
  6: 'Ultimate_Tycoon_Kit_v3.5.rbxm',
  7: 'Hospital_System_Pro_v2.0_FiveM.zip',
  8: 'Advanced_Drug_System_v1.7_FiveM.zip',
  9: 'Factions_Plus_v4.8.2.jar',
  10: 'Obby_Checkpoint_System_v2.1.rbxm',
};

// =============================================
// MAIN HANDLER
// =============================================
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Missing download token' });
  }

  try {
    // 1. Find download record in database
    const download = await getDownloadByToken(token);

    if (!download) {
      return res.status(404).json({
        error: 'Invalid or expired download link',
        tip: 'Request a new link from your purchase email.'
      });
    }

    // 2. Check expiration
    if (new Date() > new Date(download.expires_at)) {
      return res.status(410).json({
        error: 'This download link has expired',
        details: 'Links expire 24 hours after purchase.'
      });
    }

    // 3. Check max downloads
    if (download.download_count >= download.max_downloads) {
      return res.status(403).json({
        error: 'Maximum downloads reached',
        details: `This link allows only ${download.max_downloads} downloads.`
      });
    }

    // 4. Get the real file path
    const filePath = PRODUCT_FILES[download.product_id];
    if (!filePath) {
      console.error(`No file mapped for product ID: ${download.product_id}`);
      return res.status(500).json({ error: 'Product file not found on server' });
    }

    const fullPath = path.join(process.cwd(), 'public', filePath);

    // 5. Verify file actually exists
    try {
      await fs.access(fullPath);
    } catch {
      console.error(`File not found: ${fullPath}`);
      return res.status(500).json({ error: 'Script file missing on server' });
    }

    // 6. Increment download counter
    await incrementDownloadCount(token);

    // 7. Read file
    const fileBuffer = await fs.readFile(fullPath);

    // 8. Determine content type and filename
    const ext = path.extname(filePath).toLowerCase();
    const contentType = {
      '.zip': 'application/zip',
      '.jar': 'application/java-archive',
      '.rbxm': 'application/octet-stream',
      '.rbxl': 'application/octet-stream'
    }[ext] || 'application/octet-stream';

    const niceName = NICE_FILENAMES[download.product_id] ||
                     `${download.product_name.replace(/[^a-zA-Z0-9]/g, '_')}${ext}`;

    // 9. Send file
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${niceName}"`);
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Download-Count', download.download_count + 1);

    return res.send(fileBuffer);

  } catch (error) {
    console.error('Download error:', error);
    return res.status(500).json({
      error: 'Download failed',
      details: 'Please contact support with your order email.'
    });
  }
}

// =============================================
// DATABASE HELPERS (PostgreSQL / Supabase / Vercel Postgres)
// =============================================
async function getDownloadByToken(token) {
  const { db } = await import('../lib/db'); // Adjust path to your DB connection
  const result = await db.query(
    `SELECT dl.*, dl.product_id, dl.product_name
     FROM download_links dl
     WHERE dl.download_token = $1
     AND dl.expires_at > NOW()`,
    [token]
  );
  return result.rows[0] || null;
}

async function incrementDownloadCount(token) {
  const { db } = await import('../lib/db');
  await db.query(
    `UPDATE download_links 
     SET download_count = download_count + 1 
     WHERE download_token = $1`,
    [token]
  );
}

// Optional: log downloads
// await db.query(`INSERT INTO download_logs (...) VALUES (...)`);