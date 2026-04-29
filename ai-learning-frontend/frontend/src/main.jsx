import React, { useRef } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, useNavigate } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { ClerkProvider } from "@clerk/clerk-react";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const clerkReady = PUBLISHABLE_KEY && !PUBLISHABLE_KEY.startsWith("YOUR_");

function ClerkWrapper({ children }) {
  const navigate = useNavigate();
  // Track synchronously — window.location may not update before Clerk fires the
  // second routerReplace (afterSignInUrl) in the same JS tick.
  const arrivedAtExchange = useRef(false);

  if (!clerkReady) return children;

  const clerkNavigate = (to, options = {}) => {
    // Once we've landed on the exchange page, block all further Clerk navigations.
    // Our getToken() polling loop owns the final redirect via window.location.href.
    if (arrivedAtExchange.current) return;

    const path = to.startsWith("http")
      ? new URL(to).pathname + new URL(to).search + new URL(to).hash
      : to;

    if (path.includes("stage=exchange")) {
      arrivedAtExchange.current = true;
    }

    navigate(path, options);
  };

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      routerPush={(to) => clerkNavigate(to)}
      routerReplace={(to) => clerkNavigate(to, { replace: true })}
    >
      {children}
    </ClerkProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ClerkWrapper>
        <App />
      </ClerkWrapper>
    </BrowserRouter>
  </React.StrictMode>
);
