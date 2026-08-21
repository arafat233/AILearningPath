import { User } from "../models/index.js";
import { AppError } from "../utils/AppError.js";

// ── Curated career roadmaps (static content — no AI cost) ─────────
// appLinks point into surfaces that already exist in the product.
export const CAREER_PATHS = [
  {
    key: "engineering_iit",
    title: "Engineering (IIT / NIT)",
    tagline: "JEE Main + Advanced route into India's top engineering colleges",
    exams: ["JEE Main (Jan & Apr)", "JEE Advanced (May)", "BITSAT", "State CETs"],
    subjects: ["Math", "Physics", "Chemistry"],
    stages: [
      { title: "Class 9-10 — foundations", detail: "Master NCERT Math & Science cold. Weak chapters now become JEE nightmares later — use the Mastery Map to keep everything green." },
      { title: "Class 11 — concept depth", detail: "PCM with derivations, not formulas. Start PYQs early; 40% of JEE questions repeat old patterns." },
      { title: "Class 12 — mocks + boards", detail: "Alternate full-length mocks with board prep. Track your readiness score weekly; percentile matters more than raw marks." },
      { title: "After JEE", detail: "JoSAA counselling for IIT/NIT seats. Backup: BITSAT, state CETs, or a strong private college + the Pro coding track." },
    ],
    appLinks: [
      { label: "Practice weak topics", to: "/practice" },
      { label: "Mock papers", to: "/mock-paper" },
      { label: "PYQ bank", to: "/pyq" },
    ],
  },
  {
    key: "medicine_neet",
    title: "Medicine (NEET)",
    tagline: "The single-exam route to MBBS/BDS/AYUSH seats",
    exams: ["NEET-UG (May)", "AIIMS/JIPMER via NEET"],
    subjects: ["Biology", "Chemistry", "Physics"],
    stages: [
      { title: "Class 9-10 — Science base", detail: "Biology diagrams and Chemistry basics from NCERT — NEET is 80%+ NCERT-faithful." },
      { title: "Class 11 — Biology volume", detail: "NCERT Biology line-by-line; it carries 360/720 marks. Physics numericals need daily practice, not cramming." },
      { title: "Class 12 — revision cycles", detail: "Spaced revision beats re-reading. Full syllabus revision at least 3 times before May; mock tests weekly." },
      { title: "After NEET", detail: "MCC counselling for MBBS/BDS. Backups: BSc nursing, pharmacy, allied health, or research via INSPIRE." },
    ],
    appLinks: [
      { label: "Practice weak topics", to: "/practice" },
      { label: "Revision due today", to: "/bookmarks" },
      { label: "Mistake notebook", to: "/mistakes" },
    ],
  },
  {
    key: "ai_data_science",
    title: "AI / Data Science",
    tagline: "Math-heavy path into the fastest-growing tech field",
    exams: ["JEE (for IIT AI programs)", "IISER Aptitude Test", "CUET"],
    subjects: ["Math", "Statistics", "Computer Science"],
    stages: [
      { title: "Class 9-10 — Math obsession", detail: "Probability, statistics, and algebra are the literal foundations of ML. Master them here, free." },
      { title: "Class 11-12 — code + calculus", detail: "Learn Python alongside school Math. Calculus and linear algebra (Class 12) are exactly what neural networks run on." },
      { title: "College — degree or self-taught", detail: "BTech CS/AI, BSc Data Science, or any degree + a strong project portfolio. Kaggle competitions count more than marks." },
      { title: "Break in", detail: "The Pro interview track covers DSA + system design — the actual hiring bar at AI companies." },
    ],
    appLinks: [
      { label: "Practice Math", to: "/practice" },
      { label: "Pro coding track", to: "/pro" },
    ],
  },
  {
    key: "software_dev",
    title: "Software Development",
    tagline: "From school math to a developer job — degree optional, skills mandatory",
    exams: ["JEE / CUET (optional)", "Company hiring tests"],
    subjects: ["Math", "Computer Science", "Logic"],
    stages: [
      { title: "Class 9-12 — logic base", detail: "School Math trains the exact reasoning that programming needs. Start any free coding course alongside." },
      { title: "Learn one language deeply", detail: "Java or Python. Build 3 real projects you can demo, not 30 tutorials you watched." },
      { title: "DSA + interviews", detail: "Data structures and algorithms are the hiring filter everywhere. The Pro track drills LLD, system design, and interview simulation." },
      { title: "First job", detail: "Internships > certificates. Contribute to open source; a merged pull request is a resume line no course can match." },
    ],
    appLinks: [
      { label: "Pro coding track", to: "/pro" },
      { label: "Interview practice", to: "/pro" },
    ],
  },
  {
    key: "commerce_ca",
    title: "Commerce (CA / Finance)",
    tagline: "Chartered Accountancy and the finance route",
    exams: ["CA Foundation (after 12th)", "CUET", "IPMAT"],
    subjects: ["Math", "Economics", "Accountancy"],
    stages: [
      { title: "Class 9-10 — numbers fluency", detail: "Percentages, ratios, and interest calculations from school Math are daily tools in accounting." },
      { title: "Class 11-12 — commerce stream", detail: "Accountancy + Economics + Math. CA Foundation registration opens right after Class 12." },
      { title: "CA journey", detail: "Foundation → Intermediate → Articleship (3 yrs) → Final. Long but self-funded and prestige-heavy. Backup: BCom + MBA via CAT." },
      { title: "Alternatives", detail: "CS, CMA, banking exams, or BBA/IPM programs — all share the same school-math foundation." },
    ],
    appLinks: [
      { label: "Practice Math", to: "/practice" },
      { label: "Study planner", to: "/planner" },
    ],
  },
];

// ── Curated scholarship / talent-exam tracker (India, school-level) ─
// typicalWindow is indicative — official dates shift yearly; always verify on the official site.
export const SCHOLARSHIPS = [
  { id: "nmms",        name: "NMMS Scholarship",                grades: ["8"],                body: "Ministry of Education", award: "₹12,000/yr through Class 12", typicalWindow: "Aug–Oct (state-wise)", note: "Means-cum-merit: family income cap applies." },
  { id: "inspire_she", name: "INSPIRE SHE",                     grades: ["11", "12"],         body: "DST, Govt of India", award: "₹80,000/yr for BSc/MSc in sciences", typicalWindow: "Oct–Dec (after Class 12 results)", note: "Top 1% in boards or JEE/NEET rank holders pursuing basic sciences." },
  { id: "nsejs",       name: "Junior Science Olympiad (NSEJS)", grades: ["8", "9", "10"],     body: "IAPT / HBCSE", award: "Path to International Olympiads", typicalWindow: "Registration Aug–Sep, exam Nov", note: "Gateway to OCSC camps and international teams." },
  { id: "nsep_nsec",   name: "Physics/Chemistry Olympiads (NSEP/NSEC)", grades: ["11", "12"], body: "IAPT", award: "Olympiad medals + IISc/IISER edge", typicalWindow: "Registration Aug–Sep, exam Nov", note: "Strong signal for research-track admissions." },
  { id: "imo_ioqm",    name: "Math Olympiad (IOQM)",            grades: ["8", "9", "10", "11", "12"], body: "MTA / HBCSE", award: "Path to IMO; INMO awardees get IISc/CMI edge", typicalWindow: "Registration Jun–Aug, exam Sep", note: "Hardest but highest-prestige school competition." },
  { id: "vidyadhan",   name: "Vidyadhan Scholarship",           grades: ["10", "11"],         body: "Sarojini Damodaran Foundation", award: "Up to ₹60,000/yr through college", typicalWindow: "May–Jul (state-wise)", note: "For students with family income under ₹3L; selection after Class 10." },
  { id: "ntse",        name: "NTSE",                            grades: ["10"],               body: "NCERT", award: "₹1,250–2,000/mo through PhD", typicalWindow: "Currently suspended", note: "Suspended since 2021 — check NCERT for revival announcements before planning around it." },
  { id: "pmsss",       name: "AICTE Pragati / Saksham",         grades: ["12"],               body: "AICTE", award: "₹50,000/yr for technical degrees", typicalWindow: "Sep–Nov", note: "Pragati: girl students; Saksham: differently-abled students." },
];

// ── Service functions ─────────────────────────────────────────────
export function listCareerPaths() {
  return CAREER_PATHS;
}

export async function getCareerState(userId) {
  const u = await User.findById(userId).select("careerPath trackedScholarships grade").lean();
  const grade = u?.grade || null;
  const scholarships = SCHOLARSHIPS
    .filter((s) => !grade || s.grades.includes(String(grade)))
    .map((s) => ({ ...s, tracked: (u?.trackedScholarships || []).includes(s.id) }));
  return { careerPath: u?.careerPath || null, grade, scholarships };
}

export async function setCareerPath(userId, key) {
  if (key !== null && !CAREER_PATHS.some((p) => p.key === key)) {
    throw new AppError("Unknown career path", 400);
  }
  await User.findByIdAndUpdate(userId, { $set: { careerPath: key } });
  return { careerPath: key };
}

export async function toggleScholarship(userId, id) {
  if (!SCHOLARSHIPS.some((s) => s.id === id)) throw new AppError("Unknown scholarship", 400);
  const u = await User.findById(userId).select("trackedScholarships").lean();
  const tracked = (u?.trackedScholarships || []).includes(id);
  await User.findByIdAndUpdate(userId, tracked ? { $pull: { trackedScholarships: id } } : { $addToSet: { trackedScholarships: id } });
  return { id, tracked: !tracked };
}
