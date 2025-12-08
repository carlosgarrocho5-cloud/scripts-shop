// ============================================
// BONUS: Newsletter System
// ============================================

// File: api/send-newsletter.js
export async function sendNewsletter(req, res) {
  const { subject, message } = req.body;
  
  // Get all customers who opted in
  const db = await getDatabase();
  const customers = await db.query(
    `SELECT email FROM customers WHERE marketing_consent = true`
  );
  
  const resend = await import('resend');
  const resendClient = new resend.Resend(process.env.RESEND_API_KEY);
  
  // Send to all customers
  for (const customer of customers.rows) {
    await resendClient.emails.send({
      from: 'Scripts Shop <news@scriptsshop.com>',
      to: customer.email,
      subject: subject,
      html: message
    });
  }
  
  return res.json({ success: true, sent: customers.rows.length });
}