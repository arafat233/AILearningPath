import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const TOPICS = [

  // ── Chapter 1: The Rise of Nationalism in Europe ──────────────────────────

  {
    topicId: "sst_ch1_french_revolution",
    subject: "Social Science",
    chapterNumber: 1,
    name: "French Revolution and the Idea of the Nation",
    prerequisite_knowledge: [
      "What is a monarchy and an absolute state",
      "Concept of liberty and equality",
      "What is a constitution",
    ],
    key_formulas: [
      "French Revolution: 1789",
      "Liberty · Equality · Fraternity — motto of the Revolution",
      "Estates General → National Assembly → Constitutional Monarchy → Republic",
      "Napoleon's Civil Code: 1804 — equality before law, abolished feudalism",
    ],
    teaching_content: {
      intuition:
        "Before 1789, most of Europe was divided into kingdoms where the monarch ruled by divine right, and people had no say in laws. The French Revolution was the earthquake that shook this world — it introduced the idea that ordinary people, united as a 'nation', are the true source of power. After 1789, the concept of the 'nation-state' — a country where citizens share a common identity and govern themselves — became the organising idea for all of 19th-century Europe.",
      process_explanation:
        "1. CAUSES: France in 1789 had a bankrupt monarchy, a rigid three-estate system (clergy, nobility, commoners), food shortages, and a Third Estate (98% of population) that paid all taxes but had no power.\n2. THE REVOLUTION: The Third Estate broke away, formed the National Assembly (1789), stormed the Bastille prison (symbol of royal tyranny), and issued the Declaration of the Rights of Man and Citizen — asserting liberty, equality, and popular sovereignty.\n3. KEY IDEAS SPREAD: French armies marched into neighbouring countries carrying revolutionary ideals. Napoleon's Civil Code (1804) abolished feudal privileges, established equality before law, and standardised laws across France and conquered territories.\n4. IMPACT ON EUROPE: Liberalism (individual freedoms), nationalism (loyalty to a nation, not a king), and democracy became the three pillars of the new political age that French Revolution introduced.",
      worked_example:
        "Question: Why is the French Revolution considered the starting point of nationalism in Europe?\nAnswer: Before 1789, people identified with their religion, local ruler, or class. The Revolution introduced the idea that all citizens of France — regardless of class — formed one 'nation' with shared sovereignty. It showed that ordinary people could overthrow a monarchy and create a republic based on reason and law. This idea inspired nationalist movements across Europe (Germany, Italy, Greece) in the 19th century.",
      common_misconceptions: [
        "Napoleon is not the cause of nationalism — he spread revolutionary ideas but later acted as a conqueror, causing nationalist resistance in the countries he invaded (Spain, Germany).",
        "The French Revolution did not instantly create democracy — France went through multiple phases: republic, directory, empire, and again republic before stable democracy.",
        "Nationalism in Europe was not always peaceful — it involved wars, revolutions, and ethnic conflicts throughout the 19th century.",
      ],
      shortcuts_and_tricks: [
        "Dates: Revolution 1789, Civil Code 1804, Congress of Vienna 1815.",
        "The three estates: First = clergy, Second = nobility, Third = everyone else (97-98% of France).",
        "Napoleon's paradox: spread revolution's ideas, but acted as emperor — both spread and contradicted nationalism.",
      ],
      diagram_description:
        "Timeline: 1789 (Revolution begins, Bastille stormed) → 1792 (Republic declared) → 1804 (Napoleon's Civil Code) → 1815 (Napoleon defeated, Congress of Vienna). Below: the three estates pyramid — tiny clergy/nobility at top, massive Third Estate at base.",
      key_takeaway:
        "The French Revolution introduced the idea of the 'nation' as a community of citizens with equal rights. Napoleon's campaigns spread these ideas across Europe, making nationalism the dominant political force of the 19th century.",
    },
  },

  {
    topicId: "sst_ch1_nationalism_europe",
    subject: "Social Science",
    chapterNumber: 1,
    name: "Growth of Nationalism in Europe — Romanticism, Liberal Nationalism",
    prerequisite_knowledge: [
      "What is Romanticism in culture",
      "Meaning of liberalism and conservatism",
      "The concept of ethnic and cultural identity",
    ],
    key_formulas: [
      "Romanticism: cultural movement emphasising emotion, nature, folk traditions, and national identity",
      "Liberal Nationalism: individual freedoms + national self-determination",
      "Zollverein (1834): German customs union — economic unification before political",
      "1848 revolutions: 'Springtime of Nations' across Europe",
    ],
    teaching_content: {
      intuition:
        "Nationalism did not grow only through political revolutions — it was also built through culture. Romantic poets, artists, and musicians created a feeling of shared identity by celebrating folk tales, local languages, and historical myths. At the same time, liberal intellectuals argued that nations — not kings — should govern themselves. Together, cultural nationalism and liberal politics created the 19th-century demand for nation-states.",
      process_explanation:
        "1. CONSERVATISM vs LIBERALISM: After 1815 (Congress of Vienna), conservative powers (Austria, Prussia, Russia) tried to restore the old order — monarchy and aristocracy. But liberal nationalists — educated middle-class (the 'new middle class') — wanted constitutions, representative government, and national self-determination.\n2. ROMANTICISM: Artists like the poet Wordsworth, composer Beethoven, and writer the brothers Grimm (fairy tales) created cultural works that celebrated folk identity, language, and history — building emotional attachment to the idea of a 'nation' before political boundaries existed.\n3. ROLE OF LANGUAGE: Greek nationalist movement used ancient Greek heritage. German nationalists standardised the German language. Language became the key marker of national identity.\n4. 1848 REVOLUTIONS: A wave of liberal-nationalist revolutions swept Europe — France, Austria, German states, Hungary, Italy. Mostly suppressed, but they planted seeds for later unifications.",
      worked_example:
        "Question: What was the role of the educated middle class in the growth of nationalism?\nAnswer: The educated middle class — lawyers, professionals, teachers — were the main carriers of liberal-nationalist ideas. They read newspapers, formed secret societies (like Mazzini's 'Young Italy'), wrote political tracts, and participated in revolutions. Unlike the aristocracy (who benefited from old order) or the peasantry (who lacked political awareness), the middle class had both the motive (wanted political rights) and the means (education, communication) to spread nationalist ideas.",
      common_misconceptions: [
        "Romanticism was not backward-looking — it used cultural pride in the past (folk tales, history) to build a sense of national identity for the future.",
        "The 1848 revolutions failed politically in the short term but succeeded ideologically — after 1848, no European government could ignore nationalist demands.",
        "Nationalism in this period was liberal — it was about freedom and self-determination, not aggressive expansion (that came later in the late 19th century).",
      ],
      shortcuts_and_tricks: [
        "GCSE shortcut: Romanticism → Culture → Nation. Liberalism → Politics → Nation. Both built nationalism from different directions.",
        "Zollverein 1834 = German economic union before political union. Economics first, politics second.",
        "1848 = the year of revolutions across Europe. Important year to memorise.",
      ],
      diagram_description:
        "Two-column diagram: Left = 'Paths to Nationalism'. Column 1: Cultural path — Romanticism, folk tales, language, music → emotional national identity. Column 2: Political path — Liberalism, constitutions, 1848 revolutions → political national identity. Both arrows converge at 'Nation-State'.",
      key_takeaway:
        "Nationalism in Europe grew through both cultural channels (Romanticism, language, folk traditions) and political channels (liberalism, revolutions). The educated middle class was its main driver, and the 1848 revolutions marked the high point of liberal nationalism.",
    },
  },

  {
    topicId: "sst_ch1_german_unification",
    subject: "Social Science",
    chapterNumber: 1,
    name: "Unification of Germany and Italy",
    prerequisite_knowledge: [
      "Germany and Italy were not unified countries in the early 19th century",
      "What is a confederation of states",
      "Role of a powerful state in unifying smaller states",
    ],
    key_formulas: [
      "German Unification: 1866–1871, led by Otto von Bismarck (Prussia)",
      "Italian Unification (Risorgimento): 1859–1871, led by Cavour (politician) + Garibaldi (soldier)",
      "Bismarck's method: 'Blood and Iron' — wars not revolutions",
      "German Empire proclaimed: January 18, 1871, Hall of Mirrors, Versailles",
    ],
    teaching_content: {
      intuition:
        "While ordinary people dreamed of national unity, it took hard-nosed politicians and military power to actually create the nation-states of Germany and Italy. Bismarck's genius was to use diplomacy and wars strategically to unite 39 German states under Prussian leadership. Italy's unification was messier — combining Cavour's diplomacy, Garibaldi's military campaigns, and the slow absorption of papal territories. Both show that nationalism in practice required both popular sentiment AND state power.",
      process_explanation:
        "GERMAN UNIFICATION:\n1. Prussia, led by Kaiser Wilhelm I and Chancellor Otto von Bismarck, was the dominant German state.\n2. Bismarck's strategy: 'Blood and Iron' — use military strength and strategic diplomacy, not liberal idealism.\n3. Three wars: with Denmark (1864), Austria (1866 — Prussia won, excluding Austria from German affairs), and France (1870-71 — Franco-Prussian War, decisive victory).\n4. After the Franco-Prussian War, German princes proclaimed Kaiser Wilhelm I as German Emperor at Versailles (1871).\nITALIAN UNIFICATION:\n1. Count Cavour (Piedmont's PM) used diplomacy and alliance with France to fight Austria.\n2. Garibaldi led volunteer 'Red Shirts' and conquered southern Italy (Kingdom of Two Sicilies, 1860).\n3. Victor Emmanuel II became king of united Italy (1861). Rome was finally added in 1871.\n4. Key difference from Germany: Italy's unification involved both elite diplomacy (Cavour) and popular military campaigns (Garibaldi).",
      worked_example:
        "Question: Compare Bismarck and Garibaldi's approaches to unification.\nBismarck: Top-down, state-led, military and diplomatic. Used wars with Denmark, Austria, France. 'Blood and Iron' — no room for revolutionary idealism. Unification imposed by Prussian state power.\nGaribaldi: Bottom-up, popular, military volunteer campaign. Led 1,000 Red Shirts from Sicily northward. Represented the romantic nationalist tradition. But ultimately handed power to King Victor Emmanuel — showing that popular movements needed state support to succeed.",
      common_misconceptions: [
        "Germany was not unified 'voluntarily' — Bismarck used wars and manipulation to force states into the Prussian-led empire.",
        "Garibaldi was not a politician — he was a military hero who handed his conquests to the king. Cavour was the political mind behind Italian unification.",
        "1871 did not end national questions in Europe — minorities (Poles in Germany, Czechs in Austria, Irish in Britain) remained without their own nation-states.",
      ],
      shortcuts_and_tricks: [
        "Three B's for Germany: Bismarck + Blood and Iron + 1871.",
        "Three C's for Italy: Cavour (politics) + Count Victor Emmanuel (crown) + Crusade of Garibaldi (people).",
        "Both unifications completed in 1871 — same year, different methods.",
      ],
      diagram_description:
        "Split diagram. Left (Germany): Map of 39 states → Prussia expands after 3 wars (Denmark, Austria, France) → German Empire 1871. Right (Italy): Map of peninsula → Piedmont + Garibaldi's southern campaign → United Italy 1871. Bottom: contrast table: Bismarck (top-down, wars) vs Garibaldi (bottom-up, people).",
      key_takeaway:
        "Germany unified through Bismarck's 'Blood and Iron' strategy using wars. Italy unified through a combination of Cavour's diplomacy and Garibaldi's popular military campaign. Both unifications completed in 1871, transforming the European map.",
    },
  },

  // ── Chapter 2: Nationalism in India ──────────────────────────────────────

  {
    topicId: "sst_ch2_non_cooperation",
    subject: "Social Science",
    chapterNumber: 2,
    name: "Non-Cooperation Movement (1920–22)",
    prerequisite_knowledge: [
      "What is the Indian National Congress",
      "The role of Mahatma Gandhi in the freedom struggle",
      "What is civil disobedience and non-violence",
    ],
    key_formulas: [
      "Non-Cooperation Movement launched: 1920 (after Jallianwala Bagh 1919, Khilafat issue)",
      "Rowlatt Act 1919: allowed detention without trial",
      "Jallianwala Bagh Massacre: April 13, 1919",
      "Chauri Chaura incident: February 1922 — Gandhi called off movement",
    ],
    teaching_content: {
      intuition:
        "After World War I, Indians expected the British to grant self-rule as a reward for their wartime support (1.5 million soldiers). Instead, the British passed the Rowlatt Act (1919) — allowing arrest without trial — and then opened fire on a peaceful crowd at Jallianwala Bagh, killing 379+ people. Gandhi's response was to launch the Non-Cooperation Movement: refuse to cooperate with British rule at every level — boycott schools, courts, government jobs, foreign cloth. The power of the movement was in its scale and non-violence.",
      process_explanation:
        "1. CAUSES: Jallianwala Bagh massacre (April 1919), Rowlatt Act, Khilafat issue (concern about Ottoman Caliphate after WWI), broken post-war promises.\n2. GANDHI'S METHOD: Non-violent non-cooperation — withdraw from British institutions. Lawyers quit courts, students quit schools, people returned British titles and honours.\n3. PROGRAMME: Boycott of British goods → swadeshi (Indian-made goods). Khadi promotion. Return of medals/titles. Non-payment of taxes in some regions.\n4. SPREAD: The movement united Hindus and Muslims (Khilafat issue), peasants (no-tax campaign), workers, students, and women — making it a truly mass movement for the first time.\n5. END: In February 1922, a crowd in Chauri Chaura (UP) attacked and burned a police station, killing 22 policemen. Gandhi called off the movement — he believed non-violence was not yet deeply rooted enough.",
      worked_example:
        "Question: Why did Gandhi call off the Non-Cooperation Movement after Chauri Chaura?\nAnswer: Gandhi believed that a movement for independence must be built on moral foundations — non-violence was non-negotiable. The Chauri Chaura violence showed that the masses were not yet disciplined enough in non-violence. Gandhi feared that allowing the movement to continue after this incident would legitimise violence and undermine the moral authority that made the movement powerful. He felt it was better to pause, build discipline, and resume from a stronger foundation.",
      common_misconceptions: [
        "The Non-Cooperation Movement was not a failure just because Gandhi called it off — it had already forced the British to take Indian opinion seriously and had mobilised millions of Indians into political participation for the first time.",
        "The Khilafat issue was primarily about Muslim concern for the Ottoman Caliphate, not a Hindu-Muslim conflict — Gandhi used it to unite the two communities against British rule.",
        "Gandhi called off the movement himself — the British did not suppress it into ending.",
      ],
      shortcuts_and_tricks: [
        "Sequence: Rowlatt Act 1919 → Jallianwala Bagh 1919 → NCM launched 1920 → Chauri Chaura 1922 → NCM withdrawn.",
        "NCM = boycott + return honours + khadi + Khilafat unity.",
        "Chauri Chaura = the violence that ended NCM. Chauri Chaura is in Gorakhpur, UP.",
      ],
      diagram_description:
        "Timeline arrow: 1919 (Rowlatt Act → Jallianwala Bagh massacre) → 1920 (NCM launched, Hindu-Muslim unity) → 1922 (Chauri Chaura → Gandhi calls off). Below: program box: boycott courts, schools, foreign cloth, honours; promote khadi, Hindu-Muslim unity.",
      key_takeaway:
        "The Non-Cooperation Movement (1920-22) was the first truly mass nationalist movement in India, uniting Hindus, Muslims, peasants, and workers. Gandhi called it off after Chauri Chaura violence, demonstrating his conviction that means (non-violence) matter as much as ends (independence).",
    },
  },

  {
    topicId: "sst_ch2_civil_disobedience",
    subject: "Social Science",
    chapterNumber: 2,
    name: "Civil Disobedience Movement and Salt March (1930–34)",
    prerequisite_knowledge: [
      "What is civil disobedience",
      "Background of Non-Cooperation Movement",
      "The Simon Commission and its boycott",
    ],
    key_formulas: [
      "Salt March (Dandi March): March 12 – April 6, 1930",
      "240 miles from Sabarmati Ashram to Dandi (Navsari, Gujarat)",
      "Gandhi with 78 volunteers — broke salt law on April 6, 1930",
      "Gandhi-Irwin Pact: March 1931 — CDM temporarily suspended",
    ],
    teaching_content: {
      intuition:
        "By 1930, the Congress had demanded 'Purna Swaraj' (complete independence) — not just dominion status. Gandhi's genius was choosing salt to start the Civil Disobedience Movement. Salt was consumed by every Indian regardless of class or religion. The British had a monopoly on salt production and taxed it heavily. By making and selling salt illegally, Gandhi made the colonial law itself seem unjust — and invited Indians of all backgrounds to break it openly, non-violently, accepting arrest.",
      process_explanation:
        "1. BACKGROUND: Simon Commission (1927) — all-white commission to review India's constitution — boycotted by Indians. Lahore Congress (1929): Purna Swaraj declared as goal.\n2. THE SALT MARCH (DANDI MARCH): March 12, 1930 — Gandhi and 78 volunteers marched 240 miles from Sabarmati (Ahmedabad) to Dandi coast. On April 6, Gandhi made salt from seawater, breaking the salt law. The act sparked nationwide civil disobedience.\n3. CDM PROGRAMME: Refuse to pay taxes. Boycott British goods and cloth. Picket liquor shops. Violate forest laws (tribal areas). Women participated massively for the first time.\n4. BRITISH RESPONSE: Mass arrests (Gandhi arrested). But repression only spread the movement.\n5. GANDHI-IRWIN PACT (March 1931): CDM temporarily suspended. Congress agreed to attend Round Table Conference. British released political prisoners. Salt could be made along the coast.\n6. SECOND PHASE (1932): After Round Table Conference failed, CDM resumed. British responded with Communal Award — triggered Poona Pact between Gandhi and Ambedkar on Dalit representation.",
      worked_example:
        "Question: Why did Gandhi choose salt to launch the Civil Disobedience Movement?\nAnswer: Salt was used by every Indian — rich or poor, Hindu or Muslim, urban or rural. It was a basic necessity that the British had monopolised and taxed under the Salt Laws. By choosing salt, Gandhi ensured:\n1. Universal participation — everyone felt the injustice.\n2. Symbolic power — making salt from the sea was a simple act of defiance that even a poor illiterate farmer could perform.\n3. Legal clarity — breaking the salt law was unambiguously illegal, making mass arrests politically embarrassing for the British.\nNo other issue could have united such a diverse population.",
      common_misconceptions: [
        "The Gandhi-Irwin Pact was not a final settlement — it was a temporary pause, not the end of the freedom struggle.",
        "The Civil Disobedience Movement was not limited to salt — it included forest law violations, no-tax campaigns, and boycotts. Salt was just the trigger.",
        "Poona Pact (1932) did NOT abolish separate electorates for Dalits — it increased their reserved seats within the general Hindu electorate, as a compromise between Gandhi (who fasted against separate electorates) and Ambedkar.",
      ],
      shortcuts_and_tricks: [
        "Salt March dates: starts March 12, reaches Dandi April 6 = 25 days, 240 miles.",
        "CDM timeline: 1930 (start) → 1931 (Gandhi-Irwin Pact) → 1932 (resumed) → Poona Pact → 1934 (formally suspended).",
        "Difference: NCM (1920) = boycott. CDM (1930) = active law-breaking. Both non-violent.",
      ],
      diagram_description:
        "Map of Gujarat: Sabarmati Ashram → Dandi (240 miles). Below: CDM programme box: break salt laws, boycott cloth, picket liquor, women's participation. Right side: timeline 1930-1934 with key events.",
      key_takeaway:
        "The Civil Disobedience Movement began with Gandhi's 240-mile Salt March to Dandi (1930), chose salt as a universal symbol of colonial injustice, and saw mass participation including women. The Gandhi-Irwin Pact and Poona Pact were significant negotiations during the movement.",
    },
  },

  {
    topicId: "sst_ch2_quit_india",
    subject: "Social Science",
    chapterNumber: 2,
    name: "Quit India Movement 1942 and the Sense of Collective Belonging",
    prerequisite_knowledge: [
      "World War II and India's role",
      "Cripps Mission 1942",
      "What was the Congress Working Committee's position on WWII",
    ],
    key_formulas: [
      "Quit India Movement: August 8-9, 1942",
      "Gandhi's slogan: 'Do or Die' (Karenge ya Marenge)",
      "Cripps Mission failure: April 1942",
      "August Kranti: the Quit India revolt — August 9, 1942 onwards",
    ],
    teaching_content: {
      intuition:
        "By 1942, WWII was going badly for the Allies — Singapore had fallen, Japan was advancing on India's borders. The British needed Indian cooperation but refused to promise independence. Gandhi's response was the most direct yet: 'Quit India' — an immediate demand for British withdrawal. The movement's slogan 'Do or Die' captured the urgency. When Gandhi and all Congress leaders were arrested on August 9, 1942, the movement became leaderless but continued — through strikes, sabotage, and underground networks. It showed the British that India could not be governed against its will.",
      process_explanation:
        "1. BACKGROUND: WWII, Japan's threat to India, Cripps Mission failure (Cripps offered dominion status after the war — Congress rejected as insufficient).\n2. LAUNCH: Congress passed Quit India Resolution at Bombay (August 8, 1942). Gandhi gave 'Do or Die' speech at Gowalia Tank Maidan.\n3. MASS ARRESTS: August 9 — Gandhi, Nehru, Patel, and all Congress leaders arrested at 4 AM. Congress declared illegal.\n4. SPONTANEOUS REVOLT: Without leaders, ordinary Indians took over — students, workers, peasants. Sabotage of railways, telegraph lines, government buildings. Underground governments in some areas (Ballia, Satara, Midnapore).\n5. BRITISH RESPONSE: Brutal repression — 100,000 arrested, 1,000+ killed, villages bombed. But movement showed Indians' determination.\n6. SENSE OF COLLECTIVE BELONGING: The chapter ends with how nationalism created a sense of collective identity through: flags, songs, maps, folk tales — symbols that united diverse Indians into one imagined community.",
      worked_example:
        "Question: How did the Quit India Movement demonstrate that mass movements could survive without central leadership?\nAnswer: All Congress leaders were arrested on August 9, 1942. Yet the movement continued for months through spontaneous, leaderless action. Students paralysed universities. Workers struck factories. In Ballia (UP), Satara (Maharashtra), and Midnapore (Bengal), 'parallel governments' briefly operated. Underground radio stations and pamphlets kept the movement alive. This demonstrated that by 1942, Indian nationalism had penetrated so deeply into the masses that it did not depend on any individual leader — it had become truly popular.",
      common_misconceptions: [
        "The Quit India Movement was not an immediate success — the British suppressed it within months. But it demonstrated Indian resolve and accelerated post-war British withdrawal.",
        "Gandhi did not want violence — the slogan 'Do or Die' meant commit fully to non-violent resistance or die trying, not kill the British.",
        "The sense of collective belonging described at the chapter's end was built gradually — through imagery, songs, festivals, and leaders who bridged regional differences.",
      ],
      shortcuts_and_tricks: [
        "1942 = the year of 3 events: Cripps Mission failure → Quit India → Japanese threat to India's borders.",
        "August 9 = 'August Kranti Diwas' — still observed in India.",
        "'Do or Die' = Gandhi. Leaderless spontaneous revolt = unique feature of QIM.",
      ],
      diagram_description:
        "Timeline: 1942 (Cripps Mission April → Quit India Resolution August 8 → Mass arrests August 9 → Spontaneous revolt). Box below: unique features of QIM: leaderless, women/youth leading, parallel govts, underground resistance.",
      key_takeaway:
        "Quit India Movement (1942) was Gandhi's most radical demand — immediate British withdrawal. When all leaders were arrested, ordinary Indians continued the revolt spontaneously — demonstrating that Indian nationalism had become a truly mass force.",
    },
  },

  // ── Chapter 3: The Making of a Global World ───────────────────────────────

  {
    topicId: "sst_ch3_print_culture",
    subject: "Social Science",
    chapterNumber: 3,
    name: "Print Culture and Nationalism",
    prerequisite_knowledge: [
      "What is the printing press and who invented it",
      "How books spread ideas in history",
      "Relationship between literacy and political awareness",
    ],
    key_formulas: [
      "Gutenberg's printing press: c. 1450, Europe",
      "First book printed: Bible (Gutenberg Bible, 1450s)",
      "Print capitalism (Benedict Anderson): print languages created 'imagined communities'",
      "India: first printing press brought by Portuguese missionaries, Goa, 1556",
    ],
    teaching_content: {
      intuition:
        "Before the printing press, knowledge was controlled by the Church and the elite who could afford hand-copied manuscripts. Gutenberg's press (c.1450) changed everything — suddenly, the same book could be read by thousands simultaneously across different regions. When people read the same language, the same news, the same ideas, they start to imagine themselves as part of one community — a nation. This is what historian Benedict Anderson meant by 'imagined community': nationalism was built in the minds of readers through print.",
      process_explanation:
        "1. GUTENBERG'S PRESS (1450s): Movable type printing revolution. First printed Bible. Books became affordable — from manuscripts costing as much as a farm to printed books anyone could buy.\n2. PRINT AND REFORMATION: Martin Luther's 95 Theses (1517) spread across Germany in weeks through print — sparking the Protestant Reformation. Print made it impossible for the Church to control ideas.\n3. PRINT CAPITALISM (Benedict Anderson): Print created a unified 'print language' (e.g., High German, standard French). People who spoke different dialects could read the same newspapers and novels — imagining themselves as part of one national community.\n4. INDIA: Portuguese missionaries introduced print at Goa (1556). First Malayalam and Tamil books. Newspapers in Bengali, Marathi, Urdu, English spread nationalist ideas in 19th century.\n5. VERNACULAR PRESS: Newspapers in Indian languages reached the masses. Bal Gangadhar Tilak's Kesari (Marathi) and Maharatta (English) spread nationalist ideas. Press Act 1878 tried to suppress vernacular newspapers.",
      worked_example:
        "Question: How did print culture contribute to the growth of nationalism in India?\nAnswer: Print culture contributed to Indian nationalism in three ways:\n1. Information spread: Newspapers reported colonial policies, famines, and political events — creating shared grievances across the country.\n2. Common language: Newspapers standardised regional languages (Hindi, Bengali, Tamil) creating a larger reading community.\n3. Debates and reform: Journals debated social reform (caste, women's education) and political questions — creating an informed public that was a prerequisite for mass nationalism.\nTilak's Kesari, Ambedkar's Mooknayak, and Gandhis' Harijan became tools of political mobilisation through print.",
      common_misconceptions: [
        "The printing press did not immediately create nationalism — it created the conditions for it by spreading ideas and creating larger reading communities. Nationalism was built over centuries.",
        "Print did not only spread liberal/progressive ideas — it also spread superstition, propaganda, and communal ideas (anti-Semitic texts in Europe, communal pamphlets in India).",
        "Vernacular press in India was not just political — it also spread social reform, religious debates, and literary culture.",
      ],
      shortcuts_and_tricks: [
        "Gutenberg → printing → affordable books → spread of ideas → Reformation → Nationalism.",
        "Benedict Anderson's key idea: 'imagined community' — nationalism is imagined through shared print language.",
        "India's press history: Goa 1556 (Portuguese missionaries) → Vernacular Press Act 1878 → nationalist newspapers late 19th century.",
      ],
      diagram_description:
        "Flow diagram: Gutenberg press (1450) → cheap books → common print language → readers imagine shared community → 'Imagined Community' / Nation. India branch: 1556 Goa → vernacular newspapers → mass political awareness → nationalist movement.",
      key_takeaway:
        "Print culture (the printing press and mass-produced books/newspapers) created 'imagined communities' — people who had never met each other identified as part of the same nation by reading the same language. In India, the vernacular press was crucial for spreading nationalist ideas.",
    },
  },

  {
    topicId: "sst_ch3_novel",
    subject: "Social Science",
    chapterNumber: 3,
    name: "The Novel and Modern Society",
    prerequisite_knowledge: [
      "What is a novel as a literary form",
      "Difference between novel and earlier literary forms (epic, poetry, drama)",
      "What is realism in literature",
    ],
    key_formulas: [
      "Novel: emerged in Europe from 18th century, became dominant form in 19th century",
      "Key features: realistic portrayal, ordinary protagonists, private interiority, social commentary",
      "India: first novels in regional languages — Bengali (Bankim Chandra), Tamil (Veerasalingam), Marathi",
      "Women readers and writers: novel created a new literary space for women",
    ],
    teaching_content: {
      intuition:
        "The epic told stories of gods and heroes. The novel told stories of ordinary people in recognisable everyday settings. This was revolutionary — for the first time, literature said: the life of a middle-class woman, a merchant, a factory worker is worth reading about. Novels also created a new kind of reading — private, individual, immersive. A woman reading a novel alone in her room was experiencing an interiority that earlier literature didn't offer. In India, novels became vehicles for social reform and national identity.",
      process_explanation:
        "1. RISE OF THE NOVEL: 18th century England — Daniel Defoe (Robinson Crusoe), Samuel Richardson (Pamela). 19th century: Charles Dickens (Oliver Twist, working-class life), Jane Austen (middle-class women), Thomas Hardy (rural communities).\n2. NOVEL AND SOCIETY: Novels depicted social problems — poverty, gender inequality, colonialism. Readers empathised with fictional characters, developing social consciousness.\n3. NOVEL IN INDIA:\n- Bengal: Bankim Chandra Chattopadhyay (Rajmohan's Wife — first English-language Indian novel). Later wrote Anandamath (contains Vande Mataram).\n- Tamil: Veerasalingam Pantulu's Rajasekhara Charita (inspired by Oliver Goldsmith).\n- Marathi novels addressed caste and women's issues.\n4. WOMEN IN NOVELS: Novels gave women a new cultural space — as characters with interiority and as readers. The 'new woman' in Indian novels debated tradition and modernity.\n5. NATIONALISM: Novels in regional languages built emotional identification with the Indian nation — before political nationalism, cultural nationalism through literature.",
      worked_example:
        "Question: How did Indian novels contribute to both social reform and nationalism?\nAnswer: Indian novels of the late 19th-early 20th century served two linked purposes:\n1. Social reform: Novels depicted caste discrimination, women's plight, and colonial exploitation in realistic terms. Readers recognised these social evils and demanded change. Example: Premchand's Godan depicted agricultural poverty and caste oppression in UP.\n2. Nationalism: Novels in regional languages (Bengali, Tamil, Marathi, Hindi) created emotional identification with the region and the nation. Bankim's Anandamath with 'Vande Mataram' directly linked literary culture to nationalist politics.\nBoth functions used realistic portrayal of everyday Indian life to build critical and patriotic consciousness.",
      common_misconceptions: [
        "The novel was not a purely Western form imposed on India — Indian writers adapted it to local concerns (caste, colonial rule, religious identity) and created a distinctly Indian novelistic tradition.",
        "Not all Indian novels were nationalist or reform-minded — many were entertainment, romance, or detective fiction, just like Western novels.",
        "Women writers in India were not simply imitating European models — Rokeya Sakhawat Hossain (Sultana's Dream, 1905) wrote feminist science fiction in Bengali decades before many Western equivalents.",
      ],
      shortcuts_and_tricks: [
        "Novel's key innovation: ordinary protagonist + everyday setting + social realism + private interiority.",
        "India's first novelists: Bankim Chandra (Bengal), Veerasalingam (Tamil), Premchand (Hindi-Urdu).",
        "Novel vs Epic: Epic = gods/heroes/extraordinary; Novel = ordinary people/social reality.",
      ],
      diagram_description:
        "Two-column comparison: Epic (gods, heroes, verse, public performance) vs Novel (ordinary people, prose, private reading, social realism). India timeline: 1860s (Bankim's first novels) → 1880s-1900s (regional language novels) → early 20th century (Premchand, social realist novels).",
      key_takeaway:
        "The novel, with its realistic portrayal of ordinary life, became a powerful vehicle for social reform and nationalism in India. Indian novels in regional languages built both cultural identity and critical consciousness about colonial rule and social inequality.",
    },
  },

  // ── Chapter 4: The Age of Industrialisation ───────────────────────────────

  {
    topicId: "sst_ch4_industrialisation",
    subject: "Social Science",
    chapterNumber: 4,
    name: "The Age of Industrialisation — Britain and India",
    prerequisite_knowledge: [
      "What is the Industrial Revolution",
      "Difference between pre-industrial and industrial production",
      "India as a colonial economy",
    ],
    key_formulas: [
      "Proto-industrialisation: rural domestic production before factories (merchants + peasants)",
      "First Industrial Revolution: Britain, 1780s-1850s — cotton, steam, iron",
      "First mill in India: 1854, Bombay (cotton)"; actually: Bombay Spinning and Weaving Company 1851",
      "Swadeshi movement boosted Indian industry — boycott of Manchester cloth",
    ],
    teaching_content: {
      intuition:
        "Industrialisation was not a sudden event — it emerged from centuries of merchant-driven 'proto-industrialisation' where merchants put out raw materials to rural workers who produced cloth or metal goods at home. The factory system then centralised this production. In Britain, industrialisation created enormous wealth but also child labour, urban poverty, and brutal working conditions. In colonial India, industrialisation was shaped by Britain's needs — India was kept as a supplier of raw materials and a buyer of British manufactures, deliberately preventing Indian industry from competing.",
      process_explanation:
        "1. PROTO-INDUSTRIALISATION: Before factories, merchants gave raw wool/cotton to rural artisans who spun/wove it at home. This 'putting-out system' was international — merchants in staple towns, weavers in countryside.\n2. INDUSTRIAL REVOLUTION (Britain, 1780s-): New technologies: spinning jenny, power loom, steam engine. Factories in Manchester, Birmingham, Sheffield. Railways connected markets.\n3. IMPACT IN BRITAIN: Child labour, long hours, factory towns, urban slums (as depicted in Dickens' novels). But also rising productivity and eventually middle-class prosperity.\n4. INDUSTRIALISATION IN INDIA:\n- Under British rule, India's traditional industries (cotton textiles, iron) declined due to cheap British imports.\n- First cotton mills: Bombay 1854, Ahmedabad 1859. Jute mills in Bengal (1855+). Iron/steel: TISCO founded 1907 by Jamshedji Tata.\n- Indian mills faced competition from British mills and had limited access to capital and technology.\n5. COLONIAL CONSTRAINT: India was not allowed to develop a fully industrial economy — import duties favored British goods, Indian textiles lost world markets, and India remained primarily agricultural.",
      worked_example:
        "Question: Why did traditional Indian textile industry decline during British rule?\nAnswer: The decline had multiple causes:\n1. Import of cheap machine-made British cloth: Manchester and Lancashire mills produced cotton textiles 10-20x cheaper than Indian handwoven cloth using power looms.\n2. Loss of royal patronage: Pre-colonial courts (Mughal, Maratha) patronised fine textiles. Under British rule, this patronage disappeared.\n3. Loss of export markets: Indian muslin had been exported to Europe and Southeast Asia. British competition ended these exports.\n4. Deliberate policy: Britain imposed high tariffs on Indian cloth exports while keeping Indian import duties low — structural disadvantage.\nResult: Traditional weavers were impoverished, leading to widespread rural distress.",
      common_misconceptions: [
        "Industrialisation in Britain was not clean or progressive — it involved child labour, 14-hour workdays, dangerous conditions, and created massive inequality before it raised living standards.",
        "India did not have no industry before British rule — it had sophisticated pre-industrial production (finest muslins, Wootz steel). British policy destroyed these industries, it did not civilise a 'backward' economy.",
        "Indian industrialists (Tata, Birla) were not entirely blocked — they could industrialise in some sectors (iron, textiles) but faced structural constraints from colonial policies.",
      ],
      shortcuts_and_tricks: [
        "Proto-industrialisation: merchant + peasant + home production. Before factories.",
        "India's industry milestones: 1854 (first Bombay cotton mill), 1855 (Bengal jute), 1907 (TISCO = Tata Iron and Steel).",
        "Colonial economic policy: India = raw material supplier + British goods buyer. Industry deliberately constrained.",
      ],
      diagram_description:
        "Two timelines side by side. Britain: 1760s (proto-industry) → 1780s-1850s (Industrial Revolution — cotton, steam) → 1850s+ (factories, railways, empire). India: pre-1800 (sophisticated handloom, crafts) → 1800-1850 (decline under British imports) → 1854+ (first Indian mills, slow industrialisation).",
      key_takeaway:
        "Industrialisation transformed Britain into a factory economy, but in India it was shaped by colonial constraints — traditional industries declined under British competition while Indian factory industry grew slowly and in limited sectors. The colonial economy kept India as a supplier of raw materials.",
    },
  },

  {
    topicId: "sst_ch4_working_conditions",
    subject: "Social Science",
    chapterNumber: 4,
    name: "Working Conditions in Factories — 19th Century Britain and India",
    prerequisite_knowledge: [
      "What is a trade union",
      "Child labour and factory conditions in early industrialisation",
      "What is a strike",
    ],
    key_formulas: [
      "Child Labour Act (UK): 1833 — no children under 9 in textile factories",
      "Factory Act (UK): 1833 — limited working hours for children",
      "Factory Commission 1908 (India): investigated conditions in Indian factories",
      "Jobbers: labour contractors who recruited workers from villages for Indian mills",
    ],
    teaching_content: {
      intuition:
        "Early factories were dangerous, unhealthy, and exploitative — children as young as 5 worked 12-14 hour days in coal mines and textile mills in Britain. In India, the factory system emerged in a colonial context where workers had even fewer protections. Understanding working conditions in early industrialisation is understanding the price that ordinary workers paid for the 'great transformation' of the industrial economy.",
      process_explanation:
        "1. BRITISH FACTORIES: Workers (including women and children) worked 12-16 hours in dangerous conditions. Coal mines used children as 'trappers' (opening/closing ventilation doors). Textile mills had flying cotton dust causing lung disease. Accidents common with unguarded machinery.\n2. REFORM MOVEMENT: Social reformers, journalists (investigative reports), and workers themselves organised to demand change. Factory Acts (1833, 1847) gradually limited child labour and working hours.\n3. TRADE UNIONS: Workers organised into unions to collectively bargain for better wages and conditions. Chartist movement (1830s-40s) demanded political rights alongside economic ones.\n4. INDIA — FACTORY CONDITIONS:\n- Bombay and Calcutta mills: 12+ hour shifts, dangerous machinery, poor ventilation.\n- Workers recruited through 'jobbers' — labour contractors from villages who also lent money to workers, creating dependency.\n- Indian Factory Act 1881 (reformed 1891): limited hours for women and children — but poorly enforced.\n5. RESISTANCE: Indian mill workers organised strikes (Bombay textile strikes 1919, 1928). Trade unions grew, eventually forming AITUC (All India Trade Union Congress) 1920.",
      worked_example:
        "Question: What was the role of the 'jobber' in recruiting industrial labour in India?\nAnswer: The jobber (also called 'maistry' or 'sirdar') was a labour contractor who served as intermediary between mill owners and workers:\n1. Recruitment: jobbers went to villages and recruited workers, often from their own caste or village network, building a reliable labour supply.\n2. Control: once in the city, workers depended on jobbers for accommodation, loans, and help with urban life. This dependency gave jobbers enormous power.\n3. Problems: jobbers charged commission, manipulated wages, and could deny workers jobs if they disobeyed. The system created a layer of exploitation between factory owners and workers.\nThe jobber system persisted because factory owners found it cheap and efficient — they outsourced labour management entirely.",
      common_misconceptions: [
        "Working conditions were not uniformly terrible forever — reform Acts, union organising, and public pressure gradually improved them. But this took decades of struggle.",
        "Women and children were not employed in factories as a temporary measure — owners deliberately preferred them because they could be paid less and were easier to control. Reform laws had to specifically ban their exploitation.",
        "Indian factory workers were not passive — they organised strikes, walked off jobs, and formed unions despite colonial restrictions on labour organisation.",
      ],
      shortcuts_and_tricks: [
        "Jobber = Indian labour contractor. Recruits from villages, controls urban workers through debt and dependency.",
        "British factory reform timeline: 1833 (Factory Act — children), 1847 (10-hours Act — women), gradually extended to all workers.",
        "AITUC 1920 = India's first national trade union congress, founded during Non-Cooperation Movement period.",
      ],
      diagram_description:
        "Worker life diagram: Village → Jobber → City factory → Long hours, dangerous conditions, debt to jobber. Reform path: Social reformers → Factory Acts (UK 1833, India 1881) → Unions (AITUC 1920) → Gradually improved conditions.",
      key_takeaway:
        "Early industrialisation subjected workers to dangerous conditions and long hours. In Britain, reform movements and Factory Acts gradually improved conditions. In India, the 'jobber' system added another layer of exploitation, and workers organised through strikes and trade unions (AITUC 1920) to demand rights.",
    },
  },

  // ── Chapter 5: Print Culture and the Modern World ─────────────────────────
  // (Note: The NCERT chapter 5 is "Print Culture and the Modern World")

  {
    topicId: "sst_ch5_urbanisation",
    subject: "Social Science",
    chapterNumber: 5,
    name: "Urbanisation — Growth of Cities in 19th–20th Century",
    prerequisite_knowledge: [
      "What is urbanisation",
      "Push and pull factors of migration",
      "Industrial Revolution and its effects on population distribution",
    ],
    key_formulas: [
      "Urbanisation = population shift from rural to urban areas",
      "London 1750: ~675,000; London 1850: ~2.5 million; London 1900: ~6.5 million",
      "Tenements: overcrowded cheap housing for the urban poor",
      "City of Bombay: grew from trading post to major industrial port city under British rule",
    ],
    teaching_content: {
      intuition:
        "Before industrialisation, most people lived in villages and small towns. The industrial city was a genuinely new phenomenon — millions crowded into areas that had been fields and forests a generation earlier. London's population tripled in a century. This rapid growth created both wealth and misery: wealthy neighbourhoods with parks and grand buildings alongside slums with no sanitation, overcrowding, and disease. Understanding how cities grew — who lived where, who controlled space, and how urban life shaped politics — is essential to understanding modern history.",
      process_explanation:
        "1. CAUSES OF URBANISATION: Enclosure movement (peasants lost common land, moved to cities), agricultural mechanisation (less farm labour needed), factory employment (pull factor), transport revolution (railways connected city to countryside).\n2. LONDON'S GROWTH: From 675,000 (1750) to 6.5 million (1900). Class divisions in space: West End (wealthy), East End (poor workers). Suburbs emerged as middle class sought escape from city centre.\n3. URBAN PROBLEMS: Overcrowding, disease (cholera epidemics), lack of sanitation, crime, child mortality. Edwin Chadwick's Report (1842) documented urban poverty. Public health movements led to sewers, clean water, public parks.\n4. BOMBAY UNDER BRITISH RULE:\n- Bombay (Mumbai) grew from a group of 7 islands to a major port city.\n- Colonial segregation: Europeans in South Bombay (Fort area), Indian merchants nearby, workers in mill districts (Parel, Girgaum).\n- 1854-1920s: Cotton mills created an industrial working class in Bombay.\n- Chawls: tenement buildings housing multiple families in small rooms — became the dominant working-class housing type.\n5. SOCIAL CONSEQUENCES: Cities brought communities together across caste and religion (shared chawls, factory floors), but also created new hierarchies (class replaced caste as dominant divide).",
      worked_example:
        "Question: What were 'chawls' and what do they reveal about urban life in Bombay?\nAnswer: Chawls were large, multi-storied tenement buildings in Bombay's mill districts, typically with one-room tenements opening onto a common corridor and sharing toilet facilities. They reveal:\n1. Housing shortage: mill workers could not afford proper housing, so chawls packed multiple families into minimal space.\n2. Community formation: despite or because of crowded conditions, chawl residents formed tight-knit communities — shared cooking, festivals, gossip, and mutual support.\n3. Cultural mixing: chawls brought together workers from different castes, regions, and even religions — creating a new urban working-class culture distinct from village identity.\n4. Class consciousness: shared conditions of poverty and work led to class solidarity, contributing to Bombay's strong trade union movement.",
      common_misconceptions: [
        "Urbanisation was not only driven by industrialisation — colonial trade cities (Bombay, Calcutta, Madras) grew for different reasons (trade, administration) before industrialisation reached India.",
        "The urban poor were not passive victims — they organised communities, created cultural institutions (theatres, clubs, religious associations), and participated in politics.",
        "Colonial cities were not simply copies of British cities — they had distinct spatial organisation reflecting racial and class hierarchies of colonialism.",
      ],
      shortcuts_and_tricks: [
        "Push factors: enclosure, agricultural mechanisation, rural poverty. Pull factors: factory jobs, services, better wages (hoped for).",
        "London landmarks of urbanisation: West End (rich), East End (poor), suburbs (middle class fleeing city).",
        "Bombay = 7 islands → port → cotton mill city → chawls for workers. Colonial segregation by race and class.",
      ],
      diagram_description:
        "City cross-section: colonial Bombay from south to north. South (Fort area, Europeans) → Merchant quarter → Mill districts (Parel, Girgaum, chawls, workers) → Northern suburbs. Inset: chawl layout — one room per family, shared corridor, shared toilet.",
      key_takeaway:
        "Rapid urbanisation in the 19th century created new social spaces — cities brought together people of different backgrounds in shared conditions of work and poverty. In Bombay, chawls became the crucible of a new urban working-class culture, different from village life, that later fed into both trade unionism and nationalist politics.",
    },
  },

  {
    topicId: "sst_ch5_social_changes",
    subject: "Social Science",
    chapterNumber: 5,
    name: "Social Changes in 19th Century — Women, Reform, and Identity",
    prerequisite_knowledge: [
      "Status of women in 19th century Indian society",
      "Caste system and social hierarchy",
      "What is social reform",
    ],
    key_formulas: [
      "Sati Prohibition Act: 1829 (Regulation XVII) — William Bentinck, lobbied by Ram Mohan Roy",
      "Widow Remarriage Act: 1856 (lobbied by Ishwar Chandra Vidyasagar)",
      "Child Marriage Restraint Act: 1929 (Sharda Act)",
      "Reform movements: Brahmo Samaj (1828), Prarthana Samaj, Arya Samaj (1875)",
    ],
    teaching_content: {
      intuition:
        "The 19th century in India saw a paradox: colonial rule brought new ideas of individual rights and social equality while also reinforcing traditional hierarchies. Indian reform movements emerged — often led by educated men — to challenge practices like sati, child marriage, and caste discrimination, using both traditional scriptural arguments and Western concepts of individual rights. Women's lives were at the center of these debates, though women themselves were often absent from leadership.",
      process_explanation:
        "1. WOMEN'S STATUS: Early 19th century — sati (widow immolation), purdah, child marriage, denial of education and property rights. Women's position was often worse in upper castes (who followed stricter restrictions).\n2. BRAHMO SAMAJ (1828): Ram Mohan Roy. Opposed sati, idol worship, caste hierarchy. Promoted women's education. Used both Hindu scripture and rational-humanist arguments.\n3. REFORM LEGISLATION:\n- Sati Prohibition: 1829 — first major reform law.\n- Widow Remarriage: 1856 — Vidyasagar's campaign. Hundreds of educated Bengalis signed petitions.\n- Age of Consent Act 1891: raised minimum age of consent from 10 to 12 years.\n4. WOMEN'S EDUCATION: Bethune School (1849, Calcutta), Jyotirao Phule's school for girls (1848, Pune). Women gradually entered education and public life.\n5. CASTE AND REFORM: Jyotirao Phule (Maharashtra) challenged Brahmin dominance, opened schools for lower castes and women. Periyar (E.V. Ramasamy) in Tamil Nadu led Self-Respect Movement against caste. Ambedkar led Dalit rights movement.\n6. WOMEN AS AGENTS: By early 20th century, women weren't just objects of reform but agents — Pandita Ramabai started homes for widows, Rokeya Sakhawat Hossain wrote feminist fiction, women joined nationalist movement.",
      worked_example:
        "Question: How did 19th-century social reform address women's issues, and what were its limitations?\nAnswer:\nAchievements: Sati abolished (1829), widow remarriage legalised (1856), girls' schools established, age of consent raised.\nLimitations:\n1. Paternalism: reform was largely led by men, who decided what was best for women without women's participation.\n2. Class bias: reforms benefited educated upper-caste women most. Lower-caste and rural women were largely ignored.\n3. Partial change: social attitudes changed slowly — widow remarriage was legalised but socially stigmatised for decades.\n4. Missing intersectionality: gender reform rarely addressed caste simultaneously. A Brahmin widow was reformed for; a Dalit woman faced both gender and caste discrimination, with less attention from reformers.",
      common_misconceptions: [
        "Social reform was not purely Western-inspired — reformers like Ram Mohan Roy used Hindu texts to argue against sati, and Phule used Buddhist ideals. Reform was a complex negotiation between Indian traditions and new ideas.",
        "Child marriage was not only a 'Hindu problem' — it existed across communities, though reformers initially focused on Hindu practices.",
        "Women were not simply passive recipients of reform — Pandita Ramabai converted to Christianity partly for access to education, Rokeya Hossain wrote feminist utopian fiction — women found ways to claim agency even in restricted circumstances.",
      ],
      shortcuts_and_tricks: [
        "Reform timeline: 1828 (Brahmo Samaj) → 1829 (Sati abolished) → 1856 (Widow Remarriage Act) → 1875 (Arya Samaj) → 1891 (Age of Consent) → 1929 (Sharda Act).",
        "Key reformers: Ram Mohan Roy (sati), Vidyasagar (widow remarriage), Phule (caste/women), Ambedkar (Dalit rights), Periyar (Tamil Self-Respect).",
        "Brahmo Samaj = monotheistic reform (Roy). Arya Samaj = Vedic revival (Dayananda Saraswati).",
      ],
      diagram_description:
        "Reform movement map: Timeline of legislation (1829-1929) with associated reformers. Branch diagram: Social reforms → Gender reforms (sati, widow remarriage, education) + Caste reforms (Phule, Ambedkar, Periyar) + Religious reforms (Brahmo Samaj, Arya Samaj). Limitation box: paternalism, class bias, slow cultural change.",
      key_takeaway:
        "19th-century social reform movements addressed gender inequality (sati, widow remarriage, education) and caste discrimination, with legislation backed by reformers like Ram Mohan Roy, Vidyasagar, and Phule. However, reforms were often paternalistic, class-biased, and incomplete — women and Dalits gradually asserted their own agency.",
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
  console.log(`✅ SST History Content: ${created} created, ${updated} updated`);
  await mongoose.disconnect();
}
run().catch(e => { console.error(e); process.exit(1); });
