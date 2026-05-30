import { lazy, Suspense } from "react";

// Lazy-load MathText (+ KaTeX library) only when needed
// Falls back to plain text while loading
const MathText = lazy(() => import("./MathText"));

export default function MathTextLazy({ text, className = "" }) {
  if (!text) return null;
  return (
    <Suspense fallback={<span className={className}>{text}</span>}>
      <MathText text={text} className={className} />
    </Suspense>
  );
}
