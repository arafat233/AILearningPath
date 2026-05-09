import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listLessons, getRevisionDue, listNcertChapters, listNcertTopics } from "../services/api";
import { useAuthStore } from "../store/authStore";
import { LessonsSkeleton } from "../components/Skeleton";

// ── constants ──────────────────────────────────────────────────────
const SUBJECTS = [
  { id: "Math",          label: "Maths",   color: "#007AFF" },
  { id: "Science",       label: "Science", color: "#34C759" },
  { id: "English",       label: "English", color: "#FF9500" },
  { id: "Social Science",label: "Social",  color: "#AF52DE" },
  { id: "Hindi",         label: "Hindi",   color: "#FF3B30" },
];

const SCIENCE_SUBS = {
  Physics:   ["Light — Reflection and Refraction","Human Eye and Colourful World","Electricity","Magnetic Effects of Electric Current","Sources of Energy"],
  Chemistry: ["Chemical Reactions and Equations","Acids, Bases and Salts","Metals and Non-metals","Carbon and Its Compounds","Periodic Classification of Elements"],
  Biology:   ["Life Processes","Control and Coordination","How Do Organisms Reproduce","Heredity and Evolution","Our Environment","Sustainable Management of Natural Resources"],
};

// NCERT content was imported with "Mathematics", user model uses "Math"
const ncertSubject = (s) => (s === "Math" ? "Mathematics" : s);

const SCIENCE_CHAPTER_TITLES = {
  1: "Chemical Reactions and Equations",
  2: "Acids, Bases and Salts",
  3: "Metals and Non-metals",
  4: "Carbon and its Compounds",
  5: "Life Processes",
  6: "Control and Coordination",
  7: "How do Organisms Reproduce?",
  8: "Heredity",
  9: "Light — Reflection and Refraction",
  10: "The Human Eye and the Colourful World",
  11: "Electricity",
  12: "Magnetic Effects of Electric Current",
  13: "Our Environment",
};

const SST_CHAPTER_TITLES = {
  1:  "The Rise of Nationalism in Europe",
  2:  "Nationalism in India",
  3:  "The Making of a Global World",
  4:  "The Age of Industrialisation",
  5:  "Print Culture and the Modern World",
  6:  "Resources and Development",
  7:  "Forest and Wildlife Resources",
  8:  "Water Resources",
  9:  "Agriculture",
  10: "Minerals and Energy Resources",
  11: "Manufacturing Industries",
  12: "Lifelines of National Economy",
  13: "Development",
  14: "Sectors of the Indian Economy",
  15: "Money and Credit",
  16: "Globalisation and the Indian Economy",
  17: "Consumer Rights",
  18: "Power Sharing",
  19: "Federalism",
  20: "Democracy and Diversity",
  21: "Gender, Religion and Caste",
  22: "Popular Struggles and Movements",
};

const SCI_SUB_CHAPTERS = { Physics: [9,10,11,12], Chemistry: [1,2,3,4], Biology: [5,6,7,8,13] };

const SST_SUBS = {
  History:             [1,2,3,4,5],
  Geography:           [6,7,8,9,10,11,12],
  Economics:           [13,14,15,16,17],
  "Political Science": [18,19,20,21,22],
};
const SST_COLORS = { History: "#FF3B30", Geography: "#34C759", Economics: "#007AFF", "Political Science": "#FF9500" };

// ── sub-components ─────────────────────────────────────────────────
function SubjectBar({ active, onSelect }) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {SUBJECTS.map(({ id, label, color }) => (
        <button
          key={id}
          onClick={() => onSelect(id)}
          className="px-4 py-2 rounded-xl text-[13px] font-semibold transition-all"
          style={
            active === id
              ? { background: color, color: "#fff" }
              : { background: color + "14", color }
          }
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function ScienceSubBar({ active, onSelect }) {
  return (
    <div className="flex gap-1.5">
      {["All", "Physics", "Chemistry", "Biology"].map((s) => (
        <button
          key={s}
          onClick={() => onSelect(s === "All" ? null : s)}
          className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all border ${
            (s === "All" && !active) || active === s
              ? "bg-[#34C759] text-white border-[#34C759]"
              : "bg-[#34C759]/10 text-[#34C759] border-[#34C759]/20 hover:border-[#34C759]/50"
          }`}
        >
          {s}
        </button>
      ))}
    </div>
  );
}

function SstSubBar({ active, onSelect }) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {["All", "History", "Geography", "Economics", "Political Science"].map((s) => {
        const color = SST_COLORS[s] || "#AF52DE";
        const isActive = (s === "All" && !active) || active === s;
        return (
          <button
            key={s}
            onClick={() => onSelect(s === "All" ? null : s)}
            className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all border"
            style={isActive
              ? { background: color, color: "#fff", borderColor: color }
              : { background: color + "18", color, borderColor: color + "30" }
            }
          >
            {s}
          </button>
        );
      })}
    </div>
  );
}

const ChapterCard = memo(function ChapterCard({ ch, subjectColor, onChapter, onPractice }) {
  const topicCount = ch.subchapters?.reduce(
    (s, sc) => s + sc.concepts?.reduce((cs, c) => cs + (c.topics?.length ?? 0), 0), 0
  ) ?? 0;
  return (
    <div
      onClick={onChapter}
      className="card p-4 flex items-center gap-4 cursor-pointer hover:shadow-apple-md transition-[box-shadow,transform] active:scale-[0.99] group"
    >
      <div className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold shrink-0"
        style={{ background: subjectColor + "18", color: subjectColor }}>
        {ch.number}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-[var(--label)] truncate group-hover:text-apple-blue transition-colors">
          {ch.title}
        </p>
        <p className="text-[12px] text-apple-gray mt-0.5">
          {ch.subchapters?.length ?? 0} sections · {topicCount} topics
        </p>
      </div>
      <div className="shrink-0 flex items-center gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); onPractice(); }}
          className="btn-secondary text-[12px] py-1.5 px-3 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Practice
        </button>
        <span className="text-apple-gray3 text-[18px] group-hover:text-apple-blue transition-colors">›</span>
      </div>
    </div>
  );
});

const LessonCard = memo(function LessonCard({ lesson, isDue, onLearn, onPractice }) {
  return (
    <div className={`card p-5 flex items-center justify-between gap-4 transition-[box-shadow,background-color] ${
      isDue ? "ring-1 ring-apple-orange/30 bg-apple-orange/4" : "hover:shadow-apple-md"
    }`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-[15px] font-semibold text-[var(--label)] truncate">{lesson.title}</p>
          {isDue && (
            <span className="badge bg-apple-orange/10 text-apple-orange text-[11px] shrink-0">Revision due</span>
          )}
        </div>
        <p className="text-[13px] text-apple-gray truncate">{lesson.tagline}</p>
        <p className="text-[11px] text-apple-gray3 mt-1">~{lesson.shortLesson?.estimatedMinutes} min</p>
      </div>
      <div className="flex gap-2 shrink-0">
        <button onClick={onLearn} className="btn-primary text-[13px] py-2 px-4">Learn →</button>
        <button onClick={onPractice} className="btn-secondary text-[13px] py-2 px-4">Practice</button>
      </div>
    </div>
  );
});

function TopicsChapterCard({ chapterNumber, topics, onTopic, onPractice, color = "#34C759", titleMap = {} }) {
  const [expanded, setExpanded] = useState(false);
  const title = titleMap[chapterNumber] || `Chapter ${chapterNumber}`;
  return (
    <div className="card overflow-hidden">
      <div
        onClick={() => setExpanded((v) => !v)}
        className="p-4 flex items-center gap-4 cursor-pointer hover:bg-apple-gray6/50 transition-colors group"
      >
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold shrink-0"
          style={{ background: color + "18", color }}>
          {chapterNumber}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-[var(--label)] group-hover:text-apple-blue transition-colors">
            {title}
          </p>
          <p className="text-[12px] text-apple-gray mt-0.5">{topics.length} topic{topics.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onPractice(); }}
            className="btn-secondary text-[12px] py-1.5 px-3 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Practice
          </button>
          <span className={`text-apple-gray3 text-[18px] transition-transform duration-200 ${expanded ? "rotate-90" : ""}`}>›</span>
        </div>
      </div>
      {expanded && (
        <div className="border-t border-apple-gray5 divide-y divide-apple-gray5">
          {topics.map((t) => (
            <button
              key={t.topicId}
              onClick={() => onTopic(t.topicId)}
              className="w-full text-left px-5 py-3 flex items-center gap-3 hover:bg-apple-gray6/40 transition-colors group"
            >
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
              <span className="text-[13px] text-[var(--label)] group-hover:text-apple-blue flex-1">{t.name}</span>
              <span className="text-[12px] text-apple-gray3 shrink-0 group-hover:text-apple-blue">Study →</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const ScienceChapterCard = (props) => (
  <TopicsChapterCard {...props} color="#34C759" titleMap={SCIENCE_CHAPTER_TITLES} />
);

// ── main page ──────────────────────────────────────────────────────
export default function Lessons() {
  const { user }  = useAuthStore();
  const navigate  = useNavigate();
  const grade     = user?.grade || "10";

  const goToPractice = useCallback((topic) => navigate("/practice", { state: { topic } }), [navigate]);
  const goToLearn    = useCallback((topic) => navigate(`/lessons/${encodeURIComponent(topic)}?mode=short`), [navigate]);
  const goToChapter  = useCallback((chapterId) => navigate(`/ncert/chapters/${chapterId}`), [navigate]);

  const [activeSubject, setActiveSubject] = useState(user?.subject || "Math");
  const [scienceSub,    setScienceSub]    = useState(null);
  const [sstSub,        setSstSub]        = useState(null);
  const [contentTab,    setContentTab]    = useState("curriculum");

  const [chapters,    setChapters]    = useState([]);
  const [lessons,     setLessons]     = useState([]);
  const [revisionDue, setRevisionDue] = useState([]);
  const [sciTopics,   setSciTopics]   = useState([]);
  const [sstTopics,   setSstTopics]   = useState([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    setLoading(true);
    setScienceSub(null);
    setSstSub(null);
    Promise.all([
      listLessons(activeSubject, grade).catch(() => ({ data: [] })),
      getRevisionDue().catch(() => ({ data: [] })),
      listNcertChapters(ncertSubject(activeSubject), grade).catch(() => ({ data: [] })),
      activeSubject === "Science"
        ? listNcertTopics(undefined, "Science").catch(() => ({ data: { data: [] } }))
        : Promise.resolve({ data: { data: [] } }),
      activeSubject === "Social Science"
        ? listNcertTopics(undefined, "Social Science").catch(() => ({ data: { data: [] } }))
        : Promise.resolve({ data: { data: [] } }),
    ]).then(([l, r, c, st, sst]) => {
      setLessons(l.data);
      setRevisionDue(r.data);
      setChapters(c.data?.data ?? []);
      setSciTopics(st.data?.data ?? []);
      setSstTopics(sst.data?.data ?? []);
    }).finally(() => setLoading(false));
  }, [activeSubject, grade]);

  const sciChapterGroups = useMemo(() => {
    const groups = {};
    sciTopics.forEach((t) => {
      if (!groups[t.chapterNumber]) groups[t.chapterNumber] = [];
      groups[t.chapterNumber].push(t);
    });
    return Object.keys(groups)
      .map((n) => ({ chapterNumber: Number(n), topics: groups[n] }))
      .sort((a, b) => a.chapterNumber - b.chapterNumber);
  }, [sciTopics]);

  const sstChapterGroups = useMemo(() => {
    const groups = {};
    sstTopics.forEach((t) => {
      if (!groups[t.chapterNumber]) groups[t.chapterNumber] = [];
      groups[t.chapterNumber].push(t);
    });
    return Object.keys(groups)
      .map((n) => ({ chapterNumber: Number(n), topics: groups[n] }))
      .sort((a, b) => a.chapterNumber - b.chapterNumber);
  }, [sstTopics]);

  if (loading) return <LessonsSkeleton />;

  const dueTopic = new Set(revisionDue.map((r) => r.topic));

  const visibleChapters = (activeSubject === "Science" && scienceSub)
    ? chapters.filter((ch) => SCIENCE_SUBS[scienceSub]?.some((t) => ch.title?.includes(t) || t.includes(ch.title)))
    : (activeSubject === "Social Science" && sstSub)
    ? chapters.filter((ch) => SST_SUBS[sstSub]?.includes(ch.number))
    : chapters;

  const visibleSciGroups = scienceSub
    ? sciChapterGroups.filter((g) => SCI_SUB_CHAPTERS[scienceSub]?.includes(g.chapterNumber))
    : sciChapterGroups;

  const visibleSstGroups = sstSub
    ? sstChapterGroups.filter((g) => SST_SUBS[sstSub]?.includes(g.chapterNumber))
    : sstChapterGroups;

  const sstChapterColor = (chapterNumber) => {
    const sub = Object.entries(SST_SUBS).find(([, chs]) => chs.includes(chapterNumber))?.[0];
    return SST_COLORS[sub] || "#AF52DE";
  };

  const visibleLessons = (activeSubject === "Science" && scienceSub)
    ? lessons.filter((l) => SCIENCE_SUBS[scienceSub]?.includes(l.topic))
    : (activeSubject === "Social Science" && sstSub)
    ? lessons.filter((l) => SST_SUBS[sstSub]?.includes(l.topic))
    : lessons;

  const subjectColor = SUBJECTS.find((s) => s.id === activeSubject)?.color || "#007AFF";

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-[28px] font-bold text-[var(--label)] tracking-tight">Learn</h1>
        <p className="text-[14px] text-apple-gray mt-0.5">CBSE Class {grade} — select a subject to begin</p>
      </div>

      {/* Subject tabs */}
      <SubjectBar active={activeSubject} onSelect={setActiveSubject} />

      {/* Science sub-subject tabs */}
      {activeSubject === "Science" && (
        <ScienceSubBar active={scienceSub} onSelect={setScienceSub} />
      )}

      {/* SST sub-subject tabs */}
      {activeSubject === "Social Science" && (
        <SstSubBar active={sstSub} onSelect={setSstSub} />
      )}

      {/* Content type tabs */}
      <div className="flex gap-1 p-1 bg-apple-gray6 rounded-apple w-fit">
        {[
          { id: "curriculum",  label: "Textbook Chapters" },
          { id: "ai-lessons",  label: "AI Lessons" },
        ].map((t) => (
          <button key={t.id} onClick={() => setContentTab(t.id)}
            className={`px-4 py-1.5 rounded-[8px] text-[13px] font-medium transition-[background-color,color,box-shadow] ${
              contentTab === t.id
                ? "bg-white text-[var(--label)] shadow-apple-sm"
                : "text-apple-gray hover:text-[var(--label)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-7 h-7 border-2 border-apple-gray5 rounded-full animate-spin"
            style={{ borderTopColor: subjectColor }} />
        </div>
      ) : (
        <>
          {/* ── Textbook Chapters ── */}
          {contentTab === "curriculum" && (
            <div className="space-y-3">
              {activeSubject === "Science" ? (
                visibleSciGroups.length === 0 ? (
                  <div className="card p-10 text-center space-y-2">
                    <p className="text-[28px]">📚</p>
                    <p className="text-[15px] font-semibold text-[var(--label)]">Loading Science chapters…</p>
                    <p className="text-[13px] text-apple-gray">
                      Switch to <strong>AI Lessons</strong> to study now.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    {visibleSciGroups.map((g) => (
                      <ScienceChapterCard
                        key={g.chapterNumber}
                        chapterNumber={g.chapterNumber}
                        topics={g.topics}
                        onTopic={(topicId) => navigate(`/ncert/topics/${topicId}`)}
                        onPractice={() => navigate("/practice", {
                          state: { mixTopics: g.topics.map((t) => t.topicId), autoStart: true },
                        })}
                      />
                    ))}
                  </div>
                )
              ) : activeSubject === "Social Science" ? (
                visibleSstGroups.length === 0 ? (
                  <div className="card p-10 text-center space-y-2">
                    <p className="text-[28px]">📚</p>
                    <p className="text-[15px] font-semibold text-[var(--label)]">Loading Social Science chapters…</p>
                    <p className="text-[13px] text-apple-gray">
                      Switch to <strong>AI Lessons</strong> to study now.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    {visibleSstGroups.map((g) => (
                      <TopicsChapterCard
                        key={g.chapterNumber}
                        chapterNumber={g.chapterNumber}
                        topics={g.topics}
                        color={sstChapterColor(g.chapterNumber)}
                        titleMap={SST_CHAPTER_TITLES}
                        onTopic={(topicId) => navigate(`/ncert/topics/${topicId}`)}
                        onPractice={() => navigate("/practice", {
                          state: { mixTopics: g.topics.map((t) => t.topicId), autoStart: true },
                        })}
                      />
                    ))}
                  </div>
                )
              ) : visibleChapters.length === 0 ? (
                <div className="card p-10 text-center space-y-2">
                  <p className="text-[28px]">📚</p>
                  <p className="text-[15px] font-semibold text-[var(--label)]">
                    {activeSubject} chapters coming soon
                  </p>
                  <p className="text-[13px] text-apple-gray">
                    Textbook chapters for {activeSubject} haven't been imported yet.
                    Switch to <strong>AI Lessons</strong> to study now.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {visibleChapters.map((ch) => (
                    <ChapterCard
                      key={ch._id}
                      ch={ch}
                      subjectColor={subjectColor}
                      onChapter={() => goToChapter(ch.chapterId)}
                      onPractice={() => goToPractice(ch.title)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── AI Lessons ── */}
          {contentTab === "ai-lessons" && (
            <div className="space-y-4">
              {visibleLessons.length > 0 && (
                <div className="bg-apple-blue/6 border border-apple-blue/15 rounded-apple-lg p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[14px] font-semibold text-[var(--label)]">
                      Practice {scienceSub || sstSub || activeSubject} topics
                    </p>
                    <p className="text-[12px] text-apple-gray mt-0.5">
                      {visibleLessons.length} topic{visibleLessons.length > 1 ? "s" : ""} available · random questions from all of them
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/practice", {
                      state: { mixTopics: visibleLessons.map((l) => l.topic), autoStart: true },
                    })}
                    className="shrink-0 px-4 py-2 rounded-apple text-[13px] font-semibold text-white transition-colors"
                    style={{ background: subjectColor }}
                  >
                    Practice All →
                  </button>
                </div>
              )}

              {revisionDue.length > 0 && (
                <div className="bg-apple-orange/8 border border-apple-orange/20 rounded-apple-lg p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span>📅</span>
                    <p className="text-[14px] font-semibold text-apple-orange">
                      {revisionDue.length} topic{revisionDue.length > 1 ? "s" : ""} due for revision
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {revisionDue.map((r) => (
                      <button key={r.topic}
                        onClick={() => navigate(`/lessons/${encodeURIComponent(r.topic)}`)}
                        className={`badge text-[12px] px-3 py-1.5 cursor-pointer font-medium hover:opacity-80 ${
                          r.urgency === "overdue" ? "bg-apple-red/10 text-apple-red" : "bg-apple-orange/10 text-apple-orange"
                        }`}
                      >
                        {r.topic}<span className="ml-1 opacity-60">· {r.urgency}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {visibleLessons.length === 0 ? (
                <div className="card p-10 text-center space-y-2">
                  <p className="text-[28px]">✏️</p>
                  <p className="text-[15px] font-semibold text-[var(--label)]">
                    No AI lessons for {scienceSub || activeSubject} yet
                  </p>
                  <p className="text-[13px] text-apple-gray">
                    AI lessons are being added. Try the <strong>Textbook Chapters</strong> tab or come back soon.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {visibleLessons.map((lesson) => (
                    <LessonCard
                      key={lesson._id}
                      lesson={lesson}
                      isDue={dueTopic.has(lesson.topic)}
                      onLearn={() => goToLearn(lesson.topic)}
                      onPractice={() => goToPractice(lesson.topic)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
