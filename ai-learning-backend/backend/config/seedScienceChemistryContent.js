import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const TOPICS = [
  // ── Chapter 1: Chemical Reactions and Equations ──────────────────────────────
  {
    topicId: "sci_ch1_signs_and_types",
    subject: "Science",
    chapterNumber: 1,
    name: "Signs of Chemical Reactions and Types of Reactions",
    prerequisite_knowledge: [
      "Difference between physical and chemical change",
      "Basic understanding of elements and compounds",
      "Meaning of reactants and products",
    ],
    key_formulas: [
      "Combination: A + B → AB",
      "Decomposition: AB → A + B",
      "Displacement: A + BC → AC + B",
      "Double displacement: AB + CD → AD + CB",
      "Fe + CuSO₄ → FeSO₄ + Cu (displacement example)",
      "NaOH + HCl → NaCl + H₂O (double displacement / neutralisation)",
    ],
    teaching_content: {
      intuition:
        "A chemical change is permanent and produces new substances with new properties. When iron rusts, you cannot get the original shiny iron back — that irreversibility is the clue that a chemical reaction happened. Signs like colour change, gas evolution, temperature change, or precipitate formation tell you atoms have rearranged into something genuinely new.",
      process_explanation:
        "1. SIGNS of a chemical reaction: evolution of gas (bubbles), change in colour, change in temperature (heat given out or absorbed), formation of a precipitate (insoluble solid), change in smell.\n2. COMBINATION reactions: two or more substances combine to form a single product. Example: CaO + H₂O → Ca(OH)₂ (quicklime + water → slaked lime — releases heat, so also exothermic).\n3. DECOMPOSITION reactions: a single compound breaks into two or more simpler substances. Requires energy input (heat, light, or electricity).\n4. DISPLACEMENT reactions: a more reactive element displaces a less reactive element from a compound in solution. Example: Zn + CuSO₄ → ZnSO₄ + Cu.\n5. DOUBLE DISPLACEMENT reactions: two ionic compounds exchange their ions, often forming a precipitate or water. Example: Na₂SO₄ + BaCl₂ → BaSO₄↓ + 2NaCl.",
      worked_example:
        "Question: Classify the reaction — 2Mg + O₂ → 2MgO.\nStep 1: Count reactants and products. Two reactants (Mg and O₂), one product (MgO).\nStep 2: Two substances combine to give one → this is a COMBINATION reaction.\nStep 3: Also check energy: magnesium burns with a bright white flame releasing heat and light → also EXOTHERMIC.\nAnswer: Combination reaction (also exothermic).",
      common_misconceptions: [
        "Students confuse displacement with double displacement — remember: displacement has ONE element pushing out another; double displacement has TWO compounds exchanging partners.",
        "Precipitation is often mistaken as a physical change because something solid appears, but it is a new substance formed chemically.",
        "A colour change alone does not always mean a chemical reaction — mixing food colours is physical. The colour change must come with other signs or irreversibility.",
      ],
      shortcuts_and_tricks: [
        "CDDD mnemonic for reaction types: Combination, Decomposition, Displacement, Double displacement.",
        "For displacement: check the reactivity series — higher metal always displaces lower. If Fe is above Cu, Fe displaces Cu from CuSO₄.",
        "Double displacement = 'partner swap' — AB + CD swap partners to give AD + CB.",
      ],
      diagram_description:
        "Activity series displacement diagram: two test tubes side by side. Left tube shows an iron nail in blue CuSO₄ solution. Right tube (after reaction) shows the nail coated with reddish copper deposit and the solution turning pale green (FeSO₄). Arrows label: iron nail (before), copper deposit on nail (after), blue solution → pale green solution. A small inset shows the reactivity series with Fe above Cu.",
      key_takeaway:
        "A chemical reaction is identified by signs (gas, colour, precipitate, temperature change) and classified by how many reactants combine or split: combination (many→one), decomposition (one→many), displacement (A kicks out B), double displacement (AB and CD swap partners).",
    },
  },

  {
    topicId: "sci_ch1_balancing_equations",
    subject: "Science",
    chapterNumber: 1,
    name: "Balancing Chemical Equations — Law of Conservation of Mass",
    prerequisite_knowledge: [
      "Symbols and formulae of common elements and compounds",
      "Meaning of subscripts and coefficients in a chemical formula",
      "Basic atom counting in molecules",
    ],
    key_formulas: [
      "Law of Conservation of Mass: mass of reactants = mass of products",
      "Unbalanced: H₂ + O₂ → H₂O  →  Balanced: 2H₂ + O₂ → 2H₂O",
      "Unbalanced: Fe + H₂O → Fe₃O₄ + H₂  →  Balanced: 3Fe + 4H₂O → Fe₃O₄ + 4H₂",
      "State symbols: (s) solid, (l) liquid, (g) gas, (aq) aqueous",
    ],
    teaching_content: {
      intuition:
        "Atoms are never created or destroyed in a chemical reaction — they only rearrange. So if you start with 2 iron atoms on the left side of an equation, you must end with exactly 2 iron atoms on the right. Balancing is just accountancy for atoms.",
      process_explanation:
        "1. Write the unbalanced (skeletal) equation with correct formulae.\n2. Count atoms of each element on both sides.\n3. Start with the element that appears in the fewest compounds — usually a metal or a complex group first.\n4. Add coefficients (whole numbers in front of formulae) to make atom counts equal. NEVER change subscripts inside a formula — that would change the substance itself.\n5. Re-count all atoms after each adjustment.\n6. Add state symbols: (s), (l), (g), (aq).\nExample: Balance Fe + H₂O → Fe₃O₄ + H₂\n  - Fe: 1 vs 3 → put 3 before Fe\n  - O: 4 on right (Fe₃O₄) → need 4 H₂O on left\n  - H: 4×2=8 on left → need 4 H₂ on right\n  - Balanced: 3Fe(s) + 4H₂O(g) → Fe₃O₄(s) + 4H₂(g)",
      worked_example:
        "Balance: Al + Cl₂ → AlCl₃\nStep 1: Al = 1 left, 1 right ✓. Cl = 2 left, 3 right ✗.\nStep 2: LCM of 2 and 3 is 6. Need 6 Cl atoms. Put 3Cl₂ on left, 2AlCl₃ on right.\nStep 3: Now Al = 1 left, 2 right ✗. Put 2Al on left.\nStep 4: 2Al + 3Cl₂ → 2AlCl₃. Check: Al 2=2 ✓, Cl 6=6 ✓. Balanced.",
      common_misconceptions: [
        "Changing subscripts to balance (e.g., writing H₃ instead of H₂) — this changes the substance entirely and is always wrong.",
        "Forgetting to re-count ALL elements after adding a coefficient — changing one coefficient affects the count of every element in that formula.",
        "Treating state symbols as optional — CBSE board questions award marks specifically for correct state symbols.",
      ],
      shortcuts_and_tricks: [
        "Balance polyatomic ions (SO₄²⁻, NO₃⁻) as a whole unit if they appear unchanged on both sides.",
        "Leave H and O atoms for last — they are easiest to adjust at the end using H₂O.",
        "Cross-multiply subscripts trick: for AlCl₃ vs Cl₂, LCM(3,2)=6, so use 2AlCl₃ and 3Cl₂.",
      ],
      diagram_description:
        "A two-pan balance scale diagram. Left pan shows model atoms: 2 H₂ molecules + 1 O₂ molecule (4 H atoms + 2 O atoms total). Right pan shows 2 H₂O molecules (4 H atoms + 2 O atoms total). The scale is level, illustrating equal mass on both sides. Below: a table counting H and O atoms on each side confirming balance.",
      key_takeaway:
        "Balance equations by adjusting coefficients only (never subscripts) until atom count is equal on both sides — this satisfies Lavoisier's Law of Conservation of Mass.",
    },
  },

  {
    topicId: "sci_ch1_oxidation_reduction",
    subject: "Science",
    chapterNumber: 1,
    name: "Oxidation, Reduction, Redox Reactions, Corrosion and Rancidity",
    prerequisite_knowledge: [
      "Meaning of oxygen gain/loss in reactions",
      "Basic concept of electrons in atoms",
      "Signs of chemical reactions",
    ],
    key_formulas: [
      "OIL RIG: Oxidation Is Loss (of electrons), Reduction Is Gain (of electrons)",
      "CuO + H₂ → Cu + H₂O  (H₂ oxidised; CuO reduced)",
      "2Mg + O₂ → 2MgO  (Mg oxidised — gains oxygen)",
      "Corrosion of iron: 4Fe + 3O₂ + xH₂O → 2Fe₂O₃·xH₂O (rust)",
      "Rancidity: fats + O₂ → oxidised (foul-smelling) compounds",
    ],
    teaching_content: {
      intuition:
        "Oxidation and reduction always happen together — you cannot have one without the other, just like buying and selling. One substance gives up electrons (is oxidised), and another substance receives those electrons (is reduced). The mnemonic OIL RIG makes this impossible to forget.",
      process_explanation:
        "1. OXIDATION (older definition): gain of oxygen OR loss of hydrogen.\n   OXIDATION (modern definition): loss of electrons.\n2. REDUCTION (older): loss of oxygen OR gain of hydrogen.\n   REDUCTION (modern): gain of electrons.\n3. In a REDOX reaction both happen simultaneously. The substance that causes oxidation of another is the OXIDISING AGENT (itself gets reduced). The substance that causes reduction is the REDUCING AGENT (itself gets oxidised).\n4. CORROSION: slow oxidation of metals by moisture and air. Iron → rust (Fe₂O₃·xH₂O). Silver → tarnish (Ag₂S). Copper → green patina (CuCO₃·Cu(OH)₂). Prevention: painting, galvanising, alloying, electroplating.\n5. RANCIDITY: oxidation of fats and oils in food → bad smell and taste. Prevention: antioxidants (BHA), nitrogen flushing, refrigeration, airtight packaging.",
      worked_example:
        "Identify oxidising and reducing agents in: ZnO + C → Zn + CO₂\nStep 1: Zn in ZnO loses oxygen → ZnO is reduced. C gains oxygen → C is oxidised.\nStep 2: The substance oxidised is the REDUCING AGENT: C is the reducing agent.\nStep 3: The substance reduced is the OXIDISING AGENT: ZnO is the oxidising agent.\nConclusion: C (carbon) is oxidised (reducing agent); ZnO is reduced (oxidising agent).",
      common_misconceptions: [
        "Confusing the oxidising agent with what is oxidised — the oxidising agent is ITSELF reduced (it does the oxidising to something else).",
        "Thinking corrosion and rusting are the same — rusting is specifically for iron; corrosion is the general term for any metal.",
        "Assuming rancidity is caused by bacteria — it is primarily an oxidation process, not microbial spoilage.",
      ],
      shortcuts_and_tricks: [
        "OIL RIG: Oxidation Is Loss, Reduction Is Gain (of electrons).",
        "The reducing agent is always the one that gets oxidised (it reduces something else by sacrificing its electrons).",
        "Corrosion prevention PAGED: Paint, Alloy, Galvanise, Electroplate, Desiccant (oil/grease).",
      ],
      diagram_description:
        "Redox electron transfer diagram: two boxes labelled 'Reducing Agent (Zn)' and 'Oxidising Agent (Cu²⁺)'. An arrow between them shows electrons flowing from Zn to Cu²⁺, labelled 'electron transfer'. Below each box: Zn → Zn²⁺ + 2e⁻ (oxidation, loss) and Cu²⁺ + 2e⁻ → Cu (reduction, gain). OIL RIG text displayed prominently at the top.",
      key_takeaway:
        "OIL RIG — Oxidation Is Loss of electrons, Reduction Is Gain. They always occur together (redox). Corrosion is slow oxidation of metals; rancidity is oxidation of fats. Both are prevented by limiting oxygen contact.",
    },
  },

  {
    topicId: "sci_ch1_thermal_decomposition",
    subject: "Science",
    chapterNumber: 1,
    name: "Thermal, Electrolytic and Photolytic Decomposition",
    prerequisite_knowledge: [
      "Definition of decomposition reaction",
      "Basic concept of energy input in chemical reactions",
      "Familiarity with common compounds: CaCO₃, AgCl, H₂O",
    ],
    key_formulas: [
      "Thermal: CaCO₃(s) →(heat) CaO(s) + CO₂(g)",
      "Thermal: 2FeSO₄(s) →(heat) Fe₂O₃(s) + SO₂(g) + SO₃(g)",
      "Electrolytic: 2H₂O(l) →(electricity) 2H₂(g) + O₂(g)",
      "Photolytic: 2AgCl(s) →(sunlight) 2Ag(s) + Cl₂(g)",
      "Photolytic: 2AgBr(s) →(sunlight) 2Ag(s) + Br₂(g)  [used in black-and-white photography]",
    ],
    teaching_content: {
      intuition:
        "Decomposition reactions need energy to break the bonds in a compound. The type of energy used classifies the reaction: heat breaks down carbonates, electricity splits water, and light decomposes silver salts. Think of it as the compound needing a specific 'key' of energy to unlock its bonds.",
      process_explanation:
        "1. THERMAL DECOMPOSITION: compound breaks down on heating.\n   - CaCO₃ → CaO + CO₂ (used in cement manufacture; CO₂ turns lime water milky — test for CO₂)\n   - 2FeSO₄ → Fe₂O₃ + SO₂ + SO₃ (colour change: pale green → reddish brown)\n2. ELECTROLYTIC DECOMPOSITION: compound breaks down by passing electricity.\n   - 2H₂O → 2H₂ + O₂ (electrolysis of water — H₂ collected at cathode, O₂ at anode in 2:1 ratio)\n3. PHOTOLYTIC (PHOTOCHEMICAL) DECOMPOSITION: compound breaks down in light.\n   - 2AgCl → 2Ag + Cl₂ (silver becomes grey in sunlight — basis of black-and-white photography)\n   - 2AgBr similarly decomposes; Br₂ is brown gas released.\n4. These reactions also demonstrate that decomposition is the reverse of combination.",
      worked_example:
        "Question: A student heats pale green ferrous sulphate crystals. Describe the observation and write the equation.\nObservations: (i) Colour changes from pale green to reddish brown. (ii) Smell of burning sulphur (SO₂ and SO₃ gases released).\nEquation: 2FeSO₄(s) →(heat) Fe₂O₃(s) + SO₂(g) + SO₃(g)\nExplanation: FeSO₄ (pale green, Fe²⁺) decomposes; Fe₂O₃ (reddish brown, Fe³⁺) remains as solid; sulphur dioxide and trioxide escape as gases.",
      common_misconceptions: [
        "Students write the electrolysis of water producing H₂O₂ or H₂ + 2O — the correct products are 2H₂ and O₂ in a 2:1 molar ratio.",
        "Confusing photolytic decomposition with photosynthesis — photosynthesis is a combination reaction (CO₂ + H₂O → glucose); photolytic decomposition splits a compound using light.",
        "Thinking that thermal decomposition always needs a very high temperature — some compounds like H₂O₂ decompose at room temperature slowly; for NCERT, focus on CaCO₃ and FeSO₄.",
      ],
      shortcuts_and_tricks: [
        "TEP for decomposition energy types: Thermal (heat), Electrolytic (electricity), Photolytic (light/photo).",
        "In electrolysis of water: H₂ at cathode (negative) — remember H₂ is lighter and goes to the minus end. O₂ at anode (positive).",
        "AgCl/AgBr turning grey in sunlight is a quick one-line answer often asked directly in board exams.",
      ],
      diagram_description:
        "Three side-by-side diagrams. Left: a test tube over a Bunsen burner with CaCO₃ pellets, an arrow showing CO₂ gas bubbling through lime water (turning milky), labelled 'thermal decomposition'. Middle: an electrolysis apparatus with two electrodes in water with dilute H₂SO₄, gas collecting in inverted tubes — left tube (cathode) has twice the gas of right tube (anode), labelled H₂ and O₂. Right: a petri dish with white AgCl powder in sunlight, turning grey, labelled 'photolytic decomposition'.",
      key_takeaway:
        "Decomposition reactions require energy input — thermal (heat), electrolytic (electricity), or photolytic (light). Key examples: CaCO₃→CaO+CO₂ (thermal), 2H₂O→2H₂+O₂ (electrolytic), AgCl→Ag+Cl₂ (photolytic).",
    },
  },

  // ── Chapter 2: Acids, Bases and Salts ────────────────────────────────────────
  {
    topicId: "sci_ch2_acids_bases_indicators",
    subject: "Science",
    chapterNumber: 2,
    name: "Acids, Bases and Indicators — H⁺ and OH⁻ Ions",
    prerequisite_knowledge: [
      "Basic properties of acids and bases from everyday experience",
      "Concept of ions in solutions",
      "Meaning of litmus test",
    ],
    key_formulas: [
      "Acid in water: HCl(aq) → H⁺(aq) + Cl⁻(aq)",
      "Base in water: NaOH(aq) → Na⁺(aq) + OH⁻(aq)",
      "Neutralisation: H⁺(aq) + OH⁻(aq) → H₂O(l)",
      "Arrhenius acid: produces H⁺ ions in water",
      "Arrhenius base: produces OH⁻ ions in water",
    ],
    teaching_content: {
      intuition:
        "Acids taste sour (citric acid in lemons, acetic acid in vinegar) and bases feel slippery (soap). The reason acids behave as acids is that they release H⁺ (hydrogen) ions in water. Bases release OH⁻ (hydroxide) ions. When they meet, H⁺ + OH⁻ → H₂O — they cancel each other out in neutralisation.",
      process_explanation:
        "1. ACIDS: substances that release H⁺ ions in aqueous solution (Arrhenius definition). pH < 7. Examples: HCl (hydrochloric), H₂SO₄ (sulphuric), HNO₃ (nitric), CH₃COOH (acetic/ethanoic), H₂CO₃ (carbonic).\n2. BASES: substances that release OH⁻ ions in aqueous solution. pH > 7. Examples: NaOH, KOH, Ca(OH)₂, Mg(OH)₂. Soluble bases are called ALKALIS.\n3. INDICATORS:\n   - Litmus: red in acid, blue in base, purple in neutral.\n   - Phenolphthalein: colourless in acid, pink/magenta in base.\n   - Methyl orange: red in acid, yellow in base.\n   - Universal indicator: gives a range of colours corresponding to pH 1-14.\n4. OLFACTORY INDICATORS: onion (smell disappears in base), vanilla (smell disappears in base), clove oil.\n5. Acids and bases conduct electricity in solution because they produce ions.",
      worked_example:
        "Question: A student tests four solutions with litmus. Solution A turns red litmus blue. Solution B turns blue litmus red. Solution C has no effect on either litmus. What can you conclude?\nSolution A: turns red litmus blue → it is a BASE (has OH⁻ ions).\nSolution B: turns blue litmus red → it is an ACID (has H⁺ ions).\nSolution C: no effect on either → it is NEUTRAL (e.g., pure water, pH = 7).",
      common_misconceptions: [
        "All bases are alkalis — wrong. Only soluble bases are alkalis. Mg(OH)₂ is a base but not an alkali (sparingly soluble).",
        "Acids always burn — concentrated acids are corrosive, but dilute acids are not necessarily dangerous to touch.",
        "Litmus paper gives the exact pH — it only indicates acid, base, or neutral; only universal indicator or pH meter gives the exact value.",
      ],
      shortcuts_and_tricks: [
        "Red litmus + acid = stays red. Red litmus + base = turns BLUE. 'BASE = Blue' — B for B.",
        "Olfactory indicators: onion and vanilla lose their smell in BASE (not in acid).",
        "Neutralisation always produces SALT + WATER. Acid + Base → Salt + H₂O.",
      ],
      diagram_description:
        "A two-column table diagram. Left column 'Acids' lists examples with pH and colour on universal indicator (reds/oranges). Right column 'Bases' lists examples with pH and colour (blues/purples). In the middle: a small diagram of a neutralisation reaction with H⁺ and OH⁻ icons combining into a water drop. Below: litmus paper strips showing colour changes — red in acid, blue in base, purple in neutral.",
      key_takeaway:
        "Acids produce H⁺ ions in water (turn blue litmus red, pH < 7); bases produce OH⁻ ions (turn red litmus blue, pH > 7). Indicators (litmus, phenolphthalein, universal) detect them. H⁺ + OH⁻ → H₂O is neutralisation.",
    },
  },

  {
    topicId: "sci_ch2_ph_scale",
    subject: "Science",
    chapterNumber: 2,
    name: "pH Scale — Universal Indicator and Everyday pH",
    prerequisite_knowledge: [
      "Concept of acids and bases producing H⁺ and OH⁻ ions",
      "What an indicator is and how it works",
      "Logarithmic relationship (conceptual level — not mathematical for Class 10)",
    ],
    key_formulas: [
      "pH scale: 0 (most acidic) → 7 (neutral) → 14 (most basic)",
      "pH < 7 → acidic solution",
      "pH = 7 → neutral solution (pure water at 25°C)",
      "pH > 7 → basic (alkaline) solution",
      "As H⁺ ion concentration increases, pH decreases",
    ],
    teaching_content: {
      intuition:
        "The pH scale is like a ruler for acidity — the lower the number, the more acidic. A change of 1 pH unit means 10 times more or less acidic. Stomach acid (pH ≈ 1.5) is 100,000 times more acidic than pure water (pH 7). Your blood must stay between 7.35–7.45 — even a tiny shift causes serious illness.",
      process_explanation:
        "1. pH stands for 'power of Hydrogen' — it measures the concentration of H⁺ ions.\n2. SCALE: 0–14. Each step is a 10-fold change.\n3. EVERYDAY pH VALUES:\n   - Gastric juice (stomach acid): pH ≈ 1.5–2 (very acidic, HCl)\n   - Lemon juice: pH ≈ 2–3\n   - Vinegar: pH ≈ 3\n   - Normal rainwater: pH ≈ 5.6 (slightly acidic due to dissolved CO₂ → H₂CO₃)\n   - Acid rain: pH < 5.6 (due to SO₂, NO₂ from pollution)\n   - Milk: pH ≈ 6.5\n   - Pure water: pH = 7\n   - Blood: pH ≈ 7.4\n   - Baking soda solution: pH ≈ 8.3\n   - Soap: pH ≈ 9–10\n   - Bleach: pH ≈ 12\n4. TOOTH DECAY: bacteria in mouth produce acids from sugar; when pH of mouth falls below 5.5, tooth enamel (calcium phosphate) starts to corrode.\n5. pH OF SOIL: plants grow best at specific pH. Too acidic → add lime (CaO) or slaked lime (Ca(OH)₂). Too basic → add organic matter.\n6. pH IN DIGESTION: stomach (pH 1.5–2) kills pathogens. Small intestine (pH 7–8) — base conditions for enzymes.",
      worked_example:
        "Question: Normal rainwater has pH 5.6. Acid rain has pH 4.2. How much more acidic is acid rain?\nStep 1: Difference in pH = 5.6 − 4.2 = 1.4 units.\nStep 2: Each unit = 10× more acidic.\nStep 3: 10^1.4 ≈ 25 times more acidic (conceptual answer for Class 10: 'significantly more acidic — each pH unit means 10× change').\nAlternate board answer: 'The pH has decreased, meaning H⁺ ion concentration has increased significantly — acid rain is about 25 times more acidic than normal rainwater.'",
      common_misconceptions: [
        "pH 0 is the most acidic possible — actually pH can go below 0 for very concentrated strong acids, but for NCERT purposes, 0 is treated as the extreme acidic end.",
        "A neutral solution always has pH 7 — true only at 25°C; at higher temperatures, neutral pH is slightly lower.",
        "Universal indicator gives a single colour — it gives a range of colours (red for pH 1, orange/yellow for 3–5, green for 7, blue for 8–10, violet for 13–14).",
      ],
      shortcuts_and_tricks: [
        "pH < 7 = Acid. pH = 7 = Neutral. pH > 7 = Base. Memorise: 'Seven is heaven (neutral)'.",
        "Tooth decay threshold: pH 5.5. Below this, enamel dissolves. Toothpaste is mildly basic to neutralise.",
        "Stomach uses HCl (very acidic, pH ~2) but the stomach lining is protected by a mucus layer — antacids (Mg(OH)₂, NaHCO₃) neutralise excess acid.",
      ],
      diagram_description:
        "pH scale colour chart: a horizontal bar from 0 to 14 coloured red (0–2), orange (3–4), yellow (5–6), green (7), cyan (8–9), blue (10–11), violet (12–14). Above the bar: labelled examples at their pH positions — stomach acid (1.5), lemon (2.5), vinegar (3), normal rain (5.6), water (7), blood (7.4), baking soda (8.3), bleach (12). Below: text arrow showing 'increasing acidity' pointing left and 'increasing basicity' pointing right.",
      key_takeaway:
        "pH 0–7 is acidic, 7 is neutral, 7–14 is basic. Each unit is a 10× change. Key value: tooth enamel erodes below pH 5.5; stomach has pH 1.5–2; blood pH 7.4. Universal indicator shows colour range across the scale.",
    },
  },

  {
    topicId: "sci_ch2_acids_reactions",
    subject: "Science",
    chapterNumber: 2,
    name: "Reactions of Acids — With Metals, Metal Carbonates and Bases",
    prerequisite_knowledge: [
      "pH scale and definition of acids",
      "Reactivity series of metals",
      "Gas tests: H₂ (burning splint), CO₂ (lime water), SO₂ (smell)",
    ],
    key_formulas: [
      "Acid + Metal → Salt + Hydrogen gas: 2HCl + Zn → ZnCl₂ + H₂↑",
      "Acid + Metal oxide → Salt + Water: H₂SO₄ + CuO → CuSO₄ + H₂O",
      "Acid + Metal carbonate → Salt + Water + CO₂: HCl + Na₂CO₃ → 2NaCl + H₂O + CO₂↑",
      "Acid + Metal bicarbonate → Salt + Water + CO₂: HCl + NaHCO₃ → NaCl + H₂O + CO₂↑",
      "Acid + Base (neutralisation) → Salt + Water: NaOH + HCl → NaCl + H₂O",
      "Dilution: always add acid to water, never water to acid (exothermic — can splash)",
    ],
    teaching_content: {
      intuition:
        "Acids are proton donors — they want to give away H⁺ ions. Metals grab those H⁺ ions and release hydrogen gas (H₂). Carbonates are attacked by acid and fizz (CO₂). Bases neutralise acids because OH⁻ and H⁺ combine to form water. Every acid reaction follows the same logic: the acid's H⁺ is replaced by a metal ion.",
      process_explanation:
        "1. ACID + METAL → Salt + H₂ gas\n   Only metals above hydrogen in the reactivity series react with dilute acids.\n   Zn + H₂SO₄ → ZnSO₄ + H₂↑ (fizzing, gas burns with a pop with a burning splint)\n   Note: Cu, Ag, Au do NOT react with dilute acids (below H in reactivity series).\n2. ACID + METAL OXIDE (base) → Salt + Water\n   CuO + H₂SO₄ → CuSO₄ + H₂O\n   This is a neutralisation-type reaction (metal oxide is a base).\n3. ACID + METAL CARBONATE → Salt + Water + CO₂\n   Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂↑\n   Test: CO₂ turns lime water (Ca(OH)₂) milky.\n4. ACID + METAL BICARBONATE → Salt + Water + CO₂\n   NaHCO₃ + HCl → NaCl + H₂O + CO₂↑\n5. ACID + BASE (NEUTRALISATION) → Salt + Water\n   NaOH + HCl → NaCl + H₂O\n   In ionic form: H⁺ + OH⁻ → H₂O",
      worked_example:
        "Question: What happens when dilute sulphuric acid reacts with zinc granules? Write equation and state observations.\nObservations: Zinc granules dissolve; colourless gas with 'pop' sound on burning splint; solution becomes colourless ZnSO₄.\nEquation: Zn(s) + H₂SO₄(aq) → ZnSO₄(aq) + H₂(g)↑\nIdentification of gas: H₂ burns with a pop (not a continuous flame) — this is the standard test for hydrogen gas.",
      common_misconceptions: [
        "All metals react with dilute acids to give H₂ — copper, silver, gold do NOT (they are below hydrogen in reactivity series).",
        "Carbonate and bicarbonate reactions produce the same products but carbonates need 2 moles of acid per mole of carbonate, bicarbonates need 1 mole.",
        "Neutralisation always produces NaCl — the salt produced depends on the acid and base used; H₂SO₄ + NaOH gives Na₂SO₄, not NaCl.",
      ],
      shortcuts_and_tricks: [
        "MOBB: Metal + Acid → Salt + H₂. Metal Oxide + Acid → Salt + Water. Both Carbonates and Bicarbonates + Acid → Salt + Water + CO₂.",
        "Gas test shortcuts: H₂ = pop (burning splint), CO₂ = milky lime water, Cl₂ = bleaches moist litmus.",
        "Naming salts: HCl gives chlorides, H₂SO₄ gives sulphates, HNO₃ gives nitrates, H₃PO₄ gives phosphates.",
      ],
      diagram_description:
        "A 2×2 grid of reaction diagrams. Top-left: zinc granules in a test tube of dilute HCl, bubbles rising, labelled 'H₂ gas — pop test'. Top-right: marble chips (CaCO₃) in HCl, gas bubbling through lime water turning milky, labelled 'CO₂ test'. Bottom-left: black CuO powder added to hot H₂SO₄, solution turning blue (CuSO₄), labelled 'Metal oxide + acid'. Bottom-right: NaOH + HCl mixing, universal indicator turning green (neutral), labelled 'Neutralisation'.",
      key_takeaway:
        "Acids react with metals (→ H₂), metal carbonates/bicarbonates (→ CO₂), metal oxides and bases (→ salt + water). The key product pattern: acid replaces its H⁺ with a metal ion to form the corresponding salt.",
    },
  },

  {
    topicId: "sci_ch2_salts",
    subject: "Science",
    chapterNumber: 2,
    name: "Salts — NaCl, Chlor-alkali Process, Baking Soda, Washing Soda, Bleaching Powder, Plaster of Paris",
    prerequisite_knowledge: [
      "Definition of salt as a product of acid-base reaction",
      "Electrolysis concept (splitting by electricity)",
      "Concept of hydration and crystallisation",
    ],
    key_formulas: [
      "Chlor-alkali process: 2NaCl(aq) + 2H₂O(l) →(electrolysis) Cl₂(g) + H₂(g) + 2NaOH(aq)",
      "Baking soda: NaHCO₃ — made by Solvay process",
      "Washing soda: Na₂CO₃·10H₂O (sodium carbonate decahydrate)",
      "Bleaching powder: Ca(OCl)Cl or CaOCl₂ — made from Ca(OH)₂ + Cl₂",
      "Plaster of Paris: CaSO₄·½H₂O — made by heating gypsum (CaSO₄·2H₂O)",
      "Setting of POP: CaSO₄·½H₂O + 1½H₂O → CaSO₄·2H₂O (gypsum)",
    ],
    teaching_content: {
      intuition:
        "Common salt (NaCl) is the most important salt — not just for cooking, but as the raw material for making Cl₂, H₂, and NaOH through electrolysis (chlor-alkali process). From these three products, the world manufactures plastics, bleach, and soaps. Baking soda makes your cake rise; washing soda softens hard water; bleaching powder disinfects swimming pools; Plaster of Paris sets into a hard cast because it rehydrates back to gypsum.",
      process_explanation:
        "1. CHLOR-ALKALI PROCESS (electrolysis of brine — saturated NaCl solution):\n   Products: Cl₂ at anode, H₂ at cathode, NaOH in solution.\n   Uses: Cl₂ → bleaching powder, PVC, disinfectants. H₂ → fuel, margarine. NaOH → paper, soap, detergents.\n2. BAKING SODA (Sodium bicarbonate, NaHCO₃):\n   Used in baking (releases CO₂ when heated, making cakes fluffy). Mild non-corrosive base.\n   NaHCO₃ + HCl → NaCl + H₂O + CO₂↑\n   Also used as antacid for stomach acidity.\n3. WASHING SODA (Sodium carbonate, Na₂CO₃·10H₂O):\n   Used in glass, soap, paper manufacture. Water softener (removes Ca²⁺/Mg²⁺ ions from hard water by precipitation). Laundry cleaning.\n4. BLEACHING POWDER (Ca(OCl)Cl):\n   Made by passing Cl₂ over dry slaked lime: Ca(OH)₂ + Cl₂ → CaOCl₂ + H₂O.\n   Used for bleaching cotton/linen, disinfecting water supplies.\n5. PLASTER OF PARIS (CaSO₄·½H₂O):\n   Made by heating gypsum to ~120°C: CaSO₄·2H₂O →(120°C) CaSO₄·½H₂O + 3/2 H₂O\n   Setting (hardens): CaSO₄·½H₂O + 3/2 H₂O → CaSO₄·2H₂O (gypsum)\n   Used in medical casts, blackboard chalk, building decoration.\n   NOTE: Do not heat beyond 200°C — produces dead burnt plaster (anhydrous CaSO₄) which does not set.",
      worked_example:
        "Question: Name the products of the chlor-alkali process. Give one use of each product.\nElectrolysis of brine: 2NaCl + 2H₂O → Cl₂ + H₂ + 2NaOH\nProduct 1: Chlorine (Cl₂) — use: manufacture of bleaching powder and PVC plastic.\nProduct 2: Hydrogen (H₂) — use: fuel, manufacture of margarine (hydrogenation of oils).\nProduct 3: Sodium hydroxide (NaOH) — use: manufacturing soap, paper, and as a drain cleaner.",
      common_misconceptions: [
        "Baking soda and baking powder are the same — baking soda is pure NaHCO₃; baking powder is NaHCO₃ + a dry acid (cream of tartar) — it produces CO₂ without needing an acidic ingredient in the recipe.",
        "Plaster of Paris is the same as chalk — chalk is CaCO₃; POP is CaSO₄·½H₂O. They are chemically distinct.",
        "Washing soda cleans by being an acid — it is basic (pH ~11). It cleans by saponifying grease and by softening water (precipitating Ca²⁺ and Mg²⁺ as carbonates).",
      ],
      shortcuts_and_tricks: [
        "Chlor-alkali: 3 products at 3 locations — Cl₂ at anode (+), H₂ at cathode (−), NaOH in solution.",
        "POP formula trick: 'half water' CaSO₄·½H₂O sets by gaining water back to become gypsum (2H₂O).",
        "BWBP acronym for important sodium compounds: Baking soda (NaHCO₃), Washing soda (Na₂CO₃·10H₂O), Bleaching powder (CaOCl₂), Plaster of Paris (CaSO₄·½H₂O).",
      ],
      diagram_description:
        "Chlor-alkali electrolytic cell diagram: a rectangular cell with saturated NaCl (brine) solution. Left electrode (anode, +) with Cl₂ gas bubbles rising, labelled 'Cl₂ — anode'. Right electrode (cathode, −) with H₂ gas bubbles, labelled 'H₂ — cathode'. The bulk solution is labelled 'NaOH formed in solution'. A semipermeable membrane divides the cell to keep Cl₂ and NaOH separate. Below the cell: three arrows labelled with uses of each product.",
      key_takeaway:
        "Chlor-alkali gives Cl₂ (anode), H₂ (cathode), NaOH (solution). NaHCO₃ = baking soda (antacid, leavening). Na₂CO₃·10H₂O = washing soda (water softener). CaOCl₂ = bleaching powder (disinfectant). CaSO₄·½H₂O = Plaster of Paris (sets by absorbing water to become gypsum).",
    },
  },

  // ── Chapter 3: Metals and Non-metals ─────────────────────────────────────────
  {
    topicId: "sci_ch3_physical_properties",
    subject: "Science",
    chapterNumber: 3,
    name: "Physical Properties of Metals and Non-metals",
    prerequisite_knowledge: [
      "Classification of elements as metals and non-metals",
      "Basic concept of electrical conductivity",
      "Difference between lustrous and non-lustrous surfaces",
    ],
    key_formulas: [
      "Density: most metals are dense (except Na, K — float on water)",
      "Malleability: metals can be beaten into sheets (Au, Ag most malleable)",
      "Ductility: metals can be drawn into wires (Au most ductile — 1g → 2km of wire)",
      "Conductivity: all metals conduct heat and electricity (except exceptions)",
    ],
    teaching_content: {
      intuition:
        "Metals have metallic bonding — a 'sea of electrons' that flows freely, which is WHY they conduct electricity and heat. Those same free electrons also reflect light, giving metals their shine (lustre). Non-metals don't have this electron sea, so they are typically dull, brittle, and poor conductors — but there are fascinating exceptions.",
      process_explanation:
        "PHYSICAL PROPERTIES OF METALS:\n1. Lustre: shiny appearance (iron, copper, gold). Exception: Na and K are stored in kerosene because they react with air quickly and lose lustre.\n2. Hardness: most metals are hard. Exception: Na and K are soft enough to cut with a knife.\n3. Malleability: can be beaten into thin sheets. Gold and silver are most malleable. Example: gold foil/vark.\n4. Ductility: can be drawn into wires. Gold is most ductile (1g can be drawn into ~2km of wire). Aluminium and copper widely used in electrical wires.\n5. Conductivity: good conductors of heat and electricity. Best conductors: Ag > Cu > Au > Al. Exception: Lead (Pb) and mercury (Hg) are poor conductors despite being metals.\n6. Melting and boiling points: generally high. Exception: mercury (Hg) is liquid at room temperature (melting point −39°C). Gallium also melts in your hand (~29°C).\n7. Density: generally high. Exception: Na, K, Li are less dense than water.\n8. Sonorous: metals produce a ringing sound when struck.\n\nPHYSICAL PROPERTIES OF NON-METALS:\n1. Not lustrous (dull). Exception: iodine (I₂) has a shiny appearance.\n2. Brittle — not malleable or ductile.\n3. Poor conductors of heat and electricity. Exception: graphite (an allotrope of carbon) is a good conductor of electricity.\n4. Low melting and boiling points (except diamond — highest melting point of any substance).\n5. Low density (most are gases or soft solids).\n6. Not sonorous.",
      worked_example:
        "Question: State two exceptions to the general physical properties of metals and non-metals.\nException 1 (metal): Mercury (Hg) is a metal but exists as a liquid at room temperature — it does not have the typical high melting point of metals.\nException 2 (non-metal): Graphite (allotrope of carbon) is a non-metal but is a good conductor of electricity — used as electrodes in electrolysis and in dry cells.",
      common_misconceptions: [
        "All metals are solid at room temperature — mercury (Hg) is a liquid; gallium is a solid but melts at ~29°C (just above room temperature).",
        "Graphite being a conductor means carbon is a metal — carbon is still classified as a non-metal; graphite is a structural exception due to its layered structure with delocalized electrons.",
        "All non-metals are gases — iodine, carbon (graphite, diamond), sulphur, and phosphorus are solid non-metals at room temperature.",
      ],
      shortcuts_and_tricks: [
        "Exceptions memory: Mercury metal = liquid. Sodium/Potassium = soft metals, float on water. Iodine = shiny non-metal. Graphite = conducting non-metal.",
        "Conductivity order for metals: 'Silver Copper Gold Aluminium' (SCGA) — best to good conductors.",
        "Malleability vs ductility: Malleable = sheets (Mall = flat floor). Ductile = wires (Duct = pipe/wire).",
      ],
      diagram_description:
        "Two-column comparison diagram. Left column 'Metals': icons showing a shiny bar (lustre), a hammer flattening metal (malleability), a thin wire (ductility), a light bulb connected to a metal wire (conductivity), a thermometer showing high melting point. Right column 'Non-metals': dull surface, a brittle breaking solid, a crossed-out wire, a light bulb with X. Exception boxes: Mercury = liquid metal (flask with liquid), Graphite = conducting non-metal (electrode in electrolysis), Iodine = shiny non-metal (purple-grey solid).",
      key_takeaway:
        "Metals are lustrous, hard, malleable, ductile, good conductors, sonorous, high-density, high-melting. Non-metals are the opposite. Key exceptions: Hg (liquid metal), Na/K (soft, low-density metals), graphite (conducting non-metal), iodine (lustrous non-metal).",
    },
  },

  {
    topicId: "sci_ch3_reactivity_series",
    subject: "Science",
    chapterNumber: 3,
    name: "Reactivity Series of Metals and Displacement Reactions",
    prerequisite_knowledge: [
      "Concept of oxidation (loss of electrons) in metal reactions",
      "Basic ionic equations — metal forming cation in solution",
      "Displacement reactions from Chapter 1",
    ],
    key_formulas: [
      "Reactivity series (decreasing reactivity): K > Na > Ca > Mg > Al > Zn > Fe > Pb > H > Cu > Hg > Ag > Au",
      "Displacement: Zn + CuSO₄ → ZnSO₄ + Cu  (Zn above Cu in series)",
      "No reaction: Cu + ZnSO₄ → No reaction  (Cu below Zn in series)",
      "With water: Na + H₂O → NaOH + ½H₂ (vigorous); Mg + H₂O → MgO + H₂ (only with steam)",
      "Thermite reaction: Fe₂O₃ + 2Al → Al₂O₃ + 2Fe + heat (Al displaces Fe — highly exothermic)",
    ],
    teaching_content: {
      intuition:
        "The reactivity series is like a league table for metals. A metal higher in the table can 'beat' (displace) any metal below it from a salt solution. This is because higher metals lose electrons more easily — they are better at being oxidised. A metal near the top (K, Na) reacts explosively with water; one near the bottom (Au, Ag) does not react with anything except special acids.",
      process_explanation:
        "1. THE REACTIVITY SERIES (from most to least reactive):\n   K → Na → Ca → Mg → Al → Zn → Fe → Pb → H → Cu → Hg → Ag → Au\n   Mnemonic: 'King Narendra Can Make A Zebra Fat Possibly However Clever Students Are Good'\n2. REACTIONS WITH WATER:\n   - K, Na, Ca react with cold water vigorously → metal hydroxide + H₂\n     2Na + 2H₂O → 2NaOH + H₂↑ (sodium floats, melts, may ignite)\n   - Mg, Al, Zn, Fe react with steam only → metal oxide + H₂\n   - Cu, Hg, Ag, Au do NOT react with water or steam\n3. REACTIONS WITH DILUTE ACIDS:\n   - Metals above H react with dilute acids → salt + H₂\n   - Metals below H (Cu, Hg, Ag, Au) do NOT react with dilute HCl or H₂SO₄\n4. DISPLACEMENT REACTIONS:\n   A more reactive metal displaces a less reactive one from its salt solution.\n   Fe + CuSO₄ → FeSO₄ + Cu (blue → pale green; copper deposits on iron)\n   Cu + FeSO₄ → No reaction (Cu is below Fe)\n5. THERMITE REACTION: Fe₂O₃ + 2Al → Al₂O₃ + 2Fe + enormous heat\n   (used to weld railway tracks — the reaction is so exothermic it melts iron)",
      worked_example:
        "Question: Will aluminium displace zinc from zinc sulphate solution? Give reason and equation.\nStep 1: Check positions — Al is ABOVE Zn in the reactivity series (Al > Zn).\nStep 2: More reactive metal displaces less reactive → YES, Al will displace Zn.\nEquation: 2Al(s) + 3ZnSO₄(aq) → Al₂(SO₄)₃(aq) + 3Zn(s)\nObservation: Grey zinc metal deposits on the aluminium piece; solution colour changes.",
      common_misconceptions: [
        "Hydrogen is a metal in the reactivity series — H is placed there as a reference point only; it is NOT a metal. Metals above H displace it from acids.",
        "Aluminium should be more reactive than zinc because it is higher — this is correct for the series, but aluminium has a protective oxide layer (Al₂O₃) that prevents rapid reaction in everyday conditions.",
        "More reactive metals always react faster visibly — potassium reacts explosively with water while iron rusts very slowly. Reactivity depends on conditions (concentration, temperature, surface area).",
      ],
      shortcuts_and_tricks: [
        "Reactivity series mnemonic: 'King Narendra Can Make A Zebra Fat Possibly However Clever Students Are Good' (K Na Ca Mg Al Zn Fe Pb H Cu Hg Ag Au).",
        "Quick rule: if metal A is above metal B in the series, A displaces B from B's salt solution.",
        "Thermite = Al + Fe₂O₃ → most exothermic displacement — 'AL-ways the most hot-tempered reaction'.",
      ],
      diagram_description:
        "Reactivity series pyramid diagram: a vertical triangle divided into horizontal bands. Top band (most reactive): K, Na, Ca — labelled 'react with cold water + steam + acids'. Middle-upper band: Mg, Al, Zn, Fe — labelled 'react with steam + acids'. Middle-lower band: Pb, H (reference line), Cu — labelled 'react with acids (above H only)'. Bottom band: Hg, Ag, Au — labelled 'very low reactivity, no reaction with acids'. On the right side: a test tube showing Fe nail in blue CuSO₄ turning green with copper deposit, illustrating displacement.",
      key_takeaway:
        "Reactivity series: K>Na>Ca>Mg>Al>Zn>Fe>Pb>H>Cu>Hg>Ag>Au. A higher metal displaces a lower one from its salt solution. Metals above H react with dilute acids to release H₂. Thermite (Al + Fe₂O₃) is the most important displacement example at high school level.",
    },
  },

  {
    topicId: "sci_ch3_ionic_bonding",
    subject: "Science",
    chapterNumber: 3,
    name: "Ionic Bonding — Electron Transfer, Cation/Anion Formation, Properties of Ionic Compounds",
    prerequisite_knowledge: [
      "Electronic configuration of elements (first 20 elements)",
      "Concept of valence electrons and octet rule",
      "Difference between atoms and ions",
    ],
    key_formulas: [
      "Na → Na⁺ + e⁻  (sodium loses 1 electron, becomes cation)",
      "Cl + e⁻ → Cl⁻  (chlorine gains 1 electron, becomes anion)",
      "Na⁺ + Cl⁻ → NaCl (electrostatic attraction between oppositely charged ions)",
      "Mg → Mg²⁺ + 2e⁻  (magnesium loses 2 electrons)",
      "O + 2e⁻ → O²⁻  (oxygen gains 2 electrons)",
      "Mg²⁺ + O²⁻ → MgO",
    ],
    teaching_content: {
      intuition:
        "Ionic bonding is like a giving-and-receiving relationship. Metals on the left of the periodic table have 1, 2, or 3 valence electrons that they 'want' to lose (to achieve the noble gas configuration). Non-metals on the right need 1, 2, or 3 electrons to complete their shell. Metal gives electrons to non-metal → both become stable ions → opposite charges attract → ionic bond forms.",
      process_explanation:
        "1. ELECTRON TRANSFER:\n   - Metals LOSE valence electrons → become positively charged cations (e.g., Na⁺, Ca²⁺, Al³⁺).\n   - Non-metals GAIN electrons → become negatively charged anions (e.g., Cl⁻, O²⁻, S²⁻).\n   - The transfer achieves noble gas electronic configuration for both ions.\n2. FORMATION OF NaCl:\n   Na: 2,8,1 → loses 1e⁻ → Na⁺: 2,8 (like Ne configuration)\n   Cl: 2,8,7 → gains 1e⁻ → Cl⁻: 2,8,8 (like Ar configuration)\n   Na⁺ and Cl⁻ attract electrostatically → form NaCl crystal lattice.\n3. FORMATION OF MgO:\n   Mg: 2,8,2 → loses 2e⁻ → Mg²⁺: 2,8\n   O: 2,6 → gains 2e⁻ → O²⁻: 2,8\n   Mg²⁺ + O²⁻ → MgO\n4. PROPERTIES OF IONIC COMPOUNDS:\n   a) High melting and boiling points (strong electrostatic forces need lots of energy to break).\n   b) Hard but brittle (ions in fixed lattice; layers shift under force → like charges face → repel → shatter).\n   c) Conduct electricity in molten state or aqueous solution (ions can move freely), NOT in solid state (ions fixed).\n   d) Generally soluble in polar solvents (water) but insoluble in non-polar solvents (organic solvents).",
      worked_example:
        "Question: Show the formation of CaCl₂ by electron transfer.\nStep 1: Ca electronic configuration: 2,8,8,2 → loses 2 electrons → Ca²⁺ (2,8,8).\nStep 2: Cl configuration: 2,8,7 → gains 1 electron → Cl⁻ (2,8,8). Need 2 Cl atoms for 2 electrons.\nStep 3: Ca²⁺ + 2Cl⁻ → CaCl₂ (one Ca²⁺ for every two Cl⁻ to balance charges).\nDiagram: Ca atom with 2 arrows showing 2 electrons being donated, one to each Cl atom.",
      common_misconceptions: [
        "Ionic bonds involve sharing of electrons — that is covalent bonding. Ionic bonds involve TRANSFER (one atom completely gives, the other completely receives).",
        "Ionic compounds conduct electricity in solid state — they do NOT. Ions in a solid lattice are fixed. Conduction requires mobile charged particles.",
        "Losing electrons makes a metal negative — losing electrons means fewer negative charges, so the species becomes POSITIVE (cation).",
      ],
      shortcuts_and_tricks: [
        "Metal = cation (positive, loses e⁻). Non-metal = anion (negative, gains e⁻). 'Metals leave, non-metals take'.",
        "Charge balance in formula: Ca²⁺ + Cl⁻ → need 2 Cl⁻ per Ca²⁺ → CaCl₂. Al³⁺ + O²⁻ → need 2 Al³⁺ and 3 O²⁻ → Al₂O₃ (cross-multiply charges).",
        "Ionic solids conduct in melt/solution (ions free to move) but NOT in solid state (ions locked in lattice).",
      ],
      diagram_description:
        "Electron dot structure (Lewis) diagram for NaCl formation. Left: Na atom with electron configuration shown, one valence electron in outer shell highlighted with an arrow. Right: Cl atom with 7 valence electrons, a gap for one more. Arrow shows the single electron transferring from Na to Cl. Result: Na⁺ ion (empty outer shell, positive charge label) and Cl⁻ ion (full outer shell, negative charge label). Between them: 'electrostatic attraction' double-headed arrow. Below: a 3D NaCl crystal lattice showing alternating Na⁺ (grey spheres) and Cl⁻ (green spheres) in a cubic arrangement.",
      key_takeaway:
        "Ionic bonds form when metals transfer electrons to non-metals. Metal → cation (positive); non-metal → anion (negative). Ionic compounds: high melting point, hard but brittle, conduct only when molten or dissolved (not in solid state).",
    },
  },

  {
    topicId: "sci_ch3_extraction_metallurgy",
    subject: "Science",
    chapterNumber: 3,
    name: "Extraction of Metals — Reactivity-Based Methods, Electrolytic Refining, Alloys, Corrosion Prevention",
    prerequisite_knowledge: [
      "Reactivity series of metals",
      "Concept of reduction (gain of electrons / loss of oxygen)",
      "Concept of electrolysis",
    ],
    key_formulas: [
      "Low reactivity (Cu, Ag, Hg): heating ore in air — Cu₂S + O₂ → 2Cu + SO₂",
      "Medium reactivity (Zn, Fe, Pb): reduction with carbon — ZnO + C → Zn + CO",
      "Medium reactivity (Fe): Fe₂O₃ + 3CO → 2Fe + 3CO₂ (blast furnace)",
      "High reactivity (Na, Ca, Al): electrolytic reduction — Al₂O₃ → 2Al + 3/2 O₂",
      "Electrolytic refining: anode (impure metal) → M²⁺ + 2e⁻; cathode: M²⁺ + 2e⁻ → M (pure)",
    ],
    teaching_content: {
      intuition:
        "To extract a metal from its ore, you need to REDUCE it (remove oxygen or add electrons). The more reactive a metal, the harder it is to reduce — it clings to oxygen tightly. Less reactive metals let go easily (just heat). More reactive ones need carbon reduction. The most reactive (Na, Al) need electricity to tear them away from their compounds.",
      process_explanation:
        "1. LOW REACTIVITY METALS (Cu, Hg, Ag — below Zn in series):\n   - Simply heating their sulphide or oxide ores in air gives the free metal.\n   - Example: 2HgS + 3O₂ → 2HgO + 2SO₂; HgO → Hg + ½O₂ (further heating)\n   - Cu₂S + O₂ → 2Cu + SO₂\n2. MEDIUM REACTIVITY METALS (Zn, Fe, Pb, Sn):\n   - Reduced using carbon (coke) or CO at high temperatures.\n   - ZnO + C → Zn + CO (at 1200°C)\n   - Fe extraction in BLAST FURNACE: Fe₂O₃ + 3CO → 2Fe + 3CO₂. Limestone added to remove silica impurities (CaCO₃ → CaO + CO₂; CaO + SiO₂ → CaSiO₃ = slag).\n3. HIGH REACTIVITY METALS (Na, Ca, Mg, Al — above carbon in series):\n   - Carbon cannot reduce these (they are more reactive than carbon).\n   - ELECTROLYTIC REDUCTION used: e.g., aluminium from molten Al₂O₃ (bauxite after purification), using cryolite to lower melting point.\n4. ELECTROLYTIC REFINING (purification of metals):\n   - Impure metal = anode. Pure metal = cathode. Electrolyte = metal salt solution.\n   - Anode dissolves (loses electrons), cathode deposits pure metal (gains electrons).\n   - Impurities (noble metals like gold) collect below anode as 'anode mud'.\n5. ALLOYS:\n   - Mixture of two or more metals (or metal + non-metal).\n   - Bronze: Cu + Sn. Brass: Cu + Zn. Stainless steel: Fe + C + Cr + Ni. Solder: Pb + Sn. Amalgam: Hg + other metals.\n   - Alloys are harder, more corrosion-resistant, and have better properties than pure metals.\n6. CORROSION PREVENTION:\n   - Painting, electroplating, galvanising (coating with Zn), alloying, oiling/greasing.",
      worked_example:
        "Question: Explain electrolytic refining of copper with a diagram description.\nSetup: Anode = impure copper block. Cathode = thin pure copper strip. Electrolyte = CuSO₄ solution (acidified with H₂SO₄).\nAt anode: Cu → Cu²⁺ + 2e⁻ (impure copper dissolves into solution)\nAt cathode: Cu²⁺ + 2e⁻ → Cu (pure copper deposits)\nNet result: Copper transfers from impure anode to pure cathode. Gold, silver, platinum impurities settle as anode mud below the anode.",
      common_misconceptions: [
        "All metals can be extracted by heating with carbon — Na, Ca, Mg, Al are more reactive than carbon, so carbon cannot reduce them. Electrolysis is the only option.",
        "Galvanising means coating with gold — galvanising is coating with ZINC (Zn), not gold. The word comes from Luigi Galvani (electricity pioneer).",
        "Alloys are compounds — alloys are MIXTURES, not compounds. Their composition can vary; they do not have a fixed ratio.",
      ],
      shortcuts_and_tricks: [
        "Extraction method by reactivity: LOW = heat; MEDIUM = carbon/CO; HIGH = electrolysis. 'LMH: heat, carbon, electrolysis'.",
        "Electrolytic refining: ANODE = impure (dissolves), CATHODE = pure (deposits). 'A for A: Anode = impure, deposits pure at C'.",
        "Common alloys to remember: Brass (Cu+Zn), Bronze (Cu+Sn), Solder (Pb+Sn), Stainless steel (Fe+Cr+Ni+C).",
      ],
      diagram_description:
        "Electrolytic refining setup diagram: a rectangular electrolytic cell filled with CuSO₄ electrolyte solution. On the left: a large impure copper block labelled 'Anode (+)' with an arrow showing it dissolving. On the right: a thin pure copper strip labelled 'Cathode (−)' with an arrow showing copper depositing. At the bottom of the anode: a small pile labelled 'anode mud (gold, silver impurities)'. Above the cell: a battery symbol connected to both electrodes. Equations written at each electrode.",
      key_takeaway:
        "Extraction method depends on reactivity: low → heat, medium → carbon reduction, high → electrolysis. Electrolytic refining purifies metals (impure anode dissolves, pure cathode gains metal). Alloys (mixtures) improve metal properties. Galvanising (Zn coat) prevents iron corrosion.",
    },
  },

  // ── Chapter 4: Carbon and its Compounds ──────────────────────────────────────
  {
    topicId: "sci_ch4_covalent_bonding",
    subject: "Science",
    chapterNumber: 4,
    name: "Covalent Bonding in Carbon — Tetravalency, Catenation, and Structural Formulas",
    prerequisite_knowledge: [
      "Electronic configuration of carbon (2,4)",
      "Concept of electron sharing in covalent bonds",
      "Difference between ionic and covalent bonding",
    ],
    key_formulas: [
      "Carbon valency = 4 (tetravalency) — carbon forms exactly 4 bonds",
      "Single bond: C–C (one shared pair, σ bond)",
      "Double bond: C=C (two shared pairs, 1σ + 1π)",
      "Triple bond: C≡C (three shared pairs, 1σ + 2π)",
      "Methane: CH₄ (tetrahedral, bond angle 109.5°)",
      "Ethene: CH₂=CH₂ (planar, double bond)",
      "Ethyne: CH≡CH (linear, triple bond)",
    ],
    teaching_content: {
      intuition:
        "Carbon is the ultimate building block because it has exactly 4 valence electrons — not too many to lose, not too few to gain. So it SHARES all 4 in covalent bonds. This lets it bond with 4 other atoms, including other carbon atoms, forming chains, branches, and rings. This self-linking property (catenation) is why millions of organic compounds exist.",
      process_explanation:
        "1. TETRAVALENCY: Carbon has atomic number 6, electronic configuration 2,4. It has 4 valence electrons. To complete its octet, it forms 4 covalent bonds (shares 4 electron pairs).\n2. CATENATION: Carbon atoms can bond with each other to form long chains, branched chains, and rings. No other element does this as extensively as carbon. This is why carbon forms millions of compounds.\n3. TYPES OF BONDS IN CARBON COMPOUNDS:\n   - Single bond (C–C): one shared pair. Saturated compounds.\n   - Double bond (C=C): two shared pairs. Unsaturated — alkenes.\n   - Triple bond (C≡C): three shared pairs. Unsaturated — alkynes.\n4. STRUCTURAL FORMULAS:\n   - Displayed formula: shows every atom and every bond explicitly.\n   - Condensed formula: CH₃–CH₂–CH₃ (propane).\n   - Molecular formula: C₃H₈.\n5. ALLOTROPES OF CARBON:\n   - Diamond: each carbon bonded to 4 others in 3D tetrahedral network → hardest natural substance, no free electrons → insulator.\n   - Graphite: each carbon bonded to 3 others in 2D hexagonal layers, 4th electron delocalized → conductor of electricity, layers slide → lubricant.\n   - Fullerene (C₆₀): cage-like spherical structure.",
      worked_example:
        "Draw the structural formula of ethane (C₂H₆) and explain why it is saturated.\nMolecular formula: C₂H₆.\nStructure: H₃C–CH₃ (each carbon has 4 bonds: 3 to H, 1 to other C).\nH H\n| |\nH–C–C–H\n| |\nH H\nWhy saturated: all carbon-carbon bonds are single bonds (C–C). No double or triple bonds. The compound has the maximum possible number of hydrogen atoms for 2 carbons. It will NOT decolourise bromine water (test for unsaturation).",
      common_misconceptions: [
        "Carbon forms 2 bonds because it has 2 unpaired electrons in ground state — in excited state carbon uses 4 electrons (sp³ hybridisation); for Class 10 purposes, carbon always forms 4 bonds.",
        "Diamond and graphite are different elements — both are PURE CARBON, just arranged differently (allotropes). Same element, different structures, vastly different properties.",
        "All carbon compounds are gases — most organic compounds are liquids or solids at room temperature (e.g., ethanol is a liquid, naphthalene is a solid).",
      ],
      shortcuts_and_tricks: [
        "Tetravalency = 4 bonds. C has 4 valence electrons → always forms 4 bonds. Never 2 or 6.",
        "Catenation rule: only carbon (and to a lesser extent Si, S) chains with itself extensively. This is WHY organic chemistry is enormous.",
        "Diamond vs graphite: Diamond = 4 bonds each C → hard, insulator. Graphite = 3 bonds each C + 1 free electron → soft, conductor.",
      ],
      diagram_description:
        "Side-by-side structural diagrams. Left: diamond unit cell — each carbon atom shown with 4 bonds to neighbouring carbons in a 3D tetrahedral arrangement, labelled 'Diamond: 4 C–C bonds, hardest substance, insulator'. Right: graphite structure — flat hexagonal layers of carbon atoms, each with 3 bonds, delocalized electron shown as a dotted cloud between layers, layers weakly held by van der Waals forces, labelled 'Graphite: 3 C–C bonds + free electron, conductor, lubricant'. Below: CH₄ tetrahedral ball-and-stick model showing bond angle 109.5°.",
      key_takeaway:
        "Carbon's tetravalency (4 bonds) and catenation (C–C chain forming) explain the vast diversity of organic compounds. Single bonds = saturated; double/triple bonds = unsaturated. Diamond (4 bonds, insulator, hard) and graphite (3 bonds + free electron, conductor, soft) are allotropes of carbon.",
    },
  },

  {
    topicId: "sci_ch4_homologous_series",
    subject: "Science",
    chapterNumber: 4,
    name: "Homologous Series — Alkanes, Alkenes, Alkynes, Functional Groups and IUPAC Naming",
    prerequisite_knowledge: [
      "Tetravalency of carbon and covalent bonding",
      "Molecular and structural formulas of basic carbon compounds",
      "Concept of a chemical series",
    ],
    key_formulas: [
      "Alkanes (saturated): CₙH₂ₙ₊₂ — methane CH₄, ethane C₂H₆, propane C₃H₈, butane C₄H₁₀",
      "Alkenes (one C=C): CₙH₂ₙ — ethene C₂H₄, propene C₃H₆, butene C₄H₈",
      "Alkynes (one C≡C): CₙH₂ₙ₋₂ — ethyne C₂H₂, propyne C₃H₄",
      "Functional groups: –OH (alcohol), –COOH (carboxylic acid), –CHO (aldehyde), –CO– (ketone), –Cl (haloalkane)",
      "Each successive member of a homologous series differs by –CH₂– (14 mass units)",
    ],
    teaching_content: {
      intuition:
        "A homologous series is like a family — all members share the same general formula, the same functional group, and similar chemical properties, but each family member is one –CH₂– unit bigger than the previous. As the chain gets longer, the boiling point rises (more surface area, stronger intermolecular forces) and the compound becomes less soluble in water.",
      process_explanation:
        "1. HOMOLOGOUS SERIES: a series of compounds with the same general formula and functional group, where adjacent members differ by –CH₂–.\n   Properties: (a) Same general formula. (b) Same functional group. (c) Similar chemical properties. (d) Gradually changing physical properties (boiling point, solubility, viscosity increase with chain length).\n2. ALKANES (CₙH₂ₙ₊₂):\n   Methane (CH₄) → Ethane (C₂H₆) → Propane (C₃H₈) → Butane (C₄H₁₀) → Pentane (C₅H₁₂)\n   All single bonds, saturated, unreactive (except combustion and substitution).\n3. ALKENES (CₙH₂ₙ):\n   Ethene (C₂H₄) → Propene (C₃H₆) → Butene (C₄H₈)\n   One C=C double bond, unsaturated, undergo addition reactions.\n4. ALKYNES (CₙH₂ₙ₋₂):\n   Ethyne (C₂H₂) → Propyne (C₃H₄)\n   One C≡C triple bond, highly unsaturated.\n5. FUNCTIONAL GROUPS:\n   –OH (hydroxyl): alcohols (ethanol CH₃CH₂OH)\n   –COOH (carboxyl): carboxylic acids (ethanoic acid CH₃COOH)\n   –CHO (aldehyde): methanal (HCHO)\n   –CO– (ketone): propanone (CH₃COCH₃)\n   –Cl (halo): chloromethane (CH₃Cl)\n6. IUPAC NAMING:\n   Step 1: Find longest carbon chain → gives parent name (meth-, eth-, prop-, but-, pent-).\n   Step 2: Identify functional group → gives suffix (-ane, -ene, -yne, -ol, -oic acid).\n   Step 3: Number the chain from the end nearest the functional group.",
      worked_example:
        "Name the compound: CH₃–CH₂–CH₂–OH\nStep 1: Count carbons in longest chain = 3 → parent name 'prop'\nStep 2: Functional group –OH → suffix '-ol'\nStep 3: Number from the –OH end: OH is on carbon 1.\nIUPAC name: Propan-1-ol (commonly called propanol or 1-propanol).\nNote: CH₃CH₂OH (2 carbons, –OH) = Ethanol (ethan-1-ol). CH₃OH (1 carbon, –OH) = Methanol (methanol).",
      common_misconceptions: [
        "Alkenes are named with '-ane' suffix — no. Alkanes end in '-ane' (all single bonds); alkenes end in '-ene' (one double bond); alkynes end in '-yne' (one triple bond).",
        "The general formula of alkenes is CₙH₂ₙ₊₂ (same as alkanes) — alkenes have ONE double bond so they have 2 fewer H atoms: CₙH₂ₙ.",
        "Functional group determines the name suffix but not the reactivity type — the functional group determines BOTH the name AND the characteristic reactions (–OH = alcohol chemistry, –COOH = acid chemistry).",
      ],
      shortcuts_and_tricks: [
        "Carbon chain prefixes (first 5): Meth(1), Eth(2), Prop(3), But(4), Pent(5). Mnemonic: 'My Elf Picked Big Peppers'.",
        "Formula shortcut: Alkanes = add 2 to 2n: CₙH₂ₙ₊₂. Alkenes = exactly 2n: CₙH₂ₙ. Alkynes = subtract 2 from 2n: CₙH₂ₙ₋₂.",
        "Homologous series difference = one –CH₂– unit (molecular mass increase of 14 each time).",
      ],
      diagram_description:
        "A structured table diagram with four rows (Alkanes, Alkenes, Alkynes, Alcohols). Each row shows: general formula, first 3 members with structural formulas drawn out, and the functional group circled. Below the table: a physical property trend graph showing boiling point (y-axis) vs number of carbons (x-axis) with a steadily rising line for alkanes, labelled 'boiling point increases with chain length'. Functional group symbols in boxes: –OH, –COOH, –CHO labelled with their compound class.",
      key_takeaway:
        "Homologous series: same general formula, same functional group, differ by –CH₂–. Alkanes CₙH₂ₙ₊₂ (saturated), alkenes CₙH₂ₙ (one C=C), alkynes CₙH₂ₙ₋₂ (one C≡C). Key functional groups: –OH (alcohol), –COOH (carboxylic acid). IUPAC: longest chain + functional group suffix.",
    },
  },

  {
    topicId: "sci_ch4_carbon_reactions",
    subject: "Science",
    chapterNumber: 4,
    name: "Chemical Reactions of Carbon Compounds — Combustion, Oxidation, Addition, Substitution",
    prerequisite_knowledge: [
      "Types of covalent bonds (single, double, triple)",
      "Concept of oxidation and reduction",
      "Homologous series — alkanes and alkenes",
    ],
    key_formulas: [
      "Complete combustion: CH₄ + 2O₂ → CO₂ + 2H₂O + heat (clean blue flame)",
      "Incomplete combustion: 2CH₄ + 3O₂ → 2CO + 4H₂O (sooty yellow flame, CO formed)",
      "Oxidation of ethanol: CH₃CH₂OH →(alkaline KMnO₄ or K₂Cr₂O₇) CH₃COOH (ethanoic acid)",
      "Addition (hydrogenation): CH₂=CH₂ + H₂ →(Ni catalyst, heat) CH₃–CH₃",
      "Addition (bromine water test): CH₂=CH₂ + Br₂ → CH₂Br–CH₂Br (decolourises orange bromine water)",
      "Substitution: CH₄ + Cl₂ →(sunlight) CH₃Cl + HCl",
    ],
    teaching_content: {
      intuition:
        "Carbon compounds react in four main ways. Combustion releases energy (every fuel burns). Oxidation upgrades alcohols to acids. Addition reactions are special to unsaturated compounds — the double bond opens up like a zipper and adds new atoms. Substitution swaps out hydrogen atoms in saturated compounds when a catalyst (sunlight) is present.",
      process_explanation:
        "1. COMBUSTION:\n   - Complete combustion (excess O₂): carbon compound → CO₂ + H₂O + heat. Clean blue flame.\n   - Incomplete combustion (limited O₂): → CO (poisonous) + soot (C). Sooty yellow/orange flame.\n   - All hydrocarbons combust; the products tell you about oxygen supply.\n2. OXIDATION:\n   - Alcohols can be oxidised (using acidified KMnO₄ or K₂Cr₂O₇) to carboxylic acids.\n   - CH₃CH₂OH → CH₃COOH (ethanol → ethanoic acid)\n   - Purple KMnO₄ is decolourised, indicating oxidation.\n3. ADDITION REACTIONS (only unsaturated compounds — alkenes, alkynes):\n   - Hydrogenation: C=C + H₂ → C–C (catalyst: Ni, Pd, Pt at heat). Used in making vegetable ghee from oils.\n   - Halogenation: C=C + Br₂ → C(Br)–C(Br). Orange bromine water → colourless. Test for unsaturation.\n4. SUBSTITUTION REACTIONS (only saturated compounds — alkanes):\n   - One H replaced by another atom (usually halogen), in presence of sunlight.\n   - CH₄ + Cl₂ →(UV light) CH₃Cl + HCl (chloromethane + hydrochloric acid)\n   - Free radical mechanism (not needed in detail for Class 10 CBSE).",
      worked_example:
        "Question: Ethene (C₂H₄) is bubbled through bromine water. What is observed? Write the equation.\nObservation: Orange/brown colour of bromine water is DECOLOURISED (becomes colourless).\nEquation: CH₂=CH₂ + Br₂ → CH₂Br–CH₂Br (1,2-dibromoethane)\nExplanation: The C=C double bond breaks and each carbon bonds with one Br atom — this is an addition reaction. The test with bromine water distinguishes unsaturated from saturated compounds (saturated compounds do NOT decolourise bromine water).",
      common_misconceptions: [
        "All carbon compounds burn with a sooty flame — only incomplete combustion produces soot. With sufficient oxygen, carbon compounds burn cleanly with a blue flame producing CO₂ and H₂O.",
        "Addition reactions occur in alkanes too — NO. Addition reactions require a double or triple bond (unsaturated compounds). Alkanes undergo SUBSTITUTION, not addition.",
        "Hydrogenation always produces a saturated compound — yes, adding H₂ across a C=C converts it to C–C (saturated), which is why vegetable oils (unsaturated) are hardened to ghee/margarine (saturated) by catalytic hydrogenation.",
      ],
      shortcuts_and_tricks: [
        "COAS mnemonic for carbon reactions: Combustion, Oxidation, Addition, Substitution.",
        "Bromine water test: decolourises = unsaturated (alkene/alkyne). No change = saturated (alkane).",
        "Acidified KMnO₄: purple → colourless = oxidation has occurred (converts alcohol to acid, or acts as test for unsaturation).",
      ],
      diagram_description:
        "Four mini-reaction diagrams in a 2×2 grid. Top-left: 'Combustion' — methane flame, excess O₂ → blue flame + CO₂ + H₂O; limited O₂ → yellow flame + CO + soot. Top-right: 'Oxidation' — ethanol molecule → ethanoic acid, purple KMnO₄ turning colourless, with oxidant label. Bottom-left: 'Addition' — ethene C=C + Br₂ → dibromoethane, orange bromine water turning colourless test tube shown. Bottom-right: 'Substitution' — methane + Cl₂ under sunlight (UV arrow) → chloromethane + HCl, with 'saturated compounds only' label.",
      key_takeaway:
        "Four reactions: Combustion (all carbon compounds + O₂ → CO₂ + H₂O). Oxidation (alcohol → acid with KMnO₄). Addition (unsaturated C=C + H₂/Br₂ — bromine water test). Substitution (saturated C–H + Cl₂/sunlight → swap H for Cl).",
    },
  },

  {
    topicId: "sci_ch4_ethanol_and_ethanoic_acid",
    subject: "Science",
    chapterNumber: 4,
    name: "Ethanol and Ethanoic Acid — Properties, Esterification, Soaps vs Detergents, Micelle Structure",
    prerequisite_knowledge: [
      "Functional groups –OH (alcohol) and –COOH (carboxylic acid)",
      "Basic understanding of oxidation reactions of carbon compounds",
      "Concept of surface tension and hydrophilic/hydrophobic interactions",
    ],
    key_formulas: [
      "Ethanol: C₂H₅OH (or CH₃CH₂OH)",
      "Ethanoic acid (acetic acid): CH₃COOH",
      "Esterification: CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O (conc. H₂SO₄ catalyst, heat)",
      "Ester ethyl ethanoate: CH₃COOC₂H₅ (fruity smell)",
      "Saponification: fat/oil + NaOH → soap (sodium salt of fatty acid) + glycerol",
      "Soap molecule: long non-polar hydrocarbon tail (hydrophobic) + polar COO⁻Na⁺ head (hydrophilic)",
    ],
    teaching_content: {
      intuition:
        "Ethanol is the alcohol in beverages and hand sanitisers. Ethanoic acid is the acid in vinegar. When you mix them with a few drops of concentrated H₂SO₄ and heat, you get an ester — a fruity-smelling compound. Soaps work by the same chemical principle: one end loves water (hydrophilic head), the other end loves oil (hydrophobic tail). The soap molecule traps oil in a micelle (a tiny ball) and water washes it away.",
      process_explanation:
        "1. ETHANOL (C₂H₅OH):\n   - Colourless liquid, bp 78°C, miscible with water in all proportions.\n   - Made by fermentation of glucose: C₆H₁₂O₆ →(yeast) 2C₂H₅OH + 2CO₂\n   - Properties: reacts with Na to give H₂; oxidised to CH₃COOH; undergoes esterification.\n   - DENATURED ALCOHOL: ethanol unfit for drinking by adding methanol or other poisons — used as industrial solvent (to avoid beverage tax).\n2. ETHANOIC ACID (CH₃COOH) — acetic acid:\n   - Colourless liquid, characteristic vinegar smell, bp 118°C.\n   - Freezes at 16.6°C → pure ethanoic acid is called GLACIAL ACETIC ACID (freezes like ice in cold winters).\n   - Weak acid: partially dissociates in water → pH ~ 3–4.\n   - Reacts with Na₂CO₃: CH₃COOH + Na₂CO₃ → CH₃COONa + H₂O + CO₂↑ (fizzes).\n3. ESTERIFICATION:\n   Acid + Alcohol ⇌ Ester + Water (reversible, catalyst: conc. H₂SO₄, gentle heating).\n   CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O\n   Ester (ethyl ethanoate) has a sweet fruity smell. Used in perfumes, food flavourings.\n   Reverse: ester + water → acid + alcohol (hydrolysis/saponification with NaOH).\n4. SOAPS AND DETERGENTS:\n   SOAP: sodium or potassium salt of a long-chain fatty acid. Made by saponification (fat/oil + NaOH).\n   Structure: –COO⁻Na⁺ (hydrophilic ionic head) + long carbon chain R– (hydrophobic tail).\n   DETERGENTS: sodium salts of long-chain sulphonic acids. R–SO₃⁻Na⁺.\n5. MICELLE STRUCTURE:\n   - In water, soap molecules arrange with tails pointing INWARD (away from water) and heads pointing OUTWARD (towards water).\n   - The hydrophobic tails trap grease/oil in the centre.\n   - The hydrophilic heads keep the micelle suspended in water.\n   - Agitation (washing) breaks these micelles loose from fabric and the dirt is washed away.\n6. SOAPS vs DETERGENTS:\n   - Soaps do NOT work in hard water (Ca²⁺/Mg²⁺ precipitate calcium stearate — scum).\n   - Detergents work in hard water because their calcium/magnesium salts are soluble. Better for washing machines.",
      worked_example:
        "Question: What happens when ethanol reacts with sodium metal? Write equation and observation.\nObservation: Vigorous fizzing (H₂ gas evolution), sodium dissolves, the mixture may ignite.\nEquation: 2C₂H₅OH + 2Na → 2C₂H₅ONa + H₂↑ (sodium ethoxide + hydrogen gas)\nNote: This is similar to sodium reacting with water, but less vigorous — showing that –OH group in alcohol reacts with active metals. The product is sodium ethoxide (C₂H₅ONa), not sodium hydroxide.",
      common_misconceptions: [
        "Soap works in hard water — soap forms insoluble scum (calcium/magnesium stearate) in hard water and loses its cleaning ability. Detergents are designed for hard water.",
        "Ethanoic acid is a strong acid like HCl — ethanoic acid is a WEAK acid (partial ionisation); HCl is a strong acid (complete ionisation). Ethanoic acid has higher pH than HCl at the same concentration.",
        "The ester smell comes from the acid or alcohol — the fruity smell comes from the ESTER product (ethyl ethanoate), not the reactants. Pure ethanoic acid smells of vinegar, not fruit.",
      ],
      shortcuts_and_tricks: [
        "Esterification: Acid + alcoHOL → Ester + HOLE (water removed). Catalyst: conc. H₂SO₄, gentle heat.",
        "Glacial acetic acid = pure ethanoic acid (freezes at 16.6°C, forming ice-like crystals).",
        "Micelle trick: 'tails hide from water, heads face water'. Grease is trapped in the tail zone (centre of micelle).",
        "Soap vs detergent: Soap = fails in hard water (Ca scum). Detergent = works in hard water (Ca salt stays soluble).",
      ],
      diagram_description:
        "Soap micelle in water diagram: a large circular micelle cross-section. The outer ring shows many soap molecules with round circles (hydrophilic ionic heads, –COO⁻Na⁺) labelled 'faces water'. Straight lines radiating inward represent the hydrocarbon tails (hydrophobic) labelled 'hides from water, traps grease'. The centre of the micelle is shaded and labelled 'trapped grease/oil droplet'. Surrounding the micelle: water molecules depicted as small H₂O symbols. Arrows show dirt/grease being emulsified and lifted from the fabric surface.",
      key_takeaway:
        "Ethanol (C₂H₅OH): fermented from glucose, forms esters, oxidises to ethanoic acid. Ethanoic acid (CH₃COOH): weak acid, vinegar. Esterification: acid + alcohol → ester + water (H₂SO₄ catalyst). Soap micelle: hydrophobic tails trap oil inward, hydrophilic heads face water. Soaps fail in hard water; detergents do not.",
    },
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
  console.log("Connected to MongoDB");
  let upserted = 0;
  for (const t of TOPICS) {
    await NcertTopicContent.findOneAndUpdate(
      { topicId: t.topicId },
      t,
      { upsert: true, new: true }
    );
    upserted++;
    console.log(`  ✓ ${t.topicId}`);
  }
  console.log(`\nChemistry teaching content: ${upserted} topics upserted`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
