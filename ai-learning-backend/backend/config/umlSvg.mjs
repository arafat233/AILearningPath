/**
 * umlSvg — generate a small, theme-adaptive UML class-diagram SVG from a
 * compact spec. Used to attach `teaching.visual_aid.svg` to the LLD pattern
 * topics (rendered by components/pro/VisualAid.jsx via dangerouslySetInnerHTML).
 *
 * Design choices:
 *  - All strokes/text use `currentColor`, which inherits the VisualAid card's
 *    text colour, so the diagram adapts to light AND dark themes for free.
 *  - Box fills use a translucent neutral that reads on both themes; hollow
 *    marker interiors use var(--bg) so they look genuinely "open".
 *  - No <script>, no external refs — safe to inject as innerHTML.
 *
 * Spec:
 *   classes: [{ id, name, stereotype?, members?: string[], x, y, w? }]
 *   edges:   [{ from, to, kind, label? }]
 *     kind ∈ inherit | implement | compose | aggregate | assoc | depend
 *       inherit   — solid line, hollow triangle at `to` (the parent)
 *       implement — dashed line, hollow triangle at `to` (the interface)
 *       compose   — solid line, filled diamond at `from` (the whole)
 *       aggregate — solid line, hollow diamond at `from` (the whole)
 *       assoc     — solid line, open arrow at `to`
 *       depend    — dashed line, open arrow at `to`
 */

const FILL = "rgba(127,127,127,0.10)";
const NAME_H = 24, STEREO_H = 14, MEMBER_H = 16, PAD_X = 10, MARGIN = 14;

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function sizeOf(c) {
  const lines = [c.name, c.stereotype, ...(c.members || [])].filter(Boolean);
  const longest = lines.reduce((m, s) => Math.max(m, s.length), 0);
  const w = c.w || Math.max(120, Math.min(260, longest * 7 + 2 * PAD_X));
  const memberArea = (c.members && c.members.length) ? 8 + c.members.length * MEMBER_H + 6 : 0;
  const h = NAME_H + (c.stereotype ? STEREO_H : 0) + memberArea;
  return { w, h };
}

function borderPoint(box, towardX, towardY) {
  const cx = box.x + box.w / 2, cy = box.y + box.h / 2;
  const dx = towardX - cx, dy = towardY - cy;
  if (dx === 0 && dy === 0) return { x: cx, y: cy };
  const sx = dx !== 0 ? (box.w / 2) / Math.abs(dx) : Infinity;
  const sy = dy !== 0 ? (box.h / 2) / Math.abs(dy) : Infinity;
  const s = Math.min(sx, sy);
  return { x: cx + dx * s, y: cy + dy * s };
}

function classBox(c) {
  const { w, h } = c._size;
  let y = c.y;
  const parts = [];
  parts.push(`<rect x="${c.x}" y="${c.y}" width="${w}" height="${h}" rx="6" fill="${FILL}" stroke="currentColor" stroke-width="1.2"/>`);
  // Name compartment
  const nameY = c.stereotype ? c.y + STEREO_H + 15 : c.y + 16;
  if (c.stereotype) {
    parts.push(`<text x="${c.x + w / 2}" y="${c.y + 12}" text-anchor="middle" font-size="10" font-style="italic" fill="currentColor" opacity="0.75">${esc(c.stereotype)}</text>`);
  }
  parts.push(`<text x="${c.x + w / 2}" y="${nameY}" text-anchor="middle" font-size="12.5" font-weight="700" fill="currentColor">${esc(c.name)}</text>`);
  y = c.y + NAME_H + (c.stereotype ? STEREO_H : 0);
  if (c.members && c.members.length) {
    parts.push(`<line x1="${c.x}" y1="${y}" x2="${c.x + w}" y2="${y}" stroke="currentColor" stroke-width="1" opacity="0.5"/>`);
    let my = y + 16;
    for (const m of c.members) {
      parts.push(`<text x="${c.x + PAD_X}" y="${my}" font-size="11" font-family="ui-monospace,Menlo,Consolas,monospace" fill="currentColor" opacity="0.92">${esc(m)}</text>`);
      my += MEMBER_H;
    }
  }
  return parts.join("");
}

export function umlSvg({ classes, edges = [], title }) {
  // Measure
  for (const c of classes) c._size = sizeOf(c);
  const byId = Object.fromEntries(classes.map((c) => [c.id, { ...c, w: c._size.w, h: c._size.h }]));
  const maxX = Math.max(...classes.map((c) => c.x + c._size.w));
  const maxY = Math.max(...classes.map((c) => c.y + c._size.h));
  const W = Math.ceil(maxX + MARGIN), H = Math.ceil(maxY + MARGIN);

  // Markers (defs). Hollow shapes filled with the page background so they read open.
  const defs = `<defs>
    <marker id="uml-tri" markerWidth="16" markerHeight="14" refX="14" refY="7" orient="auto" markerUnits="userSpaceOnUse">
      <path d="M14,1 L14,13 L2,7 Z" fill="var(--bg,#fff)" stroke="currentColor" stroke-width="1.2"/></marker>
    <marker id="uml-arrow" markerWidth="12" markerHeight="12" refX="9" refY="5" orient="auto" markerUnits="userSpaceOnUse">
      <path d="M1,1 L9,5 L1,9" fill="none" stroke="currentColor" stroke-width="1.4"/></marker>
    <marker id="uml-diamond-filled" markerWidth="18" markerHeight="12" refX="1" refY="6" orient="auto" markerUnits="userSpaceOnUse">
      <path d="M1,6 L8,1 L15,6 L8,11 Z" fill="currentColor" stroke="currentColor" stroke-width="1"/></marker>
    <marker id="uml-diamond-hollow" markerWidth="18" markerHeight="12" refX="1" refY="6" orient="auto" markerUnits="userSpaceOnUse">
      <path d="M1,6 L8,1 L15,6 L8,11 Z" fill="var(--bg,#fff)" stroke="currentColor" stroke-width="1.2"/></marker>
  </defs>`;

  const edgeSvg = edges.map((e) => {
    const a = byId[e.from], b = byId[e.to];
    if (!a || !b) return "";
    const ac = { x: a.x + a.w / 2, y: a.y + a.h / 2 };
    const bc = { x: b.x + b.w / 2, y: b.y + b.h / 2 };
    const p1 = borderPoint(a, bc.x, bc.y);   // on `from` border
    const p2 = borderPoint(b, ac.x, ac.y);   // on `to` border
    const dashed = (e.kind === "implement" || e.kind === "depend") ? ` stroke-dasharray="5 4"` : "";
    let markerEnd = "", markerStart = "";
    if (e.kind === "inherit" || e.kind === "implement") markerEnd = ` marker-end="url(#uml-tri)"`;
    else if (e.kind === "assoc" || e.kind === "depend") markerEnd = ` marker-end="url(#uml-arrow)"`;
    else if (e.kind === "compose") markerStart = ` marker-start="url(#uml-diamond-filled)"`;
    else if (e.kind === "aggregate") markerStart = ` marker-start="url(#uml-diamond-hollow)"`;
    const line = `<line x1="${p1.x.toFixed(1)}" y1="${p1.y.toFixed(1)}" x2="${p2.x.toFixed(1)}" y2="${p2.y.toFixed(1)}" stroke="currentColor" stroke-width="1.4"${dashed}${markerEnd}${markerStart}/>`;
    let label = "";
    if (e.label) {
      const mx = (p1.x + p2.x) / 2, my = (p1.y + p2.y) / 2;
      label = `<text x="${mx.toFixed(1)}" y="${(my - 3).toFixed(1)}" text-anchor="middle" font-size="9.5" fill="currentColor" opacity="0.8">${esc(e.label)}</text>`;
    }
    return line + label;
  }).join("");

  const boxes = classes.map(classBox).join("");
  const titleSvg = title
    ? `<text x="${W / 2}" y="12" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor" opacity="0.85">${esc(title)}</text>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="max-width:100%;height:auto;font-family:system-ui,-apple-system,sans-serif" role="img">${defs}${titleSvg}${edgeSvg}${boxes}</svg>`;
}
