// One-time script to add topicId fields to Chemistry and Physics question seed files
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const CHEM_MAP = {
  "Signs of Chemical Reactions": "sci_ch1_signs_and_types",
  "Balancing Chemical Equations": "sci_ch1_balancing_equations",
  "Types of Chemical Reactions": "sci_ch1_signs_and_types",
  "State Symbols": "sci_ch1_balancing_equations",
  "Exothermic and Endothermic Reactions": "sci_ch1_signs_and_types",
  "Oxidation and Reduction": "sci_ch1_oxidation_reduction",
  "Corrosion and Rancidity": "sci_ch1_oxidation_reduction",
  "Photolytic Decomposition": "sci_ch1_thermal_decomposition",
  "Corrosion": "sci_ch1_oxidation_reduction",
  "Indicators": "sci_ch2_acids_bases_indicators",
  "pH Scale": "sci_ch2_ph_scale",
  "Acids and Bases": "sci_ch2_acids_bases_indicators",
  "Neutralisation": "sci_ch2_acids_reactions",
  "Important Salts": "sci_ch2_salts",
  "Chlor-alkali Process": "sci_ch2_salts",
  "Reactions of Acids": "sci_ch2_acids_reactions",
  "Hard Water": "sci_ch2_salts",
  "Reactions of Bases": "sci_ch2_acids_reactions",
  "pH and Everyday Life": "sci_ch2_ph_scale",
  "Bleaching Powder": "sci_ch2_salts",
  "Washing Soda and Baking Soda": "sci_ch2_salts",
  "Olfactory Indicators": "sci_ch2_acids_bases_indicators",
  "Physical Properties": "sci_ch3_physical_properties",
  "Reactivity Series": "sci_ch3_reactivity_series",
  "Ionic Compounds": "sci_ch3_ionic_bonding",
  "Extraction of Metals": "sci_ch3_extraction_metallurgy",
  "Alloys": "sci_ch3_extraction_metallurgy",
  "Ionic Bonding": "sci_ch3_ionic_bonding",
  "Corrosion Prevention": "sci_ch3_extraction_metallurgy",
  "Electrolytic Refining": "sci_ch3_extraction_metallurgy",
  "Homologous Series": "sci_ch4_homologous_series",
  "Functional Groups": "sci_ch4_homologous_series",
  "Combustion": "sci_ch4_carbon_reactions",
  "Covalent Bonding": "sci_ch4_covalent_bonding",
  "Esterification": "sci_ch4_ethanol_and_ethanoic_acid",
  "Bromine Water Test": "sci_ch4_carbon_reactions",
  "Soaps and Detergents": "sci_ch4_ethanol_and_ethanoic_acid",
  "Ethanol and Ethanoic Acid": "sci_ch4_ethanol_and_ethanoic_acid",
  "IUPAC Naming": "sci_ch4_homologous_series",
  "Addition and Substitution Reactions": "sci_ch4_carbon_reactions",
  "Covalent Bonding and Allotropes": "sci_ch4_covalent_bonding",
};

const PHYS_MAP = {
  "Reflection — Mirrors": "sci_ch9_reflection_mirrors",
  "Reflection — Sign Convention": "sci_ch9_reflection_mirrors",
  "Refraction — Basic Concepts": "sci_ch9_refraction_snells_law",
  "Lenses — Basic Concepts": "sci_ch9_lenses",
  "Reflection — Mirror Applications": "sci_ch9_reflection_mirrors",
  "Lenses — Power": "sci_ch9_lenses",
  "Mirror Formula — Numerical": "sci_ch9_mirror_formula",
  "Refraction — Snell's Law Numerical": "sci_ch9_refraction_snells_law",
  "Refraction — Apparent Depth Numerical": "sci_ch9_refraction_snells_law",
  "Lenses — Lens Formula Numerical": "sci_ch9_lenses",
  "Lenses — Combined Power": "sci_ch9_lenses",
  "Mirror Formula — Convex Mirror Numerical": "sci_ch9_mirror_formula",
  "Refraction — Refractive Index": "sci_ch9_refraction_snells_law",
  "Mirror Formula — Hard Numerical": "sci_ch9_mirror_formula",
  "Refraction — Total Internal Reflection": "sci_ch9_refraction_snells_law",
  "Lenses — Hard Numerical": "sci_ch9_lenses",
  "Lenses — Magnification Sign Convention": "sci_ch9_lenses",
  "Eye Structure": "sci_ch10_human_eye",
  "Dispersion": "sci_ch10_dispersion_scattering",
  "Scattering of Light": "sci_ch10_dispersion_scattering",
  "Accommodation of the Eye": "sci_ch10_human_eye",
  "Defects of Vision — Myopia Power Calculation": "sci_ch10_eye_defects",
  "Defects of Vision — Hypermetropia Power Calculation": "sci_ch10_eye_defects",
  "Dispersion and Scattering": "sci_ch10_dispersion_scattering",
  "VIBGYOR and Prism": "sci_ch10_dispersion_scattering",
  "Defects of Vision — Presbyopia and Astigmatism": "sci_ch10_eye_defects",
  "Scattering — Rayleigh's Law Application": "sci_ch10_dispersion_scattering",
  "Dispersion — Combined Concept": "sci_ch10_dispersion_scattering",
  "Electric Current": "sci_ch11_current_potential",
  "Potential Difference": "sci_ch11_current_potential",
  "Resistivity": "sci_ch11_ohms_law_resistance",
  "Ammeter and Voltmeter": "sci_ch11_current_potential",
  "Household Wiring": "sci_ch11_power_heating",
  "Ohm's Law — Numerical": "sci_ch11_ohms_law_resistance",
  "Resistivity — Numerical": "sci_ch11_ohms_law_resistance",
  "Series-Parallel Combination — Numerical": "sci_ch11_series_parallel",
  "Power Dissipation — Numerical": "sci_ch11_power_heating",
  "Joule's Law — Numerical": "sci_ch11_power_heating",
  "Electricity Bill Calculation": "sci_ch11_power_heating",
  "Fuse Rating": "sci_ch11_power_heating",
  "Series vs Parallel Power Comparison": "sci_ch11_series_parallel",
  "Complex Circuit — Kirchhoff-style": "sci_ch11_series_parallel",
  "Ohm's Law + Resistivity — Multi-step": "sci_ch11_ohms_law_resistance",
  "Power in Series Circuit": "sci_ch11_series_parallel",
  "MCB vs Fuse — Conceptual Hard": "sci_ch11_power_heating",
  "V-I Graph Interpretation": "sci_ch11_ohms_law_resistance",
  "Oersted's Experiment": "sci_ch12_magnetic_field",
  "Magnetic Field — Right-Hand Thumb Rule": "sci_ch12_magnetic_field",
  "Electric Motor": "sci_ch12_electric_motor",
  "Domestic Wiring": "sci_ch11_power_heating",
  "Fleming's Left-Hand Rule — Application": "sci_ch12_force_on_conductor",
  "Solenoid and Electromagnet": "sci_ch12_magnetic_field",
  "AC Generator": "sci_ch12_electromagnetic_induction",
  "Electromagnetic Induction — Faraday's Law": "sci_ch12_electromagnetic_induction",
  "Motor vs Generator Comparison": "sci_ch12_electric_motor",
  "Force on Conductor — Numerical": "sci_ch12_force_on_conductor",
  "Electromagnetic Induction — Motional EMF": "sci_ch12_electromagnetic_induction",
  "Electromagnetic Induction — Conceptual Hard": "sci_ch12_electromagnetic_induction",
};

function addTopicIds(filename, map) {
  const filepath = join(__dirname, filename);
  let content = readFileSync(filepath, "utf8");
  let count = 0;
  let unmapped = [];

  content = content.replace(/( +)subtopic: "([^"]+)",(\n)(?!\s+topicId:)/g, (match, indent, sub, nl) => {
    const tid = map[sub];
    if (!tid) { unmapped.push(sub); return match; }
    count++;
    return `${indent}subtopic: "${sub}",${nl}${indent}topicId: "${tid}",${nl}`;
  });

  writeFileSync(filepath, content, "utf8");
  const verify = (content.match(/topicId: "sci_/g) || []).length;
  console.log(`${filename}: ${count} topicIds added, ${verify} total in file`);
  if (unmapped.length) console.warn(`  UNMAPPED: ${[...new Set(unmapped)].join(", ")}`);
}

addTopicIds("seedScienceChemistryQuestions.js", CHEM_MAP);
addTopicIds("seedSciencePhysicsQuestions.js", PHYS_MAP);
console.log("Done.");
