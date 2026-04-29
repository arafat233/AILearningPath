import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { ClerkProvider } from "@clerk/clerk-react";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const clerkReady = PUBLISHABLE_KEY && !PUBLISHABLE_KEY.startsWith("YOUR_");

// ClerkProvider WITHOUT routerPush/routerReplace: Clerk uses window.location.href
// for all internal navigations (full page reloads). Previously we passed
// routerPush/routerReplace so Clerk would use React Router's navigate(), but that
// caused Clerk to silently SPA-navigate away from /clerk-callback?stage=exchange
// (its internal afterSignIn redirect) before our token-exchange polling could complete,
// unmounting the component without showing an error.
function ClerkWrapper({ children }) {
  if (!clerkReady) return children;
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
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
