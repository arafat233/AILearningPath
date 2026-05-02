function Bone({ className = "" }) {
  return (
    <div
      className={`rounded-apple animate-pulse bg-apple-gray5 dark:bg-apple-gray/20 ${className}`}
    />
  );
}

export function SkeletonCard({ lines = 3, className = "" }) {
  return (
    <div className={`card p-5 space-y-3 ${className}`}>
      <Bone className="h-4 w-1/3" />
      {Array.from({ length: lines }).map((_, i) => (
        <Bone key={i} className={`h-3 ${i === lines - 1 ? "w-2/3" : "w-full"}`} />
      ))}
    </div>
  );
}

export function SkeletonStat({ className = "" }) {
  return (
    <div className={`card p-4 space-y-2 ${className}`}>
      <Bone className="h-3 w-16" />
      <Bone className="h-7 w-12" />
      <Bone className="h-2 w-20" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Bone className="h-7 w-48 mb-1" />
        <Bone className="h-4 w-32" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonStat key={i} />)}
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <SkeletonCard lines={4} />
        <SkeletonCard lines={4} />
      </div>
      <SkeletonCard lines={5} />
    </div>
  );
}

export function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <Bone className="h-7 w-36 mb-1" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonStat key={i} />)}
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <SkeletonCard lines={6} />
        <SkeletonCard lines={6} />
      </div>
      <SkeletonCard lines={4} />
    </div>
  );
}

export function LessonsSkeleton() {
  return (
    <div className="space-y-4">
      <Bone className="h-7 w-40 mb-1" />
      <Bone className="h-10 w-full rounded-apple" />
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="card p-4 flex items-center gap-3">
          <Bone className="w-10 h-10 rounded-apple shrink-0" />
          <div className="flex-1 space-y-2">
            <Bone className="h-4 w-1/2" />
            <Bone className="h-3 w-1/3" />
          </div>
          <Bone className="w-16 h-7 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="card p-6 flex items-center gap-4">
        <Bone className="w-16 h-16 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <Bone className="h-5 w-40" />
          <Bone className="h-3 w-24" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => <SkeletonStat key={i} />)}
      </div>
      <SkeletonCard lines={4} />
    </div>
  );
}
