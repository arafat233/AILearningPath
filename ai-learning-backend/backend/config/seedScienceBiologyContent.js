/**
 * Seed: CBSE Class 10 Science — Biology Unit
 * NcertTopicContent for 19 fine-grained topics across Chapters 5, 6, 7, 8, and 13.
 *
 * Safe to re-run — upserts on topicId.
 *
 * Usage:
 *   cd ai-learning-backend/backend
 *   node config/seedScienceBiologyContent.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const TOPICS = [
  // ══════════════════════════════════════════════════════════════════
  // CHAPTER 5 — Life Processes
  // ══════════════════════════════════════════════════════════════════
  {
    topicId: "sci_ch5_photosynthesis",
    subject: "Science",
    chapterNumber: 5,
    name: "Photosynthesis",
    prerequisite_knowledge: [
      "Basic cell structure (chloroplast)",
      "Concept of chemical energy and food",
      "Role of sunlight as an energy source",
      "Difference between autotrophs and heterotrophs",
    ],
    key_formulas: [
      "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂ (overall photosynthesis equation)",
      "2H₂O → 4H⁺ + 4e⁻ + O₂ (photolysis of water)",
    ],
    teaching_content: {
      intuition:
        "Plants are the ultimate solar panels of nature. Just as a solar panel converts sunlight into electricity, a leaf converts sunlight into chemical energy stored as glucose. The green pigment chlorophyll is the 'antenna' that captures light. Unlike animals that eat food, plants make their own food from just three ingredients: sunlight, carbon dioxide from air, and water from soil.",
      process_explanation:
        "Step 1 — Raw materials: The leaf absorbs CO₂ from the air through small pores called stomata, and the roots absorb water which travels up through the xylem. Step 2 — Light absorption: Chlorophyll in the chloroplasts absorbs sunlight (mainly red and blue wavelengths, reflecting green — which is why plants look green). Step 3 — Photolysis of water: In the light-dependent reactions, light energy splits water molecules (2H₂O → 4H⁺ + 4e⁻ + O₂). The oxygen is released as a by-product through stomata — this is where all the oxygen we breathe comes from. Step 4 — Carbon fixation: In the light-independent reactions (Calvin cycle), CO₂ is combined with hydrogen ions (from water splitting) to build glucose (C₆H₁₂O₆). Step 5 — Stomata regulation: Guard cells control the opening and closing of stomata. When turgid (full of water), guard cells swell and stomata open. When flaccid (water lost), stomata close to prevent water loss.",
      worked_example:
        "A variegated leaf (partly green, partly white) is tested for starch after being kept in sunlight. When iodine solution is applied: only the green parts turn blue-black (starch present), the white parts remain brown (no starch). This proves photosynthesis occurs only where chlorophyll is present. Conclusion: chlorophyll is essential for photosynthesis. This is the classic 'variegated leaf' experiment described in NCERT.",
      common_misconceptions: [
        "Students often say 'plants get their food from soil' — in fact, plants make their own food (glucose) from CO₂ and water; minerals from soil are NOT food.",
        "Students think oxygen comes from CO₂ splitting — oxygen is actually released from the splitting of WATER (photolysis), not from carbon dioxide.",
        "Students confuse photosynthesis and respiration — photosynthesis makes glucose and releases O₂; respiration breaks glucose and releases CO₂.",
      ],
      shortcuts_and_tricks: [
        "Mnemonic for photosynthesis equation: 'Six Carbon Dioxide + Six Water → Sugar + Six Oxygen' (6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂).",
        "Remember: O₂ comes from H₂O (both contain oxygen, but O₂ is released from water splitting).",
        "Guard cells are shaped like kidneys — when they absorb water, they bow outward and the stomatal pore between them opens.",
        "Chlorophyll absorbs red + blue light, reflects green — that is why leaves appear green.",
      ],
      diagram_description:
        "Diagram: Cross-section of a leaf showing epidermis (top and bottom layers), mesophyll cells containing chloroplasts (labelled), stomata pores on the lower epidermis with two guard cells flanking each pore, xylem vein carrying water up, and phloem vein carrying glucose out. Arrows show: CO₂ entering through stomata, O₂ exiting through stomata, H₂O entering through xylem, and glucose being transported through phloem. A separate inset shows a chloroplast with grana (stacked thylakoids where light reactions occur) and stroma (where Calvin cycle occurs).",
      key_takeaway:
        "Photosynthesis uses light energy to convert CO₂ + H₂O into glucose + O₂; oxygen is a by-product released from the splitting of water (photolysis), not from CO₂.",
    },
  },

  {
    topicId: "sci_ch5_human_digestion",
    subject: "Science",
    chapterNumber: 5,
    name: "Human Digestive System",
    prerequisite_knowledge: [
      "Basic organ system concept",
      "Difference between physical and chemical digestion",
      "What enzymes are and their role",
    ],
    key_formulas: [
      "Starch → (salivary amylase) → Maltose",
      "Proteins → (pepsin in stomach) → Peptides",
      "Emulsification of fats by bile (not enzymatic)",
    ],
    teaching_content: {
      intuition:
        "The digestive system is like a long assembly line that breaks down large food molecules into tiny pieces small enough to enter the bloodstream. Imagine a factory that receives a huge machine (a sandwich) and must break it down into individual nuts and bolts (glucose, amino acids, fatty acids) that can be shipped to cells across the body. Each section of the 'factory' (organ) has specialised workers (enzymes) that handle a specific type of material.",
      process_explanation:
        "Step 1 — Mouth: Teeth mechanically grind food; salivary amylase begins starch digestion (starch → maltose). Tongue forms a bolus. Step 2 — Oesophagus: Peristalsis (wave-like muscle contractions) pushes food to the stomach. No digestion here. Step 3 — Stomach: Gastric glands secrete pepsin (active form; secreted as inactive pepsinogen activated by HCl) which digests proteins into peptides. HCl creates acidic pH (~2) and kills bacteria. Mucus lining protects stomach walls. Step 4 — Small intestine: Pancreas secretes pancreatic juice (amylase, lipase, trypsin). Liver produces bile stored in gall bladder — bile emulsifies fats (breaks large fat droplets into small ones for lipase to work on). The intestinal wall secretes intestinal juice completing digestion. Final products: glucose, amino acids, fatty acids + glycerol. Step 5 — Absorption: Villi (finger-like projections on the inner wall of the small intestine) and microvilli (on each villus cell) massively increase surface area. Each villus has blood capillaries (absorb glucose and amino acids → blood → liver via hepatic portal vein) and lacteals/lymph vessels (absorb fatty acids and glycerol → lymph). Step 6 — Large intestine: Absorbs water and minerals; remaining material is faeces, expelled through anus.",
      worked_example:
        "A student swallows a piece of bread (starch). Trace its digestion: Mouth → salivary amylase breaks starch into maltose. Stomach → HCl and pepsin act on bread protein. Small intestine → pancreatic amylase completes starch digestion; lactase, maltase convert maltose to glucose; lipase (with bile) digests any fats. Villi absorb glucose into blood. The glucose reaches liver via hepatic portal vein and is stored as glycogen or used for energy. This is why 'where does starch digestion begin?' → answer is the mouth.",
      common_misconceptions: [
        "Students say 'digestion starts in the stomach' — it actually starts in the mouth (salivary amylase digests starch).",
        "Students think bile is an enzyme — bile is NOT an enzyme; it is a digestive juice that emulsifies (breaks up) fat droplets to increase surface area for lipase.",
        "Students confuse 'villi' (in small intestine) with 'alveoli' (in lungs) — both increase surface area but in different systems.",
      ],
      shortcuts_and_tricks: [
        "Acronym for digestive organs: MESLCRSA — Mouth, Esophagus, Stomach, Liver/Gall bladder, Pancreas, Small intestine, Large intestine, Rectum, Anus.",
        "Bile = emulsifier (not enzyme); produced in liver, stored in gall bladder.",
        "Villi trick: think 'villi = tiny fingers' on the small intestine wall — finger-shaped projections for maximum absorption.",
        "Remember pepsin works in acidic stomach; trypsin works in alkaline small intestine.",
      ],
      diagram_description:
        "Diagram: Full human digestive system — labelled organs from top to bottom: mouth (with salivary glands), pharynx, oesophagus, stomach (with labels: fundus, pyloric sphincter, gastric glands), liver and gall bladder (with bile duct entering small intestine), pancreas (with pancreatic duct), small intestine (duodenum, jejunum, ileum), large intestine (colon, cecum, appendix), rectum, and anus. Separate inset shows a cross-section of the small intestine wall with a single villus magnified: showing microvilli at tip, blood capillary network inside, and a lacteal (lymph vessel) at the center.",
      key_takeaway:
        "Digestion begins in the mouth (amylase on starch); bile emulsifies fats but is not an enzyme; absorption of final nutrients occurs in the small intestine through villi, which massively increase surface area.",
    },
  },

  {
    topicId: "sci_ch5_respiration",
    subject: "Science",
    chapterNumber: 5,
    name: "Respiration",
    prerequisite_knowledge: [
      "Photosynthesis and glucose production",
      "Basic cell structure (mitochondria)",
      "Concept of ATP as energy currency",
    ],
    key_formulas: [
      "Aerobic: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + 38 ATP",
      "Anaerobic (yeast): C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂ + 2 ATP",
      "Anaerobic (muscle): C₆H₁₂O₆ → 2C₃H₆O₃ (lactic acid) + 2 ATP",
    ],
    teaching_content: {
      intuition:
        "Respiration is the cell's way of unlocking energy from food. Think of glucose as a fully charged battery — respiration is the process of 'discharging' that battery to get usable energy (ATP) for all life activities. Aerobic respiration is like burning fuel completely with oxygen — highly efficient (38 ATP). Anaerobic respiration is like partial burning without oxygen — produces waste products and far less energy (2 ATP). You experience anaerobic respiration in your muscles during intense exercise when oxygen supply is insufficient — the burning sensation and soreness is from lactic acid buildup.",
      process_explanation:
        "Aerobic respiration (with oxygen): Step 1 — Glucose enters the cell and is broken down in the cytoplasm through glycolysis into 2 pyruvate molecules + 2 ATP. Step 2 — Pyruvate enters the mitochondria. Step 3 — Pyruvate is completely oxidised to CO₂ + H₂O, releasing energy stored in 36 more ATP molecules (Krebs cycle + electron transport chain). Total yield: 38 ATP per glucose. CO₂ diffuses out; O₂ is used in mitochondria. In lungs: alveoli (thin walls, rich blood supply, large surface area, moist lining) allow O₂ to diffuse into blood and CO₂ to diffuse out. Anaerobic respiration in yeast (no oxygen): Pyruvate is converted to ethanol + CO₂ + 2 ATP. Used in brewing (ethanol) and baking (CO₂ makes bread rise). Anaerobic respiration in muscles (no oxygen): Pyruvate converted to lactic acid + 2 ATP. Lactic acid causes the burning/cramping sensation. After exercise, heavy breathing repays the 'oxygen debt' to break down accumulated lactic acid.",
      worked_example:
        "A sprinter runs 100 m in 10 seconds. During the race: muscles demand ATP faster than aerobic respiration can supply it (aerobic is slower). So muscles switch to anaerobic respiration producing lactic acid rapidly. After the race: the athlete breathes heavily (pants) to supply extra O₂ to the liver, which converts accumulated lactic acid back to pyruvate and then glucose. This is called repaying the oxygen debt. Exam question: 'Why does a person breathe faster after exercise?' → Lactic acid builds up during anaerobic respiration; extra oxygen is needed to oxidise it.",
      common_misconceptions: [
        "Students confuse respiration with breathing — breathing (ventilation) is the physical movement of air in/out of lungs; respiration is the cellular chemical process of releasing energy from glucose.",
        "Students think anaerobic means 'no respiration at all' — anaerobic respiration STILL releases energy from glucose; it just does so without oxygen and less efficiently.",
        "Students write that aerobic respiration produces only CO₂ and water — it produces ATP (energy) as well; CO₂ and water are the waste products.",
      ],
      shortcuts_and_tricks: [
        "ATP count: Aerobic = 38 ATP; Anaerobic = only 2 ATP (one-twentieth the yield).",
        "Yeast makes Ethanol + CO₂; Muscles make Lactic acid (no CO₂ in muscles).",
        "Memory trick for alveoli features: SLIM — Surface area (large), Large capillary supply, moist Inner lining, thin Membrane (one cell thick).",
        "Aerobic = complete oxidation = CO₂ + H₂O. Anaerobic = incomplete = ethanol/lactic acid.",
      ],
      diagram_description:
        "Diagram 1 (alveolus): Single alveolus surrounded by a dense capillary network. Labels show: alveolar wall (one cell thick), capillary wall (one cell thick), red blood cells inside capillary, O₂ arrow from alveolus into capillary, CO₂ arrow from capillary into alveolus, bronchiole connecting to alveolus. Diagram 2 (respiration summary): A flowchart showing Glucose → (Glycolysis, cytoplasm) → 2 Pyruvate. Two branches: With O₂ → mitochondria → CO₂ + H₂O + 38 ATP. Without O₂ → yeast branch → Ethanol + CO₂ + 2 ATP; muscle branch → Lactic acid + 2 ATP.",
      key_takeaway:
        "Aerobic respiration yields 38 ATP and produces CO₂ + H₂O; anaerobic in yeast gives ethanol + CO₂ (2 ATP), in muscles gives lactic acid (2 ATP); alveoli are optimised for gas exchange by being thin, moist, and densely capillarised.",
    },
  },

  {
    topicId: "sci_ch5_transport_blood",
    subject: "Science",
    chapterNumber: 5,
    name: "Transport in Animals — Blood and Circulatory System",
    prerequisite_knowledge: [
      "Basic concept of the heart as a pump",
      "Difference between arteries and veins",
      "Concept of oxygenated vs deoxygenated blood",
    ],
    key_formulas: [
      "Blood pressure = Systolic / Diastolic (normal: 120/80 mmHg)",
      "Double circulation: pulmonary circuit + systemic circuit",
    ],
    teaching_content: {
      intuition:
        "The heart is a four-chambered pump that runs non-stop for your entire life. The circulatory system is like a city-wide plumbing network with two separate loops: one loop sends blood to the lungs to pick up oxygen (pulmonary circuit), and the other loop sends that oxygen-rich blood to every cell in the body (systemic circuit). Having two circuits ensures that oxygenated and deoxygenated blood never mix — this double circulation keeps our tissues well-supplied with oxygen, making us efficient warm-blooded animals.",
      process_explanation:
        "Heart chambers: The heart has 4 chambers. Right atrium (RA) and Right ventricle (RV) handle deoxygenated blood; Left atrium (LA) and Left ventricle (LV) handle oxygenated blood. The two sides are completely separated by the septum. Pulmonary circulation (right side → lungs → left side): Deoxygenated blood from body → RA → RV → pulmonary artery → lungs → gas exchange → pulmonary vein (oxygenated) → LA. Systemic circulation (left side → body → right side): Oxygenated blood → LA → LV → aorta → body cells → gas exchange (O₂ out, CO₂ in) → venae cavae (deoxygenated) → RA. Valves: Bicuspid (mitral) valve between LA and LV; Tricuspid valve between RA and RV; Semilunar valves in aorta and pulmonary artery — prevent backflow. Blood components: Plasma (55%) — liquid with dissolved nutrients, hormones, CO₂; Red blood cells (RBCs) — contain haemoglobin, carry O₂; White blood cells (WBCs) — immune defence; Platelets — blood clotting. Arteries vs Veins: Arteries carry blood AWAY from heart (thick, elastic walls, no valves; carry oxygenated blood except pulmonary artery). Veins carry blood TOWARDS heart (thin walls, have valves to prevent backflow; carry deoxygenated blood except pulmonary vein).",
      worked_example:
        "Trace a single red blood cell's complete double circulation journey: Starts in Right Atrium (deoxygenated, arrived from vena cava) → Right Ventricle → pulmonary artery → left lung → alveolar capillaries (CO₂ released, O₂ picked up) → pulmonary vein → Left Atrium → Left Ventricle → aorta → systemic arteries → capillaries in leg muscle (O₂ released to cells, CO₂ picked up) → veins → vena cava → back to Right Atrium. The complete double circuit is traced. Remember: pulmonary artery is the ONLY artery carrying deoxygenated blood; pulmonary vein is the ONLY vein carrying oxygenated blood.",
      common_misconceptions: [
        "Students say 'veins always carry deoxygenated blood' — the pulmonary vein is the exception: it carries oxygenated blood from lungs to heart.",
        "Students think the left side of the heart is anatomically on the left side of the body as drawn in diagrams — in standard diagrams the left side of the heart appears on the RIGHT side of the page (because the heart is drawn from the front).",
        "Students say the heart has two chambers — the human heart has FOUR chambers; fish have 2-chambered, amphibians have 3-chambered.",
      ],
      shortcuts_and_tricks: [
        "Memory for exceptions: 'Pulmonary Artery is the Poor Artery' — it carries deoxygenated blood. 'Pulmonary Vein is the Victorious Vein' — it carries oxygenated blood.",
        "Atria (plural of atrium) RECEIVE blood; Ventricles SEND blood out (pump). A = Accept, V = eVict.",
        "Left ventricle has the thickest wall — it pumps blood to the entire body, the highest pressure.",
        "Remember: 4 chambers in humans (2 atria + 2 ventricles); double circulation = 2 loops.",
      ],
      diagram_description:
        "Diagram: Human heart cut open (anterior view) showing all four chambers labelled: Right Atrium (RA), Right Ventricle (RV), Left Atrium (LA), Left Ventricle (LV). Labels on vessels: Superior and inferior vena cava entering RA; pulmonary artery leaving RV (labelled: deoxygenated); pulmonary vein entering LA (labelled: oxygenated); aorta leaving LV. Valves labelled: tricuspid (RA–RV), bicuspid/mitral (LA–LV), semilunar valves in aorta and pulmonary artery. Septum clearly divides left from right. Arrows show direction of blood flow. Colour code: blue for deoxygenated blood, red for oxygenated blood.",
      key_takeaway:
        "Humans have a four-chambered heart with double circulation (pulmonary + systemic loops); pulmonary artery carries deoxygenated blood (the only artery to do so) and pulmonary vein carries oxygenated blood (the only vein to do so).",
    },
  },

  {
    topicId: "sci_ch5_transport_plants",
    subject: "Science",
    chapterNumber: 5,
    name: "Transport in Plants — Xylem and Phloem",
    prerequisite_knowledge: [
      "Cell structure and osmosis",
      "Root structure (root hairs, root pressure)",
      "Basic idea of vascular tissue",
    ],
    key_formulas: [
      "Transpiration pull drives water movement up xylem (cohesion–tension mechanism)",
      "Source-to-sink translocation in phloem (pressure flow hypothesis)",
    ],
    teaching_content: {
      intuition:
        "Plants face a unique challenge: they need to move water from roots (up to 100 metres up in tall trees) against gravity, without a pump. They solve this through a cleverly passive system — evaporation of water from leaves creates a tension (like sucking through a straw) that pulls water upward through thin tubes called xylem. For moving food (sugar), plants use a different tube system called phloem, which actively pumps sugar from where it is made (source: leaves) to where it is used or stored (sink: roots, fruits, growing tips).",
      process_explanation:
        "Xylem (water and mineral transport): Route: Soil → root hair cells (by osmosis) → root cortex → xylem vessels in stem → xylem in leaves. Driving force: Transpiration pull — as water evaporates from leaf cells through stomata (transpiration), cells become concentrated and draw water from neighbouring cells by osmosis, creating a continuous tension (negative pressure) that pulls the water column upward. This works because water molecules cling to each other (cohesion) and to xylem walls (adhesion). Additional support: root pressure — roots actively push water upward, strongest at night. Xylem is unidirectional (roots to leaves only). Phloem (food/sugar transport): Route: Source (leaves where photosynthesis makes sucrose) → phloem sieve tubes → Sink (roots, fruits, growing buds). Driving force: Active transport loads sucrose into sieve tubes at the source → osmotic pressure increases → water follows from nearby xylem → pressure pushes contents toward the sink (lower pressure). This is called the pressure flow or mass flow hypothesis. Phloem is bidirectional — it can move food to any part of the plant depending on where the sink is (upward to growing tip, downward to roots). Key difference: Xylem moves water + minerals, is dead tissue, unidirectional. Phloem moves organic food (sucrose), is living tissue, bidirectional.",
      worked_example:
        "A plant is deprived of water on a hot day. Sequence of events: Stomata close (guard cells lose turgidity → flaccid → stomatal pore closes) to prevent water loss. Photosynthesis slows because CO₂ cannot enter. Transpiration pull decreases. In an experiment, if you ring-bark a tree (remove the bark/phloem in a circle), the tree will show swelling above the ring — because phloem food cannot pass downward, it accumulates. This proves phloem transports food downward. Xylem (inside wood) is unaffected, so the tree doesn't immediately die.",
      common_misconceptions: [
        "Students say 'xylem carries food and phloem carries water' — this is exactly backwards. Xylem = water and minerals. Phloem = organic food (sucrose).",
        "Students think phloem is unidirectional like xylem — phloem is bidirectional; it moves from source to sink, which can be in either direction depending on the plant's needs.",
        "Students believe plants absorb glucose from soil — plants MAKE glucose by photosynthesis; they absorb only water and dissolved minerals (not food) from the soil.",
      ],
      shortcuts_and_tricks: [
        "Memory trick: 'Xylem = Xwater' (X for water). 'Phloem = Phood' (Ph for food/phytochemicals).",
        "Xylem = dead tissue (no cytoplasm), unidirectional, moves water UP. Phloem = living, bidirectional, moves sugar.",
        "Transpiration pull works like a straw — you suck at the top (evaporation at leaves), water rises from the bottom (roots).",
        "Root pressure is demonstrated by guttation — water droplets at leaf tips on cool mornings when transpiration is low but root pressure pushes water up.",
      ],
      diagram_description:
        "Diagram: Cross-section of a dicot stem showing a vascular bundle with xylem (inner side, labelled, with thick-walled dead cells/tracheids and vessels) and phloem (outer side, labelled, with living sieve tubes and companion cells). Separate arrow diagram: upward arrow along xylem labelled 'Water and minerals — unidirectional — driven by transpiration pull'; bidirectional arrows along phloem labelled 'Sucrose (food) — source to sink — pressure flow'. Inset diagram of root hair cell showing osmosis of water from soil into the cell.",
      key_takeaway:
        "Xylem transports water and minerals upward only (driven by transpiration pull, dead tissue); phloem transports organic food (sucrose) bidirectionally from source to sink (living tissue, active process).",
    },
  },

  {
    topicId: "sci_ch5_excretion",
    subject: "Science",
    chapterNumber: 5,
    name: "Excretion — Nephron and Urine Formation",
    prerequisite_knowledge: [
      "Basic kidney anatomy (bean-shaped organs, left and right)",
      "Concept of filtration",
      "Blood composition — urea is a metabolic waste",
    ],
    key_formulas: [
      "Urine formation: Glomerular filtration → Selective reabsorption → Tubular secretion",
      "Urea is formed in the liver: 2NH₃ + CO₂ → Urea + H₂O (urea cycle summary)",
    ],
    teaching_content: {
      intuition:
        "Your kidneys are the body's filtration plant — they process about 180 litres of blood plasma per day, but only produce about 1.5 litres of urine. They work by making a crude filter of ALL small molecules first, then carefully taking back everything valuable (glucose, amino acids, most water, useful salts), and letting only waste products (urea, excess salts, excess water) leave as urine. Think of it like a coffee filter: it passes everything, and then you pick out the coffee grounds (waste) while recovering the liquid.",
      process_explanation:
        "Nephron structure (1 million per kidney): Each nephron has: Bowman's capsule — a cup-shaped structure that encloses the glomerulus. Glomerulus — a tangled ball of capillaries inside Bowman's capsule where filtration happens. Renal tubule — a long coiled tube with three sections: Proximal Convoluted Tubule (PCT), Loop of Henle, and Distal Convoluted Tubule (DCT). Collecting duct — drains into the ureter. Urine formation — three stages: Stage 1 (Ultrafiltration in glomerulus): Blood enters glomerulus at high pressure (afferent arteriole wider than efferent). Small molecules forced out — water, glucose, urea, uric acid, salts pass into Bowman's capsule (called glomerular filtrate). Large molecules (proteins, RBCs) stay in blood. Stage 2 (Selective reabsorption in tubule): As filtrate moves through PCT and DCT, useful substances are actively reabsorbed back into blood — all glucose, all amino acids, 99% of water, essential salts. Stage 3 (Tubular secretion): Additional waste like H⁺ ions, drugs, excess K⁺ are secreted from blood into tubule. Final urine: concentrated urea solution + excess salts + water — flows to collecting duct → renal pelvis → ureter → urinary bladder → urethra → excreted. Dialysis: When kidneys fail, a dialysis machine performs filtration artificially. Blood is passed through a semi-permeable membrane in a dialysate solution — urea and salts diffuse out; glucose and proteins (too large) are retained.",
      worked_example:
        "A sample of glomerular filtrate is tested — it contains glucose. A sample of urine from the same person contains no glucose. Explanation: Glucose was filtered at the glomerulus (small enough to pass) but was completely reabsorbed in the PCT (proximal convoluted tubule) because the body needs all glucose. In a diabetic patient, blood glucose is too high — the reabsorption mechanism is saturated, and glucose appears in urine (glucosuria). This is why urine glucose tests can diagnose diabetes. Exam question: 'What happens to glucose filtered at the glomerulus?' → It is completely reabsorbed in the proximal convoluted tubule and returned to blood.",
      common_misconceptions: [
        "Students say 'kidneys filter blood directly' — kidneys filter a fluid called glomerular filtrate (not whole blood); only small molecules enter the tubule; large proteins and blood cells never leave the glomerulus.",
        "Students think urine formation is just filtration — urine formation is a 3-step process: filtration, THEN selective reabsorption (most important step), THEN tubular secretion.",
        "Students confuse ureter and urethra — Ureter (tube from kidney to bladder); Urethra (tube from bladder to outside body). Ureter is paired (two), urethra is single.",
      ],
      shortcuts_and_tricks: [
        "Mnemonic for urine formation: 'Filters, Reabsorbs, Secretes' (FRS).",
        "Glomerulus + Bowman's capsule = Malpighian body (or renal corpuscle) — this name comes up in exams.",
        "Ureter vs Urethra: Ureter has an 'e' in the middle — goes to bladder. Urethra has an 'a' — exits the body.",
        "Remember: glucose is NEVER present in normal urine — it is completely reabsorbed. Presence of glucose in urine = diabetes indicator.",
      ],
      diagram_description:
        "Diagram of a single nephron fully labelled: Bowman's capsule (cup shape) enclosing the glomerulus (knot of capillaries). From Bowman's capsule: Proximal Convoluted Tubule (PCT) leading to the Loop of Henle (U-shaped descending and ascending limbs), then the Distal Convoluted Tubule (DCT), then the Collecting Duct. Arrows labelled at each segment: 'Filtration' at glomerulus, 'Selective reabsorption' along PCT (with glucose, amino acids, water labelled as reabsorbed), 'Tubular secretion' at DCT. Blood vessels: afferent arteriole entering glomerulus (labelled 'high pressure'), efferent arteriole leaving, peritubular capillaries wrapping around tubule. Final urine arrow at collecting duct leading to ureter.",
      key_takeaway:
        "The nephron forms urine in three steps — ultrafiltration at the glomerulus, selective reabsorption in the tubules (glucose is always fully reabsorbed), and tubular secretion; dialysis mimics glomerular filtration using a semi-permeable membrane.",
    },
  },

  // ══════════════════════════════════════════════════════════════════
  // CHAPTER 6 — Control and Coordination
  // ══════════════════════════════════════════════════════════════════
  {
    topicId: "sci_ch6_nervous_system",
    subject: "Science",
    chapterNumber: 6,
    name: "Nervous System — Neuron Structure and Organisation",
    prerequisite_knowledge: [
      "Basic cell biology",
      "Concept of electrical signals in the body",
      "Difference between voluntary and involuntary actions",
    ],
    key_formulas: [
      "Nerve impulse transmission: electrical signal along axon → chemical signal across synapse",
      "Speed of nerve impulse: ~90–120 m/s in myelinated neurons",
    ],
    teaching_content: {
      intuition:
        "The nervous system is your body's electrical communication network — like the internet of the body. Messages (nerve impulses) travel as electrical signals along wire-like neurons at speeds up to 120 m/s. When a signal needs to jump from one neuron to another, it converts from electrical to chemical at the synapse (the gap between neurons) and then back to electrical. The CNS (brain + spinal cord) is the server; the PNS (all nerves outside the brain and spinal cord) is the network of cables connecting to every part of the body.",
      process_explanation:
        "Neuron structure: Cell body (cyton) — contains nucleus, controls cell functions. Dendrites — short, branched projections that RECEIVE signals from other neurons or sensory receptors. Axon — long, single projection that TRANSMITS signals away from cell body. Axon can be very long (e.g., from spinal cord to toe). Myelin sheath — fatty insulation around axon (speeds up signal conduction; nodes of Ranvier are gaps in the sheath where signal jumps). Axon terminal (synaptic knob) — tip of axon that releases neurotransmitters. Types of neurons: Sensory (afferent) — carry signals FROM sense organs/receptors TO CNS. Motor (efferent) — carry signals FROM CNS TO muscles/glands (effectors). Interneurons (relay neurons) — within the CNS; connect sensory and motor neurons. Organisation: CNS = Brain + Spinal cord (processes information, coordinates responses). PNS = all nerves outside CNS (cranial nerves + spinal nerves + autonomic nerves). Synapse mechanism: Action potential (electrical) reaches axon terminal → calcium channels open → vesicles release neurotransmitters (e.g., acetylcholine) into synaptic cleft → neurotransmitter binds to receptor on next neuron → new electrical signal generated → neurotransmitter is reabsorbed/broken down.",
      worked_example:
        "You touch a hot pan: sensory receptors in fingertip detect heat → sensory neuron sends impulse to spinal cord → spinal cord processes (for reflex: spinal cord responds WITHOUT waiting for brain; for conscious response: signal also goes to brain) → motor neuron sends impulse from spinal cord to finger muscles → hand pulls away. The brain receives the signal a moment later — that's why you pull away BEFORE you consciously 'feel' the pain. This demonstrates: reflex pathway (spinal cord) is faster than conscious pathway (brain).",
      common_misconceptions: [
        "Students confuse dendrites and axons — dendrites RECEIVE signals (think: 'Dendrites = Detect/Receive'); axons TRANSMIT signals away ('Axon = Away').",
        "Students think the synapse is a physical connection — the synapse is a GAP (synaptic cleft) of about 20 nm; neurons do not physically touch; communication is chemical via neurotransmitters.",
        "Students say 'only the brain controls all actions' — reflex actions are controlled by the spinal cord, not the brain. This is why reflexes are faster.",
      ],
      shortcuts_and_tricks: [
        "D-A rule: Dendrites → Detect/Receive. Axon → Away (transmits away from cell body).",
        "SAME-DAVE: Sensory=Afferent, Motor=Efferent, D=dendrite A=axon V=ventral E=efferent.",
        "CNS = Brain + Spinal cord. PNS = everything else.",
        "At a synapse: electrical → chemical → electrical (ECE pattern).",
      ],
      diagram_description:
        "Diagram of a motor neuron fully labelled: large cell body/cyton with nucleus visible; multiple branched dendrites emerging from cell body; single long axon with myelin sheath shown as segmented coating, with nodes of Ranvier (gaps in myelin) labelled; axon terminal/synaptic knob at the end. Separate inset of a synapse: pre-synaptic membrane (axon terminal) with synaptic vesicles containing neurotransmitters; synaptic cleft (gap); post-synaptic membrane (next neuron/muscle) with receptor proteins. Arrows show: neurotransmitter release into cleft, binding to receptors. Labels: vesicles, neurotransmitter molecules, receptor proteins, synaptic cleft.",
      key_takeaway:
        "Dendrites receive signals; axons transmit them away from the cell body; the synapse is a chemical gap where neurotransmitters convert electrical signals to chemical and back; CNS processes, PNS communicates.",
    },
  },

  {
    topicId: "sci_ch6_reflex_arc",
    subject: "Science",
    chapterNumber: 6,
    name: "Reflex Action and Reflex Arc",
    prerequisite_knowledge: [
      "Neuron types (sensory, motor, interneuron)",
      "CNS vs PNS",
      "Basic spinal cord anatomy",
    ],
    key_formulas: [
      "Reflex arc pathway: Receptor → Sensory neuron → Spinal cord (relay neuron) → Motor neuron → Effector",
    ],
    teaching_content: {
      intuition:
        "Imagine the spinal cord as a local police station that handles minor emergencies without calling headquarters (the brain). A reflex action is an automatic, involuntary response to a stimulus that is coordinated by the spinal cord — it is completed and the response given before the brain even processes what happened. This is why you pull your hand away from a hot object BEFORE feeling pain — the spinal cord has already sent the 'pull away' command while the pain signal is still travelling to the brain. Reflexes evolved because fast reactions to danger (burns, sharp objects) are critical for survival.",
      process_explanation:
        "Pathway of a reflex arc (using 'hand touching hot object' example): Step 1: Stimulus — heat from hot object. Step 2: Receptor — thermoreceptors and pain receptors in skin of hand detect the stimulus. Step 3: Sensory (afferent) neuron — carries impulse from receptor toward the spinal cord (enters through dorsal/posterior root of spinal cord). Step 4: Relay (interneuron) in spinal cord — spinal cord processes signal; interneuron connects sensory to motor pathways. The spinal cord sends two signals simultaneously: one to motor neuron (for fast reflex response) and one upward to the brain (for conscious awareness of pain, delayed). Step 5: Motor (efferent) neuron — carries response impulse from spinal cord to effector muscle (exits through ventral/anterior root of spinal cord). Step 6: Effector — biceps muscle contracts, hand withdraws. Step 7: Response — hand pulled away from heat. Why reflex is faster than voluntary: Voluntary action path = stimulus → brain → back down to effector (longer path). Reflex path = stimulus → spinal cord → effector (shorter path, no brain involved in generating response). The brain receives information about the reflex AFTER it happens (that's when you feel the pain).",
      worked_example:
        "The knee-jerk reflex (patellar reflex): Doctor taps just below the kneecap (patellar tendon). Receptor: stretch receptors in quadriceps muscle detect the stretch. Sensory neuron: carries signal to spinal cord (lumbar region). Relay neuron: in spinal cord connects sensory to motor pathway — notably, this reflex has NO interneuron (monosynaptic reflex — simplest possible). Motor neuron: carries signal back to quadriceps muscle. Effector: quadriceps contracts. Response: lower leg kicks forward. This is the simplest reflex in the human body — used by doctors to test spinal cord integrity.",
      common_misconceptions: [
        "Students say 'the brain controls reflex actions' — reflex actions are controlled by the SPINAL CORD, not the brain. The brain receives information AFTER the reflex occurs.",
        "Students think the reflex arc goes: receptor → brain → muscle — the correct path is receptor → SPINAL CORD → muscle (brain is bypassed for the reflex response).",
        "Students confuse voluntary and reflex actions — voluntary = consciously decided, controlled by brain; reflex = automatic, involuntary, controlled by spinal cord.",
      ],
      shortcuts_and_tricks: [
        "Mnemonic: RSSME — Receptor, Sensory neuron, Spinal cord, Motor neuron, Effector.",
        "Key differentiator: reflex = spinal cord = fast. Voluntary = brain = slower (but more complex).",
        "Sensory neurons enter the DORSAL (back) root of spinal cord; motor neurons exit from the VENTRAL (front) root. Dorsal = sensor side, Ventral = motor side.",
        "The word 'afferent' = arriving at CNS (sensory). 'Efferent' = exiting CNS (motor).",
      ],
      diagram_description:
        "Diagram of a reflex arc showing a cross-section of the spinal cord (H-shaped grey matter, white matter surrounding it). Labels on spinal cord: dorsal root with dorsal root ganglion (cell body of sensory neuron), ventral root (motor neuron exits), interneuron in grey matter. On the left side of diagram: hand near a flame (stimulus); pain receptor in skin; sensory neuron curving from receptor through dorsal root into spinal cord; relay neuron inside spinal cord grey matter; motor neuron curving from ventral root out to biceps muscle; effector muscle (biceps) labeled 'contracts'. Arrows show direction of impulse flow. Dotted arrow going upward from spinal cord toward brain labeled 'Signal to brain (delayed — for conscious perception of pain)'.",
      key_takeaway:
        "Reflex actions are involuntary responses coordinated by the spinal cord — the pathway is receptor → sensory neuron → spinal cord → motor neuron → effector, bypassing the brain for speed; the brain receives pain information only AFTER the reflex response.",
    },
  },

  {
    topicId: "sci_ch6_brain",
    subject: "Science",
    chapterNumber: 6,
    name: "Human Brain — Structure and Functions",
    prerequisite_knowledge: [
      "CNS = brain + spinal cord",
      "Voluntary vs involuntary actions",
      "Basic protective structures (skull)",
    ],
    key_formulas: [],
    teaching_content: {
      intuition:
        "The brain is like the central command centre for the entire body. Different departments (regions) handle different functions: the chief executive (cerebrum) makes decisions and controls voluntary actions; the maintenance team (cerebellum) ensures smooth, coordinated movement; and the life-support team (medulla oblongata) handles the automatic functions that keep you alive without you thinking about them — heartbeat, breathing, digestion.",
      process_explanation:
        "The brain is protected by the skull (bony covering) and three membranes called meninges (dura mater, arachnoid mater, pia mater). Cerebrospinal fluid (CSF) fills the spaces between meninges and cushions the brain against shocks. Major parts: Forebrain — Cerebrum: Largest part of brain; divided into two hemispheres. Controls all voluntary actions, thinking, reasoning, memory, learning, speech, and interpretation of sensory information (sight, hearing, touch). Left hemisphere controls right side of body and vice versa. Cerebrum has a wrinkled (folded) surface (cerebral cortex) — folds (gyri and sulci) increase surface area for more neurons. Midbrain — connects forebrain and hindbrain; controls some visual and auditory reflexes (e.g., pupil dilation). Hindbrain — Three parts: Cerebellum: Controls balance, posture, and coordination of precise voluntary movements. Damage to cerebellum causes loss of balance (ataxia) — person cannot walk straight. Pons: Connects cerebellum with rest of brainstem; involved in breathing regulation. Medulla oblongata (medulla): Controls ALL involuntary life functions — heart rate, breathing, blood pressure, swallowing, vomiting. Connects to the spinal cord. Also called the brain stem. Hypothalamus: Master regulator — controls body temperature, hunger, thirst, sleep-wake cycle, and pituitary gland (links nervous and endocrine systems).",
      worked_example:
        "A patient suffers a stroke (blood supply blockage) in the cerebellum. Symptoms: cannot maintain balance, has tremors, cannot perform smooth coordinated movements (ataxia), but can still speak and think clearly (cerebrum is unaffected) and vital signs are stable (medulla is unaffected). This confirms: cerebellum = coordination and balance only. Another example: Damage to medulla → fatal (controls heartbeat and breathing). This illustrates the medulla as the 'vital centre'.",
      common_misconceptions: [
        "Students say 'the cerebellum controls thinking and memory' — thinking and memory are functions of the CEREBRUM (forebrain). Cerebellum only controls balance and motor coordination.",
        "Students confuse medulla (brain stem, involuntary) with cerebrum (voluntary) — medulla oblongata controls involuntary actions (heartbeat, breathing); cerebrum controls voluntary actions.",
        "Students think the brain is not protected by fluid — the brain is protected by skull + meninges (3 layers) + cerebrospinal fluid (CSF) acting as a shock absorber.",
      ],
      shortcuts_and_tricks: [
        "Mnemonic for brain regions: 'Can Monkeys Play Cricket Happily' — Cerebrum, Medulla, Pons, Cerebellum, Hypothalamus.",
        "Cerebrum = voluntary and complex thought (biggest part). Cerebellum = balance and coordination (C = Coordination). Medulla = mandatory life functions (vital, involuntary).",
        "Remember: cerebellum is at the BACK and BOTTOM of the brain; medulla connects to spinal cord at the very bottom.",
        "Meninges = 3 membranes: DAPh — Dura mater (outermost, toughest), Arachnoid mater (middle, web-like), Pia mater (innermost, thin).",
      ],
      diagram_description:
        "Diagram: Sagittal (side) cross-section of the human brain with all major parts labelled. From top: Cerebrum (large, wrinkled — label cerebral cortex, left and right hemispheres shown). Below and behind cerebrum: Cerebellum (small, heavily folded structure). At the base: Medulla oblongata (stalk-like, labelled 'controls involuntary actions'). Between cerebrum and cerebellum: Midbrain and Pons labelled. At the base of cerebrum: Hypothalamus labelled. Spinal cord shown continuing from medulla. Inset: shows the three meningeal layers (dura mater, arachnoid mater, pia mater) wrapping the brain surface with CSF in the subarachnoid space.",
      key_takeaway:
        "Cerebrum controls voluntary actions and cognition; cerebellum controls balance and coordination; medulla oblongata controls involuntary life functions (heartbeat, breathing); all protected by skull, meninges, and CSF.",
    },
  },

  {
    topicId: "sci_ch6_plant_hormones",
    subject: "Science",
    chapterNumber: 6,
    name: "Plant Hormones and Tropic Movements",
    prerequisite_knowledge: [
      "Concept of hormones as chemical messengers",
      "Basic plant structure (stem, root, leaves)",
      "Growth responses in plants",
    ],
    key_formulas: [],
    teaching_content: {
      intuition:
        "Plants cannot move like animals, but they respond to their environment by growing in specific directions. These directional growth responses (tropisms) are controlled by chemical messengers called plant hormones (phytohormones). The key hormone is auxin, which works by making cells elongate more on one side — causing bending. Think of tropisms as the plant 'leaning' toward favourable conditions (light, water) or away from unfavourable ones.",
      process_explanation:
        "Five major plant hormones (CBSE Class 10): Auxin (IAA — Indole Acetic Acid): Produced at the SHOOT TIP. Role: causes cell elongation. Effect: phototropism — stem bends toward light (auxin accumulates on shaded side → more elongation on shaded side → tip curves toward light); geotropism — roots grow downward (roots are more sensitive to auxin; high auxin on lower side INHIBITS root cells but promotes shoot cell elongation). Gibberellins: Causes stem elongation (internodal elongation). Used commercially to make seedless grapes larger, to promote early flowering, and to break seed dormancy. Cytokinins: Promote cell division (cytokinesis). Promote seed germination; delay leaf senescence (ageing). Often work with auxin to regulate plant growth. Abscisic Acid (ABA): The stress hormone — inhibitor. Role: causes stomatal closure during drought (water stress), promotes seed dormancy and leaf fall (abscission). Called the 'anti-stress' hormone or 'dormancy hormone'. Ethylene (ethene): A gaseous hormone. Promotes fruit ripening. Used commercially to ripen bananas after transport. Also causes leaf and fruit drop. Tropic movements: Phototropism: movement in response to light (positive = toward light; negative = away). Geotropism: movement in response to gravity (positive = toward gravity — roots; negative = away from gravity — shoots). Hydrotropism: roots grow toward water. Thigmotropism: growth in response to touch (e.g., tendrils coil around a support). Chemotropism: pollen tube grows toward ovule attracted by chemicals.",
      worked_example:
        "Experiment: A seedling is placed in a box with a hole on one side. Result: shoot bends toward the hole (light). Explanation: Light causes auxin to migrate to the shaded side. More auxin on the shaded side causes more elongation on that side. The shoot curves toward the light. If the shoot tip is removed, no bending occurs (because auxin is produced at the tip). If the tip is covered but sides exposed, bending still occurs. Conclusion: Auxin is produced at the tip, light causes unequal distribution, bending is toward light (phototropism).",
      common_misconceptions: [
        "Students say 'auxin causes roots to grow toward gravity because it promotes growth there' — auxin actually INHIBITS root cells at high concentrations; roots are hypersensitive to auxin. So the higher auxin on the lower side of a horizontal root INHIBITS those cells, causing the lower side to grow LESS and the root to bend downward (positive geotropism).",
        "Students confuse ABA (inhibitor/stress response) with auxin (growth promoter) — ABA inhibits growth and closes stomata; auxin promotes cell elongation.",
        "Students think ethylene is not a hormone because it is a gas — ethylene IS a plant hormone despite being gaseous; it is produced inside plant cells and triggers responses like fruit ripening.",
      ],
      shortcuts_and_tricks: [
        "Five plant hormones mnemonic: 'AGCEth' = Auxin, Gibberellin, Cytokinin, Ethylene, ABA (Abscisic Acid).",
        "ABA = Abscisic Acid = Absent-the-growth (inhibitor). Auxin = growth promoter (elongation).",
        "Ethylene: 'E for Exit' — helps fruits ripen and then fall; E for end of fruit's life.",
        "Phototropism trick: Light on left → auxin goes right (shaded side) → right side elongates more → tip bends LEFT (toward light).",
      ],
      diagram_description:
        "Diagram 1 (phototropism): Three pots of seedlings shown side by side. Pot 1: normal seedling (light from above, grows straight). Pot 2: light from left side, seedling bends left (toward light), auxin distribution arrows show auxin migrating to right/shaded side, longer cells on right. Pot 3: tip removed, seedling grows straight even with unilateral light. Diagram 2 (hormone summary table visual): Five columns — Auxin (cell elongation, phototropism), Gibberellin (stem elongation, fruit development), Cytokinin (cell division, delays senescence), ABA (stomatal closure, dormancy), Ethylene (fruit ripening, leaf drop). Each column has a small plant icon showing the relevant effect.",
      key_takeaway:
        "Auxin causes phototropism by accumulating on the shaded side, making it elongate more; gibberellins promote stem elongation; cytokinins stimulate cell division; ABA causes stomatal closure during stress; ethylene promotes fruit ripening.",
    },
  },

  // ══════════════════════════════════════════════════════════════════
  // CHAPTER 7 — How do Organisms Reproduce?
  // ══════════════════════════════════════════════════════════════════
  {
    topicId: "sci_ch7_asexual_reproduction",
    subject: "Science",
    chapterNumber: 7,
    name: "Asexual Reproduction",
    prerequisite_knowledge: [
      "Cell division (mitosis concept)",
      "Difference between unicellular and multicellular organisms",
      "Basic genetics: identical offspring vs varied offspring",
    ],
    key_formulas: [],
    teaching_content: {
      intuition:
        "Asexual reproduction is nature's cloning — one parent produces offspring that are genetically identical copies (clones). It is fast, energy-efficient, and doesn't require finding a mate. However, all offspring have the same genetic makeup, making the entire population equally vulnerable to a new disease. Think of asexual reproduction as a photocopier — fast and exact copies, but if the original has an error, all copies have it too.",
      process_explanation:
        "Types of asexual reproduction: Binary fission: One organism splits into two equal halves, each growing into a new organism. Example: Amoeba (splits irregularly), Paramecium (splits along a line), bacteria. Multiple fission: Parent cell divides into many daughter cells simultaneously. Example: Plasmodium (malaria parasite) — during unfavourable conditions, forms a protective cyst and divides into many cells inside. Budding: A small outgrowth (bud) forms on the parent, grows, and eventually detaches as a new organism. Example: Hydra (bud forms on side of body), yeast (bud pinches off from cell wall). Fragmentation: Parent organism breaks into fragments, each of which grows into a complete new organism. Example: Spirogyra (algae, can regenerate from each fragment), Planaria. Regeneration: The ability to grow a complete organism from a fragment or to repair lost parts. Example: Planaria (flatworm) — cut into pieces, each piece regenerates into a full worm; starfish regrows lost arms. Note: Regeneration is not the same as fragmentation — regeneration is a response to injury; fragmentation is the normal mode of reproduction. Spore formation: Specialised cells called spores are produced, each of which can grow into a new organism under favourable conditions. Example: Rhizopus (bread mould/fungi), ferns, mosses. Spores are resistant to harsh conditions. Vegetative propagation: Plants reproduce from vegetative parts (root, stem, leaf). Natural: runners/stolons (strawberry, grass), rhizomes (ginger, turmeric), bulbs (onion, garlic), tubers (potato — eyes grow into new plants), leaves (Bryophyllum — leaf margins develop buds). Artificial: cuttings (rose), layering (jasmine), grafting (mango, apple — seedless varieties), tissue culture (orchids, banana — disease-free clones at mass scale).",
      worked_example:
        "A gardener wants to rapidly multiply a disease-resistant variety of rose. Method: take cuttings (stem cuttings) from the parent plant, dip in rooting hormone, plant in moist soil. All new rose plants will be genetically identical to the parent (same disease resistance). Alternatively, for producing thousands of plants quickly for commercial orchid farming: tissue culture (plant a few cells from the parent in sterile nutrient medium in a laboratory — thousands of identical orchid plants grown in weeks). Tissue culture applications: virus-free banana plantations, high-quality ornamental plants, seedless grapes.",
      common_misconceptions: [
        "Students confuse regeneration and fragmentation — fragmentation is the NORMAL reproductive method (e.g., Spirogyra breaks naturally to reproduce); regeneration is the organism's ability to REGROW lost body parts after injury (e.g., Planaria regrowing after being cut, starfish regrowing an arm).",
        "Students think binary fission and multiple fission are the same — binary fission = 1 parent → 2 offspring; multiple fission = 1 parent → MANY offspring simultaneously (e.g., Plasmodium).",
        "Students say budding only occurs in yeast — Hydra (multicellular animal) also reproduces by budding; yeast is unicellular and also buds.",
      ],
      shortcuts_and_tricks: [
        "Mnemonic for asexual types: 'Big Monkeys Find Stray Vegetarians' = Binary fission, Multiple fission, Fragmentation, Spore formation, Vegetative propagation.",
        "Budding organisms: Hydra (animal) + Yeast (fungus). Not bacteria — bacteria do binary fission.",
        "Vegetative propagation from different parts: Stem = potato (tuber), ginger (rhizome), rose (cutting). Leaf = Bryophyllum. Root = sweet potato, dahlia (tuber).",
        "Rhizopus (bread mould) produces spores in black dot-like sporangia on white mycelium — this is the diagram you'll see in NCERT.",
      ],
      diagram_description:
        "Diagram 1 (Hydra budding): Parent Hydra with a bud growing on its side, the bud developing its own tentacles, final separation labelled. Diagram 2 (Spirogyra fragmentation): Chain of green algae cells breaking apart, each fragment labelled as new organism. Diagram 3 (Bread mould/Rhizopus): Mycelium (hyphae) growing on bread with upright structures (sporangiophores) topped by spherical sporangia (containing spores); arrow showing spores dispersing and germinating. Diagram 4 (Vegetative propagation): Potato tuber with 'eye' buds sprouting new shoots; separate Bryophyllum leaf with small plantlets growing from notches at leaf margins.",
      key_takeaway:
        "Asexual reproduction produces genetically identical offspring; types include binary fission (Amoeba), multiple fission (Plasmodium), budding (Hydra, yeast), fragmentation (Spirogyra), spore formation (Rhizopus), and vegetative propagation (potato, Bryophyllum); regeneration (Planaria) is a response to injury, not always normal reproduction.",
    },
  },

  {
    topicId: "sci_ch7_sexual_reproduction_plants",
    subject: "Science",
    chapterNumber: 7,
    name: "Sexual Reproduction in Flowering Plants",
    prerequisite_knowledge: [
      "Asexual reproduction and its limitations",
      "Basic flower structure from earlier classes",
      "Concept of gametes (male and female sex cells)",
    ],
    key_formulas: [
      "Double fertilisation: 1 sperm + egg cell = zygote (2n); 1 sperm + 2 polar nuclei = primary endosperm nucleus (3n)",
    ],
    teaching_content: {
      intuition:
        "A flower is the plant's reproductive organ — nature's most elaborate device for combining genetic material from two parent plants. Unlike animals, plants can't move to find a mate, so they use agents (wind, water, insects, birds) to carry pollen (male gametes) from one flower to another. Flowering plants have evolved an extraordinary trick called double fertilisation — unique to angiosperms — where one sperm cell fertilises the egg (making the future plant) and another fertilises a pair of cells (making the food supply for the seed). This is why all seeds contain a seed with an embryo AND a food store (endosperm).",
      process_explanation:
        "Flower structure: Stamen (male part): Anther (produces pollen grains containing male gametes) + Filament (stalk supporting anther). Pistil/Carpel (female part): Stigma (receives pollen) + Style (stalk) + Ovary (contains ovules; each ovule has an egg cell). Other parts: Petals (attract pollinators), Sepals (protect bud), Receptacle (base). Pollination: Transfer of pollen grains from anther of one flower to the stigma of the same or another flower. Self-pollination: anther to stigma of the same flower. Cross-pollination: anther to stigma of a different flower (requires an agent). Agents of pollination: Wind (anemophily): light, small, dry pollen; e.g., grass, maize. Water (hydrophily): aquatic plants; e.g., Vallisneria. Insects (entomophily): coloured, fragrant, nectarous flowers; e.g., rose, sunflower. Birds (ornithophily): large, brightly coloured; e.g., Hibiscus. Fertilisation: After pollen lands on stigma, pollen tube grows down the style into the ovary, guided by chemicals. Two male gametes travel down the pollen tube. Double fertilisation (unique to angiosperms): First fertilisation: male gamete 1 + egg cell → zygote (2n) → embryo (future plant). Second fertilisation: male gamete 2 + 2 polar nuclei (in central cell of ovule) → primary endosperm nucleus (3n, triploid) → endosperm (food store for seed). Post-fertilisation: Ovary → Fruit (wall of ovary becomes fruit wall/pericarp). Ovule → Seed (containing embryo + endosperm). Zygote → Embryo. Seed dispersal: wind (dandelion), water (coconut), animals (hooks in Xanthium, edible fruits), self-dispersal (explosion in touch-me-not Impatiens).",
      worked_example:
        "When you eat a mango: The mango fruit developed from the ovary of the mango flower. The mango seed inside contains the embryo (from the zygote after fertilisation) and endosperm (food for the embryo). The juicy flesh is the ripened ovary wall. The mango stone is the seed coat. Cross-pollination in mango was performed by insects attracted to the small fragrant flowers. Exam question: 'What is the fruit wall derived from?' → Ovary wall. 'What is the endosperm derived from?' → Triple fusion (primary endosperm nucleus).",
      common_misconceptions: [
        "Students say 'double fertilisation means two eggs are fertilised' — double fertilisation means TWO acts of fertilisation occur simultaneously: one sperm + egg = zygote; another sperm + 2 polar nuclei = endosperm nucleus. Only ONE egg is fertilised.",
        "Students think pollination = fertilisation — pollination is just the TRANSFER of pollen to stigma; fertilisation is the actual FUSION of gametes inside the ovule, which happens after the pollen tube grows.",
        "Students confuse ovary (female reproductive part of flower, becomes fruit) with the animal ovary — in plants, ovary is part of the pistil; after fertilisation the ovary wall becomes the fruit.",
      ],
      shortcuts_and_tricks: [
        "Double fertilisation: '1+1=2 fertilisations, not 2 eggs'. Sperm 1 + egg = embryo. Sperm 2 + polar nuclei = endosperm.",
        "Ovule → Seed; Ovary → Fruit. 'O for O': Ovule-seed, Ovary-fruit.",
        "SALT mnemonic for flower male parts: Stamen = Anther + Filament. PSSO for female: Pistil = Stigma + Style + Ovary.",
        "Endosperm is the food for the germinating seed — it's what you eat in rice, wheat, maize (the starchy part of the grain IS the endosperm).",
      ],
      diagram_description:
        "Diagram of a longitudinal section of a flower fully labelled: outer sepals, petals (with nectary), stamens (filament + anther — showing pollen grains as dots inside anther), pistil in centre (stigma at top with sticky surface, style, ovary at bottom containing ovules). Separate inset: magnified ovule cross-section showing egg cell, two polar nuclei in central cell, and micropyle (entry point for pollen tube). Arrow showing pollen tube growing from stigma down through style into ovule, with two male gametes labelled inside the pollen tube. Outcome labels: 'Sperm 1 + Egg = Zygote → Embryo' and 'Sperm 2 + 2 Polar Nuclei = Endosperm'. Final diagram showing ovule → seed and ovary → fruit.",
      key_takeaway:
        "Double fertilisation is unique to angiosperms — one sperm fertilises the egg (forming the zygote/embryo) and another sperm fuses with two polar nuclei (forming the triploid endosperm/food reserve); the ovule becomes the seed and the ovary becomes the fruit.",
    },
  },

  {
    topicId: "sci_ch7_human_reproduction",
    subject: "Science",
    chapterNumber: 7,
    name: "Human Reproduction",
    prerequisite_knowledge: [
      "Basic male and female anatomy",
      "Concept of gametes (sperm and egg)",
      "Puberty and secondary sexual characteristics",
    ],
    key_formulas: [
      "Menstrual cycle: ~28 days (menstruation ~days 1-5, follicular/proliferative phase days 1-13, ovulation ~day 14, luteal/secretory phase days 15-28)",
    ],
    teaching_content: {
      intuition:
        "Human reproduction is a process of creating a new individual by combining genetic material from a male parent (sperm) and a female parent (egg/ovum). The female reproductive system not only produces eggs but also provides a protected, nourishing environment for the developing baby for nine months. The placenta is the remarkable organ that acts as a bridge between mother and baby — allowing nutrients and oxygen to pass from mother's blood to the baby and waste products to pass back, WITHOUT the two blood supplies ever mixing.",
      process_explanation:
        "Male reproductive system: Testes (in scrotum, outside body — lower temperature needed for sperm production): produce sperm cells (spermatogenesis) and testosterone (male hormone). Epididymis: sperm mature and are stored here. Vas deferens (sperm duct): carries sperm upward. Seminal vesicles + Prostate gland: add fluids to sperm → semen. Urethra: carries semen (and urine) out through penis. Female reproductive system: Ovaries: produce egg cells (oogenesis) and oestrogen/progesterone (female hormones). Fallopian tubes (oviducts): carry egg from ovary to uterus; site of fertilisation. Uterus: muscular organ where implantation and foetal development occur; inner lining is endometrium. Cervix: lower narrow end of uterus. Vagina: birth canal; receives penis during copulation. Menstrual cycle (~28 days): Day 1-5: Menstruation — uterine lining (endometrium) shed if pregnancy did not occur. Days 1-13: Follicular phase — FSH causes one follicle in ovary to mature; oestrogen builds up endometrium. Day 14: Ovulation — LH surge causes mature follicle to release egg into fallopian tube. Days 15-28: Luteal phase — ruptured follicle becomes corpus luteum, secretes progesterone to maintain endometrium (in case of pregnancy). If no fertilisation: progesterone drops → menstruation begins (day 1 of next cycle). Fertilisation and development: Sperm released into vagina → travel through uterus → fertilisation occurs in fallopian tube. Zygote → undergoes cell divisions → becomes blastocyst → implants in uterine wall (implantation). Placenta develops: Umbilical cord connects embryo to placenta. Placenta functions: (1) exchanges nutrients (glucose, O₂) from mother to foetus; (2) exchanges wastes (CO₂, urea) from foetus to mother; (3) acts as a barrier (filters some but not all pathogens); (4) produces hormones (HCG, oestrogen, progesterone) to maintain pregnancy; (5) immunological protection. The two blood systems NEVER mix — exchange occurs by diffusion across thin membranes. Development takes ~9 months (40 weeks). Contraception: Barrier methods: condoms (male/female), diaphragm — prevent sperm reaching egg. Hormonal methods: oral contraceptive pills (prevent ovulation); emergency contraception. Intrauterine devices (IUDs): copper-T — prevent implantation. Surgical: vasectomy (male, cut vas deferens), tubectomy (female, cut/block fallopian tubes) — permanent.",
      worked_example:
        "A woman's menstrual cycle is being tracked. Day 1-5: she experiences bleeding (menstruation). Day 14: an ultrasound shows ovulation. Days 15-28: progesterone is high (corpus luteum active). If unprotected intercourse occurred on day 14 and a sperm fertilised the egg: by day 20 the blastocyst implants in the uterine wall. HCG is produced by the embryo → prevents corpus luteum from degenerating → progesterone continues → no menstruation occurs. A pregnancy test detects HCG in urine — positive result. This is why the missed period is the first sign of pregnancy.",
      common_misconceptions: [
        "Students say 'mother's blood flows into the baby' — mother's blood and foetal blood NEVER mix in the placenta; they are separated by a thin membrane; exchange of nutrients and gases occurs by diffusion across this membrane.",
        "Students confuse ovulation (release of egg from ovary) with fertilisation (fusion of egg and sperm in fallopian tube) — these are two separate events that occur days apart.",
        "Students think menstruation is harmful/dirty — menstruation is the natural shedding of the uterine lining when pregnancy has not occurred; it is a normal, healthy process.",
      ],
      shortcuts_and_tricks: [
        "Menstrual cycle phases: MFO-L — Menstruation, Follicular, Ovulation, Luteal.",
        "Fertilisation occurs in the FALLOPIAN TUBE, not the uterus. Implantation occurs in the UTERUS.",
        "Placenta functions mnemonic: NEHIB — Nutrition exchange, Excretion of foetal waste, Hormone production, Immunological barrier, Blood separation.",
        "Day 14 = ovulation = most fertile day (in a standard 28-day cycle).",
      ],
      diagram_description:
        "Diagram 1 (Male reproductive system — labelled cross-section): Testes (in scrotum), epididymis, vas deferens, seminal vesicle, prostate gland, urethra, penis. Arrows showing sperm pathway. Diagram 2 (Female reproductive system — front view): Two ovaries with follicle labelled, two fallopian tubes (with funnel-shaped fimbriae at ovary end), uterus (pear-shaped, with endometrium layer labelled inside), cervix, vagina. Fertilisation site marked in fallopian tube. Implantation site marked in uterus. Diagram 3 (Placenta): Foetus inside uterus connected by umbilical cord to placenta; placenta on uterine wall; arrows showing O₂ + nutrients from mother's blood to foetus, CO₂ + urea from foetus to mother; label: 'maternal and foetal blood do not mix'.",
      key_takeaway:
        "Fertilisation occurs in the fallopian tube; the blastocyst implants in the uterus; the placenta allows exchange of nutrients and wastes between mother and foetus without mixing their blood; the menstrual cycle is ~28 days with ovulation occurring around day 14.",
    },
  },

  // ══════════════════════════════════════════════════════════════════
  // CHAPTER 8 — Heredity
  // ══════════════════════════════════════════════════════════════════
  {
    topicId: "sci_ch8_mendels_laws",
    subject: "Science",
    chapterNumber: 8,
    name: "Mendel's Laws of Heredity",
    prerequisite_knowledge: [
      "Genes are inherited from parents",
      "Basic concept of chromosomes",
      "Dominant and recessive traits concept",
    ],
    key_formulas: [
      "Monohybrid cross F2 phenotypic ratio: 3 dominant : 1 recessive",
      "Monohybrid cross F2 genotypic ratio: 1 TT : 2 Tt : 1 tt",
      "Dihybrid cross F2 phenotypic ratio: 9 : 3 : 3 : 1",
      "Test cross (Tt × tt) ratio: 1 tall (Tt) : 1 dwarf (tt)",
    ],
    teaching_content: {
      intuition:
        "Gregor Mendel (1822-1884) was an Austrian monk who discovered the fundamental laws of inheritance by crossing pea plants and counting thousands of offspring. Before Mendel, people thought traits blended (like mixing paints) — a tall parent crossed with a short one would give medium-height offspring. Mendel's genius was to show that traits are controlled by discrete 'factors' (now called genes) that can be dominant or recessive, and that these factors are inherited in predictable mathematical ratios. He chose pea plants because they have clearly distinguishable traits (tall/dwarf, round/wrinkled seeds) and can self-fertilise or be cross-fertilised.",
      process_explanation:
        "Key definitions: Gene: unit of heredity controlling a trait. Alleles: different versions of the same gene (e.g., T = tall allele, t = dwarf allele). Dominant allele: expressed even when only one copy is present (written as capital letter: T). Recessive allele: expressed only when two copies are present (written as lowercase: t). Homozygous: two identical alleles (TT or tt). Heterozygous: two different alleles (Tt). Phenotype: observable appearance (tall or dwarf). Genotype: genetic makeup (TT, Tt, or tt). Mendel's Laws: Law of Dominance: When two pure-breeding plants with contrasting traits are crossed, only the dominant trait appears in F1. Law of Segregation (Monohybrid cross): Each organism has two alleles for each trait. During gamete formation, alleles separate so each gamete carries only one allele. The two alleles come together again at fertilisation. Monohybrid cross: P: TT (tall) × tt (dwarf). F1: all Tt (tall — T is dominant). F1 × F1: Tt × Tt. F2: TT : Tt : tt = 1:2:1 (genotypic). Tall : Dwarf = 3:1 (phenotypic). Law of Independent Assortment (Dihybrid cross): Genes for different traits are inherited independently of each other (when on different chromosomes). Dihybrid cross: P: RRYY (round yellow) × rryy (wrinkled green). F1: all RrYy (round yellow). F1 × F1: RrYy × RrYy. F2: 16 combinations. Phenotypic ratio: 9 Round Yellow : 3 Round Green : 3 Wrinkled Yellow : 1 Wrinkled Green = 9:3:3:1. Test cross: Cross unknown genotype with homozygous recessive (tt). If 1:1 ratio → parent was Tt. If all dominant → parent was TT. Dihybrid test cross: RrYy × rryy → 1:1:1:1.",
      worked_example:
        "Monohybrid Punnett square for Tt × Tt: Draw a 2×2 grid. Top row headers: T (from Tt parent 1) and t. Left column headers: T (from Tt parent 2) and t. Fill in: TT, Tt, Tt, tt. Phenotype count: TT = 1 tall (dominant homozygous) + Tt = 2 tall (dominant heterozygous) + tt = 1 dwarf (recessive homozygous). Phenotypic ratio = 3 tall : 1 dwarf. Genotypic ratio = 1TT : 2Tt : 1tt. For exam: 'In F2 generation of a monohybrid cross, what fraction of plants are heterozygous?' → 2 out of 4 = 1/2 or 50%.",
      common_misconceptions: [
        "Students apply the 3:1 ratio to F1 instead of F2 — the 3:1 ratio appears in F2 (offspring of F1 × F1), NOT in F1 (which is all Tt and therefore all show dominant phenotype).",
        "Students confuse dihybrid test cross ratio (1:1:1:1) with dihybrid F2 ratio (9:3:3:1) — the 9:3:3:1 is F2 from two heterozygous parents (RrYy × RrYy); the 1:1:1:1 is a test cross (RrYy × rryy).",
        "Students say 'dominant means more common in population' — dominant simply means expressed when present; it has nothing to do with frequency in the population. A disease can be dominant and rare.",
      ],
      shortcuts_and_tricks: [
        "F2 ratios: Monohybrid phenotypic = 3:1. Monohybrid genotypic = 1:2:1. Dihybrid phenotypic = 9:3:3:1.",
        "Test cross always involves crossing with homozygous RECESSIVE (tt or rryy).",
        "Mendel's pea plant choices: 7 contrasting traits, short life cycle, large number of offspring, easy self/cross pollination, available pure-breeding lines.",
        "Dominant ratio check: 9+3+3+1 = 16 total boxes in dihybrid Punnett square. 9+3 = 12 have at least one R. 9+3 = 12 have at least one Y.",
      ],
      diagram_description:
        "Diagram 1 (Monohybrid Punnett square): 2×2 grid for Tt × Tt. Row headers: T, t (top parent). Column headers: T, t (left parent). Cells filled: TT, Tt, Tt, tt. Below the grid: phenotype tally showing 3 tall (shaded) and 1 dwarf (unshaded). Ratio labelled: 3:1. Diagram 2 (Dihybrid Punnett square): 4×4 grid for RrYy × RrYy. All 16 combinations filled in. Shading used to highlight the 9 Round Yellow, 3 Round Green, 3 Wrinkled Yellow, 1 Wrinkled Green groups. Ratio labelled: 9:3:3:1 with specific genotypes listed.",
      key_takeaway:
        "Mendel's Law of Segregation gives 3:1 phenotypic ratio in F2 of a monohybrid cross; Law of Independent Assortment gives 9:3:3:1 in F2 of a dihybrid cross; a test cross (with tt or rryy) reveals unknown genotypes.",
    },
  },

  {
    topicId: "sci_ch8_sex_determination",
    subject: "Science",
    chapterNumber: 8,
    name: "Sex Determination in Humans",
    prerequisite_knowledge: [
      "Chromosomes carry genes",
      "Humans have 46 chromosomes (23 pairs)",
      "Concept of gametes and fertilisation",
    ],
    key_formulas: [
      "Female: 44 autosomes + XX sex chromosomes",
      "Male: 44 autosomes + XY sex chromosomes",
      "Probability of male or female child = 50% each pregnancy (independent events)",
    ],
    teaching_content: {
      intuition:
        "One of the most remarkable facts in biology is that the sex of a child is determined entirely by the father — yet for centuries, women were blamed for not bearing sons. Understanding the XX/XY chromosome system makes it clear: a mother can only contribute an X chromosome to every egg; it is the father's sperm that determines the child's sex by contributing either an X (giving a daughter) or a Y (giving a son). Furthermore, each pregnancy is an independent event with exactly 50% probability of either sex.",
      process_explanation:
        "Human chromosomes: Humans have 46 chromosomes in 23 pairs. 22 pairs are autosomes (non-sex chromosomes, same in males and females). 1 pair are sex chromosomes: Female: XX (homogametic — all eggs carry X). Male: XY (heterogametic — sperm carry either X or Y). Mechanism of sex determination: In females (XX): During egg formation (meiosis), both sex chromosomes are X → every egg contains one X chromosome. In males (XY): During sperm formation (meiosis), sex chromosomes separate → 50% of sperm carry X chromosome, 50% carry Y chromosome. At fertilisation: If X-sperm fertilises egg: XX → female child. If Y-sperm fertilises egg: XY → male child. Statistical outcome: In any single pregnancy, the probability is exactly 50% for a boy and 50% for a girl. Each pregnancy is an INDEPENDENT event — having three daughters does NOT make the next child more likely to be a son. Why father determines sex: Mother always contributes X. Father contributes either X or Y. The father's gamete is the variable that determines XX or XY. Social relevance (NCERT emphasis): Sex-selective practices targeting mothers are scientifically wrong — the father's chromosome determines the sex of the child. Every pregnancy has equal probability of either sex regardless of previous births.",
      worked_example:
        "Cross diagram (sex determination): P: Mother (XX) × Father (XY). Gametes from mother: all X. Gametes from father: 50% X, 50% Y. Possible offspring: XX (daughter) : XY (son) = 1:1. Example calculation: 'A couple has 3 daughters. What is the probability their next child will be a son?' Answer: 50%. Each pregnancy is independent. The chromosome combination is determined anew at each fertilisation. The 3 previous daughters have NO effect on the next pregnancy.",
      common_misconceptions: [
        "Students say 'mothers determine the sex of the child' — this is the single most important misconception to correct. Mothers always pass X; the father passes X or Y. The FATHER determines sex.",
        "Students think that having multiple children of the same sex makes a different sex more probable next time — each conception is an independent event with exactly 50:50 probability each time.",
        "Students think sex chromosomes carry only sex-related genes — the X chromosome carries hundreds of other genes (non-sex traits like colour blindness, haemophilia which are X-linked); the Y chromosome mainly carries male-determining genes.",
      ],
      shortcuts_and_tricks: [
        "Quick rule: Mother → always X. Father → X = daughter (XX), Y = son (XY). Father decides.",
        "XX = Female (two 'kiss/kiss' chromosomes). XY = Male (X + crooked Y).",
        "Heterogametic = produces two types of gametes = MALE (XY). Homogametic = produces one type = FEMALE (XX).",
        "Probability every time = 50:50, regardless of previous children. Each birth is independent.",
      ],
      diagram_description:
        "Diagram (sex determination cross): Top row: Mother (XX) on left, Father (XY) on right. Below: Eggs shown (all X). Sperm shown (half X-sperm, half Y-sperm). Two outcome boxes: X-sperm + X-egg = XX = Female child (symbol ♀); Y-sperm + X-egg = XY = Male child (symbol ♂). Probability labels: 50% female, 50% male. Clear label at bottom: 'Sex of child is determined by the father's contribution'. Karyotype inset showing 23 pairs of human chromosomes with sex chromosomes highlighted — female shows two identical X chromosomes; male shows X and shorter Y chromosome.",
      key_takeaway:
        "The sex of a human child is determined by the father — if the father's sperm contributes X, the child is female (XX); if it contributes Y, the child is male (XY); each pregnancy has exactly 50% probability for either sex, independent of previous births.",
    },
  },

  {
    topicId: "sci_ch8_evolution",
    subject: "Science",
    chapterNumber: 8,
    name: "Evolution — Darwin, Natural Selection and Evidence",
    prerequisite_knowledge: [
      "Heredity and variation (Mendel's laws)",
      "Concept of adaptation and survival",
      "Geological time scale (millions of years)",
      "DNA as the carrier of genetic information",
    ],
    key_formulas: [
      "Hardy-Weinberg principle (conceptual): allele frequencies in a population remain constant unless disturbed by mutation, selection, migration, or drift",
      "Comparative anatomy: homologous organs share structural origin; analogous organs share functional role",
    ],
    teaching_content: {
      intuition:
        "Evolution is the slow, gradual change in the inherited characteristics of biological populations over successive generations. Think of it as the Earth running a 3.8-billion-year-long experiment — organisms that happened to have useful traits survived to reproduce, passing those traits on. Over millions of generations, small changes accumulate into dramatic differences. Humans and chimpanzees share 98.7% of DNA — we're not descended from chimps, but we share a common ancestor that lived about 6 million years ago.",
      process_explanation:
        "Step 1 — Variation exists: Within any population, individuals differ from each other due to mutations, recombination, and other genetic changes. Step 2 — Struggle for existence: Resources (food, mates, space) are limited; more individuals are born than can survive. Step 3 — Natural selection: Individuals with traits better suited to their environment are more likely to survive and reproduce (survival of the fittest). Step 4 — Inheritance: Favourable traits are passed to offspring. Step 5 — Accumulation over time: Over many generations, the proportion of individuals with favourable traits increases. Eventually, populations may diverge enough to form new species (speciation). Lamarck's discredited theory: organisms acquire new traits during their lifetime by use/disuse and pass them to offspring — e.g., giraffes stretched their necks and passed longer necks to offspring. Darwin's correct theory: giraffes with randomly longer necks survived better and reproduced more, passing the trait genetically.",
      worked_example:
        "Peppered moths (Biston betularia) in England: Before 1850, light-coloured moths dominated (camouflaged against pale tree bark). After industrialisation, soot turned bark dark → dark moths survived better (camouflaged) while light moths were eaten by birds. By 1900, dark moths were 98% of the population. After clean air laws, light moths recovered. This is textbook natural selection: environment changed → selective pressure changed → population allele frequency shifted over generations. Key: the moths did NOT choose to turn dark; dark mutants already existed and were now selectively favoured.",
      common_misconceptions: [
        "Evolution has a direction or goal (wrong — evolution is blind; traits that happen to be useful in the current environment get selected, not traits that are 'better' in some absolute sense).",
        "Humans evolved from monkeys/apes (wrong — humans and other apes share a common ancestor; we did not descend from any living ape species).",
        "Acquired characteristics are inherited — Lamarckism (wrong — a blacksmith's muscular arms are not genetically transmitted; only heritable genetic mutations are passed on).",
        "Evolution always takes millions of years (not always — bacteria evolve antibiotic resistance in days; peppered moths changed in decades).",
      ],
      shortcuts_and_tricks: [
        "Homologous organs: same structure, different function → evidence of common ancestry (e.g., human arm / whale flipper / bird wing — all have humerus, radius, ulna).",
        "Analogous organs: different structure, same function → convergent evolution (e.g., wings of birds and insects).",
        "Vestigial organs: reduced, non-functional remnants of ancestral structures (e.g., human coccyx, appendix, wisdom teeth).",
        "Fossil record: direct evidence — older (deeper) fossils show simpler life forms; transitional fossils link major groups.",
        "Molecular evidence: more similar DNA sequences → more closely related. Cytochrome c amino acid sequence is nearly identical in closely related species.",
      ],
      diagram_description:
        "Diagram 1 — Homologous organs: Four forelimbs side by side (Human, Whale, Bat, Frog) with same colour-coded bone regions: humerus (red), radius+ulna (blue), carpals (yellow), metacarpals+phalanges (green). Caption: 'Same bones, different functions — evidence of common ancestor.' Diagram 2 — Darwin's finches: 4 beak shapes adapted for 4 food types (seeds, insects, cactus nectar, tool use) showing adaptive radiation from one common ancestor on the Galapagos Islands. Diagram 3 — Natural selection flowchart: Population with variation → Environment exerts selective pressure → Survivors reproduce → Offspring inherit favoured traits → Population shifts over generations.",
      key_takeaway:
        "Evolution occurs by natural selection: heritable variation exists in populations; individuals with favourable traits survive and reproduce more; those traits increase in frequency over generations. Homologous organs (same structure) show common ancestry; analogous organs (same function) show convergent evolution. Fossil, molecular, and anatomical evidence all support the theory of evolution.",
    },
  },

  // ══════════════════════════════════════════════════════════════════
  // CHAPTER 13 — Our Environment
  // ══════════════════════════════════════════════════════════════════
  {
    topicId: "sci_ch13_ecosystem",
    subject: "Science",
    chapterNumber: 13,
    name: "Ecosystem — Components and Food Chains",
    prerequisite_knowledge: [
      "Concept of habitat and living vs non-living factors",
      "Photosynthesis and food production",
      "Basic food chains from earlier classes",
    ],
    key_formulas: [
      "Food chain: Producer → Primary consumer → Secondary consumer → Tertiary consumer",
    ],
    teaching_content: {
      intuition:
        "An ecosystem is like a city: it has residents (living organisms — the biotic components) and the infrastructure (physical environment — the abiotic components). Just like a city needs electricity, water, roads, and jobs to function, an ecosystem needs sunlight, water, soil, and nutrient cycling to sustain life. The most important relationships are the feeding relationships (who eats whom) — these determine the flow of energy through the ecosystem.",
      process_explanation:
        "Components of an ecosystem: Biotic components (living): Producers (autotrophs): make their own food by photosynthesis. Examples: green plants, algae, phytoplankton. They capture solar energy and convert it to chemical energy. Consumers (heterotrophs): cannot make own food; depend on producers directly or indirectly. Herbivores/Primary consumers: eat producers (e.g., grasshopper eats grass). Carnivores/Secondary consumers: eat primary consumers (e.g., frog eats grasshopper). Tertiary consumers: eat secondary consumers (e.g., snake eats frog). Top predators: no natural predators (e.g., eagle eats snake). Decomposers (saprotrophs): bacteria and fungi that break down dead organisms and waste, returning minerals to the soil. Without decomposers, dead material would accumulate and nutrients would be locked away. Abiotic components (non-living): Sunlight, temperature, water, humidity, soil, minerals, pH, air composition. Food chain: A linear sequence showing feeding relationships: Grass → Grasshopper → Frog → Snake → Eagle. Energy flows ONE WAY — from sun → producers → consumers at each level. Food web: Multiple interconnected food chains in an ecosystem. More realistic and stable than single food chains — if one species declines, alternative food sources exist. Trophic levels: The position in a food chain. T1 = Producers, T2 = Primary consumers, T3 = Secondary consumers, T4 = Tertiary consumers. Energy flow: Only 10% of energy transfers from one trophic level to the next; 90% is lost as heat (10% law).",
      worked_example:
        "Pond ecosystem food web: Phytoplankton (T1) → Zooplankton (T2) → Small fish (T3) → Large fish (T4) → Osprey/Heron (T5). If phytoplankton → 10,000 J. Zooplankton receive → 1,000 J (10%). Small fish → 100 J. Large fish → 10 J. Osprey → 1 J. This explains why large predators are rare — they receive very little energy. Also: if frogs are removed from the Grass → Grasshopper → Frog → Snake → Eagle food chain, grasshopper population explodes (overgrazing), snake population falls (no food), eagle must find alternative prey. This shows interdependence in an ecosystem.",
      common_misconceptions: [
        "Students say decomposers are not important — decomposers are ESSENTIAL for nutrient cycling; without them, all nutrients would be locked in dead matter and no new plants could grow.",
        "Students think food webs are just 'many food chains put together' without understanding why they matter — food webs provide stability; if one organism disappears, energy can flow through alternative paths.",
        "Students confuse producers and consumers — producers MAKE food (photosynthesis); consumers EAT food. All plants (even parasitic ones generally) are producers; all animals are consumers.",
      ],
      shortcuts_and_tricks: [
        "Trophic levels: T1 = Producers (plants). T2 = Herbivores. T3 = Carnivores (eat herbivores). T4 = Top carnivores.",
        "Decomposers = recyclers of the ecosystem — they are not consumers in the traditional food chain but are essential.",
        "Food chain always starts with a GREEN PLANT (producer) — never an animal.",
        "Mnemonic for components: 'PAD' = Producers, Animals (consumers), Decomposers.",
      ],
      diagram_description:
        "Diagram 1 (food chain with trophic levels and energy): Grass (T1, 10,000 J) → arrow → Grasshopper (T2, 1,000 J) → arrow → Frog (T3, 100 J) → arrow → Snake (T4, 10 J) → arrow → Eagle (T5, 1 J). Arrow at each level labelled '10% transferred, 90% lost as heat'. Diagram 2 (food web): Multiple interconnected arrows in a pond ecosystem showing phytoplankton connected to zooplankton and small fish, zooplankton connected to small fish, small fish to large fish, large fish to osprey, with decomposers (bacteria, fungi) at the bottom receiving dead matter from all levels.",
      key_takeaway:
        "An ecosystem has biotic (producers, consumers, decomposers) and abiotic components; producers convert solar energy to chemical energy; food chains show linear feeding relationships while food webs show realistic interconnections; only 10% of energy passes from one trophic level to the next.",
    },
  },

  {
    topicId: "sci_ch13_energy_flow",
    subject: "Science",
    chapterNumber: 13,
    name: "Energy Flow — 10% Law and Biological Magnification",
    prerequisite_knowledge: [
      "Trophic levels and food chains",
      "Concept of energy loss as heat",
      "Idea of concentration of chemicals in organisms",
    ],
    key_formulas: [
      "10% Law: Energy at next trophic level = 10% of energy at current level",
      "Energy at Tn = (Initial energy at T1) × (0.1)^(n-1)",
    ],
    teaching_content: {
      intuition:
        "When you eat food, you don't absorb 100% of its energy — most is used for your own life functions (movement, body heat, cellular processes) and lost as heat. This is why food chains can't have more than 4-5 levels: by the time energy reaches the top predator, only 0.001% of the original solar energy captured by plants remains. Biological magnification is the reverse of this idea — instead of energy decreasing, some chemicals (particularly fat-soluble pesticides like DDT) INCREASE in concentration as they move up the food chain, because each organism accumulates the chemical from all the food it eats over its lifetime.",
      process_explanation:
        "10% Law (Lindeman's rule, 1942): Only 10% of the energy stored at one trophic level is available to the next level. 90% is used for: metabolic activities (respiration, movement), body heat (especially in warm-blooded animals), undigested material in faeces. Consequence: As you move up the food chain, available energy decreases sharply. This limits food chain length to typically 3-4 trophic levels. Example: If producers capture 10,000 J of solar energy → T2 receives 1,000 J → T3 receives 100 J → T4 receives 10 J → T5 receives 1 J. This is why prey (lower trophic levels) are always more numerous than predators (higher trophic levels) — the energy pyramid is widest at the base. Ecological pyramids: Pyramid of energy: always upright (wider at base). Pyramid of numbers: usually upright (more grass than grasshoppers), but can be inverted (one tree supporting thousands of insects). Pyramid of biomass: usually upright, occasionally inverted (marine — low phytoplankton biomass supporting high zooplankton biomass because phytoplankton reproduce fast). Biological magnification (biomagnification): Persistent, fat-soluble chemicals (non-biodegradable, e.g., DDT — dichlorodiphenyltrichloroethane, heavy metals like mercury, lead) accumulate in fatty tissues of organisms. They are not metabolised or excreted easily. Each organism at a higher trophic level accumulates the chemical from ALL the prey it eats during its lifetime → concentration INCREASES at each trophic level. Example: Water has 0.003 ppm DDT → Phytoplankton 0.04 ppm → Zooplankton 0.5 ppm → Small fish 2 ppm → Large fish 25 ppm → Osprey/human 75 ppm. At the top of the food chain, DDT concentration is 25,000× higher than in water. Effect: DDT causes thinning of bird eggshells → reproductive failure → population decline in top predators like eagles and pelicans.",
      worked_example:
        "Question: If producers in a grassland ecosystem fix 40,000 J of solar energy, how much energy is available to tertiary consumers (T4)? Using 10% law: T1 = 40,000 J. T2 = 4,000 J (10% of T1). T3 = 400 J (10% of T2). T4 = 40 J (10% of T3). So tertiary consumers receive only 40 J — just 0.1% of original energy. This shows why tigers, eagles, and sharks (top predators) require large territories and are fewer in number than their prey.",
      common_misconceptions: [
        "Students think 10% law means 'only 10% of food is eaten by the next level' — the 10% refers to energy transfer efficiency; 90% of energy is lost mainly as HEAT through metabolic processes, not just uneaten food.",
        "Students think biological magnification means all chemicals increase up the food chain — only NON-BIODEGRADABLE, fat-soluble chemicals magnify (like DDT, PCBs, mercury); water-soluble or easily broken-down chemicals do not accumulate.",
        "Students confuse biological magnification with bioaccumulation — bioaccumulation is the build-up in a SINGLE organism; biomagnification is the increasing concentration as you go UP trophic levels across multiple organisms.",
      ],
      shortcuts_and_tricks: [
        "10% law quick calculation: divide by 10 for each trophic level step up. Multiply by 10 for each step down.",
        "If T1 = X joules, T4 receives X × (0.1)³ = X/1000 joules.",
        "DDT biomagnification pyramid: smallest concentration in water/producers → 10× larger in herbivores → 10× again in carnivores → again in top predators. Concentration multiplies ~10× per level.",
        "Only 3-5 trophic levels in any food chain because energy runs out — mathematical consequence of the 10% law.",
      ],
      diagram_description:
        "Diagram 1 (energy pyramid): Triangular pyramid with four levels. Base (T1/Producers): widest band labelled '10,000 J'. T2 (Herbivores): '1,000 J'. T3 (Carnivores): '100 J'. T4 (Top carnivores): '10 J'. Flame/heat arrows pointing outward at each level labelled '90% lost as heat'. Diagram 2 (biomagnification pyramid): Inverted triangle with DDT concentration values at each trophic level. Water: 0.003 ppm → Phytoplankton: 0.04 ppm → Zooplankton: 0.5 ppm → Small fish: 2 ppm → Large fish: 25 ppm → Top predator/human: 75 ppm. Concentration values increase going UP the pyramid. Label: 'Biomagnification of DDT — concentration increases 25,000× from water to top predator'.",
      key_takeaway:
        "Only 10% of energy transfers between trophic levels (90% is lost as heat); this limits food chains to 3-5 levels; non-biodegradable chemicals like DDT undergo biological magnification — their concentration increases 10-fold at each trophic level, reaching dangerous levels in top predators.",
    },
  },

  {
    topicId: "sci_ch13_biodegradability",
    subject: "Science",
    chapterNumber: 13,
    name: "Biodegradable and Non-Biodegradable Waste",
    prerequisite_knowledge: [
      "Role of decomposers in an ecosystem",
      "Concept of pollution",
      "Basic chemistry of organic vs synthetic materials",
    ],
    key_formulas: [],
    teaching_content: {
      intuition:
        "Nature has its own recycling system — decomposers (bacteria and fungi) break down dead organic matter back into simple inorganic substances that plants can reuse. This system works perfectly for materials that nature produces (wood, paper, food scraps). However, synthetic materials invented by humans in the last century (plastics, DDT, polythene bags) cannot be broken down by decomposers because microorganisms have not evolved enzymes to digest these novel molecules. These non-biodegradable materials accumulate in the environment causing long-term harm.",
      process_explanation:
        "Biodegradable waste: Materials broken down by decomposers (bacteria, fungi) into simpler inorganic substances (CO₂, water, minerals). Examples: Vegetable peels, fruit waste, food scraps, leaves, dead wood, paper, cotton cloth, wool, jute, leather, dried flowers, animal dung, sewage (human/animal waste). Decomposition time: Fruit peel ~2-5 weeks. Cotton cloth ~1-5 months. Wood ~10-15 years. Non-biodegradable waste: Materials that cannot be broken down by decomposers and persist in the environment for very long times. Examples: Polythene bags and plastic bottles (500-1000 years to degrade), DDT and other synthetic pesticides (decades), glass (may never degrade), synthetic fabrics (nylon, polyester — ~20-200 years), aluminium cans, heavy metals (mercury, lead — not degraded, only transformed), electronic waste (e-waste), nuclear waste. Why non-biodegradable is harmful: Physical harm: animals ingest plastic (sea turtles eating plastic bags thinking they are jellyfish), animals trapped in plastic rings. Chemical harm: DDT biomagnification (builds up in food chain — see biological magnification topic). Soil and water contamination: heavy metals leach into groundwater. Soil hardening: plastic covers soil, prevents air and water from entering, kills soil microorganisms. Solutions: Reduce use of non-biodegradable materials. Replace polythene bags with jute/paper bags. Recycling (especially glass, metals, paper). Composting biodegradable waste. Proper waste segregation at source (wet/dry waste).",
      worked_example:
        "A school cafeteria produces: 10 kg of vegetable peels, 2 kg of polythene bags, 3 kg of aluminium foil, and 5 kg of paper plates per day. Classification: Biodegradable → vegetable peels + paper plates (15 kg). Non-biodegradable → polythene bags + aluminium foil (5 kg). Disposal plan: Biodegradable waste → compost pit (can become manure in 4-6 weeks). Non-biodegradable → polythene bags must be minimised, aluminium can be recycled. Environmental consequence if polythene is dumped in a landfill: it persists for 500+ years, does not decompose, clogs drains, harms animals.",
      common_misconceptions: [
        "Students think paper NEVER biodegrades — paper IS biodegradable and decomposes relatively quickly (weeks to months depending on conditions).",
        "Students think all natural materials are biodegradable — natural rubber (latex) and some natural polymers degrade very slowly; 'natural' does not automatically mean fast-biodegradable.",
        "Students believe non-biodegradable waste 'just goes away' in landfills — non-biodegradable waste in landfills stays there for centuries; it does not disappear.",
      ],
      shortcuts_and_tricks: [
        "Quick rule: if it came from a living organism recently (food, paper, cotton, wood) → biodegradable. If it is synthetic/plastic/metal → non-biodegradable.",
        "Polythene (plastic bag) = most common example of non-biodegradable in NCERT questions.",
        "Newspaper and vegetable peels = most common examples of biodegradable in NCERT questions.",
        "DDT = both non-biodegradable AND undergoes biomagnification — always a hard-mark question combining both concepts.",
      ],
      diagram_description:
        "Diagram: Two columns side by side. Left column labelled 'Biodegradable Waste' with images/icons: apple core, vegetable peel, dead leaf, newspaper, cotton bag, wood piece. Arrow pointing down to decomposer symbols (bacteria, fungi) and then further down to 'CO₂ + H₂O + Minerals — returned to soil'. Right column labelled 'Non-Biodegradable Waste' with images/icons: plastic bottle, polythene bag, aluminium can, DDT molecule, glass bottle, e-waste circuit board. Arrow pointing down labelled 'No decomposers can break these down' with 'Persist for decades to centuries' at the bottom. A recycling arrow shown for aluminium and glass.",
      key_takeaway:
        "Biodegradable waste (vegetable peels, paper, cotton) is broken down by decomposers and returned to the environment; non-biodegradable waste (polythene, DDT, glass, aluminium) persists for decades to centuries, causing soil, water, and food chain contamination; reducing non-biodegradable waste use is the primary solution.",
    },
  },

  {
    topicId: "sci_ch13_ozone",
    subject: "Science",
    chapterNumber: 13,
    name: "Ozone Layer and its Depletion",
    prerequisite_knowledge: [
      "Structure of the atmosphere (troposphere, stratosphere)",
      "UV radiation and its harmful effects",
      "Concept of photochemical reactions",
    ],
    key_formulas: [
      "Ozone formation: O₂ + UV → O + O; O + O₂ → O₃",
      "Ozone destruction by CFC: CFC + UV → Cl· (chlorine radical); Cl· + O₃ → ClO + O₂; ClO + O → Cl· + O₂ (catalytic cycle — one Cl atom can destroy 100,000 O₃ molecules)",
    ],
    teaching_content: {
      intuition:
        "The ozone layer in the stratosphere (15-35 km above Earth) is like a sunscreen shield for the entire planet. Without it, dangerous ultraviolet (UV) radiation from the Sun would reach Earth's surface, causing massive increases in skin cancer, cataracts, and destroying phytoplankton at the base of the ocean food chain. The alarming discovery in the 1980s was that a group of human-made chemicals called CFCs (chlorofluorocarbons) — used in refrigerators and aerosol sprays — were drifting up to the stratosphere and catalytically destroying ozone in a chain reaction. One CFC molecule can destroy 100,000 ozone molecules.",
      process_explanation:
        "Ozone (O₃): Three atoms of oxygen bonded together. Ozone is a trace gas — makes up only about 0.00006% of the atmosphere. In the stratosphere (15-35 km altitude): ozone layer absorbs harmful UV-B and UV-C radiation (wavelengths 280-315 nm). Without ozone layer: UV-B radiation reaches Earth → causes sunburn, skin cancer (melanoma), cataracts (eye lens damage), weakened immune systems, DNA damage. UV-B also destroys phytoplankton → disrupts marine food chains. CFC (Chlorofluorocarbons): Full form: Chlorofluorocarbons. Brand name: Freon. Sources: Old refrigerators, air conditioners (coolants), aerosol spray cans (propellants), foam-blowing agents. CFCs are stable, non-toxic, non-flammable at ground level — seemed safe when first used. Problem: CFCs are so stable they drift up into the stratosphere unchanged. In stratosphere, UV radiation breaks CFC molecules, releasing highly reactive chlorine free radicals (Cl·). Chlorine catalytically destroys ozone: Cl· + O₃ → ClO + O₂. ClO + O → Cl· + O₂. Chlorine is regenerated and continues destroying more O₃ (catalytic cycle). One Cl atom can destroy ~100,000 O₃ molecules before being deactivated. Ozone hole: Discovered in 1985 over Antarctica (seasonal thinning, most severe in September-October). Caused by CFCs + polar stratospheric clouds providing reaction surfaces. Montreal Protocol (1987): International treaty signed by 197 countries to phase out CFC production and use. Considered the most successful international environmental agreement. CFCs replaced by HFCs (hydrofluorocarbons) which do not contain chlorine and do not destroy ozone (though they are greenhouse gases). Ozone layer is slowly recovering — expected to fully recover by 2065-2075 if CFC bans hold.",
      worked_example:
        "Before the Montreal Protocol: A factory in India produced refrigerators using Freon-12 (a CFC). The refrigerant leaked into the atmosphere, drifted over 15-35 years to Antarctica. In stratospheric cold conditions + UV light → Cl released → ozone destroyed. Scientists measuring stratospheric ozone over Antarctica from 1970-1985 recorded a 40% thinning (the 'ozone hole'). After the Montreal Protocol (1987): Production of CFCs phased out globally. Atmospheric CFC levels peaked in the mid-1990s and have been slowly decreasing since. The ozone hole stopped growing by 2000 and has slowly begun to recover. Lesson: International cooperation can reverse human-caused environmental damage.",
      common_misconceptions: [
        "Students say 'ozone is harmful to humans' — GROUND-LEVEL ozone (in the troposphere, formed by pollution) IS harmful to breathe (causes respiratory problems); STRATOSPHERIC ozone (the ozone layer) is beneficial and protects us from UV radiation. Ozone at the wrong level is the problem.",
        "Students think the ozone hole is a complete absence of ozone — the ozone hole is a THINNING (reduction in concentration) of the ozone layer, not a complete hole; ozone concentration drops by 40-70% over Antarctica.",
        "Students confuse ozone depletion with the greenhouse effect — ozone depletion allows more UV radiation through; greenhouse effect traps heat from infrared radiation. These are two different atmospheric problems.",
      ],
      shortcuts_and_tricks: [
        "CFC full form: Chloro-Fluoro-Carbons. They contain C, F, and Cl atoms.",
        "Memory for ozone destruction chain: CFC → Cl radical → kills O₃ catalytically (one Cl kills 100,000 O₃).",
        "Ozone formula: O₃ (three oxygen atoms). Oxygen gas formula: O₂ (two oxygen atoms).",
        "Montreal Protocol (1987) = ozone. Kyoto Protocol (1997) = greenhouse gases/climate change. Know which treaty covers which problem.",
      ],
      diagram_description:
        "Diagram 1 (atmosphere layers): Vertical cross-section of atmosphere showing: Troposphere (0-12 km, where weather occurs, ground-level ozone pollution), Stratosphere (12-50 km, ozone layer at 15-35 km, UV absorption shown with downward UV arrows stopped by ozone layer). A thinned/missing section labelled 'Ozone hole over Antarctica'. Diagram 2 (CFC destruction cycle): Circular chain reaction diagram: CFC molecule → UV in stratosphere → Cl· free radical released → Cl· + O₃ → ClO + O₂ → ClO + O → Cl· + O₂ → (back to Cl· — arrow showing it is a catalytic cycle). Counter label: 'One Cl atom destroys ~100,000 O₃ molecules'. Diagram 3: Bar graph showing ozone layer thickness 1970-2020, declining to minimum around 2000, beginning slow recovery after Montreal Protocol.",
      key_takeaway:
        "The stratospheric ozone layer (O₃) absorbs harmful UV radiation; CFCs released from refrigerants and aerosols drift to the stratosphere and catalytically destroy ozone via free chlorine radicals; one CFC molecule can destroy 100,000 ozone molecules; the Montreal Protocol (1987) successfully began phasing out CFCs and the ozone layer is slowly recovering.",
    },
  },

  // ══════════════════════════════════════════════════════════════════
  // CHAPTER 6 — Control and Coordination (ADDITION)
  // ══════════════════════════════════════════════════════════════════
  {
    topicId: "sci_ch6_endocrine_system",
    subject: "Science",
    chapterNumber: 6,
    name: "Endocrine System — Chemical Coordination in Animals",
    prerequisite_knowledge: [
      "Nervous system and reflex arc",
      "Concept of hormones as chemical messengers",
      "Blood as a transport medium",
    ],
    key_formulas: [
      "Feedback mechanism: high blood glucose → insulin released → glucose absorbed → blood glucose falls → insulin stops",
      "Adrenaline → ↑ heart rate + ↑ blood glucose + ↑ breathing rate (fight-or-flight)",
      "Thyroxine synthesis requires iodine; deficiency → goitre (enlarged thyroid)",
    ],
    teaching_content: {
      intuition:
        "Think of the endocrine system as a slow-acting but long-lasting messaging service — WhatsApp messages (hormones) that travel through the bloodstream and reach the right 'group chat' (target organ). Unlike the nervous system which is like a direct phone call (fast, short-lived), hormones are broadcast messages that take seconds to minutes to arrive but their effects can last hours or days. Ductless glands release hormones directly into blood — there are no pipes or tubes.",
      process_explanation:
        "Key endocrine glands and their hormones:\n\n1. PITUITARY GLAND (base of brain) — called the 'master gland' because its hormones control other glands. Secretes: growth hormone (GH) — stimulates bone and muscle growth; TSH (controls thyroid); FSH/LH (control gonads); ADH (controls water reabsorption in kidneys).\n\n2. THYROID GLAND (neck, butterfly shape) — secretes THYROXINE. Thyroxine regulates the body's metabolic rate (how fast cells burn energy). It needs iodine to be made. Deficiency: goitre (swelling of thyroid); cretinism in children (stunted mental and physical growth). Excess: hyperthyroidism (weight loss, rapid heartbeat, anxiety).\n\n3. ADRENAL GLAND (one on top of each kidney, hence 'ad' = near, 'renal' = kidney) — secretes ADRENALINE (epinephrine) in emergencies. Adrenaline causes the 'fight-or-flight' response: increases heart rate and breathing rate, raises blood pressure, diverts blood from digestive system to muscles, raises blood glucose (from liver glycogen), dilates pupils.\n\n4. PANCREAS (below stomach, dual function) — exocrine part secretes digestive enzymes; endocrine part (islets of Langerhans) secretes: INSULIN (β cells — lowers blood glucose: promotes glucose uptake by cells, converts glucose to glycogen in liver) and GLUCAGON (α cells — raises blood glucose: promotes glycogen breakdown). Diabetes mellitus: insufficient insulin → high blood glucose (hyperglycaemia).\n\n5. GONADS — Testes secrete TESTOSTERONE (sperm production, male secondary sexual characters: voice deepening, facial hair, muscle development). Ovaries secrete OESTROGEN (female secondary sexual characters: breast development, wider hips) and PROGESTERONE (maintains uterine lining during pregnancy).\n\nFEEDBACK MECHANISM: The body self-regulates hormone levels. Example: when blood glucose rises after a meal → pancreas detects this → secretes insulin → cells absorb glucose → blood glucose falls → pancreas stops secreting insulin. This is called negative feedback.",
      worked_example:
        "Exam question: 'A person hears a loud bang behind him. List FOUR changes that occur in his body immediately.' Answer using adrenaline: (1) Heart rate increases — to pump more blood to muscles. (2) Breathing rate increases — to supply more oxygen. (3) Blood glucose rises — liver breaks down glycogen to release glucose for energy. (4) Pupils dilate — to improve vision. (5) Blood flow diverted from digestive organs to skeletal muscles. All these are caused by adrenaline released by the adrenal gland in the fight-or-flight response.\n\nSecond question: 'Why does iodine deficiency cause goitre?' Answer: Thyroid gland needs iodine to make thyroxine. If iodine is deficient, thyroxine cannot be made. The pituitary keeps sending TSH (thyroid-stimulating hormone) to tell the thyroid to produce more, but it cannot. The thyroid keeps getting the signal to grow → it enlarges → visible swelling in neck called goitre.",
      common_misconceptions: [
        "Adrenaline is produced in the brain — FALSE. Adrenaline is produced by the adrenal glands located above the kidneys, not the brain.",
        "Insulin increases blood glucose — FALSE. Insulin LOWERS blood glucose by helping cells absorb it; glucagon RAISES blood glucose.",
        "Hormones only work in specific gender — FALSE. Testosterone and oestrogen are present in both sexes, just in different concentrations.",
        "The pancreas only makes digestive juices — FALSE. The pancreatic islets of Langerhans make insulin and glucagon (hormones), while other cells make digestive enzymes.",
      ],
      shortcuts_and_tricks: [
        "Mnemonic for adrenal gland location: 'AD-RENAL — ADd to the top of the RENAL (kidney)' — adrenal gland sits on top of the kidney.",
        "Insulin vs glucagon memory trick: IN-sulin = takes glucose IN to cells (lowers blood glucose); gluCAGon = takes glucose OUT of cages (raises blood glucose).",
        "Goitre = thyROID + ioDIne connection — the word 'thyroid' contains no 'iodine' hint, so remember: goitre = iodine deficiency → thyroid enlarges.",
        "Master gland = PITUITARY = PIT-itary (it sits in a small PIT at the base of the brain called the sella turcica).",
      ],
      diagram_description:
        "Diagram 1 (endocrine gland locations): Outline of human body with labelled arrows pointing to: brain (pituitary gland, pineal gland), neck (thyroid gland with parathyroids behind it), chest area (thymus), just above each kidney (adrenal/suprarenal gland), abdomen (pancreas — dual exocrine + endocrine), lower abdomen (testes in male OR ovaries in female). Diagram 2 (feedback loop): Circular flow diagram showing: High blood glucose → Pancreas (beta cells) → Insulin secreted → Body cells absorb glucose → Blood glucose falls → Pancreas stops secreting → blood glucose maintained around 90 mg/dL. Arrow loop labelled 'Negative Feedback'. Diagram 3 (fight-or-flight): Stick figure experiencing stress → adrenal gland activated → 5 labelled arrows showing: heart rate ↑, breathing ↑, blood glucose ↑, blood flow to muscles ↑, pupils dilate.",
      key_takeaway:
        "The endocrine system coordinates the body via hormones (chemical messengers) carried in blood from ductless glands to target organs; key hormones: adrenaline (fight-or-flight, from adrenal glands), thyroxine (metabolism, needs iodine; deficiency → goitre), insulin (lowers blood glucose, from pancreas β-cells), glucagon (raises blood glucose); hormone levels are self-regulated via negative feedback mechanisms.",
    },
  },

  // ══════════════════════════════════════════════════════════════════
  // CHAPTER 7 — Reproduction (ADDITION)
  // ══════════════════════════════════════════════════════════════════
  {
    topicId: "sci_ch7_reproductive_health",
    subject: "Science",
    chapterNumber: 7,
    name: "Reproductive Health — Contraception, STDs and Population",
    prerequisite_knowledge: [
      "Human male and female reproductive systems",
      "Fertilisation, implantation and pregnancy",
      "Menstrual cycle basics",
    ],
    key_formulas: [
      "HIV targets CD4⁺ helper T-cells → destroys immune system → AIDS (acquired immune deficiency)",
      "MTP (Medical Termination of Pregnancy): legal in India under MTP Act; used for family planning",
      "Barrier contraceptives provide dual protection: prevent pregnancy AND STDs",
    ],
    teaching_content: {
      intuition:
        "Reproductive health is about taking conscious, informed control of reproduction — knowing when and whether to have children, and protecting yourself and your partner from infections. Just as you use a seatbelt to make driving safe (it doesn't stop you from driving, just makes it safer), contraceptives make reproduction a choice. This is a scientifically important topic because overpopulation, maternal mortality, and STD epidemics are major public health challenges that knowledge can prevent.",
      process_explanation:
        "CONTRACEPTION METHODS:\n\n1. BARRIER METHODS — physically prevent sperm from reaching egg:\n   • Male condom: thin latex sheath worn over penis; also prevents STD transmission\n   • Female condom: polyurethane sheath inserted into vagina\n   • Diaphragm: dome-shaped cap inserted over cervix\n   Advantage: no hormones, condoms also protect against STDs\n\n2. HORMONAL METHODS — use synthetic oestrogen/progesterone to prevent ovulation:\n   • Combined oral pill (daily): most common; prevents ovulation\n   • Emergency contraceptive pill ('morning after'): taken within 72 hours\n   • Injectable contraceptives (3-monthly)\n   • Hormonal implant (under skin, slow-release)\n   Advantage: very effective; disadvantage: no STD protection, side effects\n\n3. INTRA-UTERINE DEVICE (IUD):\n   • Copper-T: small copper device inserted into uterus by doctor; prevents implantation\n   • Hormonal IUDs also available\n   • Long-term (5–10 years), reversible\n\n4. SURGICAL METHODS (permanent, usually):\n   • Vasectomy (male): vas deferens cut and tied; sperm cannot reach urethra\n   • Tubectomy / tubal ligation (female): fallopian tubes cut and tied; egg cannot reach uterus\n   These are the most reliable methods but difficult to reverse.\n\nSTDs (SEXUALLY TRANSMITTED DISEASES / INFECTIONS):\n\n1. BACTERIAL STDs — curable with antibiotics:\n   • Gonorrhoea: caused by Neisseria gonorrhoeae; burning sensation during urination, discharge\n   • Syphilis: caused by Treponema pallidum; painless sore, then rash, then organ damage if untreated\n\n2. VIRAL STDs — no complete cure:\n   • HIV/AIDS: Human Immunodeficiency Virus attacks CD4⁺ helper T-lymphocytes → destroys immune system → AIDS (body cannot fight infections). Transmission: unprotected sex, sharing needles, blood transfusion, mother to child. NO CURE — managed with antiretroviral therapy (ART). NOT transmitted by: sharing food, hugging, mosquito bites.\n   • Herpes (HSV-2): painful blisters; remains dormant in nerve cells\n   • Hepatitis B: liver infection via sexual contact or blood\n\nPOPULATION & REPRODUCTIVE HEALTH:\n   India's National Health Mission (NHM) promotes contraception, safe motherhood, and sex education. MTP (Medical Termination of Pregnancy) is legal under specific conditions in India. Adolescent reproductive health education reduces teen pregnancy and STD rates.",
      worked_example:
        "CBSE exam question: 'Why are condoms considered a better contraceptive than the pill?' Answer: Condoms are barrier methods that (1) prevent sperm from reaching egg AND (2) also protect against sexually transmitted diseases (STDs) including HIV/AIDS. The pill only prevents pregnancy by stopping ovulation — it provides no protection against STDs. Additionally, the pill requires daily hormonal intervention and can have side effects, while a condom has minimal side effects. For complete protection, condoms are the only method offering both contraception and STD prevention.\n\nSecond question: 'A person is HIV positive but does not have AIDS. Explain.' Answer: HIV is the virus; AIDS is the disease that results when HIV has destroyed enough CD4⁺ helper T-cells that the immune system can no longer fight infections. HIV-positive means the virus is present in the body. AIDS is diagnosed when CD4⁺ T-cell count falls below 200 cells/μL (normal: 500–1500). With antiretroviral therapy (ART), HIV-positive people can live many years without developing AIDS.",
      common_misconceptions: [
        "HIV is transmitted by mosquito bites or sharing food — FALSE. HIV is not transmitted by casual contact, mosquitoes, hugging, or sharing utensils. It requires direct blood-to-blood, sexual, or mother-to-child transmission.",
        "Vasectomy reduces sexual drive or performance — FALSE. Vasectomy only cuts the vas deferens (sperm duct). Testosterone production continues normally; sexual drive and performance are unaffected.",
        "Condoms are only for men — FALSE. Female condoms also exist and can be used independently by women.",
        "AIDS is always immediately fatal — FALSE. With modern antiretroviral therapy (ART), HIV-positive people can live decades with near-normal life expectancy.",
      ],
      shortcuts_and_tricks: [
        "ABCD of contraception: A = Abstinence (100% effective), B = Barrier (condom, also protects STDs), C = Chemical (hormonal pill, IUD), D = Definitive (vasectomy, tubectomy).",
        "HIV vs AIDS: HIV is the virus; AIDS is the disease. You can be HIV+ without AIDS (early/treated stage). AIDS = advanced HIV infection with destroyed immunity.",
        "VAS-ectomy = VAS deferens cut (male). TUBE-ctomy = FALLopian TUBE cut (female). Both end in -ectomy (cutting).",
        "STD bacteria are curable (syphilis, gonorrhoea = bacterial → antibiotics); STD viruses are not curable (HIV, herpes, hepatitis B = viral → no cure, only management).",
      ],
      diagram_description:
        "Diagram 1 (contraception methods table): 4-column table — Method | How it works | Effectiveness | Also prevents STDs? Rows: Male condom (barrier, 98%, YES), Female condom (barrier, 95%, YES), Oral pill (hormonal, 99%, NO), Copper-T IUD (physical barrier to implantation, 99%, NO), Vasectomy (permanent, 99.9%, NO), Tubectomy (permanent, 99.9%, NO). Diagram 2 (HIV lifecycle): Simplified diagram showing HIV virus → enters CD4⁺ T-cell → uses reverse transcriptase to integrate DNA → replicates inside T-cell → T-cell destroyed → new viruses infect more T-cells → immune system weakened → AIDS. Diagram 3 (STD transmission flowchart): Three transmission routes shown: Unprotected sex → HIV/herpes/gonorrhoea/syphilis; Contaminated blood/needles → HIV/Hepatitis B; Mother to child (during birth/breastfeeding) → HIV.",
      key_takeaway:
        "Contraceptives are broadly barrier (condom — also prevents STDs), hormonal (pill), IUD (Copper-T), and surgical (vasectomy/tubectomy); HIV is the virus, AIDS is the terminal disease caused when HIV destroys CD4⁺ helper T-cells — there is no cure but ART extends life; bacterial STDs (gonorrhoea, syphilis) are curable with antibiotics; condoms are the only method providing dual protection against both pregnancy and STDs.",
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
  console.log(`\nBiology teaching content: ${upserted} topics upserted`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
