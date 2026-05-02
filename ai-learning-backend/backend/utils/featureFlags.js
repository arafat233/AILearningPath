/**
 * Feature flag system.
 *
 * Flags are defined here with defaults. Override any flag at runtime by setting
 * a matching env var: FLAG_<UPPER_NAME>=true|false
 *
 * Example: FLAG_NPS_SURVEY=false disables the NPS survey without a deploy.
 *
 * Flags can also be user-targeted by passing a user object to isEnabled():
 *   isEnabled("beta_voice_v2", { id: "abc", role: "admin" }) → true for admins
 */

const FLAGS = {
  // Feature flags
  nps_survey:           { default: true,  description: "Show NPS survey banner after 5 attempts" },
  coupon_codes:         { default: true,  description: "Enable coupon/discount code redemption"  },
  voice_tutor:          { default: true,  description: "Show Voice Tutor in sidebar nav"         },
  competition_rooms:    { default: true,  description: "Enable live competition rooms"            },
  parent_portal:        { default: true,  description: "Enable parent/teacher portal features"   },
  weekly_digest_email:  { default: true,  description: "Send weekly progress email to parents"   },
  push_notifications:   { default: true,  description: "Web Push subscription and delivery"      },
  // Gradual rollout flags (percentage-based — 0-100)
  new_ai_model:         { default: false, rollout: 0,   description: "Use Claude 3.5 for hints (A/B test)" },
  new_practice_ui:      { default: false, rollout: 0,   description: "New practice question card design"   },
};

function envOverride(name) {
  const envKey = `FLAG_${name.toUpperCase()}`;
  const val    = process.env[envKey];
  if (val === undefined) return null;
  return val === "true" || val === "1";
}

/**
 * Returns true if the flag is enabled for the given user (optional).
 * Rollout flags use a deterministic hash of userId so the same user
 * always gets the same experience.
 */
export function isEnabled(name, user = null) {
  const flag = FLAGS[name];
  if (!flag) return false;

  const override = envOverride(name);
  if (override !== null) return override;

  if (flag.rollout !== undefined) {
    if (!user?.id) return flag.default;
    // Deterministic bucket: sum of char codes mod 100
    const bucket = [...user.id].reduce((s, c) => s + c.charCodeAt(0), 0) % 100;
    return bucket < flag.rollout;
  }

  return flag.default;
}

/** Returns the full flag map for a given user (used by the /flags endpoint). */
export function getFlagsForUser(user = null) {
  return Object.fromEntries(
    Object.entries(FLAGS).map(([name, flag]) => [name, isEnabled(name, user)])
  );
}

export { FLAGS };
