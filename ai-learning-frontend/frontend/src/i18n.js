// Minimal Hindi UI strings for locale="hi" users. No i18n library — the
// sidebar is translated server-side (navService); this covers the handful of
// high-traffic client strings. Add keys as screens get translated.
const HI = {
  "Begin plan":        "प्लान शुरू करें",
  "+ Commit to today": "+ आज का लक्ष्य चुनें",
  "Jump back in":      "जहाँ छोड़ा था वहीं से",
  "Start":             "शुरू करें",
  "Continue":          "जारी रखें",
  "Retry now":         "फिर से कोशिश करें",
  "Mistake Notebook":  "गलतियों की कॉपी",
  "Career Path":       "करियर पथ",
};

// t("Begin plan", user?.locale) → Hindi when locale is "hi", else unchanged.
export const t = (s, locale) => (locale === "hi" && HI[s]) || s;
