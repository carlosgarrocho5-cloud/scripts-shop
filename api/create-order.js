// ============================================
// BACKEND API (Node.js + Express)
// Deploy this on Vercel as serverless functions
// ============================================

// File: api/create-order.js
// This handles PayPal webhook and sends download links

import crypto from 'crypto';

// You'll need these environment variables in Vercel:
// - RESEND_API_KEY (for sending emails)
// - PAYPAL_WEBHOOK_ID
// - DATABASE_URL (for storing customers)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderID, customerEmail, items, totalAmount } = req.body;

    // Generate unique download links for each product
    const downloadLinks = items.map(item => ({
      productId: item.id,
      productName: item.name,
      downloadToken: crypto.randomBytes(32).toString('hex'),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      maxDownloads: 3 // Allow 3 downloads
    }));

    // Save to database
    await saveCustomerPurchase({
      email: customerEmail,
      orderID,
      items: downloadLinks,
      totalAmount,
      purchaseDate: new Date()
    });

    // Send email with download links
    await sendDownloadEmail(customerEmail, downloadLinks);

    return res.status(200).json({ 
      success: true,
      message: 'Download links sent to email'
    });

  } catch (error) {
    console.error('Order processing error:', error);
    return res.status(500).json({ error: 'Failed to process order' });
  }
}