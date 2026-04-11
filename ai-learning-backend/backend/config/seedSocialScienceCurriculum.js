/**
 * CBSE Class 10 Social Science — Complete Curriculum Seed
 * Source: NCERT Class 10 Social Science Textbooks
 *   History   (jess301–jess305) → Ch 1-5
 *   Geography (jess101–jess107) → Ch 6-12
 *   Economics (jess201–jess205) → Ch 13-17
 *   Political Science (jess401–jess405) → Ch 18-22
 * Run: npm run seed:social-science-curriculum
 */
import "dotenv/config";
import mongoose from "mongoose";
import { Chapter } from "../models/chapterModel.js";

const CHAPTERS = [
  // ══════════════════ HISTORY ══════════════════
  {
    chapterNumber: 1,
    title: "The Rise of Nationalism in Europe",
    subject: "Social Science",
    grade: "10",
    board: "CBSE",
    unit: "History",
    examMarks: 10,
    estimatedWeeks: 2,
    overview: "Traces the emergence of nationalism in Europe after the French Revolution — how ideas of liberty, equality, and fraternity inspired people across Europe to demand nation-states. Covers the role of culture, language, and the 1848 revolutions.",
    sections: [
      {
        sectionNumber: "1.1",
        title: "The French Revolution and the Idea of the Nation",
        microConcepts: [
          { title: "French Revolution 1789: liberty, equality, fraternity — spread to rest of Europe" },
          { title: "Napoleon Bonaparte: Napoleonic Code — uniform laws, abolished feudalism" },
          { title: "Dual impact of Napoleon: liberator in some areas, conqueror in others" },
          { title: "Nationalism: loyalty to the nation-state, not a king or religion" },
        ],
      },
      {
        sectionNumber: "1.2",
        title: "The Making of Nationalism in Europe",
        microConcepts: [
          { title: "German-speaking kingdoms in 1800: Prussia, Austria-Hungary, many small states" },
          { title: "Romantic nationalism: Grimm brothers (folklore), composers, artists — cultural unity" },
          { title: "Role of language: German language used to unite German-speaking peoples" },
          { title: "Revolutions of 1830, 1848: liberal movements demanding constitutions, national unity" },
        ],
      },
      {
        sectionNumber: "1.3",
        title: "The Age of Revolutions (1830–1848)",
        microConcepts: [
          { title: "Greece independence 1832 (from Ottoman Empire) — first nationalist movement" },
          { title: "1848: liberal revolution in France → spread to Germany, Italy, Austria" },
          { title: "Frankfurt Parliament 1848: attempted German unification, failed" },
          { title: "Role of women in nationalist movements — marginalised in actual decision-making" },
        ],
      },
      {
        sectionNumber: "1.4",
        title: "Unification of Germany and Italy",
        microConcepts: [
          { title: "Germany: unified by Prussia under Bismarck ('blood and iron' policy) — 1871" },
          { title: "Key figures Germany: Kaiser Wilhelm I, Otto von Bismarck (Iron Chancellor)" },
          { title: "Italy: unified by Cavour (diplomacy), Mazzini (ideology), Garibaldi (military)" },
          { title: "Mazzini's 'Young Italy' — secret society for Italian nationalism" },
          { title: "Role of wars: Austria (1866), France (1870-71) in German/Italian unification" },
        ],
      },
      {
        sectionNumber: "1.5",
        title: "Visualising the Nation",
        microConcepts: [
          { title: "Nation represented as female figure: Germania (Germany), Marianne (France)" },
          { title: "Nationalism and imperialism: European nations exported nationalism to colonies" },
          { title: "Balkans: region of conflict — nationalism + break-up of Ottoman Empire → WW1" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "Nationalism = idea that people sharing language/culture/history form a nation",
      "Timeline: French Revolution (1789) → Napoleon → 1848 Revolutions → German unification (1871)",
      "Mazzini (ideology) + Cavour (diplomacy) + Garibaldi (military) = Italian unification",
    ],
    examTips: [
      "Know the three stages of European nationalism: ideas → revolutions → unifications",
      "Bismarck's 'blood and iron' vs Mazzini's 'Young Italy' — two very different approaches to nationalism",
      "Allegory: Germania, Marianne — female figures symbolising nations; know what attributes they hold",
      "Grimm Brothers and Romantic Nationalism — cultural nationalism before political nationalism",
    ],
    exercises: [
      { exerciseNumber: "Exercise 1", questionCount: 12, types: ["MCQ", "Short Answer", "Long Answer", "Source Based"] },
    ],
  },

  {
    chapterNumber: 2,
    title: "Nationalism in India",
    subject: "Social Science",
    grade: "10",
    board: "CBSE",
    unit: "History",
    examMarks: 10,
    estimatedWeeks: 3,
    overview: "The growth of Indian nationalism after WWI — Non-Cooperation Movement, Civil Disobedience Movement, role of Gandhi, various social groups, and the limits of the Congress's nationalist vision.",
    sections: [
      {
        sectionNumber: "2.1",
        title: "The First World War, Khilafat and Non-Cooperation",
        microConcepts: [
          { title: "WW1 economic impact: high taxes, forced recruitment, inflation — popular discontent" },
          { title: "Rowlatt Act 1919: detention without trial → Jallianwala Bagh (13 April 1919)" },
          { title: "Khilafat issue: Caliph of Turkey weakened after WW1; Muslims anxious" },
          { title: "Gandhi's alliance with Khilafat leaders — Hindu-Muslim unity" },
          { title: "Non-Cooperation Movement 1920: boycott of councils, courts, schools, foreign cloth" },
          { title: "Chauri Chaura 1922: violence → Gandhi calls off movement" },
        ],
      },
      {
        sectionNumber: "2.2",
        title: "Differing Strands within the Movement",
        microConcepts: [
          { title: "Peasants in Awadh: Baba Ramchandra led movement against talukdars and rent" },
          { title: "Tribal movements: Alluri Sitaram Raju (forest laws violation) in Andhra" },
          { title: "Industrial workers: Nagpur strikes but Congress feared anarchism" },
          { title: "Women's participation: picket shops, attended meetings — new public role" },
        ],
      },
      {
        sectionNumber: "2.3",
        title: "The Sense of Collective Belonging",
        microConcepts: [
          { title: "Nationalism through songs, folklore, art, history — Bankim Chandra's Vande Mataram" },
          { title: "Abanindranath Tagore's Bharat Mata — female figure holding book, rice, cloth, mala" },
          { title: "Folklore — Rabindranath Tagore's revival of Indian folk songs" },
          { title: "Unifying symbols: tricolour flag designed by Gandhi (1921)" },
        ],
      },
      {
        sectionNumber: "2.4",
        title: "Civil Disobedience Movement",
        microConcepts: [
          { title: "Simon Commission (1928): no Indian members → boycott" },
          { title: "Lahore Congress 1929: Purna Swaraj declared; 26 Jan 1930 = Independence Day" },
          { title: "Salt March (Dandi March): March 12 – April 6, 1930 — 240 miles, 78 people" },
          { title: "Civil Disobedience: break salt law, boycott foreign cloth, not pay revenue" },
          { title: "Gandhi-Irwin Pact 1931: CDM suspended; Gandhi at Round Table Conference" },
          { title: "CDM resumed 1932; Ambedkar-Gandhi Poona Pact on separate electorate" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "Non-Cooperation: boycott + non-payment + civil defiance",
      "Timeline: Rowlatt (1919) → Jallianwala (1919) → Non-Cooperation (1920-22) → Salt March (1930) → CDM",
    ],
    examTips: [
      "Always link Gandhi's movements to a triggering event (Rowlatt Act, Simon Commission, etc.)",
      "Know who was excluded from the nationalist mainstream: lower castes, Dalits, women (partly), tribal groups",
      "Salt March: why salt? — universal commodity used by everyone including the poor; symbolic and practical",
      "Chauri Chaura: explain WHY Gandhi withdrew (committed to non-violence, not intimidated)",
    ],
    exercises: [
      { exerciseNumber: "Exercise 2", questionCount: 14, types: ["MCQ", "Short Answer", "Long Answer", "Source Based"] },
    ],
  },

  {
    chapterNumber: 3,
    title: "The Making of a Global World",
    subject: "Social Science",
    grade: "10",
    board: "CBSE",
    unit: "History",
    examMarks: 10,
    estimatedWeeks: 2,
    overview: "Traces globalisation from ancient trade routes to the Great Depression of 1929, two World Wars, and the Bretton Woods institutions. Shows how economic integration developed and collapsed.",
    sections: [
      {
        sectionNumber: "3.1",
        title: "The Pre-Modern World",
        microConcepts: [
          { title: "Silk routes: China to Europe; trade in silk, spices, ideas, diseases" },
          { title: "Spread of diseases (plague/Black Death): trade routes carried germs, not just goods" },
          { title: "Food discovery: Columbus opens Americas → tomato, potato, chilli to Europe" },
          { title: "Portuguese/Spanish conquest of Americas: silver, forced labour, colonisation" },
        ],
      },
      {
        sectionNumber: "3.2",
        title: "The Nineteenth Century (1815–1914)",
        microConcepts: [
          { title: "Three flows of globalisation: trade, capital, labour" },
          { title: "Corn Laws abolished 1846 (UK): cheap food imports → agriculture → industry" },
          { title: "Indentured labour: Indian, Chinese workers to Caribbean/Mauritius/Fiji colonies" },
          { title: "Rinderpest (cattle plague) in Africa 1890s — wiped out cattle → famine → colonisation" },
          { title: "Trade and finance: London as financial hub; gold standard" },
        ],
      },
      {
        sectionNumber: "3.3",
        title: "The Inter-War Economy",
        microConcepts: [
          { title: "WW1 disrupted global trade; US became creditor nation" },
          { title: "Great Depression (1929): Wall Street Crash → unemployment → global crisis" },
          { title: "Depression in colonies: India's wheat/jute prices collapse; peasants suffer" },
          { title: "Roosevelt's New Deal: government intervention to revive US economy" },
        ],
      },
      {
        sectionNumber: "3.4",
        title: "Rebuilding a World Economy — Post WW2",
        microConcepts: [
          { title: "Bretton Woods Conference 1944: IMF + World Bank established" },
          { title: "Bretton Woods system: dollar linked to gold; fixed exchange rates" },
          { title: "Post-WW2 boom: 'golden age of capitalism' 1950-1970" },
          { title: "Developing world: sought economic independence; G77 formation" },
          { title: "1970s collapse: oil crisis, floating exchange rates, MNCs rise" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "Three flows of globalisation: trade, capital, labour",
      "Bretton Woods twins: IMF (balance of payments) + World Bank (long-term development loans)",
    ],
    examTips: [
      "Indentured labour: know why it was like 'new system of slavery' — deception, contract, no choice to leave",
      "Rinderpest: know the chain — cattle disease → pastoralists can't farm → famine → British take land",
      "Great Depression: Wall Street Crash (1929) → bank failures → unemployment 25% in USA",
      "Bretton Woods: know the purpose of IMF vs World Bank — they are different institutions",
    ],
    exercises: [
      { exerciseNumber: "Exercise 3", questionCount: 12, types: ["MCQ", "Short Answer", "Long Answer", "Source Based"] },
    ],
  },

  {
    chapterNumber: 4,
    title: "The Age of Industrialisation",
    subject: "Social Science",
    grade: "10",
    board: "CBSE",
    unit: "History",
    examMarks: 10,
    estimatedWeeks: 2,
    overview: "Examines Britain's Industrial Revolution, the proto-industrialisation that preceded it, the role of merchants, and then industrialisation in colonial India — the growth and limits of Indian industries.",
    sections: [
      {
        sectionNumber: "4.1",
        title: "Before the Industrial Revolution",
        microConcepts: [
          { title: "Proto-industrialisation: rural cottage industries supplied merchants before factories" },
          { title: "Merchants → put-out system → rural families produced for merchants" },
          { title: "Not all industrialisation happened in factories — home-based work continued long after" },
        ],
      },
      {
        sectionNumber: "4.2",
        title: "Hand Labour and Steam Power",
        microConcepts: [
          { title: "Victorian Britain: abundant cheap labour → no rush to mechanise everything" },
          { title: "Steam engines slow to spread — many industries preferred hand work" },
          { title: "Seasonal industries: docks, gas works — cheap casual labour more flexible than machines" },
          { title: "Skilled craftsmen: valued for fine products — machine-made = inferior quality" },
        ],
      },
      {
        sectionNumber: "4.3",
        title: "Industrialisation in the Colonies — India",
        microConcepts: [
          { title: "Manchester goods flooded India after 1850s — handloom weavers suffered" },
          { title: "Gomasthas (agents): worked for East India Company, harassed weavers" },
          { title: "Indian mills: Bombay cotton mills (1854), jute mills in Bengal (1855)" },
          { title: "Swadeshi movement boosted Indian industry — buy Indian goods" },
          { title: "Fly shuttle loom: increased productivity of handloom weavers" },
          { title: "WW1 impact: Manchester cloth unavailable → Indian mills supplied army + civilians" },
        ],
      },
      {
        sectionNumber: "4.4",
        title: "Factories Come Up + Market for Goods",
        microConcepts: [
          { title: "Indian mill workers: migrated from villages; lived in chawls (tenements)" },
          { title: "Jobbers: gang leaders who recruited village workers for factories" },
          { title: "Advertisement: created demand; labels with Indian motifs (Gandhi cap, Bharat Mata)" },
          { title: "Calendars: visual advertisement strategy — widely used pre-TV era" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [],
    examTips: [
      "Proto-industrialisation: explain why factories didn't immediately replace cottage industries",
      "Indian handloom vs Manchester cloth: quality vs price war; fly shuttle loom helped handloom survive",
      "WW1 as turning point for Indian industry: import substitution; Indian production rose",
      "Jobber system: both recruiter and disciplinarian; often abused power",
    ],
    exercises: [
      { exerciseNumber: "Exercise 4", questionCount: 12, types: ["MCQ", "Short Answer", "Long Answer", "Source Based"] },
    ],
  },

  {
    chapterNumber: 5,
    title: "Print Culture and the Modern World",
    subject: "Social Science",
    grade: "10",
    board: "CBSE",
    unit: "History",
    examMarks: 10,
    estimatedWeeks: 2,
    overview: "Traces the history of print from China and Europe to India — how print culture shaped literacy, debate, religious reform, nationalism, and the lives of ordinary people including women and workers.",
    sections: [
      {
        sectionNumber: "5.1",
        title: "The First Printed Books",
        microConcepts: [
          { title: "China: earliest printing with woodblock (594 CE); later movable type (11th century)" },
          { title: "Gutenberg's printing press (1448): Bible printed → Reformation" },
          { title: "Erasmus, Luther: used print to spread religious ideas; Protestant Reformation" },
          { title: "Index of Prohibited Books: Catholic Church tried to control print" },
        ],
      },
      {
        sectionNumber: "5.2",
        title: "Print Comes to India",
        microConcepts: [
          { title: "Portuguese missionaries: Goa (1556) — first printing press in India" },
          { title: "James Augustus Hickey: Bengal Gazette (1780) — first English newspaper in India" },
          { title: "Vernacular press: regional language newspapers spread nationalism" },
          { title: "Vernacular Press Act 1878: British tried to suppress nationalist press" },
        ],
      },
      {
        sectionNumber: "5.3",
        title: "Religious Reform and Public Debates",
        microConcepts: [
          { title: "Ram Mohan Roy: Sambad Kaumudi; challenged orthodoxy, supported widow remarriage" },
          { title: "Print debates: Shastric texts printed → common people could now read and question" },
          { title: "Ulama used print for fatwas; maintained conservative religious views also via print" },
          { title: "Women's reading and writing opposed by orthodox men — debates in print" },
        ],
      },
      {
        sectionNumber: "5.4",
        title: "New Forms of Publication",
        microConcepts: [
          { title: "Novels, essays, poetry in regional languages — Chapbooks (cheap pamphlets)" },
          { title: "Women writers: Rashsundari Devi's autobiography (Amar Jiban, 1876) — first in Bengali" },
          { title: "Low-caste press: Jyotiba Phule wrote against caste system; Ambedkar's Mooknayak" },
          { title: "Bal Gangadhar Tilak: Kesari (Marathi) — used print for nationalist mobilisation" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "Gutenberg Press (1448) → Reformation → Reason → Enlightenment → Nationalism",
    ],
    examTips: [
      "Print and power: who controlled what could be printed = social power; British used censorship laws",
      "India's first printed book: in Portuguese Konkani (Goa, 1561); first newspaper: Bengal Gazette (1780)",
      "Rashsundari Devi: secretly learnt to read/write; autobiography — landmark for women's literacy",
      "Chapbooks: cheap, carried by pedlars → reached the poor; print democratised knowledge",
    ],
    exercises: [
      { exerciseNumber: "Exercise 5", questionCount: 12, types: ["MCQ", "Short Answer", "Long Answer", "Source Based"] },
    ],
  },

  // ══════════════════ GEOGRAPHY ══════════════════
  {
    chapterNumber: 6,
    title: "Resources and Development",
    subject: "Social Science",
    grade: "10",
    board: "CBSE",
    unit: "Geography",
    examMarks: 6,
    estimatedWeeks: 1,
    overview: "Classifies resources by origin, exhaustibility, ownership, and development status. Covers resource planning in India, soil types, and land degradation.",
    sections: [
      {
        sectionNumber: "6.1",
        title: "Types of Resources",
        microConcepts: [
          { title: "Natural: biotic (forest, fish) and abiotic (rock, mineral, water)" },
          { title: "Renewable vs non-renewable: solar energy vs coal" },
          { title: "Individual, community, national, international resources" },
          { title: "Potential vs actual resources; stock vs reserve" },
        ],
      },
      {
        sectionNumber: "6.2",
        title: "Resource Planning in India",
        microConcepts: [
          { title: "India: vast resource diversity — regional imbalance" },
          { title: "Three stages of resource planning: identification, planning, implementation" },
          { title: "Sustainable development: meeting present needs without compromising future generations" },
          { title: "Rio de Janeiro Earth Summit 1992: Agenda 21 adopted" },
        ],
      },
      {
        sectionNumber: "6.3",
        title: "Land Resources",
        microConcepts: [
          { title: "Land use: forest, barren, grazing, permanent crops, net sown area" },
          { title: "Net sown area: 54% of total; fallow land: 4%" },
          { title: "Land degradation: waterlogging, soil erosion, over-irrigation, deforestation" },
          { title: "Conservation: shelter belts, contour ploughing, afforestation" },
        ],
      },
      {
        sectionNumber: "6.4",
        title: "Soil as a Resource",
        microConcepts: [
          { title: "Alluvial soil: North India plains — very fertile; khadar (new), bhangar (old)" },
          { title: "Black soil (Regur): Deccan plateau, Maharashtra — cotton crop; self-ploughing" },
          { title: "Red and Yellow soil: low rainfall areas; iron content — red colour" },
          { title: "Laterite soil: high rainfall hills (Kerala, Karnataka); leaching" },
          { title: "Arid soil: Rajasthan — low humus; sandy; salt content" },
          { title: "Forest soil: mountain slopes — humus-rich" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "Khadar = new alluvial (lighter); Bhangar = old alluvial (darker, higher land)",
      "Black soil = Regur soil = best for cotton",
      "Sustainable Development: development that meets current needs without depleting future resources",
    ],
    examTips: [
      "Memorise soil types with their regions and crops — 3-mark questions very common",
      "Black soil: forms deep cracks when dry (self-ploughing); holds moisture well — cotton grows best",
      "Laterite soil: leaching removes humus and lime — poor in fertility but used for tea in hills",
      "Land degradation causes and remedies — often asked as 3-mark short answer",
    ],
    exercises: [
      { exerciseNumber: "Exercise 6", questionCount: 10, types: ["MCQ", "Short Answer", "Long Answer", "Map"] },
    ],
  },

  {
    chapterNumber: 7,
    title: "Forest and Wildlife Resources",
    subject: "Social Science",
    grade: "10",
    board: "CBSE",
    unit: "Geography",
    examMarks: 6,
    estimatedWeeks: 1,
    overview: "India's biodiversity, categories of flora and fauna, types of forests, community conservation projects, and the role of biodiversity in ecosystem stability.",
    sections: [
      {
        sectionNumber: "7.1",
        title: "Biodiversity and Conservation",
        microConcepts: [
          { title: "India: 8% of world species; one of 12 mega-biodiversity countries" },
          { title: "Threatened species categories: extinct, endangered, vulnerable, rare, endemic" },
          { title: "Causes of depletion: habitat loss, hunting, over-use, pollution, alien species" },
        ],
      },
      {
        sectionNumber: "7.2",
        title: "Types of Forests in India",
        microConcepts: [
          { title: "Reserved forests: most valuable; no rights to local people" },
          { title: "Protected forests: some rights to local people" },
          { title: "Unclassed forests: government or private" },
          { title: "Community forests: managed jointly by local communities" },
        ],
      },
      {
        sectionNumber: "7.3",
        title: "Community Conservation Projects",
        microConcepts: [
          { title: "Chipko movement (Uttarakhand): villagers hugged trees to prevent cutting" },
          { title: "Beej Bachao Andolan: traditional crop varieties saved in Tehri" },
          { title: "Joint Forest Management (JFM): villages manage forests with Forest Dept" },
          { title: "Bishnoi community: protects Black Buck — Amrita Devi Bishnoi" },
          { title: "Sariska Wildlife Reserve: Rajasthan villagers helped in protection" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [],
    examTips: [
      "Project Tiger (1973): launched to protect tiger; know some Project Tiger reserves",
      "Chipko movement: Gaura Devi led women of Reni village — know the story",
      "Amrita Devi Bishnoi sacrifice: gave life to save Khejri trees — government award in her name",
      "JFM: started in Odisha 1988; villages get 25% of revenue and non-timber forest products",
    ],
    exercises: [
      { exerciseNumber: "Exercise 7", questionCount: 8, types: ["MCQ", "Short Answer", "Long Answer"] },
    ],
  },

  {
    chapterNumber: 8,
    title: "Water Resources",
    subject: "Social Science",
    grade: "10",
    board: "CBSE",
    unit: "Geography",
    examMarks: 6,
    estimatedWeeks: 1,
    overview: "Covers freshwater availability, rainfall patterns, multi-purpose river projects, rainwater harvesting, and the pros and cons of large dams like the Narmada Dam.",
    sections: [
      {
        sectionNumber: "8.1",
        title: "Water Scarcity",
        microConcepts: [
          { title: "71% Earth's surface water; only 2.7% freshwater; 70% of freshwater frozen" },
          { title: "Per capita water availability declining due to population growth and pollution" },
          { title: "Areas of water stress vs water-scarce countries" },
          { title: "Groundwater depletion: over-exploitation in Punjab, Rajasthan, UP" },
        ],
      },
      {
        sectionNumber: "8.2",
        title: "Multi-Purpose River Projects",
        microConcepts: [
          { title: "Jawaharlal Nehru: 'dams are the temples of modern India'" },
          { title: "Benefits: irrigation, flood control, electricity, navigation, recreation" },
          { title: "Problems: displacement of people, submerging forests, reduced sediment flow" },
          { title: "Narmada Bachao Andolan: protest against Sardar Sarovar dam" },
          { title: "Tehri Dam (Uttarakhand), Bhakra-Nangal (Punjab-HP), Hirakud (Odisha)" },
        ],
      },
      {
        sectionNumber: "8.3",
        title: "Rainwater Harvesting",
        microConcepts: [
          { title: "Traditional: kuls (HP), johads (Rajasthan), tankas (rooftop, Rajasthan), bamboo drip (Meghalaya)" },
          { title: "Rooftop rainwater harvesting: Shillong, Tamil Nadu — mandatory in Chennai since 2003" },
          { title: "Gul/kul: diversion channels from glaciers in mountains" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [],
    examTips: [
      "Know specific rainwater harvesting methods by region — exam maps ask this",
      "Large dams debate: know both sides — benefits and drawbacks (displacement, ecology, sedimentation)",
      "Narmada Bachao Andolan: Medha Patkar; protest against Sardar Sarovar; Supreme Court verdict",
      "'Rajasthan — water scarce but johad system helped' — answer water scarcity question with local solution",
    ],
    exercises: [
      { exerciseNumber: "Exercise 8", questionCount: 8, types: ["MCQ", "Short Answer", "Long Answer", "Map"] },
    ],
  },

  {
    chapterNumber: 9,
    title: "Agriculture",
    subject: "Social Science",
    grade: "10",
    board: "CBSE",
    unit: "Geography",
    examMarks: 6,
    estimatedWeeks: 1,
    overview: "Types of farming, cropping seasons, major food and non-food crops, Green Revolution, and agricultural reforms in India.",
    sections: [
      {
        sectionNumber: "9.1",
        title: "Types of Farming",
        microConcepts: [
          { title: "Subsistence: primitive slash-and-burn (jhum), intensive subsistence (paddy)" },
          { title: "Commercial: large scale, single crop (wheat in Punjab, tea in Assam)" },
          { title: "Plantation farming: tea, coffee, rubber — British legacy, export-oriented" },
        ],
      },
      {
        sectionNumber: "9.2",
        title: "Cropping Seasons",
        microConcepts: [
          { title: "Kharif: June-September; paddy, jowar, bajra, maize, groundnut, cotton, jute" },
          { title: "Rabi: October-March; wheat, barley, peas, mustard, gram" },
          { title: "Zaid: between rabi and kharif; watermelon, cucumber, vegetables" },
        ],
      },
      {
        sectionNumber: "9.3",
        title: "Major Crops",
        microConcepts: [
          { title: "Rice: high rainfall/alluvial soil — West Bengal, UP, Andhra Pradesh, Punjab" },
          { title: "Wheat: cool dry climate — Punjab, Haryana, UP (rabi crop)" },
          { title: "Sugarcane: hot humid climate — UP, Maharashtra, Karnataka" },
          { title: "Tea: hill slopes with well-distributed rainfall — Assam, West Bengal, Tamil Nadu" },
          { title: "Coffee: hill slopes — Karnataka (Baba Budan Hills), Kerala, Tamil Nadu" },
          { title: "Cotton: black soil, dry climate — Maharashtra, Gujarat, Andhra Pradesh" },
          { title: "Jute: alluvial soil, high rainfall — West Bengal, Bihar, Assam ('Golden Fibre')" },
        ],
      },
      {
        sectionNumber: "9.4",
        title: "Green Revolution and Agricultural Reforms",
        microConcepts: [
          { title: "Green Revolution (1960s): HYV seeds, chemical fertilisers, irrigation — Punjab, Haryana" },
          { title: "Benefits: food self-sufficiency; drawbacks: groundwater depletion, soil degradation" },
          { title: "Land reforms: zamindari abolition, land ceiling, cooperatives" },
          { title: "Challenges: small land holdings, credit access, MSP (Minimum Support Price)" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "Kharif crops (sown with monsoon): paddy, cotton, groundnut, maize, jute",
      "Rabi crops (sown in winter): wheat, mustard, gram, barley",
    ],
    examTips: [
      "Memorise crop-soil-climate-state tables — high scoring topic in board exams",
      "Jute = Golden Fibre; grows in West Bengal (Hooghly river basin); declining due to synthetic substitutes",
      "Green Revolution: Punjab-Haryana benefited most; other states lagged — regional inequality",
      "Plantation crops: always remember tea (Assam), coffee (Karnataka), rubber (Kerala)",
    ],
    exercises: [
      { exerciseNumber: "Exercise 9", questionCount: 12, types: ["MCQ", "Short Answer", "Long Answer", "Map"] },
    ],
  },

  {
    chapterNumber: 10,
    title: "Minerals and Energy Resources",
    subject: "Social Science",
    grade: "10",
    board: "CBSE",
    unit: "Geography",
    examMarks: 6,
    estimatedWeeks: 1,
    overview: "Classification of minerals, distribution of key minerals in India, conventional and non-conventional energy resources, and conservation strategies.",
    sections: [
      {
        sectionNumber: "10.1",
        title: "Classification and Distribution of Minerals",
        microConcepts: [
          { title: "Metallic: iron ore, copper, bauxite, gold, manganese" },
          { title: "Non-metallic: limestone, mica, salt, gypsum" },
          { title: "Energy minerals: coal, petroleum, natural gas, uranium, thorium" },
          { title: "Iron ore: Jharkhand, Odisha, Chhattisgarh — haematite (best quality)" },
          { title: "Coal: Jharkhand, West Bengal (Gondwana), Tertiary coalfields (Meghalaya, Assam)" },
          { title: "Petroleum: Mumbai High (62%), Assam, Gujarat; refined at Digboi (oldest)" },
          { title: "Mica: Jharkhand, Bihar, Rajasthan; used in electrical industry" },
        ],
      },
      {
        sectionNumber: "10.2",
        title: "Energy Resources",
        microConcepts: [
          { title: "Conventional: coal (54% electricity), petroleum, natural gas, hydropower, nuclear" },
          { title: "Nuclear power: uranium (Jharkhand) and thorium (Kerala beaches); Tarapur, RAPP, Kaiga" },
          { title: "Non-conventional: solar, wind, biogas, tidal, geothermal" },
          { title: "Wind energy: Rajasthan, Gujarat, Tamil Nadu coast; second largest in Asia" },
          { title: "Solar energy: NHAP (National Solar Mission); Rajasthan, Gujarat — highest potential" },
          { title: "Biogas: gobar gas plants in rural India; decentralised" },
          { title: "Tidal energy: Gulf of Kutch, Gulf of Khambhat potential" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [],
    examTips: [
      "Know mineral belt locations: iron ore triangle (Jharkhand-Odisha-Chhattisgarh), coal belt",
      "Mumbai High: 62% of India's petroleum — always mention in oil-related questions",
      "Nuclear minerals: uranium from Jharkhand; thorium from Kerala monazite sands",
      "Non-conventional vs conventional: non-conventional = renewable + cleaner but lower density",
    ],
    exercises: [
      { exerciseNumber: "Exercise 10", questionCount: 10, types: ["MCQ", "Short Answer", "Long Answer", "Map"] },
    ],
  },

  {
    chapterNumber: 11,
    title: "Manufacturing Industries",
    subject: "Social Science",
    grade: "10",
    board: "CBSE",
    unit: "Geography",
    examMarks: 6,
    estimatedWeeks: 1,
    overview: "Role of manufacturing in economic growth, agro-based industries, mineral-based industries, chemical industries, and strategies to control industrial pollution.",
    sections: [
      {
        sectionNumber: "11.1",
        title: "Importance of Manufacturing",
        microConcepts: [
          { title: "Converts raw material to finished goods — adds value" },
          { title: "Industry creates employment — reduces rural-urban divide" },
          { title: "Export earnings; self-sufficiency; economic growth" },
        ],
      },
      {
        sectionNumber: "11.2",
        title: "Agro-based Industries",
        microConcepts: [
          { title: "Cotton textile: Mumbai ('Manchester of India'), Ahmedabad, Coimbatore" },
          { title: "Jute textile: West Bengal — Hugli river; world's largest jute industry" },
          { title: "Sugar industry: UP and Maharashtra; located near sugarcane fields" },
        ],
      },
      {
        sectionNumber: "11.3",
        title: "Mineral-based Industries",
        microConcepts: [
          { title: "Iron & Steel: Jamshedpur (TISCO), Bhilai, Durgapur, Rourkela, Bokaro" },
          { title: "Aluminium: Odisha, West Bengal, Kerala, UP — bauxite to aluminium" },
          { title: "Chemical industry: basic chemicals (Surat, Mumbai), petro-chemicals" },
        ],
      },
      {
        sectionNumber: "11.4",
        title: "Industrial Pollution and Control",
        microConcepts: [
          { title: "Air: SPM, NO₂, SO₂ from industries; gas flaring" },
          { title: "Water: effluents from factories into rivers (Ganga, Yamuna pollution)" },
          { title: "Control: scrubbers, electrostatic precipitators, water treatment plants, ETP" },
          { title: "Land and noise pollution — industrial waste disposal" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [],
    examTips: [
      "Iron and steel plant locations — with river/state — often a map question",
      "Mumbai = cotton (proximity to port, humid climate, Parsi entrepreneurs, skilled labour)",
      "Jute industry Hugli corridor: Rishra to Tribeni; world's largest jute manufacturing region",
      "Industrial pollution control: mention specific technologies (ETP, scrubbers) for full marks",
    ],
    exercises: [
      { exerciseNumber: "Exercise 11", questionCount: 10, types: ["MCQ", "Short Answer", "Long Answer", "Map"] },
    ],
  },

  {
    chapterNumber: 12,
    title: "Lifelines of National Economy",
    subject: "Social Science",
    grade: "10",
    board: "CBSE",
    unit: "Geography",
    examMarks: 6,
    estimatedWeeks: 1,
    overview: "Transport (roadways, railways, waterways, airways, pipelines), communication networks, and trade — how they integrate India's economy.",
    sections: [
      {
        sectionNumber: "12.1",
        title: "Transport",
        microConcepts: [
          { title: "Roadways: 23 lakh km; NH = backbone; Golden Quadrilateral: Delhi-Mumbai-Chennai-Kolkata" },
          { title: "Railways: 67,956 km; 7 divisional headquarters; largest employer" },
          { title: "Pipelines: Hazira-Vijaypur-Jagdishpur (HVJ) — gas; Salaya-Mathura — oil" },
          { title: "Waterways: NW-1 (Ganga: Prayagraj to Haldia), NW-2 (Brahmaputra), NW-3 (Kerala backwaters)" },
          { title: "Airways: Indian Airlines (domestic), Air India (international); 449 airports" },
        ],
      },
      {
        sectionNumber: "12.2",
        title: "Communication",
        microConcepts: [
          { title: "Personal: postal, telephone, mobile, internet" },
          { title: "Mass: radio, TV, newspapers, magazines" },
          { title: "Satellite communication: INSAT (Indian National Satellite System)" },
          { title: "Internet: India has one of the largest internet user bases" },
        ],
      },
      {
        sectionNumber: "12.3",
        title: "International Trade",
        microConcepts: [
          { title: "Imports: machinery, electronics, oil, fertilisers, chemicals" },
          { title: "Exports: software, gems, textiles, chemicals, engineering goods, agriculture" },
          { title: "Balance of trade: exports > imports = surplus; imports > exports = deficit" },
          { title: "Tourism as invisible trade: foreign exchange, employment" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "Golden Quadrilateral: Delhi – Mumbai – Chennai – Kolkata (6-lane highway)",
      "NW-1: Prayagraj to Haldia (1620 km) — longest national waterway",
    ],
    examTips: [
      "Know all four national waterways (NW1-NW4) with their rivers and states",
      "Pipeline grid: HVJ pipeline for gas; Salaya-Mathura for crude oil — strategic importance",
      "Tourism = invisible trade — earns foreign exchange without exporting a physical product",
      "Railways: largest employer in the world (in one organisation); 7 divisional HQs",
    ],
    exercises: [
      { exerciseNumber: "Exercise 12", questionCount: 10, types: ["MCQ", "Short Answer", "Long Answer", "Map"] },
    ],
  },

  // ══════════════════ ECONOMICS ══════════════════
  {
    chapterNumber: 13,
    title: "Development",
    subject: "Social Science",
    grade: "10",
    board: "CBSE",
    unit: "Economics",
    examMarks: 8,
    estimatedWeeks: 1,
    overview: "Different people have different development goals. National development is measured by per capita income, HDI, and other sustainability indicators. Questions what development means.",
    sections: [
      {
        sectionNumber: "13.1",
        title: "What Development Promises",
        microConcepts: [
          { title: "Development goals vary by person: farmer wants irrigation; urban woman wants safety" },
          { title: "National development: aggregate of individual goals; not always aligned" },
          { title: "Trade-off: industrialist wants cheap labour; worker wants good wages — conflict" },
        ],
      },
      {
        sectionNumber: "13.2",
        title: "How to Compare Countries",
        microConcepts: [
          { title: "Per capita income = total income / population; used by World Bank for comparison" },
          { title: "Limitations: doesn't show distribution of income (inequality)" },
          { title: "HDI (Human Development Index): income + education + health (life expectancy)" },
          { title: "HDI published by UNDP; Kerala model — high HDI despite low per capita" },
        ],
      },
      {
        sectionNumber: "13.3",
        title: "Income and Other Criteria",
        microConcepts: [
          { title: "Public facilities: education, healthcare, drinking water, sanitation" },
          { title: "Infant Mortality Rate (IMR): deaths under 1 year per 1000 live births" },
          { title: "Literacy rate, net attendance ratio — social development indicators" },
          { title: "BMI (Body Mass Index): nutrition indicator" },
        ],
      },
      {
        sectionNumber: "13.4",
        title: "Sustainability",
        microConcepts: [
          { title: "Sustainable development: current needs without compromising future generation" },
          { title: "Non-renewable resources (oil, coal) — cannot be replenished once used" },
          { title: "Environmental degradation: growth at expense of environment not truly 'development'" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "Per Capita Income = National Income / Population",
      "HDI = f(income, education, health) — UNDP",
      "IMR = infant deaths per 1000 live births (lower = better development)",
    ],
    examTips: [
      "Kerala paradox: lower per capita income than Punjab but better HDI — explain public investment",
      "HDI: India ranks around 130/189 countries — mid-range; below many poorer-income but better-governed nations",
      "Per capita income limitation: doesn't show who has more — inequality invisible in averages",
      "Sustainable development: Brundtland Commission definition — 'meets present needs without compromising future'",
    ],
    exercises: [
      { exerciseNumber: "Exercise 13", questionCount: 10, types: ["MCQ", "Short Answer", "Long Answer", "Data Interpretation"] },
    ],
  },

  {
    chapterNumber: 14,
    title: "Sectors of the Indian Economy",
    subject: "Social Science",
    grade: "10",
    board: "CBSE",
    unit: "Economics",
    examMarks: 8,
    estimatedWeeks: 1,
    overview: "Primary, secondary, and tertiary sectors. Organised vs unorganised sectors. Employment trends, NREGA, and the role of the public sector in India's economy.",
    sections: [
      {
        sectionNumber: "14.1",
        title: "Three Sectors of Economy",
        microConcepts: [
          { title: "Primary: agriculture, mining, fishing — natural resources used directly" },
          { title: "Secondary: manufacturing — transforms raw material to finished good" },
          { title: "Tertiary: services — banking, transport, IT, retail, education" },
          { title: "GDP = value of final goods and services produced in a year" },
          { title: "India's GDP share: tertiary (55%) > secondary (26%) > primary (19%)" },
        ],
      },
      {
        sectionNumber: "14.2",
        title: "Organised vs Unorganised Sector",
        microConcepts: [
          { title: "Organised: registered, regulated, formal employment; follows labour laws" },
          { title: "Unorganised: small units, irregular wages, no job security; most Indian workers" },
          { title: "Need to protect unorganised sector: minimum wage, safe working conditions" },
        ],
      },
      {
        sectionNumber: "14.3",
        title: "Public and Private Sectors",
        microConcepts: [
          { title: "Public sector: government owns; aims at public welfare not just profit" },
          { title: "Private sector: owned by individuals/companies; profit motive" },
          { title: "Why public sector necessary: defence, railways, utilities, basic services" },
          { title: "NREGA (2005): 100 days guaranteed work per year to rural households" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "GDP = Primary + Secondary + Tertiary output",
      "Tertiary sector = services; now largest in India's GDP but primary employs most people",
    ],
    examTips: [
      "Paradox: primary sector provides employment to 49% but contributes only 19% to GDP → low productivity",
      "NREGA: now called MGNREGS; 100 days guaranteed wage employment; helps in lean agricultural seasons",
      "Organised sector benefits: PF, pension, ESI, minimum wage — know why these matter",
      "Disguised unemployment: extra workers in agriculture who add nothing to output — hidden unemployment",
    ],
    exercises: [
      { exerciseNumber: "Exercise 14", questionCount: 10, types: ["MCQ", "Short Answer", "Long Answer", "Data"] },
    ],
  },

  {
    chapterNumber: 15,
    title: "Money and Credit",
    subject: "Social Science",
    grade: "10",
    board: "CBSE",
    unit: "Economics",
    examMarks: 8,
    estimatedWeeks: 1,
    overview: "Evolution of money, credit and its terms, formal vs informal sources of credit in India, and the importance of Self-Help Groups for rural credit access.",
    sections: [
      {
        sectionNumber: "15.1",
        title: "Money as a Medium of Exchange",
        microConcepts: [
          { title: "Barter system: double coincidence of wants problem" },
          { title: "Money solves barter: medium of exchange, store of value, unit of account" },
          { title: "Modern money: currency notes + coins + demand deposits (cheques)" },
          { title: "Demand deposits: can withdraw on demand; create money supply through cheques" },
        ],
      },
      {
        sectionNumber: "15.2",
        title: "Credit and its Terms",
        microConcepts: [
          { title: "Credit = loan; terms: interest rate, collateral, documentation, repayment schedule" },
          { title: "Collateral: asset pledged (land, building, gold) — forfeited if loan unpaid" },
          { title: "Credit creates income: loan → investment → income → repay" },
          { title: "Debt trap: high interest, poor harvest → unable to repay → collateral seized" },
        ],
      },
      {
        sectionNumber: "15.3",
        title: "Formal and Informal Sources",
        microConcepts: [
          { title: "Formal: banks, cooperatives — lower interest, regulated by RBI" },
          { title: "Informal: moneylenders, traders, relatives — higher interest, no regulation" },
          { title: "75% of rural credit from informal sources — exploitation" },
          { title: "SHG (Self Help Groups): 15-20 women pool savings, give loans within group" },
          { title: "SHG: Grameen Bank model (Bangladesh, Muhammad Yunus)" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [],
    examTips: [
      "RBI: regulates formal banking sector in India; not responsible for informal lenders",
      "SHG benefit: collateral-free loans, group responsibility, women's empowerment, lower interest",
      "Debt trap sequence: crop failure → can't repay → higher interest → sell assets → destitution",
      "Demand deposits: why they are money — can be used via cheques; banks create credit from deposits",
    ],
    exercises: [
      { exerciseNumber: "Exercise 15", questionCount: 10, types: ["MCQ", "Short Answer", "Long Answer"] },
    ],
  },

  {
    chapterNumber: 16,
    title: "Globalisation and the Indian Economy",
    subject: "Social Science",
    grade: "10",
    board: "CBSE",
    unit: "Economics",
    examMarks: 8,
    estimatedWeeks: 1,
    overview: "What globalisation is, how production is globally organised by MNCs, how India was liberalised in 1991, and the unequal impacts of globalisation on workers and industries.",
    sections: [
      {
        sectionNumber: "16.1",
        title: "Production across Countries",
        microConcepts: [
          { title: "MNCs: own or control production in more than one country" },
          { title: "FDI: foreign direct investment; MNC sets up production in host country" },
          { title: "Global value chains: each country does one part (design, manufacture, assemble, sell)" },
          { title: "Example: Nokia phone — designed in Finland, chips from USA, assembled in many countries" },
        ],
      },
      {
        sectionNumber: "16.2",
        title: "Interlink Production across Countries",
        microConcepts: [
          { title: "Trade: goods and services cross borders" },
          { title: "Investment: capital flows from rich to developing countries" },
          { title: "Technology: MNCs transfer technology to subsidiaries" },
          { title: "Movement of people: labour migration" },
        ],
      },
      {
        sectionNumber: "16.3",
        title: "Liberalisation of Foreign Trade and Investment",
        microConcepts: [
          { title: "India 1991: LPG reforms — Liberalisation, Privatisation, Globalisation" },
          { title: "Import barriers removed: tariffs reduced, MNCs allowed in" },
          { title: "WTO (World Trade Organisation): promotes free trade; 164 members" },
          { title: "Criticism of WTO: unfair — rich nations protect their agriculture, poor can't" },
        ],
      },
      {
        sectionNumber: "16.4",
        title: "Impact of Globalisation",
        microConcepts: [
          { title: "Positive: more choices for consumers, lower prices, employment in MNCs, technology" },
          { title: "Negative: small Indian industries (toys, textiles) hurt by cheap imports" },
          { title: "Fair globalisation: workers' rights, labour standards, equitable rules" },
          { title: "India's IT sector: benefited enormously from globalisation" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [],
    examTips: [
      "MNCs in India: examples — Pepsi, Ford, Samsung; explain why they came (cheap labour, market size)",
      "1991 LPG reforms triggered by Balance of Payments crisis — India had to mortgage gold to IMF",
      "WTO unfairness: US/EU subsidise farmers; developing countries told to remove subsidies — double standard",
      "Globalisation impact: IT workers (winners), knitwear workers Tiruppur (losers initially) — cite examples",
    ],
    exercises: [
      { exerciseNumber: "Exercise 16", questionCount: 10, types: ["MCQ", "Short Answer", "Long Answer"] },
    ],
  },

  {
    chapterNumber: 17,
    title: "Consumer Rights",
    subject: "Social Science",
    grade: "10",
    board: "CBSE",
    unit: "Economics",
    examMarks: 8,
    estimatedWeeks: 1,
    overview: "Consumer exploitation, the Consumer Protection Act, consumer rights and responsibilities, and consumer redressal forums in India.",
    sections: [
      {
        sectionNumber: "17.1",
        title: "Consumer in the Marketplace",
        microConcepts: [
          { title: "Exploitation forms: underweight, adulteration, misleading ads, defective goods, overcharging" },
          { title: "Consumer movement: USA 1960s (Ralph Nader); India 1970s-80s — Consumer Protection Act 1986" },
          { title: "COPRA (Consumer Protection Act) 1986 — rights framework" },
        ],
      },
      {
        sectionNumber: "17.2",
        title: "Consumer Rights",
        microConcepts: [
          { title: "6 rights: safety, information, choice, heard, redress, consumer education" },
          { title: "RTI (Right to Information Act): government info accessible to citizens" },
          { title: "ISI, Agmark, Hallmark, FPO: quality certification marks — protect consumers" },
        ],
      },
      {
        sectionNumber: "17.3",
        title: "Consumer Redressal Forum",
        microConcepts: [
          { title: "District Forum: claims up to ₹20 lakh" },
          { title: "State Commission: claims ₹20 lakh to ₹1 crore" },
          { title: "National Commission: claims above ₹1 crore" },
          { title: "New COPRA 2019: online complaints, higher limits, product liability" },
          { title: "World Consumer Rights Day: 15 March" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "District Forum: up to ₹20 lakh | State: ₹20L-1Cr | National: above ₹1 crore",
      "6 Consumer Rights: Safety, Information, Choice, Heard, Redress, Education",
    ],
    examTips: [
      "ISI mark: industrial products (electrical, LPG); Agmark: agriculture; Hallmark: gold jewellery; FPO: processed food",
      "COPRA 1986 vs new COPRA 2019 — know the updates (online, product liability, e-commerce included)",
      "Ralph Nader: US consumer movement leader — started by automotive safety campaign",
      "World Consumer Rights Day: March 15 — same day JFK's consumer rights speech (1962)",
    ],
    exercises: [
      { exerciseNumber: "Exercise 17", questionCount: 10, types: ["MCQ", "Short Answer", "Long Answer"] },
    ],
  },

  // ══════════════════ POLITICAL SCIENCE ══════════════════
  {
    chapterNumber: 18,
    title: "Power Sharing",
    subject: "Social Science",
    grade: "10",
    board: "CBSE",
    unit: "Political Science",
    examMarks: 8,
    estimatedWeeks: 1,
    overview: "Why power sharing is desirable in a democracy — lessons from Belgium and Sri Lanka. Horizontal and vertical power sharing, and why majoritarianism is dangerous.",
    sections: [
      {
        sectionNumber: "18.1",
        title: "Belgium and Sri Lanka",
        microConcepts: [
          { title: "Belgium: Dutch (59%), French (40%), German (1%); Brussels 80% French-speaking" },
          { title: "Belgium accommodation: equal cabinet seats; Brussels community government; separate culture councils" },
          { title: "Sri Lanka: Sinhala majority (74%); Tamil minority; 1956 Sinhala Only Act" },
          { title: "Sri Lanka majoritarian approach → Tamil civil war (1983-2009)" },
          { title: "Lesson: Belgium's sharing model worked; Sri Lanka's denial caused conflict" },
        ],
      },
      {
        sectionNumber: "18.2",
        title: "Why Power Sharing is Desirable",
        microConcepts: [
          { title: "Prudential reason: reduces conflict; stable government; majority can also be hurt" },
          { title: "Moral reason: democracy = power of the people; sharing is intrinsically right" },
          { title: "Majoritarianism: majority imposes will on minority — erodes democracy" },
        ],
      },
      {
        sectionNumber: "18.3",
        title: "Forms of Power Sharing",
        microConcepts: [
          { title: "Horizontal: among organs of government (legislature, executive, judiciary)" },
          { title: "Vertical: among levels (central, state, local)" },
          { title: "Among social groups: reserved constituencies for SC/ST/women" },
          { title: "Among political parties: coalition governments, pressure groups" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [],
    examTips: [
      "Belgium vs Sri Lanka: always contrast; Belgium succeeded, Sri Lanka failed — explain why",
      "Prudential vs moral reasons for power sharing — both must be mentioned in answers",
      "Horizontal sharing: checks and balances — judiciary can strike down legislature's law",
      "Majoritarianism is NOT democracy — democracy requires protection of minorities",
    ],
    exercises: [
      { exerciseNumber: "Exercise 18", questionCount: 10, types: ["MCQ", "Short Answer", "Long Answer", "Case Study"] },
    ],
  },

  {
    chapterNumber: 19,
    title: "Federalism",
    subject: "Social Science",
    grade: "10",
    board: "CBSE",
    unit: "Political Science",
    examMarks: 8,
    estimatedWeeks: 1,
    overview: "Federal and unitary systems, India as a federal country, three-tier government, decentralisation after 1992, and linguistic reorganisation of states.",
    sections: [
      {
        sectionNumber: "19.1",
        title: "What is Federalism?",
        microConcepts: [
          { title: "Federalism: two or more levels of government; each has its own power" },
          { title: "Federal features: written constitution, independent judiciary, dual citizenship (US) or single (India)" },
          { title: "Coming together federations: USA, Switzerland, Australia — equal partners" },
          { title: "Holding together federations: India, Spain, Belgium — large country divided" },
          { title: "India: union of states; centre stronger — asymmetric federalism" },
        ],
      },
      {
        sectionNumber: "19.2",
        title: "Federal System in India",
        microConcepts: [
          { title: "Three lists: Union List (97 subjects), State List (66), Concurrent List (47)" },
          { title: "Residual subjects: Parliament decides; Centre stronger" },
          { title: "Emergency provisions: President's Rule — Centre takes over state" },
          { title: "Linguistic reorganisation: 1956 States Reorganisation Act — states on language basis" },
        ],
      },
      {
        sectionNumber: "19.3",
        title: "Decentralisation",
        microConcepts: [
          { title: "73rd and 74th Constitutional Amendment 1992: Panchayati Raj and Urban Local Bodies" },
          { title: "Three-tier Panchayat: Gram Panchayat, Panchayat Samiti, Zila Parishad" },
          { title: "Reservations in local bodies: 1/3 seats for women; SC/ST proportional" },
          { title: "Mayor, Municipal Corporation, Gram Sabha — urban and rural bodies" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "Union List: only Parliament; State List: only State; Concurrent List: both (Parliament overrides)",
      "73rd Amendment: Rural (Panchayati Raj); 74th Amendment: Urban (Nagarpalika)",
    ],
    examTips: [
      "Distinguish federal vs unitary: in unitary, states have no independent power (UK, France, Sri Lanka)",
      "India is 'quasi-federal' — federal in structure but unitary in spirit (Centre stronger)",
      "Decentralisation: the most radical step since independence? — discuss 73rd/74th Amendments",
      "Gram Sabha vs Gram Panchayat: Gram Sabha = all adult voters in village; Panchayat = elected representatives",
    ],
    exercises: [
      { exerciseNumber: "Exercise 19", questionCount: 12, types: ["MCQ", "Short Answer", "Long Answer"] },
    ],
  },

  {
    chapterNumber: 20,
    title: "Democracy and Diversity",
    subject: "Social Science",
    grade: "10",
    board: "CBSE",
    unit: "Political Science",
    examMarks: 8,
    estimatedWeeks: 1,
    overview: "Social divisions (race, religion, language, ethnicity) and their relationship with democracy — when division is expressed politically, what happens? Case studies: USA, Northern Ireland, Yugoslavia.",
    sections: [
      {
        sectionNumber: "20.1",
        title: "A Story from Mexico City",
        microConcepts: [
          { title: "1968 Olympics: Smith and Carlos Black Power salute — gloved fists raised" },
          { title: "Protest against racial discrimination of Black Americans" },
          { title: "Sports and politics can intersect — social movements use global platforms" },
        ],
      },
      {
        sectionNumber: "20.2",
        title: "Divisions and Politics",
        microConcepts: [
          { title: "Social divisions: based on birth — race, religion, caste, gender, language" },
          { title: "Overlapping divisions: if race = caste = class → dangerous; deepens conflict" },
          { title: "Cross-cutting divisions: different groups on different issues → healthy; reduces tension" },
          { title: "Northern Ireland: Catholic vs Protestant divide + economic inequality → conflict" },
          { title: "Yugoslavia: ethnicity + religion → civil war; country broke into 7 nations" },
        ],
      },
      {
        sectionNumber: "20.3",
        title: "Outcomes of Politics of Social Divisions",
        microConcepts: [
          { title: "Three factors: 1) perception of identity (exclusive or not); 2) political leaders (moderate/extremist); 3) government response (accommodation or repression)" },
          { title: "Democracy can manage diversity if identity is not exclusive and leaders accommodate" },
          { title: "Expression of divisions in politics is normal in democracy — problem only if exclusive" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [],
    examTips: [
      "Cross-cutting vs overlapping divisions: key distinction; overlapping = dangerous, cross-cutting = healthy",
      "Three factors that decide outcome of social division politics — memorise them with examples",
      "Yugoslavia fragmentation: ethnic politics without democracy → violent breakup",
      "Northern Ireland: language + religion + class = overlapping divisions → prolonged conflict",
    ],
    exercises: [
      { exerciseNumber: "Exercise 20", questionCount: 10, types: ["MCQ", "Short Answer", "Long Answer", "Case Study"] },
    ],
  },

  {
    chapterNumber: 21,
    title: "Gender, Religion and Caste",
    subject: "Social Science",
    grade: "10",
    board: "CBSE",
    unit: "Political Science",
    examMarks: 8,
    estimatedWeeks: 1,
    overview: "How gender, religion, and caste interact with politics in India — communalism, political mobilisation of caste groups, and women's political representation.",
    sections: [
      {
        sectionNumber: "21.1",
        title: "Gender and Politics",
        microConcepts: [
          { title: "Gender division: social — not biological; assigned roles by society" },
          { title: "Patriarchy: male domination; women do unpaid domestic work" },
          { title: "Feminist movements: political rights → then social equality" },
          { title: "Women in politics: India 33% reservation in Panchayats; Lok Sabha only 14%" },
          { title: "Nordic countries: 40-50% women in parliament; more equitable policies" },
        ],
      },
      {
        sectionNumber: "21.2",
        title: "Religion, Communalism and Politics",
        microConcepts: [
          { title: "Secularism: state treats all religions equally; no state religion" },
          { title: "Communalism: one religion treated as superior; enemy image of other religions" },
          { title: "Forms of communalism: stereotyping, separate electorates, riots, partition" },
          { title: "India's Constitution: secular; forbids discrimination on religion" },
          { title: "Difference: politics using religion for vote-bank vs communalism" },
        ],
      },
      {
        sectionNumber: "21.3",
        title: "Caste and Politics",
        microConcepts: [
          { title: "Caste system: birth-based hierarchy; occupational division" },
          { title: "Positive: reservations for SC/ST — affirmative action to correct historical injustice" },
          { title: "Caste politics: vote-bank; politicians appeal to caste for votes" },
          { title: "OBC movement: Mandal Commission 1980 → 27% reservation for OBCs" },
          { title: "Caste doesn't determine voting: class, gender, region also matter" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [],
    examTips: [
      "Communalism is NOT religion — it is the POLITICAL misuse of religion; distinguish carefully",
      "Secular state: does not mean anti-religion; means equal respect for all; no state religion",
      "Women in politics: 33% in Panchayats (73rd/74th amendment); no reservation in Parliament (yet)",
      "Caste and politics: caste influences elections but is not the only factor — class, region, gender too",
    ],
    exercises: [
      { exerciseNumber: "Exercise 21", questionCount: 10, types: ["MCQ", "Short Answer", "Long Answer"] },
    ],
  },

  {
    chapterNumber: 22,
    title: "Popular Struggles and Movements",
    subject: "Social Science",
    grade: "10",
    board: "CBSE",
    unit: "Political Science",
    examMarks: 8,
    estimatedWeeks: 1,
    overview: "How ordinary people participate in democracy beyond elections — through pressure groups, popular movements, and mass struggles. Case studies: Bolivia water war, Nepal democracy movement.",
    sections: [
      {
        sectionNumber: "22.1",
        title: "Popular Struggles",
        microConcepts: [
          { title: "Bolivia Water War 2000: World Bank forced privatisation of water; prices tripled" },
          { title: "FEDECOR led movement; street protests; government reversed decision" },
          { title: "Nepal: King Gyanendra dismissed parliament 2002; 2006 seven-party alliance called strike" },
          { title: "Nepal SPA movement: restored parliament; King surrendered powers; democracy restored" },
        ],
      },
      {
        sectionNumber: "22.2",
        title: "Pressure Groups and Movements",
        microConcepts: [
          { title: "Pressure groups: organised interests that seek to influence government; don't contest elections" },
          { title: "Sectional groups: trade unions, business associations, doctors' associations" },
          { title: "Public interest groups: BAMCEF (Dalit rights), Narmada Bachao (environment)" },
          { title: "Methods: lobbying, strikes, petitions, agitations, media campaigns" },
          { title: "Movement: loose organisation, mass mobilisation, issue-based" },
        ],
      },
      {
        sectionNumber: "22.3",
        title: "Movements in India",
        microConcepts: [
          { title: "Chipko movement: environment; Right to Information movement: transparency" },
          { title: "Anti-liquor movement: women in Andhra Pradesh (Nellore district, 1992)" },
          { title: "Narmada Bachao Andolan: Medha Patkar; against large dams displacing tribals" },
          { title: "BAMCEF: Dalit movement; Dr Ambedkar's legacy" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [],
    examTips: [
      "Bolivia: privatisation of water → price hike → popular struggle → reversal; example of democratic accountability",
      "Pressure group vs political party: PG doesn't contest elections; doesn't seek power directly",
      "Movements: informal, long-lasting, not organised like parties — but can shape policy",
      "RTI movement: Anna Hazare led; led to Right to Information Act 2005 — landmark achievement",
    ],
    exercises: [
      { exerciseNumber: "Exercise 22", questionCount: 10, types: ["MCQ", "Short Answer", "Long Answer", "Case Study"] },
    ],
  },
];

// ── Seed runner ──────────────────────────────────────────────────────────────
async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  for (const ch of CHAPTERS) {
    await Chapter.findOneAndUpdate(
      { subject: ch.subject, grade: ch.grade, board: ch.board, chapterNumber: ch.chapterNumber },
      ch,
      { upsert: true, new: true }
    );
    console.log(`  ✓ Ch${ch.chapterNumber} [${ch.unit}] — ${ch.title}`);
  }

  console.log(`\nDone: ${CHAPTERS.length} chapters seeded`);
  const byUnit = CHAPTERS.reduce((acc, c) => { acc[c.unit] = (acc[c.unit] || 0) + 1; return acc; }, {});
  Object.entries(byUnit).forEach(([u, n]) => console.log(`  ${u}: ${n} chapters`));
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
