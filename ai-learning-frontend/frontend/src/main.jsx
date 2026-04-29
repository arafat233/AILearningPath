import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, useNavigate } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { ClerkProvider } from "@clerk/clerk-react";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const clerkReady = PUBLISHABLE_KEY && !PUBLISHABLE_KEY.startsWith("YOUR_");

// Clerk must live inside BrowserRouter so we can pass useNavigate to it.
// Without this, Clerk uses window.location.href (full page reloads) for its
// internal navigations (e.g. redirectUrlComplete), which causes the Clerk session
// to be lost before the stage=exchange page can read isSignedIn.
function ClerkWrapper({ children }) {
  const navigate = useNavigate();
  if (!clerkReady) return children;
  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      routerPush={(to) => navigate(to.startsWith("http") ? new URL(to).pathname + new URL(to).search + new URL(to).hash : to)}
      routerReplace={(to) => navigate(to.startsWith("http") ? new URL(to).pathname + new URL(to).search + new URL(to).hash : to, { replace: true })}
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
