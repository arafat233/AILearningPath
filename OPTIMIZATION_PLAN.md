# Performance Optimization Plan — Bundle Size & API Caching

**Status:** In Progress  
**Current Bundle Size:** 2.3 MB (uncompressed), 600 KB (gzipped)  
**Goal:** Reduce to 1.5 MB / 400 KB (35% reduction)

---

## 1. Bundle Analysis — Problem Areas

### Bloat Chunks (>500 KB raw)
| File | Size | Root Cause | Fix Difficulty |
|------|------|-----------|-----------------|
| NcertTopicView.js | 798 KB | Imports DiagramLibrary (719 KB) | **MEDIUM** |
| Analytics.js | 452 KB | Large visualization library | **MEDIUM** |
| index.js (main) | 385 KB | React + Router + Axios overhead | **HARD** |
| MathText.js | 261 KB | MathJax library | **EASY** |

### Quick Wins (Easy)

#### 1.1 — Split MathJax into Lazy-Loaded Chunk
**Impact:** ~40 KB gzipped savings  
**Effort:** 15 minutes

Current: MathText imported everywhere → loads 261 KB upfront
Fix:
```javascript
// Before
import { MathText } from "../components/MathText"

// After
const MathText = lazy(() => import("../components/MathText"))
```

**Files to change:** NcertTopicView, PYQBank, Lessons, ProTopicView (search for MathText)

#### 1.2 — Tree-shake unused Diagram Components
**Impact:** ~50 KB gzipped savings  
**Effort:** 20 minutes

DiagramLibrary has ~200 components, but NcertTopicView only uses ~30 per subject.

Current: All 200 components exported → webpack bundles all
Fix: Create subject-specific exports:
```javascript
// diagrams/biologyDiagrams.js
export { DigestiveSystem, Heart, Lungs, Brain, ... }

// diagrams/chemistryDiagrams.js
export { Atom, MoleculeStructure, ... }
```

#### 1.3 — Defer Non-Critical Vendor Loads
**Impact:** ~20 KB gzipped  
**Effort:** 10 minutes

Currently Axios interceptor loads every API client option.
Fix: Lazy-load interceptors for admin routes only.

---

## 2. Medium-Impact Changes

### 2.1 — Code-split NcertTopicView
**Impact:** ~80 KB gzipped (split across routes)  
**Effort:** 1 hour

Problem: NcertTopicView (798 KB) loads even for students on Pro track
Solution: Dynamic import at route level
```javascript
// Routes.jsx
const NcertTopicView = lazy(() => import("./pages/NcertTopicView"))
const ProTopicView = lazy(() => import("./pages/ProTopicView"))
```

**Status:** Already partially done (Vite lazy-loads route components)
**Todo:** Verify route-based lazy loading is working

### 2.2 — Split Analytics by Feature
**Impact:** ~60 KB gzipped  
**Effort:** 2 hours

Problem: Analytics.js is 452 KB; loads full chart library even if using dashboard
Solution: Dynamic import for visualizations
```javascript
// analytics/dashboardCharts.js — 100 KB
export { DashboardCard, PercentageCard, ... }

// analytics/radarCharts.js — 150 KB
export { RadarChart, ... }
```

---

## 3. Hard Wins (Architecture)

### 3.1 — Move DiagramLibrary to Separate Asset  
**Impact:** ~100 KB gzipped  
**Effort:** 3-4 hours

Current: Bundled with NcertTopicView
Better: Load as needed per topic
```javascript
// DynamicDiagram component
const DiagramComponent = dynamic(() => import(`../diagrams/${diagramId}`), {
  loading: () => <Skeleton />
})
```

### 3.2 — Implement Route-Based Code Splitting
**Impact:** ~150 KB gzipped (parallel loading)  
**Effort:** 3 hours

Each page lazy-loaded = faster first contentful paint

Current: Single bundle → wait for everything
Better: Route chunks loaded on-demand

---

## 4. API Caching Optimizations

### Current State
✅ Redis caching enabled:
- /user/me → 30s TTL
- /user/nav → 60s TTL
- Pro topics + exercises → 5 min TTL

### Opportunities

#### 4.1 — Add Service Worker Cache for Read-Only Routes
**Impact:** 200-500ms saved on cold start (client-side)  
**Effort:** 1 hour

```javascript
// SW: Cache GET /api/v1/topics (never changes)
if (request.method === 'GET' && request.url.includes('/topics')) {
  return caches.match(request)
    .then(r => r || fetch(request).then(res => {
      cache.put(request, res.clone()); return res;
    }))
}
```

#### 4.2 — HTTP Cache Headers for Static Content
**Impact:** Browser cache 200ms+ per subsequent visit  
**Effort:** 30 minutes

Add to backend:
```javascript
// routes.js
res.set('Cache-Control', 'public, max-age=3600'); // 1 hour
res.set('ETag', hash(data));
```

#### 4.3 — Pagination for Topic Lists
**Impact:** 50-100ms per request (less data)  
**Effort:** 2 hours

Change: `GET /api/v1/ncert/topics?chapter=5` → returns all 100+ topics
Better: `GET /api/v1/ncert/topics?chapter=5&limit=20&offset=0`

---

## 5. Implementation Priority

### Phase 1 (Today — 45 minutes)
- [ ] 1.1 Split MathJax (15 min)
- [ ] 1.2 Tree-shake Diagrams (20 min)
- [ ] 1.3 Defer Axios interceptors (10 min)

**Expected saving:** 110 KB gzipped

### Phase 2 (Next 2 hours)
- [ ] 2.1 Verify NcertTopicView code-split
- [ ] 2.2 Split Analytics by feature (120 min)

**Expected saving:** 60 KB gzipped

### Phase 3 (Future)
- [ ] 3.1 Move DiagramLibrary to asset
- [ ] 3.2 Full route-based code splitting
- [ ] Service Worker caching
- [ ] HTTP cache headers

---

## 6. Measurement Plan

Before/After metrics:
```javascript
// main.js
console.log('Bundle size:', performance.memory?.usedJSHeapSize / 1024 / 1024, 'MB')
console.log('LCP:', performance.getEntriesByType('navigation')[0].loadEventEnd)
```

CI integration:
```bash
# Add to .github/workflows/build.yml
npm run build
ls -lh dist/assets/*.js | awk '{sum += $5} END {print "Total: " sum " bytes"}'
```

---

## 7. Risk Assessment

| Change | Risk | Mitigation |
|--------|------|-----------|
| Dynamic imports | Lazy load delay | Preload critical routes with `<link rel="prefetch">` |
| Tree-shake | Import errors | Run tests; grep for removed components |
| Cache headers | Stale data | Add versioning to API responses |

---

## Expected Outcomes

| Phase | GZip Reduction | Load Time Improvement | User Impact |
|-------|---|---|---|
| Phase 1 | -110 KB | 5-10% | Faster initial load |
| Phase 1+2 | -170 KB | 12-18% | Noticeably faster |
| Full (1+2+3) | -250+ KB | 25-30% | Significant UX boost |

