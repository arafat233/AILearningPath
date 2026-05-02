// __Host- prefix: forces Secure + Path=/ + no Domain, preventing cookie tossing on subdomains.
// __Secure- prefix: forces Secure only (used where Path must not be /).
// Both prefixes are browser-enforced only under HTTPS, so we omit them in dev.
const IS_PROD = process.env.NODE_ENV === "production";

export const TOKEN_COOKIE   = IS_PROD ? "__Host-token"          : "token";
export const REFRESH_COOKIE = IS_PROD ? "__Secure-refreshToken" : "refreshToken";
export const CSRF_COOKIE    = IS_PROD ? "__Host-csrf"           : "csrf";
