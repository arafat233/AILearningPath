/**
 * seedProVisualAidScanner.js — re-author java_m1_t6 (Reading User Input with
 * Scanner) visual_aid as the diagram its brief actually describes, instead of
 * two text panels:
 *   keyboard → System.in (stdin) → Scanner sc → branches (nextInt/nextLine/
 *   nextDouble) ; then the newline-buffer bug (28\n → nextInt takes 28, leaves
 *   \n → next nextLine() returns '') ; then the throwaway-nextLine() fix.
 * Idempotent. Usage: node config/seedProVisualAidScanner.js
 */
import "dotenv/config";
import mongoose from "mongoose";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const BLUE = ["rgba(10,132,255,0.10)", "rgba(10,132,255,0.5)"];
const GREEN = ["rgba(48,209,88,0.13)", "rgba(48,209,88,0.55)"];
const REDT = ["rgba(255,69,58,0.13)", "rgba(255,69,58,0.55)"];
const GRAY = ["rgba(142,142,147,0.12)", "rgba(142,142,147,0.5)"];
const ARR = "rgba(140,140,148,0.95)";
const RED = "rgba(255,69,58,0.9)";
const GRN = "rgba(40,170,80,0.95)";

const box = (x, y, w, h, c, rx = 9) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${c[0]}" stroke="${c[1]}"/>`;
const txt = (x, y, t, o = {}) => `<text x="${x}" y="${y}" font-size="${o.s || 11}" font-weight="${o.w || 400}" text-anchor="${o.a || "start"}" opacity="${o.o ?? 1}"${o.fill ? ` fill="${o.fill}"` : ""}${o.mono ? ' font-family="ui-monospace,Menlo,monospace"' : ""}>${esc(t)}</text>`;
const arr = (x1, y1, x2, y2, red = false) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${red ? RED : ARR}"${red ? ' stroke-dasharray="4 3"' : ""} marker-end="url(#${red ? "ahr" : "ah"})"/>`;

function scanner() {
  let g = "";
  // defs handled in wrapper
  // ── keyboard (top-left) ──
  g += `<rect x="40" y="20" width="96" height="34" rx="6" fill="${GRAY[0]}" stroke="${GRAY[1]}"/>`;
  for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) g += `<rect x="${48 + c * 12}" y="${25 + r * 9}" width="9" height="6" rx="1.5" fill="rgba(142,142,147,0.5)"/>`;
  g += txt(88, 67, "you type: 28 ⏎  Aisha Khan", { a: "middle", s: 9.5, o: 0.7 });
  g += arr(88, 54, 88, 80); // keyboard → stdin
  // ── System.in box ──
  g += box(30, 82, 116, 42, BLUE);
  g += txt(88, 100, "System.in", { a: "middle", w: 700, s: 12 });
  g += txt(88, 114, "(stdin stream)", { a: "middle", s: 9, o: 0.65 });
  g += arr(146, 103, 192, 103); // stdin → Scanner
  // ── Scanner box ──
  g += box(194, 82, 108, 42, BLUE);
  g += txt(248, 100, "Scanner sc", { a: "middle", w: 700, s: 12 });
  g += txt(248, 114, "wraps the stream", { a: "middle", s: 9, o: 0.65 });
  // ── three method branches → return-value pills ──
  const pills = [
    [50, "sc.nextInt()", "42"],
    [103, "sc.nextLine()", '"Aisha Khan"'],
    [156, "sc.nextDouble()", "19.99"],
  ];
  pills.forEach(([y, call, ret]) => {
    g += arr(302, 103, 372, y + 15);
    g += box(372, y, 300, 30, GREEN);
    g += txt(384, y + 19, call, { mono: true, s: 11, w: 600 });
    g += txt(504, y + 19, "→", { s: 12, o: 0.6 });
    g += txt(522, y + 19, ret, { mono: true, s: 11, w: 700, fill: GRN });
  });

  // ── divider ──
  g += `<line x1="14" y1="196" x2="746" y2="196" stroke="rgba(142,142,147,0.25)"/>`;

  // ── newline bug ──
  g += txt(14, 220, "The newline bug — why the first nextLine() comes back empty", { w: 700, s: 12 });
  g += txt(14, 246, "stdin buffer after you type 28 ⏎ :", { s: 10.5, o: 0.8 });
  // buffer cells: 2 8 \n
  const cells = [["2", GRAY], ["8", GRAY], ["\\n", REDT]];
  cells.forEach(([ch, c], i) => {
    const x = 246 + i * 30;
    g += `<rect x="${x}" y="234" width="28" height="28" rx="5" fill="${c[0]}" stroke="${c[1]}"/>`;
    g += txt(x + 14, 252, ch, { a: "middle", mono: true, s: 11, w: 700, fill: ch === "\\n" ? RED : undefined });
  });
  // nextInt consumes 2,8
  g += `<path d="M246,266 L246,272 L304,272 L304,266" fill="none" stroke="${GRN}"/>`;
  g += txt(275, 285, "nextInt() takes 28", { a: "middle", s: 9.5, fill: GRN, w: 600 });
  // leftover \n pointer
  g += txt(390, 240, "← '\\n' left behind in the buffer", { s: 10, fill: RED, w: 600 });
  g += txt(390, 258, "next sc.nextLine() reads up to that '\\n' →", { s: 10, o: 0.85 });
  g += `<rect x="390" y="270" width="120" height="24" rx="5" fill="${REDT[0]}" stroke="${REDT[1]}"/>`;
  g += txt(450, 286, '"" (empty!)', { a: "middle", mono: true, s: 11, w: 700, fill: RED });
  g += txt(522, 286, "— returns instantly, never waits for you", { s: 9.5, o: 0.7 });

  // ── divider ──
  g += `<line x1="14" y1="308" x2="746" y2="308" stroke="rgba(142,142,147,0.25)"/>`;

  // ── the fix ──
  g += txt(14, 332, "The fix — one throwaway nextLine() to eat the leftover '\\n'", { w: 700, s: 12, fill: GRN });
  g += box(14, 344, 372, 70, GREEN, 8);
  g += txt(26, 364, "int age = sc.nextInt();", { mono: true, s: 10.5 });
  g += txt(26, 382, "sc.nextLine();", { mono: true, s: 10.5, w: 700, fill: GRN });
  g += txt(150, 382, "// throwaway — consumes the '\\n'", { mono: true, s: 9.5, o: 0.7 });
  g += txt(26, 400, "String name = sc.nextLine();", { mono: true, s: 10.5 });
  g += txt(232, 400, "// now reads the line", { mono: true, s: 9.5, o: 0.7 });
  // after-fix buffer: empty → name read correctly
  g += txt(410, 364, "buffer after throwaway:", { s: 10, o: 0.8 });
  g += `<rect x="410" y="372" width="120" height="26" rx="5" fill="${GRAY[0]}" stroke="${GRAY[1]}"/>`;
  g += txt(470, 389, "(empty)", { a: "middle", mono: true, s: 10, o: 0.6 });
  g += arr(534, 385, 566, 385);
  g += `<rect x="570" y="372" width="170" height="26" rx="5" fill="${GREEN[0]}" stroke="${GREEN[1]}"/>`;
  g += txt(655, 389, '"Aisha Khan" ✓', { a: "middle", mono: true, s: 10.5, w: 700, fill: GRN });

  return `<svg viewBox="0 0 760 424" width="100%" style="max-width:760px;font-family:ui-sans-serif,system-ui" fill="currentColor">`
    + `<defs><marker id="ah" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="${ARR}"/></marker>`
    + `<marker id="ahr" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="${RED}"/></marker></defs>${g}</svg>`;
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const T = mongoose.connection.collection("protopics");
  const s = scanner();
  const r = await T.updateOne({ topicId: "java_m1_t6", "teaching.visual_aid": { $exists: true } }, { $set: { "teaching.visual_aid.svg": s } });
  console.log(r.matchedCount ? `✅ java_m1_t6 scanner diagram set (${s.length}b).` : "✗ java_m1_t6 missing");
  await mongoose.disconnect();
}
run().catch((e) => { console.error(e); process.exit(1); });
