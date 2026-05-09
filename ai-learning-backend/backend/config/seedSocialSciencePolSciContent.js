import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const TOPICS = [

  // ── Chapter 18: Power Sharing ─────────────────────────────────────────────

  {
    topicId: "sst_ch18_power_sharing",
    subject: "Social Science",
    chapterNumber: 18,
    name: "Belgium vs Sri Lanka — Case Studies in Power Sharing",
    prerequisite_knowledge: ["What is ethnic conflict", "Concept of majority and minority in politics", "What is a federal system"],
    key_formulas: [
      "Belgium: 59% Dutch (Flemish), 40% French (Walloon), 1% German-speaking",
      "Belgium's solution: equal cabinet representation regardless of community; separate regional governments; Brussels = bilingual special region",
      "Sri Lanka: 74% Sinhala, 18% Tamil, 7% Moors (Muslim)",
      "Sri Lanka's mistake: Sinhala Only Act 1956 → Tamil exclusion → civil war 1983-2009",
      "Power sharing lesson: accommodate diversity = stability; repress minority = conflict",
    ],
    teaching_content: {
      intuition:
        "Belgium and Sri Lanka are perfect case studies for power sharing because they faced similar challenges (multiethnic societies with a clear majority and minority) but made opposite choices. Belgium accommodated its linguistic diversity through creative power sharing; Sri Lanka tried to assert Sinhala majority dominance. Belgium remained stable and prosperous (joining the EU and hosting NATO/EU headquarters in Brussels). Sri Lanka descended into a devastating civil war that lasted 26 years. The lesson is stark: in diverse societies, majority domination leads to conflict; power sharing leads to stability.",
      process_explanation:
        "BELGIUM:\n1. Linguistic composition: 59% Dutch-speaking Flemish (north), 40% French-speaking Walloons (south), 1% German-speaking (east). Brussels: 80% French-speaking capital in Flemish territory.\n2. Historical tension: Before 1970s, French speakers dominated politically and economically despite being a minority nationally. Dutch speakers demanded equal treatment.\n3. Power-sharing solution (1970-1993, through 4 constitutional amendments):\n   - Equal number of Dutch and French ministers in federal cabinet (even if Dutch speakers are majority)\n   - Separate regional governments: Flemish (north), Walloon (south), Brussels (capital)\n   - Community governments: separate bodies for each language community's cultural/educational matters\n   - Brussels: separate government representing both French and Dutch speakers\n4. Result: Belgium remained united; became host of EU, NATO headquarters; model for multicultural democracy.\nSRI LANKA:\n1. Composition: 74% Sinhala (Buddhist), 18% Tamil (Hindu/Christian — Sri Lankan Tamils in north + Indian Tamil plantation workers in hills), 7% Moors (Muslim).\n2. Post-independence Sinhala majority politics:\n   - 1948: Both languages recognised\n   - 1956: Sinhala Only Act — Sinhala becomes sole official language. Tamil speakers excluded from government jobs, army, courts.\n   - 1972: Buddhism given foremost place in constitution.\n3. Tamil response:\n   - Initially: peaceful demand for federalism, official language status — denied\n   - 1983: civil war begins — LTTE (Liberation Tigers of Tamil Eelam) fought for separate Tamil state (Eelam)\n   - 2009: Sri Lankan army defeated LTTE militarily\n4. Cost: 70,000+ killed, hundreds of thousands displaced, economy damaged, unresolved ethnic grievances.",
      worked_example:
        "Question: What made Belgium's power-sharing solution successful where Sri Lanka's majoritarian approach failed?\nAnswer: Belgium's success came from:\n1. Early accommodation: Belgium began sharing power with minorities before tensions became violent. Constitutional amendments in 1970 addressed grievances before they became existential.\n2. Structural guarantees: equal cabinet representation was constitutionally guaranteed — not dependent on a majority government's goodwill. Dutch speakers couldn't be outvoted in cabinet even though they're a national majority.\n3. Multiple layers: power was shared at community, regional, and federal levels — each community had genuine control over cultural and economic matters.\nSri Lanka's failure came from:\n1. Majority overreach: the 1956 Sinhala Only Act was a blunt tool that excluded 18% of the population from full citizenship by eliminating their language from public life.\n2. Delayed response: Tamil political demands (federal structure, language recognition) were denied for 35 years — by the time accommodation was attempted, violent extremism had taken over.\n3. Military solution: Sri Lanka ultimately defeated the LTTE militarily but did not address underlying Tamil grievances — creating conditions for future conflict.",
      common_misconceptions: [
        "Power sharing did NOT save Belgium from all conflict — there were serious political crises (Belgium went without a government for 541 days in 2010-11 over linguistic issues). Power sharing manages conflict; it does not eliminate it.",
        "Sri Lanka's civil war did NOT end in peace — the government won militarily in 2009, but Tamils' grievances remain unaddressed. This is a very fragile peace.",
        "Accommodation of minority demands is NOT the same as appeasement — it is recognising that in diverse societies, stability requires all groups to have a stake in the system.",
      ],
      shortcuts_and_tricks: [
        "Belgium: 59D+40F → power sharing → EU/NATO headquarters → stability. Sri Lanka: 74S+18T → Sinhala Only 1956 → civil war 1983-2009 → 70,000 dead.",
        "Belgian innovation: equal cabinet (not proportional). Separate regional govts. Brussels bilingual.",
        "Sri Lanka sequence: 1956 (Sinhala Only Act) → Tamil exclusion → LTTE → civil war → 2009 military end.",
      ],
      diagram_description: "Side-by-side Belgium/Sri Lanka comparison. Belgium: map with Flemish (north), Walloon (south), Brussels (special). Power-sharing solution: equal cabinet + regional govts + community govts. Sri Lanka: Sinhala-Tamil tensions timeline 1948→1956→1983→2009. Outcome comparison: Belgium stable, Sri Lanka conflict.",
      key_takeaway: "Belgium (59% Dutch/40% French) chose power sharing — equal cabinet representation, separate regional governments — achieving stability and becoming the EU/NATO headquarters. Sri Lanka (74% Sinhala/18% Tamil) chose majority domination (Sinhala Only Act 1956), leading to 26 years of civil war (1983-2009) and 70,000+ deaths. The lesson: accommodation of diversity leads to stability; majority domination leads to conflict.",
    },
  },

  {
    topicId: "sst_ch18_forms",
    subject: "Social Science",
    chapterNumber: 18,
    name: "Four Forms of Power Sharing",
    prerequisite_knowledge: ["What is separation of powers", "What is federalism", "Concept of coalition government"],
    key_formulas: [
      "Form 1: Horizontal — between organs of government (legislature + executive + judiciary)",
      "Form 2: Vertical — between levels of government (federal + state + local)",
      "Form 3: Among social groups — ethnic, religious, linguistic communities",
      "Form 4: Among political parties and pressure groups",
      "Checks and balances: each organ limits the power of others — prevents tyranny",
    ],
    teaching_content: {
      intuition:
        "Power sharing is not a single idea — it manifests in four distinct ways. Every democracy, in some form, uses all four. The separation of powers between parliament, government, and courts prevents any single person or body from accumulating too much power. Federalism divides power between national and regional governments. Ethnic power sharing ensures minorities have representation. And coalition governments and pressure groups ensure political power is distributed beyond any single party. Understanding these four forms helps understand why power sharing is the foundation of democratic stability.",
      process_explanation:
        "1. HORIZONTAL POWER SHARING — between organs of government at the SAME LEVEL:\n- Legislature (Parliament/Vidhan Sabha): makes laws\n- Executive (President/PM/Cabinet): implements laws, governs\n- Judiciary (Supreme Court/High Courts): interprets laws, reviews for constitutionality\n- Each organ can limit/check the others (checks and balances)\n- India: Parliament passes laws, but Supreme Court can declare them unconstitutional\n- No organ can acquire unlimited power\n2. VERTICAL POWER SHARING — between DIFFERENT LEVELS of government:\n- Federal level (Union government)\n- State level (State government)\n- Local level (Panchayat/Municipality)\n- Each level has its own jurisdiction and authority\n- Prevents over-centralisation\n- Examples: India (Union List/State List/Concurrent List), USA (Federal/State), Germany\n3. POWER SHARING AMONG SOCIAL GROUPS:\n- Ensures different communities have representation\n- Examples: India's reservation system for SC/ST/OBC in legislatures and government jobs\n- Belgium's equal cabinet representation for Dutch and French speakers\n- US affirmative action for African Americans\n- Community police forces that reflect the communities they serve\n4. POWER SHARING AMONG POLITICAL PARTIES AND PRESSURE GROUPS:\n- Coalition governments: multiple parties share cabinet portfolios\n- Opposition parties: challenge government, keep it accountable\n- Pressure groups: represent business (FICCI), labour (AITUC), farmers, environment — lobby for their interests\n- Media: fourth estate — informs citizens, holds power accountable\n- All ensure power is not monopolised by one party or faction",
      worked_example:
        "Question: How does India's federal system represent 'vertical power sharing', and what prevents the Centre from overriding states in normal times?\nAnswer: India's vertical power sharing:\n1. Three Lists (7th Schedule): Union List (defence, foreign affairs — Centre only), State List (police, agriculture — States only), Concurrent List (education, forests — both).\n2. Each level has its own revenue sources: Centre has income tax, customs; States have land revenue, commercial tax; Local bodies have property tax.\n3. Finance Commission: constitutional body that recommends how Central taxes are shared with states — prevents Centre from starving states of funds.\n4. Elected state governments: states have their own elected governments accountable to state voters, not to the Centre.\nPrevention of Centre override: In normal times, Centre cannot legislate on State List subjects. However, India is 'quasi-federal' — during emergencies, Centre can assume state powers. This makes India stronger at the Centre than a pure federation like USA or Germany.",
      common_misconceptions: [
        "Horizontal power sharing is NOT about equal power — legislature, executive, and judiciary have different functions, not equal power. The key is that each can limit the others.",
        "Social group power sharing (reservations) is sometimes called 'reverse discrimination' — but the constitutional rationale is correcting historical exclusion, not creating privilege.",
        "Coalition governments are NOT inherently weak — they can be effective when parties agree on core issues. India has had many effective coalition governments (Vajpayee's NDA, Manmohan Singh's UPA).",
      ],
      shortcuts_and_tricks: [
        "4 forms: Horizontal (same level, different organs) + Vertical (different levels) + Social groups + Political parties/pressure groups.",
        "Horizontal = legislature + executive + judiciary. India: Parliament + Cabinet + Supreme Court.",
        "Vertical = Centre + State + Local (Panchayat). Different levels, different jurisdiction.",
      ],
      diagram_description: "Four-quadrant diagram: Q1 Horizontal (legislature-executive-judiciary triangle with check arrows), Q2 Vertical (Centre→State→Local hierarchy), Q3 Social groups (SC/ST/OBC reservation, Belgium community govts), Q4 Political (coalition govt, opposition, pressure groups, media).",
      key_takeaway: "Power sharing manifests in four forms: (1) Horizontal — between organs of government (legislature, executive, judiciary) through checks and balances; (2) Vertical — between levels (federal, state, local) through federalism; (3) Social groups — ensuring ethnic/religious minorities have representation; (4) Political parties and pressure groups — through coalitions, opposition, and organised civic interests. Together, these prevent power concentration and ensure democratic stability.",
    },
  },

  // ── Chapter 19: Federalism ────────────────────────────────────────────────

  {
    topicId: "sst_ch19_federalism",
    subject: "Social Science",
    chapterNumber: 19,
    name: "Federalism — Features, Types, and Legislative Lists",
    prerequisite_knowledge: ["What is a unitary state", "What is a constitution", "Concept of sovereignty"],
    key_formulas: [
      "Federalism: power divided between central and regional governments by constitution",
      "Coming together federation: independent states voluntarily unite (USA, Switzerland, Australia)",
      "Holding together federation: one country divides into units (India, Spain, Belgium)",
      "India's 3 lists: Union (97 subjects) + State (66 subjects) + Concurrent (47 subjects)",
      "Residuary powers: India → Centre. USA → States",
    ],
    teaching_content: {
      intuition:
        "Imagine trying to govern 1.4 billion people across a country with 28 languages, 8 major religions, 28 states, and 8 union territories from a single capital city. Federalism is India's answer: divide power constitutionally between the Centre and states, allowing states to govern local matters while the Centre handles national issues. Understanding federalism — its features, types, and the distribution of powers — is fundamental to understanding Indian governance.",
      process_explanation:
        "1. KEY FEATURES OF A FEDERAL GOVERNMENT:\n- Two or more levels of government\n- Each level has its own jurisdiction guaranteed by constitution\n- Courts (especially Supreme Court) resolve jurisdictional disputes\n- Cannot be easily changed unilaterally by one level\n- Both levels can directly govern citizens (unlike a confederation where only the centre does)\n2. COMING TOGETHER vs HOLDING TOGETHER:\n- Coming together: previously independent states voluntarily unite, trading some sovereignty for common governance. States retain more power relative to centre. Examples: USA (13 colonies united), Switzerland (cantons), Australia.\n- Holding together: a large democracy decides to devolve power to constituent units. Centre usually stronger. Examples: India, Spain (to Catalonia, Basque), Belgium.\n3. INDIA'S LEGISLATIVE DIVISION (7th Schedule):\n- Union List: 97 subjects — ONLY Parliament can legislate. National security, foreign relations, currency, railways, posts, atomic energy.\n- State List: 66 subjects — ONLY state legislature can legislate (normally). Police, public order, agriculture, local government, trade within state.\n- Concurrent List: 47 subjects — both Parliament and state legislatures can legislate. Education, forests, trade unions, marriage, adoption, succession. If conflict → Central law prevails.\n- Residuary powers: subjects not in any list → Parliament (India). States (USA).\n4. CENTRE STRONGER THAN STATES:\n- Residuary powers with Centre\n- Governor (appointed by Centre, not elected) represents Centre in state\n- Emergency provisions: National Emergency (Art. 352), State Emergency/President's Rule (Art. 356), Financial Emergency (Art. 360)\n- During President's Rule: state government dismissed, Governor (Centre's representative) governs directly\n5. INDIA AS 'UNION OF STATES': India's constitution uses 'Union' not 'Federation' — signalling Centre's primacy and no right to secede.",
      worked_example:
        "Question: Why does a conflict between state law and central law on a Concurrent List subject result in the central law prevailing?\nAnswer: The constitutional rationale (Article 254) is:\n1. National consistency: for subjects on the Concurrent List (e.g., education, marriage laws), national consistency is often desirable. If each state had completely different marriage laws, people moving between states would face legal chaos.\n2. Parliamentary supremacy: in India's 'holding together' federation, Parliament represents the national will and has primacy.\n3. Exception: if a state law received Presidential assent BEFORE the Central law, it may continue to operate in that state despite the national law — but this is rare.\n4. Example: The Right to Education Act 2009 (Central law) set national standards for education. States cannot legislate below these standards (they can go above them).",
      common_misconceptions: [
        "India is NOT a pure federation — it is 'quasi-federal' or 'asymmetric federal.' The Centre has emergency powers to override states, appoints Governors, and holds residuary powers. True federations like USA or Germany are more balanced.",
        "The 3 Lists do NOT cover everything — subjects not in any list (residuary) go to Parliament in India, unlike USA where residuary powers go to states.",
        "State List subjects are NOT always exclusively for states — during National Emergency (Art. 352), Parliament can legislate on State List subjects.",
      ],
      shortcuts_and_tricks: [
        "Union List = Centre only (defence, foreign affairs, currency). State List = States only (police, agriculture). Concurrent = both (education, forests). Conflict on Concurrent → Central wins.",
        "Coming together (USA, Australia): states more powerful. Holding together (India, Spain): Centre more powerful.",
        "Residuary: India → Centre (opposite of USA where residuary = States).",
      ],
      diagram_description: "3 circles: Union List (Centre only, blue) + State List (State only, orange) + Concurrent List (both, purple overlap). Residuary arrow → Centre. Coming together vs Holding together comparison table. India quasi-federal features: Governor (appointed), President's Rule, residuary with Centre.",
      key_takeaway: "Federalism divides power constitutionally between central and regional governments. India uses a 'holding together' federation with 3 legislative lists: Union (Centre only), State (States only), and Concurrent (both — Central law prevails in conflict). India is quasi-federal — the Centre is stronger than states due to emergency powers, residuary powers with Parliament, and governor appointment.",
    },
  },

  {
    topicId: "sst_ch19_how_it_works",
    subject: "Social Science",
    chapterNumber: 19,
    name: "How Federalism Works in India — Language Policy, Finance, and Centre-State Relations",
    prerequisite_knowledge: ["India's linguistic diversity", "What is a Finance Commission", "Concept of administrative federalism"],
    key_formulas: [
      "22 languages in 8th Schedule; states use their own official language",
      "States were reorganised along linguistic lines: States Reorganisation Commission 1953, 7th Amendment 1956",
      "Finance Commission (Art. 280): constituted every 5 years; recommends Central tax devolution to states",
      "15th Finance Commission: 41% of Central taxes to states",
      "Coalition era (1989+): states gained more bargaining power as no party had Lok Sabha majority alone",
    ],
    teaching_content: {
      intuition:
        "Federalism works not just through constitutional texts but through the daily practice of governance — how states and Centre negotiate, how language policy respects diversity, how money flows between levels of government. India's federalism has evolved significantly since 1950: states have gained more autonomy in the coalition era (post-1989), linguistic reorganisation addressed cultural demands, and the Finance Commission ensures states have adequate resources. This evolution shows that federalism is a living arrangement, not a fixed document.",
      process_explanation:
        "1. LANGUAGE POLICY:\n- Hindi and English: official languages of the Union for communication between Centre and states\n- 8th Schedule: 22 languages officially recognised. States use their own language for administration.\n- States reorganised on linguistic basis: Andhra Pradesh (Telugu, 1953 — triggered by Potti Sriramulu's death after fast), then Maharashtra, Karnataka, Kerala, Gujarat after 7th Amendment 1956.\n- Language federalism avoided 'Hindi imposition' conflict that has repeatedly surfaced (Tamil Nadu resistance to Hindi)\n2. FISCAL FEDERALISM:\n- Major taxes collected by Centre (income tax, customs): states collect land revenue, sales/GST share\n- Finance Commission (constitutional, Art. 280): constituted every 5 years by President\n- 15th FC (2020-2026): recommended 41% of Central divisible tax pool to states\n- Additional: grants-in-aid for specific purposes\n- GST Council (2017): Centre + all states jointly set GST rates — most powerful example of cooperative federalism\n3. CENTRE-STATE ADMINISTRATIVE RELATIONS:\n- IAS and IPS: officers recruited by Union, allocated to states — Central control over state bureaucracy\n- Emergency provisions: President's Rule can dismiss state government (used 100+ times 1950-2022)\n- Governor's role: appointed by Centre, acts as bridge (and sometimes tension point)\n4. EVOLUTION TOWARDS STATE AUTONOMY:\n- Pre-1989 (Congress dominance): same party at Centre and most states → cooperative but Centre-dominated\n- Post-1989 (coalition era): NDA, UPA needed regional parties → states gained leverage, demanded more autonomy\n- Sarkaria Commission (1983): recommended reducing excessive use of President's Rule and Governor's role\n- S.R. Bommai case (1994): Supreme Court ruled President's Rule cannot be imposed arbitrarily",
      worked_example:
        "Question: How has the coalition era (post-1989) strengthened India's federalism in practice?\nAnswer: Before 1989, Congress won national majorities, governing most states too. Centre could impose its will on states with limited resistance. After 1989:\n1. No single party majority: BJP, Congress, regional parties must form coalitions to govern at Centre.\n2. Regional party leverage: the Trinamool Congress (WB), DMK (TN), TDP (AP), BJD (Odisha) hold crucial parliamentary seats — demanding concessions for their states in policy and finance.\n3. State budgets: Finance Commissions have progressively increased states' share of Central taxes (from ~35% to 41% in 15th FC).\n4. Cooperative institutions: GST Council (2017) gives states an equal voice in tax policy — unprecedented in India's fiscal federalism.\n5. Courts: S.R. Bommai (1994) curtailed arbitrary President's Rule, protecting elected state governments.\nResult: India's federalism has become more balanced, though the Centre remains stronger than in classic federations.",
      common_misconceptions: [
        "The 8th Schedule languages are NOT India's only languages — India has 122 major languages and 1,599 others. The 8th Schedule languages are those with official recognition, not the only ones spoken.",
        "Finance Commission recommendations are NOT binding — but they carry strong conventional authority and have always been substantially accepted by governments.",
        "Coalition politics has NOT made India ungovernable — despite 30+ years of coalition governments, India has continued to grow economically and pass significant legislation.",
      ],
      shortcuts_and_tricks: [
        "8th Schedule: 22 languages. State reorganisation: linguistic basis. Andhra first (1953). 7th Amendment 1956 = major reorganisation.",
        "Finance Commission: 5-yearly, Art. 280, recommends tax devolution. 15th FC = 41% to states.",
        "GST Council 2017 = cooperative federalism success story. Centre + all states together set rates.",
      ],
      diagram_description: "Fiscal federalism flow: Central taxes → Finance Commission (41%) → states. GST Council: Centre + 28 states + 8 UTs sitting together. Language map: Hindi belt (north-centre), regional languages (south, east, northeast). Coalition era impact: more state autonomy, regional parties with leverage.",
      key_takeaway: "India's federalism works through: (1) linguistic reorganisation of states (7th Amendment 1956) — respecting diversity; (2) fiscal federalism via Finance Commission (41% of Central taxes to states per 15th FC); (3) cooperative federalism through GST Council (Centre + all states jointly). The coalition era (post-1989) has progressively strengthened state autonomy by giving regional parties leverage at the Centre.",
    },
  },

  {
    topicId: "sst_ch19_decentralisation",
    subject: "Social Science",
    chapterNumber: 19,
    name: "Decentralisation — Panchayati Raj and Urban Local Bodies",
    prerequisite_knowledge: ["What is local self-government", "What is a Gram Sabha", "73rd Constitutional Amendment"],
    key_formulas: [
      "73rd Amendment 1992: constitutional status for Panchayati Raj Institutions (PRIs)",
      "74th Amendment 1992: constitutional status for urban local bodies (municipalities)",
      "3-tier PRI: Gram Panchayat (village) → Panchayat Samiti (block) → Zila Parishad (district)",
      "Gram Sabha: all adult voters of a village — foundation of grassroots democracy",
      "Mandatory: elections every 5 years + minimum 1/3 seats for women",
    ],
    teaching_content: {
      intuition:
        "After independence, India built an elaborate central and state government structure. But for most villages, this government remained distant, unresponsive, and inaccessible. Decentralisation — moving power to the third tier of local self-government — was the response. The 73rd Constitutional Amendment (1992) was revolutionary: for the first time, Panchayats became constitutionally guaranteed institutions with mandatory elections, reserved seats for women and marginalised communities, and their own financial resources. India now has 3+ million elected local representatives — the world's largest local democratic experiment.",
      process_explanation:
        "PRE-1992 SITUATION:\n- Panchayats existed by state legislation but were not constitutionally guaranteed\n- Elections irregular, often postponed by state governments\n- No funds or functions devolved — 'panchayats without power'\n73rd AMENDMENT (1992) — RURAL:\n1. Part IX added to Constitution — Panchayati Raj gets constitutional status\n2. Mandatory elections every 5 years (State Election Commission ensures this)\n3. Minimum 1/3 seats for women (many states have 50%)\n4. Seats reserved for SC/ST proportional to their population; OBC reservation at state discretion\n5. State Finance Commission: must be constituted to recommend financial devolution to PRIs\n6. 11th Schedule: 29 subjects listed for transfer to Panchayats (agriculture, roads, education, water supply, health, etc.)\n7. Gram Sabha: all adult voters of the village. Must meet regularly to approve plans and review accounts.\n74th AMENDMENT — URBAN:\n- Same provisions for urban local bodies (Municipalities, Municipal Corporations)\n- 12th Schedule: 18 subjects for urban local bodies\nTYPES OF URBAN BODIES:\n- Gram Panchayat: rural, population <5000-10,000 (varies by state)\n- Nagar Panchayat: transitional (rural-to-urban area)\n- Municipal Council: medium urban areas\n- Municipal Corporation: large cities (Delhi, Mumbai, Bengaluru)\nCHALLENGES IN PRACTICE:\n- Many states reluctant to devolve 3Fs (Functions + Funds + Functionaries)\n- Sarpanch (village head) often proxy for a powerful family member\n- Women elected but their husbands sometimes attend meetings and make decisions ('Sarpanch Pati' problem)\n- Urban local bodies undermined by parallel bodies (development authorities)",
      worked_example:
        "Question: What is the significance of the mandatory one-third reservation for women in PRIs?\nAnswer: The mandatory 1/3 women's reservation in PRIs has had transformative effects:\n1. Scale: India now has 14+ lakh (1.4 million) elected women in PRIs — more than in the entire world's national parliaments combined. This is the world's largest women's political participation experiment.\n2. Policy outcomes: studies show that Gram Panchayats with women sarpanchs build more drinking water facilities, toilets, and primary health centres — reflecting different priorities from male-dominated panchayats.\n3. Social transformation: elected women gain confidence, mobility, and decision-making skills. Many go on to contest state elections. Daughters see their mothers in power.\n4. 'Sarpanch Pati' problem: in some areas, women are elected but their husbands represent them at meetings. This is declining as women gain experience.\n5. States with 50% reservation: Bihar, Rajasthan, Maharashtra, MP, Uttarakhand — going beyond the constitutional minimum.",
      common_misconceptions: [
        "73rd Amendment mandated PRIs but did NOT force states to actually transfer powers — states are 'encouraged' to devolve the 29 subjects in the 11th Schedule, but this is not mandatory. Kerala has devolved much; many other states have devolved little.",
        "Gram Sabha is NOT elected — it IS every adult voter of the village. It is the sovereign body; Gram Panchayat is elected by and accountable to the Gram Sabha.",
        "Decentralisation has NOT eliminated corruption at local level — it has moved corruption closer to citizens, but also made it more visible and easier to challenge.",
      ],
      shortcuts_and_tricks: [
        "73rd Amendment: PRIs constitutional. 74th: urban bodies. Both 1992. Elections mandatory every 5 years.",
        "3Fs for effective decentralisation: Functions + Funds + Functionaries (staff). Most states don't transfer all 3Fs adequately.",
        "Gram Sabha = all village voters (everyone). Gram Panchayat = elected body. Sarpanch = elected village head.",
      ],
      diagram_description: "3-tier PRI pyramid: Village (Gram Panchayat, Sarpanch) → Block (Panchayat Samiti, Pramukh) → District (Zila Parishad, Adhyaksha). Gram Sabha arrow from bottom. 73rd Amendment features: elections every 5 yrs + 1/3 women + SC/ST reservation + State Finance Commission + 11th Schedule (29 subjects).",
      key_takeaway: "The 73rd Amendment (1992) gave Panchayati Raj Institutions constitutional status — mandatory elections every 5 years, 1/3 women's reservation, and SC/ST representation. India now has 1.4 million+ elected women in PRIs. The 74th Amendment did the same for urban local bodies. Effective decentralisation requires transferring all 3Fs: Functions, Funds, and Functionaries — which many states have done incompletely.",
    },
  },

  // ── Chapter 20: Democracy and Diversity ───────────────────────────────────

  {
    topicId: "sst_ch20_social_differences",
    subject: "Social Science",
    chapterNumber: 20,
    name: "Social Differences — Origins and Impact on Democracy",
    prerequisite_knowledge: ["What is social identity", "Concept of ethnicity and race", "What is a minority group"],
    key_formulas: [
      "Social differences arise from: birth (gender, race, ethnicity) + social circumstances (religion, class, language)",
      "Overlapping differences: SAME people disadvantaged across multiple social divisions → more dangerous",
      "Cross-cutting differences: people who differ on one dimension share interests on another → reduces conflict",
      "Social divisions + politics = can lead to conflict OR peaceful accommodation depending on context",
    ],
    teaching_content: {
      intuition:
        "No society is homogeneous — all have internal divisions based on gender, religion, ethnicity, language, or class. These differences become politically problematic when they become the basis for systematic exclusion, discrimination, or violence. The key question is not 'do social differences exist?' (they always do) but 'under what conditions do they lead to conflict?' The distinction between 'overlapping' and 'cross-cutting' differences is the chapter's central analytical tool — and it explains why some multiethnic societies remain peaceful while others descend into civil war.",
      process_explanation:
        "1. ORIGINS OF SOCIAL DIFFERENCES:\n- Born into: gender (male/female), race, ethnicity, physical ability — unchosen\n- Social/circumstantial: religion we practice, class we grow up in, language community — can change but usually don't\n- All create group identities that can mobilise politically\n2. SOCIAL DIFFERENCES ARE UNIVERSAL:\n- Every society has divisions — the question is whether they create destructive conflict\n- USA: racial divisions. UK: class + regional divisions. India: caste + religion + language divisions\n3. OVERLAPPING vs CROSS-CUTTING:\n- OVERLAPPING: the SAME group is disadvantaged on MULTIPLE dimensions simultaneously.\n  → Example (USA): Black Americans historically = poor + excluded from voting + racially discriminated + educationally deprived → multiple disadvantages coincided for one group → explosive tension.\n  → Example (Northern Ireland): Catholic = Irish nationalist = economically poorer + politically excluded. Protestant = Unionist = economically better-off + politically powerful. Religion + class + political identity all overlap.\n  → These are more dangerous because the group has multiple grievances simultaneously.\n- CROSS-CUTTING: people who differ on one dimension SHARE INTERESTS on another.\n  → Example: In a factory, Hindu and Muslim workers both want higher wages. Religion divides them; class interest unites them.\n  → Cross-cutting loyalties reduce the intensity of any single division.\n  → In racially diverse democracies, class cross-cuts race — making politics more complex and less purely racial.\n4. SOCIAL DIVISIONS AND DEMOCRACY:\n- Democracies allow social divisions to be expressed politically (parties, elections, protests) — channelling conflict peacefully\n- Risk: political parties may mobilise along social divisions, creating divisive politics\n- Benefit: democratic negotiation can accommodate diverse groups without violence",
      worked_example:
        "Question: Explain why overlapping social divisions are more politically dangerous than cross-cutting ones.\nAnswer: Overlapping social divisions concentrate disadvantage — the same people are excluded on multiple dimensions simultaneously:\n1. Northern Ireland: being Catholic meant: Irish nationalist identity, economically poorer, historically discriminated in housing and employment, politically excluded (no voting rights until 1968). All these overlapped for the same group.\n2. This concentration creates: (a) unified grievance — one group has multiple reasons to feel wronged; (b) clear 'enemy' — the other group represents all sources of disadvantage; (c) extremism — when people feel comprehensively excluded, violent resistance seems more justified.\nIn contrast, cross-cutting divisions divide people on some issues and unite them on others:\n- A Muslim factory worker might oppose a Hindu factory owner on religious issues but unite with Hindu coworkers against the factory owner on wages.\n- These cross-pressures mean people have complex loyalties — making them more likely to compromise and less likely to support extreme positions.",
      common_misconceptions: [
        "All social differences do NOT lead to conflict — India has enormous diversity that coexists peacefully most of the time. It is specific conditions (overlapping disadvantages, political mobilisation, government failures) that cause conflict.",
        "Cross-cutting divisions do NOT eliminate conflict — they reduce its intensity. Even societies with cross-cutting cleavages experience ethnic or religious tension.",
        "Social identities are NOT fixed — people have multiple identities (Indian, Bengali, Hindu, professional, woman) and emphasise different ones in different contexts.",
      ],
      shortcuts_and_tricks: [
        "Overlapping = SAME group loses on MULTIPLE dimensions = dangerous. Cross-cutting = you're with me on one issue, against me on another = moderation.",
        "Overlapping examples: USA racial (poor+excluded+discriminated). Northern Ireland (Catholic = poor+excluded+nationalist).",
        "Cross-cutting example: workers of different religions united by class interest. Religion divides, class unites.",
      ],
      diagram_description: "Two diagrams: Overlapping (circles A, B, C all containing same shaded group — they coincide). Cross-cutting (circle A = religion, circle B = class — they partially overlap but different people in different combinations). Northern Ireland real example: Catholic circle overlapping with 'poor' and 'nationalist' circles.",
      key_takeaway: "Social differences arise from birth (race, gender) and social circumstances (religion, class). They become politically dangerous when they 'overlap' — when the same group is disadvantaged on multiple dimensions simultaneously (Northern Ireland Catholics: excluded politically AND economically AND culturally). 'Cross-cutting' differences — where people share interests across different divisions — reduce conflict intensity. Democracy channels these divisions through peaceful negotiation rather than violence.",
    },
  },

  {
    topicId: "sst_ch20_politics_division",
    subject: "Social Science",
    chapterNumber: 20,
    name: "Three Factors Determining Whether Social Division Leads to Conflict",
    prerequisite_knowledge: ["Overlapping vs cross-cutting differences", "Role of political leaders in ethnic conflict", "Government accommodation of minorities"],
    key_formulas: [
      "Factor 1: How people perceive their identity — exclusive single identity vs multiple overlapping identities",
      "Factor 2: Whether political leaders make divisive demands threatening national unity",
      "Factor 3: Whether the government accommodates minority groups' demands",
      "Outcome: conflict OR peaceful coexistence — depends on these 3 factors, not just the presence of diversity",
    ],
    teaching_content: {
      intuition:
        "Diverse societies don't automatically produce ethnic conflict — some multiethnic countries (Switzerland, India mostly, Belgium) remain largely peaceful while others (Yugoslavia, Rwanda, Sri Lanka) descend into violence. The difference is not the fact of diversity but how it is managed. Three factors determine outcomes: whether people see themselves as exclusively one identity or as having multiple loyalties; whether political leaders mobilise divisively; and whether governments respond to minority demands with accommodation or repression.",
      process_explanation:
        "1. FACTOR 1: NATURE OF IDENTITY — EXCLUSIVE vs MULTIPLE:\n- Exclusive identity: 'I am ONLY Tamil' or 'I am ONLY Muslim' — no other loyalty matters. Makes political mobilisation along that single dimension easier.\n- Multiple overlapping identity: 'I am Tamil AND Indian AND Hindu AND a doctor AND a woman' — different contexts activate different identities.\n- Multiple identities = moderation: cannot be fully mobilised by any single divisive appeal.\n- Government can encourage multiple identities through citizenship, national symbols, common institutions.\n2. FACTOR 2: POLITICAL LEADERSHIP — DIVISIVE vs INCLUSIVE:\n- Divisive demands: when a political leader claims that one community's interests are INCOMPATIBLE with another's, it escalates conflict.\n- Sri Lanka: political leaders made Tamils feel unwelcome by passing Sinhala Only Act — divisive demand.\n- Belgium: leaders chose accommodation — constitutional power sharing — inclusive.\n- Extremist leaders: can radicalize previously moderate communities by framing politics as zero-sum.\n- Moderate leaders: emphasise shared interests, compromise, accommodation.\n3. FACTOR 3: GOVERNMENT RESPONSE — ACCOMMODATION vs REPRESSION:\n- Accommodation: government recognises minority language, reserves seats, shares power — gives minority a stake in the system.\n- Repression: government refuses minority demands, responds with police/army — confirms minority fears of exclusion.\n- Historical examples:\n  - Belgium: accommodated French speakers → stability\n  - Sri Lanka: repressed Tamils → civil war\n  - India: linguistic reorganisation of states (accommodated Tamil, Bengali, Telugu speakers) → reduced secessionist pressure\n  - Northern Ireland: Good Friday Agreement 1998 → power-sharing between Catholics and Protestants → peace after decades of violence",
      worked_example:
        "Question: Apply the 3 factors to explain why India's linguistic diversity has not led to the kind of ethnic conflict seen in Sri Lanka.\nAnswer:\n1. Identity: Indians generally have MULTIPLE overlapping identities — Indian + state identity + religious + caste + professional. Being Tamil does not exclude being Indian. Cricket, films, and economic migration create pan-Indian identity.\n2. Leadership: Indian political leaders (with some exceptions) have not consistently promoted the idea that 'Tamil interest' is INCOMPATIBLE with 'Indian interest.' The demand has been for more state autonomy and recognition — not separation. Even DMK (Tamil nationalist party) has worked within India's federal structure.\n3. Government accommodation: the linguistic reorganisation of states (1956) was the crucial accommodation — Tamil Nadu got Tamil as its state language, West Bengal got Bengali, etc. The government also stopped the forced imposition of Hindi on south India (responding to protests in 1960s). These accommodations gave linguistic groups a stake in Indian democracy.\nConclusion: India's system of linguistic federalism — accommodating diversity rather than suppressing it — prevented the Sri Lanka scenario.",
      common_misconceptions: [
        "Diversity alone does NOT cause conflict — Switzerland has 4 official languages and is one of the world's most stable democracies. The 3 factors (identity, leadership, government response) are the crucial variables.",
        "Accommodation is NOT the same as appeasement — recognising linguistic or cultural rights of minorities does not undermine national unity; it actually strengthens it by giving minorities a stake in the system.",
        "Political leaders cannot always control how populations respond to divisive appeals — but they can choose to mobilise divisively or not. This is why leadership is one of the 3 key factors.",
      ],
      shortcuts_and_tricks: [
        "3 factors: Identity (exclusive or multiple) + Leadership (divisive or inclusive) + Government (accommodate or repress).",
        "Good outcomes: multiple identity + inclusive leadership + accommodation = Belgium/India mostly.",
        "Bad outcomes: exclusive identity + divisive leadership + repression = Sri Lanka/Yugoslavia.",
      ],
      diagram_description: "3-factor decision tree: Identity (exclusive → dangerous, multiple → safer) + Leadership (divisive → conflict, inclusive → stability) + Government response (repression → conflict, accommodation → stability). Best case: multiple identity + inclusive leadership + accommodation. Worst case: exclusive + divisive + repression.",
      key_takeaway: "Whether social diversity leads to conflict depends on three factors: (1) whether people hold exclusive or multiple identities; (2) whether political leaders make divisive demands; (3) whether governments accommodate or repress minority demands. India's linguistic reorganisation (accommodation) prevented Tamil/Bengali nationalism from becoming separatist; Sri Lanka's repression led to civil war. The same diversity can produce peace or conflict depending on these factors.",
    },
  },

  // ── Chapter 21: Gender, Religion and Caste ────────────────────────────────

  {
    topicId: "sst_ch21_gender",
    subject: "Social Science",
    chapterNumber: 21,
    name: "Gender Division and Politics — Patriarchy and Women's Political Representation",
    prerequisite_knowledge: ["What is gender equality", "Concept of patriarchy", "Women in Indian politics"],
    key_formulas: [
      "Gender division of labour: social (not biological) assignment of domestic work to women, paid work to men",
      "Patriarchy: social system in which men hold primary power in family, society, and institutions",
      "Women's political representation in Lok Sabha: ~14-15% (2024) — far below 50% population share",
      "73rd Amendment 1992: 1/3 PRI seats for women → 14+ lakh elected women in India",
      "Women's Reservation Bill 2023 (106th Amendment): 33% reservation in Lok Sabha and state assemblies",
    ],
    teaching_content: {
      intuition:
        "Women constitute 50% of India's population but hold only ~15% of parliamentary seats, earn less than men for the same work, and bear the disproportionate burden of unpaid domestic labour. This is not natural — it is the result of a patriarchal social system that has systematically excluded women from economic and political power. The feminist movement has fought to change this, with significant results: women vote in equal numbers to men, lead major corporations, serve as judges and scientists. But structural inequality persists — gender is still one of the most powerful determinants of life chances in India.",
      process_explanation:
        "1. PATRIARCHAL SOCIETY:\n- Men hold primary authority in family (decision-making), economy (earning), and politics (representation)\n- Women's domestic work (cooking, childcare, cleaning) is economically invisible — not counted in GDP\n- Women's paid work is typically lower-status and lower-paid\n- Girls' education often deprioritised when resources are scarce\n2. GENDER AND THE ECONOMY:\n- Female Labour Force Participation Rate (FLFPR): ~30% in India (2022) — one of world's lowest\n- Gender Pay Gap: women earn ~20-30% less than men for same work in India\n- Glass ceiling: women rarely reach top corporate positions\n- Domestic work: women do ~80%+ of household work in India; men do ~20%\n- Double burden: women who work outside do paid + unpaid domestic work\n3. GENDER AND POLITICS:\n- Women vote as much as men (turnout near equal) but are represented unequally\n- Lok Sabha: ~14-15% women (2024). Much less than Nordic countries (40-50%)\n- State assemblies: similar underrepresentation\n- PRIs: 1/3 reservation → 14 lakh+ elected women. First major breakthrough.\n- Women's Reservation Bill 2023: passed as 106th Constitutional Amendment — 33% reservation in Lok Sabha and state assemblies. But effective after next delimitation (likely 2027+).\n4. FEMINIST MOVEMENT:\n- Waves: 1st wave (voting rights, 19th century), 2nd wave (equal pay, reproductive rights, 1960s-70s), 3rd wave (intersectionality)\n- India: women's movement → laws against dowry (1961, amended 1983, 2005), domestic violence (2005), sexual harassment (POSH Act 2013, after Vishaka guidelines 1997)\n5. THE PERSONAL IS POLITICAL:\n- Feminist insight: gender inequality in private sphere (family) is connected to political exclusion",
      worked_example:
        "Question: Why is women's political representation still low in India despite high voter turnout?\nAnswer: Women vote in equal (sometimes higher) numbers than men — but are rarely selected as candidates because:\n1. Candidate selection: parties nominate candidates based on perceived 'winnability' — and in many constituencies, voters prefer male candidates due to patriarchal norms. Parties therefore nominate men.\n2. Money: elections require large campaign funds. Women typically control fewer financial resources.\n3. Family barriers: political careers require extensive public time and travel — families often don't support women in politics.\n4. Safety: women candidates face harassment, including sexual comments and threats, that deters participation.\n5. No reservation (national): without mandatory reservation (unlike PRIs), market dynamics produce male-dominant nominations.\n6. Network: politics is relationship-based. Old-boy networks exclude women from party machinery.\nSolution: the 106th Amendment (2023) mandates 33% reservation in Lok Sabha/state assemblies — once implemented, it will change the candidate pool structurally.",
      common_misconceptions: [
        "Voting equality does NOT equal political equality — the fact that women vote equally to men does not mean women have equal political power. Representation in legislatures is a separate, structural issue.",
        "PRI reservation has NOT automatically empowered all women — in some areas, husbands conduct panchayat business while wives hold the elected position ('Sarpanch Pati'). True empowerment requires cultural change alongside legal change.",
        "Gender inequality is NOT only about income — it includes: safety (violence against women), health (nutrition, maternal mortality), education (girl dropout rates), and political representation.",
      ],
      shortcuts_and_tricks: [
        "Women in Lok Sabha: ~15% (2024). PRI: 1/3 mandatory → 14 lakh+ women elected. 106th Amendment 2023: 33% Lok Sabha/state assemblies (after delimitation).",
        "FLFPR India: ~30% — very low globally. Double burden: paid work + unpaid domestic work.",
        "Women's laws: Dowry Prohibition 1961, Domestic Violence Act 2005, POSH 2013 (sexual harassment at work).",
      ],
      diagram_description: "Gender inequality pyramid: base = daily life (domestic work 80%), middle = economy (pay gap, low FLFPR), top = politics (15% Lok Sabha). PRI success story: 73rd Amendment → 14 lakh women. 106th Amendment 2023 future path. Feminist waves timeline.",
      key_takeaway: "Patriarchy systematically undervalues women's domestic work and excludes women from economic and political power. Women hold only ~15% of Lok Sabha seats despite constituting 50% of voters. The 73rd Amendment (mandatory 1/3 PRI reservation) created 14 lakh+ elected women in local governance — the world's largest women's political participation experiment. The 106th Amendment (2023) promises 33% reservation in Lok Sabha and state assemblies once implemented.",
    },
  },

  {
    topicId: "sst_ch21_religion_politics",
    subject: "Social Science",
    chapterNumber: 21,
    name: "Religion and Politics — Secularism vs Communalism",
    prerequisite_knowledge: ["What is secularism", "Concept of communalism", "India as a secular state"],
    key_formulas: [
      "Secularism: state maintains neutrality on religion; all religions treated equally; no state religion",
      "Communalism: political use of religion to create divisive 'us vs them' identity politics",
      "India's secularism: no official state religion + state can intervene in religious practice for rights",
      "Communalism → partition (1947) → Babri Masjid demolition (1992) → riots",
      "India's approach: separate from USA (wall of separation) — India intervenes to protect rights",
    ],
    teaching_content: {
      intuition:
        "India is the world's largest democracy with the world's largest Hindu population, its second largest Muslim population, 25 million Christians, 20 million Sikhs, 8 million Jains, 8 million Buddhists, and more. Managing this religious diversity without communal conflict is one of democracy's greatest challenges. India adopted secularism — not the separation of church and state of the American model, but a pluralistic model where the state treats all religions equally and can intervene in religious practices to protect individual rights.",
      process_explanation:
        "1. WHAT IS COMMUNALISM:\n- Political ideology that uses religious identity to create divisive politics\n- Claims: Hindu interests are different from and opposed to Muslim interests (or vice versa) — and that religion should determine political choices\n- Forms: prejudice → stereotyping → political mobilisation → riots → targeted violence → pogroms\n- Historical consequence: 1947 Partition — communalism led to India's division and the bloodiest forced migration in history (15 million displaced, 200,000-2 million killed)\n- Post-independence: communal riots (1969 Ahmedabad, 1984 anti-Sikh riots, 1992-93 Bombay riots, 2002 Gujarat, 2013 Muzaffarnagar)\n2. INDIA'S SECULARISM (Art. 25-28, 15, 14):\n- No state religion (unlike Pakistan = Islamic republic, or UK where Church of England is state church)\n- All religions equal before law; no discrimination on religious grounds (Art. 15)\n- Religious freedom guaranteed (Art. 25): practice, propagate, profess any religion\n- BUT the state can intervene in religious practice for: social reform, public order, morality, health\n  → Abolished untouchability (religious practice) under Art. 17\n  → Banned triple talaq (Muslim personal law practice) 2019\n  → Banned Sati (Hindu practice) 1829\n3. INDIA vs USA SECULARISM:\n- USA: 'wall of separation' — state and religion completely separate. State does not intervene in religious practice.\n- India: 'principled distance' — state maintains distance from religion but can intervene when rights are violated. More appropriate for diverse society.\n4. HOW RELIGION ENTERS POLITICS LEGITIMATELY:\n- Religious communities can express political demands (land for religious sites, personal law, religious education)\n- This is NOT communalism if the demand is specific and does not claim that other religions' interests are opposed\n- Communalism arises when religion becomes the PRIMARY political identity and is used to mobilise AGAINST another religion",
      worked_example:
        "Question: Distinguish between legitimate political expression of religious communities and communalism.\nAnswer: Not all religion in politics is communalism:\nLEGITIMATE:\n- A Muslim organisation advocates for better implementation of Waqf Board laws.\n- A Christian community petitions for the right to run minority educational institutions.\n- A Sikh group protests against restrictions on turbans in public spaces.\nThese are specific demands for rights — they don't claim that other religions are enemies.\nCOMMUNALISM:\n- A political party claims that Muslims are inherently disloyal to India.\n- A leader campaigns on the basis that Hindus and Muslims cannot live together.\n- Violence is directed against all members of a religious community based on religion alone.\n- The key difference: communalism sees religion as creating irreconcilably opposed interests between communities. Legitimate religious politics advocates for specific community interests within a shared democratic framework.",
      common_misconceptions: [
        "India's secularism is NOT the same as atheism or anti-religion — it means equal treatment of all religions, not the absence of religion from public life. Religious festivals, practices, and institutions are fully legal.",
        "Communalism is NOT only a 'Hindu problem' or only a 'Muslim problem' — it exists in all religious communities, and partition was caused by communalism on all sides.",
        "Secularism does NOT mean the state cannot fund religious institutions — India funds Hindu temples (government-managed temples in some states), Haj (Muslim pilgrimage), and Christian missions for education. What secularism prohibits is state religion and discrimination.",
      ],
      shortcuts_and_tricks: [
        "Communalism = religious identity used for divisive politics. Partition 1947 = worst outcome of communalism.",
        "India's secularism: no state religion + equal treatment + can intervene for rights (different from USA's wall of separation).",
        "India's constitutional articles: Art. 25-28 (religious freedom) + Art. 15 (no religious discrimination) + Art. 17 (abolition of untouchability).",
      ],
      diagram_description: "Secularism spectrum: USA (strict separation: wall of church-state) vs India (principled distance: equal treatment + can intervene). Communalism escalation ladder: prejudice → stereotypes → political mobilisation → riots → violence. India's religious diversity pie chart: Hindu 79%, Muslim 15%, Christian 2.3%, Sikh 1.7%, others.",
      key_takeaway: "Communalism politicises religious identity into divisive 'us vs them' politics — its worst outcome was India's Partition (1947). India adopted secularism (no state religion, equal treatment of all religions) — but unlike the USA's strict church-state separation, India practices 'principled distance': the state can intervene in religious practices to protect individual rights (abolished untouchability, banned triple talaq). This distinction is crucial for India's religious diversity.",
    },
  },

  {
    topicId: "sst_ch21_caste",
    subject: "Social Science",
    chapterNumber: 21,
    name: "Caste and Politics — Mandal Commission and Reservations",
    prerequisite_knowledge: ["What is the caste system", "Concept of untouchability", "What is reservation policy"],
    key_formulas: [
      "Caste system: hereditary social hierarchy — Brahmin → Kshatriya → Vaishya → Shudra → Dalit (outside varna)",
      "Constitution: abolished untouchability (Art. 17); prohibited caste discrimination (Art. 15); reservations for SC/ST (Art. 15, 16)",
      "Mandal Commission (1979): identified OBCs as 52% of population; recommended 27% reservation for OBCs",
      "Implemented 1990 (V.P. Singh) → massive protests → SC upheld with 50% cap (Indra Sawhney 1992)",
      "Total reservation in central jobs: SC 15% + ST 7.5% + OBC 27% = 49.5%",
    ],
    teaching_content: {
      intuition:
        "Caste is India's most persistent social inequality — a hereditary system that determined one's occupation, who one could marry, where one could live, and even what one could touch. Dalits (formerly 'untouchables') were excluded from the Hindu social order entirely, forced to do 'polluting' occupations, and denied access to temples, wells, and schools. The Constitution abolished untouchability and established reservations to correct centuries of exclusion. But caste has not disappeared — it has entered electoral politics as a powerful organising force, with parties competing for caste vote banks.",
      process_explanation:
        "1. CASTE HIERARCHY:\n- Varna system: Brahmin (priests/scholars), Kshatriya (warriors/rulers), Vaishya (merchants), Shudra (servants/labourers)\n- Dalits: 'Avarna' — outside the varna system, considered 'untouchable.' Forced into scavenging, leather work, cleaning.\n- Jati: thousands of sub-castes within the varna system — determines occupation, marriage partners, village hierarchy\n2. CONSTITUTIONAL PROVISIONS:\n- Art. 17: Abolition of untouchability (practice, not just discrimination) — criminal offence\n- Art. 15: No discrimination on grounds of religion, race, caste, sex, place of birth\n- Art. 16(4): Reservations in government jobs for 'backward classes'\n- Protection of Civil Rights Act 1955, SC/ST (Prevention of Atrocities) Act 1989\n3. RESERVATION POLICY:\n- SC (Scheduled Castes/Dalits): 15% in central govt jobs and education (proportional to ~16.6% population)\n- ST (Scheduled Tribes/Adivasis): 7.5% (proportional to ~8.6% population)\n- OBC (Other Backward Classes): 27% recommended by Mandal Commission, upheld by Supreme Court\n- Total: 49.5% (SC stopped at 50% cap set in Indra Sawhney case 1992)\n4. MANDAL COMMISSION:\n- Set up 1979 by PM Morarji Desai under B.P. Mandal\n- Identified OBCs as ~52% of India's population\n- Recommended 27% central govt reservation for OBCs\n- Implemented August 1990 by PM V.P. Singh\n- Massive protests by upper-caste students (immolations, riots)\n- SC upheld in Indra Sawhney case (1992) with 50% cap on total reservations\n5. CASTE IN DEMOCRACY:\n- Positive: reservations gave lower castes political voice; Dalit leaders (Ambedkar, Mayawati, Ram Vilas Paswan) rose to power\n- Negative: caste-based voting reduces focus on development issues; 'caste arithmetic' determines candidate selection\n- Caste solidarity across classes: a rich Dalit and a poor Dalit may vote for the same party based on caste identity",
      worked_example:
        "Question: Why does caste persist as a political identity in independent India despite constitutional prohibitions?\nAnswer: Despite constitutional abolition of caste discrimination:\n1. Social persistence: caste still determines marriage partners for ~95% of Indians (endogamy), creates social networks, and shapes self-identity. It didn't disappear from social life.\n2. Economic dimension: lower castes are disproportionately poor. Voting together gives them collective bargaining power to demand redistribution.\n3. Political incentives: when party A mobilises caste X as a vote bank, party B must mobilise caste Y in response — creating a cycle of caste politics even when parties don't want it.\n4. Reservations made caste politically salient: identifying as SC, ST, or OBC provides access to reservation benefits — making caste identity worth claiming rather than abandoning.\n5. Historical injustice: lower castes remember centuries of oppression. Caste solidarity is a collective response to a collective historical injury.\nResult: caste is simultaneously declining in social practice (inter-caste marriages increasing, urban anonymity) and increasing in political salience (new caste parties, OBC politics).",
      common_misconceptions: [
        "Reservations are NOT based on economic poverty — SC/ST reservations are based on historical social exclusion (caste discrimination), not current income. A rich Dalit still qualifies for SC reservation.",
        "Reservations have NOT created a 'creamy layer' problem only for OBCs — the Supreme Court has excluded the 'creamy layer' (higher-income OBCs) from OBC reservations, but SC/ST have no such exclusion.",
        "Mandal Commission did NOT invent OBC reservations — several states had OBC reservations before 1990 (Tamil Nadu since 1970s with 50%+ OBC reservations). The 1990 implementation extended this nationally.",
      ],
      shortcuts_and_tricks: [
        "Reservation breakdown: SC 15% + ST 7.5% + OBC 27% = 49.5% (just under 50% Supreme Court cap).",
        "Mandal Commission: 1979 (set up) → 1980 (report) → 1990 (implemented by V.P. Singh) → 1992 (SC upheld in Indra Sawhney).",
        "Art. 17 = untouchability abolished (criminal offence). Art. 15 = no caste discrimination. Art. 16(4) = reservations for backward classes.",
      ],
      diagram_description: "Caste hierarchy pyramid: Brahmin → Kshatriya → Vaishya → Shudra → Dalits (below pyramid, outside). Reservation pie: SC 15%, ST 7.5%, OBC 27%, general 50.5%. Mandal Commission timeline: 1979 → 1980 report → 1990 implementation → 1992 SC ruling. Political impact: Dalit parties (BSP), OBC parties (SP, JDU) emerged.",
      key_takeaway: "India's caste system — a hereditary hierarchy relegating Dalits to exclusion — was constitutionally abolished (Art. 17) and reservations established for SC (15%), ST (7.5%), and OBC (27%) to correct historical exclusion. The Mandal Commission (1979) identified OBCs as 52% of the population and recommended 27% reservation — implemented 1990 amid protests, upheld by Supreme Court 1992. Caste persists as a political identity because it provides collective bargaining power for historically excluded communities.",
    },
  },

  // ── Chapter 22: Popular Struggles and Movements ───────────────────────────

  {
    topicId: "sst_ch22_struggles",
    subject: "Social Science",
    chapterNumber: 22,
    name: "Popular Struggles — Bolivia Water War and Nepal Democracy Movement",
    prerequisite_knowledge: ["What is civil society", "What is civil disobedience", "Concept of popular sovereignty"],
    key_formulas: [
      "Bolivia Water War (2000): privatisation of Cochabamba water supply to Bechtel → 4x price rise → mass protest → reversal",
      "Nepal democracy movement (2006): King Gyanendra's coup → parties + Maoists unite → mass protest → parliament restored",
      "Popular struggle: organised collective action by citizens to influence/challenge government decisions",
      "Mobilisation: by political parties, pressure groups, or spontaneous popular action",
    ],
    teaching_content: {
      intuition:
        "Elections happen once every 4-5 years. Between elections, citizens need ways to hold governments accountable and push for change — this is where popular struggles come in. The Bolivia Water War showed that even in a small, poor country, organised citizen action can reverse a policy imposed by a government complying with IMF conditions. Nepal's democracy movement showed that popular mobilisation can bring down autocratic regimes. These are not ancient history — they happened in 2000 and 2006 — and they show the vitality of democracy as a practice, not just a constitutional arrangement.",
      process_explanation:
        "BOLIVIA WATER WAR (2000):\n1. Background: Bolivia needed IMF loans. IMF condition: privatise the water company (SEMAPA) in Cochabamba.\n2. Privatisation: government sold SEMAPA to Aguas del Tunari (Bechtel consortium).\n3. Price increase: Bechtel raised water prices 4x (400%) overnight. For poor households, the water bill equalled wages.\n4. Mobilisation: FEDECOR (Federation of water users' organisations) organised: blockades, strikes, marches. All sections — factory workers, farmers, professionals — united.\n5. Government response: martial law declared, protestors fired upon (one teenager killed). But the movement held.\n6. Outcome: April 2000 — government cancelled Bechtel contract, reversed privatisation. SEMAPA returned to public control.\n7. Lesson: popular organised pressure can override both IMF conditions and government decisions.\n\nNEPAL DEMOCRACY MOVEMENT (2006):\n1. Background: Nepal had a constitutional monarchy with elected parliament. Maoist insurgency since 1996.\n2. King Gyanendra's coup: 2005 — dismissed parliament, took direct power, suspended civil liberties.\n3. Alliance: 7 major political parties + Maoist rebels formed an unprecedented alliance against autocracy.\n4. Mass protests: April 2006 — millions marched across Nepal for 19 days. Kathmandu paralysed.\n5. Outcome: King Gyanendra forced to restore parliament. Parliament stripped King of powers.\n6. 2008: Nepal declared a federal democratic republic. Monarchy abolished. Constituent Assembly elected.\n7. Lesson: democratic struggle can succeed through sustained popular mobilisation, even without violence.",
      worked_example:
        "Question: How did the Bolivia Water War demonstrate that 'popular struggle' can change government policy?\nAnswer: The Bolivia Water War succeeded because it combined three elements:\n1. Broad coalition: FEDECOR united farmers, factory workers, students, professional organisations, and environmental groups — crossing class and sector lines. No single group could be isolated and ignored.\n2. Sustained pressure: the movement escalated from protests to strikes to roadblocks, maintaining pressure for weeks.\n3. Government vulnerability: the Bolivian government was already economically stressed. The political cost of maintaining martial law against a broad coalition exceeded the political cost of reversing the privatisation.\nThe deeper lesson: governments are not omnipotent. When citizens organise broadly and sustain pressure, they can change even 'externally imposed' policies (the IMF condition). This shows popular sovereignty is not just a constitutional idea — it is a practical force in democracy.",
      common_misconceptions: [
        "Bolivia's water war was NOT just about water prices — it was about who owns public resources (water) and whether corporate profit should take priority over human need. It became a symbol globally of resistance to privatisation.",
        "Nepal's 2006 movement did NOT immediately create stable democracy — the Constituent Assembly process took years, and Nepal's politics remained turbulent. But it successfully ended the monarchy and established a republican framework.",
        "Popular struggles are NOT always successful — many movements fail or are violently suppressed (1989 Tiananmen Square). Success depends on coalition breadth, government vulnerability, and sometimes international pressure.",
      ],
      shortcuts_and_tricks: [
        "Bolivia 2000: water privatisation → Bechtel → 4x price → FEDECOR leads protest → government reverses. Year: 2000.",
        "Nepal 2006: King Gyanendra's coup 2005 → 7 parties + Maoists → 19-day protests → parliament restored → monarchy abolished 2008.",
        "Key principle: popular struggles fill the accountability gap between elections. They are democracy in action, not against it.",
      ],
      diagram_description: "Bolivia timeline: IMF condition → SEMAPA privatised to Bechtel → 400% price rise → FEDECOR organises → mass protest → martial law → protest continues → contract cancelled. Nepal timeline: Maoist insurgency → King's coup 2005 → 7 parties + Maoists unite → April 2006 protests (19 days) → parliament restored → monarchy abolished 2008.",
      key_takeaway: "Popular struggles — organised citizen action outside formal institutions — are essential features of democracy. The Bolivia Water War (2000) reversed an IMF-mandated privatisation through broad coalition protest. Nepal's democracy movement (2006) restored parliamentary democracy after a royal coup through 19 days of mass protests. These cases show that democracy is not only elections but ongoing citizen engagement between elections.",
    },
  },

  {
    topicId: "sst_ch22_movements",
    subject: "Social Science",
    chapterNumber: 22,
    name: "Pressure Groups vs Political Parties — Roles in Democracy",
    prerequisite_knowledge: ["What is a political party", "What is a lobby group", "Concept of civil society"],
    key_formulas: [
      "Pressure group: organisation representing specific interest, tries to influence govt WITHOUT contesting elections",
      "Political party: seeks to form government BY contesting elections",
      "Sectional groups: represent a specific section (FICCI = business, AITUC = labour)",
      "Public interest groups: claim to represent all citizens (NBA = Narmada Bachao Andolan)",
      "Social movement: long-term, mass-based action for broad social change (women's movement, environmental movement)",
    ],
    teaching_content: {
      intuition:
        "Between elections, how do citizens and organised groups influence government? Through pressure groups — organisations that lobby, protest, campaign, and advocate for specific interests without seeking to form governments themselves. Every democracy has them: business chambers (FICCI), trade unions (AITUC), environmental groups (Greenpeace), farmers' associations (BKU). They are an essential part of democracy's ecosystem — representing interests that parties don't adequately address, keeping governments informed about specific sector needs, and holding them accountable on specialised issues.",
      process_explanation:
        "1. PRESSURE GROUPS (INTEREST GROUPS):\n- Do NOT contest elections\n- Influence government through: lobbying (meeting officials), demonstrations, strikes, media campaigns, research publications\n- Types:\n  a) SECTIONAL interest groups: represent a specific section of society\n  - FICCI (Federation of Indian Chambers of Commerce): represents big business interests\n  - AITUC (All India Trade Union Congress): represents organised labour\n  - BKU (Bharatiya Kisan Union): farmers\n  - BMA (British Medical Association in UK): doctors\n  b) PUBLIC INTEREST groups: claim to work for all citizens/society\n  - Narmada Bachao Andolan (NBA): rights of dam-displaced tribal communities + environment\n  - BAMCEF (Bahujan Mukti Morcha): Dalit rights\n  - RTI movement: transparency in governance\n2. SOCIAL MOVEMENTS:\n- Broader than pressure groups — long-term campaigns for fundamental social change\n- Less formally organised, more fluid and diverse\n- Examples: women's movement, civil rights movement, environmental movement, anti-caste movement\n- Difference from pressure group: social movements address systemic change; pressure groups address specific policy issues\n3. RELATIONSHIP BETWEEN PRESSURE GROUPS AND PARTIES:\n- Sometimes overlap: some pressure groups are front organisations for parties (union fronts)\n- Sometimes transform: pressure groups can become parties (Greenpeace in Germany became Green Party)\n- Sometimes compete: NGOs and civic organisations vs political parties for public trust\n4. ARE PRESSURE GROUPS GOOD FOR DEMOCRACY?\n- Arguments FOR: represent diverse interests; keep governments informed; provide accountability between elections\n- Arguments AGAINST: well-funded groups (corporations) have disproportionate access; may bypass democratic mandate; some may represent narrow rather than public interest\n5. INDIA EXAMPLES:\n- Narmada Bachao Andolan: challenged Sardar Sarovar Dam, demanded rehabilitation of displaced tribals\n- FEDECOR (Bolivia): successfully reversed privatisation\n- RTI movement: campaigned for Right to Information Act 2005",
      worked_example:
        "Question: How are pressure groups different from political parties, and why does democracy need both?\nAnswer:\nDifferences:\n- Parties seek to FORM GOVERNMENT by winning elections. Pressure groups seek to INFLUENCE GOVERNMENT without standing for election.\n- Parties have broad agendas covering all governance issues. Pressure groups focus on specific issues (environment, labour, business).\n- Party leaders become ministers; pressure group leaders remain outsiders who lobby ministers.\n- Parties are accountable to voters; pressure groups are accountable only to their members.\nWhy democracy needs both:\n1. Parties cannot represent all interests equally — a party must balance competing interests of many groups (urban vs rural, business vs labour). Pressure groups fill in specific gaps.\n2. Between elections: parties have a 4-5 year mandate. Pressure groups provide ongoing, specialised accountability.\n3. Technical expertise: pressure groups often have deeper expertise on specific issues than general political parties — farmers' unions know agriculture policy better than most MPs.\n4. Voice for minorities: some groups (tribals, disabled people) may not have enough votes to influence parties directly — pressure groups give them organised voice.",
      common_misconceptions: [
        "Pressure groups are NOT anti-democratic — lobbying and advocacy are legitimate democratic activities. They become problematic only when they use illegal means or when money buys disproportionate influence.",
        "Public interest groups are NOT always neutral — NGOs and social movements have their own perspectives and sometimes represent specific ideological viewpoints. 'Public interest' is often contested.",
        "Social movements do NOT require formal organisation — unlike political parties or registered NGOs, social movements can be diffuse networks of like-minded citizens without hierarchy.",
      ],
      shortcuts_and_tricks: [
        "Party: contests elections → forms government. Pressure group: does NOT contest elections → influences government.",
        "Sectional = specific group (FICCI = business, AITUC = labour). Public interest = all citizens (NBA = displaced tribals + environment).",
        "Social movement = broader than pressure group. Long-term, mass-based, often transforming into or influencing parties.",
      ],
      diagram_description: "Two-column table: Political Party (contests elections, broad agenda, forms government, accountable to voters) vs Pressure Group (no elections, specific agenda, influences government, accountable to members). Pressure group types: sectional (FICCI, AITUC, farmers) vs public interest (NBA, RTI movement, environmental groups). Methods: lobbying, demonstrations, strikes, media campaigns.",
      key_takeaway: "Pressure groups represent specific interests (sectional: FICCI for business, AITUC for labour) or claim to represent all citizens (public interest: Narmada Bachao Andolan). Unlike parties, they do not contest elections — they influence governments through lobbying, demonstrations, and campaigns. Social movements (women's movement, civil rights) address broader systemic change. Both pressure groups and parties are essential to democracy: parties form governments; pressure groups provide specialised, ongoing accountability between elections.",
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
  console.log(`✅ SST PolSci Content: ${created} created, ${updated} updated`);
  await mongoose.disconnect();
}
run().catch(e => { console.error(e); process.exit(1); });
