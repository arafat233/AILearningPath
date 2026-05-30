import { lazy, Suspense } from "react";

const DiagramLibraryModule = lazy(() => import("./DiagramLibrary").then((m) => ({ default: m.Diagram })));

export function DiagramLazy({ topicId }) {
  return (
    <Suspense fallback={<div className="h-[300px] bg-apple-gray6 rounded-xl animate-pulse" />}>
      <DiagramLibraryModule topicId={topicId} />
    </Suspense>
  );
}
