import { useState, useEffect } from "react";

export default function OfflineBanner() {
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const on  = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener("online",  on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online",  on);
      window.removeEventListener("offline", off);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="sticky top-0 z-50 flex items-center gap-2 px-4 py-2.5
                 bg-yellow-50 border-b border-yellow-200
                 dark:bg-yellow-900/30 dark:border-yellow-700/40"
    >
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
           strokeLinecap="round" strokeLinejoin="round"
           className="w-3.5 h-3.5 shrink-0 text-yellow-600 dark:text-yellow-400">
        <path d="M8 2l6 12H2L8 2z"/>
        <path d="M8 7v3M8 11.5v.5"/>
      </svg>
      <p className="text-[13px] text-yellow-800 dark:text-yellow-200">
        You're offline — lessons, topics and analytics are available from cache.
        Changes won't save until you reconnect.
      </p>
    </div>
  );
}
