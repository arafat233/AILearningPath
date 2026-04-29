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

  // Block ALL Clerk-initiated navigations while on /clerk-callback.
  // handleRedirectCallback() establishes the Clerk session; our isSignedIn
  // effect in ClerkCallback owns the final redirect via window.location.href.
  // Checking pathname (not search) avoids the window.location sync-timing
  // race that broke the previous stage=exchange guard.
  const clerkNavigate = (to, options = {}) => {
    if (window.location.pathname === "/clerk-callback") return;
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
