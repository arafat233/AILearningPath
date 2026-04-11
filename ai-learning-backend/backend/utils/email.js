import nodemailer from "nodemailer";
import logger from "./logger.js";

/**
 * Creates a transporter from env vars.
 * Falls back to console-log in dev when SMTP is not configured.
 */
function createTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || "587", 10),
    secure: parseInt(SMTP_PORT || "587", 10) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

/**
 * Sends an email. In dev (no SMTP configured), logs the content instead.
 * @param {{ to: string, subject: string, html: string }} opts
 */
export async function sendEmail({ to, subject, html }) {
  const transporter = createTransporter();

  if (!transporter) {
    // Dev fallback — print to console so you can test without SMTP
    logger.warn("SMTP not configured — email printed to console instead", { to, subject });
    logger.info("── EMAIL CONTENT ──────────────────────────────");
    logger.info(`To:      ${to}`);
    logger.info(`Subject: ${subject}`);
    // Strip HTML tags for readable console output
    logger.info(`Body:    ${html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()}`);
    logger.info("───────────────────────────────────────────────");
    return;
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  await transporter.sendMail({ from, to, subject, html });
  logger.info("Email sent", { to, subject });
}
