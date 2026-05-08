import { AnalyticsEvent } from "../models/index.js";

/**
 * Fire-and-forget event tracking. Never throws — safe to call anywhere.
 *
 * @param {string} userId
 * @param {string} event   - 'practice_start' | 'explanation_shown' | ...
 * @param {object} meta    - { subject, topicId, ...extra }
 */
export const trackEvent = (userId, event, meta = {}) => {
  const { subject = null, topicId = null, ...metadata } = meta;
  AnalyticsEvent.create({ userId, event, subject, topicId, metadata }).catch(() => {});
};
