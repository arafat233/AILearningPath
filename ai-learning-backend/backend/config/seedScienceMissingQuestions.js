/**
 * Seed: CBSE Class 10 Science — Missing Topic Questions
 * Adds questions for 7 topics that had 0 or only 1 question:
 *   sci_ch4_carbon_allotropes (0), sci_ch6_endocrine_system (0),
 *   sci_ch7_reproductive_health (0), sci_ch8_variation (0),
 *   sci_ch12_domestic_circuits (0), sci_ch1_thermal_decomposition (+4),
 *   sci_ch5_transport_plants (+4)
 *
 * Safe to re-run — skips duplicates on { questionText, subject }.
 * Usage:
 *   cd ai-learning-backend/backend
 *   node config/seedScienceMissingQuestions.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import { Question } from "../models/index.js";

const QUESTIONS = [

  // ══════════════════════════════════════════════════════════════════════
  // sci_ch4_carbon_allotropes — 5 questions (0 → 5)
  // ══════════════════════════════════════════════════════════════════════
  {
    topic: "Carbon and its Compounds", subtopic: "Allotropes of Carbon",
    topicId: "sci_ch4_carbon_allotropes",
    subject: "Science", grade: "10", examBoard: "CBSE",
    questionText: "Which allotrope of carbon is the hardest naturally occurring substance?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Graphite",   type: "concept_error", logicTag: "soft_lubricant_not_hard" },
      { text: "Fullerene",  type: "concept_error", logicTag: "hollow_cage_not_hardest" },
      { text: "Diamond",    type: "correct",       logicTag: "" },
      { text: "Coal",       type: "concept_error", logicTag: "impure_carbon_not_allotrope" },
    ],
    solutionSteps: [
      "Diamond has each carbon atom covalently bonded to four others in a rigid 3D tetrahedral lattice.",
      "This 4-bond network in all directions makes diamond extremely hard — nothing can scratch it.",
      "Graphite is soft because its layers can slide over each other; fullerene is a hollow cage structure.",
    ],
    shortcut: "Diamond = 4 bonds in all directions = 4×strong = hardest. Graphite = 3 bonds + free layer = soft.",
  },
  {
    topic: "Carbon and its Compounds", subtopic: "Allotropes of Carbon",
    topicId: "sci_ch4_carbon_allotropes",
    subject: "Science", grade: "10", examBoard: "CBSE",
    questionText: "Why does graphite conduct electricity while diamond does not?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "Graphite is a metal; diamond is a non-metal",                           type: "concept_error", logicTag: "both_are_non_metals" },
      { text: "Graphite has one free (delocalised) electron per carbon; diamond has none", type: "correct",   logicTag: "" },
      { text: "Graphite has more carbon atoms than diamond",                            type: "concept_error", logicTag: "number_irrelevant" },
      { text: "Diamond is transparent so it cannot conduct electricity",                type: "concept_error", logicTag: "transparency_unrelated" },
    ],
    solutionSteps: [
      "In graphite each carbon forms only 3 covalent bonds, leaving 1 valence electron free per atom.",
      "These delocalised electrons can move between layers and carry electric charge → graphite conducts.",
      "In diamond all 4 valence electrons are used in covalent bonds — no free electrons → non-conductor.",
    ],
    shortcut: "Graphite = 3 bonds used + 1 free electron = conductor. Diamond = 4 bonds all used = insulator.",
  },
  {
    topic: "Carbon and its Compounds", subtopic: "Allotropes of Carbon",
    topicId: "sci_ch4_carbon_allotropes",
    subject: "Science", grade: "10", examBoard: "CBSE",
    questionText: "The allotrope of carbon used as a dry lubricant and in pencil cores is:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Diamond",   type: "concept_error", logicTag: "too_hard_for_pencil" },
      { text: "Fullerene", type: "concept_error", logicTag: "used_in_nanotechnology" },
      { text: "Graphite",  type: "correct",       logicTag: "" },
      { text: "Charcoal",  type: "concept_error", logicTag: "impure_amorphous_carbon" },
    ],
    solutionSteps: [
      "Graphite's layered structure means layers can slide over each other easily — making it slippery.",
      "This property makes graphite useful as a dry lubricant in machines and in pencil cores ('lead').",
      "Pencil 'lead' is actually a graphite-clay mixture, not lead metal.",
    ],
    shortcut: "Graphite = layers that slip = lubricant + pencil. Remember 'graphite → graph → writing'.",
  },
  {
    topic: "Carbon and its Compounds", subtopic: "Allotropes of Carbon",
    topicId: "sci_ch4_carbon_allotropes",
    subject: "Science", grade: "10", examBoard: "CBSE",
    questionText: "Fullerene C₆₀ is composed of 60 carbon atoms arranged in:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "A flat single layer of hexagonal rings only",                       type: "concept_error", logicTag: "describes_graphene" },
      { text: "12 pentagons and 20 hexagons forming a hollow sphere",              type: "correct",       logicTag: "" },
      { text: "A tetrahedral 3D lattice similar to diamond",                       type: "concept_error", logicTag: "describes_diamond" },
      { text: "20 pentagons and 12 hexagons forming a hollow sphere",              type: "concept_error", logicTag: "reversed_numbers" },
    ],
    solutionSteps: [
      "C₆₀ (Buckminsterfullerene) has a football (soccer ball) shape.",
      "It consists of 12 pentagonal and 20 hexagonal faces — exactly like a standard football.",
      "It is a hollow cage structure used in nanotechnology and drug delivery research.",
    ],
    shortcut: "C₆₀ = football shape = 12 pentagons + 20 hexagons. Remember '12 and 20' like a football.",
  },
  {
    topic: "Carbon and its Compounds", subtopic: "Allotropes of Carbon",
    topicId: "sci_ch4_carbon_allotropes",
    subject: "Science", grade: "10", examBoard: "CBSE",
    questionText: "Which of the following correctly pairs an allotrope of carbon with ONE of its uses?",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 1, isAIGenerated: true,
    options: [
      { text: "Diamond — used as a dry lubricant in machinery",          type: "concept_error", logicTag: "lubricant_is_graphite" },
      { text: "Graphite — used as an electrical insulator in circuits",  type: "concept_error", logicTag: "graphite_is_conductor" },
      { text: "Fullerene — used in cutting tools and jewellery",         type: "concept_error", logicTag: "cutting_tools_is_diamond" },
      { text: "Graphite — used as electrodes in electrolytic cells",     type: "correct",       logicTag: "" },
    ],
    solutionSteps: [
      "Graphite is a good conductor of electricity and is chemically inert → ideal electrode material.",
      "Diamond: cutting tools, jewellery, abrasives (hardest substance).",
      "Graphite: electrodes, pencils, dry lubricant.",
      "Fullerene: drug delivery, nanotechnology, potential antiviral agents.",
    ],
    shortcut: "Graphite = conductor = electrode. Diamond = hard = cutting/drilling. Fullerene = hollow cage = drug carrier.",
  },

  // ══════════════════════════════════════════════════════════════════════
  // sci_ch6_endocrine_system — 5 questions (0 → 5)
  // ══════════════════════════════════════════════════════════════════════
  {
    topic: "Control and Coordination", subtopic: "Endocrine System",
    topicId: "sci_ch6_endocrine_system",
    subject: "Science", grade: "10", examBoard: "CBSE",
    questionText: "Which endocrine gland is called the 'master gland' because it controls other endocrine glands?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Thyroid gland",    type: "concept_error", logicTag: "controlled_by_pituitary" },
      { text: "Adrenal gland",    type: "concept_error", logicTag: "emergency_hormone_only" },
      { text: "Pituitary gland",  type: "correct",       logicTag: "" },
      { text: "Pancreas",         type: "concept_error", logicTag: "blood_glucose_not_master" },
    ],
    solutionSteps: [
      "The pituitary gland, located at the base of the brain in a bony cavity (sella turcica), secretes TSH, FSH, LH, GH, and ADH.",
      "These hormones control the thyroid, gonads, and other endocrine glands — hence 'master gland'.",
    ],
    shortcut: "PIT-itary sits in a PIT at the base of the brain and controls all other glands = master.",
  },
  {
    topic: "Control and Coordination", subtopic: "Endocrine System",
    topicId: "sci_ch6_endocrine_system",
    subject: "Science", grade: "10", examBoard: "CBSE",
    questionText: "Deficiency of iodine in diet leads to which condition?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Diabetes mellitus",  type: "concept_error", logicTag: "caused_by_insulin_deficiency" },
      { text: "Goitre",             type: "correct",       logicTag: "" },
      { text: "Dwarfism",           type: "concept_error", logicTag: "caused_by_GH_deficiency" },
      { text: "Cretinism only in adults", type: "concept_error", logicTag: "cretinism_in_children_not_adults" },
    ],
    solutionSteps: [
      "Thyroid gland needs iodine to synthesise thyroxine. Without iodine, thyroxine cannot be made.",
      "The pituitary keeps sending TSH to stimulate the thyroid → thyroid keeps growing → visible swelling in neck called goitre.",
      "Cretinism (stunted mental/physical growth) occurs in children deprived of thyroxine during development.",
    ],
    shortcut: "No iodine → No thyroxine → Thyroid swells → GOITRE. Use iodised salt to prevent.",
  },
  {
    topic: "Control and Coordination", subtopic: "Endocrine System",
    topicId: "sci_ch6_endocrine_system",
    subject: "Science", grade: "10", examBoard: "CBSE",
    questionText: "Adrenaline, the 'fight-or-flight' hormone, is secreted by which gland?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Pituitary gland",  type: "concept_error", logicTag: "master_gland_not_adrenaline" },
      { text: "Thyroid gland",    type: "concept_error", logicTag: "secretes_thyroxine" },
      { text: "Pancreas",         type: "concept_error", logicTag: "secretes_insulin_glucagon" },
      { text: "Adrenal gland",    type: "correct",       logicTag: "" },
    ],
    solutionSteps: [
      "The adrenal glands are located on top of each kidney ('ad' = near, 'renal' = kidney).",
      "They secrete adrenaline in response to stress/emergency → increases heart rate, breathing, blood glucose, and diverts blood to muscles.",
    ],
    shortcut: "AD-renal = ADd on top of RENAL (kidney). Adrenaline = fight-or-flight = emergency hormone.",
  },
  {
    topic: "Control and Coordination", subtopic: "Endocrine System",
    topicId: "sci_ch6_endocrine_system",
    subject: "Science", grade: "10", examBoard: "CBSE",
    questionText: "Which hormone is responsible for lowering blood glucose levels after a meal?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "Glucagon",    type: "concept_error", logicTag: "raises_blood_glucose" },
      { text: "Thyroxine",   type: "concept_error", logicTag: "regulates_metabolic_rate" },
      { text: "Adrenaline",  type: "concept_error", logicTag: "raises_blood_glucose_in_emergency" },
      { text: "Insulin",     type: "correct",       logicTag: "" },
    ],
    solutionSteps: [
      "After a meal, blood glucose rises → pancreatic β-cells secrete insulin.",
      "Insulin allows body cells to absorb glucose and converts excess glucose to glycogen in the liver → blood glucose falls.",
      "Glucagon (from α-cells) does the opposite: breaks down glycogen → raises blood glucose when it falls too low.",
    ],
    shortcut: "IN-sulin = takes glucose IN to cells (lowers blood glucose). GluCAGon = CAGES glucose (raises it from glycogen).",
  },
  {
    topic: "Control and Coordination", subtopic: "Endocrine System",
    topicId: "sci_ch6_endocrine_system",
    subject: "Science", grade: "10", examBoard: "CBSE",
    questionText: "A person is feeling extremely stressed before an exam. Which of the following changes in the body is DIRECTLY caused by the hormone released during this stress response?",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 1, isAIGenerated: true,
    options: [
      { text: "Blood glucose level decreases and digestion speeds up",                type: "concept_error", logicTag: "opposite_of_fight_flight" },
      { text: "Heart rate increases and blood is diverted away from digestive organs", type: "correct",      logicTag: "" },
      { text: "Insulin is secreted to manage the increased glucose",                  type: "concept_error", logicTag: "insulin_is_response_not_direct" },
      { text: "Thyroxine increases to boost overall metabolism",                      type: "concept_error", logicTag: "thyroxine_is_long_term_not_stress" },
    ],
    solutionSteps: [
      "Stress triggers the adrenal gland to release adrenaline.",
      "Adrenaline: increases heart rate and breathing, raises blood glucose (from glycogen), dilates pupils, diverts blood from digestive organs to skeletal muscles.",
      "This prepares the body for 'fight or flight' — rapid physical response. Digestion slows down, not speeds up.",
    ],
    shortcut: "Adrenaline = fight-or-flight: heart rate UP, glucose UP, digestion DOWN, muscles get blood.",
  },

  // ══════════════════════════════════════════════════════════════════════
  // sci_ch7_reproductive_health — 5 questions (0 → 5)
  // ══════════════════════════════════════════════════════════════════════
  {
    topic: "How do Organisms Reproduce?", subtopic: "Reproductive Health",
    topicId: "sci_ch7_reproductive_health",
    subject: "Science", grade: "10", examBoard: "CBSE",
    questionText: "Which contraceptive method provides protection against BOTH unwanted pregnancy AND sexually transmitted diseases (STDs)?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Oral contraceptive pill",  type: "concept_error", logicTag: "prevents_pregnancy_not_STDs" },
      { text: "Copper-T (IUD)",           type: "concept_error", logicTag: "prevents_implantation_not_STDs" },
      { text: "Male condom",              type: "correct",       logicTag: "" },
      { text: "Vasectomy",                type: "concept_error", logicTag: "permanent_no_STD_protection" },
    ],
    solutionSteps: [
      "The male condom is a barrier method that physically prevents sperm from reaching the egg (contraception).",
      "It also prevents direct contact between mucous membranes, blocking the transmission of HIV, gonorrhoea, syphilis, and other STDs.",
      "The pill only prevents ovulation; IUD prevents implantation; vasectomy is permanent — none protect against STDs.",
    ],
    shortcut: "Only CONDOM = double protection: pregnancy + STDs. All other methods = pregnancy only.",
  },
  {
    topic: "How do Organisms Reproduce?", subtopic: "Reproductive Health",
    topicId: "sci_ch7_reproductive_health",
    subject: "Science", grade: "10", examBoard: "CBSE",
    questionText: "HIV (Human Immunodeficiency Virus) primarily destroys which cells, leading to AIDS?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "Red blood cells (erythrocytes)",      type: "concept_error", logicTag: "rbc_carry_oxygen_not_immunity" },
      { text: "Platelets (thrombocytes)",            type: "concept_error", logicTag: "platelets_clot_blood" },
      { text: "CD4⁺ helper T-lymphocytes",           type: "correct",       logicTag: "" },
      { text: "Neutrophils (phagocytic cells)",      type: "concept_error", logicTag: "neutrophils_innate_not_HIV_target" },
    ],
    solutionSteps: [
      "HIV specifically attaches to the CD4 receptor on helper T-cells (T-lymphocytes), enters them, and replicates inside them, destroying the cell.",
      "As CD4⁺ T-cell count drops below 200/μL, the immune system can no longer fight infections.",
      "This immunodeficiency state — AIDS (Acquired Immune Deficiency Syndrome) — leaves the patient vulnerable to opportunistic infections.",
    ],
    shortcut: "HIV = attacks CD4 T-cells = destroys immune system = AIDS. CD4 = immune system's generals.",
  },
  {
    topic: "How do Organisms Reproduce?", subtopic: "Reproductive Health",
    topicId: "sci_ch7_reproductive_health",
    subject: "Science", grade: "10", examBoard: "CBSE",
    questionText: "Vasectomy is a surgical contraceptive method in males. What is cut/tied in this procedure?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "Urethra",        type: "concept_error", logicTag: "urethra_carries_urine_not_cut" },
      { text: "Vas deferens",   type: "correct",       logicTag: "" },
      { text: "Seminal vesicle", type: "concept_error", logicTag: "produces_seminal_fluid_not_cut" },
      { text: "Epididymis",     type: "concept_error", logicTag: "sperm_maturation_not_cut" },
    ],
    solutionSteps: [
      "The vas deferens (sperm duct) carries sperm from the testes to the urethra.",
      "In vasectomy, the vas deferens is cut and tied — sperm can no longer travel to the ejaculate.",
      "Testosterone production and sexual function are unaffected because the testes still function normally.",
    ],
    shortcut: "VAS-ectomy = VAS deferens cut. TUBE-ctomy = FALLopian TUBE cut. Both end in '-ectomy' (cutting).",
  },
  {
    topic: "How do Organisms Reproduce?", subtopic: "Reproductive Health",
    topicId: "sci_ch7_reproductive_health",
    subject: "Science", grade: "10", examBoard: "CBSE",
    questionText: "Which of the following statements about HIV/AIDS is CORRECT?",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 1, isAIGenerated: true,
    options: [
      { text: "HIV is transmitted by mosquito bites and casual handshakes",                           type: "concept_error", logicTag: "HIV_not_vector_borne_or_casual" },
      { text: "AIDS develops immediately after HIV infection in all cases",                           type: "concept_error", logicTag: "HIV_to_AIDS_takes_years" },
      { text: "HIV-positive people can live for decades without developing AIDS with ART treatment",  type: "correct",       logicTag: "" },
      { text: "AIDS is caused by a bacterium and can be cured with antibiotics",                      type: "concept_error", logicTag: "HIV_is_viral_not_bacterial" },
    ],
    solutionSteps: [
      "HIV is a virus — antibiotics do not work against viruses. There is currently no complete cure.",
      "Antiretroviral Therapy (ART) suppresses HIV replication, allowing CD4 counts to remain high and preventing progression to AIDS.",
      "HIV is NOT transmitted by mosquitoes, casual contact, sharing food, or hugging — only through unprotected sex, blood-to-blood, or mother-to-child.",
    ],
    shortcut: "HIV = virus → no antibiotic cure. ART = manages it, not cures. HIV+ ≠ AIDS (can take years).",
  },
  {
    topic: "How do Organisms Reproduce?", subtopic: "Reproductive Health",
    topicId: "sci_ch7_reproductive_health",
    subject: "Science", grade: "10", examBoard: "CBSE",
    questionText: "The Copper-T is classified as which type of contraceptive device?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Barrier method",              type: "concept_error", logicTag: "barrier_is_condom_diaphragm" },
      { text: "Hormonal method",             type: "concept_error", logicTag: "no_hormones_in_copper_t" },
      { text: "Intra-uterine device (IUD)",  type: "correct",       logicTag: "" },
      { text: "Surgical method",             type: "concept_error", logicTag: "surgical_is_vasectomy_tubectomy" },
    ],
    solutionSteps: [
      "Copper-T is a small T-shaped copper device inserted into the uterus by a doctor.",
      "It creates a hostile environment for sperm and prevents implantation — classified as an IUD (intra-uterine device).",
      "It is long-acting (5–10 years) and reversible — can be removed if the person wishes to conceive.",
    ],
    shortcut: "Copper-T = IN the UTERUS = Intra-Uterine Device. Not hormonal (copper, not progesterone).",
  },

  // ══════════════════════════════════════════════════════════════════════
  // sci_ch8_variation — 5 questions (0 → 5)
  // ══════════════════════════════════════════════════════════════════════
  {
    topic: "Heredity", subtopic: "Accumulation of Variation",
    topicId: "sci_ch8_variation",
    subject: "Science", grade: "10", examBoard: "CBSE",
    questionText: "Which type of reproduction produces offspring that are genetically nearly identical to the parent?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Sexual reproduction",   type: "concept_error", logicTag: "sexual_creates_variation" },
      { text: "Asexual reproduction",  type: "correct",       logicTag: "" },
      { text: "Both produce identical offspring",  type: "concept_error", logicTag: "sexual_does_not" },
      { text: "Neither — all offspring are unique", type: "concept_error", logicTag: "asexual_produces_clones" },
    ],
    solutionSteps: [
      "In asexual reproduction (binary fission, budding, vegetative propagation), only ONE parent is involved.",
      "The offspring receive an exact DNA copy — only very rare copying errors (mutations) introduce slight variation.",
      "In sexual reproduction, two parents contribute genetic material, and meiosis + fertilisation create unique gene combinations.",
    ],
    shortcut: "Asexual = one parent → clone (near-identical). Sexual = two parents → unique offspring.",
  },
  {
    topic: "Heredity", subtopic: "Accumulation of Variation",
    topicId: "sci_ch8_variation",
    subject: "Science", grade: "10", examBoard: "CBSE",
    questionText: "Variation is important for the long-term survival of a species mainly because it:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "Ensures all offspring are stronger than parents",              type: "concept_error", logicTag: "variation_not_always_improvement" },
      { text: "Provides raw material for natural selection and adaptation",   type: "correct",       logicTag: "" },
      { text: "Eliminates all harmful traits from the population",           type: "concept_error", logicTag: "harmful_traits_may_persist" },
      { text: "Speeds up reproduction rate of organisms",                    type: "concept_error", logicTag: "variation_unrelated_to_rate" },
    ],
    solutionSteps: [
      "Variation means individuals in a population are not identical.",
      "When the environment changes (new disease, climate shift), some variants may be better adapted to survive.",
      "Those who survive reproduce and pass on their advantageous variant to offspring — this is natural selection.",
      "Without variation, all individuals would respond identically to challenges — potentially wiping out the species.",
    ],
    shortcut: "Variation → some survive any challenge → natural selection → species adapts → survives. No variation = all die together.",
  },
  {
    topic: "Heredity", subtopic: "Accumulation of Variation",
    topicId: "sci_ch8_variation",
    subject: "Science", grade: "10", examBoard: "CBSE",
    questionText: "During sexual reproduction, which cellular process is primarily responsible for generating genetic variation by mixing parental chromosomes?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "Mitosis",        type: "concept_error", logicTag: "mitosis_produces_identical_cells" },
      { text: "Meiosis",        type: "correct",       logicTag: "" },
      { text: "Fertilisation only", type: "concept_error", logicTag: "fertilisation_combines_but_meiosis_shuffles" },
      { text: "DNA replication", type: "concept_error", logicTag: "copying_not_shuffling" },
    ],
    solutionSteps: [
      "Meiosis is the reduction division that produces gametes (eggs and sperm) with half the chromosome number.",
      "During meiosis I, homologous chromosomes exchange segments (crossing over) — creating new combinations of alleles not present in either parent.",
      "Fertilisation then combines two unique gametes, further multiplying the variation.",
    ],
    shortcut: "Meiosis = MIXING machine (crossing over + independent assortment). Mitosis = COPYING machine (identical). Meiosis makes gametes.",
  },
  {
    topic: "Heredity", subtopic: "Accumulation of Variation",
    topicId: "sci_ch8_variation",
    subject: "Science", grade: "10", examBoard: "CBSE",
    questionText: "A population of bacteria treated with an antibiotic shows resistance after several generations. This is best explained by:",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 1, isAIGenerated: true,
    options: [
      { text: "The bacteria learned to tolerate the antibiotic over time",                          type: "concept_error", logicTag: "acquired_not_inherited" },
      { text: "The antibiotic caused mutations in all bacteria simultaneously",                    type: "concept_error", logicTag: "antibiotic_selects_not_causes" },
      { text: "Pre-existing variation included a few resistant individuals who survived and reproduced", type: "correct", logicTag: "" },
      { text: "Bacteria reproduced faster to overcome the antibiotic",                             type: "concept_error", logicTag: "speed_irrelevant" },
    ],
    solutionSteps: [
      "Before any antibiotic was applied, random DNA copying errors had already created slight variation in the bacterial population.",
      "A very small number happened to have a variation conferring resistance.",
      "When antibiotic was applied: non-resistant bacteria died; resistant ones survived → reproduced → passed resistance to offspring.",
      "Over generations the resistant variant became dominant. The antibiotic SELECTED an existing variant — it did not CREATE it.",
    ],
    shortcut: "Antibiotic doesn't cause resistance — it SELECTS pre-existing resistant variants. Selection acts on existing variation.",
  },
  {
    topic: "Heredity", subtopic: "Accumulation of Variation",
    topicId: "sci_ch8_variation",
    subject: "Science", grade: "10", examBoard: "CBSE",
    questionText: "Which of the following is the ORIGINAL source of new genetic variation in a population?",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 1, isAIGenerated: true,
    options: [
      { text: "Natural selection",   type: "concept_error", logicTag: "selection_acts_on_variation_not_creates" },
      { text: "Fertilisation",       type: "concept_error", logicTag: "combines_existing_not_creates_new" },
      { text: "Mutation",            type: "correct",       logicTag: "" },
      { text: "Meiosis",             type: "concept_error", logicTag: "shuffles_existing_variation_not_new" },
    ],
    solutionSteps: [
      "Mutations are changes in the DNA sequence — they are the ultimate source of NEW genetic information.",
      "Meiosis reshuffles existing variants (alleles), and fertilisation combines them — but neither creates truly new alleles.",
      "Natural selection acts on variation but does not produce it.",
      "So: Mutation → new alleles → Meiosis shuffles → Fertilisation combines → Natural selection filters.",
    ],
    shortcut: "MUTATION = NEW variation. Meiosis + fertilisation = SHUFFLE existing variation. Selection = FILTER variation.",
  },

  // ══════════════════════════════════════════════════════════════════════
  // sci_ch12_domestic_circuits — 5 questions (0 → 5)
  // ══════════════════════════════════════════════════════════════════════
  {
    topic: "Magnetic Effects of Electric Current", subtopic: "Domestic Electric Circuits",
    topicId: "sci_ch12_domestic_circuits",
    subject: "Science", grade: "10", examBoard: "CBSE",
    questionText: "In domestic electric circuits, all appliances are connected in:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Series",            type: "concept_error", logicTag: "series_means_one_switch_all" },
      { text: "Parallel",          type: "correct",       logicTag: "" },
      { text: "Series-parallel combination", type: "concept_error", logicTag: "household_is_purely_parallel" },
      { text: "It varies from house to house", type: "concept_error", logicTag: "standard_is_parallel" },
    ],
    solutionSteps: [
      "In a parallel circuit, each appliance is connected directly between the live and neutral wires.",
      "Each appliance gets the full mains voltage (220 V in India).",
      "Switching one appliance off does not affect others — each has its own switch.",
      "In series, if one appliance fails, all fail — impractical for home use.",
    ],
    shortcut: "Parallel = each appliance gets FULL voltage + independent switch. Series = all share voltage = bad for home.",
  },
  {
    topic: "Magnetic Effects of Electric Current", subtopic: "Domestic Electric Circuits",
    topicId: "sci_ch12_domestic_circuits",
    subject: "Science", grade: "10", examBoard: "CBSE",
    questionText: "What is the function of the EARTH wire in a domestic circuit?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "It supplies current to appliances when live wire fails",              type: "concept_error", logicTag: "earth_carries_no_current_normally" },
      { text: "It provides a safe path for current if live wire touches metal body", type: "correct",       logicTag: "" },
      { text: "It regulates voltage to prevent overloading",                         type: "concept_error", logicTag: "fuse_prevents_overloading" },
      { text: "It connects the neutral wire to complete the circuit",                type: "concept_error", logicTag: "neutral_completes_circuit_not_earth" },
    ],
    solutionSteps: [
      "The earth wire (green/yellow insulation) connects the metal bodies of appliances to a metal rod buried in the earth.",
      "Normally it carries NO current.",
      "If insulation fails and live wire touches the metal body → large current flows through earth wire → fuse blows → circuit breaks.",
      "This prevents the user from receiving a fatal electric shock by touching the appliance.",
    ],
    shortcut: "Earth wire = safety net. Normal = no current. Fault = huge current → fuse blows → safe.",
  },
  {
    topic: "Magnetic Effects of Electric Current", subtopic: "Domestic Electric Circuits",
    topicId: "sci_ch12_domestic_circuits",
    subject: "Science", grade: "10", examBoard: "CBSE",
    questionText: "A short circuit occurs in a domestic wiring when:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "Too many appliances are connected to one socket",              type: "concept_error", logicTag: "that_is_overloading" },
      { text: "The live and neutral wires come into direct contact",          type: "correct",       logicTag: "" },
      { text: "The earth wire disconnects from the metal body",               type: "concept_error", logicTag: "earth_failure_not_short_circuit" },
      { text: "Current flows from the neutral wire to the live wire",         type: "concept_error", logicTag: "describes_reversed_flow_not_short" },
    ],
    solutionSteps: [
      "A short circuit happens when live and neutral wires touch (due to damaged insulation, loose wire, or metallic object).",
      "Resistance drops to nearly zero → using Ohm's law I = V/R, if R ≈ 0 then I is extremely large.",
      "The massive current heats wires rapidly → fire hazard. The fuse melts and breaks the circuit.",
      "Overloading is different: it occurs when too many appliances increase current beyond the fuse rating.",
    ],
    shortcut: "Short circuit = wires TOUCH = R→0 = huge I = fuse blows. Overloading = too many appliances = sum of I > fuse rating.",
  },
  {
    topic: "Magnetic Effects of Electric Current", subtopic: "Domestic Electric Circuits",
    topicId: "sci_ch12_domestic_circuits",
    subject: "Science", grade: "10", examBoard: "CBSE",
    questionText: "What is the KEY advantage of a Miniature Circuit Breaker (MCB) over a fuse?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "MCB is cheaper than a fuse",                              type: "concept_error", logicTag: "mcb_is_more_expensive" },
      { text: "MCB can be reset after tripping; fuse must be replaced",  type: "correct",       logicTag: "" },
      { text: "MCB works on higher voltage than a fuse",                 type: "concept_error", logicTag: "both_work_at_same_voltage" },
      { text: "MCB allows more current to flow before it trips",         type: "concept_error", logicTag: "rating_comparison_irrelevant" },
    ],
    solutionSteps: [
      "Fuse: a thin wire of low-melting-point alloy. It melts permanently when overcurrent flows → must be physically replaced.",
      "MCB: uses an electromagnetic mechanism to trip a switch. After the fault is fixed, simply flick the MCB back ON.",
      "MCB is reusable, faster, and more reliable. The major exam advantage to remember: MCB is RESETTABLE.",
    ],
    shortcut: "MCB = Resets. Fuse = Replaces. 'MCB = just flick it back. Fuse = go buy a new one.'",
  },
  {
    topic: "Magnetic Effects of Electric Current", subtopic: "Domestic Electric Circuits",
    topicId: "sci_ch12_domestic_circuits",
    subject: "Science", grade: "10", examBoard: "CBSE",
    questionText: "In domestic wiring, the fuse is always connected in series with which wire?",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 1, isAIGenerated: true,
    options: [
      { text: "Neutral wire",                 type: "concept_error", logicTag: "fuse_in_neutral_leaves_live_on" },
      { text: "Earth wire",                   type: "concept_error", logicTag: "earth_is_safety_not_for_fuse" },
      { text: "Live wire",                    type: "correct",       logicTag: "" },
      { text: "Either live or neutral wire",  type: "concept_error", logicTag: "must_always_be_live" },
    ],
    solutionSteps: [
      "The fuse is ALWAYS in series with the LIVE wire — this is crucial.",
      "If placed in the neutral wire: when the fuse blows, the neutral is broken but the appliance remains at live potential (220V).",
      "This means touching the appliance could still cause a fatal shock even though the fuse has blown.",
      "With fuse in the live wire: when it blows, the circuit is disconnected from the live supply — safe.",
    ],
    shortcut: "Fuse in LIVE wire = appliance safe when fuse blows. Fuse in neutral = appliance still at 220V = dangerous.",
  },

  // ══════════════════════════════════════════════════════════════════════
  // sci_ch1_thermal_decomposition — +4 questions (1 → 5)
  // ══════════════════════════════════════════════════════════════════════
  {
    topic: "Chemical Reactions and Equations", subtopic: "Decomposition Reactions",
    topicId: "sci_ch1_thermal_decomposition",
    subject: "Science", grade: "10", examBoard: "CBSE",
    questionText: "In which type of decomposition reaction is electrical energy used to break down the reactant?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Thermal decomposition",       type: "concept_error", logicTag: "uses_heat_not_electricity" },
      { text: "Photolytic decomposition",    type: "concept_error", logicTag: "uses_light_not_electricity" },
      { text: "Electrolytic decomposition",  type: "correct",       logicTag: "" },
      { text: "Endothermic decomposition",   type: "concept_error", logicTag: "endothermic_is_a_property_not_type" },
    ],
    solutionSteps: [
      "Electrolytic decomposition uses electrical energy to break chemical bonds.",
      "Example: 2H₂O →(electricity)→ 2H₂ + O₂ (water splits into hydrogen and oxygen gas).",
      "Thermal uses heat (e.g. CaCO₃ → CaO + CO₂); photolytic uses light (e.g. 2AgCl → 2Ag + Cl₂).",
    ],
    shortcut: "Electrolytic = ELECTRIC. Thermal = HEAT. Photolytic = LIGHT (photo = light, like photography).",
  },
  {
    topic: "Chemical Reactions and Equations", subtopic: "Decomposition Reactions",
    topicId: "sci_ch1_thermal_decomposition",
    subject: "Science", grade: "10", examBoard: "CBSE",
    questionText: "The reaction 2AgCl → 2Ag + Cl₂ occurs in sunlight. This is an example of:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Thermal decomposition",       type: "concept_error", logicTag: "no_heat_used" },
      { text: "Electrolytic decomposition",  type: "concept_error", logicTag: "no_electricity_used" },
      { text: "Photolytic decomposition",    type: "correct",       logicTag: "" },
      { text: "Combination reaction",        type: "concept_error", logicTag: "two_products_not_combination" },
    ],
    solutionSteps: [
      "The reaction uses sunlight (light energy) to break down silver chloride → silver + chlorine.",
      "This is the basis of traditional black-and-white photography: AgCl on film darkens in light as Ag metal forms.",
      "Photo = light → photolytic = broken down by light.",
    ],
    shortcut: "AgCl + sunlight → Ag (black) + Cl₂. Used in photography. Photo = light = photolytic.",
  },
  {
    topic: "Chemical Reactions and Equations", subtopic: "Decomposition Reactions",
    topicId: "sci_ch1_thermal_decomposition",
    subject: "Science", grade: "10", examBoard: "CBSE",
    questionText: "CaCO₃(s) →(heat)→ CaO(s) + CO₂(g). This reaction is used industrially to produce quicklime. What type of reaction is this?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "Combination reaction",       type: "concept_error", logicTag: "combination_makes_one_product" },
      { text: "Displacement reaction",      type: "concept_error", logicTag: "no_element_displacing" },
      { text: "Thermal decomposition",      type: "correct",       logicTag: "" },
      { text: "Photolytic decomposition",   type: "concept_error", logicTag: "uses_heat_not_light" },
    ],
    solutionSteps: [
      "CaCO₃ breaks down into two simpler substances when heated → decomposition reaction.",
      "The energy source is heat (indicated by the Δ or 'heat' arrow) → thermal decomposition.",
      "CaO (quicklime/calcium oxide) is used in cement, glass manufacturing, and water treatment.",
    ],
    shortcut: "One compound → two products + heat used = thermal decomposition. CaCO₃ → CaO + CO₂ is the classic example.",
  },
  {
    topic: "Chemical Reactions and Equations", subtopic: "Decomposition Reactions",
    topicId: "sci_ch1_thermal_decomposition",
    subject: "Science", grade: "10", examBoard: "CBSE",
    questionText: "All decomposition reactions are endothermic. Which statement correctly explains why?",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 1, isAIGenerated: true,
    options: [
      { text: "Because the products are always gases which absorb heat",                         type: "concept_error", logicTag: "products_state_irrelevant" },
      { text: "Because breaking chemical bonds requires energy to be supplied to the system",    type: "correct",       logicTag: "" },
      { text: "Because decomposition always releases carbon dioxide which absorbs energy",       type: "concept_error", logicTag: "CO2_not_always_produced" },
      { text: "Because the reaction produces fewer atoms than the reactant",                     type: "concept_error", logicTag: "atom_count_conserved" },
    ],
    solutionSteps: [
      "In a decomposition reaction, the single reactant breaks into two or more products.",
      "This breaking of chemical bonds requires energy input (energy must be absorbed from the surroundings).",
      "Endothermic = energy absorbed from surroundings → the system gains energy. This contrasts with combination reactions which are typically exothermic.",
    ],
    shortcut: "Decomposition = BREAKING bonds = needs energy = ENDOTHERMIC (endo = energy goes IN). Combination = FORMING bonds = releases energy = exothermic.",
  },

  // ══════════════════════════════════════════════════════════════════════
  // sci_ch5_transport_plants — +4 questions (1 → 5)
  // ══════════════════════════════════════════════════════════════════════
  {
    topic: "Life Processes", subtopic: "Transport in Plants",
    topicId: "sci_ch5_transport_plants",
    subject: "Science", grade: "10", examBoard: "CBSE",
    questionText: "Which vascular tissue in plants is responsible for transporting water and dissolved minerals from roots to leaves?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Phloem",    type: "concept_error", logicTag: "phloem_transports_food" },
      { text: "Xylem",     type: "correct",       logicTag: "" },
      { text: "Cortex",    type: "concept_error", logicTag: "cortex_is_storage_not_transport" },
      { text: "Epidermis", type: "concept_error", logicTag: "epidermis_is_outer_covering" },
    ],
    solutionSteps: [
      "Xylem consists of dead, hollow cells (vessel elements and tracheids) that form continuous tubes from root to leaf.",
      "Water and minerals move upward through xylem by transpiration pull — one-directional (root to leaf).",
      "Phloem transports organic solutes (sugars) manufactured in leaves to other parts of the plant — bidirectional.",
    ],
    shortcut: "Xylem = water/minerals = UPWARD only (one way). Phloem = food/sugars = both ways. XY = eXit water Yearningly upward.",
  },
  {
    topic: "Life Processes", subtopic: "Transport in Plants",
    topicId: "sci_ch5_transport_plants",
    subject: "Science", grade: "10", examBoard: "CBSE",
    questionText: "The upward movement of water in xylem from roots to leaves is driven mainly by:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "Root pressure only",          type: "concept_error", logicTag: "root_pressure_alone_insufficient_for_tall_trees" },
      { text: "Osmosis in root cells only",  type: "concept_error", logicTag: "osmosis_is_entry_not_upward_flow" },
      { text: "Transpiration pull (suction force created by evaporation from leaves)", type: "correct", logicTag: "" },
      { text: "Active pumping by xylem cells",  type: "concept_error", logicTag: "xylem_is_dead_no_active_transport" },
    ],
    solutionSteps: [
      "Water evaporates from leaf cells through stomata (transpiration) → leaf cells lose water → create suction.",
      "This suction (transpiration pull) pulls water upward through xylem as a continuous column.",
      "Water molecules stick together (cohesion) and to xylem walls (adhesion) — allowing the pull to be transmitted from leaves all the way down to roots.",
      "Root pressure contributes but is not sufficient alone to raise water to the tops of tall trees.",
    ],
    shortcut: "Leaves evaporate water → create suction → pull water UP through xylem = Transpiration Pull. Xylem = dead tubes = no pumping.",
  },
  {
    topic: "Life Processes", subtopic: "Transport in Plants",
    topicId: "sci_ch5_transport_plants",
    subject: "Science", grade: "10", examBoard: "CBSE",
    questionText: "Phloem transports food (sucrose) from leaves to other parts of the plant. This transport is described as:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "Unidirectional — only from leaves to roots",      type: "concept_error", logicTag: "phloem_can_go_up_and_down" },
      { text: "Unidirectional — only from roots to leaves",      type: "concept_error", logicTag: "that_is_xylem" },
      { text: "Bidirectional — from leaves to any part needing food (source to sink)", type: "correct", logicTag: "" },
      { text: "Dependent on transpiration pull like xylem",      type: "concept_error", logicTag: "phloem_uses_pressure_flow_not_transpiration" },
    ],
    solutionSteps: [
      "Phloem transports organic solutes (mainly sucrose) from 'sources' (leaves where food is made) to 'sinks' (growing roots, developing fruits, seeds).",
      "Sinks can be above or below the leaves — so transport is bidirectional.",
      "The mechanism is pressure-flow hypothesis: high sugar concentration at source creates osmotic pressure → pushes sap toward sink.",
    ],
    shortcut: "Phloem = food from source (leaf) to sink (root OR fruit OR growing tip) = BOTH directions. Xylem = water = one direction UP.",
  },
  {
    topic: "Life Processes", subtopic: "Transport in Plants",
    topicId: "sci_ch5_transport_plants",
    subject: "Science", grade: "10", examBoard: "CBSE",
    questionText: "Which of the following correctly distinguishes xylem from phloem?",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 1, isAIGenerated: true,
    options: [
      { text: "Xylem transports sugars; phloem transports water",                              type: "concept_error", logicTag: "reversed" },
      { text: "Both xylem and phloem transport water and minerals",                            type: "concept_error", logicTag: "phloem_does_not_transport_water" },
      { text: "Xylem is composed of dead cells; phloem contains living sieve tube cells",      type: "correct",       logicTag: "" },
      { text: "Xylem transport is bidirectional; phloem transport is unidirectional",          type: "concept_error", logicTag: "reversed_direction_facts" },
    ],
    solutionSteps: [
      "Xylem: vessel elements and tracheids are dead at maturity — their cell walls form the water-conducting tubes. No living cytoplasm.",
      "Phloem: sieve tube cells are alive (living cytoplasm, no nucleus at maturity) with companion cells controlling loading/unloading.",
      "Xylem = unidirectional (upward, root→leaf). Phloem = bidirectional (source→sink, any direction).",
      "Xylem = water + minerals. Phloem = organic solutes (sucrose, amino acids).",
    ],
    shortcut: "Xylem = DEAD tubes = water up. Phloem = LIVING sieve tubes = food both ways. Dead vs alive is the key structural difference.",
  },
];

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  let inserted = 0;
  let skipped  = 0;

  for (const q of QUESTIONS) {
    const exists = await Question.findOne({ questionText: q.questionText, subject: q.subject }).lean();
    if (exists) { skipped++; continue; }
    await Question.create(q);
    inserted++;
    console.log(`  ✓ [${q.topicId}] ${q.questionText.slice(0, 60)}…`);
  }

  console.log(`\nMissing-topic questions seeded: ${inserted} inserted, ${skipped} skipped (duplicates).`);
  await mongoose.disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
