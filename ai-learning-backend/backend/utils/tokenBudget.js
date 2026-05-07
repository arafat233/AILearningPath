// Monthly token budget guard — backed by Redis.
// Set MONTHLY_TOKEN_BUDGET in env (e.g. 10000000 = 10M tokens ≈ $25/mo for Haiku).
// Leave unset or 0 to disable the cap entirely.
import { incrBy, sessionGet } from "./redisClient.js";
import logger from "./logger.js";

const MONTHLY_BUDGET = parseInt(process.env.MONTHLY_TOKEN_BUDGET || "0", 10);

const budgetKey = () => {
  const d = new Date();
  return `token_budget:${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
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
