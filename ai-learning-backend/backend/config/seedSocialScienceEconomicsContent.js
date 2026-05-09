import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const TOPICS = [

  // ── Chapter 13: Development ───────────────────────────────────────────────

  {
    topicId: "sst_ch13_development_goals",
    subject: "Social Science",
    chapterNumber: 13,
    name: "Development Goals — Per Capita Income, Needs, and Trade-offs",
    prerequisite_knowledge: ["What is income", "What is GDP", "Concept of needs and wants"],
    key_formulas: [
      "Per Capita Income = National Income ÷ Total Population",
      "Development = improvement in per capita income + quality of life + sustainability",
      "World Bank criterion (2023): High income = >$13,845 per capita GNI; Low income = <$1,135",
      "Developmental goals are different for different people — no single definition",
    ],
    teaching_content: {
      intuition:
        "What does 'development' mean? Is a country 'developed' if it has high incomes but terrible air quality? Or is it 'developed' if it has good healthcare but low GDP? The key insight of this chapter is that development means different things to different people — a farmer wants a fair price for crops, a girl wants education, a worker wants job security. Per capita income is the most common measure, but it hides inequality (an average can be high even if most people are poor) and misses things like health, education, and environment.",
      process_explanation:
        "1. DIFFERENT DEVELOPMENT GOALS:\n- A landless labourer: wants more days of work, better wages\n- A prosperous farmer: wants higher crop prices, but this conflicts with the labourer's goal (higher crop prices = higher food costs for the poor)\n- A girl: wants equal opportunities as boys — safe environment, education, employment\n- These goals can CONFLICT — development is about managing trade-offs\n2. PER CAPITA INCOME:\n- Most common measure: National Income ÷ Population\n- World Bank classifies countries: low income (<$1,135), lower-middle, upper-middle, high income (>$13,845) — using GNI per capita\n- India: lower-middle income category\n3. LIMITATIONS OF PER CAPITA INCOME:\n- Hides distribution: if billionaires skew average upward, the median person may still be poor\n- Cannot measure: health, education, freedom, environment, happiness, security\n- Example: Punjab has higher per capita income than Kerala, but Kerala has better health and education outcomes\n4. NATIONAL DEVELOPMENT vs INDIVIDUAL DEVELOPMENT:\n- National goals = average measures (GDP growth, HDI)\n- Individual goals = specific to one's position (farmer vs worker vs student)\n- Good development policy must consider both, especially protect those left behind by market-driven growth",
      worked_example:
        "Question: Two regions, A and B, have the same per capita income. Is it correct to say they are equally developed?\nAnswer: No. Per capita income alone is insufficient to compare development:\n1. Distribution matters: Region A might have a few very rich people pulling up the average, while most people are poor. Region B might have more equal distribution.\n2. Non-income factors: Region A might have better hospitals and schools (higher life expectancy, literacy) despite the same average income.\n3. Sustainability: Region A's income might come from depleting its natural resources (mining) — unsustainable. Region B's income might be from sustainable services.\n4. Other goals: region A might have high crime, pollution, gender inequality alongside its high income.\nConclusion: always use multiple indicators when comparing development.",
      common_misconceptions: [
        "Higher per capita income does NOT necessarily mean better quality of life — USA has very high per capita income but lower life expectancy than many European countries due to healthcare inequality.",
        "Development is NOT a single universal goal — it is contested. Different groups (poor vs rich, men vs women, rural vs urban) have different priorities.",
        "Economic growth (GDP growth) is NOT the same as development — growth is necessary but insufficient. Growth without equity, sustainability, or social progress is not development.",
      ],
      shortcuts_and_tricks: [
        "Per capita income = proxy for average income. Easy to calculate. But limited — ignores distribution, non-income factors.",
        "World Bank income groups: Low (<$1,135) → Lower-middle → Upper-middle → High (>$13,845). India = lower-middle income.",
        "Punjab vs Kerala comparison: Punjab = higher per capita income. Kerala = better health + education. Shows income ≠ development.",
      ],
      diagram_description: "Conflicting development goals diagram: farmer (higher crop prices) ↔ labourer (lower food prices). Girl (equal opportunities) vs patriarchal society. National income distribution: same average, different distribution. Kerala vs Punjab comparison table.",
      key_takeaway: "Development has different meanings for different people, and development goals can conflict. Per capita income is a useful but limited measure — it hides distribution, ignores health/education/environment, and cannot capture sustainability. Development must address multiple dimensions, not just average income.",
    },
  },

  {
    topicId: "sst_ch13_hdi",
    subject: "Social Science",
    chapterNumber: 13,
    name: "Human Development Index (HDI) and Sustainable Development",
    prerequisite_knowledge: ["What is per capita income", "What are literacy rates and life expectancy", "Concept of sustainability"],
    key_formulas: [
      "HDI = composite of: Life Expectancy Index + Education Index + Income Index",
      "Life expectancy at birth: India ~67-70 years (2023)",
      "Literacy rate: India ~77% (2022)",
      "HDI range: 0 (lowest) to 1 (highest)",
      "Sustainable Development Goal: meeting present needs without compromising future generations (Brundtland 1987)",
    ],
    teaching_content: {
      intuition:
        "Mahbub ul Haq and Amartya Sen argued in the 1990 UNDP report that development should be measured by people's capabilities — their ability to live long, healthy, educated lives — not just their income. The HDI was their answer: a single number that captures three dimensions: life expectancy (can people live long?), education (can people read, learn, access knowledge?), and income (can people afford a decent standard of living?). This was revolutionary — it shifted the development conversation from 'how much does a country produce?' to 'what can people actually do and be?'",
      process_explanation:
        "1. THREE COMPONENTS OF HDI:\n- Health: Life expectancy at birth (number of years a newborn is expected to live)\n- Education: Mean years of schooling (adults) + Expected years of schooling (children)\n- Income: Gross National Income per capita (in PPP dollars — adjusted for purchasing power)\n2. HDI CALCULATION: Each dimension scored 0-1; HDI = geometric mean of three scores\n3. INDIA'S HDI:\n- India's HDI: ~0.633 (2022) — medium human development category\n- Ranks ~132/191 countries\n- Better HDI than per capita income rank would suggest (income rank would be lower)\n4. WITHIN-INDIA VARIATION:\n- Kerala: highest HDI state (~0.78) — high literacy, life expectancy\n- Bihar: lowest HDI state (~0.57) — low literacy, income\n- Goa: high per capita income but also high HDI\n5. LIMITATIONS OF HDI:\n- Doesn't capture: inequality (a separate IHDI index exists), sustainability, political freedom, gender equality (separate GII index)\n- Country average hides regional/caste/gender disparities\n6. SUSTAINABLE DEVELOPMENT:\n- Development that meets present needs without compromising future generations\n- Three pillars: economic (growth), social (equity), environmental (conservation)\n- UN SDGs (Sustainable Development Goals): 17 goals adopted 2015, target 2030",
      worked_example:
        "Question: Why does Kerala rank much higher on HDI than on per capita income in India?\nAnswer: Kerala ranks high on HDI despite moderate per capita income because:\n1. Life expectancy: Kerala has India's highest life expectancy (~75 years) due to excellent public healthcare, widespread access to primary health centres.\n2. Literacy: Kerala has near-universal literacy (96%+) — result of over a century of investment in education, including by princely states and Christian missionaries.\n3. Social indicators: low infant mortality, good gender ratio (women outnumber men — unusual in India), high female literacy and employment.\n4. Why? Kerala's 'social development first' approach: land reform (1970) redistributed land, strong public healthcare, strong public education, powerful trade unions ensuring worker rights.\nLesson: health and education investments improve HDI independently of income growth.",
      common_misconceptions: [
        "High HDI does NOT require high income — Cuba and Kerala show you can achieve excellent health and education outcomes with moderate incomes through public investment.",
        "HDI is NOT a perfect measure — it doesn't capture inequality (rich-poor gap within a country), political freedom, or sustainability. UNDP now publishes companion indices for these.",
        "Sustainable development does NOT mean zero economic growth — it means growth that does not deplete natural capital faster than it regenerates, and that invests in future generations.",
      ],
      shortcuts_and_tricks: [
        "HDI = 3 components: Life Expectancy + Education (years of schooling) + GNI per capita. Geometric mean.",
        "India HDI rank ~132. Kerala = best state. Bihar = lowest. Kerala paradox: high HDI, moderate income.",
        "Brundtland Commission 1987 = sustainable development definition. SDGs 2015 = UN's 17 goals by 2030.",
      ],
      diagram_description: "HDI triangle: three vertices = Health (life expectancy), Education (schooling years), Income (GNI per capita). India vs Kerala vs Bihar comparison table. Sustainable development Venn: economic (circle 1) + social (circle 2) + environmental (circle 3) overlapping = sustainable development at centre.",
      key_takeaway: "HDI measures human development across three dimensions: life expectancy, education, and per capita income. India's HDI is ~0.633 (medium, rank ~132). Kerala achieves high HDI despite moderate income through public investment in health and education. Sustainable development requires meeting present needs without compromising future generations — the UN's 17 SDGs (2015) operationalise this.",
    },
  },

  // ── Chapter 14: Sectors of the Indian Economy ─────────────────────────────

  {
    topicId: "sst_ch14_sectors",
    subject: "Social Science",
    chapterNumber: 14,
    name: "Three Sectors of the Economy — Primary, Secondary, Tertiary",
    prerequisite_knowledge: ["What is GDP", "Difference between agriculture and manufacturing", "What is a service"],
    key_formulas: [
      "Primary sector: extracts from nature (agriculture, fishing, mining, forestry)",
      "Secondary sector: transforms natural products into manufactured goods (industry, construction)",
      "Tertiary sector (Services): provides services using primary + secondary outputs (banking, transport, health, education, IT)",
      "GDP = Value Added by Primary + Secondary + Tertiary sectors",
      "India's GDP share (2022): Primary ~15%, Secondary ~28%, Tertiary ~57%",
    ],
    teaching_content: {
      intuition:
        "Every economy can be divided into three interlocking sectors: Primary (growing food, mining resources), Secondary (turning those resources into products), and Tertiary (the services that make everything work — banking, transport, health, education). The remarkable story of modern economies is the shift from primary to tertiary dominance: in 1950s India, agriculture was 50% of GDP; today it is only 15%. But millions of people still work in agriculture despite its shrinking GDP share — creating the fundamental challenge of Indian economic development.",
      process_explanation:
        "1. PRIMARY SECTOR:\n- Activities that extract value directly from nature\n- Agriculture (crops, livestock, fisheries), forestry, mining\n- India's GDP share: ~15% but employs ~45% of workforce → low productivity\n- Development stage indicator: high primary = early stage of development\n2. SECONDARY SECTOR:\n- Manufacturing, construction, utilities\n- Transforms primary products: cotton → cloth, iron ore → steel\n- India's GDP share: ~28%, employs ~25% of workforce\n3. TERTIARY SECTOR:\n- Services: banking, insurance, transport, trade, government, education, healthcare, IT\n- Does not produce physical goods but is essential for primary and secondary to function\n- India's GDP share: ~57%, employs ~30% of workforce\n- India's IT/BPO sector is world-famous — tertiary sector strength\n4. HISTORIC SHIFT:\n- Pre-industrialisation: primary dominant everywhere\n- After Industrial Revolution: secondary grows\n- Post-industrialisation (developed economies): tertiary dominates\n- India skipped the secondary phase somewhat — went directly to tertiary (IT services) without building a large manufacturing base\n5. VALUE ADDED:\n- GDP is calculated by value added at each stage (to avoid double counting)\n- A farmer grows wheat (primary) → miller makes flour (secondary) → baker makes bread (tertiary service of selling) → final price minus intermediate value = value added",
      worked_example:
        "Question: How is value added calculated, and why is it important for measuring GDP accurately?\nAnswer: Value added = output value minus input costs (value of intermediate goods).\nExample: Cotton value chain:\n1. Farmer sells raw cotton: ₹100 → primary sector value added = ₹100\n2. Mill buys cotton (₹100), makes yarn worth ₹180 → secondary value added = ₹80\n3. Weaver buys yarn (₹180), makes cloth worth ₹250 → secondary value added = ₹70\n4. Shopkeeper buys cloth (₹250), sells at ₹300 → tertiary value added = ₹50\nTotal GDP contribution from this chain = ₹100 + ₹80 + ₹70 + ₹50 = ₹300 (= final price).\nIf we simply added all sales values: ₹100 + ₹180 + ₹250 + ₹300 = ₹830 → massive double counting. Value added prevents this.",
      common_misconceptions: [
        "Tertiary sector is NOT necessarily 'better' or more advanced than primary — a subsistence farmer and an IT engineer are both essential; tertiary dominance reflects economic complexity, not superiority.",
        "India's large tertiary sector does NOT mean India is a 'developed' economy — unlike Western countries, India's tertiary dominance coexists with massive primary sector employment (45% in agriculture), showing structural imbalance.",
        "Services cannot fully replace manufacturing — goods (phones, cars, machines) must be manufactured. India's relative weakness in manufacturing is a genuine economic challenge.",
      ],
      shortcuts_and_tricks: [
        "Primary = Nature (extract). Secondary = Manufacturing (transform). Tertiary = Services (facilitate).",
        "India's GDP shares: Primary 15%, Secondary 28%, Tertiary 57%. Employment: Primary 45%, Secondary 25%, Tertiary 30%.",
        "Gap = low agricultural productivity. Many people, small GDP share = low income per farmer.",
      ],
      diagram_description: "Three-sector pyramid: Primary (base, nature) → Secondary (middle, manufacturing) → Tertiary (top, services). India comparison: GDP share pie (primary 15%, secondary 28%, tertiary 57%) vs employment pie (primary 45%, secondary 25%, tertiary 30%). Gap = productivity difference.",
      key_takeaway: "The economy divides into Primary (agriculture/mining), Secondary (manufacturing), and Tertiary (services) sectors. India's GDP is dominated by tertiary (57%) but 45% of the workforce is in primary agriculture — revealing low agricultural productivity. GDP is calculated using value added at each stage to avoid double-counting.",
    },
  },

  {
    topicId: "sst_ch14_employment",
    subject: "Social Science",
    chapterNumber: 14,
    name: "Organised vs Unorganised Sector and Employment",
    prerequisite_knowledge: ["What is formal employment", "Concept of minimum wage and labour laws", "What is the informal economy"],
    key_formulas: [
      "Organised sector: registered with government, workers have employment contracts, follow labour laws",
      "Unorganised sector: not registered, no contracts, seasonal/irregular, no job security",
      "~93% of India's workforce is in unorganised sector",
      "MGNREGA (2005): guarantees 100 days of minimum wage work per year to rural households",
    ],
    teaching_content: {
      intuition:
        "Most Indians — 93% of the workforce — work in the informal or unorganised sector: the vegetable vendor, the construction worker, the domestic helper, the street food seller. They have no employment contract, no protection against arbitrary dismissal, no paid leave, no provident fund, no ESI (health insurance). When they get sick or old, they have nothing. The organised sector (government jobs, large companies) offers all these protections — but employs only 7% of workers. This 93:7 split is India's most fundamental labour market challenge.",
      process_explanation:
        "1. ORGANISED SECTOR:\n- Registered under government regulations\n- Follow labour laws (Minimum Wages Act, Payment of Wages Act, Factories Act)\n- Workers get: fixed contracts, paid leave, pension (PF), health insurance (ESI), protection against arbitrary dismissal\n- Examples: government employees, workers in large companies (Tata, Infosys), bank employees, teachers in registered schools\n2. UNORGANISED SECTOR:\n- Small workshops, roadside stalls, domestic workers, construction sites\n- Not registered, workers have no contracts\n- Seasonal employment (farm workers employed only during sowing/harvest)\n- Vulnerable to: wage theft, dangerous conditions, arbitrary dismissal, child labour\n- Examples: farm labourers, construction workers, domestic workers, street vendors, bidi (cigarette) rollers\n3. SCALE: ~93% of India's workforce, but they contribute ~50% of GDP (enormous contribution despite poor conditions)\n4. GOVERNMENT INTERVENTIONS:\n- MGNREGA (Mahatma Gandhi National Rural Employment Guarantee Act, 2005): guarantees 100 days/year minimum wage work to rural households → provides safety net\n- Minimum Wages Act: sets floor wages for unorganised workers (enforcement poor)\n- PM-KISAN, PM Jan Dhan Yojana: direct benefit transfers to help unorganised workers\n5. RURAL-URBAN DIVISION:\n- Rural unorganised: farm workers, artisans\n- Urban unorganised: construction workers, street vendors, domestic workers, rickshaw pullers",
      worked_example:
        "Question: Why do most workers prefer organised sector jobs despite their scarcity?\nAnswer: Organised sector jobs offer crucial protections that unorganised sector workers lack:\n1. Job security: cannot be dismissed without due process and compensation\n2. Regular income: monthly salary regardless of season or market conditions\n3. Social security: Provident Fund (retirement savings), ESI (health insurance), gratuity\n4. Working conditions: regulated hours (48/week max), mandatory safety equipment\n5. Legal recourse: can approach labour court for grievances\n6. Dignity: formal employment comes with social status\nUnorganised workers have none of these — a construction worker who is injured has no compensation; a farm labourer in a drought year earns nothing. The desperation for organised sector government jobs in India reflects the stark difference in security and dignity between the two sectors.",
      common_misconceptions: [
        "Unorganised sector workers are NOT unskilled — carpenters, tailors, cobblers, mechanics are highly skilled but work informally. 'Unorganised' refers to legal status, not skill level.",
        "MGNREGA is NOT free money — it provides employment (in exchange for public works: roads, ponds, plantations) at minimum wage, not unconditional cash transfers.",
        "The unorganised sector is NOT disappearing — globalisation and technology have actually increased informal work in some sectors (gig economy: Ola drivers, Swiggy delivery workers are a new form of unorganised labour).",
      ],
      shortcuts_and_tricks: [
        "Organised = registered + contracts + labour law compliance. Unorganised = informal, no protections.",
        "93% workforce = unorganised. Government employees + large company workers = organised (7%).",
        "MGNREGA 2005 = 100 days guaranteed work/year for rural households at minimum wage.",
      ],
      diagram_description: "Two circles: Organised sector (7% workforce: factories, govt, banks — with benefits list: contract, PF, ESI, leave) vs Unorganised sector (93% workforce: farm, construction, vendors — vulnerability list: no contract, no security, seasonal work, child labour). MGNREGA bridge: govt provides safety net for rural unorganised.",
      key_takeaway: "93% of India's workers are in the unorganised sector — no contracts, no job security, no social protection. The organised sector (7%) offers legal protections: contracts, provident fund, ESI. MGNREGA (2005) guarantees 100 days of minimum wage work per year to rural households as a safety net. The challenge is extending formal protections to unorganised workers.",
    },
  },

  {
    topicId: "sst_ch14_services_sector",
    subject: "Social Science",
    chapterNumber: 14,
    name: "Growth of the Services Sector and India's IT Industry",
    prerequisite_knowledge: ["What is a service economy", "What is outsourcing", "India's education system"],
    key_formulas: [
      "India's IT/BPO export revenue: $245 billion (FY2023-24)",
      "IT industry employs: ~5.4 million directly, ~16 million indirectly",
      "Major IT cities: Bengaluru, Hyderabad, Pune, Chennai, Delhi-NCR, Mumbai",
      "IT company examples: TCS, Infosys, Wipro, HCL (Indian); Accenture, IBM, Cognizant (MNC in India)",
    ],
    teaching_content: {
      intuition:
        "India's IT revolution is one of the most remarkable stories in 20th-century economic history. In 1991, India was a poor country with limited telephones. By 2024, India is the world's #1 IT services exporter — writing software for banks, hospitals, airlines, and governments across the world. This was built on three ingredients: English-language education (colonial legacy), a large engineering graduate supply (IITs, RECs), and cheap international communication (internet revolution from mid-1990s). The IT sector transformed Bengaluru from a quiet garden city to a global technology hub.",
      process_explanation:
        "1. WHY INDIA'S IT SECTOR GREW:\n- English proficiency: unlike Japan or Germany, India's technical professionals work in English — the global business language.\n- Large engineering talent pool: IITs (1950s-), NITs, and thousands of engineering colleges produce ~1.5 million engineers annually.\n- Cost advantage: Indian software engineers cost 1/5 to 1/8 of US counterparts at equivalent skills.\n- Time zone: India's working day overlaps with US morning AND UK afternoon — enabling 24/7 global service.\n- Internet revolution (mid-1990s): cheap international bandwidth made offshore IT delivery economically viable.\n2. SERVICES SECTOR CATEGORIES:\n- Trade, hotels, transport: wholesale/retail trade, hospitality, logistics\n- Finance, insurance, real estate: banking, insurance, stock markets\n- Community, social, personal services: government, education, health, domestic services\n- IT and ITES (IT-enabled services): software development, BPO, KPO\n3. IT SECTOR SPECIFICS:\n- Products: software packages, mobile apps, enterprise software (ERP, CRM)\n- Services: application development, maintenance, testing, IT consulting\n- BPO: customer service (call centres), data entry, back-office processing\n- KPO: higher-value services — legal research, financial analysis, drug discovery support\n4. CHALLENGES:\n- Automation and AI: routine coding tasks being automated\n- US visa restrictions (H-1B): limits on Indian IT workers in USA\n- Campus vs industry skills gap: engineering graduates often need retraining\n- Regional concentration: Bengaluru, Hyderabad, Pune, Chennai — rest of India excluded",
      worked_example:
        "Question: Why has India's service sector (IT specifically) grown so much while manufacturing remains relatively small?\nAnswer: India's IT sector grew because of comparative advantages (English, engineers, cheap labour) meeting global demand (cost reduction through outsourcing). Manufacturing didn't grow as fast due to:\n1. Infrastructure gap: unreliable power, poor roads, and ports increased manufacturing costs.\n2. Land acquisition: complex regulations made acquiring large industrial land parcels difficult.\n3. Labour laws: rigid labour laws made hiring/firing difficult, deterring large-scale manufacturing.\n4. Competition: China's manufacturing dominance made competing in most sectors very difficult.\n5. Policy focus: government and education system invested in engineering/IT over manufacturing skills.\nResult: India's economy followed an unusual path — from primary (agriculture) to tertiary (services), largely skipping the secondary (manufacturing) phase that characterised industrialisation in Europe, USA, Japan, and China.",
      common_misconceptions: [
        "IT sector is NOT just 'call centres' — India's IT includes sophisticated software engineering, cloud computing, cybersecurity, and AI/ML research at companies like Google, Microsoft, and Amazon's India centres.",
        "IT sector does NOT employ most Indians — it employs ~5.4 million, while agriculture employs 600+ million. IT is important economically but is not a mass employer.",
        "Services sector growth does NOT mean manufacturing is unimportant — India's 'Make in India' initiative recognises that services alone cannot provide enough employment for India's growing working-age population.",
      ],
      shortcuts_and_tricks: [
        "India IT strengths: English + engineers + cost advantage + time zone overlap with USA/Europe.",
        "IT revenue: $245B FY24. Employs 5.4M directly. Bengaluru = 'Silicon Valley of India'.",
        "BPO < KPO < IT services (value hierarchy): basic data entry → analysis → software development.",
      ],
      diagram_description: "IT value chain: BPO (call centre, data entry) → KPO (research, analysis) → IT services (software development) → R&D (innovation). India IT city map: Bengaluru, Hyderabad, Pune, Chennai, Delhi-NCR highlighted. Revenue growth chart 2000-2024.",
      key_takeaway: "India's tertiary sector (57% of GDP) is driven by the world's largest IT services industry ($245B exports, 2024), built on English proficiency, large engineering talent supply, and cost advantages. However, IT employs only 5.4 million — insufficient for India's 500M+ workforce. Services sector growth does not substitute for manufacturing; India needs both for inclusive employment.",
    },
  },

  // ── Chapter 15: Money and Credit ──────────────────────────────────────────

  {
    topicId: "sst_ch15_money",
    subject: "Social Science",
    chapterNumber: 15,
    name: "Money — Evolution from Barter to Modern Currency",
    prerequisite_knowledge: ["What is barter trade", "Concept of value and exchange", "What is a bank"],
    key_formulas: [
      "Barter: direct exchange of goods without money",
      "Double coincidence of wants: problem of barter — both parties must simultaneously want what the other offers",
      "Money functions: medium of exchange + store of value + unit of account + standard of deferred payment",
      "Demand deposits: money held in bank accounts, withdrawable on demand via cheque",
      "Currency = coins + notes. M1 = currency + demand deposits",
    ],
    teaching_content: {
      intuition:
        "Before money, trade required the 'double coincidence of wants' — a farmer who had wheat and wanted cloth had to find a weaver who had cloth AND wanted wheat. The rarity of this coincidence severely limited trade. Money solves this by being a universally accepted medium — everyone accepts it, so a farmer can sell wheat for money and then use that money to buy anything from anyone. This seemingly simple innovation underpinned all of human economic development.",
      process_explanation:
        "1. PROBLEMS WITH BARTER:\n- Double coincidence of wants: seller must find a buyer who wants exactly what she has AND has what she wants\n- Indivisibility: if a cow is worth 100 pots, how do you buy 1 pot with a portion of a cow?\n- No store of value: perishable goods cannot store value (wheat rots)\n- No standard unit: how do you compare the value of a goat to a piece of cloth?\n2. EVOLUTION OF MONEY:\n- Commodity money: grain, cattle, shells (cowrie shells used in India until 19th century)\n- Metallic coins: standardised, durable, divisible. Gold/silver coins in ancient India (Mauryan period)\n- Paper currency: China first (Song Dynasty, ~1000 CE). British India: standardised paper currency.\n- Fiat money: modern currency — value by government decree, not intrinsic metallic value\n- Digital money: electronic bank transfers, UPI, cryptocurrency\n3. FUNCTIONS OF MONEY (4 functions):\n- Medium of exchange: accepted in all transactions\n- Store of value: save purchasing power for the future\n- Unit of account: express prices in common unit (₹)\n- Standard of deferred payment: settle future obligations (loans, contracts)\n4. DEMAND DEPOSITS:\n- Money held in savings/current bank accounts\n- Can be withdrawn anytime ('on demand') via ATM or cheque\n- Accepted as payment (cheque = order to bank to pay)\n- Functionally = money, as widely accepted as currency\n5. RBI'S ROLE:\n- Issues currency notes and coins\n- Only RBI can issue ₹2 and above notes; Ministry of Finance issues ₹1 note and coins",
      worked_example:
        "Question: Explain how demand deposits serve as money without being physical currency.\nAnswer: Demand deposits (bank account balances) function as money because:\n1. Transfer: a cheque instructs the bank to transfer money from one account to another — no physical cash changes hands.\n2. Acceptance: large payments (rent, business purchases) are routinely made by cheque or NEFT/IMPS/UPI — businesses and individuals accept these because the underlying bank balance is as reliable as cash.\n3. Scale: in developed economies and increasingly in India, more money circulates as bank transfers than as physical currency.\n4. Safety: keeping ₹1 lakh in bank is safer than keeping ₹1 lakh in cash at home.\nConclusion: demand deposits count as 'money' (included in M1 money supply) because they perform all functions of money: accepted in exchange, store value, unit of account, used for deferred payment.",
      common_misconceptions: [
        "Fiat money is NOT worthless just because it's not gold-backed — it has value because the government mandates it as legal tender AND because everyone accepts it. The government's credibility is the backing.",
        "A cheque is NOT money itself — it is an instrument that transfers demand deposit money. The cheque is worthless if the account is empty.",
        "Digital payments (UPI) are NOT creating new money — they transfer existing money between bank accounts more efficiently.",
      ],
      shortcuts_and_tricks: [
        "4 functions of money: MED = Medium of exchange, STORE = store of value, UNIT = unit of account, DEFER = standard of deferred payment.",
        "Demand deposits = bank account balance. Cheque = instruction to transfer demand deposit.",
        "Evolution: barter → commodity money → metallic coins → paper currency → digital money.",
      ],
      diagram_description: "Evolution timeline: Barter (double coincidence problem) → Commodity money (grain/shells) → Metallic coins (standardised, durable) → Paper currency (fiat, government-backed) → Digital money (UPI, cards). 4-function wheel: medium/store/unit/deferred payment.",
      key_takeaway: "Money solves the 'double coincidence of wants' problem of barter by providing a universally accepted medium of exchange. Modern money evolved from commodity money to metallic coins to paper currency (fiat money) to digital money. Money serves four functions: medium of exchange, store of value, unit of account, and standard of deferred payment. Demand deposits (bank balances) function as money alongside physical currency.",
    },
  },

  {
    topicId: "sst_ch15_banking",
    subject: "Social Science",
    chapterNumber: 15,
    name: "Banking — Credit Creation and RBI Regulation",
    prerequisite_knowledge: ["What is a bank", "Concept of interest rate", "What is the Reserve Bank of India"],
    key_formulas: [
      "Banks accept deposits at lower interest rate and lend at higher rate → profit = spread",
      "Credit multiplier: bank keeps a fraction (CRR) as reserve, lends the rest → creates multiple deposits",
      "Cash Reserve Ratio (CRR): minimum % of deposits banks must keep with RBI",
      "Statutory Liquidity Ratio (SLR): % of deposits banks must invest in govt securities",
      "Repo rate: rate at which RBI lends to banks (monetary policy tool)",
    ],
    teaching_content: {
      intuition:
        "Banks do something magical: they take ₹100 from a depositor, keep ₹15 as reserve, and lend ₹85 to a borrower. That borrower deposits ₹85 in another bank, which keeps ₹12.75 and lends ₹72.25. This chain continues, turning the original ₹100 into potentially ₹666 in total bank deposits. This is credit creation — banks 'create' money through lending. The RBI controls this process by setting the CRR and repo rate, which is why monetary policy can stimulate or cool the economy.",
      process_explanation:
        "1. HOW BANKS WORK:\n- Accept deposits (pay interest to depositors)\n- Lend to borrowers (charge higher interest)\n- Profit = interest charged minus interest paid (spread)\n- Example: pay depositor 4%, lend to borrower at 8% → 4% profit margin\n2. CREDIT CREATION (fractional reserve banking):\n- Bank A: receives ₹1000 deposit. CRR = 10%. Keeps ₹100, lends ₹900.\n- Bank B: receives ₹900 deposit. Keeps ₹90, lends ₹810.\n- Chain continues... Total deposits created = ₹1000 × (1/CRR) = ₹10,000\n- Credit multiplier = 1/CRR\n3. RBI'S TOOLS:\n- CRR (Cash Reserve Ratio): if CRR rises → banks keep more with RBI → less to lend → credit contracts\n- SLR (Statutory Liquidity Ratio): banks must hold % of deposits in govt securities → further limits lending\n- Repo Rate: rate RBI charges banks for short-term borrowing. Higher repo rate → banks borrow less from RBI → raise their lending rates → credit becomes expensive → demand cools\n- Reverse Repo Rate: rate RBI pays banks for parking funds with RBI\n4. TYPES OF BANK CREDIT:\n- Overdraft: business can withdraw more than balance (up to limit)\n- Cash credit/working capital loan: short-term business credit\n- Term loan: long-term (housing, machinery) — fixed EMIs\n- Letter of credit: bank guarantees payment to seller on buyer's behalf (trade finance)\n5. BANK REGULATION:\n- RBI: India's central bank. Issues currency, regulates commercial banks, manages inflation.\n- Commercial banks: SBI, HDFC, ICICI, Axis, PNB, etc.\n- Regional Rural Banks (RRBs): serve rural areas\n- Cooperative banks: serve agricultural credit needs",
      worked_example:
        "Question: How does RBI use the repo rate to control inflation?\nAnswer: When inflation rises (prices increasing too fast):\n1. RBI raises the repo rate — it now charges commercial banks more to borrow funds.\n2. Commercial banks raise their lending rates (home loans, car loans, business loans become more expensive).\n3. Households and businesses borrow less — reduced demand for loans.\n4. Less borrowing = less spending = reduced demand for goods and services.\n5. Reduced demand → producers cannot raise prices → inflation slows.\nConversely, when the economy slows (recession risk), RBI cuts repo rate → cheaper loans → more borrowing → more spending → economic stimulus.\nThis is monetary policy: RBI uses repo rate as its primary tool to balance growth and inflation.",
      common_misconceptions: [
        "Banks do NOT lend the same money that depositors put in — they create new purchasing power through credit creation. The original deposit 'multiplies' through the banking system.",
        "RBI does NOT print money whenever the government needs money — the RBI Act restricts this to prevent hyperinflation. Government borrowing from RBI is limited.",
        "High interest rates do NOT always slow inflation — in supply-side inflation (e.g., oil price shock), higher interest rates reduce demand but cannot solve the underlying supply problem.",
      ],
      shortcuts_and_tricks: [
        "CRR up → credit down. CRR down → credit up. Same logic for repo rate (rate up → credit expensive → credit down).",
        "Credit multiplier = 1/CRR. If CRR = 10% (0.1), multiplier = 10. ₹1000 → ₹10,000 in total deposits.",
        "Repo rate = RBI's main tool. Currently (2024): 6.5%. Higher repo = tighter money = controls inflation.",
      ],
      diagram_description: "Credit creation chain: Deposit ₹1000 → Bank keeps CRR (10%) = ₹100, lends ₹900 → next bank: ₹900 deposit, lends ₹810 → chain continues → total deposits created = ₹10,000. RBI policy tools diagram: CRR + SLR + Repo Rate → controls credit creation.",
      key_takeaway: "Banks create credit through fractional reserve banking — keeping only a fraction (CRR) of deposits and lending the rest, multiplying the original deposit into many times its value. The RBI regulates this process through CRR, SLR, and repo rate — raising rates to control inflation, lowering to stimulate growth. This is monetary policy.",
    },
  },

  {
    topicId: "sst_ch15_credit",
    subject: "Social Science",
    chapterNumber: 15,
    name: "Formal vs Informal Credit Sources and Financial Inclusion",
    prerequisite_knowledge: ["What is collateral", "What is a Self Help Group (SHG)", "Concept of interest rate and debt"],
    key_formulas: [
      "Formal credit: regulated by RBI (banks, cooperatives, microfinance) — lower interest",
      "Informal credit: unregulated (moneylenders, traders, landlords, family) — higher, exploitative rates",
      "SHG (Self Help Group): 15-20 members pool savings, lend to each other, get bank loans using group guarantee",
      "PMJDY (2014): universal banking — every household gets a bank account",
      "Debt trap: borrow to repay old loans → spiralling debt with no exit",
    ],
    teaching_content: {
      intuition:
        "In rural India, the moneylender is often the only source of credit when a farmer's crop fails or a family member falls ill. He charges 5% per month (60% per year), takes the borrower's land as collateral, and if the borrower defaults, takes the land. This is not historical — it is current reality for millions of poor Indians. The challenge of financial inclusion — giving poor people access to affordable formal credit — is one of the most important development challenges India faces.",
      process_explanation:
        "1. FORMAL CREDIT SOURCES:\n- Commercial banks (SBI, HDFC, etc.)\n- Cooperative banks and credit societies\n- Regional Rural Banks (RRBs)\n- Microfinance institutions (MFIs): small loans to poor without traditional collateral\n- Government schemes (Mudra, KCC — Kisan Credit Card)\n- Interest rates: 8-12% per annum (regulated)\n2. INFORMAL CREDIT SOURCES:\n- Moneylenders: most common informal source, often charge 24-120%+ per annum\n- Traders/merchants: advance money against future crop at below-market prices\n- Landlords: often charge interest in kind (crop share)\n- Friends and relatives: usually interest-free but limited amounts\n3. WHY POOR DEPEND ON INFORMAL CREDIT:\n- No collateral: banks require assets as security; poor don't have property documents\n- No credit history: banks prefer borrowers with track record\n- Distance: banks far from villages; moneylender is in the village\n- Convenience: moneylender gives cash within hours; bank loan takes weeks of documentation\n4. SELF-HELP GROUPS (SHGs):\n- 15-20 members (mostly women), pool small savings (₹50-100/month)\n- Lend to members at reasonable rates (~2% per month)\n- After 6 months, bank provides larger loan to the group (using group guarantee as collateral)\n- Eliminates need for individual collateral\n- Result: 10+ million SHGs in India, transforming rural credit access\n5. FINANCIAL INCLUSION INITIATIVES:\n- PMJDY 2014: ~500 million bank accounts opened for unbanked households\n- UPI: digital payments accessible to all\n- Kisan Credit Card: agricultural credit at subsidised rates\n- Mudra Yojana: micro enterprise loans without collateral",
      worked_example:
        "Question: How do SHGs provide credit access without traditional collateral?\nAnswer: SHGs solve the collateral problem through social collateral — the group itself guarantees the loan:\n1. Group formation: 15-20 women (usually from same village) form an SHG, pooling monthly savings.\n2. Internal lending: members can borrow from the group fund at ~2% per month — much less than moneylenders.\n3. Group bank loan: after 6 months of regular savings and repayment, the SHG qualifies for a bank loan.\n4. Social guarantee: if one member defaults, the group is responsible. Peer pressure and social relationships ensure very high repayment rates (~95%+).\n5. Result: each member gets access to credit sized to her needs, without pledging land or gold as collateral.\nBeyond credit, SHGs build women's confidence, financial literacy, and collective bargaining power — making them a powerful tool for women's empowerment in rural India.",
      common_misconceptions: [
        "Moneylenders are NOT always villains — in remote areas without banks, they provide the only available credit. The problem is their monopoly power and lack of regulation.",
        "SHGs do NOT eliminate the need for banks — they work best when linked to formal banking. SHG-Bank Linkage Programme (RBI-led since 1992) is the world's largest microfinance programme.",
        "PMJDY bank accounts are NOT sufficient for financial inclusion — having an account is step 1. Getting affordable credit, insurance, and financial literacy is the harder problem.",
      ],
      shortcuts_and_tricks: [
        "Formal = banks/cooperatives/RRBs/MFIs → regulated, lower rate. Informal = moneylenders/traders → unregulated, high rate.",
        "SHG: 15-20 members + pool savings + group guarantee = access to bank credit without individual collateral.",
        "PMJDY 2014 = Jan Dhan Yojana = every household a bank account = financial inclusion flagship.",
      ],
      diagram_description: "Credit source diagram: formal (banks, cooperatives, MFIs) vs informal (moneylenders, traders, landlords, family). Rate comparison: formal 8-12% annual vs informal 60-120%+. SHG mechanism: 15-20 women → pool savings → internal loans → SHG-bank linkage → larger loans. PMJDY impact: 500M new accounts.",
      key_takeaway: "Formal credit (banks, cooperatives) is cheaper (8-12% per annum) but requires collateral and documentation. Informal credit (moneylenders: 60-120%+) is accessible but exploitative, creating debt traps. SHGs solve the collateral problem through social guarantee, enabling poor women to access affordable credit. PMJDY (2014) opened 500 million bank accounts to drive financial inclusion.",
    },
  },

  // ── Chapter 16: Globalisation and the Indian Economy ─────────────────────

  {
    topicId: "sst_ch16_globalisation",
    subject: "Social Science",
    chapterNumber: 16,
    name: "Globalisation — MNCs, FDI, and Global Production Networks",
    prerequisite_knowledge: ["What is foreign trade", "What is a multinational corporation", "Concept of comparative advantage"],
    key_formulas: [
      "Globalisation: integration of countries through trade, investment, technology, and migration",
      "MNC: company owning/controlling production in more than one country",
      "FDI: foreign direct investment — MNC or foreign entity invests in another country's production",
      "Global value chain: production stages of one product spread across multiple countries",
    ],
    teaching_content: {
      intuition:
        "When you buy a smartphone, its chip was designed in USA, fabricated in Taiwan or South Korea, assembled in China (possibly with a factory worker from rural inland China), while the app was coded by a programmer in India. The phone is sold globally. This is the reality of modern global production — no country makes everything alone. Globalisation has created extraordinary wealth but also displaced workers, hollowed out industries, and concentrated power in the hands of huge MNCs. Understanding this is understanding the world economy.",
      process_explanation:
        "1. WHAT ENABLED GLOBALISATION:\n- Communication technology: internet, fibre-optic cables → instant global coordination\n- Transport revolution: containerisation → cheap shipping of goods worldwide\n- Trade liberalisation: WTO, bilateral agreements → lower tariffs, fewer restrictions\n- Financial liberalisation: easier movement of capital across borders\n2. HOW MNCs OPERATE:\n- Wholly-owned subsidiaries: MNC builds its own factory abroad\n- Contract manufacturing: MNC designs and markets; local company manufactures (Apple-Foxconn model)\n- Joint ventures: MNC + local company share ownership\n- Franchising: local entrepreneur uses MNC brand/system (McDonald's, KFC)\n3. FDI IN INDIA:\n- India attracted $47B+ FDI annually (2022-23)\n- Key sectors: IT, pharmaceuticals, retail, infrastructure\n- MNCs in India: Amazon, Walmart (Flipkart), Foxconn, Samsung, Hyundai\n4. GLOBAL VALUE CHAINS:\n- Fragmentation: each production stage done where it is cheapest\n- Example: iPhone → design (USA), chips (Taiwan), camera (Japan), assembly (China), software (everywhere)\n- India in GVCs: software (Infosys/TCS serving global companies), pharma ingredients (API manufacturing), auto components (Bosch, Motherson)\n5. TRADE FACILITATING INSTITUTIONS:\n- WTO: rules for international trade\n- IMF: financial stability, balance of payments support\n- World Bank: development loans",
      worked_example:
        "Question: How does contract manufacturing benefit both the MNC and the local manufacturer?\nAnswer: In contract manufacturing (e.g., Apple with Foxconn in China):\nFor MNC (Apple):\n1. No capital investment in factory — Foxconn bears the cost\n2. Flexibility: can switch suppliers or scale up/down without owning assets\n3. Focus on core competence: design, software, marketing\n4. Cost: labour costs in manufacturer's country (China) are lower than in home country (USA)\nFor local manufacturer (Foxconn):\n1. Guaranteed orders: predictable production volume from a large MNC client\n2. Technology exposure: manufacturing sophisticated products improves capabilities\n3. Employment: creates millions of jobs in manufacturing hubs (Zhengzhou, China)\n4. Revenue: a fraction of MNC's consumer price is significant given scale of production\nDownsides for manufacturer: heavy dependence on one client's orders; thin profit margins; little brand equity built.",
      common_misconceptions: [
        "Globalisation is NOT new — trade between distant regions has happened for millennia. What is new is the speed, scale, and integration of modern globalisation enabled by technology.",
        "MNCs are NOT purely exploitative — they transfer technology, create employment, pay taxes. But they also exploit lower standards in developing countries and repatriate profits.",
        "FDI is NOT always welcome — countries restrict FDI in strategic sectors (defence, media, telecommunications) to protect national security and domestic industries.",
      ],
      shortcuts_and_tricks: [
        "3 channels of MNC expansion: wholly-owned subsidiary / contract manufacturing / joint venture.",
        "Enablers of globalisation: communication + transport + trade liberalisation + financial flows.",
        "India in global value chains: IT services (outsourced by global companies) + pharma APIs + auto components.",
      ],
      diagram_description: "Global value chain map for smartphone: design (USA) → chip fabrication (Taiwan) → components (Japan/S.Korea) → assembly (China/India) → sales (global). MNC operation types: wholly-owned subsidiary vs contract manufacturing vs joint venture vs franchise. FDI to India: sectors pie chart.",
      key_takeaway: "Globalisation integrates countries through trade, FDI, technology, and migration. MNCs spread production globally through subsidiaries, contract manufacturing, and joint ventures. Global value chains fragment production across countries — each doing what it does cheapest. India participates through IT services, pharmaceutical ingredients, and auto components. Globalisation creates both opportunities and challenges for developing countries.",
    },
  },

  {
    topicId: "sst_ch16_impact",
    subject: "Social Science",
    chapterNumber: 16,
    name: "India's 1991 LPG Reforms and Impact of Liberalisation",
    prerequisite_knowledge: ["What was the Licence Raj", "India's 1991 economic crisis", "Difference between protectionism and free trade"],
    key_formulas: [
      "LPG: Liberalisation + Privatisation + Globalisation — 1991 reform package",
      "1991 crisis: foreign exchange reserves down to 2 weeks of imports; IMF loan required",
      "Liberalisation: removed licence raj, reduced import restrictions, allowed FDI",
      "Before 1991 tariff: 130%+ average import duty; after reforms: <30% by 2000s",
    ],
    teaching_content: {
      intuition:
        "In June 1991, India had foreign exchange reserves for only 2 weeks of imports — the country was on the brink of default. The new government of P.V. Narasimha Rao (PM) and Manmohan Singh (Finance Minister) used this crisis to launch radical reforms. The 'Licence Raj' — a Byzantine system of government permits required for every business decision — was dismantled. Import restrictions fell. Foreign investment was welcomed. India's GDP growth accelerated from ~3-4% (the 'Hindu rate of growth') to 6-8% average in the 2000s. The reforms created winners and losers — IT professionals, large manufacturers, and consumers won; small manufacturers and some farmers lost.",
      process_explanation:
        "PRE-1991 INDIA:\n- Licence Raj: required government permit (licence) for every significant business decision — new factory, expansion, technology import, foreign exchange. Massive red tape and corruption.\n- Import substitution: high tariffs (130%+) on imports to protect domestic industries. Result: protected but inefficient industries.\n- Public sector dominance: government owned airlines, banks, steel companies, mines. Private sector growth restricted.\nLPG REFORMS (1991+):\n1. LIBERALISATION:\n- Abolished industrial licensing for most industries (exceptions: defence, hazardous chemicals)\n- Reduced import tariffs from 130% to <30% by 2000s\n- Allowed FDI in most sectors (initially restrictions, progressively relaxed)\n- Exchange rate: rupee made convertible for current account transactions\n2. PRIVATISATION:\n- PSUs (public sector units) disinvested (govt sold stakes)\n- New sectors opened to private sector: telecom, airlines, insurance\n- Competition introduced in previously monopolised sectors\n3. GLOBALISATION:\n- India became WTO member (1995)\n- Special Economic Zones (SEZs): export processing zones with special privileges\nIMPACT:\nPositive: GDP growth, IT boom, consumer choice, FDI, forex reserves rebuilt\nNegative: small manufacturers faced Chinese competition, agricultural terms of trade worsened, inequality increased",
      worked_example:
        "Question: Who benefited and who lost from India's 1991 liberalisation?\nAnswer:\nWINNERS:\n1. IT sector: liberalisation allowed foreign software buyers to partner with Indian companies; imports of computers and components permitted → IT boom.\n2. Large manufacturers: scale economies, technology access, export markets.\n3. Urban middle class consumers: imported goods became available (cars, electronics); variety and quality improved; prices fell.\n4. Foreign investors: India opened as a large market for FDI.\nLOSERS:\n1. Small-scale manufacturers: unprotected against cheap Chinese imports in toys, electronics, clothing. Many closed.\n2. Traditional artisans/weavers: handloom weavers lost to cheaper machine-made fabric.\n3. Farmers: import of agricultural commodities at lower international prices hurt domestic farmers; input costs rose.\n4. Workers in PSUs: privatisation led to job losses (though workers were given VRS packages).",
      common_misconceptions: [
        "1991 reforms did NOT happen only because the IMF demanded them — Finance Minister Manmohan Singh used the crisis as an opportunity to push reforms he believed were necessary. The IMF loan was conditional, but the reform direction was also ideological.",
        "Liberalisation did NOT eliminate the government's role — India's state remained large in healthcare, education, defence, and strategic industries. It was not a move to pure market capitalism.",
        "The benefits of liberalisation are NOT universally shared — income inequality (Gini coefficient) increased significantly post-1991. Growth was real but uneven.",
      ],
      shortcuts_and_tricks: [
        "LPG = Liberalisation + Privatisation + Globalisation. 1991 = year of reforms. Narasimha Rao (PM) + Manmohan Singh (FM).",
        "Licence Raj = pre-1991 permit system. Abolished 1991. GDP growth: 3-4% (before) → 6-8% (2000s).",
        "Reform winners: IT + large manufacturers + consumers. Losers: small manufacturers + artisans + some farmers.",
      ],
      diagram_description: "Pre-1991 vs Post-1991 comparison: import duties (130% → 30%), GDP growth (3% → 6-8%), FDI (minimal → $47B+), industrial licensing (required → mostly abolished). Winners and losers table. 1991 crisis timeline: forex reserves crisis → IMF loan → LPG reforms → growth.",
      key_takeaway: "India's 1991 LPG reforms (Liberalisation, Privatisation, Globalisation) were triggered by a foreign exchange crisis. The Licence Raj was dismantled, tariffs slashed, and FDI welcomed. GDP growth accelerated to 6-8% by 2000s. Winners: IT sector, large manufacturers, urban consumers. Losers: small manufacturers, artisans, some farmers — revealing that liberalisation benefits are unequally distributed.",
    },
  },

  {
    topicId: "sst_ch16_fair_globalisation",
    subject: "Social Science",
    chapterNumber: 16,
    name: "WTO, Trade Barriers, and Fair Globalisation",
    prerequisite_knowledge: ["What is the WTO", "What is a tariff", "What is agricultural subsidy"],
    key_formulas: [
      "WTO (1995): multilateral organisation setting rules for international trade (164 members)",
      "Trade barrier: govt policy restricting imports — tariffs (import tax), quotas (quantity limit), NTBs (non-tariff barriers)",
      "Agricultural subsidies: rich countries (USA/EU) subsidise farmers → cheap exports → developing countries' farmers cannot compete",
      "Fair globalisation: ensure benefits reach workers and small producers, not just corporations",
    ],
    teaching_content: {
      intuition:
        "The WTO promises free trade — no tariffs, no barriers, level playing field. But developing countries argue this is not a level playing field at all: USA gives $20 billion/year in farm subsidies, EU gives €50 billion. This makes American and European food artificially cheap on world markets. When these subsidised goods are exported to India, Indian farmers cannot compete. Then WTO rules prevent India from protecting its farmers with tariffs. This 'one rule for us, another for you' dynamic is the core criticism of globalisation — and explains why developing countries are often sceptical of 'free trade.'",
      process_explanation:
        "1. WTO (WORLD TRADE ORGANISATION):\n- Established 1995 (replaced GATT)\n- 164 member countries\n- Functions: negotiate trade agreements (Doha Round), resolve trade disputes, monitor trade policies\n- Dispute mechanism: countries file complaints; WTO panel judges; losing country must change policy or face retaliation\n2. TRADE BARRIERS:\n- Tariff: import tax (percentage of value). Raises price of imports, protecting domestic producers.\n- Quota: maximum quantity of a good that can be imported. Direct quantity limit.\n- Non-tariff barriers (NTBs): quality standards, labelling requirements, safety regulations — can be used legitimately or as disguised protectionism\n- Export subsidies: government pays producers to export at below-cost price — dumping\n3. THE HYPOCRISY ARGUMENT:\n- Rich countries: demand developing countries reduce tariffs → 'free trade'\n- But rich countries: give massive farm subsidies (US: $20B/year, EU: €50B/year) → allow their farmers to export cheaply\n- Effect: developing country farmers (India, Africa) cannot compete with subsidised US/EU food\n- Rich countries call their subsidies 'domestic support' not 'trade barriers' — but the effect is the same\n4. INDIA'S POSITION AT WTO:\n- India advocates for agricultural protection rights for developing countries\n- Insists on 'Special and Differential Treatment' for poor countries\n- India blocked WTO's Trade Facilitation Agreement until it got commitments on food security\n5. MAKING GLOBALISATION FAIR:\n- Fair trade: premium prices to small producers (coffee, tea, handicrafts)\n- Labour standards: multinational supply chains must meet minimum wage, safety standards\n- Technology transfer: developing countries should get technology, not just cheap goods\n- Government role: protect vulnerable industries and workers while opening economy selectively",
      worked_example:
        "Question: Explain the paradox of rich countries demanding free trade while maintaining agricultural subsidies.\nAnswer: The paradox is this:\n1. Rich countries (USA, EU) pressure developing countries through WTO to reduce import tariffs and remove trade protection — arguing 'free trade' is mutually beneficial.\n2. Yet simultaneously, these same rich countries pay billions in farm subsidies — making their agricultural products artificially cheap globally.\n3. When US-subsidised wheat or EU-subsidised dairy is exported to India or Africa at below-cost prices, local farmers cannot compete despite their lower wages.\n4. WTO rules technically allow farm subsidies if they are 'domestic support' — but this is a legal fiction, as the trade impact is identical to export subsidies.\n5. Result: poor developing countries' farmers lose markets at home (cheap imports) AND abroad (subsidised rich-country competition) — while rich countries lecture them on 'free markets.'\nThis is 'do as I say, not as I do' — the fundamental inequality of the current globalisation framework.",
      common_misconceptions: [
        "WTO does NOT force countries to eliminate all tariffs — it negotiates gradual reductions over time, with developing countries getting longer timelines. Complete free trade is not the WTO's current goal.",
        "Trade barriers are NOT always bad — protecting infant industries (temporary protection while they develop competitiveness) is a legitimate strategy used by ALL now-developed countries in their early industrialisation.",
        "Fair trade certification is NOT a perfect solution — it covers only a tiny fraction of global trade and does not address systemic issues with agricultural subsidy hypocrisy.",
      ],
      shortcuts_and_tricks: [
        "WTO 1995 = sets trade rules + dispute resolution. 164 members. Replaced GATT.",
        "3 types of trade barriers: tariff (tax), quota (quantity), NTB (non-tariff: standards, regulations).",
        "Agricultural subsidy hypocrisy: USA/EU = massive farm subsidies → cheap exports → developing country farmers hurt. WTO cannot easily stop this.",
      ],
      diagram_description: "WTO structure: multilateral negotiations → trade agreements → dispute resolution. Trade barrier types: tariff (price increase) / quota (quantity limit) / NTB (regulatory). Hypocrisy diagram: rich country subsidises farm → exports cheaply → developing country farm cannot compete → developing country asked to remove its own tariffs by same rich country.",
      key_takeaway: "WTO (1995) sets rules for international trade and resolves disputes, but developing countries criticise the 'hypocrisy' of rich countries demanding free trade while giving massive agricultural subsidies that disadvantage developing country farmers. Fair globalisation requires addressing these power imbalances, ensuring technology transfer, labour standards, and protecting vulnerable producers through fair trade mechanisms.",
    },
  },

  // ── Chapter 17: Consumer Rights ───────────────────────────────────────────

  {
    topicId: "sst_ch17_consumer_awareness",
    subject: "Social Science",
    chapterNumber: 17,
    name: "Consumer Exploitation and the Consumer Movement in India",
    prerequisite_knowledge: ["What is a consumer", "Concept of market failure", "What is adulteration of food"],
    key_formulas: [
      "Consumer exploitation: seller takes unfair advantage through: adulteration, underweight goods, false advertising, overcharging",
      "COPRA 1986 (Consumer Protection Act): India's landmark consumer protection law",
      "Consumer Protection Act 2019: updated COPRA — added online complaints, e-commerce, product liability",
      "Jago Grahak Jago: govt consumer awareness campaign (Ministry of Consumer Affairs)",
    ],
    teaching_content: {
      intuition:
        "When you buy a packet of spices and 20% of it is sawdust, or buy a medicine that is diluted below its stated concentration, or pay ₹140 for a bottle of water marked MRP ₹60 — you are a victim of consumer exploitation. In India, this was rampant until the consumer movement began in the 1960s-70s, leading to COPRA 1986. The insight is that individual consumers are powerless against organised businesses — only collective consumer rights and legal protection can level the playing field.",
      process_explanation:
        "1. FORMS OF CONSUMER EXPLOITATION:\n- Underweight/undermeasure: selling less than stated quantity\n- Adulteration: mixing inferior materials with food (sawdust in flour, water in milk, chalk in sugar)\n- Substandard quality: cheaper materials replacing stated quality\n- Black marketing: selling scarce goods at inflated prices\n- False/misleading advertising: exaggerating product claims\n- Overcharging: charging above MRP (Maximum Retail Price)\n2. CONSUMER MOVEMENT HISTORY IN INDIA:\n- 1960s-70s: severe shortage of essential goods, widespread adulteration and black marketing\n- Consumer organisations formed: CERC (Consumer Education and Research Centre), Mumbai Grahak Panchayat\n- Organised campaigns, publications, investigations of market fraud\n- Pressure led to legislation: COPRA 1986\n3. COPRA 1986:\n- First comprehensive consumer protection law in India\n- Created 3-tier consumer court system: District, State, National\n- Established 6 consumer rights\n- Replaced by Consumer Protection Act 2019 (modernised for digital age)\n4. CPA 2019 UPGRADES:\n- Online complaint filing\n- E-commerce platforms covered (Amazon, Flipkart liable)\n- Product liability: manufacturer responsible for defective product harm\n- Central Consumer Protection Authority (CCPA): investigates unfair trade practices, issues safety alerts, bans misleading ads\n5. QUALITY CERTIFICATION MARKS:\n- ISI/BIS: industrial products\n- Agmark: agricultural/processed food\n- Hallmark: gold/silver purity\n- FSSAI: food safety certification\n- Ecomark: environment-friendly products",
      worked_example:
        "Question: Why was the consumer movement necessary despite India having general civil and criminal laws against fraud?\nAnswer: General laws (Indian Penal Code, Contract Act) existed but were insufficient for consumer protection because:\n1. Cost of litigation: taking a seller to civil court cost more in legal fees and time than the value of a defective ₹500 purchase. Rational consumers simply absorbed small losses.\n2. Burden of proof: civil courts required consumers to prove fraud — difficult for ordinary buyers without legal expertise.\n3. Time: civil court cases could take 5-10 years — by which time the seller may have closed and disappeared.\n4. Power asymmetry: organised businesses had lawyers; individual consumers did not.\nCOPRA solved these problems by: creating simple consumer courts (no mandatory lawyer), keeping costs low (₹100-200 filing fee), setting time limits for resolution (90-150 days), and shifting burden of proof in some cases.",
      common_misconceptions: [
        "MRP is NOT a 'suggestion' — Maximum Retail Price is the maximum a retailer can legally charge. Overcharging above MRP is a violation of consumer rights and actionable under consumer law.",
        "Consumer courts are NOT the same as civil courts — they are specifically designed to be simpler, cheaper, faster, and accessible without a lawyer.",
        "FSSAI certification is NOT the same as ISI — FSSAI (Food Safety and Standards Authority of India) certifies food safety. ISI/BIS certifies industrial product standards.",
      ],
      shortcuts_and_tricks: [
        "Consumer exploitation forms: adulteration, underweight, false advertising, overcharging, black marketing.",
        "COPRA 1986 → CPA 2019. CPA 2019 added: online filing, e-commerce, product liability, CCPA.",
        "Quality marks: ISI (industrial) + Agmark (food/agri) + Hallmark (gold) + FSSAI (food safety).",
      ],
      diagram_description: "Consumer exploitation types (6 boxes). Consumer movement timeline: 1960s problem → organisations formed → COPRA 1986 → CPA 2019. Quality certification marks: ISI, Agmark, Hallmark, FSSAI, Ecomark with their domains.",
      key_takeaway: "Consumer exploitation — through adulteration, underweighing, false advertising, and overcharging — was rampant in India until the consumer movement of the 1960s-70s led to COPRA 1986, India's first comprehensive consumer protection law. The Consumer Protection Act 2019 modernised this framework for the digital age, adding online complaint filing, e-commerce coverage, product liability, and a Central Consumer Protection Authority (CCPA).",
    },
  },

  {
    topicId: "sst_ch17_consumer_rights",
    subject: "Social Science",
    chapterNumber: 17,
    name: "Six Consumer Rights",
    prerequisite_knowledge: ["What is COPRA", "Concept of consumer exploitation", "What is product safety"],
    key_formulas: [
      "6 consumer rights under CPA: Safety + Information + Choice + Heard + Redressal + Education",
      "Right to Safety: protection from hazardous goods and services",
      "Right to Information: accurate product details (ingredients, MRP, expiry, hazards)",
      "Right to Choose: access to variety at competitive prices (anti-monopoly)",
      "Right to be Heard: voice in consumer policy; complaints given fair consideration",
      "Right to Seek Redressal: compensation through consumer courts",
      "Right to Consumer Education: awareness of rights and how to protect oneself",
    ],
    teaching_content: {
      intuition:
        "Before COPRA, the buyer had one choice: beware. 'Caveat Emptor' (let the buyer beware) was the old legal principle — the seller had no duty to disclose defects, the buyer bore all risk. COPRA reversed this. Now sellers are legally obligated to provide safe products, honest information, and fair prices — and consumers have the right to seek compensation if they don't. The six rights created a framework that shifted legal responsibility from the powerless buyer to the organised seller.",
      process_explanation:
        "1. RIGHT TO SAFETY:\n- Protection from goods dangerous to life and health\n- Examples: faulty electrical appliances (electrocution risk), adulterated drugs, toxic food additives\n- Enforced through: BIS standards (ISI mark), FSSAI food safety standards, drug regulations (CDSCO)\n2. RIGHT TO INFORMATION:\n- Sellers must provide: ingredients, MRP, manufacturing/expiry dates, usage instructions, health warnings\n- Examples: cigarettes must have health warnings; pesticides must have safety instructions; food products must list ingredients and allergens\n3. RIGHT TO CHOOSE:\n- Access to a variety of goods and services at competitive prices\n- Protects against monopolistic pricing and forced bundling\n- Anti-monopoly laws (Competition Commission of India) support this right\n4. RIGHT TO BE HEARD:\n- Consumer interests represented in policy-making processes\n- Grievance cells in companies must exist\n- Consumer representatives in regulatory bodies\n5. RIGHT TO SEEK REDRESSAL:\n- Legal right to get compensation for unfair trade practices\n- Enforced through 3-tier consumer court system\n- Remedies: repair, replacement, refund, compensation for injury/loss\n6. RIGHT TO CONSUMER EDUCATION:\n- Access to information about rights and how to use them\n- Government campaigns: Jago Grahak Jago, consumer helpline (1800-11-4000)\n- School/college consumer awareness programmes",
      worked_example:
        "Question: A consumer finds a cockroach in a sealed packet of biscuits. Which consumer rights are violated, and what can she do?\nAnswer: Rights violated:\n1. Right to Safety: a food product with a cockroach is hazardous to health.\n2. Right to Information: the packaging implied the product was pure/safe — this is misleading.\n3. Right to Choice: if the manufacturer routinely sells contaminated products, it distorts the market.\nAction:\n1. Keep the evidence: photograph the cockroach inside the packet with the batch number and expiry date.\n2. File complaint with FSSAI (food regulator) — can result in license cancellation for the manufacturer.\n3. File consumer court complaint for: (a) refund of purchase price, (b) compensation for mental distress/health risk, (c) legal costs.\n4. District Consumer Forum: handles claims up to ₹1 crore. Filing fee: ₹100. Can appear without a lawyer.\n5. Can also write to manufacturer's consumer helpline — companies often settle quickly to avoid negative publicity.",
      common_misconceptions: [
        "Right to Choose does NOT mean 'choose any product regardless of price' — it means consumers should have access to competitive markets, not monopolies that force them to buy at inflated prices.",
        "Consumer courts are NOT 'only for expensive products' — the District Consumer Forum handles claims for any amount up to ₹1 crore. Even a ₹50 product can be contested.",
        "Right to Information does NOT require sellers to reveal trade secrets — it requires disclosure of information material to a consumer's purchasing decision (ingredients, hazards, price).",
      ],
      shortcuts_and_tricks: [
        "6 rights mnemonic: SICHER (German for 'safe') — Safety, Information, Choice, Heard, Education, Redressal.",
        "Or: SIRCHE — Safety, Information, Redressal, Choice, Heard, Education.",
        "Right to Safety = mandatory quality marks (ISI, FSSAI). Right to Information = label requirements (MRP, expiry). Right to Redressal = consumer courts.",
      ],
      diagram_description: "Hexagon with 6 rights: Safety (shield icon), Information (info icon), Choice (shopping icon), Heard (megaphone), Redressal (scales of justice), Education (book). Each right with a concrete example. 'Caveat Emptor' (old) → 'Consumer Rights' (new) transition.",
      key_takeaway: "COPRA/CPA recognises 6 consumer rights: Safety (protection from hazardous goods), Information (honest labelling), Choice (competitive markets), Heard (representation in policy), Redressal (compensation through courts), and Education (awareness). These rights reversed the old 'caveat emptor' principle — placing responsibility on sellers, not buyers.",
    },
  },

  {
    topicId: "sst_ch17_consumer_protection",
    subject: "Social Science",
    chapterNumber: 17,
    name: "3-Tier Consumer Redressal Forum and Consumer Protection Mechanisms",
    prerequisite_knowledge: ["What is COPRA", "The 6 consumer rights", "What is a consumer court"],
    key_formulas: [
      "3-tier system: District Consumer Forum (up to ₹1 crore) → State Commission (₹1-10 crore) → National Commission (above ₹10 crore)",
      "Can appeal: District → State → National → Supreme Court",
      "Consumer Protection Act 2019 revised limits (higher than COPRA 1986)",
      "No mandatory lawyer: consumer can appear in person",
      "Time limit for cases: 90-150 days (much faster than civil courts)",
    ],
    teaching_content: {
      intuition:
        "Before COPRA, a consumer cheated by a manufacturer had to go to a civil court — pay a lawyer, wait 5-10 years, and spend more in legal fees than the value of the dispute. COPRA's 3-tier consumer court system solved this by creating dedicated, fast, low-cost consumer courts where ordinary people can get justice without lawyers. The system works because it is specifically designed for consumer disputes — simpler procedure, faster timelines, and remedies designed to make the consumer whole.",
      process_explanation:
        "1. THREE-TIER STRUCTURE (CPA 2019 limits):\n- District Consumer Disputes Redressal Commission: claims up to ₹1 crore\n- State Consumer Disputes Redressal Commission: ₹1 crore to ₹10 crore\n- National Consumer Disputes Redressal Commission: above ₹10 crore\n2. APPEAL PROCESS:\n- Unhappy with District verdict → appeal to State Commission\n- Unhappy with State verdict → appeal to National Commission\n- Unhappy with National verdict → appeal to Supreme Court\n3. KEY FEATURES:\n- No mandatory lawyer: consumer can represent herself\n- Low filing fee: ₹100-500 for most cases\n- Time limit: forums must decide within 90-150 days\n- No court fee proportional to claim value (unlike civil courts)\n4. REMEDIES AVAILABLE:\n- Remove defect in goods or deficiency in service\n- Replace defective goods\n- Refund the purchase price\n- Pay compensation for injury, loss, or suffering\n- Withdraw hazardous goods from market\n- Cease false/misleading advertising\n5. FILING A COMPLAINT:\n- Collect evidence: receipt, warranty, photos of defect, written complaint to seller\n- File complaint: in writing (or online under CPA 2019) to the appropriate forum\n- Attach: evidence, affidavit, fees\n- Forum sends notice to opposite party (seller/manufacturer)\n- Hearing → settlement or verdict\n6. CCPA (Central Consumer Protection Authority):\n- Created by CPA 2019\n- Can investigate unfair trade practices and issue safety recalls\n- Can ban misleading advertisements\n- Can impose penalties on manufacturers",
      worked_example:
        "Question: Walk through the process of filing a consumer complaint about a defective laptop.\nStep 1: Try to resolve directly — contact the company's customer service, write a formal complaint email. Document everything.\nStep 2: If unresolved within 30 days, prepare the complaint for District Consumer Forum:\n- Write complaint describing purchase, defect, attempts to resolve\n- Attach: purchase receipt, warranty card, company complaint acknowledgement, technical expert opinion if available\n- Pay filing fee (₹200 for a ₹60,000 laptop claim)\nStep 3: File at District Consumer Disputes Redressal Commission in the district where:\n- The purchase was made, OR\n- The cause of action arose, OR\n- The opposite party has a business address\nStep 4: Forum sends notice to the company. Company files response within 30 days.\nStep 5: If no settlement, hearing scheduled. Consumer can appear in person or via advocate.\nStep 6: Forum orders remedy within 90 days: typically repair/replace/refund + compensation for inconvenience.\nTotal cost: ₹200 filing fee + time invested. Timeline: 3-5 months typically.",
      common_misconceptions: [
        "Consumer courts are NOT toothless — their orders are enforceable, and non-compliance can result in fines and even imprisonment for the company's officers.",
        "Online orders are NOT excluded from consumer protection — the CPA 2019 specifically covers e-commerce platforms. Amazon, Flipkart are liable for their seller's products in certain circumstances.",
        "The complaint must be filed within 2 years from the date of the defect — not from the date of purchase. After 2 years, the claim may be time-barred.",
      ],
      shortcuts_and_tricks: [
        "3-tier limits (CPA 2019): District ≤ ₹1 crore, State ₹1-10 crore, National > ₹10 crore. Appeals go upward.",
        "Key features: no mandatory lawyer + low fee (₹100-500) + 90-150 day timeline = accessible justice.",
        "Remedies: repair OR replace OR refund + compensation + ban hazardous goods + ban misleading ads.",
      ],
      diagram_description: "Consumer court hierarchy pyramid: National Commission (top, >₹10 crore) → State Commission (middle, ₹1-10 crore) → District Forum (base, ≤₹1 crore). Appeal arrows going upward. Consumer complaint filing flowchart: try to resolve → collect evidence → file complaint → notice to seller → hearing → remedy order.",
      key_takeaway: "India's 3-tier consumer redressal system — District (up to ₹1 crore), State (₹1-10 crore), National (above ₹10 crore) — provides accessible justice without mandatory lawyers, at low cost, within 90-150 days. The CPA 2019 added online filing, e-commerce coverage, and the CCPA for proactive enforcement. Remedies include repair, replacement, refund, and compensation.",
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
  console.log(`✅ SST Economics Content: ${created} created, ${updated} updated`);
  await mongoose.disconnect();
}
run().catch(e => { console.error(e); process.exit(1); });
