import { ipKeyGenerator } from "express-rate-limit";

// Shared keyGenerator: rate-limit by user id when authed, else by IP.
// ipKeyGenerator normalizes IPv6 to its /56 subnet — without it, IPv6 users
// rotate addresses within their subnet to bypass limits (ERR_ERL_KEY_GEN_IPV6).
export const userOrIpKey = (req) => req.user?.id || ipKeyGenerator(req.ip);
