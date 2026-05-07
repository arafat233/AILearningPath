// Token budget guards — global monthly + per-user daily/monthly, all Redis-backed.
// Set MONTHLY_TOKEN_BUDGET in env (e.g. 10000000 = 10M tokens ≈ $25/mo for Haiku).
// Set PER_USER_DAILY_TOKEN_LIMIT / PER_USER_MONTHLY_TOKEN_LIMIT to cap individuals.
// Leave any value unset or 0 to disable that cap.
import { incrBy, sessionGet } from "./redisClient.js";
import logger from "./logger.js";

const MONTHLY_BUDGET              = parseInt(process.env.MONTHLY_TOKEN_BUDGET         || "0", 10);
const PER_USER_DAILY_LIMIT        = parseInt(process.env.PER_USER_DAILY_TOKEN_LIMIT   || "0", 10);
const PER_USER_MONTHLY_LIMIT      = parseInt(process.env.PER_USER_MONTHLY_TOKEN_LIMIT || "0", 10);

const budgetKey = () => {
  const d = new Date();
  return `token_budget:${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const secondsUntilMidnight = () => {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return Math.ceil((midnight - now) / 1000) + 3600;
};

const secondsUntilEndOfMonth = () => {
  const now = new Date();
  const eom = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return Math.ceil((eom - now) / 1000) + 3600;
};

export async function checkTokenBudget() {
  if (!MONTHLY_BUDGET) return true;
  const used = (await sessionGet(budgetKey())) ?? 0;
  if (used >= MONTHLY_BUDGET) {
    logger.warn("Monthly token budget exhausted", { used, budget: MONTHLY_BUDGET });
    return false;
  }
  return true;
}

export async function incrementTokenBudget(tokens) {
  if (!tokens || tokens <= 0) return;
  await incrBy(budgetKey(), tokens, secondsUntilEndOfMonth());
}

// ── Per-user token limits ──────────────────────────────────────────
const userDailyKey   = (uid) => { const d = new Date(); return `user_tokens:d:${uid}:${d.toISOString().split("T")[0]}`; };
const userMonthlyKey = (uid) => { const d = new Date(); return `user_tokens:m:${uid}:${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`; };

export async function checkUserTokenBudget(userId) {
  if (!userId) return true;
  try {
    if (PER_USER_DAILY_LIMIT) {
      const used = (await sessionGet(userDailyKey(userId))) ?? 0;
      if (used >= PER_USER_DAILY_LIMIT) {
        logger.warn("Per-user daily token limit hit", { userId, used, limit: PER_USER_DAILY_LIMIT });
        return false;
      }
    }
    if (PER_USER_MONTHLY_LIMIT) {
      const used = (await sessionGet(userMonthlyKey(userId))) ?? 0;
      if (used >= PER_USER_MONTHLY_LIMIT) {
        logger.warn("Per-user monthly token limit hit", { userId, used, limit: PER_USER_MONTHLY_LIMIT });
        return false;
      }
    }
  } catch { /* Redis failure — allow the call */ }
  return true;
}

export async function incrementUserTokenBudget(userId, tokens) {
  if (!userId || !tokens || tokens <= 0) return;
  try {
    if (PER_USER_DAILY_LIMIT)   await incrBy(userDailyKey(userId),   tokens, secondsUntilMidnight());
    if (PER_USER_MONTHLY_LIMIT) await incrBy(userMonthlyKey(userId), tokens, secondsUntilEndOfMonth());
  } catch { /* non-blocking */ }
}

// ── Budget 80% alert — one email per threshold per month ──────────
const ALERT_THRESHOLD = 0.80;
const budgetAlertKey  = () => `budget:alert80:${budgetKey().replace("token_budget:", "")}`;

export async function checkAndAlertBudget() {
  if (!MONTHLY_BUDGET) return; // unlimited — nothing to alert
  try {
    const used = (await sessionGet(budgetKey())) ?? 0;
    const pct  = used / MONTHLY_BUDGET;
    if (pct < ALERT_THRESHOLD) return; // under threshold

    // Only alert once per month per threshold crossing
    const alreadyAlerted = await sessionGet(budgetAlertKey());
    if (alreadyAlerted) return;

    const alertEmail = process.env.ERROR_ALERT_EMAIL || process.env.COMPANY_ADMIN_EMAIL;
    const resendKey  = process.env.RESEND_API_KEY;
    if (!alertEmail || !resendKey || process.env.NODE_ENV !== "production") return;

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || "alerts@stellaredu.in",
        to:   alertEmail,
        subject: `[Stellar] Claude token budget at ${Math.round(pct * 100)}%`,
        html: `<p>Monthly Claude token budget is <strong>${Math.round(pct * 100)}%</strong> consumed.</p>
               <p>Used: <strong>${used.toLocaleString()}</strong> / ${MONTHLY_BUDGET.toLocaleString()} tokens</p>
               <p>At current burn rate students may hit the cap before month end. Consider upgrading or throttling.</p>`,
      }),
    });

    // Mark as alerted — TTL until end of month so it re-alerts next month
    await sessionSet(budgetAlertKey(), "1", secondsUntilEndOfMonth());
    logger.warn("Token budget 80% alert sent", { used, budget: MONTHLY_BUDGET, pct: Math.round(pct * 100) });
  } catch (err) {
    logger.error("Budget alert failed", { err: err.message });
  }
}

export async function getTokenBudgetStats() {
  const used = (await sessionGet(budgetKey())) ?? 0;
  return {
    used,
    budget:      MONTHLY_BUDGET || null,
    remaining:   MONTHLY_BUDGET ? Math.max(0, MONTHLY_BUDGET - used) : null,
    percentUsed: MONTHLY_BUDGET ? Math.round((used / MONTHLY_BUDGET) * 100) : null,
    month:       budgetKey().replace("token_budget:", ""),
    unlimited:   !MONTHLY_BUDGET,
  };
}
