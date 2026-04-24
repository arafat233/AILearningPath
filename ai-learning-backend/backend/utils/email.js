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
