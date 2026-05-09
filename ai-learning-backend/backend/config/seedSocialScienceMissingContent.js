/**
 * Seed: SST Missing NcertTopicContent — 20 topics
 * Fills audit gaps for Ch1–Ch10 using the canonical topicIds in DIAGRAM_MAP / auditCoverage.mjs
 * Safe to re-run — upserts on { topicId }.
 * Usage: node config/seedSocialScienceMissingContent.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const TOPICS = [

  // ── CH1: Rise of Nationalism in Europe ───────────────────────────────────────

  {
    topicId: "sst_ch1_unification",
    subject: "Social Science", chapterNumber: 1,
    name: "Unification of Germany and Italy",
    prerequisite_knowledge: ["sst_ch1_nationalism_europe"],
    key_formulas: [
      "Germany unified 1871 — Bismarck's 'Blood and Iron' policy (3 wars: Denmark 1864, Austria 1866, France 1870–71)",
      "Italy unified 1861 — Cavour's diplomacy + Garibaldi's march of the Thousand",
      "Kaiser Wilhelm I proclaimed German Emperor at Palace of Versailles, 18 Jan 1871",
    ],
    teaching_content: {
      intuition: "By the mid-19th century, both Germany and Italy existed only as geographic expressions — loose collections of small states. Unification required two different strategies: Bismarck used war and realpolitik to forge Germany from above (conservative revolution), while Italy combined Cavour's diplomatic manipulation of France and Austria with Garibaldi's popular military campaigns from below.",
      process_explanation: "Germany: Prussia dominated the German Confederation. Bismarck, as Chancellor, fought three deliberate wars — against Denmark (1864) for Schleswig-Holstein, Austria (1866) at Sadowa to exclude it from German affairs, and France (1870–71) at Sedan to rally southern German states through nationalist sentiment. Victory over France unified all German states under Prussian leadership; Wilhelm I was proclaimed Kaiser in Versailles. Italy: The north (Piedmont-Sardinia) was the engine. Cavour allied with France against Austria (1859), winning Lombardy. Meanwhile Garibaldi led 'The Thousand' redshirts into the south (Sicily and Naples, 1860), handing them over to the Piedmontese king. Rome was added in 1871 after French withdrawal.",
      worked_example: "NCERT Board Question: 'Why is Bismarck called the architect of German unification?' — Answer: Bismarck used three strategic wars (Denmark, Austria, France) to eliminate rivals, build Prussian prestige, and rally German nationalism, culminating in Wilhelm I's proclamation as Kaiser in 1871. He believed in Realpolitik — practical politics over ideology.",
      common_misconceptions: ["Garibaldi unified Italy alone — Cavour's diplomacy was equally crucial", "Germany was unified purely through nationalism — it was mainly Prussian military power and Bismarck's strategy", "Unification was peaceful — it involved three wars for Germany"],
      shortcuts_and_tricks: ["Bismarck = 3 wars (D-A-F: Denmark, Austria, France)", "Cavour = north (diplomacy + French alliance), Garibaldi = south (military)", "Both unified in 1860s–71; Germany last (1871)"],
      diagram_description: "Map showing German states pre-1871 with arrows indicating the three wars; parallel map of Italian unification with Cavour's north and Garibaldi's south converging.",
      key_takeaway: "German unification was driven by Prussian military power under Bismarck (top-down); Italian unification combined Cavour's diplomacy with Garibaldi's popular movements (top and bottom). Both were complete by 1871.",
    },
  },

  {
    topicId: "sst_ch1_visualising_nation",
    subject: "Social Science", chapterNumber: 1,
    name: "Visualising the Nation — Allegory and Symbols",
    prerequisite_knowledge: ["sst_ch1_nationalism_europe"],
    key_formulas: [
      "Marianne = French nation (female allegory) — liberty cap, tricolor; stamped on coins and stamps",
      "Germania = German nation — oak leaves (strength), sword, shield",
      "Allegory = abstract idea represented through a person or figure",
    ],
    teaching_content: {
      intuition: "Nations are abstract — you cannot see 'France' or 'Germany'. Artists and political leaders needed to make the nation visible and emotionally compelling. They created female allegorical figures — Marianne for France, Germania for Germany — that embodied national values and could appear on stamps, coins, and paintings to create mass identification with the nation.",
      process_explanation: "Marianne (France): Derived from a common peasant name, she represented the republic's core values — liberty, equality, fraternity. Her red liberty cap (Phrygian cap) and tricolor flag became instantly recognisable. Statues of Marianne were placed in public squares and town halls across France. Her image appeared on stamps and coins, making the republic visible in everyday life. Germania (Germany): Painted by Philipp Veit in 1848, Germania wore a crown of oak leaves (symbol of German strength), carried a sword, and bore a shield with the German eagle. She represented a powerful, martial nation. These allegories taught ordinary people — many illiterate — what the nation stood for through visual language.",
      worked_example: "NCERT asks: 'How did artists represent the nation of Germany?' — Germania was depicted as a woman in armour with oak leaf crown (heroism/strength), sword (readiness to fight), and sometimes broken chains (freedom from foreign domination). The oak tree specifically referenced the idea of Germany's ancient, deep-rooted culture.",
      common_misconceptions: ["These were real historical figures — they are allegorical (symbolic) figures", "Only France used allegory — Germany, Britain (Britannia), and India (Bharat Mata) all used similar devices"],
      shortcuts_and_tricks: ["Marianne = France = liberty cap + tricolor", "Germania = Germany = oak leaves + sword", "Allegory = abstract nation made visible"],
      diagram_description: "Side-by-side images of Marianne and Germania with labelled features: liberty cap, tricolor, oak crown, sword, shield.",
      key_takeaway: "Nations created allegorical female figures (Marianne, Germania) to make abstract national identity visible and emotionally powerful for ordinary citizens through art, stamps, coins and public statues.",
    },
  },

  // ── CH2: Nationalism in India ─────────────────────────────────────────────────

  {
    topicId: "sst_ch2_collective_belonging",
    subject: "Social Science", chapterNumber: 2,
    name: "Sense of Collective Belonging — Symbols of Indian Nationalism",
    prerequisite_knowledge: ["sst_ch2_non_cooperation"],
    key_formulas: [
      "Bharat Mata — painted by Abanindranath Tagore (1905) — saffron-robed, book, rosary, white cloth",
      "Vande Mataram — composed by Bankim Chandra Chattopadhyay in Anandamath (1882)",
      "Tricolor flag first designed by 1921 Congress session; charkha (spinning wheel) at centre",
    ],
    teaching_content: {
      intuition: "A nation needs more than political organization — it needs emotional unity. Indians from diverse languages, religions, and castes had to feel they belonged to the same 'imagined community'. This was built through shared symbols: a mother goddess image of India (Bharat Mata), a national song (Vande Mataram), the tricolor flag, and folk heroes like Shivaji and Rana Pratap who were reinterpreted as national symbols.",
      process_explanation: "Bharat Mata: Abanindranath Tagore painted India as a serene goddess in 1905, during the Partition of Bengal agitation. She carried books, paddy, white cloth and a mala — symbols of learning, food, purity and spirituality. This image spread rapidly, creating a visual identity for India as a mother to be protected. Vande Mataram: Bankim's novel Anandamath (1882) contained this hymn to the motherland. It became the rallying cry of nationalists, especially during the Swadeshi movement. However, it faced opposition from some Muslims who saw the song as Hindu-centric. Flag: The tricolor evolved from early Congress designs; by 1931 it had saffron, white and green bands with the spinning wheel (charkha) — symbol of self-reliance and non-violent resistance.",
      worked_example: "NCERT question: 'How was the image of Bharat Mata used in the nationalist movement?' — The Bharat Mata image by Abanindranath Tagore (1905) portrayed India as a divine mother, creating emotional attachment that transcended regional identities. It told Indians they shared a common motherland worth protecting and sacrificing for.",
      common_misconceptions: ["Vande Mataram was the original national anthem — Jana Gana Mana became the anthem; Vande Mataram is the national song", "The spinning wheel on the flag represents industry — it represents self-sufficiency and Gandhian non-violence"],
      shortcuts_and_tricks: ["Bharat Mata = 1905, Tagore, goddess with book+paddy", "Vande Mataram = Bankim 1882, Anandamath novel", "Flag: saffron+white+green + charkha (1931)"],
      diagram_description: "The Bharat Mata painting with labels; the 1931 Congress tricolor with spinning wheel; timeline of national symbols emerging 1882–1947.",
      key_takeaway: "Collective belonging was built through shared symbols — Bharat Mata image, Vande Mataram song, the tricolor flag, and reinterpreted folk heroes — that made diverse Indians feel part of one nation.",
    },
  },

  // ── CH3: Making of a Global World ────────────────────────────────────────────

  {
    topicId: "sst_ch3_premodern_world",
    subject: "Social Science", chapterNumber: 3,
    name: "The Pre-Modern World — Silk Routes, Food and Disease",
    prerequisite_knowledge: [],
    key_formulas: [
      "Silk Routes: multiple overland + sea routes linking Asia, Africa, Europe from 3000 BCE",
      "Columbian Exchange: food, disease, animals exchanged between Americas and Old World after 1492",
      "Indentured labour: cheap contract labour sent from India/China to European colonies 19th century",
    ],
    teaching_content: {
      intuition: "Globalisation is not a modern invention. Long before aeroplanes and the internet, the world was connected through trade routes, migration and disease. The Silk Routes carried silk, spices, and ideas between China, India, Central Asia and Europe for millennia. Columbus's 1492 voyage connected the Americas to the Old World, triggering an exchange of food (potatoes, maize, tomatoes → Europe; wheat, horses → Americas) and disease (smallpox wiped out up to 90% of some Native American populations).",
      process_explanation: "Silk Routes: The name is misleading — not just silk but cotton, spices, precious metals, Buddhist and Christian missionaries all travelled these routes. They were both overland (Central Asia) and maritime (Indian Ocean). Chinese pottery found in East Africa and Roman coins found in India show how extensive this exchange was. Columbian Exchange: After 1492, plants and animals moved in both directions. Europe received potatoes, maize, tomatoes, chillies, groundnuts — transforming European diets and enabling population growth. The Americas received smallpox, measles and influenza, which devastated Native populations who had no immunity. Indentured Labour: After slavery was abolished (1833 in British Empire), colonial plantations in the Caribbean, Mauritius, Fiji, and South Africa needed cheap labour. Millions of Indians were recruited under 5-year contracts (indenture) with promises of land afterwards. The system was brutal — often called 'new system of slavery'.",
      worked_example: "NCERT Board Exam: 'How did the Silk Routes link the world before modern times?' — The Silk Routes were a network of overland and sea paths connecting China, India, Persia, Africa and Europe from around 3000 BCE. They carried goods (silk, spices, cotton), religions (Buddhism, Christianity), and ideas across continents, making them the first global trade network.",
      common_misconceptions: ["Silk Routes carried only silk — they carried spices, cotton, religion, disease and people", "The Columbian Exchange only benefited Europe — it also introduced new crops to the Americas and caused catastrophic disease epidemics there"],
      shortcuts_and_tricks: ["Silk Routes = 3000 BCE, overland + sea, silk/spices/religion", "Columbian Exchange = 1492, food + disease both ways", "Indentured labour = 1833+ (post-slavery), 5-year contracts, 'new slavery'"],
      diagram_description: "Map of Silk Routes across Asia, Africa, Europe; diagram showing Columbian Exchange with arrows showing food/disease movement; timeline from ancient trade to 19th-century labour migration.",
      key_takeaway: "The pre-modern world was already globally connected through Silk Routes (trade, religion, ideas), the Columbian Exchange (food, disease after 1492), and later indentured labour migration — globalisation predates the modern era.",
    },
  },

  {
    topicId: "sst_ch3_interwar_economy",
    subject: "Social Science", chapterNumber: 3,
    name: "The Interwar Economy — Great Depression and Bretton Woods",
    prerequisite_knowledge: ["sst_ch3_premodern_world"],
    key_formulas: [
      "Great Depression: 1929–1933 — US stock market crash Oct 1929; global GDP fell ~15%, unemployment 25%+ in USA",
      "Gold Standard: currency value tied to gold; collapsed 1930s as countries devalued to boost exports",
      "Bretton Woods Conference: 1944, New Hampshire — created IMF + World Bank to prevent future depressions",
    ],
    teaching_content: {
      intuition: "The period between the two World Wars (1919–1939) saw the most catastrophic economic collapse in modern history. The Great Depression of 1929 wiped out savings, closed banks, threw millions into unemployment, and destroyed international trade. It demonstrated how interconnected the world economy had become — a crash on Wall Street hit farmers in India within months. The response, the Bretton Woods system of 1944, created the international financial institutions we still use today.",
      process_explanation: "Causes of Great Depression: The 1920s US boom was built on credit and speculation. When Wall Street crashed (Black Thursday, 24 Oct 1929), banks failed, credit froze, businesses collapsed. The US called in loans to Europe, triggering a global cascade. US unemployment reached 25%. Agricultural prices collapsed worldwide — Indian cotton farmers, Australian wheat farmers, Latin American commodity exporters all suffered. Impact on India: India's exports fell sharply. Peasants who had taken loans to pay land revenue found prices for their crops had collapsed. Rural debt spiralled. Bretton Woods (1944): Allied nations met at Bretton Woods, New Hampshire to design the post-war economic order. They created: IMF (to stabilise exchange rates and provide short-term credit to countries in balance-of-payments crisis) and World Bank (to fund post-war reconstruction and development). The US dollar became the anchor currency, fixed to gold at $35/ounce.",
      worked_example: "NCERT: 'Explain the impact of the Great Depression on India.' — India's export economy suffered severely: cotton and jute prices collapsed, peasants couldn't repay loans, rural debt crisis deepened. Nationalist leaders used the Depression to argue that British economic policies exploited India — the Depression became political ammunition for the independence movement.",
      common_misconceptions: ["Bretton Woods was mainly about trade — it was about monetary stability (exchange rates, balance of payments)", "The Great Depression only affected rich countries — it devastated colonial economies like India through price collapse"],
      shortcuts_and_tricks: ["1929 = Great Depression, Wall Street crash", "Bretton Woods 1944 = IMF (short-term bailouts) + World Bank (long-term development)", "Gold standard = fixed exchange rates, collapsed in Depression"],
      diagram_description: "Timeline 1919–1945: boom, crash, depression, Bretton Woods; diagram of how Wall Street crash transmitted to India through trade and credit; IMF vs World Bank comparison table.",
      key_takeaway: "The 1929 Great Depression proved economic interdependence — a US stock crash devastated Indian farmers. The 1944 Bretton Woods conference responded by creating the IMF and World Bank to manage the post-war global economy.",
    },
  },

  {
    topicId: "sst_ch3_post_war",
    subject: "Social Science", chapterNumber: 3,
    name: "Post-War Economic Order — Decolonisation and the New International System",
    prerequisite_knowledge: ["sst_ch3_interwar_economy"],
    key_formulas: [
      "GATT → WTO: General Agreement on Tariffs and Trade (1947) evolved into World Trade Organisation (1995)",
      "Marshall Plan 1948: USA gave $13 billion to rebuild Western Europe",
      "Group of 77 (G-77): developing nations' coalition at UN demanding New International Economic Order (NIEO)",
    ],
    teaching_content: {
      intuition: "After World War II, the world reorganised itself into a new economic order. Western Europe was rebuilt with US money (Marshall Plan). Colonies in Asia and Africa gained independence (decolonisation). But the new nations found themselves poor, dependent on commodity exports, and subject to rules set by rich countries. They organised as the G-77 to demand fairer terms — a 'New International Economic Order'. Meanwhile, technology and finance accelerated globalisation in the 1990s through the WTO, MNCs, and internet.",
      process_explanation: "Post-War Reconstruction: The Marshall Plan (1948) pumped $13 billion into Western European economies. This rebuilt industry, created demand for US goods, and cemented US economic dominance. Japan similarly received US support. The Bretton Woods system managed exchange rates until 1971, when the US abandoned the gold standard (Nixon Shock). Decolonisation: Asian and African nations gained independence 1947–1960s. But colonial trade patterns persisted — they exported raw materials and imported manufactured goods. Terms of trade (commodity prices vs manufactured prices) worsened for developing nations. G-77 and NIEO: Developing countries at the UN demanded the New International Economic Order (1974) — fairer commodity prices, technology transfer, preferential market access. This largely failed as rich countries resisted. Globalisation 1990s: The WTO (1995) replaced GATT, opening markets further. Multinational corporations spread production globally. Critics argue this benefited rich countries and MNCs more than the poor.",
      worked_example: "NCERT: 'What is the World Trade Organisation?' — WTO is the international body that governs trade rules between countries. It replaced GATT in 1995. Its goal is free trade through reducing tariffs and trade barriers. India and other developing nations argue WTO rules sometimes unfairly favour rich countries who protect their own agriculture while demanding India open its markets.",
      common_misconceptions: ["Marshall Plan was pure generosity — it also served US strategic interests in containing Soviet influence", "WTO forces free trade on all equally — rich countries maintain agricultural subsidies while demanding poor countries remove protection"],
      shortcuts_and_tricks: ["Marshall Plan 1948 = US rebuilds Europe ($13bn)", "GATT 1947 → WTO 1995 = trade liberalisation body", "G-77 = developing nations demanding NIEO (fairer trade)"],
      diagram_description: "Timeline 1945–2000: Marshall Plan → decolonisation → GATT → NIEO demand → WTO; flow chart of how WTO governs global trade; G-77 member countries map.",
      key_takeaway: "The post-war order rebuilt Europe (Marshall Plan), decolonised Asia and Africa, and created global trade institutions (GATT/WTO). Developing nations, organised as G-77, fought — largely unsuccessfully — for a fairer New International Economic Order.",
    },
  },

  // ── CH4: Age of Industrialisation ────────────────────────────────────────────

  {
    topicId: "sst_ch4_proto_industrialisation",
    subject: "Social Science", chapterNumber: 4,
    name: "Proto-industrialisation — The Putting-Out System",
    prerequisite_knowledge: [],
    key_formulas: [
      "Proto-industrialisation: production for market using rural domestic labour, organised by merchants — before factories",
      "Putting-out system: merchant gives raw material to rural artisan → artisan produces at home → merchant collects finished goods",
      "Staple towns: English wool trade centres (Norwich, Leeds) — merchants organised proto-industrial networks",
    ],
    teaching_content: {
      intuition: "Britain did not leap directly from farming to factories. There was an intermediate stage called proto-industrialisation — production organised by merchants using rural domestic workers. Peasant families supplemented farm income by spinning wool or weaving cloth at home. Merchants provided the raw materials, picked up the finished goods, and sold them. This created the commercial networks, capital accumulation, and market experience that made the factory system possible.",
      process_explanation: "The Putting-Out System: A merchant-draper would buy raw wool, 'put it out' to rural spinners and weavers who worked in their cottages, then collect the finished cloth and sell it in London or export it to Europe. Peasants welcomed this as supplementary income; merchants welcomed it as cheap, flexible labour outside guild regulations. This was widespread in England (wool), India (cotton textiles), and France (silk). Why it preceded factories: It created capital for merchant-manufacturers. It established marketing networks and trade contacts. It familiarised workers with wage labour discipline. Decline: Eventually, coordination costs of scattered production grew; steam power made centralised factories more efficient; enclosures pushed peasants off the land, creating an urban proletariat for factories.",
      worked_example: "NCERT: 'Why did industrialists in Britain prefer rural workers in the early stages?' — Rural workers were cheaper than guild-regulated urban craftsmen, had no unions, worked seasonally (complementing agricultural rhythms), and could be paid only for output (piece-rate). The putting-out system gave merchants control without capital investment in buildings or machinery.",
      common_misconceptions: ["Industrialisation began with factories — proto-industrialisation using domestic labour came first", "Proto-industrialisation was only in England — it was widespread across Europe and India"],
      shortcuts_and_tricks: ["Proto-industry = production for market + domestic labour + merchant control", "Putting-out = merchant gives material → artisan works at home → merchant collects", "Preceded factories by centuries; laid commercial and capital foundations"],
      diagram_description: "Flowchart of putting-out system: merchant → raw material → rural artisan cottage → finished goods → merchant → market; map showing English wool proto-industry regions.",
      key_takeaway: "Proto-industrialisation (the putting-out system) preceded factories — merchants organised rural domestic production for export markets, accumulating capital and market networks that later fuelled the factory system.",
    },
  },

  {
    topicId: "sst_ch4_factory_system",
    subject: "Social Science", chapterNumber: 4,
    name: "The Factory System — Steam, Discipline and Child Labour",
    prerequisite_knowledge: ["sst_ch4_proto_industrialisation"],
    key_formulas: [
      "Spinning jenny (1764, Hargreaves) → Water frame (1769, Arkwright) → Steam-powered loom (1780s, Watt)",
      "Cotton: first mechanised industry in Britain (Lancashire mills)",
      "Factory Acts: 1819 (no children under 9), 1833 (9–13 max 9hr/day), 1878 (women/children max 56hr/week)",
    ],
    teaching_content: {
      intuition: "The factory transformed human society more profoundly than any other invention. For the first time, thousands of workers laboured together under one roof, controlled by the clock and the machine rather than by seasons or personal skill. Steam power made production continuous and fast. But the social cost was enormous: children worked 12-hour days in dangerous conditions; women earned half of men's wages; cities grew faster than sanitation.",
      process_explanation: "Technology: James Hargreaves's Spinning Jenny (1764) allowed one worker to spin multiple threads. Richard Arkwright's Water Frame (1769) used water power for spinning — requiring a factory (could not be used in cottages). James Watt's steam engine (1780s) freed factories from rivers, enabling them to locate in cities. Cotton led industrialisation — cheap raw cotton from American slave plantations; finished cloth exported globally. Factory Discipline: Workers were fined for lateness, talking, or opening windows. The clock replaced the sun as the organiser of the working day. Child Labour: Children were preferred in early factories — small fingers for spinning, cheaper wages, no union membership. Seven-year-olds worked 14-hour days. Factory reformers like Robert Owen campaigned for regulation; Factory Acts gradually restricted child labour. Social Impact: Cities like Manchester grew from 25,000 (1772) to 303,000 (1850). Slum housing, polluted air, cholera epidemics. Engels documented Manchester's working class conditions in 1845.",
      worked_example: "NCERT: 'Why were children preferred as workers in early British factories?' — Children were preferred because: (1) employers could pay them less, (2) their small fingers could access spaces and handle delicate threads in spinning, (3) they had no knowledge of their rights, (4) they could not join unions, and (5) orphan children from workhouses had no family to protect them.",
      common_misconceptions: ["Steam engine was the first machine of industrialisation — spinning jenny and water frame came before steam power was widely applied to textiles", "Child labour ended quickly after Factory Acts — enforcement was weak for decades"],
      shortcuts_and_tricks: ["3 machines: Jenny (1764) → Water Frame (1769) → Steam (1780s)", "Factory discipline = clock time, fines, surveillance", "Factory Acts 1819→1833→1878 = gradually restricting child labour"],
      diagram_description: "Timeline of key inventions 1764–1800; diagram of factory floor with machines, clock, child workers; graph of Manchester population growth 1772–1850.",
      key_takeaway: "The factory system centralised production using steam power and strict discipline. While it created industrial capitalism, it also produced child labour, urban slums and class conflict — driving reform movements and Factory Acts throughout the 19th century.",
    },
  },

  {
    topicId: "sst_ch4_india_industrialisation",
    subject: "Social Science", chapterNumber: 4,
    name: "Industrialisation in Colonial India",
    prerequisite_knowledge: ["sst_ch4_factory_system"],
    key_formulas: [
      "First cotton mill: Bombay (1854) — Cowasji Nanabhoy Davar",
      "Tata Iron and Steel Company (TISCO): Jamshedpur, 1912 — first large Indian steel plant",
      "Swadeshi movement (1905): boycott British goods → boosted Indian textile and match industries",
    ],
    teaching_content: {
      intuition: "India's industrialisation happened differently from Britain's — under colonial rule. Britain deliberately kept India as a supplier of raw materials (cotton, jute, indigo) and a market for British manufactures. When Indian industry did develop, it was largely in cotton textiles (Bombay/Ahmedabad) and jute (Bengal), often owned by Indian merchants. Industrialisation coexisted with, and did not replace, craft production — Indian artisans survived by producing for different markets.",
      process_explanation: "Colonial De-industrialisation: Manchester cotton goods, manufactured cheaply with steam power, destroyed Indian handloom weaving. Weavers of Bengal and Madras lost their livelihoods. The colonial government actively aided this through free trade policies and low tariffs on British imports. Rise of Indian Industry: Indian merchants who had accumulated capital through trade with the British (as compradors and suppliers) invested in cotton mills. Bombay's first mill opened 1854. By 1900, India had dozens of mills. Jute: Calcutta/Bengal became world's leading jute processor — but the mills were largely British-owned. TISCO: Jamsetji Tata planned India's first modern steel plant; his son Dorabji completed it at Jamshedpur in 1912. During WWI, TISCO supplied steel and rails to the British Army — dramatically boosting growth. Swadeshi: The 1905 Partition of Bengal triggered the Swadeshi movement — boycott of British goods, promotion of Indian industries. Swadeshi matches, soap, textiles sold alongside nationalist sentiment. Artisan Survival: Weavers survived by producing specialised, high-quality fabrics (Banarasi silk, Chanderi) that machines could not replicate.",
      worked_example: "NCERT: 'What was the impact of Manchester on Indian weavers?' — Cheap machine-made Manchester cloth, imported under free trade, undercut Indian handloom products in price. Indian weavers could not compete, leading to mass unemployment and impoverishment. The number of professional weavers in India fell sharply in the 19th century.",
      common_misconceptions: ["British rule industrialised India the same way as Britain — colonial policy actively prevented Indian competition with British manufacturers", "All Indian industry was destroyed — cotton textiles and jute mills grew, but under constraints"],
      shortcuts_and_tricks: ["India's first mill = Bombay 1854", "TISCO = 1912, Jamshedpur, Tatas", "Swadeshi 1905 = boycott British → buy Indian"],
      diagram_description: "Map showing Indian industrial centres (Bombay cotton, Jamshedpur steel, Calcutta jute); graph of British textile imports vs Indian handloom output 1800–1900; timeline of key Indian industries.",
      key_takeaway: "Colonial India's industrialisation was shaped by British economic interests — de-industrialising handlooms while developing raw material exports. Indian entrepreneurs (Tatas, Bombay mill owners) built industries despite constraints; Swadeshi nationalism accelerated indigenous industry from 1905.",
    },
  },

  // ── CH5: Print Culture and the Modern World ───────────────────────────────────

  {
    topicId: "sst_ch5_print_revolution",
    subject: "Social Science", chapterNumber: 5,
    name: "The Print Revolution — Gutenberg to Print Capitalism",
    prerequisite_knowledge: [],
    key_formulas: [
      "Gutenberg press: c. 1448, Mainz, Germany — movable metal type; first printed Bible 1455",
      "Print capitalism (Benedict Anderson): print created 'imagined communities' → nationalism",
      "By 1500: 20 million books printed in Europe; printing spread to over 200 cities",
    ],
    teaching_content: {
      intuition: "For thousands of years, books were hand-copied by scribes — scarce, expensive, and only for the elite. Johann Gutenberg's printing press (c. 1448) changed everything. Suddenly, identical copies of a text could be produced in hours rather than months. Ideas spread faster than any authority could control. The Reformation, the Scientific Revolution, and nationalism itself were all products of the print revolution.",
      process_explanation: "Gutenberg's Innovation: He adapted the screw-press used for wine and oil to press inked movable type onto paper. He cast individual metal letters that could be rearranged to print any text. His first major work was the 42-line Bible (1455). Within 50 years, printing presses operated in over 200 European cities. Impact on Religion: Martin Luther's 95 Theses (1517) — criticising the Catholic Church — were printed and spread across Germany within weeks. The Reformation became possible because print allowed Luther's ideas to reach millions before the Church could suppress them. Impact on Science: Scientists like Copernicus, Galileo, and Newton could publish their findings and build on each other's work across Europe. Print capitalism: Philosopher Benedict Anderson argued that print created 'imagined communities' — people who read the same newspapers and novels began to see themselves as sharing a common culture, language and identity, enabling nationalism. Chapbooks and popular print: Cheap printed pamphlets (chapbooks) spread literacy among the common people. Almanacs, nursery rhymes, and ballads brought print to those who could not afford books.",
      worked_example: "NCERT: 'How did the print revolution help Martin Luther and the Protestant Reformation?' — Luther's 95 Theses attacking Church corruption were printed and distributed across Germany within 2 weeks of posting. The Church could not suppress ideas that existed in thousands of copies. Print allowed ordinary literate Germans to read the Bible themselves (in German translation) rather than relying on priests — undermining Church authority.",
      common_misconceptions: ["Printing was invented by Gutenberg — Chinese and Koreans developed block printing centuries earlier; Gutenberg developed movable metal type for European languages", "Print immediately spread literacy — early print was still too expensive for most; mass literacy took centuries"],
      shortcuts_and_tricks: ["Gutenberg 1448, Germany, movable type → Bible 1455", "Print capitalism = shared reading → imagined community → nationalism (Benedict Anderson)", "Luther 1517 = Reformation + printing = ideas spread before suppression"],
      diagram_description: "Diagram of Gutenberg's movable type press; timeline from 1448 to 1900 showing spread of printing and key events (Reformation, Enlightenment, nationalism); map of printing centres by 1500.",
      key_takeaway: "Gutenberg's printing press (1448) democratised knowledge — identical texts spread faster than any authority could suppress. Print enabled the Reformation, Scientific Revolution, and nationalism by creating 'imagined communities' of readers sharing common identity.",
    },
  },

  {
    topicId: "sst_ch5_india_print",
    subject: "Social Science", chapterNumber: 5,
    name: "Print Culture in Colonial India",
    prerequisite_knowledge: ["sst_ch5_print_revolution"],
    key_formulas: [
      "First printing press in India: Portuguese missionaries, Goa, 1556",
      "First newspaper: Bengal Gazette (James Augustus Hicky, 1780) — British-owned",
      "Vernacular Press Act 1878: allowed government to seize presses printing 'seditious' content",
    ],
    teaching_content: {
      intuition: "When print arrived in India, it unleashed a cultural and political revolution. Reformers used print to attack caste oppression and child marriage; nationalists used it to build anti-colonial sentiment; women gained access to reading and ideas that challenged their confinement. The colonial government, alarmed by print's power, used censorship and the Vernacular Press Act to control it — but could never fully suppress the flood of pamphlets, newspapers and novels.",
      process_explanation: "Early Print in India: Portuguese missionaries brought the first press to Goa in 1556. They printed Christian texts in local languages to convert Indians. Indian languages (Tamil, Bengali, Marathi) developed rich print cultures. Newspapers: James Hicky's Bengal Gazette (1780) was India's first, criticising British officials. Indian-owned newspapers proliferated by the 1820s. Bengali papers like Sambad Kaumudi (Rammohun Roy) discussed social reform. Reform and Print: Ram Mohan Roy used print to campaign against sati. Jyotirao Phule's writings attacked Brahmin domination. Tarabai Shinde wrote a feminist pamphlet. B.R. Ambedkar published newspapers to fight caste discrimination. Vernacular Press Act 1878: Alarmed by nationalist newspapers during the 2nd Afghan War, Viceroy Lytton passed this Act allowing seizure of any press printing material that could incite 'disaffection' against British rule. Tilak's Kesari was frequently prosecuted. Women and Print: As female literacy grew (slowly), women's magazines appeared (Bamabodhini Patrika in Bengal). Women writers published, though often anonymously. Some women read in hiding from disapproving families.",
      worked_example: "NCERT: 'How did print culture help Indian nationalists?' — Print allowed nationalist leaders to reach a mass audience. Bal Gangadhar Tilak's Marathi newspaper Kesari published fiery anti-British articles, reaching lakhs of readers. Newspapers coordinated boycott campaigns, spread news of atrocities, and built a shared national consciousness among Indians who had never met.",
      common_misconceptions: ["British authorities welcomed a free press in India — they actively suppressed vernacular press through the Vernacular Press Act 1878", "Print only helped elite nationalists — Ambedkar, Phule and other lower-caste leaders also used print to fight caste oppression"],
      shortcuts_and_tricks: ["First press India = 1556, Goa, Portuguese", "First newspaper = Bengal Gazette, Hicky, 1780", "Vernacular Press Act 1878 = censorship of Indian language papers"],
      diagram_description: "Timeline of print in India 1556–1947: press arrival → newspapers → reform press → nationalist press → censorship acts; map of major print centres (Calcutta, Bombay, Madras); examples of famous Indian newspapers and pamphlets.",
      key_takeaway: "Print culture in colonial India empowered reformers (Roy, Phule, Ambedkar) and nationalists (Tilak, Gandhi) to reach mass audiences. The colonial government responded with censorship (Vernacular Press Act 1878) but could not stop print from fuelling the independence movement.",
    },
  },

  // ── CH6: Resources and Development ───────────────────────────────────────────

  {
    topicId: "sst_ch6_types_resources",
    subject: "Social Science", chapterNumber: 6,
    name: "Types of Resources — Natural, Human, Man-made",
    prerequisite_knowledge: [],
    key_formulas: [
      "Natural resources: occur in nature, not made by humans (land, water, forests, minerals)",
      "Renewable: replenish naturally (solar, wind, forests if managed); Non-renewable: finite stock (coal, oil, minerals)",
      "Actual vs Potential resources: actual = currently used; potential = not yet used but identified (Ladakh solar)",
    ],
    teaching_content: {
      intuition: "Everything we use comes from a resource — the paper in your book (forests), the electricity in your lamp (coal or solar), the food on your plate (soil and water). Understanding what resources are, where they come from, and how we should manage them is the foundation of economic geography. Resources are not equally distributed — India is rich in some (coal, iron, manpower) and poor in others (oil).",
      process_explanation: "Classification by Origin: Natural resources come from the physical environment — land, water, forests, minerals, solar energy. Human resources are people's skills, knowledge and labour. Man-made or capital resources are things humans have created — buildings, machinery, roads. Classification by Exhaustibility: Renewable resources can be replenished — solar energy, wind, tidal energy, forests (if harvested sustainably), water (if not overused). Non-renewable resources took millions of years to form and will run out — coal, petroleum, natural gas, minerals. Classification by Development Stage: Actual resources are identified and currently used (coal mined in Jharkhand). Potential resources are identified but not yet fully developed (Rajasthan solar, Ladakh wind). Stock resources exist but we lack technology to use them (hydrogen in water). Reserve resources are part of stock that can be used with available technology.",
      worked_example: "NCERT: 'Distinguish between actual and potential resources with examples.' — Actual resources: Coal deposits of Jharkhand are mined and used; Actual. Potential resources: Solar energy potential of Rajasthan and Gujarat is enormous but not fully developed yet due to infrastructure and cost constraints; Potential. Both are natural resources but differ in whether we currently exploit them.",
      common_misconceptions: ["All natural resources are renewable — minerals, coal and oil are natural but non-renewable", "Human resources are less important than natural resources — skilled human resources drive development more than raw materials (Japan has few natural resources but high skills)"],
      shortcuts_and_tricks: ["3 origins: Natural / Human / Man-made", "2 exhaustibility: Renewable (sun, wind) / Non-renewable (coal, oil)", "Actual (used now) vs Potential (not yet used)"],
      diagram_description: "Classification tree of resources (origin × exhaustibility × development stage); map of India showing regions rich in different resources; renewable vs non-renewable comparison table.",
      key_takeaway: "Resources are classified by origin (natural/human/man-made), exhaustibility (renewable/non-renewable), and development stage (actual/potential/stock/reserve). Sustainable development requires managing non-renewable resources carefully and developing renewable alternatives.",
    },
  },

  {
    topicId: "sst_ch6_soil_types",
    subject: "Social Science", chapterNumber: 6,
    name: "Soil Types of India — Alluvial, Black, Red, Laterite",
    prerequisite_knowledge: ["sst_ch6_types_resources"],
    key_formulas: [
      "Alluvial soil: most fertile, largest area (43%), Indo-Gangetic and coastal plains, khadar (new) + bhangar (old)",
      "Black soil (Regur): holds moisture, self-ploughing, best for cotton — Deccan Plateau (Maharashtra, MP, Gujarat)",
      "Red and Yellow soil: iron oxide gives red colour, less fertile, poor water retention — peninsular India",
      "Laterite soil: acidic, leached by heavy rain, poor fertility — Kerala, Karnataka, Assam hills; good for tea/coffee",
    ],
    teaching_content: {
      intuition: "Not all soil is the same. Walk from the Gangetic plain to the Deccan Plateau to the coastal hills of Kerala and you walk across completely different soils — formed by different rocks, climates, and time scales. Each type has specific agricultural strengths. Alluvial soil fed India's river civilisations; black soil made the Deccan the cotton country; laterite soils, though poor for food crops, grow excellent tea and coffee.",
      process_explanation: "Alluvial Soil: Formed by river deposits (alluvium). Covers the entire Indo-Gangetic plain plus river deltas and coastal plains. Rich in potash, phosphoric acid and lime. Highly productive — feeds most of India's population. Khadar (lighter, newer, found near riverbanks) vs Bhangar (older, darker, on terraces above flood level). Black Soil (Regur): Formed from lava rock (Deccan Trap basalt). Very deep (up to 1.5m), rich in calcium, magnesium and iron. Excellent moisture-retention (stays moist long after rains end). 'Self-ploughing' — cracks when dry, creating furrows. Best for cotton, sugarcane, wheat, jowar. Red and Yellow Soil: Formed from crystalline igneous rocks. Red colour from iron oxide. Less fertile than alluvial or black, poor water retention. Found across Odisha, Chhattisgarh, eastern MP, south Bihar, Tamil Nadu hills. Good for millets and pulses with irrigation. Laterite Soil: Formed by heavy leaching in high-rainfall areas — nutrients washed away by monsoon. Acidic. Found in Kerala, Karnataka, Tamil Nadu hills, Assam, Meghalaya, Rajmahal Hills. Poor for food crops but suitable for plantation crops: tea, coffee, cashew, rubber.",
      worked_example: "NCERT Board: 'Which soil is best for cotton cultivation and why?' — Black soil (regur) is best for cotton because: (1) it retains moisture for a long time, ensuring the crop has water through the growing season; (2) it is rich in calcium, potassium and magnesium — nutrients cotton needs; (3) it 'self-ploughs' (cracks when dry), improving aeration; (4) it is deep, allowing root penetration.",
      common_misconceptions: ["Alluvial soil is found only in the north — coastal plains and river deltas in south India also have alluvial soil", "Laterite soil is useless — it supports tea, coffee and cashew plantations successfully"],
      shortcuts_and_tricks: ["Alluvial = north plains, rivers, most fertile, cotton+wheat+rice", "Black = Deccan, cotton, self-ploughing, moisture-retentive", "Red = peninsular, iron oxide, millets", "Laterite = high rainfall areas, leached, tea+coffee"],
      diagram_description: "Map of India showing distribution of major soil types with colour coding; table comparing soil types on fertility, crops, location, and key features.",
      key_takeaway: "India has four major soil types: alluvial (most fertile, north plains), black/regur (moisture-retentive, cotton, Deccan), red/yellow (iron-rich, peninsular India), and laterite (leached, plantation crops, hilly regions). Each type determines local agriculture.",
    },
  },

  // ── CH7: Forest and Wildlife Resources ───────────────────────────────────────

  {
    topicId: "sst_ch7_biodiversity",
    subject: "Social Science", chapterNumber: 7,
    name: "Biodiversity — Ecosystems and India's Rich Natural Heritage",
    prerequisite_knowledge: ["sst_ch6_types_resources"],
    key_formulas: [
      "India: 8% of world's biodiversity — 47,000 plant species, 89,000 animal species",
      "Endemic species: found only in one region (Asiatic lion = Gir, Snow leopard = Himalayas)",
      "IUCN Red List categories: Normal → Vulnerable → Endangered → Critically Endangered → Extinct",
    ],
    teaching_content: {
      intuition: "India is one of the world's 12 'megadiverse' countries — despite covering only 2.4% of Earth's land area, it holds 8% of its species. From the snow leopards of the Himalayas to the dugongs of the Andaman Sea, India's diversity reflects its varied geography and climate zones. This biodiversity is under severe threat from habitat destruction, poaching, and climate change — and losing it has practical consequences: wild plants are sources of medicines, insects pollinate crops, forests regulate rainfall.",
      process_explanation: "India's Biodiversity: India has 6 major forest biomes (tropical wet, tropical dry, subtropical, temperate, alpine, tidal). It contains 4 of the world's 34 biodiversity hotspots: the Western Ghats + Sri Lanka, Eastern Himalayas, Indo-Burma, and Sundaland. Food chains and ecosystem services: Plants → herbivores → carnivores → decomposers. Remove any link and the ecosystem collapses. Forests control water cycles, prevent soil erosion, and moderate temperature. Threatened Species: Many species are critically endangered: Bengal tiger (formerly thousands, now ~3,000), Asian elephant (~27,000), Ganges river dolphin (~3,500), Great Indian Bustard (<150). Human pressures include habitat fragmentation, poaching for illegal wildlife trade, and conflict with agriculture. Extinct in India: Cheetah (declared extinct 1952; reintroduced from Namibia 2022), Pink-headed duck, Forest Spotted Owlet.",
      worked_example: "NCERT: 'Why is biodiversity important for human welfare?' — Biodiversity provides: (1) food security — wild crop relatives provide genetic diversity for breeding disease-resistant varieties; (2) medicines — 25% of modern drugs come from plant compounds; (3) ecosystem services — forests regulate rainfall, prevent floods, purify air; (4) cultural value — forests, tigers and rivers are central to Indian culture and identity. Losing a species permanently forecloses all these benefits.",
      common_misconceptions: ["India only has tropical forests — India has 6 major biomes including alpine (Himalayas) and tidal (mangroves)", "Wild animals don't affect humans — wolves control deer populations which control vegetation which controls soil erosion"],
      shortcuts_and_tricks: ["India = 2.4% land, 8% species = megadiverse", "4 biodiversity hotspots in India", "IUCN: Normal→Vulnerable→Endangered→Critical→Extinct"],
      diagram_description: "Map of India's 4 biodiversity hotspots; food chain diagram from plants to apex predators; IUCN Red List spectrum with Indian species examples at each level.",
      key_takeaway: "India is a megadiverse country with 8% of world's species. Biodiversity provides food security, medicines, ecosystem services, and cultural heritage. Many Indian species are endangered or extinct due to habitat loss and poaching.",
    },
  },

  {
    topicId: "sst_ch7_conservation",
    subject: "Social Science", chapterNumber: 7,
    name: "Conservation of Forest and Wildlife — Parks, JFM, Community Reserves",
    prerequisite_knowledge: ["sst_ch7_forest_types", "sst_ch7_biodiversity"],
    key_formulas: [
      "Project Tiger: 1973 — 9 reserves initially; now 54 tiger reserves covering 2.4% of India",
      "Joint Forest Management (JFM): 1988 — local communities manage and benefit from state forests",
      "Biosphere Reserves: large areas of natural habitat with buffer zones; 18 in India",
    ],
    teaching_content: {
      intuition: "India has tried two very different approaches to conservation. The first — keeping humans out of forests through national parks and sanctuaries — has had mixed results and often displaced indigenous communities. The second — working with local communities through Joint Forest Management — recognises that the people who live in and around forests are often their best guardians when given rights and benefits. Both approaches are needed.",
      process_explanation: "Legal Categories of Protected Areas: National Parks (strictest protection, no human activity including grazing), Wildlife Sanctuaries (some human activity permitted), Biosphere Reserves (three zones: core/buffer/transition), Conservation Reserves (community managed). India has 106 National Parks and 567 Wildlife Sanctuaries. Project Tiger (1973): India's tiger population had collapsed from ~40,000 (1900) to ~1,800 by 1972 due to hunting and habitat loss. Project Tiger created dedicated reserves, banned tiger hunting, relocated villages. Tiger numbers recovered to ~3,000 by 2023. Joint Forest Management (1988): Communities living near state forests were given rights to collect minor forest products (fuel, fodder) and to participate in forest protection. In return, they receive a share of timber revenue. Over 100,000 JFM committees now manage 22 million hectares. Community Reserves: Sacred groves (oran, dev van) maintained by communities for religious reasons have preserved biodiversity for centuries without government intervention. Chipko Movement (1970s): Villagers in Uttarakhand hugged trees to stop logging — one of India's first environmental movements, led largely by women.",
      worked_example: "NCERT: 'What is Joint Forest Management? Why is it important?' — JFM (1988) involves local communities in protecting state forests. Communities get rights to collect non-timber forest products (fuel, fodder, herbs) and a share of revenue from forest management. In return, they protect the forest from illegal cutting, encroachment and fire. JFM works because communities who benefit from forests have a direct interest in protecting them — unlike distant forest officials.",
      common_misconceptions: ["Conservation means keeping all humans out of forests — this displaces indigenous communities who have lived sustainably in forests for generations; community-based conservation (JFM, sacred groves) can be more effective", "Project Tiger solved the tiger crisis permanently — tiger numbers have improved but habitat fragmentation remains a serious threat"],
      shortcuts_and_tricks: ["4 categories: National Park → Sanctuary → Biosphere Reserve → Conservation Reserve (strictest to least)", "Project Tiger 1973 = saved tigers from ~1800 to ~3000", "JFM 1988 = communities protect forests + share benefits"],
      diagram_description: "Map of India's tiger reserves and national parks; diagram of biosphere reserve zones (core/buffer/transition); graph of tiger population trend 1972–2023; JFM structure diagram.",
      key_takeaway: "India's conservation combines strict protection (national parks, Project Tiger) with community participation (Joint Forest Management, sacred groves). JFM works by giving communities economic rights in forests, aligning local interests with conservation goals.",
    },
  },

  // ── CH8: Water Resources ──────────────────────────────────────────────────────

  {
    topicId: "sst_ch8_water_scarcity",
    subject: "Social Science", chapterNumber: 8,
    name: "Water Scarcity — Freshwater Crisis and Causes",
    prerequisite_knowledge: [],
    key_formulas: [
      "Only 2.5% of Earth's water is fresh; of this 70% is ice, 30% groundwater → surface water <1%",
      "India's annual per capita water availability fell from 5,177 m³ (1951) to ~1,545 m³ (2011)",
      "Water stress: <1700 m³/person/year; Water scarcity: <1000 m³/person/year",
    ],
    teaching_content: {
      intuition: "Water is the most critical resource — no living thing can survive without it. Yet freshwater is astonishingly scarce: only 2.5% of Earth's water is fresh, and most of that is locked in glaciers or deep underground. India receives good monsoon rainfall but suffers severe water scarcity — because demand has grown far faster than supply, distribution is unequal (cities have more than villages), and pollution has made much of the water unsafe.",
      process_explanation: "Global Water Distribution: 97.5% of Earth's water is saltwater. Of the 2.5% freshwater: 68.7% is glaciers and ice caps, 30.1% is groundwater, only 0.3% is surface water (rivers and lakes) accessible for use. Causes of Water Scarcity in India: (1) Growing population — India's population tripled 1951–2011; same water supply shared among 3× more people. (2) Urbanisation — cities consume far more water per person than villages. (3) Irrigated agriculture — 80% of India's freshwater goes to irrigation, often inefficiently (flood irrigation loses 40–50% to evaporation). (4) Industrial use — factories require vast amounts of water for cooling and processing. (5) Pollution — industrial effluents, agricultural chemicals, and sewage contaminate rivers and groundwater. Regional Disparities: Rajasthan receives <400mm rainfall/year while Meghalaya receives >11,000mm. Within a city, slum dwellers may have 2 hours of piped water daily while wealthy areas have 24-hour supply.",
      worked_example: "NCERT: 'Is it true that India has adequate water resources but suffers from water scarcity? Explain.' — Yes. India receives 4,000 km³ of precipitation annually — sufficient in theory. But scarcity arises from: (1) temporal unevenness (75% rain in 4 monsoon months), (2) spatial unevenness (Cherrapunji vs Thar Desert), (3) population pressure, (4) groundwater overextraction (Punjab/Haryana water table falling 0.5m/year), and (5) pollution making available water unsafe.",
      common_misconceptions: ["Water scarcity only affects dry regions — over-extraction of groundwater causes scarcity even in high-rainfall areas like Punjab", "The water crisis is only about quantity — quality (pollution) is equally critical"],
      shortcuts_and_tricks: ["Only 2.5% fresh; usable surface water <0.01%", "India per capita: 5177m³ (1951) → 1545m³ (2011) — dramatic fall", "4 causes: population + urbanisation + agriculture overuse + pollution"],
      diagram_description: "Pie chart of Earth's water distribution; graph of India's per capita water availability 1951–2011; map of India's water-stressed regions; diagram showing water cycle and where withdrawals happen.",
      key_takeaway: "India has adequate total rainfall but suffers water scarcity due to uneven distribution, population growth, agricultural overuse, and pollution. Per capita availability has fallen by 70% since 1951, making water conservation a national priority.",
    },
  },

  {
    topicId: "sst_ch8_rainwater_harvesting",
    subject: "Social Science", chapterNumber: 8,
    name: "Rainwater Harvesting — Traditional and Modern Methods",
    prerequisite_knowledge: ["sst_ch8_water_scarcity"],
    key_formulas: [
      "Kul: diversion channels from streams to hillside fields — Himachal Pradesh",
      "Johad: earthen check dams for groundwater recharge — Rajasthan (Tarun Bharat Sangh movement)",
      "Tanka: underground cylindrical cistern for rooftop rainwater — Rajasthan",
    ],
    teaching_content: {
      intuition: "Before pipes and pumps, every Indian civilisation developed ingenious ways to collect and store rainwater. From the stepwells (baoris) of Rajasthan to the bamboo drip pipes of Meghalaya, India's traditional water wisdom served millions for centuries. Today, as groundwater levels fall and rivers dry up, these ancient techniques are being revived as sustainable solutions to the water crisis.",
      process_explanation: "Traditional Systems: Kul (Spiti/Lahaul): Stone-lined channels divert glacial meltwater from streams to terraced farms on steep Himalayan slopes. Some kuls are centuries old. Johad (Rajasthan): Traditional earthen check dams that slow runoff and allow it to percolate, recharging groundwater. The Tarun Bharat Sangh (People's Science movement) revived johads in Rajasthan from the 1980s, restoring rivers that had run dry. Tanka (Rajasthan): Underground cistern (3–4m diameter) below a house. Rooftop is sloped to channel rainwater into the tank through a pipe. A single tanka stores enough water for a family through summer. Baoli/Stepwell: Stone-lined descending staircases to reach groundwater — found across north and west India. Some (Rani ki Vav, Patan) are UNESCO World Heritage sites. Bamboo Drip Irrigation (Meghalaya): Tribes channel spring water through bamboo pipes to terraced fields — an ancient system still in use, so precise it delivers water at exactly the right rate to each plant. Modern Rainwater Harvesting: Rooftop systems collect and store rain, reducing demand on municipal supply. Tamil Nadu made rooftop harvesting mandatory in cities from 2001. Delhi and Bangalore have revived many traditional water bodies.",
      worked_example: "NCERT: 'How have people in Rajasthan met their water needs through traditional methods?' — In Rajasthan's arid landscape, people developed: (1) Tankas — underground cisterns below rooftops that store rainwater for the dry season; (2) Johads — earthen check dams that slow runoff and recharge groundwater; (3) Khadins — stone-walled structures that capture flash floods for agriculture. These centuries-old methods were largely abandoned after piped water arrived but are now being revived as the groundwater crisis deepens.",
      common_misconceptions: ["Traditional water harvesting is outdated — these methods are increasingly relevant as modern infrastructure fails to meet growing demand sustainably", "Rainwater harvesting is only for rural areas — urban rooftop harvesting significantly reduces city water demand"],
      shortcuts_and_tricks: ["Kul = Himalaya, stream diversion", "Johad = Rajasthan, earthen dam, groundwater recharge", "Tanka = Rajasthan, underground cistern, rooftop water", "Bamboo drip = Meghalaya, tribal, precise irrigation"],
      diagram_description: "Map of India showing locations of traditional water harvesting systems; cross-section diagrams of johad, tanka, and bamboo drip; photo-style illustration of a stepwell.",
      key_takeaway: "India's traditional rainwater harvesting systems (johad, tanka, kul, bamboo drip) are ingenious adaptations to local climates, developed over centuries. These methods are being revived as modern water infrastructure fails to meet growing demand sustainably.",
    },
  },

  // ── CH9: Agriculture ──────────────────────────────────────────────────────────

  {
    topicId: "sst_ch9_types_farming",
    subject: "Social Science", chapterNumber: 9,
    name: "Types of Farming — From Subsistence to Commercial",
    prerequisite_knowledge: ["sst_ch6_land_resources"],
    key_formulas: [
      "Subsistence farming: for family use, low surplus, traditional tools, small plots",
      "Commercial farming: for market, high inputs (HYV seeds, fertilisers, machines), large scale",
      "Shifting cultivation (Jhumming): clear-burn-cultivate-abandon — NE India tribes; slash-and-burn",
    ],
    teaching_content: {
      intuition: "Farming in India is not one thing — it ranges from tribal shifting cultivation in Nagaland, to subsistence paddy farming in Bihar, to large commercial wheat farms in Punjab using combine harvesters. Each farming type reflects its ecology, technology, and market connections. Understanding these differences helps explain regional variations in food security, income, and agricultural technology adoption.",
      process_explanation: "Primitive/Subsistence Farming: Shifting Cultivation (Jhumming/Slash-and-burn): Practised by tribal communities in NE India, Odisha, Madhya Pradesh. A patch of forest is cleared by burning; crops grown for 2–3 years until soil fertility exhausts; community moves to new patch. Environmentally damaging at large scale — reduces forest cover. Subsistence Farming: Intensive subsistence — small plots, traditional tools, family labour, minimal input. Produces just enough for family with little market surplus. Common in most of India's rural areas. Commercial Farming: High Yield Variety (HYV) seeds, chemical fertilisers, irrigation, machinery. Produces for market. Punjab wheat, Maharashtra grapes, Andhra Pradesh shrimp aquaculture. Plantation Agriculture: Large single-crop estates (tea in Assam, coffee in Karnataka, rubber in Kerala, sugarcane). Often introduced by British for export. Requires heavy capital, skilled management, and processing factories on site. Intensive Commercial: Market-oriented, high-technology, often near cities. Horticulture (flowers, vegetables, fruit) for urban markets.",
      worked_example: "NCERT: 'What is shifting cultivation? Why is it being discouraged?' — Shifting cultivation involves clearing forest patches by burning, cultivating for 2–3 seasons, then abandoning as soil depletes and moving to a new patch. It is being discouraged because: (1) reduces forest cover, damaging biodiversity and carbon storage; (2) unsustainable at high population densities; (3) land is under-utilised in fallow periods. The government promotes sedentary farming with soil conservation techniques as alternative.",
      common_misconceptions: ["Commercial farming is always better than subsistence — subsistence farming is more resilient to market fluctuations and appropriate for small holders with limited capital", "Plantation agriculture is Indian-traditional — it was introduced by the British for export crops"],
      shortcuts_and_tricks: ["4 types: Shifting → Subsistence → Commercial → Plantation", "Shifting = NE tribes, slash-burn, move every 2-3 years", "Plantation = British legacy, single crop, export-oriented (tea/coffee/rubber)"],
      diagram_description: "Comparison table of 4 farming types (inputs, scale, purpose, location); map of India showing regions of each farming type; photo-style diagrams of shifting cultivation cycle vs commercial farm.",
      key_takeaway: "India's farming ranges from tribal shifting cultivation (NE India) to intensive commercial farming (Punjab, Maharashtra). Each type reflects available land, capital, technology, and market access. Policy promotes sustainable intensification to increase yields while protecting forests.",
    },
  },

  {
    topicId: "sst_ch9_tech_reforms",
    subject: "Social Science", chapterNumber: 9,
    name: "Green Revolution and Agricultural Reforms",
    prerequisite_knowledge: ["sst_ch9_types_farming"],
    key_formulas: [
      "Green Revolution: 1960s–70s — HYV seeds + irrigation + fertilisers → wheat/rice yields tripled",
      "Main HYV crops: wheat (Punjab, Haryana) and rice (Andhra, Tamil Nadu) — not pulses/millets",
      "Land reforms: zamindari abolition (1950s), ceiling laws, tenancy protection — uneven implementation",
    ],
    teaching_content: {
      intuition: "By the 1960s, India faced famine — the government depended on US wheat imports ('ship to mouth' situation). The Green Revolution transformed this crisis: new high-yielding wheat and rice varieties, combined with irrigation and fertilisers, tripled grain production and made India self-sufficient in food by the 1980s. But the Green Revolution had a dark side — it benefited large farmers more than small, worsened regional inequality, and caused serious environmental damage.",
      process_explanation: "Green Revolution (1960s–70s): M.S. Swaminathan introduced HYV wheat seeds (originally developed by Norman Borlaug in Mexico). These dwarf varieties produced more grain per plant and responded well to fertilisers. Combined with irrigation (tube wells) and chemical fertilisers, wheat yields in Punjab and Haryana tripled. Similar varieties for rice were developed and adopted in Andhra Pradesh and Tamil Nadu. India became self-sufficient in food grains by 1980. Problems with Green Revolution: (1) Crop diversity collapsed — only wheat and rice got HYV attention; pulses, millets and oilseeds were neglected; (2) Regional inequality — Punjab/Haryana benefited most; NE India, tribal areas barely affected; (3) Rich farmer bias — only large farmers could afford inputs; (4) Environmental costs — excessive groundwater use (Punjab water table falling), chemical run-off, soil degradation, loss of crop diversity. Land Reforms: Zamindari Abolition Acts (1950s) — removed intermediary landlords, gave land rights to tenants. Tenancy Reform Acts — protected tenant farmers from eviction. Land ceiling laws — set maximum land holdings; excess distributed to landless. Results: Zamindari abolition largely successful; land ceilings poorly implemented (landlords circumvented by distributing land among family members). Cooperatives: AMUL (Gujarat milk cooperative) and other models showed that small farmers collectively can achieve economies of scale.",
      worked_example: "NCERT: 'Mention any two benefits and two limitations of the Green Revolution.' — Benefits: (1) India became self-sufficient in food grains — no longer dependent on US wheat imports; (2) farmer incomes in Punjab/Haryana rose significantly. Limitations: (1) Benefited mainly wheat and rice in northwest India — pulses, millets and eastern India largely excluded, widening regional inequality; (2) Environmental costs — groundwater depletion, soil degradation, loss of crop diversity.",
      common_misconceptions: ["The Green Revolution ended hunger in India — it ended mass famine but malnutrition persists because it focused on calories (wheat/rice) not nutrition (pulses/vegetables)", "Land reforms successfully redistributed land equally — land ceiling laws were widely evaded; landlessness persists in Bihar and UP"],
      shortcuts_and_tricks: ["Green Revolution = HYV seeds + irrigation + fertilisers = 1960s–70s, wheat+rice focus", "Benefits: self-sufficiency, income rise. Costs: inequality, environment, crop diversity loss", "Land reforms: zamindari abolished (success); ceilings (largely evaded)"],
      diagram_description: "Graph of India's food grain production 1950–2000 showing Green Revolution impact; map of states most/least affected by Green Revolution; comparison table of pre/post Green Revolution yields; AMUL cooperative model diagram.",
      key_takeaway: "The Green Revolution (1960s–70s) tripled wheat/rice production and ended India's food import dependence, but created regional inequality, neglected coarse grains, and caused environmental damage. Land reforms had mixed success — zamindari abolition worked; land ceilings were widely evaded.",
    },
  },

  // ── CH10: Minerals and Energy Resources ──────────────────────────────────────

  {
    topicId: "sst_ch10_minerals",
    subject: "Social Science", chapterNumber: 10,
    name: "Minerals — Types, Distribution and Mining in India",
    prerequisite_knowledge: ["sst_ch6_types_resources"],
    key_formulas: [
      "Metallic minerals: ferrous (iron, manganese, nickel — magnetic) + non-ferrous (copper, bauxite, gold)",
      "Non-metallic minerals: limestone, mica, gypsum, salt — no metal content",
      "Mineral belt: Jharkhand-Odisha-Chhattisgarh = India's mineral heartland (iron, coal, manganese, bauxite)",
    ],
    teaching_content: {
      intuition: "Minerals are the backbone of industrial civilisation — iron for steel, coal for energy, bauxite for aluminium, copper for wiring, uranium for nuclear power. India has enormous mineral wealth, mostly concentrated in the Chota Nagpur plateau and the Eastern Ghats. This resource wealth has paradoxically made these regions some of India's poorest — because mining displaces tribal communities, destroys ecosystems, and profits often flow elsewhere.",
      process_explanation: "Classification: Metallic minerals contain metals. Ferrous (iron-bearing): Iron ore (Jharkhand, Odisha, Karnataka), Manganese (Odisha, Karnataka). Non-ferrous: Copper (Rajasthan, Jharkhand), Bauxite (Odisha, Jharkhand, Gujarat), Gold (Karnataka — Kolar). Non-metallic minerals have no metallic content: Limestone (widespread — used for cement), Mica (Jharkhand, Rajasthan — used in electronics), Gypsum (Rajasthan — used for plaster, fertiliser). Energy minerals: Coal, Petroleum, Natural Gas, Uranium, Thorium. Distribution in India: The Chota Nagpur Plateau (Jharkhand, Odisha, Chhattisgarh) is India's mineral heartland — iron ore, coal, manganese, copper, bauxite, mica all concentrated here. The Deccan Trap yields manganese and iron. Rajasthan has copper, zinc, emeralds. Mining Problems: Open-cast mining destroys forests and displaces tribal communities. Mine safety is poor — disasters like Chasnala (1975, 372 deaths). Illegal mining is widespread. Conservation: Minerals are non-renewable — once exhausted, gone forever. India must use them efficiently, recycle metals, and diversify to non-mineral energy sources.",
      worked_example: "NCERT: 'Why is Jharkhand called the mineral heartland of India?' — Jharkhand (part of the Chota Nagpur Plateau) contains India's largest reserves of coal (Jharia coalfield), iron ore, copper, bauxite, and mica. The region also has significant manganese and uranium deposits. This concentration of minerals made it the centre of India's heavy industry (Tata Steel at Jamshedpur, SAIL plants), though the tribal populations have often not shared in the wealth generated.",
      common_misconceptions: ["India is poor in mineral resources — India is rich in iron ore, coal, manganese and bauxite; it is relatively poor in copper, gold and petroleum", "Mining always brings development to local areas — resource extraction often causes environmental damage and displacement without proportionate local benefit"],
      shortcuts_and_tricks: ["Metallic: ferrous (Fe — iron, manganese) + non-ferrous (copper, bauxite, gold)", "Non-metallic: limestone, mica, gypsum (no metal)", "Mineral heartland = Jharkhand + Odisha + Chhattisgarh"],
      diagram_description: "Classification tree of minerals (metallic vs non-metallic vs energy); map of India showing major mineral deposits with icons; table of top minerals by state.",
      key_takeaway: "India is rich in ferrous minerals (iron, manganese in Jharkhand-Odisha-Chhattisgarh) and non-metallic minerals (limestone, mica). The Chota Nagpur Plateau is India's mineral heartland. Minerals are non-renewable — conservation and efficient use are essential.",
    },
  },

];

async function main() {
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10_000 });
  console.log("MongoDB connected");

  let created = 0;
  let updated = 0;
  for (const t of TOPICS) {
    const exists = await NcertTopicContent.findOne({ topicId: t.topicId });
    if (exists) { await NcertTopicContent.updateOne({ topicId: t.topicId }, { $set: t }); updated++; }
    else         { await NcertTopicContent.create(t); created++; }
  }

  console.log(`✅ SST Missing Content: ${created} created, ${updated} updated (${TOPICS.length} total)`);
  await mongoose.disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
