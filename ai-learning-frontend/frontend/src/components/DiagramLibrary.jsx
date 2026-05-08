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

/* ── BIOLOGY: Photosynthesis ─────────────────────────────────────── */
function Photosynthesis() {
  return (
    <svg viewBox="0 0 340 220" style={{ width:"100%", maxWidth:340, height:"auto" }}>
      {/* Leaf shape */}
      <path d="M170 20 C220 20 280 60 280 110 C280 160 220 200 170 200 C120 200 60 160 60 110 C60 60 120 20 170 20Z"
            fill="#86EFAC" stroke="#16A34A" strokeWidth={2}/>
      {/* Midrib */}
      <line x1={170} y1={20} x2={170} y2={200} stroke="#15803D" strokeWidth={2.5}/>
      {/* Veins */}
      {[50,80,110,140].map((y,i)=>(
        <line key={i} x1={170} y1={y+30} x2={170+(i%2===0?-1:1)*55} y2={y+55}
              stroke="#15803D" strokeWidth={1.2} opacity={0.6}/>
      ))}
      {/* Chloroplast */}
      <ellipse cx={170} cy={110} rx={38} ry={22} fill="#4ADE80" stroke="#15803D" strokeWidth={1.5}/>
      <T x={170} y={106} size={9} bold align="middle" color="#14532D">Chloroplast</T>
      <T x={170} y={118} size={8} align="middle" color="#14532D">6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂</T>

      {/* Inputs */}
      <T x={30} y={70} size={10} bold color="#2563EB">Sunlight ☀</T>
      <path d="M88 75 L135 100" stroke="#F59E0B" strokeWidth={1.5} markerEnd="url(#arr)"/>
      <T x={16} y={120} size={10} bold color="#2563EB">CO₂ →</T>
      <T x={16} y={150} size={10} bold color="#2563EB">H₂O →</T>

      {/* Outputs */}
      <T x={220} y={80} size={10} bold color="#16A34A">← O₂</T>
      <T x={220} y={150} size={10} bold color="#D97706">← Glucose</T>

      {/* Arrow marker */}
      <defs>
        <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6Z" fill="#F59E0B"/>
        </marker>
      </defs>
    </svg>
  );
}

/* ── BIOLOGY: Aerobic Respiration ────────────────────────────────── */
function Respiration() {
  return (
    <svg viewBox="0 0 360 200" style={{ width:"100%", maxWidth:360, height:"auto" }}>
      <T x={180} y={14} size={11} bold align="middle">Aerobic Respiration</T>

      {/* Stage boxes */}
      {[
        {x:20, y:30, w:80, h:40, fill:"#FEF9C3", stroke:"#CA8A04", label:"Glucose", sub:"C₆H₁₂O₆"},
        {x:140, y:30, w:80, h:40, fill:"#DBEAFE", stroke:"#2563EB", label:"Pyruvate", sub:"2 × C₃H₄O₃"},
        {x:260, y:30, w:80, h:40, fill:"#DCFCE7", stroke:"#16A34A", label:"CO₂ + H₂O", sub:"+ ATP"},
      ].map((b,i)=>(
        <g key={i}>
          <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={8} fill={b.fill} stroke={b.stroke} strokeWidth={1.5}/>
          <T x={b.x+b.w/2} y={b.y+17} size={10} bold align="middle" color="#1D1D1F">{b.label}</T>
          <T x={b.x+b.w/2} y={b.y+32} size={9} align="middle" color="#6B7280">{b.sub}</T>
        </g>
      ))}

      {/* Arrows */}
      <line x1={100} y1={50} x2={138} y2={50} stroke="#374151" strokeWidth={2} markerEnd="url(#a2)"/>
      <line x1={220} y1={50} x2={258} y2={50} stroke="#374151" strokeWidth={2} markerEnd="url(#a2)"/>

      {/* Stage labels */}
      <T x={119} y={42} size={8} align="middle" color="#6B7280">Glycolysis</T>
      <T x={119} y={65} size={8} align="middle" color="#6B7280">(cytoplasm)</T>
      <T x={239} y={42} size={8} align="middle" color="#6B7280">Krebs +</T>
      <T x={239} y={65} size={8} align="middle" color="#6B7280">ETC (mito.)</T>

      {/* ATP yield */}
      <rect x={20} y={100} width={320} height={85} rx={10} fill="#F0FFF4" stroke="#86EFAC" strokeWidth={1.5}/>
      <T x={180} y={116} size={10} bold align="middle" color="#15803D">Overall Equation</T>
      <T x={180} y={134} size={10} align="middle" color="#1D1D1F">C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + Energy (ATP)</T>
      <T x={180} y={152} size={10} bold align="middle" color="#16A34A">Net ATP yield: ~36–38 ATP molecules</T>
      <T x={180} y={170} size={9} align="middle" color="#6B7280">Anaerobic (no O₂): glucose → lactic acid / ethanol + CO₂ (2 ATP only)</T>

      <defs>
        <marker id="a2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6Z" fill="#374151"/>
        </marker>
      </defs>
    </svg>
  );
}

/* ── BIOLOGY: Xylem & Phloem ─────────────────────────────────────── */
function XylemPhloem() {
  return (
    <svg viewBox="0 0 320 240" style={{ width:"100%", maxWidth:320, height:"auto" }}>
      <T x={160} y={14} size={11} bold align="middle">Transport in Plants — Stem Cross-Section</T>

      {/* Stem circle */}
      <circle cx={160} cy={130} r={90} fill="#F0FDF4" stroke="#16A34A" strokeWidth={2}/>
      {/* Cortex label */}
      <T x={225} y={118} size={9} color="#6B7280">Cortex</T>

      {/* Vascular bundle — Xylem (top) */}
      <ellipse cx={160} cy={90} rx={28} ry={18} fill="#BFDBFE" stroke="#2563EB" strokeWidth={1.5}/>
      <T x={160} y={86} size={9} bold align="middle" color="#1E40AF">Xylem</T>
      <T x={160} y={99} size={8} align="middle" color="#1E40AF">↑ Water + minerals</T>

      {/* Phloem (bottom) */}
      <ellipse cx={160} cy={168} rx={28} ry={18} fill="#FEF9C3" stroke="#CA8A04" strokeWidth={1.5}/>
      <T x={160} y={164} size={9} bold align="middle" color="#92400E">Phloem</T>
      <T x={160} y={177} size={8} align="middle" color="#92400E">↓ Food (sucrose)</T>

      {/* Cambium line */}
      <line x1={133} y1={130} x2={187} y2={130} stroke="#15803D" strokeWidth={1} strokeDasharray="3,2"/>
      <T x={194} y={134} size={8} color="#15803D">Cambium</T>

      {/* Side labels */}
      <T x={18} y={90} size={9} bold color="#2563EB">Roots →</T>
      <T x={18} y={103} size={9} color="#2563EB">Leaves</T>
      <T x={18} y={168} size={9} bold color="#CA8A04">Leaves →</T>
      <T x={18} y={181} size={9} color="#CA8A04">All parts</T>

      {/* Cell detail inset */}
      <rect x={10} y={195} width={300} height={38} rx={6} fill="#F8FAFC" stroke="#E2E8F0" strokeWidth={1}/>
      <T x={160} y={209} size={9} bold align="middle">Xylem: dead, thick-walled vessels (no nucleus) — passive flow</T>
      <T x={160} y={225} size={9} align="middle" color="#6B7280">Phloem: living sieve tubes + companion cells — active (ATP) loading</T>
    </svg>
  );
}

/* ── BIOLOGY: Human Brain ────────────────────────────────────────── */
function HumanBrain() {
  return (
    <svg viewBox="0 0 320 230" style={{ width:"100%", maxWidth:320, height:"auto" }}>
      <T x={160} y={14} size={11} bold align="middle">Human Brain — Longitudinal Section</T>

      {/* Cerebrum (forebrain) — large */}
      <path d="M60 50 C60 22 130 18 160 18 C190 18 260 22 260 50 C270 80 265 120 250 138 C230 155 190 160 160 160 C130 160 90 155 70 138 C55 120 50 80 60 50Z"
            fill="#FCA5A5" stroke="#EF4444" strokeWidth={1.5}/>
      <T x={160} y={65} size={10} bold align="middle" color="#7F1D1D">Cerebrum</T>
      <T x={160} y={79} size={8} align="middle" color="#7F1D1D">(Forebrain)</T>
      <T x={160} y={93} size={8} align="middle" color="#991B1B">Thinking, memory, voluntary actions</T>
      <T x={160} y={105} size={8} align="middle" color="#991B1B">sight, hearing, speech</T>
      {/* Corpus callosum line */}
      <line x1={88} y1={120} x2={232} y2={120} stroke="#7F1D1D" strokeWidth={1.5} strokeDasharray="4,3"/>

      {/* Cerebellum */}
      <ellipse cx={230} cy={158} rx={36} ry={24} fill="#FDE68A" stroke="#D97706" strokeWidth={1.5}/>
      <T x={230} y={154} size={9} bold align="middle" color="#78350F">Cerebellum</T>
      <T x={230} y={167} size={8} align="middle" color="#92400E">Balance &amp; coordination</T>

      {/* Medulla oblongata */}
      <rect x={138} y={158} width={44} height={32} rx={8} fill="#C4B5FD" stroke="#7C3AED" strokeWidth={1.5}/>
      <T x={160} y={172} size={9} bold align="middle" color="#4C1D95">Medulla</T>
      <T x={160} y={184} size={8} align="middle" color="#5B21B6">Oblongata</T>

      {/* Spinal cord */}
      <rect x={151} y={188} width={18} height={30} rx={5} fill="#E9D5FF" stroke="#7C3AED" strokeWidth={1.2}/>
      <T x={160} y={207} size={8} align="middle" color="#6D28D9">Spinal</T>
      <T x={160} y={218} size={8} align="middle" color="#6D28D9">cord</T>

      {/* Pons / midbrain */}
      <rect x={122} y={155} width={30} height={20} rx={5} fill="#A7F3D0" stroke="#059669" strokeWidth={1.2}/>
      <T x={137} y={169} size={8} bold align="middle" color="#064E3B">Pons</T>

      {/* Labels arrows */}
      <T x={18} y={162} size={8} color="#059669">Midbrain:</T>
      <T x={18} y={173} size={8} color="#059669">relay centre</T>
    </svg>
  );
}

/* ── BIOLOGY: Plant Hormones / Tropisms ──────────────────────────── */
function PlantHormones() {
  return (
    <svg viewBox="0 0 340 220" style={{ width:"100%", maxWidth:340, height:"auto" }}>
      <T x={170} y={14} size={11} bold align="middle">Plant Tropisms — Directional Growth Responses</T>

      {/* Phototropism — stem bending toward light */}
      <T x={85} y={32} size={10} bold align="middle" color="#1D1D1F">Phototropism</T>
      {/* Sun */}
      <circle cx={22} cy={55} r={14} fill="#FEF08A" stroke="#CA8A04" strokeWidth={1.5}/>
      <T x={22} y={59} size={8} bold align="middle" color="#92400E">☀</T>
      {/* Stem bending left */}
      <path d="M85 210 C85 170 72 130 58 80" fill="none" stroke="#16A34A" strokeWidth={4} strokeLinecap="round"/>
      {/* Auxin distribution — more on shaded side */}
      <T x={55} y={140} size={8} color="#D97706">← Auxin</T>
      <T x={90} y={140} size={8} color="#6B7280">(less)</T>
      <T x={18} y={200} size={8} color="#6B7280">Stem bends toward light</T>

      {/* Divider */}
      <line x1={170} y1={25} x2={170} y2={215} stroke="#E5E7EB" strokeWidth={1.5} strokeDasharray="5,3"/>

      {/* Geotropism — root bending down */}
      <T x={255} y={32} size={10} bold align="middle" color="#1D1D1F">Geotropism</T>
      {/* Ground line */}
      <line x1={185} y1={120} x2={335} y2={120} stroke="#92400E" strokeWidth={2}/>
      <T x={260} y={115} size={8} color="#92400E">Soil surface</T>
      {/* Root bending down */}
      <path d="M255 70 C255 90 255 110 255 120 C255 135 268 155 275 175"
            fill="none" stroke="#D97706" strokeWidth={3.5} strokeLinecap="round"/>
      <T x={278} y={172} size={8} color="#D97706">↓</T>
      {/* Stem upward */}
      <path d="M255 70 C255 50 248 35 244 22"
            fill="none" stroke="#16A34A" strokeWidth={3.5} strokeLinecap="round"/>
      <T x={238} y={20} size={8} color="#16A34A">↑</T>
      <T x={195} y={200} size={8} color="#6B7280">Root: positively geotropic</T>
      <T x={195} y={213} size={8} color="#6B7280">Stem: negatively geotropic</T>

      {/* Hormone summary */}
      <rect x={0} y={220} width={340} height={0} rx={0}/>
    </svg>
  );
}

/* ── BIOLOGY: Asexual Reproduction ──────────────────────────────── */
function AsexualReproduction() {
  return (
    <svg viewBox="0 0 340 220" style={{ width:"100%", maxWidth:340, height:"auto" }}>
      <T x={170} y={14} size={11} bold align="middle">Methods of Asexual Reproduction</T>

      {/* Binary Fission — Amoeba */}
      <T x={60} y={32} size={9} bold align="middle" color="#2563EB">Binary Fission</T>
      <ellipse cx={36} cy={60} rx={22} ry={16} fill="#DBEAFE" stroke="#2563EB" strokeWidth={1.5}/>
      <circle cx={36} cy={60} r={5} fill="#2563EB"/>
      <T x={36} y={85} size={8} align="middle" color="#1E40AF">Parent</T>
      <T x={58} y={62} size={10} bold color="#374151">→</T>
      <ellipse cx={80} cy={55} rx={16} ry={12} fill="#DBEAFE" stroke="#2563EB" strokeWidth={1.2}/>
      <circle cx={80} cy={55} r={4} fill="#2563EB"/>
      <ellipse cx={80} cy={68} rx={16} ry={12} fill="#DBEAFE" stroke="#2563EB" strokeWidth={1.2}/>
      <circle cx={80} cy={68} r={4} fill="#2563EB"/>
      <T x={80} y={88} size={8} align="middle" color="#1E40AF">2 daughters</T>
      <T x={60} y={100} size={8} align="middle" color="#6B7280">e.g. Amoeba, Bacteria</T>

      {/* Budding — Yeast/Hydra */}
      <T x={170} y={32} size={9} bold align="middle" color="#16A34A">Budding</T>
      <ellipse cx={158} cy={65} rx={22} ry={16} fill="#DCFCE7" stroke="#16A34A" strokeWidth={1.5}/>
      <circle cx={158} cy={65} r={5} fill="#16A34A"/>
      <circle cx={173} cy={52} r={9} fill="#86EFAC" stroke="#16A34A" strokeWidth={1.2}/>
      <circle cx={173} cy={52} r={3} fill="#15803D"/>
      <T x={165} y={90} size={8} align="middle" color="#15803D">Bud grows off parent</T>
      <T x={165} y={100} size={8} align="middle" color="#6B7280">e.g. Yeast, Hydra</T>

      {/* Fragmentation — Spirogyra */}
      <T x={280} y={32} size={9} bold align="middle" color="#D97706">Fragmentation</T>
      <path d="M238 50 L280 50 L280 80 L238 80 Z" fill="none" stroke="#D97706" strokeWidth={1.5} strokeDasharray="4,2"/>
      {[50,56,62,68,74].map((y,i)=>(
        <ellipse key={i} cx={248+i*8} cy={y} rx={5} ry={4} fill="#FEF9C3" stroke="#D97706" strokeWidth={1}/>
      ))}
      <T x={258} y={45} size={8} align="middle" color="#D97706">→ breaks</T>
      <T x={280} y={95} size={8} align="middle" color="#6B7280">e.g. Spirogyra</T>

      {/* Spore formation */}
      <rect x={10} y={115} width={320} height={95} rx={10} fill="#FAF5FF" stroke="#C4B5FD" strokeWidth={1.5}/>
      <T x={170} y={130} size={9} bold align="middle" color="#6D28D9">Spore Formation (e.g. Rhizopus / bread mould)</T>
      {/* Sporangium */}
      <circle cx={170} cy={160} r={20} fill="#E9D5FF" stroke="#7C3AED" strokeWidth={1.5}/>
      <T x={170} y={164} size={8} bold align="middle" color="#4C1D95">Sporangium</T>
      {[0,60,120,180,240,300].map((deg,i)=>{
        const r=32, a=deg*Math.PI/180;
        return <circle key={i} cx={170+r*Math.cos(a)} cy={160+r*Math.sin(a)} r={5} fill="#C4B5FD" stroke="#7C3AED" strokeWidth={1}/>;
      })}
      <T x={170} y={200} size={8} align="middle" color="#6B7280">Spores released → germinate → new organism</T>
    </svg>
  );
}

/* ── BIOLOGY: Human Reproduction ────────────────────────────────── */
function HumanReproduction() {
  return (
    <svg viewBox="0 0 340 230" style={{ width:"100%", maxWidth:340, height:"auto" }}>
      <T x={170} y={14} size={11} bold align="middle">Human Reproductive Systems</T>

      {/* Male — left */}
      <T x={80} y={30} size={10} bold align="middle" color="#2563EB">Male</T>
      {/* Testis */}
      <ellipse cx={60} cy={110} rx={18} ry={22} fill="#DBEAFE" stroke="#2563EB" strokeWidth={1.5}/>
      <T x={60} y={114} size={8} align="middle" color="#1E40AF">Testis</T>
      <ellipse cx={100} cy={110} rx={18} ry={22} fill="#DBEAFE" stroke="#2563EB" strokeWidth={1.5}/>
      {/* Vas deferens */}
      <path d="M78 95 C90 75 100 65 110 60" fill="none" stroke="#2563EB" strokeWidth={2}/>
      <path d="M100 92 C108 74 114 64 118 60" fill="none" stroke="#2563EB" strokeWidth={2}/>
      {/* Urethra */}
      <rect x={112} y={60} width={12} height={50} rx={4} fill="#BFDBFE" stroke="#2563EB" strokeWidth={1.5}/>
      <T x={118} y={120} size={8} align="middle" color="#1E40AF">Urethra</T>
      {/* Seminal vesicle */}
      <ellipse cx={100} cy={55} rx={14} ry={9} fill="#E0F2FE" stroke="#0284C7" strokeWidth={1}/>
      <T x={100} y={58} size={7} align="middle" color="#0369A1">Seminal</T>
      <T x={100} y={46} size={7} align="middle" color="#0369A1">vesicle</T>
      <T x={80} y={150} size={8} align="middle" color="#6B7280">Sperm produced</T>
      <T x={80} y={162} size={8} align="middle" color="#6B7280">in testis (33°C)</T>

      {/* Divider */}
      <line x1={170} y1={25} x2={170} y2={220} stroke="#E5E7EB" strokeWidth={1.5}/>

      {/* Female — right */}
      <T x={255} y={30} size={10} bold align="middle" color="#EC4899">Female</T>
      {/* Ovaries */}
      <ellipse cx={216} cy={90} rx={16} ry={12} fill="#FCE7F3" stroke="#EC4899" strokeWidth={1.5}/>
      <T x={216} y={93} size={7} align="middle" color="#9D174D">Ovary</T>
      <ellipse cx={294} cy={90} rx={16} ry={12} fill="#FCE7F3" stroke="#EC4899" strokeWidth={1.5}/>
      <T x={294} y={93} size={7} align="middle" color="#9D174D">Ovary</T>
      {/* Fallopian tubes */}
      <path d="M230 88 C238 80 246 78 255 80" fill="none" stroke="#F472B6" strokeWidth={1.8}/>
      <path d="M278 80 C284 78 290 80 296 88" fill="none" stroke="#F472B6" strokeWidth={1.8}/>
      {/* Uterus */}
      <path d="M245 80 C248 100 250 130 255 145 C258 155 265 160 255 162 C245 164 235 155 238 145 C242 130 243 100 245 80Z"
            fill="#FBCFE8" stroke="#EC4899" strokeWidth={1.5}/>
      <T x={252} y={125} size={8} align="middle" color="#9D174D">Uterus</T>
      {/* Cervix + vagina */}
      <rect x={246} y={162} width={18} height={22} rx={4} fill="#FBCFE8" stroke="#DB2777" strokeWidth={1.2}/>
      <T x={255} y={176} size={8} align="middle" color="#9D174D">Cervix</T>
      <rect x={246} y={184} width={18} height={20} rx={4} fill="#FCE7F3" stroke="#DB2777" strokeWidth={1.2}/>
      <T x={255} y={198} size={8} align="middle" color="#9D174D">Vagina</T>

      {/* Egg release note */}
      <T x={255} y={215} size={8} align="middle" color="#6B7280">Ovum released monthly</T>
    </svg>
  );
}

/* ── BIOLOGY: Mendel Punnett Square ─────────────────────────────── */
function PunnettSquare() {
  return (
    <svg viewBox="0 0 320 220" style={{ width:"100%", maxWidth:320, height:"auto" }}>
      <T x={160} y={14} size={11} bold align="middle">Mendel's Monohybrid Cross — Tall (T) × Short (t)</T>

      {/* Parent row */}
      <T x={30} y={38} size={10} bold color="#1D1D1F">P₁:</T>
      <rect x={60} y={24} width={50} height={24} rx={6} fill="#FEF9C3" stroke="#CA8A04" strokeWidth={1.5}/>
      <T x={85} y={40} size={11} bold align="middle" color="#78350F">TT</T>
      <T x={118} y={40} size={10} bold align="middle">×</T>
      <rect x={130} y={24} width={50} height={24} rx={6} fill="#DBEAFE" stroke="#2563EB" strokeWidth={1.5}/>
      <T x={155} y={40} size={11} bold align="middle" color="#1E40AF">tt</T>
      <T x={195} y={40} size={9} color="#6B7280">Tall   ×   Short</T>

      {/* F1 row */}
      <T x={30} y={72} size={10} bold color="#1D1D1F">F₁:</T>
      {["Tt","Tt","Tt","Tt"].map((g,i)=>(
        <g key={i}>
          <rect x={60+i*55} y={58} width={46} height={24} rx={5} fill="#DCFCE7" stroke="#16A34A" strokeWidth={1.2}/>
          <T x={83+i*55} y={74} size={10} bold align="middle" color="#15803D">{g}</T>
        </g>
      ))}
      <T x={290} y={72} size={9} color="#16A34A">All Tall</T>

      {/* F2 Punnett grid */}
      <T x={30} y={108} size={10} bold color="#1D1D1F">F₂:</T>
      {/* Header row */}
      <T x={130} y={104} size={10} bold align="middle" color="#9D174D">T</T>
      <T x={180} y={104} size={10} bold align="middle" color="#9D174D">t</T>
      <T x={82} y={125} size={10} bold align="middle" color="#1E40AF">T</T>
      <T x={82} y={167} size={10} bold align="middle" color="#1E40AF">t</T>

      {/* Grid cells */}
      {[{x:105,y:108,g:"TT",tall:true},{x:155,y:108,g:"Tt",tall:true},
        {x:105,y:148,g:"Tt",tall:true},{x:155,y:148,g:"tt",tall:false}].map((c,i)=>(
        <g key={i}>
          <rect x={c.x} y={c.y} width={46} height={36} rx={4}
            fill={c.tall?"#FEF9C3":"#DBEAFE"} stroke={c.tall?"#CA8A04":"#2563EB"} strokeWidth={1.2}/>
          <T x={c.x+23} y={c.y+22} size={11} bold align="middle" color={c.tall?"#78350F":"#1E40AF"}>{c.g}</T>
        </g>
      ))}

      {/* Ratio summary */}
      <rect x={10} y={194} width={300} height={22} rx={6} fill="#F0FFF4" stroke="#86EFAC" strokeWidth={1}/>
      <T x={160} y={209} size={9} bold align="middle" color="#15803D">
        Ratio — Phenotype: 3 Tall : 1 Short  |  Genotype: 1 TT : 2 Tt : 1 tt
      </T>
    </svg>
  );
}

/* ── BIOLOGY: Sex Determination ──────────────────────────────────── */
function SexDetermination() {
  return (
    <svg viewBox="0 0 300 200" style={{ width:"100%", maxWidth:300, height:"auto" }}>
      <T x={150} y={14} size={11} bold align="middle">Sex Determination in Humans</T>

      {/* Mother */}
      <T x={75} y={35} size={10} bold align="middle" color="#EC4899">Mother (XX)</T>
      <rect x={42} y={40} width={66} height={30} rx={8} fill="#FCE7F3" stroke="#EC4899" strokeWidth={1.5}/>
      <T x={75} y={60} size={12} bold align="middle" color="#9D174D">XX</T>

      {/* Father */}
      <T x={225} y={35} size={10} bold align="middle" color="#2563EB">Father (XY)</T>
      <rect x={192} y={40} width={66} height={30} rx={8} fill="#DBEAFE" stroke="#2563EB" strokeWidth={1.5}/>
      <T x={225} y={60} size={12} bold align="middle" color="#1E40AF">XY</T>

      {/* Gametes */}
      <T x={150} y={90} size={9} bold align="middle" color="#6B7280">Gametes (after meiosis)</T>
      {/* Mother gametes */}
      <circle cx={65} cy={108} r={14} fill="#FCE7F3" stroke="#EC4899" strokeWidth={1.2}/>
      <T x={65} y={112} size={10} bold align="middle" color="#9D174D">X</T>
      <circle cx={95} cy={108} r={14} fill="#FCE7F3" stroke="#EC4899" strokeWidth={1.2}/>
      <T x={95} y={112} size={10} bold align="middle" color="#9D174D">X</T>
      {/* Father gametes */}
      <circle cx={205} cy={108} r={14} fill="#DBEAFE" stroke="#2563EB" strokeWidth={1.2}/>
      <T x={205} y={112} size={10} bold align="middle" color="#1E40AF">X</T>
      <circle cx={235} cy={108} r={14} fill="#EDE9FE" stroke="#7C3AED" strokeWidth={1.2}/>
      <T x={235} y={112} size={10} bold align="middle" color="#4C1D95">Y</T>

      {/* Offspring */}
      <T x={150} y={138} size={9} bold align="middle" color="#6B7280">Possible offspring</T>
      {[{x:55,g:"XX",col:"#EC4899",bg:"#FCE7F3",lbl:"Girl"},
        {x:110,g:"XY",col:"#2563EB",bg:"#DBEAFE",lbl:"Boy"},
        {x:165,g:"XX",col:"#EC4899",bg:"#FCE7F3",lbl:"Girl"},
        {x:220,g:"XY",col:"#2563EB",bg:"#DBEAFE",lbl:"Boy"}].map((c,i)=>(
        <g key={i}>
          <rect x={c.x} y={145} width={40} height={30} rx={6} fill={c.bg} stroke={c.col} strokeWidth={1.2}/>
          <T x={c.x+20} y={164} size={10} bold align="middle" color={c.col}>{c.g}</T>
          <T x={c.x+20} y={182} size={8} align="middle" color="#6B7280">{c.lbl}</T>
        </g>
      ))}
      <T x={150} y={198} size={9} bold align="middle" color="#374151">Ratio 1:1 ♀:♂  — Father determines sex</T>
    </svg>
  );
}

/* ── ECOLOGY: Food Chain & Web ───────────────────────────────────── */
function FoodChain() {
  return (
    <svg viewBox="0 0 340 200" style={{ width:"100%", maxWidth:340, height:"auto" }}>
      <T x={170} y={14} size={11} bold align="middle">Food Chain & Trophic Levels</T>

      {/* Trophic level boxes */}
      {[
        {x:10, label:"Producer", eg:"Grass / Plant", fill:"#DCFCE7", stroke:"#16A34A", tl:"T₁"},
        {x:85, label:"Primary Consumer", eg:"Grasshopper", fill:"#FEF9C3", stroke:"#CA8A04", tl:"T₂"},
        {x:175, label:"Secondary Consumer", eg:"Frog", fill:"#FED7AA", stroke:"#EA580C", tl:"T₃"},
        {x:255, label:"Tertiary Consumer", eg:"Hawk", fill:"#FCA5A5", stroke:"#EF4444", tl:"T₄"},
      ].map((b,i)=>(
        <g key={i}>
          <rect x={b.x} y={25} width={76} height={60} rx={8} fill={b.fill} stroke={b.stroke} strokeWidth={1.5}/>
          <T x={b.x+38} y={43} size={9} bold align="middle" color="#1D1D1F">{b.tl}</T>
          <T x={b.x+38} y={56} size={8} bold align="middle" color="#374151">{b.label}</T>
          <T x={b.x+38} y={71} size={8} align="middle" color="#6B7280">{b.eg}</T>
          {i<3 && <line x1={b.x+76} y1={55} x2={b.x+83} y2={55} stroke="#374151" strokeWidth={1.5} markerEnd="url(#fa)"/>}
        </g>
      ))}

      {/* Decomposer */}
      <rect x={130} y={105} width={80} height={36} rx={8} fill="#E9D5FF" stroke="#7C3AED" strokeWidth={1.5}/>
      <T x={170} y={119} size={9} bold align="middle" color="#4C1D95">Decomposers</T>
      <T x={170} y={133} size={8} align="middle" color="#6D28D9">Bacteria, Fungi</T>
      {/* Arrows to decomposer */}
      <line x1={170} y1={85} x2={170} y2={103} stroke="#7C3AED" strokeWidth={1.2} strokeDasharray="3,2"/>

      {/* Energy loss */}
      <rect x={10} y={155} width={320} height={38} rx={8} fill="#FFF7ED" stroke="#FED7AA" strokeWidth={1}/>
      <T x={170} y={169} size={9} bold align="middle" color="#92400E">10% Energy Law: Only 10% energy passes to next trophic level</T>
      <T x={170} y={184} size={9} align="middle" color="#6B7280">90% lost as heat — so food chains rarely exceed 4–5 levels</T>

      <defs>
        <marker id="fa" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6Z" fill="#374151"/>
        </marker>
      </defs>
    </svg>
  );
}

/* ── ECOLOGY: Energy Pyramid (10% law) ───────────────────────────── */
function EnergyPyramid() {
  return (
    <svg viewBox="0 0 320 220" style={{ width:"100%", maxWidth:320, height:"auto" }}>
      <T x={160} y={14} size={11} bold align="middle">Energy Pyramid — 10% Law</T>

      {/* Pyramid tiers — bottom to top */}
      {[
        {y:175, w:260, h:32, fill:"#DCFCE7", stroke:"#16A34A", label:"Producers (T₁)", kj:"10,000 kJ"},
        {y:138, w:190, h:32, fill:"#FEF9C3", stroke:"#CA8A04", label:"Primary Consumers (T₂)", kj:"1,000 kJ"},
        {y:101, w:120, h:32, fill:"#FED7AA", stroke:"#EA580C", label:"Secondary Consumers (T₃)", kj:"100 kJ"},
        {y:64,  w:60,  h:32, fill:"#FCA5A5", stroke:"#EF4444", label:"Tertiary Consumers (T₄)", kj:"10 kJ"},
      ].map((tier,i)=>{
        const cx=160, x=cx-tier.w/2;
        return (
          <g key={i}>
            <rect x={x} y={tier.y} width={tier.w} height={tier.h} rx={4}
                  fill={tier.fill} stroke={tier.stroke} strokeWidth={1.5}/>
            <T x={cx} y={tier.y+14} size={9} bold align="middle" color="#1D1D1F">{tier.label}</T>
            <T x={cx} y={tier.y+26} size={9} align="middle" color="#6B7280">{tier.kj}</T>
          </g>
        );
      })}

      {/* 10% arrows on right */}
      <T x={295} y={155} size={8} color="#EA580C">10%↑</T>
      <T x={295} y={120} size={8} color="#EA580C">10%↑</T>
      <T x={295} y={83} size={8} color="#EA580C">10%↑</T>

      {/* Heat loss arrows on left */}
      <T x={18} y={195} size={8} color="#9CA3AF">90%</T>
      <T x={18} y={205} size={8} color="#9CA3AF">heat ↗</T>

      {/* Magnification note */}
      <rect x={10} y={205} width={300} height={12} rx={0}/>
      <T x={160} y={214} size={9} bold align="middle" color="#EF4444">
        Biological Magnification: pesticides concentrate upward!
      </T>
    </svg>
  );
}

/* ── CHEMISTRY: pH Scale ─────────────────────────────────────────── */
function PHScale() {
  return (
    <svg viewBox="0 0 340 180" style={{ width:"100%", maxWidth:340, height:"auto" }}>
      <T x={170} y={14} size={11} bold align="middle">pH Scale — 0 to 14</T>

      {/* Gradient bar */}
      {[
        "#EF4444","#F97316","#F59E0B","#EAB308","#84CC16",
        "#22C55E","#10B981","#14B8A6","#06B6D4","#3B82F6",
        "#6366F1","#8B5CF6","#A855F7","#EC4899","#DB2777"
      ].map((col,i)=>(
        <rect key={i} x={18+i*20} y={22} width={20} height={30} fill={col}/>
      ))}
      {/* Border */}
      <rect x={18} y={22} width={300} height={30} fill="none" stroke="#374151" strokeWidth={1}/>

      {/* pH numbers */}
      {Array.from({length:15},(_,i)=>(
        <T key={i} x={28+i*20} y={67} size={9} bold align="middle" color="#1D1D1F">{i}</T>
      ))}

      {/* Acid / Neutral / Base labels */}
      <T x={78} y={82} size={9} bold align="middle" color="#EF4444">◄ Acidic (H⁺ ions)</T>
      <T x={168} y={82} size={9} bold align="middle" color="#374151">Neutral</T>
      <T x={258} y={82} size={9} bold align="middle" color="#6366F1">Alkaline (OH⁻) ►</T>

      {/* Dotted pH7 line */}
      <line x1={168} y1={22} x2={168} y2={95} stroke="#374151" strokeWidth={1} strokeDasharray="3,2"/>

      {/* Examples */}
      {[
        {x:28,  y:105, label:"HCl",     ph:"0-1"},
        {x:68,  y:105, label:"Vinegar", ph:"2-3"},
        {x:108, y:105, label:"Orange", ph:"3-4"},
        {x:168, y:105, label:"Water",   ph:"7"},
        {x:218, y:105, label:"Blood",   ph:"7.4"},
        {x:258, y:105, label:"Baking soda", ph:"8-9"},
        {x:305, y:105, label:"NaOH",    ph:"13-14"},
      ].map((e,i)=>(
        <g key={i}>
          <T x={e.x} y={e.y} size={8} align="middle" color="#374151">{e.label}</T>
          <T x={e.x} y={e.y+11} size={8} align="middle" color="#6B7280">pH {e.ph}</T>
        </g>
      ))}

      {/* Indicator colour note */}
      <rect x={18} y={140} width={300} height={32} rx={6} fill="#FFF7ED" stroke="#FED7AA" strokeWidth={1}/>
      <T x={168} y={154} size={9} bold align="middle" color="#92400E">Indicators — Litmus: red in acid, blue in base</T>
      <T x={168} y={167} size={9} align="middle" color="#6B7280">Phenolphthalein: colourless → pink in base  |  Universal: full spectrum</T>
    </svg>
  );
}

/* ── CHEMISTRY: Types of Reactions ──────────────────────────────── */
function TypesOfReactions() {
  return (
    <svg viewBox="0 0 340 230" style={{ width:"100%", maxWidth:340, height:"auto" }}>
      <T x={170} y={14} size={11} bold align="middle">Types of Chemical Reactions</T>

      {[
        {y:28,  fill:"#DCFCE7", stroke:"#16A34A", type:"Combination (Synthesis)",    eq:"A + B → AB",       eg:"2H₂ + O₂ → 2H₂O"},
        {y:66,  fill:"#FEF9C3", stroke:"#CA8A04", type:"Decomposition",              eq:"AB → A + B",       eg:"2H₂O → 2H₂ + O₂"},
        {y:104, fill:"#DBEAFE", stroke:"#2563EB", type:"Displacement (Single)",      eq:"A + BC → AC + B",  eg:"Zn + CuSO₄ → ZnSO₄ + Cu"},
        {y:142, fill:"#FED7AA", stroke:"#EA580C", type:"Double Displacement",        eq:"AB + CD → AD + CB", eg:"AgNO₃ + NaCl → AgCl↓ + NaNO₃"},
        {y:180, fill:"#FCA5A5", stroke:"#EF4444", type:"Oxidation / Reduction",      eq:"Electron transfer", eg:"Mg + O₂ → MgO  (Mg oxidised)"},
      ].map((r,i)=>(
        <g key={i}>
          <rect x={10} y={r.y} width={320} height={33} rx={7} fill={r.fill} stroke={r.stroke} strokeWidth={1.2}/>
          <T x={18} y={r.y+13} size={9} bold color="#1D1D1F">{r.type}</T>
          <T x={18} y={r.y+25} size={8} color="#374151">{r.eq}</T>
          <T x={180} y={r.y+20} size={8} color="#6B7280" align="middle">{r.eg}</T>
        </g>
      ))}
    </svg>
  );
}

/* ── CHEMISTRY: Reactivity Series ───────────────────────────────── */
function ReactivitSeries() {
  return (
    <svg viewBox="0 0 240 290" style={{ width:"100%", maxWidth:240, height:"auto" }}>
      <T x={120} y={14} size={11} bold align="middle">Reactivity Series of Metals</T>

      {/* Ladder rungs */}
      {[
        {m:"K  (Potassium)",   fill:"#FCA5A5", stroke:"#EF4444"},
        {m:"Na (Sodium)",      fill:"#FCA5A5", stroke:"#EF4444"},
        {m:"Ca (Calcium)",     fill:"#FCA5A5", stroke:"#EF4444"},
        {m:"Mg (Magnesium)",   fill:"#FED7AA", stroke:"#F97316"},
        {m:"Al (Aluminium)",   fill:"#FED7AA", stroke:"#F97316"},
        {m:"Zn (Zinc)",        fill:"#FEF9C3", stroke:"#CA8A04"},
        {m:"Fe (Iron)",        fill:"#FEF9C3", stroke:"#CA8A04"},
        {m:"Sn (Tin)",         fill:"#DCFCE7", stroke:"#16A34A"},
        {m:"Pb (Lead)",        fill:"#DCFCE7", stroke:"#16A34A"},
        {m:"H₂ (Hydrogen)",   fill:"#DBEAFE", stroke:"#3B82F6"},
        {m:"Cu (Copper)",      fill:"#E9D5FF", stroke:"#7C3AED"},
        {m:"Ag (Silver)",      fill:"#F3F4F6", stroke:"#9CA3AF"},
        {m:"Au (Gold)",        fill:"#F3F4F6", stroke:"#9CA3AF"},
      ].map((row,i)=>(
        <g key={i}>
          <rect x={30} y={22+i*19} width={165} height={16} rx={4} fill={row.fill} stroke={row.stroke} strokeWidth={1}/>
          <T x={35} y={34+i*19} size={9} color="#1D1D1F">{row.m}</T>
        </g>
      ))}

      {/* Arrow labels */}
      <line x1={10} y1={22} x2={10} y2={267} stroke="#EF4444" strokeWidth={2} markerEnd="url(#down)"/>
      <line x1={205} y1={267} x2={205} y2={22} stroke="#16A34A" strokeWidth={2} markerEnd="url(#up)"/>
      <T x={5} y={150} size={8} bold color="#EF4444" align="middle">↑ More reactive</T>
      <T x={215} y={150} size={8} bold color="#16A34A" align="middle">↑ Less reactive</T>

      <defs>
        <marker id="down" markerWidth="6" markerHeight="6" refX="3" refY="6" orient="auto">
          <path d="M0,0 L3,6 L6,0Z" fill="#EF4444"/>
        </marker>
        <marker id="up" markerWidth="6" markerHeight="6" refX="3" refY="0" orient="auto">
          <path d="M0,6 L3,0 L6,6Z" fill="#16A34A"/>
        </marker>
      </defs>
    </svg>
  );
}

/* ── CHEMISTRY: Covalent Bonding ─────────────────────────────────── */
function CovalentBonding() {
  return (
    <svg viewBox="0 0 340 220" style={{ width:"100%", maxWidth:340, height:"auto" }}>
      <T x={170} y={14} size={11} bold align="middle">Covalent Bonding in Carbon Compounds</T>

      {/* CH4 — methane */}
      <T x={60} y={32} size={10} bold align="middle" color="#1D1D1F">CH₄ (Methane)</T>
      <circle cx={60} cy={70} r={18} fill="#FEF9C3" stroke="#CA8A04" strokeWidth={1.5}/>
      <T x={60} y={74} size={10} bold align="middle" color="#92400E">C</T>
      {[{dx:0,dy:-32},{dx:32,dy:0},{dx:0,dy:32},{dx:-32,dy:0}].map((d,i)=>(
        <g key={i}>
          <line x1={60+d.dx*0.55} y1={70+d.dy*0.55} x2={60+d.dx*0.85} y2={70+d.dy*0.85}
                stroke="#374151" strokeWidth={2}/>
          <circle cx={60+d.dx} cy={70+d.dy} r={10} fill="#DBEAFE" stroke="#2563EB" strokeWidth={1.2}/>
          <T x={60+d.dx} y={70+d.dy+4} size={9} bold align="middle" color="#1E40AF">H</T>
        </g>
      ))}
      <T x={60} y={128} size={8} align="middle" color="#6B7280">4 single bonds (tetrahedral)</T>

      {/* CO2 */}
      <T x={190} y={32} size={10} bold align="middle" color="#1D1D1F">CO₂ (Carbon dioxide)</T>
      <circle cx={190} cy={70} r={18} fill="#FEF9C3" stroke="#CA8A04" strokeWidth={1.5}/>
      <T x={190} y={74} size={10} bold align="middle" color="#92400E">C</T>
      {[{dx:-40},{dx:40}].map((d,i)=>(
        <g key={i}>
          <line x1={190+d.dx*0.45} y1={67} x2={190+d.dx*0.72} y2={67} stroke="#374151" strokeWidth={2}/>
          <line x1={190+d.dx*0.45} y1={73} x2={190+d.dx*0.72} y2={73} stroke="#374151" strokeWidth={2}/>
          <circle cx={190+d.dx} cy={70} r={15} fill="#FCA5A5" stroke="#EF4444" strokeWidth={1.2}/>
          <T x={190+d.dx} y={74} size={10} bold align="middle" color="#991B1B">O</T>
        </g>
      ))}
      <T x={190} y={128} size={8} align="middle" color="#6B7280">2 double bonds (linear)</T>

      {/* H2O */}
      <T x={295} y={32} size={10} bold align="middle" color="#1D1D1F">H₂O (Water)</T>
      <circle cx={295} cy={75} r={15} fill="#FCA5A5" stroke="#EF4444" strokeWidth={1.5}/>
      <T x={295} y={79} size={10} bold align="middle" color="#991B1B">O</T>
      {[{dx:-30,dy:-18},{dx:30,dy:-18}].map((d,i)=>(
        <g key={i}>
          <line x1={295+d.dx*0.5} y1={75+d.dy*0.5} x2={295+d.dx*0.8} y2={75+d.dy*0.8} stroke="#374151" strokeWidth={2}/>
          <circle cx={295+d.dx} cy={75+d.dy} r={10} fill="#DBEAFE" stroke="#2563EB" strokeWidth={1.2}/>
          <T x={295+d.dx} y={75+d.dy+4} size={9} bold align="middle" color="#1E40AF">H</T>
        </g>
      ))}
      <T x={295} y={128} size={8} align="middle" color="#6B7280">2 single bonds (bent)</T>

      {/* Key property box */}
      <rect x={10} y={145} width={320} height={65} rx={8} fill="#FFF7ED" stroke="#FED7AA" strokeWidth={1.5}/>
      <T x={170} y={161} size={10} bold align="middle" color="#92400E">Key Properties of Carbon</T>
      <T x={170} y={176} size={9} align="middle" color="#1D1D1F">Tetravalency: 4 valence electrons → forms 4 bonds</T>
      <T x={170} y={190} size={9} align="middle" color="#1D1D1F">Catenation: bonds with other C atoms → chains, rings, branches</T>
      <T x={170} y={204} size={9} align="middle" color="#6B7280">Compounds: saturated (single bonds) / unsaturated (double/triple)</T>
    </svg>
  );
}

/* ── PHYSICS: Snell's Law / Refraction ───────────────────────────── */
function SnellsLaw() {
  return (
    <svg viewBox="0 0 320 220" style={{ width:"100%", maxWidth:320, height:"auto" }}>
      <T x={160} y={14} size={11} bold align="middle">Refraction of Light — Snell's Law</T>

      {/* Interface */}
      <rect x={10} y={110} width={300} height={100} rx={0} fill="#DBEAFE" opacity={0.4}/>
      <line x1={10} y1={110} x2={310} y2={110} stroke="#6B7280" strokeWidth={2} strokeDasharray="6,3"/>
      <T x={240} y={105} size={9} color="#6B7280">Air (n₁ = 1.0)</T>
      <T x={240} y={125} size={9} color="#2563EB">Water / Glass (n₂ &gt; 1)</T>

      {/* Normal line */}
      <line x1={160} y1={30} x2={160} y2={200} stroke="#9CA3AF" strokeWidth={1} strokeDasharray="5,3"/>
      <T x={165} y={35} size={8} color="#9CA3AF">Normal</T>

      {/* Incident ray */}
      <line x1={60} y1={40} x2={160} y2={110} stroke="#F59E0B" strokeWidth={2.5} markerEnd="url(#yar)"/>
      <T x={78} y={68} size={9} bold color="#D97706">Incident ray</T>

      {/* Angle i */}
      <path d="M160 110 A35 35 0 0 0 125 80" fill="none" stroke="#F59E0B" strokeWidth={1.2}/>
      <T x={136} y={95} size={9} bold color="#D97706">θ₁</T>

      {/* Refracted ray */}
      <line x1={160} y1={110} x2={220} y2={200} stroke="#2563EB" strokeWidth={2.5} markerEnd="url(#bar)"/>
      <T x={205} y={165} size={9} bold color="#2563EB">Refracted ray</T>

      {/* Angle r */}
      <path d="M160 110 A30 30 0 0 1 183 135" fill="none" stroke="#2563EB" strokeWidth={1.2}/>
      <T x={172} y={132} size={9} bold color="#2563EB">θ₂</T>

      {/* Formula box */}
      <rect x={10} y={155} width={130} height={42} rx={8} fill="#F0F9FF" stroke="#BAE6FD" strokeWidth={1.5}/>
      <T x={75} y={170} size={10} bold align="middle" color="#0369A1">Snell's Law:</T>
      <T x={75} y={188} size={10} bold align="middle" color="#0C4A6E">n₁ sin θ₁ = n₂ sin θ₂</T>

      {/* Note */}
      <T x={200} y={215} size={8} align="middle" color="#6B7280">Bends toward normal as light slows</T>

      <defs>
        <marker id="yar" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6Z" fill="#F59E0B"/>
        </marker>
        <marker id="bar" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6Z" fill="#2563EB"/>
        </marker>
      </defs>
    </svg>
  );
}

/* ── PHYSICS: Eye Defects ────────────────────────────────────────── */
function EyeDefects() {
  return (
    <svg viewBox="0 0 340 230" style={{ width:"100%", maxWidth:340, height:"auto" }}>
      <T x={170} y={14} size={11} bold align="middle">Defects of Vision and Correction</T>

      {/* Myopia */}
      <T x={85} y={32} size={10} bold align="middle" color="#EF4444">Myopia (Short-sight)</T>
      {/* Eye outline */}
      <ellipse cx={85} cy={75} rx={38} ry={28} fill="#FEF3C7" stroke="#D97706" strokeWidth={1.5}/>
      <circle cx={100} cy={75} r={9} fill="#BFDBFE" stroke="#2563EB" strokeWidth={1}/>
      {/* Rays converge before retina */}
      <line x1={28} y1={60} x2={80} y2={75} stroke="#F59E0B" strokeWidth={1.5}/>
      <line x1={28} y1={90} x2={80} y2={75} stroke="#F59E0B" strokeWidth={1.5}/>
      <circle cx={80} cy={75} r={3} fill="#EF4444"/>
      <T x={60} y={95} size={8} align="middle" color="#EF4444">Image in front</T>
      <T x={85} y={110} size={8} align="middle" color="#6B7280">of retina</T>
      {/* Correction — concave */}
      <T x={85} y={128} size={9} bold align="middle" color="#16A34A">Fix: Concave lens</T>
      <rect x={47} y={135} width={76} height={32} rx={4} fill="#DCFCE7" stroke="#16A34A" strokeWidth={1}/>
      <path d="M68 135 C62 151 62 151 68 167" fill="none" stroke="#15803D" strokeWidth={2}/>
      <path d="M108 135 C114 151 114 151 108 167" fill="none" stroke="#15803D" strokeWidth={2}/>
      <T x={85} y={156} size={9} bold align="middle" color="#15803D">( ) diverging</T>

      {/* Divider */}
      <line x1={170} y1={25} x2={170} y2={220} stroke="#E5E7EB" strokeWidth={1.5}/>

      {/* Hypermetropia */}
      <T x={255} y={32} size={10} bold align="middle" color="#2563EB">Hypermetropia (Long-sight)</T>
      <ellipse cx={255} cy={75} rx={38} ry={28} fill="#FEF3C7" stroke="#D97706" strokeWidth={1.5}/>
      <circle cx={270} cy={75} r={9} fill="#BFDBFE" stroke="#2563EB" strokeWidth={1}/>
      {/* Rays converge behind retina */}
      <line x1={198} y1={60} x2={286} y2={75} stroke="#F59E0B" strokeWidth={1.5} strokeDasharray="3,2"/>
      <line x1={198} y1={90} x2={286} y2={75} stroke="#F59E0B" strokeWidth={1.5} strokeDasharray="3,2"/>
      <circle cx={286} cy={75} r={3} fill="#2563EB"/>
      <T x={255} y={95} size={8} align="middle" color="#2563EB">Image behind</T>
      <T x={255} y={108} size={8} align="middle" color="#6B7280">retina</T>
      {/* Correction — convex */}
      <T x={255} y={128} size={9} bold align="middle" color="#16A34A">Fix: Convex lens</T>
      <rect x={217} y={135} width={76} height={32} rx={4} fill="#DCFCE7" stroke="#16A34A" strokeWidth={1}/>
      <path d="M238 135 C232 151 232 151 238 167" fill="none" stroke="#15803D" strokeWidth={2}/>
      <path d="M272 135 C278 151 278 151 272 167" fill="none" stroke="#15803D" strokeWidth={2}/>
      <T x={255} y={156} size={9} bold align="middle" color="#15803D">( ) converging</T>

      {/* Summary */}
      <rect x={10} y={195} width={320} height={26} rx={6} fill="#F9FAFB" stroke="#E5E7EB" strokeWidth={1}/>
      <T x={170} y={208} size={9} bold align="middle" color="#374151">
        Myopia → power &lt; 0 (−ve)  |  Hypermetropia → power &gt; 0 (+ve)
      </T>
    </svg>
  );
}

/* ── PHYSICS: Prism Dispersion ───────────────────────────────────── */
function PrismDispersion() {
  return (
    <svg viewBox="0 0 340 200" style={{ width:"100%", maxWidth:340, height:"auto" }}>
      <T x={170} y={14} size={11} bold align="middle">Dispersion of White Light by a Prism</T>

      {/* White ray in */}
      <line x1={10} y1={90} x2={88} y2={90} stroke="#E5E7EB" strokeWidth={4}/>
      <T x={45} y={84} size={9} bold color="#1D1D1F">White</T>
      <T x={45} y={96} size={9} color="#6B7280">light</T>

      {/* Prism */}
      <polygon points="90,40 170,160 10,160" transform="translate(90,0)"
               fill="rgba(147,197,253,0.3)" stroke="#2563EB" strokeWidth={2}/>
      {/* = points="180,40 260,160 100,160" */}
      <polygon points="180,40 260,160 100,160"
               fill="rgba(147,197,253,0.25)" stroke="#2563EB" strokeWidth={2}/>

      {/* Spectrum rays out */}
      {[
        {col:"#EF4444", label:"Red (least bent)",    y2:90},
        {col:"#F97316", label:"Orange",               y2:100},
        {col:"#EAB308", label:"Yellow",               y2:110},
        {col:"#22C55E", label:"Green",                y2:120},
        {col:"#3B82F6", label:"Blue",                 y2:130},
        {col:"#6366F1", label:"Indigo",               y2:140},
        {col:"#8B5CF6", label:"Violet (most bent)",   y2:150},
      ].map((r,i)=>(
        <g key={i}>
          <line x1={260} y1={100+i*3} x2={330} y2={r.y2} stroke={r.col} strokeWidth={2}/>
          <T x={332} y={r.y2+4} size={8} color={r.col}>{r.label}</T>
        </g>
      ))}

      {/* VIBGYOR label */}
      <T x={180} y={180} size={9} bold align="middle" color="#374151">
        VIBGYOR — violet bends most (shorter λ), red bends least (longer λ)
      </T>
    </svg>
  );
}

/* ── PHYSICS: Ohm's Law V-I graph ────────────────────────────────── */
function OhmsLaw() {
  return (
    <svg viewBox="0 0 320 220" style={{ width:"100%", maxWidth:320, height:"auto" }}>
      <T x={160} y={14} size={11} bold align="middle">Ohm's Law — V-I Graph</T>

      {/* Axes */}
      <line x1={50} y1={190} x2={290} y2={190} stroke="#374151" strokeWidth={2} markerEnd="url(#ax)"/>
      <line x1={50} y1={190} x2={50} y2={30} stroke="#374151" strokeWidth={2} markerEnd="url(#ax)"/>
      <T x={296} y={194} size={10} bold color="#374151">I (A)</T>
      <T x={40} y={26} size={10} bold color="#374151">V</T>
      <T x={40} y={38} size={9} color="#374151">(V)</T>

      {/* V-I line for good conductor (steep slope = low R) */}
      <line x1={50} y1={190} x2={240} y2={50} stroke="#16A34A" strokeWidth={2.5}/>
      <T x={250} y={55} size={9} bold color="#16A34A">R₁ (low R)</T>

      {/* V-I line for poor conductor (gentle slope = high R) */}
      <line x1={50} y1={190} x2={240} y2={110} stroke="#EF4444" strokeWidth={2.5}/>
      <T x={250} y={115} size={9} bold color="#EF4444">R₂ (high R)</T>

      {/* Slope annotation */}
      <T x={155} y={155} size={9} align="middle" color="#374151">Slope = V/I = R</T>
      <T x={155} y={168} size={9} align="middle" color="#6B7280">Steeper → lower resistance</T>

      {/* Formula box */}
      <rect x={60} y={30} width={100} height={42} rx={8} fill="#F0FFF4" stroke="#86EFAC" strokeWidth={1.5}/>
      <T x={110} y={46} size={10} bold align="middle" color="#15803D">V = IR</T>
      <T x={110} y={62} size={9} align="middle" color="#374151">V = Voltage (V)</T>

      <T x={60} y={85} size={8} color="#374151">I = Current (A)</T>
      <T x={60} y={97} size={8} color="#374151">R = Resistance (Ω)</T>

      {/* Resistivity note */}
      <rect x={10} y={196} width={300} height={20} rx={5} fill="#F9FAFB" stroke="#E5E7EB" strokeWidth={1}/>
      <T x={160} y={210} size={8} bold align="middle" color="#374151">R = ρL/A  — depends on material, length, area</T>

      <defs>
        <marker id="ax" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6Z" fill="#374151"/>
        </marker>
      </defs>
    </svg>
  );
}

/* ── PHYSICS: Electric Motor ─────────────────────────────────────── */
function ElectricMotor() {
  return (
    <svg viewBox="0 0 320 230" style={{ width:"100%", maxWidth:320, height:"auto" }}>
      <T x={160} y={14} size={11} bold align="middle">Electric Motor — Construction &amp; Working</T>

      {/* Magnet poles */}
      <rect x={20} y={50} width={40} height={130} rx={6} fill="#FCA5A5" stroke="#EF4444" strokeWidth={2}/>
      <T x={40} y={118} size={14} bold align="middle" color="#991B1B">N</T>
      <rect x={260} y={50} width={40} height={130} rx={6} fill="#DBEAFE" stroke="#2563EB" strokeWidth={2}/>
      <T x={280} y={118} size={14} bold align="middle" color="#1E40AF">S</T>

      {/* Field lines (horizontal dashes) */}
      {[75,100,115,130,145,160].map((y,i)=>(
        <line key={i} x1={62} y1={y} x2={258} y2={y} stroke="#E5E7EB" strokeWidth={1} strokeDasharray="4,3"/>
      ))}

      {/* Coil rectangle */}
      <rect x={110} y={65} width={100} height={100} rx={4} fill="none" stroke="#D97706" strokeWidth={3}/>
      {/* Coil label */}
      <T x={160} y={119} size={9} bold align="middle" color="#92400E">Coil (ABCD)</T>

      {/* Axle */}
      <circle cx={160} cy={115} r={8} fill="#F59E0B" stroke="#CA8A04" strokeWidth={1.5}/>

      {/* Commutator (split ring) */}
      <rect x={148} y={170} width={10} height={18} rx={3} fill="#9CA3AF" stroke="#374151" strokeWidth={1}/>
      <rect x={162} y={170} width={10} height={18} rx={3} fill="#6B7280" stroke="#374151" strokeWidth={1}/>
      <T x={160} y={204} size={8} bold align="middle" color="#374151">Split ring</T>
      <T x={160} y={214} size={8} align="middle" color="#374151">commutator</T>

      {/* Brushes */}
      <rect x={136} y={188} width={10} height={6} fill="#FDE68A" stroke="#CA8A04" strokeWidth={1}/>
      <rect x={174} y={188} width={10} height={6} fill="#FDE68A" stroke="#CA8A04" strokeWidth={1}/>

      {/* Rotation arrow */}
      <path d="M152 60 A30 12 0 0 1 168 60" fill="none" stroke="#16A34A" strokeWidth={2} markerEnd="url(#rot)"/>
      <T x={160} y={50} size={9} bold align="middle" color="#16A34A">↺ Rotation</T>

      {/* Fleming's rule note */}
      <rect x={10} y={218} width={300} height={10} rx={0}/>
      <T x={160} y={226} size={8} bold align="middle" color="#374151">Fleming's Left-Hand Rule: force F = BIL</T>

      <defs>
        <marker id="rot" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6Z" fill="#16A34A"/>
        </marker>
      </defs>
    </svg>
  );
}

/* ── PHYSICS: Electromagnetic Induction / AC Generator ───────────── */
function ACGenerator() {
  return (
    <svg viewBox="0 0 320 230" style={{ width:"100%", maxWidth:320, height:"auto" }}>
      <T x={160} y={14} size={11} bold align="middle">AC Generator — Electromagnetic Induction</T>

      {/* Magnet poles */}
      <rect x={20} y={50} width={35} height={120} rx={6} fill="#FCA5A5" stroke="#EF4444" strokeWidth={2}/>
      <T x={37} y={115} size={13} bold align="middle" color="#991B1B">N</T>
      <rect x={265} y={50} width={35} height={120} rx={6} fill="#DBEAFE" stroke="#2563EB" strokeWidth={2}/>
      <T x={282} y={115} size={13} bold align="middle" color="#1E40AF">S</T>

      {/* Rotating coil */}
      <ellipse cx={160} cy={110} rx={50} ry={30} fill="none" stroke="#D97706" strokeWidth={3}/>
      <line x1={110} y1={110} x2={210} y2={110} stroke="#D97706" strokeWidth={3}/>
      <T x={160} y={108} size={9} bold align="middle" color="#92400E">Rotating Coil</T>

      {/* Slip rings */}
      <ellipse cx={160} cy={148} rx={12} ry={6} fill="#9CA3AF" stroke="#6B7280" strokeWidth={1.5}/>
      <ellipse cx={160} cy={158} rx={12} ry={6} fill="#6B7280" stroke="#374151" strokeWidth={1.5}/>
      <T x={180} y={154} size={8} color="#374151">Slip rings</T>

      {/* Brushes + external */}
      <line x1={148} y1={156} x2={100} y2={175} stroke="#374151" strokeWidth={1.5}/>
      <line x1={172} y1={156} x2={220} y2={175} stroke="#374151" strokeWidth={1.5}/>
      <T x={88} y={182} size={8} color="#374151">Brush</T>
      <T x={215} y={182} size={8} color="#374151">Brush</T>
      {/* Galvanometer */}
      <circle cx={160} cy={198} r={14} fill="#FEF9C3" stroke="#CA8A04" strokeWidth={1.5}/>
      <T x={160} y={202} size={9} bold align="middle" color="#78350F">G</T>
      <line x1={100} y1={175} x2={146} y2={195} stroke="#374151" strokeWidth={1.2}/>
      <line x1={220} y1={175} x2={174} y2={195} stroke="#374151" strokeWidth={1.2}/>

      {/* Faraday's law */}
      <rect x={10} y={215} width={300} height={13} rx={0}/>
      <T x={160} y={224} size={8} bold align="middle" color="#374151">Faraday: EMF = −dΦ/dt  |  Slip rings → AC output</T>
    </svg>
  );
}

/* ── PHYSICS: Fleming's Left-Hand Rule ───────────────────────────── */
function FlemingRule() {
  return (
    <svg viewBox="0 0 280 230" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      <T x={140} y={14} size={11} bold align="middle">Fleming's Left-Hand Rule</T>

      {/* Hand outline — simplified */}
      {/* Palm */}
      <rect x={80} y={80} width={80} height={90} rx={12} fill="#FBBF24" stroke="#D97706" strokeWidth={2}/>
      {/* Thumb (Force / Motion — up) */}
      <rect x={64} y={60} width={18} height={60} rx={8} fill="#F59E0B" stroke="#CA8A04" strokeWidth={1.5}/>
      <T x={56} y={56} size={8} bold color="#92400E">F</T>
      <T x={48} y={68} size={8} color="#6B7280">(Motion)</T>
      {/* Index finger (Field B — right) */}
      <rect x={158} y={76} width={60} height={16} rx={7} fill="#F59E0B" stroke="#CA8A04" strokeWidth={1.5}/>
      <T x={222} y={88} size={8} bold color="#2563EB">B</T>
      <T x={218} y={100} size={8} color="#6B7280">(Field)</T>
      {/* Middle finger (Current — downward) */}
      <rect x={102} y={168} width={16} height={52} rx={7} fill="#F59E0B" stroke="#CA8A04" strokeWidth={1.5}/>
      <T x={100} y={228} size={8} bold color="#EF4444">I</T>
      <T x={90} y={218} size={8} color="#6B7280">(Current)</T>

      {/* Labels */}
      <T x={140} y={40} size={10} bold align="middle" color="#374151">Thumb = Force (F)</T>
      <T x={140} y={53} size={9} align="middle" color="#2563EB">Index = Magnetic Field (B)</T>
      <T x={140} y={65} size={9} align="middle" color="#EF4444">Middle = Current (I)</T>

      <rect x={10} y={218} width={260} height={10} rx={0}/>
      <T x={140} y={226} size={8} align="middle" color="#374151">Used for motors. Right-hand rule → generators.</T>
    </svg>
  );
}

/* ── ECOLOGY: Ozone Depletion ────────────────────────────────────── */
function OzoneLayer() {
  return (
    <svg viewBox="0 0 320 220" style={{ width:"100%", maxWidth:320, height:"auto" }}>
      <T x={160} y={14} size={11} bold align="middle">Ozone Layer and Depletion</T>

      {/* Earth */}
      <circle cx={160} cy={185} r={50} fill="#DBEAFE" stroke="#2563EB" strokeWidth={2}/>
      <T x={160} y={189} size={10} bold align="middle" color="#1E40AF">Earth</T>

      {/* Ozone layer */}
      <path d="M100 150 A80 80 0 0 1 220 150" fill="none" stroke="#22C55E" strokeWidth={6}/>
      <T x={160} y={138} size={9} bold align="middle" color="#15803D">Ozone Layer (O₃)</T>
      <T x={160} y={150} size={8} align="middle" color="#15803D">Stratosphere ~15–35 km</T>

      {/* CFC molecules raining down */}
      {[50,130,230].map((x,i)=>(
        <g key={i}>
          <circle cx={x} cy={55} r={10} fill="#FEF9C3" stroke="#CA8A04" strokeWidth={1}/>
          <T x={x} y={59} size={7} bold align="middle" color="#78350F">CFC</T>
          <line x1={x} y1={65} x2={x+[-5,0,5][i]} y2={100} stroke="#CA8A04" strokeWidth={1} strokeDasharray="3,2" markerEnd="url(#da)"/>
        </g>
      ))}

      {/* Hole in ozone */}
      <path d="M148 145 A4 4 0 0 1 172 145" fill="none" stroke="#EF4444" strokeWidth={3}/>
      <T x={160} y={133} size={8} bold align="middle" color="#EF4444">Hole !</T>

      {/* UV rays through hole */}
      <line x1={155} y1={50} x2={155} y2={155} stroke="#A855F7" strokeWidth={1.5} strokeDasharray="4,2"/>
      <T x={138} y={42} size={8} bold color="#7C3AED">UV-B ↓</T>

      {/* Effects box */}
      <rect x={10} y={170} width={130} height={42} rx={6} fill="#FFF0F0" stroke="#FCA5A5" strokeWidth={1}/>
      <T x={75} y={183} size={8} bold align="middle" color="#EF4444">Effects of UV-B:</T>
      <T x={75} y={195} size={8} align="middle" color="#374151">Skin cancer, cataracts</T>
      <T x={75} y={207} size={8} align="middle" color="#374151">Crop damage</T>

      {/* Sources box */}
      <rect x={180} y={170} width={130} height={42} rx={6} fill="#FFF7ED" stroke="#FED7AA" strokeWidth={1}/>
      <T x={245} y={183} size={8} bold align="middle" color="#D97706">CFC Sources:</T>
      <T x={245} y={195} size={8} align="middle" color="#374151">ACs, fridges,</T>
      <T x={245} y={207} size={8} align="middle" color="#374151">fire extinguishers</T>

      <defs>
        <marker id="da" markerWidth="6" markerHeight="6" refX="3" refY="6" orient="auto">
          <path d="M0,0 L3,6 L6,0Z" fill="#CA8A04"/>
        </marker>
      </defs>
    </svg>
  );
}

/* ── CHEMISTRY: Carbon Allotropes ───────────────────────────────── */
function CarbonAllotropes() {
  return (
    <svg viewBox="0 0 340 240" style={{ width:"100%", maxWidth:340, height:"auto" }}>
      <T x={170} y={14} size={11} bold align="middle">Allotropes of Carbon</T>

      {/* ── Diamond (left) ── */}
      <T x={55} y={30} size={10} bold align="middle" color="#2563EB">Diamond</T>
      {/* 3D tetrahedral lattice */}
      {[{cx:55,cy:60},{cx:30,cy:85},{cx:80,cy:85},{cx:55,cy:110}].map((p,i)=>(
        <circle key={i} cx={p.cx} cy={p.cy} r={10} fill="#BFDBFE" stroke="#2563EB" strokeWidth={1.5}/>
      ))}
      {/* bonds */}
      {[[55,60,30,85],[55,60,80,85],[30,85,55,110],[80,85,55,110]].map(([x1,y1,x2,y2],i)=>(
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1E40AF" strokeWidth={1.5}/>
      ))}
      <T x={55} y={60} size={9} bold align="middle" color="#1E40AF">C</T>
      <T x={30} y={85} size={9} bold align="middle" color="#1E40AF">C</T>
      <T x={80} y={85} size={9} bold align="middle" color="#1E40AF">C</T>
      <T x={55} y={110} size={9} bold align="middle" color="#1E40AF">C</T>
      <T x={55} y={128} size={8} align="middle" color="#374151">4 bonds per C</T>
      <T x={55} y={139} size={8} align="middle" color="#374151">3D tetrahedral lattice</T>
      <T x={55} y={150} size={8} bold align="middle" color="#EF4444">Hardest • No conductor</T>

      {/* ── Graphite (centre) ── */}
      <T x={170} y={30} size={10} bold align="middle" color="#16A34A">Graphite</T>
      {/* Hexagonal layers */}
      {[0,1,2].map(layer=>{
        const yOff = 55 + layer*20;
        const pts = [[145,yOff],[158,yOff-10],[171,yOff-10],[184,yOff],[171,yOff+10],[158,yOff+10]];
        const path = pts.map((p,i)=>(i===0?"M":"L")+p[0]+","+p[1]).join(" ")+" Z";
        return (
          <g key={layer} opacity={1-layer*0.2}>
            <path d={path} fill="none" stroke="#16A34A" strokeWidth={1.2}/>
            {pts.map((p,j)=><circle key={j} cx={p[0]} cy={p[1]} r={4} fill="#86EFAC" stroke="#16A34A" strokeWidth={1}/>)}
          </g>
        );
      })}
      <line x1={145} y1={56} x2={145} y2={96} stroke="#6B7280" strokeWidth={0.8} strokeDasharray="2,2"/>
      <line x1={184} y1={56} x2={184} y2={96} stroke="#6B7280" strokeWidth={0.8} strokeDasharray="2,2"/>
      <T x={170} y={125} size={8} align="middle" color="#374151">3 bonds per C</T>
      <T x={170} y={136} size={8} align="middle" color="#374151">flat hexagonal layers</T>
      <T x={170} y={147} size={8} bold align="middle" color="#16A34A">1 free e⁻ → conducts</T>
      <T x={170} y={158} size={8} bold align="middle" color="#16A34A">Soft • Lubricant</T>

      {/* ── Fullerene (right) ── */}
      <T x={290} y={30} size={10} bold align="middle" color="#D97706">Fullerene C₆₀</T>
      {/* Simplified soccer-ball */}
      <circle cx={290} cy={82} r={40} fill="none" stroke="#D97706" strokeWidth={1.8}/>
      {/* Pentagons */}
      {[0,72,144,216,288].map((deg,i)=>{
        const a=deg*Math.PI/180, r=26, cx=290+r*Math.cos(a-Math.PI/2), cy=82+r*Math.sin(a-Math.PI/2);
        return <polygon key={i} points={[0,1,2,3,4].map(j=>{const b=(j*72-90)*Math.PI/180;return `${cx+8*Math.cos(b)},${cy+8*Math.sin(b)}`;}).join(" ")} fill="#FEF9C3" stroke="#D97706" strokeWidth={1}/>;
      })}
      <T x={290} y={85} size={9} bold align="middle" color="#92400E">C₆₀</T>
      <T x={290} y={128} size={8} align="middle" color="#374151">60 C atoms</T>
      <T x={290} y={139} size={8} align="middle" color="#374151">Hollow cage</T>
      <T x={290} y={150} size={8} bold align="middle" color="#D97706">Drug delivery • Nano</T>

      {/* Comparison table */}
      <rect x={5} y={168} width={330} height={65} rx={6} fill="#F9FAFB" stroke="#E5E7EB" strokeWidth={1}/>
      {/* Headers */}
      {["Property","Diamond","Graphite","Fullerene"].map((h,i)=>(
        <T key={i} x={18+i*82} y={182} size={8} bold color="#374151">{h}</T>
      ))}
      {[
        ["Hardness","Hardest","Soft","Moderate"],
        ["Conductivity","Insulator","Good","Semi"],
        ["Uses","Cutting/gems","Pencil/electrode","Nano/drugs"],
      ].map((row,r)=>(
        row.map((cell,c)=>(
          <T key={c} x={18+c*82} y={194+r*13} size={8} color={c===0?"#6B7280":"#1D1D1F"}>{cell}</T>
        ))
      ))}
    </svg>
  );
}

/* ── BIOLOGY: Endocrine System ───────────────────────────────────── */
function EndocrineSystem() {
  return (
    <svg viewBox="0 0 300 280" style={{ width:"100%", maxWidth:300, height:"auto" }}>
      <T x={150} y={14} size={11} bold align="middle">Endocrine Glands — Locations in Body</T>

      {/* Body outline */}
      {/* Head */}
      <circle cx={150} cy={45} r={26} fill="#FEF3C7" stroke="#D97706" strokeWidth={1.5}/>
      {/* Neck */}
      <rect x={140} y={70} width={20} height={18} fill="#FEF3C7" stroke="#D97706" strokeWidth={1}/>
      {/* Torso */}
      <rect x={110} y={88} width={80} height={100} rx={10} fill="#FEF3C7" stroke="#D97706" strokeWidth={1.5}/>
      {/* Lower body */}
      <rect x={118} y={186} width={28} height={50} rx={6} fill="#FEF3C7" stroke="#D97706" strokeWidth={1}/>
      <rect x={154} y={186} width={28} height={50} rx={6} fill="#FEF3C7" stroke="#D97706" strokeWidth={1}/>

      {/* Gland indicators */}
      {/* Pituitary — base of brain */}
      <circle cx={150} cy={50} r={6} fill="#7C3AED" stroke="#4C1D95" strokeWidth={1.5}/>
      <line x1={156} y1={50} x2={210} y2={38} stroke="#7C3AED" strokeWidth={1}/>
      <T x={212} y={42} size={8} bold color="#4C1D95">Pituitary</T>
      <T x={212} y={52} size={7} color="#6B7280">(master gland)</T>

      {/* Thyroid — neck */}
      <ellipse cx={150} cy={82} rx={12} ry={6} fill="#3B82F6" stroke="#1E40AF" strokeWidth={1.5}/>
      <line x1={163} y1={82} x2={210} y2={78} stroke="#3B82F6" strokeWidth={1}/>
      <T x={212} y={82} size={8} bold color="#1E40AF">Thyroid</T>
      <T x={212} y={92} size={7} color="#6B7280">Thyroxine</T>

      {/* Adrenal — above kidney */}
      <ellipse cx={118} cy={162} rx={9} ry={5} fill="#EF4444" stroke="#991B1B" strokeWidth={1.5}/>
      <ellipse cx={182} cy={162} rx={9} ry={5} fill="#EF4444" stroke="#991B1B" strokeWidth={1.5}/>
      <line x1={109} y1={162} x2={65} y2={158} stroke="#EF4444" strokeWidth={1}/>
      <T x={16} y={162} size={8} bold color="#991B1B">Adrenal</T>
      <T x={16} y={172} size={7} color="#6B7280">Adrenaline</T>

      {/* Pancreas */}
      <rect x={130} y={135} width={40} height={14} rx={5} fill="#F59E0B" stroke="#D97706" strokeWidth={1.5}/>
      <line x1={170} y1={142} x2={212} y2={142} stroke="#F59E0B" strokeWidth={1}/>
      <T x={214} y={138} size={8} bold color="#D97706">Pancreas</T>
      <T x={214} y={148} size={7} color="#6B7280">Insulin/Glucagon</T>

      {/* Ovaries / Testes */}
      <circle cx={130} cy={192} r={6} fill="#EC4899" stroke="#9D174D" strokeWidth={1}/>
      <circle cx={170} cy={192} r={6} fill="#EC4899" stroke="#9D174D" strokeWidth={1}/>
      <line x1={124} y1={192} x2={65} y2={200} stroke="#EC4899" strokeWidth={1}/>
      <T x={18} y={204} size={8} bold color="#9D174D">Gonads</T>
      <T x={18} y={214} size={7} color="#6B7280">Oestrogen/</T>
      <T x={18} y={224} size={7} color="#6B7280">Testosterone</T>

      {/* Feedback note */}
      <rect x={5} y={248} width={290} height={28} rx={6} fill="#F0FFF4" stroke="#86EFAC" strokeWidth={1}/>
      <T x={150} y={260} size={8} bold align="middle" color="#15803D">Negative Feedback: hormone level rises →</T>
      <T x={150} y={271} size={8} align="middle" color="#15803D">gland secretion suppressed → level falls → gland reactivated</T>
    </svg>
  );
}

/* ── BIOLOGY: Contraception Methods ─────────────────────────────── */
function ContraceptionMethods() {
  return (
    <svg viewBox="0 0 340 230" style={{ width:"100%", maxWidth:340, height:"auto" }}>
      <T x={170} y={14} size={11} bold align="middle">Contraception — Methods &amp; STD Protection</T>

      {/* Category blocks */}
      {[
        {x:5,   label:"Barrier", col:"#2563EB", bg:"#DBEAFE", methods:["Male condom","Female condom","Diaphragm"], stds:"YES ✓"},
        {x:90,  label:"Hormonal", col:"#D97706", bg:"#FEF9C3", methods:["Combined pill","Injection","Implant"], stds:"NO ✗"},
        {x:175, label:"IUD", col:"#7C3AED", bg:"#EDE9FE", methods:["Copper-T","Hormonal IUD"], stds:"NO ✗"},
        {x:255, label:"Surgical", col:"#EF4444", bg:"#FEE2E2", methods:["Vasectomy (M)","Tubectomy (F)"], stds:"NO ✗"},
      ].map((cat,i)=>(
        <g key={i}>
          <rect x={cat.x} y={24} width={82} height={140} rx={8} fill={cat.bg} stroke={cat.col} strokeWidth={1.5}/>
          <T x={cat.x+41} y={38} size={9} bold align="middle" color={cat.col}>{cat.label}</T>
          {cat.methods.map((m,j)=>(
            <T key={j} x={cat.x+41} y={56+j*18} size={8} align="middle" color="#1D1D1F">• {m}</T>
          ))}
          <rect x={cat.x+4} y={148} width={74} height={13} rx={4} fill={cat.stds.includes("YES") ? "#DCFCE7":"#FEE2E2"} stroke={cat.stds.includes("YES")?"#16A34A":"#EF4444"} strokeWidth={1}/>
          <T x={cat.x+41} y={158} size={8} bold align="middle" color={cat.stds.includes("YES")?"#15803D":"#EF4444"}>STD: {cat.stds}</T>
        </g>
      ))}

      {/* HIV note */}
      <rect x={5} y={175} width={330} height={50} rx={8} fill="#FFF0F0" stroke="#FCA5A5" strokeWidth={1.5}/>
      <T x={170} y={189} size={9} bold align="middle" color="#EF4444">HIV/AIDS — KEY FACTS</T>
      <T x={170} y={202} size={8} align="middle" color="#374151">HIV destroys CD4⁺ T-cells → AIDS. No cure; managed with ART.</T>
      <T x={170} y={214} size={8} align="middle" color="#374151">Transmitted: unprotected sex, contaminated needles, blood, mother→child.</T>
      <T x={170} y={226} size={8} bold align="middle" color="#16A34A">NOT transmitted: hugging, food, mosquitoes, toilet seats.</T>
    </svg>
  );
}

/* ── CHEMISTRY: Oxidation / Reduction (OIL RIG) ─────────────────── */
function OxidationReduction() {
  return (
    <svg viewBox="0 0 560 320" style={{ width: "100%", height: "auto" }}>
      <T x={280} y={18} size={12} bold align="middle">OIL RIG — Oxidation Is Loss, Reduction Is Gain</T>

      {/* Left column — Oxidation */}
      <rect x={20} y={28} width={240} height={260} rx={10} fill="#FEF9C3" stroke="#D97706" strokeWidth={1.5}/>
      <T x={140} y={48} size={11} bold align="middle" color="#92400E">OXIDATION (OIL)</T>
      <T x={140} y={64} size={9} align="middle" color="#92400E">Loses electrons / Loses H₂ / Gains O₂</T>

      {/* Mg atom */}
      <circle cx={80} cy={110} r={22} fill="#FDE68A" stroke="#D97706" strokeWidth={2}/>
      <T x={80} y={115} size={11} bold align="middle" color="#78350F">Mg</T>
      {/* O₂ molecule */}
      <circle cx={190} cy={100} r={14} fill="#FCA5A5" stroke="#EF4444" strokeWidth={1.5}/>
      <circle cx={218} cy={100} r={14} fill="#FCA5A5" stroke="#EF4444" strokeWidth={1.5}/>
      <T x={204} y={104} size={9} bold align="middle" color="#991B1B">O₂</T>

      {/* Arrow Mg -> MgO */}
      <line x1={20} y1={155} x2={240} y2={155} stroke="#D97706" strokeWidth={1} strokeDasharray="3,2"/>
      <T x={140} y={148} size={9} align="middle" color="#D97706">Mg + O₂ → MgO</T>

      {/* MgO product */}
      <circle cx={90} cy={195} r={18} fill="#FDE68A" stroke="#D97706" strokeWidth={1.5}/>
      <T x={90} y={199} size={10} bold align="middle" color="#78350F">Mg²⁺</T>
      <circle cx={135} cy={195} r={15} fill="#FCA5A5" stroke="#EF4444" strokeWidth={1.5}/>
      <T x={135} y={199} size={9} bold align="middle" color="#991B1B">O²⁻</T>
      <T x={140} y={222} size={9} align="middle" color="#374151">Product: MgO</T>

      {/* Electron arrow going OUT */}
      <path d="M80 130 C60 160 50 180 60 210" fill="none" stroke="#EF4444" strokeWidth={2} strokeDasharray="5,3"/>
      <polygon points="56,207 64,213 68,204" fill="#EF4444"/>
      <T x={28} y={180} size={9} color="#EF4444">e⁻ OUT</T>

      <T x={140} y={270} size={10} bold align="middle" color="#D97706">OIL — Oxidation Is Loss</T>

      {/* Right column — Reduction */}
      <rect x={300} y={28} width={240} height={260} rx={10} fill="#DBEAFE" stroke="#2563EB" strokeWidth={1.5}/>
      <T x={420} y={48} size={11} bold align="middle" color="#1E40AF">REDUCTION (RIG)</T>
      <T x={420} y={64} size={9} align="middle" color="#1E40AF">Gains electrons / Gains H₂ / Loses O₂</T>

      {/* CuO */}
      <circle cx={360} cy={100} r={18} fill="#FDE68A" stroke="#D97706" strokeWidth={1.5}/>
      <T x={360} y={104} size={9} bold align="middle" color="#78350F">Cu²⁺</T>
      <circle cx={400} cy={100} r={14} fill="#FCA5A5" stroke="#EF4444" strokeWidth={1.5}/>
      <T x={400} y={104} size={9} bold align="middle" color="#991B1B">O²⁻</T>
      <T x={380} y={126} size={9} align="middle" color="#374151">CuO + CO → Cu + CO₂</T>

      <line x1={300} y1={155} x2={540} y2={155} stroke="#2563EB" strokeWidth={1} strokeDasharray="3,2"/>
      <T x={420} y={148} size={9} align="middle" color="#2563EB">reduced by CO</T>

      {/* Cu product */}
      <circle cx={420} cy={195} r={22} fill="#F97316" stroke="#EA580C" strokeWidth={2}/>
      <T x={420} y={199} size={11} bold align="middle" color="white">Cu</T>
      <T x={420} y={222} size={9} align="middle" color="#374151">Product: Cu (metal)</T>

      {/* Electron arrow coming IN */}
      <path d="M470 210 C490 175 480 155 460 130" fill="none" stroke="#2563EB" strokeWidth={2} strokeDasharray="5,3"/>
      <polygon points="456,133 464,127 466,137" fill="#2563EB"/>
      <T x={488} y={175} size={9} color="#2563EB">e⁻ IN</T>

      <T x={420} y={270} size={10} bold align="middle" color="#2563EB">RIG — Reduction Is Gain</T>

      {/* Curved transfer arrow between columns */}
      <path d="M260 170 C275 160 285 160 300 170" fill="none" stroke="#374151" strokeWidth={2}/>
      <polygon points="296,166 304,172 296,178" fill="#374151"/>
      <T x={280} y={158} size={8} align="middle" color="#374151">e⁻</T>
    </svg>
  );
}

/* ── CHEMISTRY: Decomposition Types ─────────────────────────────── */
function DecompositionTypes() {
  return (
    <svg viewBox="0 0 560 320" style={{ width: "100%", height: "auto" }}>
      <T x={280} y={18} size={12} bold align="middle">Types of Decomposition Reactions: AB → A + B</T>

      {/* Top arrow */}
      <rect x={200} y={28} width={160} height={32} rx={8} fill="#E9D5FF" stroke="#7C3AED" strokeWidth={1.5}/>
      <T x={280} y={48} size={10} bold align="middle" color="#4C1D95">AB (Compound)</T>
      <line x1={280} y1={60} x2={280} y2={80} stroke="#374151" strokeWidth={2}/>
      <polygon points="275,78 285,78 280,86" fill="#374151"/>
      <T x={288} y={73} size={9} color="#6B7280">energy</T>

      {/* Three boxes */}
      {/* (a) Thermal */}
      <rect x={20} y={95} width={155} height={175} rx={10} fill="#FEF3C7" stroke="#D97706" strokeWidth={2}/>
      <T x={98} y={113} size={10} bold align="middle" color="#92400E">(a) Thermal</T>
      {/* Flame icon */}
      <path d="M88 145 C85 135 92 128 90 120 C96 128 100 135 97 145 C104 135 102 122 98 115 C108 125 112 140 106 152 C112 148 114 138 110 130 C118 142 116 158 108 165 C116 162 120 155 118 148 C122 158 120 170 112 175 C102 180 84 180 78 172 C68 165 66 150 72 140 C74 148 78 152 82 150 C76 144 74 132 80 120 C82 132 84 140 88 145Z"
            fill="#F97316" stroke="#EA580C" strokeWidth={1}/>
      <T x={98} y={200} size={9} align="middle" color="#374151">CaCO₃</T>
      <T x={98} y={212} size={9} align="middle" color="#374151">↓ heat</T>
      <T x={98} y={224} size={9} align="middle" color="#374151">CaO + CO₂</T>
      <T x={98} y={240} size={8} align="middle" color="#6B7280">e.g. limestone</T>
      <T x={98} y={254} size={8} align="middle" color="#6B7280">decomposition</T>

      {/* (b) Electrolytic */}
      <rect x={202} y={95} width={155} height={175} rx={10} fill="#DBEAFE" stroke="#2563EB" strokeWidth={2}/>
      <T x={280} y={113} size={10} bold align="middle" color="#1E40AF">(b) Electrolytic</T>
      {/* Lightning bolt */}
      <polygon points="290,128 282,148 288,148 280,168 296,145 289,145 298,128" fill="#F59E0B" stroke="#D97706" strokeWidth={1}/>
      <T x={280} y={200} size={9} align="middle" color="#374151">2H₂O</T>
      <T x={280} y={212} size={9} align="middle" color="#374151">↓ electricity</T>
      <T x={280} y={224} size={9} align="middle" color="#374151">2H₂ + O₂</T>
      <T x={280} y={240} size={8} align="middle" color="#6B7280">Electrolysis</T>
      <T x={280} y={254} size={8} align="middle" color="#6B7280">of water</T>

      {/* (c) Photolytic */}
      <rect x={384} y={95} width={155} height={175} rx={10} fill="#DCFCE7" stroke="#16A34A" strokeWidth={2}/>
      <T x={462} y={113} size={10} bold align="middle" color="#15803D">(c) Photolytic</T>
      {/* Sun icon */}
      <circle cx={462} cy={148} r={18} fill="#FEF08A" stroke="#CA8A04" strokeWidth={1.5}/>
      <T x={462} y={152} size={9} bold align="middle" color="#92400E">☀</T>
      {[0,45,90,135,180,225,270,315].map((deg,i) => {
        const a = deg * Math.PI / 180;
        return <line key={i} x1={462 + 20 * Math.cos(a)} y1={148 + 20 * Math.sin(a)}
                              x2={462 + 28 * Math.cos(a)} y2={148 + 28 * Math.sin(a)}
                              stroke="#CA8A04" strokeWidth={1.5}/>;
      })}
      <T x={462} y={200} size={9} align="middle" color="#374151">2AgCl</T>
      <T x={462} y={212} size={9} align="middle" color="#374151">↓ light</T>
      <T x={462} y={224} size={9} align="middle" color="#374151">2Ag + Cl₂</T>
      <T x={462} y={240} size={8} align="middle" color="#6B7280">Silver chloride</T>
      <T x={462} y={254} size={8} align="middle" color="#6B7280">darkens in light</T>

      {/* Products label */}
      <T x={280} y={295} size={10} bold align="middle" color="#374151">Products: A  +  B  (two simpler substances)</T>
    </svg>
  );
}

/* ── CHEMISTRY: Acid-Base Indicators ─────────────────────────────── */
function AcidBaseIndicators() {
  return (
    <svg viewBox="0 0 560 320" style={{ width: "100%", height: "auto" }}>
      <T x={280} y={18} size={12} bold align="middle">Acid-Base Indicators — Colour Changes</T>

      {/* Litmus strip */}
      <rect x={20} y={30} width={160} height={36} rx={6} fill="#EF4444" stroke="#DC2626" strokeWidth={1.5}/>
      <T x={100} y={53} size={10} bold align="middle" color="white">Acid (pH &lt; 7)</T>
      <rect x={200} y={30} width={160} height={36} rx={6} fill="#8B5CF6" stroke="#7C3AED" strokeWidth={1.5}/>
      <T x={280} y={53} size={10} bold align="middle" color="white">Neutral (pH = 7)</T>
      <rect x={380} y={30} width={160} height={36} rx={6} fill="#2563EB" stroke="#1D4ED8" strokeWidth={1.5}/>
      <T x={460} y={53} size={10} bold align="middle" color="white">Base (pH &gt; 7)</T>

      {/* Table headers */}
      <rect x={10} y={86} width={540} height={22} rx={4} fill="#F3F4F6" stroke="#D1D5DB" strokeWidth={1}/>
      <T x={130} y={101} size={9} bold align="middle" color="#374151">Indicator</T>
      <T x={230} y={101} size={9} bold align="middle" color="#374151">In Acid</T>
      <T x={330} y={101} size={9} bold align="middle" color="#374151">Neutral</T>
      <T x={460} y={101} size={9} bold align="middle" color="#374151">In Base</T>

      {/* Row 1 — Litmus */}
      <rect x={10} y={110} width={540} height={36} rx={0} fill="#FFF7F7" stroke="#E5E7EB" strokeWidth={0.5}/>
      <T x={130} y={132} size={10} bold align="middle" color="#374151">Litmus</T>
      <rect x={190} y={114} width={80} height={24} rx={4} fill="#EF4444"/>
      <T x={230} y={130} size={9} bold align="middle" color="white">Red</T>
      <rect x={290} y={114} width={80} height={24} rx={4} fill="#8B5CF6"/>
      <T x={330} y={130} size={9} bold align="middle" color="white">Purple</T>
      <rect x={390} y={114} width={140} height={24} rx={4} fill="#2563EB"/>
      <T x={460} y={130} size={9} bold align="middle" color="white">Blue</T>

      {/* Row 2 — Phenolphthalein */}
      <rect x={10} y={148} width={540} height={36} rx={0} fill="#F9FAFB" stroke="#E5E7EB" strokeWidth={0.5}/>
      <T x={130} y={170} size={10} bold align="middle" color="#374151">Phenolphthalein</T>
      <rect x={190} y={152} width={80} height={24} rx={4} fill="#F3F4F6" stroke="#9CA3AF" strokeWidth={1}/>
      <T x={230} y={168} size={9} bold align="middle" color="#374151">Colourless</T>
      <rect x={290} y={152} width={80} height={24} rx={4} fill="#F3F4F6" stroke="#9CA3AF" strokeWidth={1}/>
      <T x={330} y={168} size={9} align="middle" color="#9CA3AF">—</T>
      <rect x={390} y={152} width={140} height={24} rx={4} fill="#EC4899"/>
      <T x={460} y={168} size={9} bold align="middle" color="white">Pink / Magenta</T>

      {/* Row 3 — Methyl Orange */}
      <rect x={10} y={186} width={540} height={36} rx={0} fill="#FFF7F7" stroke="#E5E7EB" strokeWidth={0.5}/>
      <T x={130} y={208} size={10} bold align="middle" color="#374151">Methyl Orange</T>
      <rect x={190} y={190} width={80} height={24} rx={4} fill="#EF4444"/>
      <T x={230} y={206} size={9} bold align="middle" color="white">Red</T>
      <rect x={290} y={190} width={80} height={24} rx={4} fill="#F97316"/>
      <T x={330} y={206} size={9} bold align="middle" color="white">Orange</T>
      <rect x={390} y={190} width={140} height={24} rx={4} fill="#EAB308"/>
      <T x={460} y={206} size={9} bold align="middle" color="white">Yellow</T>

      {/* Summary note */}
      <rect x={10} y={240} width={540} height={60} rx={8} fill="#F0FFF4" stroke="#86EFAC" strokeWidth={1.5}/>
      <T x={280} y={258} size={10} bold align="middle" color="#15803D">Key Rules:</T>
      <T x={280} y={274} size={9} align="middle" color="#374151">Litmus is the universal indicator for quick acid/base tests.</T>
      <T x={280} y={289} size={9} align="middle" color="#374151">Phenolphthalein used in titrations — turns pink only in base. Methyl orange is acidic range indicator.</T>
    </svg>
  );
}

/* ── CHEMISTRY: Acid Reactions ────────────────────────────────────── */
function AcidReactions() {
  return (
    <svg viewBox="0 0 560 320" style={{ width: "100%", height: "auto" }}>
      <T x={280} y={18} size={12} bold align="middle">Reactions of Acids</T>

      {[
        {
          y: 34,
          fill: "#DBEAFE", stroke: "#2563EB",
          title: "(1) Acid + Metal → Salt + Hydrogen gas ↑",
          eq: "Zn + 2HCl → ZnCl₂ + H₂↑",
          note: "H₂ tested with burning splint — gives 'pop' sound",
          col: "#1E40AF",
        },
        {
          y: 130,
          fill: "#FEF9C3", stroke: "#CA8A04",
          title: "(2) Acid + Metal Carbonate → Salt + Water + CO₂ ↑",
          eq: "CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑",
          note: "CO₂ turns lime water milky",
          col: "#78350F",
        },
        {
          y: 226,
          fill: "#DCFCE7", stroke: "#16A34A",
          title: "(3) Acid + Base → Salt + Water (Neutralisation)",
          eq: "NaOH + HCl → NaCl + H₂O",
          note: "H⁺ + OH⁻ → H₂O  (exothermic reaction)",
          col: "#15803D",
        },
      ].map((r, i) => (
        <g key={i}>
          <rect x={20} y={r.y} width={520} height={88} rx={10} fill={r.fill} stroke={r.stroke} strokeWidth={1.5}/>
          <T x={280} y={r.y + 18} size={10} bold align="middle" color={r.col}>{r.title}</T>
          <line x1={40} y1={r.y + 28} x2={520} y2={r.y + 28} stroke={r.stroke} strokeWidth={0.8} strokeDasharray="4,3"/>
          {/* Reactants → Products arrow */}
          <rect x={40} y={r.y + 36} width={200} height={28} rx={6} fill="rgba(255,255,255,0.6)" stroke={r.stroke} strokeWidth={1}/>
          <T x={140} y={r.y + 54} size={10} bold align="middle" color={r.col}>{r.eq.split("→")[0]} →</T>
          <polygon points={`248,${r.y+47} 260,${r.y+52} 248,${r.y+57}`} fill={r.stroke}/>
          <rect x={265} y={r.y + 36} width={275} height={28} rx={6} fill="rgba(255,255,255,0.6)" stroke={r.stroke} strokeWidth={1}/>
          <T x={402} y={r.y + 54} size={10} bold align="middle" color={r.col}>{r.eq.split("→")[1]}</T>
          <T x={280} y={r.y + 80} size={8} align="middle" color="#6B7280">{r.note}</T>
        </g>
      ))}
    </svg>
  );
}

/* ── CHEMISTRY: Chlor-Alkali / Salts ─────────────────────────────── */
function ChlorAlkali() {
  return (
    <svg viewBox="0 0 560 320" style={{ width: "100%", height: "auto" }}>
      <T x={280} y={18} size={12} bold align="middle">Chlor-Alkali Process — Electrolysis of NaCl(aq)</T>

      {/* Electrolysis cell */}
      <rect x={80} y={35} width={400} height={200} rx={10} fill="#EFF6FF" stroke="#2563EB" strokeWidth={2}/>

      {/* Solution label */}
      <T x={280} y={148} size={11} bold align="middle" color="#1D4ED8">NaCl (aq)</T>
      <T x={280} y={164} size={9} align="middle" color="#1D4ED8">sodium chloride solution</T>
      <T x={280} y={180} size={9} align="middle" color="#16A34A">NaOH formed in solution</T>

      {/* Cathode — left */}
      <rect x={110} y={50} width={22} height={175} rx={4} fill="#9CA3AF" stroke="#374151" strokeWidth={2}/>
      <T x={121} y={240} size={9} bold align="middle" color="#374151">−</T>
      <T x={60} y={44} size={9} bold color="#374151">Cathode (−)</T>
      {/* H₂ bubbles at cathode */}
      {[0, 1, 2].map(i => (
        <circle key={i} cx={100 - i * 8} cy={68 + i * 14} r={5} fill="#BFDBFE" stroke="#2563EB" strokeWidth={1}/>
      ))}
      <T x={50} y={72} size={9} bold color="#2563EB">H₂ ↑</T>
      <line x1={90} y1={70} x2={112} y2={80} stroke="#2563EB" strokeWidth={1} strokeDasharray="2,2"/>

      {/* Anode — right */}
      <rect x={428} y={50} width={22} height={175} rx={4} fill="#9CA3AF" stroke="#374151" strokeWidth={2}/>
      <T x={439} y={240} size={9} bold align="middle" color="#374151">+</T>
      <T x={456} y={44} size={9} bold color="#374151">Anode (+)</T>
      {/* Cl₂ bubbles at anode */}
      {[0, 1, 2].map(i => (
        <circle key={i} cx={462 + i * 8} cy={68 + i * 14} r={5} fill="#FDE68A" stroke="#D97706" strokeWidth={1}/>
      ))}
      <T x={462} y={72} size={9} bold color="#D97706">Cl₂ ↑</T>
      <line x1={450} y1={70} x2={428} y2={80} stroke="#D97706" strokeWidth={1} strokeDasharray="2,2"/>

      {/* Ion movement arrows */}
      <line x1={260} y1={155} x2={150} y2={155} stroke="#2563EB" strokeWidth={1.5} strokeDasharray="4,2"/>
      <polygon points="153,151 143,155 153,159" fill="#2563EB"/>
      <T x={200} y={148} size={8} color="#2563EB">Na⁺, H⁺ →</T>

      <line x1={300} y1={155} x2={410} y2={155} stroke="#D97706" strokeWidth={1.5} strokeDasharray="4,2"/>
      <polygon points="407,151 417,155 407,159" fill="#D97706"/>
      <T x={350} y={148} size={8} color="#D97706">Cl⁻, OH⁻ →</T>

      {/* Power supply */}
      <line x1={121} y1={50} x2={121} y2={28} stroke="#374151" strokeWidth={2}/>
      <line x1={439} y1={50} x2={439} y2={28} stroke="#374151" strokeWidth={2}/>
      <line x1={121} y1={28} x2={230} y2={28} stroke="#374151" strokeWidth={2}/>
      <line x1={310} y1={28} x2={439} y2={28} stroke="#374151" strokeWidth={2}/>
      <rect x={230} y={18} width={80} height={20} rx={6} fill="#FEF9C3" stroke="#D97706" strokeWidth={1.5}/>
      <T x={270} y={31} size={9} bold align="middle" color="#78350F">DC Supply</T>

      {/* Products summary */}
      <rect x={20} y={248} width={520} height={60} rx={8} fill="#F9FAFB" stroke="#E5E7EB" strokeWidth={1}/>
      <T x={280} y={266} size={10} bold align="middle" color="#374151">Products and Uses:</T>
      <T x={140} y={282} size={9} align="middle" color="#2563EB">H₂ (cathode) — fuel, margarine</T>
      <T x={280} y={282} size={9} align="middle" color="#16A34A">NaOH (soln) — soap, paper</T>
      <T x={430} y={282} size={9} align="middle" color="#D97706">Cl₂ (anode) — PVC, bleach</T>
      <T x={280} y={298} size={8} align="middle" color="#6B7280">2NaCl + 2H₂O → 2NaOH + H₂ + Cl₂</T>
    </svg>
  );
}

/* ── CHEMISTRY: Metal vs Non-metal Properties ────────────────────── */
function MetalNonmetalProperties() {
  return (
    <svg viewBox="0 0 560 320" style={{ width: "100%", height: "auto" }}>
      <T x={280} y={18} size={12} bold align="middle">Physical Properties: Metals vs Non-metals</T>

      {/* Column headers */}
      <rect x={20} y={28} width={240} height={32} rx={8} fill="#DBEAFE" stroke="#2563EB" strokeWidth={2}/>
      <T x={140} y={49} size={11} bold align="middle" color="#1E40AF">METALS</T>
      <rect x={300} y={28} width={240} height={32} rx={8} fill="#FEF9C3" stroke="#D97706" strokeWidth={2}/>
      <T x={420} y={49} size={11} bold align="middle" color="#92400E">NON-METALS</T>

      {[
        ["Lustre", "Shiny / lustrous", "Dull (except iodine)"],
        ["Malleability", "Malleable — can be beaten", "Brittle — shatters"],
        ["Ductility", "Ductile — drawn into wire", "Not ductile"],
        ["Conductivity", "Good conductor (heat + elec)", "Poor conductor / insulator"],
        ["Sound", "Sonorous — makes sound", "Not sonorous"],
        ["Melting Point", "Generally high MP", "Generally low MP"],
        ["State at 25°C", "Mostly solid", "Mostly gas / solid"],
      ].map((row, i) => {
        const y = 68 + i * 28;
        const bg = i % 2 === 0 ? "#F0F9FF" : "#FFFFFF";
        return (
          <g key={i}>
            <rect x={20} y={y} width={240} height={26} rx={0} fill={bg} stroke="#BFDBFE" strokeWidth={0.5}/>
            <rect x={300} y={y} width={240} height={26} rx={0} fill={i % 2 === 0 ? "#FFFBEB" : "#FFFFFF"} stroke="#FDE68A" strokeWidth={0.5}/>
            <T x={30} y={y + 17} size={9} bold color="#1E40AF">{row[0]}</T>
            <T x={140} y={y + 17} size={9} align="middle" color="#1D1D1F">{row[1]}</T>
            <T x={420} y={y + 17} size={9} align="middle" color="#1D1D1F">{row[2]}</T>
          </g>
        );
      })}

      {/* Exceptions box */}
      <rect x={20} y={270} width={520} height={42} rx={8} fill="#DCFCE7" stroke="#16A34A" strokeWidth={1.5}/>
      <T x={280} y={286} size={9} bold align="middle" color="#15803D">Important Exceptions:</T>
      <T x={280} y={302} size={9} align="middle" color="#374151">Graphite (non-metal) conducts electricity  •  Mercury (metal) is liquid at room temperature</T>
    </svg>
  );
}

/* ── CHEMISTRY: Blast Furnace ────────────────────────────────────── */
function BlastFurnace() {
  return (
    <svg viewBox="0 0 560 320" style={{ width: "100%", height: "auto" }}>
      <T x={280} y={16} size={12} bold align="middle">Blast Furnace — Extraction of Iron</T>

      {/* Furnace body */}
      <path d="M180 30 L380 30 L410 200 L340 270 L220 270 L150 200 Z"
            fill="#FEF3C7" stroke="#D97706" strokeWidth={2}/>

      {/* Zone labels inside */}
      <T x={280} y={75} size={9} bold align="middle" color="#92400E">Zone 3 — Slag Formation</T>
      <T x={280} y={90} size={8} align="middle" color="#92400E">CaO + SiO₂ → CaSiO₃ (slag)</T>
      <line x1={165} y1={110} x2={395} y2={110} stroke="#D97706" strokeWidth={1} strokeDasharray="4,2"/>

      <T x={280} y={130} size={9} bold align="middle" color="#B45309">Zone 2 — Reduction Zone</T>
      <T x={280} y={145} size={8} align="middle" color="#B45309">Fe₂O₃ + 3CO → 2Fe + 3CO₂</T>
      <line x1={155} y1={165} x2={405} y2={165} stroke="#D97706" strokeWidth={1} strokeDasharray="4,2"/>

      <T x={280} y={183} size={9} bold align="middle" color="#EA580C">Zone 1 — Combustion Zone</T>
      <T x={280} y={198} size={8} align="middle" color="#EA580C">C + O₂ → CO₂  |  CO₂ + C → 2CO</T>

      {/* Inputs at top — 3 arrows */}
      {[
        {x: 180, label: "Iron ore", sub: "(Fe₂O₃)", col: "#EF4444"},
        {x: 280, label: "Coke", sub: "(C)", col: "#374151"},
        {x: 380, label: "Limestone", sub: "(CaCO₃)", col: "#6B7280"},
      ].map((inp, i) => (
        <g key={i}>
          <line x1={inp.x} y1={8} x2={inp.x} y2={28} stroke={inp.col} strokeWidth={2}/>
          <polygon points={`${inp.x - 4},24 ${inp.x + 4},24 ${inp.x},30`} fill={inp.col}/>
          <T x={inp.x} y={8} size={8} bold align="middle" color={inp.col}>{inp.label}</T>
        </g>
      ))}

      {/* Hot air blast — both sides */}
      <rect x={50} y={195} width={95} height={22} rx={6} fill="#FCA5A5" stroke="#EF4444" strokeWidth={1.5}/>
      <T x={98} y={210} size={8} bold align="middle" color="#991B1B">Hot Air →</T>
      <line x1={145} y1={206} x2={160} y2={206} stroke="#EF4444" strokeWidth={2}/>
      <polygon points="158,202 166,206 158,210" fill="#EF4444"/>

      <rect x={415} y={195} width={95} height={22} rx={6} fill="#FCA5A5" stroke="#EF4444" strokeWidth={1.5}/>
      <T x={462} y={210} size={8} bold align="middle" color="#991B1B">← Hot Air</T>
      <line x1={400} y1={206} x2={415} y2={206} stroke="#EF4444" strokeWidth={2}/>
      <polygon points="402,202 394,206 402,210" fill="#EF4444"/>

      {/* Molten iron at bottom */}
      <rect x={230} y={255} width={100} height={28} rx={6} fill="#F97316" stroke="#EA580C" strokeWidth={2}/>
      <T x={280} y={272} size={9} bold align="middle" color="white">Molten Iron</T>
      <line x1={280} y1={283} x2={280} y2={296} stroke="#EA580C" strokeWidth={2}/>
      <polygon points="275,294 285,294 280,302" fill="#EA580C"/>

      {/* Slag outlet — side */}
      <rect x={400} y={242} width={80} height={20} rx={5} fill="#9CA3AF" stroke="#6B7280" strokeWidth={1.5}/>
      <T x={440} y={255} size={8} bold align="middle" color="#374151">Slag outlet</T>
      <line x1={400} y1={252} x2={385} y2={252} stroke="#6B7280" strokeWidth={1.5}/>
      <polygon points="387,248 379,252 387,256" fill="#6B7280"/>

      {/* Gas outlet top */}
      <line x1={280} y1={30} x2={500} y2={30} stroke="#16A34A" strokeWidth={1.5} strokeDasharray="4,2"/>
      <T x={450} y={26} size={8} bold color="#16A34A">CO₂ gas out ↑</T>
    </svg>
  );
}

/* ── CHEMISTRY: Homologous Series ────────────────────────────────── */
function HomologousSeries() {
  return (
    <svg viewBox="0 0 560 320" style={{ width: "100%", height: "auto" }}>
      <T x={280} y={16} size={12} bold align="middle">Homologous Series — Structural Formulas</T>

      {/* Alkane row */}
      <T x={280} y={36} size={10} bold align="middle" color="#2563EB">Alkanes: CₙH₂ₙ₊₂ (single bonds only — saturated)</T>

      {/* Methane CH4 */}
      <circle cx={70} cy={90} r={14} fill="#FDE68A" stroke="#D97706" strokeWidth={1.5}/>
      <T x={70} y={94} size={9} bold align="middle" color="#78350F">C</T>
      {[{dx:0,dy:-26},{dx:26,dy:0},{dx:0,dy:26},{dx:-26,dy:0}].map((d, i) => (
        <g key={i}>
          <line x1={70 + d.dx * 0.52} y1={90 + d.dy * 0.52} x2={70 + d.dx * 0.85} y2={90 + d.dy * 0.85} stroke="#374151" strokeWidth={1.5}/>
          <circle cx={70 + d.dx} cy={90 + d.dy} r={9} fill="#DBEAFE" stroke="#2563EB" strokeWidth={1.2}/>
          <T x={70 + d.dx} y={90 + d.dy + 3} size={8} bold align="middle" color="#1E40AF">H</T>
        </g>
      ))}
      <T x={70} y={134} size={9} align="middle" color="#374151">CH₄</T>
      <T x={70} y={146} size={8} align="middle" color="#6B7280">methane</T>

      {/* +CH₂ arrow */}
      <T x={130} y={91} size={9} bold align="middle" color="#16A34A">+ CH₂</T>
      <line x1={130} y1={96} x2={152} y2={96} stroke="#16A34A" strokeWidth={1.5}/>
      <polygon points="150,92 158,96 150,100" fill="#16A34A"/>

      {/* Ethane C2H6 */}
      <circle cx={190} cy={90} r={14} fill="#FDE68A" stroke="#D97706" strokeWidth={1.5}/>
      <T x={190} y={94} size={9} bold align="middle" color="#78350F">C</T>
      <line x1={204} y1={90} x2={218} y2={90} stroke="#374151" strokeWidth={1.5}/>
      <circle cx={232} cy={90} r={14} fill="#FDE68A" stroke="#D97706" strokeWidth={1.5}/>
      <T x={232} y={94} size={9} bold align="middle" color="#78350F">C</T>
      {[{cx:190,dy:-26},{cx:190,dy:26},{cx:232,dy:-26},{cx:232,dy:26}].map((d, i) => (
        <g key={i}>
          <line x1={d.cx} y1={90 + (d.dy > 0 ? 14 : -14)} x2={d.cx} y2={90 + d.dy * 0.85} stroke="#374151" strokeWidth={1.5}/>
          <circle cx={d.cx} cy={90 + d.dy} r={9} fill="#DBEAFE" stroke="#2563EB" strokeWidth={1.2}/>
          <T x={d.cx} y={90 + d.dy + 3} size={8} bold align="middle" color="#1E40AF">H</T>
        </g>
      ))}
      {[{cx:190},{cx:232}].map((d,i)=>(
        <g key={i}>
          <circle cx={i===0 ? 167 : 255} cy={90} r={9} fill="#DBEAFE" stroke="#2563EB" strokeWidth={1.2}/>
          <T x={i===0 ? 167 : 255} y={93} size={8} bold align="middle" color="#1E40AF">H</T>
        </g>
      ))}
      <T x={211} y={134} size={9} align="middle" color="#374151">C₂H₆</T>
      <T x={211} y={146} size={8} align="middle" color="#6B7280">ethane</T>

      {/* + CH2 arrow */}
      <T x={278} y={91} size={9} bold align="middle" color="#16A34A">+ CH₂</T>
      <line x1={278} y1={96} x2={296} y2={96} stroke="#16A34A" strokeWidth={1.5}/>
      <polygon points="294,92 302,96 294,100" fill="#16A34A"/>

      {/* Propane C3H8 — simplified */}
      <T x={420} y={90} size={10} bold align="middle" color="#374151">C₃H₈</T>
      <T x={420} y={104} size={9} align="middle" color="#374151">CH₃-CH₂-CH₃</T>
      <T x={420} y={134} size={9} align="middle" color="#374151">propane</T>
      <T x={420} y={146} size={8} align="middle" color="#6B7280">(drawn as chain)</T>

      {/* Divider */}
      <line x1={20} y1={162} x2={540} y2={162} stroke="#E5E7EB" strokeWidth={1.5}/>

      {/* Alkenes / Alkynes */}
      <T x={280} y={178} size={10} bold align="middle" color="#EF4444">Alkenes: CₙH₂ₙ (one C=C double bond — unsaturated)</T>

      {/* Ethene */}
      <circle cx={110} cy={230} r={14} fill="#FDE68A" stroke="#D97706" strokeWidth={1.5}/>
      <T x={110} y={234} size={9} bold align="middle" color="#78350F">C</T>
      <line x1={124} y1={227} x2={154} y2={227} stroke="#374151" strokeWidth={2}/>
      <line x1={124} y1={233} x2={154} y2={233} stroke="#374151" strokeWidth={2}/>
      <circle cx={168} cy={230} r={14} fill="#FDE68A" stroke="#D97706" strokeWidth={1.5}/>
      <T x={168} y={234} size={9} bold align="middle" color="#78350F">C</T>
      {[{cx:110,dy:-26},{cx:110,dy:26},{cx:168,dy:-26},{cx:168,dy:26}].map((d, i) => (
        <g key={i}>
          <circle cx={d.cx} cy={230 + d.dy} r={9} fill="#DBEAFE" stroke="#2563EB" strokeWidth={1.2}/>
          <T x={d.cx} y={230 + d.dy + 3} size={8} bold align="middle" color="#1E40AF">H</T>
        </g>
      ))}
      <T x={139} y={270} size={9} align="middle" color="#EF4444">C₂H₄  ethene (C=C)</T>

      {/* Ethyne */}
      <circle cx={360} cy={230} r={14} fill="#FDE68A" stroke="#D97706" strokeWidth={1.5}/>
      <T x={360} y={234} size={9} bold align="middle" color="#78350F">C</T>
      <line x1={374} y1={225} x2={404} y2={225} stroke="#374151" strokeWidth={2}/>
      <line x1={374} y1={230} x2={404} y2={230} stroke="#374151" strokeWidth={2}/>
      <line x1={374} y1={235} x2={404} y2={235} stroke="#374151" strokeWidth={2}/>
      <circle cx={418} cy={230} r={14} fill="#FDE68A" stroke="#D97706" strokeWidth={1.5}/>
      <T x={418} y={234} size={9} bold align="middle" color="#78350F">C</T>
      <circle cx={338} cy={230} r={9} fill="#DBEAFE" stroke="#2563EB" strokeWidth={1.2}/>
      <T x={338} y={233} size={8} bold align="middle" color="#1E40AF">H</T>
      <circle cx={440} cy={230} r={9} fill="#DBEAFE" stroke="#2563EB" strokeWidth={1.2}/>
      <T x={440} y={233} size={8} bold align="middle" color="#1E40AF">H</T>
      <T x={389} y={270} size={9} align="middle" color="#7C3AED">C₂H₂  ethyne (C≡C triple bond)</T>
      <T x={280} y={298} size={9} bold align="middle" color="#6B7280">Alkynes: CₙH₂ₙ₋₂ — triple bond — most unsaturated</T>
    </svg>
  );
}

/* ── CHEMISTRY: Carbon Reaction Types ────────────────────────────── */
function CarbonReactionTypes() {
  return (
    <svg viewBox="0 0 560 320" style={{ width: "100%", height: "auto" }}>
      <T x={280} y={16} size={12} bold align="middle">Carbon Compound Reactions — 4 Types</T>

      {[
        {
          x: 20, y: 28, fill: "#FEF9C3", stroke: "#CA8A04",
          title: "(1) Combustion",
          eq1: "CH₄ + 2O₂ → CO₂ + 2H₂O + heat",
          note: "Complete: CO₂ + H₂O | Incomplete: CO + soot",
          icon: "flame",
          col: "#78350F",
        },
        {
          x: 300, y: 28, fill: "#DBEAFE", stroke: "#2563EB",
          title: "(2) Oxidation",
          eq1: "Ethanol →[KMnO₄]→ Ethanoic acid",
          note: "CH₃CH₂OH → CH₃COOH (alcohol → acid)",
          icon: "ox",
          col: "#1E40AF",
        },
        {
          x: 20, y: 172, fill: "#DCFCE7", stroke: "#16A34A",
          title: "(3) Addition (Alkenes)",
          eq1: "CH₂=CH₂ + H₂ →[Ni, 200°C]→ CH₃CH₃",
          note: "Alkene + H₂/X₂/HX → saturated product",
          icon: "add",
          col: "#15803D",
        },
        {
          x: 300, y: 172, fill: "#FEE2E2", stroke: "#EF4444",
          title: "(4) Substitution (Alkanes)",
          eq1: "CH₄ + Cl₂ →[UV light]→ CH₃Cl + HCl",
          note: "H replaced by halogen; chain reaction in sunlight",
          icon: "sun",
          col: "#991B1B",
        },
      ].map((box, i) => (
        <g key={i}>
          <rect x={box.x} y={box.y} width={240} height={135} rx={10} fill={box.fill} stroke={box.stroke} strokeWidth={1.5}/>
          <T x={box.x + 120} y={box.y + 18} size={10} bold align="middle" color={box.col}>{box.title}</T>
          <line x1={box.x + 10} y1={box.y + 26} x2={box.x + 230} y2={box.y + 26} stroke={box.stroke} strokeWidth={0.8}/>
          {/* Icon */}
          {box.icon === "flame" && (
            <path d={`M${box.x+110} ${box.y+60} C${box.x+108} ${box.y+50} ${box.x+114} ${box.y+44} ${box.x+112} ${box.y+38} C${box.x+116} ${box.y+44} ${box.x+118} ${box.y+52} ${box.x+116} ${box.y+60} C${box.x+120} ${box.y+52} ${box.x+118} ${box.y+42} ${box.x+116} ${box.y+36} C${box.x+122} ${box.y+44} ${box.x+124} ${box.y+54} ${box.x+122} ${box.y+62} C${box.x+118} ${box.y+70} ${box.x+106} ${box.y+70} ${box.x+104} ${box.y+62} C${box.x+100} ${box.y+56} ${box.x+102} ${box.y+46} ${box.x+106} ${box.y+40} C${box.x+106} ${box.y+50} ${box.x+108} ${box.y+56} ${box.x+110} ${box.y+60}Z`}
                  fill="#F97316" stroke="#EA580C" strokeWidth={1}/>
          )}
          {box.icon === "ox" && (
            <g>
              <circle cx={box.x+120} cy={box.y+52} r={18} fill="#C4B5FD" stroke="#7C3AED" strokeWidth={1.5}/>
              <T x={box.x+120} y={box.y+56} size={9} bold align="middle" color="#4C1D95">KMnO₄</T>
            </g>
          )}
          {box.icon === "add" && (
            <g>
              <T x={box.x+120} y={box.y+52} size={18} bold align="middle" color="#16A34A">+</T>
              <T x={box.x+120} y={box.y+68} size={8} align="middle" color="#15803D">alkene + H₂</T>
            </g>
          )}
          {box.icon === "sun" && (
            <g>
              <circle cx={box.x+120} cy={box.y+52} r={14} fill="#FEF08A" stroke="#CA8A04" strokeWidth={1.5}/>
              <T x={box.x+120} y={box.y+57} size={10} bold align="middle" color="#92400E">☀</T>
            </g>
          )}
          <T x={box.x + 120} y={box.y + 90} size={8} align="middle" color={box.col}>{box.eq1}</T>
          <line x1={box.x + 10} y1={box.y + 100} x2={box.x + 230} y2={box.y + 100} stroke={box.stroke} strokeWidth={0.5} strokeDasharray="3,2"/>
          <T x={box.x + 120} y={box.y + 114} size={8} align="middle" color="#6B7280">{box.note}</T>
        </g>
      ))}
    </svg>
  );
}

/* ── BIOLOGY: Natural Selection ──────────────────────────────────── */
function NaturalSelection() {
  return (
    <svg viewBox="0 0 560 320" style={{ width: "100%", height: "auto" }}>
      <T x={280} y={16} size={12} bold align="middle">Natural Selection — Darwin's Theory</T>

      {/* Generation labels */}
      {["Gen 1\n(Variation)", "Gen 2\n(Selection)", "Gen 3\n(Adapted)"].map((label, i) => (
        <g key={i}>
          <T x={100 + i * 170} y={38} size={10} bold align="middle" color="#374151">{label.split("\n")[0]}</T>
          <T x={100 + i * 170} y={52} size={9} align="middle" color="#6B7280">{label.split("\n")[1]}</T>
        </g>
      ))}

      {/* Gen 1 — mixed colours (variation) */}
      {[
        "#EF4444","#3B82F6","#EF4444","#16A34A","#3B82F6",
        "#EF4444","#16A34A","#9CA3AF","#EF4444","#3B82F6",
      ].map((col, i) => (
        <circle key={i} cx={55 + (i % 5) * 28} cy={85 + Math.floor(i / 5) * 28} r={10} fill={col} stroke="white" strokeWidth={1.5}/>
      ))}
      <T x={100} y={150} size={8} align="middle" color="#374151">Mixed population</T>

      {/* Selection pressure arrow */}
      <rect x={150} y={82} width={100} height={48} rx={8} fill="#FEF9C3" stroke="#D97706" strokeWidth={1.5}/>
      <T x={200} y={100} size={9} bold align="middle" color="#92400E">Selection</T>
      <T x={200} y={113} size={9} bold align="middle" color="#92400E">Pressure</T>
      <T x={200} y={126} size={8} align="middle" color="#D97706">e.g. predation</T>
      <line x1={250} y1={106} x2={262} y2={106} stroke="#D97706" strokeWidth={2}/>
      <polygon points="260,102 268,106 260,110" fill="#D97706"/>

      {/* Gen 2 — fewer, mostly favoured (blue) */}
      {["#3B82F6","#EF4444","#3B82F6","#3B82F6","#9CA3AF","#3B82F6"].map((col, i) => (
        <circle key={i} cx={288 + (i % 3) * 26} cy={82 + Math.floor(i / 3) * 26} r={10} fill={col} stroke="white" strokeWidth={1.5} opacity={col === "#9CA3AF" ? 0.3 : 1}/>
      ))}
      <T x={315} y={150} size={8} align="middle" color="#374151">Some survive</T>

      {/* Arrow to gen 3 */}
      <line x1={372} y1={106} x2={384} y2={106} stroke="#374151" strokeWidth={2}/>
      <polygon points="382,102 390,106 382,110" fill="#374151"/>

      {/* Gen 3 — mostly favoured variant */}
      {["#3B82F6","#3B82F6","#3B82F6","#3B82F6","#3B82F6","#3B82F6"].map((col, i) => (
        <circle key={i} cx={408 + (i % 3) * 28} cy={82 + Math.floor(i / 3) * 28} r={10} fill={col} stroke="white" strokeWidth={1.5}/>
      ))}
      <T x={436} y={150} size={8} align="middle" color="#3B82F6">Adapted population</T>

      {/* Divider */}
      <line x1={20} y1={168} x2={540} y2={168} stroke="#E5E7EB" strokeWidth={1.5}/>

      {/* Darwin's finches */}
      <T x={280} y={185} size={10} bold align="middle" color="#374151">Darwin's Finches — Beak Adaptation</T>

      {[
        {x: 80, label: "Seeds", beak: "M60,220 L80,215 L100,220 L80,230Z"},
        {x: 240, label: "Insects", beak: "M220,225 L240,215 L260,225 L250,230 L240,228 L230,230Z"},
        {x: 400, label: "Cactus", beak: "M380,225 Q400,210 420,225 L420,230 Q400,218 380,230Z"},
      ].map((f, i) => (
        <g key={i}>
          {/* Bird head */}
          <circle cx={f.x} cy={228} r={18} fill="#FEF9C3" stroke="#D97706" strokeWidth={1.5}/>
          {/* Beak */}
          <path d={f.beak} fill="#F97316" stroke="#EA580C" strokeWidth={1}/>
          {/* Eye */}
          <circle cx={f.x + 6} cy={222} r={3} fill="#374151"/>
          <T x={f.x} y={260} size={8} align="middle" color="#374151">{f.label}</T>
          <T x={f.x} y={272} size={7} align="middle" color="#6B7280">diet</T>
        </g>
      ))}

      <T x={280} y={295} size={9} bold align="middle" color="#6B7280">Different food sources → different beak shapes → natural selection over generations</T>
    </svg>
  );
}

/* ── BIOLOGY: Variation Diagram ──────────────────────────────────── */
function VariationDiagram() {
  return (
    <svg viewBox="0 0 560 320" style={{ width: "100%", height: "auto" }}>
      <T x={280} y={16} size={12} bold align="middle">Asexual vs Sexual Reproduction — Variation</T>

      {/* LEFT — Asexual */}
      <rect x={10} y={26} width={250} height={270} rx={10} fill="#DBEAFE" stroke="#2563EB" strokeWidth={2}/>
      <T x={135} y={46} size={11} bold align="middle" color="#1E40AF">Asexual Reproduction</T>

      {/* Single parent */}
      <circle cx={135} cy={90} r={28} fill="#BFDBFE" stroke="#2563EB" strokeWidth={2}/>
      <T x={135} y={94} size={10} bold align="middle" color="#1E40AF">Parent</T>
      <T x={135} y={107} size={8} align="middle" color="#2563EB">(1 parent)</T>

      {/* Arrow down */}
      <line x1={135} y1={118} x2={135} y2={145} stroke="#2563EB" strokeWidth={2}/>
      <polygon points="130,143 140,143 135,151" fill="#2563EB"/>
      <T x={145} y={135} size={8} color="#2563EB">Mitosis</T>

      {/* Identical offspring */}
      {[{x:90,y:165},{x:135,y:165},{x:180,y:165}].map((o, i) => (
        <g key={i}>
          <circle cx={o.x} cy={o.y} r={20} fill="#BFDBFE" stroke="#2563EB" strokeWidth={1.5}/>
          <T x={o.x} y={o.y + 4} size={8} bold align="middle" color="#1E40AF">clone</T>
        </g>
      ))}
      <T x={135} y={200} size={8} align="middle" color="#374151">Genetically identical</T>

      {/* Small variation marker */}
      <rect x={115} y={210} width={40} height={16} rx={4} fill="#FEF9C3" stroke="#D97706" strokeWidth={1}/>
      <T x={135} y={222} size={7} bold align="middle" color="#D97706">mutation?</T>
      <line x1={135} y1={210} x2={135} y2={200} stroke="#D97706" strokeWidth={1} strokeDasharray="2,2"/>

      {/* Small variation arrow */}
      <rect x={30} y={240} width={210} height={20} rx={5} fill="#DCFCE7" stroke="#16A34A" strokeWidth={1}/>
      <T x={135} y={254} size={8} bold align="middle" color="#15803D">Very little variation (← small)</T>

      <T x={135} y={283} size={8} align="middle" color="#374151">Examples: bacteria, amoeba,</T>
      <T x={135} y={295} size={8} align="middle" color="#374151">yeast, strawberry runners</T>

      {/* RIGHT — Sexual */}
      <rect x={300} y={26} width={250} height={270} rx={10} fill="#FEE2E2" stroke="#EF4444" strokeWidth={2}/>
      <T x={425} y={46} size={11} bold align="middle" color="#991B1B">Sexual Reproduction</T>

      {/* Two parents */}
      <circle cx={370} cy={86} r={24} fill="#FCA5A5" stroke="#EF4444" strokeWidth={2}/>
      <T x={370} y={90} size={9} bold align="middle" color="#991B1B">Parent A</T>
      <circle cx={480} cy={86} r={24} fill="#BFDBFE" stroke="#2563EB" strokeWidth={2}/>
      <T x={480} y={90} size={9} bold align="middle" color="#1E40AF">Parent B</T>

      {/* Arrows to meiosis */}
      <line x1={370} y1={110} x2={400} y2={132} stroke="#374151" strokeWidth={1.5}/>
      <line x1={480} y1={110} x2={450} y2={132} stroke="#374151" strokeWidth={1.5}/>
      <rect x={400} y={130} width={50} height={22} rx={5} fill="#FEF9C3" stroke="#D97706" strokeWidth={1.5}/>
      <T x={425} y={145} size={8} bold align="middle" color="#78350F">Meiosis</T>
      <T x={425} y={158} size={8} align="middle" color="#6B7280">(shuffle genes)</T>

      {/* Fertilisation */}
      <line x1={425} y1={162} x2={425} y2={178} stroke="#374151" strokeWidth={2}/>
      <polygon points="420,176 430,176 425,184" fill="#374151"/>
      <T x={435} y={173} size={8} color="#374151">fertilisation</T>

      {/* Unique offspring */}
      {[{x:370,y:200},{x:425,y:200},{x:480,y:200}].map((o, i) => (
        <g key={i}>
          <circle cx={o.x} cy={o.y} r={20} fill="#FDE68A" stroke="#D97706" strokeWidth={1.5}/>
          <T x={o.x} y={o.y + 4} size={7} bold align="middle" color="#78350F">unique</T>
        </g>
      ))}
      <T x={425} y={235} size={8} align="middle" color="#374151">All genetically different</T>

      {/* Large variation arrow */}
      <rect x={320} y={248} width={210} height={20} rx={5} fill="#FCA5A5" stroke="#EF4444" strokeWidth={1}/>
      <T x={425} y={262} size={8} bold align="middle" color="#991B1B">LARGE variation (←←←←)</T>

      <T x={425} y={283} size={8} align="middle" color="#374151">Examples: humans, animals,</T>
      <T x={425} y={295} size={8} align="middle" color="#374151">flowering plants</T>

      {/* Footer */}
      <T x={280} y={308} size={9} bold align="middle" color="#374151">More variation = more adaptability to environmental change</T>
    </svg>
  );
}

/* ── PHYSICS: Concave Mirror Ray Diagrams ────────────────────────── */
function MirrorRayDiagrams() {
  return (
    <svg viewBox="0 0 560 320" style={{ width: "100%", height: "auto" }}>
      <T x={280} y={14} size={11} bold align="middle">Concave Mirror — Ray Diagrams for Object Positions</T>

      {/* (a) Object beyond C */}
      <T x={85} y={32} size={9} bold align="middle" color="#374151">(a) Object beyond C</T>
      <line x1={10} y1={60} x2={170} y2={60} stroke="#9CA3AF" strokeWidth={1} strokeDasharray="3,2"/>
      <path d="M155 34 Q145 60 155 86" fill="none" stroke="#374151" strokeWidth={2.5}/>
      <circle cx={120} cy={60} r={2.5} fill="#374151"/><T x={116} y={70} size={8}>C</T>
      <circle cx={140} cy={60} r={2.5} fill="#374151"/><T x={136} y={70} size={8}>F</T>
      <circle cx={155} cy={60} r={2.5} fill="#374151"/><T x={151} y={70} size={8}>P</T>
      <line x1={60} y1={60} x2={60} y2={38} stroke="#2563EB" strokeWidth={2}/>
      <polygon points="56,40 64,40 60,32" fill="#2563EB"/>
      <T x={55} y={30} size={8} color="#2563EB">obj</T>
      <line x1={60} y1={38} x2={155} y2={38} stroke="#EF4444" strokeWidth={1.2}/>
      <line x1={155} y1={38} x2={110} y2={74} stroke="#EF4444" strokeWidth={1.2}/>
      <line x1={60} y1={38} x2={120} y2={60} stroke="#16A34A" strokeWidth={1.2}/>
      <line x1={120} y1={60} x2={110} y2={73} stroke="#16A34A" strokeWidth={1.2}/>
      <line x1={110} y1={60} x2={110} y2={76} stroke="#7C3AED" strokeWidth={2}/>
      <polygon points="106,73 114,73 110,79" fill="#7C3AED"/>
      <T x={85} y={90} size={8} align="middle" color="#7C3AED">Real, inverted, diminished</T>

      {/* (b) Object at F */}
      <T x={270} y={32} size={9} bold align="middle" color="#374151">(b) Object at F</T>
      <line x1={190} y1={60} x2={360} y2={60} stroke="#9CA3AF" strokeWidth={1} strokeDasharray="3,2"/>
      <path d="M345 34 Q335 60 345 86" fill="none" stroke="#374151" strokeWidth={2.5}/>
      <circle cx={310} cy={60} r={2.5} fill="#374151"/><T x={306} y={70} size={8}>C</T>
      <circle cx={330} cy={60} r={2.5} fill="#374151"/><T x={326} y={70} size={8}>F</T>
      <circle cx={345} cy={60} r={2.5} fill="#374151"/><T x={341} y={70} size={8}>P</T>
      <line x1={330} y1={60} x2={330} y2={38} stroke="#2563EB" strokeWidth={2}/>
      <polygon points="326,40 334,40 330,32" fill="#2563EB"/>
      <T x={325} y={30} size={8} color="#2563EB">obj</T>
      <line x1={330} y1={38} x2={345} y2={38} stroke="#EF4444" strokeWidth={1.5}/>
      <line x1={345} y1={38} x2={196} y2={38} stroke="#EF4444" strokeWidth={1.5}/>
      <line x1={330} y1={38} x2={310} y2={60} stroke="#16A34A" strokeWidth={1.5}/>
      <line x1={310} y1={60} x2={196} y2={60} stroke="#16A34A" strokeWidth={1.5}/>
      <T x={270} y={90} size={8} align="middle" color="#D97706">Rays parallel — image at ∞</T>

      {/* (c) Object between F and P */}
      <T x={460} y={32} size={9} bold align="middle" color="#374151">(c) Between F and P</T>
      <line x1={390} y1={60} x2={550} y2={60} stroke="#9CA3AF" strokeWidth={1} strokeDasharray="3,2"/>
      <path d="M535 34 Q525 60 535 86" fill="none" stroke="#374151" strokeWidth={2.5}/>
      <circle cx={500} cy={60} r={2.5} fill="#374151"/><T x={496} y={70} size={8}>C</T>
      <circle cx={520} cy={60} r={2.5} fill="#374151"/><T x={516} y={70} size={8}>F</T>
      <circle cx={535} cy={60} r={2.5} fill="#374151"/><T x={531} y={70} size={8}>P</T>
      <line x1={528} y1={60} x2={528} y2={40} stroke="#2563EB" strokeWidth={2}/>
      <polygon points="524,42 532,42 528,34" fill="#2563EB"/>
      <T x={523} y={32} size={8} color="#2563EB">obj</T>
      <line x1={528} y1={40} x2={535} y2={40} stroke="#EF4444" strokeWidth={1.5}/>
      <line x1={535} y1={40} x2={500} y2={60} stroke="#EF4444" strokeWidth={1.5}/>
      <line x1={500} y1={60} x2={395} y2={26} stroke="#EF4444" strokeWidth={1.2} strokeDasharray="3,2"/>
      <line x1={528} y1={40} x2={395} y2={40} stroke="#16A34A" strokeWidth={1.2} strokeDasharray="3,2"/>
      <line x1={395} y1={40} x2={395} y2={20} stroke="#7C3AED" strokeWidth={2} strokeDasharray="3,2"/>
      <polygon points="391,22 399,22 395,14" fill="#7C3AED"/>
      <T x={460} y={90} size={8} align="middle" color="#7C3AED">Virtual, erect, magnified</T>

      {/* Sign convention table */}
      <rect x={10} y={108} width={540} height={90} rx={8} fill="#F9FAFB" stroke="#E5E7EB" strokeWidth={1}/>
      <T x={280} y={124} size={10} bold align="middle" color="#374151">Mirror Formula & Sign Convention (New Cartesian)</T>
      <T x={280} y={142} size={10} bold align="middle" color="#D97706">1/v + 1/u = 1/f   |   m = −v/u</T>
      <T x={140} y={160} size={9} align="middle" color="#374151">u = always negative (object in front)</T>
      <T x={420} y={160} size={9} align="middle" color="#374151">v = negative for real image, +ve for virtual</T>
      <T x={140} y={178} size={9} align="middle" color="#374151">f = negative for concave mirror</T>
      <T x={420} y={178} size={9} align="middle" color="#374151">f = positive for convex mirror</T>

      {/* Summary row */}
      <rect x={10} y={210} width={540} height={100} rx={8} fill="#F0F4FF" stroke="#BFDBFE" strokeWidth={1}/>
      <T x={280} y={228} size={10} bold align="middle" color="#1E40AF">Summary of Image Positions — Concave Mirror</T>
      {[
        {pos: "Object at ∞",         img: "At F",              nature: "Real, inverted, point"},
        {pos: "Beyond C",            img: "Between F and C",   nature: "Real, inverted, diminished"},
        {pos: "At C",                img: "At C",              nature: "Real, inverted, same size"},
        {pos: "Between F & C",       img: "Beyond C",          nature: "Real, inverted, magnified"},
        {pos: "Between F & P",       img: "Behind mirror",     nature: "Virtual, erect, magnified"},
      ].map((row, i) => (
        <g key={i}>
          <T x={30} y={244 + i * 13} size={8} color="#374151">{row.pos}</T>
          <T x={220} y={244 + i * 13} size={8} color="#2563EB">{row.img}</T>
          <T x={370} y={244 + i * 13} size={8} color="#16A34A">{row.nature}</T>
        </g>
      ))}
    </svg>
  );
}

/* ── PHYSICS: Basic Electric Circuit ─────────────────────────────── */
function ElectricCircuit() {
  return (
    <svg viewBox="0 0 560 320" style={{ width: "100%", height: "auto" }}>
      <T x={280} y={16} size={12} bold align="middle">Basic Electric Circuit — Current, Voltage, Resistance</T>

      {/* Circuit outline — rectangle */}
      <line x1={80} y1={80} x2={460} y2={80} stroke="#374151" strokeWidth={3}/>
      <line x1={460} y1={80} x2={460} y2={220} stroke="#374151" strokeWidth={3}/>
      <line x1={460} y1={220} x2={80} y2={220} stroke="#374151" strokeWidth={3}/>
      <line x1={80} y1={220} x2={80} y2={80} stroke="#374151" strokeWidth={3}/>

      {/* Battery (cell) — top-left */}
      <rect x={60} y={95} width={40} height={55} rx={4} fill="#F9FAFB" stroke="#374151" strokeWidth={2}/>
      <line x1={70} y1={105} x2={90} y2={105} stroke="#374151" strokeWidth={4}/>
      <line x1={76} y1={115} x2={84} y2={115} stroke="#374151" strokeWidth={1.5}/>
      <line x1={70} y1={125} x2={90} y2={125} stroke="#374151" strokeWidth={4}/>
      <line x1={76} y1={135} x2={84} y2={135} stroke="#374151" strokeWidth={1.5}/>
      <T x={100} y={122} size={9} bold color="#374151">Battery</T>
      <T x={60} y={166} size={9} color="#374151">+ −</T>

      {/* Switch — top wire */}
      <circle cx={220} cy={80} r={5} fill="#374151"/>
      <circle cx={260} cy={80} r={5} fill="#374151"/>
      <line x1={220} y1={80} x2={252} y2={66} stroke="#374151" strokeWidth={2}/>
      <T x={240} y={60} size={9} bold align="middle" color="#374151">Switch</T>

      {/* Resistor — bottom wire */}
      <rect x={190} y={210} width={120} height={20} rx={5} fill="#FDE68A" stroke="#D97706" strokeWidth={2}/>
      <T x={250} y={224} size={9} bold align="middle" color="#78350F">R (Resistor)</T>
      <T x={250} y={242} size={8} align="middle" color="#D97706">V = IR</T>

      {/* Ammeter — right wire */}
      <circle cx={460} cy={150} r={18} fill="#DCFCE7" stroke="#16A34A" strokeWidth={2}/>
      <T x={460} y={155} size={11} bold align="middle" color="#15803D">A</T>
      <T x={488} y={153} size={9} color="#15803D">Ammeter</T>
      <T x={488} y={165} size={8} color="#6B7280">(series)</T>

      {/* Voltmeter — parallel across resistor */}
      <line x1={190} y1={220} x2={190} y2={268} stroke="#374151" strokeWidth={1.5} strokeDasharray="3,2"/>
      <line x1={310} y1={220} x2={310} y2={268} stroke="#374151" strokeWidth={1.5} strokeDasharray="3,2"/>
      <line x1={190} y1={268} x2={235} y2={268} stroke="#374151" strokeWidth={1.5} strokeDasharray="3,2"/>
      <line x1={265} y1={268} x2={310} y2={268} stroke="#374151" strokeWidth={1.5} strokeDasharray="3,2"/>
      <circle cx={250} cy={268} r={18} fill="#FEF9C3" stroke="#D97706" strokeWidth={2}/>
      <T x={250} y={273} size={11} bold align="middle" color="#78350F">V</T>
      <T x={250} y={294} size={8} align="middle" color="#D97706">Voltmeter (parallel)</T>

      {/* Current direction arrows */}
      <polygon points="336,76 348,80 336,84" fill="#EF4444"/>
      <T x={342} y={72} size={8} color="#EF4444">I →</T>
      <T x={342} y={97} size={8} color="#2563EB">e⁻ ←</T>
      <polygon points="178,84 166,80 178,76" fill="#2563EB"/>

      {/* Formula box */}
      <rect x={10} y={300} width={540} height={18} rx={5} fill="#F0F9FF" stroke="#BAE6FD" strokeWidth={1}/>
      <T x={280} y={313} size={9} bold align="middle" color="#0369A1">V = W/Q (potential difference = work done / charge)  |  I = Q/t  |  V = IR</T>
    </svg>
  );
}

/* ── PHYSICS: Electric Power & Heating ───────────────────────────── */
function PowerHeating() {
  return (
    <svg viewBox="0 0 560 320" style={{ width: "100%", height: "auto" }}>
      <T x={280} y={16} size={12} bold align="middle">Electric Power and Joule's Heating Effect</T>

      {/* Central box */}
      <rect x={210} y={28} width={140} height={44} rx={10} fill="#FDE68A" stroke="#D97706" strokeWidth={2}/>
      <T x={280} y={48} size={11} bold align="middle" color="#78350F">Electric Power</T>
      <T x={280} y={62} size={10} bold align="middle" color="#92400E">P (Watts)</T>

      {/* Three formula bubbles */}
      {[
        {x: 80, y: 105, formula: "P = VI", note: "V=voltage, I=current", col: "#1E40AF", bg: "#DBEAFE", stroke: "#2563EB"},
        {x: 280, y: 105, formula: "P = I²R", note: "R=resistance (Ω)", col: "#15803D", bg: "#DCFCE7", stroke: "#16A34A"},
        {x: 480, y: 105, formula: "P = V²/R", note: "V=potential diff", col: "#991B1B", bg: "#FEE2E2", stroke: "#EF4444"},
      ].map((b, i) => (
        <g key={i}>
          <line x1={b.x} y1={72} x2={b.x === 280 ? 280 : (b.x < 280 ? 230 : 330)} y2={72} stroke="#D97706" strokeWidth={1.5}/>
          <line x1={b.x} y1={72} x2={b.x} y2={82} stroke="#D97706" strokeWidth={1.5}/>
          <ellipse cx={b.x} cy={b.y} rx={72} ry={30} fill={b.bg} stroke={b.stroke} strokeWidth={1.5}/>
          <T x={b.x} y={b.y + 4} size={13} bold align="middle" color={b.col}>{b.formula}</T>
          <T x={b.x} y={b.y + 20} size={8} align="middle" color="#6B7280">{b.note}</T>
        </g>
      ))}

      {/* Joule's Law box */}
      <rect x={10} y={160} width={260} height={90} rx={10} fill="#FEF3C7" stroke="#D97706" strokeWidth={2}/>
      <T x={140} y={178} size={10} bold align="middle" color="#92400E">Joule's Heating Law</T>
      <T x={140} y={196} size={13} bold align="middle" color="#D97706">H = I²Rt</T>
      <T x={140} y={213} size={9} align="middle" color="#374151">H = heat (J), I = current (A)</T>
      <T x={140} y={227} size={9} align="middle" color="#374151">R = resistance (Ω), t = time (s)</T>
      {/* Wavy heat lines */}
      {[0,1,2].map(i => (
        <path key={i} d={`M${160+i*20} 240 Q${165+i*20} 250 ${160+i*20} 260`} fill="none" stroke="#EF4444" strokeWidth={2}/>
      ))}
      <T x={140} y={245} size={8} align="middle" color="#EF4444">heat dissipated ~~~</T>

      {/* Energy unit box */}
      <rect x={290} y={160} width={260} height={90} rx={10} fill="#EDE9FE" stroke="#7C3AED" strokeWidth={2}/>
      <T x={420} y={178} size={10} bold align="middle" color="#4C1D95">Commercial Unit of Energy</T>
      <T x={420} y={196} size={11} bold align="middle" color="#7C3AED">1 kWh = 3.6 × 10⁶ J</T>
      <T x={420} y={213} size={9} align="middle" color="#374151">kWh = kilowatt-hour</T>
      <T x={420} y={227} size={9} align="middle" color="#374151">Energy (kWh) = P(kW) × t(h)</T>
      <T x={420} y={244} size={8} align="middle" color="#6B7280">Electricity bill unit</T>

      {/* Applications row */}
      <rect x={10} y={268} width={540} height={44} rx={8} fill="#F9FAFB" stroke="#E5E7EB" strokeWidth={1}/>
      <T x={280} y={284} size={10} bold align="middle" color="#374151">Applications of Heating Effect:</T>
      {["Electric Iron", "Incandescent Bulb", "Electric Heater", "Fuse wire"].map((app, i) => (
        <T key={i} x={70 + i * 120} y={302} size={9} align="middle" color="#6B7280">{app}</T>
      ))}
    </svg>
  );
}

/* ── PHYSICS: Domestic Circuits ──────────────────────────────────── */
function DomesticCircuit() {
  return (
    <svg viewBox="0 0 560 320" style={{ width: "100%", height: "auto" }}>
      <T x={280} y={16} size={12} bold align="middle">Domestic Electric Wiring — Earth, Fuse, MCB</T>

      {/* Meter board */}
      <rect x={10} y={36} width={75} height={140} rx={6} fill="#F3F4F6" stroke="#374151" strokeWidth={2}/>
      <T x={48} y={55} size={9} bold align="middle" color="#374151">Meter</T>
      <T x={48} y={67} size={9} bold align="middle" color="#374151">Board</T>
      {/* Fuse / MCB */}
      <rect x={20} y={76} width={55} height={18} rx={4} fill="#FDE68A" stroke="#D97706" strokeWidth={1.5}/>
      <T x={48} y={89} size={8} bold align="middle" color="#78350F">Fuse / MCB</T>
      <rect x={20} y={100} width={55} height={16} rx={3} fill="#BFDBFE" stroke="#2563EB" strokeWidth={1}/>
      <T x={48} y={112} size={8} align="middle" color="#1E40AF">Main switch</T>

      {/* Three wires from meter board */}
      {/* Live — red/brown */}
      <line x1={86} y1={95} x2={540} y2={95} stroke="#EF4444" strokeWidth={3}/>
      <T x={94} y={89} size={8} bold color="#EF4444">L (Live — Brown/Red)</T>
      {/* Neutral — blue */}
      <line x1={86} y1={150} x2={540} y2={150} stroke="#2563EB" strokeWidth={3}/>
      <T x={94} y={145} size={8} bold color="#2563EB">N (Neutral — Blue)</T>
      {/* Earth — green */}
      <line x1={86} y1={200} x2={540} y2={200} stroke="#16A34A" strokeWidth={2} strokeDasharray="6,3"/>
      <T x={94} y={195} size={8} bold color="#16A34A">E (Earth — Green/Yellow)</T>

      {/* Three parallel branches */}
      {[
        {x: 160, label: "Light Bulb", shape: "bulb"},
        {x: 320, label: "Fan", shape: "fan"},
        {x: 480, label: "Geyser", shape: "geyser"},
      ].map((branch, i) => (
        <g key={i}>
          {/* Live down */}
          <line x1={branch.x} y1={95} x2={branch.x} y2={110} stroke="#EF4444" strokeWidth={2}/>
          {/* Switch */}
          <rect x={branch.x - 12} y={110} width={24} height={12} rx={3} fill="#FDE68A" stroke="#D97706" strokeWidth={1.2}/>
          <T x={branch.x} y={120} size={7} bold align="middle" color="#78350F">SW</T>
          {/* Appliance */}
          <line x1={branch.x} y1={122} x2={branch.x} y2={134} stroke="#EF4444" strokeWidth={2}/>
          <rect x={branch.x - 22} y={134} width={44} height={28} rx={6} fill="#E9D5FF" stroke="#7C3AED" strokeWidth={1.5}/>
          <T x={branch.x} y={152} size={7} bold align="middle" color="#4C1D95">{branch.label}</T>
          {/* Neutral up */}
          <line x1={branch.x} y1={162} x2={branch.x} y2={150} stroke="#2563EB" strokeWidth={2}/>
          {/* Earth to metal body */}
          <line x1={branch.x} y1={162} x2={branch.x} y2={200} stroke="#16A34A" strokeWidth={1.5} strokeDasharray="4,2"/>
        </g>
      ))}

      {/* Short circuit indicator */}
      <rect x={400} y={80} width={60} height={24} rx={4} fill="#FEE2E2" stroke="#EF4444" strokeWidth={1.5}/>
      <T x={430} y={96} size={8} bold align="middle" color="#991B1B">Short ✗</T>
      <line x1={430} y1={104} x2={430} y2={150} stroke="#EF4444" strokeWidth={1} strokeDasharray="2,2"/>

      {/* Fuse strip detail */}
      <rect x={10} y={215} width={540} height={92} rx={8} fill="#F9FAFB" stroke="#E5E7EB" strokeWidth={1}/>
      <T x={280} y={232} size={10} bold align="middle" color="#374151">Key Safety Features:</T>
      <T x={140} y={250} size={9} align="middle" color="#EF4444">Fuse: thin wire melts if I too high — breaks circuit</T>
      <T x={420} y={250} size={9} align="middle" color="#D97706">MCB: trips automatically, can reset</T>
      <T x={140} y={267} size={9} align="middle" color="#16A34A">Earth wire: connects metal body to ground — safety</T>
      <T x={420} y={267} size={9} align="middle" color="#2563EB">Neutral: at 0 V, returns current to supply</T>
      <T x={280} y={285} size={9} align="middle" color="#374151">Live wire (230 V) is the DANGEROUS wire — fuse always in series with LIVE</T>
      <T x={280} y={300} size={8} align="middle" color="#6B7280">India: 230 V, 50 Hz AC supply | Three-pin plug: L(right), N(left), E(top)</T>
    </svg>
  );
}

/* ── ECOLOGY: Biodegradability ────────────────────────────────────── */
function WasteTypes() {
  return (
    <svg viewBox="0 0 560 320" style={{ width: "100%", height: "auto" }}>
      <T x={280} y={16} size={12} bold align="middle">Biodegradable vs Non-biodegradable Waste</T>

      {/* Left — Biodegradable */}
      <rect x={10} y={28} width={255} height={278} rx={10} fill="#DCFCE7" stroke="#16A34A" strokeWidth={2}/>
      <T x={137} y={46} size={11} bold align="middle" color="#15803D">Biodegradable</T>

      {/* Examples */}
      {["Food scraps", "Paper", "Cotton cloth", "Dead leaves", "Wood"].map((item, i) => (
        <g key={i}>
          <circle cx={40} cy={68 + i * 22} r={5} fill="#16A34A"/>
          <T x={52} y={72 + i * 22} size={9} color="#1D1D1F">{item}</T>
        </g>
      ))}

      {/* Arrow down to decomposers */}
      <line x1={137} y1={190} x2={137} y2={208} stroke="#15803D" strokeWidth={2}/>
      <polygon points="132,206 142,206 137,214" fill="#15803D"/>
      <T x={137} y={188} size={9} align="middle" color="#15803D">↓ broken down by</T>

      {/* Decomposers box */}
      <rect x={50} y={214} width={175} height={26} rx={6} fill="#86EFAC" stroke="#16A34A" strokeWidth={1.5}/>
      <T x={137} y={230} size={9} bold align="middle" color="#14532D">Decomposers (bacteria, fungi)</T>

      {/* Arrow to products */}
      <line x1={137} y1={240} x2={137} y2={255} stroke="#15803D" strokeWidth={2}/>
      <polygon points="132,253 142,253 137,261" fill="#15803D"/>

      <T x={137} y={270} size={9} align="middle" color="#15803D">CO₂ + H₂O + nutrients</T>
      {/* Cycle arrow back to plant */}
      <path d="M90 278 C50 285 38 295 55 303 C70 310 110 305 137 295" fill="none" stroke="#16A34A" strokeWidth={1.5} strokeDasharray="4,2"/>
      <polygon points="134,291 140,297 145,289" fill="#16A34A"/>
      <T x={137} y={293} size={8} align="middle" color="#15803D">→ back to soil / plants</T>

      {/* Right — Non-biodegradable */}
      <rect x={295} y={28} width={255} height={278} rx={10} fill="#FEE2E2" stroke="#EF4444" strokeWidth={2}/>
      <T x={422} y={46} size={11} bold align="middle" color="#991B1B">Non-biodegradable</T>

      {/* Examples */}
      {["Plastic bottles", "DDT (pesticide)", "Styrofoam", "Metal cans", "Nylon / Polyester"].map((item, i) => (
        <g key={i}>
          <circle cx={315} cy={68 + i * 22} r={5} fill="#EF4444"/>
          <T x={327} y={72 + i * 22} size={9} color="#1D1D1F">{item}</T>
        </g>
      ))}

      {/* Arrow to environment */}
      <line x1={422} y1={188} x2={422} y2={208} stroke="#EF4444" strokeWidth={2}/>
      <polygon points="417,206 427,206 422,214" fill="#EF4444"/>
      <T x={422} y={186} size={9} align="middle" color="#EF4444">↓ stays in environment</T>

      {/* Biomagnification pyramid */}
      <polygon points="422,218 380,260 464,260" fill="#FCA5A5" stroke="#EF4444" strokeWidth={1.5}/>
      <line x1={380} y1={260} x2={464} y2={260} stroke="#EF4444" strokeWidth={1.5}/>
      <T x={422} y={244} size={8} bold align="middle" color="#991B1B">Biomagnification</T>
      <T x={422} y={255} size={7} align="middle" color="#991B1B">↑ concentration</T>
      <T x={310} y={258} size={8} color="#EF4444">Top</T>
      <T x={310} y={270} size={8} color="#EF4444">predator</T>

      {/* Trophic level labels beside pyramid */}
      <T x={422} y={272} size={8} align="middle" color="#374151">Affects entire food chain</T>
      <T x={422} y={286} size={8} align="middle" color="#374151">e.g. DDT → fish → eagle</T>
      <T x={422} y={300} size={8} align="middle" color="#6B7280">(reproductive failure)</T>
    </svg>
  );
}

/* ── MAP + EXPORT ────────────────────────────────────────────────── */

const DIAGRAM_MAP = {
  // Biology
  sci_ch5_human_digestion:            { label: "Human Digestive System",              Component: DigestiveSystem },
  sci_ch5_transport_blood:            { label: "Human Heart — 4 Chambers",            Component: Heart },
  sci_ch5_excretion:                  { label: "Structure of a Nephron",               Component: Nephron },
  sci_ch5_photosynthesis:             { label: "Photosynthesis — Inputs & Outputs",    Component: Photosynthesis },
  sci_ch5_respiration:                { label: "Aerobic Respiration — Stages",         Component: Respiration },
  sci_ch5_transport_plants:           { label: "Xylem & Phloem — Stem Cross-Section",  Component: XylemPhloem },
  sci_ch6_nervous_system:             { label: "Structure of a Neuron",                Component: Neuron },
  sci_ch6_reflex_arc:                 { label: "Reflex Arc",                            Component: ReflexArc },
  sci_ch6_brain:                      { label: "Human Brain — Structure",              Component: HumanBrain },
  sci_ch6_plant_hormones:             { label: "Plant Tropisms",                        Component: PlantHormones },
  sci_ch7_sexual_reproduction_plants: { label: "Parts of a Flower",                   Component: Flower },
  sci_ch7_asexual_reproduction:       { label: "Methods of Asexual Reproduction",     Component: AsexualReproduction },
  sci_ch7_human_reproduction:         { label: "Human Reproductive Systems",          Component: HumanReproduction },
  sci_ch8_mendels_laws:               { label: "Mendel's Monohybrid Cross",            Component: PunnettSquare },
  sci_ch8_sex_determination:          { label: "Sex Determination — XX/XY",           Component: SexDetermination },
  sci_ch13_ecosystem:                 { label: "Food Chain & Trophic Levels",          Component: FoodChain },
  sci_ch13_energy_flow:               { label: "Energy Pyramid — 10% Law",            Component: EnergyPyramid },
  sci_ch13_ozone:                     { label: "Ozone Layer Depletion",                Component: OzoneLayer },
  // Chemistry
  sci_ch1_balancing_equations:        { label: "Conservation of Mass — Balance Scale", Component: BalanceScale },
  sci_ch1_signs_and_types:            { label: "Types of Chemical Reactions",          Component: TypesOfReactions },
  sci_ch2_ph_scale:                   { label: "pH Scale 0–14",                        Component: PHScale },
  sci_ch3_ionic_bonding:              { label: "Ionic Bonding — NaCl Formation",       Component: IonicBonding },
  sci_ch3_reactivity_series:          { label: "Reactivity Series of Metals",          Component: ReactivitSeries },
  sci_ch4_ethanol_and_ethanoic_acid:  { label: "Soap Micelle Structure",               Component: SoapMicelle },
  sci_ch4_covalent_bonding:           { label: "Covalent Bonding — CH₄, CO₂, H₂O",   Component: CovalentBonding },
  // Physics
  sci_ch9_reflection_mirrors:         { label: "Concave & Convex Mirror Diagrams",     Component: MirrorDiagrams },
  sci_ch9_lenses:                     { label: "Convex Lens — Ray Diagram",            Component: LensRayDiagram },
  sci_ch9_refraction_snells_law:      { label: "Refraction of Light — Snell's Law",    Component: SnellsLaw },
  sci_ch10_human_eye:                 { label: "Structure of the Human Eye",           Component: HumanEye },
  sci_ch10_eye_defects:               { label: "Myopia & Hypermetropia Correction",    Component: EyeDefects },
  sci_ch10_dispersion_scattering:     { label: "Prism Dispersion — VIBGYOR",           Component: PrismDispersion },
  sci_ch11_series_parallel:           { label: "Series & Parallel Circuits",           Component: SeriesParallelCircuit },
  sci_ch11_ohms_law_resistance:       { label: "Ohm's Law — V-I Graph",               Component: OhmsLaw },
  sci_ch12_magnetic_field:            { label: "Solenoid & Magnetic Field",            Component: Solenoid },
  sci_ch12_electric_motor:            { label: "Electric Motor — Construction",        Component: ElectricMotor },
  sci_ch12_electromagnetic_induction: { label: "AC Generator — Faraday's Law",         Component: ACGenerator },
  sci_ch12_force_on_conductor:        { label: "Fleming's Left-Hand Rule",             Component: FlemingRule },
  // New topics
  sci_ch4_carbon_allotropes:          { label: "Allotropes of Carbon",                 Component: CarbonAllotropes },
  sci_ch6_endocrine_system:           { label: "Endocrine Glands — Body Map",          Component: EndocrineSystem },
  sci_ch7_reproductive_health:        { label: "Contraception & STD Protection",       Component: ContraceptionMethods },
  // New Science diagrams — Chapter 1-13
  sci_ch1_oxidation_reduction:        { label: "OIL RIG — Redox Electron Transfer",      Component: OxidationReduction },
  sci_ch1_thermal_decomposition:      { label: "Three Types of Decomposition",            Component: DecompositionTypes },
  sci_ch2_acids_bases_indicators:     { label: "Acid-Base Indicators — Colour Chart",     Component: AcidBaseIndicators },
  sci_ch2_acids_reactions:            { label: "Acid Reactions — Metal, Carbonate, Base", Component: AcidReactions },
  sci_ch2_salts:                      { label: "Chlor-Alkali Electrolysis Process",        Component: ChlorAlkali },
  sci_ch3_physical_properties:        { label: "Metals vs Non-metals — Properties",       Component: MetalNonmetalProperties },
  sci_ch3_extraction_metallurgy:      { label: "Blast Furnace — Iron Extraction",         Component: BlastFurnace },
  sci_ch4_homologous_series:          { label: "Homologous Series — Structural Formulas", Component: HomologousSeries },
  sci_ch4_carbon_reactions:           { label: "Carbon Reactions — 4 Types",              Component: CarbonReactionTypes },
  sci_ch8_evolution:                  { label: "Natural Selection — Population Change",   Component: NaturalSelection },
  sci_ch8_variation:                  { label: "Asexual vs Sexual Variation",             Component: VariationDiagram },
  sci_ch9_mirror_formula:             { label: "Concave Mirror — Ray Diagrams",           Component: MirrorRayDiagrams },
  sci_ch11_current_potential:         { label: "Basic Electric Circuit with Ammeter",     Component: ElectricCircuit },
  sci_ch11_power_heating:             { label: "Electric Power Formulas — P=VI=I²R",      Component: PowerHeating },
  sci_ch12_domestic_circuits:         { label: "Domestic Wiring — Earth, Fuse, MCB",     Component: DomesticCircuit },
  sci_ch13_biodegradability:          { label: "Biodegradable vs Non-biodegradable",      Component: WasteTypes },
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
