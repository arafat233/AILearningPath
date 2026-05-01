import logger from "./logger.js";

/**
 * Sends an email using Resend (preferred) → SMTP (fallback) → console log (dev).
 * Set RESEND_API_KEY for real delivery. Set RESEND_FROM to customise the sender.
 * @param {{ to: string, subject: string, html: string }} opts
 */
export async function sendEmail({ to, subject, html }) {
  // ── Resend (preferred) ────────────────────────────────────────────
  if (process.env.RESEND_API_KEY) {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = process.env.RESEND_FROM || "AILearn <noreply@ailearn.app>";
    const { error } = await resend.emails.send({ from, to, subject, html });
    if (error) {
      logger.error("Resend delivery failed", { to, subject, error: error.message });
      throw new Error(`Resend error: ${error.message}`);
    }
    logger.info("Email sent via Resend", { to, subject });
    return;
  }

  // ── SMTP / nodemailer (fallback) ──────────────────────────────────
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    const nodemailer = (await import("nodemailer")).default;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587", 10),
      secure: parseInt(process.env.SMTP_PORT || "587", 10) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    const from = process.env.SMTP_FROM || process.env.SMTP_USER;
    await transporter.sendMail({ from, to, subject, html });
    logger.info("Email sent via SMTP", { to, subject });
    return;
  }

  // ── Dev console fallback ──────────────────────────────────────────
  logger.warn("No email provider configured (set RESEND_API_KEY) — printing to console", { to, subject });
  logger.info(`EMAIL ▸ To: ${to} | Subject: ${subject}`);
  logger.info(`EMAIL ▸ Body: ${html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().slice(0, 300)}`);
}

export function sendReceiptEmail({ to, name, planName, amount, paymentId, expiresAt }) {
  const amountRupees = (amount / 100).toFixed(2);
  const expiryStr    = new Date(expiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const safeName     = String(name || "Student").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return sendEmail({
    to,
    subject: `Payment confirmed — ${planName} Plan receipt`,
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#1c1c1e">
        <h2 style="margin:0 0 4px;font-size:22px;font-weight:700">Payment Confirmed ✓</h2>
        <p style="margin:0 0 24px;color:#636366;font-size:14px">Thanks for upgrading, ${safeName}!</p>

        <div style="background:#f2f2f7;border-radius:12px;padding:20px 24px;margin-bottom:24px">
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="color:#636366;padding:4px 0">Plan</td><td style="text-align:right;font-weight:600">${planName}</td></tr>
            <tr><td style="color:#636366;padding:4px 0">Amount</td><td style="text-align:right;font-weight:600">₹${amountRupees}</td></tr>
            <tr><td style="color:#636366;padding:4px 0">Payment ID</td><td style="text-align:right;font-family:monospace;font-size:12px">${paymentId}</td></tr>
            <tr><td style="color:#636366;padding:4px 0">Valid until</td><td style="text-align:right;font-weight:600">${expiryStr}</td></tr>
          </table>
        </div>

        <p style="font-size:13px;color:#636366;margin:0">
          Questions? Reply to this email or contact us at support@ailearn.app
        </p>
      </div>
    `,
  });
}
