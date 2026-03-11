export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { customerEmail, customerName, orderId, items, form, total, savings, shipping, grandTotal } = req.body;

  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  const ADMIN_EMAIL   = process.env.ADMIN_EMAIL;
  const SENDER_EMAIL  = process.env.SENDER_EMAIL;

  if (!BREVO_API_KEY || !ADMIN_EMAIL || !SENDER_EMAIL) {
    return res.status(500).json({ error: "Missing environment variables" });
  }

  // ── Build item rows for email ──
  const itemRows = items.map(i => `
    <tr>
      <td style="padding:10px 12px; border-bottom:1px solid #f0e8dc; font-size:14px; color:#1a0800;">${i.name}</td>
      <td style="padding:10px 12px; border-bottom:1px solid #f0e8dc; font-size:14px; color:#1a0800; text-align:center;">${i.quantity}</td>
      <td style="padding:10px 12px; border-bottom:1px solid #f0e8dc; font-size:14px; color:#1a0800; text-align:right;">₹${i.price.toLocaleString()}</td>
      <td style="padding:10px 12px; border-bottom:1px solid #f0e8dc; font-size:14px; font-weight:700; color:#FF6B00; text-align:right;">₹${(i.price * i.quantity).toLocaleString()}</td>
    </tr>`).join("");

  // ── Customer email HTML ──
  const customerHTML = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f7f0e8;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f0e8;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1a0800,#2d1000);padding:32px 40px;text-align:center;">
            <h1 style="margin:0;font-size:26px;font-weight:900;letter-spacing:2px;color:#FFD700;">SPARKNEST</h1>
            <p style="margin:6px 0 0;font-size:12px;color:rgba(255,245,230,0.6);letter-spacing:1px;text-transform:uppercase;">Where Every Celebration Begins</p>
          </td>
        </tr>

        <!-- Order confirmed banner -->
        <tr>
          <td style="background:#FF6B00;padding:14px 40px;text-align:center;">
            <p style="margin:0;font-size:15px;font-weight:700;color:#fff;">🎆 Order Received — #${orderId}</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px 40px;">
            <p style="font-size:16px;color:#1a0800;margin:0 0 6px;">Dear <strong>${customerName}</strong>,</p>
            <p style="font-size:14px;color:#5a4030;line-height:1.7;margin:0 0 28px;">Thank you for your order! Please complete the payment using the details below and reply with your payment screenshot on WhatsApp. We will confirm and dispatch within <strong>24 hours</strong>.</p>

            <!-- Delivery address -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff8f0;border:1px solid #ffe0c0;border-radius:10px;margin-bottom:24px;">
              <tr><td style="padding:16px 20px;">
                <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#FF6B00;text-transform:uppercase;letter-spacing:0.08em;">Delivery Address</p>
                <p style="margin:0;font-size:14px;color:#1a0800;line-height:1.7;">
                  <strong>${form.name}</strong> · ${form.phone}${form.email ? ` · ${form.email}` : ""}<br>
                  ${form.address}<br>
                  ${form.city}, ${form.state} — ${form.pincode}
                </p>
              </td></tr>
            </table>

            <!-- Order items -->
            <p style="font-size:13px;font-weight:700;color:#1a0800;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 10px;">Order Summary</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0e8dc;border-radius:10px;overflow:hidden;margin-bottom:20px;">
              <tr style="background:#fff8f0;">
                <th style="padding:10px 12px;text-align:left;font-size:11px;color:#9a7060;font-weight:700;text-transform:uppercase;">Product</th>
                <th style="padding:10px 12px;text-align:center;font-size:11px;color:#9a7060;font-weight:700;text-transform:uppercase;">Qty</th>
                <th style="padding:10px 12px;text-align:right;font-size:11px;color:#9a7060;font-weight:700;text-transform:uppercase;">Price</th>
                <th style="padding:10px 12px;text-align:right;font-size:11px;color:#9a7060;font-weight:700;text-transform:uppercase;">Total</th>
              </tr>
              ${itemRows}
            </table>

            <!-- Price breakdown -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff8f0;border:1px solid #ffe0c0;border-radius:10px;margin-bottom:24px;">
              <tr><td style="padding:16px 20px;">
                <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#FF6B00;text-transform:uppercase;letter-spacing:0.08em;">Price Breakdown</p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="font-size:13px;color:#5a4030;padding:3px 0;">Item Total</td>
                    <td style="font-size:13px;color:#1a0800;text-align:right;padding:3px 0;">₹${(total + savings).toLocaleString()}</td>
                  </tr>
                  ${savings > 0 ? `<tr><td style="font-size:13px;color:#5a4030;padding:3px 0;">Discount</td><td style="font-size:13px;color:#1a7a4a;font-weight:700;text-align:right;padding:3px 0;">−₹${savings.toLocaleString()}</td></tr>` : ""}
                  <tr>
                    <td style="font-size:13px;color:#5a4030;padding:3px 0;">Delivery</td>
                    <td style="font-size:13px;color:${shipping === 0 ? "#1a7a4a" : "#1a0800"};font-weight:600;text-align:right;padding:3px 0;">${shipping === 0 ? "FREE" : `₹${shipping}`}</td>
                  </tr>
                  <tr>
                    <td colspan="2" style="padding-top:10px;border-top:1px solid #ffe0c0;"></td>
                  </tr>
                  <tr>
                    <td style="font-size:15px;font-weight:800;color:#1a0800;padding:2px 0;">Total Payable</td>
                    <td style="font-size:18px;font-weight:900;color:#FF6B00;text-align:right;padding:2px 0;">₹${grandTotal.toLocaleString()}</td>
                  </tr>
                </table>
              </td></tr>
            </table>

            <!-- Payment details -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fff5;border:1px solid #b2f0cc;border-radius:10px;margin-bottom:24px;">
              <tr><td style="padding:18px 20px;">
                <p style="margin:0 0 12px;font-size:11px;font-weight:700;color:#1a7a4a;text-transform:uppercase;letter-spacing:0.08em;">Payment Details</p>
                <p style="margin:0 0 6px;font-size:13px;color:#1a4a30;"><strong>UPI ID:</strong> satheeskani1995@okicici</p>
                <p style="margin:0 0 2px;font-size:13px;color:#1a4a30;font-weight:700;">Bank Transfer:</p>
                <p style="margin:0;font-size:13px;color:#1a4a30;line-height:1.8;">
                  Bank: Tamil Nadu Mercantile Bank<br>
                  A/C Name: Satheeskumar M<br>
                  A/C No: 435100050300843<br>
                  IFSC: TMBL0000435
                </p>
              </td></tr>
            </table>

            <p style="font-size:14px;color:#5a4030;line-height:1.7;margin:0;">
              Kindly transfer <strong style="color:#FF6B00;">₹${grandTotal.toLocaleString()}</strong> and send the payment screenshot to our WhatsApp: <strong>+91 8015850365</strong><br><br>
              For any queries, reach us on WhatsApp and we will be happy to assist you.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#1a0800;padding:20px 40px;text-align:center;">
            <p style="margin:0;font-size:12px;color:rgba(255,245,230,0.5);">© 2025 SparkNest · Sivakasi, Tamil Nadu</p>
            <p style="margin:6px 0 0;font-size:11px;color:rgba(255,245,230,0.3);">Where Every Celebration Begins 🎆</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  // ── Admin email HTML ──
  const adminHTML = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:24px;background:#f7f0e8;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
    <tr><td style="background:#FF6B00;padding:16px 28px;">
      <h2 style="margin:0;color:#fff;font-size:18px;">🔔 New Order — #${orderId}</h2>
    </td></tr>
    <tr><td style="padding:24px 28px;">
      <p style="margin:0 0 16px;font-size:13px;color:#5a4030;"><strong>Customer:</strong> ${form.name} · ${form.phone}${form.email ? ` · ${form.email}` : ""}<br>
      <strong>Address:</strong> ${form.address}, ${form.city}, ${form.state} — ${form.pincode}</p>

      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0e8dc;border-radius:8px;overflow:hidden;margin-bottom:16px;">
        <tr style="background:#fff8f0;">
          <th style="padding:8px 12px;text-align:left;font-size:11px;color:#9a7060;font-weight:700;">Product</th>
          <th style="padding:8px 12px;text-align:center;font-size:11px;color:#9a7060;font-weight:700;">Qty</th>
          <th style="padding:8px 12px;text-align:right;font-size:11px;color:#9a7060;font-weight:700;">Amount</th>
        </tr>
        ${items.map(i => `
        <tr>
          <td style="padding:9px 12px;border-top:1px solid #f0e8dc;font-size:13px;color:#1a0800;">${i.name}</td>
          <td style="padding:9px 12px;border-top:1px solid #f0e8dc;font-size:13px;color:#1a0800;text-align:center;">${i.quantity}</td>
          <td style="padding:9px 12px;border-top:1px solid #f0e8dc;font-size:13px;font-weight:700;color:#FF6B00;text-align:right;">₹${(i.price * i.quantity).toLocaleString()}</td>
        </tr>`).join("")}
      </table>

      <p style="margin:0;font-size:15px;font-weight:800;color:#1a0800;">Total: <span style="color:#FF6B00;">₹${grandTotal.toLocaleString()}</span>${savings > 0 ? ` &nbsp;<span style="font-size:12px;color:#1a7a4a;font-weight:600;">(saved ₹${savings.toLocaleString()})</span>` : ""}</p>
      <p style="margin:8px 0 0;font-size:13px;color:#5a4030;">Delivery: ${shipping === 0 ? "FREE" : `₹${shipping}`}</p>
      <p style="margin:16px 0 0;padding:12px 16px;background:#fff3cd;border-radius:8px;font-size:13px;color:#856404;">⚠️ Verify payment screenshot from customer before dispatching.</p>
    </td></tr>
    <tr><td style="background:#1a0800;padding:12px 28px;text-align:center;">
      <p style="margin:0;font-size:11px;color:rgba(255,245,230,0.4);">SparkNest Admin Notification</p>
    </td></tr>
  </table>
</body>
</html>`;

  // ── Send both emails via Brevo ──
  const sendEmail = async (to, subject, html) => {
    const resp = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: "SparkNest", email: SENDER_EMAIL },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
    });
    if (!resp.ok) {
      const err = await resp.text();
      throw new Error(`Brevo error: ${err}`);
    }
    return resp.json();
  };

  try {
    const promises = [
      sendEmail(ADMIN_EMAIL, `🔔 New Order #${orderId} — ₹${grandTotal.toLocaleString()} — ${form.name}`, adminHTML),
    ];
    // Send to customer only if they provided email
    if (customerEmail) {
      promises.push(sendEmail(customerEmail, `Your SparkNest Order Confirmation — #${orderId}`, customerHTML));
    }
    await Promise.all(promises);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Email send error:", err);
    return res.status(500).json({ error: err.message });
  }
}
