// ============================================================
// ERROR ALERTER — emails the admin on unhandled server errors
//
// Replaces Sentry. Uses the existing Resend integration.
// Rate-limited to 1 email per unique error per hour via Redis
// so a thundering herd of the same error doesn't flood inbox.
// Only fires in production — silent in dev.
// ============================================================

import { sendEmail } from "./email.js";
import { incrBy }    from "./redisClient.js";
import logger        from "./logger.js";

const ALERT_EMAIL   = process.env.ERROR_ALERT_EMAIL || process.env.COMPANY_ADMIN_EMAIL;
const RATE_TTL      = 60 * 60; // 1 hour — one email per error type per hour

// Stable fingerprint from first 2 stack lines (strips line numbers that change on redeploy)
function fingerprint(err) {
  const raw = (err.stack || err.message || "unknown")
    .split("\n")
    .slice(0, 3)
    .join("|")
    .replace(/:\d+:\d+/g, "")        // strip line:col numbers
    .replace(/[^a-zA-Z0-9_|.]/g, "_")
    .slice(0, 80);
  return `err_alert:${raw}`;
}

export async function alertOnError(err, context = {}) {
  if (process.env.NODE_ENV !== "production") return;
  if (!ALERT_EMAIL) return;

  try {
    // Rate limit — only alert once per hour for the same error
    const count = await incrBy(fingerprint(err), 1, RATE_TTL);
    if (count > 1) return;

    const { route = "unknown", method = "", userId } = context;
    const ts      = new Date().toISOString();
    const stack   = (err.stack || "No stack trace")
      .replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .split("\n").slice(0, 10).join("\n");

    await sendEmail({
      to:      ALERT_EMAIL,
      subject: `[Stellar Error] ${err.message?.slice(0, 80) || "Unknown error"}`,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1c1c1e">
          <h2 style="color:#ff3b30;margin:0 0 20px;font-size:20px">&#x1F6A8; Server Error — stellaredu.in</h2>

          <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:20px;border-radius:10px;overflow:hidden">
            <tr style="background:#f2f2f7">
              <td style="padding:10px 14px;color:#636366;width:90px;font-weight:600">Time</td>
              <td style="padding:10px 14px">${ts}</td>
            </tr>
            <tr>
              <td style="padding:10px 14px;color:#636366;font-weight:600">Route</td>
              <td style="padding:10px 14px"><strong>${method} ${route}</strong></td>
            </tr>
            <tr style="background:#f2f2f7">
              <td style="padding:10px 14px;color:#636366;font-weight:600">User</td>
              <td style="padding:10px 14px">${userId || "unauthenticated"}</td>
            </tr>
            <tr>
              <td style="padding:10px 14px;color:#636366;font-weight:600">Error</td>
              <td style="padding:10px 14px;color:#ff3b30;font-weight:700">${err.message || "Unknown"}</td>
            </tr>
          </table>

          <div style="background:#1c1c1e;border-radius:10px;padding:16px;margin-bottom:20px">
            <p style="color:#636366;font-size:11px;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.5px">Stack Trace</p>
            <pre style="color:#30d158;font-size:11px;margin:0;white-space:pre-wrap;overflow-wrap:break-word">${stack}</pre>
          </div>

          <p style="font-size:12px;color:#8e8e93;margin:0">
            This error will not be reported again for 1 hour &middot; Check server logs for full details
          </p>
        </div>
      `,
    });

    logger.info("Error alert emailed", { route, error: err.message?.slice(0, 80) });
  } catch (alertErr) {
    logger.warn("errorAlert: failed to send alert email", { err: alertErr.message });
  }
}
