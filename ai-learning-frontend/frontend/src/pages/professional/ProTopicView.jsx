/**
 * ProTopicView — /pro/:trackSlug/:moduleId/:topicId
 *
 * Renders the teaching content for one ProTopic and the list of exercises
 * underneath. Source JSON is freeform (Schema.Types.Mixed) so we render
 * defensively — known shapes get dedicated components, unknown shapes
 * fall back to a recursive renderer (never raw JSON dump).
 *
 * Known shapes:
 *   hook                              { real_world_problem, what_you_will_build }
 *   teaching.concept_explanation      { intro, why_it_matters, analogy }
 *   teaching.syntax_breakdown         { code, annotations[{code_part, explanation}] }
 *   teaching.visual_aid               { type, description, alt_text }
 *   commonGaps[]                      { gap_id, what_students_get_wrong, remediation, detection_pattern }
 *   industryApplications              { ... } — recursive fallback
 *   interviewRelevance                { ... } — recursive fallback
 */
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { proGetTopic, proListExercises, proToggleTopicBookmark, proListBookmarks, proRecordReveal, proGetProject, proGetProgress } from "../../services/api";
import PatternDrill from "../../components/pro/PatternDrill";
import TopicDiscussion from "../../components/pro/TopicDiscussion";

// Lazy-loaded so the SyntaxHighlighter + Prism payload doesn't bloat the
// initial route bundle. The fallback below is a plain <pre> while loading.
const JavaCode = lazy(() => import("../../components/pro/JavaCode.jsx"));

// Lazy-loaded — VisualizerShell pulls in framer-motion + Monaco + step
// generators (~few hundred KB combined). Only the topics that actually
// set `topic.visualizer.kind` ever touch this bundle.
const VisualizerShell = lazy(() => import("../../components/dsa/VisualizerShell.jsx"));

// ─── Generic recursive renderer (no more JSON dumps) ──────────────────────────
function prettyKey(k) {
  return k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function GenericBlock({ value, depth = 0 }) {
  if (value == null || value === "") return null;
  if (typeof value === "string") {
    return <p className="text-[14px] text-[var(--label)] leading-relaxed whitespace-pre-wrap">{value}</p>;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return <p className="text-[14px] text-[var(--label)]">{String(value)}</p>;
  }
  if (Array.isArray(value)) {
    // Arrays of strings → bullets; arrays of objects → stacked cards
    if (value.every((v) => typeof v === "string")) {
      return (
        <ul className="space-y-1.5 list-disc pl-5">
          {value.map((b, i) => <li key={i} className="text-[14px] text-[var(--label)] leading-relaxed">{b}</li>)}
        </ul>
      );
    }
    return (
      <div className="space-y-3">
        {value.map((item, i) => (
          <div key={i} className={depth > 0 ? "border-l-2 border-[var(--separator)] pl-4" : "card p-4"}>
            <GenericBlock value={item} depth={depth + 1} />
          </div>
        ))}
      </div>
    );
  }
  // Object: render each key with its label + recurse
  return (
    <div className="space-y-4">
      {Object.entries(value).map(([k, v]) => (
        <div key={k}>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-apple-gray mb-1.5">
            {prettyKey(k)}
          </p>
          <GenericBlock value={v} depth={depth + 1} />
        </div>
      ))}
    </div>
  );
}

// ─── Shape-aware renderers ────────────────────────────────────────────────────

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
      }}
      className="absolute top-2 right-2 text-[11px] font-semibold px-2.5 py-1 rounded-md bg-[var(--fill)] hover:bg-apple-blue hover:text-white text-apple-gray transition-colors"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function CodeBlock({ code, language = "java" }) {
  return (
    <div className="relative rounded-xl overflow-hidden border border-[var(--separator)] bg-[#1e1e1e]">
      <CopyButton text={code} />
      <Suspense fallback={
        <pre className="p-4 pr-16 text-[13px] text-[#d4d4d4] overflow-x-auto"><code>{code}</code></pre>
      }>
        <JavaCode code={code} language={language} />
      </Suspense>
    </div>
  );
}

// Detects any teaching sub-block that should be rendered as a code+annotations
// section. Used by the page to discover blocks like `syntax_breakdown` AND
// future content authors' additions (e.g. `print_vs_println`) without code
// changes — just author content with `{code, annotations[]}` and it renders.
function isSyntaxLikeBlock(block) {
  return block && typeof block === "object"
    && typeof block.code === "string"
    && Array.isArray(block.annotations);
}

function SyntaxBreakdown({ block }) {
  if (!block?.code) return <GenericBlock value={block} />;
  return (
    <div className="space-y-4">
      {block.intro && (
        <p className="text-[14px] text-[var(--label)] leading-relaxed whitespace-pre-wrap">{block.intro}</p>
      )}
      <CodeBlock code={block.code} />
      {Array.isArray(block.annotations) && block.annotations.length > 0 && (
        <div className="space-y-2.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-apple-gray">Line-by-line</p>
          {block.annotations.map((a, i) => (
            <div key={i} className="card p-4 border-l-4 border-apple-blue">
              <code className="text-[12px] font-mono px-2 py-0.5 bg-[var(--fill)] text-apple-blue rounded inline-block mb-1.5">
                {a.code_part}
              </code>
              <p className="text-[13px] text-[var(--label)] leading-relaxed">{a.explanation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function VisualAid({ block }) {
  if (!block) return null;
  return (
    <div className="card p-5 border-l-4 border-apple-purple bg-apple-purple/5">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-apple-purple/10 flex items-center justify-center shrink-0">
          <span className="text-apple-purple text-[18px]">▦</span>
        </div>
        <div className="flex-1">
          <p className="text-[11px] font-bold tracking-wider uppercase text-apple-purple mb-1">
            {block.type || "Visual aid"}
          </p>
          <p className="text-[14px] text-[var(--label)] leading-relaxed">{block.description}</p>
          {block.alt_text && (
            <p className="text-[12px] text-apple-gray mt-2 italic">Alt: {block.alt_text}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function ConceptExplanation({ block }) {
  if (!block || typeof block !== "object") return <GenericBlock value={block} />;
  const order = ["intro", "why_it_matters", "analogy"];
  const keys = order.filter((k) => block[k]).concat(Object.keys(block).filter((k) => !order.includes(k)));
  const labels = {
    intro:          "The big picture",
    why_it_matters: "Why this matters",
    analogy:        "An analogy",
  };
  const accents = {
    intro:          "border-apple-blue",
    why_it_matters: "border-apple-orange",
    analogy:        "border-apple-green",
  };
  return (
    <div className="space-y-3">
      {keys.map((k) => (
        <div key={k} className={`card p-4 border-l-4 ${accents[k] || "border-[var(--separator)]"}`}>
          <p className="text-[11px] font-bold uppercase tracking-wider text-apple-gray mb-1.5">
            {labels[k] || prettyKey(k)}
          </p>
          <p className="text-[14px] text-[var(--label)] leading-relaxed whitespace-pre-wrap">{block[k]}</p>
        </div>
      ))}
    </div>
  );
}

function CommonGapCard({ gap, index }) {
  return (
    <div className="card p-5 border-l-4 border-apple-orange">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-7 h-7 rounded-full bg-apple-orange/15 flex items-center justify-center text-apple-orange text-[12px] font-bold shrink-0">
          {index + 1}
        </div>
        <p className="text-[14px] font-semibold text-[var(--label)] flex-1">
          {prettyKey(gap.gap_id || `Gap ${index + 1}`)}
        </p>
      </div>
      <div className="space-y-2.5 pl-10">
        {gap.what_students_get_wrong && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-apple-red mb-1">What gets missed</p>
            <p className="text-[13px] text-[var(--label)] leading-relaxed">{gap.what_students_get_wrong}</p>
          </div>
        )}
        {gap.remediation && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-apple-green mb-1">How to fix</p>
            <p className="text-[13px] text-[var(--label)] leading-relaxed">{gap.remediation}</p>
          </div>
        )}
        {gap.detection_pattern && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-apple-gray mb-1">Detection</p>
            <p className="text-[12px] text-apple-gray italic leading-relaxed">{gap.detection_pattern}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function HookBlock({ block }) {
  if (!block) return null;
  const cards = [
    { key: "real_world_problem", label: "Real-world problem", icon: "🌍", accent: "border-apple-blue" },
    { key: "what_you_will_build", label: "What you'll build",  icon: "🛠", accent: "border-apple-green" },
  ].filter((c) => block[c.key]);
  // Render known keys as styled cards, plus any extra keys via GenericBlock.
  const extraKeys = Object.keys(block).filter((k) => !cards.find((c) => c.key === k));
  return (
    <div className="space-y-3">
      <div className="grid md:grid-cols-2 gap-3">
        {cards.map((c) => (
          <div key={c.key} className={`card p-5 border-l-4 ${c.accent}`}>
            <p className="text-[11px] font-bold uppercase tracking-wider text-apple-gray mb-1.5">{c.label}</p>
            <p className="text-[14px] text-[var(--label)] leading-relaxed whitespace-pre-wrap">{block[c.key]}</p>
          </div>
        ))}
      </div>
      {extraKeys.length > 0 && (
        <div className="card p-4 space-y-3">
          {extraKeys.map((k) => (
            <div key={k}>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-apple-gray mb-1">{prettyKey(k)}</p>
              <GenericBlock value={block[k]} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Section nav (sticky, smooth-scroll) ──────────────────────────────────────
function SectionNav({ items }) {
  return (
    <nav className="sticky top-0 z-10 -mx-1 px-1 py-2 backdrop-blur bg-[var(--bg)]/85 border-b border-[var(--separator)] mb-4">
      <ul className="flex gap-1.5 overflow-x-auto no-scrollbar text-[12px] font-semibold">
        {items.map((it) => (
          <li key={it.id} className="shrink-0">
            <a
              href={`#${it.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(it.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="inline-block px-3 py-1.5 rounded-full text-apple-gray hover:bg-apple-blue hover:text-white transition-colors"
            >
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function SectionHeading({ id, eyebrow, title }) {
  return (
    <header id={id} className="scroll-mt-20">
      {eyebrow && (
        <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#8e8e93] mb-1">{eyebrow}</p>
      )}
      <h2 className="text-[20px] font-bold tracking-tight text-[var(--label)]">{title}</h2>
    </header>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProTopicView() {
  const { trackSlug, moduleId, topicId } = useParams();
  const [project,  setProject]  = useState(null);
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [doneSet, setDoneSet] = useState(() => new Set()); // completed exerciseIds (Solved badge)
  const [error, setError] = useState("");
  const [bookmarked, setBookmarked]     = useState(false);
  const [bookmarkBusy, setBookmarkBusy] = useState(false);
  const [drillOpen, setDrillOpen] = useState(false);
  // Problem-first reveal (ROADMAP G): persist per-topic so a returning learner
  // isn't re-gated after they've already revealed the approach.
  const [revealed, setRevealed] = useState(() => {
    try { return localStorage.getItem(`stellar_pro_revealed_${topicId}`) === "1"; } catch { return false; }
  });

  const handleReveal = () => {
    setRevealed(true);
    try { localStorage.setItem(`stellar_pro_revealed_${topicId}`, "1"); } catch {}
    proRecordReveal(topicId).catch(() => {}); // fire-and-forget telemetry
  };

  useEffect(() => {
    // Kick off the visualizer bundle download immediately — in parallel with
    // the topic API call — so it's ready by the time topic.visualizer.kind arrives.
    import("../../components/dsa/VisualizerShell.jsx").catch(() => {});

    Promise.all([
      proGetTopic(topicId),
      proListExercises(topicId).catch(() => ({ data: { data: [] } })),
      proGetProject(`${topicId}_proj`).catch(() => null),
    ])
      .then(([t, ex, proj]) => {
        setTopic(t.data?.data);
        setExercises(ex.data?.data || []);
        if (proj?.data?.data) setProject(proj.data.data);
        const tk = t.data?.data?.trackKey;
        if (tk) proGetProgress(tk)
          .then((p) => setDoneSet(new Set(p.data?.data?.completedExercises || [])))
          .catch(() => {});
      })
      .catch((err) => setError(err?.response?.data?.error || "Could not load topic."));
    proListBookmarks().then((r) => {
      const list = r.data?.data || [];
      setBookmarked(list.some((b) => b.kind === "topic" && b.refId === topicId));
    }).catch(() => {});
  }, [topicId]);

  const handleBookmarkToggle = async () => {
    setBookmarkBusy(true);
    try {
      const r = await proToggleTopicBookmark(topicId);
      setBookmarked(!!r.data?.data?.bookmarked);
    } catch (err) {
      console.warn("Topic bookmark toggle failed:", err?.response?.data?.error || err.message);
    } finally {
      setBookmarkBusy(false);
    }
  };

  // Auto-discover every code+annotations teaching sub-block (syntax_breakdown,
  // print_vs_println, future ones). They render identically and each gets its
  // own nav entry + section heading derived from the key name.
  const syntaxBlocks = useMemo(() => {
    if (!topic?.teaching) return [];
    return Object.entries(topic.teaching)
      .filter(([_, v]) => isSyntaxLikeBlock(v))
      .map(([k, v]) => ({ key: k, block: v }));
  }, [topic]);

  const navItems = useMemo(() => {
    if (!topic) return [];
    const items = [];
    if (topic.hook && Object.keys(topic.hook).length) items.push({ id: "sec-hook", label: "Hook" });
    if (topic.teaching?.concept_explanation) items.push({ id: "sec-concept", label: "Concept" });
    // Nav entry per syntax-like teaching block.
    for (const { key } of syntaxBlocks) {
      items.push({ id: `sec-${key}`, label: prettyKey(key) });
    }
    if (topic.teaching?.visual_aid) items.push({ id: "sec-visual", label: "Visual" });
    // Interactive widget (sorting sandbox, binary search animator, etc.)
    if (topic.visualizer?.kind) items.push({ id: "sec-visualizer", label: "Visualize" });
    if (topic.commonGaps && (Array.isArray(topic.commonGaps) ? topic.commonGaps.length : Object.keys(topic.commonGaps).length)) {
      items.push({ id: "sec-gaps", label: "Common gaps" });
    }
    if (topic.industryApplications && Object.keys(topic.industryApplications).length) items.push({ id: "sec-industry", label: "Industry" });
    if (topic.interviewRelevance && Object.keys(topic.interviewRelevance).length)     items.push({ id: "sec-interview", label: "Interview" });
    items.push({ id: "sec-exercises", label: `Exercises (${exercises.length})` });
    items.push({ id: "sec-discussion", label: "Discussion" });
    return items;
  }, [topic, exercises.length, syntaxBlocks]);

  if (error) {
    return (
      <div className="card p-8 text-center max-w-md mx-auto">
        <p className="text-[15px] font-semibold text-apple-red">{error}</p>
        <button onClick={() => navigate(`/pro/${trackSlug}/${moduleId}`)} className="btn-secondary text-[13px] mt-4">
          ← Back to module
        </button>
      </div>
    );
  }
  if (!topic) return <div className="text-[13px] text-apple-gray">Loading…</div>;

  // Pull teaching sub-blocks out for shape-aware rendering. Anything that
  // isn't a known shape AND isn't a code+annotations block falls through to
  // GenericBlock below.
  const t = topic.teaching || {};
  const syntaxKeys     = new Set(syntaxBlocks.map((s) => s.key));
  const teachingKnown  = new Set(["concept_explanation", "visual_aid", ...syntaxKeys]);
  const teachingExtras = Object.fromEntries(Object.entries(t).filter(([k]) => !teachingKnown.has(k)));
  const commonGaps = Array.isArray(topic.commonGaps)
    ? topic.commonGaps
    : (topic.commonGaps && typeof topic.commonGaps === "object" ? Object.values(topic.commonGaps) : []);

  // Problem-first reveal (ROADMAP G): when gated, mask the name, hide teaching
  // sections behind a Reveal button, and trim the nav to Hook + Exercises.
  const gated           = topic.revealStrategy === "first_attempt" && !revealed;
  const teachingVisible = !gated;
  const displayTitle    = gated ? (topic.problemTitle || topic.name) : topic.name;
  const visibleNav      = gated ? navItems.filter((i) => i.id === "sec-hook" || i.id === "sec-exercises") : navItems;

  return (
    <div className="space-y-6">
      <button onClick={() => navigate(`/pro/${trackSlug}/${moduleId}`)} className="text-[12px] text-apple-gray hover:text-apple-blue transition-colors">
        ← Back to module
      </button>

      {/* Topic header */}
      <div>
        <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#8e8e93]">Topic {topic.topicNumber}</p>
        <div className="flex items-start justify-between gap-3 mt-1">
          <h1 className="text-[28px] font-bold tracking-tight text-[var(--label)]">{displayTitle}</h1>
          <button
            onClick={handleBookmarkToggle}
            disabled={bookmarkBusy}
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark this topic"}
            title={bookmarked ? "Bookmarked" : "Bookmark for later"}
            className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center hover:bg-apple-gray6 transition-colors disabled:opacity-50"
          >
            <svg viewBox="0 0 16 16" fill={bookmarked ? "currentColor" : "none"}
                 stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                 className={`w-5 h-5 ${bookmarked ? "text-apple-blue" : "text-apple-gray"}`}>
              <path d="M4.5 1.5h7a1 1 0 011 1v12l-4.5-2.8-4.5 2.8v-12a1 1 0 011-1z"/>
            </svg>
          </button>
        </div>
        {topic.metadata?.career_relevance && (
          <p className="text-[14px] text-apple-gray italic mt-2">{topic.metadata.career_relevance}</p>
        )}
        {topic.metadata?.estimated_time_minutes && (
          <p className="text-[12px] text-apple-gray mt-1.5">
            <span className="inline-block px-2 py-0.5 rounded-full bg-[var(--fill)] font-semibold">
              ~{topic.metadata.estimated_time_minutes} min
            </span>
          </p>
        )}
      </div>

      <SectionNav items={visibleNav} />

      {/* Hook */}
      {topic.hook && Object.keys(topic.hook).length > 0 && (
        <section className="space-y-3">
          <SectionHeading id="sec-hook" eyebrow="Why this topic" title="Hook" />
          <HookBlock block={topic.hook} />
        </section>
      )}

      {/* Problem-first reveal gate (ROADMAP G) — shown instead of teaching
          until the learner clicks Reveal. */}
      {gated && (
        <section className="card p-6 border-l-4 border-apple-purple text-center space-y-3">
          <p className="text-[14px] font-bold text-[var(--label)]">Try it first 🧠</p>
          <p className="text-[13px] text-apple-gray max-w-md mx-auto leading-relaxed">
            Read the problem above and attempt the exercises below before seeing the approach.
            Wrestling with it first — even unsuccessfully — is what makes the solution stick.
          </p>
          <button onClick={handleReveal} className="btn-primary text-[13px]">
            🔍 Reveal the approach
          </button>
        </section>
      )}

      {/* Teaching — hidden until revealed when revealStrategy = "first_attempt" */}
      {teachingVisible && (<>
      {t.concept_explanation && (
        <section className="space-y-3">
          <SectionHeading id="sec-concept" eyebrow="Teaching" title="Concept" />
          <ConceptExplanation block={t.concept_explanation} />
        </section>
      )}
      {syntaxBlocks.map(({ key, block }) => (
        <section key={key} className="space-y-3">
          <SectionHeading id={`sec-${key}`} eyebrow="Teaching" title={prettyKey(key)} />
          <SyntaxBreakdown block={block} />
        </section>
      ))}
      {t.visual_aid && (
        <section className="space-y-3">
          <SectionHeading id="sec-visual" eyebrow="Teaching" title="Visual aid" />
          <VisualAid block={t.visual_aid} />
        </section>
      )}
      {/* Unknown teaching keys fall back to generic */}
      {Object.keys(teachingExtras).length > 0 && (
        <section className="space-y-3">
          <SectionHeading id="sec-teaching-extras" eyebrow="Teaching" title="More" />
          <div className="card p-5"><GenericBlock value={teachingExtras} /></div>
        </section>
      )}

      {/* Interactive visualizer — only rendered for topics that set
          topic.visualizer.kind. Lazy-loaded so the framer-motion + Monaco
          payload stays out of the initial route bundle for non-DSA topics. */}
      {topic.visualizer?.kind && (
        <section className="space-y-3">
          <SectionHeading id="sec-visualizer" eyebrow="Interactive" title="Try it yourself" />
          <Suspense fallback={
            <div className="card p-6 text-center text-[13px] text-apple-gray">Loading visualizer…</div>
          }>
            <VisualizerShell kind={topic.visualizer.kind} config={topic.visualizer.config || {}} />
          </Suspense>
        </section>
      )}

      {/* Common gaps */}
      {commonGaps.length > 0 && (
        <section className="space-y-3">
          <SectionHeading id="sec-gaps" eyebrow="Pitfalls" title="Common gaps" />
          <div className="grid md:grid-cols-2 gap-3">
            {commonGaps.map((g, i) => <CommonGapCard key={g.gap_id || i} gap={g} index={i} />)}
          </div>
        </section>
      )}

      {/* Industry & Interview */}
      {topic.industryApplications && Object.keys(topic.industryApplications).length > 0 && (
        <section className="space-y-3">
          <SectionHeading id="sec-industry" eyebrow="In the wild" title="Industry applications" />
          <div className="card p-5"><GenericBlock value={topic.industryApplications} /></div>
        </section>
      )}
      {topic.interviewRelevance && Object.keys(topic.interviewRelevance).length > 0 && (
        <section className="space-y-3">
          <SectionHeading id="sec-interview" eyebrow="Career" title="Interview relevance" />
          <div className="card p-5 border-l-4 border-apple-purple">
            <GenericBlock value={topic.interviewRelevance} />
          </div>
        </section>
      )}
      </>)}

      {/* Exercises */}
      <section className="space-y-3">
        {(() => {
          const drillExercises = exercises.filter((e) => e.type === "pattern_match");
          return drillExercises.length > 0 ? (
            <>
              {drillOpen && (
                <PatternDrill
                  exercises={drillExercises}
                  onClose={() => setDrillOpen(false)}
                />
              )}
            </>
          ) : null;
        })()}
        <div className="flex items-center justify-between">
          <SectionHeading id="sec-exercises" eyebrow="Practice" title={(() => {
            const solved = exercises.filter((e) => doneSet.has(e.exerciseId)).length;
            return solved > 0 ? `Exercises (${solved}/${exercises.length} solved)` : `Exercises (${exercises.length})`;
          })()} />
          {exercises.some((e) => e.type === "pattern_match") && (
            <button
              onClick={() => setDrillOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-apple-purple/10 hover:bg-apple-purple/20 transition-colors text-apple-purple text-[12px] font-semibold"
            >
              ⚡ Pattern Drills ({exercises.filter((e) => e.type === "pattern_match").length})
            </button>
          )}
        </div>
        <div className="flex flex-col gap-2.5">
          {exercises.map((ex) => (
            <button
              key={ex.exerciseId}
              onClick={() => navigate(`/pro/exercise/${ex.exerciseId}`)}
              className="card p-4 text-left hover:shadow-apple-md hover:border-apple-blue transition-all group flex items-center gap-4"
            >
              {doneSet.has(ex.exerciseId) && (
                <span className="text-apple-green text-[15px] shrink-0" title="Solved">✓</span>
              )}
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[var(--fill)] text-apple-gray shrink-0">
                {ex.level}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[var(--label)] truncate group-hover:text-apple-blue transition-colors">
                  {ex.title || ex.exerciseId}
                </p>
                {(ex.priority || ex.pattern || ex.leetcodeId) && (
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    {ex.priority && (
                      <span className={`text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded ${
                        ex.priority === "P1" ? "bg-apple-blue/10 text-apple-blue"
                          : ex.priority === "P2" ? "bg-[var(--fill)] text-apple-gray"
                            : "bg-[var(--fill)] text-apple-gray3"}`}>
                        {ex.priority === "P1" ? "Must-do" : ex.priority}
                      </span>
                    )}
                    {ex.pattern && (
                      <span className="text-[10px] text-apple-gray font-medium px-1.5 py-0.5 rounded bg-[var(--fill)]">{ex.pattern}</span>
                    )}
                    {ex.leetcodeId && (
                      <span className="text-[10px] text-apple-gray3 font-mono">LC #{ex.leetcodeId}</span>
                    )}
                  </div>
                )}
                {ex.scenario && (
                  <p className="text-[12px] text-apple-gray mt-0.5 line-clamp-1">{ex.scenario}</p>
                )}
              </div>
              <span className="text-[11px] text-apple-gray font-medium shrink-0">{ex.xpReward || 0} XP</span>
              <span className="text-apple-gray3 text-[18px] group-hover:text-apple-blue transition-colors">›</span>
            </button>
          ))}
        </div>
      </section>

      {/* Project — shown when topic has one */}
      {project && (
        <section className="space-y-3">
          <SectionHeading eyebrow="Mini-project" title={project.name} />
          <button
            onClick={() => navigate(`/pro/${trackSlug}/${moduleId}/${topicId}/project/${project.projectId}`)}
            className="card w-full p-5 text-left hover:shadow-apple-md hover:border-apple-purple transition-all group flex items-start gap-4"
          >
            <span className="text-[28px] shrink-0">🏗</span>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-bold text-[var(--label)] group-hover:text-apple-purple transition-colors">
                {project.name}
              </p>
              {project.description && (
                <p className="text-[12px] text-apple-gray mt-1 line-clamp-2">{project.description}</p>
              )}
              <p className="text-[11px] text-apple-gray3 mt-1.5">
                {project.requirements?.length ?? 0} requirements · ~{project.estimatedMinutes ?? 30} min
              </p>
            </div>
            <span className="text-apple-gray3 text-[18px] group-hover:text-apple-purple transition-colors shrink-0">›</span>
          </button>
        </section>
      )}

      {/* Community discussion (D5.3) */}
      <div id="sec-discussion" className="scroll-mt-20">
        <TopicDiscussion topicId={topicId} />
      </div>
    </div>
  );
}
