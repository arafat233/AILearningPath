import { useState, useEffect } from "react";
import { getVapidKey, subscribePush, unsubscribePush } from "../services/api";

// Converts a URL-safe base64 VAPID key to the Uint8Array the PushManager needs
function urlBase64ToUint8Array(base64) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

export function usePushNotifications() {
  const supported  = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
  const [subscribed,  setSubscribed]  = useState(false);
  const [permission,  setPermission]  = useState(() => (supported ? Notification.permission : "denied"));
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");

  // Detect existing subscription on mount
  useEffect(() => {
    if (!supported) return;
    navigator.serviceWorker.ready
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => setSubscribed(!!sub))
      .catch(() => {});
  }, [supported]);

  const subscribe = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getVapidKey();
      const vapidKey = data?.data?.key;
      if (!vapidKey) throw new Error("Push notifications not configured on this server.");

      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== "granted") {
        setError("Permission denied. Enable notifications in your browser settings.");
        return;
      }

      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });

      await subscribePush(sub.toJSON());
      setSubscribed(true);
    } catch (err) {
      setError(err.message || "Could not enable notifications.");
    } finally {
      setLoading(false);
    }
  };

  const unsubscribe = async () => {
    setLoading(true);
    setError("");
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) await sub.unsubscribe();
      await unsubscribePush();
      setSubscribed(false);
    } catch (err) {
      setError(err.message || "Could not disable notifications.");
    } finally {
      setLoading(false);
    }
  };

  return { supported, subscribed, permission, loading, error, subscribe, unsubscribe };
}
