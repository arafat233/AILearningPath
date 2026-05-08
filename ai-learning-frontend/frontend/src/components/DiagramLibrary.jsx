import React from "react";

const T = ({ x, y, size = 10, bold = false, color = "currentColor", align = "start", children }) => (
  <text x={x} y={y} fontSize={size} fill={color} fontFamily="system-ui,sans-serif"
        fontWeight={bold ? 700 : 400} textAnchor={align}>{children}</text>
);

/* ── BIOLOGY ─────────────────────────────────────────────────────── */

function DigestiveSystem() {
  return (
    <svg viewBox="0 0 260 380" style={{ width: "100%", maxWidth: 260, height: "auto" }}>
      <ellipse cx="130" cy="24" rx="26" ry="12" fill="#FECACA" stroke="#EF4444" strokeWidth="1.5"/>
      <T x={160} y={28}>Mouth</T>
      <rect x="123" y="36" width="14" height="50" rx="5" fill="#FCA5A5" stroke="#DC2626" strokeWidth="1.5"/>
      <T x={142} y={63}>Oesophagus</T>
      <path d="M122 86 C96 92 90 120 94 144 C98 164 116 174 136 174 C155 174 162 160 162 144 L156 86 Z"
            fill="#FCA5A5" stroke="#DC2626" strokeWidth="1.5"/>
      <T x={164} y={132}>Stomach</T>
      <path d="M60 100 C50 93 48 110 54 126 C60 142 78 148 96 140 C102 137 100 126 95 116 C88 104 72 100 60 100Z"
            fill="#92400E" stroke="#78350F" strokeWidth="1.5" opacity="0.82"/>
      <T x={20} y={156} size={9}>Liver</T>
      <line x1="95" y1="140" x2="122" y2="163" stroke="#D97706" strokeWidth="1.5" strokeDasharray="3,2"/>
      <path d="M100 174 C84 170 78 177 82 185 C86 193 104 195 120 189 C126 187 126 179 118 175Z"
            fill="#FDE68A" stroke="#D97706" strokeWidth="1.5"/>
      <T x={30} y={170} size={9}>Pancreas</T>
      <path d="M128 176 C82 184 76 206 80 226 C84 246 108 252 128 248 C148 244 154 228 152 210 C150 194 132 190 120 196 C112 200 110 212 114 220 C118 228 130 230 138 228 C146 226 148 218 146 210 C144 202 136 198 130 200"
            fill="none" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round"/>
      <T x={162} y={214}>Small</T>
      <T x={162} y={226}>intestine</T>
      <line x1="158" y1="248" x2="158" y2="212" stroke="#C2410C" strokeWidth="5" strokeLinecap="round"/>
      <line x1="80" y1="248" x2="158" y2="248" stroke="#C2410C" strokeWidth="5" strokeLinecap="round"/>
      <line x1="80" y1="248" x2="80" y2="288" stroke="#C2410C" strokeWidth="5" strokeLinecap="round"/>
      <path d="M80 288 C84 306 96 318 114 314 C128 310 136 298 136 284 L136 272"
            fill="none" stroke="#C2410C" strokeWidth="5" strokeLinecap="round"/>
      <T x={162} y={270}>Large</T>
      <T x={162} y={282}>intestine</T>
      <rect x="130" y="310" width="12" height="28" rx="4" fill="#FCA5A5" stroke="#DC2626" strokeWidth="1.5"/>
      <T x={148} y={328} size={9}>Rectum</T>
      <ellipse cx="136" cy="344" rx="8" ry="5" fill="#FECACA" stroke="#DC2626" strokeWidth="1.5"/>
      <T x={148} y={348} size={9}>Anus</T>
    </svg>
  );
}

function Heart() {
  return (
    <svg viewBox="0 0 300 255" style={{ width: "100%", maxWidth: 300, height: "auto" }}>
      <path d="M162 85 C178 80 200 84 205 102 C210 120 202 134 186 136 L170 134 L162 112Z"
            fill="#93C5FD" stroke="#3B82F6" strokeWidth="1.5"/>
      <T x={175} y={110} size={9} bold color="#1E40AF">RA</T>
      <path d="M156 136 C172 134 190 137 195 158 C200 178 188 200 166 208 L145 212 L140 164Z"
            fill="#BFDBFE" stroke="#3B82F6" strokeWidth="1.5"/>
      <T x={163} y={172} size={9} bold color="#1E40AF">RV</T>
      <path d="M138 85 C122 80 100 84 95 102 C90 120 98 134 114 136 L130 134 L138 112Z"
            fill="#FCA5A5" stroke="#EF4444" strokeWidth="1.5"/>
      <T x={100} y={110} size={9} bold color="#B91C1C">LA</T>
      <path d="M144 136 C128 134 108 137 103 158 C98 180 110 202 130 212 L150 216 L160 164Z"
            fill="#FEE2E2" stroke="#EF4444" strokeWidth="2"/>
      <T x={109} y={175} size={9} bold color="#B91C1C">LV</T>
      <line x1="150" y1="86" x2="150" y2="214" stroke="#9CA3AF" strokeWidth="1.5" strokeDasharray="3,2"/>
      <path d="M136 78 C136 62 142 52 148 44 C154 52 160 62 164 78" fill="#FCA5A5" stroke="#DC2626" strokeWidth="3"/>
      <T x={154} y={40} size={9} color="#B91C1C">Aorta</T>
      <rect x="172" y="44" width="13" height="38" rx="4" fill="#93C5FD" stroke="#2563EB" strokeWidth="1.5"/>
      <T x={188} y={62} size={8}>SVC</T>
      <path d="M198 90 C210 82 222 80 230 84" fill="none" stroke="#93C5FD" strokeWidth="3" strokeLinecap="round"/>
      <T x={220} y={78} size={8} color="#1D4ED8">Pulm.</T>
      <T x={220} y={88} size={8} color="#1D4ED8">Artery</T>
      <path d="M70 90 C82 84 92 86 95 92" fill="none" stroke="#FCA5A5" strokeWidth="3" strokeLinecap="round"/>
      <T x={28} y={84} size={8} color="#B91C1C">Pulm.</T>
      <T x={28} y={94} size={8} color="#B91C1C">Veins</T>
      <rect x="180" y="160" width="12" height="30" rx="3" fill="#93C5FD" stroke="#2563EB" strokeWidth="1.5"/>
      <T x={195} y={178} size={8}>IVC</T>
      <rect x="6" y="234" width="10" height="10" fill="#93C5FD" stroke="#3B82F6" strokeWidth="1"/>
      <T x={20} y={243} size={9}>Deoxygenated blood</T>
      <rect x="6" y="248" width="10" height="10" fill="#FCA5A5" stroke="#EF4444" strokeWidth="1"/>
      <T x={20} y={257} size={9}>Oxygenated blood</T>
    </svg>
  );
}

function Neuron() {
  return (
    <svg viewBox="0 0 420 160" style={{ width: "100%", maxWidth: 420, height: "auto" }}>
      <line x1="40" y1="58" x2="80" y2="78" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round"/>
      <line x1="38" y1="76" x2="80" y2="83" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round"/>
      <line x1="40" y1="96" x2="80" y2="87" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round"/>
      <line x1="42" y1="112" x2="80" y2="90" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="40" y1="58" x2="22" y2="46" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="38" y1="76" x2="18" y2="70" stroke="#8B5CF6" strokeWidth="1" strokeLinecap="round"/>
      <T x={4} y={42} size={9} color="#7C3AED">Dendrites</T>
      <circle cx="100" cy="84" r="22" fill="#DDD6FE" stroke="#7C3AED" strokeWidth="2"/>
      <circle cx="100" cy="84" r="10" fill="#A78BFA" stroke="#6D28D9" strokeWidth="1.5"/>
      <T x={94} y={88} size={8} color="#3730A3">N</T>
      <T x={72} y={120} size={9} color="#5B21B6">Cell body</T>
      <line x1="122" y1="84" x2="144" y2="84" stroke="#374151" strokeWidth="3" strokeLinecap="round"/>
      {[144,174,204,234,264,294,324].map((x, i) => (
        <rect key={i} x={x} y={76} width={24} height={16} rx="4"
              fill={i % 2 === 0 ? "#FDE68A" : "#FCD34D"} stroke="#D97706" strokeWidth="1"/>
      ))}
      <line x1="144" y1="84" x2="356" y2="84" stroke="#374151" strokeWidth="2"/>
      {[168,198,228,258,288,318].map(x => (
        <circle key={x} cx={x} cy={84} r={3} fill="#374151"/>
      ))}
      <T x={185} y={106} size={9} color="#92400E">Myelin sheath</T>
      <T x={222} y={116} size={8} color="#6B7280">Nodes of Ranvier</T>
      <line x1="356" y1="84" x2="378" y2="64" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
      <line x1="356" y1="84" x2="382" y2="78" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
      <line x1="356" y1="84" x2="382" y2="90" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
      <line x1="356" y1="84" x2="378" y2="104" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="382" cy="62" r="4" fill="#EF4444" stroke="#DC2626" strokeWidth="1"/>
      <circle cx="386" cy="77" r="4" fill="#EF4444" stroke="#DC2626" strokeWidth="1"/>
      <circle cx="386" cy="91" r="4" fill="#EF4444" stroke="#DC2626" strokeWidth="1"/>
      <circle cx="382" cy="106" r="4" fill="#EF4444" stroke="#DC2626" strokeWidth="1"/>
      <T x={355} y={132} size={9}>Axon</T>
      <T x={345} y={142} size={9}>terminals</T>
    </svg>
  );
}

function Nephron() {
  return (
    <svg viewBox="0 0 270 330" style={{ width: "100%", maxWidth: 260, height: "auto" }}>
      <circle cx="130" cy="48" r="30" fill="none" stroke="#3B82F6" strokeWidth="2"/>
      <circle cx="130" cy="46" r="16" fill="#BFDBFE" stroke="#2563EB" strokeWidth="1.5"/>
      <path d="M118 40 C122 36 128 44 132 38 C136 34 138 42 140 38" fill="none" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M118 48 C122 44 126 52 130 46 C134 42 137 50 140 46" fill="none" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round"/>
      <T x={88} y={14} size={9} color="#1E40AF">Bowman's capsule</T>
      <T x={108} y={50} size={8} color="#1E3A8A">Glomerulus</T>
      <path d="M100 40 C84 36 74 30 66 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round"/>
      <T x={30} y={22} size={8} color="#B91C1C">Afferent</T>
      <path d="M104 56 C88 56 76 58 66 62" fill="none" stroke="#93C5FD" strokeWidth="2.5" strokeLinecap="round"/>
      <T x={30} y={64} size={8} color="#1D4ED8">Efferent</T>
      <path d="M130 78 C160 84 165 96 148 104 C131 112 120 108 116 120 C112 132 124 140 140 144 C156 148 162 140 158 130"
            fill="none" stroke="#34C759" strokeWidth="3" strokeLinecap="round"/>
      <T x={166} y={112} size={9} color="#166534">PCT</T>
      <path d="M158 130 C162 144 164 162 160 180 C156 198 148 208 140 208 C132 208 124 198 120 180 C116 162 118 144 122 130"
            fill="none" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"/>
      <T x={166} y={176} size={9} color="#92400E">Loop of</T>
      <T x={166} y={188} size={9} color="#92400E">Henle</T>
      <path d="M122 130 C108 134 102 144 118 152 C134 160 136 170 122 176"
            fill="none" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round"/>
      <T x={40} y={152} size={9} color="#5B21B6">DCT</T>
      <path d="M122 176 C120 190 122 210 124 228 C126 246 130 258 130 272"
            fill="none" stroke="#6B7280" strokeWidth="3" strokeLinecap="round"/>
      <T x={136} y={250} size={9}>Collecting</T>
      <T x={136} y={262} size={9}>duct</T>
      <line x1="130" y1="272" x2="130" y2="290" stroke="#6B7280" strokeWidth="2"/>
      <polygon points="124,287 136,287 130,296" fill="#6B7280"/>
      <T x={136} y={296} size={9}>Urine</T>
    </svg>
  );
}

function ReflexArc() {
  return (
    <svg viewBox="0 0 400 210" style={{ width: "100%", maxWidth: 400, height: "auto" }}>
      <ellipse cx="17" cy="130" rx="8" ry="12" fill="#FECACA" stroke="#DC2626" strokeWidth="1.5"/>
      <rect x="10" y="140" width="14" height="22" rx="4" fill="#FCA5A5" stroke="#EF4444" strokeWidth="1.5"/>
      <line x1="28" y1="118" x2="17" y2="126" stroke="#9CA3AF" strokeWidth="1.5"/>
      <circle cx="30" cy="116" r="3" fill="#6B7280"/>
      <T x={2} y={175} size={9}>Stimulus</T>
      <T x={2} y={186} size={9}>(receptor)</T>
      <path d="M28 128 C60 110 100 95 140 90" fill="none" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round"/>
      <polygon points="134,86 148,90 138,97" fill="#8B5CF6"/>
      <T x={48} y={98} size={9} color="#6D28D9">Sensory neuron</T>
      <ellipse cx="186" cy="104" rx="34" ry="26" fill="#FDE68A" stroke="#D97706" strokeWidth="2"/>
      <path d="M172 96 L172 112 M200 96 L200 112 M172 104 L200 104" stroke="#B45309" strokeWidth="3" strokeLinecap="round"/>
      <T x={160} y={146} size={9} color="#92400E">Spinal cord</T>
      <path d="M220 112 C262 118 300 128 340 140" fill="none" stroke="#34C759" strokeWidth="2.5" strokeLinecap="round"/>
      <polygon points="333,135 346,138 336,146" fill="#34C759"/>
      <T x={246} y={148} size={9} color="#166534">Motor neuron</T>
      <path d="M346 135 C360 130 374 134 376 144 C378 154 366 162 352 162 C338 162 338 152 346 148 C354 144 360 146 360 152"
            fill="#FCA5A5" stroke="#EF4444" strokeWidth="1.5"/>
      <T x={346} y={178} size={9}>Effector</T>
      <T x={344} y={188} size={9}>(muscle)</T>
      <path d="M60 172 C130 188 260 188 320 172" fill="none" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="3,3"/>
      <T x={148} y={202} size={8} color="#9CA3AF">Reflex arc (involuntary pathway)</T>
    </svg>
  );
}

function Flower() {
  return (
    <svg viewBox="0 0 260 300" style={{ width: "100%", maxWidth: 240, height: "auto" }}>
      <line x1="130" y1="275" x2="130" y2="222" stroke="#16A34A" strokeWidth="4" strokeLinecap="round"/>
      <T x={138} y={272} size={9} color="#166534">Receptacle</T>
      <path d="M130 222 C118 210 104 212 108 224 C112 236 122 232 130 222Z" fill="#4ADE80" stroke="#16A34A" strokeWidth="1"/>
      <path d="M130 222 C142 210 156 212 152 224 C148 236 138 232 130 222Z" fill="#4ADE80" stroke="#16A34A" strokeWidth="1"/>
      <path d="M130 222 C112 218 104 228 116 230 C122 232 126 228 130 222Z" fill="#86EFAC" stroke="#16A34A" strokeWidth="1"/>
      <path d="M130 222 C148 218 156 228 144 230 C138 232 134 228 130 222Z" fill="#86EFAC" stroke="#16A34A" strokeWidth="1"/>
      <T x={158} y={228} size={9} color="#166534">Sepal</T>
      <path d="M130 185 C114 165 108 140 120 128 C128 120 136 124 130 185Z" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1.5"/>
      <path d="M130 185 C146 165 152 140 140 128 C132 120 124 124 130 185Z" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1.5"/>
      <path d="M130 185 C106 180 82 170 78 156 C74 144 82 138 130 185Z" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1.5"/>
      <path d="M130 185 C154 180 178 170 182 156 C186 144 178 138 130 185Z" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1.5"/>
      <path d="M130 185 C108 195 88 200 82 188 C78 178 86 170 130 185Z" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1.5"/>
      <path d="M130 185 C152 195 172 200 178 188 C182 178 174 170 130 185Z" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1.5"/>
      <T x={186} y={148} size={9} color="#B45309">Petal</T>
      <ellipse cx="130" cy="198" rx="16" ry="12" fill="#FCA5A5" stroke="#EF4444" strokeWidth="1.5"/>
      <ellipse cx="124" cy="198" rx="5" ry="4" fill="#FECACA" stroke="#EF4444" strokeWidth="1"/>
      <ellipse cx="136" cy="198" rx="5" ry="4" fill="#FECACA" stroke="#EF4444" strokeWidth="1"/>
      <rect x="127" y="174" width="6" height="22" rx="2" fill="#F87171" stroke="#DC2626" strokeWidth="1"/>
      <ellipse cx="130" cy="172" rx="10" ry="5" fill="#DC2626" stroke="#B91C1C" strokeWidth="1.5"/>
      <T x={148} y={172} size={9} color="#B91C1C">Stigma</T>
      <T x={148} y={184} size={9} color="#B91C1C">Style</T>
      <T x={148} y={200} size={9} color="#B91C1C">Ovary + Ovules</T>
      <line x1="110" y1="172" x2="108" y2="192" stroke="#D97706" strokeWidth="1.5"/>
      <ellipse cx="108" cy="168" rx="8" ry="6" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5"/>
      <circle cx="106" cy="167" r="2" fill="#D97706"/>
      <circle cx="111" cy="165" r="2" fill="#D97706"/>
      <circle cx="108" cy="171" r="2" fill="#D97706"/>
      <line x1="150" y1="172" x2="152" y2="192" stroke="#D97706" strokeWidth="1.5"/>
      <ellipse cx="152" cy="168" rx="8" ry="6" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5"/>
      <circle cx="150" cy="167" r="2" fill="#D97706"/>
      <circle cx="155" cy="165" r="2" fill="#D97706"/>
      <circle cx="152" cy="171" r="2" fill="#D97706"/>
      <T x={46} y={162} size={9} color="#92400E">Anther</T>
      <T x={44} y={174} size={9} color="#92400E">Filament</T>
      <T x={40} y={186} size={8} color="#9CA3AF">= Stamen</T>
    </svg>
  );
}

/* ── PHYSICS ─────────────────────────────────────────────────────── */

function HumanEye() {
  return (
    <svg viewBox="0 0 320 220" style={{ width: "100%", maxWidth: 320, height: "auto" }}>
      <ellipse cx="155" cy="110" rx="110" ry="85" fill="#F9FAFB" stroke="#D1D5DB" strokeWidth="2"/>
      <path d="M95 50 C130 44 180 44 215 50 L245 110 L215 170 C180 176 130 176 95 170 L65 110 Z"
            fill="#BFDBFE" stroke="#3B82F6" strokeWidth="1.5" opacity="0.6"/>
      <ellipse cx="165" cy="110" rx="78" ry="70" fill="rgba(219,234,254,0.3)" stroke="none"/>
      <path d="M50 85 C34 85 28 110 34 110 C28 110 34 135 50 135" fill="rgba(147,197,253,0.5)" stroke="#3B82F6" strokeWidth="2"/>
      <T x={6} y={113} size={9} color="#1D4ED8">Cornea</T>
      <circle cx="80" cy="110" r="28" fill="#D97706" stroke="#B45309" strokeWidth="1.5"/>
      <line x1="80" y1="82" x2="80" y2="138" stroke="#92400E" strokeWidth="0.8" opacity="0.5"/>
      <line x1="56" y1="93" x2="104" y2="127" stroke="#92400E" strokeWidth="0.8" opacity="0.5"/>
      <line x1="56" y1="127" x2="104" y2="93" stroke="#92400E" strokeWidth="0.8" opacity="0.5"/>
      <circle cx="80" cy="110" r="14" fill="#111827"/>
      <T x={50} y={154} size={9} color="#92400E">Iris</T>
      <T x={50} y={165} size={9}>Pupil</T>
      <path d="M108 94 C118 102 118 118 108 126 C120 118 120 102 108 94Z" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5"/>
      <path d="M108 94 C98 102 98 118 108 126 C100 118 100 102 108 94Z" fill="#FCD34D" stroke="#D97706" strokeWidth="1.5"/>
      <T x={98} y={147} size={9} color="#B45309">Lens</T>
      <path d="M108 88 C116 84 122 88 122 90" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
      <path d="M108 132 C116 136 122 132 122 130" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
      <T x={124} y={88} size={8} color="#6B7280">Ciliary muscle</T>
      <circle cx="215" cy="110" r="6" fill="#EF4444" stroke="#DC2626" strokeWidth="1.5"/>
      <T x={218} y={107} size={8} color="#DC2626">Fovea</T>
      <ellipse cx="225" cy="130" rx="8" ry="5" fill="#9CA3AF" stroke="#6B7280" strokeWidth="1"/>
      <T x={236} y={133} size={8} color="#6B7280">Blind spot</T>
      <rect x="240" y="104" width="28" height="12" rx="4" fill="#FCA5A5" stroke="#EF4444" strokeWidth="1.5"/>
      <T x={240} y={130} size={8} color="#B91C1C">Optic nerve</T>
      <T x={148} y={116} size={9} color="#6B7280">Vitreous humor</T>
      <T x={188} y={182} size={9} color="#1D4ED8">Retina</T>
      <T x={230} y={60} size={9} color="#6B7280">Sclera</T>
    </svg>
  );
}

function MirrorDiagrams() {
  return (
    <svg viewBox="0 0 360 290" style={{ width: "100%", maxWidth: 360, height: "auto" }}>
      <T x={8} y={16} size={10} bold>Concave Mirror</T>
      <line x1="10" y1="80" x2="330" y2="80" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="4,3"/>
      <path d="M300 30 Q280 80 300 130" fill="none" stroke="#374151" strokeWidth="3" strokeLinecap="round"/>
      <path d="M302 30 Q290 80 302 130" fill="rgba(156,163,175,0.25)" stroke="none"/>
      <T x={306} y={82} size={9}>Mirror</T>
      <circle cx="220" cy="80" r="3" fill="#374151"/>
      <T x={216} y={96} size={9}>C</T>
      <circle cx="260" cy="80" r="3" fill="#374151"/>
      <T x={256} y={96} size={9}>F</T>
      <circle cx="298" cy="80" r="3" fill="#374151"/>
      <T x={294} y={96} size={9}>P</T>
      <line x1="140" y1="80" x2="140" y2="44" stroke="#1D4ED8" strokeWidth="2"/>
      <polygon points="136,46 144,46 140,38" fill="#1D4ED8"/>
      <T x={116} y={38} size={9} color="#1D4ED8">Object</T>
      <line x1="140" y1="44" x2="298" y2="44" stroke="#EF4444" strokeWidth="1.5"/>
      <line x1="298" y1="44" x2="206" y2="118" stroke="#EF4444" strokeWidth="1.5"/>
      <line x1="140" y1="44" x2="220" y2="80" stroke="#16A34A" strokeWidth="1.5"/>
      <line x1="220" y1="80" x2="206" y2="116" stroke="#16A34A" strokeWidth="1.5"/>
      <line x1="206" y1="80" x2="206" y2="118" stroke="#7C3AED" strokeWidth="2"/>
      <polygon points="202,115 210,115 206,122" fill="#7C3AED"/>
      <T x={184} y={130} size={9} color="#7C3AED">Image (real, inverted)</T>

      <T x={8} y={158} size={10} bold>Convex Mirror</T>
      <line x1="10" y1="220" x2="330" y2="220" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="4,3"/>
      <path d="M300 170 Q318 220 300 270" fill="none" stroke="#374151" strokeWidth="3" strokeLinecap="round"/>
      <path d="M298 170 Q312 220 298 270" fill="rgba(156,163,175,0.25)" stroke="none"/>
      <T x={306} y={222} size={9}>Mirror</T>
      <circle cx="320" cy="220" r="3" fill="#9CA3AF"/>
      <T x={310} y={236} size={8} color="#9CA3AF">F (virtual)</T>
      <line x1="140" y1="220" x2="140" y2="184" stroke="#1D4ED8" strokeWidth="2"/>
      <polygon points="136,186 144,186 140,178" fill="#1D4ED8"/>
      <T x={116} y={178} size={9} color="#1D4ED8">Object</T>
      <line x1="140" y1="184" x2="298" y2="184" stroke="#EF4444" strokeWidth="1.5"/>
      <line x1="298" y1="184" x2="180" y2="214" stroke="#EF4444" strokeWidth="1.5"/>
      <line x1="298" y1="184" x2="322" y2="220" stroke="#EF4444" strokeWidth="1" strokeDasharray="3,2"/>
      <line x1="140" y1="184" x2="298" y2="220" stroke="#16A34A" strokeWidth="1.5"/>
      <T x={220} y={266} size={9} color="#7C3AED">Image: virtual, erect, diminished</T>
    </svg>
  );
}

function LensRayDiagram() {
  return (
    <svg viewBox="0 0 360 200" style={{ width: "100%", maxWidth: 360, height: "auto" }}>
      <line x1="10" y1="100" x2="350" y2="100" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="4,3"/>
      <path d="M178 50 C196 66 196 134 178 150 C162 134 162 66 178 50Z" fill="rgba(147,197,253,0.4)" stroke="#3B82F6" strokeWidth="2"/>
      <T x={168} y={168} size={9} color="#1D4ED8">Convex lens</T>
      <circle cx="118" cy="100" r="3" fill="#374151"/>
      <T x={112} y={114} size={9}>F</T>
      <circle cx="58" cy="100" r="3" fill="#374151"/>
      <T x={50} y={114} size={9}>2F</T>
      <circle cx="238" cy="100" r="3" fill="#374151"/>
      <T x={232} y={114} size={9}>F</T>
      <circle cx="298" cy="100" r="3" fill="#374151"/>
      <T x={290} y={114} size={9}>2F</T>
      <line x1="40" y1="100" x2="40" y2="58" stroke="#1D4ED8" strokeWidth="2"/>
      <polygon points="36,60 44,60 40,52" fill="#1D4ED8"/>
      <T x={12} y={54} size={9} color="#1D4ED8">Object</T>
      <line x1="40" y1="58" x2="178" y2="58" stroke="#EF4444" strokeWidth="1.5"/>
      <line x1="178" y1="58" x2="238" y2="100" stroke="#EF4444" strokeWidth="1.5"/>
      <line x1="238" y1="100" x2="300" y2="140" stroke="#EF4444" strokeWidth="1.5"/>
      <line x1="40" y1="58" x2="178" y2="100" stroke="#16A34A" strokeWidth="1.5"/>
      <line x1="178" y1="100" x2="300" y2="140" stroke="#16A34A" strokeWidth="1.5"/>
      <line x1="300" y1="100" x2="300" y2="140" stroke="#7C3AED" strokeWidth="2.5"/>
      <polygon points="296,138 304,138 300,146" fill="#7C3AED"/>
      <T x={304} y={140} size={9} color="#7C3AED">Image</T>
      <T x={270} y={185} size={8} color="#9CA3AF">Real, inverted (object beyond 2F)</T>
    </svg>
  );
}

function SeriesParallelCircuit() {
  return (
    <svg viewBox="0 0 360 270" style={{ width: "100%", maxWidth: 360, height: "auto" }}>
      <T x={6} y={16} size={10} bold>Series Circuit</T>
      <line x1="30" y1="50" x2="30" y2="90" stroke="#374151" strokeWidth="2"/>
      <line x1="30" y1="50" x2="320" y2="50" stroke="#374151" strokeWidth="2"/>
      <line x1="320" y1="50" x2="320" y2="90" stroke="#374151" strokeWidth="2"/>
      <line x1="30" y1="90" x2="80" y2="90" stroke="#374151" strokeWidth="2"/>
      <line x1="150" y1="90" x2="190" y2="90" stroke="#374151" strokeWidth="2"/>
      <line x1="260" y1="90" x2="320" y2="90" stroke="#374151" strokeWidth="2"/>
      <line x1="28" y1="56" x2="28" y2="66" stroke="#374151" strokeWidth="3"/>
      <line x1="44" y1="52" x2="44" y2="70" stroke="#374151" strokeWidth="1.5"/>
      <line x1="28" y1="50" x2="44" y2="50" stroke="#374151" strokeWidth="1"/>
      <line x1="28" y1="90" x2="44" y2="90" stroke="#374151" strokeWidth="1"/>
      <line x1="44" y1="50" x2="44" y2="90" stroke="#374151" strokeWidth="1"/>
      <T x={18} y={44} size={8}>+</T>
      <T x={38} y={44} size={8}>−</T>
      <T x={18} y={108} size={9}>Battery</T>
      <rect x="80" y="82" width="70" height="16" rx="4" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5"/>
      <T x={100} y={95} size={10} bold>R₁</T>
      <T x={96} y={112} size={9} color="#92400E">Resistor 1</T>
      <rect x="190" y="82" width="70" height="16" rx="4" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5"/>
      <T x={210} y={95} size={10} bold>R₂</T>
      <T x={206} y={112} size={9} color="#92400E">Resistor 2</T>
      <polygon points="166,46 172,50 166,54" fill="#EF4444"/>
      <T x={148} y={42} size={8} color="#EF4444">I →</T>
      <T x={60} y={134} size={9}>R_total = R₁ + R₂  |  same current everywhere</T>

      <T x={6} y={162} size={10} bold>Parallel Circuit</T>
      <line x1="30" y1="182" x2="30" y2="250" stroke="#374151" strokeWidth="2"/>
      <line x1="30" y1="182" x2="320" y2="182" stroke="#374151" strokeWidth="2"/>
      <line x1="320" y1="182" x2="320" y2="250" stroke="#374151" strokeWidth="2"/>
      <line x1="30" y1="250" x2="320" y2="250" stroke="#374151" strokeWidth="2"/>
      <line x1="120" y1="182" x2="120" y2="194" stroke="#374151" strokeWidth="1.5"/>
      <line x1="120" y1="238" x2="120" y2="250" stroke="#374151" strokeWidth="1.5"/>
      <line x1="220" y1="182" x2="220" y2="194" stroke="#374151" strokeWidth="1.5"/>
      <line x1="220" y1="238" x2="220" y2="250" stroke="#374151" strokeWidth="1.5"/>
      <line x1="28" y1="202" x2="28" y2="212" stroke="#374151" strokeWidth="3"/>
      <line x1="44" y1="196" x2="44" y2="220" stroke="#374151" strokeWidth="1.5"/>
      <T x={18} y={192} size={8}>+</T>
      <T x={38} y={192} size={8}>−</T>
      <rect x="120" y="194" width="100" height="16" rx="4" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5"/>
      <T x={155} y={207} size={10} bold>R₁</T>
      <rect x="120" y="222" width="100" height="16" rx="4" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5"/>
      <T x={155} y={235} size={10} bold>R₂</T>
      <polygon points="168,178 174,182 168,186" fill="#EF4444"/>
      <T x={140} y={175} size={8} color="#EF4444">I splits at junction</T>
      <T x={232} y={210} size={9}>1/R = 1/R₁ + 1/R₂</T>
      <T x={232} y={224} size={8} color="#6B7280">Same voltage across each</T>
    </svg>
  );
}

function Solenoid() {
  return (
    <svg viewBox="0 0 340 200" style={{ width: "100%", maxWidth: 340, height: "auto" }}>
      <path d="M60 100 C40 70 14 70 14 100 C14 130 40 130 60 100" fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="4,3"/>
      <path d="M60 100 C34 50 6 50 6 100 C6 150 34 150 60 100" fill="none" stroke="#3B82F6" strokeWidth="1" strokeDasharray="4,3" opacity="0.5"/>
      <path d="M280 100 C300 70 326 70 326 100 C326 130 300 130 280 100" fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="4,3"/>
      <path d="M280 100 C306 50 334 50 334 100 C334 150 306 150 280 100" fill="none" stroke="#3B82F6" strokeWidth="1" strokeDasharray="4,3" opacity="0.5"/>
      <line x1="60" y1="100" x2="280" y2="100" stroke="#3B82F6" strokeWidth="2"/>
      <polygon points="164,96 172,100 164,104" fill="#3B82F6"/>
      {[72,94,116,138,160,182,204,226,248].map((cx, i) => (
        <ellipse key={i} cx={cx} cy={100} rx={10} ry={32}
                 fill={i%2===0 ? "rgba(249,250,251,0.92)" : "rgba(243,244,246,0.92)"}
                 stroke="#374151" strokeWidth="2"/>
      ))}
      <line x1="72" y1="68" x2="258" y2="68" stroke="#374151" strokeWidth="2"/>
      <line x1="72" y1="132" x2="258" y2="132" stroke="#374151" strokeWidth="2"/>
      <polygon points="156,64 164,68 156,72" fill="#F59E0B"/>
      <T x={138} y={58} size={8} color="#B45309">Current →</T>
      <line x1="26" y1="132" x2="72" y2="132" stroke="#374151" strokeWidth="2"/>
      <line x1="26" y1="68" x2="72" y2="68" stroke="#374151" strokeWidth="2"/>
      <line x1="26" y1="68" x2="26" y2="132" stroke="#374151" strokeWidth="2"/>
      <line x1="20" y1="88" x2="20" y2="112" stroke="#374151" strokeWidth="3"/>
      <line x1="32" y1="82" x2="32" y2="118" stroke="#374151" strokeWidth="1.5"/>
      <T x={6} y={82} size={8}>+</T>
      <T x={30} y={82} size={8}>−</T>
      <rect x="54" y="80" width="20" height="40" rx="6" fill="#93C5FD" stroke="#3B82F6" strokeWidth="1.5"/>
      <T x={60} y={104} size={11} bold color="#1D4ED8">S</T>
      <rect x="266" y="80" width="20" height="40" rx="6" fill="#FCA5A5" stroke="#EF4444" strokeWidth="1.5"/>
      <T x={272} y={104} size={11} bold color="#B91C1C">N</T>
      <T x={60} y={168} size={9}>Right-hand thumb rule: thumb → N pole; fingers curl → current direction</T>
    </svg>
  );
}

/* ── CHEMISTRY ───────────────────────────────────────────────────── */

function SoapMicelle() {
  const molecules = Array.from({ length: 20 }, (_, i) => {
    const angle = (i / 20) * 2 * Math.PI - Math.PI / 2;
    const hx = 130 + 82 * Math.cos(angle);
    const hy = 130 + 82 * Math.sin(angle);
    const tx = 130 + 50 * Math.cos(angle);
    const ty = 130 + 50 * Math.sin(angle);
    return { hx, hy, tx, ty };
  });
  return (
    <svg viewBox="0 0 260 260" style={{ width: "100%", maxWidth: 260, height: "auto" }}>
      <circle cx="130" cy="130" r="114" fill="rgba(219,234,254,0.25)" stroke="none"/>
      <ellipse cx="130" cy="130" rx="46" ry="46" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5"/>
      <T x={106} y={128} size={9} color="#B45309">Oil /</T>
      <T x={106} y={140} size={9} color="#B45309">Grease</T>
      {molecules.map(({ hx, hy, tx, ty }, i) => (
        <g key={i}>
          <line x1={tx} y1={ty} x2={hx} y2={hy} stroke="#92400E" strokeWidth="2" strokeLinecap="round"/>
          <circle cx={hx} cy={hy} r="7" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1"/>
        </g>
      ))}
      <circle cx="220" cy="28" r="7" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1"/>
      <T x={232} y={32} size={9} color="#1D4ED8">Hydrophilic head</T>
      <line x1="218" y1="50" x2="232" y2="50" stroke="#92400E" strokeWidth="2.5"/>
      <T x={236} y={54} size={9} color="#92400E">Hydrophobic tail</T>
      <T x={6} y={200} size={9} color="#3B82F6">Water surrounds</T>
      <T x={6} y={212} size={9} color="#3B82F6">the micelle</T>
    </svg>
  );
}

function IonicBonding() {
  return (
    <svg viewBox="0 0 340 195" style={{ width: "100%", maxWidth: 340, height: "auto" }}>
      <circle cx="60" cy="88" r="38" fill="rgba(254,215,170,0.35)" stroke="#F97316" strokeWidth="1.5" strokeDasharray="4,3"/>
      <circle cx="60" cy="88" r="26" fill="none" stroke="#F97316" strokeWidth="1" strokeDasharray="3,3"/>
      <circle cx="60" cy="88" r="14" fill="none" stroke="#F97316" strokeWidth="1" strokeDasharray="3,3"/>
      <circle cx="60" cy="88" r="9" fill="#F97316" stroke="#EA580C" strokeWidth="1"/>
      <T x={54} y={92} size={9} bold color="white">Na</T>
      <circle cx="60" cy="74" r="3" fill="#F97316"/>
      <circle cx="60" cy="102" r="3" fill="#F97316"/>
      {[0,1,2,3,4,5,6,7].map(i => {
        const a = (i/8)*2*Math.PI;
        return <circle key={i} cx={60+26*Math.cos(a)} cy={88+26*Math.sin(a)} r={2.5} fill="#F97316"/>;
      })}
      <circle cx="97" cy="88" r="4" fill="#F97316" stroke="#7C2D12" strokeWidth="1.5"/>
      <T x={44} y={140} size={9}>Na (2,8,1)</T>

      <line x1="104" y1="88" x2="168" y2="88" stroke="#374151" strokeWidth="1.5"/>
      <polygon points="161,84 172,88 161,92" fill="#374151"/>
      <T x={106} y={80} size={8} color="#6B7280">e⁻ transfer</T>

      <circle cx="200" cy="88" r="28" fill="rgba(254,215,170,0.55)" stroke="#F97316" strokeWidth="2"/>
      <circle cx="200" cy="88" r="16" fill="none" stroke="#F97316" strokeWidth="1" strokeDasharray="3,3"/>
      <circle cx="200" cy="88" r="9" fill="#F97316" stroke="#EA580C" strokeWidth="1"/>
      <T x={194} y={92} size={9} bold color="white">Na</T>
      {[0,1,2,3,4,5,6,7].map(i => {
        const a = (i/8)*2*Math.PI;
        return <circle key={i} cx={200+16*Math.cos(a)} cy={88+16*Math.sin(a)} r={2} fill="#F97316"/>;
      })}
      <T x={193} y={72} size={11} bold color="#DC2626">+</T>
      <T x={186} y={130} size={9}>Na⁺ (2,8)</T>

      <circle cx="290" cy="88" r="36" fill="rgba(187,247,208,0.45)" stroke="#16A34A" strokeWidth="2"/>
      <circle cx="290" cy="88" r="26" fill="none" stroke="#16A34A" strokeWidth="1" strokeDasharray="3,3"/>
      <circle cx="290" cy="88" r="14" fill="none" stroke="#16A34A" strokeWidth="1" strokeDasharray="3,3"/>
      <circle cx="290" cy="88" r="9" fill="#16A34A" stroke="#15803D" strokeWidth="1"/>
      <T x={283} y={92} size={9} bold color="white">Cl</T>
      {[0,1,2,3,4,5,6,7].map(i => {
        const a = (i/8)*2*Math.PI;
        return <circle key={i} cx={290+26*Math.cos(a)} cy={88+26*Math.sin(a)} r={2.5} fill="#16A34A"/>;
      })}
      <circle cx="290" cy="62" r="3.5" fill="#16A34A" stroke="#14532D" strokeWidth="1.5"/>
      <T x={278} y={134} size={9}>Cl⁻ (2,8,8)</T>
      <T x={280} y={72} size={11} bold color="#2563EB">−</T>

      <T x={96} y={174} size={11} bold>Na⁺  +  Cl⁻  →  NaCl (ionic bond)</T>
    </svg>
  );
}

/* ── CHEMISTRY: Balancing equations ──────────────────────────────── */

function BalanceScale() {
  return (
    <svg viewBox="0 0 360 260" style={{ width: "100%", maxWidth: 360, height: "auto" }}>
      {/* Title */}
      <T x={180} y={16} size={11} bold align="middle" color="#1D1D1F">Law of Conservation of Mass: 2H₂ + O₂ → 2H₂O</T>

      {/* Stand */}
      <rect x={177} y={30} width={6} height={110} rx={3} fill="#9CA3AF"/>
      <rect x={140} y={138} width={80} height={8} rx={4} fill="#6B7280"/>
      <ellipse cx={180} cy={155} rx={30} ry={6} fill="#D1D5DB"/>

      {/* Beam — balanced (horizontal) */}
      <line x1={60} y1={80} x2={300} y2={80} stroke="#374151" strokeWidth={4} strokeLinecap="round"/>
      <circle cx={180} cy={80} r={6} fill="#6B7280"/>

      {/* Left string */}
      <line x1={80} y1={80} x2={80} y2={108} stroke="#9CA3AF" strokeWidth={2}/>
      {/* Left pan */}
      <ellipse cx={80} cy={112} rx={48} ry={10} fill="#FDE68A" stroke="#D97706" strokeWidth={1.5}/>

      {/* Right string */}
      <line x1={280} y1={80} x2={280} y2={108} stroke="#9CA3AF" strokeWidth={2}/>
      {/* Right pan */}
      <ellipse cx={280} cy={112} rx={48} ry={10} fill="#BBF7D0" stroke="#16A34A" strokeWidth={1.5}/>

      {/* LEFT PAN CONTENTS — 2H₂ + O₂ (reactants) */}
      {/* H atom = small blue circle, O atom = red circle */}
      {/* H₂ molecule #1 */}
      <circle cx={42} cy={97} r={7} fill="#93C5FD" stroke="#2563EB" strokeWidth={1.2}/>
      <circle cx={56} cy={97} r={7} fill="#93C5FD" stroke="#2563EB" strokeWidth={1.2}/>
      <line x1={49} y1={97} x2={49} y2={97} stroke="#2563EB" strokeWidth={1.5}/>
      {/* H₂ molecule #2 */}
      <circle cx={68} cy={97} r={7} fill="#93C5FD" stroke="#2563EB" strokeWidth={1.2}/>
      <circle cx={82} cy={97} r={7} fill="#93C5FD" stroke="#2563EB" strokeWidth={1.2}/>
      {/* O₂ molecule */}
      <circle cx={100} cy={96} r={9} fill="#FCA5A5" stroke="#DC2626" strokeWidth={1.2}/>
      <circle cx={116} cy={96} r={9} fill="#FCA5A5" stroke="#DC2626" strokeWidth={1.2}/>
      {/* Labels */}
      <T x={80} y={126} size={10} bold align="middle" color="#1D1D1F">Reactants</T>
      <T x={80} y={138} size={9} align="middle" color="#6B7280">4H + 2O atoms</T>

      {/* RIGHT PAN CONTENTS — 2H₂O (products) */}
      {/* H₂O molecule #1 */}
      <circle cx={254} cy={95} r={7} fill="#93C5FD" stroke="#2563EB" strokeWidth={1.2}/>
      <circle cx={268} cy={88} r={9} fill="#FCA5A5" stroke="#DC2626" strokeWidth={1.2}/>
      <circle cx={282} cy={95} r={7} fill="#93C5FD" stroke="#2563EB" strokeWidth={1.2}/>
      {/* H₂O molecule #2 */}
      <circle cx={254} cy={108} r={7} fill="#93C5FD" stroke="#2563EB" strokeWidth={1.2}/>
      <circle cx={268} cy={101} r={9} fill="#FCA5A5" stroke="#DC2626" strokeWidth={1.2}/>
      <circle cx={282} cy={108} r={7} fill="#93C5FD" stroke="#2563EB" strokeWidth={1.2}/>
      {/* Labels */}
      <T x={280} y={126} size={10} bold align="middle" color="#1D1D1F">Products</T>
      <T x={280} y={138} size={9} align="middle" color="#6B7280">4H + 2O atoms</T>

      {/* Balance indicator */}
      <T x={180} y={175} size={11} bold align="middle" color="#16A34A">⇌ Scale is balanced ✓</T>

      {/* Atom count table */}
      <rect x={50} y={185} width={260} height={66} rx={8} fill="#F9FAFB" stroke="#E5E7EB" strokeWidth={1}/>
      <T x={180} y={198} size={10} bold align="middle" color="#374151">Atom Count Check</T>
      {/* Headers */}
      <T x={100} y={212} size={9} bold align="middle" color="#6B7280">Atom</T>
      <T x={185} y={212} size={9} bold align="middle" color="#2563EB">Reactants</T>
      <T x={270} y={212} size={9} bold align="middle" color="#16A34A">Products</T>
      {/* Row H */}
      <T x={100} y={227} size={9} bold align="middle">H</T>
      <T x={185} y={227} size={9} align="middle" color="#2563EB">4</T>
      <T x={270} y={227} size={9} align="middle" color="#16A34A">4 ✓</T>
      {/* Row O */}
      <T x={100} y={242} size={9} bold align="middle">O</T>
      <T x={185} y={242} size={9} align="middle" color="#2563EB">2</T>
      <T x={270} y={242} size={9} align="middle" color="#16A34A">2 ✓</T>
    </svg>
  );
}

/* ── MAP + EXPORT ────────────────────────────────────────────────── */

const DIAGRAM_MAP = {
  sci_ch5_human_digestion:           { label: "Human Digestive System",          Component: DigestiveSystem },
  sci_ch5_transport_blood:           { label: "Human Heart — 4 Chambers",        Component: Heart },
  sci_ch5_excretion:                 { label: "Structure of a Nephron",           Component: Nephron },
  sci_ch6_nervous_system:            { label: "Structure of a Neuron",            Component: Neuron },
  sci_ch6_reflex_arc:                { label: "Reflex Arc",                        Component: ReflexArc },
  sci_ch7_sexual_reproduction_plants:{ label: "Parts of a Flower",               Component: Flower },
  sci_ch9_reflection_mirrors:        { label: "Concave & Convex Mirror Diagrams", Component: MirrorDiagrams },
  sci_ch9_lenses:                    { label: "Convex Lens — Ray Diagram",        Component: LensRayDiagram },
  sci_ch10_human_eye:                { label: "Structure of the Human Eye",       Component: HumanEye },
  sci_ch11_series_parallel:          { label: "Series & Parallel Circuits",       Component: SeriesParallelCircuit },
  sci_ch12_magnetic_field:           { label: "Solenoid & Magnetic Field",        Component: Solenoid },
  sci_ch4_ethanol_and_ethanoic_acid: { label: "Soap Micelle Structure",           Component: SoapMicelle },
  sci_ch3_ionic_bonding:             { label: "Ionic Bonding — NaCl Formation",   Component: IonicBonding },
  sci_ch1_balancing_equations:       { label: "Conservation of Mass — Balance Scale", Component: BalanceScale },
};

export function Diagram({ topicId }) {
  const entry = DIAGRAM_MAP[topicId];
  if (!entry) return null;
  const { label, Component } = entry;
  return (
    <div style={{
      background: "#FFFFFF",
      borderRadius: "18px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
      overflow: "hidden",
    }}>
      <div style={{
        background: "linear-gradient(90deg,#1D1D1F,#3A3A3C)",
        padding: "10px 24px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}>
        <span style={{ fontSize: "14px" }}>🔬</span>
        <span style={{ fontSize: "13px", fontWeight: 700, color: "#FFFFFF" }}>Diagram</span>
        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", marginLeft: "4px" }}>{label}</span>
      </div>
      <div style={{ padding: "20px 24px", display: "flex", justifyContent: "center" }}>
        <Component />
      </div>
    </div>
  );
}

export default Diagram;
