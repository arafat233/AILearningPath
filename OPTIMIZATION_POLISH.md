# Phase 5: Optimization Polish — Fine-Grained Tuning

**Status**: Planning phase  
**Expected Savings**: 15-25 KB gzipped  
**Timeline**: 2-3 hours

---

## Quick Wins (30 min each)

### 1. Route-Level Code Splitting

**Current**: All pages loaded in main bundle  
**Improvement**: Lazy-load dashboard, lessons, profile pages

```javascript
// App.jsx - before
import Dashboard from "./pages/Dashboard";

// App.jsx - after
const Dashboard = lazy(() => import("./pages/Dashboard"));

// Result: -50 KB for school users who only use Practice
```

**Files to Update**:
- Lessons.jsx
- Profile.jsx
- Competition.jsx
- Planner.jsx
- LiveRoom.jsx

### 2. Recharts Library Split

**Current**: All recharts code in Analytics + AnalyticsProView  
**Improvement**: Create separate chunk for chart utilities

```javascript
// chartsUtils.js - new file
export { ResponsiveContainer, LineChart, BarChart } from "recharts";

// Analytics.jsx
const Charts = lazy(() => import("./chartsUtils"));

// Result: -20 KB for users who don't view analytics
```

### 3. Component Tree Optimization

**Issue**: Some components have unnecessary renders

```javascript
// Before: Re-renders on every parent update
function Dashboard() {
  const [data, setData] = useState({});
  return <StudentStats data={data} />; // StudentStats re-renders even if data unchanged
}

// After: Memoize to prevent re-renders
const StudentStats = memo(function StudentStats({ data }) {
  return ...
}, (prev, next) => prev.data === next.data);
```

**Files to Check**:
- Practice.jsx (complex state)
- Dashboard.jsx (nested components)
- Analytics.jsx (data-heavy)

---

## Medium Effort (1-2 hours each)

### 4. Service Worker Precaching

**Current**: Service worker caches on-demand  
**Improvement**: Precache critical chunks on install

```javascript
// sw.js
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) =>
      c.addAll([
        "/assets/index-*.js",        // Main app
        "/assets/Practice-*.js",      // Most used page
        "/api/topics?subject=Math",  // Critical API
      ])
    )
  );
});

// Result: Faster first interaction for returning users
```

### 5. HTTP/2 Push via Link Headers

**Current**: Browser discovers chunks via JavaScript  
**Improvement**: Server pushes critical chunks proactively

```javascript
// nginx.conf
add_header Link "</assets/index-*.js>; rel=preload; as=script" always;
add_header Link "</assets/Practice-*.js>; rel=preload; as=script" always;

// Result: Chunks start downloading before JavaScript executes
```

### 6. Image Optimization

**Current**: All diagrams are SVG components (inline)  
**Improvement**: Export as static SVG files for CDN delivery

```bash
# Extract DiagramLibrary SVGs to /public/diagrams/*.svg
# Update imports to use <img /> instead of components
# CDN can compress and cache separately

# Result: -50 KB (SVG in separate files = better compression)
```

---

## Advanced (Research Phase)

### 7. Dynamic Import Metrics

```javascript
// Track which chunks are actually loaded
window.__CHUNK_METRICS__ = {
  diagramLibrary: { loaded: false, loadTime: null },
  mathText: { loaded: false, loadTime: null },
  analyticsPro: { loaded: false, loadTime: null },
};

// Log to analytics
performance.addEventListener("resourcetiming", (e) => {
  if (e.name.includes("assets/")) {
    console.log("Chunk loaded:", e.name, "Time:", e.duration);
  }
});
```

### 8. Manifest v3 Service Worker

**Current**: Manifest v2 (deprecated by 2024)  
**Future**: Migrate to Service Worker based on Manifest v3

---

## Checklist: Optimization Polish

- [ ] **Route Splitting**: Lazy-load Dashboard, Lessons, Profile, Competition, Planner, LiveRoom
- [ ] **Recharts Split**: Separate chart utilities into own chunk
- [ ] **Component Memoization**: Wrap expensive components with React.memo()
- [ ] **Service Worker Precaching**: Precache critical chunks on install
- [ ] **HTTP/2 Push**: Configure server to push chunks via Link headers
- [ ] **Image Optimization**: Convert diagram SVGs to static files
- [ ] **Metrics Tracking**: Add chunk load time tracking
- [ ] **Lighthouse Audit**: Run full Lighthouse audit
- [ ] **Load Testing**: Test bundle size under various network conditions

---

## Expected Final Metrics

After Phase 1-5:

| Metric | Baseline | After Phase 5 | Savings |
|--------|----------|---------------|---------|
| Main bundle | 385 KB | 300 KB | -85 KB |
| DiagramLibrary | Inline (798 KB NcertTopicView) | 111 KB (CDN) | -687 KB for non-Science |
| Analytics | 445 KB | 436 KB | -9 KB |
| MathText | Inline | 78 KB (lazy) | -183 KB for non-math users |
| **Total Gzipped** | 600 KB | **480 KB** | **-120 KB (20%)** ✅ |

---

## Deployment Strategy

1. **Phase 4**: Deploy CDN infrastructure
2. **Phase 5.1**: Route splitting (low risk)
3. **Phase 5.2**: Service worker precaching (low risk)
4. **Phase 5.3**: Component memoization (medium risk, test thoroughly)
5. **Phase 5.4**: HTTP/2 push (infrastructure, coordinate with DevOps)
6. **Phase 5.5**: Image optimization (requires refactoring diagrams)

---

## Monitoring Post-Deployment

```bash
# Monitor bundle size in CI
npm run analyze

# Monitor Real User Metrics (RUM)
# Track: Core Web Vitals, Time to Interactive, Largest Contentful Paint

# Set alerts for regressions
# If main bundle > 320 KB, block merge
```

---

## References

- [Webpack Code Splitting Docs](https://webpack.js.org/guides/code-splitting/)
- [Chrome DevTools Performance Guide](https://developer.chrome.com/docs/devtools/performance/)
- [Service Worker Precaching](https://web.dev/service-worker-caching-strategies/)
- [HTTP/2 Server Push](https://web.dev/performance-http2/)

---

## Sign-Off

**Phase 4-5 planned and documented.**  
Ready for execution in next sprint.

**Decision Point**: Before Phase 5, decide:
1. Do route splitting (quick wins, safe)
2. Do full optimization polish (aggressive, requires testing)
3. Defer to next sprint (focus on content instead)
