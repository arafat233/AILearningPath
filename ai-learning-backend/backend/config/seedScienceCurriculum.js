/**
 * CBSE Class 10 Science — Complete Curriculum Seed
 * Source: NCERT Class 10 Science Textbook (jesc101–jesc113)
 * Chapters organised by unit:
 *   Chemistry : Ch 1-4  (jesc101–104)
 *   Biology   : Ch 5-8, 13 (jesc105–108, jesc113)
 *   Physics   : Ch 9-12 (jesc109–112)
 * Run: npm run seed:science-curriculum
 */
import "dotenv/config";
import mongoose from "mongoose";
import { Chapter } from "../models/chapterModel.js";

const CHAPTERS = [
  // ─────────────────────────── CHEMISTRY ───────────────────────────
  {
    chapterNumber: 1,
    title: "Chemical Reactions and Equations",
    subject: "Science",
    grade: "10",
    board: "CBSE",
    unit: "Chemistry",
    examMarks: 10,
    estimatedWeeks: 2,
    overview:
      "Introduces chemical reactions, how to write and balance chemical equations, and classifies reactions into combination, decomposition, displacement, double displacement, oxidation, and reduction.",
    sections: [
      {
        sectionNumber: "1.1",
        title: "Chemical Reactions",
        microConcepts: [
          { title: "Signs of a chemical reaction: colour change, gas evolution, precipitate, temperature change" },
          { title: "Reactants and products" },
          { title: "Difference between physical and chemical change" },
        ],
      },
      {
        sectionNumber: "1.2",
        title: "Chemical Equations",
        microConcepts: [
          { title: "Word equation → symbolic equation" },
          { title: "State symbols: (s), (l), (g), (aq)" },
          { title: "Balancing by hit-and-trial method" },
          { title: "Law of Conservation of Mass: atoms are neither created nor destroyed" },
        ],
      },
      {
        sectionNumber: "1.3",
        title: "Types of Chemical Reactions",
        microConcepts: [
          { title: "Combination reaction: A + B → AB" },
          { title: "Decomposition reaction: AB → A + B (thermal, electrolytic, photolytic)" },
          { title: "Displacement reaction: more reactive element displaces less reactive" },
          { title: "Double displacement reaction: exchange of ions, precipitate or gas formed" },
          { title: "Precipitation reaction: insoluble product formed" },
          { title: "Neutralisation: acid + base → salt + water" },
        ],
      },
      {
        sectionNumber: "1.4",
        title: "Oxidation and Reduction",
        microConcepts: [
          { title: "Oxidation: gain of oxygen / loss of hydrogen" },
          { title: "Reduction: loss of oxygen / gain of hydrogen" },
          { title: "Redox reaction: oxidation and reduction occur simultaneously" },
          { title: "Oxidising agent: causes oxidation; reducing agent: causes reduction" },
          { title: "Corrosion and rancidity as oxidation effects" },
        ],
      },
    ],
    theorems: [
      { name: "Law of Conservation of Mass", statement: "In a chemical reaction, the total mass of reactants equals the total mass of products." },
    ],
    keyFormulas: [
      "Combination: A + B → AB",
      "Decomposition: AB → A + B",
      "Displacement: A + BC → AC + B (A more reactive than B)",
      "Double displacement: AB + CD → AD + CB",
    ],
    examTips: [
      "Always balance equations by counting atoms of each element on both sides",
      "State symbols are important in board exams — never skip them",
      "Remember: rusting = slow oxidation; combustion = fast oxidation",
      "Distinguish OIL RIG: Oxidation Is Loss, Reduction Is Gain (of electrons)",
      "Photosynthesis is a combination + reduction example",
    ],
    exercises: [
      { exerciseNumber: "Exercise 1", questionCount: 16, types: ["MCQ", "Short Answer", "Long Answer"] },
    ],
  },

  {
    chapterNumber: 2,
    title: "Acids, Bases and Salts",
    subject: "Science",
    grade: "10",
    board: "CBSE",
    unit: "Chemistry",
    examMarks: 10,
    estimatedWeeks: 2,
    overview:
      "Covers the properties of acids and bases, the pH scale, neutralisation, and the preparation and uses of important salts like NaCl, NaOH, bleaching powder, baking soda, and washing soda.",
    sections: [
      {
        sectionNumber: "2.1",
        title: "Understanding Acids and Bases",
        microConcepts: [
          { title: "Acid taste sour; base feels soapy" },
          { title: "Litmus test: acid → red; base → blue" },
          { title: "Indicators: litmus, phenolphthalein, methyl orange, turmeric" },
          { title: "Olfactory indicators: onion, vanilla, clove" },
        ],
      },
      {
        sectionNumber: "2.2",
        title: "Acids and Bases in Solution",
        microConcepts: [
          { title: "Acid produces H⁺ (H₃O⁺) in water" },
          { title: "Base produces OH⁻ in water" },
          { title: "Strong acid/base: complete ionisation; weak: partial" },
          { title: "Acids react with metals to give H₂ gas" },
          { title: "Acids react with metal carbonates to give CO₂" },
          { title: "Bases react with metals (Al, Zn) to give H₂" },
          { title: "Acid + base → salt + water (neutralisation)" },
          { title: "All acids: H SO₄, HCl, HNO₃; all bases: NaOH, KOH, Ca(OH)₂" },
        ],
      },
      {
        sectionNumber: "2.3",
        title: "pH Scale",
        microConcepts: [
          { title: "pH scale: 0–14; 7 = neutral, <7 = acidic, >7 = basic" },
          { title: "Universal indicator gives colour range for pH" },
          { title: "pH of common substances: lemon juice ~2, blood ~7.4, bleach ~12" },
          { title: "Soil pH and crop growth" },
          { title: "pH in digestion: stomach HCl pH 1–2" },
          { title: "Tooth decay at pH below 5.5" },
          { title: "Bee sting (formic acid) treated with baking soda" },
        ],
      },
      {
        sectionNumber: "2.4",
        title: "Salts",
        microConcepts: [
          { title: "Common salt (NaCl): electrolysis gives NaOH, Cl₂, H₂ (chlor-alkali process)" },
          { title: "Bleaching powder: Ca(OCl)Cl — from Cl₂ + Ca(OH)₂" },
          { title: "Baking soda: NaHCO₃ — mild base, used in antacid, baking" },
          { title: "Washing soda: Na₂CO₃·10H₂O — water softening, glass, soap industry" },
          { title: "Plaster of Paris: CaSO₄·½H₂O — from gypsum by heating" },
          { title: "pH of salts: strong acid + weak base → acidic; weak acid + strong base → basic" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "Acid + Metal → Salt + H₂↑",
      "Acid + Metal Carbonate → Salt + CO₂↑ + H₂O",
      "Acid + Base → Salt + H₂O (Neutralisation)",
      "2NaCl + 2H₂O → 2NaOH + Cl₂ + H₂ (Chlor-alkali)",
      "CaSO₄·2H₂O → CaSO₄·½H₂O + 1.5H₂O (Plaster of Paris from Gypsum)",
    ],
    examTips: [
      "pH < 7 = acidic, pH > 7 = basic — always state units in answers",
      "Memorise: baking soda = NaHCO₃, washing soda = Na₂CO₃·10H₂O",
      "Chlor-alkali process: remember all three products (NaOH, Cl₂, H₂)",
      "Plaster of Paris hardens when mixed with water (reverse of preparation)",
      "Hard water softened by washing soda (removes Ca²⁺ and Mg²⁺ ions)",
    ],
    exercises: [
      { exerciseNumber: "Exercise 2", questionCount: 18, types: ["MCQ", "Short Answer", "Long Answer"] },
    ],
  },

  {
    chapterNumber: 3,
    title: "Metals and Non-metals",
    subject: "Science",
    grade: "10",
    board: "CBSE",
    unit: "Chemistry",
    examMarks: 10,
    estimatedWeeks: 2,
    overview:
      "Compares physical and chemical properties of metals and non-metals, introduces the reactivity series, ionic bonding, and the metallurgical extraction of metals.",
    sections: [
      {
        sectionNumber: "3.1",
        title: "Physical Properties of Metals and Non-metals",
        microConcepts: [
          { title: "Metals: lustrous, malleable, ductile, good conductors, high melting point" },
          { title: "Non-metals: dull, brittle, poor conductors (except graphite)" },
          { title: "Exceptions: mercury (liquid metal), iodine (lustrous non-metal), graphite (conducts)" },
          { title: "Sonorous metals produce ringing sound when struck" },
        ],
      },
      {
        sectionNumber: "3.2",
        title: "Chemical Properties of Metals",
        microConcepts: [
          { title: "Reaction with oxygen: metal + O₂ → metal oxide (basic)" },
          { title: "Reaction with water: K, Na react vigorously; Fe slowly (rust); Al forms protective oxide" },
          { title: "Reaction with acids: metals above H in reactivity series displace H₂" },
          { title: "Reaction with salt solutions: more reactive displaces less reactive" },
          { title: "Reactivity series: K > Na > Ca > Mg > Al > Zn > Fe > Pb > H > Cu > Hg > Ag > Au" },
        ],
      },
      {
        sectionNumber: "3.3",
        title: "How Metals and Non-metals React — Ionic Compounds",
        microConcepts: [
          { title: "Metal loses electrons (oxidation) → cation" },
          { title: "Non-metal gains electrons (reduction) → anion" },
          { title: "Ionic bond: electrostatic attraction between ions" },
          { title: "Properties of ionic compounds: high MP/BP, soluble in water, conduct electricity in solution" },
        ],
      },
      {
        sectionNumber: "3.4",
        title: "Occurrence and Extraction of Metals",
        microConcepts: [
          { title: "Minerals vs. ores: all ores are minerals, not all minerals are ores" },
          { title: "Low reactivity metals (Au, Ag) found free in nature" },
          { title: "Medium reactivity (Zn, Fe, Pb): extracted by reduction with carbon/CO" },
          { title: "High reactivity (Na, Mg, Al): electrolytic reduction" },
          { title: "Refining of metals: electrolytic refining" },
          { title: "Thermite reaction: 2Al + Fe₂O₃ → Al₂O₃ + 2Fe" },
          { title: "Corrosion: rusting (Fe + H₂O + O₂ → Fe₂O₃·xH₂O), prevention by galvanising, painting" },
          { title: "Alloys: brass (Cu+Zn), bronze (Cu+Sn), solder (Pb+Sn), amalgam (Hg+metal)" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "4Fe + 3O₂ + xH₂O → 2Fe₂O₃·xH₂O (Rusting)",
      "2Al + Fe₂O₃ → Al₂O₃ + 2Fe (Thermite reaction)",
      "Reactivity series (high→low): K Na Ca Mg Al Zn Fe Pb H Cu Hg Ag Au Pt",
    ],
    examTips: [
      "Memorise the reactivity series — many displacement questions depend on it",
      "Galvanising = coating iron with zinc (Zn sacrifices itself to protect Fe)",
      "Electrolytic refining: impure metal = anode, pure metal = cathode",
      "Alloys have lower melting points than pure metals",
      "Al is protected by its own oxide layer (passivation)",
    ],
    exercises: [
      { exerciseNumber: "Exercise 3", questionCount: 16, types: ["MCQ", "Short Answer", "Long Answer"] },
    ],
  },

  {
    chapterNumber: 4,
    title: "Carbon and its Compounds",
    subject: "Science",
    grade: "10",
    board: "CBSE",
    unit: "Chemistry",
    examMarks: 10,
    estimatedWeeks: 3,
    overview:
      "Explores the unique bonding properties of carbon, the homologous series of organic compounds, nomenclature, important chemical reactions, and the uses of carbon compounds including ethanol and ethanoic acid.",
    sections: [
      {
        sectionNumber: "4.1",
        title: "Bonding in Carbon — Covalent Bond",
        microConcepts: [
          { title: "Carbon: 4 valence electrons — forms 4 covalent bonds" },
          { title: "Tetravalency and catenation: unique ability to form long chains" },
          { title: "Single, double, triple bonds" },
          { title: "Structural formula vs molecular formula" },
          { title: "Isomers: same molecular formula, different structures" },
        ],
      },
      {
        sectionNumber: "4.2",
        title: "Versatile Nature of Carbon",
        microConcepts: [
          { title: "Straight chain, branched chain, ring (cyclic) structures" },
          { title: "Saturated hydrocarbons (alkanes): only single bonds" },
          { title: "Unsaturated hydrocarbons: alkenes (C=C), alkynes (C≡C)" },
          { title: "Allotropes of carbon: diamond, graphite, fullerene" },
          { title: "Diamond: hardest, bad conductor; graphite: soft, good conductor" },
        ],
      },
      {
        sectionNumber: "4.3",
        title: "Homologous Series",
        microConcepts: [
          { title: "Differ by –CH₂– (14 mass units) successively" },
          { title: "Alkanes: CₙH₂ₙ₊₂; Alkenes: CₙH₂ₙ; Alkynes: CₙH₂ₙ₋₂" },
          { title: "Functional groups: –OH (alcohol), –COOH (acid), –CHO (aldehyde), –CO– (ketone), –X (halide)" },
          { title: "IUPAC nomenclature: prefix + root (chain length) + suffix" },
        ],
      },
      {
        sectionNumber: "4.4",
        title: "Chemical Properties of Carbon Compounds",
        microConcepts: [
          { title: "Combustion: hydrocarbons + O₂ → CO₂ + H₂O + heat" },
          { title: "Saturated: blue flame; unsaturated: sooty yellow flame" },
          { title: "Oxidation: ethanol → ethanoic acid (using alkaline KMnO₄ or acidic K₂Cr₂O₇)" },
          { title: "Addition reaction: alkene + H₂ → alkane (hydrogenation, Ni catalyst)" },
          { title: "Substitution reaction: alkane + Cl₂ → chloroalkane (in sunlight)" },
        ],
      },
      {
        sectionNumber: "4.5",
        title: "Important Carbon Compounds",
        microConcepts: [
          { title: "Ethanol (C₂H₅OH): properties, denatured alcohol, reaction with Na, effects" },
          { title: "Ethanoic acid (CH₃COOH): acetic acid, glacial acetic acid, esterification" },
          { title: "Esterification: acid + alcohol ⇌ ester + water (H⁺ catalyst, reversible)" },
          { title: "Soaps: sodium/potassium salts of long-chain fatty acids; micelle formation" },
          { title: "Detergents: sulphonate salts; work in hard water unlike soaps" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "Alkanes: CₙH₂ₙ₊₂",
      "Alkenes: CₙH₂ₙ",
      "Alkynes: CₙH₂ₙ₋₂",
      "Esterification: RCOOH + R'OH ⇌ RCOOR' + H₂O",
      "Saponification: ester + NaOH → soap + glycerol",
      "Hydrogenation: CₙH₂ₙ + H₂ → CₙH₂ₙ₊₂ (Ni catalyst)",
    ],
    examTips: [
      "Memorise first 4 alkanes: methane, ethane, propane, butane",
      "Unsaturated compounds decolourise bromine water — used as test",
      "Soaps don't work in hard water because Ca/Mg salts of fatty acids are insoluble",
      "Esterification is reversible — use excess alcohol or remove product to shift equilibrium",
      "Ethanoic acid has vinegar smell; melting point 16.6°C (hence 'glacial' below this)",
    ],
    exercises: [
      { exerciseNumber: "Exercise 4", questionCount: 15, types: ["MCQ", "Short Answer", "Long Answer"] },
    ],
  },

  // ─────────────────────────── BIOLOGY ───────────────────────────
  {
    chapterNumber: 5,
    title: "Life Processes",
    subject: "Science",
    grade: "10",
    board: "CBSE",
    unit: "Biology",
    examMarks: 12,
    estimatedWeeks: 3,
    overview:
      "Covers the fundamental life processes — nutrition, respiration, transportation, and excretion — in plants and animals, with diagrams of the human digestive, respiratory, circulatory, and excretory systems.",
    sections: [
      {
        sectionNumber: "5.1",
        title: "Nutrition",
        microConcepts: [
          { title: "Autotrophic nutrition: photosynthesis — sunlight + CO₂ + H₂O → glucose + O₂" },
          { title: "Chlorophyll absorbs sunlight; stomata for CO₂ entry; guard cells control opening" },
          { title: "Heterotrophic nutrition: holozoic (humans), parasitic (Plasmodium), saprophytic (fungi)" },
          { title: "Human digestive system: mouth → oesophagus → stomach → small intestine → large intestine" },
          { title: "Enzymes: salivary amylase, pepsin, trypsin, lipase, bile (emulsification)" },
          { title: "Villi in small intestine increase surface area for absorption" },
        ],
      },
      {
        sectionNumber: "5.2",
        title: "Respiration",
        microConcepts: [
          { title: "Aerobic respiration: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + 38 ATP" },
          { title: "Anaerobic respiration in yeast: glucose → ethanol + CO₂" },
          { title: "Anaerobic in muscles: glucose → lactic acid (cramps)" },
          { title: "Human respiratory system: nasal cavity → trachea → bronchi → alveoli" },
          { title: "Alveoli: thin walls, rich blood supply — maximise gas exchange" },
          { title: "Breathing rate controlled by CO₂ concentration in blood" },
        ],
      },
      {
        sectionNumber: "5.3",
        title: "Transportation",
        microConcepts: [
          { title: "Human circulatory system: heart (4 chambers), arteries, veins, capillaries" },
          { title: "Double circulation: pulmonary (heart ↔ lungs) + systemic (heart ↔ body)" },
          { title: "Blood components: RBC (haemoglobin), WBC, platelets, plasma" },
          { title: "Lymph: colorless fluid, returns proteins and fats to blood" },
          { title: "Plant transport: xylem (water + minerals, unidirectional) via transpiration pull" },
          { title: "Phloem: sugar transport (bidirectional) — source to sink" },
        ],
      },
      {
        sectionNumber: "5.4",
        title: "Excretion",
        microConcepts: [
          { title: "Human excretory system: kidneys, ureters, urinary bladder, urethra" },
          { title: "Nephron: Bowman's capsule + glomerulus (filtration) + tubule (reabsorption)" },
          { title: "Urine: urea, excess salts, water" },
          { title: "Dialysis: artificial kidney for kidney failure" },
          { title: "Plants excrete: CO₂ (respiration), O₂ (photosynthesis), excess water (transpiration)" },
          { title: "Plants store waste in leaves, bark, resins (shed or store)" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "Photosynthesis: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂ (sunlight, chlorophyll)",
      "Aerobic respiration: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + energy (38 ATP)",
      "Anaerobic (yeast): C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂",
      "Anaerobic (muscle): C₆H₁₂O₆ → 2C₃H₆O₃ (lactic acid)",
    ],
    examTips: [
      "Draw and label diagrams: nephron, alveolus, heart, villi — high mark questions",
      "Arteries carry blood away from heart (oxygenated except pulmonary); veins carry to heart",
      "Haemoglobin carries O₂; CO₂ mainly dissolves in plasma as bicarbonate",
      "Xylem = dead cells; phloem = living cells",
      "Transpiration pull: evaporation from leaves pulls water up from roots",
    ],
    exercises: [
      { exerciseNumber: "Exercise 5", questionCount: 18, types: ["MCQ", "Short Answer", "Long Answer", "Diagram"] },
    ],
  },

  {
    chapterNumber: 6,
    title: "Control and Coordination",
    subject: "Science",
    grade: "10",
    board: "CBSE",
    unit: "Biology",
    examMarks: 12,
    estimatedWeeks: 2,
    overview:
      "Explains how animals and plants detect and respond to stimuli — covering the nervous system, reflex arcs, the brain, and plant hormones (tropic and non-tropic movements).",
    sections: [
      {
        sectionNumber: "6.1",
        title: "Animals — Nervous System",
        microConcepts: [
          { title: "Neuron: dendrite → cell body → axon → nerve endings" },
          { title: "Synapse: chemical signal transfer between neurons (neurotransmitter)" },
          { title: "CNS: brain + spinal cord; PNS: all other nerves" },
          { title: "Reflex arc: receptor → sensory nerve → spinal cord → motor nerve → effector" },
          { title: "Reflex action is involuntary and faster than voluntary response" },
        ],
      },
      {
        sectionNumber: "6.2",
        title: "The Brain",
        microConcepts: [
          { title: "Forebrain (cerebrum): thinking, memory, voluntary actions, sensory processing" },
          { title: "Midbrain: relay between forebrain and hindbrain" },
          { title: "Hindbrain: cerebellum (balance, posture), medulla (involuntary — heartbeat, breathing)" },
          { title: "CSF (cerebrospinal fluid) protects brain; skull and meninges provide physical protection" },
        ],
      },
      {
        sectionNumber: "6.3",
        title: "How are these Tissues Protected?",
        microConcepts: [
          { title: "Brain enclosed in skull; spinal cord in vertebral column" },
          { title: "Meninges: three membranes surrounding CNS" },
        ],
      },
      {
        sectionNumber: "6.4",
        title: "Chemical Coordination — Hormones",
        microConcepts: [
          { title: "Endocrine glands: ductless glands releasing hormones into blood" },
          { title: "Pituitary: master gland — controls other glands; growth hormone" },
          { title: "Thyroid: thyroxine — regulates metabolism; iodine needed" },
          { title: "Adrenal: adrenaline — fight or flight response; increases heart rate, blood glucose" },
          { title: "Pancreas: insulin (lowers blood glucose), glucagon (raises blood glucose)" },
          { title: "Testes: testosterone; ovaries: oestrogen — secondary sexual characteristics" },
          { title: "Feedback mechanism: hormone levels self-regulate" },
        ],
      },
      {
        sectionNumber: "6.5",
        title: "Coordination in Plants",
        microConcepts: [
          { title: "Tropic movements (directional): phototropism, geotropism, hydrotropism, thigmotropism" },
          { title: "Non-tropic (nastic): touch-me-not (Mimosa) — turgor change" },
          { title: "Auxin: promotes growth on shaded side → bends toward light" },
          { title: "Gibberellin: stem elongation, seed germination" },
          { title: "Cytokinin: promotes cell division" },
          { title: "Abscisic acid (ABA): stress hormone — closes stomata during drought" },
          { title: "Ethylene: fruit ripening" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [],
    examTips: [
      "Draw the reflex arc with labels — commonly asked 3/5 mark diagram",
      "Adrenaline vs insulin: adrenaline raises blood glucose (emergency); insulin lowers it (normal)",
      "Phototropism: shoot positive, root negative toward light",
      "Auxin moves to shaded side → cells elongate → bending toward light",
      "Distinguish voluntary (brain controlled) from involuntary (medulla/spinal cord) actions",
    ],
    exercises: [
      { exerciseNumber: "Exercise 6", questionCount: 16, types: ["MCQ", "Short Answer", "Long Answer", "Diagram"] },
    ],
  },

  {
    chapterNumber: 7,
    title: "How do Organisms Reproduce?",
    subject: "Science",
    grade: "10",
    board: "CBSE",
    unit: "Biology",
    examMarks: 10,
    estimatedWeeks: 2,
    overview:
      "Distinguishes asexual and sexual reproduction in plants and animals, covers the human male and female reproductive systems, and introduces sexually transmitted infections and contraception.",
    sections: [
      {
        sectionNumber: "7.1",
        title: "Do Organisms Create Exact Copies?",
        microConcepts: [
          { title: "Reproduction maintains species continuity" },
          { title: "DNA copying introduces variations — raw material for evolution" },
          { title: "Asexual reproduction: identical offspring (no variation)" },
          { title: "Sexual reproduction: variations through meiosis and fertilisation" },
        ],
      },
      {
        sectionNumber: "7.2",
        title: "Modes of Reproduction — Asexual",
        microConcepts: [
          { title: "Fission: binary (Amoeba, bacteria), multiple (Plasmodium)" },
          { title: "Fragmentation: Spirogyra breaks into pieces" },
          { title: "Regeneration: Planaria, Hydra" },
          { title: "Budding: Hydra, yeast" },
          { title: "Vegetative propagation: runners (grass), bulbs (onion), rhizomes (ginger), tubers (potato)" },
          { title: "Spore formation: Rhizopus (bread mould)" },
        ],
      },
      {
        sectionNumber: "7.3",
        title: "Sexual Reproduction in Flowering Plants",
        microConcepts: [
          { title: "Flower: sepal, petal, stamen (anther + filament), pistil (stigma + style + ovary)" },
          { title: "Pollination: transfer of pollen grain — self/cross; agents: wind, water, insects" },
          { title: "Fertilisation: pollen tube grows down style; male gamete fuses with egg → zygote" },
          { title: "Double fertilisation: one male gamete + egg → zygote; second + polar nuclei → endosperm" },
          { title: "Fruit development: ovary → fruit; ovule → seed" },
          { title: "Seed dispersal: wind (dandelion), water (coconut), animal (burr), explosion (bean)" },
        ],
      },
      {
        sectionNumber: "7.4",
        title: "Reproduction in Human Beings",
        microConcepts: [
          { title: "Male: testes (sperm + testosterone), vas deferens, seminal vesicle, prostate, urethra" },
          { title: "Testes outside body (scrotum) — lower temperature for sperm" },
          { title: "Female: ovaries (ovum + oestrogen), fallopian tubes, uterus, vagina" },
          { title: "Menstrual cycle: ~28 days; ovulation on day ~14; menstruation if no fertilisation" },
          { title: "Fertilisation in fallopian tube; implantation in uterus" },
          { title: "Placenta: nutrients + oxygen to foetus; CO₂ + waste back to mother" },
          { title: "Contraception: barrier (condom), hormonal (pill), surgical (vasectomy/tubectomy), IUD" },
          { title: "STDs: syphilis, gonorrhoea, AIDS (HIV) — transmission and prevention" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [],
    examTips: [
      "Draw and label male/female reproductive systems — 5 mark diagram questions",
      "Double fertilisation is unique to angiosperms (flowering plants)",
      "Placenta functions: nutrition, gas exchange, waste removal, hormone production",
      "Menstrual cycle: menstruation (1-5) → follicular (6-13) → ovulation (14) → luteal (15-28)",
      "HIV attacks helper T-cells → destroys immune system → AIDS",
    ],
    exercises: [
      { exerciseNumber: "Exercise 7", questionCount: 14, types: ["MCQ", "Short Answer", "Long Answer", "Diagram"] },
    ],
  },

  {
    chapterNumber: 8,
    title: "Heredity",
    subject: "Science",
    grade: "10",
    board: "CBSE",
    unit: "Biology",
    examMarks: 8,
    estimatedWeeks: 2,
    overview:
      "Covers Mendel's laws of inheritance, dominant and recessive traits, monohybrid and dihybrid crosses, sex determination in humans, and the role of heredity and environment in evolution.",
    sections: [
      {
        sectionNumber: "8.1",
        title: "Accumulation of Variation During Reproduction",
        microConcepts: [
          { title: "Asexual reproduction: same DNA → minimal variation" },
          { title: "Sexual reproduction: meiosis + random fertilisation → genetic variation" },
          { title: "Variation is the raw material for natural selection" },
        ],
      },
      {
        sectionNumber: "8.2",
        title: "Heredity — Mendel's Contributions",
        microConcepts: [
          { title: "Gregor Mendel: pea plant experiments — 7 contrasting traits" },
          { title: "Law of Dominance: dominant trait expressed in F1; recessive masked" },
          { title: "Monohybrid cross: Tt × Tt → 1TT : 2Tt : 1tt (3:1 phenotypic ratio)" },
          { title: "Law of Segregation: alleles separate during gamete formation" },
          { title: "Dihybrid cross: RrYy × RrYy → 9:3:3:1 phenotypic ratio" },
          { title: "Law of Independent Assortment: genes on different chromosomes segregate independently" },
        ],
      },
      {
        sectionNumber: "8.3",
        title: "Sex Determination",
        microConcepts: [
          { title: "Humans: 46 chromosomes (23 pairs); 22 autosomes + 1 sex chromosome pair" },
          { title: "Females: XX; Males: XY" },
          { title: "Father determines sex of child: sperm carries X or Y" },
          { title: "50% probability of boy or girl each pregnancy" },
          { title: "Sex determination differs in other organisms (grasshopper: XO; birds: ZW)" },
        ],
      },
    ],
    theorems: [
      { name: "Mendel's Law of Segregation", statement: "In the formation of gametes, the alleles for each trait separate from each other so that each gamete carries only one allele for each trait." },
      { name: "Mendel's Law of Independent Assortment", statement: "Alleles for different traits assort independently of one another during gamete formation." },
    ],
    keyFormulas: [
      "Monohybrid F2 ratio: 3 dominant : 1 recessive (phenotypic)",
      "Monohybrid F2 genotypic ratio: 1 TT : 2 Tt : 1 tt",
      "Dihybrid F2 phenotypic ratio: 9:3:3:1",
    ],
    examTips: [
      "Always solve Punnett squares step by step in answers",
      "Dominant × dominant can give recessive offspring if both parents are Tt",
      "Sex determination: father's sperm (X or Y) determines child's sex — NOT mother",
      "Dihybrid 9:3:3:1 is only when both parents are double heterozygous (RrYy × RrYy)",
      "Mendel chose pea plants: short life, many offspring, easy to control pollination",
    ],
    exercises: [
      { exerciseNumber: "Exercise 8", questionCount: 12, types: ["MCQ", "Short Answer", "Long Answer"] },
    ],
  },

  // ─────────────────────────── PHYSICS ───────────────────────────
  {
    chapterNumber: 9,
    title: "Light – Reflection and Refraction",
    subject: "Science",
    grade: "10",
    board: "CBSE",
    unit: "Physics",
    examMarks: 12,
    estimatedWeeks: 3,
    overview:
      "Covers the laws of reflection and refraction, image formation by spherical mirrors and lenses, the mirror and lens formulas, magnification, power of a lens, and real-world applications.",
    sections: [
      {
        sectionNumber: "9.1",
        title: "Reflection of Light",
        microConcepts: [
          { title: "Laws of reflection: angle of incidence = angle of reflection; incident ray, reflected ray, normal are coplanar" },
          { title: "Spherical mirrors: concave (converging) and convex (diverging)" },
          { title: "Terms: pole, centre of curvature, radius of curvature, principal axis, principal focus, focal length" },
          { title: "Relation: f = R/2" },
          { title: "Image by concave mirror at C, beyond C, F, between F and P, behind mirror" },
          { title: "Convex mirror: always virtual, erect, diminished — used as rear-view mirror" },
          { title: "Sign convention: distances measured from pole; incident light direction = positive" },
        ],
      },
      {
        sectionNumber: "9.2",
        title: "Mirror Formula and Magnification",
        microConcepts: [
          { title: "Mirror formula: 1/v + 1/u = 1/f" },
          { title: "Magnification: m = -v/u = h'/h" },
          { title: "m negative → real, inverted; m positive → virtual, erect" },
          { title: "m > 1 → magnified; m < 1 → diminished; m = 1 → same size" },
        ],
      },
      {
        sectionNumber: "9.3",
        title: "Refraction of Light",
        microConcepts: [
          { title: "Laws of refraction: incident ray, refracted ray, normal are coplanar" },
          { title: "Snell's law: n₁ sin θ₁ = n₂ sin θ₂" },
          { title: "Refractive index: n = speed of light in vacuum / speed in medium = c/v" },
          { title: "Light bends toward normal when going from rarer to denser medium" },
          { title: "Real depth vs apparent depth: n = real depth / apparent depth" },
          { title: "Total Internal Reflection: when angle > critical angle in denser medium" },
        ],
      },
      {
        sectionNumber: "9.4",
        title: "Refraction Through Lenses",
        microConcepts: [
          { title: "Convex lens: converging; concave lens: diverging" },
          { title: "Image positions by convex lens: at 2F, beyond 2F, between F and 2F, at F, between O and F" },
          { title: "Concave lens: always virtual, erect, diminished" },
          { title: "Lens formula: 1/v - 1/u = 1/f" },
          { title: "Magnification for lens: m = v/u = h'/h" },
          { title: "Power of lens: P = 1/f (in metres); unit = dioptre (D)" },
          { title: "Combined lenses: P = P₁ + P₂ + P₃ …" },
        ],
      },
    ],
    theorems: [
      { name: "Snell's Law", statement: "n₁ sin θ₁ = n₂ sin θ₂, where n is the refractive index and θ is the angle with the normal." },
    ],
    keyFormulas: [
      "Mirror formula: 1/v + 1/u = 1/f",
      "Mirror magnification: m = -v/u",
      "Focal length of mirror: f = R/2",
      "Snell's Law: n₁ sin θ₁ = n₂ sin θ₂",
      "Refractive index: n = c/v = real depth / apparent depth",
      "Lens formula: 1/v - 1/u = 1/f",
      "Lens magnification: m = v/u",
      "Power of lens: P = 1/f (metres); unit = dioptre (D)",
      "Combined power: P = P₁ + P₂",
    ],
    examTips: [
      "Apply sign convention carefully — most numerical mistakes come from sign errors",
      "Concave mirror/convex lens: focal length negative/positive respectively",
      "Power is positive for convex lens, negative for concave lens",
      "Rear-view mirror = convex (wider field, virtual image); dentist's mirror = concave",
      "Draw ray diagrams neatly — partial marks given even if answer is wrong",
    ],
    exercises: [
      { exerciseNumber: "Exercise 9", questionCount: 18, types: ["MCQ", "Numerical", "Short Answer", "Long Answer", "Diagram"] },
    ],
  },

  {
    chapterNumber: 10,
    title: "The Human Eye and the Colourful World",
    subject: "Science",
    grade: "10",
    board: "CBSE",
    unit: "Physics",
    examMarks: 8,
    estimatedWeeks: 2,
    overview:
      "Covers the structure and working of the human eye, accommodation, defects of vision and correction, and optical phenomena — dispersion, scattering of light, and the colours of the sky and sunset.",
    sections: [
      {
        sectionNumber: "10.1",
        title: "The Human Eye",
        microConcepts: [
          { title: "Parts: cornea, iris, pupil, eye lens (crystalline), retina, optic nerve, aqueous/vitreous humour" },
          { title: "Accommodation: ciliary muscles adjust focal length of eye lens" },
          { title: "Near point: 25 cm (distinct vision distance)" },
          { title: "Far point: infinity (normal eye)" },
          { title: "Rods (black/white, low light) and cones (colour, bright light) on retina" },
        ],
      },
      {
        sectionNumber: "10.2",
        title: "Defects of Vision and Correction",
        microConcepts: [
          { title: "Myopia (short-sight): image in front of retina; eyeball too long or eye lens too curved; concave lens corrects" },
          { title: "Hypermetropia (long-sight): image behind retina; eyeball too short or weak eye lens; convex lens corrects" },
          { title: "Presbyopia: loss of accommodation with age; bifocal lenses" },
          { title: "Astigmatism: irregular curvature of cornea; cylindrical lenses" },
        ],
      },
      {
        sectionNumber: "10.3",
        title: "Refraction of Light Through a Glass Prism",
        microConcepts: [
          { title: "Angle of deviation: light bends at each surface of prism" },
          { title: "Dispersion: white light splits into VIBGYOR spectrum (prism)" },
          { title: "Violet deviates most (higher n); red deviates least" },
          { title: "Recombination of spectrum using second inverted prism" },
        ],
      },
      {
        sectionNumber: "10.4",
        title: "Atmospheric Refraction and Scattering",
        microConcepts: [
          { title: "Stars twinkle: atmospheric refraction (varying density layers)" },
          { title: "Planets don't twinkle: extended source averages out" },
          { title: "Tyndall effect: scattering of light by colloidal particles" },
          { title: "Blue sky: Rayleigh scattering — shorter λ (blue) scattered more" },
          { title: "Red sunset: at horizon, blue scattered away; only red transmitted" },
          { title: "White clouds: all wavelengths scattered equally" },
          { title: "Danger signals red: longest wavelength, least scattered, visible from far" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "Power of corrective lens (myopia): P = -1/f (concave, negative power)",
      "Power of corrective lens (hypermetropia): P = +1/f (convex, positive power)",
      "Rayleigh scattering: intensity ∝ 1/λ⁴",
    ],
    examTips: [
      "Myopia: near objects clear; far blurry → concave lens (diverging)",
      "Hypermetropia: far objects clear; near blurry → convex lens (converging)",
      "Remember VIBGYOR order: Violet Indigo Blue Green Yellow Orange Red",
      "Violet has shortest wavelength (highest frequency, most refracted)",
      "Why sky is blue: shorter wavelengths scattered more by air molecules",
    ],
    exercises: [
      { exerciseNumber: "Exercise 10", questionCount: 14, types: ["MCQ", "Short Answer", "Long Answer", "Diagram"] },
    ],
  },

  {
    chapterNumber: 11,
    title: "Electricity",
    subject: "Science",
    grade: "10",
    board: "CBSE",
    unit: "Physics",
    examMarks: 12,
    estimatedWeeks: 3,
    overview:
      "Covers electric charge, potential difference, current, resistance, Ohm's law, resistors in series and parallel, electric power, heating effect (Joule's law), and safe domestic electric circuits.",
    sections: [
      {
        sectionNumber: "11.1",
        title: "Electric Current and Circuit",
        microConcepts: [
          { title: "Electric charge: measured in coulombs (C); proton (+), electron (-)" },
          { title: "Electric current: I = Q/t; unit = ampere (A)" },
          { title: "Conventional current: positive charge flow (+) to (-); electron flow opposite" },
          { title: "Ammeter: series; Voltmeter: parallel; galvanometer: detects current direction" },
        ],
      },
      {
        sectionNumber: "11.2",
        title: "Electric Potential and Potential Difference",
        microConcepts: [
          { title: "Potential difference: V = W/Q; unit = volt (V)" },
          { title: "1 volt = 1 joule per coulomb" },
          { title: "EMF: energy given by cell per unit charge" },
        ],
      },
      {
        sectionNumber: "11.3",
        title: "Ohm's Law and Resistance",
        microConcepts: [
          { title: "Ohm's law: V = IR (at constant temperature)" },
          { title: "Resistance: R = V/I; unit = ohm (Ω)" },
          { title: "Factors: R ∝ length (l), R ∝ 1/area (A); R = ρl/A" },
          { title: "Resistivity ρ: material property; unit = Ω·m" },
          { title: "Ohmic conductors: straight V-I graph; non-ohmic: curved (diode, filament bulb)" },
        ],
      },
      {
        sectionNumber: "11.4",
        title: "Resistors in Series and Parallel",
        microConcepts: [
          { title: "Series: R_total = R₁ + R₂ + R₃ (same current, voltage divides)" },
          { title: "Parallel: 1/R_total = 1/R₁ + 1/R₂ + 1/R₃ (same voltage, current divides)" },
          { title: "Parallel: total resistance less than smallest individual resistor" },
          { title: "Household appliances in parallel: each gets full voltage; fuse protects" },
        ],
      },
      {
        sectionNumber: "11.5",
        title: "Heating Effect of Current and Electric Power",
        microConcepts: [
          { title: "Joule's law: H = I²Rt (heating effect)" },
          { title: "Electric power: P = VI = I²R = V²/R; unit = watt (W)" },
          { title: "1 kWh = 3.6 × 10⁶ J = 1 unit of electricity" },
          { title: "Applications: electric iron, heater, geyser, bulb (tungsten filament — high R)" },
          { title: "Fuse: low melting point alloy — melts when current exceeds rating" },
        ],
      },
    ],
    theorems: [
      { name: "Ohm's Law", statement: "At constant temperature, the current through a conductor is directly proportional to the potential difference across it: V = IR." },
      { name: "Joule's Law of Heating", statement: "The heat produced in a conductor is H = I²Rt, proportional to square of current, resistance, and time." },
    ],
    keyFormulas: [
      "I = Q/t (current)",
      "V = W/Q (potential difference)",
      "V = IR (Ohm's law)",
      "R = ρl/A (resistance)",
      "Series: R = R₁ + R₂ + R₃",
      "Parallel: 1/R = 1/R₁ + 1/R₂ + 1/R₃",
      "P = VI = I²R = V²/R",
      "H = I²Rt (Joule's heating)",
      "1 kWh = 3.6 × 10⁶ J",
    ],
    examTips: [
      "Parallel circuit: total resistance is always less than the smallest resistor",
      "Household wiring is parallel so each device gets full 220V",
      "Power: P = V²/R used when V is fixed (household); P = I²R when I is fixed (series)",
      "Fuse and MCB protect against excess current (not excess voltage)",
      "Calculate electricity bill: units = kWh = (P in kW) × (time in hours)",
    ],
    exercises: [
      { exerciseNumber: "Exercise 11", questionCount: 18, types: ["MCQ", "Numerical", "Short Answer", "Long Answer"] },
    ],
  },

  {
    chapterNumber: 12,
    title: "Magnetic Effects of Electric Current",
    subject: "Science",
    grade: "10",
    board: "CBSE",
    unit: "Physics",
    examMarks: 12,
    estimatedWeeks: 2,
    overview:
      "Covers magnetic fields due to current-carrying conductors, the right-hand thumb rule, force on current-carrying conductors, Fleming's rules, electric motors, electromagnetic induction, generators, and domestic electric circuits.",
    sections: [
      {
        sectionNumber: "12.1",
        title: "Magnetic Field and Field Lines",
        microConcepts: [
          { title: "Magnet: field lines from N to S outside, S to N inside; never intersect; density = field strength" },
          { title: "Current-carrying conductor produces magnetic field (Oersted's experiment)" },
          { title: "Right-hand thumb rule: thumb = current direction, curled fingers = field direction" },
          { title: "Straight conductor: concentric circles around it" },
          { title: "Solenoid: field like a bar magnet inside; outside similar to bar magnet" },
          { title: "Electromagnet: soft iron core inside solenoid; temporary magnet" },
        ],
      },
      {
        sectionNumber: "12.2",
        title: "Force on Current-Carrying Conductor",
        microConcepts: [
          { title: "F = BIL sin θ (where B = field, I = current, L = length)" },
          { title: "Fleming's Left-Hand Rule: F = force (thumb), B = field (middle finger), I = current (index finger)" },
          { title: "Maximum force when conductor ⊥ to field; zero when parallel" },
        ],
      },
      {
        sectionNumber: "12.3",
        title: "Electric Motor",
        microConcepts: [
          { title: "Converts electrical energy → mechanical energy" },
          { title: "Armature coil + permanent magnet + commutator + brushes" },
          { title: "Commutator reverses current every half turn → continuous rotation" },
          { title: "Uses: fans, washing machines, pumps, electric vehicles" },
        ],
      },
      {
        sectionNumber: "12.4",
        title: "Electromagnetic Induction and Generator",
        microConcepts: [
          { title: "Faraday's law: changing magnetic flux induces EMF in a conductor" },
          { title: "Induced current direction: Fleming's Right-Hand Rule" },
          { title: "AC generator: converts mechanical → electrical energy; slip rings produce AC" },
          { title: "DC generator: commutator produces DC" },
          { title: "Motor vs Generator: motor = elec → mech; generator = mech → elec" },
        ],
      },
      {
        sectionNumber: "12.5",
        title: "Domestic Electric Circuits",
        microConcepts: [
          { title: "Three wires: live (brown/red), neutral (blue/black), earth (green/yellow)" },
          { title: "Earth wire: safety — connects metal body of appliance to earth" },
          { title: "Short circuit: live and neutral touch → very high current" },
          { title: "Overloading: too many appliances on same circuit → excess current" },
          { title: "Fuse / MCB: breaks circuit on excess current; MCB can be reset" },
        ],
      },
    ],
    theorems: [
      { name: "Faraday's Law of Electromagnetic Induction", statement: "The magnitude of induced EMF in a conductor is directly proportional to the rate of change of magnetic flux through it." },
    ],
    keyFormulas: [
      "Force on conductor: F = BIL sin θ",
      "Fleming's Left-Hand Rule (motor): FBI — Force (thumb), B-field (middle), I-current (index)",
      "Fleming's Right-Hand Rule (generator): same fingers, different mnemonic",
    ],
    examTips: [
      "Left hand = motor (force); Right hand = generator (induced current) — don't confuse",
      "Commutator → DC; Slip rings → AC",
      "Earth wire doesn't carry current in normal operation — only in fault",
      "Overloading ≠ short circuit: overloading = too many devices; short circuit = direct contact of live and neutral",
      "AC frequency in India = 50 Hz; voltage = 220V",
    ],
    exercises: [
      { exerciseNumber: "Exercise 12", questionCount: 16, types: ["MCQ", "Short Answer", "Long Answer", "Diagram"] },
    ],
  },

  // ─────────────────────── BIOLOGY (Environment) ───────────────────────
  {
    chapterNumber: 13,
    title: "Our Environment",
    subject: "Science",
    grade: "10",
    board: "CBSE",
    unit: "Biology",
    examMarks: 4,
    estimatedWeeks: 1,
    overview:
      "Explores ecosystems, food chains and webs, flow of energy through trophic levels, biodegradable and non-biodegradable waste, ozone layer depletion, and waste management.",
    sections: [
      {
        sectionNumber: "13.1",
        title: "Ecosystem",
        microConcepts: [
          { title: "Ecosystem: all living (biotic) + non-living (abiotic) components interacting" },
          { title: "Natural ecosystems: forest, pond; artificial: aquarium, crop field" },
          { title: "Producers: autotrophs (plants, algae) — base of food chain" },
          { title: "Consumers: primary (herbivores), secondary (carnivores), tertiary" },
          { title: "Decomposers: fungi, bacteria — break down dead organic matter" },
        ],
      },
      {
        sectionNumber: "13.2",
        title: "Food Chains and Webs",
        microConcepts: [
          { title: "Food chain: linear sequence of energy transfer" },
          { title: "Food web: interconnected food chains in an ecosystem" },
          { title: "Trophic levels: T1 (producers) → T2 → T3 → T4" },
          { title: "10% law: only 10% of energy transferred to next trophic level; 90% lost as heat" },
          { title: "Biological magnification: toxic substances (DDT, mercury) concentrate higher up the chain" },
          { title: "Humans affected most by biomagnification as they are at top of food chain" },
        ],
      },
      {
        sectionNumber: "13.3",
        title: "How Do Our Activities Affect the Environment?",
        microConcepts: [
          { title: "Biodegradable waste: broken down by decomposers (food waste, paper, cotton)" },
          { title: "Non-biodegradable waste: not broken down (plastics, DDT, heavy metals)" },
          { title: "Ozone layer: in stratosphere, absorbs UV radiation; depleted by CFCs" },
          { title: "Montreal Protocol: international agreement to phase out CFCs" },
          { title: "Waste management: reduce, reuse, recycle" },
          { title: "Garbage disposal: segregation at source (wet vs dry waste)" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "10% law: energy at next trophic level = 10% of previous level",
    ],
    examTips: [
      "10% energy law: if T1 = 10,000 J → T2 = 1,000 J → T3 = 100 J → T4 = 10 J",
      "Biomagnification: DDT concentrates in adipose tissue — does not get excreted",
      "Ozone (O₃) absorbs UV — its depletion causes skin cancer, cataracts",
      "CFCs from refrigerators, AC, aerosols destroy ozone catalytically",
      "Longer the food chain, more energy lost — shorter chains are more efficient",
    ],
    exercises: [
      { exerciseNumber: "Exercise 13", questionCount: 10, types: ["MCQ", "Short Answer", "Long Answer"] },
    ],
  },
];

// ── Seed runner ──────────────────────────────────────────────────────────────
async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  let inserted = 0;
  let updated  = 0;

  for (const ch of CHAPTERS) {
    const result = await Chapter.findOneAndUpdate(
      { subject: ch.subject, grade: ch.grade, board: ch.board, chapterNumber: ch.chapterNumber },
      ch,
      { upsert: true, new: true }
    );
    if (result.createdAt.getTime() === result.updatedAt.getTime()) {
      inserted++;
    } else {
      updated++;
    }
    console.log(`  ✓ Ch${ch.chapterNumber} [${ch.unit}] — ${ch.title}`);
  }

  console.log(`\nDone: ${inserted} inserted, ${updated} updated`);
  console.log("Chapters by unit:");
  const byUnit = CHAPTERS.reduce((acc, c) => {
    acc[c.unit] = (acc[c.unit] || 0) + 1;
    return acc;
  }, {});
  Object.entries(byUnit).forEach(([unit, count]) => console.log(`  ${unit}: ${count} chapters`));

  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
