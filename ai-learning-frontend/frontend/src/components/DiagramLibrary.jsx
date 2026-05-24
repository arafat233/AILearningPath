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

function EuclidDivision() {
  return (
    <svg viewBox="0 0 560 200" width="100%" height="auto">
      <text x="20" y="30" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif" fontWeight="600">Euclid's Division Lemma: a = b·q + r,  0 ≤ r &lt; b</text>
      {/* Example: 17 = 5·3 + 2 */}
      <rect x="20" y="50" width="80" height="36" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <text x="60" y="73" fill="currentColor" fontSize="16" fontFamily="system-ui,sans-serif" textAnchor="middle" fontWeight="700">17</text>
      <text x="120" y="73" fill="currentColor" fontSize="14" fontFamily="system-ui,sans-serif" textAnchor="middle">=</text>
      <rect x="150" y="50" width="60" height="36" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <text x="180" y="73" fill="currentColor" fontSize="16" fontFamily="system-ui,sans-serif" textAnchor="middle" fontWeight="700">5</text>
      <text x="225" y="73" fill="currentColor" fontSize="14" fontFamily="system-ui,sans-serif" textAnchor="middle">×</text>
      <rect x="245" y="50" width="60" height="36" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <text x="275" y="73" fill="currentColor" fontSize="16" fontFamily="system-ui,sans-serif" textAnchor="middle" fontWeight="700">3</text>
      <text x="320" y="73" fill="currentColor" fontSize="14" fontFamily="system-ui,sans-serif" textAnchor="middle">+</text>
      <rect x="340" y="50" width="60" height="36" rx="4" fill="#FF9500" fillOpacity="0.15" stroke="#FF9500" strokeWidth="1.5"/>
      <text x="370" y="73" fill="currentColor" fontSize="16" fontFamily="system-ui,sans-serif" textAnchor="middle" fontWeight="700">2</text>
      <text x="20" y="115" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">a = dividend (17)</text>
      <text x="160" y="115" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">b = divisor (5)</text>
      <text x="280" y="115" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">q = quotient (3)</text>
      <text x="340" y="115" fill="#FF9500" fontSize="12" fontFamily="system-ui,sans-serif" fontWeight="600">r = remainder (2)</text>
      <text x="20" y="150" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">Condition: 0 ≤ r &lt; b   →   0 ≤ 2 &lt; 5  ✓</text>
      <text x="20" y="175" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif" opacity="0.7">Used to find HCF: apply lemma repeatedly until remainder = 0</text>
    </svg>
  );
}

function PrimeFactorTree() {
  return (
    <svg viewBox="0 0 560 280" width="100%" height="auto">
      <text x="20" y="28" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif" fontWeight="600">Factor Tree — Fundamental Theorem of Arithmetic</text>
      {/* Tree for 360 */}
      <text x="260" y="60" fill="currentColor" fontSize="16" fontFamily="system-ui,sans-serif" textAnchor="middle" fontWeight="700">360</text>
      <line x1="240" y1="65" x2="190" y2="90" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="280" y1="65" x2="330" y2="90" stroke="currentColor" strokeWidth="1.5"/>
      <text x="180" y="105" fill="currentColor" fontSize="14" fontFamily="system-ui,sans-serif" textAnchor="middle">2</text>
      <circle cx="180" cy="99" r="12" fill="none" stroke="#34C759" strokeWidth="1.5"/>
      <text x="340" y="105" fill="currentColor" fontSize="14" fontFamily="system-ui,sans-serif" textAnchor="middle">180</text>
      <line x1="320" y1="110" x2="280" y2="135" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="360" y1="110" x2="400" y2="135" stroke="currentColor" strokeWidth="1.5"/>
      <text x="268" y="150" fill="currentColor" fontSize="14" fontFamily="system-ui,sans-serif" textAnchor="middle">2</text>
      <circle cx="268" cy="144" r="12" fill="none" stroke="#34C759" strokeWidth="1.5"/>
      <text x="410" y="150" fill="currentColor" fontSize="14" fontFamily="system-ui,sans-serif" textAnchor="middle">90</text>
      <line x1="395" y1="155" x2="370" y2="180" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="425" y1="155" x2="450" y2="180" stroke="currentColor" strokeWidth="1.5"/>
      <text x="358" y="195" fill="currentColor" fontSize="14" fontFamily="system-ui,sans-serif" textAnchor="middle">2</text>
      <circle cx="358" cy="189" r="12" fill="none" stroke="#34C759" strokeWidth="1.5"/>
      <text x="462" y="195" fill="currentColor" fontSize="14" fontFamily="system-ui,sans-serif" textAnchor="middle">45</text>
      <line x1="448" y1="200" x2="430" y2="225" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="476" y1="200" x2="494" y2="225" stroke="currentColor" strokeWidth="1.5"/>
      <text x="420" y="240" fill="currentColor" fontSize="14" fontFamily="system-ui,sans-serif" textAnchor="middle">3</text>
      <circle cx="420" cy="234" r="12" fill="none" stroke="#34C759" strokeWidth="1.5"/>
      <text x="505" y="240" fill="currentColor" fontSize="14" fontFamily="system-ui,sans-serif" textAnchor="middle">15</text>
      <line x1="492" y1="245" x2="478" y2="265" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="518" y1="245" x2="532" y2="265" stroke="currentColor" strokeWidth="1.5"/>
      <text x="468" y="275" fill="currentColor" fontSize="14" fontFamily="system-ui,sans-serif" textAnchor="middle">3</text>
      <circle cx="468" cy="269" r="12" fill="none" stroke="#34C759" strokeWidth="1.5"/>
      <text x="542" y="275" fill="currentColor" fontSize="14" fontFamily="system-ui,sans-serif" textAnchor="middle">5</text>
      <circle cx="542" cy="269" r="12" fill="none" stroke="#34C759" strokeWidth="1.5"/>
      <text x="20" y="240" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif">360 = 2³ × 3² × 5</text>
      <text x="20" y="265" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif" opacity="0.7">Every integer &gt;1 has a unique prime factorisation (order doesn't matter)</text>
    </svg>
  );
}

function HcfLcm() {
  return (
    <svg viewBox="0 0 560 260" width="100%" height="auto">
      <text x="20" y="28" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif" fontWeight="600">HCF and LCM via Prime Factors</text>
      {/* Venn diagram */}
      <circle cx="210" cy="145" r="90" fill="#007AFF" fillOpacity="0.12" stroke="#007AFF" strokeWidth="1.5"/>
      <circle cx="330" cy="145" r="90" fill="#34C759" fillOpacity="0.12" stroke="#34C759" strokeWidth="1.5"/>
      <text x="155" y="110" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif" textAnchor="middle">12 = 2²×3</text>
      <text x="395" y="110" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif" textAnchor="middle">18 = 2×3²</text>
      {/* Only in 12 */}
      <text x="165" y="148" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif" textAnchor="middle" fontWeight="600">2</text>
      {/* Common */}
      <text x="270" y="140" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif" textAnchor="middle" fontWeight="700">2 × 3</text>
      <text x="270" y="158" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif" textAnchor="middle">(common)</text>
      {/* Only in 18 */}
      <text x="375" y="148" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif" textAnchor="middle" fontWeight="600">3</text>
      <text x="20" y="220" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif">HCF = product of common factors (lowest powers) = 2¹×3¹ = 6</text>
      <text x="20" y="245" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif">LCM = product of all factors (highest powers) = 2²×3² = 36</text>
      <text x="400" y="245" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">HCF × LCM = 6×36 = 216 = 12×18 ✓</text>
    </svg>
  );
}

function IrrationalProof() {
  return (
    <svg viewBox="0 0 560 220" width="100%" height="auto">
      <text x="20" y="28" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif" fontWeight="600">√2 is Irrational — Proof by Contradiction</text>
      <rect x="20" y="45" width="520" height="150" rx="8" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4,3"/>
      <text x="36" y="72" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">Assume √2 = p/q  (lowest terms, p and q have no common factor)</text>
      <text x="36" y="96" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">⟹  2 = p²/q²  ⟹  p² = 2q²  ⟹  p² is even  ⟹  p is even</text>
      <text x="36" y="120" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">Let p = 2k  ⟹  (2k)² = 2q²  ⟹  4k² = 2q²  ⟹  q² = 2k²</text>
      <text x="36" y="144" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">⟹  q² is even  ⟹  q is even</text>
      <text x="36" y="168" fill="#FF3B30" fontSize="12" fontFamily="system-ui,sans-serif" fontWeight="600">But p and q are BOTH even ⟹ common factor 2 — CONTRADICTS lowest terms!</text>
      <text x="36" y="188" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif" fontWeight="700">∴  √2 is irrational ∎</text>
    </svg>
  );
}

function DecimalExpansion() {
  return (
    <svg viewBox="0 0 560 200" width="100%" height="auto">
      <text x="20" y="28" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif" fontWeight="600">Rational Numbers: Terminating vs Non-terminating Recurring</text>
      {/* Terminating column */}
      <rect x="20" y="42" width="240" height="130" rx="6" fill="#34C759" fillOpacity="0.08" stroke="#34C759" strokeWidth="1.5"/>
      <text x="140" y="62" fill="#34C759" fontSize="13" fontFamily="system-ui,sans-serif" textAnchor="middle" fontWeight="700">Terminating</text>
      <text x="140" y="84" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif" textAnchor="middle">Denominator = 2ⁿ × 5ᵐ only</text>
      <text x="140" y="104" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif" textAnchor="middle">3/8 = 0.375  ✓</text>
      <text x="140" y="122" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif" textAnchor="middle">7/25 = 0.28  ✓</text>
      <text x="140" y="143" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif" textAnchor="middle">1/4 = 0.25  ✓</text>
      <text x="140" y="163" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif" textAnchor="middle" opacity="0.7">Decimal ends</text>
      {/* Non-terminating column */}
      <rect x="300" y="42" width="240" height="130" rx="6" fill="#FF9500" fillOpacity="0.08" stroke="#FF9500" strokeWidth="1.5"/>
      <text x="420" y="62" fill="#FF9500" fontSize="13" fontFamily="system-ui,sans-serif" textAnchor="middle" fontWeight="700">Non-terminating Recurring</text>
      <text x="420" y="84" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif" textAnchor="middle">Denominator has prime ≠ 2 or 5</text>
      <text x="420" y="104" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif" textAnchor="middle">1/3 = 0.333…  (3̄)</text>
      <text x="420" y="122" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif" textAnchor="middle">5/6 = 0.8333…</text>
      <text x="420" y="143" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif" textAnchor="middle">7/12 = 0.5833…</text>
      <text x="420" y="163" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif" textAnchor="middle" opacity="0.7">Digits repeat in a block</text>
    </svg>
  );
}

function PolynomialZeroes() {
  return (
    <svg viewBox="0 0 560 280" width="100%" height="auto">
      <text x="20" y="28" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif" fontWeight="600">Zeroes of a Polynomial — x-intercepts of the graph</text>
      {/* Axes */}
      <line x1="40" y1="240" x2="520" y2="240" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="280" y1="50" x2="280" y2="255" stroke="currentColor" strokeWidth="1.5"/>
      <text x="525" y="244" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">x</text>
      <text x="284" y="48" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">y</text>
      {/* Parabola */}
      <path d="M 100,210 Q 200,290 280,240 Q 360,190 400,120 Q 430,60 460,30" fill="none" stroke="#007AFF" strokeWidth="2.5"/>
      {/* Zeroes */}
      <circle cx="167" cy="240" r="5" fill="#FF3B30"/>
      <circle cx="393" cy="240" r="5" fill="#FF3B30"/>
      <text x="160" y="258" fill="#FF3B30" fontSize="12" fontFamily="system-ui,sans-serif" textAnchor="middle" fontWeight="600">α</text>
      <text x="393" y="258" fill="#FF3B30" fontSize="12" fontFamily="system-ui,sans-serif" textAnchor="middle" fontWeight="600">β</text>
      <text x="150" y="198" fill="#007AFF" fontSize="12" fontFamily="system-ui,sans-serif">p(x)</text>
      <text x="20" y="275" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">Zeroes α, β are values where p(x) = 0  (graph crosses x-axis)</text>
    </svg>
  );
}

function ZeroesCoefficients() {
  return (
    <svg viewBox="0 0 560 200" width="100%" height="auto">
      <text x="20" y="28" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif" fontWeight="600">Relationship between Zeroes and Coefficients</text>
      <rect x="20" y="45" width="520" height="130" rx="8" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <text x="280" y="72" fill="currentColor" fontSize="14" fontFamily="system-ui,sans-serif" textAnchor="middle" fontWeight="600">p(x) = ax² + bx + c,   zeroes: α and β</text>
      <line x1="20" y1="82" x2="540" y2="82" stroke="currentColor" strokeWidth="1" strokeDasharray="4,3"/>
      <text x="140" y="108" fill="currentColor" fontSize="14" fontFamily="system-ui,sans-serif" textAnchor="middle">Sum of zeroes</text>
      <text x="140" y="130" fill="#007AFF" fontSize="16" fontFamily="system-ui,sans-serif" textAnchor="middle" fontWeight="700">α + β = −b/a</text>
      <line x1="280" y1="88" x2="280" y2="168" stroke="currentColor" strokeWidth="1" strokeDasharray="4,3"/>
      <text x="410" y="108" fill="currentColor" fontSize="14" fontFamily="system-ui,sans-serif" textAnchor="middle">Product of zeroes</text>
      <text x="410" y="130" fill="#34C759" fontSize="16" fontFamily="system-ui,sans-serif" textAnchor="middle" fontWeight="700">α × β = c/a</text>
      <text x="280" y="165" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif" textAnchor="middle" opacity="0.7">Trick: if α+β = S, αβ = P  then  p(x) = k(x² − Sx + P)</text>
    </svg>
  );
}

function PolynomialDivision() {
  return (
    <svg viewBox="0 0 560 200" width="100%" height="auto">
      <text x="20" y="28" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif" fontWeight="600">Division Algorithm for Polynomials</text>
      <rect x="20" y="45" width="520" height="80" rx="8" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <text x="280" y="75" fill="currentColor" fontSize="14" fontFamily="system-ui,sans-serif" textAnchor="middle" fontWeight="600">p(x) = g(x) · q(x) + r(x)</text>
      <text x="280" y="108" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif" textAnchor="middle">where  deg r(x) &lt; deg g(x)  or  r(x) = 0</text>
      <text x="30" y="148" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">p(x) = dividend</text>
      <text x="170" y="148" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">g(x) = divisor</text>
      <text x="310" y="148" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">q(x) = quotient</text>
      <text x="435" y="148" fill="#FF9500" fontSize="12" fontFamily="system-ui,sans-serif" fontWeight="600">r(x) = remainder</text>
      <text x="20" y="178" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif" opacity="0.7">Example: x³−3x+5 ÷ (x−1)  →  quotient x²+x−2,  remainder 3</text>
    </svg>
  );
}

function RemainderFactor() {
  return (
    <svg viewBox="0 0 560 220" width="100%" height="auto">
      <text x="20" y="28" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif" fontWeight="600">Remainder Theorem &amp; Factor Theorem</text>
      {/* Remainder theorem box */}
      <rect x="20" y="45" width="240" height="80" rx="6" fill="#007AFF" fillOpacity="0.08" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="140" y="68" fill="#007AFF" fontSize="12" fontFamily="system-ui,sans-serif" textAnchor="middle" fontWeight="700">Remainder Theorem</text>
      <text x="140" y="90" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif" textAnchor="middle">p(x) ÷ (x−a)</text>
      <text x="140" y="112" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif" textAnchor="middle" fontWeight="600">remainder = p(a)</text>
      {/* Factor theorem box */}
      <rect x="300" y="45" width="240" height="80" rx="6" fill="#34C759" fillOpacity="0.08" stroke="#34C759" strokeWidth="1.5"/>
      <text x="420" y="68" fill="#34C759" fontSize="12" fontFamily="system-ui,sans-serif" textAnchor="middle" fontWeight="700">Factor Theorem</text>
      <text x="420" y="90" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif" textAnchor="middle">(x−a) is a factor of p(x)</text>
      <text x="420" y="112" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif" textAnchor="middle" fontWeight="600">if and only if p(a) = 0</text>
      <line x1="270" y1="85" x2="295" y2="85" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4,3"/>
      <text x="280" y="80" fill="currentColor" fontSize="10" fontFamily="system-ui,sans-serif" textAnchor="middle">⟺</text>
      <text x="20" y="160" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">Example: p(x) = x²−5x+6,  p(2) = 4−10+6 = 0  ⟹  (x−2) is a factor</text>
      <text x="20" y="185" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">p(3) = 9−15+6 = 0  ⟹  (x−3) is also a factor  ∴ p(x) = (x−2)(x−3)</text>
    </svg>
  );
}

function CubicPolynomial() {
  return (
    <svg viewBox="0 0 560 270" width="100%" height="auto">
      <text x="20" y="28" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif" fontWeight="600">Cubic Polynomial — 3 Zeroes on x-axis</text>
      <line x1="40" y1="220" x2="520" y2="220" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="280" y1="40" x2="280" y2="235" stroke="currentColor" strokeWidth="1.5"/>
      <text x="525" y="224" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">x</text>
      <text x="284" y="38" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">y</text>
      <path d="M 80,200 Q 120,70 160,190 Q 200,310 280,220 Q 340,160 400,80 Q 440,30 480,50" fill="none" stroke="#007AFF" strokeWidth="2.5"/>
      <circle cx="118" cy="220" r="5" fill="#FF3B30"/>
      <circle cx="228" cy="220" r="5" fill="#FF3B30"/>
      <circle cx="395" cy="220" r="5" fill="#FF3B30"/>
      <text x="118" y="240" fill="#FF3B30" fontSize="12" fontFamily="system-ui,sans-serif" textAnchor="middle">α</text>
      <text x="228" y="240" fill="#FF3B30" fontSize="12" fontFamily="system-ui,sans-serif" textAnchor="middle">β</text>
      <text x="395" y="240" fill="#FF3B30" fontSize="12" fontFamily="system-ui,sans-serif" textAnchor="middle">γ</text>
      <text x="20" y="265" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif" opacity="0.7">α+β+γ = −b/a   ·   αβ+βγ+γα = c/a   ·   αβγ = −d/a</text>
    </svg>
  );
}

function GraphicalLinear() {
  return (
    <svg viewBox="0 0 560 220" width="100%" height="auto">
      <text x="20" y="24" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif" fontWeight="600">Graphical Interpretation of Pair of Linear Equations</text>
      {/* Box 1: intersecting */}
      <rect x="10" y="35" width="165" height="170" rx="6" fill="none" stroke="currentColor" strokeWidth="1"/>
      <line x1="20" y1="130" x2="165" y2="130" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
      <line x1="92" y1="45" x2="92" y2="195" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
      <line x1="20" y1="165" x2="165" y2="80" stroke="#007AFF" strokeWidth="2"/>
      <line x1="20" y1="80" x2="165" y2="170" stroke="#34C759" strokeWidth="2"/>
      <circle cx="91" cy="122" r="4" fill="#FF3B30"/>
      <text x="92" y="207" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif" textAnchor="middle">Intersecting</text>
      <text x="92" y="218" fill="#34C759" fontSize="10" fontFamily="system-ui,sans-serif" textAnchor="middle">Unique solution</text>
      {/* Box 2: parallel */}
      <rect x="195" y="35" width="165" height="170" rx="6" fill="none" stroke="currentColor" strokeWidth="1"/>
      <line x1="205" y1="130" x2="350" y2="130" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
      <line x1="277" y1="45" x2="277" y2="195" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
      <line x1="205" y1="85" x2="350" y2="145" stroke="#007AFF" strokeWidth="2"/>
      <line x1="205" y1="110" x2="350" y2="170" stroke="#34C759" strokeWidth="2"/>
      <text x="277" y="207" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif" textAnchor="middle">Parallel</text>
      <text x="277" y="218" fill="#FF3B30" fontSize="10" fontFamily="system-ui,sans-serif" textAnchor="middle">No solution</text>
      {/* Box 3: coincident */}
      <rect x="380" y="35" width="165" height="170" rx="6" fill="none" stroke="currentColor" strokeWidth="1"/>
      <line x1="390" y1="130" x2="535" y2="130" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
      <line x1="462" y1="45" x2="462" y2="195" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
      <line x1="390" y1="85" x2="535" y2="175" stroke="#007AFF" strokeWidth="3"/>
      <line x1="390" y1="85" x2="535" y2="175" stroke="#34C759" strokeWidth="1.5" strokeDasharray="5,4"/>
      <text x="462" y="207" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif" textAnchor="middle">Coincident</text>
      <text x="462" y="218" fill="#FF9500" fontSize="10" fontFamily="system-ui,sans-serif" textAnchor="middle">Infinite solutions</text>
    </svg>
  );
}

function SubstitutionMethod() {
  return (
    <svg viewBox="0 0 560 200" width="100%" height="auto">
      <text x="20" y="28" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif" fontWeight="600">Substitution Method — Step by Step</text>
      <rect x="20" y="46" width="70" height="26" rx="4" fill="#007AFF" fillOpacity="0.15"/>
      <text x="55" y="63" fill="#007AFF" fontSize="11" fontFamily="system-ui,sans-serif" textAnchor="middle" fontWeight="700">Step 1</text>
      <text x="100" y="63" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif">Express one variable in terms of other</text>
      <text x="350" y="63" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif" opacity="0.8">x + y = 7  →  x = 7 − y</text>
      <rect x="20" y="84" width="70" height="26" rx="4" fill="#007AFF" fillOpacity="0.15"/>
      <text x="55" y="101" fill="#007AFF" fontSize="11" fontFamily="system-ui,sans-serif" textAnchor="middle" fontWeight="700">Step 2</text>
      <text x="100" y="101" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif">Substitute into the second equation</text>
      <text x="350" y="101" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif" opacity="0.8">2(7−y) + 3y = 11  →  14−2y+3y = 11</text>
      <rect x="20" y="122" width="70" height="26" rx="4" fill="#007AFF" fillOpacity="0.15"/>
      <text x="55" y="139" fill="#007AFF" fontSize="11" fontFamily="system-ui,sans-serif" textAnchor="middle" fontWeight="700">Step 3</text>
      <text x="100" y="139" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif">Solve for the remaining variable</text>
      <text x="350" y="139" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif" opacity="0.8">y = −3</text>
      <rect x="20" y="160" width="70" height="26" rx="4" fill="#007AFF" fillOpacity="0.15"/>
      <text x="55" y="177" fill="#007AFF" fontSize="11" fontFamily="system-ui,sans-serif" textAnchor="middle" fontWeight="700">Step 4</text>
      <text x="100" y="177" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif">Back-substitute to get x</text>
      <text x="350" y="177" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif" opacity="0.8">x = 7−(−3) = 10</text>
    </svg>
  );
}

function EliminationMethod() {
  return (
    <svg viewBox="0 0 560 200" width="100%" height="auto">
      <text x="20" y="28" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif" fontWeight="600">Elimination Method</text>
      <text x="20" y="58" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif">Eq 1:   2x + 3y = 11</text>
      <text x="20" y="82" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif">Eq 2:   5x + 2y = 16</text>
      <line x1="20" y1="93" x2="300" y2="93" stroke="currentColor" strokeWidth="1" strokeDasharray="4,3"/>
      <text x="20" y="115" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">Multiply Eq1 × 2:   4x + 6y = 22</text>
      <text x="20" y="137" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">Multiply Eq2 × 3:   15x + 6y = 48</text>
      <text x="20" y="155" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">Subtract:</text>
      <rect x="95" y="141" width="200" height="26" rx="4" fill="#34C759" fillOpacity="0.12" stroke="#34C759" strokeWidth="1"/>
      <text x="100" y="159" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">11x = 26  →  x = 26/11</text>
      <text x="20" y="186" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">Substitute x back into Eq1 to get y</text>
      <text x="340" y="115" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif" opacity="0.7">Goal: make coefficients</text>
      <text x="340" y="133" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif" opacity="0.7">of one variable equal,</text>
      <text x="340" y="151" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif" opacity="0.7">then add or subtract</text>
    </svg>
  );
}

function CrossMultiplication() {
  return (
    <svg viewBox="0 0 560 200" width="100%" height="auto">
      <text x="20" y="28" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif" fontWeight="600">Cross-Multiplication Method</text>
      <text x="20" y="58" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif">a₁x + b₁y + c₁ = 0</text>
      <text x="20" y="80" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif">a₂x + b₂y + c₂ = 0</text>
      <rect x="20" y="100" width="520" height="60" rx="6" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <text x="280" y="126" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif" textAnchor="middle" fontWeight="600">x/(b₁c₂ − b₂c₁) = y/(c₁a₂ − c₂a₁) = 1/(a₁b₂ − a₂b₁)</text>
      <text x="280" y="148" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif" textAnchor="middle" opacity="0.7">Each ratio equals the same constant k; solve for x and y</text>
      <text x="20" y="185" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif" opacity="0.7">Shortcut: use the "butterfly" / cross-multiply pattern on the coefficient table</text>
    </svg>
  );
}

function ReducibleEquations() {
  return (
    <svg viewBox="0 0 560 200" width="100%" height="auto">
      <text x="20" y="28" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif" fontWeight="600">Equations Reducible to Linear Form — Substitution Trick</text>
      <text x="20" y="58" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif">Original:  1/x + 1/y = 2   and   2/x − 1/y = 1</text>
      <line x1="20" y1="68" x2="540" y2="68" stroke="currentColor" strokeWidth="1" strokeDasharray="4,3"/>
      <text x="20" y="90" fill="#007AFF" fontSize="13" fontFamily="system-ui,sans-serif" fontWeight="600">Let  u = 1/x  and  v = 1/y</text>
      <text x="20" y="114" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif">Reduced:  u + v = 2</text>
      <text x="20" y="136" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif">            2u − v = 1</text>
      <text x="20" y="158" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">Solve: u = 1, v = 1  ⟹  x = 1/u = 1,  y = 1/v = 1</text>
      <text x="20" y="185" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif" opacity="0.7">Same trick works for (ax+b) and (cx+d) type expressions</text>
    </svg>
  );
}

function QuadraticIntro() {
  return (
    <svg viewBox="0 0 560 200" width="100%" height="auto">
      <text x="20" y="28" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif" fontWeight="600">Quadratic Equation — Standard Form</text>
      <rect x="20" y="45" width="520" height="50" rx="8" fill="#007AFF" fillOpacity="0.08" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="280" y="76" fill="currentColor" fontSize="18" fontFamily="system-ui,sans-serif" textAnchor="middle" fontWeight="700">ax² + bx + c = 0,   a ≠ 0</text>
      <text x="70" y="120" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif" textAnchor="middle">a ≠ 0</text>
      <text x="70" y="136" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif" textAnchor="middle" opacity="0.7">(must be quadratic)</text>
      <text x="280" y="120" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif" textAnchor="middle">b can be 0</text>
      <text x="280" y="136" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif" textAnchor="middle" opacity="0.7">(e.g. x²−4=0)</text>
      <text x="460" y="120" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif" textAnchor="middle">c can be 0</text>
      <text x="460" y="136" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif" textAnchor="middle" opacity="0.7">(e.g. x²−5x=0)</text>
      <text x="20" y="170" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">Real-world: projectile height h = −5t² + 20t + 1  →  when does h = 0?</text>
    </svg>
  );
}

function Factorisation() {
  return (
    <svg viewBox="0 0 560 200" width="100%" height="auto">
      <text x="20" y="28" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif" fontWeight="600">Factorisation — Splitting the Middle Term (AC Method)</text>
      <text x="20" y="60" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif">Example: 2x² + 7x + 3 = 0  →  a=2, b=7, c=3</text>
      <text x="20" y="88" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">Step 1: Find ac = 2×3 = 6.  Find two numbers whose product = 6 and sum = 7.</text>
      <text x="20" y="112" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">Numbers: 1 and 6  (1×6=6, 1+6=7) ✓</text>
      <text x="20" y="136" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">Step 2: Split middle term:  2x² + 1x + 6x + 3</text>
      <text x="20" y="158" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">Step 3: Group:  x(2x+1) + 3(2x+1)  =  (x+3)(2x+1) = 0</text>
      <rect x="20" y="167" width="200" height="24" rx="4" fill="#34C759" fillOpacity="0.15"/>
      <text x="120" y="183" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif" textAnchor="middle" fontWeight="600">x = −3  or  x = −½</text>
    </svg>
  );
}

function CompletingSquare() {
  return (
    <svg viewBox="0 0 560 200" width="100%" height="auto">
      <text x="20" y="28" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif" fontWeight="600">Completing the Square</text>
      <text x="20" y="58" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">Example: x² + 6x + 5 = 0</text>
      <text x="20" y="82" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">Step 1: Move constant   →   x² + 6x = −5</text>
      <text x="20" y="106" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">Step 2: Add (b/2)² = (3)² = 9 to both sides</text>
      <text x="20" y="128" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">          x² + 6x + 9 = −5 + 9 = 4</text>
      <text x="20" y="152" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">Step 3: Write as perfect square   →   (x + 3)² = 4</text>
      <text x="20" y="174" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">Step 4: Take √   →   x + 3 = ±2   →   x = −1  or  x = −5</text>
    </svg>
  );
}

function QuadraticFormula() {
  return (
    <svg viewBox="0 0 560 200" width="100%" height="auto">
      <text x="20" y="28" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif" fontWeight="600">Quadratic Formula (Sridharacharya Formula)</text>
      <rect x="80" y="45" width="400" height="70" rx="10" fill="#007AFF" fillOpacity="0.08" stroke="#007AFF" strokeWidth="2"/>
      <text x="280" y="90" fill="currentColor" fontSize="22" fontFamily="system-ui,sans-serif" textAnchor="middle" fontWeight="700">x = (−b ± √(b²−4ac)) / 2a</text>
      <text x="20" y="145" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">Derived by completing the square on ax²+bx+c = 0</text>
      <text x="20" y="168" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">Use when factorisation is not obvious. Always works for any quadratic.</text>
    </svg>
  );
}

function Discriminant() {
  return (
    <svg viewBox="0 0 560 220" width="100%" height="auto">
      <text x="20" y="28" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif" fontWeight="600">Nature of Roots — Discriminant D = b² − 4ac</text>
      {/* D > 0 */}
      <rect x="10" y="42" width="170" height="155" rx="6" fill="#34C759" fillOpacity="0.08" stroke="#34C759" strokeWidth="1.5"/>
      <text x="95" y="62" fill="#34C759" fontSize="12" fontFamily="system-ui,sans-serif" textAnchor="middle" fontWeight="700">D &gt; 0</text>
      <line x1="20" y1="120" x2="170" y2="120" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
      <line x1="95" y1="72" x2="95" y2="185" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
      <path d="M 25,155 Q 60,60 95,110 Q 130,160 170,80" fill="none" stroke="#34C759" strokeWidth="2"/>
      <circle cx="55" cy="120" r="3" fill="#34C759"/>
      <circle cx="138" cy="120" r="3" fill="#34C759"/>
      <text x="95" y="200" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif" textAnchor="middle">2 distinct real roots</text>
      {/* D = 0 */}
      <rect x="195" y="42" width="170" height="155" rx="6" fill="#FF9500" fillOpacity="0.08" stroke="#FF9500" strokeWidth="1.5"/>
      <text x="280" y="62" fill="#FF9500" fontSize="12" fontFamily="system-ui,sans-serif" textAnchor="middle" fontWeight="700">D = 0</text>
      <line x1="205" y1="130" x2="355" y2="130" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
      <line x1="280" y1="72" x2="280" y2="185" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
      <path d="M 210,110 Q 280,170 350,110" fill="none" stroke="#FF9500" strokeWidth="2"/>
      <circle cx="280" cy="130" r="3" fill="#FF9500"/>
      <text x="280" y="200" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif" textAnchor="middle">1 repeated real root</text>
      {/* D < 0 */}
      <rect x="380" y="42" width="170" height="155" rx="6" fill="#FF3B30" fillOpacity="0.08" stroke="#FF3B30" strokeWidth="1.5"/>
      <text x="465" y="62" fill="#FF3B30" fontSize="12" fontFamily="system-ui,sans-serif" textAnchor="middle" fontWeight="700">D &lt; 0</text>
      <line x1="390" y1="130" x2="540" y2="130" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
      <line x1="465" y1="72" x2="465" y2="185" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
      <path d="M 395,80 Q 465,155 535,80" fill="none" stroke="#FF3B30" strokeWidth="2"/>
      <text x="465" y="200" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif" textAnchor="middle">No real roots</text>
    </svg>
  );
}

function ArithmeticProgression() {
  return (
    <svg viewBox="0 0 560 180" width="100%" height="auto">
      <text x="20" y="28" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif" fontWeight="600">Arithmetic Progression — Common Difference d</text>
      {/* Number line with AP terms */}
      <line x1="30" y1="100" x2="530" y2="100" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="60" cy="100" r="18" fill="#007AFF" fillOpacity="0.15" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="60" y="105" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif" textAnchor="middle" fontWeight="600">a</text>
      <circle cx="170" cy="100" r="18" fill="#007AFF" fillOpacity="0.15" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="170" y="105" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif" textAnchor="middle" fontWeight="600">a+d</text>
      <circle cx="280" cy="100" r="18" fill="#007AFF" fillOpacity="0.15" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="280" y="105" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif" textAnchor="middle" fontWeight="600">a+2d</text>
      <circle cx="390" cy="100" r="18" fill="#007AFF" fillOpacity="0.15" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="390" y="105" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif" textAnchor="middle" fontWeight="600">a+3d</text>
      <circle cx="500" cy="100" r="18" fill="#007AFF" fillOpacity="0.15" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="500" y="105" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif" textAnchor="middle" fontWeight="600">a+4d</text>
      <text x="115" y="72" fill="#FF9500" fontSize="11" fontFamily="system-ui,sans-serif" textAnchor="middle">+d</text>
      <text x="225" y="72" fill="#FF9500" fontSize="11" fontFamily="system-ui,sans-serif" textAnchor="middle">+d</text>
      <text x="335" y="72" fill="#FF9500" fontSize="11" fontFamily="system-ui,sans-serif" textAnchor="middle">+d</text>
      <text x="445" y="72" fill="#FF9500" fontSize="11" fontFamily="system-ui,sans-serif" textAnchor="middle">+d</text>
      <text x="280" y="145" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif" textAnchor="middle">aₙ = a + (n−1)d   |   each term = previous + d</text>
      <text x="280" y="168" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif" textAnchor="middle" opacity="0.7">Example: 2, 5, 8, 11, ...  →  a=2, d=3</text>
    </svg>
  );
}

function NthTermAP() {
  return (
    <svg viewBox="0 0 560 190" width="100%" height="auto">
      <text x="20" y="28" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif" fontWeight="600">nth Term of an AP</text>
      <rect x="80" y="42" width="400" height="60" rx="8" fill="#007AFF" fillOpacity="0.08" stroke="#007AFF" strokeWidth="2"/>
      <text x="280" y="80" fill="currentColor" fontSize="20" fontFamily="system-ui,sans-serif" textAnchor="middle" fontWeight="700">aₙ = a + (n − 1)d</text>
      <text x="20" y="130" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">a = first term,  d = common difference,  n = position</text>
      <text x="20" y="153" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">Example: AP 3, 7, 11, 15, …  →  a=3, d=4</text>
      <text x="20" y="175" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">a₁₀ = 3 + (10−1)×4 = 3 + 36 = 39</text>
    </svg>
  );
}

function SumAP() {
  return (
    <svg viewBox="0 0 560 200" width="100%" height="auto">
      <text x="20" y="28" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif" fontWeight="600">Sum of First n Terms — Gauss Pairing Trick</text>
      <text x="20" y="60" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">1 + 2 + 3 + … + 100</text>
      <text x="20" y="84" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">Pair first + last:  (1+100) + (2+99) + … = 101 × 50 = 5050</text>
      <line x1="20" y1="95" x2="540" y2="95" stroke="currentColor" strokeWidth="1" strokeDasharray="4,3"/>
      <rect x="80" y="105" width="400" height="50" rx="8" fill="#34C759" fillOpacity="0.08" stroke="#34C759" strokeWidth="1.5"/>
      <text x="280" y="126" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif" textAnchor="middle" fontWeight="600">Sₙ = n/2 × (2a + (n−1)d)</text>
      <text x="280" y="146" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif" textAnchor="middle">Or equivalently:  Sₙ = n/2 × (first term + last term)</text>
      <text x="20" y="182" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">Example: S₁₀ of AP 2,5,8,…  = 10/2 × (2×2 + 9×3) = 5 × 31 = 155</text>
    </svg>
  );
}

function APApplications() {
  return (
    <svg viewBox="0 0 560 200" width="100%" height="auto">
      <text x="20" y="28" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif" fontWeight="600">AP in Real Life — Theatre Seating</text>
      <rect x="175" y="50" width="160" height="22" rx="3" fill="#007AFF" fillOpacity="0.10" stroke="#007AFF" strokeWidth="1"/>
      <text x="200" y="65" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif">Row 1: 20 seats</text>
      <rect x="163" y="78" width="184" height="22" rx="3" fill="#007AFF" fillOpacity="0.14" stroke="#007AFF" strokeWidth="1"/>
      <text x="188" y="93" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif">Row 2: 23 seats</text>
      <rect x="151" y="106" width="208" height="22" rx="3" fill="#007AFF" fillOpacity="0.18" stroke="#007AFF" strokeWidth="1"/>
      <text x="176" y="121" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif">Row 3: 26 seats</text>
      <rect x="139" y="134" width="232" height="22" rx="3" fill="#007AFF" fillOpacity="0.22" stroke="#007AFF" strokeWidth="1"/>
      <text x="164" y="149" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif">Row 4: 29 seats</text>
      <rect x="127" y="162" width="256" height="22" rx="3" fill="#007AFF" fillOpacity="0.26" stroke="#007AFF" strokeWidth="1"/>
      <text x="152" y="177" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif">Row 5: 32 seats</text>
      <text x="20" y="202" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">Rows: 20, 23, 26, 29, 32 … AP with a=20, d=3. Total seats S₅ = 5/2(40+12) = 130</text>
    </svg>
  );
}

function SimilarFigures() {
  return (
    <svg viewBox="0 0 560 220" width="100%" height="auto">
      <text x="20" y="28" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif" fontWeight="600">Similar Triangles — AA Criterion, Scale Factor k</text>
      {/* Small triangle */}
      <polygon points="60,180 130,80 200,180" fill="none" stroke="#007AFF" strokeWidth="2"/>
      <text x="60" y="196" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif">A</text>
      <text x="127" y="72" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif">B</text>
      <text x="197" y="196" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif">C</text>
      <text x="130" y="210" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif" textAnchor="middle">ΔABC</text>
      {/* Large triangle */}
      <polygon points="270,200 380,50 490,200" fill="none" stroke="#34C759" strokeWidth="2"/>
      <text x="267" y="215" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif">P</text>
      <text x="376" y="42" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif">Q</text>
      <text x="487" y="215" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif">R</text>
      <text x="380" y="225" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif" textAnchor="middle">ΔPQR (similar)</text>
      {/* Labels */}
      <text x="130" y="135" fill="#007AFF" fontSize="11" fontFamily="system-ui,sans-serif" textAnchor="middle">3</text>
      <text x="380" y="128" fill="#34C759" fontSize="11" fontFamily="system-ui,sans-serif" textAnchor="middle">6</text>
      <text x="280" y="95" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif" textAnchor="middle">k = 6/3 = 2</text>
      <text x="20" y="245" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif" opacity="0.7">AA: two pairs of equal angles ⟹ triangles similar. Sides in ratio k.</text>
    </svg>
  );
}

function BasicProportionality() {
  return (
    <svg viewBox="0 0 560 250" width="100%" height="auto">
      <text x="20" y="28" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif" fontWeight="600">Basic Proportionality Theorem (BPT / Thales Theorem)</text>
      {/* Triangle ABC */}
      <polygon points="280,40 80,220 480,220" fill="none" stroke="currentColor" strokeWidth="2"/>
      <text x="277" y="32" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif" textAnchor="middle" fontWeight="700">A</text>
      <text x="66" y="232" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif" fontWeight="700">B</text>
      <text x="483" y="232" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif" fontWeight="700">C</text>
      {/* DE parallel to BC */}
      <line x1="155" y1="148" x2="405" y2="148" stroke="#007AFF" strokeWidth="2.5"/>
      <text x="148" y="145" fill="#007AFF" fontSize="13" fontFamily="system-ui,sans-serif" textAnchor="end" fontWeight="700">D</text>
      <text x="413" y="145" fill="#007AFF" fontSize="13" fontFamily="system-ui,sans-serif" fontWeight="700">E</text>
      <text x="280" y="138" fill="#007AFF" fontSize="11" fontFamily="system-ui,sans-serif" textAnchor="middle">DE ∥ BC</text>
      {/* Labels */}
      <text x="196" y="100" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">AD</text>
      <text x="107" y="195" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">DB</text>
      <text x="360" y="100" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">AE</text>
      <text x="445" y="195" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">EC</text>
      <text x="280" y="250" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif" textAnchor="middle" fontWeight="600">AD/DB = AE/EC</text>
    </svg>
  );
}

function SimilarityCriteria() {
  return (
    <svg viewBox="0 0 560 200" width="100%" height="auto">
      <text x="20" y="28" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif" fontWeight="600">Criteria for Similarity of Triangles</text>
      {/* AA */}
      <rect x="10" y="42" width="165" height="140" rx="6" fill="none" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="92" y="62" fill="#007AFF" fontSize="13" fontFamily="system-ui,sans-serif" textAnchor="middle" fontWeight="700">AA</text>
      <polygon points="92,78 40,165 145,165" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <text x="42" y="180" fill="currentColor" fontSize="10" fontFamily="system-ui,sans-serif">∠A=∠P</text>
      <text x="105" y="180" fill="currentColor" fontSize="10" fontFamily="system-ui,sans-serif">∠B=∠Q</text>
      <text x="92" y="198" fill="currentColor" fontSize="10" fontFamily="system-ui,sans-serif" textAnchor="middle">2 equal angles</text>
      {/* SAS */}
      <rect x="195" y="42" width="165" height="140" rx="6" fill="none" stroke="#34C759" strokeWidth="1.5"/>
      <text x="277" y="62" fill="#34C759" fontSize="13" fontFamily="system-ui,sans-serif" textAnchor="middle" fontWeight="700">SAS</text>
      <polygon points="277,78 225,165 330,165" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <text x="277" y="198" fill="currentColor" fontSize="10" fontFamily="system-ui,sans-serif" textAnchor="middle">2 sides proportional + included ∠ equal</text>
      {/* SSS */}
      <rect x="380" y="42" width="165" height="140" rx="6" fill="none" stroke="#FF9500" strokeWidth="1.5"/>
      <text x="462" y="62" fill="#FF9500" fontSize="13" fontFamily="system-ui,sans-serif" textAnchor="middle" fontWeight="700">SSS</text>
      <polygon points="462,78 410,165 515,165" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <text x="462" y="198" fill="currentColor" fontSize="10" fontFamily="system-ui,sans-serif" textAnchor="middle">All 3 sides in same proportion</text>
    </svg>
  );
}

function AreaSimilarTriangles() {
  return (
    <svg viewBox="0 0 560 200" width="100%" height="auto">
      <text x="20" y="28" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif" fontWeight="600">Areas of Similar Triangles</text>
      {/* Small triangle */}
      <polygon points="100,160 60,100 140,100" fill="#007AFF" fillOpacity="0.15" stroke="#007AFF" strokeWidth="2"/>
      <text x="100" y="180" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif" textAnchor="middle">ΔABC</text>
      <text x="100" y="90" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif" textAnchor="middle">side = a</text>
      {/* Large triangle */}
      <polygon points="370,180 290,60 450,60" fill="#34C759" fillOpacity="0.15" stroke="#34C759" strokeWidth="2"/>
      <text x="370" y="198" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif" textAnchor="middle">ΔPQR</text>
      <text x="370" y="50" fill="currentColor" fontSize="11" fontFamily="system-ui,sans-serif" textAnchor="middle">side = ka</text>
      <rect x="20" y="145" width="520" height="36" rx="6" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <text x="280" y="168" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif" textAnchor="middle" fontWeight="600">Area(ΔABC) / Area(ΔPQR) = (corresponding side)² = k²</text>
    </svg>
  );
}

function PythagorasTheorem() {
  return (
    <svg viewBox="0 0 560 260" width="100%" height="auto">
      <text x="20" y="28" fill="currentColor" fontSize="13" fontFamily="system-ui,sans-serif" fontWeight="600">Pythagoras Theorem</text>
      {/* Right triangle */}
      <polygon points="150,200 150,80 300,200" fill="none" stroke="currentColor" strokeWidth="2"/>
      {/* Right angle mark */}
      <polyline points="150,185 165,185 165,200" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      {/* Squares on sides */}
      <rect x="70" y="80" width="80" height="120" fill="#007AFF" fillOpacity="0.12" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="110" y="145" fill="#007AFF" fontSize="13" fontFamily="system-ui,sans-serif" textAnchor="middle" fontWeight="700">b²</text>
      <rect x="150" y="200" width="150" height="80" fill="#34C759" fillOpacity="0.12" stroke="#34C759" strokeWidth="1.5"/>
      <text x="225" y="248" fill="#34C759" fontSize="13" fontFamily="system-ui,sans-serif" textAnchor="middle" fontWeight="700">a²</text>
      <polygon points="300,200 150,80 430,80 580,200" fill="#FF9500" fillOpacity="0.12" stroke="#FF9500" strokeWidth="1.5"/>
      <text x="385" y="155" fill="#FF9500" fontSize="13" fontFamily="system-ui,sans-serif" textAnchor="middle" fontWeight="700">c²</text>
      <text x="155" y="145" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">b</text>
      <text x="225" y="215" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif" textAnchor="middle">a</text>
      <text x="245" y="150" fill="currentColor" fontSize="12" fontFamily="system-ui,sans-serif">c (hyp.)</text>
      <rect x="20" y="228" width="200" height="28" rx="6" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <text x="120" y="247" fill="currentColor" fontSize="14" fontFamily="system-ui,sans-serif" textAnchor="middle" fontWeight="700">a² + b² = c²</text>
    </svg>
  );
}

// ─── Math Ch7 — Coordinate Geometry ──────────────────────────────────────────

function DistanceFormula() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <line x1="30" y1="170" x2="260" y2="170" stroke="#C7C7CC" strokeWidth="1.5"/>
      <line x1="30" y1="170" x2="30" y2="20" stroke="#C7C7CC" strokeWidth="1.5"/>
      <text x="264" y="174" fontSize="11" fill="#8E8E93">x</text>
      <text x="24" y="16" fontSize="11" fill="#8E8E93">y</text>
      <circle cx="80" cy="130" r="5" fill="#007AFF"/>
      <circle cx="220" cy="60" r="5" fill="#FF3B30"/>
      <text x="52" y="148" fontSize="12" fontWeight="700" fill="#007AFF">A(x₁,y₁)</text>
      <text x="224" y="56" fontSize="12" fontWeight="700" fill="#FF3B30">B(x₂,y₂)</text>
      <line x1="80" y1="130" x2="220" y2="60" stroke="#34C759" strokeWidth="2.5"/>
      <line x1="80" y1="130" x2="220" y2="130" stroke="#FF9500" strokeWidth="1.5" strokeDasharray="5,3"/>
      <line x1="220" y1="130" x2="220" y2="60" stroke="#FF9500" strokeWidth="1.5" strokeDasharray="5,3"/>
      <rect x="210" y="120" width="10" height="10" fill="none" stroke="#FF9500" strokeWidth="1.5"/>
      <text x="150" y="148" fontSize="11" fill="#FF9500" textAnchor="middle">x₂−x₁</text>
      <text x="234" y="100" fontSize="11" fill="#FF9500" textAnchor="middle">y₂−y₁</text>
      <rect x="50" y="8" width="180" height="26" rx="6" fill="#F2F2F7"/>
      <text x="140" y="26" fontSize="13" fontWeight="700" fill="#34C759" textAnchor="middle">d = √[(x₂−x₁)²+(y₂−y₁)²]</text>
    </svg>
  );
}

function SectionFormula() {
  return (
    <svg viewBox="0 0 280 160" width="280" height="160" fontFamily="system-ui,sans-serif">
      <line x1="40" y1="80" x2="240" y2="80" stroke="#C7C7CC" strokeWidth="2"/>
      <circle cx="40" cy="80" r="6" fill="#007AFF"/>
      <circle cx="240" cy="80" r="6" fill="#007AFF"/>
      <text x="20" y="100" fontSize="12" fontWeight="700" fill="#007AFF">A(x₁,y₁)</text>
      <text x="224" y="100" fontSize="12" fontWeight="700" fill="#007AFF">B(x₂,y₂)</text>
      <circle cx="152" cy="80" r="7" fill="#FF3B30"/>
      <text x="144" y="66" fontSize="12" fontWeight="700" fill="#FF3B30">P</text>
      <text x="90" y="72" fontSize="11" fill="#FF9500" textAnchor="middle">m</text>
      <text x="196" y="72" fontSize="11" fill="#FF9500" textAnchor="middle">n</text>
      <line x1="40" y1="80" x2="152" y2="80" stroke="#FF9500" strokeWidth="3"/>
      <line x1="152" y1="80" x2="240" y2="80" stroke="#34C759" strokeWidth="3"/>
      <rect x="30" y="112" width="220" height="38" rx="8" fill="#F2F2F7"/>
      <text x="140" y="128" fontSize="11" fontWeight="700" fill="#007AFF" textAnchor="middle">x = (mx₂ + nx₁)/(m+n)</text>
      <text x="140" y="144" fontSize="11" fontWeight="700" fill="#34C759" textAnchor="middle">y = (my₂ + ny₁)/(m+n)</text>
    </svg>
  );
}

function TriangleAreaCoord() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <line x1="30" y1="175" x2="260" y2="175" stroke="#C7C7CC" strokeWidth="1.5"/>
      <line x1="30" y1="175" x2="30" y2="20" stroke="#C7C7CC" strokeWidth="1.5"/>
      <polygon points="70,160 180,60 240,150" fill="#007AFF" fillOpacity="0.12" stroke="#007AFF" strokeWidth="2"/>
      <circle cx="70" cy="160" r="5" fill="#FF3B30"/>
      <circle cx="180" cy="60" r="5" fill="#34C759"/>
      <circle cx="240" cy="150" r="5" fill="#FF9500"/>
      <text x="44" y="158" fontSize="12" fontWeight="700" fill="#FF3B30">A(x₁,y₁)</text>
      <text x="184" y="56" fontSize="12" fontWeight="700" fill="#34C759">B(x₂,y₂)</text>
      <text x="244" y="148" fontSize="12" fontWeight="700" fill="#FF9500">C(x₃,y₃)</text>
      <rect x="20" y="8" width="240" height="30" rx="8" fill="#F2F2F7"/>
      <text x="140" y="20" fontSize="10" fontWeight="700" fill="#007AFF" textAnchor="middle">Area = ½|x₁(y₂−y₃)+x₂(y₃−y₁)+x₃(y₁−y₂)|</text>
      <text x="140" y="34" fontSize="10" fill="#8E8E93" textAnchor="middle">Collinear if Area = 0</text>
    </svg>
  );
}

// ─── Math Ch8 — Introduction to Trigonometry ─────────────────────────────────

function TrigRatios() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <polygon points="50,160 220,160 220,60" fill="#007AFF" fillOpacity="0.08" stroke="#007AFF" strokeWidth="2"/>
      <rect x="210" y="150" width="10" height="10" fill="none" stroke="#007AFF" strokeWidth="1.5"/>
      <path d="M 80,160 A 30,30 0 0,1 64,143" fill="none" stroke="#FF9500" strokeWidth="2"/>
      <text x="82" y="155" fontSize="13" fontWeight="700" fill="#FF9500">θ</text>
      <text x="130" y="178" fontSize="12" fill="#34C759" textAnchor="middle" fontWeight="700">Adjacent</text>
      <text x="234" y="115" fontSize="11" fill="#FF3B30" textAnchor="middle" fontWeight="700" transform="rotate(-90,234,115)">Opposite</text>
      <text x="118" y="100" fontSize="11" fill="#007AFF" textAnchor="middle" fontWeight="700" transform="rotate(-27,118,100)">Hypotenuse</text>
      <rect x="20" y="8" width="240" height="46" rx="8" fill="#F2F2F7"/>
      <text x="140" y="24" fontSize="11" fontWeight="700" fill="#FF3B30" textAnchor="middle">sin θ = Opposite / Hypotenuse</text>
      <text x="140" y="38" fontSize="11" fontWeight="700" fill="#34C759" textAnchor="middle">cos θ = Adjacent / Hypotenuse</text>
      <text x="140" y="52" fontSize="11" fontWeight="700" fill="#FF9500" textAnchor="middle">tan θ = Opposite / Adjacent</text>
    </svg>
  );
}

function TrigSpecificAngles() {
  return (
    <svg viewBox="0 0 280 180" width="280" height="180" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="162" rx="10" fill="#F2F2F7"/>
      <rect x="10" y="8" width="260" height="26" rx="8" fill="#007AFF"/>
      {["θ","0°","30°","45°","60°","90°"].map((t,i) => (
        <text key={i} x={22+i*40} y="26" fontSize="11" fontWeight="700" fill="#FFFFFF">{t}</text>
      ))}
      <text x="22" y="56" fontSize="12" fontWeight="700" fill="#FF3B30">sin</text>
      {["0","½","1/√2","√3/2","1"].map((v,i) => (
        <text key={i} x={62+i*40} y="56" fontSize="11" fill="#1C1C1E" textAnchor="middle">{v}</text>
      ))}
      <text x="22" y="84" fontSize="12" fontWeight="700" fill="#34C759">cos</text>
      {["1","√3/2","1/√2","½","0"].map((v,i) => (
        <text key={i} x={62+i*40} y="84" fontSize="11" fill="#1C1C1E" textAnchor="middle">{v}</text>
      ))}
      <text x="22" y="112" fontSize="12" fontWeight="700" fill="#FF9500">tan</text>
      {["0","1/√3","1","√3","∞"].map((v,i) => (
        <text key={i} x={62+i*40} y="112" fontSize="11" fill="#1C1C1E" textAnchor="middle">{v}</text>
      ))}
      {[42,70,98].map(y => (
        <line key={y} x1="15" y1={y} x2="265" y2={y} stroke="#E5E5EA" strokeWidth="1"/>
      ))}
      <rect x="20" y="124" width="240" height="38" rx="8" fill="#FFFFFF"/>
      <text x="140" y="140" fontSize="11" fontWeight="700" fill="#007AFF" textAnchor="middle">Memory: sin row = √0,√1,√2,√3,√4 ÷ 2</text>
      <text x="140" y="154" fontSize="10" fill="#8E8E93" textAnchor="middle">cos is reverse of sin  •  tan = sin/cos</text>
    </svg>
  );
}

function ComplementaryAngles() {
  return (
    <svg viewBox="0 0 280 180" width="280" height="180" fontFamily="system-ui,sans-serif">
      <polygon points="50,150 200,150 200,60" fill="#007AFF" fillOpacity="0.10" stroke="#007AFF" strokeWidth="2"/>
      <text x="68" y="148" fontSize="13" fontWeight="700" fill="#FF9500">θ</text>
      <text x="178" y="78" fontSize="12" fontWeight="700" fill="#34C759">90°−θ</text>
      <rect x="190" y="140" width="10" height="10" fill="none" stroke="#007AFF" strokeWidth="1.5"/>
      <rect x="10" y="8" width="260" height="42" rx="8" fill="#F2F2F7"/>
      <text x="140" y="24" fontSize="12" fontWeight="700" fill="#FF3B30" textAnchor="middle">sin(90°−θ) = cos θ</text>
      <text x="140" y="40" fontSize="12" fontWeight="700" fill="#34C759" textAnchor="middle">cos(90°−θ) = sin θ</text>
      <text x="140" y="56" fontSize="11" fontWeight="700" fill="#FF9500" textAnchor="middle">tan(90°−θ) = cot θ</text>
    </svg>
  );
}

function TrigIdentities() {
  return (
    <svg viewBox="0 0 280 180" width="280" height="180" fontFamily="system-ui,sans-serif">
      <circle cx="140" cy="110" r="60" fill="#007AFF" fillOpacity="0.06" stroke="#007AFF" strokeWidth="2"/>
      <line x1="80" y1="110" x2="200" y2="110" stroke="#C7C7CC" strokeWidth="1" strokeDasharray="4,2"/>
      <line x1="140" y1="50" x2="140" y2="170" stroke="#C7C7CC" strokeWidth="1" strokeDasharray="4,2"/>
      <circle cx="182" cy="78" r="5" fill="#FF3B30"/>
      <line x1="140" y1="110" x2="182" y2="78" stroke="#007AFF" strokeWidth="2"/>
      <line x1="182" y1="78" x2="182" y2="110" stroke="#FF3B30" strokeWidth="1.5" strokeDasharray="4,2"/>
      <line x1="140" y1="110" x2="182" y2="110" stroke="#34C759" strokeWidth="1.5" strokeDasharray="4,2"/>
      <text x="186" y="96" fontSize="10" fill="#FF3B30">sin θ</text>
      <text x="156" y="124" fontSize="10" fill="#34C759">cos θ</text>
      <rect x="10" y="8" width="260" height="52" rx="8" fill="#F2F2F7"/>
      <text x="140" y="26" fontSize="12" fontWeight="700" fill="#FF3B30" textAnchor="middle">sin²θ + cos²θ = 1</text>
      <text x="140" y="42" fontSize="12" fontWeight="700" fill="#FF9500" textAnchor="middle">1 + tan²θ = sec²θ</text>
      <text x="140" y="58" fontSize="12" fontWeight="700" fill="#34C759" textAnchor="middle">1 + cot²θ = cosec²θ</text>
    </svg>
  );
}

// ─── Math Ch9 — Some Applications of Trigonometry ────────────────────────────

function AngleOfElevation() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <line x1="20" y1="175" x2="260" y2="175" stroke="#8E8E93" strokeWidth="2"/>
      <rect x="200" y="80" width="18" height="95" fill="#C7C7CC"/>
      <polygon points="200,80 218,80 209,60" fill="#FF3B30"/>
      <circle cx="60" cy="168" r="8" fill="#007AFF"/>
      <text x="44" y="192" fontSize="11" fill="#007AFF">Observer</text>
      <line x1="60" y1="168" x2="209" y2="68" stroke="#FF9500" strokeWidth="2" strokeDasharray="6,3"/>
      <line x1="60" y1="168" x2="209" y2="168" stroke="#34C759" strokeWidth="1.5" strokeDasharray="4,2"/>
      <path d="M 100,168 A 40,40 0 0,1 84,148" fill="none" stroke="#FF9500" strokeWidth="2"/>
      <text x="108" y="162" fontSize="13" fontWeight="700" fill="#FF9500">α</text>
      <text x="78" y="140" fontSize="11" fill="#FF9500">Angle of Elevation</text>
      <text x="222" y="130" fontSize="11" fill="#FF3B30" fontWeight="700">h</text>
      <rect x="20" y="8" width="240" height="22" rx="6" fill="#F2F2F7"/>
      <text x="140" y="23" fontSize="12" fontWeight="700" fill="#FF9500" textAnchor="middle">tan α = h / d    →    h = d · tan α</text>
    </svg>
  );
}

function AngleOfDepression() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <line x1="20" y1="175" x2="260" y2="175" stroke="#8E8E93" strokeWidth="2"/>
      <rect x="30" y="60" width="22" height="115" fill="#C7C7CC"/>
      <circle cx="41" cy="55" r="8" fill="#007AFF"/>
      <text x="20" y="46" fontSize="11" fill="#007AFF">Observer</text>
      <line x1="41" y1="55" x2="220" y2="55" stroke="#34C759" strokeWidth="1.5" strokeDasharray="4,2"/>
      <line x1="41" y1="55" x2="210" y2="175" stroke="#FF9500" strokeWidth="2" strokeDasharray="6,3"/>
      <circle cx="210" cy="175" r="6" fill="#FF3B30"/>
      <text x="215" y="190" fontSize="11" fill="#FF3B30">Object</text>
      <path d="M 100,55 A 40,40 0 0,0 85,73" fill="none" stroke="#FF9500" strokeWidth="2"/>
      <text x="106" y="76" fontSize="13" fontWeight="700" fill="#FF9500">β</text>
      <text x="88" y="50" fontSize="11" fill="#FF9500">Angle of Depression</text>
      <rect x="20" y="8" width="240" height="22" rx="6" fill="#F2F2F7"/>
      <text x="140" y="23" fontSize="12" fontWeight="700" fill="#FF9500" textAnchor="middle">Angle of depression = Angle of elevation (alt. angles)</text>
    </svg>
  );
}

// ─── Math Ch10 — Circles ─────────────────────────────────────────────────────

function TangentToCircle() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <circle cx="130" cy="120" r="70" fill="#007AFF" fillOpacity="0.08" stroke="#007AFF" strokeWidth="2"/>
      <circle cx="130" cy="120" r="4" fill="#007AFF"/>
      <text x="136" y="118" fontSize="11" fill="#007AFF" fontWeight="700">O</text>
      <circle cx="130" cy="50" r="5" fill="#FF3B30"/>
      <text x="136" y="50" fontSize="11" fill="#FF3B30" fontWeight="700">P</text>
      <line x1="130" y1="120" x2="130" y2="50" stroke="#34C759" strokeWidth="2"/>
      <text x="136" y="92" fontSize="11" fill="#34C759">r</text>
      <line x1="60" y1="50" x2="200" y2="50" stroke="#FF3B30" strokeWidth="2.5"/>
      <rect x="130" y="50" width="10" height="10" fill="none" stroke="#FF3B30" strokeWidth="1.5"/>
      <text x="140" y="22" fontSize="12" fontWeight="700" fill="#FF3B30" textAnchor="middle">Tangent</text>
      <rect x="20" y="168" width="240" height="28" rx="8" fill="#F2F2F7"/>
      <text x="140" y="182" fontSize="11" fontWeight="700" fill="#007AFF" textAnchor="middle">Tangent ⊥ Radius at point of contact</text>
      <text x="140" y="192" fontSize="10" fill="#8E8E93" textAnchor="middle">Tangent touches circle at exactly one point</text>
    </svg>
  );
}

function TangentsFromExternal() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <circle cx="170" cy="100" r="65" fill="#007AFF" fillOpacity="0.08" stroke="#007AFF" strokeWidth="2"/>
      <circle cx="170" cy="100" r="4" fill="#007AFF"/>
      <text x="176" y="98" fontSize="11" fill="#007AFF" fontWeight="700">O</text>
      <circle cx="30" cy="100" r="5" fill="#FF3B30"/>
      <text x="14" y="98" fontSize="11" fill="#FF3B30" fontWeight="700">P</text>
      <line x1="30" y1="100" x2="128" y2="44" stroke="#FF9500" strokeWidth="2.5"/>
      <line x1="30" y1="100" x2="128" y2="156" stroke="#FF9500" strokeWidth="2.5"/>
      <circle cx="128" cy="44" r="5" fill="#34C759"/>
      <circle cx="128" cy="156" r="5" fill="#34C759"/>
      <text x="112" y="38" fontSize="11" fill="#34C759" fontWeight="700">A</text>
      <text x="112" y="168" fontSize="11" fill="#34C759" fontWeight="700">B</text>
      <text x="72" y="68" fontSize="10" fill="#FF9500">PA</text>
      <text x="72" y="142" fontSize="10" fill="#FF9500">PB</text>
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#F2F2F7"/>
      <text x="140" y="23" fontSize="12" fontWeight="700" fill="#34C759" textAnchor="middle">PA = PB  (tangents from external point are equal)</text>
    </svg>
  );
}

// ─── Math Ch11 — Areas Related to Circles ────────────────────────────────────

function CircleAreaPerimeter() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <circle cx="140" cy="115" r="72" fill="#007AFF" fillOpacity="0.10" stroke="#007AFF" strokeWidth="2.5"/>
      <line x1="140" y1="115" x2="212" y2="115" stroke="#FF3B30" strokeWidth="2.5"/>
      <text x="172" y="108" fontSize="13" fontWeight="700" fill="#FF3B30">r</text>
      <circle cx="140" cy="115" r="4" fill="#007AFF"/>
      <text x="144" y="112" fontSize="11" fill="#007AFF" fontWeight="700">O</text>
      <path d="M 140,43 A 72,72 0 0,1 212,115" fill="none" stroke="#34C759" strokeWidth="2.5"/>
      <text x="200" y="72" fontSize="11" fill="#34C759" fontWeight="700">C = 2πr</text>
      <rect x="20" y="8" width="240" height="22" rx="6" fill="#F2F2F7"/>
      <text x="140" y="23" fontSize="12" fontWeight="700" fill="#007AFF" textAnchor="middle">Area = πr²    |    Circumference = 2πr</text>
      <line x1="68" y1="115" x2="212" y2="115" stroke="#C7C7CC" strokeWidth="1" strokeDasharray="4,2"/>
      <text x="140" y="136" fontSize="11" fill="#8E8E93" textAnchor="middle">diameter d = 2r</text>
    </svg>
  );
}

function CombinationAreas() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <circle cx="110" cy="110" r="72" fill="#007AFF" fillOpacity="0.06" stroke="#007AFF" strokeWidth="2"/>
      <path d="M 110,110 L 182,110 A 72,72 0 0,0 146,48 Z" fill="#FF9500" fillOpacity="0.35" stroke="#FF9500" strokeWidth="1.5"/>
      <text x="162" y="84" fontSize="10" fontWeight="700" fill="#FF9500">Sector</text>
      <path d="M 146,48 L 182,110 A 72,72 0 0,0 146,48" fill="#34C759" fillOpacity="0.35" stroke="#34C759" strokeWidth="1.5"/>
      <circle cx="110" cy="110" r="4" fill="#007AFF"/>
      <text x="114" y="108" fontSize="11" fill="#007AFF">O</text>
      <path d="M 152,110 A 42,42 0 0,0 132,73" fill="none" stroke="#FF9500" strokeWidth="1.5"/>
      <text x="154" y="106" fontSize="11" fontWeight="700" fill="#FF9500">θ</text>
      <rect x="186" y="55" width="88" height="58" rx="8" fill="#F2F2F7"/>
      <text x="230" y="72" fontSize="10" fontWeight="700" fill="#FF9500" textAnchor="middle">Sector Area</text>
      <text x="230" y="86" fontSize="10" fill="#FF9500" textAnchor="middle">= (θ/360)·πr²</text>
      <text x="230" y="100" fontSize="10" fontWeight="700" fill="#34C759" textAnchor="middle">Segment</text>
      <text x="230" y="114" fontSize="10" fill="#34C759" textAnchor="middle">= Sector − △</text>
    </svg>
  );
}

// ─── Math Ch12 — Surface Areas and Volumes ────────────────────────────────────

function SurfaceAreaCombination() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="90" y="110" width="100" height="68" fill="#007AFF" fillOpacity="0.15" stroke="#007AFF" strokeWidth="2"/>
      <ellipse cx="140" cy="110" rx="50" ry="14" fill="#007AFF" fillOpacity="0.25" stroke="#007AFF" strokeWidth="2"/>
      <ellipse cx="140" cy="178" rx="50" ry="14" fill="#007AFF" fillOpacity="0.25" stroke="#007AFF" strokeWidth="2"/>
      <polygon points="140,44 90,110 190,110" fill="#FF3B30" fillOpacity="0.25" stroke="#FF3B30" strokeWidth="2"/>
      <line x1="140" y1="44" x2="190" y2="110" stroke="#FF9500" strokeWidth="1.5" strokeDasharray="4,2"/>
      <text x="178" y="76" fontSize="11" fill="#FF9500" fontWeight="700">l</text>
      <line x1="140" y1="110" x2="190" y2="110" stroke="#34C759" strokeWidth="1.5" strokeDasharray="4,2"/>
      <text x="162" y="105" fontSize="11" fill="#34C759" fontWeight="700">r</text>
      <line x1="82" y1="110" x2="82" y2="178" stroke="#8E8E93" strokeWidth="1.5" strokeDasharray="3,2"/>
      <text x="70" y="148" fontSize="11" fill="#8E8E93" fontWeight="700">h</text>
      <rect x="10" y="8" width="260" height="28" rx="6" fill="#F2F2F7"/>
      <text x="140" y="22" fontSize="10" fontWeight="700" fill="#007AFF" textAnchor="middle">TSA = πrl (cone) + 2πrh + πr² (cylinder)</text>
      <text x="140" y="34" fontSize="9" fill="#8E8E93" textAnchor="middle">Only count exposed (non-joined) surfaces</text>
    </svg>
  );
}

function VolumeCombination() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="100" y="108" width="80" height="60" fill="#007AFF" fillOpacity="0.15" stroke="#007AFF" strokeWidth="2"/>
      <ellipse cx="140" cy="108" rx="40" ry="11" fill="#007AFF" fillOpacity="0.25" stroke="#007AFF" strokeWidth="2"/>
      <ellipse cx="140" cy="168" rx="40" ry="11" fill="#007AFF" fillOpacity="0.25" stroke="#007AFF" strokeWidth="2"/>
      <path d="M 100,108 A 40,40 0 0,1 180,108" fill="#34C759" fillOpacity="0.25" stroke="#34C759" strokeWidth="2"/>
      <text x="140" y="72" fontSize="11" fill="#34C759" fontWeight="700" textAnchor="middle">r</text>
      <line x1="140" y1="108" x2="140" y2="68" stroke="#34C759" strokeWidth="1.5" strokeDasharray="3,2"/>
      <text x="185" y="142" fontSize="11" fill="#007AFF" fontWeight="700">h</text>
      <line x1="183" y1="108" x2="183" y2="168" stroke="#007AFF" strokeWidth="1.5" strokeDasharray="3,2"/>
      <rect x="10" y="8" width="260" height="40" rx="8" fill="#F2F2F7"/>
      <text x="140" y="26" fontSize="11" fontWeight="700" fill="#007AFF" textAnchor="middle">V (cylinder) = πr²h</text>
      <text x="140" y="42" fontSize="11" fontWeight="700" fill="#34C759" textAnchor="middle">V (hemisphere) = ⅔πr³</text>
      <text x="140" y="188" fontSize="11" fontWeight="700" fill="#FF9500" textAnchor="middle">Total V = sum of individual volumes</text>
    </svg>
  );
}

function ConversionSolid() {
  return (
    <svg viewBox="0 0 280 180" width="280" height="180" fontFamily="system-ui,sans-serif">
      <circle cx="72" cy="104" r="55" fill="#FF3B30" fillOpacity="0.15" stroke="#FF3B30" strokeWidth="2"/>
      <text x="72" y="108" fontSize="12" fontWeight="700" fill="#FF3B30" textAnchor="middle">Sphere</text>
      <text x="72" y="124" fontSize="10" fill="#FF3B30" textAnchor="middle">V = 4/3 πR³</text>
      <text x="140" y="96" fontSize="24" fill="#FF9500" textAnchor="middle">→</text>
      <text x="140" y="116" fontSize="10" fill="#FF9500" textAnchor="middle">melted &amp;</text>
      <text x="140" y="130" fontSize="10" fill="#FF9500" textAnchor="middle">recast</text>
      <rect x="172" y="78" width="24" height="44" fill="#007AFF" fillOpacity="0.15" stroke="#007AFF" strokeWidth="1.5"/>
      <ellipse cx="184" cy="78" rx="12" ry="5" fill="#007AFF" fillOpacity="0.25" stroke="#007AFF" strokeWidth="1.5"/>
      <ellipse cx="184" cy="122" rx="12" ry="5" fill="#007AFF" fillOpacity="0.25" stroke="#007AFF" strokeWidth="1.5"/>
      <rect x="204" y="88" width="24" height="44" fill="#007AFF" fillOpacity="0.15" stroke="#007AFF" strokeWidth="1.5"/>
      <ellipse cx="216" cy="88" rx="12" ry="5" fill="#007AFF" fillOpacity="0.25" stroke="#007AFF" strokeWidth="1.5"/>
      <ellipse cx="216" cy="132" rx="12" ry="5" fill="#007AFF" fillOpacity="0.25" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="200" y="152" fontSize="11" fontWeight="700" fill="#007AFF" textAnchor="middle">n cylinders</text>
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#F2F2F7"/>
      <text x="140" y="23" fontSize="12" fontWeight="700" fill="#FF9500" textAnchor="middle">Volume is conserved during conversion</text>
    </svg>
  );
}

// ─── Math Ch13 — Statistics ───────────────────────────────────────────────────

function MeanGrouped() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="36" width="260" height="128" rx="8" fill="#F2F2F7"/>
      <rect x="10" y="36" width="260" height="24" rx="8" fill="#007AFF"/>
      {["Class","f","x (mid)","fx"].map((h,i) => (
        <text key={i} x={22+i*64} y="52" fontSize="11" fontWeight="700" fill="#FFFFFF">{h}</text>
      ))}
      {[["10–20","4","15","60"],["20–30","6","25","150"],["30–40","5","35","175"]].map((row,ri) => (
        row.map((cell,ci) => (
          <text key={`${ri}-${ci}`} x={22+ci*64} y={76+ri*26} fontSize="11" fill="#1C1C1E">{cell}</text>
        ))
      ))}
      <line x1="14" y1="152" x2="266" y2="152" stroke="#C7C7CC" strokeWidth="1"/>
      <text x="22" y="168" fontSize="11" fontWeight="700" fill="#1C1C1E">Total</text>
      <text x="86" y="168" fontSize="11" fontWeight="700" fill="#007AFF">Σf=15</text>
      <text x="214" y="168" fontSize="11" fontWeight="700" fill="#34C759">Σfx=385</text>
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#34C759" fillOpacity="0.2"/>
      <text x="140" y="23" fontSize="12" fontWeight="700" fill="#34C759" textAnchor="middle">x̄ = Σfx / Σf = 385 / 15 ≈ 25.67</text>
    </svg>
  );
}

function ModeGrouped() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      {[{x:30,h:50,f:4},{x:82,h:80,f:7,modal:true},{x:134,h:60,f:6},{x:186,h:35,f:3},{x:230,h:20,f:2}].map((b,i) => (
        <g key={i}>
          <rect x={b.x} y={172-b.h} width="44" height={b.h}
            fill={b.modal ? "#FF3B30" : "#007AFF"} fillOpacity={b.modal ? 0.4 : 0.2}
            stroke={b.modal ? "#FF3B30" : "#007AFF"} strokeWidth="2"/>
          <text x={b.x+22} y={172-b.h-6} fontSize="11" fontWeight="700"
            fill={b.modal ? "#FF3B30" : "#007AFF"} textAnchor="middle">{b.f}</text>
        </g>
      ))}
      <line x1="24" y1="172" x2="280" y2="172" stroke="#C7C7CC" strokeWidth="1.5"/>
      <text x="104" y="68" fontSize="11" fontWeight="700" fill="#FF3B30" textAnchor="middle">Modal Class</text>
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#FF3B30" fillOpacity="0.12"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#FF3B30" textAnchor="middle">Mode = l + [(f₁−f₀)/(2f₁−f₀−f₂)] × h</text>
    </svg>
  );
}

function MedianGrouped() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <polyline points="30,175 80,155 130,125 180,85 230,52 264,34"
        fill="none" stroke="#007AFF" strokeWidth="2.5"/>
      <line x1="30" y1="175" x2="270" y2="175" stroke="#C7C7CC" strokeWidth="1.5"/>
      <line x1="30" y1="12" x2="30" y2="178" stroke="#C7C7CC" strokeWidth="1.5"/>
      <text x="265" y="178" fontSize="10" fill="#8E8E93">x</text>
      <text x="18" y="16" fontSize="10" fill="#8E8E93">cf</text>
      <line x1="30" y1="104" x2="190" y2="104" stroke="#FF3B30" strokeWidth="1.5" strokeDasharray="5,3"/>
      <text x="8" y="108" fontSize="10" fontWeight="700" fill="#FF3B30">N/2</text>
      <line x1="190" y1="104" x2="190" y2="175" stroke="#FF9500" strokeWidth="1.5" strokeDasharray="5,3"/>
      <circle cx="190" cy="104" r="5" fill="#FF3B30"/>
      <text x="178" y="190" fontSize="11" fontWeight="700" fill="#FF9500">Median</text>
      <rect x="10" y="8" width="260" height="20" rx="6" fill="#F2F2F7"/>
      <text x="140" y="22" fontSize="11" fontWeight="700" fill="#007AFF" textAnchor="middle">Median = l + [(N/2 − cf) / f] × h</text>
    </svg>
  );
}

function Ogive() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <polyline points="40,175 80,162 120,142 160,108 200,74 240,50 268,36"
        fill="none" stroke="#007AFF" strokeWidth="2.5"/>
      <polyline points="40,36 80,50 120,74 160,108 200,142 240,162 268,175"
        fill="none" stroke="#FF3B30" strokeWidth="2.5"/>
      <line x1="30" y1="178" x2="275" y2="178" stroke="#C7C7CC" strokeWidth="1.5"/>
      <line x1="30" y1="12" x2="30" y2="180" stroke="#C7C7CC" strokeWidth="1.5"/>
      <circle cx="160" cy="108" r="6" fill="#FF9500"/>
      <line x1="160" y1="108" x2="160" y2="178" stroke="#FF9500" strokeWidth="1.5" strokeDasharray="4,2"/>
      <text x="152" y="192" fontSize="11" fontWeight="700" fill="#FF9500">Median</text>
      <line x1="36" y1="20" x2="56" y2="20" stroke="#007AFF" strokeWidth="2"/>
      <text x="60" y="24" fontSize="10" fill="#007AFF">Less-than ogive</text>
      <line x1="36" y1="34" x2="56" y2="34" stroke="#FF3B30" strokeWidth="2"/>
      <text x="60" y="38" fontSize="10" fill="#FF3B30">More-than ogive</text>
    </svg>
  );
}

function CumulativeFreq() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="36" width="260" height="158" rx="8" fill="#F2F2F7"/>
      <rect x="10" y="36" width="260" height="24" rx="8" fill="#34C759"/>
      {["Class","Freq (f)","Cum. Freq (cf)"].map((h,i) => (
        <text key={i} x={22+i*86} y="52" fontSize="11" fontWeight="700" fill="#FFFFFF">{h}</text>
      ))}
      {[["10–20","4","4"],["20–30","6","10"],["30–40","5","15"],["40–50","3","18"],["50–60","2","20"]].map((row,ri) => (
        row.map((cell,ci) => (
          <text key={`${ri}-${ci}`} x={22+ci*86} y={74+ri*24} fontSize="11"
            fill={ci===2 ? "#007AFF" : "#1C1C1E"} fontWeight={ci===2 ? "700" : "400"}>{cell}</text>
        ))
      ))}
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#34C759" fillOpacity="0.2"/>
      <text x="140" y="23" fontSize="12" fontWeight="700" fill="#34C759" textAnchor="middle">Cumulative Frequency — Running Total</text>
    </svg>
  );
}

// ─── Math Ch14 — Probability ──────────────────────────────────────────────────

function ProbabilityBasic() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="20" y="46" width="240" height="136" rx="10" fill="#007AFF" fillOpacity="0.08" stroke="#007AFF" strokeWidth="2"/>
      <text x="246" y="60" fontSize="11" fontWeight="700" fill="#007AFF">S</text>
      <ellipse cx="120" cy="114" rx="62" ry="46" fill="#FF3B30" fillOpacity="0.18" stroke="#FF3B30" strokeWidth="2"/>
      <text x="120" y="118" fontSize="14" fontWeight="700" fill="#FF3B30" textAnchor="middle">E</text>
      {[[100,98],[130,98],[115,118],[145,118],[100,124]].map((pt,i)=>(
        <circle key={i} cx={pt[0]} cy={pt[1]} r="4" fill="#FF3B30"/>
      ))}
      {[[200,72],[220,92],[184,148],[242,136]].map((pt,i)=>(
        <circle key={i} cx={pt[0]} cy={pt[1]} r="4" fill="#007AFF"/>
      ))}
      <rect x="20" y="8" width="240" height="30" rx="6" fill="#F2F2F7"/>
      <text x="140" y="22" fontSize="12" fontWeight="700" fill="#FF3B30" textAnchor="middle">P(E) = n(E) / n(S)</text>
      <text x="140" y="36" fontSize="10" fill="#8E8E93" textAnchor="middle">0 ≤ P(E) ≤ 1    •    P(S) = 1    •    P(∅) = 0</text>
    </svg>
  );
}

function ClassicalProbability() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="20" y="60" width="80" height="80" rx="12" fill="#F2F2F7" stroke="#C7C7CC" strokeWidth="2"/>
      {[[40,80],[60,80],[80,80],[40,100],[60,100],[80,100]].map((d,i)=>(
        <circle key={i} cx={d[0]} cy={d[1]} r="5" fill="#1C1C1E"/>
      ))}
      <text x="60" y="158" fontSize="11" fill="#8E8E93" textAnchor="middle">Die: 6 outcomes</text>
      <circle cx="200" cy="100" r="40" fill="#FF9500" fillOpacity="0.2" stroke="#FF9500" strokeWidth="2"/>
      <text x="200" y="96" fontSize="14" fontWeight="700" fill="#FF9500" textAnchor="middle">H</text>
      <text x="200" y="114" fontSize="11" fill="#8E8E93" textAnchor="middle">or T</text>
      <text x="200" y="158" fontSize="11" fill="#8E8E93" textAnchor="middle">Coin: 2 outcomes</text>
      <rect x="10" y="8" width="260" height="38" rx="6" fill="#F2F2F7"/>
      <text x="140" y="24" fontSize="12" fontWeight="700" fill="#007AFF" textAnchor="middle">P(event) = Favourable outcomes</text>
      <text x="140" y="40" fontSize="12" fontWeight="700" fill="#007AFF" textAnchor="middle">                    Total outcomes</text>
    </svg>
  );
}

function ComplementaryEvents() {
  return (
    <svg viewBox="0 0 280 180" width="280" height="180" fontFamily="system-ui,sans-serif">
      <rect x="30" y="74" width="220" height="50" rx="8" fill="#F2F2F7" stroke="#C7C7CC" strokeWidth="1.5"/>
      <rect x="30" y="74" width="132" height="50" rx="8" fill="#007AFF" fillOpacity="0.3" stroke="#007AFF" strokeWidth="2"/>
      <text x="96" y="104" fontSize="14" fontWeight="700" fill="#007AFF" textAnchor="middle">P(E)</text>
      <rect x="162" y="74" width="88" height="50" rx="8" fill="#FF3B30" fillOpacity="0.3" stroke="#FF3B30" strokeWidth="2"/>
      <text x="206" y="104" fontSize="14" fontWeight="700" fill="#FF3B30" textAnchor="middle">P(Ē)</text>
      <text x="140" y="144" fontSize="11" fill="#8E8E93" textAnchor="middle">Together they cover the entire sample space</text>
      <rect x="20" y="8" width="240" height="54" rx="8" fill="#F2F2F7"/>
      <text x="140" y="28" fontSize="14" fontWeight="700" fill="#34C759" textAnchor="middle">P(E) + P(Ē) = 1</text>
      <text x="140" y="44" fontSize="12" fill="#007AFF" textAnchor="middle">P(Ē) = 1 − P(E)</text>
      <text x="140" y="58" fontSize="10" fill="#8E8E93" textAnchor="middle">Ē = complement (NOT E)</text>
    </svg>
  );
}

function ProbabilityApplications() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <ellipse cx="100" cy="148" rx="52" ry="36" fill="#FF9500" fillOpacity="0.18" stroke="#FF9500" strokeWidth="2"/>
      <path d="M 70,133 Q 100,92 130,133" fill="#FF9500" fillOpacity="0.18" stroke="#FF9500" strokeWidth="2"/>
      <text x="100" y="158" fontSize="11" fontWeight="700" fill="#FF9500" textAnchor="middle">Bag</text>
      <circle cx="80" cy="145" r="10" fill="#FF3B30"/>
      <circle cx="100" cy="152" r="10" fill="#FF3B30"/>
      <circle cx="120" cy="145" r="10" fill="#007AFF"/>
      <text x="80" y="149" fontSize="8" fontWeight="700" fill="#FFF" textAnchor="middle">R</text>
      <text x="100" y="156" fontSize="8" fontWeight="700" fill="#FFF" textAnchor="middle">R</text>
      <text x="120" y="149" fontSize="8" fontWeight="700" fill="#FFF" textAnchor="middle">B</text>
      {[0,1,2,3].map(i => (
        <rect key={i} x={186+i*20} y="118" width="16" height="22" rx="2"
          fill={i<2?"#FF3B30":"#1C1C1E"} fillOpacity="0.8"/>
      ))}
      <text x="204" y="154" fontSize="10" fill="#8E8E93" textAnchor="middle">52 cards</text>
      <rect x="10" y="8" width="260" height="52" rx="8" fill="#F2F2F7"/>
      <text x="140" y="26" fontSize="11" fontWeight="700" fill="#007AFF" textAnchor="middle">Bag: 2 Red, 1 Blue → 3 total</text>
      <text x="140" y="42" fontSize="11" fill="#FF3B30" textAnchor="middle">P(Red) = 2/3    P(Blue) = 1/3</text>
      <text x="140" y="56" fontSize="10" fill="#8E8E93" textAnchor="middle">Cards: P(Ace) = 4/52 = 1/13</text>
    </svg>
  );
}

// ─── SST History Ch 1–5 ───────────────────────────────────────────────────────

function FrenchRevolution() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#FF3B30" fillOpacity="0.12" stroke="#FF3B30" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#FF3B30" textAnchor="middle">Liberty · Equality · Fraternity (1789)</text>
      <line x1="24" y1="88" x2="256" y2="88" stroke="#C7C7CC" strokeWidth="2"/>
      <circle cx="44" cy="88" r="7" fill="#FF3B30"/>
      <text x="44" y="76" fontSize="8" fontWeight="700" fill="#1C1C1E" textAnchor="middle">1789</text>
      <text x="44" y="104" fontSize="8" fill="#8E8E93" textAnchor="middle">French</text>
      <text x="44" y="115" fontSize="8" fill="#8E8E93" textAnchor="middle">Revolution</text>
      <circle cx="114" cy="88" r="7" fill="#007AFF"/>
      <text x="114" y="76" fontSize="8" fontWeight="700" fill="#1C1C1E" textAnchor="middle">1804</text>
      <text x="114" y="104" fontSize="8" fill="#8E8E93" textAnchor="middle">Napoleon</text>
      <text x="114" y="115" fontSize="8" fill="#8E8E93" textAnchor="middle">Code</text>
      <circle cx="184" cy="88" r="7" fill="#FF9500"/>
      <text x="184" y="76" fontSize="8" fontWeight="700" fill="#1C1C1E" textAnchor="middle">1830</text>
      <text x="184" y="104" fontSize="8" fill="#8E8E93" textAnchor="middle">Liberal</text>
      <text x="184" y="115" fontSize="8" fill="#8E8E93" textAnchor="middle">Revolts</text>
      <circle cx="246" cy="88" r="7" fill="#34C759"/>
      <text x="246" y="76" fontSize="8" fontWeight="700" fill="#1C1C1E" textAnchor="middle">1848</text>
      <text x="246" y="104" fontSize="8" fill="#8E8E93" textAnchor="middle">Frankfurt</text>
      <text x="246" y="115" fontSize="8" fill="#8E8E93" textAnchor="middle">Parliament</text>
      <rect x="10" y="132" width="260" height="58" rx="8" fill="#F2F2F7"/>
      <text x="140" y="150" fontSize="10" fontWeight="700" fill="#1C1C1E" textAnchor="middle">Napoleonic Code abolished feudalism</text>
      <text x="140" y="164" fontSize="9" fill="#8E8E93" textAnchor="middle">Uniform laws · Equal rights · No privilege by birth</text>
      <text x="140" y="178" fontSize="9" fill="#8E8E93" textAnchor="middle">Nationalism = loyalty to nation-state, not king/religion</text>
    </svg>
  );
}

function NationalismEurope() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#FF3B30" fillOpacity="0.12" stroke="#FF3B30" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#FF3B30" textAnchor="middle">Romantic Nationalism — Culture unites nations</text>
      <circle cx="50" cy="72" r="28" fill="#FF9500" fillOpacity="0.15" stroke="#FF9500" strokeWidth="1.5"/>
      <text x="50" y="68" fontSize="9" fontWeight="700" fill="#FF9500" textAnchor="middle">Language</text>
      <text x="50" y="80" fontSize="8" fill="#8E8E93" textAnchor="middle">German unifier</text>
      <circle cx="140" cy="72" r="28" fill="#007AFF" fillOpacity="0.15" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="140" y="68" fontSize="9" fontWeight="700" fill="#007AFF" textAnchor="middle">Folklore</text>
      <text x="140" y="80" fontSize="8" fill="#8E8E93" textAnchor="middle">Grimm Brothers</text>
      <circle cx="230" cy="72" r="28" fill="#34C759" fillOpacity="0.15" stroke="#34C759" strokeWidth="1.5"/>
      <text x="230" y="68" fontSize="9" fontWeight="700" fill="#34C759" textAnchor="middle">Music</text>
      <text x="230" y="80" fontSize="8" fill="#8E8E93" textAnchor="middle">Composers, Art</text>
      <line x1="78" y1="72" x2="112" y2="72" stroke="#C7C7CC" strokeWidth="1.5" strokeDasharray="3,2"/>
      <line x1="168" y1="72" x2="202" y2="72" stroke="#C7C7CC" strokeWidth="1.5" strokeDasharray="3,2"/>
      <rect x="10" y="114" width="260" height="74" rx="8" fill="#F2F2F7"/>
      <text x="140" y="132" fontSize="10" fontWeight="700" fill="#1C1C1E" textAnchor="middle">Cultural Nationalism → Political Nationalism</text>
      <text x="140" y="148" fontSize="9" fill="#8E8E93" textAnchor="middle">1830: Greek independence (first nationalist movement)</text>
      <text x="140" y="162" fontSize="9" fill="#8E8E93" textAnchor="middle">1848: Liberal revolutions across Europe</text>
      <text x="140" y="176" fontSize="9" fill="#FF3B30" textAnchor="middle">Frankfurt Parliament 1848 — attempted German unification</text>
    </svg>
  );
}

function GermanyItalyUnification() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#FF3B30" fillOpacity="0.12" stroke="#FF3B30" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#FF3B30" textAnchor="middle">Unification — Germany (1871) · Italy (1861)</text>
      <rect x="14" y="38" width="120" height="152" rx="8" fill="#007AFF" fillOpacity="0.07" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="74" y="56" fontSize="11" fontWeight="700" fill="#007AFF" textAnchor="middle">GERMANY</text>
      <text x="74" y="72" fontSize="9" fill="#1C1C1E" textAnchor="middle">Bismarck</text>
      <text x="74" y="84" fontSize="8" fill="#8E8E93" textAnchor="middle">"Blood &amp; Iron"</text>
      <text x="74" y="100" fontSize="9" fill="#1C1C1E" textAnchor="middle">Kaiser Wilhelm I</text>
      <text x="74" y="118" fontSize="8" fill="#8E8E93" textAnchor="middle">Prussia unified</text>
      <text x="74" y="130" fontSize="8" fill="#8E8E93" textAnchor="middle">German states</text>
      <text x="74" y="150" fontSize="9" fontWeight="700" fill="#007AFF" textAnchor="middle">Unified 1871</text>
      <text x="74" y="164" fontSize="8" fill="#8E8E93" textAnchor="middle">Military force</text>
      <text x="74" y="178" fontSize="8" fill="#8E8E93" textAnchor="middle">+ diplomacy</text>
      <rect x="146" y="38" width="120" height="152" rx="8" fill="#34C759" fillOpacity="0.07" stroke="#34C759" strokeWidth="1.5"/>
      <text x="206" y="56" fontSize="11" fontWeight="700" fill="#34C759" textAnchor="middle">ITALY</text>
      <text x="206" y="72" fontSize="9" fill="#1C1C1E" textAnchor="middle">Mazzini (ideology)</text>
      <text x="206" y="86" fontSize="8" fill="#8E8E93" textAnchor="middle">Young Italy movement</text>
      <text x="206" y="102" fontSize="9" fill="#1C1C1E" textAnchor="middle">Cavour (diplomacy)</text>
      <text x="206" y="116" fontSize="9" fill="#1C1C1E" textAnchor="middle">Garibaldi (military)</text>
      <text x="206" y="132" fontSize="8" fill="#8E8E93" textAnchor="middle">Red Shirts army</text>
      <text x="206" y="150" fontSize="9" fontWeight="700" fill="#34C759" textAnchor="middle">Unified 1861</text>
      <text x="206" y="164" fontSize="8" fill="#8E8E93" textAnchor="middle">Ideology +</text>
      <text x="206" y="178" fontSize="8" fill="#8E8E93" textAnchor="middle">diplomacy + army</text>
    </svg>
  );
}

function VisualisingNation() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#FF3B30" fillOpacity="0.12" stroke="#FF3B30" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#FF3B30" textAnchor="middle">Marianne &amp; Germania — Nationalist Allegories</text>
      <rect x="14" y="38" width="118" height="120" rx="8" fill="#007AFF" fillOpacity="0.07" stroke="#007AFF" strokeWidth="1.5"/>
      <ellipse cx="73" cy="74" rx="22" ry="26" fill="#FFD7BE" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="73" y="70" fontSize="22" textAnchor="middle">🗽</text>
      <text x="73" y="112" fontSize="11" fontWeight="700" fill="#007AFF" textAnchor="middle">MARIANNE</text>
      <text x="73" y="126" fontSize="8" fill="#8E8E93" textAnchor="middle">France</text>
      <text x="73" y="138" fontSize="8" fill="#8E8E93" textAnchor="middle">Red Phrygian cap</text>
      <text x="73" y="150" fontSize="8" fill="#8E8E93" textAnchor="middle">torch of liberty</text>
      <rect x="148" y="38" width="118" height="120" rx="8" fill="#34C759" fillOpacity="0.07" stroke="#34C759" strokeWidth="1.5"/>
      <ellipse cx="207" cy="74" rx="22" ry="26" fill="#FFD7BE" stroke="#34C759" strokeWidth="1.5"/>
      <text x="207" y="70" fontSize="22" textAnchor="middle">⚔️</text>
      <text x="207" y="112" fontSize="11" fontWeight="700" fill="#34C759" textAnchor="middle">GERMANIA</text>
      <text x="207" y="126" fontSize="8" fill="#8E8E93" textAnchor="middle">Germany</text>
      <text x="207" y="138" fontSize="8" fill="#8E8E93" textAnchor="middle">Crown of oak leaves</text>
      <text x="207" y="150" fontSize="8" fill="#8E8E93" textAnchor="middle">sword, olive branch</text>
      <rect x="10" y="166" width="260" height="26" rx="6" fill="#F2F2F7"/>
      <text x="140" y="183" fontSize="9" fill="#8E8E93" textAnchor="middle">Nations as female figures → spread nationalist feeling · art, coins, stamps</text>
    </svg>
  );
}

function NonCooperation() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#FF9500" fillOpacity="0.15" stroke="#FF9500" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#FF9500" textAnchor="middle">Non-Cooperation Movement 1920–22</text>
      <rect x="10" y="36" width="260" height="84" rx="8" fill="#F2F2F7"/>
      <text x="140" y="52" fontSize="10" fontWeight="700" fill="#1C1C1E" textAnchor="middle">Boycott Programme</text>
      <circle cx="26" cy="68" r="4" fill="#FF9500"/>
      <text x="40" y="72" fontSize="9" fill="#1C1C1E">Legislative councils + courts</text>
      <circle cx="26" cy="84" r="4" fill="#FF9500"/>
      <text x="40" y="88" fontSize="9" fill="#1C1C1E">Schools + government colleges</text>
      <circle cx="26" cy="100" r="4" fill="#FF9500"/>
      <text x="40" y="104" fontSize="9" fill="#1C1C1E">Foreign cloth · Surrender of titles</text>
      <circle cx="26" cy="112" r="4" fill="#FF9500"/>
      <text x="40" y="116" fontSize="9" fill="#1C1C1E">Non-payment of taxes in some areas</text>
      <rect x="10" y="128" width="260" height="64" rx="8" fill="#FF3B30" fillOpacity="0.06" stroke="#FF3B30" strokeWidth="1.5"/>
      <text x="140" y="146" fontSize="10" fontWeight="700" fill="#FF3B30" textAnchor="middle">Trigger → Withdrawal</text>
      <text x="140" y="162" fontSize="9" fill="#8E8E93" textAnchor="middle">Rowlatt Act 1919 + Jallianwala Bagh → NCM launched</text>
      <text x="140" y="176" fontSize="9" fill="#8E8E93" textAnchor="middle">Chauri Chaura 1922: police station burned</text>
      <text x="140" y="188" fontSize="9" fontWeight="700" fill="#FF3B30" textAnchor="middle">Gandhi withdrew — committed to non-violence</text>
    </svg>
  );
}

function CivilDisobedience() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#FF9500" fillOpacity="0.15" stroke="#FF9500" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#FF9500" textAnchor="middle">Dandi Salt March — Civil Disobedience 1930</text>
      <path d="M 30,120 Q 90,90 150,105 Q 200,115 250,75" fill="none" stroke="#007AFF" strokeWidth="2.5" strokeDasharray="6,3"/>
      <circle cx="30" cy="120" r="9" fill="#34C759"/>
      <text x="30" y="116" fontSize="8" fontWeight="700" fill="#fff" textAnchor="middle">S</text>
      <text x="30" y="138" fontSize="8" fontWeight="700" fill="#34C759" textAnchor="middle">Sabarmati</text>
      <text x="30" y="150" fontSize="7" fill="#8E8E93" textAnchor="middle">Mar 12, 1930</text>
      <circle cx="250" cy="75" r="9" fill="#FF3B30"/>
      <text x="250" y="71" fontSize="8" fontWeight="700" fill="#fff" textAnchor="middle">D</text>
      <text x="250" y="93" fontSize="8" fontWeight="700" fill="#FF3B30" textAnchor="middle">Dandi</text>
      <text x="250" y="105" fontSize="7" fill="#8E8E93" textAnchor="middle">Apr 6, 1930</text>
      <text x="140" y="66" fontSize="9" fontWeight="700" fill="#007AFF" textAnchor="middle">240 miles · 24 days · 78 marchers</text>
      <rect x="10" y="158" width="260" height="34" rx="8" fill="#F2F2F7"/>
      <text x="140" y="172" fontSize="9" fontWeight="700" fill="#1C1C1E" textAnchor="middle">Why salt? Universal commodity used by all Indians</text>
      <text x="140" y="185" fontSize="8" fill="#8E8E93" textAnchor="middle">Lahore Congress 1929 → Purna Swaraj → CDM → Gandhi-Irwin Pact 1931</text>
    </svg>
  );
}

function CollectiveBelonging() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#FF9500" fillOpacity="0.15" stroke="#FF9500" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#FF9500" textAnchor="middle">Symbols of Indian Nationalism</text>
      <rect x="14" y="38" width="74" height="58" rx="6" fill="#F2F2F7" stroke="#E5E5EA" strokeWidth="1"/>
      <text x="51" y="60" fontSize="18" textAnchor="middle">🎵</text>
      <text x="51" y="76" fontSize="9" fontWeight="700" fill="#1C1C1E" textAnchor="middle">Vande Mataram</text>
      <text x="51" y="88" fontSize="7" fill="#8E8E93" textAnchor="middle">Bankim Chandra</text>
      <rect x="103" y="38" width="74" height="58" rx="6" fill="#F2F2F7" stroke="#E5E5EA" strokeWidth="1"/>
      <text x="140" y="60" fontSize="18" textAnchor="middle">🏳️</text>
      <text x="140" y="76" fontSize="9" fontWeight="700" fill="#1C1C1E" textAnchor="middle">Tricolour Flag</text>
      <text x="140" y="88" fontSize="7" fill="#8E8E93" textAnchor="middle">Gandhi 1921</text>
      <rect x="192" y="38" width="74" height="58" rx="6" fill="#F2F2F7" stroke="#E5E5EA" strokeWidth="1"/>
      <text x="229" y="60" fontSize="18" textAnchor="middle">🎨</text>
      <text x="229" y="76" fontSize="9" fontWeight="700" fill="#1C1C1E" textAnchor="middle">Bharat Mata</text>
      <text x="229" y="88" fontSize="7" fill="#8E8E93" textAnchor="middle">Abanindranath</text>
      <rect x="14" y="106" width="74" height="58" rx="6" fill="#F2F2F7" stroke="#E5E5EA" strokeWidth="1"/>
      <text x="51" y="128" fontSize="18" textAnchor="middle">📖</text>
      <text x="51" y="144" fontSize="9" fontWeight="700" fill="#1C1C1E" textAnchor="middle">Folk Revival</text>
      <text x="51" y="156" fontSize="7" fill="#8E8E93" textAnchor="middle">Rabindranath</text>
      <rect x="103" y="106" width="74" height="58" rx="6" fill="#F2F2F7" stroke="#E5E5EA" strokeWidth="1"/>
      <text x="140" y="128" fontSize="18" textAnchor="middle">🗓️</text>
      <text x="140" y="144" fontSize="9" fontWeight="700" fill="#1C1C1E" textAnchor="middle">26 Jan 1930</text>
      <text x="140" y="156" fontSize="7" fill="#8E8E93" textAnchor="middle">Independence Day</text>
      <rect x="192" y="106" width="74" height="58" rx="6" fill="#F2F2F7" stroke="#E5E5EA" strokeWidth="1"/>
      <text x="229" y="128" fontSize="18" textAnchor="middle">🧵</text>
      <text x="229" y="144" fontSize="9" fontWeight="700" fill="#1C1C1E" textAnchor="middle">Khadi</text>
      <text x="229" y="156" fontSize="7" fill="#8E8E93" textAnchor="middle">Swadeshi symbol</text>
      <rect x="10" y="172" width="260" height="22" rx="6" fill="#F2F2F7"/>
      <text x="140" y="186" fontSize="8" fill="#8E8E93" textAnchor="middle">Shared symbols created a sense of collective national identity</text>
    </svg>
  );
}

function PremodernWorld() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#34C759" fillOpacity="0.12" stroke="#34C759" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#34C759" textAnchor="middle">Pre-modern Globalisation — Silk Routes</text>
      <ellipse cx="50" cy="108" rx="36" ry="22" fill="#FF9500" fillOpacity="0.2" stroke="#FF9500" strokeWidth="1.5"/>
      <text x="50" y="105" fontSize="9" fontWeight="700" fill="#FF9500" textAnchor="middle">CHINA</text>
      <text x="50" y="118" fontSize="7" fill="#8E8E93" textAnchor="middle">Silk origin</text>
      <ellipse cx="140" cy="90" rx="30" ry="18" fill="#007AFF" fillOpacity="0.15" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="140" y="87" fontSize="9" fontWeight="700" fill="#007AFF" textAnchor="middle">Central Asia</text>
      <text x="140" y="100" fontSize="7" fill="#8E8E93" textAnchor="middle">Trade hub</text>
      <ellipse cx="230" cy="108" rx="36" ry="22" fill="#FF3B30" fillOpacity="0.15" stroke="#FF3B30" strokeWidth="1.5"/>
      <text x="230" y="105" fontSize="9" fontWeight="700" fill="#FF3B30" textAnchor="middle">EUROPE</text>
      <text x="230" y="118" fontSize="7" fill="#8E8E93" textAnchor="middle">Market end</text>
      <path d="M 86,104 Q 110,80 112,88" fill="none" stroke="#34C759" strokeWidth="2"/>
      <path d="M 170,92 Q 194,88 196,104" fill="none" stroke="#34C759" strokeWidth="2"/>
      <text x="140" y="148" fontSize="9" fontWeight="700" fill="#1C1C1E" textAnchor="middle">Traded: silk, spices, ideas, diseases</text>
      <rect x="10" y="160" width="260" height="34" rx="6" fill="#F2F2F7"/>
      <text x="140" y="175" fontSize="8" fill="#8E8E93" textAnchor="middle">Columbus 1492 → Americas: potato, tomato, chilli to Europe</text>
      <text x="140" y="188" fontSize="8" fill="#FF3B30" textAnchor="middle">Trade routes also spread Black Death (plague) across continents</text>
    </svg>
  );
}

function InterwarEconomy() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#007AFF" fillOpacity="0.12" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#007AFF" textAnchor="middle">Great Depression 1929 → Global Crisis</text>
      <line x1="24" y1="88" x2="256" y2="88" stroke="#C7C7CC" strokeWidth="2"/>
      <circle cx="50" cy="88" r="7" fill="#FF3B30"/>
      <text x="50" y="76" fontSize="8" fontWeight="700" fill="#1C1C1E" textAnchor="middle">1929</text>
      <text x="50" y="104" fontSize="7" fill="#8E8E93" textAnchor="middle">Wall Street</text>
      <text x="50" y="114" fontSize="7" fill="#8E8E93" textAnchor="middle">Crash</text>
      <circle cx="120" cy="88" r="7" fill="#FF9500"/>
      <text x="120" y="76" fontSize="8" fontWeight="700" fill="#1C1C1E" textAnchor="middle">1930s</text>
      <text x="120" y="104" fontSize="7" fill="#8E8E93" textAnchor="middle">25% US</text>
      <text x="120" y="114" fontSize="7" fill="#8E8E93" textAnchor="middle">unemployed</text>
      <circle cx="190" cy="88" r="7" fill="#FF9500"/>
      <text x="190" y="76" fontSize="8" fontWeight="700" fill="#1C1C1E" textAnchor="middle">1933</text>
      <text x="190" y="104" fontSize="7" fill="#8E8E93" textAnchor="middle">Roosevelt</text>
      <text x="190" y="114" fontSize="7" fill="#8E8E93" textAnchor="middle">New Deal</text>
      <circle cx="248" cy="88" r="7" fill="#34C759"/>
      <text x="248" y="76" fontSize="8" fontWeight="700" fill="#1C1C1E" textAnchor="middle">1944</text>
      <text x="248" y="104" fontSize="7" fill="#8E8E93" textAnchor="middle">Bretton</text>
      <text x="248" y="114" fontSize="7" fill="#8E8E93" textAnchor="middle">Woods</text>
      <rect x="10" y="130" width="124" height="62" rx="8" fill="#007AFF" fillOpacity="0.08" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="72" y="150" fontSize="10" fontWeight="700" fill="#007AFF" textAnchor="middle">IMF</text>
      <text x="72" y="165" fontSize="8" fill="#8E8E93" textAnchor="middle">Balance of</text>
      <text x="72" y="177" fontSize="8" fill="#8E8E93" textAnchor="middle">payments support</text>
      <rect x="146" y="130" width="124" height="62" rx="8" fill="#34C759" fillOpacity="0.08" stroke="#34C759" strokeWidth="1.5"/>
      <text x="208" y="150" fontSize="10" fontWeight="700" fill="#34C759" textAnchor="middle">World Bank</text>
      <text x="208" y="165" fontSize="8" fill="#8E8E93" textAnchor="middle">Long-term</text>
      <text x="208" y="177" fontSize="8" fill="#8E8E93" textAnchor="middle">development loans</text>
    </svg>
  );
}

function PostWar() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#34C759" fillOpacity="0.12" stroke="#34C759" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#34C759" textAnchor="middle">Post-War Economic Order — IMF, World Bank</text>
      <rect x="94" y="38" width="92" height="32" rx="6" fill="#FF9500" fillOpacity="0.15" stroke="#FF9500" strokeWidth="1.5"/>
      <text x="140" y="52" fontSize="9" fontWeight="700" fill="#FF9500" textAnchor="middle">Bretton Woods 1944</text>
      <text x="140" y="64" fontSize="8" fill="#8E8E93" textAnchor="middle">Dollar ↔ Gold (fixed rates)</text>
      <line x1="108" y1="70" x2="72" y2="96" stroke="#C7C7CC" strokeWidth="1.5"/>
      <line x1="172" y1="70" x2="208" y2="96" stroke="#C7C7CC" strokeWidth="1.5"/>
      <rect x="14" y="96" width="116" height="48" rx="8" fill="#007AFF" fillOpacity="0.1" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="72" y="115" fontSize="10" fontWeight="700" fill="#007AFF" textAnchor="middle">IMF</text>
      <text x="72" y="130" fontSize="8" fill="#8E8E93" textAnchor="middle">Stabilise exchange</text>
      <text x="72" y="142" fontSize="8" fill="#8E8E93" textAnchor="middle">rates · short-term</text>
      <rect x="150" y="96" width="116" height="48" rx="8" fill="#34C759" fillOpacity="0.1" stroke="#34C759" strokeWidth="1.5"/>
      <text x="208" y="115" fontSize="10" fontWeight="700" fill="#34C759" textAnchor="middle">World Bank</text>
      <text x="208" y="130" fontSize="8" fill="#8E8E93" textAnchor="middle">Post-war reconstruction</text>
      <text x="208" y="142" fontSize="8" fill="#8E8E93" textAnchor="middle">long-term loans</text>
      <rect x="10" y="154" width="260" height="38" rx="8" fill="#F2F2F7"/>
      <text x="140" y="170" fontSize="9" fontWeight="700" fill="#1C1C1E" textAnchor="middle">Golden Age of Capitalism: 1950–1970</text>
      <text x="140" y="184" fontSize="8" fill="#8E8E93" textAnchor="middle">Oil crisis 1970s → floating exchange rates → MNCs rise</text>
    </svg>
  );
}

function ProtoIndustrialisation() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#007AFF" fillOpacity="0.12" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#007AFF" textAnchor="middle">Proto-Industrialisation — Putting-out System</text>
      <rect x="94" y="36" width="92" height="32" rx="6" fill="#FF9500" fillOpacity="0.15" stroke="#FF9500" strokeWidth="1.5"/>
      <text x="140" y="50" fontSize="10" fontWeight="700" fill="#FF9500" textAnchor="middle">MERCHANT</text>
      <text x="140" y="63" fontSize="8" fill="#8E8E93" textAnchor="middle">Provides raw material</text>
      <line x1="110" y1="68" x2="72" y2="92" stroke="#C7C7CC" strokeWidth="1.5"/>
      <line x1="170" y1="68" x2="208" y2="92" stroke="#C7C7CC" strokeWidth="1.5"/>
      <rect x="14" y="92" width="116" height="52" rx="8" fill="#34C759" fillOpacity="0.1" stroke="#34C759" strokeWidth="1.5"/>
      <text x="72" y="111" fontSize="9" fontWeight="700" fill="#34C759" textAnchor="middle">Rural Family A</text>
      <text x="72" y="125" fontSize="8" fill="#8E8E93" textAnchor="middle">Weaves cloth at home</text>
      <text x="72" y="138" fontSize="8" fill="#8E8E93" textAnchor="middle">Returns finished cloth</text>
      <rect x="150" y="92" width="116" height="52" rx="8" fill="#34C759" fillOpacity="0.1" stroke="#34C759" strokeWidth="1.5"/>
      <text x="208" y="111" fontSize="9" fontWeight="700" fill="#34C759" textAnchor="middle">Rural Family B</text>
      <text x="208" y="125" fontSize="8" fill="#8E8E93" textAnchor="middle">Spins yarn at home</text>
      <text x="208" y="138" fontSize="8" fill="#8E8E93" textAnchor="middle">Returns spun yarn</text>
      <rect x="10" y="154" width="260" height="38" rx="8" fill="#F2F2F7"/>
      <text x="140" y="169" fontSize="9" fontWeight="700" fill="#1C1C1E" textAnchor="middle">Before factories — rural cottage industries fed merchants</text>
      <text x="140" y="184" fontSize="8" fill="#8E8E93" textAnchor="middle">Flexible labour · No capital · Seasonal · Survived alongside factories</text>
    </svg>
  );
}

function FactorySystem() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#007AFF" fillOpacity="0.12" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#007AFF" textAnchor="middle">Factory System — Steam, Discipline, Mass Output</text>
      <rect x="14" y="38" width="252" height="72" rx="8" fill="#F2F2F7" stroke="#C7C7CC" strokeWidth="1.5"/>
      <text x="60" y="80" fontSize="36" textAnchor="middle">🏭</text>
      <line x1="100" y1="74" x2="150" y2="74" stroke="#007AFF" strokeWidth="2" strokeDasharray="4,2"/>
      <text x="125" y="68" fontSize="8" fill="#007AFF" textAnchor="middle">Steam power</text>
      <rect x="158" y="50" width="98" height="50" rx="6" fill="#FF9500" fillOpacity="0.15" stroke="#FF9500" strokeWidth="1"/>
      <text x="207" y="68" fontSize="9" fontWeight="700" fill="#FF9500" textAnchor="middle">Mass output</text>
      <text x="207" y="82" fontSize="8" fill="#8E8E93" textAnchor="middle">Fixed hours</text>
      <text x="207" y="95" fontSize="8" fill="#8E8E93" textAnchor="middle">Strict discipline</text>
      <rect x="10" y="120" width="260" height="72" rx="8" fill="#F2F2F7"/>
      <text x="140" y="138" fontSize="10" fontWeight="700" fill="#1C1C1E" textAnchor="middle">Victorian Britain — Cheap Labour Paradox</text>
      <text x="140" y="154" fontSize="9" fill="#8E8E93" textAnchor="middle">Abundant cheap labour → no rush to mechanise</text>
      <text x="140" y="168" fontSize="9" fill="#8E8E93" textAnchor="middle">Seasonal industries preferred casual labour over machines</text>
      <text x="140" y="184" fontSize="8" fill="#FF3B30" textAnchor="middle">Skilled craftsmen valued — machine goods seen as inferior quality</text>
    </svg>
  );
}

function IndiaIndustrialisation() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#FF9500" fillOpacity="0.15" stroke="#FF9500" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#FF9500" textAnchor="middle">Industrialisation in Colonial India</text>
      <line x1="24" y1="84" x2="256" y2="84" stroke="#C7C7CC" strokeWidth="2"/>
      <circle cx="44" cy="84" r="6" fill="#FF3B30"/>
      <text x="44" y="73" fontSize="8" fontWeight="700" fill="#1C1C1E" textAnchor="middle">1850s</text>
      <text x="44" y="98" fontSize="7" fill="#8E8E93" textAnchor="middle">Manchester</text>
      <text x="44" y="108" fontSize="7" fill="#8E8E93" textAnchor="middle">floods India</text>
      <circle cx="110" cy="84" r="6" fill="#007AFF"/>
      <text x="110" y="73" fontSize="8" fontWeight="700" fill="#1C1C1E" textAnchor="middle">1854</text>
      <text x="110" y="98" fontSize="7" fill="#8E8E93" textAnchor="middle">Bombay</text>
      <text x="110" y="108" fontSize="7" fill="#8E8E93" textAnchor="middle">cotton mill</text>
      <circle cx="176" cy="84" r="6" fill="#FF9500"/>
      <text x="176" y="73" fontSize="8" fontWeight="700" fill="#1C1C1E" textAnchor="middle">1905</text>
      <text x="176" y="98" fontSize="7" fill="#8E8E93" textAnchor="middle">Swadeshi</text>
      <text x="176" y="108" fontSize="7" fill="#8E8E93" textAnchor="middle">movement</text>
      <circle cx="242" cy="84" r="6" fill="#34C759"/>
      <text x="242" y="73" fontSize="8" fontWeight="700" fill="#1C1C1E" textAnchor="middle">1914</text>
      <text x="242" y="98" fontSize="7" fill="#8E8E93" textAnchor="middle">WW1 boosts</text>
      <text x="242" y="108" fontSize="7" fill="#8E8E93" textAnchor="middle">Indian mills</text>
      <rect x="10" y="124" width="260" height="68" rx="8" fill="#F2F2F7"/>
      <text x="140" y="142" fontSize="10" fontWeight="700" fill="#1C1C1E" textAnchor="middle">Key Features of Indian Industry</text>
      <text x="140" y="158" fontSize="9" fill="#8E8E93" textAnchor="middle">Gomasthas (EIC agents) harassed handloom weavers</text>
      <text x="140" y="172" fontSize="9" fill="#8E8E93" textAnchor="middle">Fly shuttle loom helped handloom survive Manchester</text>
      <text x="140" y="186" fontSize="8" fill="#007AFF" textAnchor="middle">Jobbers: recruiter + disciplinarian for mill workers</text>
    </svg>
  );
}

function PrintRevolution() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#FF9500" fillOpacity="0.15" stroke="#FF9500" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#FF9500" textAnchor="middle">Gutenberg Press → Print Revolution</text>
      <line x1="24" y1="84" x2="256" y2="84" stroke="#C7C7CC" strokeWidth="2"/>
      <circle cx="44" cy="84" r="6" fill="#8E8E93"/>
      <text x="44" y="73" fontSize="8" fontWeight="700" fill="#1C1C1E" textAnchor="middle">594 CE</text>
      <text x="44" y="98" fontSize="7" fill="#8E8E93" textAnchor="middle">China:</text>
      <text x="44" y="108" fontSize="7" fill="#8E8E93" textAnchor="middle">woodblock</text>
      <circle cx="114" cy="84" r="6" fill="#FF9500"/>
      <text x="114" y="73" fontSize="8" fontWeight="700" fill="#1C1C1E" textAnchor="middle">1448</text>
      <text x="114" y="98" fontSize="7" fill="#8E8E93" textAnchor="middle">Gutenberg</text>
      <text x="114" y="108" fontSize="7" fill="#8E8E93" textAnchor="middle">movable type</text>
      <circle cx="184" cy="84" r="6" fill="#FF3B30"/>
      <text x="184" y="73" fontSize="8" fontWeight="700" fill="#1C1C1E" textAnchor="middle">1517</text>
      <text x="184" y="98" fontSize="7" fill="#8E8E93" textAnchor="middle">Luther:</text>
      <text x="184" y="108" fontSize="7" fill="#8E8E93" textAnchor="middle">Reformation</text>
      <circle cx="246" cy="84" r="6" fill="#007AFF"/>
      <text x="246" y="73" fontSize="8" fontWeight="700" fill="#1C1C1E" textAnchor="middle">1700s</text>
      <text x="246" y="98" fontSize="7" fill="#8E8E93" textAnchor="middle">Enlighten-</text>
      <text x="246" y="108" fontSize="7" fill="#8E8E93" textAnchor="middle">ment</text>
      <rect x="10" y="124" width="260" height="68" rx="8" fill="#F2F2F7"/>
      <text x="140" y="142" fontSize="10" fontWeight="700" fill="#1C1C1E" textAnchor="middle">Print democratised knowledge</text>
      <text x="140" y="158" fontSize="9" fill="#8E8E93" textAnchor="middle">Chapbooks (cheap pamphlets) reached the poor</text>
      <text x="140" y="172" fontSize="9" fill="#8E8E93" textAnchor="middle">Catholic Church: Index of Prohibited Books — censorship</text>
      <text x="140" y="186" fontSize="8" fill="#FF3B30" textAnchor="middle">Erasmus + Luther used print to spread ideas across Europe</text>
    </svg>
  );
}

function IndiaPrint() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#FF9500" fillOpacity="0.15" stroke="#FF9500" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#FF9500" textAnchor="middle">Print Culture in Colonial India</text>
      <line x1="24" y1="84" x2="256" y2="84" stroke="#C7C7CC" strokeWidth="2"/>
      <circle cx="44" cy="84" r="6" fill="#8E8E93"/>
      <text x="44" y="73" fontSize="8" fontWeight="700" fill="#1C1C1E" textAnchor="middle">1556</text>
      <text x="44" y="98" fontSize="7" fill="#8E8E93" textAnchor="middle">Goa: first</text>
      <text x="44" y="108" fontSize="7" fill="#8E8E93" textAnchor="middle">press India</text>
      <circle cx="114" cy="84" r="6" fill="#007AFF"/>
      <text x="114" y="73" fontSize="8" fontWeight="700" fill="#1C1C1E" textAnchor="middle">1780</text>
      <text x="114" y="98" fontSize="7" fill="#8E8E93" textAnchor="middle">Bengal</text>
      <text x="114" y="108" fontSize="7" fill="#8E8E93" textAnchor="middle">Gazette</text>
      <circle cx="184" cy="84" r="6" fill="#FF3B30"/>
      <text x="184" y="73" fontSize="8" fontWeight="700" fill="#1C1C1E" textAnchor="middle">1878</text>
      <text x="184" y="98" fontSize="7" fill="#8E8E93" textAnchor="middle">Vernacular</text>
      <text x="184" y="108" fontSize="7" fill="#8E8E93" textAnchor="middle">Press Act</text>
      <circle cx="246" cy="84" r="6" fill="#34C759"/>
      <text x="246" y="73" fontSize="8" fontWeight="700" fill="#1C1C1E" textAnchor="middle">1905</text>
      <text x="246" y="98" fontSize="7" fill="#8E8E93" textAnchor="middle">Nationalist</text>
      <text x="246" y="108" fontSize="7" fill="#8E8E93" textAnchor="middle">press boom</text>
      <rect x="10" y="124" width="260" height="68" rx="8" fill="#F2F2F7"/>
      <text x="140" y="142" fontSize="10" fontWeight="700" fill="#1C1C1E" textAnchor="middle">Key Figures in Indian Print</text>
      <text x="140" y="158" fontSize="9" fill="#8E8E93" textAnchor="middle">Rashsundari Devi: Amar Jiban (1876) — first Bengali autobiography</text>
      <text x="140" y="172" fontSize="9" fill="#8E8E93" textAnchor="middle">Tilak (Kesari/Marathi) · Phule (anti-caste) · Ambedkar (Mooknayak)</text>
      <text x="140" y="186" fontSize="8" fill="#007AFF" textAnchor="middle">Ram Mohan Roy: Sambad Kaumudi — challenged orthodoxy</text>
    </svg>
  );
}

// ─── SST Geography Ch 6–12 ────────────────────────────────────────────────────

function TypesResources() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#34C759" fillOpacity="0.12" stroke="#34C759" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#34C759" textAnchor="middle">Classification of Resources</text>
      <rect x="94" y="36" width="92" height="28" rx="6" fill="#34C759" fillOpacity="0.2" stroke="#34C759" strokeWidth="1.5"/>
      <text x="140" y="54" fontSize="10" fontWeight="700" fill="#34C759" textAnchor="middle">RESOURCES</text>
      <line x1="118" y1="64" x2="58" y2="88" stroke="#C7C7CC" strokeWidth="1.5"/>
      <line x1="140" y1="64" x2="140" y2="88" stroke="#C7C7CC" strokeWidth="1.5"/>
      <line x1="162" y1="64" x2="222" y2="88" stroke="#C7C7CC" strokeWidth="1.5"/>
      <rect x="14" y="88" width="88" height="50" rx="6" fill="#FF9500" fillOpacity="0.1" stroke="#FF9500" strokeWidth="1.5"/>
      <text x="58" y="107" fontSize="9" fontWeight="700" fill="#FF9500" textAnchor="middle">By Origin</text>
      <text x="58" y="120" fontSize="8" fill="#8E8E93" textAnchor="middle">Biotic (plants)</text>
      <text x="58" y="132" fontSize="8" fill="#8E8E93" textAnchor="middle">Abiotic (rock)</text>
      <rect x="96" y="88" width="88" height="50" rx="6" fill="#007AFF" fillOpacity="0.1" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="140" y="107" fontSize="9" fontWeight="700" fill="#007AFF" textAnchor="middle">Exhaustibility</text>
      <text x="140" y="120" fontSize="8" fill="#8E8E93" textAnchor="middle">Renewable (solar)</text>
      <text x="140" y="132" fontSize="8" fill="#8E8E93" textAnchor="middle">Non-ren. (coal)</text>
      <rect x="178" y="88" width="88" height="50" rx="6" fill="#FF3B30" fillOpacity="0.1" stroke="#FF3B30" strokeWidth="1.5"/>
      <text x="222" y="107" fontSize="9" fontWeight="700" fill="#FF3B30" textAnchor="middle">Ownership</text>
      <text x="222" y="120" fontSize="8" fill="#8E8E93" textAnchor="middle">Individual</text>
      <text x="222" y="132" fontSize="8" fill="#8E8E93" textAnchor="middle">Community / Nat.</text>
      <rect x="10" y="148" width="260" height="44" rx="8" fill="#F2F2F7"/>
      <text x="140" y="164" fontSize="9" fontWeight="700" fill="#1C1C1E" textAnchor="middle">Development Status</text>
      <text x="140" y="178" fontSize="8" fill="#8E8E93" textAnchor="middle">Potential (not used) · Actual (in use) · Stock · Reserve</text>
    </svg>
  );
}

function LandResources() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#34C759" fillOpacity="0.12" stroke="#34C759" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#34C759" textAnchor="middle">India's Land Use Pattern</text>
      <rect x="10" y="38" width="156" height="24" rx="4" fill="#34C759" fillOpacity="0.7"/>
      <text x="88" y="54" fontSize="9" fontWeight="700" fill="#fff" textAnchor="middle">Net Sown Area — 54%</text>
      <rect x="10" y="68" width="62" height="20" rx="4" fill="#007AFF" fillOpacity="0.7"/>
      <text x="41" y="82" fontSize="8" fontWeight="700" fill="#fff" textAnchor="middle">Forest 21%</text>
      <rect x="78" y="68" width="40" height="20" rx="4" fill="#FF9500" fillOpacity="0.7"/>
      <text x="98" y="82" fontSize="8" fontWeight="700" fill="#fff" textAnchor="middle">Fallow</text>
      <rect x="124" y="68" width="42" height="20" rx="4" fill="#FF3B30" fillOpacity="0.6"/>
      <text x="145" y="82" fontSize="8" fontWeight="700" fill="#fff" textAnchor="middle">Barren 4%</text>
      <rect x="10" y="96" width="260" height="88" rx="8" fill="#F2F2F7"/>
      <text x="140" y="114" fontSize="10" fontWeight="700" fill="#1C1C1E" textAnchor="middle">Land Degradation — Causes</text>
      <circle cx="26" cy="130" r="4" fill="#FF3B30"/>
      <text x="40" y="134" fontSize="9" fill="#1C1C1E">Waterlogging (over-irrigation)</text>
      <circle cx="26" cy="148" r="4" fill="#FF3B30"/>
      <text x="40" y="152" fontSize="9" fill="#1C1C1E">Soil erosion (deforestation)</text>
      <circle cx="26" cy="166" r="4" fill="#34C759"/>
      <text x="40" y="170" fontSize="9" fill="#34C759">Remedy: shelter belts, contour ploughing</text>
      <text x="140" y="182" fontSize="8" fill="#8E8E93" textAnchor="middle">Sustainable development: Rio 1992 — Agenda 21</text>
    </svg>
  );
}

function SoilTypes() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#34C759" fillOpacity="0.12" stroke="#34C759" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#34C759" textAnchor="middle">Major Soil Types of India</text>
      <rect x="10" y="36" width="124" height="56" rx="6" fill="#C4A882" fillOpacity="0.3" stroke="#C4A882" strokeWidth="1.5"/>
      <text x="72" y="55" fontSize="9" fontWeight="700" fill="#8B6914" textAnchor="middle">Alluvial</text>
      <text x="72" y="68" fontSize="8" fill="#555" textAnchor="middle">North plains · Khadar/Bhangar</text>
      <text x="72" y="80" fontSize="8" fill="#555" textAnchor="middle">Rice, Wheat, Sugarcane</text>
      <rect x="146" y="36" width="124" height="56" rx="6" fill="#2C1810" fillOpacity="0.2" stroke="#5C3D2E" strokeWidth="1.5"/>
      <text x="208" y="55" fontSize="9" fontWeight="700" fill="#2C1810" textAnchor="middle">Black (Regur)</text>
      <text x="208" y="68" fontSize="8" fill="#555" textAnchor="middle">Deccan plateau · Maharashtra</text>
      <text x="208" y="80" fontSize="8" fill="#555" textAnchor="middle">Best for Cotton · self-ploughing</text>
      <rect x="10" y="100" width="82" height="56" rx="6" fill="#D4654A" fillOpacity="0.25" stroke="#D4654A" strokeWidth="1.5"/>
      <text x="51" y="119" fontSize="9" fontWeight="700" fill="#D4654A" textAnchor="middle">Red &amp; Yellow</text>
      <text x="51" y="132" fontSize="7" fill="#555" textAnchor="middle">Low rainfall</text>
      <text x="51" y="143" fontSize="7" fill="#555" textAnchor="middle">Iron content</text>
      <rect x="99" y="100" width="82" height="56" rx="6" fill="#8B4513" fillOpacity="0.2" stroke="#8B4513" strokeWidth="1.5"/>
      <text x="140" y="119" fontSize="9" fontWeight="700" fill="#8B4513" textAnchor="middle">Laterite</text>
      <text x="140" y="132" fontSize="7" fill="#555" textAnchor="middle">High-rainfall hills</text>
      <text x="140" y="143" fontSize="7" fill="#555" textAnchor="middle">Kerala · Tea</text>
      <rect x="188" y="100" width="82" height="56" rx="6" fill="#D2B48C" fillOpacity="0.3" stroke="#D2B48C" strokeWidth="1.5"/>
      <text x="229" y="119" fontSize="9" fontWeight="700" fill="#8B6914" textAnchor="middle">Arid</text>
      <text x="229" y="132" fontSize="7" fill="#555" textAnchor="middle">Rajasthan</text>
      <text x="229" y="143" fontSize="7" fill="#555" textAnchor="middle">Sandy · low humus</text>
      <rect x="10" y="164" width="260" height="28" rx="6" fill="#F2F2F7"/>
      <text x="140" y="182" fontSize="8" fill="#8E8E93" textAnchor="middle">Forest soil: mountain slopes, humus-rich · Bhangar = old alluvial; Khadar = new</text>
    </svg>
  );
}

function ForestTypes() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#34C759" fillOpacity="0.12" stroke="#34C759" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#34C759" textAnchor="middle">India's Forest Classification</text>
      <rect x="14" y="38" width="74" height="104" rx="8" fill="#34C759" fillOpacity="0.12" stroke="#34C759" strokeWidth="2"/>
      <text x="51" y="60" fontSize="10" fontWeight="700" fill="#34C759" textAnchor="middle">Reserved</text>
      <text x="51" y="76" fontSize="18" textAnchor="middle">🌲</text>
      <text x="51" y="96" fontSize="9" fontWeight="700" fill="#34C759" textAnchor="middle">67%</text>
      <text x="51" y="110" fontSize="8" fill="#8E8E93" textAnchor="middle">Most valuable</text>
      <text x="51" y="122" fontSize="8" fill="#8E8E93" textAnchor="middle">No local rights</text>
      <rect x="103" y="38" width="74" height="104" rx="8" fill="#007AFF" fillOpacity="0.1" stroke="#007AFF" strokeWidth="2"/>
      <text x="140" y="60" fontSize="10" fontWeight="700" fill="#007AFF" textAnchor="middle">Protected</text>
      <text x="140" y="76" fontSize="18" textAnchor="middle">🌳</text>
      <text x="140" y="96" fontSize="9" fontWeight="700" fill="#007AFF" textAnchor="middle">29%</text>
      <text x="140" y="110" fontSize="8" fill="#8E8E93" textAnchor="middle">Some local</text>
      <text x="140" y="122" fontSize="8" fill="#8E8E93" textAnchor="middle">rights allowed</text>
      <rect x="192" y="38" width="74" height="104" rx="8" fill="#FF9500" fillOpacity="0.1" stroke="#FF9500" strokeWidth="2"/>
      <text x="229" y="60" fontSize="10" fontWeight="700" fill="#FF9500" textAnchor="middle">Unclassed</text>
      <text x="229" y="76" fontSize="18" textAnchor="middle">🌿</text>
      <text x="229" y="96" fontSize="9" fontWeight="700" fill="#FF9500" textAnchor="middle">4%</text>
      <text x="229" y="110" fontSize="8" fill="#8E8E93" textAnchor="middle">Government or</text>
      <text x="229" y="122" fontSize="8" fill="#8E8E93" textAnchor="middle">private land</text>
      <rect x="10" y="152" width="260" height="40" rx="8" fill="#F2F2F7"/>
      <text x="140" y="168" fontSize="9" fontWeight="700" fill="#1C1C1E" textAnchor="middle">JFM — Joint Forest Management (Odisha 1988)</text>
      <text x="140" y="184" fontSize="8" fill="#8E8E93" textAnchor="middle">Villages manage forests with Forest Dept · 25% revenue share</text>
    </svg>
  );
}

function Biodiversity() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#34C759" fillOpacity="0.12" stroke="#34C759" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#34C759" textAnchor="middle">Biodiversity — India: 8% of World Species</text>
      <rect x="10" y="38" width="260" height="66" rx="8" fill="#F2F2F7"/>
      <text x="140" y="54" fontSize="9" fontWeight="700" fill="#1C1C1E" textAnchor="middle">Threatened Species Categories (IUCN)</text>
      <rect x="16" y="60" width="42" height="36" rx="4" fill="#8E8E93" fillOpacity="0.3" stroke="#8E8E93" strokeWidth="1"/>
      <text x="37" y="80" fontSize="8" fontWeight="700" fill="#8E8E93" textAnchor="middle">Extinct</text>
      <rect x="64" y="60" width="42" height="36" rx="4" fill="#FF3B30" fillOpacity="0.3" stroke="#FF3B30" strokeWidth="1"/>
      <text x="85" y="80" fontSize="8" fontWeight="700" fill="#FF3B30" textAnchor="middle">Endangered</text>
      <rect x="112" y="60" width="42" height="36" rx="4" fill="#FF9500" fillOpacity="0.3" stroke="#FF9500" strokeWidth="1"/>
      <text x="133" y="80" fontSize="8" fontWeight="700" fill="#FF9500" textAnchor="middle">Vulnerable</text>
      <rect x="160" y="60" width="42" height="36" rx="4" fill="#007AFF" fillOpacity="0.3" stroke="#007AFF" strokeWidth="1"/>
      <text x="181" y="80" fontSize="8" fontWeight="700" fill="#007AFF" textAnchor="middle">Rare</text>
      <rect x="208" y="60" width="54" height="36" rx="4" fill="#34C759" fillOpacity="0.3" stroke="#34C759" strokeWidth="1"/>
      <text x="235" y="80" fontSize="8" fontWeight="700" fill="#34C759" textAnchor="middle">Endemic</text>
      <rect x="10" y="112" width="260" height="80" rx="8" fill="#F2F2F7"/>
      <text x="140" y="128" fontSize="9" fontWeight="700" fill="#1C1C1E" textAnchor="middle">Causes of Biodiversity Loss</text>
      <circle cx="26" cy="144" r="4" fill="#FF3B30"/>
      <text x="40" y="148" fontSize="8" fill="#1C1C1E">Habitat loss and fragmentation</text>
      <circle cx="26" cy="160" r="4" fill="#FF3B30"/>
      <text x="40" y="164" fontSize="8" fill="#1C1C1E">Hunting, poaching, over-exploitation</text>
      <circle cx="26" cy="176" r="4" fill="#FF3B30"/>
      <text x="40" y="180" fontSize="8" fill="#1C1C1E">Pollution · Alien species invasion</text>
    </svg>
  );
}

function Conservation() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#34C759" fillOpacity="0.12" stroke="#34C759" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#34C759" textAnchor="middle">Conservation — Parks, JFM &amp; Community</text>
      <rect x="14" y="38" width="116" height="72" rx="8" fill="#34C759" fillOpacity="0.08" stroke="#34C759" strokeWidth="1.5"/>
      <text x="72" y="56" fontSize="9" fontWeight="700" fill="#34C759" textAnchor="middle">Protected Areas</text>
      <text x="72" y="70" fontSize="8" fill="#1C1C1E" textAnchor="middle">National Parks</text>
      <text x="72" y="82" fontSize="8" fill="#1C1C1E" textAnchor="middle">Wildlife Sanctuaries</text>
      <text x="72" y="94" fontSize="8" fill="#1C1C1E" textAnchor="middle">Biosphere Reserves</text>
      <text x="72" y="106" fontSize="8" fill="#8E8E93" textAnchor="middle">Project Tiger 1973</text>
      <rect x="150" y="38" width="116" height="72" rx="8" fill="#FF9500" fillOpacity="0.08" stroke="#FF9500" strokeWidth="1.5"/>
      <text x="208" y="56" fontSize="9" fontWeight="700" fill="#FF9500" textAnchor="middle">Community Action</text>
      <text x="208" y="70" fontSize="8" fill="#1C1C1E" textAnchor="middle">Chipko movement</text>
      <text x="208" y="82" fontSize="8" fill="#1C1C1E" textAnchor="middle">(Uttarakhand, trees)</text>
      <text x="208" y="94" fontSize="8" fill="#1C1C1E" textAnchor="middle">Bishnoi community</text>
      <text x="208" y="106" fontSize="8" fill="#8E8E93" textAnchor="middle">(Black Buck protection)</text>
      <rect x="10" y="120" width="260" height="72" rx="8" fill="#F2F2F7"/>
      <text x="140" y="138" fontSize="9" fontWeight="700" fill="#1C1C1E" textAnchor="middle">Key Conservation Stories</text>
      <circle cx="26" cy="154" r="4" fill="#34C759"/>
      <text x="40" y="158" fontSize="8" fill="#1C1C1E">Amrita Devi Bishnoi — gave life to protect Khejri trees</text>
      <circle cx="26" cy="170" r="4" fill="#34C759"/>
      <text x="40" y="174" fontSize="8" fill="#1C1C1E">Beej Bachao Andolan — traditional crop variety seeds saved</text>
      <circle cx="26" cy="184" r="4" fill="#34C759"/>
      <text x="40" y="188" fontSize="8" fill="#1C1C1E">Sariska — villages helped tigers return to the forest</text>
    </svg>
  );
}

function WaterScarcity() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#007AFF" fillOpacity="0.12" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#007AFF" textAnchor="middle">Water Availability — A Shrinking Resource</text>
      <rect x="30" y="38" width="220" height="28" rx="6" fill="#007AFF" fillOpacity="0.6"/>
      <text x="140" y="57" fontSize="10" fontWeight="700" fill="#fff" textAnchor="middle">Earth's Water — 100%</text>
      <rect x="30" y="72" width="8" height="24" rx="3" fill="#007AFF" fillOpacity="0.3"/>
      <rect x="52" y="72" width="7" height="24" rx="3" fill="#34C759" fillOpacity="0.7"/>
      <text x="140" y="88" fontSize="10" fontWeight="700" fill="#34C759" textAnchor="middle">Freshwater — only 2.7%</text>
      <rect x="30" y="102" width="4" height="20" rx="2" fill="#007AFF" fillOpacity="0.15"/>
      <rect x="52" y="102" width="2" height="20" rx="2" fill="#FF9500" fillOpacity="0.7"/>
      <text x="140" y="116" fontSize="9" fontWeight="700" fill="#FF9500" textAnchor="middle">70% of freshwater is frozen (glaciers)</text>
      <text x="140" y="134" fontSize="11" fontWeight="700" fill="#FF3B30" textAnchor="middle">Only ~1% usable by humans</text>
      <rect x="10" y="148" width="260" height="44" rx="8" fill="#F2F2F7"/>
      <text x="140" y="164" fontSize="9" fontWeight="700" fill="#1C1C1E" textAnchor="middle">Causes of Water Stress in India</text>
      <text x="140" y="178" fontSize="8" fill="#8E8E93" textAnchor="middle">Population growth · Industrialisation · Agriculture over-use</text>
      <text x="140" y="190" fontSize="8" fill="#FF3B30" textAnchor="middle">Groundwater depletion: Punjab, Rajasthan, UP most affected</text>
    </svg>
  );
}

function MultipurposeProjects() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#007AFF" fillOpacity="0.12" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#007AFF" textAnchor="middle">Multipurpose River Projects</text>
      <polygon points="140,40 80,120 200,120" fill="#8E8E93" fillOpacity="0.4" stroke="#8E8E93" strokeWidth="2"/>
      <rect x="80" y="120" width="120" height="12" rx="3" fill="#007AFF" fillOpacity="0.5"/>
      <text x="140" y="90" fontSize="9" fontWeight="700" fill="#1C1C1E" textAnchor="middle">DAM</text>
      <text x="140" y="136" fontSize="8" fill="#007AFF" textAnchor="middle">Reservoir</text>
      <text x="30" y="80" fontSize="8" fill="#34C759" textAnchor="middle">💧 Irrigation</text>
      <text x="30" y="95" fontSize="8" fill="#007AFF" textAnchor="middle">⚡ Electricity</text>
      <text x="245" y="80" fontSize="8" fill="#FF9500" textAnchor="middle">🚢 Navigation</text>
      <text x="245" y="95" fontSize="8" fill="#FF3B30" textAnchor="middle">🐟 Fisheries</text>
      <rect x="10" y="150" width="260" height="42" rx="8" fill="#FF3B30" fillOpacity="0.06" stroke="#FF3B30" strokeWidth="1.5"/>
      <text x="140" y="167" fontSize="9" fontWeight="700" fill="#FF3B30" textAnchor="middle">Controversies</text>
      <text x="140" y="181" fontSize="8" fill="#8E8E93" textAnchor="middle">Narmada Bachao Andolan (Medha Patkar) vs Sardar Sarovar</text>
    </svg>
  );
}

function RainwaterHarvesting() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#007AFF" fillOpacity="0.12" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#007AFF" textAnchor="middle">Rainwater Harvesting — Regional Traditions</text>
      <rect x="14" y="38" width="58" height="70" rx="6" fill="#F2F2F7" stroke="#E5E5EA" strokeWidth="1"/>
      <text x="43" y="56" fontSize="18" textAnchor="middle">🏺</text>
      <text x="43" y="74" fontSize="8" fontWeight="700" fill="#1C1C1E" textAnchor="middle">Johad</text>
      <text x="43" y="86" fontSize="7" fill="#8E8E93" textAnchor="middle">Rajasthan</text>
      <text x="43" y="97" fontSize="7" fill="#8E8E93" textAnchor="middle">check dams</text>
      <rect x="78" y="38" width="58" height="70" rx="6" fill="#F2F2F7" stroke="#E5E5EA" strokeWidth="1"/>
      <text x="107" y="56" fontSize="18" textAnchor="middle">🏠</text>
      <text x="107" y="74" fontSize="8" fontWeight="700" fill="#1C1C1E" textAnchor="middle">Tanka</text>
      <text x="107" y="86" fontSize="7" fill="#8E8E93" textAnchor="middle">Rajasthan</text>
      <text x="107" y="97" fontSize="7" fill="#8E8E93" textAnchor="middle">rooftop storage</text>
      <rect x="142" y="38" width="58" height="70" rx="6" fill="#F2F2F7" stroke="#E5E5EA" strokeWidth="1"/>
      <text x="171" y="56" fontSize="18" textAnchor="middle">🎋</text>
      <text x="171" y="74" fontSize="8" fontWeight="700" fill="#1C1C1E" textAnchor="middle">Bamboo drip</text>
      <text x="171" y="86" fontSize="7" fill="#8E8E93" textAnchor="middle">Meghalaya</text>
      <text x="171" y="97" fontSize="7" fill="#8E8E93" textAnchor="middle">200-yr tradition</text>
      <rect x="206" y="38" width="60" height="70" rx="6" fill="#F2F2F7" stroke="#E5E5EA" strokeWidth="1"/>
      <text x="236" y="56" fontSize="18" textAnchor="middle">🌧️</text>
      <text x="236" y="74" fontSize="8" fontWeight="700" fill="#1C1C1E" textAnchor="middle">Kuls</text>
      <text x="236" y="86" fontSize="7" fill="#8E8E93" textAnchor="middle">Himachal</text>
      <text x="236" y="97" fontSize="7" fill="#8E8E93" textAnchor="middle">glacier channels</text>
      <rect x="10" y="116" width="260" height="76" rx="8" fill="#F2F2F7"/>
      <text x="140" y="133" fontSize="9" fontWeight="700" fill="#1C1C1E" textAnchor="middle">Modern Rooftop Harvesting</text>
      <circle cx="26" cy="150" r="4" fill="#007AFF"/>
      <text x="40" y="154" fontSize="8" fill="#1C1C1E">Shillong, Meghalaya — nearly every household</text>
      <circle cx="26" cy="166" r="4" fill="#007AFF"/>
      <text x="40" y="170" fontSize="8" fill="#1C1C1E">Chennai — mandatory since 2003</text>
      <circle cx="26" cy="182" r="4" fill="#007AFF"/>
      <text x="40" y="186" fontSize="8" fill="#1C1C1E">Gul/Kul: diversion channels from glaciers</text>
    </svg>
  );
}

function TypesFarming() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#34C759" fillOpacity="0.12" stroke="#34C759" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#34C759" textAnchor="middle">Types of Farming in India</text>
      <rect x="14" y="38" width="74" height="120" rx="8" fill="#34C759" fillOpacity="0.08" stroke="#34C759" strokeWidth="1.5"/>
      <text x="51" y="56" fontSize="9" fontWeight="700" fill="#34C759" textAnchor="middle">Subsistence</text>
      <text x="51" y="70" fontSize="8" fill="#1C1C1E" textAnchor="middle">Primitive</text>
      <text x="51" y="82" fontSize="7" fill="#8E8E93" textAnchor="middle">Jhum / slash-</text>
      <text x="51" y="92" fontSize="7" fill="#8E8E93" textAnchor="middle">and-burn</text>
      <text x="51" y="108" fontSize="8" fill="#1C1C1E" textAnchor="middle">Intensive</text>
      <text x="51" y="120" fontSize="7" fill="#8E8E93" textAnchor="middle">Paddy, high</text>
      <text x="51" y="130" fontSize="7" fill="#8E8E93" textAnchor="middle">population areas</text>
      <rect x="103" y="38" width="74" height="120" rx="8" fill="#007AFF" fillOpacity="0.08" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="140" y="56" fontSize="9" fontWeight="700" fill="#007AFF" textAnchor="middle">Commercial</text>
      <text x="140" y="72" fontSize="7" fill="#8E8E93" textAnchor="middle">Large scale</text>
      <text x="140" y="84" fontSize="7" fill="#8E8E93" textAnchor="middle">single crop</text>
      <text x="140" y="98" fontSize="8" fill="#1C1C1E" textAnchor="middle">Wheat — Punjab</text>
      <text x="140" y="112" fontSize="8" fill="#1C1C1E" textAnchor="middle">Cotton — Haryana</text>
      <text x="140" y="126" fontSize="8" fill="#1C1C1E" textAnchor="middle">Sugar — UP</text>
      <rect x="192" y="38" width="74" height="120" rx="8" fill="#FF9500" fillOpacity="0.08" stroke="#FF9500" strokeWidth="1.5"/>
      <text x="229" y="56" fontSize="9" fontWeight="700" fill="#FF9500" textAnchor="middle">Plantation</text>
      <text x="229" y="72" fontSize="7" fill="#8E8E93" textAnchor="middle">British legacy</text>
      <text x="229" y="84" fontSize="7" fill="#8E8E93" textAnchor="middle">Export-oriented</text>
      <text x="229" y="98" fontSize="8" fill="#1C1C1E" textAnchor="middle">Tea — Assam</text>
      <text x="229" y="112" fontSize="8" fill="#1C1C1E" textAnchor="middle">Coffee — Karnataka</text>
      <text x="229" y="126" fontSize="8" fill="#1C1C1E" textAnchor="middle">Rubber — Kerala</text>
      <rect x="10" y="166" width="260" height="26" rx="6" fill="#F2F2F7"/>
      <text x="140" y="183" fontSize="8" fill="#8E8E93" textAnchor="middle">Kharif (Jun–Sep): paddy, cotton · Rabi (Oct–Mar): wheat, mustard</text>
    </svg>
  );
}

function MajorCrops() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#34C759" fillOpacity="0.12" stroke="#34C759" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#34C759" textAnchor="middle">Major Crops of India</text>
      <rect x="10" y="36" width="260" height="152" rx="8" fill="#F2F2F7"/>
      <rect x="16" y="42" width="248" height="18" rx="4" fill="#34C759" fillOpacity="0.3"/>
      <text x="64" y="55" fontSize="9" fontWeight="700" fill="#34C759">Crop</text>
      <text x="140" y="55" fontSize="9" fontWeight="700" fill="#34C759">Region</text>
      <text x="220" y="55" fontSize="9" fontWeight="700" fill="#34C759">Season</text>
      <text x="64" y="74" fontSize="8" fill="#1C1C1E">Rice</text>
      <text x="140" y="74" fontSize="8" fill="#8E8E93">WB · UP · Andhra</text>
      <text x="220" y="74" fontSize="8" fill="#8E8E93">Kharif</text>
      <text x="64" y="90" fontSize="8" fill="#1C1C1E">Wheat</text>
      <text x="140" y="90" fontSize="8" fill="#8E8E93">Punjab · Haryana · UP</text>
      <text x="220" y="90" fontSize="8" fill="#8E8E93">Rabi</text>
      <text x="64" y="106" fontSize="8" fill="#1C1C1E">Cotton</text>
      <text x="140" y="106" fontSize="8" fill="#8E8E93">Maharashtra · Gujarat</text>
      <text x="220" y="106" fontSize="8" fill="#8E8E93">Kharif</text>
      <text x="64" y="122" fontSize="8" fill="#1C1C1E">Jute</text>
      <text x="140" y="122" fontSize="8" fill="#8E8E93">West Bengal · Bihar</text>
      <text x="220" y="122" fontSize="8" fill="#8E8E93">Kharif</text>
      <text x="64" y="138" fontSize="8" fill="#1C1C1E">Tea</text>
      <text x="140" y="138" fontSize="8" fill="#8E8E93">Assam · WB · TN</text>
      <text x="220" y="138" fontSize="8" fill="#8E8E93">Year-round</text>
      <text x="64" y="154" fontSize="8" fill="#1C1C1E">Sugarcane</text>
      <text x="140" y="154" fontSize="8" fill="#8E8E93">UP · Maharashtra</text>
      <text x="220" y="154" fontSize="8" fill="#8E8E93">Year-round</text>
      <text x="64" y="170" fontSize="8" fill="#1C1C1E">Coffee</text>
      <text x="140" y="170" fontSize="8" fill="#8E8E93">Karnataka · Kerala</text>
      <text x="220" y="170" fontSize="8" fill="#8E8E93">Year-round</text>
      <text x="140" y="186" fontSize="7" fill="#FF9500" textAnchor="middle">Jute = "Golden Fibre" · Cotton needs Black soil · Tea needs hill slopes</text>
    </svg>
  );
}

function TechReforms() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#34C759" fillOpacity="0.12" stroke="#34C759" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#34C759" textAnchor="middle">Green Revolution &amp; Agricultural Reforms</text>
      <rect x="14" y="38" width="252" height="52" rx="8" fill="#34C759" fillOpacity="0.08" stroke="#34C759" strokeWidth="1.5"/>
      <text x="140" y="56" fontSize="10" fontWeight="700" fill="#34C759" textAnchor="middle">Green Revolution (1960s)</text>
      <text x="50" y="72" fontSize="8" fill="#1C1C1E" textAnchor="middle">HYV seeds</text>
      <text x="140" y="72" fontSize="8" fill="#1C1C1E" textAnchor="middle">Chemical fertilisers</text>
      <text x="228" y="72" fontSize="8" fill="#1C1C1E" textAnchor="middle">Irrigation</text>
      <text x="50" y="84" fontSize="7" fill="#8E8E93" textAnchor="middle">High Yield Variety</text>
      <text x="228" y="84" fontSize="7" fill="#8E8E93" textAnchor="middle">Punjab, Haryana</text>
      <rect x="14" y="98" width="116" height="62" rx="8" fill="#34C759" fillOpacity="0.08" stroke="#34C759" strokeWidth="1.2"/>
      <text x="72" y="115" fontSize="9" fontWeight="700" fill="#34C759" textAnchor="middle">Benefits</text>
      <text x="72" y="130" fontSize="8" fill="#1C1C1E" textAnchor="middle">Food self-sufficiency</text>
      <text x="72" y="144" fontSize="8" fill="#1C1C1E" textAnchor="middle">Export of food grains</text>
      <text x="72" y="158" fontSize="8" fill="#1C1C1E" textAnchor="middle">Higher farm income</text>
      <rect x="150" y="98" width="116" height="62" rx="8" fill="#FF3B30" fillOpacity="0.06" stroke="#FF3B30" strokeWidth="1.2"/>
      <text x="208" y="115" fontSize="9" fontWeight="700" fill="#FF3B30" textAnchor="middle">Drawbacks</text>
      <text x="208" y="130" fontSize="8" fill="#1C1C1E" textAnchor="middle">Groundwater depletion</text>
      <text x="208" y="144" fontSize="8" fill="#1C1C1E" textAnchor="middle">Soil degradation</text>
      <text x="208" y="158" fontSize="8" fill="#1C1C1E" textAnchor="middle">Regional inequality</text>
      <rect x="10" y="168" width="260" height="24" rx="6" fill="#F2F2F7"/>
      <text x="140" y="184" fontSize="8" fill="#8E8E93" textAnchor="middle">Land reforms: zamindari abolition · land ceiling · cooperatives · MSP</text>
    </svg>
  );
}

function Minerals() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#34C759" fillOpacity="0.12" stroke="#34C759" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#34C759" textAnchor="middle">Mineral Distribution in India</text>
      <rect x="10" y="36" width="260" height="148" rx="8" fill="#F2F2F7"/>
      <rect x="16" y="42" width="248" height="18" rx="4" fill="#8E8E93" fillOpacity="0.3"/>
      <text x="70" y="55" fontSize="9" fontWeight="700" fill="#1C1C1E">Mineral</text>
      <text x="160" y="55" fontSize="9" fontWeight="700" fill="#1C1C1E">States</text>
      <text x="16" y="74" fontSize="9" fontWeight="700" fill="#FF3B30">Iron Ore</text>
      <text x="90" y="74" fontSize="8" fill="#8E8E93">Jharkhand, Odisha, Chhattisgarh (Haematite)</text>
      <text x="16" y="92" fontSize="9" fontWeight="700" fill="#8E8E93">Coal</text>
      <text x="90" y="92" fontSize="8" fill="#8E8E93">Jharkhand, WB (Gondwana) · Assam (Tertiary)</text>
      <text x="16" y="110" fontSize="9" fontWeight="700" fill="#FF9500">Petroleum</text>
      <text x="90" y="110" fontSize="8" fill="#8E8E93">Mumbai High (62%) · Assam · Gujarat</text>
      <text x="16" y="128" fontSize="9" fontWeight="700" fill="#007AFF">Mica</text>
      <text x="90" y="128" fontSize="8" fill="#8E8E93">Jharkhand, Bihar, Rajasthan (electrical industry)</text>
      <text x="16" y="146" fontSize="9" fontWeight="700" fill="#34C759">Uranium</text>
      <text x="90" y="146" fontSize="8" fill="#8E8E93">Jharkhand — nuclear power</text>
      <text x="16" y="164" fontSize="9" fontWeight="700" fill="#34C759">Thorium</text>
      <text x="90" y="164" fontSize="8" fill="#8E8E93">Kerala monazite sands (beaches)</text>
      <text x="140" y="182" fontSize="7" fill="#FF3B30" textAnchor="middle">Iron ore triangle: Jharkhand–Odisha–Chhattisgarh</text>
    </svg>
  );
}

function EnergyResources() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#34C759" fillOpacity="0.12" stroke="#34C759" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#34C759" textAnchor="middle">Conventional vs Non-Conventional Energy</text>
      <rect x="14" y="38" width="120" height="140" rx="8" fill="#FF3B30" fillOpacity="0.07" stroke="#FF3B30" strokeWidth="1.5"/>
      <text x="74" y="56" fontSize="10" fontWeight="700" fill="#FF3B30" textAnchor="middle">Conventional</text>
      <text x="74" y="70" fontSize="8" fill="#1C1C1E" textAnchor="middle">Coal (54% electricity)</text>
      <text x="74" y="84" fontSize="8" fill="#1C1C1E" textAnchor="middle">Petroleum</text>
      <text x="74" y="98" fontSize="8" fill="#1C1C1E" textAnchor="middle">Natural gas</text>
      <text x="74" y="112" fontSize="8" fill="#1C1C1E" textAnchor="middle">Hydropower</text>
      <text x="74" y="126" fontSize="8" fill="#1C1C1E" textAnchor="middle">Nuclear (Tarapur,</text>
      <text x="74" y="138" fontSize="8" fill="#1C1C1E" textAnchor="middle">RAPP, Kaiga)</text>
      <text x="74" y="154" fontSize="7" fill="#FF3B30" textAnchor="middle">Non-renewable</text>
      <text x="74" y="166" fontSize="7" fill="#FF3B30" textAnchor="middle">Polluting</text>
      <rect x="146" y="38" width="120" height="140" rx="8" fill="#34C759" fillOpacity="0.07" stroke="#34C759" strokeWidth="1.5"/>
      <text x="206" y="56" fontSize="10" fontWeight="700" fill="#34C759" textAnchor="middle">Non-Conventional</text>
      <text x="206" y="70" fontSize="8" fill="#1C1C1E" textAnchor="middle">Solar (Rajasthan)</text>
      <text x="206" y="84" fontSize="8" fill="#1C1C1E" textAnchor="middle">Wind (TN, Gujarat)</text>
      <text x="206" y="98" fontSize="8" fill="#1C1C1E" textAnchor="middle">Biogas (rural gobar)</text>
      <text x="206" y="112" fontSize="8" fill="#1C1C1E" textAnchor="middle">Tidal (Kutch, Khambhat)</text>
      <text x="206" y="126" fontSize="8" fill="#1C1C1E" textAnchor="middle">Geothermal</text>
      <text x="206" y="154" fontSize="7" fill="#34C759" textAnchor="middle">Renewable</text>
      <text x="206" y="166" fontSize="7" fill="#34C759" textAnchor="middle">Cleaner energy</text>
    </svg>
  );
}

function IndustriesTypes() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#34C759" fillOpacity="0.12" stroke="#34C759" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#34C759" textAnchor="middle">Classification of Industries</text>
      <rect x="14" y="38" width="116" height="70" rx="8" fill="#FF9500" fillOpacity="0.08" stroke="#FF9500" strokeWidth="1.5"/>
      <text x="72" y="56" fontSize="9" fontWeight="700" fill="#FF9500" textAnchor="middle">By Raw Material</text>
      <text x="72" y="72" fontSize="8" fill="#1C1C1E" textAnchor="middle">Agro-based (cotton, jute)</text>
      <text x="72" y="86" fontSize="8" fill="#1C1C1E" textAnchor="middle">Mineral-based (iron, steel)</text>
      <text x="72" y="100" fontSize="8" fill="#1C1C1E" textAnchor="middle">Forest / Marine based</text>
      <rect x="150" y="38" width="116" height="70" rx="8" fill="#007AFF" fillOpacity="0.08" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="208" y="56" fontSize="9" fontWeight="700" fill="#007AFF" textAnchor="middle">By Size</text>
      <text x="208" y="72" fontSize="8" fill="#1C1C1E" textAnchor="middle">Large-scale</text>
      <text x="208" y="86" fontSize="8" fill="#1C1C1E" textAnchor="middle">Small-scale</text>
      <text x="208" y="100" fontSize="8" fill="#1C1C1E" textAnchor="middle">Cottage industry</text>
      <rect x="14" y="118" width="252" height="72" rx="8" fill="#F2F2F7"/>
      <text x="140" y="136" fontSize="9" fontWeight="700" fill="#1C1C1E" textAnchor="middle">Key Industries &amp; Locations</text>
      <circle cx="26" cy="152" r="4" fill="#FF9500"/>
      <text x="40" y="156" fontSize="8" fill="#1C1C1E">Cotton textile: Mumbai, Ahmedabad, Coimbatore</text>
      <circle cx="26" cy="168" r="4" fill="#007AFF"/>
      <text x="40" y="172" fontSize="8" fill="#1C1C1E">Iron &amp; Steel: Jamshedpur, Bhilai, Durgapur, Bokaro</text>
      <circle cx="26" cy="184" r="4" fill="#34C759"/>
      <text x="40" y="188" fontSize="8" fill="#1C1C1E">Jute textile: Hugli river belt, West Bengal</text>
    </svg>
  );
}

function TextileIndustry() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#34C759" fillOpacity="0.12" stroke="#34C759" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#34C759" textAnchor="middle">India's Textile Industry</text>
      <rect x="14" y="38" width="116" height="110" rx="8" fill="#007AFF" fillOpacity="0.08" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="72" y="58" fontSize="11" fontWeight="700" fill="#007AFF" textAnchor="middle">COTTON</text>
      <text x="72" y="74" fontSize="8" fill="#1C1C1E" textAnchor="middle">Mumbai</text>
      <text x="72" y="86" fontSize="7" fill="#8E8E93" textAnchor="middle">"Manchester of India"</text>
      <text x="72" y="100" fontSize="8" fill="#1C1C1E" textAnchor="middle">Ahmedabad</text>
      <text x="72" y="112" fontSize="8" fill="#1C1C1E" textAnchor="middle">Coimbatore</text>
      <text x="72" y="130" fontSize="7" fill="#8E8E93" textAnchor="middle">Humid climate · Port</text>
      <text x="72" y="142" fontSize="7" fill="#8E8E93" textAnchor="middle">Skilled labour</text>
      <rect x="150" y="38" width="116" height="110" rx="8" fill="#FF9500" fillOpacity="0.08" stroke="#FF9500" strokeWidth="1.5"/>
      <text x="208" y="58" fontSize="11" fontWeight="700" fill="#FF9500" textAnchor="middle">JUTE</text>
      <text x="208" y="74" fontSize="8" fill="#1C1C1E" textAnchor="middle">Hugli River belt</text>
      <text x="208" y="86" fontSize="7" fill="#8E8E93" textAnchor="middle">World's largest</text>
      <text x="208" y="98" fontSize="7" fill="#8E8E93" textAnchor="middle">jute industry</text>
      <text x="208" y="114" fontSize="8" fill="#1C1C1E" textAnchor="middle">Rishra to Tribeni</text>
      <text x="208" y="130" fontSize="7" fill="#8E8E93" textAnchor="middle">West Bengal</text>
      <text x="208" y="142" fontSize="7" fill="#FF3B30" textAnchor="middle">Declining — synthetic</text>
      <rect x="10" y="156" width="260" height="36" rx="8" fill="#F2F2F7"/>
      <text x="140" y="171" fontSize="9" fontWeight="700" fill="#1C1C1E" textAnchor="middle">Sugar Industry: UP + Maharashtra</text>
      <text x="140" y="185" fontSize="8" fill="#8E8E93" textAnchor="middle">Located near sugarcane fields · perishable raw material</text>
    </svg>
  );
}

function IndustriesEnvironment() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#FF3B30" fillOpacity="0.1" stroke="#FF3B30" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#FF3B30" textAnchor="middle">Industrial Pollution &amp; Control</text>
      <rect x="14" y="38" width="116" height="110" rx="8" fill="#FF3B30" fillOpacity="0.06" stroke="#FF3B30" strokeWidth="1.5"/>
      <text x="72" y="56" fontSize="9" fontWeight="700" fill="#FF3B30" textAnchor="middle">Pollution Types</text>
      <text x="72" y="72" fontSize="8" fill="#1C1C1E" textAnchor="middle">Air: SPM, NO₂, SO₂</text>
      <text x="72" y="86" fontSize="8" fill="#1C1C1E" textAnchor="middle">Water: effluents</text>
      <text x="72" y="100" fontSize="8" fill="#1C1C1E" textAnchor="middle">in rivers (Ganga)</text>
      <text x="72" y="114" fontSize="8" fill="#1C1C1E" textAnchor="middle">Land: industrial waste</text>
      <text x="72" y="128" fontSize="8" fill="#1C1C1E" textAnchor="middle">Noise: machinery</text>
      <rect x="150" y="38" width="116" height="110" rx="8" fill="#34C759" fillOpacity="0.06" stroke="#34C759" strokeWidth="1.5"/>
      <text x="208" y="56" fontSize="9" fontWeight="700" fill="#34C759" textAnchor="middle">Control Methods</text>
      <text x="208" y="72" fontSize="8" fill="#1C1C1E" textAnchor="middle">Scrubbers (air)</text>
      <text x="208" y="86" fontSize="8" fill="#1C1C1E" textAnchor="middle">Electrostatic</text>
      <text x="208" y="98" fontSize="8" fill="#1C1C1E" textAnchor="middle">precipitators</text>
      <text x="208" y="112" fontSize="8" fill="#1C1C1E" textAnchor="middle">ETP (water treatment)</text>
      <text x="208" y="126" fontSize="8" fill="#1C1C1E" textAnchor="middle">Noise barriers</text>
      <rect x="10" y="156" width="260" height="36" rx="8" fill="#F2F2F7"/>
      <text x="140" y="171" fontSize="9" fontWeight="700" fill="#1C1C1E" textAnchor="middle">India's Pollution Strategy</text>
      <text x="140" y="185" fontSize="8" fill="#8E8E93" textAnchor="middle">CPCB · ZLD (Zero Liquid Discharge) · Green belts around industries</text>
    </svg>
  );
}

function Transport() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#34C759" fillOpacity="0.12" stroke="#34C759" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#34C759" textAnchor="middle">Transport Networks of India</text>
      <rect x="14" y="38" width="252" height="26" rx="6" fill="#007AFF" fillOpacity="0.1" stroke="#007AFF" strokeWidth="1.2"/>
      <text x="44" y="55" fontSize="9" fontWeight="700" fill="#007AFF">Roads:</text>
      <text x="90" y="55" fontSize="8" fill="#1C1C1E">Golden Quadrilateral — Delhi–Mumbai–Chennai–Kolkata (6-lane NH)</text>
      <rect x="14" y="70" width="252" height="26" rx="6" fill="#FF9500" fillOpacity="0.1" stroke="#FF9500" strokeWidth="1.2"/>
      <text x="44" y="87" fontSize="9" fontWeight="700" fill="#FF9500">Railways:</text>
      <text x="100" y="87" fontSize="8" fill="#1C1C1E">67,956 km network · 7 divisional HQs · largest employer</text>
      <rect x="14" y="102" width="252" height="26" rx="6" fill="#34C759" fillOpacity="0.1" stroke="#34C759" strokeWidth="1.2"/>
      <text x="44" y="119" fontSize="9" fontWeight="700" fill="#34C759">Waterways:</text>
      <text x="108" y="119" fontSize="8" fill="#1C1C1E">NW-1 (Ganga) · NW-2 (Brahmaputra) · NW-3 (Kerala)</text>
      <rect x="14" y="134" width="252" height="26" rx="6" fill="#FF3B30" fillOpacity="0.08" stroke="#FF3B30" strokeWidth="1.2"/>
      <text x="44" y="151" fontSize="9" fontWeight="700" fill="#FF3B30">Pipelines:</text>
      <text x="104" y="151" fontSize="8" fill="#1C1C1E">HVJ (gas) · Salaya–Mathura (crude oil)</text>
      <rect x="10" y="168" width="260" height="24" rx="6" fill="#F2F2F7"/>
      <text x="140" y="184" fontSize="8" fill="#8E8E93" textAnchor="middle">NW-1: Prayagraj to Haldia (1620 km) — longest national waterway</text>
    </svg>
  );
}

function Communication() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#34C759" fillOpacity="0.12" stroke="#34C759" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#34C759" textAnchor="middle">Communication in India</text>
      <rect x="14" y="38" width="116" height="108" rx="8" fill="#007AFF" fillOpacity="0.08" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="72" y="56" fontSize="9" fontWeight="700" fill="#007AFF" textAnchor="middle">Personal</text>
      <text x="72" y="72" fontSize="8" fill="#1C1C1E" textAnchor="middle">📮 Postal services</text>
      <text x="72" y="86" fontSize="8" fill="#1C1C1E" textAnchor="middle">📞 Telephone</text>
      <text x="72" y="100" fontSize="8" fill="#1C1C1E" textAnchor="middle">📱 Mobile/Internet</text>
      <text x="72" y="118" fontSize="7" fill="#8E8E93" textAnchor="middle">India: one of largest</text>
      <text x="72" y="130" fontSize="7" fill="#8E8E93" textAnchor="middle">internet user bases</text>
      <rect x="150" y="38" width="116" height="108" rx="8" fill="#FF9500" fillOpacity="0.08" stroke="#FF9500" strokeWidth="1.5"/>
      <text x="208" y="56" fontSize="9" fontWeight="700" fill="#FF9500" textAnchor="middle">Mass Media</text>
      <text x="208" y="72" fontSize="8" fill="#1C1C1E" textAnchor="middle">📻 Radio (rural reach)</text>
      <text x="208" y="86" fontSize="8" fill="#1C1C1E" textAnchor="middle">📺 Television</text>
      <text x="208" y="100" fontSize="8" fill="#1C1C1E" textAnchor="middle">📰 Newspapers</text>
      <text x="208" y="118" fontSize="7" fill="#8E8E93" textAnchor="middle">Doordarshan</text>
      <text x="208" y="130" fontSize="7" fill="#8E8E93" textAnchor="middle">All India Radio</text>
      <rect x="10" y="154" width="260" height="38" rx="8" fill="#F2F2F7"/>
      <text x="140" y="170" fontSize="9" fontWeight="700" fill="#1C1C1E" textAnchor="middle">INSAT — Indian National Satellite System</text>
      <text x="140" y="184" fontSize="8" fill="#8E8E93" textAnchor="middle">Satellite communication: weather, TV, long-distance telephony</text>
    </svg>
  );
}

function InternationalTrade() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#34C759" fillOpacity="0.12" stroke="#34C759" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#34C759" textAnchor="middle">India's Foreign Trade</text>
      <rect x="14" y="38" width="116" height="110" rx="8" fill="#FF3B30" fillOpacity="0.07" stroke="#FF3B30" strokeWidth="1.5"/>
      <text x="72" y="56" fontSize="10" fontWeight="700" fill="#FF3B30" textAnchor="middle">IMPORTS</text>
      <text x="72" y="72" fontSize="8" fill="#1C1C1E" textAnchor="middle">Petroleum / oil</text>
      <text x="72" y="86" fontSize="8" fill="#1C1C1E" textAnchor="middle">Machinery</text>
      <text x="72" y="100" fontSize="8" fill="#1C1C1E" textAnchor="middle">Electronics</text>
      <text x="72" y="114" fontSize="8" fill="#1C1C1E" textAnchor="middle">Fertilisers</text>
      <text x="72" y="128" fontSize="8" fill="#1C1C1E" textAnchor="middle">Chemicals</text>
      <rect x="150" y="38" width="116" height="110" rx="8" fill="#34C759" fillOpacity="0.07" stroke="#34C759" strokeWidth="1.5"/>
      <text x="208" y="56" fontSize="10" fontWeight="700" fill="#34C759" textAnchor="middle">EXPORTS</text>
      <text x="208" y="72" fontSize="8" fill="#1C1C1E" textAnchor="middle">Software / IT</text>
      <text x="208" y="86" fontSize="8" fill="#1C1C1E" textAnchor="middle">Gems &amp; jewellery</text>
      <text x="208" y="100" fontSize="8" fill="#1C1C1E" textAnchor="middle">Textiles</text>
      <text x="208" y="114" fontSize="8" fill="#1C1C1E" textAnchor="middle">Engineering goods</text>
      <text x="208" y="128" fontSize="8" fill="#1C1C1E" textAnchor="middle">Agriculture</text>
      <rect x="10" y="156" width="260" height="36" rx="8" fill="#F2F2F7"/>
      <text x="140" y="171" fontSize="9" fontWeight="700" fill="#1C1C1E" textAnchor="middle">Tourism = Invisible Trade</text>
      <text x="140" y="185" fontSize="8" fill="#8E8E93" textAnchor="middle">Earns foreign exchange without exporting a physical product</text>
    </svg>
  );
}

// ─── SST Economics Ch 13–17 ───────────────────────────────────────────────────

function DevelopmentGoals() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#007AFF" fillOpacity="0.12" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#007AFF" textAnchor="middle">Development Goals Vary — Kerala Paradox</text>
      <rect x="14" y="38" width="116" height="120" rx="8" fill="#FF9500" fillOpacity="0.08" stroke="#FF9500" strokeWidth="1.5"/>
      <text x="72" y="56" fontSize="10" fontWeight="700" fill="#FF9500" textAnchor="middle">Punjab</text>
      <text x="72" y="72" fontSize="9" fill="#1C1C1E" textAnchor="middle">Per capita income</text>
      <text x="72" y="84" fontSize="9" fontWeight="700" fill="#FF9500" textAnchor="middle">HIGH ↑</text>
      <text x="72" y="100" fontSize="9" fill="#1C1C1E" textAnchor="middle">HDI rank</text>
      <text x="72" y="112" fontSize="9" fontWeight="700" fill="#FF3B30" textAnchor="middle">LOWER</text>
      <text x="72" y="132" fontSize="7" fill="#8E8E93" textAnchor="middle">Green Revolution</text>
      <text x="72" y="144" fontSize="7" fill="#8E8E93" textAnchor="middle">but less public</text>
      <text x="72" y="154" fontSize="7" fill="#8E8E93" textAnchor="middle">investment</text>
      <rect x="150" y="38" width="116" height="120" rx="8" fill="#34C759" fillOpacity="0.08" stroke="#34C759" strokeWidth="1.5"/>
      <text x="208" y="56" fontSize="10" fontWeight="700" fill="#34C759" textAnchor="middle">Kerala</text>
      <text x="208" y="72" fontSize="9" fill="#1C1C1E" textAnchor="middle">Per capita income</text>
      <text x="208" y="84" fontSize="9" fontWeight="700" fill="#FF3B30" textAnchor="middle">LOWER ↓</text>
      <text x="208" y="100" fontSize="9" fill="#1C1C1E" textAnchor="middle">HDI rank</text>
      <text x="208" y="112" fontSize="9" fontWeight="700" fill="#34C759" textAnchor="middle">HIGHER</text>
      <text x="208" y="132" fontSize="7" fill="#8E8E93" textAnchor="middle">Strong public</text>
      <text x="208" y="144" fontSize="7" fill="#8E8E93" textAnchor="middle">investment in</text>
      <text x="208" y="154" fontSize="7" fill="#8E8E93" textAnchor="middle">health, education</text>
      <rect x="10" y="166" width="260" height="26" rx="6" fill="#F2F2F7"/>
      <text x="140" y="183" fontSize="8" fill="#8E8E93" textAnchor="middle">Per capita income alone does not measure quality of life</text>
    </svg>
  );
}

function HDIIndex() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#007AFF" fillOpacity="0.12" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#007AFF" textAnchor="middle">HDI — Human Development Index (UNDP)</text>
      <rect x="94" y="36" width="92" height="30" rx="6" fill="#007AFF" fillOpacity="0.15" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="140" y="55" fontSize="10" fontWeight="700" fill="#007AFF" textAnchor="middle">HDI = Income + Education + Health</text>
      <line x1="110" y1="66" x2="72" y2="90" stroke="#C7C7CC" strokeWidth="1.5"/>
      <line x1="140" y1="66" x2="140" y2="90" stroke="#C7C7CC" strokeWidth="1.5"/>
      <line x1="170" y1="66" x2="208" y2="90" stroke="#C7C7CC" strokeWidth="1.5"/>
      <rect x="14" y="90" width="112" height="56" rx="8" fill="#FF9500" fillOpacity="0.1" stroke="#FF9500" strokeWidth="1.5"/>
      <text x="70" y="108" fontSize="9" fontWeight="700" fill="#FF9500" textAnchor="middle">Income</text>
      <text x="70" y="122" fontSize="8" fill="#8E8E93" textAnchor="middle">Per capita GNI</text>
      <text x="70" y="136" fontSize="8" fill="#8E8E93" textAnchor="middle">(purchasing power)</text>
      <rect x="94" y="90" width="92" height="56" rx="8" fill="#007AFF" fillOpacity="0.1" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="140" y="108" fontSize="9" fontWeight="700" fill="#007AFF" textAnchor="middle">Education</text>
      <text x="140" y="122" fontSize="8" fill="#8E8E93" textAnchor="middle">Literacy rate</text>
      <text x="140" y="136" fontSize="8" fill="#8E8E93" textAnchor="middle">School enrolment</text>
      <rect x="154" y="90" width="112" height="56" rx="8" fill="#34C759" fillOpacity="0.1" stroke="#34C759" strokeWidth="1.5"/>
      <text x="210" y="108" fontSize="9" fontWeight="700" fill="#34C759" textAnchor="middle">Health</text>
      <text x="210" y="122" fontSize="8" fill="#8E8E93" textAnchor="middle">Life expectancy</text>
      <text x="210" y="136" fontSize="8" fill="#8E8E93" textAnchor="middle">at birth</text>
      <rect x="10" y="156" width="260" height="36" rx="8" fill="#F2F2F7"/>
      <text x="140" y="171" fontSize="9" fontWeight="700" fill="#1C1C1E" textAnchor="middle">India ranks ~132/193 countries (UNDP 2023)</text>
      <text x="140" y="185" fontSize="8" fill="#8E8E93" textAnchor="middle">IMR · Literacy rate · Infant mortality used as development indicators</text>
    </svg>
  );
}

function ThreeSectors() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#007AFF" fillOpacity="0.12" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#007AFF" textAnchor="middle">Three Sectors of the Indian Economy</text>
      <rect x="14" y="38" width="74" height="118" rx="8" fill="#34C759" fillOpacity="0.1" stroke="#34C759" strokeWidth="1.5"/>
      <text x="51" y="58" fontSize="9" fontWeight="700" fill="#34C759" textAnchor="middle">Primary</text>
      <text x="51" y="72" fontSize="8" fill="#1C1C1E" textAnchor="middle">Agriculture</text>
      <text x="51" y="84" fontSize="8" fill="#1C1C1E" textAnchor="middle">Mining</text>
      <text x="51" y="96" fontSize="8" fill="#1C1C1E" textAnchor="middle">Fishing</text>
      <text x="51" y="114" fontSize="8" fontWeight="700" fill="#34C759" textAnchor="middle">GDP: 19%</text>
      <text x="51" y="128" fontSize="7" fill="#FF3B30" textAnchor="middle">Jobs: 49%</text>
      <text x="51" y="142" fontSize="7" fill="#8E8E93" textAnchor="middle">Low productivity</text>
      <rect x="103" y="38" width="74" height="118" rx="8" fill="#FF9500" fillOpacity="0.1" stroke="#FF9500" strokeWidth="1.5"/>
      <text x="140" y="58" fontSize="9" fontWeight="700" fill="#FF9500" textAnchor="middle">Secondary</text>
      <text x="140" y="72" fontSize="8" fill="#1C1C1E" textAnchor="middle">Manufacturing</text>
      <text x="140" y="84" fontSize="8" fill="#1C1C1E" textAnchor="middle">Construction</text>
      <text x="140" y="96" fontSize="8" fill="#1C1C1E" textAnchor="middle">Electricity</text>
      <text x="140" y="114" fontSize="8" fontWeight="700" fill="#FF9500" textAnchor="middle">GDP: 26%</text>
      <text x="140" y="128" fontSize="7" fill="#8E8E93" textAnchor="middle">Jobs: 22%</text>
      <rect x="192" y="38" width="74" height="118" rx="8" fill="#007AFF" fillOpacity="0.1" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="229" y="58" fontSize="9" fontWeight="700" fill="#007AFF" textAnchor="middle">Tertiary</text>
      <text x="229" y="72" fontSize="8" fill="#1C1C1E" textAnchor="middle">Banking</text>
      <text x="229" y="84" fontSize="8" fill="#1C1C1E" textAnchor="middle">Transport</text>
      <text x="229" y="96" fontSize="8" fill="#1C1C1E" textAnchor="middle">IT, Retail</text>
      <text x="229" y="114" fontSize="8" fontWeight="700" fill="#007AFF" textAnchor="middle">GDP: 55%</text>
      <text x="229" y="128" fontSize="7" fill="#8E8E93" textAnchor="middle">Jobs: 29%</text>
      <text x="229" y="142" fontSize="7" fill="#8E8E93" textAnchor="middle">Fastest growing</text>
      <rect x="10" y="164" width="260" height="28" rx="6" fill="#F2F2F7"/>
      <text x="140" y="182" fontSize="8" fill="#8E8E93" textAnchor="middle">GDP = value of final goods + services produced in one year</text>
    </svg>
  );
}

function SectorsEmployment() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#007AFF" fillOpacity="0.12" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#007AFF" textAnchor="middle">Organised vs Unorganised Sector</text>
      <rect x="14" y="38" width="116" height="120" rx="8" fill="#34C759" fillOpacity="0.08" stroke="#34C759" strokeWidth="1.5"/>
      <text x="72" y="56" fontSize="9" fontWeight="700" fill="#34C759" textAnchor="middle">Organised</text>
      <text x="72" y="72" fontSize="8" fill="#1C1C1E" textAnchor="middle">Registered with govt.</text>
      <text x="72" y="86" fontSize="8" fill="#1C1C1E" textAnchor="middle">Follows labour laws</text>
      <text x="72" y="100" fontSize="8" fill="#1C1C1E" textAnchor="middle">Fixed working hours</text>
      <text x="72" y="114" fontSize="8" fill="#1C1C1E" textAnchor="middle">PF, pension, ESI</text>
      <text x="72" y="130" fontSize="7" fill="#8E8E93" textAnchor="middle">Small % of workers</text>
      <text x="72" y="144" fontSize="7" fill="#8E8E93" textAnchor="middle">but secure jobs</text>
      <rect x="150" y="38" width="116" height="120" rx="8" fill="#FF3B30" fillOpacity="0.06" stroke="#FF3B30" strokeWidth="1.5"/>
      <text x="208" y="56" fontSize="9" fontWeight="700" fill="#FF3B30" textAnchor="middle">Unorganised</text>
      <text x="208" y="72" fontSize="8" fill="#1C1C1E" textAnchor="middle">Small units</text>
      <text x="208" y="86" fontSize="8" fill="#1C1C1E" textAnchor="middle">Irregular wages</text>
      <text x="208" y="100" fontSize="8" fill="#1C1C1E" textAnchor="middle">No job security</text>
      <text x="208" y="114" fontSize="8" fill="#1C1C1E" textAnchor="middle">No social benefits</text>
      <text x="208" y="130" fontSize="7" fill="#FF3B30" textAnchor="middle">92% of workers</text>
      <text x="208" y="144" fontSize="7" fill="#FF3B30" textAnchor="middle">in India</text>
      <rect x="10" y="166" width="260" height="26" rx="6" fill="#F2F2F7"/>
      <text x="140" y="183" fontSize="8" fill="#8E8E93" textAnchor="middle">NREGA 2005: 100 days guaranteed work for rural households</text>
    </svg>
  );
}

function ServicesSector() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#007AFF" fillOpacity="0.12" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#007AFF" textAnchor="middle">Services Sector — India's GDP Driver</text>
      <rect x="14" y="38" width="116" height="110" rx="8" fill="#007AFF" fillOpacity="0.07" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="72" y="56" fontSize="9" fontWeight="700" fill="#007AFF" textAnchor="middle">IT &amp; New Services</text>
      <text x="72" y="72" fontSize="8" fill="#1C1C1E" textAnchor="middle">Software exports</text>
      <text x="72" y="86" fontSize="8" fill="#1C1C1E" textAnchor="middle">BPO / call centres</text>
      <text x="72" y="100" fontSize="8" fill="#1C1C1E" textAnchor="middle">Internet banking</text>
      <text x="72" y="114" fontSize="8" fill="#1C1C1E" textAnchor="middle">E-commerce</text>
      <text x="72" y="130" fontSize="7" fill="#8E8E93" textAnchor="middle">Globalisation benefited</text>
      <text x="72" y="142" fontSize="7" fill="#8E8E93" textAnchor="middle">IT sector most</text>
      <rect x="150" y="38" width="116" height="110" rx="8" fill="#FF9500" fillOpacity="0.07" stroke="#FF9500" strokeWidth="1.5"/>
      <text x="208" y="56" fontSize="9" fontWeight="700" fill="#FF9500" textAnchor="middle">Traditional Services</text>
      <text x="208" y="72" fontSize="8" fill="#1C1C1E" textAnchor="middle">Railways</text>
      <text x="208" y="86" fontSize="8" fill="#1C1C1E" textAnchor="middle">Postal services</text>
      <text x="208" y="100" fontSize="8" fill="#1C1C1E" textAnchor="middle">Banking</text>
      <text x="208" y="114" fontSize="8" fill="#1C1C1E" textAnchor="middle">Insurance</text>
      <text x="208" y="130" fontSize="7" fill="#8E8E93" textAnchor="middle">Large employers</text>
      <text x="208" y="142" fontSize="7" fill="#8E8E93" textAnchor="middle">but slow growth</text>
      <rect x="10" y="156" width="260" height="36" rx="8" fill="#F2F2F7"/>
      <text x="140" y="172" fontSize="9" fontWeight="700" fill="#FF3B30" textAnchor="middle">Concern: Services grow but manufacturing lags</text>
      <text x="140" y="186" fontSize="8" fill="#8E8E93" textAnchor="middle">IT needs high skills — can't absorb India's unskilled workforce</text>
    </svg>
  );
}

function MoneyEvolution() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#007AFF" fillOpacity="0.12" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#007AFF" textAnchor="middle">From Barter to Modern Money</text>
      <line x1="24" y1="90" x2="256" y2="90" stroke="#C7C7CC" strokeWidth="2"/>
      <circle cx="44" cy="90" r="7" fill="#8E8E93"/>
      <text x="44" y="78" fontSize="8" fontWeight="700" fill="#1C1C1E" textAnchor="middle">Barter</text>
      <text x="44" y="106" fontSize="7" fill="#8E8E93" textAnchor="middle">Double</text>
      <text x="44" y="116" fontSize="7" fill="#8E8E93" textAnchor="middle">coincidence</text>
      <circle cx="110" cy="90" r="7" fill="#FF9500"/>
      <text x="110" y="78" fontSize="8" fontWeight="700" fill="#1C1C1E" textAnchor="middle">Coins</text>
      <text x="110" y="106" fontSize="7" fill="#8E8E93" textAnchor="middle">Gold, silver</text>
      <text x="110" y="116" fontSize="7" fill="#8E8E93" textAnchor="middle">metals</text>
      <circle cx="176" cy="90" r="7" fill="#007AFF"/>
      <text x="176" y="78" fontSize="8" fontWeight="700" fill="#1C1C1E" textAnchor="middle">Paper</text>
      <text x="176" y="106" fontSize="7" fill="#8E8E93" textAnchor="middle">Currency</text>
      <text x="176" y="116" fontSize="7" fill="#8E8E93" textAnchor="middle">notes</text>
      <circle cx="242" cy="90" r="7" fill="#34C759"/>
      <text x="242" y="78" fontSize="8" fontWeight="700" fill="#1C1C1E" textAnchor="middle">Demand</text>
      <text x="242" y="106" fontSize="7" fill="#34C759" textAnchor="middle">Deposits</text>
      <text x="242" y="116" fontSize="7" fill="#34C759" textAnchor="middle">Cheques</text>
      <rect x="10" y="132" width="260" height="60" rx="8" fill="#F2F2F7"/>
      <text x="140" y="150" fontSize="10" fontWeight="700" fill="#1C1C1E" textAnchor="middle">Money solves the barter problem</text>
      <text x="140" y="165" fontSize="8" fill="#8E8E93" textAnchor="middle">Medium of exchange · Store of value · Unit of account</text>
      <text x="140" y="179" fontSize="9" fontWeight="700" fill="#007AFF" textAnchor="middle">Demand deposits are money — used via cheques</text>
    </svg>
  );
}

function BankingCredit() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#007AFF" fillOpacity="0.12" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#007AFF" textAnchor="middle">Banking — Credit Creation &amp; RBI Oversight</text>
      <rect x="94" y="36" width="92" height="28" rx="6" fill="#007AFF" fillOpacity="0.15" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="140" y="50" fontSize="9" fontWeight="700" fill="#007AFF" textAnchor="middle">Depositor → Bank</text>
      <text x="140" y="62" fontSize="8" fill="#8E8E93" textAnchor="middle">₹100 deposited</text>
      <line x1="140" y1="64" x2="140" y2="82" stroke="#C7C7CC" strokeWidth="1.5"/>
      <rect x="94" y="82" width="92" height="28" rx="6" fill="#34C759" fillOpacity="0.12" stroke="#34C759" strokeWidth="1.5"/>
      <text x="140" y="96" fontSize="9" fontWeight="700" fill="#34C759" textAnchor="middle">Bank → Borrower A</text>
      <text x="140" y="108" fontSize="8" fill="#8E8E93" textAnchor="middle">₹80 lent out (80%)</text>
      <line x1="140" y1="110" x2="140" y2="128" stroke="#C7C7CC" strokeWidth="1.5"/>
      <rect x="94" y="128" width="92" height="28" rx="6" fill="#34C759" fillOpacity="0.12" stroke="#34C759" strokeWidth="1.5"/>
      <text x="140" y="142" fontSize="9" fontWeight="700" fill="#34C759" textAnchor="middle">Re-deposited</text>
      <text x="140" y="154" fontSize="8" fill="#8E8E93" textAnchor="middle">₹80 becomes new deposit</text>
      <rect x="10" y="166" width="260" height="26" rx="6" fill="#F2F2F7"/>
      <text x="140" y="183" fontSize="8" fill="#8E8E93" textAnchor="middle">RBI regulates all formal banks · SLR + CRR control money supply</text>
    </svg>
  );
}

function CreditSources() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#007AFF" fillOpacity="0.12" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#007AFF" textAnchor="middle">Formal vs Informal Credit Sources</text>
      <rect x="14" y="38" width="116" height="124" rx="8" fill="#34C759" fillOpacity="0.08" stroke="#34C759" strokeWidth="1.5"/>
      <text x="72" y="56" fontSize="9" fontWeight="700" fill="#34C759" textAnchor="middle">Formal</text>
      <text x="72" y="72" fontSize="8" fill="#1C1C1E" textAnchor="middle">Banks</text>
      <text x="72" y="86" fontSize="8" fill="#1C1C1E" textAnchor="middle">Cooperatives</text>
      <text x="72" y="100" fontSize="8" fill="#1C1C1E" textAnchor="middle">Lower interest</text>
      <text x="72" y="114" fontSize="8" fill="#1C1C1E" textAnchor="middle">Regulated by RBI</text>
      <text x="72" y="130" fontSize="7" fill="#8E8E93" textAnchor="middle">Collateral required</text>
      <text x="72" y="150" fontSize="8" fontWeight="700" fill="#34C759" textAnchor="middle">25% rural credit</text>
      <rect x="150" y="38" width="116" height="124" rx="8" fill="#FF3B30" fillOpacity="0.06" stroke="#FF3B30" strokeWidth="1.5"/>
      <text x="208" y="56" fontSize="9" fontWeight="700" fill="#FF3B30" textAnchor="middle">Informal</text>
      <text x="208" y="72" fontSize="8" fill="#1C1C1E" textAnchor="middle">Moneylenders</text>
      <text x="208" y="86" fontSize="8" fill="#1C1C1E" textAnchor="middle">Traders, relatives</text>
      <text x="208" y="100" fontSize="8" fill="#1C1C1E" textAnchor="middle">High interest</text>
      <text x="208" y="114" fontSize="8" fill="#1C1C1E" textAnchor="middle">No regulation</text>
      <text x="208" y="130" fontSize="7" fill="#8E8E93" textAnchor="middle">Debt traps common</text>
      <text x="208" y="150" fontSize="8" fontWeight="700" fill="#FF3B30" textAnchor="middle">75% rural credit</text>
      <rect x="10" y="170" width="260" height="22" rx="6" fill="#F2F2F7"/>
      <text x="140" y="185" fontSize="8" fill="#8E8E93" textAnchor="middle">SHG: 15–20 women pool savings, give loans within group — Grameen Bank model</text>
    </svg>
  );
}

function GlobalisationMNC() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#007AFF" fillOpacity="0.12" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#007AFF" textAnchor="middle">Globalisation — MNC Global Value Chain</text>
      <rect x="14" y="38" width="52" height="52" rx="6" fill="#FF3B30" fillOpacity="0.12" stroke="#FF3B30" strokeWidth="1.5"/>
      <text x="40" y="60" fontSize="8" fontWeight="700" fill="#FF3B30" textAnchor="middle">Design</text>
      <text x="40" y="74" fontSize="7" fill="#8E8E93" textAnchor="middle">USA/EU</text>
      <rect x="80" y="38" width="52" height="52" rx="6" fill="#FF9500" fillOpacity="0.12" stroke="#FF9500" strokeWidth="1.5"/>
      <text x="106" y="60" fontSize="8" fontWeight="700" fill="#FF9500" textAnchor="middle">Parts</text>
      <text x="106" y="74" fontSize="7" fill="#8E8E93" textAnchor="middle">Taiwan/Japan</text>
      <rect x="146" y="38" width="52" height="52" rx="6" fill="#34C759" fillOpacity="0.12" stroke="#34C759" strokeWidth="1.5"/>
      <text x="172" y="60" fontSize="8" fontWeight="700" fill="#34C759" textAnchor="middle">Assembly</text>
      <text x="172" y="74" fontSize="7" fill="#8E8E93" textAnchor="middle">China/India</text>
      <rect x="212" y="38" width="54" height="52" rx="6" fill="#007AFF" fillOpacity="0.12" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="239" y="60" fontSize="8" fontWeight="700" fill="#007AFF" textAnchor="middle">Market</text>
      <text x="239" y="74" fontSize="7" fill="#8E8E93" textAnchor="middle">Global</text>
      <line x1="66" y1="64" x2="80" y2="64" stroke="#C7C7CC" strokeWidth="1.5"/>
      <line x1="132" y1="64" x2="146" y2="64" stroke="#C7C7CC" strokeWidth="1.5"/>
      <line x1="198" y1="64" x2="212" y2="64" stroke="#C7C7CC" strokeWidth="1.5"/>
      <rect x="10" y="102" width="260" height="88" rx="8" fill="#F2F2F7"/>
      <text x="140" y="120" fontSize="9" fontWeight="700" fill="#1C1C1E" textAnchor="middle">Three Flows of Globalisation</text>
      <circle cx="26" cy="136" r="4" fill="#007AFF"/>
      <text x="40" y="140" fontSize="8" fill="#1C1C1E">Trade: goods and services cross borders</text>
      <circle cx="26" cy="152" r="4" fill="#FF9500"/>
      <text x="40" y="156" fontSize="8" fill="#1C1C1E">Capital: FDI — MNCs invest in host countries</text>
      <circle cx="26" cy="168" r="4" fill="#34C759"/>
      <text x="40" y="172" fontSize="8" fill="#1C1C1E">Technology: transferred to subsidiaries globally</text>
      <text x="140" y="186" fontSize="7" fill="#8E8E93" textAnchor="middle">MNC = owns/controls production in more than one country</text>
    </svg>
  );
}

function LiberalisationImpact() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#007AFF" fillOpacity="0.12" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#007AFF" textAnchor="middle">India 1991 — LPG Reforms</text>
      <rect x="94" y="36" width="92" height="30" rx="6" fill="#FF3B30" fillOpacity="0.12" stroke="#FF3B30" strokeWidth="1.5"/>
      <text x="140" y="50" fontSize="9" fontWeight="700" fill="#FF3B30" textAnchor="middle">BoP Crisis 1991</text>
      <text x="140" y="62" fontSize="8" fill="#8E8E93" textAnchor="middle">India mortgaged gold to IMF</text>
      <line x1="140" y1="66" x2="140" y2="84" stroke="#C7C7CC" strokeWidth="1.5"/>
      <rect x="30" y="84" width="220" height="28" rx="6" fill="#007AFF" fillOpacity="0.1" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="140" y="99" fontSize="10" fontWeight="700" fill="#007AFF" textAnchor="middle">LPG = Liberalisation + Privatisation + Globalisation</text>
      <line x1="86" y1="112" x2="62" y2="128" stroke="#C7C7CC" strokeWidth="1.5"/>
      <line x1="140" y1="112" x2="140" y2="128" stroke="#C7C7CC" strokeWidth="1.5"/>
      <line x1="194" y1="112" x2="218" y2="128" stroke="#C7C7CC" strokeWidth="1.5"/>
      <rect x="14" y="128" width="74" height="40" rx="6" fill="#34C759" fillOpacity="0.1" stroke="#34C759" strokeWidth="1.2"/>
      <text x="51" y="148" fontSize="8" fontWeight="700" fill="#34C759" textAnchor="middle">Remove</text>
      <text x="51" y="160" fontSize="7" fill="#8E8E93" textAnchor="middle">trade barriers</text>
      <rect x="103" y="128" width="74" height="40" rx="6" fill="#007AFF" fillOpacity="0.1" stroke="#007AFF" strokeWidth="1.2"/>
      <text x="140" y="148" fontSize="8" fontWeight="700" fill="#007AFF" textAnchor="middle">Allow</text>
      <text x="140" y="160" fontSize="7" fill="#8E8E93" textAnchor="middle">MNC entry/FDI</text>
      <rect x="192" y="128" width="74" height="40" rx="6" fill="#FF9500" fillOpacity="0.1" stroke="#FF9500" strokeWidth="1.2"/>
      <text x="229" y="148" fontSize="8" fontWeight="700" fill="#FF9500" textAnchor="middle">WTO</text>
      <text x="229" y="160" fontSize="7" fill="#8E8E93" textAnchor="middle">free trade rules</text>
      <text x="140" y="185" fontSize="8" fill="#8E8E93" textAnchor="middle" fontWeight="700">IT gained · small Indian industries (toys, textiles) hurt</text>
    </svg>
  );
}

function FairGlobalisation() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#007AFF" fillOpacity="0.12" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#007AFF" textAnchor="middle">WTO and Fair Globalisation</text>
      <rect x="14" y="38" width="116" height="110" rx="8" fill="#34C759" fillOpacity="0.08" stroke="#34C759" strokeWidth="1.5"/>
      <text x="72" y="56" fontSize="9" fontWeight="700" fill="#34C759" textAnchor="middle">WTO Claims</text>
      <text x="72" y="72" fontSize="8" fill="#1C1C1E" textAnchor="middle">Free trade for all</text>
      <text x="72" y="86" fontSize="8" fill="#1C1C1E" textAnchor="middle">164 members</text>
      <text x="72" y="100" fontSize="8" fill="#1C1C1E" textAnchor="middle">Open markets</text>
      <text x="72" y="114" fontSize="8" fill="#1C1C1E" textAnchor="middle">Remove subsidies</text>
      <text x="72" y="130" fontSize="8" fill="#1C1C1E" textAnchor="middle">Lower tariffs</text>
      <rect x="150" y="38" width="116" height="110" rx="8" fill="#FF3B30" fillOpacity="0.06" stroke="#FF3B30" strokeWidth="1.5"/>
      <text x="208" y="56" fontSize="9" fontWeight="700" fill="#FF3B30" textAnchor="middle">Reality (Critique)</text>
      <text x="208" y="72" fontSize="8" fill="#1C1C1E" textAnchor="middle">US/EU subsidise</text>
      <text x="208" y="86" fontSize="8" fill="#1C1C1E" textAnchor="middle">own farmers</text>
      <text x="208" y="100" fontSize="8" fill="#1C1C1E" textAnchor="middle">Developing countries</text>
      <text x="208" y="114" fontSize="8" fill="#1C1C1E" textAnchor="middle">told to open up</text>
      <text x="208" y="130" fontSize="8" fill="#FF3B30" textAnchor="middle">Double standard!</text>
      <rect x="10" y="156" width="260" height="36" rx="8" fill="#F2F2F7"/>
      <text x="140" y="172" fontSize="9" fontWeight="700" fill="#1C1C1E" textAnchor="middle">Fair Globalisation Demands</text>
      <text x="140" y="186" fontSize="8" fill="#8E8E93" textAnchor="middle">Workers' rights · Labour standards · Equitable trade rules for all</text>
    </svg>
  );
}

function ConsumerAwareness() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#FF9500" fillOpacity="0.15" stroke="#FF9500" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#FF9500" textAnchor="middle">Consumer Exploitation — COPRA 1986</text>
      <rect x="14" y="38" width="252" height="74" rx="8" fill="#FF3B30" fillOpacity="0.06" stroke="#FF3B30" strokeWidth="1.5"/>
      <text x="140" y="54" fontSize="9" fontWeight="700" fill="#FF3B30" textAnchor="middle">Forms of Consumer Exploitation</text>
      <circle cx="26" cy="70" r="4" fill="#FF3B30"/>
      <text x="40" y="74" fontSize="8" fill="#1C1C1E">Underweight · Adulteration · Misleading advertisements</text>
      <circle cx="26" cy="86" r="4" fill="#FF3B30"/>
      <text x="40" y="90" fontSize="8" fill="#1C1C1E">Defective goods · Overcharging · Poor quality service</text>
      <circle cx="26" cy="102" r="4" fill="#FF3B30"/>
      <text x="40" y="106" fontSize="8" fill="#1C1C1E">Fake products · Duplicate brands</text>
      <rect x="14" y="122" width="252" height="70" rx="8" fill="#34C759" fillOpacity="0.07" stroke="#34C759" strokeWidth="1.5"/>
      <text x="140" y="140" fontSize="9" fontWeight="700" fill="#34C759" textAnchor="middle">Quality Certification Marks</text>
      <text x="50" y="158" fontSize="9" fontWeight="700" fill="#007AFF" textAnchor="middle">ISI</text>
      <text x="50" y="172" fontSize="7" fill="#8E8E93" textAnchor="middle">Industrial</text>
      <text x="110" y="158" fontSize="9" fontWeight="700" fill="#34C759" textAnchor="middle">Agmark</text>
      <text x="110" y="172" fontSize="7" fill="#8E8E93" textAnchor="middle">Agriculture</text>
      <text x="172" y="158" fontSize="9" fontWeight="700" fill="#FF9500" textAnchor="middle">Hallmark</text>
      <text x="172" y="172" fontSize="7" fill="#8E8E93" textAnchor="middle">Gold</text>
      <text x="232" y="158" fontSize="9" fontWeight="700" fill="#FF3B30" textAnchor="middle">FPO</text>
      <text x="232" y="172" fontSize="7" fill="#8E8E93" textAnchor="middle">Processed food</text>
    </svg>
  );
}

function ConsumerRights() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#FF9500" fillOpacity="0.15" stroke="#FF9500" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#FF9500" textAnchor="middle">Six Consumer Rights (COPRA)</text>
      <rect x="14" y="38" width="74" height="58" rx="6" fill="#FF3B30" fillOpacity="0.1" stroke="#FF3B30" strokeWidth="1.5"/>
      <text x="51" y="58" fontSize="16" textAnchor="middle">🛡️</text>
      <text x="51" y="76" fontSize="9" fontWeight="700" fill="#FF3B30" textAnchor="middle">Safety</text>
      <text x="51" y="88" fontSize="7" fill="#8E8E93" textAnchor="middle">From hazardous goods</text>
      <rect x="103" y="38" width="74" height="58" rx="6" fill="#007AFF" fillOpacity="0.1" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="140" y="58" fontSize="16" textAnchor="middle">ℹ️</text>
      <text x="140" y="76" fontSize="9" fontWeight="700" fill="#007AFF" textAnchor="middle">Information</text>
      <text x="140" y="88" fontSize="7" fill="#8E8E93" textAnchor="middle">Quality, price, safety</text>
      <rect x="192" y="38" width="74" height="58" rx="6" fill="#34C759" fillOpacity="0.1" stroke="#34C759" strokeWidth="1.5"/>
      <text x="229" y="58" fontSize="16" textAnchor="middle">🏪</text>
      <text x="229" y="76" fontSize="9" fontWeight="700" fill="#34C759" textAnchor="middle">Choice</text>
      <text x="229" y="88" fontSize="7" fill="#8E8E93" textAnchor="middle">Variety at fair price</text>
      <rect x="14" y="106" width="74" height="58" rx="6" fill="#FF9500" fillOpacity="0.1" stroke="#FF9500" strokeWidth="1.5"/>
      <text x="51" y="126" fontSize="16" textAnchor="middle">📢</text>
      <text x="51" y="144" fontSize="9" fontWeight="700" fill="#FF9500" textAnchor="middle">Heard</text>
      <text x="51" y="156" fontSize="7" fill="#8E8E93" textAnchor="middle">Voice in forums</text>
      <rect x="103" y="106" width="74" height="58" rx="6" fill="#8E8E93" fillOpacity="0.15" stroke="#8E8E93" strokeWidth="1.5"/>
      <text x="140" y="126" fontSize="16" textAnchor="middle">⚖️</text>
      <text x="140" y="144" fontSize="9" fontWeight="700" fill="#8E8E93" textAnchor="middle">Redress</text>
      <text x="140" y="156" fontSize="7" fill="#8E8E93" textAnchor="middle">Settle unfair practices</text>
      <rect x="192" y="106" width="74" height="58" rx="6" fill="#FF3B30" fillOpacity="0.08" stroke="#FF3B30" strokeWidth="1.5"/>
      <text x="229" y="126" fontSize="16" textAnchor="middle">📚</text>
      <text x="229" y="144" fontSize="9" fontWeight="700" fill="#FF3B30" textAnchor="middle">Education</text>
      <text x="229" y="156" fontSize="7" fill="#8E8E93" textAnchor="middle">Consumer awareness</text>
      <rect x="10" y="172" width="260" height="20" rx="4" fill="#F2F2F7"/>
      <text x="140" y="186" fontSize="7" fill="#8E8E93" textAnchor="middle">World Consumer Rights Day: 15 March (since JFK's speech 1962)</text>
    </svg>
  );
}

function ConsumerProtection() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#FF9500" fillOpacity="0.15" stroke="#FF9500" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#FF9500" textAnchor="middle">3-tier Consumer Redressal Forum</text>
      <rect x="70" y="36" width="140" height="40" rx="8" fill="#FF3B30" fillOpacity="0.12" stroke="#FF3B30" strokeWidth="2"/>
      <text x="140" y="53" fontSize="9" fontWeight="700" fill="#FF3B30" textAnchor="middle">National Commission</text>
      <text x="140" y="68" fontSize="9" fontWeight="700" fill="#FF3B30" textAnchor="middle">Claims above ₹2 crore</text>
      <line x1="140" y1="76" x2="140" y2="90" stroke="#C7C7CC" strokeWidth="1.5"/>
      <rect x="50" y="90" width="180" height="40" rx="8" fill="#FF9500" fillOpacity="0.12" stroke="#FF9500" strokeWidth="2"/>
      <text x="140" y="107" fontSize="9" fontWeight="700" fill="#FF9500" textAnchor="middle">State Commission</text>
      <text x="140" y="122" fontSize="9" fontWeight="700" fill="#FF9500" textAnchor="middle">Claims ₹50 lakh to ₹2 crore</text>
      <line x1="140" y1="130" x2="140" y2="144" stroke="#C7C7CC" strokeWidth="1.5"/>
      <rect x="30" y="144" width="220" height="40" rx="8" fill="#34C759" fillOpacity="0.1" stroke="#34C759" strokeWidth="2"/>
      <text x="140" y="161" fontSize="9" fontWeight="700" fill="#34C759" textAnchor="middle">District Forum</text>
      <text x="140" y="176" fontSize="9" fontWeight="700" fill="#34C759" textAnchor="middle">Claims up to ₹50 lakh</text>
      <rect x="10" y="188" width="260" height="8" rx="4" fill="#F2F2F7"/>
      <text x="140" y="196" fontSize="6" fill="#8E8E93" textAnchor="middle">COPRA 2019: online complaints · product liability · e-commerce included</text>
    </svg>
  );
}

// ─── SST Political Science Ch 18–22 ──────────────────────────────────────────

function PowerSharingCase() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#FF9500" fillOpacity="0.15" stroke="#FF9500" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#FF9500" textAnchor="middle">Belgium vs Sri Lanka — Power Sharing</text>
      <rect x="14" y="38" width="116" height="130" rx="8" fill="#34C759" fillOpacity="0.08" stroke="#34C759" strokeWidth="1.5"/>
      <text x="72" y="56" fontSize="10" fontWeight="700" fill="#34C759" textAnchor="middle">BELGIUM ✓</text>
      <text x="72" y="72" fontSize="8" fill="#1C1C1E" textAnchor="middle">Dutch 59%, French 40%</text>
      <text x="72" y="86" fontSize="8" fill="#1C1C1E" textAnchor="middle">Equal cabinet seats</text>
      <text x="72" y="100" fontSize="8" fill="#1C1C1E" textAnchor="middle">Brussels: community</text>
      <text x="72" y="114" fontSize="8" fill="#1C1C1E" textAnchor="middle">government</text>
      <text x="72" y="132" fontSize="8" fontWeight="700" fill="#34C759" textAnchor="middle">RESULT: Peace</text>
      <text x="72" y="146" fontSize="7" fill="#8E8E93" textAnchor="middle">Now part of EU</text>
      <text x="72" y="160" fontSize="7" fill="#8E8E93" textAnchor="middle">headquarters</text>
      <rect x="150" y="38" width="116" height="130" rx="8" fill="#FF3B30" fillOpacity="0.06" stroke="#FF3B30" strokeWidth="1.5"/>
      <text x="208" y="56" fontSize="10" fontWeight="700" fill="#FF3B30" textAnchor="middle">SRI LANKA ✗</text>
      <text x="208" y="72" fontSize="8" fill="#1C1C1E" textAnchor="middle">Sinhala 74%, Tamil 18%</text>
      <text x="208" y="86" fontSize="8" fill="#1C1C1E" textAnchor="middle">1956 Sinhala Only Act</text>
      <text x="208" y="100" fontSize="8" fill="#1C1C1E" textAnchor="middle">Tamils marginalised</text>
      <text x="208" y="114" fontSize="8" fill="#1C1C1E" textAnchor="middle">from govt. jobs</text>
      <text x="208" y="132" fontSize="8" fontWeight="700" fill="#FF3B30" textAnchor="middle">RESULT: Civil war</text>
      <text x="208" y="146" fontSize="7" fill="#8E8E93" textAnchor="middle">1983–2009 war</text>
      <text x="208" y="160" fontSize="7" fill="#8E8E93" textAnchor="middle">thousands died</text>
      <rect x="10" y="176" width="260" height="18" rx="4" fill="#F2F2F7"/>
      <text x="140" y="188" fontSize="8" fill="#8E8E93" textAnchor="middle">Lesson: majoritarianism destroys democracy; sharing sustains it</text>
    </svg>
  );
}

function PowerSharingForms() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#FF9500" fillOpacity="0.15" stroke="#FF9500" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#FF9500" textAnchor="middle">Four Forms of Power Sharing</text>
      <rect x="14" y="38" width="116" height="68" rx="8" fill="#007AFF" fillOpacity="0.08" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="72" y="56" fontSize="9" fontWeight="700" fill="#007AFF" textAnchor="middle">1. Horizontal</text>
      <text x="72" y="70" fontSize="8" fill="#1C1C1E" textAnchor="middle">Among organs of govt.</text>
      <text x="72" y="84" fontSize="8" fill="#8E8E93" textAnchor="middle">Legislature + Executive</text>
      <text x="72" y="96" fontSize="8" fill="#8E8E93" textAnchor="middle">+ Judiciary (checks)</text>
      <rect x="150" y="38" width="116" height="68" rx="8" fill="#34C759" fillOpacity="0.08" stroke="#34C759" strokeWidth="1.5"/>
      <text x="208" y="56" fontSize="9" fontWeight="700" fill="#34C759" textAnchor="middle">2. Vertical</text>
      <text x="208" y="70" fontSize="8" fill="#1C1C1E" textAnchor="middle">Among levels of govt.</text>
      <text x="208" y="84" fontSize="8" fill="#8E8E93" textAnchor="middle">Central + State</text>
      <text x="208" y="96" fontSize="8" fill="#8E8E93" textAnchor="middle">+ Local (federalism)</text>
      <rect x="14" y="116" width="116" height="68" rx="8" fill="#FF9500" fillOpacity="0.08" stroke="#FF9500" strokeWidth="1.5"/>
      <text x="72" y="134" fontSize="9" fontWeight="700" fill="#FF9500" textAnchor="middle">3. Social Groups</text>
      <text x="72" y="148" fontSize="8" fill="#1C1C1E" textAnchor="middle">Reserved seats for</text>
      <text x="72" y="162" fontSize="8" fill="#8E8E93" textAnchor="middle">SC/ST/Women</text>
      <text x="72" y="176" fontSize="8" fill="#8E8E93" textAnchor="middle">in legislatures</text>
      <rect x="150" y="116" width="116" height="68" rx="8" fill="#FF3B30" fillOpacity="0.06" stroke="#FF3B30" strokeWidth="1.5"/>
      <text x="208" y="134" fontSize="9" fontWeight="700" fill="#FF3B30" textAnchor="middle">4. Political Parties</text>
      <text x="208" y="148" fontSize="8" fill="#1C1C1E" textAnchor="middle">Coalition govts.</text>
      <text x="208" y="162" fontSize="8" fill="#8E8E93" textAnchor="middle">Pressure groups</text>
      <text x="208" y="176" fontSize="8" fill="#8E8E93" textAnchor="middle">Opposition parties</text>
    </svg>
  );
}

function FederalismLists() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#FF9500" fillOpacity="0.15" stroke="#FF9500" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#FF9500" textAnchor="middle">India's Constitution — 3 Lists</text>
      <rect x="14" y="38" width="74" height="132" rx="8" fill="#FF3B30" fillOpacity="0.08" stroke="#FF3B30" strokeWidth="1.5"/>
      <text x="51" y="58" fontSize="9" fontWeight="700" fill="#FF3B30" textAnchor="middle">Union List</text>
      <text x="51" y="74" fontSize="18" textAnchor="middle">🏛️</text>
      <text x="51" y="94" fontSize="11" fontWeight="700" fill="#FF3B30" textAnchor="middle">97</text>
      <text x="51" y="108" fontSize="7" fill="#8E8E93" textAnchor="middle">subjects</text>
      <text x="51" y="124" fontSize="8" fill="#1C1C1E" textAnchor="middle">Defence</text>
      <text x="51" y="136" fontSize="8" fill="#1C1C1E" textAnchor="middle">Foreign affairs</text>
      <text x="51" y="148" fontSize="8" fill="#1C1C1E" textAnchor="middle">Currency</text>
      <text x="51" y="160" fontSize="7" fill="#FF3B30" textAnchor="middle">Parliament only</text>
      <rect x="103" y="38" width="74" height="132" rx="8" fill="#007AFF" fillOpacity="0.08" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="140" y="58" fontSize="9" fontWeight="700" fill="#007AFF" textAnchor="middle">State List</text>
      <text x="140" y="74" fontSize="18" textAnchor="middle">🏠</text>
      <text x="140" y="94" fontSize="11" fontWeight="700" fill="#007AFF" textAnchor="middle">66</text>
      <text x="140" y="108" fontSize="7" fill="#8E8E93" textAnchor="middle">subjects</text>
      <text x="140" y="124" fontSize="8" fill="#1C1C1E" textAnchor="middle">Police</text>
      <text x="140" y="136" fontSize="8" fill="#1C1C1E" textAnchor="middle">Agriculture</text>
      <text x="140" y="148" fontSize="8" fill="#1C1C1E" textAnchor="middle">Trade, commerce</text>
      <text x="140" y="160" fontSize="7" fill="#007AFF" textAnchor="middle">State legislature</text>
      <rect x="192" y="38" width="74" height="132" rx="8" fill="#34C759" fillOpacity="0.08" stroke="#34C759" strokeWidth="1.5"/>
      <text x="229" y="58" fontSize="9" fontWeight="700" fill="#34C759" textAnchor="middle">Concurrent</text>
      <text x="229" y="74" fontSize="18" textAnchor="middle">🤝</text>
      <text x="229" y="94" fontSize="11" fontWeight="700" fill="#34C759" textAnchor="middle">47</text>
      <text x="229" y="108" fontSize="7" fill="#8E8E93" textAnchor="middle">subjects</text>
      <text x="229" y="124" fontSize="8" fill="#1C1C1E" textAnchor="middle">Education</text>
      <text x="229" y="136" fontSize="8" fill="#1C1C1E" textAnchor="middle">Forests</text>
      <text x="229" y="148" fontSize="8" fill="#1C1C1E" textAnchor="middle">Marriage laws</text>
      <text x="229" y="160" fontSize="7" fill="#34C759" textAnchor="middle">Both (Centre wins)</text>
    </svg>
  );
}

function FederalismIndia() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#FF9500" fillOpacity="0.15" stroke="#FF9500" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#FF9500" textAnchor="middle">India's Federal System</text>
      <rect x="14" y="38" width="116" height="80" rx="8" fill="#007AFF" fillOpacity="0.08" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="72" y="56" fontSize="9" fontWeight="700" fill="#007AFF" textAnchor="middle">Coming Together</text>
      <text x="72" y="70" fontSize="8" fill="#1C1C1E" textAnchor="middle">Independent states</text>
      <text x="72" y="82" fontSize="8" fill="#1C1C1E" textAnchor="middle">come together as</text>
      <text x="72" y="94" fontSize="8" fill="#1C1C1E" textAnchor="middle">equal partners</text>
      <text x="72" y="108" fontSize="8" fill="#8E8E93" textAnchor="middle">USA, Australia, Switzerland</text>
      <rect x="150" y="38" width="116" height="80" rx="8" fill="#34C759" fillOpacity="0.08" stroke="#34C759" strokeWidth="1.5"/>
      <text x="208" y="56" fontSize="9" fontWeight="700" fill="#34C759" textAnchor="middle">Holding Together</text>
      <text x="208" y="70" fontSize="8" fill="#1C1C1E" textAnchor="middle">One nation divided</text>
      <text x="208" y="82" fontSize="8" fill="#1C1C1E" textAnchor="middle">into sub-units for</text>
      <text x="208" y="94" fontSize="8" fill="#1C1C1E" textAnchor="middle">diversity management</text>
      <text x="208" y="108" fontSize="8" fill="#8E8E93" textAnchor="middle">India, Spain, Belgium</text>
      <rect x="10" y="128" width="260" height="64" rx="8" fill="#F2F2F7"/>
      <text x="140" y="146" fontSize="10" fontWeight="700" fill="#FF3B30" textAnchor="middle">India: Quasi-Federal</text>
      <text x="140" y="162" fontSize="9" fill="#8E8E93" textAnchor="middle">Federal in structure, unitary in spirit</text>
      <text x="140" y="176" fontSize="9" fill="#8E8E93" textAnchor="middle">Centre stronger: Governor, President's Rule, Emergency</text>
      <text x="140" y="188" fontSize="8" fill="#8E8E93" textAnchor="middle">Linguistic reorganisation 1956 — States formed on language basis</text>
    </svg>
  );
}

function Decentralisation() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#FF9500" fillOpacity="0.15" stroke="#FF9500" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#FF9500" textAnchor="middle">73rd/74th Amendment — 3-tier Govt.</text>
      <rect x="94" y="36" width="92" height="30" rx="6" fill="#FF3B30" fillOpacity="0.12" stroke="#FF3B30" strokeWidth="1.5"/>
      <text x="140" y="55" fontSize="10" fontWeight="700" fill="#FF3B30" textAnchor="middle">CENTRE (Union)</text>
      <line x1="140" y1="66" x2="140" y2="80" stroke="#C7C7CC" strokeWidth="1.5"/>
      <rect x="74" y="80" width="132" height="30" rx="6" fill="#FF9500" fillOpacity="0.12" stroke="#FF9500" strokeWidth="1.5"/>
      <text x="140" y="99" fontSize="10" fontWeight="700" fill="#FF9500" textAnchor="middle">STATE GOVERNMENT</text>
      <line x1="140" y1="110" x2="140" y2="124" stroke="#C7C7CC" strokeWidth="1.5"/>
      <rect x="14" y="124" width="252" height="30" rx="6" fill="#34C759" fillOpacity="0.12" stroke="#34C759" strokeWidth="1.5"/>
      <text x="140" y="143" fontSize="10" fontWeight="700" fill="#34C759" textAnchor="middle">LOCAL BODIES (Panchayati Raj / Nagarpalika)</text>
      <rect x="10" y="164" width="260" height="28" rx="6" fill="#F2F2F7"/>
      <text x="140" y="178" fontSize="9" fontWeight="700" fill="#1C1C1E" textAnchor="middle">73rd Amend: Rural (Gram Panchayat → Samiti → Zila Parishad)</text>
      <text x="140" y="190" fontSize="8" fill="#8E8E93" textAnchor="middle">74th Amend: Urban (Ward → Municipal Council → Corporation) · ⅓ women reserved</text>
    </svg>
  );
}

function SocialDivisions() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#FF9500" fillOpacity="0.15" stroke="#FF9500" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#FF9500" textAnchor="middle">Overlapping vs Cross-cutting Divisions</text>
      <rect x="14" y="38" width="116" height="120" rx="8" fill="#FF3B30" fillOpacity="0.07" stroke="#FF3B30" strokeWidth="2"/>
      <text x="72" y="58" fontSize="9" fontWeight="700" fill="#FF3B30" textAnchor="middle">Overlapping ⚠️</text>
      <text x="72" y="74" fontSize="8" fill="#1C1C1E" textAnchor="middle">Same group</text>
      <text x="72" y="86" fontSize="8" fill="#1C1C1E" textAnchor="middle">disadvantaged on</text>
      <text x="72" y="98" fontSize="8" fill="#1C1C1E" textAnchor="middle">multiple dimensions</text>
      <text x="72" y="116" fontSize="8" fill="#8E8E93" textAnchor="middle">Race = caste = class</text>
      <text x="72" y="130" fontSize="8" fill="#FF3B30" textAnchor="middle">→ DANGEROUS</text>
      <text x="72" y="146" fontSize="7" fill="#8E8E93" textAnchor="middle">N. Ireland, Yugoslavia</text>
      <rect x="150" y="38" width="116" height="120" rx="8" fill="#34C759" fillOpacity="0.07" stroke="#34C759" strokeWidth="2"/>
      <text x="208" y="58" fontSize="9" fontWeight="700" fill="#34C759" textAnchor="middle">Cross-cutting ✓</text>
      <text x="208" y="74" fontSize="8" fill="#1C1C1E" textAnchor="middle">Different groups</text>
      <text x="208" y="86" fontSize="8" fill="#1C1C1E" textAnchor="middle">on different issues;</text>
      <text x="208" y="98" fontSize="8" fill="#1C1C1E" textAnchor="middle">everyone wins and</text>
      <text x="208" y="110" fontSize="8" fill="#1C1C1E" textAnchor="middle">loses sometimes</text>
      <text x="208" y="130" fontSize="8" fill="#34C759" textAnchor="middle">→ HEALTHY</text>
      <text x="208" y="146" fontSize="7" fill="#8E8E93" textAnchor="middle">Reduces conflict</text>
      <rect x="10" y="166" width="260" height="26" rx="6" fill="#F2F2F7"/>
      <text x="140" y="183" fontSize="8" fill="#8E8E93" textAnchor="middle">Overlapping divisions: deepen conflict. Cross-cutting: reduce tension.</text>
    </svg>
  );
}

function PoliticsDivisions() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#FF9500" fillOpacity="0.15" stroke="#FF9500" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#FF9500" textAnchor="middle">3 Factors: Outcomes of Social Divisions</text>
      <rect x="14" y="38" width="74" height="120" rx="8" fill="#007AFF" fillOpacity="0.08" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="51" y="58" fontSize="9" fontWeight="700" fill="#007AFF" textAnchor="middle">Factor 1</text>
      <text x="51" y="74" fontSize="8" fill="#1C1C1E" textAnchor="middle">Identity</text>
      <text x="51" y="86" fontSize="8" fill="#1C1C1E" textAnchor="middle">Perception</text>
      <text x="51" y="102" fontSize="7" fill="#8E8E93" textAnchor="middle">Exclusive identity</text>
      <text x="51" y="114" fontSize="7" fill="#8E8E93" textAnchor="middle">= dangerous</text>
      <text x="51" y="126" fontSize="7" fill="#34C759" textAnchor="middle">Non-exclusive</text>
      <text x="51" y="138" fontSize="7" fill="#34C759" textAnchor="middle">= manageable</text>
      <rect x="103" y="38" width="74" height="120" rx="8" fill="#FF9500" fillOpacity="0.08" stroke="#FF9500" strokeWidth="1.5"/>
      <text x="140" y="58" fontSize="9" fontWeight="700" fill="#FF9500" textAnchor="middle">Factor 2</text>
      <text x="140" y="74" fontSize="8" fill="#1C1C1E" textAnchor="middle">Political</text>
      <text x="140" y="86" fontSize="8" fill="#1C1C1E" textAnchor="middle">Leaders</text>
      <text x="140" y="102" fontSize="7" fill="#8E8E93" textAnchor="middle">Extremist leaders</text>
      <text x="140" y="114" fontSize="7" fill="#8E8E93" textAnchor="middle">= conflict</text>
      <text x="140" y="126" fontSize="7" fill="#34C759" textAnchor="middle">Moderate leaders</text>
      <text x="140" y="138" fontSize="7" fill="#34C759" textAnchor="middle">= peaceful</text>
      <rect x="192" y="38" width="74" height="120" rx="8" fill="#34C759" fillOpacity="0.08" stroke="#34C759" strokeWidth="1.5"/>
      <text x="229" y="58" fontSize="9" fontWeight="700" fill="#34C759" textAnchor="middle">Factor 3</text>
      <text x="229" y="74" fontSize="8" fill="#1C1C1E" textAnchor="middle">Government</text>
      <text x="229" y="86" fontSize="8" fill="#1C1C1E" textAnchor="middle">Response</text>
      <text x="229" y="102" fontSize="7" fill="#8E8E93" textAnchor="middle">Repression</text>
      <text x="229" y="114" fontSize="7" fill="#8E8E93" textAnchor="middle">= worse</text>
      <text x="229" y="126" fontSize="7" fill="#34C759" textAnchor="middle">Accommodation</text>
      <text x="229" y="138" fontSize="7" fill="#34C759" textAnchor="middle">= better</text>
      <rect x="10" y="166" width="260" height="26" rx="6" fill="#F2F2F7"/>
      <text x="140" y="183" fontSize="8" fill="#8E8E93" textAnchor="middle">Yugoslavia broke into 7 nations: all 3 factors went wrong simultaneously</text>
    </svg>
  );
}

function GenderPolitics() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#FF9500" fillOpacity="0.15" stroke="#FF9500" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#FF9500" textAnchor="middle">Gender Division — Women in Politics</text>
      <rect x="14" y="38" width="252" height="70" rx="8" fill="#F2F2F7"/>
      <text x="140" y="56" fontSize="9" fontWeight="700" fill="#1C1C1E" textAnchor="middle">Women in Parliament — International Comparison</text>
      <rect x="24" y="64" width="36" height="36" rx="4" fill="#34C759" fillOpacity="0.5"/>
      <text x="42" y="86" fontSize="9" fontWeight="700" fill="#fff" textAnchor="middle">40–50%</text>
      <text x="42" y="104" fontSize="8" fill="#34C759" textAnchor="middle">Nordic nations</text>
      <rect x="114" y="78" width="36" height="22" rx="4" fill="#FF9500" fillOpacity="0.5"/>
      <text x="132" y="92" fontSize="9" fontWeight="700" fill="#fff" textAnchor="middle">33%</text>
      <text x="132" y="104" fontSize="8" fill="#FF9500" textAnchor="middle">Panchayats India</text>
      <rect x="204" y="88" width="36" height="12" rx="4" fill="#FF3B30" fillOpacity="0.5"/>
      <text x="222" y="98" fontSize="8" fontWeight="700" fill="#fff" textAnchor="middle">14%</text>
      <text x="222" y="108" fontSize="8" fill="#FF3B30" textAnchor="middle">Lok Sabha</text>
      <rect x="14" y="118" width="252" height="72" rx="8" fill="#F2F2F7"/>
      <text x="140" y="136" fontSize="9" fontWeight="700" fill="#1C1C1E" textAnchor="middle">Gender Division = Social, NOT Biological</text>
      <circle cx="26" cy="152" r="4" fill="#FF9500"/>
      <text x="40" y="156" fontSize="8" fill="#1C1C1E">Patriarchy: male dominance · women do unpaid domestic work</text>
      <circle cx="26" cy="168" r="4" fill="#34C759"/>
      <text x="40" y="172" fontSize="8" fill="#1C1C1E">Feminist movements: political rights → then social equality</text>
      <circle cx="26" cy="184" r="4" fill="#007AFF"/>
      <text x="40" y="188" fontSize="8" fill="#1C1C1E">More women in parliament → better policies for women</text>
    </svg>
  );
}

function ReligionPolitics() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#FF9500" fillOpacity="0.15" stroke="#FF9500" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#FF9500" textAnchor="middle">Secularism vs Communalism</text>
      <rect x="14" y="38" width="116" height="118" rx="8" fill="#34C759" fillOpacity="0.08" stroke="#34C759" strokeWidth="1.5"/>
      <text x="72" y="58" fontSize="9" fontWeight="700" fill="#34C759" textAnchor="middle">Secularism ✓</text>
      <text x="72" y="74" fontSize="8" fill="#1C1C1E" textAnchor="middle">State treats all</text>
      <text x="72" y="86" fontSize="8" fill="#1C1C1E" textAnchor="middle">religions equally</text>
      <text x="72" y="100" fontSize="8" fill="#1C1C1E" textAnchor="middle">No state religion</text>
      <text x="72" y="116" fontSize="8" fill="#1C1C1E" textAnchor="middle">Article 25–28</text>
      <text x="72" y="130" fontSize="7" fill="#8E8E93" textAnchor="middle">NOT anti-religion</text>
      <text x="72" y="144" fontSize="7" fill="#8E8E93" textAnchor="middle">= equal respect</text>
      <rect x="150" y="38" width="116" height="118" rx="8" fill="#FF3B30" fillOpacity="0.06" stroke="#FF3B30" strokeWidth="1.5"/>
      <text x="208" y="58" fontSize="9" fontWeight="700" fill="#FF3B30" textAnchor="middle">Communalism ✗</text>
      <text x="208" y="74" fontSize="8" fill="#1C1C1E" textAnchor="middle">One religion seen</text>
      <text x="208" y="86" fontSize="8" fill="#1C1C1E" textAnchor="middle">as superior</text>
      <text x="208" y="100" fontSize="8" fill="#1C1C1E" textAnchor="middle">Enemy image of</text>
      <text x="208" y="112" fontSize="8" fill="#1C1C1E" textAnchor="middle">other religions</text>
      <text x="208" y="128" fontSize="8" fill="#FF3B30" textAnchor="middle">→ Riots, partition</text>
      <text x="208" y="144" fontSize="7" fill="#8E8E93" textAnchor="middle">misuse of religion</text>
      <rect x="10" y="164" width="260" height="28" rx="6" fill="#F2F2F7"/>
      <text x="140" y="178" fontSize="9" fontWeight="700" fill="#1C1C1E" textAnchor="middle">Communalism ≠ Religion</text>
      <text x="140" y="190" fontSize="8" fill="#8E8E93" textAnchor="middle">It is the POLITICAL misuse of religion — a critical distinction</text>
    </svg>
  );
}

function CastePolitics() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#FF9500" fillOpacity="0.15" stroke="#FF9500" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#FF9500" textAnchor="middle">Caste — Reservations &amp; Mandal Commission</text>
      <rect x="14" y="38" width="116" height="120" rx="8" fill="#F2F2F7"/>
      <text x="72" y="56" fontSize="9" fontWeight="700" fill="#1C1C1E" textAnchor="middle">Reservation in India</text>
      <rect x="24" y="64" width="92" height="18" rx="4" fill="#FF3B30" fillOpacity="0.4"/>
      <text x="70" y="77" fontSize="8" fontWeight="700" fill="#fff" textAnchor="middle">SC/ST: 22.5%</text>
      <rect x="24" y="88" width="92" height="18" rx="4" fill="#FF9500" fillOpacity="0.5"/>
      <text x="70" y="101" fontSize="8" fontWeight="700" fill="#fff" textAnchor="middle">OBC: 27% (Mandal 1980)</text>
      <rect x="24" y="112" width="92" height="18" rx="4" fill="#007AFF" fillOpacity="0.3"/>
      <text x="70" y="125" fontSize="8" fontWeight="700" fill="#fff" textAnchor="middle">EWS: 10% (2019)</text>
      <text x="72" y="150" fontSize="7" fill="#8E8E93" textAnchor="middle">Affirmative action</text>
      <rect x="150" y="38" width="116" height="120" rx="8" fill="#F2F2F7"/>
      <text x="208" y="56" fontSize="9" fontWeight="700" fill="#1C1C1E" textAnchor="middle">Caste &amp; Voting</text>
      <text x="208" y="72" fontSize="8" fill="#1C1C1E" textAnchor="middle">Politicians appeal to</text>
      <text x="208" y="84" fontSize="8" fill="#1C1C1E" textAnchor="middle">caste for votes</text>
      <text x="208" y="100" fontSize="8" fill="#8E8E93" textAnchor="middle">But caste ≠ only</text>
      <text x="208" y="112" fontSize="8" fill="#8E8E93" textAnchor="middle">factor in voting</text>
      <text x="208" y="126" fontSize="8" fill="#34C759" textAnchor="middle">Class, gender,</text>
      <text x="208" y="138" fontSize="8" fill="#34C759" textAnchor="middle">region also matter</text>
      <text x="208" y="152" fontSize="7" fill="#8E8E93" textAnchor="middle">Vote bank politics</text>
      <rect x="10" y="166" width="260" height="26" rx="6" fill="#F2F2F7"/>
      <text x="140" y="183" fontSize="8" fill="#8E8E93" textAnchor="middle">Mandal Commission 1980 → VP Singh govt. 1990 implemented OBC 27%</text>
    </svg>
  );
}

function PopularStruggles() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#FF9500" fillOpacity="0.15" stroke="#FF9500" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#FF9500" textAnchor="middle">Popular Struggles — Bolivia &amp; Nepal</text>
      <rect x="14" y="38" width="116" height="130" rx="8" fill="#007AFF" fillOpacity="0.07" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="72" y="56" fontSize="9" fontWeight="700" fill="#007AFF" textAnchor="middle">Bolivia 2000</text>
      <text x="72" y="72" fontSize="8" fill="#1C1C1E" textAnchor="middle">World Bank forced</text>
      <text x="72" y="84" fontSize="8" fill="#1C1C1E" textAnchor="middle">water privatisation</text>
      <text x="72" y="98" fontSize="8" fill="#FF3B30" textAnchor="middle">Price tripled!</text>
      <text x="72" y="114" fontSize="8" fill="#1C1C1E" textAnchor="middle">FEDECOR led</text>
      <text x="72" y="126" fontSize="8" fill="#1C1C1E" textAnchor="middle">mass protests</text>
      <text x="72" y="142" fontSize="8" fontWeight="700" fill="#34C759" textAnchor="middle">Govt. reversed!</text>
      <text x="72" y="158" fontSize="7" fill="#8E8E93" textAnchor="middle">Water re-nationalised</text>
      <rect x="150" y="38" width="116" height="130" rx="8" fill="#34C759" fillOpacity="0.07" stroke="#34C759" strokeWidth="1.5"/>
      <text x="208" y="56" fontSize="9" fontWeight="700" fill="#34C759" textAnchor="middle">Nepal 2006</text>
      <text x="208" y="72" fontSize="8" fill="#1C1C1E" textAnchor="middle">King Gyanendra</text>
      <text x="208" y="84" fontSize="8" fill="#1C1C1E" textAnchor="middle">dismissed parliament</text>
      <text x="208" y="98" fontSize="8" fill="#1C1C1E" textAnchor="middle">2002 — took power</text>
      <text x="208" y="114" fontSize="8" fill="#1C1C1E" textAnchor="middle">SPA (7-party alliance)</text>
      <text x="208" y="126" fontSize="8" fill="#1C1C1E" textAnchor="middle">+ Maoists called</text>
      <text x="208" y="138" fontSize="8" fill="#1C1C1E" textAnchor="middle">general strike</text>
      <text x="208" y="152" fontSize="8" fontWeight="700" fill="#34C759" textAnchor="middle">Democracy restored!</text>
      <rect x="10" y="176" width="260" height="18" rx="4" fill="#F2F2F7"/>
      <text x="140" y="188" fontSize="8" fill="#8E8E93" textAnchor="middle">Both show: people's movements can override powerful institutions</text>
    </svg>
  );
}

function PressureGroups() {
  return (
    <svg viewBox="0 0 280 200" width="280" height="200" fontFamily="system-ui,sans-serif">
      <rect x="10" y="8" width="260" height="22" rx="6" fill="#FF9500" fillOpacity="0.15" stroke="#FF9500" strokeWidth="1.5"/>
      <text x="140" y="23" fontSize="11" fontWeight="700" fill="#FF9500" textAnchor="middle">Pressure Groups vs Political Parties</text>
      <rect x="14" y="38" width="116" height="122" rx="8" fill="#007AFF" fillOpacity="0.07" stroke="#007AFF" strokeWidth="1.5"/>
      <text x="72" y="56" fontSize="9" fontWeight="700" fill="#007AFF" textAnchor="middle">Pressure Groups</text>
      <text x="72" y="72" fontSize="8" fill="#1C1C1E" textAnchor="middle">Organised interest</text>
      <text x="72" y="84" fontSize="8" fill="#1C1C1E" textAnchor="middle">groups</text>
      <text x="72" y="100" fontSize="8" fontWeight="700" fill="#FF3B30" textAnchor="middle">Don't contest</text>
      <text x="72" y="112" fontSize="8" fontWeight="700" fill="#FF3B30" textAnchor="middle">elections</text>
      <text x="72" y="128" fontSize="7" fill="#8E8E93" textAnchor="middle">Sectional: trade unions,</text>
      <text x="72" y="140" fontSize="7" fill="#8E8E93" textAnchor="middle">business assoc.</text>
      <text x="72" y="154" fontSize="7" fill="#8E8E93" textAnchor="middle">Public interest: NBA,</text>
      <text x="72" y="164" fontSize="7" fill="#8E8E93" textAnchor="middle">Chipko, BAMCEF</text>
      <rect x="150" y="38" width="116" height="122" rx="8" fill="#34C759" fillOpacity="0.07" stroke="#34C759" strokeWidth="1.5"/>
      <text x="208" y="56" fontSize="9" fontWeight="700" fill="#34C759" textAnchor="middle">Political Parties</text>
      <text x="208" y="72" fontSize="8" fill="#1C1C1E" textAnchor="middle">Seek political</text>
      <text x="208" y="84" fontSize="8" fill="#1C1C1E" textAnchor="middle">power directly</text>
      <text x="208" y="100" fontSize="8" fontWeight="700" fill="#34C759" textAnchor="middle">Contest elections</text>
      <text x="208" y="114" fontSize="8" fontWeight="700" fill="#34C759" textAnchor="middle">want to govern</text>
      <text x="208" y="130" fontSize="7" fill="#8E8E93" textAnchor="middle">Represent broad</text>
      <text x="208" y="142" fontSize="7" fill="#8E8E93" textAnchor="middle">social coalition</text>
      <text x="208" y="158" fontSize="7" fill="#8E8E93" textAnchor="middle">Form government</text>
      <rect x="10" y="168" width="260" height="24" rx="6" fill="#F2F2F7"/>
      <text x="140" y="184" fontSize="8" fill="#8E8E93" textAnchor="middle">Methods: lobbying · strikes · petitions · agitations · media campaigns</text>
    </svg>
  );
}

/* ── ICSE MATH 10 ────────────────────────────────────────────────── */

// Ch12 — Reflection
function IcseReflectionBasics() {
  return (
    <svg viewBox="0 0 300 260" style={{ width:"100%", maxWidth:300, height:"auto" }}>
      <line x1="150" y1="10" x2="150" y2="250" stroke="#E5E5EA" strokeWidth="1"/>
      <line x1="10" y1="130" x2="290" y2="130" stroke="#E5E5EA" strokeWidth="1"/>
      <line x1="150" y1="10" x2="150" y2="250" stroke="#3A3A3C" strokeWidth="1.5" markerEnd="url(#arr)"/>
      <line x1="10" y1="130" x2="290" y2="130" stroke="#3A3A3C" strokeWidth="1.5" markerEnd="url(#arr)"/>
      <defs><marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#3A3A3C"/></marker></defs>
      <T x={286} y={125} size={9}>x</T><T x={153} y={14} size={9}>y</T>
      {/* P(3,2) */}
      <circle cx="210" cy="90" r="5" fill="#007AFF"/>
      <T x={216} y={87} size={9} bold color="#007AFF">P(3,2)</T>
      {/* P' reflection in x-axis P'(3,-2) */}
      <circle cx="210" cy="170" r="5" fill="#FF3B30"/>
      <T x={216} y={174} size={9} bold color="#FF3B30">P′(3,−2)</T>
      <line x1="210" y1="90" x2="210" y2="170" stroke="#FF3B30" strokeWidth="1" strokeDasharray="4,2"/>
      <T x={215} y={132} size={8} color="#FF3B30">Mx: y→−y</T>
      {/* P'' reflection in y-axis P''(-3,2) */}
      <circle cx="90" cy="90" r="5" fill="#34C759"/>
      <T x={36} y={87} size={9} bold color="#34C759">P″(−3,2)</T>
      <line x1="90" y1="90" x2="210" y2="90" stroke="#34C759" strokeWidth="1" strokeDasharray="4,2"/>
      <T x={138} y={82} size={8} color="#34C759">My: x→−x</T>
      <T x={6} y={248} size={8} color="#8E8E93">Mx: reflection in x-axis (y changes sign)</T>
      <T x={6} y={260} size={8} color="#8E8E93">My: reflection in y-axis (x changes sign)</T>
    </svg>
  );
}
function IcseReflectionAxes() {
  return (
    <svg viewBox="0 0 300 260" style={{ width:"100%", maxWidth:300, height:"auto" }}>
      <line x1="150" y1="8" x2="150" y2="252" stroke="#3A3A3C" strokeWidth="1.5"/>
      <line x1="8" y1="130" x2="292" y2="130" stroke="#3A3A3C" strokeWidth="1.5"/>
      <T x={286} y={125} size={9}>x</T><T x={153} y={12} size={9}>y</T>
      {[1,2,3].forEach(()=>{})}
      <circle cx="210" cy="80" r="5" fill="#007AFF"/>
      <T x={215} y={77} size={9} bold color="#007AFF">P(3,3)</T>
      <circle cx="210" cy="180" r="5" fill="#FF3B30"/>
      <T x={215} y={184} size={9} bold color="#FF3B30">Mx P′(3,−3)</T>
      <circle cx="90" cy="80" r="5" fill="#34C759"/>
      <T x={20} y={77} size={9} bold color="#34C759">My P″(−3,3)</T>
      <circle cx="90" cy="180" r="5" fill="#AF52DE"/>
      <T x={20} y={184} size={9} bold color="#AF52DE">MO P‴(−3,−3)</T>
      <line x1="210" y1="80" x2="210" y2="180" stroke="#FF3B30" strokeWidth="1" strokeDasharray="3,2"/>
      <line x1="90" y1="80" x2="210" y2="80" stroke="#34C759" strokeWidth="1" strokeDasharray="3,2"/>
      <line x1="90" y1="80" x2="90" y2="180" stroke="#AF52DE" strokeWidth="1" strokeDasharray="3,2"/>
      <line x1="90" y1="180" x2="210" y2="180" stroke="#AF52DE" strokeWidth="1" strokeDasharray="3,2"/>
      <T x={6} y={248} size={8} color="#FF3B30">Mx: (x,y)→(x,−y)</T>
      <T x={6} y={260} size={8} color="#34C759">My: (x,y)→(−x,y)   </T>
      <T x={155} y={260} size={8} color="#AF52DE">MO: (x,y)→(−x,−y)</T>
    </svg>
  );
}
function IcseReflectionLines() {
  return (
    <svg viewBox="0 0 300 260" style={{ width:"100%", maxWidth:300, height:"auto" }}>
      <line x1="150" y1="8" x2="150" y2="252" stroke="#3A3A3C" strokeWidth="1.5"/>
      <line x1="8" y1="130" x2="292" y2="130" stroke="#3A3A3C" strokeWidth="1.5"/>
      <line x1="30" y1="230" x2="270" y2="30" stroke="#FF9500" strokeWidth="1.5" strokeDasharray="5,3"/>
      <T x={240} y={28} size={9} color="#FF9500">y=x</T>
      <line x1="30" y1="30" x2="270" y2="230" stroke="#AF52DE" strokeWidth="1.5" strokeDasharray="5,3"/>
      <T x={240} y={232} size={9} color="#AF52DE">y=−x</T>
      <circle cx="220" cy="80" r="5" fill="#007AFF"/>
      <T x={225} y={77} size={9} bold color="#007AFF">P(a,b)</T>
      <circle cx="80" cy="220" r="5" fill="#FF9500"/>
      <T x={30} y={218} size={9} bold color="#FF9500">P′(b,a)</T>
      <line x1="220" y1="80" x2="80" y2="220" stroke="#FF9500" strokeWidth="1" strokeDasharray="3,2"/>
      <circle cx="80" cy="80" r="5" fill="#AF52DE"/>
      <T x={24} y={77} size={9} bold color="#AF52DE">P″(−b,−a)</T>
      <line x1="220" y1="80" x2="80" y2="80" stroke="#AF52DE" strokeWidth="1" strokeDasharray="3,2"/>
      <line x1="80" y1="80" x2="80" y2="220" stroke="#AF52DE" strokeWidth="1" strokeDasharray="3,2"/>
      <T x={6} y={248} size={8} color="#FF9500">M(y=x): (a,b)→(b,a)</T>
      <T x={6} y={260} size={8} color="#AF52DE">M(y=−x): (a,b)→(−b,−a)</T>
    </svg>
  );
}
function IcseReflectionProblems() {
  return (
    <svg viewBox="0 0 300 220" style={{ width:"100%", maxWidth:300, height:"auto" }}>
      <line x1="150" y1="8" x2="150" y2="212" stroke="#3A3A3C" strokeWidth="1.5"/>
      <line x1="8" y1="110" x2="292" y2="110" stroke="#3A3A3C" strokeWidth="1.5"/>
      <T x={286} y={106} size={9}>x</T><T x={153} y={12} size={9}>y</T>
      <circle cx="220" cy="60" r="5" fill="#007AFF"/>
      <T x={225} y={57} size={9} bold color="#007AFF">A(3,2)</T>
      <circle cx="220" cy="160" r="5" fill="#FF3B30"/>
      <T x={225} y={164} size={9} bold color="#FF3B30">A′ Mx</T>
      <circle cx="80" cy="60" r="5" fill="#34C759"/>
      <T x={24} y={57} size={9} bold color="#34C759">A″ My</T>
      <circle cx="60" cy="160" r="5" fill="#FF9500"/>
      <T x={4} y={164} size={9} bold color="#FF9500">A‴ y=x</T>
      <line x1="220" y1="60" x2="220" y2="160" stroke="#FF3B30" strokeWidth="1" strokeDasharray="3,2"/>
      <line x1="80" y1="60" x2="220" y2="60" stroke="#34C759" strokeWidth="1" strokeDasharray="3,2"/>
      <polygon points="220,60 220,160 80,60 60,160" fill="none" stroke="#8E8E93" strokeWidth="1" strokeDasharray="2,2"/>
      <T x={6} y={196} size={8} color="#8E8E93">Composite: apply reflections in sequence</T>
      <T x={6} y={208} size={8} color="#8E8E93">Order matters: Mx then My ≠ My then Mx</T>
    </svg>
  );
}

// Ch13 — Section Formula
function IcseSectionInternal() {
  return (
    <svg viewBox="0 0 300 160" style={{ width:"100%", maxWidth:300, height:"auto" }}>
      <line x1="30" y1="80" x2="270" y2="80" stroke="#3A3A3C" strokeWidth="2"/>
      <circle cx="30" cy="80" r="5" fill="#007AFF"/><T x={18} y={72} size={9} bold color="#007AFF">A</T><T x={14} y={96} size={8}>(x₁,y₁)</T>
      <circle cx="270" cy="80" r="5" fill="#007AFF"/><T x={262} y={72} size={9} bold color="#007AFF">B</T><T x={255} y={96} size={8}>(x₂,y₂)</T>
      <circle cx="150" cy="80" r="6" fill="#FF3B30"/>
      <T x={144} y={68} size={9} bold color="#FF3B30">P</T>
      <line x1="30" y1="96" x2="150" y2="96" stroke="#FF3B30" strokeWidth="1.5" markerEnd="url(#a2)"/>
      <defs><marker id="a2" markerWidth="5" markerHeight="5" refX="3" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5 Z" fill="#FF3B30"/></marker></defs>
      <T x={82} y={110} size={9} color="#FF3B30">m</T>
      <line x1="150" y1="96" x2="270" y2="96" stroke="#34C759" strokeWidth="1.5"/>
      <T x={202} y={110} size={9} color="#34C759">n</T>
      <rect x="20" y="120" width="260" height="34" rx="6" fill="#F2F2F7"/>
      <T x={150} y={133} size={9} bold color="#1C1C1E" align="middle">P = ( mx₂+nx₁ , my₂+ny₁ )</T>
      <T x={150} y={148} size={9} color="#8E8E93" align="middle">m+n         m+n</T>
    </svg>
  );
}
function IcseSectionExternal() {
  return (
    <svg viewBox="0 0 300 160" style={{ width:"100%", maxWidth:300, height:"auto" }}>
      <line x1="20" y1="80" x2="280" y2="80" stroke="#3A3A3C" strokeWidth="2"/>
      <circle cx="80" cy="80" r="5" fill="#007AFF"/><T x={68} y={70} size={9} bold color="#007AFF">A(x₁,y₁)</T>
      <circle cx="200" cy="80" r="5" fill="#007AFF"/><T x={188} y={70} size={9} bold color="#007AFF">B(x₂,y₂)</T>
      <circle cx="260" cy="80" r="7" fill="#FF9500"/>
      <T x={260} y={66} size={9} bold color="#FF9500" align="middle">P (external)</T>
      <line x1="80" y1="96" x2="260" y2="96" stroke="#FF9500" strokeWidth="1.5"/>
      <T x={168} y={110} size={9} color="#FF9500">m (AP)</T>
      <line x1="200" y1="108" x2="260" y2="108" stroke="#34C759" strokeWidth="1.5"/>
      <T x={224} y={122} size={9} color="#34C759">n (BP)</T>
      <rect x="20" y="124" width="260" height="30" rx="6" fill="#F2F2F7"/>
      <T x={150} y={137} size={9} bold color="#1C1C1E" align="middle">P = ( mx₂−nx₁ , my₂−ny₁ )</T>
      <T x={150} y={150} size={9} color="#8E8E93" align="middle">m−n         m−n</T>
    </svg>
  );
}
function IcseMidpoint() {
  return (
    <svg viewBox="0 0 300 180" style={{ width:"100%", maxWidth:300, height:"auto" }}>
      <line x1="30" y1="90" x2="270" y2="90" stroke="#3A3A3C" strokeWidth="2"/>
      <circle cx="30" cy="90" r="5" fill="#007AFF"/><T x={20} y={80} size={9} bold color="#007AFF">A</T><T x={14} y={104} size={8}>(x₁,y₁)</T>
      <circle cx="270" cy="90" r="5" fill="#007AFF"/><T x={260} y={80} size={9} bold color="#007AFF">B</T><T x={254} y={104} size={8}>(x₂,y₂)</T>
      <circle cx="150" cy="90" r="6" fill="#34C759"/>
      <T x={144} y={78} size={9} bold color="#34C759">M</T>
      <line x1="30" y1="106" x2="150" y2="106" stroke="#34C759" strokeWidth="1.5"/>
      <line x1="150" y1="106" x2="270" y2="106" stroke="#34C759" strokeWidth="1.5"/>
      <T x={82} y={120} size={9} color="#34C759">equal</T>
      <T x={202} y={120} size={9} color="#34C759">equal</T>
      <rect x="40" y="136" width="220" height="36" rx="6" fill="#F2F2F7"/>
      <T x={150} y={150} size={9} bold color="#1C1C1E" align="middle">M = ( x₁+x₂  ,  y₁+y₂ )</T>
      <T x={150} y={166} size={9} color="#8E8E93" align="middle">     2            2</T>
    </svg>
  );
}
function IcseSectionProblems() {
  return (
    <svg viewBox="0 0 280 240" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      <polygon points="140,20 30,200 250,200" fill="#EEF2FF" stroke="#6366F1" strokeWidth="2"/>
      <circle cx="140" cy="20" r="5" fill="#6366F1"/><T x={144} y={18} size={9} bold color="#6366F1">A(x₁,y₁)</T>
      <circle cx="30" cy="200" r="5" fill="#6366F1"/><T x={4} y={214} size={9} bold color="#6366F1">B(x₂,y₂)</T>
      <circle cx="250" cy="200" r="5" fill="#6366F1"/><T x={218} y={214} size={9} bold color="#6366F1">C(x₃,y₃)</T>
      <circle cx="140" cy="140" r="6" fill="#FF3B30"/>
      <T x={144} y={138} size={9} bold color="#FF3B30">G</T>
      <line x1="140" y1="20" x2="140" y2="200" stroke="#8E8E93" strokeWidth="1" strokeDasharray="3,2"/>
      <line x1="30" y1="200" x2="250" y2="200" stroke="#8E8E93" strokeWidth="1" strokeDasharray="3,2"/>
      <line x1="250" y1="200" x2="140" y2="20" stroke="#8E8E93" strokeWidth="1" strokeDasharray="3,2"/>
      <rect x="20" y="216" width="240" height="20" rx="5" fill="#F2F2F7"/>
      <T x={140} y={230} size={9} bold color="#FF3B30" align="middle">Centroid G = ((x₁+x₂+x₃)/3, (y₁+y₂+y₃)/3)</T>
    </svg>
  );
}

// Ch14 — Equation of a Line
function IcseSlope() {
  return (
    <svg viewBox="0 0 300 220" style={{ width:"100%", maxWidth:300, height:"auto" }}>
      <line x1="20" y1="200" x2="280" y2="200" stroke="#3A3A3C" strokeWidth="1.5"/>
      <line x1="40" y1="210" x2="40" y2="10" stroke="#3A3A3C" strokeWidth="1.5"/>
      <T x={276} y={196} size={9}>x</T><T x={43} y={14} size={9}>y</T>
      <line x1="60" y1="180" x2="240" y2="60" stroke="#007AFF" strokeWidth="2.5"/>
      <circle cx="80" cy="168" r="4" fill="#007AFF"/><T x={84} y={165} size={8}>(x₁,y₁)</T>
      <circle cx="200" cy="88" r="4" fill="#007AFF"/><T x={204} y={85} size={8}>(x₂,y₂)</T>
      <line x1="80" y1="168" x2="200" y2="168" stroke="#FF3B30" strokeWidth="1.5"/>
      <line x1="200" y1="168" x2="200" y2="88" stroke="#34C759" strokeWidth="1.5"/>
      <T x={134} y={182} size={9} color="#FF3B30">Run = x₂−x₁</T>
      <T x={204} y={132} size={9} color="#34C759">Rise = y₂−y₁</T>
      <rect x="60" y="192" width="180" height="18" rx="5" fill="#F2F2F7"/>
      <T x={150} y={205} size={9} bold color="#1C1C1E" align="middle">m = Rise/Run = (y₂−y₁)/(x₂−x₁)</T>
    </svg>
  );
}
function IcseLineForms() {
  return (
    <svg viewBox="0 0 300 220" style={{ width:"100%", maxWidth:300, height:"auto" }}>
      <line x1="20" y1="160" x2="280" y2="160" stroke="#3A3A3C" strokeWidth="1.5"/>
      <line x1="60" y1="210" x2="60" y2="10" stroke="#3A3A3C" strokeWidth="1.5"/>
      <T x={276} y={156} size={9}>x</T><T x={63} y={14} size={9}>y</T>
      <line x1="60" y1="200" x2="250" y2="40" stroke="#007AFF" strokeWidth="2.5"/>
      <circle cx="60" cy="200" r="5" fill="#FF3B30"/>
      <T x={64} y={212} size={9} bold color="#FF3B30">y-int (0,c)</T>
      <line x1="60" y1="200" x2="228" y2="200" stroke="#FF3B30" strokeWidth="1" strokeDasharray="3,2"/>
      <circle cx="228" cy="160" r="5" fill="#34C759"/>
      <T x={210} y={154} size={9} bold color="#34C759">x-int (−c/m, 0)</T>
      <line x1="228" y1="160" x2="228" y2="200" stroke="#34C759" strokeWidth="1" strokeDasharray="3,2"/>
      <T x={110} y={90} size={11} bold color="#007AFF">y = mx + c</T>
      <T x={6} y={208} size={8} color="#8E8E93">m = slope (tan of angle with x-axis)</T>
      <T x={6} y={220} size={8} color="#8E8E93">c = y-intercept (value of y when x=0)</T>
    </svg>
  );
}
function IcseSpecialLines() {
  return (
    <svg viewBox="0 0 300 200" style={{ width:"100%", maxWidth:300, height:"auto" }}>
      <line x1="10" y1="100" x2="290" y2="100" stroke="#3A3A3C" strokeWidth="1.5"/>
      <line x1="150" y1="10" x2="150" y2="190" stroke="#3A3A3C" strokeWidth="1.5"/>
      <line x1="20" y1="50" x2="280" y2="50" stroke="#007AFF" strokeWidth="2"/>
      <T x={140} y={44} size={9} bold color="#007AFF">y = k (horizontal, m=0)</T>
      <line x1="200" y1="10" x2="200" y2="190" stroke="#34C759" strokeWidth="2"/>
      <T x={204} y={20} size={9} bold color="#34C759">x = h (vertical, m=∞)</T>
      <line x1="40" y1="170" x2="260" y2="40" stroke="#FF9500" strokeWidth="2"/>
      <T x={210} y={36} size={9} bold color="#FF9500">y=mx+c</T>
      <line x1="40" y1="40" x2="240" y2="170" stroke="#FF3B30" strokeWidth="2"/>
      <T x={198} y={170} size={9} bold color="#FF3B30">y=m′x+c′</T>
      <T x={100} y={112} size={8} color="#8E8E93">m·m′ = −1 (perpendicular)</T>
      <T x={6} y={192} size={8} color="#8E8E93">Parallel lines: same slope m. Perpendicular: m₁×m₂ = −1</T>
    </svg>
  );
}
function IcseLineProblems() {
  return (
    <svg viewBox="0 0 300 200" style={{ width:"100%", maxWidth:300, height:"auto" }}>
      <line x1="10" y1="100" x2="290" y2="100" stroke="#E5E5EA" strokeWidth="1"/>
      <line x1="150" y1="10" x2="150" y2="190" stroke="#E5E5EA" strokeWidth="1"/>
      <line x1="30" y1="170" x2="250" y2="30" stroke="#007AFF" strokeWidth="2"/>
      <T x={220} y={28} size={9} bold color="#007AFF">L₁: y=2x+1</T>
      <line x1="40" y1="40" x2="220" y2="180" stroke="#FF3B30" strokeWidth="2"/>
      <T x={198} y={180} size={9} bold color="#FF3B30">L₂: y=−½x+3</T>
      <circle cx="138" cy="62" r="5" fill="#FF9500"/>
      <T x={112} y={56} size={9} bold color="#FF9500">intersection</T>
      <line x1="138" y1="62" x2="138" y2="100" stroke="#FF9500" strokeWidth="1" strokeDasharray="3,2"/>
      <line x1="138" y1="62" x2="150" y2="62" stroke="#FF9500" strokeWidth="1" strokeDasharray="3,2"/>
      <T x={6} y={188} size={8} color="#8E8E93">Slopes: 2 × (−½) = −1 ✓ Lines are perpendicular</T>
      <T x={6} y={200} size={8} color="#8E8E93">Perp bisector passes through midpoint ⊥ to given line</T>
    </svg>
  );
}

// Ch15 — Similarity
function IcseSimilarityBasics() {
  return (
    <svg viewBox="0 0 300 200" style={{ width:"100%", maxWidth:300, height:"auto" }}>
      <polygon points="30,170 80,40 130,170" fill="#EEF2FF" stroke="#6366F1" strokeWidth="2"/>
      <T x={26} y={184} size={9} bold color="#6366F1">A</T><T x={76} y={34} size={9} bold color="#6366F1">B</T><T x={126} y={184} size={9} bold color="#6366F1">C</T>
      <polygon points="170,170 240,20 310,170" fill="#FEF3C7" stroke="#D97706" strokeWidth="2"/>
      <T x={166} y={184} size={9} bold color="#D97706">P</T><T x={236} y={14} size={9} bold color="#D97706">Q</T><T x={302} y={184} size={9} bold color="#D97706">R</T>
      <T x={75} y={196} size={8} color="#6366F1">△ABC</T>
      <T x={227} y={196} size={8} color="#D97706">△PQR (scaled by k)</T>
      <line x1="134" y1="100" x2="166" y2="100" stroke="#8E8E93" strokeWidth="1.5" strokeDasharray="4,2"/>
      <T x={138} y={118} size={8} color="#8E8E93">~</T>
      <T x={6} y={210} size={8} color="#8E8E93">∠A=∠P, ∠B=∠Q, ∠C=∠R  |  AB/PQ = BC/QR = AC/PR = k</T>
    </svg>
  );
}
function IcseSimilarityCriteria() {
  return (
    <svg viewBox="0 0 300 220" style={{ width:"100%", maxWidth:300, height:"auto" }}>
      <rect x="10" y="10" width="82" height="64" rx="6" fill="#EEF2FF" stroke="#6366F1" strokeWidth="1.5"/>
      <T x={51} y={30} size={9} bold color="#6366F1" align="middle">AA</T>
      <T x={51} y={46} size={8} color="#6366F1" align="middle">Two angles</T>
      <T x={51} y={58} size={8} color="#6366F1" align="middle">equal → ~</T>
      <rect x="109" y="10" width="82" height="64" rx="6" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5"/>
      <T x={150} y={30} size={9} bold color="#D97706" align="middle">SAS~</T>
      <T x={150} y={46} size={8} color="#D97706" align="middle">2 sides prop,</T>
      <T x={150} y={58} size={8} color="#D97706" align="middle">included ∠ =</T>
      <rect x="208" y="10" width="82" height="64" rx="6" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1.5"/>
      <T x={249} y={30} size={9} bold color="#16A34A" align="middle">SSS~</T>
      <T x={249} y={46} size={8} color="#16A34A" align="middle">All 3 sides</T>
      <T x={249} y={58} size={8} color="#16A34A" align="middle">proportional</T>
      <polygon points="20,160 80,90 140,160" fill="none" stroke="#6366F1" strokeWidth="1.5"/>
      <line x1="20" y1="160" x2="58" y2="160" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="80" y1="90" x2="80" y2="110" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round"/>
      <polygon points="160,160 220,90 280,160" fill="none" stroke="#D97706" strokeWidth="1.5"/>
      <line x1="160" y1="160" x2="195" y2="160" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="220" y1="90" x2="220" y2="110" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round"/>
      <T x={75} y={180} size={9} color="#6366F1" align="middle">△ 1</T><T x={220} y={180} size={9} color="#D97706" align="middle">△ 2 ~ △1</T>
      <T x={150} y={210} size={8} color="#8E8E93" align="middle">Areas ratio = k² (square of side ratio)</T>
    </svg>
  );
}
function IcseSimilarityBPT() {
  return (
    <svg viewBox="0 0 280 220" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      <polygon points="140,20 30,190 250,190" fill="#F0FDF4" stroke="#16A34A" strokeWidth="2"/>
      <T x={136} y={14} size={9} bold color="#16A34A">A</T>
      <T x={20} y={200} size={9} bold color="#16A34A">B</T>
      <T x={248} y={200} size={9} bold color="#16A34A">C</T>
      <line x1="75" y1="114" x2="205" y2="114" stroke="#FF3B30" strokeWidth="2"/>
      <circle cx="75" cy="114" r="4" fill="#FF3B30"/><T x={57} y={110} size={9} bold color="#FF3B30">D</T>
      <circle cx="205" cy="114" r="4" fill="#FF3B30"/><T x={208} y={110} size={9} bold color="#FF3B30">E</T>
      <T x={100} y={106} size={9} color="#FF3B30">DE ∥ BC</T>
      <T x={6} y={190} size={8} color="#8E8E93">AD/DB = AE/EC</T>
      <rect x="6" y="200" width="268" height="18" rx="5" fill="#F0FDF4"/>
      <T x={140} y={213} size={8} bold color="#16A34A" align="middle">BPT: A line ∥ to base divides sides proportionally</T>
    </svg>
  );
}
function IcseSimilarityProblems() {
  return (
    <svg viewBox="0 0 300 200" style={{ width:"100%", maxWidth:300, height:"auto" }}>
      <polygon points="60,170 110,50 160,170" fill="#EEF2FF" stroke="#6366F1" strokeWidth="2"/>
      <T x={56} y={184} size={9} bold color="#6366F1">A</T><T x={106} y={44} size={9} bold color="#6366F1">B</T><T x={156} y={184} size={9} bold color="#6366F1">C</T>
      <T x={95} y={120} size={9} color="#6366F1">3 cm</T><T x={116} y={120} size={9} color="#6366F1">4 cm</T><T x={104} y={180} size={9} color="#6366F1">5 cm</T>
      <polygon points="190,170 255,20 320,170" fill="#FEF3C7" stroke="#D97706" strokeWidth="2"/>
      <T x={186} y={184} size={9} bold color="#D97706">P</T><T x={251} y={14} size={9} bold color="#D97706">Q</T><T x={314} y={184} size={9} bold color="#D97706">R</T>
      <T x={218} y={100} size={9} color="#D97706">6 cm</T><T x={270} y={100} size={9} color="#D97706">8 cm</T><T x={244} y={180} size={9} color="#D97706">10 cm</T>
      <T x={150} y={196} size={8} bold color="#FF3B30" align="middle">k = 2  |  Area ratio = k² = 4</T>
    </svg>
  );
}

// Ch16 — Loci
function IcseLocusConcepts() {
  return (
    <svg viewBox="0 0 280 220" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      <circle cx="140" cy="110" r="70" fill="#EEF2FF" stroke="#6366F1" strokeWidth="2"/>
      <circle cx="140" cy="110" r="4" fill="#1C1C1E"/>
      <T x={144} y={108} size={9} bold>O</T>
      {[0,45,90,135,180,225,270,315].map((a,i)=>{
        const r=70, x=140+r*Math.cos(a*Math.PI/180), y=110+r*Math.sin(a*Math.PI/180);
        return <g key={i}><circle cx={x} cy={y} r={3} fill="#6366F1"/><line x1="140" y1="110" x2={x} y2={y} stroke="#6366F1" strokeWidth="1" strokeDasharray="3,2"/></g>;
      })}
      <T x={140} y={126} size={8} color="#6366F1" align="middle">r</T>
      <T x={140} y={194} size={9} bold color="#6366F1" align="middle">Circle: locus of points at distance r from O</T>
      <T x={140} y={208} size={8} color="#8E8E93" align="middle">Every point on circle satisfies OP = r (constant)</T>
    </svg>
  );
}
function IcseLocusProperties() {
  return (
    <svg viewBox="0 0 300 220" style={{ width:"100%", maxWidth:300, height:"auto" }}>
      <circle cx="80" cy="100" r="5" fill="#007AFF"/><T x={72} y={88} size={9} bold color="#007AFF">A</T>
      <circle cx="220" cy="100" r="5" fill="#007AFF"/><T x={218} y={88} size={9} bold color="#007AFF">B</T>
      <line x1="80" y1="100" x2="220" y2="100" stroke="#007AFF" strokeWidth="2"/>
      <line x1="150" y1="10" x2="150" y2="210" stroke="#FF3B30" strokeWidth="2" strokeDasharray="6,3"/>
      <T x={154} y={18} size={9} bold color="#FF3B30">Perp. bisector of AB</T>
      {[30,60,90,120,150,170].map((y,i)=>{
        const px=150;
        return <g key={i}><circle cx={px} cy={y} r={3} fill="#FF3B30"/><line x1={80} y1={100} x2={px} y2={y} stroke="#8E8E93" strokeWidth="1" strokeDasharray="2,2"/><line x1={220} y1={100} x2={px} y2={y} stroke="#8E8E93" strokeWidth="1" strokeDasharray="2,2"/></g>;
      })}
      <T x={6} y={208} size={8} color="#8E8E93">Locus equidistant from A and B = perpendicular bisector of AB</T>
    </svg>
  );
}
function IcseLocusConstructions() {
  return (
    <svg viewBox="0 0 280 220" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      <line x1="40" y1="150" x2="240" y2="150" stroke="#3A3A3C" strokeWidth="2"/>
      <line x1="40" y1="150" x2="140" y2="30" stroke="#3A3A3C" strokeWidth="2"/>
      <T x={36} y={162} size={9} bold>B</T><T x={236} y={162} size={9} bold>C</T><T x={136} y={24} size={9} bold>A</T>
      <line x1="140" y1="30" x2="140" y2="150" stroke="#FF3B30" strokeWidth="1.5" strokeDasharray="5,3"/>
      <line x1="40" y1="150" x2="190" y2="90" stroke="#34C759" strokeWidth="1.5" strokeDasharray="5,3"/>
      <line x1="240" y1="150" x2="90" y2="90" stroke="#007AFF" strokeWidth="1.5" strokeDasharray="5,3"/>
      <circle cx="140" cy="115" r="4" fill="#FF9500"/>
      <T x={144} y={112} size={9} bold color="#FF9500">I</T>
      <T x={6} y={196} size={8} color="#FF3B30">— Bisector of ∠A</T>
      <T x={6} y={208} size={8} color="#34C759">— Bisector of ∠B</T>
      <T x={6} y={220} size={8} color="#007AFF">— Bisector of ∠C  → meet at incenter I</T>
    </svg>
  );
}
function IcseLocusProblems() {
  return (
    <svg viewBox="0 0 280 220" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      <circle cx="140" cy="110" r="60" fill="none" stroke="#6366F1" strokeWidth="2" strokeDasharray="5,3"/>
      <T x={185} y={56} size={8} color="#6366F1">Locus 1: circle</T>
      <line x1="10" y1="110" x2="270" y2="110" stroke="#FF3B30" strokeWidth="2" strokeDasharray="5,3"/>
      <T x={170} y={104} size={8} color="#FF3B30">Locus 2: line</T>
      <circle cx="80" cy="110" r="6" fill="#FF9500"/>
      <T x={56} y={104} size={9} bold color="#FF9500">P₁</T>
      <circle cx="200" cy="110" r="6" fill="#FF9500"/>
      <T x={204} y={104} size={9} bold color="#FF9500">P₂</T>
      <T x={140} y={196} size={9} bold color="#FF9500" align="middle">Two intersection points = solution set</T>
      <T x={140} y={210} size={8} color="#8E8E93" align="middle">Intersection of two loci gives required point(s)</T>
    </svg>
  );
}

// Ch17 — Circles
function IcseCircleTheorems() {
  return (
    <svg viewBox="0 0 280 220" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      <circle cx="140" cy="110" r="80" fill="#F0F9FF" stroke="#0284C7" strokeWidth="2"/>
      <circle cx="140" cy="110" r="4" fill="#0284C7"/><T x={144} y={108} size={9} bold color="#0284C7">O</T>
      <line x1="60" y1="110" x2="220" y2="110" stroke="#0284C7" strokeWidth="2"/>
      <T x={50} y={118} size={9} bold color="#0284C7">A</T><T x={220} y={118} size={9} bold color="#0284C7">B</T>
      <T x={100} y={102} size={8} color="#8E8E93">diameter</T>
      <circle cx="140" cy="30" r="4" fill="#FF3B30"/>
      <T x={144} y={28} size={9} bold color="#FF3B30">P</T>
      <line x1="60" y1="110" x2="140" y2="30" stroke="#FF3B30" strokeWidth="1.5"/>
      <line x1="220" y1="110" x2="140" y2="30" stroke="#FF3B30" strokeWidth="1.5"/>
      <rect x="132" y="30" width="8" height="8" fill="none" stroke="#FF3B30" strokeWidth="1.5"/>
      <T x={140} y={190} size={9} bold color="#FF3B30" align="middle">∠APB = 90° (angle in semicircle)</T>
      <T x={140} y={204} size={8} color="#8E8E93" align="middle">Angle subtended by diameter at circumference = 90°</T>
    </svg>
  );
}
function IcseCircleChords() {
  return (
    <svg viewBox="0 0 280 220" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      <circle cx="140" cy="110" r="80" fill="#F0FDF4" stroke="#16A34A" strokeWidth="2"/>
      <circle cx="140" cy="110" r="4" fill="#16A34A"/><T x={144} y={108} size={9} bold color="#16A34A">O</T>
      <line x1="70" y1="70" x2="210" y2="150" stroke="#16A34A" strokeWidth="2"/>
      <T x={60} y={68} size={9} bold color="#16A34A">A</T><T x={212} y={152} size={9} bold color="#16A34A">B</T>
      <circle cx="140" cy="110" r="4" fill="#16A34A"/>
      <line x1="140" y1="110" x2="140" y2="110" stroke="none"/>
      {/* midpoint M of chord */}
      <circle cx="140" cy="110" r="3" fill="#FF3B30"/>
      <T x={144} y={108} size={8} color="#FF3B30">M</T>
      <line x1="140" y1="110" x2="140" y2="110"/>
      {/* perpendicular from O to chord */}
      <line x1="140" y1="110" x2="140" y2="110"/>
      <circle cx="140" cy="110" r="80" fill="none"/>
      {/* OM perpendicular to AB */}
      <line x1="140" y1="30" x2="140" y2="190" stroke="#FF3B30" strokeWidth="1.5" strokeDasharray="4,2"/>
      <T x={144} y={28} size={8} color="#FF3B30">OM ⊥ AB</T>
      <T x={140} y={204} size={9} bold color="#16A34A" align="middle">Perp from centre bisects chord: AM = MB</T>
      <T x={140} y={216} size={8} color="#8E8E93" align="middle">Equal chords are equidistant from centre</T>
    </svg>
  );
}
function IcseCircleArcAngle() {
  return (
    <svg viewBox="0 0 280 220" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      <circle cx="140" cy="120" r="80" fill="#FFF7ED" stroke="#EA580C" strokeWidth="2"/>
      <circle cx="140" cy="120" r="4" fill="#EA580C"/><T x={144} y={118} size={9} bold color="#EA580C">O</T>
      <circle cx="80" cy="60" r="4" fill="#1C1C1E"/><T x={72} y={54} size={9} bold>A</T>
      <circle cx="200" cy="60" r="4" fill="#1C1C1E"/><T x={202} y={54} size={9} bold>B</T>
      <circle cx="140" cy="200" r="4" fill="#6366F1"/><T x={130} y={214} size={9} bold color="#6366F1">P</T>
      <line x1="80" y1="60" x2="140" y2="120" stroke="#EA580C" strokeWidth="1.5"/>
      <line x1="200" y1="60" x2="140" y2="120" stroke="#EA580C" strokeWidth="1.5"/>
      <path d="M 104 120 A 20 20 0 0 1 176 120" fill="none" stroke="#EA580C" strokeWidth="1.5"/>
      <T x={140} y={116} size={8} bold color="#EA580C" align="middle">2θ</T>
      <line x1="80" y1="60" x2="140" y2="200" stroke="#6366F1" strokeWidth="1.5"/>
      <line x1="200" y1="60" x2="140" y2="200" stroke="#6366F1" strokeWidth="1.5"/>
      <T x={140} y={196} size={8} bold color="#6366F1" align="middle">θ</T>
      <T x={140} y={208} size={9} bold color="#EA580C" align="middle">∠AOB = 2 × ∠APB (central = 2 × inscribed)</T>
    </svg>
  );
}
function IcseCircleCyclicQuad() {
  return (
    <svg viewBox="0 0 280 220" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      <circle cx="140" cy="110" r="80" fill="#FDF4FF" stroke="#9333EA" strokeWidth="2"/>
      <circle cx="80" cy="50" r="4" fill="#9333EA"/><T x={70} y={44} size={9} bold color="#9333EA">A</T>
      <circle cx="210" cy="60" r="4" fill="#9333EA"/><T x={212} y={58} size={9} bold color="#9333EA">B</T>
      <circle cx="220" cy="170" r="4" fill="#9333EA"/><T x={222} y={172} size={9} bold color="#9333EA">C</T>
      <circle cx="70" cy="180" r="4" fill="#9333EA"/><T x={50} y={182} size={9} bold color="#9333EA">D</T>
      <polygon points="80,50 210,60 220,170 70,180" fill="none" stroke="#9333EA" strokeWidth="2"/>
      <T x={130} y={100} size={9} color="#9333EA">∠A+∠C=180°</T>
      <T x={130} y={114} size={9} color="#9333EA">∠B+∠D=180°</T>
      <T x={140} y={204} size={9} bold color="#9333EA" align="middle">Cyclic quad: opposite angles supplementary</T>
      <T x={140} y={216} size={8} color="#8E8E93" align="middle">Exterior ∠ = interior opposite ∠</T>
    </svg>
  );
}

// Ch18 — Tangents and Intersecting Chords
function IcseTangentBasics() {
  return (
    <svg viewBox="0 0 280 200" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      <circle cx="120" cy="100" r="70" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2"/>
      <circle cx="120" cy="100" r="4" fill="#2563EB"/><T x={124} y={98} size={9} bold color="#2563EB">O</T>
      <circle cx="190" cy="100" r="5" fill="#FF3B30"/>
      <T x={192} y={92} size={9} bold color="#FF3B30">T</T>
      <line x1="120" y1="100" x2="190" y2="100" stroke="#2563EB" strokeWidth="1.5"/>
      <T x={150} y={92} size={8} color="#2563EB">r</T>
      <line x1="190" y1="20" x2="190" y2="180" stroke="#FF3B30" strokeWidth="2.5"/>
      <T x={194} y={24} size={9} bold color="#FF3B30">Tangent</T>
      <rect x="182" y="92" width="8" height="8" fill="none" stroke="#FF3B30" strokeWidth="1.5"/>
      <T x={140} y={188} size={9} bold color="#FF3B30" align="middle">OT ⊥ Tangent at T (radius ⊥ tangent)</T>
    </svg>
  );
}
function IcseTangentProperties() {
  return (
    <svg viewBox="0 0 280 220" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      <circle cx="120" cy="110" r="65" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2"/>
      <circle cx="120" cy="110" r="4" fill="#2563EB"/><T x={110} y={108} size={9} bold color="#2563EB">O</T>
      <circle cx="256" cy="110" r="4" fill="#FF3B30"/>
      <T x={260} y={108} size={9} bold color="#FF3B30">P</T>
      <circle cx="120" cy="45" r="4" fill="#34C759"/>
      <T x={124} y={43} size={9} bold color="#34C759">A</T>
      <circle cx="120" cy="175" r="4" fill="#34C759"/>
      <T x={124} y={180} size={9} bold color="#34C759">B</T>
      <line x1="120" y1="45" x2="256" y2="110" stroke="#34C759" strokeWidth="2"/>
      <line x1="120" y1="175" x2="256" y2="110" stroke="#34C759" strokeWidth="2"/>
      <line x1="120" y1="110" x2="120" y2="45" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="3,2"/>
      <line x1="120" y1="110" x2="120" y2="175" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="3,2"/>
      <line x1="120" y1="110" x2="256" y2="110" stroke="#8E8E93" strokeWidth="1" strokeDasharray="3,2"/>
      <T x={170} y={72} size={8} color="#34C759">PA</T>
      <T x={170} y={152} size={8} color="#34C759">PB</T>
      <T x={140} y={204} size={9} bold color="#34C759" align="middle">PA = PB (tangents from external point equal)</T>
      <T x={140} y={216} size={8} color="#8E8E93" align="middle">OAPB is a kite: ∠OAP=∠OBP=90°, ∠APO=∠BPO</T>
    </svg>
  );
}
function IcseTangentChordAngle() {
  return (
    <svg viewBox="0 0 280 220" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      <circle cx="130" cy="110" r="75" fill="#FFF7ED" stroke="#EA580C" strokeWidth="2"/>
      <circle cx="205" cy="110" r="4" fill="#1C1C1E"/>
      <T x={209} y={108} size={9} bold>T</T>
      <line x1="205" y1="40" x2="205" y2="180" stroke="#EA580C" strokeWidth="2.5"/>
      <T x={208} y={38} size={9} bold color="#EA580C">Tangent</T>
      <circle cx="80" cy="60" r="4" fill="#6366F1"/>
      <T x={72} y={54} size={9} bold color="#6366F1">A</T>
      <circle cx="80" cy="160" r="4" fill="#34C759"/>
      <T x={66} y={162} size={9} bold color="#34C759">P</T>
      <line x1="80" y1="60" x2="205" y2="110" stroke="#6366F1" strokeWidth="1.5"/>
      <line x1="80" y1="160" x2="205" y2="110" stroke="#34C759" strokeWidth="1.5"/>
      <path d="M 205 130 A 20 20 0 0 0 190 110" fill="none" stroke="#EA580C" strokeWidth="1.5"/>
      <T x={180} y={130} size={8} color="#EA580C">α</T>
      <path d="M 88 152 A 18 18 0 0 0 96 138" fill="none" stroke="#6366F1" strokeWidth="1.5"/>
      <T x={100} y={152} size={8} color="#6366F1">α</T>
      <T x={140} y={204} size={9} bold color="#EA580C" align="middle">Tangent-chord ∠ = inscribed ∠ in alternate segment</T>
    </svg>
  );
}
function IcseIntersectingChords() {
  return (
    <svg viewBox="0 0 280 220" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      <circle cx="140" cy="110" r="80" fill="#F0FDF4" stroke="#16A34A" strokeWidth="2"/>
      <circle cx="80" cy="60" r="4" fill="#1C1C1E"/><T x={72} y={54} size={9} bold>A</T>
      <circle cx="200" cy="160" r="4" fill="#1C1C1E"/><T x={202} y={164} size={9} bold>B</T>
      <circle cx="60" cy="160" r="4" fill="#1C1C1E"/><T x={46} y={164} size={9} bold>C</T>
      <circle cx="210" cy="70" r="4" fill="#1C1C1E"/><T x={214} y={68} size={9} bold>D</T>
      <line x1="80" y1="60" x2="200" y2="160" stroke="#007AFF" strokeWidth="2"/>
      <line x1="60" y1="160" x2="210" y2="70" stroke="#FF3B30" strokeWidth="2"/>
      <circle cx="138" cy="112" r="5" fill="#FF9500"/>
      <T x={142} y={110} size={9} bold color="#FF9500">P</T>
      <rect x="20" y="190" width="240" height="26" rx="6" fill="#F0FDF4"/>
      <T x={140} y={204} size={9} bold color="#16A34A" align="middle">PA × PB = PC × PD</T>
      <T x={140} y={214} size={8} color="#8E8E93" align="middle">(intersecting chords theorem)</T>
    </svg>
  );
}

// Ch19 — Constructions
function IcseConstructionsBasics() {
  return (
    <svg viewBox="0 0 280 220" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      <circle cx="130" cy="110" r="70" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2"/>
      <circle cx="130" cy="110" r="4" fill="#2563EB"/><T x={134} y={108} size={9} bold color="#2563EB">O</T>
      <circle cx="200" cy="110" r="5" fill="#FF3B30"/>
      <T x={204} y={108} size={9} bold color="#FF3B30">T</T>
      <line x1="130" y1="110" x2="200" y2="110" stroke="#2563EB" strokeWidth="1.5"/>
      <line x1="200" y1="30" x2="200" y2="190" stroke="#FF3B30" strokeWidth="2.5"/>
      <rect x="192" y="102" width="8" height="8" fill="none" stroke="#FF3B30" strokeWidth="1.5"/>
      <T x={10} y={194} size={8} color="#8E8E93">Steps: (1) Mark T on circle</T>
      <T x={10} y={206} size={8} color="#8E8E93">(2) Draw OT  (3) Draw ⊥ to OT at T → tangent</T>
    </svg>
  );
}
function IcseConstructionsTangents() {
  return (
    <svg viewBox="0 0 280 220" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      <circle cx="110" cy="110" r="60" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2"/>
      <circle cx="110" cy="110" r="4" fill="#2563EB"/><T x={114} y={108} size={9} bold color="#2563EB">O</T>
      <circle cx="240" cy="110" r="5" fill="#FF3B30"/><T x={244} y={108} size={9} bold color="#FF3B30">P</T>
      <circle cx="175" cy="110" r="3" fill="#8E8E93"/>
      <circle cx="175" cy="110" r="30" fill="none" stroke="#8E8E93" strokeWidth="1" strokeDasharray="4,2"/>
      <T x={175} y={84} size={8} color="#8E8E93">mid-circle (OP)</T>
      <circle cx="110" cy="80" r="4" fill="#34C759"/><T x={114} y={78} size={9} bold color="#34C759">T₁</T>
      <circle cx="110" cy="140" r="4" fill="#34C759"/><T x={114} y={152} size={9} bold color="#34C759">T₂</T>
      <line x1="110" y1="80" x2="240" y2="110" stroke="#34C759" strokeWidth="2"/>
      <line x1="110" y1="140" x2="240" y2="110" stroke="#34C759" strokeWidth="2"/>
      <T x={10} y={196} size={8} color="#8E8E93">Steps: bisect OP → semicircle cuts circle at T₁,T₂</T>
      <T x={10} y={208} size={8} color="#8E8E93">PT₁ and PT₂ are the two tangents from P</T>
    </svg>
  );
}
function IcseConstructionsInscribed() {
  return (
    <svg viewBox="0 0 280 220" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      <polygon points="140,20 30,190 250,190" fill="#FFF7ED" stroke="#EA580C" strokeWidth="2"/>
      <T x={136} y={14} size={9} bold>A</T><T x={20} y={200} size={9} bold>B</T><T x={248} y={200} size={9} bold>C</T>
      <line x1="140" y1="20" x2="140" y2="190" stroke="#EA580C" strokeWidth="1.5" strokeDasharray="4,2"/>
      <line x1="30" y1="190" x2="185" y2="105" stroke="#34C759" strokeWidth="1.5" strokeDasharray="4,2"/>
      <circle cx="140" cy="152" r="38" fill="none" stroke="#2563EB" strokeWidth="2"/>
      <circle cx="140" cy="152" r="4" fill="#2563EB"/><T x={144} y={150} size={9} bold color="#2563EB">I</T>
      <T x={140} y={208} size={9} bold color="#2563EB" align="middle">Incircle — centre at angle bisector intersection</T>
    </svg>
  );
}
function IcseConstructionsCircumscribed() {
  return (
    <svg viewBox="0 0 280 220" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      <polygon points="140,30 40,180 240,180" fill="#F0FDF4" stroke="#16A34A" strokeWidth="2"/>
      <T x={136} y={24} size={9} bold>A</T><T x={30} y={190} size={9} bold>B</T><T x={238} y={190} size={9} bold>C</T>
      <circle cx="140" cy="126" r="96" fill="none" stroke="#9333EA" strokeWidth="2"/>
      <circle cx="140" cy="126" r="4" fill="#9333EA"/><T x={144} y={124} size={9} bold color="#9333EA">S</T>
      <line x1="140" y1="30" x2="240" y2="180" stroke="#8E8E93" strokeWidth="1" strokeDasharray="3,2"/>
      <line x1="140" y1="180" x2="140" y2="126" stroke="#9333EA" strokeWidth="1" strokeDasharray="3,2"/>
      <T x={140} y={208} size={9} bold color="#9333EA" align="middle">Circumcircle — centre at perp bisector intersection</T>
    </svg>
  );
}

// Ch20 — Cylinder, Cone, Sphere
function IcseCylinder() {
  return (
    <svg viewBox="0 0 240 220" style={{ width:"100%", maxWidth:240, height:"auto" }}>
      <ellipse cx="120" cy="50" rx="70" ry="18" fill="#DBEAFE" stroke="#2563EB" strokeWidth="2"/>
      <ellipse cx="120" cy="170" rx="70" ry="18" fill="#BFDBFE" stroke="#2563EB" strokeWidth="2"/>
      <line x1="50" y1="50" x2="50" y2="170" stroke="#2563EB" strokeWidth="2"/>
      <line x1="190" y1="50" x2="190" y2="170" stroke="#2563EB" strokeWidth="2"/>
      <line x1="120" y1="50" x2="120" y2="170" stroke="#2563EB" strokeWidth="1" strokeDasharray="3,2"/>
      <line x1="120" y1="50" x2="190" y2="50" stroke="#FF3B30" strokeWidth="1.5"/>
      <T x={150} y={44} size={9} bold color="#FF3B30">r</T>
      <line x1="196" y1="50" x2="196" y2="170" stroke="#34C759" strokeWidth="1.5"/>
      <T x={200} y={114} size={9} bold color="#34C759">h</T>
      <rect x="10" y="188" width="220" height="28" rx="6" fill="#EFF6FF"/>
      <T x={120} y={200} size={8} bold color="#2563EB" align="middle">CSA = 2πrh   TSA = 2πr(r+h)</T>
      <T x={120} y={212} size={8} bold color="#2563EB" align="middle">Volume = πr²h</T>
    </svg>
  );
}
function IcseCone() {
  return (
    <svg viewBox="0 0 240 220" style={{ width:"100%", maxWidth:240, height:"auto" }}>
      <ellipse cx="120" cy="170" rx="70" ry="18" fill="#DCFCE7" stroke="#16A34A" strokeWidth="2"/>
      <line x1="50" y1="170" x2="120" y2="30" stroke="#16A34A" strokeWidth="2"/>
      <line x1="190" y1="170" x2="120" y2="30" stroke="#16A34A" strokeWidth="2"/>
      <circle cx="120" cy="30" r="4" fill="#16A34A"/>
      <line x1="120" y1="30" x2="120" y2="170" stroke="#16A34A" strokeWidth="1" strokeDasharray="3,2"/>
      <line x1="120" y1="170" x2="190" y2="170" stroke="#FF3B30" strokeWidth="1.5"/>
      <T x={150} y={166} size={9} bold color="#FF3B30">r</T>
      <line x1="114" y1="30" x2="114" y2="170" stroke="#34C759" strokeWidth="1.5"/>
      <T x={100} y={106} size={9} bold color="#34C759">h</T>
      <line x1="190" y1="170" x2="120" y2="30" stroke="#FF9500" strokeWidth="1.5" strokeDasharray="3,2"/>
      <T x={165} y={96} size={9} bold color="#FF9500">l</T>
      <T x={90} y={6} size={8} color="#8E8E93" align="middle">l² = h²+r²</T>
      <rect x="10" y="190" width="220" height="26" rx="6" fill="#F0FDF4"/>
      <T x={120} y={202} size={8} bold color="#16A34A" align="middle">CSA = πrl   TSA = πr(r+l)</T>
      <T x={120} y={214} size={8} bold color="#16A34A" align="middle">Volume = ⅓πr²h</T>
    </svg>
  );
}
function IcseSphere() {
  return (
    <svg viewBox="0 0 240 200" style={{ width:"100%", maxWidth:240, height:"auto" }}>
      <circle cx="120" cy="100" r="80" fill="#FEF3C7" stroke="#D97706" strokeWidth="2"/>
      <ellipse cx="120" cy="100" rx="80" ry="20" fill="none" stroke="#D97706" strokeWidth="1.5" strokeDasharray="4,2"/>
      <line x1="120" y1="100" x2="200" y2="100" stroke="#FF3B30" strokeWidth="2"/>
      <T x={156} y={94} size={10} bold color="#FF3B30">r</T>
      <circle cx="120" cy="100" r="4" fill="#D97706"/>
      <T x={124} y={98} size={9} bold color="#D97706">O</T>
      <rect x="20" y="186" width="200" height="12" rx="4" fill="#FEF3C7"/>
      <T x={120} y={196} size={8} bold color="#D97706" align="middle">SA = 4πr²   Volume = (4/3)πr³</T>
    </svg>
  );
}
function IcseCombinedSolid() {
  return (
    <svg viewBox="0 0 240 240" style={{ width:"100%", maxWidth:240, height:"auto" }}>
      <ellipse cx="120" cy="160" rx="60" ry="16" fill="#DBEAFE" stroke="#2563EB" strokeWidth="2"/>
      <ellipse cx="120" cy="80" rx="60" ry="16" fill="#BFDBFE" stroke="#2563EB" strokeWidth="2"/>
      <line x1="60" y1="80" x2="60" y2="160" stroke="#2563EB" strokeWidth="2"/>
      <line x1="180" y1="80" x2="180" y2="160" stroke="#2563EB" strokeWidth="2"/>
      <T x={184} y={124} size={8} color="#2563EB">h₁</T>
      <line x1="60" y1="80" x2="120" y2="20" stroke="#16A34A" strokeWidth="2"/>
      <line x1="180" y1="80" x2="120" y2="20" stroke="#16A34A" strokeWidth="2"/>
      <T x={124} y={18} size={8} color="#16A34A">apex</T>
      <line x1="186" y1="80" x2="186" y2="20" stroke="#34C759" strokeWidth="1.5"/>
      <T x={190} y={54} size={8} color="#34C759">h₂</T>
      <T x={120} y={218} size={8} bold color="#1C1C1E" align="middle">Vol = πr²h₁ + ⅓πr²h₂</T>
      <T x={120} y={230} size={8} color="#8E8E93" align="middle">Add/subtract volumes of component solids</T>
    </svg>
  );
}

// Ch21 — Trigonometrical Identities
function IcseTrigRatios() {
  return (
    <svg viewBox="0 0 280 200" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      <polygon points="40,170 220,170 220,60" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2"/>
      <rect x="212" y="162" width="8" height="8" fill="none" stroke="#2563EB" strokeWidth="1.5"/>
      <T x={30} y={180} size={9} bold>A</T><T x={218} y={180} size={9} bold>B</T><T x={224} y={58} size={9} bold>C</T>
      <T x={124} y={180} size={9} color="#FF3B30">Adjacent (AB)</T>
      <T x={226} y={118} size={9} color="#34C759">Opposite (BC)</T>
      <line x1="40" y1="170" x2="220" y2="60" stroke="#FF9500" strokeWidth="1.5"/>
      <T x={112} y={104} size={9} color="#FF9500">Hypotenuse (AC)</T>
      <path d="M 68 170 A 28 28 0 0 1 57 148" fill="none" stroke="#6366F1" strokeWidth="1.5"/>
      <T x={72} y={158} size={9} bold color="#6366F1">θ</T>
      <rect x="10" y="172" width="260" height="26" rx="5" fill="#F2F2F7"/>
      <T x={140} y={183} size={8} bold color="#2563EB" align="middle">sin θ = Opp/Hyp   cos θ = Adj/Hyp</T>
      <T x={140} y={194} size={8} bold color="#2563EB" align="middle">tan θ = Opp/Adj = sin θ/cos θ</T>
    </svg>
  );
}
function IcseUnitCircle() {
  return (
    <svg viewBox="0 0 280 220" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      <line x1="20" y1="110" x2="260" y2="110" stroke="#3A3A3C" strokeWidth="1.5"/>
      <line x1="140" y1="10" x2="140" y2="210" stroke="#3A3A3C" strokeWidth="1.5"/>
      <circle cx="140" cy="110" r="80" fill="none" stroke="#6366F1" strokeWidth="2"/>
      <circle cx="140" cy="110" r="4" fill="#6366F1"/>
      <circle cx="200" cy="72" r="4" fill="#FF3B30"/>
      <line x1="140" y1="110" x2="200" y2="72" stroke="#FF9500" strokeWidth="2"/>
      <T x={164} y={88} size={9} bold color="#FF9500">1</T>
      <line x1="200" y1="72" x2="200" y2="110" stroke="#34C759" strokeWidth="2"/>
      <T x={204} y={94} size={9} bold color="#34C759">sin θ</T>
      <line x1="140" y1="110" x2="200" y2="110" stroke="#007AFF" strokeWidth="2"/>
      <T x={166} y={122} size={9} bold color="#007AFF">cos θ</T>
      <path d="M 160 110 A 20 20 0 0 0 153 96" fill="none" stroke="#6366F1" strokeWidth="1.5"/>
      <T x={162} y={102} size={8} color="#6366F1">θ</T>
      <rect x="20" y="194" width="240" height="22" rx="5" fill="#EEF2FF"/>
      <T x={140} y={206} size={9} bold color="#6366F1" align="middle">sin²θ + cos²θ = 1 (Pythagorean identity)</T>
      <T x={140} y={216} size={8} color="#8E8E93" align="middle">1+tan²θ=sec²θ   1+cot²θ=cosec²θ</T>
    </svg>
  );
}
function IcseTrigProofs() {
  return (
    <svg viewBox="0 0 280 200" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      <polygon points="50,160 230,160 230,60" fill="#FFF7ED" stroke="#EA580C" strokeWidth="2"/>
      <rect x="222" y="152" width="8" height="8" fill="none" stroke="#EA580C" strokeWidth="1.5"/>
      <T x={40} y={172} size={9} bold>A θ</T><T x={228} y={172} size={9} bold>B</T><T x={234} y={58} size={9} bold>C</T>
      <path d="M 72 160 A 22 22 0 0 1 66 142" fill="none" stroke="#6366F1" strokeWidth="1.5"/>
      <T x={78} y={152} size={8} color="#6366F1">θ</T>
      <line x1="50" y1="160" x2="230" y2="60" stroke="#FF9500" strokeWidth="1.5"/>
      <T x={126} y={100} size={8} bold color="#FF9500">h (hyp)</T>
      <T x={132} y={168} size={8} color="#007AFF">b (base)</T>
      <T x={234} y={114} size={8} color="#34C759">p (perp)</T>
      <T x={6} y={182} size={8} color="#8E8E93">Proof: sin²θ+cos²θ = p²/h² + b²/h² = (p²+b²)/h² = h²/h² = 1</T>
      <T x={6} y={196} size={8} color="#8E8E93">by Pythagoras: p² + b² = h²</T>
    </svg>
  );
}
function IcseComplementaryAngles() {
  return (
    <svg viewBox="0 0 280 200" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      <polygon points="50,160 230,160 230,60" fill="#F0FDF4" stroke="#16A34A" strokeWidth="2"/>
      <rect x="222" y="152" width="8" height="8" fill="none" stroke="#16A34A" strokeWidth="1.5"/>
      <path d="M 72 160 A 22 22 0 0 1 66 142" fill="none" stroke="#6366F1" strokeWidth="1.5"/>
      <T x={78} y={152} size={8} color="#6366F1">θ</T>
      <path d="M 222 78 A 18 18 0 0 0 208 66" fill="none" stroke="#FF3B30" strokeWidth="1.5"/>
      <T x={204} y={78} size={8} color="#FF3B30">90°−θ</T>
      <T x={40} y={172} size={9} bold>A</T><T x={228} y={172} size={9} bold>B</T><T x={234} y={58} size={9} bold>C</T>
      <T x={6} y={178} size={8} color="#8E8E93">sin(90°−θ) = cos θ       cos(90°−θ) = sin θ</T>
      <T x={6} y={190} size={8} color="#8E8E93">tan(90°−θ) = cot θ       sec(90°−θ) = cosec θ</T>
      <T x={6} y={200} size={8} color="#8E8E93">At A: opposite=BC (for θ). At C: opposite=AB (for 90°−θ)</T>
    </svg>
  );
}

// Ch22 — Heights and Distances
function IcseElevationDepression() {
  return (
    <svg viewBox="0 0 300 200" style={{ width:"100%", maxWidth:300, height:"auto" }}>
      <line x1="10" y1="170" x2="290" y2="170" stroke="#3A3A3C" strokeWidth="2"/>
      <line x1="220" y1="170" x2="220" y2="30" stroke="#2563EB" strokeWidth="2.5"/>
      <T x={224} y={100} size={9} bold color="#2563EB">h</T>
      <circle cx="50" cy="170" r="5" fill="#FF3B30"/>
      <T x={36} y={166} size={9} bold color="#FF3B30">O</T>
      <line x1="50" y1="170" x2="220" y2="30" stroke="#FF3B30" strokeWidth="1.5"/>
      <line x1="50" y1="170" x2="200" y2="170" stroke="#8E8E93" strokeWidth="1" strokeDasharray="3,2"/>
      <path d="M 80 170 A 30 30 0 0 1 67 148" fill="none" stroke="#FF3B30" strokeWidth="1.5"/>
      <T x={88} y={158} size={9} bold color="#FF3B30">α (elev.)</T>
      <circle cx="220" cy="30" r="4" fill="#34C759"/>
      <line x1="220" y1="30" x2="280" y2="30" stroke="#8E8E93" strokeWidth="1" strokeDasharray="3,2"/>
      <path d="M 248 30 A 28 28 0 0 1 240 50" fill="none" stroke="#34C759" strokeWidth="1.5"/>
      <T x={248} y={46} size={9} bold color="#34C759">α (dep.)</T>
      <line x1="50" y1="170" x2="220" y2="170" stroke="#FF9500" strokeWidth="1.5"/>
      <T x={128} y={182} size={9} color="#FF9500">d</T>
      <T x={6} y={196} size={8} color="#8E8E93">tan α = h/d  |  Angle of elevation = angle of depression (alternate angles)</T>
    </svg>
  );
}
function IcseSingleObserver() {
  return (
    <svg viewBox="0 0 280 200" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      <line x1="10" y1="170" x2="270" y2="170" stroke="#3A3A3C" strokeWidth="2"/>
      <line x1="200" y1="170" x2="200" y2="40" stroke="#2563EB" strokeWidth="3"/>
      <T x={204} y={108} size={9} bold color="#2563EB">h = ?</T>
      <circle cx="50" cy="170" r="5" fill="#FF3B30"/>
      <T x={36} y={166} size={9} bold color="#FF3B30">O</T>
      <line x1="50" y1="170" x2="200" y2="40" stroke="#FF3B30" strokeWidth="2"/>
      <line x1="50" y1="170" x2="200" y2="170" stroke="#FF9500" strokeWidth="1.5"/>
      <T x={118} y={182} size={9} bold color="#FF9500">d (given)</T>
      <line x1="200" y1="170" x2="200" y2="40" stroke="#34C759" strokeWidth="1.5"/>
      <rect x="192" y="162" width="8" height="8" fill="none" stroke="#34C759" strokeWidth="1.5"/>
      <path d="M 78 170 A 28 28 0 0 1 67 150" fill="none" stroke="#6366F1" strokeWidth="1.5"/>
      <T x={84} y={156} size={9} bold color="#6366F1">θ</T>
      <T x={6} y={192} size={9} bold color="#6366F1" align="left">tan θ = h/d  →  h = d·tan θ</T>
    </svg>
  );
}
function IcseTwoPositions() {
  return (
    <svg viewBox="0 0 300 210" style={{ width:"100%", maxWidth:300, height:"auto" }}>
      <line x1="10" y1="180" x2="290" y2="180" stroke="#3A3A3C" strokeWidth="2"/>
      <line x1="230" y1="180" x2="230" y2="30" stroke="#2563EB" strokeWidth="3"/>
      <T x={234} y={108} size={9} bold color="#2563EB">h</T>
      <circle cx="40" cy="180" r="5" fill="#FF3B30"/><T x={28} y={175} size={9} bold color="#FF3B30">A</T>
      <circle cx="130" cy="180" r="5" fill="#34C759"/><T x={118} y={175} size={9} bold color="#34C759">B</T>
      <line x1="40" y1="180" x2="230" y2="30" stroke="#FF3B30" strokeWidth="1.5"/>
      <line x1="130" y1="180" x2="230" y2="30" stroke="#34C759" strokeWidth="1.5"/>
      <path d="M 65 180 A 25 25 0 0 1 57 162" fill="none" stroke="#FF3B30" strokeWidth="1.5"/>
      <T x={70} y={168} size={8} bold color="#FF3B30">α</T>
      <path d="M 152 180 A 22 22 0 0 1 146 162" fill="none" stroke="#34C759" strokeWidth="1.5"/>
      <T x={156} y={166} size={8} bold color="#34C759">β</T>
      <line x1="40" y1="180" x2="130" y2="180" stroke="#FF9500" strokeWidth="1.5"/>
      <T x={82} y={194} size={9} color="#FF9500">d</T>
      <rect x="10" y="196" width="280" height="12" rx="4" fill="#F2F2F7"/>
      <T x={150} y={206} size={8} bold color="#1C1C1E" align="middle">h = d·tan α·tan β / (tan β − tan α)</T>
    </svg>
  );
}
function IcseBuildingsTowers() {
  return (
    <svg viewBox="0 0 300 210" style={{ width:"100%", maxWidth:300, height:"auto" }}>
      <line x1="10" y1="190" x2="290" y2="190" stroke="#3A3A3C" strokeWidth="2"/>
      <line x1="60" y1="190" x2="60" y2="50" stroke="#2563EB" strokeWidth="3"/>
      <T x={38} y={124} size={9} bold color="#2563EB">H</T>
      <line x1="220" y1="190" x2="220" y2="100" stroke="#34C759" strokeWidth="3"/>
      <T x={224} y={148} size={9} bold color="#34C759">h</T>
      <line x1="60" y1="100" x2="220" y2="190" stroke="#FF9500" strokeWidth="1.5" strokeDasharray="3,2"/>
      <line x1="60" y1="50" x2="220" y2="100" stroke="#FF3B30" strokeWidth="1.5"/>
      <line x1="60" y1="50" x2="220" y2="190" stroke="#8E8E93" strokeWidth="1" strokeDasharray="2,2"/>
      <path d="M 84 50 A 24 24 0 0 1 76 70" fill="none" stroke="#FF3B30" strokeWidth="1.5"/>
      <T x={88} y={66} size={8} color="#FF3B30">β</T>
      <path d="M 84 100 A 20 20 0 0 0 80 118" fill="none" stroke="#FF9500" strokeWidth="1.5"/>
      <T x={88} y={115} size={8} color="#FF9500">α</T>
      <line x1="60" y1="190" x2="220" y2="190" stroke="#8E8E93" strokeWidth="1.5"/>
      <T x={134} y={200} size={8} color="#8E8E93">d</T>
      <T x={6} y={206} size={8} color="#8E8E93">tan β=(H−h)/d  |  tan α=H/d  |  solve for H, h, or d</T>
    </svg>
  );
}

// Ch23 — Graphical Representation
function IcseHistogram() {
  return (
    <svg viewBox="0 0 300 220" style={{ width:"100%", maxWidth:300, height:"auto" }}>
      <line x1="40" y1="10" x2="40" y2="180" stroke="#3A3A3C" strokeWidth="2"/>
      <line x1="40" y1="180" x2="280" y2="180" stroke="#3A3A3C" strokeWidth="2"/>
      <T x={8} y={14} size={8}>f.d.</T><T x={270} y={192} size={8}>Class</T>
      {[[0,80],[1,120],[2,150],[3,100],[4,60]].map(([i,h])=>(
        <g key={i}>
          <rect x={40+i*46} y={180-h} width={46} height={h} fill="#DBEAFE" stroke="#2563EB" strokeWidth="1.5"/>
          <T x={63+i*46} y={193} size={8} align="middle">{10+i*5}–{15+i*5}</T>
        </g>
      ))}
      <T x={6} y={100} size={8} color="#8E8E93">freq.</T>
      <T x={6} y={112} size={8} color="#8E8E93">density</T>
      <T x={150} y={210} size={8} bold color="#2563EB" align="middle">Histogram — no gaps, area = frequency</T>
    </svg>
  );
}
function IcseOgive() {
  return (
    <svg viewBox="0 0 300 220" style={{ width:"100%", maxWidth:300, height:"auto" }}>
      <line x1="40" y1="10" x2="40" y2="180" stroke="#3A3A3C" strokeWidth="2"/>
      <line x1="40" y1="180" x2="280" y2="180" stroke="#3A3A3C" strokeWidth="2"/>
      <T x={8} y={14} size={8}>c.f.</T><T x={270} y={192} size={8}>u.c.b.</T>
      <path d="M 40 180 C 80 178 100 160 140 130 C 180 100 210 50 260 20" fill="none" stroke="#FF3B30" strokeWidth="2.5"/>
      {[[40,180],[80,175],[120,155],[160,125],[200,80],[240,30],[260,20]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r={3} fill="#FF3B30"/>
      ))}
      <T x={240} y={16} size={8} color="#FF3B30">Less-than ogive</T>
      <line x1="40" y1="100" x2="160" y2="100" stroke="#8E8E93" strokeWidth="1" strokeDasharray="3,2"/>
      <line x1="160" y1="100" x2="160" y2="180" stroke="#8E8E93" strokeWidth="1" strokeDasharray="3,2"/>
      <circle cx="160" cy="100" r="4" fill="#34C759"/>
      <T x={106} y={95} size={8} bold color="#34C759">n/2 → Median</T>
      <T x={150} y={210} size={8} bold color="#FF3B30" align="middle">Ogive — cumulative frequency curve (S-shape)</T>
    </svg>
  );
}
function IcseFrequencyPolygon() {
  return (
    <svg viewBox="0 0 300 220" style={{ width:"100%", maxWidth:300, height:"auto" }}>
      <line x1="40" y1="10" x2="40" y2="180" stroke="#3A3A3C" strokeWidth="2"/>
      <line x1="40" y1="180" x2="280" y2="180" stroke="#3A3A3C" strokeWidth="2"/>
      {[[0,80],[1,120],[2,150],[3,100],[4,60]].map(([i,h])=>(
        <rect key={i} x={40+i*44} y={180-h} width={44} height={h} fill="#DBEAFE" stroke="#2563EB" strokeWidth="1" opacity="0.5"/>
      ))}
      <polyline points="18,180 62,100 106,60 150,30 194,80 238,120 262,180" fill="none" stroke="#FF3B30" strokeWidth="2.5"/>
      {[[18,180],[62,100],[106,60],[150,30],[194,80],[238,120],[262,180]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r={4} fill="#FF3B30"/>
      ))}
      <T x={150} y={200} size={8} bold color="#FF3B30" align="middle">Frequency Polygon — connect midpoints of histogram bars</T>
      <T x={150} y={212} size={8} color="#8E8E93" align="middle">Extend to midpoints of adjacent empty classes at both ends</T>
    </svg>
  );
}
function IcseOgiveStatistics() {
  return (
    <svg viewBox="0 0 300 220" style={{ width:"100%", maxWidth:300, height:"auto" }}>
      <line x1="40" y1="10" x2="40" y2="180" stroke="#3A3A3C" strokeWidth="2"/>
      <line x1="40" y1="180" x2="280" y2="180" stroke="#3A3A3C" strokeWidth="2"/>
      <T x={6} y={14} size={8}>c.f.</T>
      <path d="M 40 178 C 80 176 110 155 150 120 C 190 85 220 40 265 18" fill="none" stroke="#6366F1" strokeWidth="2"/>
      <line x1="40" y1="48" x2="265" y2="48" stroke="#8E8E93" strokeWidth="1" strokeDasharray="2,2"/>
      <T x={6} y={46} size={7}>n</T>
      <line x1="40" y1="84" x2="265" y2="84" stroke="#34C759" strokeWidth="1" strokeDasharray="2,2"/>
      <T x={2} y={82} size={7} color="#34C759">3n/4</T>
      <line x1="40" y1="120" x2="265" y2="120" stroke="#FF9500" strokeWidth="1" strokeDasharray="2,2"/>
      <T x={2} y={118} size={7} color="#FF9500">n/2</T>
      <line x1="40" y1="156" x2="265" y2="156" stroke="#FF3B30" strokeWidth="1" strokeDasharray="2,2"/>
      <T x={2} y={154} size={7} color="#FF3B30">n/4</T>
      <line x1="122" y1="156" x2="122" y2="180" stroke="#FF3B30" strokeWidth="1.5"/><T x={108} y={194} size={7} bold color="#FF3B30">Q₁</T>
      <line x1="158" y1="120" x2="158" y2="180" stroke="#FF9500" strokeWidth="1.5"/><T x={146} y={194} size={7} bold color="#FF9500">Med</T>
      <line x1="196" y1="84" x2="196" y2="180" stroke="#34C759" strokeWidth="1.5"/><T x={186} y={194} size={7} bold color="#34C759">Q₃</T>
      <T x={150} y={208} size={8} bold color="#6366F1" align="middle">Read Q₁ at n/4, Median at n/2, Q₃ at 3n/4</T>
    </svg>
  );
}

// Ch4 — Linear Inequations (number line)
function IcseNumberLine() {
  return (
    <svg viewBox="0 0 300 120" style={{ width:"100%", maxWidth:300, height:"auto" }}>
      <line x1="20" y1="60" x2="280" y2="60" stroke="#3A3A3C" strokeWidth="2" markerEnd="url(#nl)"/>
      <defs><marker id="nl" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#3A3A3C"/></marker></defs>
      {[-3,-2,-1,0,1,2,3].map((n,i)=>{
        const x=150+n*36;
        return <g key={i}><line x1={x} y1="54" x2={x} y2="66" stroke="#3A3A3C" strokeWidth="1.5"/><T x={x} y={78} size={9} align="middle">{n}</T></g>;
      })}
      <line x1="150" y1="60" x2="258" y2="60" stroke="#007AFF" strokeWidth="4" strokeLinecap="round"/>
      <circle cx="150" cy="60" r="6" fill="white" stroke="#007AFF" strokeWidth="2.5"/>
      <circle cx="258" cy="60" r="6" fill="#007AFF"/>
      <T x={148} y={46} size={8} color="#007AFF" align="middle">open: x &gt; 0</T>
      <T x={258} y={46} size={8} color="#007AFF" align="middle">closed: x ≤ 3</T>
      <T x={150} y={100} size={8} color="#8E8E93" align="middle">○ = excluded (strict)   ● = included (≤ or ≥)</T>
      <T x={150} y={112} size={8} color="#8E8E93" align="middle">Flip inequality sign when multiplying/dividing by negative</T>
    </svg>
  );
}

// Ch10 — Arithmetic Progression
function IcseAPSequence() {
  return (
    <svg viewBox="0 0 300 160" style={{ width:"100%", maxWidth:300, height:"auto" }}>
      {[0,1,2,3,4].map((i)=>{
        const x=30+i*52, val=3+i*4;
        return (
          <g key={i}>
            <circle cx={x} cy={60} r={22} fill="#EEF2FF" stroke="#6366F1" strokeWidth="2"/>
            <T x={x} y={65} size={11} bold color="#6366F1" align="middle">{val}</T>
            {i<4 && <>
              <line x1={x+22} y1="60" x2={x+30} y2="60" stroke="#FF9500" strokeWidth="2" markerEnd="url(#ap)"/>
              <T x={x+27} y={52} size={8} color="#FF9500">+d</T>
            </>}
          </g>
        );
      })}
      <defs><marker id="ap" markerWidth="5" markerHeight="5" refX="3" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5 Z" fill="#FF9500"/></marker></defs>
      <T x={30} y={95} size={8} color="#8E8E93" align="middle">a</T>
      <T x={82} y={95} size={8} color="#8E8E93" align="middle">a+d</T>
      <T x={134} y={95} size={8} color="#8E8E93" align="middle">a+2d</T>
      <T x={186} y={95} size={8} color="#8E8E93" align="middle">a+3d</T>
      <T x={238} y={95} size={8} color="#8E8E93" align="middle">a+4d</T>
      <rect x="10" y="108" width="280" height="44" rx="6" fill="#EEF2FF"/>
      <T x={150} y={122} size={9} bold color="#6366F1" align="middle">aₙ = a + (n−1)d</T>
      <T x={150} y={136} size={9} bold color="#6366F1" align="middle">Sₙ = n/2 × [2a + (n−1)d]  =  n/2 × (a + l)</T>
      <T x={150} y={148} size={8} color="#8E8E93" align="middle">d = common difference  |  a = first term  |  l = last term</T>
    </svg>
  );
}

// Ch11 — Geometric Progression
function IcseGPSequence() {
  return (
    <svg viewBox="0 0 300 160" style={{ width:"100%", maxWidth:300, height:"auto" }}>
      {[0,1,2,3,4].map((i)=>{
        const x=30+i*52, val=Math.pow(2,i+1);
        return (
          <g key={i}>
            <circle cx={x} cy={60} r={22} fill="#FEF3C7" stroke="#D97706" strokeWidth="2"/>
            <T x={x} y={65} size={11} bold color="#D97706" align="middle">{val}</T>
            {i<4 && <>
              <line x1={x+22} y1="60" x2={x+30} y2="60" stroke="#FF3B30" strokeWidth="2" markerEnd="url(#gp)"/>
              <T x={x+27} y={52} size={8} color="#FF3B30">×r</T>
            </>}
          </g>
        );
      })}
      <defs><marker id="gp" markerWidth="5" markerHeight="5" refX="3" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5 Z" fill="#FF3B30"/></marker></defs>
      <T x={30} y={95} size={8} color="#8E8E93" align="middle">a</T>
      <T x={82} y={95} size={8} color="#8E8E93" align="middle">ar</T>
      <T x={134} y={95} size={8} color="#8E8E93" align="middle">ar²</T>
      <T x={186} y={95} size={8} color="#8E8E93" align="middle">ar³</T>
      <T x={238} y={95} size={8} color="#8E8E93" align="middle">ar⁴</T>
      <rect x="10" y="108" width="280" height="44" rx="6" fill="#FEF3C7"/>
      <T x={150} y={122} size={9} bold color="#D97706" align="middle">aₙ = arⁿ⁻¹</T>
      <T x={150} y={136} size={9} bold color="#D97706" align="middle">Sₙ = a(rⁿ−1)/(r−1)  |  S∞ = a/(1−r)  for |r|&lt;1</T>
      <T x={150} y={148} size={8} color="#8E8E93" align="middle">r = common ratio = aₙ₊₁/aₙ  |  3-term GP: a/r, a, ar</T>
    </svg>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ICSE CLASS 9 MATHEMATICS — Selina Concise
// 12 geometric chapters × 4 topics = 48 SVG diagrams
// Chapters: Ch9–Ch17, Ch20–Ch21, Ch26
// ══════════════════════════════════════════════════════════════════════════════

// ── Ch9 — Triangles (Congruency) ──────────────────────────────────────────────
function Icse9CongruenceIntro() {
  return (
    <svg viewBox="0 0 300 200" style={{ width:"100%", maxWidth:300, height:"auto" }}>
      {/* Triangle 1 */}
      <polygon points="30,170 110,170 70,60" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2"/>
      <T x={20} y={183} size={9} bold color="#2563EB">A</T><T x={112} y={183} size={9} bold color="#2563EB">B</T><T x={66} y={54} size={9} bold color="#2563EB">C</T>
      {/* tick marks on equal sides */}
      <line x1="46" y1="118" x2="52" y2="112" stroke="#FF3B30" strokeWidth="2"/>
      <line x1="88" y1="112" x2="94" y2="118" stroke="#FF3B30" strokeWidth="2"/>
      <line x1="65" y1="168" x2="75" y2="168" stroke="#34C759" strokeWidth="2.5"/>
      {/* Triangle 2 — congruent copy */}
      <polygon points="170,170 250,170 210,60" fill="#F0FDF4" stroke="#16A34A" strokeWidth="2"/>
      <T x={160} y={183} size={9} bold color="#16A34A">P</T><T x={252} y={183} size={9} bold color="#16A34A">Q</T><T x={206} y={54} size={9} bold color="#16A34A">R</T>
      <line x1="186" y1="118" x2="192" y2="112" stroke="#FF3B30" strokeWidth="2"/>
      <line x1="228" y1="112" x2="234" y2="118" stroke="#FF3B30" strokeWidth="2"/>
      <line x1="205" y1="168" x2="215" y2="168" stroke="#34C759" strokeWidth="2.5"/>
      <T x={150} y={10} size={10} bold color="#1C1C1E" align="middle">△ABC ≅ △PQR</T>
      <T x={150} y={197} size={9} color="#8E8E93" align="middle">Congruent: same shape AND size — all 6 parts equal</T>
    </svg>
  );
}
function Icse9CongruenceCriteria() {
  return (
    <svg viewBox="0 0 300 220" style={{ width:"100%", maxWidth:300, height:"auto" }}>
      {/* SAS */}
      <polygon points="20,80 80,80 60,30" fill="#EFF6FF" stroke="#2563EB" strokeWidth="1.5"/>
      <T x={50} y={96} size={8} bold color="#2563EB" align="middle">SAS</T>
      <line x1="38" y1="57" x2="44" y2="51" stroke="#FF3B30" strokeWidth="2"/>
      <line x1="68" y1="51" x2="74" y2="57" stroke="#FF3B30" strokeWidth="2"/>
      <path d="M34 80 A12 12 0 0 1 30 68" fill="none" stroke="#34C759" strokeWidth="1.5"/>
      {/* ASA */}
      <polygon points="100,80 160,80 140,30" fill="#FFF7ED" stroke="#EA580C" strokeWidth="1.5"/>
      <T x={130} y={96} size={8} bold color="#EA580C" align="middle">ASA</T>
      <path d="M108 80 A12 12 0 0 1 104 68" fill="none" stroke="#6366F1" strokeWidth="1.5"/>
      <path d="M150 68 A12 12 0 0 1 154 80" fill="none" stroke="#6366F1" strokeWidth="1.5"/>
      <line x1="116" y1="56" x2="122" y2="50" stroke="#34C759" strokeWidth="2"/>
      {/* SSS */}
      <polygon points="180,80 240,80 220,30" fill="#F0FDF4" stroke="#16A34A" strokeWidth="1.5"/>
      <T x={210} y={96} size={8} bold color="#16A34A" align="middle">SSS</T>
      <line x1="197" y1="57" x2="203" y2="51" stroke="#FF3B30" strokeWidth="2"/>
      <line x1="227" y1="51" x2="233" y2="57" stroke="#FF3B30" strokeWidth="2"/>
      <line x1="205" y1="78" x2="215" y2="78" stroke="#34C759" strokeWidth="2.5"/>
      {/* RHS */}
      <polygon points="260,80 300,80 300,30" fill="#FDF4FF" stroke="#9333EA" strokeWidth="1.5"/>
      <T x={280} y={96} size={8} bold color="#9333EA" align="middle">RHS</T>
      <rect x="292" y="72" width="8" height="8" fill="none" stroke="#9333EA" strokeWidth="1.5"/>
      <line x1="272" y1="56" x2="278" y2="50" stroke="#FF3B30" strokeWidth="2"/>
      <T x={150} y={116} size={9} bold color="#1C1C1E" align="middle">Congruence Criteria</T>
      <T x={150} y={132} size={8} color="#8E8E93" align="middle">SAS — Side Angle Side (included angle)</T>
      <T x={150} y={146} size={8} color="#8E8E93" align="middle">ASA — Angle Side Angle (included side)</T>
      <T x={150} y={160} size={8} color="#8E8E93" align="middle">SSS — Side Side Side (all three sides equal)</T>
      <T x={150} y={174} size={8} color="#8E8E93" align="middle">RHS — Right angle, Hypotenuse, Side</T>
      <T x={150} y={192} size={9} bold color="#FF3B30" align="middle">CPCT: Corresponding Parts of Congruent Triangles</T>
    </svg>
  );
}
function Icse9TriangleProperties() {
  return (
    <svg viewBox="0 0 280 210" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      {/* Triangle ABC */}
      <polygon points="40,160 200,160 120,40" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2"/>
      <T x={30} y={175} size={9} bold color="#2563EB">A</T>
      <T x={202} y={175} size={9} bold color="#2563EB">B</T>
      <T x={116} y={34} size={9} bold color="#2563EB">C</T>
      {/* Extend BC to D */}
      <line x1="200" y1="160" x2="260" y2="160" stroke="#FF3B30" strokeWidth="2"/>
      <T x={262} y={168} size={9} bold color="#FF3B30">D</T>
      {/* Angle arcs */}
      <path d="M60 160 A22 22 0 0 1 55 138" fill="none" stroke="#6366F1" strokeWidth="1.5"/>
      <T x={66} y={148} size={8} bold color="#6366F1">∠A</T>
      <path d="M175 160 A22 22 0 0 0 180 138" fill="none" stroke="#34C759" strokeWidth="1.5"/>
      <T x={158} y={148} size={8} bold color="#34C759">∠B</T>
      {/* Exterior angle CBD */}
      <path d="M210 160 A20 20 0 0 0 220 145" fill="none" stroke="#FF3B30" strokeWidth="1.5"/>
      <T x={224} y={150} size={8} bold color="#FF3B30">ext∠</T>
      <T x={140} y={188} size={9} bold color="#FF3B30" align="middle">Exterior ∠CBD = ∠A + ∠B</T>
      <T x={140} y={202} size={8} color="#8E8E93" align="middle">Exterior angle = sum of two non-adjacent interior angles</T>
    </svg>
  );
}
function Icse9CongruenceProblems() {
  return (
    <svg viewBox="0 0 280 210" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      {/* Parallelogram ABCD with diagonals — congruent triangles */}
      <polygon points="60,160 220,160 260,60 100,60" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2"/>
      <T x={48} y={173} size={9} bold color="#2563EB">A</T>
      <T x={222} y={173} size={9} bold color="#2563EB">B</T>
      <T x={262} y={56} size={9} bold color="#2563EB">C</T>
      <T x={88} y={54} size={9} bold color="#2563EB">D</T>
      {/* Diagonals */}
      <line x1="60" y1="160" x2="260" y2="60" stroke="#FF3B30" strokeWidth="1.5" strokeDasharray="4,2"/>
      <line x1="220" y1="160" x2="100" y2="60" stroke="#16A34A" strokeWidth="1.5" strokeDasharray="4,2"/>
      {/* Center O */}
      <circle cx="160" cy="110" r="4" fill="#FF9500"/>
      <T x={164} y={108} size={9} bold color="#FF9500">O</T>
      <T x={140} y={190} size={9} bold color="#FF3B30" align="middle">△AOB ≅ △COD  (AAS)</T>
      <T x={140} y={204} size={8} color="#8E8E93" align="middle">Diagonals of a parallelogram bisect each other</T>
    </svg>
  );
}

// ── Ch10 — Isosceles Triangles ────────────────────────────────────────────────
function Icse9IsoscelesBase() {
  return (
    <svg viewBox="0 0 260 210" style={{ width:"100%", maxWidth:260, height:"auto" }}>
      <polygon points="130,30 30,170 230,170" fill="#F0FDF4" stroke="#16A34A" strokeWidth="2"/>
      <T x={124} y={24} size={9} bold color="#16A34A">A</T>
      <T x={18} y={183} size={9} bold color="#16A34A">B</T>
      <T x={232} y={183} size={9} bold color="#16A34A">C</T>
      {/* Equal sides AB = AC tick marks */}
      <line x1="74" y1="97" x2="82" y2="91" stroke="#FF3B30" strokeWidth="2.5"/>
      <line x1="182" y1="91" x2="190" y2="97" stroke="#FF3B30" strokeWidth="2.5"/>
      {/* AB = AC label */}
      <T x={60} y={102} size={8} color="#FF3B30">AB=AC</T>
      {/* equal base angles */}
      <path d="M50 170 A24 24 0 0 1 45 146" fill="none" stroke="#6366F1" strokeWidth="2"/>
      <T x={58} y={155} size={8} bold color="#6366F1">∠B</T>
      <path d="M208 146 A24 24 0 0 1 210 170" fill="none" stroke="#6366F1" strokeWidth="2"/>
      <T x={192} y={155} size={8} bold color="#6366F1">∠C</T>
      <T x={130} y={188} size={9} bold color="#FF3B30" align="middle">AB = AC  ⟹  ∠B = ∠C</T>
      <T x={130} y={202} size={8} color="#8E8E93" align="middle">Angles opp. equal sides are equal</T>
    </svg>
  );
}
function Icse9IsoscelesAngles() {
  return (
    <svg viewBox="0 0 260 210" style={{ width:"100%", maxWidth:260, height:"auto" }}>
      <polygon points="130,30 30,170 230,170" fill="#FFF7ED" stroke="#EA580C" strokeWidth="2"/>
      <T x={124} y={24} size={9} bold color="#EA580C">A</T>
      <T x={18} y={183} size={9} bold color="#EA580C">B</T>
      <T x={232} y={183} size={9} bold color="#EA580C">C</T>
      {/* Equal base angles */}
      <path d="M50 170 A24 24 0 0 1 45 146" fill="none" stroke="#FF9500" strokeWidth="2"/>
      <T x={58} y={155} size={8} bold color="#FF9500">θ</T>
      <path d="M208 146 A24 24 0 0 1 210 170" fill="none" stroke="#FF9500" strokeWidth="2"/>
      <T x={192} y={155} size={8} bold color="#FF9500">θ</T>
      {/* Perpendicular bisector from A */}
      <line x1="130" y1="30" x2="130" y2="170" stroke="#16A34A" strokeWidth="1.5" strokeDasharray="4,2"/>
      <T x={134} y={100} size={8} color="#16A34A">bisector</T>
      <rect x="122" y="162" width="8" height="8" fill="none" stroke="#16A34A" strokeWidth="1.5"/>
      <T x={130} y={188} size={9} bold color="#FF9500" align="middle">∠B = ∠C  ⟹  AB = AC</T>
      <T x={130} y={202} size={8} color="#8E8E93" align="middle">Converse: Equal angles → equal sides opp. them</T>
    </svg>
  );
}
function Icse9EquilateralTriangle() {
  return (
    <svg viewBox="0 0 260 220" style={{ width:"100%", maxWidth:260, height:"auto" }}>
      <polygon points="130,20 20,188 240,188" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2"/>
      <T x={124} y={14} size={9} bold color="#2563EB">A</T>
      <T x={8} y={200} size={9} bold color="#2563EB">B</T>
      <T x={242} y={200} size={9} bold color="#2563EB">C</T>
      {/* tick marks on all three sides */}
      <line x1="70" y1="107" x2="78" y2="101" stroke="#FF3B30" strokeWidth="2.5"/>
      <line x1="130" y1="188" x2="130" y2="182" stroke="#FF3B30" strokeWidth="2.5"/>
      <line x1="185" y1="101" x2="193" y2="107" stroke="#FF3B30" strokeWidth="2.5"/>
      {/* 60° angle arcs */}
      <path d="M40 188 A22 22 0 0 1 36 166" fill="none" stroke="#34C759" strokeWidth="1.5"/>
      <T x={48} y={174} size={8} bold color="#34C759">60°</T>
      <path d="M218 166 A22 22 0 0 1 220 188" fill="none" stroke="#34C759" strokeWidth="1.5"/>
      <T x={196} y={174} size={8} bold color="#34C759">60°</T>
      <path d="M115 26 A22 22 0 0 1 148 27" fill="none" stroke="#34C759" strokeWidth="1.5"/>
      <T x={122} y={46} size={8} bold color="#34C759">60°</T>
      <T x={130} y={206} size={9} bold color="#FF3B30" align="middle">AB = BC = CA  |  ∠A = ∠B = ∠C = 60°</T>
    </svg>
  );
}
function Icse9IsoscelesProblems() {
  return (
    <svg viewBox="0 0 280 210" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      {/* Isosceles triangle with altitude bisecting base */}
      <polygon points="140,25 30,175 250,175" fill="#F0FDF4" stroke="#16A34A" strokeWidth="2"/>
      <T x={134} y={20} size={9} bold color="#16A34A">A</T>
      <T x={18} y={185} size={9} bold color="#16A34A">B</T>
      <T x={252} y={185} size={9} bold color="#16A34A">C</T>
      {/* Altitude from A to midpoint D of BC */}
      <line x1="140" y1="25" x2="140" y2="175" stroke="#FF3B30" strokeWidth="1.5" strokeDasharray="5,3"/>
      <circle cx="140" cy="175" r="4" fill="#FF3B30"/>
      <T x={144} y={185} size={9} bold color="#FF3B30">D</T>
      <rect x="132" y="167" width="8" height="8" fill="none" stroke="#FF3B30" strokeWidth="1.5"/>
      {/* BD = DC ticks */}
      <line x1="80" y1="175" x2="85" y2="170" stroke="#6366F1" strokeWidth="2"/>
      <line x1="193" y1="170" x2="198" y2="175" stroke="#6366F1" strokeWidth="2"/>
      <T x={140} y={196} size={9} bold color="#FF3B30" align="middle">Altitude AD ⊥ BC  and  BD = DC</T>
      <T x={140} y={208} size={8} color="#8E8E93" align="middle">The median, altitude and perp. bisector from apex coincide</T>
    </svg>
  );
}

// ── Ch11 — Inequalities ───────────────────────────────────────────────────────
function Icse9InequalityBasics() {
  return (
    <svg viewBox="0 0 280 200" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      {/* Scalene triangle with sides labeled */}
      <polygon points="60,160 230,160 130,40" fill="#FFF7ED" stroke="#EA580C" strokeWidth="2"/>
      <T x={48} y={173} size={9} bold color="#EA580C">A</T>
      <T x={232} y={173} size={9} bold color="#EA580C">B</T>
      <T x={126} y={34} size={9} bold color="#EA580C">C</T>
      {/* side labels */}
      <T x={80} y={100} size={9} bold color="#FF3B30">a</T>
      <T x={186} y={100} size={9} bold color="#FF3B30">b</T>
      <T x={144} y={170} size={9} bold color="#FF3B30">c</T>
      {/* angle arcs */}
      <path d="M80 160 A22 22 0 0 1 76 138" fill="none" stroke="#6366F1" strokeWidth="1.5"/>
      <T x={88} y={148} size={8} bold color="#6366F1">A</T>
      <path d="M207 138 A22 22 0 0 1 212 160" fill="none" stroke="#6366F1" strokeWidth="1.5"/>
      <T x={192} y={148} size={8} bold color="#6366F1">B</T>
      <T x={140} y={180} size={9} bold color="#FF3B30" align="middle">If a &gt; b &gt; c  then  A &gt; B &gt; C</T>
      <T x={140} y={194} size={8} color="#8E8E93" align="middle">Angle opposite longer side is greater</T>
    </svg>
  );
}
function Icse9TriangleIneq() {
  return (
    <svg viewBox="0 0 280 200" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      {/* Triangle with direct path vs two-sides path */}
      <polygon points="40,160 240,160 150,50" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2"/>
      <T x={28} y={173} size={9} bold color="#2563EB">A</T>
      <T x={242} y={173} size={9} bold color="#2563EB">B</T>
      <T x={146} y={44} size={9} bold color="#2563EB">C</T>
      {/* AB direct */}
      <T x={136} y={172} size={9} bold color="#34C759">AB (direct)</T>
      {/* AC + CB */}
      <T x={76} y={98} size={9} color="#FF3B30">AC</T>
      <T x={196} y={98} size={9} color="#FF3B30">CB</T>
      <T x={140} y={186} size={9} bold color="#FF3B30" align="middle">AC + CB &gt; AB  (triangle inequality)</T>
      <T x={140} y={198} size={8} color="#8E8E93" align="middle">Sum of any two sides &gt; third side</T>
    </svg>
  );
}
function Icse9InequalityTheorem() {
  return (
    <svg viewBox="0 0 280 210" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      {/* Exterior angle theorem */}
      <polygon points="40,160 200,160 120,50" fill="#FDF4FF" stroke="#9333EA" strokeWidth="2"/>
      <T x={28} y={173} size={9} bold color="#9333EA">A</T>
      <T x={202} y={173} size={9} bold color="#9333EA">B</T>
      <T x={116} y={44} size={9} bold color="#9333EA">C</T>
      <line x1="200" y1="160" x2="268" y2="160" stroke="#FF3B30" strokeWidth="2"/>
      <T x={270} y={168} size={9} bold color="#FF3B30">D</T>
      <path d="M212 160 A18 18 0 0 0 222 146" fill="none" stroke="#FF3B30" strokeWidth="2"/>
      <T x={226} y={152} size={9} bold color="#FF3B30">ext∠</T>
      <path d="M60 160 A22 22 0 0 1 56 138" fill="none" stroke="#6366F1" strokeWidth="1.5"/>
      <T x={68} y={148} size={8} bold color="#6366F1">∠A</T>
      <path d="M175 140 A22 22 0 0 1 180 160" fill="none" stroke="#34C759" strokeWidth="1.5"/>
      <T x={158} y={148} size={8} bold color="#34C759">∠C</T>
      <T x={154} y={190} size={9} bold color="#FF3B30" align="middle">ext∠CBD &gt; ∠A  and  ext∠CBD &gt; ∠C</T>
      <T x={154} y={204} size={8} color="#8E8E93" align="middle">Exterior angle &gt; each non-adjacent interior angle</T>
    </svg>
  );
}
function Icse9InequalityProblems() {
  return (
    <svg viewBox="0 0 280 200" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      {/* Two triangles — median inequality */}
      <polygon points="50,160 240,160 100,50" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2"/>
      <T x={38} y={173} size={9} bold color="#2563EB">A</T>
      <T x={242} y={173} size={9} bold color="#2563EB">B</T>
      <T x={96} y={44} size={9} bold color="#2563EB">C</T>
      {/* Median from C to midpoint M of AB */}
      <circle cx="145" cy="160" r="4" fill="#FF3B30"/>
      <T x={149} y={173} size={9} bold color="#FF3B30">M</T>
      <line x1="100" y1="50" x2="145" y2="160" stroke="#FF3B30" strokeWidth="1.5" strokeDasharray="4,2"/>
      {/* AB/2 ticks */}
      <line x1="87" y1="160" x2="92" y2="155" stroke="#34C759" strokeWidth="2"/>
      <line x1="196" y1="155" x2="201" y2="160" stroke="#34C759" strokeWidth="2"/>
      <T x={140} y={184} size={9} bold color="#FF3B30" align="middle">Median CM &lt; ½(CA + CB)</T>
      <T x={140} y={197} size={8} color="#8E8E93" align="middle">Median &lt; average of the two sides enclosing it</T>
    </svg>
  );
}

// ── Ch12 — Mid-Point Theorem ──────────────────────────────────────────────────
function Icse9MidpointThm() {
  return (
    <svg viewBox="0 0 280 210" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      <polygon points="140,20 30,180 250,180" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2"/>
      <T x={134} y={14} size={9} bold color="#2563EB">A</T>
      <T x={18} y={192} size={9} bold color="#2563EB">B</T>
      <T x={252} y={192} size={9} bold color="#2563EB">C</T>
      {/* Midpoints M (of AB) and N (of AC) */}
      <circle cx="85" cy="100" r="4" fill="#FF3B30"/>
      <T x={68} y={98} size={9} bold color="#FF3B30">M</T>
      <circle cx="195" cy="100" r="4" fill="#FF3B30"/>
      <T x={198} y={98} size={9} bold color="#FF3B30">N</T>
      {/* MN segment */}
      <line x1="85" y1="100" x2="195" y2="100" stroke="#FF3B30" strokeWidth="2.5"/>
      {/* Tick marks: AM=MB, AN=NC */}
      <line x1="105" y1="58" x2="113" y2="52" stroke="#34C759" strokeWidth="2"/>
      <line x1="55" y1="148" x2="63" y2="142" stroke="#34C759" strokeWidth="2"/>
      <line x1="171" y1="52" x2="179" y2="58" stroke="#6366F1" strokeWidth="2"/>
      <line x1="219" y1="142" x2="227" y2="148" stroke="#6366F1" strokeWidth="2"/>
      <T x={140} y={190} size={9} bold color="#FF3B30" align="middle">MN ∥ BC  and  MN = ½ BC</T>
      <T x={140} y={204} size={8} color="#8E8E93" align="middle">Mid-Point Theorem: M, N are midpoints of AB, AC</T>
    </svg>
  );
}
function Icse9ConverseMP() {
  return (
    <svg viewBox="0 0 280 210" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      <polygon points="140,20 30,180 250,180" fill="#F0FDF4" stroke="#16A34A" strokeWidth="2"/>
      <T x={134} y={14} size={9} bold color="#16A34A">A</T>
      <T x={18} y={192} size={9} bold color="#16A34A">B</T>
      <T x={252} y={192} size={9} bold color="#16A34A">C</T>
      {/* M = midpoint of AB */}
      <circle cx="85" cy="100" r="4" fill="#FF3B30"/>
      <T x={68} y={98} size={9} bold color="#FF3B30">M</T>
      {/* Line through M parallel to BC hits AC at N */}
      <line x1="60" y1="100" x2="220" y2="100" stroke="#FF3B30" strokeWidth="2" strokeDasharray="5,3"/>
      <circle cx="195" cy="100" r="4" fill="#FF9500"/>
      <T x={198} y={98} size={9} bold color="#FF9500">N</T>
      {/* Tick marks: AM=MB */}
      <line x1="105" y1="58" x2="113" y2="52" stroke="#34C759" strokeWidth="2"/>
      <line x1="55" y1="148" x2="63" y2="142" stroke="#34C759" strokeWidth="2"/>
      {/* AN=NC */}
      <line x1="171" y1="52" x2="179" y2="58" stroke="#6366F1" strokeWidth="2"/>
      <line x1="219" y1="142" x2="227" y2="148" stroke="#6366F1" strokeWidth="2"/>
      <T x={140} y={190} size={9} bold color="#FF3B30" align="middle">M midpoint of AB, MN ∥ BC  ⟹  N midpoint of AC</T>
      <T x={140} y={204} size={8} color="#8E8E93" align="middle">Converse of Mid-Point Theorem</T>
    </svg>
  );
}
function Icse9InterceptThm() {
  return (
    <svg viewBox="0 0 280 200" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      {/* Three parallel lines */}
      <line x1="20" y1="50" x2="260" y2="50" stroke="#9333EA" strokeWidth="1.5" strokeDasharray="6,3"/>
      <line x1="20" y1="120" x2="260" y2="120" stroke="#9333EA" strokeWidth="1.5" strokeDasharray="6,3"/>
      <line x1="20" y1="190" x2="260" y2="190" stroke="#9333EA" strokeWidth="1.5" strokeDasharray="6,3"/>
      <T x={4} y={54} size={8} color="#9333EA">l₁</T>
      <T x={4} y={124} size={8} color="#9333EA">l₂</T>
      <T x={4} y={194} size={8} color="#9333EA">l₃</T>
      {/* Transversal 1 */}
      <line x1="80" y1="30" x2="80" y2="200" stroke="#2563EB" strokeWidth="2"/>
      <circle cx="80" cy="50" r="3" fill="#2563EB"/><T x={84} y={48} size={8} bold color="#2563EB">A</T>
      <circle cx="80" cy="120" r="3" fill="#2563EB"/><T x={84} y={118} size={8} bold color="#2563EB">B</T>
      <circle cx="80" cy="190" r="3" fill="#2563EB"/><T x={84} y={188} size={8} bold color="#2563EB">C</T>
      {/* Transversal 2 */}
      <line x1="180" y1="30" x2="180" y2="200" stroke="#FF3B30" strokeWidth="2"/>
      <circle cx="180" cy="50" r="3" fill="#FF3B30"/><T x={184} y={48} size={8} bold color="#FF3B30">P</T>
      <circle cx="180" cy="120" r="3" fill="#FF3B30"/><T x={184} y={118} size={8} bold color="#FF3B30">Q</T>
      <circle cx="180" cy="190" r="3" fill="#FF3B30"/><T x={184} y={188} size={8} bold color="#FF3B30">R</T>
      {/* AB = BC ticks */}
      <line x1="71" y1="84" x2="77" y2="88" stroke="#34C759" strokeWidth="2"/>
      <line x1="71" y1="156" x2="77" y2="160" stroke="#34C759" strokeWidth="2"/>
      <T x={140} y={10} size={9} bold color="#9333EA" align="middle">l₁ ∥ l₂ ∥ l₃  and  AB = BC  ⟹  PQ = QR</T>
      <T x={140} y={22} size={8} color="#8E8E93" align="middle">Equal intercepts on one transversal ⟹ equal on all</T>
    </svg>
  );
}
function Icse9MidpointProblems() {
  return (
    <svg viewBox="0 0 280 210" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      {/* Trapezium ABCD with EF as mid-segment */}
      <polygon points="80,40 200,40 250,170 30,170" fill="#FFF7ED" stroke="#EA580C" strokeWidth="2"/>
      <T x={68} y={34} size={9} bold color="#EA580C">A</T>
      <T x={202} y={34} size={9} bold color="#EA580C">B</T>
      <T x={252} y={178} size={9} bold color="#EA580C">C</T>
      <T x={18} y={178} size={9} bold color="#EA580C">D</T>
      {/* Mid-segment EF (midpoints of AD and BC) */}
      <circle cx="55" cy="105" r="4" fill="#FF3B30"/><T x={38} y={103} size={8} bold color="#FF3B30">E</T>
      <circle cx="225" cy="105" r="4" fill="#FF3B30"/><T x={228} y={103} size={8} bold color="#FF3B30">F</T>
      <line x1="55" y1="105" x2="225" y2="105" stroke="#FF3B30" strokeWidth="2.5"/>
      <T x={140} y={96} size={8} bold color="#FF3B30" align="middle">EF = ½(AB + CD)</T>
      <T x={140} y={190} size={9} bold color="#FF3B30" align="middle">EF ∥ AB ∥ DC  and  EF = ½(AB + DC)</T>
      <T x={140} y={204} size={8} color="#8E8E93" align="middle">Trapezium mid-segment theorem</T>
    </svg>
  );
}

// ── Ch13 — Pythagoras Theorem ─────────────────────────────────────────────────
function Icse9PythagorasBasic() {
  return (
    <svg viewBox="0 0 280 210" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      <polygon points="50,170 200,170 200,60" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2"/>
      <rect x="192" y="162" width="8" height="8" fill="none" stroke="#2563EB" strokeWidth="1.5"/>
      <T x={38} y={183} size={9} bold>A</T><T x={202} y={183} size={9} bold>B</T><T x={206} y={58} size={9} bold>C</T>
      {/* side labels */}
      <T x={118} y={183} size={9} bold color="#34C759">b (adj)</T>
      <T x={208} y={118} size={9} bold color="#FF3B30">a (opp)</T>
      <T x={108} y={112} size={9} bold color="#FF9500">c (hyp)</T>
      {/* squares on sides */}
      <rect x="50" y="170" width="150" height="30" fill="none" stroke="#34C759" strokeWidth="1" strokeDasharray="3,2"/>
      <rect x="200" y="60" width="30" height="110" fill="none" stroke="#FF3B30" strokeWidth="1" strokeDasharray="3,2"/>
      <rect x="28" y="192" width="22" height="22" fill="none" stroke="#FF9500" strokeWidth="1" strokeDasharray="3,2"/>
      <T x={140} y={192} size={8} bold color="#34C759" align="middle">b²</T>
      <T x={218} y={118} size={8} bold color="#FF3B30">a²</T>
      <T x={138} y={40} size={9} bold color="#2563EB" align="middle">a² + b² = c²</T>
      <T x={140} y={204} size={8} color="#8E8E93" align="middle">Square on hyp = sum of squares on other two sides</T>
    </svg>
  );
}
function Icse9PythagorasConverse() {
  return (
    <svg viewBox="0 0 280 200" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      {/* Three triangles: acute, right, obtuse */}
      <polygon points="20,160 90,160 55,80" fill="#EFF6FF" stroke="#2563EB" strokeWidth="1.5"/>
      <T x={52} y={174} size={8} bold color="#2563EB" align="middle">a²+b²&gt;c²</T>
      <T x={52} y={184} size={8} color="#34C759" align="middle">Acute</T>
      <polygon points="100,160 200,160 200,60" fill="#F0FDF4" stroke="#16A34A" strokeWidth="1.5"/>
      <rect x="192" y="152" width="8" height="8" fill="none" stroke="#16A34A" strokeWidth="1.5"/>
      <T x={150} y={174} size={8} bold color="#16A34A" align="middle">a²+b²=c²</T>
      <T x={150} y={184} size={8} color="#16A34A" align="middle">Right ✓</T>
      <polygon points="210,160 270,160 220,80" fill="#FFF7ED" stroke="#EA580C" strokeWidth="1.5"/>
      <T x={240} y={174} size={8} bold color="#EA580C" align="middle">a²+b²&lt;c²</T>
      <T x={240} y={184} size={8} color="#EA580C" align="middle">Obtuse</T>
      <T x={140} y={16} size={10} bold color="#1C1C1E" align="middle">Converse of Pythagoras</T>
      <T x={140} y={30} size={9} color="#8E8E93" align="middle">If a²+b²=c² then the angle opposite c is 90°</T>
    </svg>
  );
}
function Icse9PythagorasApp() {
  return (
    <svg viewBox="0 0 280 200" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      {/* Ladder against wall */}
      <line x1="80" y1="20" x2="80" y2="170" stroke="#8E8E93" strokeWidth="3"/>
      <line x1="20" y1="170" x2="260" y2="170" stroke="#8E8E93" strokeWidth="3"/>
      <rect x="72" y="162" width="8" height="8" fill="none" stroke="#8E8E93" strokeWidth="1.5"/>
      {/* Ladder */}
      <line x1="80" y1="40" x2="180" y2="170" stroke="#FF9500" strokeWidth="3"/>
      <T x={152} y={100} size={9} bold color="#FF9500">Ladder (c)</T>
      {/* vertical height */}
      <line x1="64" y1="40" x2="76" y2="40" stroke="#FF3B30" strokeWidth="1.5"/>
      <line x1="64" y1="170" x2="76" y2="170" stroke="#FF3B30" strokeWidth="1.5"/>
      <line x1="70" y1="40" x2="70" y2="170" stroke="#FF3B30" strokeWidth="1.5"/>
      <T x={30} y={110} size={9} bold color="#FF3B30">h (a)</T>
      {/* horizontal base */}
      <T x={130} y={184} size={9} bold color="#34C759">d (b)</T>
      <T x={140} y={12} size={9} bold color="#FF9500" align="middle">c² = a² + b²  ⟹  find c, a, or b</T>
      <T x={140} y={196} size={8} color="#8E8E93" align="middle">Diagonal of rectangle, height of pole, ladder problems</T>
    </svg>
  );
}
function Icse9PythagorasProblems() {
  return (
    <svg viewBox="0 0 280 210" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      {/* Right triangle in coordinate grid */}
      <line x1="30" y1="20" x2="30" y2="190" stroke="#D1D5DB" strokeWidth="1"/>
      <line x1="30" y1="190" x2="270" y2="190" stroke="#D1D5DB" strokeWidth="1"/>
      {/* Grid lines */}
      {[70,110,150,190,230].map(x=><line key={x} x1={x} y1={20} x2={x} y2={190} stroke="#F3F4F6" strokeWidth="1"/>)}
      {[60,100,140,180].map(y=><line key={y} x1={30} y1={y} x2={270} y2={y} stroke="#F3F4F6" strokeWidth="1"/>)}
      <polygon points="70,60 70,180 230,180" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2"/>
      <rect x="62" y="172" width="8" height="8" fill="none" stroke="#2563EB" strokeWidth="1.5"/>
      <T x={58} y={52} size={9} bold color="#2563EB">A(1,4)</T>
      <T x={58} y={192} size={9} bold color="#2563EB">B(1,0)</T>
      <T x={232} y={192} size={9} bold color="#2563EB">C(5,0)</T>
      <T x={42} y={122} size={9} bold color="#FF3B30">4</T>
      <T x={148} y={191} size={9} bold color="#34C759">4</T>
      <T x={162} y={115} size={9} bold color="#FF9500">c=4√2</T>
      <T x={140} y={208} size={9} bold color="#2563EB" align="middle">AB=4, BC=4 ⟹ AC=√(16+16)=4√2</T>
    </svg>
  );
}

// ── Ch14 — Rectilinear Figures (Quadrilaterals) ───────────────────────────────
function Icse9QuadProperties() {
  return (
    <svg viewBox="0 0 280 210" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      {/* General quadrilateral ABCD with diagonal */}
      <polygon points="60,40 230,60 210,170 40,160" fill="#F0F9FF" stroke="#0284C7" strokeWidth="2"/>
      <T x={48} y={34} size={9} bold color="#0284C7">A</T>
      <T x={232} y={58} size={9} bold color="#0284C7">B</T>
      <T x={212} y={180} size={9} bold color="#0284C7">C</T>
      <T x={28} y={164} size={9} bold color="#0284C7">D</T>
      {/* Diagonal AC */}
      <line x1="60" y1="40" x2="210" y2="170" stroke="#FF3B30" strokeWidth="1.5" strokeDasharray="4,2"/>
      {/* Angle arcs at all 4 vertices */}
      <path d="M78 44 A18 18 0 0 1 74 62" fill="none" stroke="#6366F1" strokeWidth="1.5"/>
      <T x={82} y={58} size={8} bold color="#6366F1">A</T>
      <path d="M215 68 A18 18 0 0 1 228 66" fill="none" stroke="#34C759" strokeWidth="1.5"/>
      <T x={206} y={82} size={8} bold color="#34C759">B</T>
      <path d="M194 162 A18 18 0 0 1 210 158" fill="none" stroke="#FF9500" strokeWidth="1.5"/>
      <T x={192} y={178} size={8} bold color="#FF9500">C</T>
      <path d="M54 142 A18 18 0 0 1 60 158" fill="none" stroke="#EA580C" strokeWidth="1.5"/>
      <T x={46} y={145} size={8} bold color="#EA580C">D</T>
      <T x={140} y={192} size={9} bold color="#0284C7" align="middle">∠A + ∠B + ∠C + ∠D = 360°</T>
      <T x={140} y={204} size={8} color="#8E8E93" align="middle">Angle sum property of any quadrilateral</T>
    </svg>
  );
}
function Icse9Parallelogram() {
  return (
    <svg viewBox="0 0 280 200" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      {/* Parallelogram ABCD */}
      <polygon points="60,50 230,50 260,150 90,150" fill="#F0FDF4" stroke="#16A34A" strokeWidth="2"/>
      <T x={48} y={44} size={9} bold color="#16A34A">A</T>
      <T x={232} y={44} size={9} bold color="#16A34A">B</T>
      <T x={262} y={158} size={9} bold color="#16A34A">C</T>
      <T x={78} y={162} size={9} bold color="#16A34A">D</T>
      {/* Diagonals */}
      <line x1="60" y1="50" x2="260" y2="150" stroke="#FF3B30" strokeWidth="1.5" strokeDasharray="4,2"/>
      <line x1="230" y1="50" x2="90" y2="150" stroke="#FF3B30" strokeWidth="1.5" strokeDasharray="4,2"/>
      <circle cx="160" cy="100" r="4" fill="#FF9500"/><T x={164} y={98} size={9} bold color="#FF9500">O</T>
      {/* Tick marks: AB=DC, AD=BC */}
      <line x1="140" y1="48" x2="145" y2="53" stroke="#2563EB" strokeWidth="2"/>
      <line x1="171" y1="152" x2="176" y2="148" stroke="#2563EB" strokeWidth="2"/>
      <T x={140} y={178} size={9} bold color="#16A34A" align="middle">AB ∥ DC, AD ∥ BC  |  AB=DC, AD=BC</T>
      <T x={140} y={192} size={8} color="#8E8E93" align="middle">Opposite sides equal & parallel; diagonals bisect each other</T>
    </svg>
  );
}
function Icse9SpecialQuads() {
  return (
    <svg viewBox="0 0 300 210" style={{ width:"100%", maxWidth:300, height:"auto" }}>
      {/* Rectangle */}
      <rect x="10" y="40" width="80" height="50" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2"/>
      <rect x="10" y="40" width="8" height="8" fill="none" stroke="#2563EB" strokeWidth="1.5"/>
      <T x={50} y={105} size={8} bold color="#2563EB" align="middle">Rectangle</T>
      <T x={50} y={116} size={7} color="#8E8E93" align="middle">All ∠=90°, diags=</T>
      {/* Rhombus */}
      <polygon points="155,30 190,70 155,110 120,70" fill="#F0FDF4" stroke="#16A34A" strokeWidth="2"/>
      <T x={155} y={125} size={8} bold color="#16A34A" align="middle">Rhombus</T>
      <T x={155} y={136} size={7} color="#8E8E93" align="middle">All sides =, ⊥ diags</T>
      {/* Square */}
      <rect x="215" y="40" width="65" height="65" fill="#FDF4FF" stroke="#9333EA" strokeWidth="2"/>
      <rect x="215" y="40" width="8" height="8" fill="none" stroke="#9333EA" strokeWidth="1.5"/>
      <T x={248} y={120} size={8} bold color="#9333EA" align="middle">Square</T>
      <T x={248} y={131} size={7} color="#8E8E93" align="middle">All =, all 90°</T>
      {/* Trapezium */}
      <polygon points="10,175 90,175 75,145 25,145" fill="#FFF7ED" stroke="#EA580C" strokeWidth="2"/>
      <T x={50} y={190} size={8} bold color="#EA580C" align="middle">Trapezium</T>
      {/* Kite */}
      <polygon points="155,138 180,168 155,195 130,168" fill="#FEF3C7" stroke="#D97706" strokeWidth="2"/>
      <T x={155} y={208} size={8} bold color="#D97706" align="middle">Kite</T>
      <T x={150} y={16} size={9} bold color="#1C1C1E" align="middle">Special Quadrilaterals</T>
    </svg>
  );
}
function Icse9RectilinearProblems() {
  return (
    <svg viewBox="0 0 280 200" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      {/* Trapezium ABCD with parallel sides AB ∥ DC */}
      <polygon points="60,50 220,50 250,160 30,160" fill="#FFF7ED" stroke="#EA580C" strokeWidth="2"/>
      <T x={48} y={44} size={9} bold color="#EA580C">A</T>
      <T x={222} y={44} size={9} bold color="#EA580C">B</T>
      <T x={252} y={168} size={9} bold color="#EA580C">C</T>
      <T x={18} y={168} size={9} bold color="#EA580C">D</T>
      {/* Arrows on parallel sides */}
      <T x={140} y={44} size={8} color="#FF3B30" align="middle">→ AB ∥ DC →</T>
      <T x={140} y={168} size={8} color="#FF3B30" align="middle">→→→→→→→→</T>
      {/* Height */}
      <line x1="140" y1="50" x2="140" y2="160" stroke="#16A34A" strokeWidth="1.5" strokeDasharray="4,2"/>
      <rect x="132" y="152" width="8" height="8" fill="none" stroke="#16A34A" strokeWidth="1.5"/>
      <T x={148} y={108} size={8} bold color="#16A34A">h</T>
      <T x={140} y={184} size={9} bold color="#FF3B30" align="middle">Area = ½(AB + DC) × h</T>
      <T x={140} y={197} size={8} color="#8E8E93" align="middle">Trapezium area formula using parallel sides and height</T>
    </svg>
  );
}

// ── Ch15 — Construction of Polygons ──────────────────────────────────────────
function Icse9BasicConstructions() {
  return (
    <svg viewBox="0 0 280 200" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      {/* Perpendicular bisector of segment AB */}
      <line x1="50" y1="100" x2="230" y2="100" stroke="#2563EB" strokeWidth="2.5"/>
      <circle cx="50" cy="100" r="4" fill="#2563EB"/><T x={34} y={98} size={9} bold color="#2563EB">A</T>
      <circle cx="230" cy="100" r="4" fill="#2563EB"/><T x={234} y={98} size={9} bold color="#2563EB">B</T>
      {/* Midpoint M */}
      <circle cx="140" cy="100" r="4" fill="#FF3B30"/><T x={144} y={98} size={9} bold color="#FF3B30">M</T>
      {/* Perpendicular line */}
      <line x1="140" y1="10" x2="140" y2="190" stroke="#16A34A" strokeWidth="2"/>
      <rect x="132" y="92" width="8" height="8" fill="none" stroke="#FF3B30" strokeWidth="1.5"/>
      {/* Arc construction marks */}
      <path d="M50 100 A60 60 0 0 1 110 40" fill="none" stroke="#FF9500" strokeWidth="1" strokeDasharray="3,2"/>
      <path d="M50 100 A60 60 0 0 0 110 160" fill="none" stroke="#FF9500" strokeWidth="1" strokeDasharray="3,2"/>
      <path d="M230 100 A60 60 0 0 0 170 40" fill="none" stroke="#FF9500" strokeWidth="1" strokeDasharray="3,2"/>
      <path d="M230 100 A60 60 0 0 1 170 160" fill="none" stroke="#FF9500" strokeWidth="1" strokeDasharray="3,2"/>
      <T x={140} y={188} size={9} bold color="#16A34A" align="middle">⊥ bisector: MA = MB, green line ⊥ AB</T>
    </svg>
  );
}
function Icse9TriangleConstruction() {
  return (
    <svg viewBox="0 0 280 200" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      {/* Triangle constructed with labeled given data */}
      <polygon points="60,170 220,170 130,40" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2"/>
      <T x={48} y={183} size={9} bold color="#2563EB">B</T>
      <T x={222} y={183} size={9} bold color="#2563EB">C</T>
      <T x={126} y={34} size={9} bold color="#2563EB">A</T>
      {/* Construction arcs */}
      <path d="M60 170 A120 120 0 0 1 180 80" fill="none" stroke="#FF9500" strokeWidth="1" strokeDasharray="3,2"/>
      <path d="M220 170 A100 100 0 0 0 80 80" fill="none" stroke="#FF9500" strokeWidth="1" strokeDasharray="3,2"/>
      {/* Labels */}
      <T x={67} y={106} size={9} bold color="#FF3B30">c=AB</T>
      <T x={188} y={106} size={9} bold color="#FF3B30">b=AC</T>
      <T x={136} y={176} size={9} bold color="#34C759">a=BC (base)</T>
      {/* Angle at B */}
      <path d="M78 170 A20 20 0 0 1 74 150" fill="none" stroke="#6366F1" strokeWidth="1.5"/>
      <T x={86} y={158} size={8} bold color="#6366F1">∠B</T>
      <T x={140} y={12} size={9} bold color="#2563EB" align="middle">Construct △ given 3 sides (SSS) or SAS or ASA</T>
      <T x={140} y={194} size={8} color="#8E8E93" align="middle">Draw base, set compass to given lengths, mark arcs</T>
    </svg>
  );
}
function Icse9QuadConstruction() {
  return (
    <svg viewBox="0 0 280 200" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      {/* Quadrilateral construction — divide into two triangles */}
      <polygon points="50,40 230,60 210,170 30,160" fill="#F0FDF4" stroke="#16A34A" strokeWidth="2"/>
      <T x={38} y={34} size={9} bold color="#16A34A">A</T>
      <T x={232} y={58} size={9} bold color="#16A34A">B</T>
      <T x={212} y={180} size={9} bold color="#16A34A">C</T>
      <T x={18} y={164} size={9} bold color="#16A34A">D</T>
      {/* Diagonal AC divides into 2 triangles */}
      <line x1="50" y1="40" x2="210" y2="170" stroke="#FF3B30" strokeWidth="1.5" strokeDasharray="4,2"/>
      <T x={145} y={110} size={8} bold color="#FF3B30">diagonal</T>
      <T x={140} y={188} size={9} bold color="#FF3B30" align="middle">Draw diagonal AC, construct △ABC, then △ACD</T>
      <T x={140} y={200} size={8} color="#8E8E93" align="middle">Quadrilateral = 2 triangles sharing a diagonal</T>
    </svg>
  );
}
function Icse9PolygonConstruction() {
  return (
    <svg viewBox="0 0 280 210" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      {/* Regular hexagon with construction circle */}
      <circle cx="140" cy="105" r="80" fill="none" stroke="#FF9500" strokeWidth="1" strokeDasharray="4,2"/>
      <polygon points="220,105 180,174 100,174 60,105 100,36 180,36" fill="#FEF3C7" stroke="#D97706" strokeWidth="2"/>
      {/* Vertices */}
      {[[220,105],[180,174],[100,174],[60,105],[100,36],[180,36]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r={4} fill="#D97706"/>
      ))}
      {/* Radii */}
      {[[220,105],[180,174],[100,174],[60,105],[100,36],[180,36]].map(([x,y],i)=>(
        <line key={i} x1={140} y1={105} x2={x} y2={y} stroke="#FF9500" strokeWidth="1" strokeDasharray="3,2"/>
      ))}
      <circle cx="140" cy="105" r="4" fill="#FF9500"/>
      <T x={144} y={103} size={8} bold color="#FF9500">O</T>
      <T x={140} y={192} size={9} bold color="#D97706" align="middle">Regular hexagon: side = radius</T>
      <T x={140} y={205} size={8} color="#8E8E93" align="middle">Step off radius 6 times around the circle with compass</T>
    </svg>
  );
}

// ── Ch16 — Area Theorems ──────────────────────────────────────────────────────
function Icse9AreaParallelogram() {
  return (
    <svg viewBox="0 0 280 210" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      {/* Parallelogram and rectangle on same base, same parallels */}
      <line x1="20" y1="60" x2="260" y2="60" stroke="#9333EA" strokeWidth="1" strokeDasharray="5,3"/>
      <line x1="20" y1="170" x2="260" y2="170" stroke="#9333EA" strokeWidth="1" strokeDasharray="5,3"/>
      {/* Parallelogram ABCD */}
      <polygon points="40,170 180,170 220,60 80,60" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2"/>
      <T x={28} y={183} size={8} bold color="#2563EB">A</T>
      <T x={182} y={183} size={8} bold color="#2563EB">B</T>
      <T x={222} y={56} size={8} bold color="#2563EB">C</T>
      <T x={68} y={56} size={8} bold color="#2563EB">D</T>
      {/* Height */}
      <line x1="80" y1="60" x2="80" y2="170" stroke="#FF3B30" strokeWidth="1.5" strokeDasharray="4,2"/>
      <rect x="72" y="162" width="8" height="8" fill="none" stroke="#FF3B30" strokeWidth="1.5"/>
      <T x={86} y={118} size={9} bold color="#FF3B30">h</T>
      {/* Base */}
      <T x={108} y={183} size={9} bold color="#34C759">base (b)</T>
      <T x={140} y={196} size={9} bold color="#2563EB" align="middle">Area = base × height = b × h</T>
      <T x={140} y={208} size={8} color="#8E8E93" align="middle">Parallelograms on same base and between same parallels are equal</T>
    </svg>
  );
}
function Icse9AreaTriangle() {
  return (
    <svg viewBox="0 0 280 210" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      {/* Parallelogram and its half triangle */}
      <polygon points="40,170 220,170 260,70 80,70" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1.5" strokeDasharray="4,2"/>
      <polygon points="40,170 220,170 130,70" fill="#F0FDF4" stroke="#16A34A" strokeWidth="2"/>
      <T x={28} y={183} size={9} bold color="#16A34A">A</T>
      <T x={222} y={183} size={9} bold color="#16A34A">B</T>
      <T x={126} y={64} size={9} bold color="#16A34A">C</T>
      {/* Height */}
      <line x1="130" y1="70" x2="130" y2="170" stroke="#FF3B30" strokeWidth="1.5" strokeDasharray="4,2"/>
      <rect x="122" y="162" width="8" height="8" fill="none" stroke="#FF3B30" strokeWidth="1.5"/>
      <T x={136} y={122} size={9} bold color="#FF3B30">h</T>
      <T x={130} y={183} size={9} bold color="#34C759">b</T>
      <T x={140} y={196} size={9} bold color="#16A34A" align="middle">Area of △ = ½ × base × height = ½bh</T>
      <T x={140} y={208} size={8} color="#8E8E93" align="middle">Triangle is half the parallelogram on same base + parallels</T>
    </svg>
  );
}
function Icse9AreaProof() {
  return (
    <svg viewBox="0 0 280 210" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      {/* Two triangles on same base between same parallels */}
      <line x1="20" y1="60" x2="260" y2="60" stroke="#9333EA" strokeWidth="1" strokeDasharray="5,3"/>
      <line x1="20" y1="170" x2="260" y2="170" stroke="#9333EA" strokeWidth="1" strokeDasharray="5,3"/>
      {/* Triangle 1: △ABP */}
      <polygon points="40,170 200,170 100,60" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2"/>
      <T x={28} y={183} size={8} bold color="#2563EB">A</T>
      <T x={202} y={183} size={8} bold color="#2563EB">B</T>
      <T x={96} y={54} size={8} bold color="#2563EB">P</T>
      {/* Triangle 2: △ABQ */}
      <polygon points="40,170 200,170 180,60" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" strokeDasharray="4,2" fill-opacity="0.4"/>
      <T x={182} y={54} size={8} bold color="#D97706">Q</T>
      {/* Same base AB */}
      <T x={120} y={183} size={9} bold color="#34C759">base AB</T>
      <T x={140} y={196} size={9} bold color="#FF3B30" align="middle">ar(△ABP) = ar(△ABQ)</T>
      <T x={140} y={208} size={8} color="#8E8E93" align="middle">Same base AB, same height (between ∥ lines)</T>
    </svg>
  );
}
function Icse9AreaProblems() {
  return (
    <svg viewBox="0 0 280 210" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      {/* Quadrilateral divided into triangles via diagonal */}
      <polygon points="50,50 230,70 200,170 30,160" fill="#F0F9FF" stroke="#0284C7" strokeWidth="2"/>
      <T x={38} y={44} size={9} bold color="#0284C7">A</T>
      <T x={232} y={68} size={9} bold color="#0284C7">B</T>
      <T x={202} y={180} size={9} bold color="#0284C7">C</T>
      <T x={18} y={164} size={9} bold color="#0284C7">D</T>
      {/* Diagonal AC */}
      <line x1="50" y1="50" x2="200" y2="170" stroke="#FF3B30" strokeWidth="1.5" strokeDasharray="4,2"/>
      {/* Heights from B and D to AC */}
      <line x1="230" y1="70" x2="150" y2="118" stroke="#34C759" strokeWidth="1.5" strokeDasharray="3,2"/>
      <T x={196} y={88} size={8} bold color="#34C759">h₁</T>
      <line x1="30" y1="160" x2="100" y2="108" stroke="#FF9500" strokeWidth="1.5" strokeDasharray="3,2"/>
      <T x={52} y={128} size={8} bold color="#FF9500">h₂</T>
      <T x={140} y={192} size={9} bold color="#FF3B30" align="middle">ar(ABCD) = ½ × AC × (h₁ + h₂)</T>
      <T x={140} y={205} size={8} color="#8E8E93" align="middle">Quadrilateral area = diagonal × sum of perpendiculars ÷ 2</T>
    </svg>
  );
}

// ── Ch17 — Circle (Chord Properties) ─────────────────────────────────────────
function Icse9CircleBasicsComp() {
  return (
    <svg viewBox="0 0 280 210" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      <circle cx="140" cy="105" r="80" fill="#F0F9FF" stroke="#0284C7" strokeWidth="2"/>
      <circle cx="140" cy="105" r="4" fill="#0284C7"/><T x={144} y={103} size={9} bold color="#0284C7">O</T>
      {/* Radius OA */}
      <line x1="140" y1="105" x2="220" y2="105" stroke="#FF3B30" strokeWidth="2"/>
      <circle cx="220" cy="105" r="4" fill="#FF3B30"/><T x={224} y={103} size={9} bold color="#FF3B30">A</T>
      <T x={176} y={98} size={9} bold color="#FF3B30">r</T>
      {/* Diameter through centre */}
      <line x1="60" y1="105" x2="220" y2="105" stroke="#9333EA" strokeWidth="1.5" strokeDasharray="4,2"/>
      <circle cx="60" cy="105" r="4" fill="#9333EA"/><T x={44} y={103} size={9} bold color="#9333EA">B</T>
      <T x={140} y={126} size={9} bold color="#9333EA" align="middle">BA = diameter = 2r</T>
      {/* Chord PQ */}
      <line x1="80" y1="60" x2="210" y2="150" stroke="#16A34A" strokeWidth="2"/>
      <circle cx="80" cy="60" r="4" fill="#16A34A"/><T x={66} y={56} size={9} bold color="#16A34A">P</T>
      <circle cx="210" cy="150" r="4" fill="#16A34A"/><T x={214} y={152} size={9} bold color="#16A34A">Q</T>
      <T x={124} y={100} size={8} bold color="#16A34A">chord PQ</T>
      <T x={140} y={196} size={9} bold color="#0284C7" align="middle">Radius r, Diameter d=2r, Chord &lt; diameter</T>
      <T x={140} y={208} size={8} color="#8E8E93" align="middle">Circumference = 2πr  |  Area = πr²</T>
    </svg>
  );
}
function Icse9ChordProp() {
  return (
    <svg viewBox="0 0 280 220" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      <circle cx="140" cy="110" r="80" fill="#F0FDF4" stroke="#16A34A" strokeWidth="2"/>
      <circle cx="140" cy="110" r="4" fill="#16A34A"/><T x={144} y={108} size={9} bold color="#16A34A">O</T>
      {/* Chord AB */}
      <line x1="70" y1="70" x2="210" y2="150" stroke="#2563EB" strokeWidth="2"/>
      <circle cx="70" cy="70" r="4" fill="#2563EB"/><T x={56} y={66} size={9} bold color="#2563EB">A</T>
      <circle cx="210" cy="150" r="4" fill="#2563EB"/><T x={214} y={152} size={9} bold color="#2563EB">B</T>
      {/* Midpoint M of AB */}
      <circle cx="140" cy="110" r="3" fill="#FF3B30"/>
      {/* perpendicular from O to M on AB */}
      <line x1="140" y1="110" x2="140" y2="110"/>
      <circle cx="140" cy="110" r="3" fill="none"/>
      {/* OM to chord midpoint */}
      <circle cx="139" cy="110" r="3" fill="#FF3B30"/>
      <line x1="140" y1="20" x2="140" y2="200" stroke="#FF3B30" strokeWidth="1.5" strokeDasharray="4,2"/>
      <T x={144} y={18} size={8} bold color="#FF3B30">OM ⊥ AB</T>
      <T x={140} y={210} size={9} bold color="#16A34A" align="middle">Perp from centre bisects chord: AM = MB</T>
      <T x={140} y={222} size={8} color="#8E8E93" align="middle">Equal chords are equidistant from the centre</T>
    </svg>
  );
}
function Icse9ArcProp() {
  return (
    <svg viewBox="0 0 280 210" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      <circle cx="140" cy="105" r="80" fill="#FFF7ED" stroke="#EA580C" strokeWidth="2"/>
      <circle cx="140" cy="105" r="4" fill="#EA580C"/><T x={144} y={103} size={9} bold color="#EA580C">O</T>
      {/* Points A and B on circle */}
      <circle cx="80" cy="60" r="4" fill="#2563EB"/><T x={66} y={56} size={9} bold color="#2563EB">A</T>
      <circle cx="200" cy="60" r="4" fill="#2563EB"/><T x={204} y={56} size={9} bold color="#2563EB">B</T>
      {/* Minor arc AB */}
      <path d="M80 60 A80 80 0 0 1 200 60" fill="none" stroke="#FF3B30" strokeWidth="3"/>
      <T x={140} y={40} size={9} bold color="#FF3B30" align="middle">minor arc</T>
      {/* Major arc AB */}
      <path d="M80 60 A80 80 0 0 0 200 60" fill="none" stroke="#34C759" strokeWidth="2" strokeDasharray="4,2"/>
      <T x={140} y={185} size={8} bold color="#34C759" align="middle">major arc</T>
      {/* Central angle */}
      <line x1="140" y1="105" x2="80" y2="60" stroke="#EA580C" strokeWidth="1.5"/>
      <line x1="140" y1="105" x2="200" y2="60" stroke="#EA580C" strokeWidth="1.5"/>
      <path d="M118 98 A24 24 0 0 1 162 98" fill="none" stroke="#EA580C" strokeWidth="1.5"/>
      <T x={140} y={94} size={9} bold color="#EA580C" align="middle">∠AOB</T>
      <T x={140} y={200} size={9} bold color="#FF3B30" align="middle">Equal arcs ↔ Equal chords ↔ Equal central angles</T>
    </svg>
  );
}
function Icse9CircleProbComp() {
  return (
    <svg viewBox="0 0 280 210" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      {/* Two equal chords equidistant from centre */}
      <circle cx="140" cy="105" r="80" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2"/>
      <circle cx="140" cy="105" r="4" fill="#2563EB"/><T x={144} y={103} size={9} bold color="#2563EB">O</T>
      {/* Chord AB */}
      <line x1="76" y1="70" x2="204" y2="70" stroke="#FF3B30" strokeWidth="2"/>
      <circle cx="76" cy="70" r="3" fill="#FF3B30"/><T x={62} y={66} size={8} bold color="#FF3B30">A</T>
      <circle cx="204" cy="70" r="3" fill="#FF3B30"/><T x={208} y={66} size={8} bold color="#FF3B30">B</T>
      {/* Chord CD */}
      <line x1="76" y1="140" x2="204" y2="140" stroke="#16A34A" strokeWidth="2"/>
      <circle cx="76" cy="140" r="3" fill="#16A34A"/><T x={62} y={138} size={8} bold color="#16A34A">C</T>
      <circle cx="204" cy="140" r="3" fill="#16A34A"/><T x={208} y={138} size={8} bold color="#16A34A">D</T>
      {/* OM and ON perpendiculars */}
      <line x1="140" y1="105" x2="140" y2="70" stroke="#FF9500" strokeWidth="1.5" strokeDasharray="3,2"/>
      <T x={144} y={88} size={8} color="#FF9500">d₁</T>
      <line x1="140" y1="105" x2="140" y2="140" stroke="#FF9500" strokeWidth="1.5" strokeDasharray="3,2"/>
      <T x={144} y={126} size={8} color="#FF9500">d₂</T>
      <T x={140} y={196} size={9} bold color="#FF3B30" align="middle">AB = CD  ⟺  d₁ = d₂</T>
      <T x={140} y={208} size={8} color="#8E8E93" align="middle">Equal chords are equidistant from the centre</T>
    </svg>
  );
}

// ── Ch20 — Area and Perimeter of Plane Figures ────────────────────────────────
function Icse9AreaPlane() {
  return (
    <svg viewBox="0 0 300 210" style={{ width:"100%", maxWidth:300, height:"auto" }}>
      {/* Rectangle */}
      <rect x="10" y="30" width="80" height="50" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2"/>
      <T x={50} y={52} size={8} bold color="#2563EB" align="middle">l × b</T>
      <T x={50} y={90} size={7} color="#8E8E93" align="middle">Rectangle</T>
      {/* Triangle */}
      <polygon points="120,80 200,80 160,30" fill="#F0FDF4" stroke="#16A34A" strokeWidth="2"/>
      <T x={160} y={62} size={8} bold color="#16A34A" align="middle">½bh</T>
      <T x={160} y={92} size={7} color="#8E8E93" align="middle">Triangle</T>
      {/* Parallelogram */}
      <polygon points="220,80 290,80 300,30 230,30" fill="#FFF7ED" stroke="#EA580C" strokeWidth="2"/>
      <T x={258} y={58} size={8} bold color="#EA580C" align="middle">b×h</T>
      <T x={258} y={92} size={7} color="#8E8E93" align="middle">Parallelogram</T>
      {/* Trapezium */}
      <polygon points="20,160 120,160 100,110 40,110" fill="#FDF4FF" stroke="#9333EA" strokeWidth="2"/>
      <T x={70} y={138} size={8} bold color="#9333EA" align="middle">½(a+b)h</T>
      <T x={70} y={172} size={7} color="#8E8E93" align="middle">Trapezium</T>
      {/* Rhombus */}
      <polygon points="200,110 230,140 200,170 170,140" fill="#FEF3C7" stroke="#D97706" strokeWidth="2"/>
      <T x={200} y={143} size={8} bold color="#D97706" align="middle">½d₁d₂</T>
      <T x={200} y={181} size={7} color="#8E8E93" align="middle">Rhombus</T>
      <T x={150} y={198} size={9} bold color="#1C1C1E" align="middle">Area formulae for plane figures</T>
    </svg>
  );
}
function Icse9PerimeterPlane() {
  return (
    <svg viewBox="0 0 280 200" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      {/* Rectangle with perimeter highlighted */}
      <rect x="50" y="40" width="180" height="100" fill="#EFF6FF" stroke="#2563EB" strokeWidth="3"/>
      <T x={50} y={32} size={9} bold color="#2563EB">l = 9 cm</T>
      <T x={236} y={96} size={9} bold color="#FF3B30">b = 5 cm</T>
      {/* Arrows showing perimeter path */}
      <T x={140} y={58} size={8} color="#FF3B30" align="middle">→→→→→ l →→→→→</T>
      <T x={140} y={152} size={8} color="#FF3B30" align="middle">←←←←← l ←←←←←</T>
      <T x={36} y={96} size={8} color="#34C759">b↕</T>
      <T x={244} y={96} size={8} color="#34C759">↕b</T>
      <rect x="10" y="156" width="260" height="38" rx="6" fill="#F0F9FF"/>
      <T x={140} y={170} size={9} bold color="#2563EB" align="middle">Perimeter = 2(l + b) = 2(9+5) = 28 cm</T>
      <T x={140} y={184} size={8} color="#8E8E93" align="middle">Perimeter = total distance around the boundary</T>
    </svg>
  );
}
function Icse9CircleAreaPerim() {
  return (
    <svg viewBox="0 0 260 210" style={{ width:"100%", maxWidth:260, height:"auto" }}>
      <circle cx="130" cy="100" r="80" fill="#FEF3C7" stroke="#D97706" strokeWidth="2"/>
      <ellipse cx="130" cy="100" rx="80" ry="18" fill="none" stroke="#D97706" strokeWidth="1.5" strokeDasharray="4,2"/>
      <line x1="130" y1="100" x2="210" y2="100" stroke="#FF3B30" strokeWidth="2.5"/>
      <T x={166} y={94} size={10} bold color="#FF3B30">r</T>
      <circle cx="130" cy="100" r="4" fill="#D97706"/>
      <T x={134} y={98} size={9} bold color="#D97706">O</T>
      {/* Circumference arc label */}
      <path d="M210 100 A80 80 0 0 1 130 20" fill="none" stroke="#9333EA" strokeWidth="2.5"/>
      <T x={196} y={55} size={8} bold color="#9333EA">C = 2πr</T>
      <rect x="20" y="186" width="220" height="22" rx="5" fill="#FEF3C7"/>
      <T x={130} y={198} size={9} bold color="#D97706" align="middle">Area = πr²  |  Circumference = 2πr</T>
    </svg>
  );
}
function Icse9AreaPerimProblems() {
  return (
    <svg viewBox="0 0 280 210" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      {/* Combined figure: rectangle + semicircle on top */}
      <rect x="70" y="90" width="140" height="100" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2"/>
      <path d="M70 90 A70 70 0 0 1 210 90" fill="#DBEAFE" stroke="#2563EB" strokeWidth="2"/>
      {/* Dimensions */}
      <T x={140} y={143} size={9} bold color="#2563EB" align="middle">l = 140 m</T>
      <T x={218} y={143} size={9} bold color="#FF3B30">b</T>
      <line x1="60" y1="90" x2="60" y2="190" stroke="#FF3B30" strokeWidth="1.5"/>
      <T x={40} y={143} size={9} bold color="#FF3B30">b</T>
      <T x={140} y={56} size={8} color="#9333EA" align="middle">r = l/2 = 70 m</T>
      <T x={140} y={196} size={9} bold color="#FF3B30" align="middle">Total Area = l×b + ½πr²</T>
      <T x={140} y={208} size={8} color="#8E8E93" align="middle">Perimeter = 2b + l + πr (semicircle on rectangle)</T>
    </svg>
  );
}

// ── Ch21 — Solids (Surface Area and Volume) ───────────────────────────────────
function Icse9Cuboid() {
  return (
    <svg viewBox="0 0 280 210" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      {/* Cuboid in 3D perspective */}
      <polygon points="50,160 200,160 200,80 50,80" fill="#DBEAFE" stroke="#2563EB" strokeWidth="2"/>
      <polygon points="200,80 240,40 240,120 200,160" fill="#BFDBFE" stroke="#2563EB" strokeWidth="2"/>
      <polygon points="50,80 90,40 240,40 200,80" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2"/>
      {/* Labels */}
      <line x1="50" y1="160" x2="50" y2="80" stroke="#FF3B30" strokeWidth="1.5"/>
      <T x={30} y={124} size={9} bold color="#FF3B30">h</T>
      <line x1="50" y1="160" x2="200" y2="160" stroke="#34C759" strokeWidth="1.5"/>
      <T x={122} y={172} size={9} bold color="#34C759">l</T>
      <line x1="200" y1="160" x2="240" y2="120" stroke="#FF9500" strokeWidth="1.5"/>
      <T x={230} y={146} size={9} bold color="#FF9500">w</T>
      <rect x="10" y="180" width="260" height="26" rx="6" fill="#EFF6FF"/>
      <T x={140} y={192} size={8} bold color="#2563EB" align="middle">LSA = 2h(l+w)  TSA = 2(lw+wh+hl)</T>
      <T x={140} y={203} size={8} bold color="#2563EB" align="middle">Volume = l × w × h</T>
    </svg>
  );
}
function Icse9ConePyramid() {
  return (
    <svg viewBox="0 0 280 210" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      {/* Cone on left */}
      <ellipse cx="70" cy="160" rx="50" ry="14" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1.5"/>
      <line x1="20" y1="160" x2="70" y2="50" stroke="#16A34A" strokeWidth="2"/>
      <line x1="120" y1="160" x2="70" y2="50" stroke="#16A34A" strokeWidth="2"/>
      <circle cx="70" cy="50" r="3" fill="#16A34A"/>
      <line x1="70" y1="50" x2="70" y2="160" stroke="#16A34A" strokeWidth="1" strokeDasharray="3,2"/>
      <T x={74} y={108} size={8} color="#16A34A">h</T>
      <T x={90} y={158} size={8} color="#FF3B30">r</T>
      <T x={70} y={185} size={8} bold color="#16A34A" align="middle">Cone</T>
      <T x={70} y={196} size={7} color="#8E8E93" align="middle">V=⅓πr²h</T>
      {/* Pyramid on right */}
      <polygon points="165,160 255,160 255,160 165,160" fill="none"/>
      <polygon points="155,160 265,160 240,80 180,80" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5"/>
      <polygon points="155,160 180,80 210,50" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5"/>
      <polygon points="265,160 240,80 210,50" fill="#FFFBEB" stroke="#D97706" strokeWidth="1.5"/>
      <polygon points="180,80 240,80 210,50" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5"/>
      <line x1="210" y1="50" x2="210" y2="160" stroke="#D97706" strokeWidth="1" strokeDasharray="3,2"/>
      <T x={214} y={108} size={8} color="#D97706">h</T>
      <T x={210} y={185} size={8} bold color="#D97706" align="middle">Pyramid</T>
      <T x={210} y={196} size={7} color="#8E8E93" align="middle">V=⅓×base×h</T>
      <T x={140} y={208} size={9} bold color="#1C1C1E" align="middle">Both: V = ⅓ × Base Area × height</T>
    </svg>
  );
}
function Icse9SphereHemisphere() {
  return (
    <svg viewBox="0 0 280 210" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      {/* Sphere on left */}
      <circle cx="70" cy="95" r="65" fill="#FEF3C7" stroke="#D97706" strokeWidth="2"/>
      <ellipse cx="70" cy="95" rx="65" ry="16" fill="none" stroke="#D97706" strokeWidth="1" strokeDasharray="4,2"/>
      <line x1="70" y1="95" x2="135" y2="95" stroke="#FF3B30" strokeWidth="2"/>
      <T x={98} y={89} size={9} bold color="#FF3B30">r</T>
      <circle cx="70" cy="95" r="3" fill="#D97706"/>
      <T x={70} y={174} size={8} bold color="#D97706" align="middle">Sphere</T>
      <T x={70} y={185} size={7} color="#8E8E93" align="middle">SA=4πr²  V=⁴⁄₃πr³</T>
      {/* Hemisphere on right */}
      <path d="M145 125 A65 65 0 0 1 275 125" fill="#DBEAFE" stroke="#2563EB" strokeWidth="2"/>
      <ellipse cx="210" cy="125" rx="65" ry="16" fill="#BFDBFE" stroke="#2563EB" strokeWidth="2"/>
      <line x1="210" y1="125" x2="275" y2="125" stroke="#FF3B30" strokeWidth="2"/>
      <T x={238} y={119} size={9} bold color="#FF3B30">r</T>
      <circle cx="210" cy="125" r="3" fill="#2563EB"/>
      <T x={210} y={174} size={8} bold color="#2563EB" align="middle">Hemisphere</T>
      <T x={210} y={185} size={7} color="#8E8E93" align="middle">CSA=2πr²  TSA=3πr²</T>
      <T x={140} y={200} size={7} color="#8E8E93" align="middle">Hemisphere Vol = ²⁄₃πr³</T>
    </svg>
  );
}
function Icse9SolidProblems() {
  return (
    <svg viewBox="0 0 260 220" style={{ width:"100%", maxWidth:260, height:"auto" }}>
      {/* Cylinder with hemisphere on top */}
      <ellipse cx="130" cy="150" rx="60" ry="16" fill="#DBEAFE" stroke="#2563EB" strokeWidth="2"/>
      <ellipse cx="130" cy="80" rx="60" ry="16" fill="#BFDBFE" stroke="#2563EB" strokeWidth="2"/>
      <line x1="70" y1="80" x2="70" y2="150" stroke="#2563EB" strokeWidth="2"/>
      <line x1="190" y1="80" x2="190" y2="150" stroke="#2563EB" strokeWidth="2"/>
      {/* Hemisphere on top */}
      <path d="M70 80 A60 60 0 0 1 190 80" fill="#DCFCE7" stroke="#16A34A" strokeWidth="2"/>
      {/* Labels */}
      <line x1="195" y1="80" x2="195" y2="150" stroke="#34C759" strokeWidth="1.5"/>
      <T x={200} y={118} size={9} bold color="#34C759">h</T>
      <line x1="130" y1="80" x2="190" y2="80" stroke="#FF3B30" strokeWidth="1.5"/>
      <T x={156} y={74} size={9} bold color="#FF3B30">r</T>
      <T x={130} y={172} size={8} bold color="#2563EB" align="middle">Total Vol = πr²h + ²⁄₃πr³</T>
      <T x={130} y={184} size={8} bold color="#16A34A" align="middle">Total SA = 2πrh + 2πr² (bottom + side + dome)</T>
      <T x={130} y={206} size={8} color="#8E8E93" align="middle">Combine: add volumes, careful with shared face</T>
    </svg>
  );
}

// ── Ch26 — Co-ordinate Geometry ───────────────────────────────────────────────
function Icse9CartesianPlane() {
  return (
    <svg viewBox="0 0 280 260" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      {/* Axes */}
      <line x1="20" y1="130" x2="260" y2="130" stroke="#1C1C1E" strokeWidth="2"/>
      <line x1="140" y1="10" x2="140" y2="250" stroke="#1C1C1E" strokeWidth="2"/>
      <T x={256} y={124} size={9} bold>x</T>
      <T x={134} y={8} size={9} bold>y</T>
      {/* Quadrant labels */}
      <T x={190} y={80} size={10} bold color="#2563EB">I (+,+)</T>
      <T x={60} y={80} size={10} bold color="#16A34A">II (−,+)</T>
      <T x={60} y={180} size={10} bold color="#EA580C">III (−,−)</T>
      <T x={180} y={180} size={10} bold color="#9333EA">IV (+,−)</T>
      {/* Tick marks on axes */}
      {[-2,-1,1,2].map(n => (
        <g key={n}>
          <line x1={140+n*40} y1={126} x2={140+n*40} y2={134} stroke="#8E8E93" strokeWidth="1"/>
          <T x={140+n*40} y={144} size={8} color="#8E8E93" align="middle">{n}</T>
          <line x1={136} y1={130-n*40} x2={144} y2={130-n*40} stroke="#8E8E93" strokeWidth="1"/>
          <T x={126} y={134-n*40} size={8} color="#8E8E93" align="middle">{n}</T>
        </g>
      ))}
      <T x={140} y={248} size={9} bold color="#1C1C1E" align="middle">Cartesian plane: 2 perpendicular axes, 4 quadrants</T>
    </svg>
  );
}
function Icse9PlottingPoints() {
  return (
    <svg viewBox="0 0 280 260" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      {/* Axes */}
      <line x1="20" y1="140" x2="260" y2="140" stroke="#D1D5DB" strokeWidth="1.5"/>
      <line x1="140" y1="10" x2="140" y2="260" stroke="#D1D5DB" strokeWidth="1.5"/>
      {/* Grid */}
      {[-3,-2,-1,1,2,3].map(n=>(
        <g key={n}>
          <line x1={140+n*35} y1={10} x2={140+n*35} y2={260} stroke="#F3F4F6" strokeWidth="1"/>
          <line x1={20} y1={140-n*35} x2={260} y2={140-n*35} stroke="#F3F4F6" strokeWidth="1"/>
        </g>
      ))}
      <T x={256} y={134} size={8} bold>x</T>
      <T x={134} y={8} size={8} bold>y</T>
      {/* Points */}
      <circle cx="210" cy="105" r="5" fill="#FF3B30"/>
      <T x={215} y={100} size={8} bold color="#FF3B30">A(2,1)</T>
      <circle cx="105" cy="70" r="5" fill="#16A34A"/>
      <T x={60} y={65} size={8} bold color="#16A34A">B(−1,2)</T>
      <circle cx="70" cy="210" r="5" fill="#EA580C"/>
      <T x={20} y={218} size={8} bold color="#EA580C">C(−2,−2)</T>
      <circle cx="210" cy="210" r="5" fill="#9333EA"/>
      <T x={214} y={218} size={8} bold color="#9333EA">D(2,−2)</T>
      {/* Dashed reference lines for A */}
      <line x1="210" y1="105" x2="210" y2="140" stroke="#FF3B30" strokeWidth="1" strokeDasharray="3,2"/>
      <line x1="140" y1="105" x2="210" y2="105" stroke="#FF3B30" strokeWidth="1" strokeDasharray="3,2"/>
      <T x={140} y={252} size={9} bold color="#1C1C1E" align="middle">Plot P(x,y): move x right/left, y up/down from O</T>
    </svg>
  );
}
function Icse9DistanceMidpoint() {
  return (
    <svg viewBox="0 0 280 240" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      {/* Axes */}
      <line x1="20" y1="160" x2="260" y2="160" stroke="#D1D5DB" strokeWidth="1.5"/>
      <line x1="60" y1="10" x2="60" y2="230" stroke="#D1D5DB" strokeWidth="1.5"/>
      {/* Points P and Q */}
      <circle cx="100" cy="60" r="5" fill="#2563EB"/>
      <T x={86} y={52} size={9} bold color="#2563EB">P(x₁,y₁)</T>
      <circle cx="240" cy="140" r="5" fill="#FF3B30"/>
      <T x={224} y={132} size={9} bold color="#FF3B30">Q(x₂,y₂)</T>
      {/* Line PQ */}
      <line x1="100" y1="60" x2="240" y2="140" stroke="#9333EA" strokeWidth="2"/>
      {/* Right angle triangle */}
      <line x1="100" y1="60" x2="240" y2="60" stroke="#34C759" strokeWidth="1.5" strokeDasharray="4,2"/>
      <line x1="240" y1="60" x2="240" y2="140" stroke="#EA580C" strokeWidth="1.5" strokeDasharray="4,2"/>
      <rect x="232" y="52" width="8" height="8" fill="none" stroke="#8E8E93" strokeWidth="1.5"/>
      <T x={170} y={52} size={8} color="#34C759">|x₂−x₁|</T>
      <T x={248} y={102} size={8} color="#EA580C">|y₂−y₁|</T>
      {/* Midpoint M */}
      <circle cx="170" cy="100" r="4" fill="#FF9500"/>
      <T x={174} y={98} size={8} bold color="#FF9500">M</T>
      <rect x="10" y="190" width="260" height="44" rx="6" fill="#EFF6FF"/>
      <T x={140} y={204} size={8} bold color="#9333EA" align="middle">PQ = √[(x₂−x₁)² + (y₂−y₁)²]</T>
      <T x={140} y={218} size={8} bold color="#FF9500" align="middle">M = ((x₁+x₂)/2 , (y₁+y₂)/2)</T>
      <T x={140} y={230} size={7} color="#8E8E93" align="middle">Distance formula | Midpoint formula</T>
    </svg>
  );
}
function Icse9CoordProblems() {
  return (
    <svg viewBox="0 0 280 260" style={{ width:"100%", maxWidth:280, height:"auto" }}>
      {/* Triangle in coordinate plane */}
      <line x1="20" y1="190" x2="260" y2="190" stroke="#D1D5DB" strokeWidth="1.5"/>
      <line x1="60" y1="10" x2="60" y2="240" stroke="#D1D5DB" strokeWidth="1.5"/>
      {/* Grid */}
      {[1,2,3,4].map(n=>(
        <g key={n}>
          <line x1={60+n*44} y1={10} x2={60+n*44} y2={240} stroke="#F3F4F6" strokeWidth="1"/>
          <line x1={20} y1={190-n*40} x2={260} y2={190-n*40} stroke="#F3F4F6" strokeWidth="1"/>
        </g>
      ))}
      <T x={256} y={184} size={8} bold>x</T>
      <T x={54} y={8} size={8} bold>y</T>
      {/* Triangle ABC */}
      <polygon points="104,190 236,190 170,70" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2"/>
      <circle cx="104" cy="190" r="4" fill="#2563EB"/>
      <T x={88} y={203} size={8} bold color="#2563EB">A(1,0)</T>
      <circle cx="236" cy="190" r="4" fill="#FF3B30"/>
      <T x={222} y={203} size={8} bold color="#FF3B30">B(4,0)</T>
      <circle cx="170" cy="70" r="4" fill="#16A34A"/>
      <T x={174} y={64} size={8} bold color="#16A34A">C(3,3)</T>
      {/* Distances */}
      <T x={170} y={195} size={7} color="#34C759">AB=3</T>
      <T x={216} y={132} size={7} color="#9333EA">BC=√10</T>
      <T x={108} y={132} size={7} color="#FF9500">CA=√8</T>
      <T x={140} y={225} size={9} bold color="#2563EB" align="middle">Find sides, perimeter, type of triangle</T>
      <T x={140} y={238} size={8} color="#8E8E93" align="middle">Use distance formula for each side, then compare</T>
    </svg>
  );
}

// ── CBSE CLASS 9 MATHEMATICS ─────────────────────────────────────────────────
// Ch2 — Linear Polynomials
function CbseMath9PolyBasics() {
  return (
    <svg viewBox="0 0 280 200" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="10" width="260" height="42" rx="8" fill="#EFF6FF" stroke="#2563EB" strokeWidth="1.5"/>
      <T x={140} y={30} size={11} bold color="#1C1C1E" align="middle">p(x) = 3x³ − 5x² + 2x − 7</T>
      <T x={140} y={46} size={8} color="#8E8E93" align="middle">A polynomial in one variable</T>
      <rect x="10" y="60" width="120" height="52" rx="6" fill="#F0FDF4"/>
      <T x={70} y={78} size={9} bold color="#16A34A" align="middle">Degree</T>
      <T x={70} y={100} size={14} bold color="#16A34A" align="middle">3</T>
      <rect x="150" y="60" width="120" height="52" rx="6" fill="#FEF3C7"/>
      <T x={210} y={78} size={9} bold color="#D97706" align="middle">Leading coeff</T>
      <T x={210} y={100} size={14} bold color="#D97706" align="middle">3</T>
      <rect x="10" y="120" width="120" height="52" rx="6" fill="#FFF0F0"/>
      <T x={70} y={138} size={9} bold color="#FF3B30" align="middle">Constant term</T>
      <T x={70} y={160} size={14} bold color="#FF3B30" align="middle">−7</T>
      <rect x="150" y="120" width="120" height="52" rx="6" fill="#F5F0FF"/>
      <T x={210} y={138} size={9} bold color="#9333EA" align="middle">No. of terms</T>
      <T x={210} y={160} size={14} bold color="#9333EA" align="middle">4</T>
      <T x={140} y={190} size={8} color="#8E8E93" align="middle">Degree = highest power of x in the polynomial</T>
    </svg>
  );
}
function CbseMath9PolyZeroes() {
  return (
    <svg viewBox="0 0 280 220" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <line x1="20" y1="130" x2="260" y2="130" stroke="#D1D5DB" strokeWidth="1.5"/>
      <line x1="140" y1="10" x2="140" y2="210" stroke="#D1D5DB" strokeWidth="1.5"/>
      <T x={253} y={124} size={8} bold>x</T>
      <T x={134} y={8} size={8} bold>y</T>
      {[-2,-1,1,2].map(n=>(
        <g key={n}>
          <line x1={140+n*40} y1={10} x2={140+n*40} y2={210} stroke="#F3F4F6" strokeWidth="1"/>
          <T x={136+n*40} y={144} size={7} color="#8E8E93">{n}</T>
        </g>
      ))}
      <path d="M 56,28 Q 140,220 240,28" fill="none" stroke="#007AFF" strokeWidth="2.5"/>
      <circle cx="100" cy="130" r="5" fill="#FF3B30"/>
      <T x={72} y={148} size={9} bold color="#FF3B30">x = −1</T>
      <circle cx="220" cy="130" r="5" fill="#FF3B30"/>
      <T x={198} y={148} size={9} bold color="#FF3B30">x = 2</T>
      <T x={140} y={172} size={8} color="#007AFF" align="middle">p(x) = (x + 1)(x − 2)</T>
      <T x={140} y={188} size={9} bold color="#FF3B30" align="middle">Zeroes = x-intercepts of the graph</T>
      <T x={140} y={204} size={8} color="#8E8E93" align="middle">p(−1) = 0  and  p(2) = 0</T>
    </svg>
  );
}
function CbseMath9RemainderThm() {
  return (
    <svg viewBox="0 0 280 210" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="10" width="260" height="56" rx="8" fill="#EFF6FF" stroke="#2563EB" strokeWidth="1.5"/>
      <T x={140} y={30} size={10} bold color="#2563EB" align="middle">Remainder Theorem</T>
      <T x={140} y={48} size={9} color="#1C1C1E" align="middle">When p(x) ÷ (x − a),</T>
      <T x={140} y={62} size={10} bold color="#9333EA" align="middle">remainder = p(a)</T>
      <line x1="20" y1="78" x2="260" y2="78" stroke="#E5E7EB" strokeWidth="1"/>
      <T x={30} y={98} size={9} color="#1C1C1E">p(x) = x³ − 2x² + x − 5,  divide by (x − 2)</T>
      <T x={30} y={116} size={9} color="#1C1C1E">Remainder = p(2)</T>
      <rect x="10" y="126" width="260" height="46" rx="6" fill="#F0FDF4"/>
      <T x={140} y={146} size={9} color="#16A34A" align="middle">p(2) = 8 − 8 + 2 − 5 = −3</T>
      <T x={140} y={164} size={10} bold color="#16A34A" align="middle">∴ Remainder = −3</T>
      <rect x="10" y="182" width="260" height="22" rx="6" fill="#FFF7ED"/>
      <T x={140} y={197} size={8} color="#D97706" align="middle">No long division needed — just substitute x = a</T>
    </svg>
  );
}
function CbseMath9FactorThm() {
  return (
    <svg viewBox="0 0 280 196" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="10" width="260" height="54" rx="8" fill="#EFF6FF" stroke="#2563EB" strokeWidth="1.5"/>
      <T x={140} y={30} size={10} bold color="#2563EB" align="middle">Factor Theorem</T>
      <T x={140} y={48} size={9} color="#1C1C1E" align="middle">(x − a) is a factor of p(x)</T>
      <T x={140} y={62} size={10} bold color="#9333EA" align="middle">⟺  p(a) = 0</T>
      <T x={140} y={82} size={12} color="#8E8E93" align="middle">↕</T>
      <rect x="10" y="92" width="122" height="60" rx="6" fill="#F0FDF4"/>
      <T x={71} y={112} size={8} bold color="#16A34A" align="middle">p(a) = 0</T>
      <T x={71} y={128} size={8} color="#16A34A" align="middle">⟹ (x−a)</T>
      <T x={71} y={144} size={8} color="#16A34A" align="middle">is a factor</T>
      <rect x="148" y="92" width="122" height="60" rx="6" fill="#FFF0F0"/>
      <T x={209} y={112} size={8} bold color="#FF3B30" align="middle">(x−a) is factor</T>
      <T x={209} y={128} size={8} color="#FF3B30" align="middle">⟹ p(a) = 0</T>
      <T x={209} y={144} size={8} color="#FF3B30" align="middle">(always)</T>
      <T x={140} y={182} size={8} color="#8E8E93" align="middle">Example: p(2)=0 ⟹ (x−2) divides p(x) exactly</T>
    </svg>
  );
}
// Ch3 — The World of Numbers
function CbseMath9NumberHierarchy() {
  return (
    <svg viewBox="0 0 280 236" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <ellipse cx="140" cy="116" rx="128" ry="100" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2"/>
      <T x={22} y={30} size={9} bold color="#2563EB">ℝ Real Numbers</T>
      <ellipse cx="122" cy="126" rx="84" ry="72" fill="#F0FDF4" stroke="#16A34A" strokeWidth="1.5"/>
      <T x={44} y={62} size={8} bold color="#16A34A">ℚ Rational</T>
      <ellipse cx="114" cy="134" rx="56" ry="50" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5"/>
      <T x={64} y={90} size={8} bold color="#D97706">ℤ Integers</T>
      <ellipse cx="108" cy="142" rx="34" ry="32" fill="#FFF0F0" stroke="#FF3B30" strokeWidth="1.5"/>
      <T x={78} y={116} size={7} bold color="#FF3B30">W Whole</T>
      <ellipse cx="104" cy="148" rx="18" ry="18" fill="#F5F0FF" stroke="#9333EA" strokeWidth="1.5"/>
      <T x={96} y={151} size={7} bold color="#9333EA">ℕ</T>
      <T x={188} y={96} size={8} bold color="#2563EB">Irrationals</T>
      <T x={190} y={110} size={7} color="#2563EB">√2, π, e…</T>
      <T x={140} y={226} size={8} color="#8E8E93" align="middle">ℕ ⊂ W ⊂ ℤ ⊂ ℚ ⊂ ℝ  ·  Irrationals ⊂ ℝ, ∉ ℚ</T>
    </svg>
  );
}
function CbseMath9IrrationalLine() {
  return (
    <svg viewBox="0 0 280 196" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <line x1="20" y1="96" x2="260" y2="96" stroke="#1C1C1E" strokeWidth="2"/>
      {[0,1,2].map(n=>(
        <g key={n}>
          <line x1={70+n*74} y1={91} x2={70+n*74} y2={101} stroke="#1C1C1E" strokeWidth="1.5"/>
          <T x={67+n*74} y={114} size={9} bold>{n}</T>
        </g>
      ))}
      <circle cx="175" cy="96" r="5" fill="#FF3B30"/>
      <T x={160} y={82} size={9} bold color="#FF3B30">√2</T>
      <line x1="70" y1="96" x2="144" y2="96" stroke="#34C759" strokeWidth="2"/>
      <line x1="144" y1="96" x2="144" y2="30" stroke="#34C759" strokeWidth="2"/>
      <line x1="70" y1="96" x2="144" y2="30" stroke="#EA580C" strokeWidth="2"/>
      <rect x="136" y="88" width="8" height="8" fill="none" stroke="#8E8E93" strokeWidth="1.5"/>
      <T x={104} y={110} size={8} color="#34C759" align="middle">1</T>
      <T x={148} y={66} size={8} color="#34C759">1</T>
      <T x={96} y={54} size={9} bold color="#EA580C">hyp=√2</T>
      <path d="M 144 30 A 74 74 0 0 1 175 96" fill="none" stroke="#9333EA" strokeWidth="1.5" strokeDasharray="4,2"/>
      <rect x="10" y="136" width="260" height="52" rx="6" fill="#FFF7ED"/>
      <T x={140} y={154} size={9} bold color="#D97706" align="middle">√2 cannot be written as p/q (p,q∈ℤ, q≠0)</T>
      <T x={140} y={170} size={8} color="#8E8E93" align="middle">Proof: assume √2 = p/q in lowest terms</T>
      <T x={140} y={184} size={8} color="#8E8E93" align="middle">→ both p and q are even → contradiction</T>
    </svg>
  );
}
function CbseMath9DecimalTypes() {
  return (
    <svg viewBox="0 0 280 216" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="8" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={25} size={10} bold color="#FFFFFF" align="middle">Types of Decimal Expansions</T>
      <rect x="10" y="42" width="124" height="160" rx="6" fill="#F0FDF4" stroke="#16A34A" strokeWidth="1.5"/>
      <T x={72} y={62} size={9} bold color="#16A34A" align="middle">Terminating</T>
      <T x={72} y={78} size={7} color="#16A34A" align="middle">Rational · ends</T>
      <T x={72} y={100} size={9} color="#1C1C1E" align="middle">3/4 = 0.75</T>
      <T x={72} y={116} size={9} color="#1C1C1E" align="middle">1/8 = 0.125</T>
      <T x={72} y={132} size={9} color="#1C1C1E" align="middle">7/20 = 0.35</T>
      <T x={72} y={156} size={7} bold color="#16A34A" align="middle">Denom = 2ᵃ · 5ᵇ</T>
      <T x={72} y={170} size={7} color="#16A34A" align="middle">only 2s and 5s</T>
      <rect x="146" y="42" width="124" height="160" rx="6" fill="#FFF0F0" stroke="#FF3B30" strokeWidth="1.5"/>
      <T x={208} y={62} size={9} bold color="#FF3B30" align="middle">Non-Terminating</T>
      <T x={208} y={78} size={7} color="#FF3B30" align="middle">Recurring · Rational</T>
      <T x={208} y={100} size={9} color="#1C1C1E" align="middle">1/3 = 0.333…</T>
      <T x={208} y={116} size={9} color="#1C1C1E" align="middle">2/7 = 0.285714…</T>
      <T x={208} y={132} size={9} color="#1C1C1E" align="middle">5/6 = 0.8333…</T>
      <T x={208} y={156} size={7} bold color="#FF3B30" align="middle">Denom has prime</T>
      <T x={208} y={170} size={7} bold color="#FF3B30" align="middle">other than 2 or 5</T>
      <T x={140} y={208} size={7} color="#8E8E93" align="middle">Non-terminating non-recurring → Irrational (√2, π…)</T>
    </svg>
  );
}
function CbseMath9RealOps() {
  return (
    <svg viewBox="0 0 280 218" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="8" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={25} size={10} bold color="#FFFFFF" align="middle">Laws of Exponents  (a, b &gt; 0)</T>
      {[
        ["aᵐ × aⁿ = aᵐ⁺ⁿ",    "#2563EB",  52],
        ["aᵐ ÷ aⁿ = aᵐ⁻ⁿ",    "#16A34A",  84],
        ["(aᵐ)ⁿ = aᵐⁿ",       "#9333EA", 116],
        ["(ab)ᵐ = aᵐ · bᵐ",   "#D97706", 148],
        ["a⁰ = 1",             "#FF3B30", 180],
        ["a⁻ⁿ = 1 / aⁿ",      "#EA580C", 210],
      ].map(([rule,color,y])=>(
        <g key={rule}>
          <rect x="20" y={y-18} width="240" height="28" rx="5" fill={color+"18"}/>
          <T x={140} y={y+4} size={10} bold color={color} align="middle">{rule}</T>
        </g>
      ))}
    </svg>
  );
}
// Ch4 — Algebraic Identities
function CbseMath9BasicIdentities() {
  return (
    <svg viewBox="0 0 280 238" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <T x={140} y={14} size={9} bold color="#1C1C1E" align="middle">Geometric Proof: (a+b)² = a²+2ab+b²</T>
      <rect x="30" y="22" width="156" height="156" fill="none" stroke="#1C1C1E" strokeWidth="2"/>
      <line x1="136" y1="22" x2="136" y2="178" stroke="#8E8E93" strokeWidth="1.5" strokeDasharray="4,2"/>
      <line x1="30" y1="128" x2="186" y2="128" stroke="#8E8E93" strokeWidth="1.5" strokeDasharray="4,2"/>
      <rect x="30" y="22" width="106" height="106" fill="#EFF6FF"/>
      <T x={83} y={76} size={14} bold color="#2563EB" align="middle">a²</T>
      <rect x="136" y="22" width="50" height="106" fill="#F0FDF4"/>
      <T x={161} y={76} size={11} bold color="#16A34A" align="middle">ab</T>
      <rect x="30" y="128" width="106" height="50" fill="#F0FDF4"/>
      <T x={83} y={155} size={11} bold color="#16A34A" align="middle">ab</T>
      <rect x="136" y="128" width="50" height="50" fill="#FEF3C7"/>
      <T x={161} y={155} size={11} bold color="#D97706" align="middle">b²</T>
      <T x={83} y={16} size={9} bold color="#2563EB" align="middle">a</T>
      <T x={161} y={16} size={9} bold color="#D97706" align="middle">b</T>
      <T x={22} y={78} size={9} bold color="#2563EB">a</T>
      <T x={22} y={155} size={9} bold color="#D97706">b</T>
      <rect x="10" y="190" width="260" height="40" rx="6" fill="#F5F0FF"/>
      <T x={140} y={206} size={10} bold color="#9333EA" align="middle">(a+b)² = a² + 2ab + b²</T>
      <T x={140} y={224} size={8} color="#8E8E93" align="middle">(a−b)²=a²−2ab+b²  ·  (a+b)(a−b)=a²−b²</T>
    </svg>
  );
}
function CbseMath9CubeIdentities() {
  return (
    <svg viewBox="0 0 280 212" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="8" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={25} size={10} bold color="#FFFFFF" align="middle">Cube Identities</T>
      <rect x="10" y="42" width="260" height="76" rx="6" fill="#EFF6FF" stroke="#2563EB" strokeWidth="1.5"/>
      <T x={140} y={60} size={10} bold color="#2563EB" align="middle">(a + b)³</T>
      <T x={140} y={78} size={10} bold color="#1C1C1E" align="middle">= a³ + 3a²b + 3ab² + b³</T>
      <T x={140} y={96} size={8} color="#8E8E93" align="middle">= a³ + b³ + 3ab(a + b)</T>
      <T x={140} y={111} size={7} color="#8E8E93" align="middle">Pascal row: 1 · 3 · 3 · 1</T>
      <rect x="10" y="126" width="260" height="76" rx="6" fill="#FFF0F0" stroke="#FF3B30" strokeWidth="1.5"/>
      <T x={140} y={144} size={10} bold color="#FF3B30" align="middle">(a − b)³</T>
      <T x={140} y={162} size={10} bold color="#1C1C1E" align="middle">= a³ − 3a²b + 3ab² − b³</T>
      <T x={140} y={180} size={8} color="#8E8E93" align="middle">= a³ − b³ − 3ab(a − b)  · Signs: + − + −</T>
      <T x={140} y={196} size={7} color="#8E8E93" align="middle">a³+b³=(a+b)(a²−ab+b²)  ·  a³−b³=(a−b)(a²+ab+b²)</T>
    </svg>
  );
}
function CbseMath9ThreeVarId() {
  return (
    <svg viewBox="0 0 280 206" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="8" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={25} size={10} bold color="#FFFFFF" align="middle">Three-Variable Identities</T>
      <rect x="10" y="42" width="260" height="50" rx="6" fill="#EFF6FF"/>
      <T x={140} y={60} size={9} bold color="#2563EB" align="middle">(a + b + c)²</T>
      <T x={140} y={80} size={9} bold color="#1C1C1E" align="middle">= a² + b² + c² + 2ab + 2bc + 2ca</T>
      <rect x="10" y="100" width="260" height="74" rx="6" fill="#F0FDF4"/>
      <T x={140} y={118} size={9} bold color="#16A34A" align="middle">a³ + b³ + c³ − 3abc</T>
      <T x={140} y={136} size={9} color="#1C1C1E" align="middle">= (a+b+c)(a²+b²+c²−ab−bc−ca)</T>
      <T x={140} y={158} size={9} bold color="#16A34A" align="middle">Special: if a + b + c = 0</T>
      <T x={140} y={175} size={10} bold color="#16A34A" align="middle">→  a³ + b³ + c³ = 3abc</T>
      <rect x="10" y="182" width="260" height="20" rx="6" fill="#FFF7ED"/>
      <T x={140} y={196} size={8} color="#D97706" align="middle">Check a+b+c=0 first — saves expanding cubes</T>
    </svg>
  );
}
function CbseMath9Factorising() {
  return (
    <svg viewBox="0 0 280 212" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="8" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={25} size={10} bold color="#FFFFFF" align="middle">Factorising with Identities</T>
      {[
        ["① Recognise form", "Is it (a±b)², (a+b)(a−b), a³±b³?", "#2563EB",  62],
        ["② Map a and b",    "4x²−9 → a=2x, b=3",                 "#9333EA", 108],
        ["③ Apply identity", "4x²−9 = (2x+3)(2x−3)",              "#16A34A", 154],
        ["④ Verify",         "(2x+3)(2x−3) = 4x²−9 ✓",           "#D97706", 200],
      ].map(([title,sub,color,y])=>(
        <g key={title}>
          <rect x="20" y={y-28} width="240" height="40" rx="6" fill={color+"14"} stroke={color+"30"} strokeWidth="1"/>
          <T x={34} y={y-12} size={9} bold color={color}>{title}</T>
          <T x={34} y={y+4} size={8} color="#4B5563">{sub}</T>
        </g>
      ))}
    </svg>
  );
}
// Ch5 — Circles (2 new)
function CbseMath9AngleTheorems() {
  return (
    <svg viewBox="0 0 280 240" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <circle cx="140" cy="110" r="85" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2"/>
      <circle cx="140" cy="110" r="3" fill="#1C1C1E"/>
      <T x={144} y={107} size={8} bold>O</T>
      <circle cx="82" cy="48" r="4" fill="#FF3B30"/>
      <T x={66} y={44} size={9} bold color="#FF3B30">P</T>
      <circle cx="198" cy="48" r="4" fill="#FF3B30"/>
      <T x={202} y={44} size={9} bold color="#FF3B30">Q</T>
      <line x1="140" y1="110" x2="82" y2="48" stroke="#9333EA" strokeWidth="2"/>
      <line x1="140" y1="110" x2="198" y2="48" stroke="#9333EA" strokeWidth="2"/>
      <T x={140} y={74} size={10} bold color="#9333EA" align="middle">2θ</T>
      <circle cx="140" cy="194" r="4" fill="#16A34A"/>
      <T x={144} y={196} size={9} bold color="#16A34A">R</T>
      <line x1="82" y1="48" x2="140" y2="194" stroke="#16A34A" strokeWidth="1.5" strokeDasharray="4,2"/>
      <line x1="198" y1="48" x2="140" y2="194" stroke="#16A34A" strokeWidth="1.5" strokeDasharray="4,2"/>
      <T x={140} y={178} size={10} bold color="#16A34A" align="middle">θ</T>
      <rect x="10" y="210" width="260" height="24" rx="6" fill="#F5F0FF"/>
      <T x={140} y={226} size={9} bold color="#9333EA" align="middle">Central ∠POQ = 2 × Inscribed ∠PRQ (same arc)</T>
    </svg>
  );
}
function CbseMath9CyclicQuad() {
  return (
    <svg viewBox="0 0 280 236" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <circle cx="140" cy="106" r="84" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2"/>
      <circle cx="98" cy="34" r="4" fill="#FF3B30"/>
      <T x={82} y={30} size={9} bold color="#FF3B30">A</T>
      <circle cx="210" cy="74" r="4" fill="#16A34A"/>
      <T x={214} y={72} size={9} bold color="#16A34A">B</T>
      <circle cx="192" cy="176" r="4" fill="#9333EA"/>
      <T x={196} y={182} size={9} bold color="#9333EA">C</T>
      <circle cx="68" cy="158" r="4" fill="#EA580C"/>
      <T x={50} y={160} size={9} bold color="#EA580C">D</T>
      <polygon points="98,34 210,74 192,176 68,158" fill="none" stroke="#1C1C1E" strokeWidth="2"/>
      <T x={104} y={54} size={8} bold color="#FF3B30">∠A</T>
      <T x={190} y={136} size={8} bold color="#9333EA">∠C</T>
      <T x={80} y={126} size={8} bold color="#EA580C">∠D</T>
      <T x={190} y={100} size={8} bold color="#16A34A">∠B</T>
      <rect x="10" y="204" width="260" height="28" rx="6" fill="#F5F0FF"/>
      <T x={140} y={216} size={9} bold color="#9333EA" align="middle">∠A + ∠C = 180°  (opposite angles)</T>
      <T x={140} y={228} size={8} color="#8E8E93" align="middle">∠B + ∠D = 180°</T>
    </svg>
  );
}
// Ch6 — Area (2 new)
function CbseMath9HeronsFormula() {
  return (
    <svg viewBox="0 0 280 226" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <polygon points="50,164 230,164 126,64" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2"/>
      <T x={34} y={174} size={9} bold>A</T>
      <T x={232} y={174} size={9} bold>B</T>
      <T x={122} y={56} size={9} bold>C</T>
      <T x={140} y={180} size={9} bold color="#FF3B30" align="middle">c  (side AB)</T>
      <T x={72} y={120} size={9} bold color="#16A34A">b (CA)</T>
      <T x={186} y={116} size={9} bold color="#9333EA">a (BC)</T>
      <rect x="10" y="190" width="260" height="32" rx="6" fill="#FEF3C7"/>
      <T x={140} y={206} size={9} bold color="#D97706" align="middle">s = (a + b + c) / 2   (semi-perimeter)</T>
      <T x={140} y={220} size={9} bold color="#D97706" align="middle">Area = √[s(s−a)(s−b)(s−c)]</T>
    </svg>
  );
}
function CbseMath9CompositeArea() {
  return (
    <svg viewBox="0 0 280 218" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <T x={140} y={14} size={9} bold color="#1C1C1E" align="middle">Composite Figure = Sum of Parts</T>
      <polygon points="30,182 30,82 130,82 130,132 200,132 200,182" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2"/>
      <line x1="130" y1="82" x2="130" y2="182" stroke="#FF3B30" strokeWidth="1.5" strokeDasharray="5,3"/>
      <T x={80} y={136} size={9} bold color="#2563EB" align="middle">Rect 1</T>
      <T x={80} y={152} size={8} color="#2563EB" align="middle">100 × 100</T>
      <T x={165} y={160} size={9} bold color="#16A34A" align="middle">Rect 2</T>
      <T x={165} y={174} size={8} color="#16A34A" align="middle">70 × 50</T>
      <T x={80} y={78} size={8} color="#8E8E93">100 u</T>
      <T x={150} y={78} size={8} color="#8E8E93">70 u</T>
      <T x={14} y={134} size={7} color="#8E8E93">100</T>
      <T x={14} y={164} size={7} color="#8E8E93">50</T>
      <rect x="10" y="192" width="260" height="22" rx="6" fill="#F0FDF4"/>
      <T x={140} y={202} size={9} bold color="#16A34A" align="middle">Total Area = A₁ + A₂</T>
      <T x={140} y={214} size={8} color="#8E8E93" align="middle">Divide → compute each part → add (or subtract holes)</T>
    </svg>
  );
}
// Ch7 — Probability
function CbseMath9RandomExperiment() {
  return (
    <svg viewBox="0 0 280 216" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="8" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={25} size={10} bold color="#FFFFFF" align="middle">Random Experiments — Sample Space</T>
      <rect x="10" y="42" width="120" height="80" rx="6" fill="#EFF6FF" stroke="#2563EB" strokeWidth="1.5"/>
      <T x={70} y={60} size={9} bold color="#2563EB" align="middle">Coin toss</T>
      <circle cx="46" cy="94" r="18" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5"/>
      <T x={46} y={98} size={10} bold color="#D97706" align="middle">H</T>
      <circle cx="94" cy="94" r="18" fill="#FFF0F0" stroke="#FF3B30" strokeWidth="1.5"/>
      <T x={94} y={98} size={10} bold color="#FF3B30" align="middle">T</T>
      <T x={70} y={116} size={8} color="#8E8E93" align="middle">S = {"{H, T}"}</T>
      <rect x="150" y="42" width="120" height="80" rx="6" fill="#F0FDF4" stroke="#16A34A" strokeWidth="1.5"/>
      <T x={210} y={60} size={9} bold color="#16A34A" align="middle">Die roll</T>
      <T x={210} y={84} size={11} bold color="#1C1C1E" align="middle">1  2  3</T>
      <T x={210} y={102} size={11} bold color="#1C1C1E" align="middle">4  5  6</T>
      <T x={210} y={116} size={8} color="#8E8E93" align="middle">S = {"{1,2,3,4,5,6}"}</T>
      <rect x="10" y="130" width="260" height="80" rx="6" fill="#FFF7ED"/>
      <T x={140} y={148} size={9} bold color="#D97706" align="middle">Key Terms</T>
      <T x={30} y={164} size={8} color="#1C1C1E">• Trial — one performance of the experiment</T>
      <T x={30} y={180} size={8} color="#1C1C1E">• Outcome — result of one trial</T>
      <T x={30} y={196} size={8} color="#1C1C1E">• Sample space S — set of all possible outcomes</T>
      <T x={30} y={210} size={8} color="#1C1C1E">• Event E — a subset of S</T>
    </svg>
  );
}
function CbseMath9EmpiricalProb() {
  return (
    <svg viewBox="0 0 280 216" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="8" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={25} size={10} bold color="#FFFFFF" align="middle">Empirical (Experimental) Probability</T>
      <rect x="10" y="42" width="260" height="120" rx="6" fill="#F8FAFF" stroke="#D1D5DB" strokeWidth="1"/>
      <rect x="10" y="42" width="260" height="24" rx="6" fill="#EFF6FF"/>
      <T x={90} y={58} size={8} bold color="#2563EB" align="middle">Outcome</T>
      <T x={200} y={58} size={8} bold color="#2563EB" align="middle">Frequency</T>
      <T x={90} y={82} size={8} color="#1C1C1E" align="middle">Head</T>
      <T x={200} y={82} size={8} color="#1C1C1E" align="middle">42</T>
      <line x1="10" y1="90" x2="270" y2="90" stroke="#E5E7EB" strokeWidth="1"/>
      <T x={90} y={106} size={8} color="#1C1C1E" align="middle">Tail</T>
      <T x={200} y={106} size={8} color="#1C1C1E" align="middle">58</T>
      <line x1="10" y1="114" x2="270" y2="114" stroke="#E5E7EB" strokeWidth="1"/>
      <T x={90} y={130} size={8} bold color="#1C1C1E" align="middle">Total</T>
      <T x={200} y={130} size={8} bold color="#1C1C1E" align="middle">100</T>
      <rect x="10" y="170" width="260" height="40" rx="6" fill="#F0FDF4"/>
      <T x={140} y={186} size={9} bold color="#16A34A" align="middle">P(Head) = 42 / 100 = 0.42</T>
      <T x={140} y={204} size={9} bold color="#9333EA" align="middle">P(E) = (Times E occurs) / (Total trials)</T>
    </svg>
  );
}
function CbseMath9ProbRange() {
  return (
    <svg viewBox="0 0 280 196" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <T x={140} y={16} size={9} bold color="#1C1C1E" align="middle">Range of Probability</T>
      <line x1="30" y1="80" x2="250" y2="80" stroke="#1C1C1E" strokeWidth="2.5"/>
      <circle cx="30" cy="80" r="5" fill="#FF3B30"/>
      <T x={18} y={70} size={9} bold color="#FF3B30">0</T>
      <circle cx="250" cy="80" r="5" fill="#16A34A"/>
      <T x={244} y={70} size={9} bold color="#16A34A">1</T>
      <circle cx="140" cy="80" r="4" fill="#9333EA"/>
      <T x={134} y={70} size={9} bold color="#9333EA">½</T>
      <T x={30} y={100} size={8} bold color="#FF3B30" align="middle">Impossible</T>
      <T x={30} y={112} size={7} color="#FF3B30" align="middle">P(E)=0</T>
      <T x={250} y={100} size={8} bold color="#16A34A" align="middle">Certain</T>
      <T x={250} y={112} size={7} color="#16A34A" align="middle">P(E)=1</T>
      <T x={140} y={100} size={8} bold color="#9333EA" align="middle">Equal chance</T>
      <rect x="10" y="128" width="260" height="62" rx="6" fill="#EFF6FF"/>
      <T x={140} y={146} size={9} bold color="#2563EB" align="middle">Key Properties</T>
      <T x={30} y={162} size={8} color="#1C1C1E">• 0 ≤ P(E) ≤ 1  for any event E</T>
      <T x={30} y={178} size={8} color="#1C1C1E">• P(E) + P(Ē) = 1  (complementary events)</T>
      <T x={30} y={192} size={8} color="#1C1C1E">• P(S) = 1,  P(∅) = 0</T>
    </svg>
  );
}
function CbseMath9ProbApps() {
  return (
    <svg viewBox="0 0 280 216" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="8" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={25} size={10} bold color="#FFFFFF" align="middle">Probability — Standard Deck (52 cards)</T>
      {[
        ["♠ Spades",   "13 cards", "#1C1C1E", "#F8FAFF",  60],
        ["♥ Hearts",   "13 cards", "#FF3B30", "#FFF0F0",  90],
        ["♦ Diamonds", "13 cards", "#FF3B30", "#FFF0F0", 120],
        ["♣ Clubs",    "13 cards", "#1C1C1E", "#F8FAFF", 150],
      ].map(([suit,count,color,bg,y])=>(
        <g key={suit}>
          <rect x="20" y={y-16} width="240" height="26" rx="4" fill={bg}/>
          <T x={36} y={y+2} size={10} bold color={color}>{suit}</T>
          <T x={230} y={y+2} size={9} bold color={color} align="end">{count}</T>
        </g>
      ))}
      <rect x="10" y="168" width="260" height="42" rx="6" fill="#F0FDF4"/>
      <T x={140} y={184} size={9} bold color="#16A34A" align="middle">P(King) = 4/52 = 1/13</T>
      <T x={140} y={200} size={8} color="#8E8E93" align="middle">P(Red) = 26/52 = 1/2  ·  P(Ace) = 4/52 = 1/13</T>
    </svg>
  );
}
// Ch8 — Sequences and Progressions
function CbseMath9SequenceBasics() {
  return (
    <svg viewBox="0 0 280 196" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="8" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={25} size={10} bold color="#FFFFFF" align="middle">Sequences — Patterns in Numbers</T>
      {[
        ["2, 5, 8, 11, 14…",  "+3 each time",    "#2563EB",  58],
        ["1, 4, 9, 16, 25…",  "Perfect squares", "#16A34A",  92],
        ["2, 4, 8, 16, 32…",  "×2 each time",    "#9333EA", 126],
        ["1, 1, 2, 3, 5, 8…", "Fibonacci sum",   "#D97706", 160],
      ].map(([seq,rule,color,y])=>(
        <g key={seq}>
          <rect x="20" y={y-18} width="240" height="30" rx="5" fill={color+"14"}/>
          <T x={30} y={y-2} size={9} bold color={color}>{seq}</T>
          <T x={246} y={y-2} size={8} color={color} align="end">{rule}</T>
        </g>
      ))}
      <T x={140} y={188} size={8} color="#8E8E93" align="middle">Each number in a sequence is called a term (t₁, t₂, t₃…)</T>
    </svg>
  );
}
function CbseMath9AP() {
  return (
    <svg viewBox="0 0 280 210" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="8" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={25} size={10} bold color="#FFFFFF" align="middle">Arithmetic Progression (AP)</T>
      {["a","a+d","a+2d","a+3d"].map((term,i)=>(
        <g key={term}>
          <rect x={18+i*62} y="42" width="54" height="40" rx="6" fill="#EFF6FF" stroke="#2563EB" strokeWidth="1.5"/>
          <T x={45+i*62} y={66} size={9} bold color="#2563EB" align="middle">{term}</T>
          {i < 3 && (
            <g>
              <line x1={74+i*62} y1={62} x2={78+i*62} y2={62} stroke="#FF3B30" strokeWidth="1.5"/>
              <T x={77+i*62} y={56} size={7} bold color="#FF3B30">+d</T>
            </g>
          )}
        </g>
      ))}
      <T x={140} y={102} size={8} color="#8E8E93" align="middle">d = aₙ₊₁ − aₙ = constant (common difference)</T>
      <rect x="10" y="112" width="260" height="36" rx="6" fill="#F0FDF4"/>
      <T x={140} y={128} size={9} bold color="#16A34A" align="middle">nth term:  aₙ = a + (n − 1)d</T>
      <T x={140} y={144} size={8} color="#8E8E93" align="middle">a = first term,  d = common difference</T>
      <rect x="10" y="156" width="260" height="48" rx="6" fill="#FEF3C7"/>
      <T x={140} y={172} size={9} bold color="#D97706" align="middle">Example: 3, 7, 11, 15…   (a=3, d=4)</T>
      <T x={140} y={190} size={9} color="#D97706" align="middle">a₁₀ = 3 + 9 × 4 = 39</T>
    </svg>
  );
}
function CbseMath9APSum() {
  return (
    <svg viewBox="0 0 280 210" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="8" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={25} size={10} bold color="#FFFFFF" align="middle">Sum of AP — Gauss Pairing Trick</T>
      <rect x="20" y="42" width="240" height="52" rx="6" fill="#EFF6FF"/>
      <T x={30} y={60} size={9} bold color="#2563EB">S = a + (a+d) + … + (l−d) + l</T>
      <T x={30} y={80} size={9} bold color="#FF3B30">S = l + (l−d) + … + (a+d) + a</T>
      <T x={140} y={88} size={7} color="#8E8E93" align="middle">↑ add both rows: each pair = (a+l), n pairs → 2S = n(a+l)</T>
      <rect x="10" y="104" width="260" height="38" rx="6" fill="#F0FDF4"/>
      <T x={140} y={120} size={10} bold color="#16A34A" align="middle">Sₙ = n/2 × (a + l)</T>
      <T x={140} y={136} size={9} bold color="#16A34A" align="middle">   = n/2 × [2a + (n−1)d]</T>
      <rect x="10" y="150" width="260" height="54" rx="6" fill="#FEF3C7"/>
      <T x={140} y={168} size={9} bold color="#D97706" align="middle">Example: 1 + 2 + 3 + … + 100</T>
      <T x={140} y={186} size={9} color="#D97706" align="middle">S₁₀₀ = 100/2 × (1 + 100) = 5050</T>
      <T x={140} y={200} size={8} color="#8E8E93" align="middle">(Gauss's famous calculation, age 10)</T>
    </svg>
  );
}
function CbseMath9GP() {
  return (
    <svg viewBox="0 0 280 210" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="8" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={25} size={10} bold color="#FFFFFF" align="middle">Geometric Progression (GP)</T>
      {["a","ar","ar²","ar³"].map((term,i)=>(
        <g key={term}>
          <rect x={18+i*62} y="42" width="54" height="40" rx="6" fill="#F5F0FF" stroke="#9333EA" strokeWidth="1.5"/>
          <T x={45+i*62} y={66} size={9} bold color="#9333EA" align="middle">{term}</T>
          {i < 3 && (
            <g>
              <line x1={74+i*62} y1={62} x2={78+i*62} y2={62} stroke="#16A34A" strokeWidth="1.5"/>
              <T x={77+i*62} y={56} size={7} bold color="#16A34A">×r</T>
            </g>
          )}
        </g>
      ))}
      <T x={140} y={102} size={8} color="#8E8E93" align="middle">r = aₙ₊₁ / aₙ = constant (common ratio, r ≠ 0)</T>
      <rect x="10" y="112" width="260" height="36" rx="6" fill="#F5F0FF"/>
      <T x={140} y={128} size={9} bold color="#9333EA" align="middle">nth term:  aₙ = a · rⁿ⁻¹</T>
      <T x={140} y={144} size={8} color="#8E8E93" align="middle">a = first term,  r = common ratio</T>
      <rect x="10" y="156" width="260" height="48" rx="6" fill="#FEF3C7"/>
      <T x={140} y={172} size={9} bold color="#D97706" align="middle">Example: 2, 6, 18, 54…   (a=2, r=3)</T>
      <T x={140} y={190} size={9} color="#D97706" align="middle">a₅ = 2 × 3⁴ = 2 × 81 = 162</T>
    </svg>
  );
}

// ── AP SSC CLASS 9 MATHEMATICS — new components ───────────────────────────

function ApSscMath9LinearEqSolutions() {
  return (
    <svg viewBox="0 0 320 210" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxHeight: 220 }}>
      <rect width="320" height="210" fill="#F8FAFC" rx="8"/>
      <T x={160} y={18} size={11} bold color="#1E3A5F" align="middle">Linear Equation in Two Variables: 2x + y = 4</T>
      {/* Table */}
      <rect x="15" y="28" width="130" height="100" rx="4" fill="#fff" stroke="#CBD5E1" strokeWidth="1"/>
      <rect x="15" y="28" width="130" height="20" rx="4" fill="#3B82F6"/>
      <T x={80} y={42} size={10} bold color="#fff" align="middle">Solution Table</T>
      <line x1="15" y1="48" x2="145" y2="48" stroke="#CBD5E1" strokeWidth="1"/>
      <line x1="80" y1="28" x2="80" y2="128" stroke="#CBD5E1" strokeWidth="1"/>
      <T x={47} y={62} size={10} bold color="#1E3A5F" align="middle">x</T>
      <T x={112} y={62} size={10} bold color="#1E3A5F" align="middle">y = 4−2x</T>
      <line x1="15" y1="66" x2="145" y2="66" stroke="#E2E8F0" strokeWidth="0.5"/>
      <T x={47} y={80} size={10} color="#333" align="middle">0</T>
      <T x={112} y={80} size={10} color="#E91E63" align="middle">4</T>
      <line x1="15" y1="83" x2="145" y2="83" stroke="#E2E8F0" strokeWidth="0.5"/>
      <T x={47} y={97} size={10} color="#333" align="middle">1</T>
      <T x={112} y={97} size={10} color="#E91E63" align="middle">2</T>
      <line x1="15" y1="100" x2="145" y2="100" stroke="#E2E8F0" strokeWidth="0.5"/>
      <T x={47} y={114} size={10} color="#333" align="middle">2</T>
      <T x={112} y={114} size={10} color="#E91E63" align="middle">0</T>
      {/* Coordinate axes */}
      <line x1="170" y1="175" x2="310" y2="175" stroke="#555" strokeWidth="1.5"/>
      <line x1="210" y1="30" x2="210" y2="182" stroke="#555" strokeWidth="1.5"/>
      <polygon points="310,171 315,175 310,179" fill="#555"/>
      <polygon points="206,30 210,24 214,30" fill="#555"/>
      <T x={312} y={178} size={9} color="#555">x</T>
      <T x={213} y={26} size={9} color="#555">y</T>
      {/* line 2x+y=4: (0,4)→(2,0). Scale: 35px/unit. Origin at (210,175) */}
      {/* (0,4): x=210, y=175-4*35=35. (2,0): x=210+2*35=280, y=175 */}
      <line x1="192" y1="48" x2="295" y2="183" stroke="#2196F3" strokeWidth="2" strokeDasharray="none"/>
      <circle cx="210" cy="35" r="4" fill="#E91E63"/>
      <circle cx="280" cy="175" r="4" fill="#E91E63"/>
      <circle cx="245" cy="105" r="4" fill="#E91E63"/>
      <T x={214} y={33} size={9} color="#E91E63">(0,4)</T>
      <T x={283} y={172} size={9} color="#E91E63">(2,0)</T>
      <T x={249} y={103} size={9} color="#E91E63">(1,2)</T>
      <T x={160} y={200} size={10} bold color="#1E3A5F" align="middle">Every point on the line is a solution — infinitely many!</T>
    </svg>
  );
}

function ApSscMath9LinearEqGraph() {
  return (
    <svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxHeight: 210 }}>
      <rect width="320" height="200" fill="#F8FAFC" rx="8"/>
      <T x={160} y={16} size={11} bold color="#1E3A5F" align="middle">Intercept Method — x + 2y = 6</T>
      {/* Step boxes */}
      <rect x="10" y="24" width="140" height="48" rx="5" fill="#DBEAFE"/>
      <T x={80} y={38} size={10} bold color="#1D4ED8" align="middle">Step 1 — y-intercept</T>
      <T x={80} y={52} size={9} color="#1D4ED8" align="middle">Put x = 0 → 2y = 6</T>
      <T x={80} y={64} size={9} bold color="#1D4ED8" align="middle">y = 3  →  Point (0, 3)</T>
      <rect x="170" y="24" width="140" height="48" rx="5" fill="#FEF3C7"/>
      <T x={240} y={38} size={10} bold color="#D97706" align="middle">Step 2 — x-intercept</T>
      <T x={240} y={52} size={9} color="#D97706" align="middle">Put y = 0 → x = 6</T>
      <T x={240} y={64} size={9} bold color="#D97706" align="middle">x = 6  →  Point (6, 0)</T>
      {/* Axes. Scale: 25px/unit. Origin at (60,155) */}
      <line x1="40" y1="155" x2="250" y2="155" stroke="#555" strokeWidth="1.5"/>
      <line x1="60" y1="80" x2="60" y2="162" stroke="#555" strokeWidth="1.5"/>
      <polygon points="250,151 255,155 250,159" fill="#555"/>
      <polygon points="56,80 60,74 64,80" fill="#555"/>
      <T x={257} y={158} size={9}>x</T>
      <T x={63} y={77} size={9}>y</T>
      {/* x-axis labels */}
      <T x={60} y={166} size={8} color="#555" align="middle">0</T>
      <T x={85} y={166} size={8} color="#555" align="middle">1</T>
      <T x={110} y={166} size={8} color="#555" align="middle">2</T>
      <T x={135} y={166} size={8} color="#555" align="middle">3</T>
      <T x={160} y={166} size={8} color="#555" align="middle">4</T>
      <T x={185} y={166} size={8} color="#555" align="middle">5</T>
      <T x={210} y={166} size={8} color="#555" align="middle">6</T>
      {/* y-axis labels */}
      <T x={53} y={158} size={8} color="#555" align="end">0</T>
      <T x={53} y={133} size={8} color="#555" align="end">1</T>
      <T x={53} y={108} size={8} color="#555" align="end">2</T>
      <T x={53} y={83} size={8} color="#555" align="end">3</T>
      {/* line x+2y=6: (0,3)→(6,0). 25px/unit. (0,3)→(60,155-75)=(60,80). (6,0)→(60+150,155)=(210,155) */}
      <line x1="60" y1="80" x2="210" y2="155" stroke="#2196F3" strokeWidth="2"/>
      <circle cx="60" cy="80" r="5" fill="#1D4ED8"/>
      <circle cx="210" cy="155" r="5" fill="#D97706"/>
      <T x={64} y={78} size={9} bold color="#1D4ED8">(0,3)</T>
      <T x={197} y={150} size={9} bold color="#D97706">(6,0)</T>
      <T x={160} y={192} size={10} bold color="#333" align="middle">Join the two intercept points → the graph</T>
    </svg>
  );
}

function ApSscMath9SpecialLines() {
  return (
    <svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxHeight: 210 }}>
      <rect width="320" height="200" fill="#F8FAFC" rx="8"/>
      <T x={160} y={16} size={11} bold color="#1E3A5F" align="middle">Special Lines — x=a, y=b, y=x</T>
      {/* Axes. Origin (160,110). Scale 30px/unit */}
      <line x1="50" y1="110" x2="300" y2="110" stroke="#777" strokeWidth="1.2"/>
      <line x1="160" y1="30" x2="160" y2="180" stroke="#777" strokeWidth="1.2"/>
      <polygon points="300,106 305,110 300,114" fill="#777"/>
      <polygon points="156,30 160,24 164,30" fill="#777"/>
      <T x={307} y={113} size={9} color="#555">x</T>
      <T x={163} y={27} size={9} color="#555">y</T>
      {/* x=3 — vertical red line at x=160+3*30=250 */}
      <line x1="250" y1="30" x2="250" y2="180" stroke="#E91E63" strokeWidth="2" strokeDasharray="6,3"/>
      <T x={252} y={45} size={9} bold color="#E91E63">x = 3</T>
      <T x={252} y={57} size={8} color="#E91E63">(vertical)</T>
      {/* y=2 — horizontal green line at y=110-2*30=50 */}
      <line x1="50" y1="50" x2="300" y2="50" stroke="#16A34A" strokeWidth="2" strokeDasharray="6,3"/>
      <T x={55} y={46} size={9} bold color="#16A34A">y = 2  (horizontal)</T>
      {/* y=x — diagonal at 45° */}
      <line x1="60" y1="160" x2="270" y2="50" stroke="#D97706" strokeWidth="2"/>
      <T x={268} y={48} size={9} bold color="#D97706">y = x</T>
      {/* labels */}
      <rect x="10" y="145" width="300" height="50" rx="5" fill="#fff" stroke="#E2E8F0" strokeWidth="1"/>
      <T x={160} y={160} size={9} color="#E91E63" align="middle">x = 3 — passes through (3,0); parallel to y-axis</T>
      <T x={160} y={173} size={9} color="#16A34A" align="middle">y = 2 — passes through (0,2); parallel to x-axis</T>
      <T x={160} y={186} size={9} color="#D97706" align="middle">y = x — passes through origin; bisects quadrants I &amp; III</T>
    </svg>
  );
}

function ApSscMath9EuclidPostulates() {
  return (
    <svg viewBox="0 0 320 210" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxHeight: 220 }}>
      <rect width="320" height="210" fill="#F8FAFC" rx="8"/>
      <T x={160} y={16} size={11} bold color="#1E3A5F" align="middle">Euclid's 5 Postulates</T>
      {/* P1 */}
      <rect x="10" y="24" width="300" height="30" rx="4" fill="#DBEAFE"/>
      <circle cx="40" cy="39" r="3" fill="#1D4ED8"/>
      <circle cx="120" cy="39" r="3" fill="#1D4ED8"/>
      <line x1="40" y1="39" x2="120" y2="39" stroke="#1D4ED8" strokeWidth="1.5"/>
      <T x={130} y={43} size={9} color="#1D4ED8">P1: A straight line can be drawn joining any two points.</T>
      {/* P2 */}
      <rect x="10" y="58" width="300" height="30" rx="4" fill="#FEF3C7"/>
      <line x1="20" y1="73" x2="80" y2="73" stroke="#D97706" strokeWidth="1.5"/>
      <line x1="80" y1="73" x2="120" y2="73" stroke="#D97706" strokeWidth="1.5" strokeDasharray="4,2"/>
      <T x={130} y={77} size={9} color="#D97706">P2: A line segment can be extended indefinitely.</T>
      {/* P3 */}
      <rect x="10" y="92" width="300" height="30" rx="4" fill="#DCFCE7"/>
      <circle cx="50" cy="107" r="15" fill="none" stroke="#16A34A" strokeWidth="1.5"/>
      <circle cx="50" cy="107" r="2" fill="#16A34A"/>
      <line x1="50" y1="107" x2="65" y2="107" stroke="#16A34A" strokeWidth="1.2"/>
      <T x={80} y={111} size={9} color="#16A34A">P3: A circle can be drawn with any centre and radius.</T>
      {/* P4 */}
      <rect x="10" y="126" width="300" height="30" rx="4" fill="#FEE2E2"/>
      <line x1="30" y1="141" x2="75" y2="141" stroke="#DC2626" strokeWidth="1.5"/>
      <line x1="53" y1="126" x2="53" y2="156" stroke="#DC2626" strokeWidth="1.5"/>
      <line x1="80" y1="141" x2="115" y2="141" stroke="#DC2626" strokeWidth="1.5"/>
      <line x1="98" y1="126" x2="98" y2="156" stroke="#DC2626" strokeWidth="1.5"/>
      <T x={125} y={145} size={9} color="#DC2626">P4: All right angles are equal to each other (90°).</T>
      {/* P5 */}
      <rect x="10" y="160" width="300" height="40" rx="4" fill="#F3E8FF"/>
      <line x1="20" y1="175" x2="90" y2="175" stroke="#7C3AED" strokeWidth="1.5"/>
      <line x1="20" y1="190" x2="90" y2="190" stroke="#7C3AED" strokeWidth="1.5"/>
      <line x1="55" y1="165" x2="70" y2="200" stroke="#9333EA" strokeWidth="1.5"/>
      <T x={100} y={175} size={9} color="#7C3AED">P5 (Parallel): If two lines are cut by</T>
      <T x={100} y={188} size={9} color="#7C3AED">a transversal and interior angles &lt; 180°, they meet.</T>
    </svg>
  );
}

function ApSscMath9FifthPostulate() {
  return (
    <svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxHeight: 210 }}>
      <rect width="320" height="200" fill="#F8FAFC" rx="8"/>
      <T x={160} y={16} size={11} bold color="#1E3A5F" align="middle">Playfair's Axiom (Equivalent to Euclid's P5)</T>
      {/* Line l */}
      <line x1="20" y1="120" x2="300" y2="120" stroke="#555" strokeWidth="2"/>
      <T x={305} y={123} size={10} bold color="#555">l</T>
      {/* Point P */}
      <circle cx="160" cy="70" r="4" fill="#E91E63"/>
      <T x={165} y={68} size={10} bold color="#E91E63">P</T>
      {/* One unique parallel through P */}
      <line x1="20" y1="70" x2="300" y2="70" stroke="#2196F3" strokeWidth="2"/>
      <T x={305} y={73} size={10} bold color="#2196F3">m</T>
      {/* label: exactly one */}
      <rect x="60" y="30" width="200" height="28" rx="5" fill="#DBEAFE"/>
      <T x={160} y={44} size={10} color="#1D4ED8" align="middle" bold>Through P, exactly ONE line</T>
      <T x={160} y={57} size={9} color="#1D4ED8" align="middle">parallel to l can be drawn (line m)</T>
      {/* rejected lines crossing l */}
      <line x1="100" y1="40" x2="220" y2="135" stroke="#FCA5A5" strokeWidth="1.2" strokeDasharray="5,3"/>
      <line x1="80" y1="55" x2="240" y2="130" stroke="#FCA5A5" strokeWidth="1.2" strokeDasharray="5,3"/>
      <T x={230} y={120} size={8} color="#DC2626">not parallel</T>
      <line x1="15" y1="140" x2="305" y2="140" stroke="#E2E8F0" strokeWidth="1"/>
      <T x={160} y={158} size={9} color="#555" align="middle">Euclid's 5th Postulate ↔ "Through a point not on a line,</T>
      <T x={160} y={172} size={9} color="#555" align="middle">exactly one line can be drawn parallel to the given line."</T>
      <T x={160} y={186} size={9} bold color="#7C3AED" align="middle">This is the foundation of Euclidean geometry.</T>
    </svg>
  );
}

function ApSscMath9BasicAngles() {
  return (
    <svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxHeight: 210 }}>
      <rect width="320" height="200" fill="#F8FAFC" rx="8"/>
      <T x={160} y={16} size={11} bold color="#1E3A5F" align="middle">Types of Angles</T>
      {/* Acute — 45° */}
      <g transform="translate(30,50)">
        <line x1="0" y1="60" x2="55" y2="60" stroke="#555" strokeWidth="1.5"/>
        <line x1="0" y1="60" x2="39" y2="18" stroke="#2196F3" strokeWidth="1.5"/>
        <path d="M18,60 A18,18 0 0,0 12.7,47" fill="none" stroke="#2196F3" strokeWidth="1.2"/>
        <T x={20} y={53} size={9} color="#2196F3">45°</T>
        <T x={27} y={80} size={10} bold color="#2196F3" align="middle">Acute</T>
        <T x={27} y={92} size={9} color="#555" align="middle">(0° – 90°)</T>
      </g>
      {/* Right — 90° */}
      <g transform="translate(110,50)">
        <line x1="0" y1="60" x2="55" y2="60" stroke="#555" strokeWidth="1.5"/>
        <line x1="0" y1="60" x2="0" y2="10" stroke="#16A34A" strokeWidth="1.5"/>
        <rect x="0" y="44" width="12" height="12" fill="none" stroke="#16A34A" strokeWidth="1.2"/>
        <T x={14} y={50} size={9} color="#16A34A">90°</T>
        <T x={27} y={80} size={10} bold color="#16A34A" align="middle">Right</T>
        <T x={27} y={92} size={9} color="#555" align="middle">(exactly 90°)</T>
      </g>
      {/* Obtuse — 120° */}
      <g transform="translate(190,50)">
        <line x1="0" y1="60" x2="55" y2="60" stroke="#555" strokeWidth="1.5"/>
        <line x1="0" y1="60" x2="-24" y2="18" stroke="#D97706" strokeWidth="1.5"/>
        <path d="M18,60 A18,18 0 0,0 -7.6,51" fill="none" stroke="#D97706" strokeWidth="1.2"/>
        <T x={2} y={50} size={9} color="#D97706">120°</T>
        <T x={15} y={80} size={10} bold color="#D97706" align="middle">Obtuse</T>
        <T x={15} y={92} size={9} color="#555" align="middle">(90° – 180°)</T>
      </g>
      {/* Straight angle */}
      <rect x="15" y="108" width="140" height="44" rx="5" fill="#FEE2E2"/>
      <line x1="30" y1="130" x2="130" y2="130" stroke="#DC2626" strokeWidth="2"/>
      <circle cx="80" cy="130" r="3" fill="#DC2626"/>
      <path d="M100,130 A20,20 0 0,0 60,130" fill="none" stroke="#DC2626" strokeWidth="1.2"/>
      <T x={80} y={126} size={9} color="#DC2626" align="middle">180°</T>
      <T x={80} y={145} size={10} bold color="#DC2626" align="middle">Straight Angle (180°)</T>
      {/* Reflex */}
      <rect x="165" y="108" width="140" height="44" rx="5" fill="#F3E8FF"/>
      <line x1="235" y1="140" x2="295" y2="140" stroke="#7C3AED" strokeWidth="1.5"/>
      <line x1="235" y1="140" x2="235" y2="115" stroke="#7C3AED" strokeWidth="1.5"/>
      <path d="M255,140 A20,20 0 1,0 235,120" fill="none" stroke="#7C3AED" strokeWidth="1.2"/>
      <T x={265} y={130} size={8} color="#7C3AED">270°</T>
      <T x={235} y={157} size={10} bold color="#7C3AED" align="middle">Reflex (180°–360°)</T>
      <T x={160} y={195} size={9} color="#555" align="middle">Complementary = 90° sum · Supplementary = 180° sum</T>
    </svg>
  );
}

function ApSscMath9ParallelTransversal() {
  return (
    <svg viewBox="0 0 320 210" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxHeight: 220 }}>
      <rect width="320" height="210" fill="#F8FAFC" rx="8"/>
      <T x={160} y={16} size={11} bold color="#1E3A5F" align="middle">Parallel Lines Cut by a Transversal — 8 Angles</T>
      {/* Line p (parallel 1) */}
      <line x1="20" y1="75" x2="240" y2="75" stroke="#2196F3" strokeWidth="2"/>
      <T x={244} y={78} size={10} bold color="#2196F3">p</T>
      {/* Line q (parallel 2) */}
      <line x1="20" y1="140" x2="240" y2="140" stroke="#2196F3" strokeWidth="2"/>
      <T x={244} y={143} size={10} bold color="#2196F3">q</T>
      {/* Transversal t */}
      <line x1="100" y1="20" x2="175" y2="195" stroke="#E91E63" strokeWidth="2"/>
      <T x={176} y={198} size={10} bold color="#E91E63">t</T>
      {/* Angle labels at first intersection (~115,75) */}
      <T x={98} y={70} size={9} color="#D97706" align="end">∠1</T>
      <T x={119} y={70} size={9} color="#D97706">∠2</T>
      <T x={98} y={87} size={9} color="#D97706" align="end">∠3</T>
      <T x={119} y={87} size={9} color="#D97706">∠4</T>
      {/* Angle labels at second intersection (~140,140) */}
      <T x={123} y={135} size={9} color="#16A34A" align="end">∠5</T>
      <T x={144} y={135} size={9} color="#16A34A">∠6</T>
      <T x={123} y={152} size={9} color="#16A34A" align="end">∠7</T>
      <T x={144} y={152} size={9} color="#16A34A">∠8</T>
      {/* Legend */}
      <rect x="10" y="165" width="300" height="38" rx="5" fill="#fff" stroke="#E2E8F0"/>
      <T x={160} y={179} size={9} color="#D97706" align="middle">∠1=∠2+∠3+∠4 at p · Alternate interior: ∠3=∠6, ∠4=∠5</T>
      <T x={160} y={192} size={9} color="#16A34A" align="middle">Co-interior (same side): ∠3+∠5=180°, ∠4+∠6=180°</T>
      <T x={160} y={204} size={9} bold color="#1E3A5F" align="middle">Corresponding: ∠1=∠5, ∠2=∠6, ∠3=∠7, ∠4=∠8</T>
    </svg>
  );
}

function ApSscMath9ParallelTransitivity() {
  return (
    <svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxHeight: 210 }}>
      <rect width="320" height="200" fill="#F8FAFC" rx="8"/>
      <T x={160} y={16} size={11} bold color="#1E3A5F" align="middle">Lines Parallel to the Same Line are Parallel to Each Other</T>
      {/* Line a */}
      <line x1="20" y1="55" x2="270" y2="55" stroke="#2196F3" strokeWidth="2"/>
      <T x={274} y={59} size={11} bold color="#2196F3">a</T>
      {/* Line b */}
      <line x1="20" y1="105" x2="270" y2="105" stroke="#16A34A" strokeWidth="2"/>
      <T x={274} y={109} size={11} bold color="#16A34A">b</T>
      {/* Line c */}
      <line x1="20" y1="155" x2="270" y2="155" stroke="#D97706" strokeWidth="2"/>
      <T x={274} y={159} size={11} bold color="#D97706">c</T>
      {/* double-arrow braces */}
      <line x1="295" y1="55" x2="295" y2="105" stroke="#555" strokeWidth="1.2"/>
      <polygon points="291,60 295,53 299,60" fill="#555"/>
      <polygon points="291,100 295,107 299,100" fill="#555"/>
      <T x={300} y={84} size={9} color="#555">a ∥ b</T>
      <line x1="295" y1="105" x2="295" y2="155" stroke="#555" strokeWidth="1.2"/>
      <polygon points="291,110 295,103 299,110" fill="#555"/>
      <polygon points="291,150 295,157 299,150" fill="#555"/>
      <T x={300} y={133} size={9} color="#555">b ∥ c</T>
      {/* therefore */}
      <rect x="60" y="165" width="200" height="28" rx="6" fill="#DBEAFE"/>
      <T x={160} y={180} size={10} bold color="#1D4ED8" align="middle">∴ a ∥ c (by transitivity of parallel lines)</T>
      <T x={160} y={193} size={9} color="#555" align="middle">Theorem: If a ∥ b and b ∥ c, then a ∥ c</T>
    </svg>
  );
}

/* ── CBSE MATH 8 — Ch1–Ch7 ───────────────────────────────────────────────── */
function CbseMath8Squares() {
  return (
    <svg viewBox="0 0 280 195" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={10} bold color="#FFF" align="middle">Squares — n² = Area of n×n Grid</T>
      {[3,4,5].map((n,col)=>{
        const ox=22+col*84, oy=42, sz=14;
        const colors=["#DBEAFE","#FEF9C3","#DCFCE7"];
        const strokes=["#3B82F6","#EAB308","#22C55E"];
        return(
          <g key={n}>
            {Array.from({length:n}).flatMap((_,r)=>Array.from({length:n}).map((_2,c)=>(
              <rect key={r*n+c} x={ox+c*sz} y={oy+r*sz} width={sz-1} height={sz-1} rx="2" fill={colors[col]} stroke={strokes[col]} strokeWidth="0.8"/>
            )))}
            <T x={ox+n*sz/2} y={oy+n*sz+16} size={11} bold color={strokes[col]} align="middle">{n}²={n*n}</T>
          </g>
        );
      })}
      <rect x="10" y="152" width="260" height="36" rx="6" fill="#F0F9FF"/>
      <T x={140} y={168} size={9} bold color="#0369A1" align="middle">Perfect squares: 1,4,9,16,25,36,49,64,81,100</T>
      <T x={140} y={182} size={8} color="#64748B" align="middle">n² = n×n  (area of square with side n)</T>
    </svg>
  );
}
function CbseMath8Cubes() {
  return (
    <svg viewBox="0 0 280 188" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={10} bold color="#FFF" align="middle">Cubes — n³ = n × n × n</T>
      {[1,2,3,4,5].map((n,i)=>(
        <g key={n}>
          <rect x={18+i*50} y="40" width="44" height="38" rx="6" fill="#F5F3FF" stroke="#7C3AED" strokeWidth="1.5"/>
          <T x={40+i*50} y={56} size={10} bold color="#7C3AED" align="middle">{n}³</T>
          <T x={40+i*50} y={71} size={9} color="#5B21B6" align="middle">={n*n*n}</T>
        </g>
      ))}
      <rect x="10" y="88" width="260" height="26" rx="6" fill="#F5F3FF"/>
      <T x={140} y={104} size={9} bold color="#6D28D9" align="middle">Perfect cubes: 1,8,27,64,125,216,343…</T>
      <rect x="10" y="122" width="260" height="58" rx="6" fill="#FEF3C7"/>
      <T x={140} y={140} size={9} bold color="#92400E" align="middle">Cube = Volume of cube with side n</T>
      <T x={140} y={156} size={9} color="#B45309" align="middle">Side 3 → Volume = 3³ = 27 cubic units</T>
      <T x={140} y={172} size={8} color="#78350F" align="middle">Even n → even cube  |  Odd n → odd cube</T>
    </svg>
  );
}
function CbseMath8SquareRoots() {
  return (
    <svg viewBox="0 0 280 188" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={10} bold color="#FFF" align="middle">Square Roots — √n = inverse of squaring</T>
      <line x1="20" y1="84" x2="260" y2="84" stroke="#94A3B8" strokeWidth="2"/>
      {[[1,1],[4,2],[9,3],[16,4],[25,5]].map(([n,sq],i)=>{
        const x=20+i*60;
        return(
          <g key={n}>
            <circle cx={x} cy={84} r="5" fill="#22C55E"/>
            <T x={x} y={100} size={9} bold color="#16A34A" align="middle">{n}</T>
            <line x1={x} y1={70} x2={x} y2={79} stroke="#22C55E" strokeWidth="1.5"/>
            <rect x={x-20} y="44" width="40" height="22" rx="5" fill="#DCFCE7" stroke="#22C55E" strokeWidth="1.2"/>
            <T x={x} y={59} size={9} bold color="#16A34A" align="middle">√{n}={sq}</T>
          </g>
        );
      })}
      <T x={140} y={116} size={8} color="#64748B" align="middle">√n defined only for n ≥ 0</T>
      <rect x="10" y="126" width="260" height="54" rx="6" fill="#F0FDF4"/>
      <T x={140} y={144} size={9} bold color="#166534" align="middle">Approximations to memorise:</T>
      <T x={140} y={160} size={9} color="#15803D" align="middle">√2≈1.414  √3≈1.732  √5≈2.236  √7≈2.646</T>
      <T x={140} y={174} size={8} color="#64748B" align="middle">Long division method for non-perfect squares</T>
    </svg>
  );
}
function CbseMath8CubeRoots() {
  return (
    <svg viewBox="0 0 280 188" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={10} bold color="#FFF" align="middle">Cube Roots — ∛n via Prime Factor Triplets</T>
      <rect x="10" y="40" width="124" height="84" rx="8" fill="#F5F3FF" stroke="#7C3AED" strokeWidth="1.5"/>
      <T x={72} y={58} size={9} bold color="#6D28D9" align="middle">∛216 = ?</T>
      <T x={72} y={74} size={8} color="#4C1D95" align="middle">216 = 2×2×2×3×3×3</T>
      <T x={72} y={90} size={8} color="#4C1D95" align="middle">= (2³)×(3³)</T>
      <T x={72} y={108} size={9} bold color="#7C3AED" align="middle">∛216 = 2×3 = 6 ✓</T>
      <rect x="146" y="40" width="124" height="84" rx="8" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5"/>
      <T x={208} y={58} size={9} bold color="#92400E" align="middle">∛343 = ?</T>
      <T x={208} y={74} size={8} color="#78350F" align="middle">343 = 7×7×7</T>
      <T x={208} y={90} size={8} color="#78350F" align="middle">One triplet only</T>
      <T x={208} y={108} size={9} bold color="#D97706" align="middle">∛343 = 7 ✓</T>
      <rect x="10" y="132" width="260" height="48" rx="6" fill="#F0F9FF"/>
      <T x={140} y={150} size={9} bold color="#0369A1" align="middle">Method: prime-factorise → group into triplets</T>
      <T x={140} y={166} size={8} color="#0284C7" align="middle">Each triplet contributes one factor to ∛</T>
    </svg>
  );
}
function CbseMath8ExponentsIntro() {
  return (
    <svg viewBox="0 0 280 188" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={10} bold color="#FFF" align="middle">Exponents — aⁿ = a × a × … (n times)</T>
      <rect x="30" y="40" width="80" height="44" rx="8" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2"/>
      <T x={70} y={58} size={14} bold color="#1D4ED8" align="middle">2⁴</T>
      <T x={70} y={76} size={8} color="#1E40AF" align="middle">base=2, exp=4</T>
      <T x={124} y={65} size={12} bold color="#374151" align="middle">=</T>
      <rect x="140" y="40" width="130" height="44" rx="8" fill="#F0FDF4" stroke="#22C55E" strokeWidth="1.5"/>
      <T x={205} y={58} size={10} bold color="#166534" align="middle">2×2×2×2</T>
      <T x={205} y={76} size={9} bold color="#15803D" align="middle">= 16</T>
      <T x={140} y={104} size={8} color="#6B7280" align="middle">4 factors of 2</T>
      <rect x="10" y="112" width="260" height="68" rx="6" fill="#FEF9C3"/>
      <T x={140} y={130} size={9} bold color="#713F12" align="middle">aⁿ  (a = base,  n = exponent)</T>
      <T x={140} y={146} size={9} color="#854D0E" align="middle">a¹ = a   |   a⁰ = 1 (a≠0)   |   a² = square</T>
      <T x={140} y={162} size={9} color="#854D0E" align="middle">a³ = cube  |  a⁴,a⁵ … higher powers</T>
    </svg>
  );
}
function CbseMath8LawsOfExponents() {
  const laws=[["aᵐ × aⁿ","aᵐ⁺ⁿ","add exponents"],["aᵐ ÷ aⁿ","aᵐ⁻ⁿ","sub exponents"],["(aᵐ)ⁿ","aᵐⁿ","power of power"],["aᵐ × bᵐ","(ab)ᵐ","same exp"],["a⁰","1","zero exp"],["a⁻ⁿ","1/aⁿ","negative exp"]];
  return (
    <svg viewBox="0 0 280 204" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={10} bold color="#FFF" align="middle">Six Laws of Exponents</T>
      {laws.map(([lhs,rhs,note],i)=>(
        <g key={i}>
          <rect x="10" y={38+i*27} width="260" height="24" rx="5" fill={i%2===0?"#F0F9FF":"#F5F3FF"}/>
          <T x={76} y={54+i*27} size={9} bold color="#1D4ED8" align="middle">{lhs}</T>
          <T x={138} y={54+i*27} size={10} color="#374151" align="middle">=</T>
          <T x={188} y={54+i*27} size={9} bold color="#7C3AED" align="middle">{rhs}</T>
          <T x={268} y={54+i*27} size={7} color="#94A3B8" align="end">{note}</T>
        </g>
      ))}
    </svg>
  );
}
function CbseMath8NegativeExponents() {
  return (
    <svg viewBox="0 0 280 192" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={10} bold color="#FFF" align="middle">Negative Exponents — a⁻ⁿ = 1/aⁿ</T>
      <rect x="10" y="38" width="260" height="34" rx="6" fill="#FEF2F2" stroke="#FCA5A5" strokeWidth="1.5"/>
      <T x={140} y={52} size={9} bold color="#B91C1C" align="middle">⚠ a⁻ⁿ ≠ −aⁿ  (most common mistake!)</T>
      <T x={140} y={66} size={8} color="#DC2626" align="middle">Negative exponent = RECIPROCAL, not negative</T>
      <rect x="10" y="80" width="124" height="58" rx="8" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5"/>
      <T x={72} y={98} size={11} bold color="#1D4ED8" align="middle">2⁻³</T>
      <T x={72} y={114} size={9} color="#1E40AF" align="middle">= 1/2³ = 1/8</T>
      <T x={72} y={130} size={9} bold color="#2563EB" align="middle">= 0.125</T>
      <rect x="146" y="80" width="124" height="58" rx="8" fill="#DCFCE7" stroke="#22C55E" strokeWidth="1.5"/>
      <T x={208} y={98} size={11} bold color="#166534" align="middle">10⁻⁴</T>
      <T x={208} y={114} size={9} color="#15803D" align="middle">= 1/10000</T>
      <T x={208} y={130} size={9} bold color="#16A34A" align="middle">= 0.0001</T>
      <rect x="10" y="146" width="260" height="38" rx="6" fill="#F5F3FF"/>
      <T x={140} y={162} size={9} bold color="#6D28D9" align="middle">Flip the fraction to make exponent positive:</T>
      <T x={140} y={178} size={9} color="#7C3AED" align="middle">(3/5)⁻² = (5/3)² = 25/9</T>
    </svg>
  );
}
function CbseMath8ScientificNotation() {
  return (
    <svg viewBox="0 0 280 196" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={10} bold color="#FFF" align="middle">Scientific Notation — a × 10ⁿ  (1 ≤ a &lt; 10)</T>
      <rect x="10" y="38" width="260" height="50" rx="6" fill="#F0FDF4" stroke="#86EFAC" strokeWidth="1.5"/>
      <T x={140} y={56} size={9} bold color="#166534" align="middle">LARGE → positive exponent (decimal moves left)</T>
      <T x={140} y={72} size={9} color="#16A34A" align="middle">300,000 = 3.0 × 10⁵   ★←←←←← (5 places)</T>
      <rect x="10" y="96" width="260" height="50" rx="6" fill="#FFF7ED" stroke="#FDBA74" strokeWidth="1.5"/>
      <T x={140} y={114} size={9} bold color="#92400E" align="middle">SMALL → negative exponent (decimal moves right)</T>
      <T x={140} y={130} size={9} color="#B45309" align="middle">0.0003 = 3.0 × 10⁻⁴   →→→→★ (4 places)</T>
      <rect x="10" y="154" width="260" height="36" rx="6" fill="#F8FAFC"/>
      <T x={140} y={170} size={9} bold color="#374151" align="middle">Speed of light: 3×10⁸ m/s</T>
      <T x={140} y={184} size={9} color="#64748B" align="middle">Size of atom: 1×10⁻¹⁰ m</T>
    </svg>
  );
}
function CbseMath8NumberSystems() {
  return (
    <svg viewBox="0 0 280 196" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={10} bold color="#FFF" align="middle">Number Hierarchy — ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ</T>
      <ellipse cx="140" cy="118" rx="125" ry="70" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5"/>
      <T x={140} y={52} size={9} bold color="#92400E" align="middle">ℝ Real Numbers</T>
      <T x={230} y={115} size={8} color="#B45309" align="middle">√2,π,e</T>
      <ellipse cx="130" cy="120" rx="90" ry="50" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5"/>
      <T x={130} y={74} size={9} bold color="#1D4ED8" align="middle">ℚ Rationals</T>
      <T x={196} y={122} size={8} color="#1E40AF" align="middle">½,−¾</T>
      <ellipse cx="120" cy="122" rx="60" ry="34" fill="#DCFCE7" stroke="#22C55E" strokeWidth="1.5"/>
      <T x={120} y={96} size={9} bold color="#166534" align="middle">ℤ Integers</T>
      <T x={152} y={126} size={8} color="#15803D" align="middle">−3,0</T>
      <ellipse cx="110" cy="126" rx="34" ry="20" fill="#F5F3FF" stroke="#7C3AED" strokeWidth="1.5"/>
      <T x={110} y={130} size={8} bold color="#6D28D9" align="middle">ℕ 1,2,3</T>
    </svg>
  );
}
function CbseMath8IntegersOps() {
  return (
    <svg viewBox="0 0 280 182" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={10} bold color="#FFF" align="middle">Integer Operations on the Number Line</T>
      <line x1="20" y1="78" x2="260" y2="78" stroke="#94A3B8" strokeWidth="2"/>
      {[-4,-3,-2,-1,0,1,2,3,4].map((n,i)=>{
        const x=20+i*30;
        return(
          <g key={n}>
            <line x1={x} y1={72} x2={x} y2={84} stroke="#94A3B8" strokeWidth="1.5"/>
            <T x={x} y={96} size={9} color={n===0?"#1D4ED8":"#374151"} bold={n===0} align="middle">{n}</T>
          </g>
        );
      })}
      <path d="M80 70 Q96 55 112 70" fill="none" stroke="#22C55E" strokeWidth="2"/>
      <polygon points="112,70 107,65 114,63" fill="#22C55E"/>
      <T x={96} y={52} size={9} bold color="#16A34A" align="middle">+4</T>
      <path d="M200 70 Q183 55 166 70" fill="none" stroke="#EF4444" strokeWidth="2"/>
      <polygon points="166,70 171,65 163,63" fill="#EF4444"/>
      <T x={183} y={52} size={9} bold color="#DC2626" align="middle">−3</T>
      <rect x="10" y="108" width="260" height="66" rx="6" fill="#F8FAFC"/>
      <T x={140} y={126} size={9} bold color="#374151" align="middle">Right = positive (+)   |   Left = negative (−)</T>
      <T x={140} y={142} size={9} color="#374151" align="middle">−5 + 8 = 3   |   −3 − 4 = −7</T>
      <T x={140} y={158} size={9} color="#374151" align="middle">(+)(+)=+  (−)(−)=+  (+)(−)=−  (−)(+)=−</T>
    </svg>
  );
}
function CbseMath8RationalNumbers() {
  return (
    <svg viewBox="0 0 280 186" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={10} bold color="#FFF" align="middle">Rational Numbers — p/q  (p,q ∈ ℤ, q ≠ 0)</T>
      <line x1="20" y1="80" x2="260" y2="80" stroke="#94A3B8" strokeWidth="2"/>
      {[[-2,"−2",true],[-1.5,"−3/2",false],[-1,"−1",true],[-0.5,"−1/2",false],[0,"0",true],[0.5,"1/2",false],[1,"1",true],[1.5,"3/2",false],[2,"2",true]].map(([v,label,isInt],i)=>{
        const x=20+i*30;
        return(
          <g key={i}>
            <line x1={x} y1={74} x2={x} y2={86} stroke={isInt?"#1D4ED8":"#9333EA"} strokeWidth={isInt?2:1.2}/>
            <T x={x} y={100} size={isInt?9:7} bold={isInt} color={isInt?"#1D4ED8":"#7E22CE"} align="middle">{label}</T>
          </g>
        );
      })}
      <rect x="10" y="112" width="260" height="66" rx="6" fill="#F5F3FF"/>
      <T x={140} y={130} size={9} bold color="#6D28D9" align="middle">Any p/q where p,q ∈ ℤ  and  q ≠ 0</T>
      <T x={140} y={146} size={9} color="#7C3AED" align="middle">Terminating: 1/4 = 0.25</T>
      <T x={140} y={162} size={9} color="#7C3AED" align="middle">Recurring: 1/3 = 0.333…  (rational, not irrational)</T>
    </svg>
  );
}
function CbseMath8IrrationalNumbers() {
  return (
    <svg viewBox="0 0 280 186" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={10} bold color="#FFF" align="middle">Irrational Numbers — Non-repeating Decimals</T>
      <line x1="20" y1="76" x2="260" y2="76" stroke="#94A3B8" strokeWidth="2"/>
      {[[0,"0",true],[120,"1",true],[240,"2",true]].map(([cx,label,isInt])=>(
        <g key={label}>
          <circle cx={20+cx} cy={76} r="4" fill="#3B82F6"/>
          <T x={20+cx} y={91} size={9} bold color="#1D4ED8" align="middle">{label}</T>
        </g>
      ))}
      {[[42,"√2","#EF4444","≈1.414…"],[57,"√3","#7C3AED","≈1.732…"],[136,"√5","#EAB308","≈2.236…"],[160,"π","#F97316","≈3.14159…"]].map(([cx,label,color,approx])=>(
        <g key={label}>
          <circle cx={cx} cy={76} r="5" fill={color}/>
          <T x={cx} y={91} size={8} bold color={color} align="middle">{label}</T>
          <T x={cx} y={58} size={7} color={color} align="middle">{approx}</T>
          <line x1={cx} y1={63} x2={cx} y2={71} stroke={color} strokeWidth="1"/>
        </g>
      ))}
      <rect x="10" y="106" width="260" height="72" rx="6" fill="#FEF2F2"/>
      <T x={140} y={124} size={9} bold color="#991B1B" align="middle">Cannot be written as p/q</T>
      <T x={140} y={140} size={9} color="#B91C1C" align="middle">Decimal: non-terminating AND non-recurring</T>
      <T x={140} y={156} size={8} color="#DC2626" align="middle">√2 = 1.41421356…  digits NEVER repeat</T>
      <T x={140} y={170} size={8} color="#64748B" align="middle">Rational + Irrational = always Irrational</T>
    </svg>
  );
}
function CbseMath8QuadTypes() {
  const shapes=[
    {label:"Square",pts:"0,0 42,0 42,42 0,42",fill:"#DBEAFE",stroke:"#3B82F6"},
    {label:"Rectangle",pts:"0,8 56,8 56,36 0,36",fill:"#DCFCE7",stroke:"#22C55E"},
    {label:"Parallelogram",pts:"10,8 58,8 48,36 0,36",fill:"#FEF9C3",stroke:"#EAB308"},
    {label:"Rhombus",pts:"28,0 56,22 28,44 0,22",fill:"#FEE2E2",stroke:"#EF4444"},
    {label:"Trapezium",pts:"10,8 54,8 62,38 0,38",fill:"#F5F3FF",stroke:"#7C3AED"},
    {label:"Kite",pts:"28,0 56,28 28,54 0,28",fill:"#FFF7ED",stroke:"#F97316"},
  ];
  return (
    <svg viewBox="0 0 280 218" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="4" width="260" height="24" rx="6" fill="#1D1D1F"/>
      <T x={140} y={20} size={10} bold color="#FFF" align="middle">Six Types of Quadrilaterals</T>
      {shapes.map(({label,pts,fill,stroke},i)=>{
        const col=i%3,row=Math.floor(i/3);
        const ox=16+col*88,oy=34+row*88;
        const shifted=pts.split(" ").map(p=>{const[x,y]=p.split(",");return`${+x+ox},${+y+oy}`;}).join(" ");
        return(
          <g key={label}>
            <polygon points={shifted} fill={fill} stroke={stroke} strokeWidth="1.5"/>
            <T x={ox+28} y={oy+62} size={8} bold color={stroke} align="middle">{label}</T>
          </g>
        );
      })}
    </svg>
  );
}
function CbseMath8QuadProperties() {
  const rows=[["Shape","‖ pairs","= sides","90°","= diag"],["Square","2","4","✓","✓"],["Rect.","2","opp","✓","✓"],["Parallelogram","2","opp","✗","✗"],["Rhombus","2","4","✗","⊥bisect"],["Trapezium","1","—","✗","✗"]];
  return (
    <svg viewBox="0 0 280 186" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="4" width="260" height="22" rx="4" fill="#1D1D1F"/>
      <T x={140} y={18} size={9} bold color="#FFF" align="middle">Quadrilateral Properties at a Glance</T>
      {rows.map((row,i)=>(
        <g key={i}>
          <rect x="10" y={30+i*26} width="260" height="24" rx="3" fill={i===0?"#1D1D1F":i%2===0?"#EFF6FF":"#F0FDF4"}/>
          {row.map((cell,j)=>(
            <T key={j} x={20+j*52} y={46+i*26} size={i===0?8:9} bold={i===0||j===0} color={i===0?"#FFF":j===0?"#1D4ED8":"#374151"}>{cell}</T>
          ))}
        </g>
      ))}
    </svg>
  );
}
function CbseMath8AngleSumProp() {
  return (
    <svg viewBox="0 0 280 192" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={10} bold color="#FFF" align="middle">Angle Sum of a Quadrilateral = 360°</T>
      <polygon points="58,48 206,40 232,138 38,148" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2"/>
      <line x1="58" y1="48" x2="232" y2="138" stroke="#94A3B8" strokeWidth="1" strokeDasharray="4,3"/>
      <T x={46} y={66} size={9} bold color="#1D4ED8">a=80°</T>
      <T x={198} y={38} size={9} bold color="#16A34A">b=110°</T>
      <T x={228} y={152} size={9} bold color="#DC2626">c=70°</T>
      <T x={22} y={162} size={9} bold color="#7C3AED">d=100°</T>
      <rect x="76" y="162" width="128" height="24" rx="5" fill="#F0F9FF"/>
      <T x={140} y={178} size={9} bold color="#0369A1" align="middle">a+b+c+d = 360° always</T>
    </svg>
  );
}
function CbseMath8ParallelogramThms() {
  return (
    <svg viewBox="0 0 280 196" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={10} bold color="#FFF" align="middle">Parallelogram — Key Theorems</T>
      <polygon points="54,52 196,52 226,130 24,130" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2"/>
      <line x1="54" y1="52" x2="226" y2="130" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="5,3"/>
      <line x1="196" y1="52" x2="24" y2="130" stroke="#22C55E" strokeWidth="1.5" strokeDasharray="5,3"/>
      <circle cx="125" cy="91" r="4" fill="#F97316"/>
      <T x={136} y={90} size={8} bold color="#EA580C">mid</T>
      <T x={125} y={44} size={8} bold color="#1D4ED8" align="middle">AB ∥ CD  (opposite sides parallel)</T>
      <rect x="10" y="144" width="260" height="44" rx="6" fill="#F0FDF4"/>
      <T x={140} y={160} size={9} bold color="#166534" align="middle">AB=CD, AD=BC  (opp sides equal)</T>
      <T x={140} y={176} size={9} color="#15803D" align="middle">∠A=∠C, ∠B=∠D  |  Diagonals bisect each other</T>
    </svg>
  );
}
function CbseMath8NumberPatterns() {
  return (
    <svg viewBox="0 0 280 190" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={10} bold color="#FFF" align="middle">Number Patterns — Triangular &amp; Square</T>
      <T x={14} y={44} size={8} bold color="#1D4ED8">Triangular: 1, 3, 6, 10…</T>
      {[[1,1],[3,2],[6,3],[10,4]].map(([n,rows],idx)=>{
        let dots=[];let d=0;
        for(let r=0;r<rows;r++)for(let c=0;c<=r;c++){dots.push([30+idx*60+c*8-r*4,54+r*9]);d++;}
        return dots.map((p,j)=><circle key={j} cx={p[0]} cy={p[1]} r="3" fill="#3B82F6"/>);
      })}
      <T x={14} y={106} size={8} bold color="#7C3AED">Square: 1, 4, 9, 16…</T>
      {[[1,1],[4,2],[9,3],[16,4]].map(([n,s],idx)=>{
        let dots=[];
        for(let r=0;r<s;r++)for(let c=0;c<s;c++)dots.push([28+idx*56+c*7,114+r*7]);
        return dots.map((p,j)=><circle key={j} cx={p[0]} cy={p[1]} r="2.5" fill="#7C3AED"/>);
      })}
      <rect x="10" y="158" width="260" height="26" rx="5" fill="#FEF9C3"/>
      <T x={140} y={174} size={8} bold color="#713F12" align="middle">Triangular Tₙ=n(n+1)/2  |  Square Sₙ=n²</T>
    </svg>
  );
}
function CbseMath8PrimesComposites() {
  const primes=new Set([2,3,5,7,11,13,17,19]);
  return (
    <svg viewBox="0 0 280 188" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={10} bold color="#FFF" align="middle">Primes &amp; Composites (1–20)</T>
      {Array.from({length:20},(_,i)=>i+1).map((n,i)=>{
        const col=i%5,row=Math.floor(i/5);
        const isPrime=primes.has(n),isOne=n===1;
        const fill=isPrime?"#DBEAFE":isOne?"#F1F5F9":"#FEE2E2";
        const stroke=isPrime?"#3B82F6":isOne?"#CBD5E1":"#FCA5A5";
        const tc=isPrime?"#1D4ED8":isOne?"#94A3B8":"#EF4444";
        return(
          <g key={n}>
            <rect x={20+col*50} y={38+row*30} width="40" height="24" rx="5" fill={fill} stroke={stroke} strokeWidth="1.5"/>
            <T x={40+col*50} y={54+row*30} size={10} bold={isPrime} color={tc} align="middle">{n}</T>
          </g>
        );
      })}
      <T x={140} y={170} size={8} color="#64748B" align="middle">Blue=prime  |  Red=composite  |  Grey=1 (neither)</T>
    </svg>
  );
}
function CbseMath8DivisibilityRules() {
  const rules=[["÷2","Last digit 0,2,4,6,8","128✓"],["÷3","Digit sum divisible by 3","123→6✓"],["÷5","Last digit 0 or 5","245✓"],["÷9","Digit sum divisible by 9","729→18✓"],["÷10","Last digit is 0","340✓"]];
  return (
    <svg viewBox="0 0 280 188" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={10} bold color="#FFF" align="middle">Divisibility Rules — Quick Test</T>
      {rules.map(([div,rule,ex],i)=>(
        <g key={i}>
          <rect x="10" y={36+i*30} width="260" height="26" rx="5" fill={i%2===0?"#EFF6FF":"#F0FDF4"}/>
          <rect x="10" y={36+i*30} width="32" height="26" rx="5" fill={i%2===0?"#DBEAFE":"#DCFCE7"}/>
          <T x={26} y={53+i*30} size={9} bold color={i%2===0?"#1D4ED8":"#166534"} align="middle">{div}</T>
          <T x={50} y={53+i*30} size={8} color="#374151">{rule}</T>
          <T x={268} y={53+i*30} size={8} color="#6B7280" align="end">{ex}</T>
        </g>
      ))}
    </svg>
  );
}
function CbseMath8NumberPuzzles() {
  return (
    <svg viewBox="0 0 280 190" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={10} bold color="#FFF" align="middle">Number Trick — Algebra Explains Why</T>
      <T x={140} y={44} size={9} bold color="#374151" align="middle">Pick any number N. Follow steps:</T>
      {[["Step 1: Pick N","N","#EFF6FF"],["Step 2: Double","2N","#F0FDF4"],["Step 3: Add 6","2N+6","#FEF9C3"],["Step 4: Halve","N+3","#FFF7ED"],["Step 5: Sub N","= 3  always!","#DCFCE7"]].map(([step,expr,fill],i)=>(
        <g key={i}>
          <rect x="10" y={52+i*26} width="260" height="22" rx="5" fill={fill}/>
          <T x={80} y={67+i*26} size={8} color="#64748B" align="middle">{step}</T>
          <T x={196} y={67+i*26} size={10} bold color={i===4?"#16A34A":"#1D4ED8"} align="middle">{expr}</T>
        </g>
      ))}
      <T x={140} y={188} size={8} color="#64748B" align="middle">Algebra shows the constant always cancels to 3</T>
    </svg>
  );
}
function CbseMath8DistributiveLaw() {
  return (
    <svg viewBox="0 0 280 192" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={10} bold color="#FFF" align="middle">Distributive Law — a(b+c) = ab + ac</T>
      <rect x="20" y="40" width="96" height="68" rx="4" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5"/>
      <T x={68} y={78} size={12} bold color="#1D4ED8" align="middle">ab</T>
      <rect x="120" y="40" width="140" height="68" rx="4" fill="#DCFCE7" stroke="#22C55E" strokeWidth="1.5"/>
      <T x={190} y={78} size={12} bold color="#166534" align="middle">ac</T>
      <line x1="116" y1="34" x2="116" y2="114" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4,3"/>
      <T x={68} y={120} size={9} bold color="#1D4ED8" align="middle">b</T>
      <T x={190} y={120} size={9} bold color="#166534" align="middle">c</T>
      <line x1="14" y1="40" x2="14" y2="108" stroke="#7C3AED" strokeWidth="2.5"/>
      <T x={9} y={76} size={9} bold color="#7C3AED" align="end">a</T>
      <rect x="10" y="130" width="260" height="54" rx="6" fill="#FEF9C3"/>
      <T x={140} y={148} size={9} bold color="#713F12" align="middle">Example: 3(x + 4) = 3·x + 3·4 = 3x + 12</T>
      <T x={140} y={164} size={9} color="#854D0E" align="middle">BOTH terms inside bracket must be multiplied</T>
      <T x={140} y={178} size={8} color="#92400E" align="middle">Reverse: 3x+12 → factor out 3 → 3(x+4)</T>
    </svg>
  );
}
function CbseMath8Factorisation() {
  return (
    <svg viewBox="0 0 280 192" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={10} bold color="#FFF" align="middle">Factorisation — Reverse of Distributive</T>
      <rect x="10" y="38" width="260" height="44" rx="6" fill="#FEF9C3"/>
      <T x={140} y={56} size={10} bold color="#92400E" align="middle">6x² + 9x</T>
      <T x={140} y={74} size={9} color="#713F12" align="middle">HCF of 6x² and 9x = 3x</T>
      <rect x="10" y="90" width="260" height="44" rx="6" fill="#DCFCE7"/>
      <T x={140} y={108} size={10} bold color="#166534" align="middle">6x² + 9x = 3x(2x + 3)</T>
      <T x={140} y={126} size={9} color="#15803D" align="middle">Verify: 3x·2x + 3x·3 = 6x²+9x ✓</T>
      <rect x="10" y="142" width="260" height="44" rx="6" fill="#F5F3FF"/>
      <T x={140} y={160} size={9} bold color="#6D28D9" align="middle">Difference of squares: a²−b² = (a+b)(a−b)</T>
      <T x={140} y={178} size={9} color="#7C3AED" align="middle">x²−9 = x²−3² = (x+3)(x−3)</T>
    </svg>
  );
}
function CbseMath8LikeUnlikeTerms() {
  return (
    <svg viewBox="0 0 280 186" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={10} bold color="#FFF" align="middle">Like vs Unlike Terms</T>
      <T x={140} y={44} size={9} bold color="#374151" align="middle">3x² + 5x − 2x² + 7 − 4x</T>
      {[{label:"3x²",x:30,fill:"#DBEAFE",stroke:"#3B82F6",tc:"#1D4ED8"},{label:"5x",x:82,fill:"#FEF9C3",stroke:"#EAB308",tc:"#713F12"},{label:"−2x²",x:130,fill:"#DBEAFE",stroke:"#3B82F6",tc:"#1D4ED8"},{label:"7",x:186,fill:"#DCFCE7",stroke:"#22C55E",tc:"#166534"},{label:"−4x",x:236,fill:"#FEF9C3",stroke:"#EAB308",tc:"#713F12"}].map(({label,x,fill,stroke,tc})=>(
        <g key={label}>
          <rect x={x-22} y="52" width="44" height="28" rx="6" fill={fill} stroke={stroke} strokeWidth="1.5"/>
          <T x={x} y={70} size={9} bold color={tc} align="middle">{label}</T>
        </g>
      ))}
      <rect x="10" y="92" width="260" height="86" rx="6" fill="#F8FAFC"/>
      <T x={140} y={110} size={9} bold color="#374151" align="middle">Group LIKE terms (same variable + power):</T>
      <T x={140} y={126} size={9} color="#1D4ED8" align="middle">x²-terms: 3x² − 2x² = x²</T>
      <T x={140} y={142} size={9} color="#713F12" align="middle">x-terms:  5x − 4x = x</T>
      <T x={140} y={158} size={9} color="#166534" align="middle">constants: 7</T>
      <T x={140} y={174} size={9} bold color="#374151" align="middle">Result: x² + x + 7</T>
    </svg>
  );
}
function CbseMath8AlgebraicSimplification() {
  return (
    <svg viewBox="0 0 280 188" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={10} bold color="#FFF" align="middle">Algebraic Simplification — 4 Steps</T>
      {[{step:"Start",expr:"2(3x+4) − 3(x−2)",fill:"#EFF6FF",tc:"#1D4ED8"},{step:"Expand",expr:"6x+8 − 3x+6",fill:"#F0FDF4",tc:"#166534"},{step:"Group",expr:"(6x−3x)+(8+6)",fill:"#FEF9C3",tc:"#713F12"},{step:"Answer",expr:"3x + 14",fill:"#DCFCE7",tc:"#16A34A"}].map(({step,expr,fill,tc},i)=>(
        <g key={i}>
          <rect x="10" y={40+i*36} width="260" height="30" rx="6" fill={fill}/>
          <T x={52} y={59+i*36} size={8} bold color="#94A3B8" align="middle">{step}</T>
          <T x={165} y={59+i*36} size={10} bold color={tc} align="middle">{expr}</T>
          {i<3&&<text x={140} y={74+i*36} fontSize={10} fill="#CBD5E1" textAnchor="middle">↓</text>}
        </g>
      ))}
    </svg>
  );
}
function CbseMath8Ratios() {
  return (
    <svg viewBox="0 0 280 186" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={10} bold color="#FFF" align="middle">Ratios — Comparing Two Quantities</T>
      <T x={140} y={44} size={9} bold color="#374151" align="middle">Ratio 2:3 in a class of 25 students</T>
      <rect x="20" y="52" width="80" height="34" rx="6" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2"/>
      <T x={60} y={73} size={10} bold color="#1D4ED8" align="middle">Boys=10</T>
      <rect x="116" y="52" width="144" height="34" rx="6" fill="#FEE2E2" stroke="#EF4444" strokeWidth="2"/>
      <T x={188} y={73} size={10} bold color="#DC2626" align="middle">Girls=15</T>
      <T x={60} y={100} size={8} color="#1E40AF" align="middle">2 parts</T>
      <T x={188} y={100} size={8} color="#B91C1C" align="middle">3 parts</T>
      <rect x="10" y="110" width="260" height="68" rx="6" fill="#F8FAFC"/>
      <T x={140} y={128} size={9} bold color="#374151" align="middle">Ratio a:b = a/b  (pure number, no units)</T>
      <T x={140} y={144} size={9} color="#64748B" align="middle">Simplify: 10:15 = 2:3  (÷ HCF=5)</T>
      <T x={140} y={160} size={9} color="#64748B" align="middle">2:3 ≠ 3:2  (order matters!)</T>
      <T x={140} y={174} size={8} color="#94A3B8" align="middle">a:b:c = three-way ratio (e.g. angles in triangle)</T>
    </svg>
  );
}
function CbseMath8Proportions() {
  return (
    <svg viewBox="0 0 280 192" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={10} bold color="#FFF" align="middle">Proportions — a:b :: c:d → ad = bc</T>
      <rect x="16" y="40" width="110" height="48" rx="8" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5"/>
      <T x={71} y={60} size={12} bold color="#1D4ED8" align="middle">2 : 3</T>
      <T x={71} y={78} size={9} color="#1E40AF" align="middle">= 0.6667</T>
      <T x={140} y={66} size={14} bold color="#374151" align="middle">=</T>
      <rect x="154" y="40" width="110" height="48" rx="8" fill="#DCFCE7" stroke="#22C55E" strokeWidth="1.5"/>
      <T x={209} y={60} size={12} bold color="#166534" align="middle">4 : 6</T>
      <T x={209} y={78} size={9} color="#15803D" align="middle">= 0.6667 ✓</T>
      <rect x="10" y="98" width="260" height="86" rx="6" fill="#FEF9C3"/>
      <T x={140} y={116} size={9} bold color="#713F12" align="middle">Cross-product test: 2×6 = 12  and  3×4 = 12 ✓</T>
      <T x={140} y={132} size={9} bold color="#92400E" align="middle">Solve: 2/3 = x/9</T>
      <T x={140} y={148} size={9} color="#78350F" align="middle">3·x = 2·9 = 18   →   x = 6</T>
      <T x={140} y={164} size={8} color="#64748B" align="middle">Extreme × Extreme = Mean × Mean</T>
      <T x={140} y={178} size={8} color="#64748B" align="middle">(outer terms) × (outer) = (inner) × (inner)</T>
    </svg>
  );
}
function CbseMath8UnitaryMethod() {
  return (
    <svg viewBox="0 0 280 192" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={10} bold color="#FFF" align="middle">Unitary Method — Find 1, Then Scale</T>
      <rect x="10" y="38" width="260" height="30" rx="6" fill="#EFF6FF"/>
      <T x={140} y={57} size={9} bold color="#1D4ED8" align="middle">Problem: 5 pens cost ₹40. Cost of 8 pens?</T>
      {[{step:"Given",val:"5 pens → ₹40",fill:"#DBEAFE",tc:"#1D4ED8"},{step:"÷5  (unit)",val:"1 pen  → ₹8",fill:"#F0FDF4",tc:"#166534"},{step:"×8  (scale)",val:"8 pens → ₹64 ✓",fill:"#DCFCE7",tc:"#16A34A"}].map(({step,val,fill,tc},i)=>(
        <g key={i}>
          <rect x="10" y={76+i*34} width="260" height="28" rx="6" fill={fill}/>
          <T x={68} y={94+i*34} size={8} bold color="#94A3B8" align="middle">{step}</T>
          <T x={178} y={94+i*34} size={10} bold color={tc} align="middle">{val}</T>
          {i<2&&<text x={140} y={108+i*34} fontSize={10} fill="#CBD5E1" textAnchor="middle">↓</text>}
        </g>
      ))}
      <T x={140} y={188} size={8} color="#64748B" align="middle">Works for direct proportion only</T>
    </svg>
  );
}
function CbseMath8Percentages() {
  return (
    <svg viewBox="0 0 280 190" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={10} bold color="#FFF" align="middle">Percentages — Parts per Hundred</T>
      <rect x="20" y="38" width="200" height="22" rx="4" fill="#E2E8F0"/>
      <rect x="20" y="38" width="150" height="22" rx="4" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5"/>
      <T x={95} y={53} size={9} bold color="#1D4ED8" align="middle">75 shaded</T>
      <T x={224} y={53} size={9} color="#94A3B8" align="middle">25 blank</T>
      <T x={140} y={74} size={9} bold color="#374151" align="middle">75 out of 100 = 75%</T>
      <rect x="10" y="82" width="260" height="100" rx="6" fill="#F8FAFC"/>
      <T x={140} y={100} size={9} bold color="#374151" align="middle">% ↔ Fraction ↔ Decimal</T>
      <T x={140} y={116} size={9} color="#374151" align="middle">50% = 50/100 = 1/2 = 0.5</T>
      <T x={140} y={132} size={9} color="#374151" align="middle">25% = 1/4 = 0.25</T>
      <T x={140} y={148} size={9} color="#374151" align="middle">% increase = (increase/original)×100</T>
      <T x={140} y={164} size={9} color="#374151" align="middle">% decrease = (decrease/original)×100</T>
      <T x={140} y={180} size={8} color="#64748B" align="middle">Profit% = (Profit/CP)×100</T>
    </svg>
  );
}

// ── CBSE Math 8 — Ch8: Fractions ─────────────────────────────────────────────
function CbseMath8ComplexFractions() {
  return (
    <svg viewBox="0 0 280 180" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={11} color="#F5F5F7" bold align="middle">Complex Fractions</T>
      <rect x="20" y="42" width="240" height="52" rx="6" fill="#EFF6FF"/>
      <T x={140} y={60} size={10} color="#1E40AF" bold align="middle">a/b ÷ c/d = a/b × d/c</T>
      <T x={140} y={78} size={9} color="#374151" align="middle">Keep → Change → Flip</T>
      <T x={140} y={93} size={8} color="#64748B" align="middle">(invert the divisor, then multiply)</T>
      <rect x="20" y="104" width="112" height="52" rx="5" fill="#F0FDF4"/>
      <T x={76} y={120} size={9} color="#166534" bold align="middle">Example</T>
      <T x={76} y={135} size={9} color="#374151" align="middle">3/4 ÷ 3/8</T>
      <T x={76} y={150} size={9} color="#374151" align="middle">= 3/4 × 8/3 = 2</T>
      <rect x="148" y="104" width="112" height="52" rx="5" fill="#FFF7ED"/>
      <T x={204} y={120} size={9} color="#92400E" bold align="middle">Simplify First</T>
      <T x={204} y={135} size={9} color="#374151" align="middle">Cancel common</T>
      <T x={204} y={150} size={9} color="#374151" align="middle">factors early</T>
    </svg>
  );
}

function CbseMath8RatiosAsFractions() {
  return (
    <svg viewBox="0 0 280 180" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={11} color="#F5F5F7" bold align="middle">Ratios as Fractions</T>
      <T x={140} y={50} size={10} color="#1E40AF" bold align="middle">Ratio 3 : 4  =  3/4</T>
      <rect x="20" y="58" width="240" height="22" rx="4" fill="#E0F2FE"/>
      <T x={140} y={73} size={9} color="#0369A1" align="middle">Bar Model — 7 equal parts total</T>
      <rect x="20" y="88" width="102" height="28" rx="4" fill="#3B82F6"/>
      <T x={71} y={106} size={10} color="#fff" bold align="middle">3 parts</T>
      <rect x="128" y="88" width="132" height="28" rx="4" fill="#93C5FD"/>
      <T x={194} y={106} size={10} color="#1E40AF" bold align="middle">4 parts</T>
      <T x={71} y={132} size={9} color="#374151" align="middle">Part A = 3/7 of whole</T>
      <T x={194} y={132} size={9} color="#374151" align="middle">Part B = 4/7 of whole</T>
      <T x={140} y={155} size={8} color="#64748B" align="middle">Ratio a : b → fraction a/(a+b) of total</T>
    </svg>
  );
}

function CbseMath8DividingFractions() {
  return (
    <svg viewBox="0 0 280 180" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={11} color="#F5F5F7" bold align="middle">Dividing Fractions</T>
      <rect x="20" y="38" width="240" height="36" rx="6" fill="#F5F3FF"/>
      <T x={140} y={54} size={10} color="#6D28D9" bold align="middle">Step 1: Keep the first fraction</T>
      <T x={140} y={68} size={9} color="#374151" align="middle">Step 2: Change ÷ to ×  |  Step 3: Flip second</T>
      <line x1="20" y1="82" x2="260" y2="82" stroke="#E5E7EB" strokeWidth="1"/>
      <T x={70} y={100} size={22} color="#6D28D9" bold align="middle">2/3</T>
      <T x={110} y={100} size={18} color="#374151" align="middle">÷</T>
      <T x={150} y={100} size={22} color="#374151" bold align="middle">4/5</T>
      <T x={185} y={100} size={14} color="#374151" align="middle">→</T>
      <T x={70} y={130} size={22} color="#6D28D9" bold align="middle">2/3</T>
      <T x={110} y={130} size={18} color="#374151" align="middle">×</T>
      <T x={150} y={130} size={22} color="#059669" bold align="middle">5/4</T>
      <T x={195} y={130} size={16} color="#374151" align="middle">= 10/12</T>
      <T x={140} y={158} size={8} color="#64748B" align="middle">Simplify: 10/12 = 5/6</T>
    </svg>
  );
}

function CbseMath8FractionWordProbs() {
  return (
    <svg viewBox="0 0 280 180" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={11} color="#F5F5F7" bold align="middle">Fraction Word Problems</T>
      <rect x="20" y="38" width="240" height="40" rx="6" fill="#FFF7ED"/>
      <T x={140} y={54} size={9} color="#92400E" align="middle">Riya has 3/4 kg of sugar. She uses</T>
      <T x={140} y={68} size={9} color="#92400E" align="middle">2/3 of it. How much is left?</T>
      <T x={30} y={96} size={9} color="#374151" align="middle">Used: 3/4 × 2/3 = 6/12 = 1/2 kg</T>
      <T x={30} y={112} size={9} color="#374151" align="middle">Left: 3/4 − 1/2 = 3/4 − 2/4 = 1/4 kg</T>
      <rect x="20" y="124" width="240" height="28" rx="5" fill="#DCFCE7"/>
      <T x={140} y={136} size={9} color="#166534" bold align="middle">Strategy: of → multiply</T>
      <T x={140} y={150} size={9} color="#166534" align="middle">Convert to common denom before add/sub</T>
    </svg>
  );
}

// ── CBSE Math 8 — Ch9: Pythagoras ────────────────────────────────────────────
function CbseMath8RightTriangles() {
  return (
    <svg viewBox="0 0 280 180" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={11} color="#F5F5F7" bold align="middle">Right-Angled Triangles</T>
      <polygon points="60,160 200,160 60,60" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2"/>
      <rect x="60" y="148" width="14" height="12" fill="none" stroke="#3B82F6" strokeWidth="1.5"/>
      <T x={50} y={110} size={10} color="#1E40AF" bold align="middle">a</T>
      <T x={130} y={170} size={10} color="#1E40AF" bold align="middle">b</T>
      <T x={140} y={100} size={10} color="#DC2626" bold align="middle">c</T>
      <T x={220} y={108} size={9} color="#374151" align="middle">c = hypotenuse</T>
      <T x={220} y={122} size={9} color="#374151" align="middle">(longest side)</T>
      <T x={220} y={138} size={9} color="#374151" align="middle">a, b = legs</T>
      <T x={140} y={155} size={9} color="#64748B" align="middle">Right angle (90°) is opposite hypotenuse</T>
    </svg>
  );
}

function CbseMath8PythagorasThm() {
  return (
    <svg viewBox="0 0 280 190" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={11} color="#F5F5F7" bold align="middle">Pythagoras' Theorem</T>
      <polygon points="70,155 130,155 70,95" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2"/>
      <rect x="70" y="143" width="12" height="12" fill="none" stroke="#3B82F6" strokeWidth="1.5"/>
      <rect x="10" y="95" width="60" height="60" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1.5"/>
      <T x={40} y={129} size={9} color="#DC2626" bold align="middle">a²</T>
      <rect x="70" y="155" width="60" height="60" fill="#DCFCE7" stroke="#22C55E" strokeWidth="1.5"/>
      <T x={100} y={189} size={9} color="#166534" bold align="middle">b²</T>
      <rect x="130" y="69" width="86" height="86" fill="#FEF9C3" stroke="#EAB308" strokeWidth="1.5" transform="rotate(-45 173 112)"/>
      <T x={180} y={112} size={9} color="#92400E" bold align="middle">c²</T>
      <T x={140} y={50} size={11} color="#DC2626" bold align="middle">a² + b² = c²</T>
    </svg>
  );
}

function CbseMath8ApplyingPythagoras() {
  return (
    <svg viewBox="0 0 280 180" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={11} color="#F5F5F7" bold align="middle">Applying Pythagoras</T>
      <rect x="60" y="60" width="14" height="90" rx="3" fill="#94A3B8"/>
      <line x1="74" y1="150" x2="190" y2="150" stroke="#374151" strokeWidth="2"/>
      <line x1="74" y1="60" x2="190" y2="150" stroke="#DC2626" strokeWidth="2.5"/>
      <rect x="74" y="138" width="12" height="12" fill="none" stroke="#374151" strokeWidth="1.5"/>
      <T x={50} y={106} size={9} color="#1E40AF" bold align="middle">wall</T>
      <T x={50} y={120} size={9} color="#1E40AF" align="middle">= a</T>
      <T x={132} y={163} size={9} color="#374151" bold align="middle">ground = b</T>
      <T x={155} y={100} size={9} color="#DC2626" bold align="middle">ladder</T>
      <T x={155} y={114} size={9} color="#DC2626" align="middle">= c</T>
      <T x={140} y={50} size={9} color="#374151" align="middle">c = √(a² + b²)</T>
    </svg>
  );
}

function CbseMath8DistanceOnGrid() {
  return (
    <svg viewBox="0 0 280 190" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={11} color="#F5F5F7" bold align="middle">Distance on a Grid</T>
      {[0,1,2,3,4,5].map(i=><line key={`gv${i}`} x1={50+i*36} y1="40" x2={50+i*36} y2="172" stroke="#E5E7EB" strokeWidth="1"/>)}
      {[0,1,2,3,4].map(i=><line key={`gh${i}`} x1="50" y1={40+i*33} x2="230" y2={40+i*33} stroke="#E5E7EB" strokeWidth="1"/>)}
      <line x1="50" y1="40" x2="50" y2="172" stroke="#9CA3AF" strokeWidth="1.5"/>
      <line x1="50" y1="172" x2="230" y2="172" stroke="#9CA3AF" strokeWidth="1.5"/>
      <circle cx="86" cy="139" r="5" fill="#3B82F6"/>
      <circle cx="194" cy="73" r="5" fill="#DC2626"/>
      <line x1="86" y1="139" x2="194" y2="73" stroke="#7C3AED" strokeWidth="2" strokeDasharray="4,3"/>
      <line x1="86" y1="139" x2="194" y2="139" stroke="#374151" strokeWidth="1.5" strokeDasharray="3,2"/>
      <line x1="194" y1="139" x2="194" y2="73" stroke="#374151" strokeWidth="1.5" strokeDasharray="3,2"/>
      <T x={140} y={152} size={8} color="#374151" align="middle">Δx = 3</T>
      <T x={210} y={106} size={8} color="#374151" align="middle">Δy=2</T>
      <T x={140} y={58} size={9} color="#7C3AED" bold align="middle">d = √(Δx² + Δy²) = √13</T>
    </svg>
  );
}

// ── CBSE Math 8 — Ch10: Proportions & Variation ──────────────────────────────
function CbseMath8SolvingProportions() {
  return (
    <svg viewBox="0 0 280 180" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={11} color="#F5F5F7" bold align="middle">Solving Proportions</T>
      <T x={140} y={50} size={12} color="#1E40AF" bold align="middle">a/b = c/d</T>
      <T x={140} y={68} size={10} color="#374151" align="middle">⟹  a × d = b × c  (cross-multiply)</T>
      <line x1="20" y1="78" x2="260" y2="78" stroke="#E5E7EB" strokeWidth="1"/>
      <rect x="20" y="88" width="240" height="44" rx="6" fill="#F0FDF4"/>
      <T x={140} y={106} size={10} color="#166534" bold align="middle">Example: x/6 = 4/8</T>
      <T x={140} y={122} size={9} color="#374151" align="middle">8x = 24  →  x = 3</T>
      <rect x="20" y="140" width="240" height="28" rx="5" fill="#EFF6FF"/>
      <T x={140} y={152} size={9} color="#1E40AF" bold align="middle">Proportion: equal ratios</T>
      <T x={140} y={163} size={8} color="#64748B" align="middle">a : b :: c : d  ⟹  product of means = product of extremes</T>
    </svg>
  );
}

function CbseMath8ScaleDrawings() {
  return (
    <svg viewBox="0 0 280 180" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={11} color="#F5F5F7" bold align="middle">Scale Drawings and Maps</T>
      <rect x="20" y="38" width="100" height="70" rx="4" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5"/>
      <T x={70} y={58} size={8} color="#1E40AF" bold align="middle">Map</T>
      <T x={70} y={74} size={9} color="#374151" align="middle">5 cm</T>
      <line x1="30" y1="90" x2="110" y2="90" stroke="#3B82F6" strokeWidth="2"/>
      <T x={70} y={104} size={8} color="#64748B" align="middle">on paper</T>
      <rect x="140" y="38" width="130" height="70" rx="4" fill="#DCFCE7" stroke="#22C55E" strokeWidth="1.5"/>
      <T x={205} y={58} size={8} color="#166534" bold align="middle">Real World</T>
      <T x={205} y={74} size={9} color="#374151" align="middle">50 km</T>
      <line x1="150" y1="90" x2="260" y2="90" stroke="#22C55E" strokeWidth="2"/>
      <T x={205} y={104} size={8} color="#64748B" align="middle">actual distance</T>
      <T x={140} y={128} size={10} color="#7C3AED" bold align="middle">Scale = 1 : 10 00 000</T>
      <T x={140} y={148} size={9} color="#374151" align="middle">Real dist = map dist × scale factor</T>
      <T x={140} y={163} size={8} color="#64748B" align="middle">5 cm × 10 km/cm = 50 km</T>
    </svg>
  );
}

function CbseMath8SimilarFigures() {
  return (
    <svg viewBox="0 0 280 180" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={11} color="#F5F5F7" bold align="middle">Similar Figures</T>
      <polygon points="30,160 90,160 30,80" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2"/>
      <T x={20} y={76} size={8} color="#1E40AF" align="middle">A</T>
      <T x={20} y={165} size={8} color="#1E40AF" align="middle">B</T>
      <T x={92} y={165} size={8} color="#1E40AF" align="middle">C</T>
      <polygon points="120,160 220,160 120,60" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2"/>
      <T x={108} y={56} size={8} color="#92400E" align="middle">P</T>
      <T x={108} y={165} size={8} color="#92400E" align="middle">Q</T>
      <T x={223} y={165} size={8} color="#92400E" align="middle">R</T>
      <T x={140} y={50} size={9} color="#7C3AED" bold align="middle">∠A=∠P, ∠B=∠Q, ∠C=∠R</T>
      <T x={140} y={64} size={9} color="#374151" align="middle">AB/PQ = BC/QR = CA/RP = k</T>
    </svg>
  );
}

function CbseMath8DirectInverse() {
  return (
    <svg viewBox="0 0 280 180" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={11} color="#F5F5F7" bold align="middle">Direct and Inverse Variation</T>
      <rect x="16" y="36" width="120" height="130" rx="6" fill="#EFF6FF"/>
      <T x={76} y={52} size={9} color="#1E40AF" bold align="middle">Direct (y = kx)</T>
      <line x1="26" y1="150" x2="26" y2="62" stroke="#94A3B8" strokeWidth="1.5"/>
      <line x1="26" y1="150" x2="128" y2="150" stroke="#94A3B8" strokeWidth="1.5"/>
      <line x1="30" y1="146" x2="120" y2="70" stroke="#3B82F6" strokeWidth="2"/>
      <T x={76} y={162} size={8} color="#374151" align="middle">↑x → ↑y</T>
      <rect x="144" y="36" width="120" height="130" rx="6" fill="#FFF7ED"/>
      <T x={204} y={52} size={9} color="#92400E" bold align="middle">Inverse (y = k/x)</T>
      <line x1="154" y1="150" x2="154" y2="62" stroke="#94A3B8" strokeWidth="1.5"/>
      <line x1="154" y1="150" x2="256" y2="150" stroke="#94A3B8" strokeWidth="1.5"/>
      <path d="M158 70 Q170 80 185 100 Q200 120 250 148" fill="none" stroke="#F59E0B" strokeWidth="2"/>
      <T x={204} y={162} size={8} color="#374151" align="middle">↑x → ↓y</T>
    </svg>
  );
}

// ── CBSE Math 8 — Ch11: Polygons and Symmetry ────────────────────────────────
function CbseMath8InteriorAnglesPolygon() {
  return (
    <svg viewBox="0 0 280 190" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={11} color="#F5F5F7" bold align="middle">Interior Angles of Polygon</T>
      <polygon points="140,44 196,82 176,148 104,148 84,82" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2"/>
      <T x={140} y={40} size={8} color="#1E40AF" align="middle">108°</T>
      <T x={204} y={86} size={8} color="#1E40AF" align="middle">108°</T>
      <T x={182} y={158} size={8} color="#1E40AF" align="middle">108°</T>
      <T x={88} y={158} size={8} color="#1E40AF" align="middle">108°</T>
      <T x={72} y={86} size={8} color="#1E40AF" align="middle">108°</T>
      <rect x="20" y="162" width="240" height="24" rx="5" fill="#F0FDF4"/>
      <T x={140} y={172} size={9} color="#166534" bold align="middle">Sum = (n − 2) × 180°</T>
      <T x={140} y={183} size={8} color="#374151" align="middle">Pentagon: (5−2)×180 = 540°  |  Each = 108°</T>
    </svg>
  );
}

function CbseMath8ClassifyingPolygons() {
  return (
    <svg viewBox="0 0 280 190" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={11} color="#F5F5F7" bold align="middle">Classifying Polygons</T>
      <rect x="16" y="36" width="58" height="58" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2"/>
      <T x={45} y={100} size={8} color="#1E40AF" align="middle">Square (4)</T>
      <polygon points="92,36 120,94 64,94" fill="#DCFCE7" stroke="#22C55E" strokeWidth="2"/>
      <T x={92} y={106} size={8} color="#166534" align="middle">Triangle (3)</T>
      <polygon points="155,36 185,36 200,65 185,94 155,94 140,65" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2"/>
      <T x={170} y={106} size={8} color="#92400E" align="middle">Hexagon (6)</T>
      <polygon points="230,36 260,60 250,94 210,94 200,60" fill="#FEE2E2" stroke="#EF4444" strokeWidth="2"/>
      <T x={230} y={106} size={8} color="#DC2626" align="middle">Pentagon (5)</T>
      <rect x="16" y="116" width="248" height="60" rx="5" fill="#F8FAFC"/>
      <T x={140} y={132} size={9} color="#374151" bold align="middle">Regular: all sides equal, all angles equal</T>
      <T x={140} y={148} size={8} color="#64748B" align="middle">Irregular: sides/angles differ</T>
      <T x={140} y={164} size={8} color="#64748B" align="middle">Convex: all interior angles &lt; 180°</T>
    </svg>
  );
}

function CbseMath8TypesOfSymmetry() {
  return (
    <svg viewBox="0 0 280 190" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={11} color="#F5F5F7" bold align="middle">Types of Symmetry</T>
      <rect x="16" y="36" width="118" height="140" rx="6" fill="#EFF6FF"/>
      <T x={75} y={52} size={9} color="#1E40AF" bold align="middle">Line Symmetry</T>
      <polygon points="75,68 105,120 75,120" fill="#BFDBFE" stroke="#3B82F6" strokeWidth="1.5"/>
      <polygon points="75,68 45,120 75,120" fill="#BFDBFE" stroke="#3B82F6" strokeWidth="1.5"/>
      <line x1="75" y1="62" x2="75" y2="128" stroke="#DC2626" strokeWidth="1.5" strokeDasharray="4,3"/>
      <T x={75} y={140} size={8} color="#374151" align="middle">Mirror image about</T>
      <T x={75} y={152} size={8} color="#374151" align="middle">the axis of symmetry</T>
      <rect x="146" y="36" width="118" height="140" rx="6" fill="#FFF7ED"/>
      <T x={205} y={52} size={9} color="#92400E" bold align="middle">Rotational Sym.</T>
      <polygon points="205,70 220,100 205,90 190,100" fill="#FED7AA" stroke="#F59E0B" strokeWidth="1.5"/>
      <polygon points="205,70 220,100 205,90 190,100" fill="#FED7AA" stroke="#F59E0B" strokeWidth="1.5" transform="rotate(120 205 90)"/>
      <polygon points="205,70 220,100 205,90 190,100" fill="#FED7AA" stroke="#F59E0B" strokeWidth="1.5" transform="rotate(240 205 90)"/>
      <T x={205} y={140} size={8} color="#374151" align="middle">Order 3 — looks same</T>
      <T x={205} y={152} size={8} color="#374151" align="middle">after 120° rotation</T>
    </svg>
  );
}

function CbseMath8GeomTransformations() {
  return (
    <svg viewBox="0 0 280 190" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={11} color="#F5F5F7" bold align="middle">Geometric Transformations</T>
      <rect x="14" y="34" width="78" height="70" rx="5" fill="#EFF6FF"/>
      <T x={53} y={46} size={8} color="#1E40AF" bold align="middle">Translation</T>
      <polygon points="24,88 44,60 64,88" fill="#BFDBFE" stroke="#3B82F6" strokeWidth="1.5"/>
      <polygon points="50,95 70,67 90,95" fill="#3B82F6" stroke="#1E40AF" strokeWidth="1.5" opacity="0.7"/>
      <line x1="34" y1="74" x2="60" y2="81" stroke="#DC2626" strokeWidth="1" strokeDasharray="3,2"/>
      <rect x="100" y="34" width="78" height="70" rx="5" fill="#F0FDF4"/>
      <T x={139} y={46} size={8} color="#166534" bold align="middle">Reflection</T>
      <polygon points="108,88 128,60 148,88" fill="#BBF7D0" stroke="#22C55E" strokeWidth="1.5"/>
      <line x1="139" y1="36" x2="139" y2="100" stroke="#DC2626" strokeWidth="1.5" strokeDasharray="3,2"/>
      <polygon points="170,88 150,60 130,88" fill="#22C55E" stroke="#166534" strokeWidth="1.5" opacity="0.7"/>
      <rect x="186" y="34" width="78" height="70" rx="5" fill="#FFF7ED"/>
      <T x={225} y={46} size={8} color="#92400E" bold align="middle">Rotation</T>
      <polygon points="196,88 216,60 236,88" fill="#FED7AA" stroke="#F59E0B" strokeWidth="1.5"/>
      <polygon points="196,88 216,60 236,88" fill="#F59E0B" stroke="#92400E" strokeWidth="1.5" opacity="0.7" transform="rotate(45 216 74)"/>
      <T x={140} y={120} size={8} color="#374151" bold align="middle">Isometries — shape and size preserved</T>
      <T x={140} y={135} size={8} color="#64748B" align="middle">Translation: slide  |  Reflection: flip</T>
      <T x={140} y={150} size={8} color="#64748B" align="middle">Rotation: turn about a fixed point</T>
    </svg>
  );
}

// ── CBSE Math 8 — Ch12: Graphs ───────────────────────────────────────────────
function CbseMath8GraphsNetworks() {
  return (
    <svg viewBox="0 0 280 190" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={11} color="#F5F5F7" bold align="middle">Graphs and Data</T>
      <line x1="30" y1="40" x2="30" y2="170" stroke="#374151" strokeWidth="2"/>
      <line x1="30" y1="170" x2="260" y2="170" stroke="#374151" strokeWidth="2"/>
      {[["Mon",50,110],["Tue",70,90],["Wed",60,100],["Thu",85,75],["Fri",40,120]].map(([d,h,y],i)=>(
        <g key={d}>
          <rect x={40+i*42} y={y} width="28" height={170-y} fill="#3B82F6" rx="3" opacity="0.8"/>
          <T x={54+i*42} y={183} size={7} color="#374151" align="middle">{d}</T>
        </g>
      ))}
      <T x={18} y={50} size={7} color="#374151" align="middle">100</T>
      <T x={18} y={90} size={7} color="#374151" align="middle">60</T>
      <T x={18} y={130} size={7} color="#374151" align="middle">20</T>
      <T x={140} y={40} size={9} color="#1E40AF" bold align="middle">Bar Chart — Weekly Data</T>
    </svg>
  );
}

function CbseMath8PathsInGraphs() {
  return (
    <svg viewBox="0 0 280 190" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={11} color="#F5F5F7" bold align="middle">Coordinate Graphs</T>
      <line x1="40" y1="40" x2="40" y2="175" stroke="#374151" strokeWidth="2"/>
      <line x1="40" y1="175" x2="265" y2="175" stroke="#374151" strokeWidth="2"/>
      {[0,1,2,3,4].map(i=>(
        <g key={i}>
          <line x1={40+i*44} y1="170" x2={40+i*44} y2="180" stroke="#374151" strokeWidth="1.5"/>
          <T x={40+i*44} y={186} size={7} color="#374151" align="middle">{i}</T>
          <line x1="35" y1={175-i*28} x2="45" y2={175-i*28} stroke="#374151" strokeWidth="1.5"/>
          <T x={30} y={178-i*28} size={7} color="#374151" align="middle">{i}</T>
        </g>
      ))}
      <line x1="40" y1="175" x2="216" y2="63" stroke="#3B82F6" strokeWidth="2.5"/>
      {[[0,0],[1,1],[2,2],[3,3],[4,4]].map(([x,y])=>(
        <circle key={x} cx={40+x*44} cy={175-y*28} r="4" fill="#DC2626"/>
      ))}
      <T x={180} y={56} size={9} color="#1E40AF" bold align="middle">y = x</T>
      <T x={140} y={50} size={8} color="#374151" align="middle">Linear relationship — straight line</T>
    </svg>
  );
}

function CbseMath8EulerPaths() {
  return (
    <svg viewBox="0 0 280 190" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={11} color="#F5F5F7" bold align="middle">Linear Graphs and Applications</T>
      <line x1="40" y1="40" x2="40" y2="170" stroke="#374151" strokeWidth="2"/>
      <line x1="40" y1="170" x2="260" y2="170" stroke="#374151" strokeWidth="2"/>
      {[0,1,2,3,4].map(i=>(
        <g key={i}>
          <line x1={40+i*44} y1="165" x2={40+i*44} y2="175" stroke="#374151" strokeWidth="1"/>
          <T x={40+i*44} y={183} size={7} color="#374151" align="middle">{i}</T>
        </g>
      ))}
      <line x1="40" y1="162" x2="216" y2="78" stroke="#7C3AED" strokeWidth="2.5"/>
      <T x={230} y={76} size={9} color="#7C3AED" bold align="middle">y=2x+2</T>
      <circle cx="40" cy="162" r="4" fill="#7C3AED"/>
      <circle cx="128" cy="120" r="4" fill="#7C3AED"/>
      <T x={50} y={156} size={8} color="#374151" align="middle">(0,2)</T>
      <T x={138} y={114} size={8} color="#374151" align="middle">(2,6)</T>
      <T x={140} y={50} size={9} color="#374151" bold align="middle">y = mx + c  (slope m, y-intercept c)</T>
      <T x={140} y={64} size={8} color="#64748B" align="middle">m = rise/run = Δy/Δx</T>
    </svg>
  );
}

function CbseMath8TreesInGraphs() {
  return (
    <svg viewBox="0 0 280 190" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={11} color="#F5F5F7" bold align="middle">Reading and Interpreting Graphs</T>
      <rect x="16" y="36" width="118" height="130" rx="6" fill="#EFF6FF"/>
      <T x={75} y={52} size={8} color="#1E40AF" bold align="middle">Pie Chart</T>
      <circle cx="75" cy="100" r="42" fill="none" stroke="#E5E7EB" strokeWidth="1"/>
      <path d="M75 100 L75 58 A42 42 0 0 1 111 79 Z" fill="#3B82F6"/>
      <path d="M75 100 L111 79 A42 42 0 0 1 100 140 Z" fill="#22C55E"/>
      <path d="M75 100 L100 140 A42 42 0 0 1 50 140 Z" fill="#F59E0B"/>
      <path d="M75 100 L50 140 A42 42 0 0 1 75 58 Z" fill="#EF4444"/>
      <T x={75} y={158} size={7} color="#374151" align="middle">Shows parts of a whole (360°)</T>
      <rect x="146" y="36" width="118" height="130" rx="6" fill="#FFF7ED"/>
      <T x={205} y={52} size={8} color="#92400E" bold align="middle">Line Graph</T>
      <line x1="156" y1="156" x2="256" y2="156" stroke="#374151" strokeWidth="1.5"/>
      <line x1="156" y1="60" x2="156" y2="156" stroke="#374151" strokeWidth="1.5"/>
      <polyline points="166,140 186,120 206,100 226,80 246,90" fill="none" stroke="#F59E0B" strokeWidth="2"/>
      {[[166,140],[186,120],[206,100],[226,80],[246,90]].map(([x,y])=>(
        <circle key={x} cx={x} cy={y} r="3" fill="#92400E"/>
      ))}
      <T x={205} y={170} size={7} color="#374151" align="middle">Shows trends over time</T>
    </svg>
  );
}

// ── CBSE Math 8 — Ch13: Algebra ──────────────────────────────────────────────
function CbseMath8AlgebraicExpressions() {
  return (
    <svg viewBox="0 0 280 180" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={11} color="#F5F5F7" bold align="middle">Algebraic Expressions</T>
      <rect x="20" y="38" width="240" height="36" rx="6" fill="#F5F3FF"/>
      <T x={140} y={54} size={13} color="#6D28D9" bold align="middle">3x² + 5x − 7</T>
      <T x={140} y={68} size={8} color="#7C3AED" align="middle">↑ three terms (polynomial)</T>
      <rect x="20" y="84" width="72" height="56" rx="5" fill="#DBEAFE"/>
      <T x={56} y={100} size={8} color="#1E40AF" bold align="middle">Coefficient</T>
      <T x={56} y={114} size={9} color="#374151" align="middle">3 in 3x²</T>
      <T x={56} y={128} size={8} color="#64748B" align="middle">multiplies var</T>
      <rect x="104" y="84" width="72" height="56" rx="5" fill="#DCFCE7"/>
      <T x={140} y={100} size={8} color="#166534" bold align="middle">Variable</T>
      <T x={140} y={114} size={9} color="#374151" align="middle">x — unknown</T>
      <T x={140} y={128} size={8} color="#64748B" align="middle">value to find</T>
      <rect x="188" y="84" width="72" height="56" rx="5" fill="#FEF3C7"/>
      <T x={224} y={100} size={8} color="#92400E" bold align="middle">Constant</T>
      <T x={224} y={114} size={9} color="#374151" align="middle">−7 (fixed)</T>
      <T x={224} y={128} size={8} color="#64748B" align="middle">no variable</T>
      <T x={140} y={158} size={8} color="#64748B" align="middle">Degree = highest power of variable</T>
    </svg>
  );
}

function CbseMath8LinearEquations() {
  return (
    <svg viewBox="0 0 280 190" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={11} color="#F5F5F7" bold align="middle">Linear Equations</T>
      <line x1="140" y1="36" x2="140" y2="120" stroke="#94A3B8" strokeWidth="1"/>
      <rect x="30" y="36" width="96" height="84" rx="6" fill="#EFF6FF"/>
      <T x={78} y={56} size={10} color="#1E40AF" bold align="middle">LHS</T>
      <T x={78} y={76} size={14} color="#374151" bold align="middle">2x+3</T>
      <circle cx="78" cy="100" r="12" fill="#DBEAFE"/>
      <T x={78} y={104} size={10} color="#1E40AF" bold align="middle">⚖</T>
      <rect x="154" y="36" width="96" height="84" rx="6" fill="#FFF7ED"/>
      <T x={202} y={56} size={10} color="#92400E" bold align="middle">RHS</T>
      <T x={202} y={76} size={14} color="#374151" bold align="middle">11</T>
      <circle cx="202" cy="100" r="12" fill="#FED7AA"/>
      <T x={202} y={104} size={10} color="#92400E" bold align="middle">⚖</T>
      <rect x="20" y="128" width="240" height="50" rx="5" fill="#F0FDF4"/>
      <T x={140} y={144} size={9} color="#166534" bold align="middle">Solve: 2x + 3 = 11</T>
      <T x={140} y={160} size={9} color="#374151" align="middle">2x = 8  (subtract 3 both sides)</T>
      <T x={140} y={175} size={9} color="#374151" align="middle">x = 4  (divide both sides by 2)</T>
    </svg>
  );
}

function CbseMath8LinearInequalities() {
  return (
    <svg viewBox="0 0 280 180" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={11} color="#F5F5F7" bold align="middle">Introduction to Inequalities</T>
      <T x={140} y={50} size={12} color="#1E40AF" bold align="middle">x &lt; 5</T>
      <line x1="30" y1="80" x2="250" y2="80" stroke="#374151" strokeWidth="2"/>
      {[-2,-1,0,1,2,3,4,5,6,7].map((v,i)=>(
        <g key={v}>
          <line x1={50+i*20} y1="75" x2={50+i*20} y2="85" stroke="#374151" strokeWidth="1.5"/>
          <T x={50+i*20} y={96} size={7} color="#374151" align="middle">{v}</T>
        </g>
      ))}
      <line x1="50" y1="80" x2="148" y2="80" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round"/>
      <circle cx="148" cy="80" r="5" fill="white" stroke="#3B82F6" strokeWidth="2.5"/>
      <T x={80} y={70} size={8} color="#3B82F6" bold align="middle">solution region</T>
      <T x={148} y={68} size={8} color="#DC2626" align="middle">open circle: 5 excluded</T>
      <rect x="20" y="108" width="240" height="50" rx="5" fill="#F5F3FF"/>
      <T x={140} y={124} size={9} color="#6D28D9" bold align="middle">Rules for Inequalities</T>
      <T x={140} y={140} size={8} color="#374151" align="middle">Add/subtract → direction unchanged</T>
      <T x={140} y={154} size={8} color="#DC2626" align="middle">Multiply/divide by negative → flip sign!</T>
    </svg>
  );
}

function CbseMath8AlgebraicIdentities() {
  return (
    <svg viewBox="0 0 280 190" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={11} color="#F5F5F7" bold align="middle">Algebraic Identities</T>
      <rect x="20" y="36" width="80" height="80" rx="4" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5"/>
      <T x={60} y={80} size={14} color="#1E40AF" bold align="middle">a²</T>
      <rect x="100" y="36" width="48" height="80" rx="4" fill="#BBF7D0" stroke="#22C55E" strokeWidth="1.5"/>
      <T x={124} y={80} size={11} color="#166534" bold align="middle">ab</T>
      <rect x="148" y="36" width="48" height="80" rx="4" fill="#BBF7D0" stroke="#22C55E" strokeWidth="1.5"/>
      <T x={172} y={80} size={11} color="#166534" bold align="middle">ab</T>
      <rect x="196" y="36" width="64" height="80" rx="4" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5"/>
      <T x={228} y={80} size={14} color="#92400E" bold align="middle">b²</T>
      <T x={140} y={132} size={11} color="#DC2626" bold align="middle">(a+b)² = a²+2ab+b²</T>
      <T x={140} y={150} size={9} color="#374151" align="middle">(a−b)² = a²−2ab+b²</T>
      <T x={140} y={165} size={9} color="#374151" align="middle">(a+b)(a−b) = a²−b²</T>
      <T x={140} y={180} size={8} color="#64748B" align="middle">Use to expand or factorise quickly</T>
    </svg>
  );
}

// ── CBSE Math 8 — Ch14: Area and Perimeter ───────────────────────────────────
function CbseMath8AreaRectangle() {
  return (
    <svg viewBox="0 0 280 180" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={11} color="#F5F5F7" bold align="middle">Area of Rectangle / Square</T>
      <rect x="40" y="44" width="160" height="90" rx="4" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2"/>
      <line x1="40" y1="138" x2="200" y2="138" stroke="#374151" strokeWidth="1.5"/>
      <line x1="200" y1="44" x2="200" y2="138" stroke="#374151" strokeWidth="1.5"/>
      <T x={120} y={94} size={12} color="#1E40AF" bold align="middle">l × w</T>
      <T x={120} y={152} size={10} color="#374151" bold align="middle">l = 8 cm</T>
      <T x={215} y={94} size={9} color="#374151" align="middle">w = 5</T>
      <rect x="20" y="158" width="240" height="18" rx="4" fill="#DCFCE7"/>
      <T x={140} y={170} size={9} color="#166534" bold align="middle">Area = l × w  |  Perimeter = 2(l + w)</T>
    </svg>
  );
}

function CbseMath8AreaTriangle() {
  return (
    <svg viewBox="0 0 280 180" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={11} color="#F5F5F7" bold align="middle">Area of a Triangle</T>
      <polygon points="60,150 220,150 100,60" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2"/>
      <line x1="100" y1="60" x2="100" y2="150" stroke="#DC2626" strokeWidth="1.5" strokeDasharray="4,3"/>
      <rect x="100" y="138" width="12" height="12" fill="none" stroke="#DC2626" strokeWidth="1.5"/>
      <T x={136} y={168} size={10} color="#374151" bold align="middle">base (b)</T>
      <T x={82} y={106} size={10} color="#DC2626" bold align="middle">h</T>
      <rect x="20" y="152" width="240" height="24" rx="5" fill="#F0FDF4"/>
      <T x={140} y={164} size={10} color="#166534" bold align="middle">Area = ½ × base × height</T>
      <T x={140} y={172} size={8} color="#64748B" align="middle">Height must be perpendicular to base</T>
    </svg>
  );
}

function CbseMath8AreaTrapezium() {
  return (
    <svg viewBox="0 0 280 180" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={11} color="#F5F5F7" bold align="middle">Area of Trapezium</T>
      <polygon points="70,60 190,60 220,150 40,150" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2"/>
      <T x={130} y={52} size={9} color="#92400E" bold align="middle">a (parallel side)</T>
      <T x={130} y={164} size={9} color="#92400E" bold align="middle">b (parallel side)</T>
      <line x1="70" y1="60" x2="70" y2="150" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="4,3"/>
      <rect x="70" y="138" width="12" height="12" fill="none" stroke="#3B82F6" strokeWidth="1.5"/>
      <T x={55} y={108} size={9} color="#3B82F6" bold align="middle">h</T>
      <rect x="20" y="154" width="240" height="22" rx="5" fill="#DCFCE7"/>
      <T x={140} y={168} size={10} color="#166534" bold align="middle">Area = ½ × (a + b) × h</T>
    </svg>
  );
}

function CbseMath8AreaCircle() {
  return (
    <svg viewBox="0 0 280 180" style={{width:"100%",maxWidth:280,height:"auto"}}>
      <rect x="10" y="6" width="260" height="26" rx="6" fill="#1D1D1F"/>
      <T x={140} y={23} size={11} color="#F5F5F7" bold align="middle">Area and Circumference of Circle</T>
      <circle cx="140" cy="102" r="60" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2"/>
      <line x1="140" y1="102" x2="200" y2="102" stroke="#DC2626" strokeWidth="2"/>
      <circle cx="140" cy="102" r="3" fill="#DC2626"/>
      <T x={170} y={96} size={10} color="#DC2626" bold align="middle">r</T>
      <line x1="80" y1="102" x2="200" y2="102" stroke="#7C3AED" strokeWidth="1.5" strokeDasharray="4,3"/>
      <T x={140} y={128} size={8} color="#7C3AED" align="middle">diameter d = 2r</T>
      <rect x="20" y="154" width="240" height="22" rx="5" fill="#F0FDF4"/>
      <T x={140} y={164} size={9} color="#166534" bold align="middle">Area = πr²  |  Circumference = 2πr</T>
      <T x={140} y={173} size={7} color="#64748B" align="middle">π ≈ 3.14159  or use 22/7 for approximation</T>
    </svg>
  );
}

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
  // Math Ch1 — Real Numbers
  ch1_s1_c1_t1: { label: "Euclid's Division Lemma",                      Component: EuclidDivision },
  ch1_s2_c1_t1: { label: "Prime Factor Tree — 360 = 2³×3²×5",            Component: PrimeFactorTree },
  ch1_s2_c1_t2: { label: "HCF and LCM via Venn Diagram",                 Component: HcfLcm },
  ch1_s3_c1_t1: { label: "√2 is Irrational — Proof by Contradiction",    Component: IrrationalProof },
  ch1_s4_c1_t1: { label: "Terminating vs Recurring Decimals",             Component: DecimalExpansion },
  // Math Ch2 — Polynomials
  ch2_s1_c1_t1: { label: "Zeroes of a Polynomial — x-intercepts",        Component: PolynomialZeroes },
  ch2_s2_c1_t1: { label: "Zeroes and Coefficients — α+β, αβ",            Component: ZeroesCoefficients },
  ch2_s3_c1_t1: { label: "Division Algorithm for Polynomials",            Component: PolynomialDivision },
  ch2_s3_c1_t2: { label: "Remainder Theorem and Factor Theorem",          Component: RemainderFactor },
  ch2_s4_c1_t1: { label: "Cubic Polynomial — 3 Zeroes",                  Component: CubicPolynomial },
  // Math Ch3 — Pair of Linear Equations
  ch3_s1_c1_t1: { label: "Graphical Method — 3 Cases",                   Component: GraphicalLinear },
  ch3_s1_c1_t2: { label: "Substitution Method — Step by Step",           Component: SubstitutionMethod },
  ch3_s2_c1_t1: { label: "Elimination Method",                           Component: EliminationMethod },
  ch3_s3_c1_t1: { label: "Cross-Multiplication Method",                  Component: CrossMultiplication },
  ch3_s4_c1_t1: { label: "Reducible Equations — 1/x Substitution",       Component: ReducibleEquations },
  // Math Ch4 — Quadratic Equations
  ch4_s1_c1_t1: { label: "Quadratic Equation — Standard Form",           Component: QuadraticIntro },
  ch4_s1_c1_t2: { label: "Factorisation — Splitting Middle Term",        Component: Factorisation },
  ch4_s2_c1_t1: { label: "Completing the Square Method",                 Component: CompletingSquare },
  ch4_s3_c1_t1: { label: "Quadratic Formula — x = (−b ± √D) / 2a",      Component: QuadraticFormula },
  ch4_s4_c1_t1: { label: "Discriminant — Nature of Roots (D>0, D=0, D<0)", Component: Discriminant },
  // Math Ch5 — Arithmetic Progressions
  ch5_s1_c1_t1: { label: "Arithmetic Progression — Common Difference",   Component: ArithmeticProgression },
  ch5_s2_c1_t1: { label: "nth Term of AP — aₙ = a + (n−1)d",            Component: NthTermAP },
  ch5_s3_c1_t1: { label: "Sum of AP — Gauss Pairing Trick",              Component: SumAP },
  ch5_s4_c1_t1: { label: "AP Applications — Theatre Seating",            Component: APApplications },
  // Math Ch6 — Triangles
  ch6_s1_c1_t1: { label: "Similar Triangles — AA Criterion",             Component: SimilarFigures },
  ch6_s2_c1_t1: { label: "Basic Proportionality Theorem",                Component: BasicProportionality },
  ch6_s3_c1_t1: { label: "Similarity Criteria — AA, SAS, SSS",           Component: SimilarityCriteria },
  ch6_s5_c1_t1: { label: "Areas of Similar Triangles — ratio k²",        Component: AreaSimilarTriangles },
  ch6_s6_c1_t1: { label: "Pythagoras Theorem — a² + b² = c²",           Component: PythagorasTheorem },
  // Math Ch7 — Coordinate Geometry
  ch7_s1_c1_t1: { label: "Distance Formula — √[(x₂−x₁)²+(y₂−y₁)²]",   Component: DistanceFormula },
  ch7_s2_c1_t1: { label: "Section Formula — Internal Division m:n",      Component: SectionFormula },
  ch7_s3_c1_t1: { label: "Area of Triangle by Coordinates",             Component: TriangleAreaCoord },
  // Math Ch8 — Introduction to Trigonometry
  ch8_s1_c1_t1: { label: "Trigonometric Ratios — sin, cos, tan",         Component: TrigRatios },
  ch8_s2_c1_t1: { label: "Trig Ratios of Specific Angles — 0°–90°",     Component: TrigSpecificAngles },
  ch8_s3_c1_t1: { label: "Complementary Angles — sin(90°−θ)=cosθ",      Component: ComplementaryAngles },
  ch8_s4_c1_t1: { label: "Trigonometric Identities — 3 Pythagorean",    Component: TrigIdentities },
  // Math Ch9 — Some Applications of Trigonometry
  ch9_s1_c1_t1: { label: "Angle of Elevation — h = d·tan α",            Component: AngleOfElevation },
  ch9_s1_c1_t2: { label: "Angle of Depression — observer looks down",   Component: AngleOfDepression },
  // Math Ch10 — Circles
  ch10_s1_c1_t1: { label: "Tangent to a Circle — radius ⊥ tangent",     Component: TangentToCircle },
  ch10_s2_c1_t1: { label: "Tangents from External Point — PA = PB",     Component: TangentsFromExternal },
  // Math Ch11 — Areas Related to Circles
  ch11_s1_c1_t1: { label: "Circle Area & Perimeter — πr², 2πr",         Component: CircleAreaPerimeter },
  ch11_s2_c1_t1: { label: "Sector & Segment Areas — (θ/360)πr²",        Component: CombinationAreas },
  // Math Ch12 — Surface Areas and Volumes
  ch12_s1_c1_t1: { label: "Surface Area of Combined Solids",             Component: SurfaceAreaCombination },
  ch12_s2_c1_t1: { label: "Volume of Combined Solids",                   Component: VolumeCombination },
  ch12_s3_c1_t1: { label: "Conversion of Solids — Volume Conserved",    Component: ConversionSolid },
  // Math Ch13 — Statistics
  ch13_s1_c1_t1: { label: "Mean of Grouped Data — Σfx/Σf",              Component: MeanGrouped },
  ch13_s2_c1_t1: { label: "Mode of Grouped Data — Modal Class",          Component: ModeGrouped },
  ch13_s3_c1_t1: { label: "Median of Grouped Data — N/2 on Ogive",      Component: MedianGrouped },
  ch13_s4_c1_t1: { label: "Ogive — Cumulative Frequency Curve",          Component: Ogive },
  ch13_s5_c1_t1: { label: "Cumulative Frequency Table",                  Component: CumulativeFreq },
  // Math Ch14 — Probability
  ch14_s1_c1_t1: { label: "Probability — P(E) = n(E)/n(S)",              Component: ProbabilityBasic },
  ch14_s1_c1_t2: { label: "Classical Probability — equally likely",      Component: ClassicalProbability },
  ch14_s1_c1_t3: { label: "Complementary Events — P(E)+P(Ē)=1",         Component: ComplementaryEvents },
  ch14_s1_c1_t4: { label: "Probability Applications — bags & cards",    Component: ProbabilityApplications },
  // SST History
  sst_ch1_french_revolution:    { label: "French Revolution → Nationalism in Europe",      Component: FrenchRevolution },
  sst_ch1_nationalism_europe:   { label: "Romantic Nationalism and 1848 Revolutions",       Component: NationalismEurope },
  sst_ch1_unification:          { label: "Unification of Germany (1871) and Italy (1861)",  Component: GermanyItalyUnification },
  sst_ch1_visualising_nation:   { label: "Marianne and Germania — Nationalist Allegories",  Component: VisualisingNation },
  sst_ch2_non_cooperation:      { label: "Non-Cooperation Movement 1920–22",                Component: NonCooperation },
  sst_ch2_civil_disobedience:   { label: "Dandi Salt March 1930 — Civil Disobedience",      Component: CivilDisobedience },
  sst_ch2_collective_belonging: { label: "Symbols of Indian National Identity",             Component: CollectiveBelonging },
  sst_ch3_premodern_world:      { label: "Pre-modern Globalisation — Silk Routes",          Component: PremodernWorld },
  sst_ch3_interwar_economy:     { label: "Great Depression 1929 → Bretton Woods 1944",      Component: InterwarEconomy },
  sst_ch3_post_war:             { label: "Post-War Economic Order — IMF, World Bank, WTO",  Component: PostWar },
  sst_ch4_proto_industrialisation: { label: "Proto-Industrialisation — Putting-out System", Component: ProtoIndustrialisation },
  sst_ch4_factory_system:       { label: "Factory System — Steam, Discipline, Child Labour",Component: FactorySystem },
  sst_ch4_india_industrialisation: { label: "Industrialisation in India — Textile and Steel",Component: IndiaIndustrialisation },
  sst_ch5_print_revolution:     { label: "Gutenberg Press → Print Revolution",              Component: PrintRevolution },
  sst_ch5_india_print:          { label: "Print Culture in Colonial India",                 Component: IndiaPrint },
  // SST Geography
  sst_ch6_types_resources:      { label: "Types of Resources — Natural, Human, Renewable",  Component: TypesResources },
  sst_ch6_land_resources:       { label: "India's Land Use Pattern",                        Component: LandResources },
  sst_ch6_soil_types:           { label: "Soil Types of India — Alluvial to Laterite",      Component: SoilTypes },
  sst_ch7_forest_types:         { label: "India's Forest Classification — Reserved/Protected",Component: ForestTypes },
  sst_ch7_biodiversity:         { label: "Biodiversity and Food Chain",                     Component: Biodiversity },
  sst_ch7_conservation:         { label: "Conservation Strategies — Parks, JFM, Community", Component: Conservation },
  sst_ch8_water_scarcity:       { label: "Water Scarcity — Causes and Trends",              Component: WaterScarcity },
  sst_ch8_multipurpose_projects:{ label: "Multipurpose River Projects in India",            Component: MultipurposeProjects },
  sst_ch8_rainwater_harvesting: { label: "Rainwater Harvesting — Rooftop and Traditional",  Component: RainwaterHarvesting },
  sst_ch9_types_farming:        { label: "Types of Farming — Subsistence to Commercial",    Component: TypesFarming },
  sst_ch9_major_crops:          { label: "Major Crops and Their Regions in India",          Component: MajorCrops },
  sst_ch9_tech_reforms:         { label: "Green Revolution and Agricultural Reforms",       Component: TechReforms },
  sst_ch10_minerals:            { label: "Mineral Distribution in India",                   Component: Minerals },
  sst_ch10_energy_resources:    { label: "Conventional vs Non-conventional Energy",         Component: EnergyResources },
  sst_ch11_industries_types:    { label: "Classification of Industries",                    Component: IndustriesTypes },
  sst_ch11_textile_industry:    { label: "India's Textile Industry — Cotton, Jute, Silk",  Component: TextileIndustry },
  sst_ch11_environment:         { label: "Industrial Pollution and Control",                Component: IndustriesEnvironment },
  sst_ch12_transport:           { label: "Transport Networks of India",                     Component: Transport },
  sst_ch12_communication:       { label: "Communication — Personal and Mass Media",         Component: Communication },
  sst_ch12_international_trade: { label: "India's Foreign Trade — Exports, Imports, Ports", Component: InternationalTrade },
  // SST Economics
  sst_ch13_development_goals:  { label: "Development Goals — Per Capita Income vs HDI",      Component: DevelopmentGoals },
  sst_ch13_hdi:                { label: "HDI — Income, Education and Health Index",           Component: HDIIndex },
  sst_ch14_sectors:            { label: "Three Sectors — Primary, Secondary, Tertiary",       Component: ThreeSectors },
  sst_ch14_employment:         { label: "Organised vs Unorganised Sector",                    Component: SectorsEmployment },
  sst_ch14_services_sector:    { label: "Growth of Services Sector and IT Industry",          Component: ServicesSector },
  sst_ch15_money:              { label: "From Barter to Modern Money",                        Component: MoneyEvolution },
  sst_ch15_banking:            { label: "Banking — Credit Creation and RBI Regulation",       Component: BankingCredit },
  sst_ch15_credit:             { label: "Formal vs Informal Credit Sources",                  Component: CreditSources },
  sst_ch16_globalisation:      { label: "Globalisation — MNCs and Global Production",         Component: GlobalisationMNC },
  sst_ch16_impact:             { label: "India 1991 LPG Reforms — Impact of Liberalisation",  Component: LiberalisationImpact },
  sst_ch16_fair_globalisation: { label: "WTO, Trade Barriers, and Fair Globalisation",        Component: FairGlobalisation },
  sst_ch17_consumer_awareness: { label: "Consumer Exploitation and COPRA 1986",               Component: ConsumerAwareness },
  sst_ch17_consumer_rights:    { label: "Six Consumer Rights",                                Component: ConsumerRights },
  sst_ch17_consumer_protection:{ label: "3-tier Consumer Redressal Forum",                    Component: ConsumerProtection },
  // SST Political Science
  sst_ch18_power_sharing:      { label: "Belgium vs Sri Lanka — Power Sharing",               Component: PowerSharingCase },
  sst_ch18_forms:              { label: "Four Forms of Power Sharing",                        Component: PowerSharingForms },
  sst_ch19_federalism:         { label: "Federalism — Union, State and Concurrent Lists",     Component: FederalismLists },
  sst_ch19_how_it_works:       { label: "India's Federal Structure — Holding Together",       Component: FederalismIndia },
  sst_ch19_decentralisation:   { label: "73rd/74th Amendment — 3-tier Panchayati Raj",       Component: Decentralisation },
  sst_ch20_social_differences: { label: "Overlapping vs Cross-cutting Social Divisions",      Component: SocialDivisions },
  sst_ch20_politics_division:  { label: "Three Factors — Outcomes of Social Division",        Component: PoliticsDivisions },
  sst_ch21_gender:             { label: "Gender Division — Patriarchy and Women in Politics",  Component: GenderPolitics },
  sst_ch21_religion_politics:  { label: "Secularism vs Communalism",                          Component: ReligionPolitics },
  sst_ch21_caste:              { label: "Caste and OBC Reservations — Mandal Commission",     Component: CastePolitics },
  sst_ch22_struggles:          { label: "Bolivia Water War 2000 — Popular Struggles",         Component: PopularStruggles },
  sst_ch22_movements:          { label: "Pressure Groups vs Political Parties",               Component: PressureGroups },

  // ── ICSE Math 10 ────────────────────────────────────────────────
  // Ch4 — Linear Inequations
  icse_math10_ch4_ineq_number_line: { label: "Number Line — Inequations",                    Component: IcseNumberLine },
  icse_math10_ch4_ineq_basics:      { label: "Number Line — Inequation Basics",              Component: IcseNumberLine },
  icse_math10_ch4_ineq_solving:     { label: "Number Line — Solving Inequations",            Component: IcseNumberLine },
  icse_math10_ch4_ineq_combined:    { label: "Number Line — Combined Inequations",           Component: IcseNumberLine },
  // Ch10 — Arithmetic Progression
  icse_math10_ch10_ap_basics:       { label: "AP — Sequence & Common Difference",            Component: IcseAPSequence },
  icse_math10_ch10_ap_nth_term:     { label: "AP — nth Term Formula",                        Component: IcseAPSequence },
  icse_math10_ch10_ap_sum:          { label: "AP — Sum of n Terms",                          Component: IcseAPSequence },
  icse_math10_ch10_ap_problems:     { label: "AP — Word Problems",                           Component: IcseAPSequence },
  // Ch11 — Geometric Progression
  icse_math10_ch11_gp_basics:       { label: "GP — Sequence & Common Ratio",                 Component: IcseGPSequence },
  icse_math10_ch11_gp_nth_term:     { label: "GP — nth Term Formula",                        Component: IcseGPSequence },
  icse_math10_ch11_gp_sum:          { label: "GP — Sum & Infinite Series",                   Component: IcseGPSequence },
  icse_math10_ch11_gp_problems:     { label: "GP — Word Problems",                           Component: IcseGPSequence },
  // Ch12 — Reflection
  icse_math10_ch12_reflection_basics:   { label: "Reflection — Basics in Axes",              Component: IcseReflectionBasics },
  icse_math10_ch12_reflection_axes:     { label: "Reflection — All Four Quadrant Reflections", Component: IcseReflectionAxes },
  icse_math10_ch12_reflection_lines:    { label: "Reflection — In y=x and y=−x",             Component: IcseReflectionLines },
  icse_math10_ch12_reflection_problems: { label: "Reflection — Composite Problems",           Component: IcseReflectionProblems },
  // Ch13 — Section and Midpoint Formula
  icse_math10_ch13_section_internal:  { label: "Section Formula — Internal Division",        Component: IcseSectionInternal },
  icse_math10_ch13_section_external:  { label: "Section Formula — External Division",        Component: IcseSectionExternal },
  icse_math10_ch13_midpoint:          { label: "Midpoint Formula",                            Component: IcseMidpoint },
  icse_math10_ch13_section_problems:  { label: "Section Formula — Centroid of Triangle",     Component: IcseSectionProblems },
  // Ch14 — Equation of a Line
  icse_math10_ch14_slope:             { label: "Slope — Rise Over Run",                       Component: IcseSlope },
  icse_math10_ch14_line_forms:        { label: "Line — y = mx + c with Intercepts",          Component: IcseLineForms },
  icse_math10_ch14_special_lines:     { label: "Special Lines — Parallel & Perpendicular",   Component: IcseSpecialLines },
  icse_math10_ch14_line_problems:     { label: "Line — Perpendicular Lines (m₁m₂=−1)",       Component: IcseLineProblems },
  // Ch15 — Similarity
  icse_math10_ch15_similarity_basics:       { label: "Similarity — Two Similar Triangles",   Component: IcseSimilarityBasics },
  icse_math10_ch15_similarity_criteria:     { label: "Similarity — AA, SAS~, SSS~ Criteria", Component: IcseSimilarityCriteria },
  icse_math10_ch15_similarity_applications: { label: "Similarity — Basic Proportionality Theorem", Component: IcseSimilarityBPT },
  icse_math10_ch15_similarity_problems:     { label: "Similarity — Scale Factor & Area Ratio", Component: IcseSimilarityProblems },
  // Ch16 — Loci
  icse_math10_ch16_loci_concepts:      { label: "Loci — Circle as Equidistant Locus",        Component: IcseLocusConcepts },
  icse_math10_ch16_loci_properties:    { label: "Loci — Perpendicular Bisector Locus",       Component: IcseLocusProperties },
  icse_math10_ch16_loci_constructions: { label: "Loci — Incenter from Angle Bisectors",      Component: IcseLocusConstructions },
  icse_math10_ch16_loci_problems:      { label: "Loci — Intersection of Two Loci",           Component: IcseLocusProblems },
  // Ch17 — Circles
  icse_math10_ch17_circle_theorems:       { label: "Circles — Angle in Semicircle = 90°",   Component: IcseCircleTheorems },
  icse_math10_ch17_circle_chord_properties:{ label: "Circles — Perpendicular from Centre Bisects Chord", Component: IcseCircleChords },
  icse_math10_ch17_circle_arc_angle:      { label: "Circles — Central Angle = 2 × Inscribed Angle", Component: IcseCircleArcAngle },
  icse_math10_ch17_circle_cyclic_quad:    { label: "Circles — Cyclic Quadrilateral",         Component: IcseCircleCyclicQuad },
  // Ch18 — Tangents and Intersecting Chords
  icse_math10_ch18_tangent_basics:         { label: "Tangents — Radius ⊥ Tangent at Point", Component: IcseTangentBasics },
  icse_math10_ch18_tangent_properties:     { label: "Tangents — Two Tangents from External Point", Component: IcseTangentProperties },
  icse_math10_ch18_tangent_chord_angle:    { label: "Tangents — Tangent-Chord Angle",        Component: IcseTangentChordAngle },
  icse_math10_ch18_intersecting_chords:    { label: "Tangents — Intersecting Chords PA×PB=PC×PD", Component: IcseIntersectingChords },
  // Ch19 — Constructions
  icse_math10_ch19_constructions_basics:        { label: "Constructions — Tangent at a Point", Component: IcseConstructionsBasics },
  icse_math10_ch19_constructions_tangents:      { label: "Constructions — Tangent from External Point", Component: IcseConstructionsTangents },
  icse_math10_ch19_constructions_inscribed:     { label: "Constructions — Incircle of Triangle", Component: IcseConstructionsInscribed },
  icse_math10_ch19_constructions_circumscribed: { label: "Constructions — Circumcircle of Triangle", Component: IcseConstructionsCircumscribed },
  // Ch20 — Cylinder, Cone, Sphere
  icse_math10_ch20_cylinder:  { label: "Cylinder — CSA, TSA, Volume",                        Component: IcseCylinder },
  icse_math10_ch20_cone:      { label: "Cone — Slant Height, CSA, TSA, Volume",              Component: IcseCone },
  icse_math10_ch20_sphere:    { label: "Sphere — Surface Area & Volume",                     Component: IcseSphere },
  icse_math10_ch20_combined:  { label: "Combined Solids — Volume Addition",                  Component: IcseCombinedSolid },
  // Ch21 — Trigonometrical Identities
  icse_math10_ch21_trig_ratios_review:        { label: "Trig Ratios — SOH-CAH-TOA",          Component: IcseTrigRatios },
  icse_math10_ch21_trig_identities_basic:     { label: "Trig Identities — sin²θ+cos²θ=1",   Component: IcseUnitCircle },
  icse_math10_ch21_trig_identities_proofs:    { label: "Trig Identities — Proof via Right Triangle", Component: IcseTrigProofs },
  icse_math10_ch21_trig_identities_problems:  { label: "Trig Identities — Complementary Angles", Component: IcseComplementaryAngles },
  // Ch22 — Heights and Distances
  icse_math10_ch22_angles_elevation_depression: { label: "Heights — Elevation & Depression Angles", Component: IcseElevationDepression },
  icse_math10_ch22_single_observer:             { label: "Heights — Single Observer Setup",   Component: IcseSingleObserver },
  icse_math10_ch22_two_positions:               { label: "Heights — Two Observer Positions",  Component: IcseTwoPositions },
  icse_math10_ch22_buildings_towers:            { label: "Heights — Two Buildings Formula",   Component: IcseBuildingsTowers },
  // Ch23 — Graphical Representation
  icse_math10_ch23_histogram:           { label: "Statistics — Histogram (no gaps)",          Component: IcseHistogram },
  icse_math10_ch23_ogive:               { label: "Statistics — Less-than Ogive",              Component: IcseOgive },
  icse_math10_ch23_frequency_polygon:   { label: "Statistics — Frequency Polygon",            Component: IcseFrequencyPolygon },
  icse_math10_ch23_ogive_statistics:    { label: "Statistics — Ogive: Q₁, Median, Q₃",       Component: IcseOgiveStatistics },

  // ── ICSE CLASS 9 MATHEMATICS ───────────────────────────────────────────────
  // Ch9 — Triangles (Congruency in Triangles)
  icse_math9_ch9_triangle_congruence:  { label: "Congruent Triangles — △ABC ≅ △PQR",         Component: Icse9CongruenceIntro },
  icse_math9_ch9_congruence_criteria:  { label: "Congruence Criteria — SAS, ASA, SSS, RHS",  Component: Icse9CongruenceCriteria },
  icse_math9_ch9_triangle_properties: { label: "Exterior Angle = Sum of Two Interior Angles", Component: Icse9TriangleProperties },
  icse_math9_ch9_triangle_problems:   { label: "Congruent Triangles in Parallelogram",        Component: Icse9CongruenceProblems },
  // Ch10 — Isosceles Triangles
  icse_math9_ch10_isosceles_properties: { label: "Isosceles — Equal Sides → Equal Base Angles", Component: Icse9IsoscelesBase },
  icse_math9_ch10_isosceles_theorems:   { label: "Isosceles Converse — Equal Angles → Equal Sides", Component: Icse9IsoscelesAngles },
  icse_math9_ch10_equilateral_triangle: { label: "Equilateral Triangle — All Sides and Angles Equal", Component: Icse9EquilateralTriangle },
  icse_math9_ch10_isosceles_problems:   { label: "Isosceles — Altitude Bisects Base",          Component: Icse9IsoscelesProblems },
  // Ch11 — Inequalities
  icse_math9_ch11_inequality_basics:    { label: "Triangle Inequality — Greater Angle Opp Longer Side", Component: Icse9InequalityBasics },
  icse_math9_ch11_triangle_inequalities:{ label: "Triangle Inequality — Sum of Two Sides > Third", Component: Icse9TriangleIneq },
  icse_math9_ch11_inequality_theorems:  { label: "Exterior Angle > Non-Adjacent Interior Angles", Component: Icse9InequalityTheorem },
  icse_math9_ch11_inequality_problems:  { label: "Median < Average of Enclosing Sides",         Component: Icse9InequalityProblems },
  // Ch12 — Mid-Point Theorem
  icse_math9_ch12_midpoint_theorem:   { label: "Mid-Point Theorem — MN ∥ BC, MN = ½BC",      Component: Icse9MidpointThm },
  icse_math9_ch12_converse_midpoint:  { label: "Converse of Mid-Point Theorem",               Component: Icse9ConverseMP },
  icse_math9_ch12_intercept_theorem:  { label: "Equal Intercept Theorem — Parallel Lines",    Component: Icse9InterceptThm },
  icse_math9_ch12_midpoint_problems:  { label: "Trapezium Mid-Segment = ½(AB + DC)",          Component: Icse9MidpointProblems },
  // Ch13 — Pythagoras Theorem
  icse_math9_ch13_pythagoras_theorem:      { label: "Pythagoras — a² + b² = c²",             Component: Icse9PythagorasBasic },
  icse_math9_ch13_pythagoras_converse:     { label: "Converse of Pythagoras — Classify Triangle", Component: Icse9PythagorasConverse },
  icse_math9_ch13_pythagoras_applications: { label: "Pythagoras — Ladder and Height Problems", Component: Icse9PythagorasApp },
  icse_math9_ch13_pythagoras_problems:     { label: "Pythagoras — Right Triangle in Grid",    Component: Icse9PythagorasProblems },
  // Ch14 — Rectilinear Figures (Quadrilaterals)
  icse_math9_ch14_quadrilateral_properties: { label: "Quadrilateral Angle Sum = 360°",        Component: Icse9QuadProperties },
  icse_math9_ch14_parallelogram_theorems:   { label: "Parallelogram — Properties and Diagonals", Component: Icse9Parallelogram },
  icse_math9_ch14_special_quadrilaterals:   { label: "Special Quadrilaterals — Rectangle, Rhombus, Square, Kite", Component: Icse9SpecialQuads },
  icse_math9_ch14_rectilinear_problems:     { label: "Trapezium Area = ½(a+b)h",              Component: Icse9RectilinearProblems },
  // Ch15 — Construction of Polygons
  icse_math9_ch15_basic_constructions:        { label: "Perpendicular Bisector Construction", Component: Icse9BasicConstructions },
  icse_math9_ch15_triangle_construction:      { label: "Triangle Construction — SSS / SAS / ASA", Component: Icse9TriangleConstruction },
  icse_math9_ch15_quadrilateral_construction: { label: "Quadrilateral Construction via Diagonal", Component: Icse9QuadConstruction },
  icse_math9_ch15_polygon_construction:       { label: "Regular Hexagon — Compass Construction", Component: Icse9PolygonConstruction },
  // Ch16 — Area Theorems
  icse_math9_ch16_area_parallelogram:     { label: "Area of Parallelogram = Base × Height",  Component: Icse9AreaParallelogram },
  icse_math9_ch16_area_triangle:         { label: "Area of Triangle = ½ × Base × Height",   Component: Icse9AreaTriangle },
  icse_math9_ch16_area_theorems_proof:   { label: "Equal Area — Same Base, Same Parallels",  Component: Icse9AreaProof },
  icse_math9_ch16_area_theorem_problems: { label: "Quadrilateral Area = ½ × d × (h₁+h₂)",  Component: Icse9AreaProblems },
  // Ch17 — Circle (Chord Properties)
  icse_math9_ch17_circle_basics:    { label: "Circle — Radius, Diameter, Chord",            Component: Icse9CircleBasicsComp },
  icse_math9_ch17_chord_properties: { label: "Chord — Perp from Centre Bisects Chord",      Component: Icse9ChordProp },
  icse_math9_ch17_arc_properties:   { label: "Arcs — Equal Arcs ↔ Equal Chords ↔ Equal Central Angles", Component: Icse9ArcProp },
  icse_math9_ch17_circle_problems:  { label: "Equal Chords are Equidistant from Centre",    Component: Icse9CircleProbComp },
  // Ch20 — Area and Perimeter of Plane Figures
  icse_math9_ch20_area_plane_figures:       { label: "Area Formulae — Rectangle, Triangle, Parallelogram, Trapezium", Component: Icse9AreaPlane },
  icse_math9_ch20_perimeter_plane_figures:  { label: "Perimeter — Distance Around Boundary", Component: Icse9PerimeterPlane },
  icse_math9_ch20_circle_area_perimeter:    { label: "Circle — Area = πr², Circumference = 2πr", Component: Icse9CircleAreaPerim },
  icse_math9_ch20_area_perimeter_problems:  { label: "Combined Figure — Rectangle + Semicircle", Component: Icse9AreaPerimProblems },
  // Ch21 — Solids (Surface Area and Volume)
  icse_math9_ch21_cuboid_cylinder:   { label: "Cuboid — LSA, TSA, Volume",                  Component: Icse9Cuboid },
  icse_math9_ch21_cone_pyramid:      { label: "Cone and Pyramid — Volume = ⅓ × Base × h",  Component: Icse9ConePyramid },
  icse_math9_ch21_sphere_hemisphere: { label: "Sphere and Hemisphere — SA and Volume",       Component: Icse9SphereHemisphere },
  icse_math9_ch21_solid_problems:    { label: "Combined Solid — Cylinder + Hemisphere",      Component: Icse9SolidProblems },
  // Ch26 — Co-ordinate Geometry
  icse_math9_ch26_cartesian_plane:    { label: "Cartesian Plane — 4 Quadrants",              Component: Icse9CartesianPlane },
  icse_math9_ch26_plotting_points:    { label: "Plotting Points — All 4 Quadrants",          Component: Icse9PlottingPoints },
  icse_math9_ch26_distance_midpoint:  { label: "Distance Formula and Midpoint Formula",      Component: Icse9DistanceMidpoint },
  icse_math9_ch26_coordinate_problems:{ label: "Coordinate Triangle — Sides and Classification", Component: Icse9CoordProblems },

  // ── CBSE CLASS 9 MATHEMATICS ──────────────────────────────────────────────
  // Ch1 — Coordinates (reusing existing ICSE 9 components)
  cbse_math9_ch1_cartesian_plane:            { label: "Cartesian Plane — 4 Quadrants",               Component: Icse9CartesianPlane },
  cbse_math9_ch1_plotting_points:            { label: "Plotting Points — All 4 Quadrants",           Component: Icse9PlottingPoints },
  cbse_math9_ch1_distance_formula:           { label: "Distance Formula and Midpoint Formula",        Component: Icse9DistanceMidpoint },
  cbse_math9_ch1_section_formula:            { label: "Section Formula — Internal Division m:n",     Component: IcseSectionInternal },
  // Ch2 — Linear Polynomials
  cbse_math9_ch2_poly_basics:                { label: "Polynomial — Degree, Terms, Coefficients",    Component: CbseMath9PolyBasics },
  cbse_math9_ch2_zeroes:                     { label: "Zeroes of Polynomial — x-intercepts",         Component: CbseMath9PolyZeroes },
  cbse_math9_ch2_remainder_theorem:          { label: "Remainder Theorem — substitute x = a",        Component: CbseMath9RemainderThm },
  cbse_math9_ch2_factor_theorem:             { label: "Factor Theorem — p(a)=0 ↔ (x−a) factor",     Component: CbseMath9FactorThm },
  // Ch3 — The World of Numbers
  cbse_math9_ch3_number_systems:             { label: "Number Hierarchy — ℕ⊂W⊂ℤ⊂ℚ⊂ℝ",             Component: CbseMath9NumberHierarchy },
  cbse_math9_ch3_irrational_representation:  { label: "√2 on Number Line — Geometric Construction",  Component: CbseMath9IrrationalLine },
  cbse_math9_ch3_decimal_expansions:         { label: "Terminating vs Non-Terminating Decimals",     Component: CbseMath9DecimalTypes },
  cbse_math9_ch3_real_operations:            { label: "Laws of Exponents — 6 Rules",                 Component: CbseMath9RealOps },
  // Ch4 — Algebraic Identities
  cbse_math9_ch4_basic_identities:           { label: "(a+b)² Geometric Proof — 4 Regions",          Component: CbseMath9BasicIdentities },
  cbse_math9_ch4_cube_identities:            { label: "Cube Identities — (a±b)³",                   Component: CbseMath9CubeIdentities },
  cbse_math9_ch4_three_variable_identities:  { label: "Three-Variable Identities — a³+b³+c³",       Component: CbseMath9ThreeVarId },
  cbse_math9_ch4_factorising_with_identities:{ label: "Factorising with Identities — 4-Step",        Component: CbseMath9Factorising },
  // Ch5 — Circles (reusing 2 ICSE 9 components + 2 new)
  cbse_math9_ch5_circle_basics:              { label: "Circle Parts — Radius, Chord, Arc",           Component: Icse9CircleBasicsComp },
  cbse_math9_ch5_chord_theorems:             { label: "Chord — Perpendicular from Centre Bisects",   Component: Icse9ChordProp },
  cbse_math9_ch5_angle_theorems:             { label: "Central Angle = 2 × Inscribed Angle",         Component: CbseMath9AngleTheorems },
  cbse_math9_ch5_cyclic_quadrilaterals:      { label: "Cyclic Quadrilateral — Opposite Angles 180°", Component: CbseMath9CyclicQuad },
  // Ch6 — Perimeter and Area (reusing 2 ICSE 9 components + 2 new)
  cbse_math9_ch6_basics_triangle_area:       { label: "Triangle Area = ½ × base × height",          Component: Icse9AreaTriangle },
  cbse_math9_ch6_herons_formula:             { label: "Heron's Formula — Area from 3 Sides",         Component: CbseMath9HeronsFormula },
  cbse_math9_ch6_quadrilateral_areas:        { label: "Area Formulae — Quad, Parallelogram, Trap",   Component: Icse9AreaPlane },
  cbse_math9_ch6_composite_areas:            { label: "Composite Figure — Split and Sum Areas",      Component: CbseMath9CompositeArea },
  // Ch7 — Probability
  cbse_math9_ch7_random_experiments:         { label: "Sample Space — Coin and Die",                 Component: CbseMath9RandomExperiment },
  cbse_math9_ch7_empirical_probability:      { label: "Empirical Probability — Frequency Table",     Component: CbseMath9EmpiricalProb },
  cbse_math9_ch7_probability_range:          { label: "Probability Range — 0 ≤ P(E) ≤ 1",           Component: CbseMath9ProbRange },
  cbse_math9_ch7_probability_applications:   { label: "Probability — Standard 52-Card Deck",         Component: CbseMath9ProbApps },
  // Ch8 — Sequences and Progressions
  cbse_math9_ch8_sequences_basics:           { label: "Sequences — Patterns in Number Lists",        Component: CbseMath9SequenceBasics },
  cbse_math9_ch8_arithmetic_progressions:    { label: "AP — Terms a, a+d, a+2d…  nth term",         Component: CbseMath9AP },
  cbse_math9_ch8_ap_sum:                     { label: "Sum of AP — Gauss Pairing Sₙ=n/2(a+l)",      Component: CbseMath9APSum },
  cbse_math9_ch8_geometric_progressions:     { label: "GP — Terms a, ar, ar²…  nth term",           Component: CbseMath9GP },

  // ── AP SSC CLASS 9 MATHEMATICS ────────────────────────────────────────────
  // Ch1 — Number Systems (all 4 reuse CBSE Math 9 components)
  ap_ssc_math9_ch1_irrational_numbers:              { label: "√2 on Number Line — Geometric Construction",  Component: CbseMath9IrrationalLine },
  ap_ssc_math9_ch1_decimal_expansions:              { label: "Terminating vs Non-Terminating Decimals",     Component: CbseMath9DecimalTypes },
  ap_ssc_math9_ch1_laws_of_exponents:               { label: "Laws of Exponents — 6 Rules",                 Component: CbseMath9RealOps },
  ap_ssc_math9_ch1_operations_on_reals:             { label: "Number Hierarchy — ℕ⊂W⊂ℤ⊂ℚ⊂ℝ",             Component: CbseMath9NumberHierarchy },
  // Ch2 — Polynomials (all 5 reuse CBSE Math 9 components)
  ap_ssc_math9_ch2_polynomials_basics:              { label: "Polynomial — Degree, Terms, Coefficients",    Component: CbseMath9PolyBasics },
  ap_ssc_math9_ch2_zeroes_of_polynomial:            { label: "Zeroes of Polynomial — x-intercepts",        Component: CbseMath9PolyZeroes },
  ap_ssc_math9_ch2_remainder_theorem:               { label: "Remainder Theorem — substitute x = a",       Component: CbseMath9RemainderThm },
  ap_ssc_math9_ch2_factor_theorem:                  { label: "Factor Theorem — p(a)=0 ↔ (x−a) factor",    Component: CbseMath9FactorThm },
  ap_ssc_math9_ch2_algebraic_identities:            { label: "(a+b)² Geometric Proof — 4 Regions",         Component: CbseMath9BasicIdentities },
  // Ch3 — Coordinate Geometry (reusing ICSE 9 components)
  ap_ssc_math9_ch3_cartesian_system:                { label: "Cartesian Plane — 4 Quadrants",               Component: Icse9CartesianPlane },
  ap_ssc_math9_ch3_plotting_points:                 { label: "Plotting Points — All 4 Quadrants",           Component: Icse9PlottingPoints },
  // Ch4 — Linear Equations in Two Variables (3 new components)
  ap_ssc_math9_ch4_linear_equation_solutions:       { label: "Linear Equation — Infinite Solutions on Line", Component: ApSscMath9LinearEqSolutions },
  ap_ssc_math9_ch4_graph_of_linear_equation:        { label: "Intercept Method — x-intercept and y-intercept", Component: ApSscMath9LinearEqGraph },
  ap_ssc_math9_ch4_equations_of_special_lines:      { label: "Special Lines — x=a (vertical), y=b (horizontal)", Component: ApSscMath9SpecialLines },
  // Ch5 — Introduction to Euclid's Geometry (2 new components)
  ap_ssc_math9_ch5_euclid_definitions_axioms:       { label: "Euclid's 5 Postulates — Geometric Foundations", Component: ApSscMath9EuclidPostulates },
  ap_ssc_math9_ch5_fifth_postulate:                 { label: "Playfair's Axiom — Exactly One Parallel Line",   Component: ApSscMath9FifthPostulate },
  // Ch6 — Lines and Angles (3 new components)
  ap_ssc_math9_ch6_basic_terms_angles:              { label: "Types of Angles — Acute, Right, Obtuse, Straight", Component: ApSscMath9BasicAngles },
  ap_ssc_math9_ch6_parallel_lines_transversal:      { label: "Parallel Lines — 8 Angles from Transversal",  Component: ApSscMath9ParallelTransversal },
  ap_ssc_math9_ch6_lines_parallel_to_same_line:     { label: "Parallel Transitivity — a∥b and b∥c → a∥c",   Component: ApSscMath9ParallelTransitivity },
  // Ch7 — Triangles (reusing ICSE 9 components)
  ap_ssc_math9_ch7_congruence_of_triangles:         { label: "Congruence of Triangles — Same Shape and Size", Component: Icse9CongruenceIntro },
  ap_ssc_math9_ch7_congruence_criteria:             { label: "Congruence Criteria — SSS, SAS, ASA, RHS",    Component: Icse9CongruenceCriteria },
  ap_ssc_math9_ch7_triangle_properties_inequalities:{ label: "Triangle Properties — Angle Sum and Sides",   Component: Icse9TriangleProperties },
  // Ch8 — Quadrilaterals (reusing ICSE 9 components)
  ap_ssc_math9_ch8_parallelogram_properties:        { label: "Parallelogram — Opposite Sides and Angles",   Component: Icse9Parallelogram },
  ap_ssc_math9_ch8_angle_sum_property:              { label: "Quadrilateral — Angle Sum = 360°",            Component: Icse9QuadProperties },
  ap_ssc_math9_ch8_midpoint_theorem:                { label: "Midpoint Theorem — Line joining midpoints ∥ third side", Component: Icse9MidpointThm },
  // Ch9 — Circles (reusing ICSE 9 + CBSE Math 9 components)
  ap_ssc_math9_ch9_chords_of_circle:                { label: "Chord — Perpendicular from Centre Bisects",   Component: Icse9ChordProp },
  ap_ssc_math9_ch9_angle_subtended_by_arc:          { label: "Central Angle = 2 × Inscribed Angle",         Component: CbseMath9AngleTheorems },
  ap_ssc_math9_ch9_cyclic_quadrilaterals:           { label: "Cyclic Quadrilateral — Opposite Angles 180°", Component: CbseMath9CyclicQuad },
  // Ch10 — Heron's Formula (reusing CBSE Math 9 components)
  ap_ssc_math9_ch10_herons_formula:                 { label: "Heron's Formula — Area from 3 Sides",         Component: CbseMath9HeronsFormula },
  ap_ssc_math9_ch10_herons_application_quadrilaterals:{ label: "Composite Figure — Split Quadrilateral into Triangles", Component: CbseMath9CompositeArea },
  // Ch11 — Surface Areas and Volumes (reusing ICSE 9 components)
  ap_ssc_math9_ch11_surface_area_solids:            { label: "Cuboid and Cylinder — Surface Area Formulae", Component: Icse9Cuboid },
  ap_ssc_math9_ch11_volume_of_solids:               { label: "Cone and Pyramid — Volume Formulae",          Component: Icse9ConePyramid },
  // Ch12 — Statistics (reusing ICSE 10 + CBSE 10 components)
  ap_ssc_math9_ch12_data_collection_presentation:   { label: "Histogram — Frequency Distribution Bar Chart", Component: IcseHistogram },
  ap_ssc_math9_ch12_frequency_distributions:        { label: "Frequency Polygon — Midpoints Connected",     Component: IcseFrequencyPolygon },
  ap_ssc_math9_ch12_central_tendency:               { label: "Mean — Grouped Data using Assumed Mean",      Component: MeanGrouped },

  // ── CBSE Math 8 ─────────────────────────────────────────────────────────────
  // Ch1 — Squares, Cubes and Roots
  cbse_math8_ch1_squares:                           { label: "Squares — n×n Grid",                          Component: CbseMath8Squares },
  cbse_math8_ch1_cubes:                             { label: "Cubes — n³ = n × n × n",                      Component: CbseMath8Cubes },
  cbse_math8_ch1_square_roots:                      { label: "Square Roots — Prime Factorisation",          Component: CbseMath8SquareRoots },
  cbse_math8_ch1_cube_roots:                        { label: "Cube Roots — Prime Factorisation",            Component: CbseMath8CubeRoots },
  // Ch2 — Exponents
  cbse_math8_ch2_exponents_intro:                   { label: "Introduction to Exponents — aⁿ",              Component: CbseMath8ExponentsIntro },
  cbse_math8_ch2_laws_of_exponents:                 { label: "Laws of Exponents — aᵐ × aⁿ = aᵐ⁺ⁿ",         Component: CbseMath8LawsOfExponents },
  cbse_math8_ch2_negative_exponents:                { label: "Negative and Zero Exponents — a⁻ⁿ = 1/aⁿ",   Component: CbseMath8NegativeExponents },
  cbse_math8_ch2_scientific_notation:               { label: "Scientific Notation — a × 10ⁿ",               Component: CbseMath8ScientificNotation },
  // Ch3 — Number Systems
  cbse_math8_ch3_number_systems:                    { label: "The Number System Story — N ⊂ Z ⊂ Q ⊂ R",    Component: CbseMath8NumberSystems },
  cbse_math8_ch3_integers_operations:               { label: "Integers and Their Operations",               Component: CbseMath8IntegersOps },
  cbse_math8_ch3_rational_numbers:                  { label: "Rational Numbers — p/q on Number Line",       Component: CbseMath8RationalNumbers },
  cbse_math8_ch3_irrational_numbers:                { label: "Irrational Numbers — √2, π on Number Line",  Component: CbseMath8IrrationalNumbers },
  // Ch4 — Quadrilaterals
  cbse_math8_ch4_quadrilateral_types:               { label: "Types of Quadrilaterals",                     Component: CbseMath8QuadTypes },
  cbse_math8_ch4_quadrilateral_properties:          { label: "Properties of Quadrilaterals",                Component: CbseMath8QuadProperties },
  cbse_math8_ch4_angle_sum_property:                { label: "Angle Sum Property — Sum = 360°",             Component: CbseMath8AngleSumProp },
  cbse_math8_ch4_parallelogram_theorems:            { label: "Parallelogram Theorems — Parallel Lines",     Component: CbseMath8ParallelogramThms },
  // Ch5 — Number Theory
  cbse_math8_ch5_number_patterns:                   { label: "Number Patterns — Fibonacci & Arithmetic",   Component: CbseMath8NumberPatterns },
  cbse_math8_ch5_primes_and_composites:             { label: "Primes and Composites — Sieve of Eratosthenes", Component: CbseMath8PrimesComposites },
  cbse_math8_ch5_divisibility_rules:                { label: "Divisibility Rules — 2, 3, 5, 9, 11",        Component: CbseMath8DivisibilityRules },
  cbse_math8_ch5_number_puzzles:                    { label: "Number Puzzles and Tricks",                   Component: CbseMath8NumberPuzzles },
  // Ch6 — Algebra Basics
  cbse_math8_ch6_distributive_law:                  { label: "The Distributive Law — a(b+c) = ab+ac",       Component: CbseMath8DistributiveLaw },
  cbse_math8_ch6_factorisation:                     { label: "Factorisation of Algebraic Expressions",     Component: CbseMath8Factorisation },
  cbse_math8_ch6_like_and_unlike_terms:             { label: "Like and Unlike Terms",                       Component: CbseMath8LikeUnlikeTerms },
  cbse_math8_ch6_algebraic_simplification:          { label: "Simplifying Algebraic Expressions",          Component: CbseMath8AlgebraicSimplification },
  // Ch7 — Ratio and Percent
  cbse_math8_ch7_ratios:                            { label: "Ratios — a : b Comparison",                   Component: CbseMath8Ratios },
  cbse_math8_ch7_proportions:                       { label: "Proportions — a/b = c/d",                    Component: CbseMath8Proportions },
  cbse_math8_ch7_unitary_method:                    { label: "The Unitary Method — Find One, Then Many",   Component: CbseMath8UnitaryMethod },
  cbse_math8_ch7_percentages:                       { label: "Percentages — % Increase, Decrease, Profit", Component: CbseMath8Percentages },
  // Ch8 — Fractions
  cbse_math8_ch8_complex_fractions:                 { label: "Complex Fractions — Keep, Change, Flip",     Component: CbseMath8ComplexFractions },
  cbse_math8_ch8_ratios_as_fractions:               { label: "Ratios as Fractions — Bar Model",            Component: CbseMath8RatiosAsFractions },
  cbse_math8_ch8_dividing_fractions:                { label: "Dividing Fractions — Invert and Multiply",   Component: CbseMath8DividingFractions },
  cbse_math8_ch8_fraction_word_problems:            { label: "Fraction Word Problems — Strategy Guide",    Component: CbseMath8FractionWordProbs },
  // Ch9 — Pythagoras
  cbse_math8_ch9_right_triangles:                   { label: "Right-Angled Triangles — Legs and Hypotenuse", Component: CbseMath8RightTriangles },
  cbse_math8_ch9_pythagoras_theorem:                { label: "Pythagoras' Theorem — a² + b² = c²",         Component: CbseMath8PythagorasThm },
  cbse_math8_ch9_applying_pythagoras:               { label: "Applying Pythagoras — Ladder Problem",       Component: CbseMath8ApplyingPythagoras },
  cbse_math8_ch9_distance_on_grid:                  { label: "Distance on a Grid — d = √(Δx²+Δy²)",       Component: CbseMath8DistanceOnGrid },
  // Ch10 — Proportions and Variation
  cbse_math8_ch10_solving_proportions:              { label: "Solving Proportions — Cross Multiplication", Component: CbseMath8SolvingProportions },
  cbse_math8_ch10_scale_drawings:                   { label: "Scale Drawings and Maps",                    Component: CbseMath8ScaleDrawings },
  cbse_math8_ch10_similar_figures:                  { label: "Similar Figures — Equal Angles, Scaled Sides", Component: CbseMath8SimilarFigures },
  cbse_math8_ch10_direct_inverse_variation:         { label: "Direct and Inverse Variation — y=kx vs y=k/x", Component: CbseMath8DirectInverse },
  // Ch11 — Polygons and Symmetry
  cbse_math8_ch11_interior_angles_polygon:          { label: "Interior Angles of Polygon — (n−2)×180°",   Component: CbseMath8InteriorAnglesPolygon },
  cbse_math8_ch11_classifying_polygons:             { label: "Classifying Polygons — Regular, Irregular",  Component: CbseMath8ClassifyingPolygons },
  cbse_math8_ch11_types_of_symmetry:                { label: "Types of Symmetry — Line and Rotational",    Component: CbseMath8TypesOfSymmetry },
  cbse_math8_ch11_geometric_transformations:        { label: "Geometric Transformations — Translate, Reflect, Rotate", Component: CbseMath8GeomTransformations },
  // Ch12 — Graphs
  cbse_math8_ch12_graphs_and_networks:              { label: "Graphs and Data — Bar Chart",                Component: CbseMath8GraphsNetworks },
  cbse_math8_ch12_paths_in_graphs:                  { label: "Coordinate Graphs — Linear Relationship",   Component: CbseMath8PathsInGraphs },
  cbse_math8_ch12_euler_paths:                      { label: "Linear Graphs — y = mx + c",                Component: CbseMath8EulerPaths },
  cbse_math8_ch12_trees_in_graphs:                  { label: "Reading Graphs — Pie Chart and Line Graph",  Component: CbseMath8TreesInGraphs },
  // Ch13 — Algebra
  cbse_math8_ch13_algebraic_expressions:            { label: "Algebraic Expressions — Terms and Coefficients", Component: CbseMath8AlgebraicExpressions },
  cbse_math8_ch13_linear_equations:                 { label: "Linear Equations — Balance Scale Method",   Component: CbseMath8LinearEquations },
  cbse_math8_ch13_linear_inequalities:              { label: "Inequalities — Number Line Solution Region", Component: CbseMath8LinearInequalities },
  cbse_math8_ch13_algebraic_identities:             { label: "Algebraic Identities — (a+b)² = a²+2ab+b²", Component: CbseMath8AlgebraicIdentities },
  // Ch14 — Area and Perimeter
  cbse_math8_ch14_area_of_rectangle:                { label: "Area and Perimeter — Rectangle and Square",  Component: CbseMath8AreaRectangle },
  cbse_math8_ch14_area_of_triangle:                 { label: "Area of Triangle — ½ × base × height",      Component: CbseMath8AreaTriangle },
  cbse_math8_ch14_area_of_trapezium:                { label: "Area of Trapezium — ½(a+b)×h",              Component: CbseMath8AreaTrapezium },
  cbse_math8_ch14_area_of_circle:                   { label: "Area of Circle — πr² and Circumference 2πr", Component: CbseMath8AreaCircle },
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
