import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

let _cached = null; // module-level cache — one fetch per page load

export function useFeatureFlags() {
  const [flags,   setFlags]   = useState(_cached || {});
  const [loading, setLoading] = useState(!_cached);

  useEffect(() => {
    if (_cached) return;
    axios.get(`${BASE_URL}/flags`, { withCredentials: true })
      .then(({ data }) => {
        _cached = data.data;
        setFlags(_cached);
      })
      .catch(() => { /* silently fall back to defaults (all false) */ })
      .finally(() => setLoading(false));
  }, []);

  /** Returns true if the flag is enabled (false when still loading). */
  const isEnabled = (name) => Boolean(flags[name]);

  return { flags, isEnabled, loading };
}
