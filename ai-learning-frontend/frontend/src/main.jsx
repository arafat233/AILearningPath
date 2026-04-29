import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, useNavigate } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { ClerkProvider } from "@clerk/clerk-react";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const clerkReady = PUBLISHABLE_KEY && !PUBLISHABLE_KEY.startsWith("YOUR_");

function ClerkWrapper({ children }) {
  const navigate = useNavigate();
  if (!clerkReady) return children;

  // Allow Clerk to SPA-navigate TO stage=exchange, but block any navigation
  // AWAY from it. Clerk fires a second routerReplace (afterSignInUrl = "/")
  // immediately after landing on the exchange page, which unmounts the component
  // before our getToken() polling can complete. Blocking it lets the polling
  // loop own the final redirect via window.location.href.
  const clerkNavigate = (to, options = {}) => {
    if (window.location.search.includes("stage=exchange")) return;
    const path = to.startsWith("http")
      ? new URL(to).pathname + new URL(to).search + new URL(to).hash
      : to;
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
