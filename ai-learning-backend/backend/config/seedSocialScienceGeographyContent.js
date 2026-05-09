import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const TOPICS = [

  // ── Chapter 6: Resources and Development ──────────────────────────────────

  {
    topicId: "sst_ch6_resources_types",
    subject: "Social Science",
    chapterNumber: 6,
    name: "Types of Resources — Classification and Conservation",
    prerequisite_knowledge: ["What is a resource", "Difference between renewable and non-renewable", "Concept of sustainable development"],
    key_formulas: [
      "Resource = anything with utility that satisfies human needs",
      "Biotic: living resources (forests, fisheries, animals)",
      "Abiotic: non-living resources (minerals, water, land)",
      "Renewable: replenish naturally (solar, wind, water, forests)",
      "Non-renewable: finite stock (coal, petroleum, minerals)",
      "Potential vs Actual resources; Individual vs Community vs National vs International",
    ],
    teaching_content: {
      intuition:
        "Everything around you — sunlight, coal, a river, forest, land — is a resource if humans can use it. But the key insight is that resources are not just 'things that exist' — they become resources only when we have the technology and knowledge to use them. Uranium was useless until we understood nuclear energy. The challenge of the 21st century is learning to use resources sustainably — extracting what we need without destroying what future generations need.",
      process_explanation:
        "1. CLASSIFICATION BY ORIGIN: Biotic (living: forests, fish) vs Abiotic (non-living: water, minerals).\n2. BY EXHAUSTIBILITY: Renewable (solar, wind, water, forests — replenish naturally) vs Non-renewable (coal, oil, minerals — finite, formed over millions of years).\n3. BY OWNERSHIP:\n- Individual resources: owned by private persons (farm, house).\n- Community resources: accessible to all community members (village grazing land, parks).\n- National resources: owned by the nation-state (minerals, rivers, forests within territory).\n- International resources: shared beyond national boundaries (ocean beyond 200 nautical miles, Antarctica).\n4. BY STATUS OF DEVELOPMENT:\n- Potential resources: known, not yet exploited (Rajasthan's solar energy, Ladakh's wind energy).\n- Developed resources: surveyed, in use (coal in Jharkhand).\n- Stock: known but technology unavailable (hydrogen as fuel).\n- Reserves: usable with existing technology, conserved for future (forest reserves).\n5. RESOURCE CONSERVATION: Resources are finite. Sustainable use = present needs met without compromising future generations (Brundtland Commission 1987).",
      worked_example:
        "Question: Classify the following as renewable or non-renewable and explain: (a) sunlight, (b) iron ore, (c) groundwater.\nAnswer:\n(a) Sunlight: Renewable — it is continuously replenished by the sun and will not be exhausted by human use.\n(b) Iron ore: Non-renewable — it is a mineral formed over millions of years by geological processes. Once mined and used, it cannot be replaced.\n(c) Groundwater: This is tricky — technically renewable (replenished by rain and percolation) but in practice non-renewable if extracted faster than it recharges. Over-extraction depletes aquifers irreversibly on human timescales.",
      common_misconceptions: [
        "Water is renewable but not inexhaustible — over-exploitation, pollution, and climate change are making freshwater scarce.",
        "Forests are renewable only if managed sustainably — clear-cutting old-growth forest takes centuries to recover.",
        "Resources are not fixed — technology changes what counts as a resource. Wind was not a 'resource' before wind turbines.",
      ],
      shortcuts_and_tricks: [
        "Classification grid: Origin (biotic/abiotic) × Exhaustibility (renewable/non-renewable) × Ownership (individual/community/national/international) × Development status (potential/developed/stock/reserve).",
        "Potential resource example from CBSE: Rajasthan has solar potential but lacks full exploitation.",
        "Sustainable development: Brundtland 1987. Meet present needs without compromising future.",
      ],
      diagram_description: "Classification tree: Resource → By Origin (biotic/abiotic) → By Exhaustibility (renewable/non-renewable) → By Ownership (4 types) → By Development Status (potential/developed/stock/reserve).",
      key_takeaway: "Resources are classified by origin (biotic/abiotic), exhaustibility (renewable/non-renewable), ownership (individual/community/national/international), and development status (potential/actual/stock/reserve). Sustainable use is essential because non-renewable resources are finite.",
    },
  },

  {
    topicId: "sst_ch6_land_resources",
    subject: "Social Science",
    chapterNumber: 6,
    name: "Land Resources — Land Use Pattern and Degradation",
    prerequisite_knowledge: ["What is land use", "India's agro-climatic diversity", "Importance of forests"],
    key_formulas: [
      "Total geographical area of India: 3.28 million sq km",
      "Net sown area: ~46% of total geographical area",
      "Fallow land: cultivable land not sown in a given year",
      "Land degradation: loss of land productivity due to erosion, salinity, waterlogging",
      "Jhoom cultivation: shifting cultivation in northeast India — causes deforestation",
    ],
    teaching_content: {
      intuition:
        "Land is the most fundamental resource — it is where we grow food, build cities, extract minerals, and maintain forests. India has 3.28 million sq km of land, but not all of it is equally productive or usable. The way we use land (what percentage for farming, forests, settlements) reflects both our economic needs and our conservation choices. The growing problem of land degradation — caused by overuse, erosion, salinity, and waterlogging — threatens India's future food security.",
      process_explanation:
        "1. INDIA'S LAND USE CATEGORIES (9 categories):\n- Forests (23%)\n- Land under non-agricultural uses: buildings, roads, industries\n- Barren/wastelands: rocky, arid, impossible to cultivate\n- Permanent pastures and grazing lands\n- Land under tree crops/groves (coconut, mango, rubber orchards)\n- Culturable waste: can be cultivated but currently unused\n- Fallow land: cultivable, not sown this season (allows soil recovery)\n- Net sown area: actually cultivated (~46%)\n- Gross cropped area: NSA + double-cropped areas\n2. LAND DEGRADATION CAUSES:\n- Water erosion: rivers, rain wash away topsoil (common in hills)\n- Wind erosion: in arid/semi-arid regions (Rajasthan)\n- Gully erosion: ravines in Chambal, Madhya Pradesh\n- Waterlogging: excess irrigation without drainage (Punjab, Haryana)\n- Soil salinity: evaporation leaves salt crust (in waterlogged areas)\n- Mining and quarrying: open-cast mining destroys land surface\n- Overgrazing: common pastures degraded in Rajasthan, Gujarat\n- Deforestation: jhoom (shifting) cultivation in northeast\n3. CONSERVATION MEASURES: Afforestation, strip farming, shelter belts, gully plugging, check dams, crop rotation.",
      worked_example:
        "Question: Explain how overuse of groundwater for irrigation leads to land degradation.\nAnswer: Over-irrigation with groundwater, especially in canal-irrigated areas of Punjab, Haryana, and western UP, causes waterlogging — the water table rises, saturating the root zone and killing crops. As this standing water evaporates, it deposits salts on the surface (salinisation), making the soil infertile. This is called 'wet desert' formation. By the 1990s, millions of hectares in Punjab had been degraded by this process. The solution requires better irrigation management (drip irrigation), drainage canals, and shifting to less water-intensive crops.",
      common_misconceptions: [
        "Net sown area ≠ total cultivated area — the same land can be sown twice (double-cropped), giving a higher 'gross cropped area'.",
        "Fallow land is not 'wasted' land — it is resting land that allows soil nutrients to recover. Permanent fallow (never cultivated) is different from rotational fallow.",
        "Land degradation is not only in arid regions — overuse of irrigation causes degradation in fertile agricultural zones like Punjab.",
      ],
      shortcuts_and_tricks: [
        "9 land-use categories: remember with 'FBBLCTFN' — Forests, Barren, Buildings, Land under tree crops, Culturable waste, Tillage (fallow), Net sown, (Permanent pastures).",
        "India: 3.28 million sq km total area. ~23% forest (less than the 33% target). ~46% net sown.",
        "Degradation causes by region: Punjab/Haryana = waterlogging/salinity. Rajasthan = wind erosion. Chambal = gully erosion. Northeast = jhoom.",
      ],
      diagram_description: "Pie chart of India's land use (9 categories). Secondary diagram: land degradation flowchart — over-irrigation → waterlogging → evaporation → salinity → infertile soil ('wet desert').",
      key_takeaway: "India uses about 46% of its land as net sown area, with 23% forest cover (below the 33% target). Land degradation through waterlogging, salinity, erosion, and overgrazing threatens agricultural productivity, requiring conservation measures like afforestation, check dams, and crop rotation.",
    },
  },

  {
    topicId: "sst_ch6_soil_resources",
    subject: "Social Science",
    chapterNumber: 6,
    name: "Soil Resources — Types, Distribution, and Erosion",
    prerequisite_knowledge: ["What is soil formation", "India's climatic zones", "Basic mineralogy"],
    key_formulas: [
      "Alluvial soil: Indo-Gangetic plains, riverine areas — most fertile, largest area (~43%)",
      "Black soil (Regur): Deccan Plateau — cotton, moisture-retentive",
      "Red and Yellow soil: Deccan plateau periphery, Eastern India — iron-rich but less fertile",
      "Laterite soil: heavy rainfall areas (Kerala, Karnataka hills, Assam) — leached, acidic",
      "Arid soil: Rajasthan — sandy, low moisture, low organic matter",
      "Forest soil: hilly/mountainous areas — humus-rich but thin",
    ],
    teaching_content: {
      intuition:
        "Soil is the foundation of all agriculture — without it, there is no food. India's diverse geography has produced remarkably different soils: fertile alluvial plains of the Ganga, moisture-retaining black cotton soil of the Deccan, leached laterite of the Western Ghats. Understanding which crop grows in which soil is not just geography — it explains why Punjab is a wheat bowl, Maharashtra grows cotton, and Kerala produces coconut and tea.",
      process_explanation:
        "1. ALLUVIAL SOIL (~43% of India's area):\n- Found: Indo-Gangetic Plain, river deltas (Krishna, Godavari, Mahanadi, Cauvery)\n- Types: Khadar (new alluvial, porous, riverbanks) vs Bangar (old alluvial, upland areas, more kankar/pebbles)\n- Ideal for: wheat, rice, sugarcane, cotton (most fertile soil)\n2. BLACK SOIL (Regur, ~15%):\n- Found: Deccan Plateau (Maharashtra, Gujarat, MP, AP)\n- Properties: high clay content, moisture-retentive, swells when wet (cracks when dry — self-ploughing)\n- Ideal for: cotton (called 'black gold' in context of this soil)\n3. RED AND YELLOW SOIL:\n- Found: Deccan plateau (less rainfall areas), Orissa, Chhattisgarh, parts of MP\n- Properties: red due to iron oxide, yellow when hydrated. Less fertile than alluvial.\n- Ideal for: millet, pulses, oilseeds\n4. LATERITE SOIL:\n- Found: Kerala, Karnataka hills, northeast India, Assam hills\n- Properties: formed by intense leaching in heavy rainfall — silica washed away, iron/aluminium remain. Acidic, low organic matter.\n- Use: with fertilisers can grow cashew, tea, coffee. Used as building material (laterite blocks)\n5. ARID (DESERT) SOIL:\n- Found: Rajasthan, Punjab/Haryana dryland areas\n- Properties: sandy, low moisture, low organic content, saline. High windblown silts.\n- With irrigation: can grow cotton, wheat (Punjab irrigated)\n6. FOREST/MOUNTAIN SOIL:\n- Found: Himalayan and hill regions\n- Properties: immature, loamy/silty. Lower valleys: rich humus. Upper slopes: thin, acidic.\n- Tea, coffee, spices grown in lower hill regions.",
      worked_example:
        "Question: Why is alluvial soil the most important agricultural soil in India?\nAnswer: Alluvial soil covers ~43% of India's area, mostly in the Indo-Gangetic Plain and river deltas. It is the most important because:\n1. Fertility: formed by river-deposited sediments rich in phosphoric acid, potash, lime, and organic matter.\n2. Location: in the most densely populated, well-irrigated regions with good transport connectivity.\n3. Crop diversity: supports wheat, rice, sugarcane, cotton, vegetables, fruits — the widest range of any soil type.\n4. Easy cultivation: deep, fine texture, easily tillable.\nThe Indo-Gangetic Plain, underlain by alluvial soil, produces over 50% of India's food grain output.",
      common_misconceptions: [
        "Black soil does NOT need frequent irrigation — it retains moisture well due to high clay content. Crack formation when dry is actually a 'self-ploughing' advantage.",
        "Laterite soil is NOT infertile everywhere — with fertilisers and proper management, it supports tea (Assam, Darjeeling), coffee, and cashew.",
        "Red colour of red soil is NOT due to organic matter — it is due to diffusion of iron throughout the soil.",
      ],
      shortcuts_and_tricks: [
        "ALRLFM mnemonic for 6 soil types: Alluvial, Laterite, Red-Yellow, Laterite, Forest, Mountain, Arid (ALRBFA).",
        "Crop-soil associations: alluvial=wheat/rice, black=cotton, laterite=tea/coffee/cashew, red=millets/pulses.",
        "Black soil's key property: moisture-retentive (swells when wet, cracks when dry = self-ploughing).",
      ],
      diagram_description: "India map showing soil distribution: alluvial (Indo-Gangetic plain, deltas), black (Deccan plateau), red-yellow (peninsular India), laterite (Western Ghats, northeast), arid (Rajasthan), forest (Himalayas). Inset table: soil type → key property → main crops.",
      key_takeaway: "India has 6 major soil types: alluvial (most fertile, ~43% area, Indo-Gangetic), black (cotton, Deccan), red-yellow (millets, peninsular India), laterite (tea/coffee, leached), arid (desert, Rajasthan), and forest soil. Soil conservation is essential as soil erosion threatens agricultural productivity.",
    },
  },

  // ── Chapter 7: Forest and Wildlife Resources ──────────────────────────────

  {
    topicId: "sst_ch7_forest_types",
    subject: "Social Science",
    chapterNumber: 7,
    name: "Forest Types and Distribution in India",
    prerequisite_knowledge: ["What is a biome", "India's climate zones", "Concept of biodiversity"],
    key_formulas: [
      "India's forest cover: ~23% of geographical area (target: 33%)",
      "Tropical Evergreen: >200cm rainfall, no dry season (Western Ghats, NE India)",
      "Tropical Deciduous: 70-200cm rainfall, shed leaves in dry season — most widespread",
      "Tropical Thorn: <70cm rainfall (Rajasthan, semi-arid areas)",
      "Montane: altitude-based zones (sub-tropical → temperate → alpine → tundra)",
      "Mangrove: coastal tidal forests (Sunderbans — world's largest mangrove)",
    ],
    teaching_content: {
      intuition:
        "India has an extraordinary diversity of forest types — from the dense rainforests of the Western Ghats (where a single hectare can contain more tree species than all of temperate North America) to the sparse thorn scrub of Rajasthan. This diversity reflects India's diverse climate — rainfall, temperature, and altitude all determine what grows where. Forests are not just trees — they are complex ecosystems that regulate water cycles, prevent erosion, support biodiversity, and absorb carbon dioxide.",
      process_explanation:
        "1. TROPICAL EVERGREEN FORESTS:\n- Location: Western Ghats, Andaman & Nicobar Islands, northeast India\n- Rainfall: >200cm, well-distributed year-round\n- Features: dense, multi-layered canopy; trees do not shed leaves simultaneously\n- Species: mahogany, ebony, rosewood, rubber, cinchona\n2. TROPICAL DECIDUOUS FORESTS (Monsoon Forests):\n- Most widespread in India\n- Sub-types: Moist deciduous (100-200cm): teak, sal, bamboo; Dry deciduous (70-100cm): teak, sandalwood, khair\n- Location: Madhya Pradesh, Maharashtra, UP plains, foothills\n3. TROPICAL THORN FORESTS:\n- Location: Rajasthan, semi-arid Peninsular India\n- Rainfall: <70cm\n- Features: spiny trees, deep roots, sparse canopy\n- Species: acacia, euphorbias, cactus\n4. MONTANE FORESTS:\n- Wet temperate: 1000-2000m altitude (oaks, chestnuts)\n- Temperate: 1500-3000m (conifers: pine, deodar, silver fir, spruce)\n- Alpine: above 3600m (juniper, rhododendron; stunted trees)\n- Tundra: above snowline\n5. MANGROVE FORESTS:\n- Location: tidal coastal areas — Sunderbans (WB+Bangladesh, largest mangrove), Andaman, Gujarat coast\n- Adapt to: saltwater, tidal flooding, anaerobic soil\n- Function: coastal protection, fish nurseries, carbon storage",
      worked_example:
        "Question: Why does India have such diverse forest types in a relatively compact geographical area?\nAnswer: India spans 8°N to 37°N latitude (tropical to sub-temperate) and ranges from sea level to 8,000m+ altitude (Mt. Everest area). This creates an extraordinary range of:\n1. Rainfall: from <100mm in Rajasthan to >11,000mm in Cherrapunji — determining thorn forests to evergreen rainforests.\n2. Temperature: from near-freezing in Himalayas to 40°C+ in Rajasthan — alpine tundra to tropical deciduous.\n3. Altitude: Montane zonation creates multiple forest types on a single mountain slope.\nResult: India has 12+ forest types and is one of 17 'megadiverse' countries — containing 7-8% of all species despite being only 2.4% of world's land area.",
      common_misconceptions: [
        "Deciduous forests are not 'less valuable' than evergreen — they support more biodiversity in many ways because the seasonal leaf fall creates diverse habitats.",
        "Mangroves are not a minor curiosity — they protect coastal communities from tsunamis and cyclones, sequester carbon, and support fisheries that millions depend on.",
        "India's 23% forest cover includes degraded and plantation forests — actual quality old-growth forest is much less.",
      ],
      shortcuts_and_tricks: [
        "Rainfall determines forest type: >200cm = evergreen; 70-200cm = deciduous; <70cm = thorn. Simple rainfall gradient.",
        "Teak = deciduous (MP, Maharashtra). Sal = deciduous (UP, NE). Deodar/Pine = montane conifer.",
        "Sunderbans = world's largest mangrove. Located in West Bengal + Bangladesh delta (Ganga-Brahmaputra).",
      ],
      diagram_description: "India map with forest type zones: northeast + Western Ghats (evergreen) → peninsular India (deciduous) → Rajasthan (thorn) → Himalayas (montane) → coastal areas (mangrove). Inset: altitude zonation of Himalayan forests from subtropical to alpine tundra.",
      key_takeaway: "India has diverse forest types determined primarily by rainfall and altitude: tropical evergreen (>200cm rain, Western Ghats/NE), deciduous (70-200cm, most widespread), thorn (<70cm, Rajasthan), montane (altitude-zoned Himalayas), and mangrove (coastal tidal). India covers 23% forest but targets 33%.",
    },
  },

  {
    topicId: "sst_ch7_wildlife_conservation",
    subject: "Social Science",
    chapterNumber: 7,
    name: "Wildlife Conservation — Protected Areas and Community Efforts",
    prerequisite_knowledge: ["What is biodiversity", "Concept of an ecosystem", "Endangered species vs extinct species"],
    key_formulas: [
      "Protected Area categories: National Park > Wildlife Sanctuary > Biosphere Reserve > Reserved Forest",
      "Project Tiger: launched 1973 — India's most famous wildlife conservation programme",
      "India's tiger population: ~3000+ (2022 census) — 70% of world's tigers",
      "Biodiversity hotspots in India: Western Ghats + Sri Lanka; Indo-Burma region; Himalayas; Sundaland",
      "IUCN Red List categories: Extinct → Critically Endangered → Endangered → Vulnerable → Near Threatened → Least Concern",
    ],
    teaching_content: {
      intuition:
        "India has lost over 50% of its original forests, and with them thousands of species. The snow leopard, one-horned rhinoceros, Asiatic lion, and Bengal tiger all faced near-extinction in the 20th century. Conservation is not just about saving 'charismatic megafauna' — it is about protecting entire ecosystems, which in turn protect the water, air, and soil that human life depends on. India's conservation model combines government-protected areas with community-based approaches like Joint Forest Management.",
      process_explanation:
        "1. CATEGORIES OF PROTECTED AREAS:\n- National Park: highest protection, no human activity, no grazing. Example: Jim Corbett, Kaziranga.\n- Wildlife Sanctuary: animals protected, some human activity (firewood collection, grazing) permitted. Example: Bharatpur, Chilika.\n- Biosphere Reserve: multiple-use zone — core zone (no human use) + buffer zone + transition zone where human settlement allowed. Example: Nilgiri, Sunderbans.\n- Reserved Forest: most protected forest under government control. No rights to communities. ~53% of total forest area.\n2. PROJECT TIGER (1973):\n- Launched after tiger census showed 1,827 tigers remaining (down from estimated 40,000 in 1900).\n- Created 9 Tiger Reserves (now 50+).\n- Results: population recovered to 3,000+ by 2022.\n3. COMMUNITY CONSERVATION:\n- Joint Forest Management (JFM): communities protect and manage forests, sharing benefits.\n- Bishnoi community (Rajasthan): protect animals/trees as religious duty — classic community conservation.\n- Sacred groves (Orans): traditional community-protected forest patches across India.\n4. THREATS TO WILDLIFE:\n- Habitat destruction (deforestation, urbanisation)\n- Poaching (for fur, ivory, traditional medicine)\n- Human-wildlife conflict (elephants raiding crops, leopards attacking livestock)\n5. INDIA'S BIODIVERSITY: 2.4% of world's land → 7-8% of species. 4 biodiversity hotspots.",
      worked_example:
        "Question: How does the 'biosphere reserve' concept differ from a national park in conservation approach?\nAnswer: A National Park has strict 'fortress conservation' — all human activity excluded, wildlife protected absolutely. A Biosphere Reserve uses a more nuanced 'multiple-use' approach:\n- Core zone: like a national park — no human activity\n- Buffer zone: research, eco-tourism allowed\n- Transition/co-operation zone: human settlement, sustainable use of resources\nThe biosphere reserve concept acknowledges that completely excluding local communities creates resentment and actually harms conservation. When communities are stakeholders in conservation — sharing benefits from eco-tourism, sustainable forest use — they protect wildlife rather than poach it. Nilgiri Biosphere Reserve includes settled farming communities in its transition zone while protecting core elephant habitat.",
      common_misconceptions: [
        "Wildlife Sanctuaries are NOT more protected than National Parks — it's the opposite. NPs have stricter rules.",
        "Project Tiger saved tigers not just by creating reserves — it also addressed human-wildlife conflict, anti-poaching, and in some cases relocation of settlements from core zones.",
        "India's conservation model has limitations — many protected areas displace tribal communities without adequate compensation, raising human rights concerns alongside conservation benefits.",
      ],
      shortcuts_and_tricks: [
        "Protection hierarchy: National Park (strictest) > Wildlife Sanctuary > Biosphere Reserve (multiple-use).",
        "Project Tiger: 1973, 9 original reserves, now 50+. Bengal Tiger population: 3000+ (2022).",
        "4 biodiversity hotspots in India: Western Ghats, Indo-Burma, Himalayas, Sundaland.",
      ],
      diagram_description: "Biosphere Reserve concentric circles: core (no use) → buffer (research, eco-tourism) → transition (human settlement, sustainable use). India map: tiger reserves highlighted. IUCN categories: Extinct → Critically Endangered → Endangered → Vulnerable → Near Threatened → Least Concern.",
      key_takeaway: "India protects wildlife through National Parks (strictest), Wildlife Sanctuaries, and Biosphere Reserves (multiple-use). Project Tiger (1973) saved the Bengal tiger from near-extinction. Community involvement through Joint Forest Management and recognition of sacred groves is essential for long-term conservation.",
    },
  },

  // ── Chapter 8: Water Resources ────────────────────────────────────────────

  {
    topicId: "sst_ch8_water_resources",
    subject: "Social Science",
    chapterNumber: 8,
    name: "Water Resources — Freshwater Availability and Scarcity",
    prerequisite_knowledge: ["Water cycle (hydrological cycle)", "Difference between surface water and groundwater", "India's monsoon pattern"],
    key_formulas: [
      "97% of world's water: salt water (oceans). Only 3% freshwater — of which 2.5% frozen/glacial",
      "India's annual precipitation: ~4000 billion cubic metres (BCM)",
      "Usable water: only ~1123 BCM (surface + groundwater)",
      "Water scarcity types: Physical scarcity (insufficient rainfall) vs Economic scarcity (poor management)",
      "India's per capita water availability declining: 5000 m³ (1950) → ~1400 m³ (2020)",
    ],
    teaching_content: {
      intuition:
        "Water covers 71% of the Earth's surface, yet freshwater is surprisingly scarce — only 3% of all water is fresh, and most of that is locked in glaciers. India receives abundant monsoon rainfall, but it is unevenly distributed in time (70% in 3 months) and space (Cherrapunji gets 11,000mm, Jaisalmer gets 100mm). The result is a paradox: India floods and droughts simultaneously. Managing water — storing monsoon rain, preventing waste, ensuring equitable access — is India's greatest resource challenge.",
      process_explanation:
        "1. GLOBAL FRESHWATER SITUATION: 97% saline (oceans), 2.5% frozen (glaciers, polar ice), 0.5% accessible freshwater (rivers, lakes, groundwater). This tiny fraction supports all terrestrial life.\n2. INDIA'S WATER RESOURCES:\n- Surface water: rivers (Ganga-Brahmaputra system, peninsular rivers), lakes.\n- Groundwater: aquifers — India uses 24% of world's groundwater.\n- Precipitation: 4000 BCM/year but only ~1123 BCM usable due to evaporation and runoff.\n3. WATER SCARCITY:\n- Physical scarcity: not enough rainfall (Rajasthan, South India in dry years).\n- Economic scarcity: adequate water exists but poor infrastructure/management prevents access (much of rural India).\n4. CAUSES OF DECLINING AVAILABILITY:\n- Population growth (more users)\n- Urbanisation (less permeable surfaces, less recharge)\n- Agricultural overuse (70% of water use in India is for irrigation)\n- Pollution (industrial effluents, untreated sewage making water unusable)\n- Deforestation (less forest = less water retention, more runoff)\n5. TRADITIONAL WATER MANAGEMENT:\n- Bamboo drip irrigation (Meghalaya), tank irrigation (Tamil Nadu), kuhls (Himachal Pradesh), johads (Rajasthan), baolis (stepwells in Delhi/Rajasthan).\n- These traditional systems maintained water availability for centuries before modern infrastructure.",
      worked_example:
        "Question: Explain the paradox of water abundance and water scarcity in India.\nAnswer: India receives 4000 BCM of annual precipitation — seemingly abundant. Yet India faces severe water scarcity for several reasons:\n1. Temporal mismatch: 70% of annual rainfall occurs in June-September (monsoon). The rest of the year, rivers run low. Without storage, monsoon water runs off unused.\n2. Spatial mismatch: Cherrapunji (Meghalaya) receives 11,000mm/year, Jaisalmer (Rajasthan) receives 100mm — a 100:1 ratio within one country.\n3. Growing demand: India's population grew from 340 million (1950) to 1.4 billion (2023) while per capita water availability fell from 5000 m³ to ~1400 m³.\n4. Pollution: industrial and agricultural pollution has made large volumes of river water unusable.\nSolution: storage (dams, check dams), groundwater recharge, demand management, wastewater recycling.",
      common_misconceptions: [
        "India is not 'running out of water' — it receives enough rainfall. The problem is management: storage, distribution, and prevention of pollution and waste.",
        "Groundwater is not 'unlimited' — India is over-extracting groundwater (especially in Punjab/Haryana for agriculture), and many aquifers are not being recharged fast enough.",
        "Water scarcity is not only a rural issue — many Indian cities face severe water shortages due to poor infrastructure and rapid urbanisation.",
      ],
      shortcuts_and_tricks: [
        "Global freshwater: 3% of total water; 0.5% accessible. 97% saline.",
        "India: 4000 BCM precipitation, ~1123 BCM usable. Per capita declining from 5000 m³ (1950) to ~1400 m³ now.",
        "70% of India's water use = agriculture (irrigation). Major driver of over-extraction.",
      ],
      diagram_description: "Global water distribution pie: 97% saline, 2.5% ice, 0.5% freshwater. India map: rainfall isohyets showing monsoon gradient. Time graph: per capita water availability declining 1950-2020.",
      key_takeaway: "Despite India's abundant monsoon rainfall (4000 BCM/year), effective freshwater availability is declining due to temporal/spatial mismatch, growing population, over-extraction, and pollution. Traditional water management systems (johads, baolis, tank irrigation) offer lessons for sustainable water use.",
    },
  },

  {
    topicId: "sst_ch8_multipurpose_projects",
    subject: "Social Science",
    chapterNumber: 8,
    name: "Multipurpose River Projects — Benefits and Problems",
    prerequisite_knowledge: ["What is a dam", "Irrigation and its importance for Indian agriculture", "Hydroelectric power"],
    key_formulas: [
      "Multipurpose project: dam serving multiple functions — irrigation + power + flood control + navigation + fisheries + tourism",
      "Bhakra-Nangal: Satluj River, Himachal Pradesh/Punjab — India's largest multipurpose dam",
      "Hirakud: Mahanadi River, Odisha — world's longest earthen dam",
      "Tehri Dam: Bhagirathi River, Uttarakhand — India's tallest dam",
      "Narmada Bachao Andolan: movement against Sardar Sarovar Dam displacement",
    ],
    teaching_content: {
      intuition:
        "Nehru called dams 'the temples of modern India' — they symbolised technological mastery over nature and promised irrigation for food security, electricity for industries, and flood control. India built hundreds of large dams from the 1950s-1980s with great optimism. But by the 1990s, the 'anti-dam movement' (Narmada Bachao Andolan) forced a reconsideration: dams also displace millions of people (mostly tribal communities), destroy ecosystems, and often fail to deliver promised benefits equitably. This tension between development and displacement remains unresolved.",
      process_explanation:
        "1. FUNCTIONS OF MULTIPURPOSE PROJECTS:\n- Irrigation: regular water supply to farmers beyond monsoon season\n- Hydroelectric power: generates electricity without fuel cost\n- Flood control: reservoir absorbs flood peaks\n- Navigation: deep water for ships\n- Domestic water supply: for cities\n- Fisheries: reservoirs support fish breeding\n- Tourism and recreation\n2. MAJOR DAMS:\n- Bhakra-Nangal (Satluj, HP/Punjab): powers Punjab's Green Revolution\n- Hirakud (Mahanadi, Odisha): world's longest earthen dam, 55km\n- Tehri (Bhagirathi, Uttarakhand): India's tallest dam (260m)\n- Sardar Sarovar (Narmada, Gujarat/MP): highly controversial, displaced 320,000+\n- Nagarjuna Sagar (Krishna, AP): one of world's largest masonry dams\n3. PROBLEMS WITH LARGE DAMS:\n- Displacement: millions of people (mostly tribal/Adivasi) displaced without adequate rehabilitation\n- Ecosystem destruction: submerges forests, wildlife habitats, farmland\n- Sedimentation: silt fills reservoirs, reducing lifespan\n- Waterlogging/salinity: over-irrigation without drainage\n- Seismicity: heavy water mass can trigger earthquakes\n- Inequity: benefits flow to large farmers and cities; displaced people often remain poor\n4. NARMADA BACHAO ANDOLAN: Social movement led by Medha Patkar against Sardar Sarovar Dam — demanded proper rehabilitation of displaced people. Challenged top-down development model.",
      worked_example:
        "Question: Why is the Sardar Sarovar Dam project controversial despite its large-scale benefits?\nAnswer: The dam has real benefits: it provides irrigation water to drought-prone Gujarat, electricity to several states, and drinking water to millions. But it is controversial because:\n1. Displacement: 320,000+ people (mostly Adivasi tribal communities from MP) were displaced from their ancestral lands.\n2. Inadequate rehabilitation: many displaced people did not receive promised land or compensation.\n3. Unequal benefits: benefits flow mainly to Gujarat (downstream); costs (displacement) are borne mainly by MP communities.\n4. Environmental impact: submerged forests, destroyed fisheries, reduced river flow affecting downstream ecology.\nThe NBA's argument was not 'no development' but 'who bears the costs and who gets the benefits?' — a question of equity and justice in development planning.",
      common_misconceptions: [
        "Dams do NOT completely control floods — they reduce flood peaks but cannot prevent all flooding. Climate change is making this worse.",
        "Hydroelectric power is NOT totally clean — building dams submerges forests (releasing carbon) and methane from decomposing organic matter in reservoirs contributes to greenhouse gases.",
        "The Narmada Bachao Andolan was NOT anti-development — it demanded equitable development with proper rehabilitation of displaced communities.",
      ],
      shortcuts_and_tricks: [
        "Bhakra-Nangal = Satluj. Hirakud = Mahanadi. Tehri = Bhagirathi. Sardar Sarovar = Narmada.",
        "7 functions of multipurpose projects: irrigation, power, flood control, navigation, water supply, fisheries, tourism.",
        "Problems: displacement, ecosystem loss, sedimentation, waterlogging, seismicity, inequity.",
      ],
      diagram_description: "Cross-section of a dam: reservoir (upstream), dam wall, spillway, power station (hydroelectric turbines), irrigation canals (downstream). Table: major Indian dams (name, river, state, primary function). Timeline: dam-building enthusiasm 1950s → critique and protest 1990s (NBA).",
      key_takeaway: "Multipurpose river projects (dams) serve irrigation, hydroelectric power, flood control, and other functions — crucial for Indian food security and development. However, they cause displacement (mainly of tribal communities), ecosystem damage, and often deliver unequal benefits. The Narmada Bachao Andolan challenged the top-down development model and demanded equitable, rehabilitative approaches.",
    },
  },

  // ── Chapter 9: Agriculture ─────────────────────────────────────────────────

  {
    topicId: "sst_ch9_agriculture_types",
    subject: "Social Science",
    chapterNumber: 9,
    name: "Types of Farming in India",
    prerequisite_knowledge: ["What is subsistence farming", "Difference between cash crops and food crops", "What is the Green Revolution"],
    key_formulas: [
      "Subsistence farming: primarily for household consumption (small farmers)",
      "Commercial farming: crops grown for sale in markets (large-scale)",
      "Intensive subsistence: high labour, small plots, high yield per hectare (Indo-Gangetic plains)",
      "Shifting cultivation (Jhoom): northeast India — slash and burn, move after 2-3 years",
      "Plantation agriculture: single cash crop, large estate, introduced by British (tea, coffee, rubber)",
    ],
    teaching_content: {
      intuition:
        "Two-thirds of India's population depends on agriculture — yet Indian farming ranges from the most intensive small-scale rice cultivation in West Bengal (where every square metre counts) to large commercial wheat farms in Punjab, to the tea plantations of Assam that supply the world. Understanding these different farming systems — why they exist, what they produce, and what limits them — is essential to understanding rural India's economy.",
      process_explanation:
        "1. PRIMITIVE SUBSISTENCE FARMING:\n- Practised by tribal/isolated communities\n- Types: (a) Shifting cultivation (Jhoom/Bewar/Penda/Ponika — different regional names): forest cleared, burnt, crops grown 2-3 years, then land abandoned; (b) Nomadic herding: cattle/camel/yak moved across pastures seasonally\n2. INTENSIVE SUBSISTENCE FARMING:\n- Small plots, large labour input, high yield per unit area\n- Two types: Rice-dominated (humid areas: Bengal, UP, south India — rice double-cropped where possible) and wheat-dominated (Punjab, Haryana, UP — with irrigation)\n3. COMMERCIAL FARMING:\n- Crops grown primarily for sale\n- High mechanisation, fertilisers, irrigation\n- Varies by region: Punjab = wheat/rice (mechanised); Maharashtra = cotton, sugarcane; Karnataka/TN = coffee\n4. PLANTATION AGRICULTURE:\n- Large estates, single cash crop, scientific management\n- British colonial origin — export to Britain\n- Tea: Assam, West Bengal hills (Darjeeling)\n- Coffee: Karnataka, Kerala, Tamil Nadu\n- Rubber: Kerala\n- Cotton: Maharashtra, Gujarat (formerly — now more commercial small farms)\n5. MIXED FARMING: crops + livestock together. More sustainable (manure from animals, crop waste as feed).",
      worked_example:
        "Question: Why is plantation agriculture called a 'colonial' form of farming?\nAnswer: Plantation agriculture was introduced in India by British colonists who:\n1. Established large estates (displacing local communities) for crops that grew well in India's tropical climate.\n2. Organised labour on a quasi-feudal basis — workers lived on estates, were poorly paid, and had restricted movement (especially in early tea gardens).\n3. Produced for export to Britain, not for Indian consumption.\n4. Used British capital and management while Indian workers provided labour at low wages.\nThe colonial structure shaped Indian tea estates (Assam) and coffee plantations (Karnataka) — even today, plantation workers, often descendants of original workers, face low wages and poor conditions compared to other agricultural labour.",
      common_misconceptions: [
        "Shifting cultivation (jhoom) is not inherently destructive — when practised at low population density with long fallow periods (10-15 years), it is sustainable. Destruction occurs when population pressure forces shorter fallow cycles.",
        "Green Revolution was not uniform — it benefited Punjab, Haryana, and western UP (wheat) enormously but bypassed eastern India, dryland areas, and small farmers without irrigation access.",
        "Commercial farming is not 'better' than subsistence — it can lead to monoculture vulnerability, fertiliser dependence, and market risk for farmers.",
      ],
      shortcuts_and_tricks: [
        "Farming types: Primitive Subsistence (jhoom/nomadic) → Intensive Subsistence (rice/wheat belt) → Commercial (Punjab, cotton belt) → Plantation (tea/coffee/rubber).",
        "Jhoom = northeast India shifting cultivation. Also called: Bewar (MP), Penda (AP), Ponika (Chhattisgarh), Kumari (Western Ghats), Bringa (Odisha).",
        "Plantation crop-state: Tea = Assam/Darjeeling. Coffee = Karnataka/Kerala. Rubber = Kerala.",
      ],
      diagram_description: "Farming type spectrum: Subsistence (small, labour-intensive, family) → Commercial (large, mechanised, market-oriented) → Plantation (estate, single crop, colonial origin). Regional map: jhoom (NE India), intensive rice (Bengal, south), wheat (Punjab), tea (Assam), coffee (Karnataka).",
      key_takeaway: "India has diverse farming systems: primitive subsistence (jhoom shifting cultivation in NE), intensive subsistence (rice/wheat smallholders in plains), commercial farming (Punjab mechanised wheat/rice), and plantation agriculture (tea in Assam, coffee in Karnataka, rubber in Kerala — colonial origins). Each system reflects distinct ecology, history, and economic context.",
    },
  },

  {
    topicId: "sst_ch9_major_crops",
    subject: "Social Science",
    chapterNumber: 9,
    name: "Major Crops of India — Food Grains, Cash Crops, and Horticulture",
    prerequisite_knowledge: ["Kharif vs Rabi seasons", "India's agro-climatic zones", "Importance of Green Revolution"],
    key_formulas: [
      "Kharif crops: sown June-July, harvested September-October (rice, jowar, bajra, maize, cotton, groundnut, jute)",
      "Rabi crops: sown October-November, harvested March-April (wheat, barley, peas, mustard, gram)",
      "Zaid crops: short summer season (melon, cucumber, vegetable marrow)",
      "India: 2nd largest wheat producer, 2nd largest rice producer, largest producer of pulses",
      "Green Revolution (1960s-70s): HYV seeds + irrigation + fertilisers → food self-sufficiency",
    ],
    teaching_content: {
      intuition:
        "Food self-sufficiency was India's most urgent post-independence challenge — in 1943, the Bengal Famine killed 2-3 million people under British rule. By the 1960s, droughts again threatened starvation. The Green Revolution — high-yielding variety seeds, irrigation, and fertilisers — transformed India from a food-importing country to a net food exporter by the 1980s. Understanding major crops means understanding this transformation — and its limitations.",
      process_explanation:
        "1. RICE:\n- Kharif crop; requires 100-200cm rainfall or irrigation\n- Major producers: West Bengal, UP, Andhra Pradesh, Punjab, Odisha, Tamil Nadu\n- HYV varieties (IR-8 etc.) dramatically increased yields in Green Revolution\n2. WHEAT:\n- Rabi crop; requires cool, moist growing season; warm dry harvest\n- Major producers: Punjab, Haryana, UP (the Green Revolution heartland)\n- India's wheat production grew from 11 MT (1960) to 107 MT (2022)\n3. MILLETS (Jowar, Bajra, Ragi):\n- Drought-resistant, nutrient-rich\n- Maharashtra (jowar), Rajasthan/Gujarat (bajra), Karnataka (ragi)\n- Declining consumption despite better nutrition profile than wheat/rice\n4. PULSES (Lentils, chickpeas, moong, urad):\n- Protein source; fix nitrogen in soil (sustainable)\n- India is world's largest producer AND importer — demand exceeds supply\n5. SUGARCANE:\n- Kharif crop; requires tropical humid climate\n- India = world's 2nd largest producer (Brazil #1)\n- UP, Maharashtra dominate production\n6. TEA AND COFFEE: Plantation crops (see farming types)\n7. COTTON:\n- Kharif crop; India = world's 2nd largest producer\n- Maharashtra, Gujarat, AP, Telangana (black soil areas)\n8. JUTE (Golden Fibre):\n- Kharif; requires humid, tropical climate\n- West Bengal, Bihar, Assam — lower Ganga delta\n- India = world's leading jute producer",
      worked_example:
        "Question: Why did the Green Revolution primarily benefit Punjab and Haryana rather than eastern or central India?\nAnswer: The Green Revolution package required: (1) HYV seeds, (2) chemical fertilisers, (3) reliable irrigation, and (4) access to markets and credit.\nPunjab and Haryana had:\n- Canal irrigation from Bhakra-Nangal system — reliable water supply year-round\n- Flat, fertile land suitable for mechanisation\n- Well-developed road and market infrastructure (proximity to Delhi)\n- Relatively larger, economically stronger farmers who could afford inputs\nEastern India (Bihar, eastern UP, Odisha): rain-dependent, fragmented small holdings, poor infrastructure, inadequate credit access, so HYV seeds and fertilisers were too risky or unaffordable.\nResult: food production increased nationally, but benefits concentrated in already-advantaged regions — widening regional inequality.",
      common_misconceptions: [
        "Green Revolution did NOT solve hunger — it solved food production shortage but not food distribution. Malnutrition persisted because poor people couldn't afford food.",
        "Rice and wheat are NOT the most nutritious grains — millets (ragi, jowar, bajra) have better micronutrient profiles but have been marginalised by GR's focus on rice/wheat.",
        "India's pulses crisis is chronic — despite being the world's largest producer, India consistently imports pulses because demand from 1.4 billion people exceeds production.",
      ],
      shortcuts_and_tricks: [
        "Kharif = June-July to September-October. Rabi = October-November to March-April. Sow: Kharif with monsoon, Rabi at beginning of winter.",
        "GR states: Punjab + Haryana + western UP = Green Revolution heartland for wheat. Same regions + Andhra Pradesh for rice.",
        "Crop-state leaders: rice = WB/UP/AP; wheat = Punjab/Haryana/UP; jute = WB; cotton = Maharashtra/Gujarat; sugar = UP/Maharashtra.",
      ],
      diagram_description: "India map: major crop regions (rice = east/south, wheat = northwest, cotton = Deccan, jute = Bengal delta, tea = Assam). Crop calendar: kharif (June-October) and rabi (October-April) seasons side by side with crops listed.",
      key_takeaway: "India's agriculture is organized around kharif (monsoon: rice, cotton, jute, sugarcane) and rabi (winter: wheat, mustard, pulses) seasons. The Green Revolution transformed India into a food-surplus country for rice and wheat but primarily benefited Punjab/Haryana and left pulses production lagging. Millets are nutritionally superior but declining.",
    },
  },

  // ── Chapter 10: Minerals and Energy Resources ─────────────────────────────

  {
    topicId: "sst_ch10_minerals_types",
    subject: "Social Science",
    chapterNumber: 10,
    name: "Minerals — Types, Distribution, and Conservation",
    prerequisite_knowledge: ["Difference between a mineral and a rock", "What is an ore", "Basic economic geology"],
    key_formulas: [
      "Ferrous minerals: contain iron (iron ore, manganese, nickel, cobalt) — account for 3/4 of value of metallic mineral production",
      "Non-ferrous: no iron (copper, bauxite, lead, zinc, gold, silver)",
      "Non-metallic: chemical elements, compounds (mica, limestone, gypsum, potash, sulphur)",
      "Iron ore deposits: Orissa, Jharkhand, Chhattisgarh, Goa, Karnataka, AP",
      "Mica: ~80% of world's mica from Jharkhand, Bihar, AP",
    ],
    teaching_content: {
      intuition:
        "Minerals are the raw material of modern industrial civilisation — iron for steel, bauxite for aluminium, copper for wires, coal for energy. India is extraordinarily mineral-rich: the Chota Nagpur Plateau (Jharkhand) is called the 'mineral heartland' of India, containing iron, coal, manganese, mica, and copper in close proximity. But minerals are non-renewable — once extracted, they are gone. Understanding where minerals are found and how to conserve them is essential for India's long-term industrialisation.",
      process_explanation:
        "1. FERROUS MINERALS:\n- Iron ore: 4 types — magnetite (highest Fe content), haematite (most commercially important in India), limonite, siderite. Found in Orissa (Kendujhar), Jharkhand (Singhbhum), Chhattisgarh (Bailadila), Goa, Karnataka (Bellary), AP.\n- Manganese: used in steel production. Orissa, Karnataka, MP.\n2. NON-FERROUS MINERALS:\n- Copper: Rajasthan (Khetri mines — largest), Jharkhand, MP. India has poor copper reserves.\n- Bauxite (aluminium ore): Orissa, Gujarat, Jharkhand, MP, Maharashtra.\n- Gold: Karnataka (Kolar — once world's deepest mine, now mostly exhausted).\n3. NON-METALLIC MINERALS:\n- Mica: used in electrical industry (insulator). Jharkhand (Koderma), Bihar (Gaya), AP, Rajasthan. India produces ~80% of world mica.\n- Limestone: used in cement. Rajasthan, MP, Gujarat, AP, Karnataka.\n- Gypsum: Rajasthan (largest), UP, HP.\n4. ROCK MINERALS (Fuels): Coal, petroleum — discussed in energy resources.\n5. CONSERVATION: Minerals are finite → need to reduce waste in mining, develop substitutes, recycle.",
      worked_example:
        "Question: Why is the Chota Nagpur Plateau called the 'mineral storehouse' of India?\nAnswer: The Chota Nagpur Plateau (primarily in Jharkhand, with parts in WB, MP, Odisha, Chhattisgarh) contains an extraordinary concentration of diverse minerals:\n- Coal: Damodar Valley (world's 4th largest coal deposits)\n- Iron ore: Singhbhum, Kendujhar\n- Copper: Singhbhum district\n- Mica: Koderma, Hazaribagh\n- Manganese, bauxite, limestone also present\nThis mineral concentration, combined with forest cover and rivers for water, led to the region being industrialised under British rule — Jamshedpur's Tata Steel plant (1907) was located here precisely because coal and iron ore were within 100km of each other. However, mining has also caused massive environmental destruction and displacement of tribal communities.",
      common_misconceptions: [
        "India is NOT mineral-poor — it has abundant reserves of iron ore, coal, mica, bauxite, and manganese. But it lacks adequate reserves of copper, gold, and petroleum.",
        "Haematite is the MOST commercially important iron ore in India (not magnetite despite magnetite's higher iron content) because haematite is more abundant.",
        "Mining does NOT create sustained local prosperity — in India, mineral-rich regions (Jharkhand, Orissa) often have very high poverty rates because mineral revenue flows to companies and government, not local communities.",
      ],
      shortcuts_and_tricks: [
        "Ferrous = iron-containing. Non-ferrous = metal but no iron. Non-metallic = not metallic at all.",
        "Iron ore states: OJCGKA — Orissa, Jharkhand, Chhattisgarh, Goa, Karnataka, AP.",
        "Mica = India's unique mineral advantage. 80% of world supply from Jharkhand/Bihar/AP.",
      ],
      diagram_description: "India mineral map: iron ore (east India belt), coal (Damodar Valley), mica (Jharkhand/Bihar), copper (Khetri, Rajasthan), bauxite (Orissa/Gujarat), limestone (widespread). Ferrous/non-ferrous/non-metallic classification chart.",
      key_takeaway: "India is mineral-rich in iron ore (haematite — east India), coal (Damodar Valley), mica (80% of world supply — Jharkhand), and bauxite (Orissa). The Chota Nagpur Plateau is India's mineral heartland. Minerals are non-renewable and must be conserved through efficient extraction, recycling, and finding substitutes.",
    },
  },

  {
    topicId: "sst_ch10_energy_resources",
    subject: "Social Science",
    chapterNumber: 10,
    name: "Energy Resources — Conventional and Non-Conventional",
    prerequisite_knowledge: ["What is fossil fuel", "Difference between renewable and non-renewable energy", "Importance of energy for development"],
    key_formulas: [
      "Conventional: coal, petroleum, natural gas, electricity (hydel + thermal + nuclear)",
      "Non-conventional: solar, wind, biogas, tidal, geothermal",
      "Coal: India's most important conventional energy source — 53% of energy needs",
      "India's coal reserves: Jharkhand, Orissa, Chhattisgarh, WB (Gondwana coalfields, 98% of reserves)",
      "India's solar target: 500 GW renewables by 2030",
    ],
    teaching_content: {
      intuition:
        "Energy is the lifeblood of modern economies — without it, factories stop, lights go out, and food cannot be grown or distributed. India faces a dual energy challenge: it needs massive amounts of energy to develop (electrify villages, power factories, run transport) while also transitioning away from fossil fuels that are causing climate change. India is the world's 3rd largest energy consumer and the world's 3rd largest carbon emitter — making India's energy choices critical for global climate.",
      process_explanation:
        "CONVENTIONAL ENERGY:\n1. COAL:\n- India's most important energy source (~53% of commercial energy)\n- Types by carbon content: anthracite (highest) > bituminous > lignite (lowest). India has mostly bituminous.\n- Gondwana coalfields (Jharkhand, Orissa, Chhattisgarh, WB) = 98% of India's coal\n- Tertiary coalfields (Assam, Meghalaya, J&K, Arunachal Pradesh) = 2%\n- Problem: high carbon emission when burned\n2. PETROLEUM:\n- India imports ~85% of crude oil needs (very limited domestic reserves)\n- Domestic: Mumbai High (offshore, ~40% of production), Assam (Digboi — Asia's oldest oil field, 1889), Gujarat\n- Huge import bill → India incentivised to develop alternatives\n3. NATURAL GAS: Gujarat, AP, Rajasthan (recent KG basin). Used for fertiliser production, power.\n4. NUCLEAR ENERGY:\n- Uranium: Jharkhand (Jaduguda)\n- Thorium (future fuel): Kerala coast (monazite-rich), Rajasthan. India has world's 3rd largest thorium reserves.\n- Stations: Tarapur, Rawatbhata, Kalpakkam, Narora, Kakrapar, Kaiga\nNON-CONVENTIONAL ENERGY:\n5. SOLAR: India has 300+ sunny days/year. Solar parks: Rajasthan (Bhadla), Gujarat, Karnataka. Target: 500GW renewables by 2030.\n6. WIND: India = world's 4th largest wind power producer. Tamil Nadu, Gujarat, AP, Karnataka, Maharashtra.\n7. BIOGAS: Uses organic waste — cattle dung, crop residue. Important for rural energy. Gobar gas plants.\n8. TIDAL: Potential at Gulf of Kutch, Gulf of Khambhat, Sunderbans.",
      worked_example:
        "Question: Why is India trying to rapidly expand solar and wind energy?\nAnswer: India has strong incentives to develop renewables:\n1. Energy security: India imports 85% of its crude oil at enormous cost ($150 billion+ annually). Renewables use domestic 'fuel' (sunshine, wind) — no imports needed.\n2. Climate commitment: India committed to achieving 500 GW renewable capacity by 2030 at COP26. As a major carbon emitter, India faces international pressure to decarbonise.\n3. Resource availability: India has excellent solar irradiance (>300 sunny days in Rajasthan, Gujarat) and strong wind corridors (Tamil Nadu coast).\n4. Cost: solar and wind are now cheaper than new coal power in India — the economic case is compelling.\n5. Health: coal burning causes severe air pollution (Delhi's air quality). Renewables eliminate this.",
      common_misconceptions: [
        "Nuclear energy is NOT the same as atomic bomb technology — nuclear power plants use controlled fission to generate heat, not explosive detonation.",
        "India does NOT have large domestic oil reserves — it must import most of its petroleum, making it vulnerable to global price shocks.",
        "Non-conventional energy is NOT just for wealthy countries — biogas (using cow dung) is appropriate technology for rural India and has been deployed for decades.",
      ],
      shortcuts_and_tricks: [
        "Coal states: Jharkhand, Orissa, Chhattisgarh, WB = Gondwana (98% of India's coal). Assam/NE = Tertiary (2%).",
        "Oil: Mumbai High (#1) + Assam (Digboi, oldest) + Gujarat. But India imports 85%.",
        "Wind power state #1 = Tamil Nadu (historically). Solar fastest growing = Rajasthan, Gujarat.",
      ],
      diagram_description: "Energy mix chart: coal 53%, oil+gas ~26%, nuclear 3%, renewables growing. India map: coal (east India), oil (Mumbai, Assam), nuclear plants (coast locations), solar (Rajasthan/Gujarat), wind (Tamil Nadu coast). Renewables growth target chart.",
      key_takeaway: "India's energy comes primarily from coal (53%, mostly from Gondwana coalfields in east India) and imported petroleum. Nuclear energy uses domestic uranium and thorium. India is rapidly expanding non-conventional energy — solar (Rajasthan/Gujarat), wind (Tamil Nadu) — targeting 500 GW renewables by 2030 for energy security and climate commitments.",
    },
  },

  // ── Chapter 11: Manufacturing Industries ─────────────────────────────────

  {
    topicId: "sst_ch11_industries_types",
    subject: "Social Science",
    chapterNumber: 11,
    name: "Classification of Industries",
    prerequisite_knowledge: ["What is the secondary sector of the economy", "Difference between public sector and private sector", "What is an industry"],
    key_formulas: [
      "By raw material: Agro-based (cotton, jute, silk), Mineral-based (iron/steel, cement, aluminium), Forest-based (paper, furniture), Marine-based (fish products)",
      "By size: Household/cottage, Small-scale (SSI, <₹1 crore investment), Medium, Large-scale (>₹10 crore)",
      "By ownership: Private, Public (PSUs), Joint (public+private), Cooperative",
      "By finished product: Heavy industries (iron, steel, machinery) vs Consumer goods (textiles, food processing)",
    ],
    teaching_content: {
      intuition:
        "Industry transforms raw materials into finished goods — from cotton to cloth, iron ore to steel, bauxite to aluminium. This transformation creates value, employment, and the goods that modern life depends on. India's industrial structure ranges from the village potter (cottage industry) to Tata Steel (one of the world's largest steel companies) — a range of scales reflecting India's diverse economy. Understanding how industries are classified helps understand India's industrial geography.",
      process_explanation:
        "1. BY RAW MATERIAL SOURCE:\n- Agro-based: cotton textiles (Mumbai/Ahmedabad), jute mills (Kolkata), sugar mills (UP/Maharashtra), food processing\n- Mineral-based: steel (Jamshedpur, Bhilai, Rourkela), cement, aluminium\n- Forest-based: paper mills (Orissa, MP), furniture, lac\n- Marine-based: fish processing, fishmeal\n2. BY SIZE:\n- Cottage/Household: no hired labour, family-owned, traditional products (pottery, weaving). Khadi → promoted by Gandhi.\n- Small-Scale Industry (SSI): <₹1 crore investment (in plant and machinery). Employ most industrial workers.\n- Large-scale: giant corporations — Tata, Birla, Reliance, Infosys.\n3. BY OWNERSHIP:\n- Private sector: owned by individuals/companies (Tata Steel, Infosys)\n- Public sector: government-owned PSUs (BHEL, ONGC, SAIL, Coal India)\n- Joint sector: govt + private (Maruti Udyog was joint until privatised)\n- Cooperative: owned by producers (Amul is cooperative dairy, IFFCO is fertiliser cooperative)\n4. BY MARKET (Consumer vs Capital Goods):\n- Consumer goods: directly for consumers (textiles, food, medicines, vehicles)\n- Capital/intermediate goods: machinery, raw materials used to make other goods (steel, chemicals)",
      worked_example:
        "Question: Why are small-scale industries important for India's economy despite being less productive than large industries?\nAnswer: Small-scale industries (SSIs) play a disproportionately important role in India's economy because:\n1. Employment: SSIs employ ~40% of India's industrial workforce with a fraction of capital investment — highly labour-efficient. In a country with ~500 million workers seeking employment, this is critical.\n2. Equity: SSIs are spread across small towns and rural areas — providing employment where large industries cannot locate.\n3. Exports: SSIs contribute ~45% of India's manufactured exports (handicrafts, leather, readymade garments).\n4. Complementary: SSIs produce ancillary components for large industries (auto parts, electronics components).\n5. Entrepreneurship: SSIs are the entry point for entrepreneurs — many large companies started as small enterprises.",
      common_misconceptions: [
        "Cottage industries are NOT the same as Small-Scale Industries — cottage industries use no hired labour (family-only) and no power machinery. SSIs can hire workers and use machinery.",
        "Public sector companies (PSUs) were NOT always inefficient — in the 1950s-70s, PSUs built industries (steel, chemicals, aircraft) that private capital wouldn't risk. Inefficiency grew later due to political interference and monopoly.",
        "Cooperative sector is NOT limited to agriculture — Amul (dairy), IFFCO (fertilisers), and consumer cooperatives show the model works across sectors.",
      ],
      shortcuts_and_tricks: [
        "4 classifications: by raw material source / by size / by ownership / by product type.",
        "Agro-based = cotton/jute/sugar. Mineral-based = steel/cement/aluminium.",
        "Cooperative sector success story = Amul (dairy, Gujarat). IFFCO (fertilisers). Model = producer-owned.",
      ],
      diagram_description: "Industry classification mind map: 4 branches (by raw material, by size, by ownership, by product). Each branch with examples. Amul cooperative structure: 3 million farmers → 17 unions → GCMMF (marketing) → Amul brand.",
      key_takeaway: "Industries are classified by raw material (agro/mineral/forest/marine-based), size (cottage/small/large), ownership (private/public/joint/cooperative), and product type (consumer/capital goods). Small-scale industries employ ~40% of India's industrial workers despite limited capital investment, making them crucial for employment and equity.",
    },
  },

  {
    topicId: "sst_ch11_textile_industry",
    subject: "Social Science",
    chapterNumber: 11,
    name: "India's Textile Industry — Cotton, Jute, and Silk",
    prerequisite_knowledge: ["Where cotton is grown in India", "Difference between handloom and powerloom", "What is jute"],
    key_formulas: [
      "Cotton textile: India's largest industry by employment; Mumbai = 'Manchester of the East'",
      "Jute industry: concentrated in West Bengal (Hooghly River belt) — India is world's largest jute producer",
      "Silk: India = 2nd largest silk producer. Karnataka (Mysuru) = leading silk state",
      "Handloom sector: employs ~6.5 million weavers — 2nd largest employer after agriculture",
    ],
    teaching_content: {
      intuition:
        "Textiles clothe India's 1.4 billion people and employ more people than any other industry. India's textile tradition is ancient — Indian muslin was exported to Rome 2000 years ago, Indian cotton cloth reached Southeast Asia and Africa through the Indian Ocean trade. The British deliberately destroyed this industry by flooding India with cheap mill-made cloth — but India rebuilt its textile industry after independence, and today textile and apparel exports exceed $40 billion annually.",
      process_explanation:
        "1. COTTON TEXTILE INDUSTRY:\n- India's largest and oldest industry by employment\n- Mumbai: first mill 1854, became 'Manchester of the East' — proximity to cotton (Deccan), port (export), and humid climate (prevents thread breakage)\n- Now decentralised: Ahmedabad, Coimbatore, Kanpur, Chennai, Surat, Nagpur\n- Three segments: handloom (traditional, village-based), powerloom (semi-mechanised, decentralised), mill sector (fully mechanised)\n2. JUTE INDUSTRY:\n- India = world's largest jute producer\n- Concentrated: West Bengal (70+ mills along Hooghly river near Kolkata)\n- Why Hooghly belt? Proximity to jute fields (WB, Bihar), soft water (for processing), Kolkata port (for export), coal from Raniganj nearby\n- Uses: gunny bags, hessian cloth, carpet backing, rope — now facing synthetic substitute competition\n- New uses: jute composites, geo-textiles, eco-friendly packaging (biodegradable)\n3. SILK INDUSTRY:\n- India = 2nd largest silk producer (after China)\n- Karnataka (Mysuru/Bengaluru region) = largest producer\n- Also: Jammu (pashmina from Kashmir goats), Assam (eri/muga silk), West Bengal (mulberry silk)\n- Sericulture: raising silkworms on mulberry leaves",
      worked_example:
        "Question: Why did the cotton textile industry first locate in Mumbai and why has it since decentralised?\nAnswer:\nOriginal concentration in Mumbai: (1) Close to raw cotton from Deccan black soil region, (2) Mumbai port for export, (3) humid coastal climate prevented cotton thread from breaking (important for fine spinning), (4) British capital and management available through Bombay Presidency administration.\nDecentralisation since 1970s-90s: (1) Labour costs in Mumbai rose significantly as unions grew stronger, (2) Power shortages in Maharashtra made production expensive, (3) Powerloom sector (decentralised, less regulated) grew rapidly in Surat, Bhiwandi, Tiruppur, (4) Ahmedabad, Coimbatore, Kanpur developed as alternative textile centres with lower costs, (5) Liberalisation (1991) allowed foreign fabric imports, increasing competition and forcing Indian mills to cut costs.",
      common_misconceptions: [
        "Jute is NOT just for gunny bags — it is being developed for modern uses: geo-textiles (erosion control), composites for car interiors, eco-friendly packaging. This 'golden fibre renaissance' is important.",
        "India's handloom sector is NOT dying — it employs 6.5 million weavers and produces distinctive fabrics (Banarasi silk, Kanjeevaram, Pochampally, Chanderi) with global market demand.",
        "Mumbai's cotton mills have largely closed — the famous 'Girangaon' (mill village) of central Mumbai is now real estate. The industry has decentralised, not disappeared.",
      ],
      shortcuts_and_tricks: [
        "Cotton: Mumbai = 'Manchester of the East' (historically). Now decentralised: Ahmedabad, Coimbatore, Surat.",
        "Jute = West Bengal (Hooghly belt). India = world's largest producer.",
        "Silk: Karnataka (Mysuru) #1. J&K (pashmina). Assam (muga/eri). India = 2nd after China.",
      ],
      diagram_description: "India map: cotton textile mills (Mumbai, Ahmedabad, Coimbatore, Surat), jute mills (Hooghly belt, WB), silk production (Karnataka, Kashmir, Assam). Three-segment diagram for cotton: handloom (village) → powerloom (semi-mech) → mill (fully mech).",
      key_takeaway: "India's textile industry is the largest employer after agriculture. Cotton textiles originated in Mumbai ('Manchester of the East') but have decentralised to Ahmedabad, Coimbatore, and Surat. Jute mills concentrate on the Hooghly River in West Bengal. Silk production is led by Karnataka, with unique regional variants in Kashmir and Assam.",
    },
  },

  {
    topicId: "sst_ch11_environment",
    subject: "Social Science",
    chapterNumber: 11,
    name: "Industrial Pollution and Environmental Degradation",
    prerequisite_knowledge: ["What is pollution", "Types: air, water, land, noise pollution", "Concept of environmental impact"],
    key_formulas: [
      "Air pollution: particulate matter (PM2.5, PM10), SO₂, NO₂, CO from industries, vehicles, power plants",
      "Water pollution: effluents from textile (dyes), tanneries, paper mills, chemical industries",
      "Thermal pollution: hot water from power plant cooling discharged into rivers — kills aquatic life",
      "National Green Tribunal (NGT): India's specialised environmental court (established 2010)",
    ],
    teaching_content: {
      intuition:
        "Industrial production creates wealth but also generates waste — gases, liquid effluents, solid waste, heat, and noise. In India, environmental regulations were weak or poorly enforced for decades, allowing industries to use rivers as waste dumps and air as free pollution sinks. The result: rivers like the Ganga and Yamuna are severely polluted, Delhi's air is dangerous for much of the year, and industrial towns like Vapi and Ludhiana have serious health crises. Environmental protection and industrial development are in tension — but not incompatible.",
      process_explanation:
        "1. AIR POLLUTION FROM INDUSTRIES:\n- Particulates (dust, soot) from cement factories, power plants, steel mills\n- Sulphur dioxide (SO₂) from burning coal → acid rain\n- Carbon monoxide from incomplete combustion\n- CFCs from refrigeration (depletes ozone layer)\n- Effects: respiratory diseases (asthma, silicosis in stone quarry workers), reduced visibility, acid rain damaging crops and buildings\n2. WATER POLLUTION:\n- Hot water from power plant cooling → thermal pollution (reduces dissolved oxygen, kills fish)\n- Textile mills: dyes, chemicals → river water turns coloured\n- Tanneries: chromium and arsenic compounds → toxic to aquatic life and humans\n- Sugar mills, distilleries: organic waste → BOD increases, oxygen depletion\n- Jute processing: retting in water → pollution of Hooghly\n3. LAND POLLUTION:\n- Mining: overburden dumping, acid drainage\n- Industrial solid waste: slag from steel mills, fly ash from thermal plants\n4. NOISE POLLUTION:\n- Industrial machinery, generators, construction equipment\n- Affects workers' hearing, causes stress\n5. MITIGATION MEASURES:\n- Effluent Treatment Plants (ETPs): mandatory for industries discharging into rivers\n- Electrostatic precipitators: capture particulates from chimneys\n- Scrubbers: remove SO₂ from exhaust gases\n- Catalytic converters (vehicles): reduce CO, NOx\n- National Green Tribunal: judicial enforcement\n- ISO 14001: environmental management system certification\n- Relocating industries away from rivers and urban areas",
      worked_example:
        "Question: Why are tanneries (leather industries) particularly harmful to water bodies?\nAnswer: Tanneries convert raw hides into leather using chemicals, many of which are toxic:\n1. Chromium salts (chrome tanning): hexavalent chromium (Cr-VI) is carcinogenic. Tannery effluents contain high chromium concentrations.\n2. Lime and sulphides: used to remove hair from hides — creates alkaline, high-pH effluents.\n3. Biological waste: hair, flesh, blood — create high BOD (biological oxygen demand), depleting dissolved oxygen.\n4. Salt: used to preserve hides — increases water salinity.\nIn cities like Kanpur and Kolkata, tanneries have severely polluted the Ganga — chromium from Kanpur's tanneries has been found in river sediments far downstream. Strict ETPs can capture these chemicals, but enforcement has been lax.",
      common_misconceptions: [
        "Thermal pollution from power plants is NOT visible like oil spills — it is 'invisible pollution' (hot water looks the same as cold water) but can devastate aquatic ecosystems by reducing oxygen.",
        "Environmental regulations in India are NOT absent — India has strong laws (Water Act 1974, Air Act 1981, Environment Protection Act 1986, NGT 2010). The problem is enforcement, not legislation.",
        "Industrial pollution is NOT only from large factories — cottage industries (brick kilns, stone quarries, small dye units) cause significant local pollution with minimal regulation.",
      ],
      shortcuts_and_tricks: [
        "4 types of industrial pollution: air (particulates, SO₂), water (thermal, chemical, biological), land (solid waste, mining), noise.",
        "Solutions: ETP (liquid), precipitator/scrubber (air), NGT (legal), ISO 14001 (management).",
        "Key polluting industries: tanneries (chromium), textile (dyes), sugar mills (BOD), thermal power (fly ash, thermal water).",
      ],
      diagram_description: "Factory cross-section: chimneys (air pollution: particulates, SO₂) + liquid drain (water pollution: chemicals, heat) + waste dump (land pollution: solid waste). Control technology: scrubber (chimney), ETP (liquid treatment), landfill (solid). River impact: reduced dissolved oxygen, dead fish zone.",
      key_takeaway: "Industries pollute air (particulates, SO₂ → acid rain), water (chemical effluents, thermal discharge → kills aquatic life), and land (mining overburden, fly ash). India has environmental laws (EPA 1986, NGT 2010) but enforcement is weak. Solutions include ETPs, electrostatic precipitators, scrubbers, and relocation of polluting industries away from water bodies.",
    },
  },

  // ── Chapter 12: Lifelines of National Economy ─────────────────────────────

  {
    topicId: "sst_ch12_transport",
    subject: "Social Science",
    chapterNumber: 12,
    name: "Transport Networks of India — Roads, Railways, Waterways, Airways",
    prerequisite_knowledge: ["What is infrastructure", "Importance of transport for economic development", "India's geography — diverse terrain"],
    key_formulas: [
      "India's road network: ~6.2 million km — world's 2nd largest (after USA)",
      "National Highways: maintained by NHAI; ~2% of road network but carry ~40% of traffic",
      "Indian Railways: world's 4th largest rail network; ~67,000 km route length",
      "Major ports: Mumbai (Jawaharlal Nehru Port), Chennai, Kolkata (Haldia), Kochi, Vishakhapatnam",
      "Air transport: fastest but costly. Domestic: Delhi/Mumbai/Chennai airports are hubs",
    ],
    teaching_content: {
      intuition:
        "Transport is the circulatory system of an economy — without roads, railways, and ports, raw materials cannot reach factories, and finished goods cannot reach consumers. India's transport network had to be built across one of the world's most diverse terrains — the flat plains of Punjab, the Thar Desert, the Western Ghats, the Deccan Plateau, the Himalayas, and thousands of islands. The quality and reach of transport infrastructure directly determines which regions participate in the economy and which remain isolated.",
      process_explanation:
        "1. ROADWAYS:\n- India has ~6.2 million km of roads — world's 2nd largest network.\n- Types: National Highways (NHAI, ~1.48 lakh km), State Highways, District Roads, Rural Roads (PMGSY — Pradhan Mantri Gram Sadak Yojana)\n- Golden Quadrilateral: Delhi-Mumbai-Chennai-Kolkata highway connecting major cities (~5846 km). Part of NHDP.\n- North-South, East-West Corridors: connecting Srinagar to Kanyakumari and Silchar to Porbandar.\n2. RAILWAYS:\n- Established: 1853 (Bombay to Thane, 34 km, first rail journey)\n- Largest employer in India (~1.4 million employees)\n- Route length: ~67,000 km. Gauges: broad (most, 1.676m), metre (being converted), narrow (hills)\n- Rail zones: 18 zones. Zonal headquarters in major cities.\n- Problems: overcrowding, accidents, slow speed on many routes, electrification still incomplete.\n3. PIPELINES: Oil and natural gas (HBJ pipeline: Hazira-Vijaypur-Jagdishpur).\n4. WATERWAYS:\n- National Waterways: 111 declared; most important: NW-1 (Ganga, Allahabad-Haldia), NW-2 (Brahmaputra), NW-3 (West Coast Canal, Kerala)\n- Intracoastal: low cost, low pollution, ideal for bulk goods\n5. SEA TRANSPORT: India has 12 major ports + 200 minor ports. Mumbai (JNPT) handles ~65% of container traffic.\n6. AIRWAYS:\n- Air India (government), IndiGo, SpiceJet, Vistara (private)\n- Fastest but expensive — affordable for passengers, not bulk freight\n- India has ~500 airports/airstrips; ~100 operational for commercial service",
      worked_example:
        "Question: Why does India have such a large road network despite also having an extensive railway system?\nAnswer: Roads and railways serve different purposes and complement each other:\n1. Last-mile connectivity: Railways cannot reach every village. Roads provide last-mile connectivity — connecting farms, factories, and villages to railway stations.\n2. Flexibility: Roads allow door-to-door delivery; railways require fixed routes between fixed stations.\n3. Short distances: For journeys under 300 km, road transport is often faster when accounting for loading/unloading time at railway stations.\n4. Varied terrain: Railways are difficult to build in hills and forests (cost-prohibitive). Roads can reach areas where railways cannot.\n5. Population density: India has 600,000+ villages — roads are the only way to connect most of them.\nResult: roads carry ~85% of passenger traffic and ~70% of freight in India — more than railways despite the latter's huge capacity.",
      common_misconceptions: [
        "National Highways are NOT always high-speed motorways — many are still two-lane roads. The expressway system (Yamuna Expressway, Mumbai-Pune) is separate from the NH network.",
        "Indian Railways' 'world's largest employer' claim requires caution — it employs ~1.4 million directly but has declined from peak of 1.6 million due to outsourcing and automation.",
        "Sea transport is NOT slower for long-distance freight — a ship from Mumbai to Chennai is cheaper and often faster (when loading/unloading time is excluded) than road for bulk goods.",
      ],
      shortcuts_and_tricks: [
        "Golden Quadrilateral: Delhi-Mumbai-Chennai-Kolkata. 4 corners = 4 major cities. ~5846 km.",
        "First railway: 1853, Bombay to Thane, 34 km. India's Railway Day = April 16.",
        "Pipeline: HBJ = Hazira-Vijaypur-Jagdishpur (gas). Also: Mumbai-Pune-Manmad (oil).",
      ],
      diagram_description: "India transport map: Golden Quadrilateral (yellow), NH network, major ports (west: Mumbai/JNPT, Kochi; east: Chennai, Kolkata/Haldia, Visakhapatnam), major airports (Delhi, Mumbai, Chennai, Bengaluru, Kolkata). National Waterways (NW1 Ganga, NW2 Brahmaputra).",
      key_takeaway: "India has the world's 2nd largest road network (~6.2 million km) and 4th largest railway network (~67,000 km). The Golden Quadrilateral connects India's 4 largest cities. Waterways (NW1: Ganga, NW2: Brahmaputra) and 12 major ports handle cargo. Transport infrastructure directly determines regional economic participation.",
    },
  },

  {
    topicId: "sst_ch12_communication",
    subject: "Social Science",
    chapterNumber: 12,
    name: "Communication — Personal and Mass Media",
    prerequisite_knowledge: ["What is mass media", "Difference between radio and television broadcasting", "What is the internet"],
    key_formulas: [
      "Personal communication: postal, telephone, internet (person-to-person)",
      "Mass communication: radio, television, newspapers, internet (one-to-many)",
      "India Post: world's largest postal network — ~1.55 lakh post offices",
      "Telecommunications: India has 1.1 billion+ mobile subscribers (2nd largest globally after China)",
      "Satellite communication: INSAT system — for broadcasting, weather, disaster management",
    ],
    teaching_content: {
      intuition:
        "Communication technology has compressed space and time — a message that took weeks by mail in 1950 now reaches anywhere in the world in seconds via internet. India's communication transformation has been particularly dramatic: from a country where a telephone was a luxury in 1991 to one where a billion people own mobile phones in 2024. This transformation has empowered farmers (check prices before selling), students (access education remotely), and political movements (organise protests via social media) — fundamentally changing how Indian society works.",
      process_explanation:
        "1. POSTAL SERVICES:\n- India Post: ~1.55 lakh post offices — world's largest postal network\n- Importance: serves remote rural areas, handles money orders, postal banking (India Post Payments Bank)\n- Declining traditional mail; growing parcel delivery (e-commerce boom)\n2. TELECOMMUNICATIONS:\n- Mobile revolution: India went from 5 million subscribers (1996) to 1.1 billion (2024)\n- Telecom de-regulation (1994+) and competition drove down prices\n- Jio's entry (2016): free data for first year → mass adoption of 4G, internet\n- India now has one of the cheapest data plans globally\n3. INTERNET AND DIGITAL INDIA:\n- ~800 million internet users (2024)\n- UPI (Unified Payments Interface): India's digital payment system — handles $2+ trillion annually\n- e-governance: Aadhaar, DigiLocker, CoWIN (vaccine), IRCTC (rail booking)\n4. MASS MEDIA:\n- Radio: All India Radio (AIR/Akashvani) — reaches 92% of India's area, 99% of population. FM radio in cities.\n- Television: Doordarshan (public) + 1000+ private channels. India's TV industry = world's 2nd largest.\n- Newspapers: India has ~70,000 registered newspapers — one of world's largest print markets (despite digital growth)\n5. SATELLITE COMMUNICATION:\n- INSAT series: multipurpose — TV broadcasting, radio, weather forecasting, disaster warning, telecomunication\n- India's own space program (ISRO) builds and launches communication satellites",
      worked_example:
        "Question: How has mobile technology changed rural India?\nAnswer: Mobile phones have transformed rural Indian life in multiple dimensions:\n1. Market information: farmers can now check commodity prices at major markets (APMC mandis) before selling, reducing exploitation by middlemen who previously controlled information.\n2. Banking: mobile banking and UPI allow rural households to transact without travelling to a bank — mobile banking reaches villages without bank branches.\n3. Healthcare: telemedicine connects rural patients to urban doctors. ASHA workers use mobile apps to report health data.\n4. Education: e-learning platforms, YouTube tutorials reach rural students.\n5. Emergency services: ambulances and police can be called from remote locations.\n6. Social change: WhatsApp has replaced caste-based community networks — people now organise across caste lines through messaging groups.",
      common_misconceptions: [
        "India Post is NOT obsolete — it handles parcel delivery for e-commerce in rural areas where private couriers do not operate, and its postal banking serves unbanked rural populations.",
        "Digital India has NOT created universal digital access — the 'digital divide' means urban educated users benefit enormously while rural poor, women, and elderly are often excluded.",
        "All India Radio (Akashvani) is NOT just for rural areas — it continues to be the only broadcaster reaching 92% of India's geography, critical during disasters when internet and mobile networks fail.",
      ],
      shortcuts_and_tricks: [
        "India Post: 1.55 lakh post offices = world's largest. Rural banking function important.",
        "Mobile subscribers: 1.1 billion+ = 2nd globally. Jio 2016 = data price revolution.",
        "INSAT = satellite system for: TV + radio + weather + disaster management.",
      ],
      diagram_description: "Communication systems tree: Personal (postal, telephone, internet) vs Mass media (radio/AIR, TV/Doordarshan+private, newspapers, internet/social media). India telecom growth graph: 1991 (minimal) → 2000 (5M mobile) → 2016 (Jio launch) → 2024 (1.1B subscribers).",
      key_takeaway: "India's communication revolution: India Post (world's largest postal network), mobile phones (1.1 billion subscribers), and internet (~800 million users) have transformed the economy. Mass media through All India Radio (92% geographic reach), Doordarshan, and 1,000+ TV channels reach vast populations. INSAT satellites support all communication and weather systems.",
    },
  },

  {
    topicId: "sst_ch12_international_trade",
    subject: "Social Science",
    chapterNumber: 12,
    name: "India's Foreign Trade — Exports, Imports, and Major Ports",
    prerequisite_knowledge: ["What is trade balance/balance of payments", "Difference between import and export", "What is foreign exchange"],
    key_formulas: [
      "Export > Import = Trade surplus (favourable balance). Import > Export = Trade deficit (unfavourable).",
      "India's trade: historically deficit (imports > exports) due to oil imports",
      "India's top exports: petroleum products, engineering goods, gems+jewellery, pharmaceuticals, textiles",
      "India's top imports: crude oil, electronic components, gold, machinery",
      "India's major trading partners: USA (#1), China (#2), UAE (#3)",
      "WTO (1995): sets rules for international trade",
    ],
    teaching_content: {
      intuition:
        "No country is self-sufficient — India imports crude oil (it has limited reserves), electronic components (China dominates manufacturing), and gold (Indians love gold). India exports pharmaceuticals ('pharmacy of the world'), IT services, engineering goods, and textiles. The health of India's foreign trade — and the exchange rate of the rupee — affects millions of lives: oil prices determine inflation, export growth creates jobs, and trade policies shape which industries flourish or decline.",
      process_explanation:
        "1. INDIA'S TRADE PATTERN:\n- Historically deficit: India imports more than it exports (primarily because of crude oil import bill)\n- Oil alone = ~30-40% of India's total import value\n- Remittances from overseas Indians (~$100 billion/year) help offset the trade deficit\n2. KEY EXPORTS:\n- Petroleum products (refined, re-exported)\n- Engineering goods (machinery, transport equipment, steel)\n- Gems and jewellery (India: world's largest diamond-polishing centre, Surat)\n- Pharmaceuticals (generic drugs — India = 'pharmacy of the world')\n- Textiles and garments\n- IT/software services ($200B+ annually — but this is services export, recorded differently)\n3. KEY IMPORTS:\n- Crude petroleum (largest import item — ~30% of total)\n- Electronic components (smartphones, chips)\n- Gold (India = world's 2nd largest gold consumer; cultural demand for jewellery)\n- Machinery and equipment\n- Edible oils, pulses\n4. MAJOR PORTS:\n- Mumbai (JNPT/Nhava Sheva): India's largest container port, handles ~65% of container traffic\n- Kandla (Gujarat): largest by volume (bulk cargo)\n- Chennai: South India's major port\n- Kolkata/Haldia: serves eastern India, Nepal, Bhutan, Bangladesh\n- Kochi: natural deep-water port, important for spice exports\n- Vishakhapatnam: iron ore exports, naval port\n5. TRADE ORGANISATIONS:\n- WTO (1995): India is a member — negotiates trade rules. India sometimes opposes agricultural subsidy removal.\n- SAARC, ASEAN FTA: regional trade agreements.",
      worked_example:
        "Question: Why does India consistently run a trade deficit, and is it necessarily a problem?\nAnswer: India's trade deficit exists because:\n1. Crude oil: India imports ~85% of its oil (no significant domestic reserves). At high global oil prices, this creates a large import bill.\n2. Electronics: India imports most electronic components — the mobile phone you use was likely assembled partly from imported chips.\n3. Gold: Cultural affinity for gold means India constantly imports large volumes for jewellery.\nIs it a problem? Not necessarily:\n- Remittances (~$100 billion/year) from the Indian diaspora largely offset the deficit.\n- Services exports ($200B+ in IT/BPO) also compensate.\n- The deficit is 'structural' — reflecting India's development stage, not mismanagement.\n- However, a widening deficit during high oil prices puts pressure on the rupee exchange rate, causing inflation.",
      common_misconceptions: [
        "Trade deficit is NOT automatically 'bad' — it means you are importing goods that allow economic activity to continue (oil) or that consumers demand (electronics). Many rich countries run trade deficits.",
        "India's IT exports ($200B+) are NOT counted in 'merchandise trade' statistics — they are 'invisible exports' (services). India's actual external balance is better than merchandise trade figures suggest.",
        "Mumbai Port (Mumbai Docks) and JNPT are different — JNPT (Jawaharlal Nehru Port Trust, Navi Mumbai) is India's largest container port. Old Mumbai Docks handle less container traffic now.",
      ],
      shortcuts_and_tricks: [
        "India top 3 exports: Petroleum products + Engineering goods + Gems/Jewellery. Pharma = growing rapidly.",
        "India top 3 imports: Crude oil + Electronics + Gold. Oil = ~30-40% of total imports.",
        "Ports by specialty: JNPT (containers), Kandla (bulk volume), Kochi (deep water, spices), Vishakhapatnam (iron ore).",
      ],
      diagram_description: "India trade flow diagram: exports (petroleum products, engineering, gems, pharma) → world. Imports ← (crude oil, electronics, gold) world. Port map: Mumbai/JNPT (west), Kandla (northwest), Kochi (southwest), Chennai (southeast), Kolkata/Haldia (northeast), Visakhapatnam (east coast).",
      key_takeaway: "India runs a trade deficit primarily due to large crude oil and electronics imports. Top exports are petroleum products, engineering goods, gems/jewellery, and pharmaceuticals. India is the 'pharmacy of the world' and has the largest diamond-polishing industry (Surat). JNPT (Mumbai) handles the most container traffic; Kandla handles the largest cargo volume.",
    },
  },

];

async function run() {
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 15000 });
  let created = 0, updated = 0;
  for (const t of TOPICS) {
    const existing = await NcertTopicContent.findOne({ topicId: t.topicId });
    if (existing) {
      await NcertTopicContent.updateOne({ topicId: t.topicId }, { $set: t });
      updated++;
    } else {
      await NcertTopicContent.create(t);
      created++;
    }
  }
  console.log(`✅ SST Geography Content: ${created} created, ${updated} updated`);
  await mongoose.disconnect();
}
run().catch(e => { console.error(e); process.exit(1); });
