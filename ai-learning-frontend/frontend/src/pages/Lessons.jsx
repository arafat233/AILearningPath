import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listLessons, getRevisionDue, listNcertChapters, listNcertTopics, lessonsV2Dashboard, lessonsV2Search, lessonsV2Diagnostic, lessonsV2CoStudy, getPlan, getStudiedTopics, listAvailableSubjects } from "../services/api";
import { useAuthStore } from "../store/authStore";
import { useActiveProfile } from "../hooks/useActiveProfile";
import { LessonsSkeleton } from "../components/Skeleton";

// ── Mastery dot ─────────────────────────────────────────────────────
const MASTERY_DOT = {
  mastered:    { color: "#34C759", title: "Mastered" },
  in_progress: { color: "#FF9500", title: "In progress" },
  wrong_repeat:{ color: "#FF3B30", title: "Frequently wrong" },
  not_started: { color: "#E5E5EA", title: "Not started" },
};
function MasteryDot({ state, size = 7 }) {
  const m = MASTERY_DOT[state || "not_started"];
  return <span className="rounded-full inline-block shrink-0" title={m.title} style={{ width: size, height: size, background: m.color }} />;
}

const DIFF_LABEL = { easy: "Foundation", medium: "Application", hard: "Tricky" };
const DIFF_COLOR = { easy: "#34C759", medium: "#FF9500", hard: "#FF3B30" };

// ── localStorage helper ─────────────────────────────────────────────
function loadLS(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback; }
  catch { return fallback; }
}

// ── constants ──────────────────────────────────────────────────────
const SUBJECTS = [
  { id: "Math",          label: "Maths",   color: "#007AFF" },
  { id: "Science",       label: "Science", color: "#34C759" },
  { id: "English",       label: "English", color: "#FF9500" },
  { id: "Social Science",label: "Social",  color: "#AF52DE" },
  { id: "Hindi",         label: "Hindi",   color: "#FF3B30" },
];

// Hero display config — long subject name, gradient, badge initial, fallback counts
const SUBJECT_DISPLAY  = { "Math": "Mathematics", "Science": "Science", "English": "English", "Social Science": "Social Science", "Hindi": "Hindi" };
const SUBJECT_INITIAL  = { "Math": "M", "Science": "S", "English": "E", "Social Science": "S", "Hindi": "H" };
const SUBJECT_CH_FALLBACK = { "Math": 15, "Science": 16, "English": 11, "Social Science": 20, "Hindi": 14 };
const SUBJECT_LS_FALLBACK = { "Math": 180, "Science": 200, "English": 120, "Social Science": 220, "Hindi": 150 };
const SUBJECT_GRADIENT = {
  "Math":           "linear-gradient(130deg, #ddd6fe 0%, #fbcfe8 50%, #fde68a 100%)",
  "Science":        "linear-gradient(130deg, #d1fae5 0%, #a7f3d0 50%, #fde68a 100%)",
  "English":        "linear-gradient(130deg, #fed7aa 0%, #fbcfe8 50%, #fef3c7 100%)",
  "Social Science": "linear-gradient(130deg, #ddd6fe 0%, #c4b5fd 50%, #fce7f3 100%)",
  "Hindi":          "linear-gradient(130deg, #fecaca 0%, #fbcfe8 50%, #fef3c7 100%)",
};

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

// CBSE Math chapter titles per grade. Used by MathChapterCard so the chapter card
// shows the proper chapter title (e.g. "Real Numbers") instead of an arbitrary
// sub-topic name picked from the topics array.
const MATH_CHAPTER_TITLES_CBSE = {
  "10": {
    1: "Real Numbers", 2: "Polynomials", 3: "Pair of Linear Equations in Two Variables",
    4: "Quadratic Equations", 5: "Arithmetic Progressions", 6: "Triangles",
    7: "Coordinate Geometry", 8: "Introduction to Trigonometry",
    9: "Some Applications of Trigonometry", 10: "Circles", 11: "Areas Related to Circles",
    12: "Surface Areas and Volumes", 13: "Statistics", 14: "Probability",
  },
  "9": {
    1: "Coordinate Geometry",  2: "Polynomials",
    3: "Number Systems",       4: "Algebraic Identities",
    5: "Circles",              6: "Heron's Formula and Areas",
    7: "Probability",          8: "Sequences and Progressions",
  },
  "8": {
    1: "A Square and A Cube", 2: "Power Play", 3: "A Story of Numbers",
    4: "Quadrilaterals", 5: "Number Play", 6: "We Distribute, Yet Things Multiply",
    7: "Proportional Reasoning - 1", 8: "Fractions in Disguise",
    9: "The Baudhayana-Pythagoras Theorem", 10: "Proportional Reasoning - 2",
    11: "Exploring Some Geometric Themes", 12: "Tales by Dots and Lines",
    13: "Algebra Play", 14: "Area",
  },
  "7": {
    1: "Large Numbers Around Us", 2: "Arithmetic Expressions",
    3: "A Peek Beyond the Point", 4: "Letter-Numbers",
    5: "Parallel and Intersecting Lines", 6: "Number Play",
    7: "A Tale of Three Intersecting Lines", 8: "Working with Fractions",
    9: "Geometric Twins", 10: "Operations with Integers",
    11: "Finding Common Ground", 12: "Another Peek Beyond the Point",
    13: "Connecting the Dots", 14: "Constructions and Tilings",
    15: "Finding the Unknown",
  },
  "6": {
    1: "Patterns in Mathematics", 2: "Lines and Angles", 3: "Number Play",
    4: "Data Handling and Presentation", 5: "Prime Time", 6: "Perimeter and Area",
    7: "Fractions", 8: "Playing with Constructions", 9: "Symmetry",
    10: "The Other Side of Zero",
  },
  "5": {
    1: "The Fish Tale", 2: "Shapes and Angles", 3: "How Many Squares?",
    4: "Parts and Wholes", 5: "Does it Look the Same?",
    6: "Be My Multiple, I'll Be Your Factor", 7: "Can You See the Pattern?",
    8: "Mapping Your Way", 9: "Boxes and Sketches", 10: "Tenths and Hundredths",
    11: "Area and Its Boundary", 12: "Smart Charts",
    13: "Ways to Multiply and Divide", 14: "How Big? How Heavy?",
  },
  "4": {
    1: "Building with Bricks", 2: "Long and Short", 3: "A Trip to Bhopal",
    4: "Tick-Tick-Tick", 5: "The Way The World Looks", 6: "The Junk Seller",
    7: "Jugs and Mugs", 8: "Carts and Wheels", 9: "Halves and Quarters",
    10: "Play with Patterns", 11: "Tables and Shares",
    12: "How Heavy? How Light?", 13: "Fields and Fences", 14: "Smart Charts",
  },
  "3": {
    1: "Where to Look From", 2: "Fun with Numbers", 3: "Give and Take",
    4: "Long and Short", 5: "Shapes and Designs", 6: "Fun with Give and Take",
    7: "Time Goes On", 8: "Who is Heavier?", 9: "How Many Times?",
    10: "Play with Patterns", 11: "Jugs and Mugs", 12: "Can We Share?",
    13: "Smart Charts!", 14: "Rupees and Paise",
  },
  "2": {
    1: "What is Long, What is Round?", 2: "Counting in Groups",
    3: "How Much Can You Carry?", 4: "Counting in Tens", 5: "Patterns",
    6: "Footprints", 7: "Jugs and Mugs", 8: "Tens and Ones", 9: "My Funbook",
    10: "Add our Points", 11: "Lines and Lines", 12: "Give and Take",
    13: "The Longest Step", 14: "Birds Come, Birds Go", 15: "How Many Ponytails?",
  },
  "1": {
    1: "Shapes and Space", 2: "Numbers from One to Nine", 3: "Addition",
    4: "Subtraction", 5: "Numbers from Ten to Twenty", 6: "Time",
    7: "Measurement", 8: "Numbers from Twenty-one to Fifty",
    9: "Data Handling", 10: "Patterns", 11: "Numbers", 12: "Money",
    13: "How Many",
  },
};

// ICSE Class 10 chapter titles
const MATH_CHAPTER_TITLES_ICSE = {
  "10": {
    1: "Value Added Tax", 2: "Banking (Recurring Deposit Account)",
    3: "Shares and Dividend", 4: "Linear Inequations (In one variable)",
    5: "Quadratic Equations", 6: "Solving (Simple) Problems on Quadratic Equations",
    7: "Ratio and Proportion", 8: "Remainder and Factor Theorems", 9: "Matrices",
    10: "Arithmetic Progression", 11: "Geometric Progression", 12: "Reflection",
    13: "Section and Mid-Point Formula", 14: "Equation of a Line",
    15: "Similarity (with Maps and Models)", 16: "Loci (Locus and Its Constructions)",
    17: "Circles", 18: "Tangents and Intersecting Chords",
    19: "Constructions (Circles)", 20: "Cylinder, Cone and Sphere (Surface Area & Volume)",
    21: "Trigonometrical Identities", 22: "Heights and Distances",
    23: "Graphical Representation", 24: "Measures of Central Tendency",
    25: "Probability",
  },
};

// AP SSC Class 9 & 10 chapter titles (NCERT rationalized 2024-25 curriculum, Telugu-medium)
const MATH_CHAPTER_TITLES_AP_SSC = {
  "9": {
    1:  "Number Systems",
    2:  "Polynomials",
    3:  "Coordinate Geometry",
    4:  "Linear Equations in Two Variables",
    5:  "Introduction to Euclid's Geometry",
    6:  "Lines and Angles",
    7:  "Triangles",
    8:  "Quadrilaterals",
    9:  "Circles",
    10: "Heron's Formula",
    11: "Surface Areas and Volumes",
    12: "Statistics",
  },
  "10": {
    1: "Real Numbers",
    2: "Polynomials",
    3: "Pair of Linear Equations in Two Variables",
    4: "Quadratic Equations",
    5: "Arithmetic Progressions",
    6: "Triangles",
    7: "Coordinate Geometry",
    8: "Introduction to Trigonometry",
    9: "Some Applications of Trigonometry",
    10: "Circles",
    11: "Areas Related to Circles",
    12: "Surface Areas and Volumes",
    13: "Statistics",
    14: "Probability",
  },
};

function mathChapterTitles(grade, examBoard) {
  const board = (examBoard || "CBSE").toUpperCase();
  const table = board === "ICSE"   ? MATH_CHAPTER_TITLES_ICSE
              : board === "AP_SSC" ? MATH_CHAPTER_TITLES_AP_SSC
              : MATH_CHAPTER_TITLES_CBSE;
  return table[String(grade)] || {};
}

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

const ENG_CHAPTER_TITLES = {
  1:  "A Letter to God",
  2:  "Nelson Mandela: Long Walk to Freedom",
  3:  "Two Stories about Flying",
  4:  "From the Diary of Anne Frank",
  5:  "Glimpses of India",
  6:  "Mijbil the Otter",
  7:  "Madam Rides the Bus",
  8:  "The Sermon at Benares",
  9:  "The Proposal",
  10: "A Triumph of Surgery",
  11: "The Thief's Story",
  12: "The Midnight Visitor",
  13: "A Question of Trust",
  14: "Footprints Without Feet",
  15: "The Making of a Scientist",
  16: "The Necklace",
  17: "Bholi",
  18: "The Book That Saved the Earth",
  19: "Sequencing and Narrative Writing",
  20: "Verb Forms and Tenses",
  21: "Relative Clauses",
  22: "Active and Passive Voice",
  23: "Conditionals",
  24: "Reported Speech",
  25: "Article Writing",
  26: "Report Writing",
  27: "Speech Writing",
};

// ── sub-components ─────────────────────────────────────────────────
function SubjectBar({ active, onSelect, subjects = SUBJECTS }) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {subjects.map(({ id, label, color }) => (
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

// LessonCard — with bookmark + collection picker
const LessonCard = memo(function LessonCard({ lesson, isDue, onLearn, onPractice, bookmarked, onBookmark }) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef(null);

  const handleSave = (colId, updatedCols) => {
    const isCustom = colId?.startsWith("col_");
    onBookmark?.(lesson, colId && !isCustom ? colId : null);
    if (isCustom) {
      const lessonKey = `lesson_${lesson._id}`;
      const cols = updatedCols ?? loadLS("stellar_collections", []);
      const next = cols.map((c) =>
        c.id === colId
          ? { ...c, bookmarkIds: c.bookmarkIds.includes(lessonKey) ? c.bookmarkIds : [...c.bookmarkIds, lessonKey] }
          : c
      );
      localStorage.setItem("stellar_collections", JSON.stringify(next));
    }
    setPickerOpen(false);
  };

  return (
    <div className={`card p-5 flex items-center justify-between gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
      isDue ? "ring-1 ring-apple-orange/30 bg-apple-orange/4 hover:ring-apple-orange/50" : ""
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
      <div className="flex items-center gap-2 shrink-0">
        {/* Bookmark with collection picker */}
        <div className="relative" ref={pickerRef}>
          <button
            onClick={() => {
              if (bookmarked) onBookmark?.(lesson);
              else setPickerOpen((v) => !v);
            }}
            title={bookmarked ? "Remove from saved" : "Save this lesson"}
            className={`text-[18px] leading-none transition-colors ${bookmarked ? "text-[#FF9500]" : "text-[#D1D1D6] hover:text-[#FF9500]"}`}
          >
            {bookmarked ? "★" : "☆"}
          </button>
          {pickerOpen && (
            <CollectionPickerPopup
              pickerRef={pickerRef}
              onClose={() => setPickerOpen(false)}
              onSave={handleSave}
            />
          )}
        </div>
        <button onClick={onLearn} className="btn-primary text-[13px] py-2 px-4">Learn →</button>
        <button onClick={onPractice} className="btn-secondary text-[13px] py-2 px-4">Practice</button>
      </div>
    </div>
  );
});

// ── CollectionPickerPopup — reused in TopicsChapterCard + LessonCard ──
const SMART_COLLECTION_LABELS = [
  "All saved", "Tricky concepts", "Review before exam",
  "Concepts & formulas", "Tips & shortcuts", "✓ Mastered",
];
// Maps each smart label to its collection ID (null = "All saved" = no specific assignment)
const SMART_LABEL_TO_ID = {
  "All saved": null, "Tricky concepts": "tricky", "Review before exam": "recent",
  "Concepts & formulas": "concepts", "Tips & shortcuts": "tips", "✓ Mastered": "mastered",
};

function CollectionPickerPopup({ onSave, onClose, pickerRef }) {
  const [cols, setCols] = useState(() => loadLS("stellar_collections", []));
  const [creating, setCreating] = useState(false);
  const [newName,  setNewName]  = useState("");
  useEffect(() => {
    const h = (e) => { if (pickerRef?.current && !pickerRef.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [onClose, pickerRef]);

  const handleNew = () => {
    const name = newName.trim();
    if (!name) return;
    const nc = { id: `col_${Date.now()}`, label: name, bookmarkIds: [] };
    const updated = [...cols, nc];
    setCols(updated);
    localStorage.setItem("stellar_collections", JSON.stringify(updated));
    setCreating(false);
    setNewName("");
    onSave(nc.id, updated);
  };

  return (
    <div className="absolute right-0 bottom-7 z-50 bg-white rounded-xl border border-[#f0f0f5] shadow-xl min-w-[210px] max-h-[320px] overflow-y-auto">
      <p className="sticky top-0 bg-white text-[9px] font-bold text-[#8E8E93] tracking-[0.12em] uppercase px-3 pt-2.5 pb-1 border-b border-[#F2F2F7]">
        Add to collection
      </p>

      {/* Smart collections */}
      <p className="text-[9px] font-semibold text-[#C7C7CC] tracking-[0.1em] uppercase px-3 pt-2 pb-0.5">Smart</p>
      {SMART_COLLECTION_LABELS.map((label) => (
        <button
          key={label}
          onClick={() => onSave(SMART_LABEL_TO_ID[label], cols)}
          className="w-full text-left px-3 py-2 text-[12px] text-[#3A3A3C] hover:bg-[#F2F2F7] flex items-center gap-2"
        >
          <span className="text-[#C7C7CC] text-[11px]">◈</span>
          <span>{label}</span>
        </button>
      ))}

      {/* Custom collections */}
      {cols.length > 0 && (
        <>
          <p className="text-[9px] font-semibold text-[#C7C7CC] tracking-[0.1em] uppercase px-3 pt-2 pb-0.5 border-t border-[#F2F2F7] mt-1">
            My collections
          </p>
          {cols.map((col) => (
            <button
              key={col.id}
              onClick={() => onSave(col.id, cols)}
              className="w-full text-left px-3 py-2 text-[12px] text-[#3A3A3C] hover:bg-[#F2F2F7] flex items-center gap-2"
            >
              <span className="text-[#007AFF] text-[11px]">◉</span>
              <span>{col.label}</span>
            </button>
          ))}
        </>
      )}

      {/* New collection */}
      <div className="border-t border-[#F2F2F7] mt-1">
        {creating ? (
          <div className="px-2 pb-2 pt-1">
            <input
              autoFocus
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleNew(); if (e.key === "Escape") { setCreating(false); setNewName(""); } }}
              placeholder="Collection name…"
              maxLength={40}
              className="w-full text-[12px] px-2 py-1.5 rounded-lg border border-[#007AFF]/50 outline-none bg-[#007AFF]/5 text-[#1C1C1E] placeholder-[#C7C7CC]"
            />
            <div className="flex gap-1 mt-1">
              <button onClick={handleNew} disabled={!newName.trim()} className="flex-1 py-1 rounded-lg bg-[#007AFF] text-white text-[11px] font-bold disabled:opacity-40">Create</button>
              <button onClick={() => { setCreating(false); setNewName(""); }} className="px-2 py-1 rounded-lg text-[#8E8E93] text-[11px] hover:bg-[#F2F2F7]">Cancel</button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setCreating(true)}
            className="w-full text-left px-3 py-2.5 text-[12px] text-[#007AFF] hover:bg-[#F2F2F7] flex items-center gap-1.5"
          >
            <span className="font-bold">+</span> New collection
          </button>
        )}
      </div>
    </div>
  );
}

// TopicsChapterCard — with per-topic bookmark + collection picker
function TopicsChapterCard({ chapterNumber, topics, onTopic, onPractice, color = "#34C759", titleMap = {}, isBookmarked, onBookmark, meta, masteryMap, onDiagnose, onCoStudy }) {
  const [expanded,  setExpanded]  = useState(false);
  const [pickerFor, setPickerFor] = useState(null); // topicId with picker open
  const pickerRef = useRef(null);
  const title = titleMap[chapterNumber] || `Chapter ${chapterNumber}`;

  // Derive chapter status to render as a pill (mirrors Filter dropdown options)
  let chapterStatus = null;
  if (meta && meta.topicCount > 0) {
    const allDone = meta.mastered === meta.topicCount;
    const someProgress = (meta.mastered > 0 && meta.mastered < meta.topicCount) || meta.inProgress > 0;
    const isDue = Array.isArray(topics) && topics.some((t) => masteryMap?.[t.topicId] === "wrong_repeat");
    if (isDue && !allDone)    chapterStatus = { label: "⏰ Due",       cls: "bg-[#FF9500]/15 text-[#FF9500]" };
    else if (allDone)         chapterStatus = { label: "✓ Mastered",  cls: "bg-[#34C759]/15 text-[#34C759]" };
    else if (someProgress)    chapterStatus = { label: "In progress", cls: "bg-[#007AFF]/15 text-[#007AFF]" };
    else                      chapterStatus = { label: "Not started", cls: "bg-[#8E8E93]/15 text-[#8E8E93]" };
  }

  const handleSave = (topicId, topicObj, colId, updatedCols) => {
    const isCustom = colId?.startsWith("col_");
    // Attach smartCol to the topic entry when user picks a named smart collection
    const topicWithMeta = (colId && !isCustom) ? { ...topicObj, smartCol: colId } : topicObj;
    onBookmark?.(topicWithMeta);
    if (isCustom) {
      const cols = updatedCols ?? loadLS("stellar_collections", []);
      const next = cols.map((c) =>
        c.id === colId
          ? { ...c, bookmarkIds: c.bookmarkIds.includes(topicId) ? c.bookmarkIds : [...c.bookmarkIds, topicId] }
          : c
      );
      localStorage.setItem("stellar_collections", JSON.stringify(next));
    }
    setPickerFor(null);
  };

  return (
    <div className="card overflow-hidden">
      <div
        onClick={() => setExpanded((v) => !v)}
        className="p-4 flex items-start gap-4 cursor-pointer hover:bg-apple-gray6/50 transition-colors group"
      >
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold shrink-0"
          style={{ background: color + "18", color }}>
          {chapterNumber}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[14px] font-semibold text-[var(--label)] group-hover:text-apple-blue transition-colors">{title}</p>
            {/* Chapter progress status pill — mirrors the Filter dropdown options */}
            {chapterStatus && (
              <span className={`text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded-full ${chapterStatus.cls}`}>
                {chapterStatus.label}
              </span>
            )}
            {/* #22 What's new chip */}
            {meta?.isNew && <span className="text-[9px] font-bold tracking-wider uppercase bg-[#AF52DE]/12 text-[#AF52DE] px-1.5 py-0.5 rounded-full">✨ New</span>}
            {/* #7 Difficulty pill */}
            {meta?.difficulty && (
              <span className="text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded-full" style={{ background: `${DIFF_COLOR[meta.difficulty]}14`, color: DIFF_COLOR[meta.difficulty] }}>
                {DIFF_LABEL[meta.difficulty]}
              </span>
            )}
            {/* #9 Exam weight */}
            {meta?.examWeight > 0 && (
              <span className="text-[10px] font-bold text-[#FF9500] bg-[#FF9500]/10 px-1.5 py-0.5 rounded-full" title="Share of board paper">
                {meta.examWeight}% paper
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap mt-1">
            <p className="text-[12px] text-apple-gray">
              {/* #3 progress text */}
              {meta ? `${meta.mastered}/${meta.topicCount} done` : `${topics.length} topic${topics.length !== 1 ? "s" : ""}`}
            </p>
            {/* #6 estimated time */}
            {meta?.estimatedMinutes > 0 && <span className="text-[11px] text-[#8E8E93]">· ~{meta.estimatedMinutes} min</span>}
            {/* #8 PYQ density */}
            {meta?.pyqCount > 0 && (
              <span className="text-[10px] font-bold text-[#007AFF] bg-[#007AFF]/8 px-1.5 py-0.5 rounded" title={`${meta.pyqCount} PYQs from this chapter`}>
                ★ {meta.pyqCount} PYQs
              </span>
            )}
            {/* #10 Multimedia indicators */}
            <div className="flex gap-1">
              {meta?.hasVideo   && <span className="text-[10px]" title="Video">▶</span>}
              {meta?.hasDiagram && <span className="text-[10px]" title="Diagram">📊</span>}
              {meta?.hasFormula && <span className="text-[10px]" title="Formulas">𝑓</span>}
            </div>
          </div>
          {/* #14 Prerequisite chip */}
          {meta?.prereqs?.length > 0 && (
            <p className="text-[10px] text-[#8E8E93] mt-1">
              <span className="text-[#FF9500] font-semibold">↳ Needs:</span> {meta.prereqs.slice(0, 2).join(", ")}{meta.prereqs.length > 2 ? "…" : ""}
            </p>
          )}
          {/* #24 Attribution + #18 Offline */}
          <div className="flex items-center gap-2 mt-1">
            {meta?.lastUpdated && (
              <p className="text-[10px] text-[#C7C7CC]">Stellar AI · updated {new Date(meta.lastUpdated).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</p>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                const key = `offline_chapter_${chapterNumber}`;
                const has = localStorage.getItem(key);
                if (has) { localStorage.removeItem(key); }
                else {
                  localStorage.setItem(key, JSON.stringify({ topics: topics.map((t) => ({ topicId: t.topicId, name: t.name })), savedAt: Date.now() }));
                }
                e.currentTarget.textContent = has ? "↓ Save offline" : "✓ Saved offline";
              }}
              className="text-[10px] font-semibold text-[#8E8E93] hover:text-[#007AFF] transition-colors opacity-0 group-hover:opacity-100">
              {localStorage.getItem(`offline_chapter_${chapterNumber}`) ? "✓ Saved offline" : "↓ Save offline"}
            </button>
          </div>
          {/* #3 progress bar */}
          {meta && meta.topicCount > 0 && (
            <div className="mt-2 h-1 bg-[#F2F2F7] rounded-full overflow-hidden">
              <div className="h-full transition-all duration-500" style={{ width: `${meta.progressPct}%`, background: color }} />
            </div>
          )}
        </div>
        <div className="shrink-0 flex items-center gap-2 self-center">
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
          {topics.map((t) => {
            const saved = isBookmarked?.(t.topicId);
            const isPickerOpen = pickerFor === t.topicId;
            const state = masteryMap?.[t.topicId];
            const topicPct =
              state === "mastered"    ? 100
              : state === "wrong_repeat" ? 70
              : state === "in_progress"  ? 50
              : 0;
            const topicBarColor =
              state === "mastered"    ? "#34C759"
              : state === "wrong_repeat" ? "#FF9500"
              : state === "in_progress"  ? "#007AFF"
              : "transparent";
            return (
              <div
                key={t.topicId}
                className="flex flex-col px-5 py-3 hover:bg-apple-gray6/40 transition-colors group/row"
              >
                <div className="flex items-center gap-2">
                <button
                  onClick={() => onTopic(t.topicId)}
                  className="flex items-center gap-3 flex-1 text-left min-w-0"
                >
                  {/* #2 mastery dot */}
                  <MasteryDot state={state} size={8} />
                  <span className="text-[13px] text-[var(--label)] group-hover/row:text-apple-blue flex-1 truncate">{t.name}</span>
                  {/* Per-topic status pill — mirrors the chapter-level filter labels */}
                  {state === "mastered" ? (
                    <span className="text-[9px] font-bold tracking-wider uppercase bg-[#34C759]/15 text-[#34C759] px-1.5 py-0.5 rounded-full shrink-0">✓ Mastered</span>
                  ) : state === "wrong_repeat" ? (
                    <span className="text-[9px] font-bold tracking-wider uppercase bg-[#FF9500]/15 text-[#FF9500] px-1.5 py-0.5 rounded-full shrink-0">⏰ Due</span>
                  ) : state === "in_progress" ? (
                    <span className="text-[9px] font-bold tracking-wider uppercase bg-[#007AFF]/15 text-[#007AFF] px-1.5 py-0.5 rounded-full shrink-0">In progress</span>
                  ) : (
                    <span className="text-[9px] font-bold tracking-wider uppercase bg-[#8E8E93]/15 text-[#8E8E93] px-1.5 py-0.5 rounded-full shrink-0">Not started</span>
                  )}
                  <span className="text-[12px] text-apple-gray3 shrink-0 group-hover/row:text-apple-blue">Study →</span>
                </button>
                {/* #16 study-mode picker (mini) */}
                <div className="hidden lg:flex items-center gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity">
                  <button onClick={(e) => { e.stopPropagation(); onTopic(t.topicId); }} title="Brief lesson" className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#F2F2F7] hover:bg-[#E5E5EA] text-[#3A3A3C]">Brief</button>
                  <button onClick={(e) => { e.stopPropagation(); onDiagnose?.(t.topicId, t.name); }} title="Pre-lesson diagnostic" className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#AF52DE]/10 hover:bg-[#AF52DE]/20 text-[#AF52DE]">⚡ Skip if I know</button>
                  <button onClick={(e) => { e.stopPropagation(); onCoStudy?.(t.topicId, t.name); }} title="Study with a friend" className="text-[10px] px-1 py-0.5 rounded hover:bg-[#F2F2F7]">👥</button>
                </div>
                {/* Bookmark with collection picker */}
                <div className="relative shrink-0" ref={isPickerOpen ? pickerRef : null}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (saved) {
                        onBookmark?.({ topicId: t.topicId, name: t.name, subject: t.subject, chapterNumber: t.chapterNumber });
                      } else {
                        setPickerFor(isPickerOpen ? null : t.topicId);
                      }
                    }}
                    title={saved ? "Remove from saved" : "Save this topic"}
                    className={`text-[17px] leading-none transition-colors ${saved ? "text-[#FF9500]" : "text-[#D1D1D6] hover:text-[#FF9500]"}`}
                  >
                    {saved ? "★" : "☆"}
                  </button>
                  {isPickerOpen && (
                    <CollectionPickerPopup
                      pickerRef={pickerRef}
                      onClose={() => setPickerFor(null)}
                      onSave={(colId, updatedCols) =>
                        handleSave(t.topicId, { topicId: t.topicId, name: t.name, subject: t.subject, chapterNumber: t.chapterNumber }, colId, updatedCols)
                      }
                    />
                  )}
                </div>
                </div>
                {/* Per-topic progress bar */}
                <div className="mt-2 h-1 bg-[#F2F2F7] rounded-full overflow-hidden">
                  <div className="h-full transition-all duration-500" style={{ width: `${topicPct}%`, background: topicBarColor }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const ScienceChapterCard = (props) => (
  <TopicsChapterCard {...props} color={SCI_COLOR_FOR_CHAPTER(props.chapterNumber)} titleMap={SCIENCE_CHAPTER_TITLES} />
);

const EnglishChapterCard = (props) => (
  <TopicsChapterCard {...props} color="#FF9500" titleMap={ENG_CHAPTER_TITLES} />
);

function SCI_COLOR_FOR_CHAPTER(ch) {
  if ([1,2,3,4].includes(ch)) return "#7c3aed";  // Chemistry
  if ([5,6,7,8,13].includes(ch)) return "#34C759"; // Biology
  if ([9,10,11,12].includes(ch)) return "#007AFF"; // Physics
  return "#34C759";
}

const HIN_CHAPTER_TITLES = {
  1:  "सूरदास के पद",
  2:  "तुलसीदास के पद",
  3:  "देव के पद",
  4:  "जयशंकर प्रसाद — आत्मकथ्य",
  5:  "निराला — उत्साह, अट नहीं रही है",
  6:  "नागार्जुन — यह दंतुरित मुस्कान, फसल",
  7:  "फ़िराक़ गोरखपुरी — रुबाइयाँ, गज़ल",
  8:  "मंगलेश डबराल — संगतकार",
  9:  "स्वयं प्रकाश — नेताजी का चश्मा",
  10: "रामवृक्ष बेनीपुरी — बालगोबिन भगत",
  11: "यशपाल — लखनवी अंदाज़",
  12: "मन्नू भंडारी — एक कहानी यह भी",
  13: "कबीर की साखियाँ",
  14: "मीरा के पद",
  15: "बिहारी के दोहे",
  16: "मैथिलीशरण गुप्त — मनुष्यता",
  17: "सुमित्रानंदन पंत — पर्वत प्रदेश में पावस",
  18: "महादेवी वर्मा — मधुर-मधुर मेरे दीपक जल",
  19: "वीरेन डंगवाल — तोप",
  20: "प्रेमचंद — बड़े भाई साहब",
  21: "सीताराम सेकसरिया — डायरी का एक पन्ना",
  22: "लीलाधर मंडलोई — तताँरा-वामीरो कथा",
  23: "प्रहलाद अग्रवाल — तीसरी कसम के शिल्पकार शैलेंद्र",
  24: "सआदत हसन मंटो — अब कहाँ दूसरे के दुख से दुखी होने वाले",
  25: "सर्वेश्वरदयाल सक्सेना — पतझर में टूटी पत्तियाँ",
  26: "हबीब तनवीर — कारतूस",
  27: "शिवपूजन सहाय — माता का आँचल",
  28: "कमलेश्वर — जॉर्ज पंचम की नाक",
  29: "मधु कांकरिया — साना-साना हाथ जोड़ि",
  30: "मिथिलेश्वर — हरिहर काका",
  31: "गुरदयाल सिंह — सपनों के से दिन",
  32: "राही मासूम रज़ा — टोपी शुक्ला",
};

const HIN_SUBS = {
  "Kshitij":   [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  "Sparsh":    [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
  "Kritika":   [27, 28, 29],
  "Sanchayan": [30, 31, 32],
};
const HIN_COLORS = { Kshitij: "#FF3B30", Sparsh: "#AF52DE", Kritika: "#007AFF", Sanchayan: "#34C759" };

function HindiSubBar({ active, onSelect }) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {["All", "Kshitij", "Sparsh", "Kritika", "Sanchayan"].map((s) => {
        const color = HIN_COLORS[s] || "#FF3B30";
        const isActive = (s === "All" && !active) || active === s;
        const labels = { Kshitij: "Kshitij Bhaag 2", Sparsh: "Sparsh Bhaag 2", Kritika: "Kritika Bhaag 2", Sanchayan: "Sanchayan Bhaag 2" };
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
            {labels[s] || s}
          </button>
        );
      })}
    </div>
  );
}

const HindiChapterCard = ({ chapterNumber, topics, onTopic, onPractice, isBookmarked, onBookmark }) => {
  const sub = Object.entries(HIN_SUBS).find(([, chs]) => chs.includes(chapterNumber))?.[0];
  const color = HIN_COLORS[sub] || "#FF3B30";
  return (
    <TopicsChapterCard
      chapterNumber={chapterNumber}
      topics={topics}
      onTopic={onTopic}
      onPractice={onPractice}
      color={color}
      titleMap={HIN_CHAPTER_TITLES}
      isBookmarked={isBookmarked}
      onBookmark={onBookmark}
    />
  );
};

const MathChapterCard = ({ chapterNumber, topics, onTopic, onPractice, isBookmarked, onBookmark, titleMap, meta, ...rest }) => {
  // Use the passed-in titleMap (proper chapter titles for the user's grade+board).
  // Fallback to topic-name-based map only if no titleMap was provided (legacy).
  const finalTitleMap = titleMap && Object.keys(titleMap).length
    ? titleMap
    : Object.fromEntries(topics.map((t) => [t.chapterNumber, t.name]));
  return (
    <TopicsChapterCard
      chapterNumber={chapterNumber}
      topics={topics}
      onTopic={onTopic}
      onPractice={onPractice}
      color="#007AFF"
      titleMap={finalTitleMap}
      isBookmarked={isBookmarked}
      onBookmark={onBookmark}
      meta={meta}
      {...rest}
    />
  );
};

// ── main page ──────────────────────────────────────────────────────
export default function Lessons() {
  const { user }  = useAuthStore();
  const profile   = useActiveProfile();
  const navigate  = useNavigate();
  const grade     = profile?.grade || "10";

  const goToPractice = useCallback((topic) => navigate("/practice", { state: { topic } }), [navigate]);
  const goToLearn    = useCallback((topic) => navigate(`/lessons/${encodeURIComponent(topic)}?mode=short`), [navigate]);
  const goToChapter  = useCallback((chapterId) => navigate(`/ncert/chapters/${chapterId}`), [navigate]);

  const [activeSubject, setActiveSubject] = useState(profile?.subject || user?.subject || "Math");
  const [scienceSub,    setScienceSub]    = useState(null);
  const [sstSub,        setSstSub]        = useState(null);
  const [hindiSub,      setHindiSub]      = useState(null);
  const [contentTab,    setContentTab]    = useState("curriculum");

  // Board+grade-aware subject availability — see /api/v1/ncert/available-subjects.
  // null = loading / unknown (failsafe: render the full SUBJECTS list).
  // [] or [{id,chapterCount},…] = authoritative, hide subjects without content.
  const [availableSubjects, setAvailableSubjects] = useState(null);
  const board = profile?.examBoard || "CBSE";
  useEffect(() => {
    if (!board || !grade) return;
    let cancelled = false;
    listAvailableSubjects(board, grade)
      .then((r) => {
        if (cancelled) return;
        const rows = r.data?.data || [];
        setAvailableSubjects(rows.map((row) => ({
          id: row.subject === "Mathematics" ? "Math" : row.subject,
          chapterCount: row.chapterCount,
        })));
      })
      .catch(() => { if (!cancelled) setAvailableSubjects(null); });
    return () => { cancelled = true; };
  }, [board, grade]);

  const availableIdSet = useMemo(
    () => new Set((availableSubjects || []).map((a) => a.id)),
    [availableSubjects]
  );
  const chapterCountMap = useMemo(
    () => Object.fromEntries((availableSubjects || []).map((a) => [a.id, a.chapterCount])),
    [availableSubjects]
  );
  const visibleSubjects = useMemo(
    () => (availableSubjects ? SUBJECTS.filter((s) => availableIdSet.has(s.id)) : SUBJECTS),
    [availableSubjects, availableIdSet]
  );

  // If the current activeSubject isn't in the available set, fall back to the
  // first available one so the user never lands on an empty subject page.
  useEffect(() => {
    if (!availableSubjects || availableSubjects.length === 0) return;
    if (!availableIdSet.has(activeSubject)) {
      setActiveSubject(visibleSubjects[0]?.id || "Math");
    }
  }, [availableSubjects]); // eslint-disable-line react-hooks/exhaustive-deps

  const [chapters,    setChapters]    = useState([]);
  const [lessons,     setLessons]     = useState([]);
  const [revisionDue, setRevisionDue] = useState([]);
  const [sciTopics,   setSciTopics]   = useState([]);
  const [sstTopics,   setSstTopics]   = useState([]);
  const [engTopics,   setEngTopics]   = useState([]);
  const [hinTopics,   setHinTopics]   = useState([]);
  const [mathTopics,  setMathTopics]  = useState([]);
  const [loading,     setLoading]     = useState(true);

  // ── v2 state ────────────────────────────────────────────────────
  const [continueCard, setContinueCard] = useState(null); // #1
  const [recentTopics, setRecentTopics] = useState([]);    // #21
  const [recommended,  setRecommended]  = useState([]);    // #5
  const [chapterMeta,  setChapterMeta]  = useState({});    // #3,6,7,8,9,10,14,22 — {chapterNumber: meta}
  const [masteryMap,   setMasteryMap]   = useState({});    // #2 {topicId: state}
  const [studiedSet,   setStudiedSet]   = useState(new Set()); // user-marked studied topicIds
  const [activePlan,   setActivePlan]   = useState(null);  // #15
  const [search,       setSearch]       = useState("");
  const [searchResults,setSearchResults]= useState([]);
  const [searching,    setSearching]    = useState(false);
  const [filterMode,   setFilterMode]   = useState("all"); // all | not_started | in_progress | mastered | due
  const [sortBy,       setSortBy]       = useState("number"); // number | recommended | difficulty | exam_weight | recent
  const [density,      setDensity]      = useState(() => localStorage.getItem("stellar_lessons_density") || "comfortable");
  const [diagOpen,     setDiagOpen]     = useState(null);  // {topicId, name, questions}
  const [coStudyUrl,   setCoStudyUrl]   = useState(null);
  useEffect(() => { localStorage.setItem("stellar_lessons_density", density); }, [density]);

  // Topic + lesson bookmarks — localStorage backed
  const [topicBMs, setTopicBMs] = useState(() => loadLS("stellar_topic_bookmarks", {}));

  const toggleTopicBookmark = useCallback((topic) => {
    setTopicBMs((prev) => {
      const next = { ...prev };
      if (next[topic.topicId]) {
        delete next[topic.topicId];
      } else {
        next[topic.topicId] = { ...topic, savedAt: new Date().toISOString() };
      }
      localStorage.setItem("stellar_topic_bookmarks", JSON.stringify(next));
      return next;
    });
  }, []);

  const toggleLessonBookmark = useCallback((lesson, smartCol) => {
    const key = `lesson_${lesson._id}`;
    setTopicBMs((prev) => {
      const next = { ...prev };
      if (next[key]) {
        delete next[key];
      } else {
        const entry = { topicId: key, name: lesson.title, subject: activeSubject, isLesson: true, lessonId: lesson._id, savedAt: new Date().toISOString() };
        if (smartCol) entry.smartCol = smartCol;
        next[key] = entry;
      }
      localStorage.setItem("stellar_topic_bookmarks", JSON.stringify(next));
      return next;
    });
  }, [activeSubject]);

  const isTopicBM  = useCallback((id) => !!topicBMs[id], [topicBMs]);
  const isLessonBM = useCallback((lesson) => !!topicBMs[`lesson_${lesson._id}`], [topicBMs]);

  useEffect(() => {
    setLoading(true);
    setScienceSub(null);
    setSstSub(null);
    setHindiSub(null);
    Promise.all([
      listLessons(activeSubject, grade).catch(() => ({ data: [] })),
      getRevisionDue().catch(() => ({ data: [] })),
      listNcertChapters(ncertSubject(activeSubject), grade, board).catch(() => ({ data: [] })),
      activeSubject === "Science"
        ? listNcertTopics(undefined, "Science").catch(() => ({ data: { data: [] } }))
        : Promise.resolve({ data: { data: [] } }),
      activeSubject === "Social Science"
        ? listNcertTopics(undefined, "Social Science").catch(() => ({ data: { data: [] } }))
        : Promise.resolve({ data: { data: [] } }),
      activeSubject === "English"
        ? listNcertTopics(undefined, "English").catch(() => ({ data: { data: [] } }))
        : Promise.resolve({ data: { data: [] } }),
      activeSubject === "Hindi"
        ? listNcertTopics(undefined, "Hindi").catch(() => ({ data: { data: [] } }))
        : Promise.resolve({ data: { data: [] } }),
      activeSubject === "Math"
        ? listNcertTopics(undefined, "Mathematics").catch(() => ({ data: { data: [] } }))
        : Promise.resolve({ data: { data: [] } }),
    ]).then(([l, r, c, st, sst, eng, hin, math]) => {
      setLessons(l.data);
      setRevisionDue(r.data);
      setChapters(c.data?.data ?? []);
      setSciTopics(st.data?.data ?? []);
      setSstTopics(sst.data?.data ?? []);
      setEngTopics(eng.data?.data ?? []);
      setHinTopics(hin.data?.data ?? []);
      setMathTopics(math.data?.data ?? []);
    }).finally(() => setLoading(false));
  }, [activeSubject, grade, board]);

  // v2 dashboard fetch — runs in parallel
  const refreshDashboard = useCallback(() => {
    lessonsV2Dashboard(activeSubject, grade).then((r) => {
      const d = r.data?.data || {};
      setContinueCard(d.continueCard);
      setRecentTopics(d.recent || []);
      setRecommended(d.recommended || []);
      setMasteryMap(d.masteryMap || {});
      const map = {};
      for (const c of d.chapters || []) map[c.chapterNumber] = c;
      setChapterMeta(map);
    }).catch(() => {});
    getStudiedTopics()
      .then((r) => setStudiedSet(new Set(r.data?.data || [])))
      .catch(() => {});
  }, [activeSubject, grade]);

  useEffect(() => {
    refreshDashboard();
    getPlan().then((r) => setActivePlan(r.data?.data || null)).catch(() => {});
  }, [refreshDashboard]);

  // Re-fetch dashboard when user returns to this tab (e.g. after marking a topic studied)
  useEffect(() => {
    const onVisible = () => { if (document.visibilityState === "visible") refreshDashboard(); };
    window.addEventListener("focus", refreshDashboard);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("focus", refreshDashboard);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refreshDashboard]);

  // Search debounced
  useEffect(() => {
    if (!search.trim() || search.trim().length < 2) { setSearchResults([]); return; }
    setSearching(true);
    const id = setTimeout(() => {
      lessonsV2Search(search, activeSubject, grade).then((r) => setSearchResults(r.data?.data || []))
        .catch(() => setSearchResults([])).finally(() => setSearching(false));
    }, 200);
    return () => clearTimeout(id);
  }, [search, activeSubject, grade]);

  // Keyboard shortcuts (#20)
  const searchRef = useRef(null);
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === "/") { e.preventDefault(); searchRef.current?.focus(); }
      if (e.key === "Escape") { setSearch(""); setSearchResults([]); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Diagnostic + co-study handlers
  const handleDiagnose = async (topicId, name) => {
    try { const r = await lessonsV2Diagnostic(topicId); setDiagOpen({ topicId, name, questions: r.data?.data || [] }); }
    catch { setDiagOpen({ topicId, name, questions: [] }); }
  };
  const handleCoStudy = async (topicId, name) => {
    try {
      const r = await lessonsV2CoStudy(topicId, name);
      const url = r.data?.data?.url;
      setCoStudyUrl(url);
      navigator.clipboard.writeText(url).catch(() => {});
    } catch {}
  };

  // Filter helper for chapters
  const matchesFilter = (chMeta) => {
    if (!chMeta || filterMode === "all") return true;
    if (filterMode === "not_started") return chMeta.mastered === 0 && chMeta.inProgress === 0;
    if (filterMode === "in_progress") return chMeta.inProgress > 0 || (chMeta.mastered > 0 && chMeta.mastered < chMeta.topicCount);
    if (filterMode === "mastered")    return chMeta.mastered === chMeta.topicCount && chMeta.topicCount > 0;
    if (filterMode === "due") {
      // chapter has any topic in revisionDue
      return false; // computed against revisionDue list later
    }
    return true;
  };

  const sortGroups = (groups) => {
    if (sortBy === "number") return groups;
    const arr = [...groups];
    if (sortBy === "difficulty") arr.sort((a, b) => {
      const order = { easy: 1, medium: 2, hard: 3 };
      return (order[chapterMeta[b.chapterNumber]?.difficulty] || 0) - (order[chapterMeta[a.chapterNumber]?.difficulty] || 0);
    });
    if (sortBy === "exam_weight") arr.sort((a, b) => (chapterMeta[b.chapterNumber]?.examWeight || 0) - (chapterMeta[a.chapterNumber]?.examWeight || 0));
    if (sortBy === "recent") {
      const recentSet = new Set(recentTopics.map((r) => r.topic));
      arr.sort((a, b) => {
        const aHas = a.topics.some((t) => recentSet.has(t.topicId)) ? 1 : 0;
        const bHas = b.topics.some((t) => recentSet.has(t.topicId)) ? 1 : 0;
        return bHas - aHas;
      });
    }
    return arr;
  };

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

  const engChapterGroups = useMemo(() => {
    const groups = {};
    engTopics.forEach((t) => {
      if (!groups[t.chapterNumber]) groups[t.chapterNumber] = [];
      groups[t.chapterNumber].push(t);
    });
    return Object.keys(groups)
      .map((n) => ({ chapterNumber: Number(n), topics: groups[n] }))
      .sort((a, b) => a.chapterNumber - b.chapterNumber);
  }, [engTopics]);

  const hinChapterGroups = useMemo(() => {
    const groups = {};
    hinTopics.forEach((t) => {
      if (!groups[t.chapterNumber]) groups[t.chapterNumber] = [];
      groups[t.chapterNumber].push(t);
    });
    return Object.keys(groups)
      .map((n) => ({ chapterNumber: Number(n), topics: groups[n] }))
      .sort((a, b) => a.chapterNumber - b.chapterNumber);
  }, [hinTopics]);

  // Math topics filtered by user's grade using topicId prefix:
  //   grade "9" ICSE      → icse_math9_*       (standardized board-prefixed IDs)
  //   grade "9" CBSE      → cbse_math9_*       (standardized board-prefixed IDs)
  //   grade "10" CBSE     → cbse_math10_*      (standardized board-prefixed IDs)
  //   grade "10" ICSE     → icse_math10_*      (standardized board-prefixed IDs)
  //   grade "10" AP_SSC   → ap_ssc_math10_*    (cloned from CBSE 10; same NCERT curriculum)
  //   grade "1-8"         → math{grade}_*      (legacy v2; awaits standardization plow)
  const mathChapterGroups = useMemo(() => {
    const board = (profile?.examBoard || user?.examBoard || "CBSE").toUpperCase();
    const gradeTopics = grade === "9" && board === "ICSE"
      ? mathTopics.filter((t) => (t.topicId || "").startsWith("icse_math9_"))
      : grade === "9" && board === "AP_SSC"
      ? mathTopics.filter((t) => (t.topicId || "").startsWith("ap_ssc_math9_"))
      : grade === "9"
      ? mathTopics.filter((t) => (t.topicId || "").startsWith("cbse_math9_"))
      : grade === "8"
      ? mathTopics.filter((t) => (t.topicId || "").startsWith("math8_"))
      : grade === "7"
      ? mathTopics.filter((t) => (t.topicId || "").startsWith("math7_"))
      : grade === "6"
      ? mathTopics.filter((t) => (t.topicId || "").startsWith("math6_"))
      : grade === "5"
      ? mathTopics.filter((t) => (t.topicId || "").startsWith("math5_"))
      : grade === "4"
      ? mathTopics.filter((t) => (t.topicId || "").startsWith("math4_"))
      : grade === "3"
      ? mathTopics.filter((t) => (t.topicId || "").startsWith("math3_"))
      : grade === "2"
      ? mathTopics.filter((t) => (t.topicId || "").startsWith("math2_"))
      : grade === "1"
      ? mathTopics.filter((t) => (t.topicId || "").startsWith("math1_"))
      : grade === "10" && board === "ICSE"
      ? mathTopics.filter((t) => (t.topicId || "").startsWith("icse_math10_"))
      : grade === "10" && board === "AP_SSC"
      ? mathTopics.filter((t) => (t.topicId || "").startsWith("ap_ssc_math10_"))
      : grade === "10"
      ? mathTopics.filter((t) => (t.topicId || "").startsWith("cbse_math10_"))
      : [];
    const groups = {};
    gradeTopics.forEach((t) => {
      if (!groups[t.chapterNumber]) groups[t.chapterNumber] = [];
      groups[t.chapterNumber].push(t);
    });
    return Object.keys(groups)
      .map((n) => ({ chapterNumber: Number(n), topics: groups[n] }))
      .sort((a, b) => a.chapterNumber - b.chapterNumber);
  }, [mathTopics, grade, profile?.examBoard, user?.examBoard]);

  // Merge three signals into a single per-topic state:
  //   1. masteryMap (from practice attempts — server-side)
  //   2. studiedSet (user-marked "Done" — server-side)
  //   3. engage_<topicId> in localStorage (any time spent on the topic page — local)
  // Precedence: mastered > wrong_repeat > in_progress > not_started.
  // (Must be called BEFORE the early-return below — Rules of Hooks.)
  const effectiveMastery = useMemo(() => {
    const merged = { ...masteryMap };
    studiedSet.forEach((id) => {
      if (merged[id] !== "mastered") merged[id] = "mastered";
    });
    // Scan localStorage for engage_* keys → mark topics with any active time as in_progress
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || !key.startsWith("engage_")) continue;
        const topicId = key.slice("engage_".length);
        if (merged[topicId] === "mastered" || merged[topicId] === "wrong_repeat") continue;
        const v = JSON.parse(localStorage.getItem(key) || "{}");
        if ((v.activeSeconds || 0) > 0 || (v.scrollPct || 0) > 0) {
          merged[topicId] = "in_progress";
        }
      }
    } catch {}
    return merged;
  }, [masteryMap, studiedSet]);

  if (loading) return <LessonsSkeleton />;

  const dueTopic = new Set(revisionDue.map((r) => r.topic));

  const visibleChapters = (activeSubject === "Science" && scienceSub)
    ? chapters.filter((ch) => SCIENCE_SUBS[scienceSub]?.some((t) => ch.title?.includes(t) || t.includes(ch.title)))
    : (activeSubject === "Social Science" && sstSub)
    ? chapters.filter((ch) => SST_SUBS[sstSub]?.includes(ch.number))
    : chapters;

  const applyFilter = (groups) => groups.filter((g) => matchesFilter(chapterMeta[g.chapterNumber]));

  const visibleSciGroups = sortGroups(applyFilter(scienceSub
    ? sciChapterGroups.filter((g) => SCI_SUB_CHAPTERS[scienceSub]?.includes(g.chapterNumber))
    : sciChapterGroups));

  const visibleSstGroups = sortGroups(applyFilter(sstSub
    ? sstChapterGroups.filter((g) => SST_SUBS[sstSub]?.includes(g.chapterNumber))
    : sstChapterGroups));

  const visibleHinGroups = sortGroups(applyFilter(hindiSub
    ? hinChapterGroups.filter((g) => HIN_SUBS[hindiSub]?.includes(g.chapterNumber))
    : hinChapterGroups));

  const visibleEngGroups  = sortGroups(applyFilter(engChapterGroups));
  const visibleMathGroups = sortGroups(applyFilter(mathChapterGroups));

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

  // Shared bookmark + meta + diagnostic props for all topic chapter cards
  const bmProps = {
    isBookmarked: isTopicBM,
    onBookmark: toggleTopicBookmark,
    masteryMap: effectiveMastery,
    onDiagnose: handleDiagnose,
    onCoStudy: handleCoStudy,
  };
  const metaFor = (chNum) => chapterMeta[chNum];

  // Hero stats — derived from already-loaded data with sensible fallbacks
  const activeGroupsForHero =
    activeSubject === "Math"          ? visibleMathGroups :
    activeSubject === "Science"       ? visibleSciGroups  :
    activeSubject === "Social Science"? visibleSstGroups  :
    activeSubject === "English"       ? visibleEngGroups  :
    activeSubject === "Hindi"         ? visibleHinGroups  : [];
  const heroChapterCount = activeGroupsForHero.length || SUBJECT_CH_FALLBACK[activeSubject] || 0;
  let heroTotalLessons = 0, heroDoneLessons = 0;
  Object.values(chapterMeta).forEach((m) => {
    heroTotalLessons += m.totalLessons || m.topicCount || 0;
    heroDoneLessons  += m.completedLessons || m.mastered || 0;
  });
  const heroLessonCount = heroTotalLessons || SUBJECT_LS_FALLBACK[activeSubject] || 0;
  const heroProgress    = heroTotalLessons ? Math.round((heroDoneLessons / heroTotalLessons) * 100) : 0;
  const heroEstLeftH    = heroTotalLessons ? Math.max(0, Math.round(((heroTotalLessons - heroDoneLessons) * 8) / 60)) : 0;
  const heroDueNow      = (revisionDue || []).length;
  const otherSubjects   = visibleSubjects.filter((s) => s.id !== activeSubject);

  return (
    <div className="space-y-5">
      {/* ── HERO: subject overview + other subjects ── */}
      <div className="grid lg:grid-cols-3 gap-5 items-stretch">
        {/* Left — pastel gradient hero */}
        <div className="lg:col-span-2 rounded-3xl p-8 lg:p-10 relative overflow-hidden light-on-gradient"
          style={{ background: SUBJECT_GRADIENT[activeSubject] || SUBJECT_GRADIENT.Math }}>
          {Object.keys(topicBMs).length > 0 && (
            <button onClick={() => navigate("/bookmarks")}
              className="absolute top-5 right-5 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-white/50 backdrop-blur-sm text-[#1c1c1e] hover:bg-white/70 transition-colors">
              ★ {Object.keys(topicBMs).length} saved
            </button>
          )}
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#7c3aed]/70 mb-2">
            LIBRARY · CLASS {grade}
          </p>
          <h1 className="text-[44px] lg:text-[56px] font-bold text-[#1c1c1e] leading-none mb-3"
            style={{ fontFamily: "Georgia,'Times New Roman',serif", fontStyle: "italic" }}>
            {SUBJECT_DISPLAY[activeSubject] || activeSubject}
          </h1>
          <p className="text-[13px] text-[#1c1c1e]/70 mb-6">
            {heroChapterCount} chapters · {heroLessonCount} lessons · NCERT-aligned
          </p>
          <div className="grid grid-cols-3 gap-6 max-w-md">
            <div>
              <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#1c1c1e]/55 mb-1">PROGRESS</p>
              <p className="text-[28px] font-bold text-[#1c1c1e]">{heroProgress}%</p>
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#1c1c1e]/55 mb-1">EST. LEFT</p>
              <p className="text-[28px] font-bold text-[#1c1c1e]">{heroEstLeftH}h</p>
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#1c1c1e]/55 mb-1">DUE NOW</p>
              <p className="text-[28px] font-bold" style={{ color: heroDueNow > 0 ? "#ec4899" : "#1c1c1e" }}>{heroDueNow}</p>
            </div>
          </div>
        </div>

        {/* Right — other subjects */}
        <div className="bg-white rounded-3xl p-5 border border-[#f0f0f5]">
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#8e8e93] mb-3">OTHER SUBJECTS</p>
          <div className="space-y-1">
            {otherSubjects.map((s) => (
              <button key={s.id} onClick={() => setActiveSubject(s.id)}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F2F2F7] transition-colors group">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-[14px] font-bold text-white shrink-0"
                  style={{ background: s.color }}>
                  {SUBJECT_INITIAL[s.id] || s.label[0]}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-[14px] font-semibold text-[var(--label)] truncate">{s.label}</p>
                  <p className="text-[11px] text-apple-gray">{chapterCountMap[s.id] || SUBJECT_CH_FALLBACK[s.id] || "—"} chapters</p>
                </div>
                <span className="text-[#c7c7cc] group-hover:text-[#1c1c1e] transition-colors">→</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* #1 Continue where you left off */}
      {continueCard && (
        <button
          onClick={() => navigate(`/lessons/${encodeURIComponent(continueCard.topic)}?mode=${continueCard.mode}`)}
          className="w-full text-left rounded-2xl p-5 bg-white shadow-sm border border-[#f0f0f5] hover:shadow-md hover:border-[#007AFF]/30 transition-all group"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#007AFF] mb-1">▶ Continue where you left off</p>
              <p className="text-[16px] font-bold text-[#1c1c1e] truncate">{continueCard.title}</p>
              {continueCard.tagline && <p className="text-[12px] text-[#8E8E93] truncate mt-0.5">{continueCard.tagline}</p>}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 max-w-[280px] h-1.5 bg-[#F2F2F7] rounded-full overflow-hidden">
                  <div className="h-full bg-[#007AFF]" style={{ width: `${continueCard.percent}%` }} />
                </div>
                <p className="text-[11px] text-[#8E8E93] font-semibold">{continueCard.percent}%</p>
              </div>
            </div>
            <span className="text-[24px] text-[#007AFF] group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </button>
      )}

      {/* #4 Universal search */}
      <div className="relative">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E5E5EA] bg-white focus-within:border-[#007AFF]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
          <input ref={searchRef} value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search any topic across subjects… (press / to focus)"
            className="flex-1 text-[13px] outline-none bg-transparent placeholder-[#C7C7CC]" />
          {search && <button onClick={() => { setSearch(""); setSearchResults([]); }} className="text-[16px] text-[#C7C7CC] hover:text-[#8E8E93]">×</button>}
          <kbd className="text-[10px] font-mono font-bold text-[#C7C7CC] border border-[#E5E5EA] rounded px-1">/</kbd>
        </div>
        {(search.length >= 2) && (
          <div className="absolute top-12 left-0 right-0 bg-white rounded-xl border border-[#f0f0f5] shadow-xl z-30 max-h-[360px] overflow-y-auto">
            {searching ? (
              <p className="text-[12px] text-[#8E8E93] px-4 py-3">Searching…</p>
            ) : searchResults.length === 0 ? (
              <p className="text-[12px] text-[#8E8E93] px-4 py-3">No topics matching "{search}"</p>
            ) : searchResults.map((t) => (
              <button key={t.topicId} onClick={() => { navigate(`/ncert/topics/${t.topicId}`); setSearch(""); setSearchResults([]); }}
                className="w-full text-left px-4 py-2.5 text-[13px] text-[#1C1C1E] hover:bg-[#F2F2F7] flex items-center gap-2 border-b border-[#F2F2F7] last:border-0">
                <MasteryDot state={masteryMap[t.topicId]} size={7} />
                <span className="flex-1 truncate">{t.name}</span>
                <span className="text-[10px] text-[#8E8E93]">{t.subject} · Ch{t.chapterNumber}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* #5 Recommended next */}
      {recommended.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#f0f0f5]">
          <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8E8E93] mb-3">✨ Stellar suggests next</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {recommended.map((t) => (
              <button key={t.topicId} onClick={() => navigate(`/ncert/topics/${t.topicId}`)}
                className="text-left p-3 rounded-xl bg-[#FAFAFB] hover:bg-[#F2F2F7] border border-transparent hover:border-[#007AFF]/30 transition-all">
                <p className="text-[13px] font-semibold text-[#1C1C1E] truncate">{t.name}</p>
                <p className="text-[10px] text-[#8E8E93] mt-1">Ch {t.chapterNumber} · {t.reason}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* #21 Recently studied rail */}
      {recentTopics.length > 0 && (
        <div>
          <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8E8E93] mb-2">Recently studied</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {recentTopics.map((r) => (
              <button key={r.topic} onClick={() => navigate(`/lessons/${encodeURIComponent(r.topic)}?mode=${r.mode}`)}
                className="flex-shrink-0 px-3 py-2 rounded-xl bg-white border border-[#E5E5EA] text-[12px] font-medium text-[#3A3A3C] hover:border-[#007AFF] transition-colors">
                {r.topic}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* #15 Plan banner */}
      {activePlan?.dailyPlan?.length > 0 && (() => {
        const todayStr = new Date().toISOString().slice(0, 10);
        const today = activePlan.dailyPlan.find((d) => d.date?.slice(0, 10) === todayStr);
        if (!today || !today.topics?.length) return null;
        return (
          <div className="rounded-xl px-4 py-3 bg-[#34C759]/8 border border-[#34C759]/20 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-[#34C759] tracking-wider uppercase">Today's plan</p>
              <p className="text-[12px] text-[#3A3A3C] truncate">{today.topics.slice(0, 3).join(" · ")}{today.topics.length > 3 ? "…" : ""} · {today.estimatedHours || 1.5} hrs</p>
            </div>
            <button onClick={() => navigate("/planner")} className="text-[11px] font-semibold text-[#34C759] hover:opacity-70">View plan →</button>
          </div>
        );
      })()}

      {/* Science sub-subject tabs */}
      {activeSubject === "Science" && (
        <ScienceSubBar active={scienceSub} onSelect={setScienceSub} />
      )}

      {/* SST sub-subject tabs */}
      {activeSubject === "Social Science" && (
        <SstSubBar active={sstSub} onSelect={setSstSub} />
      )}

      {/* Hindi sub-subject tabs */}
      {activeSubject === "Hindi" && (
        <HindiSubBar active={hindiSub} onSelect={setHindiSub} />
      )}

      {/* Content type tabs */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-0.5 p-1 bg-white shadow-sm border border-[#f0f0f5] rounded-full w-fit">
          {[
            { id: "curriculum",  label: "Chapters" },
            { id: "ai-lessons",  label: "AI lessons" },
          ].map((t) => (
            <button key={t.id} onClick={() => setContentTab(t.id)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all ${
                contentTab === t.id
                  ? "bg-[#1c1c1e] text-white"
                  : "text-[#3A3A3C] hover:bg-[#F2F2F7]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {/* #12 Sort + #13 Density */}
        <div className="flex items-center gap-2">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-[11px] px-3 py-1.5 rounded-full bg-white shadow-sm border border-[#f0f0f5] text-[#3A3A3C] font-semibold outline-none cursor-pointer hover:shadow-md transition-all">
            <option value="number">Numerical</option>
            <option value="exam_weight">By exam weight</option>
            <option value="difficulty">Hardest first</option>
            <option value="recent">Recently studied</option>
          </select>
          <div className="flex bg-white shadow-sm border border-[#f0f0f5] rounded-full overflow-hidden text-[11px]">
            <button onClick={() => setDensity("comfortable")} title="Comfortable" className={`px-2.5 py-1.5 font-semibold ${density === "comfortable" ? "bg-[#1C1C1E] text-white" : "text-[#3A3A3C]"}`}>▦</button>
            <button onClick={() => setDensity("compact")} title="Compact" className={`px-2.5 py-1.5 font-semibold ${density === "compact" ? "bg-[#1C1C1E] text-white" : "text-[#3A3A3C]"}`}>▤</button>
          </div>
        </div>
      </div>

      {/* #11 Filter chips */}
      {contentTab === "curriculum" && (
        <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
          <span className="text-[10px] font-bold text-[#C7C7CC] tracking-[0.14em] uppercase mr-1">Filter</span>
          {[
            { id: "all",         label: "All" },
            { id: "not_started", label: "Not started" },
            { id: "in_progress", label: "In progress" },
            { id: "mastered",    label: "Mastered" },
            { id: "due",         label: "Due for revision" },
          ].map((f) => (
            <button key={f.id} onClick={() => setFilterMode(f.id)}
              className={`px-2.5 py-1 rounded-full font-semibold transition-colors ${filterMode === f.id ? "bg-[#1C1C1E] text-white" : "bg-white border border-[#E5E5EA] text-[#3A3A3C] hover:border-[#C7C7CC]"}`}>
              {f.label}
            </button>
          ))}
        </div>
      )}

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
                  <div className={`flex flex-col ${density === "compact" ? "gap-1.5" : "gap-2.5"}`}>
                    {visibleSciGroups.map((g) => (
                      <ScienceChapterCard
                        key={g.chapterNumber}
                        chapterNumber={g.chapterNumber}
                        topics={g.topics}
                        meta={metaFor(g.chapterNumber)}
                        onTopic={(topicId) => navigate(`/ncert/topics/${topicId}`)}
                        onPractice={() => navigate("/practice", {
                          state: { mixTopics: g.topics.map((t) => t.topicId), autoStart: true },
                        })}
                        {...bmProps}
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
                  <div className={`flex flex-col ${density === "compact" ? "gap-1.5" : "gap-2.5"}`}>
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
                        {...bmProps}
                      />
                    ))}
                  </div>
                )
              ) : activeSubject === "English" ? (
                visibleEngGroups.length === 0 ? (
                  <div className="card p-10 text-center space-y-2">
                    <p className="text-[28px]">📖</p>
                    <p className="text-[15px] font-semibold text-[var(--label)]">Loading English chapters…</p>
                    <p className="text-[13px] text-apple-gray">
                      Switch to <strong>AI Lessons</strong> to study now.
                    </p>
                  </div>
                ) : (
                  <div className={`flex flex-col ${density === "compact" ? "gap-1.5" : "gap-2.5"}`}>
                    {visibleEngGroups.map((g) => (
                      <EnglishChapterCard
                        key={g.chapterNumber}
                        chapterNumber={g.chapterNumber}
                        topics={g.topics}
                        meta={metaFor(g.chapterNumber)}
                        onTopic={(topicId) => navigate(`/ncert/topics/${topicId}`)}
                        onPractice={() => navigate("/practice", {
                          state: { mixTopics: g.topics.map((t) => t.topicId), autoStart: true },
                        })}
                        {...bmProps}
                      />
                    ))}
                  </div>
                )
              ) : activeSubject === "Hindi" ? (
                visibleHinGroups.length === 0 ? (
                  <div className="card p-10 text-center space-y-2">
                    <p className="text-[28px]">📖</p>
                    <p className="text-[15px] font-semibold text-[var(--label)]">Hindi chapters loading…</p>
                    <p className="text-[13px] text-apple-gray">
                      Switch to <strong>AI Lessons</strong> to study now.
                    </p>
                  </div>
                ) : (
                  <div className={`flex flex-col ${density === "compact" ? "gap-1.5" : "gap-2.5"}`}>
                    {visibleHinGroups.map((g) => (
                      <HindiChapterCard
                        key={g.chapterNumber}
                        chapterNumber={g.chapterNumber}
                        topics={g.topics}
                        meta={metaFor(g.chapterNumber)}
                        onTopic={(topicId) => navigate(`/ncert/topics/${topicId}`)}
                        onPractice={() => navigate("/practice", {
                          state: { mixTopics: g.topics.map((t) => t.topicId), autoStart: true },
                        })}
                        {...bmProps}
                      />
                    ))}
                  </div>
                )
              ) : activeSubject === "Math" && visibleMathGroups.length > 0 ? (
                <div className={`flex flex-col ${density === "compact" ? "gap-1.5" : "gap-2.5"}`}>
                  {visibleMathGroups.map((g) => (
                    <MathChapterCard
                      key={g.chapterNumber}
                      chapterNumber={g.chapterNumber}
                      topics={g.topics}
                      meta={metaFor(g.chapterNumber)}
                      titleMap={mathChapterTitles(grade, profile?.examBoard || user?.examBoard)}
                      onTopic={(topicId) => navigate(`/ncert/topics/${topicId}`)}
                      onPractice={() => navigate("/practice", {
                        state: { mixTopics: g.topics.map((t) => t.topicId), autoStart: true },
                      })}
                      {...bmProps}
                    />
                  ))}
                </div>
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
                <div className={`flex flex-col ${density === "compact" ? "gap-1.5" : "gap-2.5"}`}>
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
                <div className="bg-white shadow-sm border-l-4 border border-[#f0f0f5] rounded-2xl p-4 flex items-center justify-between gap-4" style={{ borderLeftColor: subjectColor }}>
                  <div>
                    <p className="text-[14px] font-semibold text-[#1c1c1e]">
                      Practice {scienceSub || sstSub || activeSubject} topics
                    </p>
                    <p className="text-[12px] text-[#8E8E93] mt-0.5">
                      {visibleLessons.length} topic{visibleLessons.length > 1 ? "s" : ""} available · random questions from all of them
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/practice", {
                      state: { mixTopics: visibleLessons.map((l) => l.topic), autoStart: true },
                    })}
                    className="shrink-0 px-4 py-2 rounded-full text-[13px] font-semibold text-white transition-all hover:opacity-90"
                    style={{ background: subjectColor }}
                  >
                    Practice All →
                  </button>
                </div>
              )}

              {revisionDue.length > 0 && (
                <div className="bg-white shadow-sm border-l-4 border-l-[#FF9500] border border-[#f0f0f5] rounded-2xl p-5">
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
                      bookmarked={isLessonBM(lesson)}
                      onBookmark={toggleLessonBookmark}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* #17 Pre-lesson diagnostic modal */}
      {diagOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6" onClick={() => setDiagOpen(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[16px] font-bold text-[#1c1c1e]">Skip if you already know this</h3>
              <button onClick={() => setDiagOpen(null)} className="text-[20px] text-[#C7C7CC] leading-none">×</button>
            </div>
            <p className="text-[12px] text-[#8E8E93] mb-4">Quick check on <span className="font-bold">{diagOpen.name}</span> — if you ace these, jump straight to the advanced section.</p>
            {diagOpen.questions.length === 0 ? (
              <p className="text-[13px] text-[#8E8E93] py-6 text-center">No diagnostic questions for this topic yet — going straight to the lesson.</p>
            ) : (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {diagOpen.questions.map((q, i) => (
                  <div key={q._id} className="p-3 rounded-xl bg-[#FAFAFB] border border-[#F2F2F7]">
                    <p className="text-[12px] font-bold text-[#AF52DE] mb-1">Q{i + 1}</p>
                    <p className="text-[13px] text-[#1c1c1e] mb-2">{q.questionText}</p>
                    <div className="space-y-1">
                      {q.options.map((opt, j) => (
                        <p key={j} className="text-[12px] text-[#3A3A3C]">{String.fromCharCode(65 + j)}. {opt.text}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2 mt-4">
              <button onClick={() => setDiagOpen(null)} className="flex-1 py-2.5 rounded-xl border border-[#E5E5EA] text-[12px] font-semibold text-[#3A3A3C]">Cancel</button>
              <button onClick={() => { const id = diagOpen.topicId; setDiagOpen(null); navigate(`/ncert/topics/${id}`); }}
                className="flex-1 py-2.5 rounded-xl bg-[#1C1C1E] text-white text-[12px] font-semibold">Go to topic →</button>
            </div>
          </div>
        </div>
      )}

      {/* #23 Co-study link toast */}
      {coStudyUrl && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#1C1C1E] text-white rounded-xl px-4 py-3 shadow-2xl max-w-sm">
          <p className="text-[12px] font-semibold mb-1">👥 Co-study link copied!</p>
          <p className="text-[10px] text-white/70 truncate font-mono">{coStudyUrl}</p>
          <p className="text-[10px] text-white/60 mt-1">Share with a friend — both land in the same lesson.</p>
          <button onClick={() => setCoStudyUrl(null)} className="absolute top-2 right-2 text-white/60 text-[14px] leading-none">×</button>
        </div>
      )}
    </div>
  );
}
