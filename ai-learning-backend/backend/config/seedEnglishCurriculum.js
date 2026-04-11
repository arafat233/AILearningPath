/**
 * CBSE Class 10 English — Complete Curriculum Seed
 * Source: NCERT Class 10 English Textbooks
 *   First Flight          (jeff101–jeff109)   → Ch 1-9
 *   Footprints without Feet (jefp101–jefp109) → Ch 10-18
 *   Words and Expressions 2 (jewe201–jewe209) → Ch 19-27
 * Run: npm run seed:english-curriculum
 */
import "dotenv/config";
import mongoose from "mongoose";
import { Chapter } from "../models/chapterModel.js";

const CHAPTERS = [
  // ══════════════════ FIRST FLIGHT ══════════════════
  {
    chapterNumber: 1,
    title: "A Letter to God",
    subject: "English",
    grade: "10",
    board: "CBSE",
    unit: "First Flight",
    examMarks: 5,
    estimatedWeeks: 1,
    overview: "A short story by G.L. Fuentes about Lencho, a farmer whose crop is destroyed by hail. He writes a letter to God asking for money. The story explores unshakeable faith vs human irony.",
    sections: [
      {
        sectionNumber: "Prose",
        title: "A Letter to God – G.L. Fuentes",
        microConcepts: [
          { title: "Lencho's unshakeable faith in God despite crop destruction by hailstorm" },
          { title: "Irony: post office employees collect money to 'protect Lencho's faith in God'" },
          { title: "Lencho labels the employees as 'a bunch of crooks' — dramatic irony" },
          { title: "Theme: blind faith, human kindness, irony of gratitude" },
          { title: "Setting: a rural Mexican farm; simple, hardworking family" },
        ],
      },
      {
        sectionNumber: "Poem",
        title: "Dust of Snow + Fire and Ice – Robert Frost",
        microConcepts: [
          { title: "Dust of Snow: crow shakes snow off hemlock tree → changes poet's mood; nature's healing power" },
          { title: "Fire and Ice: fire = desire/greed; ice = hatred; either can destroy the world" },
          { title: "Symbolism in both poems; Frost's minimalist style" },
          { title: "Themes: nature's impact on human emotions, destruction" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "Irony: when outcome is opposite to what is expected",
      "Dramatic irony: reader knows something characters don't",
      "Theme of faith vs reality",
    ],
    examTips: [
      "Lencho's character: hardworking, faithful, ungrateful — explain all three with evidence",
      "The postmaster's role: compassionate, imaginative — he collects money from employees",
      "Dust of Snow: 'rued' means regretted; crow and hemlock are negative symbols yet bring positive change",
      "Fire and Ice: both fire (desire) and ice (hate) capable of ending the world — poem argues either suffices",
    ],
    exercises: [
      { exerciseNumber: "Thinking about the Text", questionCount: 6, types: ["Short Answer", "Long Answer"] },
      { exerciseNumber: "Thinking about Language", questionCount: 4, types: ["Grammar", "Vocabulary"] },
    ],
  },

  {
    chapterNumber: 2,
    title: "Nelson Mandela: Long Walk to Freedom",
    subject: "English",
    grade: "10",
    board: "CBSE",
    unit: "First Flight",
    examMarks: 5,
    estimatedWeeks: 1,
    overview: "An excerpt from Nelson Mandela's autobiography describing the inauguration ceremony ending apartheid in South Africa. Explores themes of freedom, courage, and the struggle against racial oppression.",
    sections: [
      {
        sectionNumber: "Prose",
        title: "Nelson Mandela: Long Walk to Freedom",
        microConcepts: [
          { title: "Inauguration of South Africa's first democratic government — 10 May 1994" },
          { title: "Mandela's understanding of freedom: personal freedom AND freedom of others" },
          { title: "Twin obligations: to family and to his people/society" },
          { title: "Courage: not absence of fear but triumph over it" },
          { title: "Apartheid system: racial segregation and oppression" },
          { title: "ANC (African National Congress) struggle for equality" },
        ],
      },
      {
        sectionNumber: "Poem",
        title: "A Tiger in the Zoo – Leslie Norris",
        microConcepts: [
          { title: "Contrast: tiger in zoo (confined, pacing, quiet rage) vs tiger in wild (free, majestic)" },
          { title: "Tiger stares at brilliant stars with brilliant eyes — longing for freedom" },
          { title: "Theme: captivity vs freedom; man's interference with nature" },
          { title: "Personification of tiger's emotions; vivid imagery" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "Autobiography: first-person account of own life",
      "Courage = triumph over fear (not absence of fear)",
      "Apartheid: Afrikaans word meaning 'separateness'",
    ],
    examTips: [
      "Mandela's definition of freedom changed — personal → communal; explain both",
      "'The brave man is not he who does not feel afraid but he who conquers that fear' — key quote",
      "Tiger in the Zoo: stanza 1 = zoo; stanzas 2-3 = wild contrast; stanza 4 = night/stars — know the structure",
      "Highlight: Mandela's gratitude to comrades who sacrificed — he was acutely aware of their suffering",
    ],
    exercises: [
      { exerciseNumber: "Thinking about the Text", questionCount: 7, types: ["Short Answer", "Long Answer"] },
      { exerciseNumber: "Thinking about Language", questionCount: 3, types: ["Grammar", "Vocabulary"] },
    ],
  },

  {
    chapterNumber: 3,
    title: "Two Stories about Flying",
    subject: "English",
    grade: "10",
    board: "CBSE",
    unit: "First Flight",
    examMarks: 5,
    estimatedWeeks: 1,
    overview: "Two linked stories: 'His First Flight' by Liam O'Flaherty (young seagull overcomes fear of flying) and 'The Black Aeroplane' by Frederick Forsyth (pilot saved by mysterious plane). Themes: overcoming fear, mystery, courage.",
    sections: [
      {
        sectionNumber: "Part I",
        title: "His First Flight – Liam O'Flaherty",
        microConcepts: [
          { title: "Young seagull afraid to fly — family leaves him alone on ledge" },
          { title: "Hunger drives him to dive for fish — instinct overcomes fear" },
          { title: "Theme: courage, overcoming self-doubt, role of hunger/need as motivation" },
          { title: "Symbolic: seagull's journey = any person overcoming fear of new challenges" },
        ],
      },
      {
        sectionNumber: "Part II",
        title: "The Black Aeroplane – Frederick Forsyth",
        microConcepts: [
          { title: "Pilot flying old Dakota loses way in storm clouds" },
          { title: "Mysterious black aeroplane guides him to safety then disappears" },
          { title: "Control tower has no record of the other plane — mystery left unresolved" },
          { title: "Theme: mystery, unexplained help, trust in unknown forces" },
        ],
      },
      {
        sectionNumber: "Poem",
        title: "How to Tell Wild Animals – Carolyn Wells",
        microConcepts: [
          { title: "Humorous poem — wild, exaggerated ways to identify animals (lion, bear, leopard, etc.)" },
          { title: "Humour in the irony: you'd have to be attacked to 'identify' the animal" },
          { title: "Rhyme scheme: AABB; light-hearted tone" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [],
    examTips: [
      "His First Flight: the seagull's mother tempted him with fish — the role of motivation in overcoming fear",
      "Black Aeroplane: narrator's greatest wish = eggs and bacon breakfast (mundane vs extraordinary event contrast)",
      "How to Tell Wild Animals: identify the humorous device — irony in 'if he hugs you very tight, it's a bear'",
    ],
    exercises: [
      { exerciseNumber: "Thinking about the Text", questionCount: 8, types: ["Short Answer", "Long Answer"] },
    ],
  },

  {
    chapterNumber: 4,
    title: "From the Diary of Anne Frank",
    subject: "English",
    grade: "10",
    board: "CBSE",
    unit: "First Flight",
    examMarks: 5,
    estimatedWeeks: 1,
    overview: "Excerpts from Anne Frank's diary written while hiding from the Nazis. Anne reflects on loneliness, her relationship with her diary (Kitty), and the irony that paper is more patient than people.",
    sections: [
      {
        sectionNumber: "Prose",
        title: "From the Diary of Anne Frank",
        microConcepts: [
          { title: "Anne Frank: Jewish teenager hiding in Amsterdam during WWII Nazi occupation" },
          { title: "Diary = best friend 'Kitty'; paper is more patient than people" },
          { title: "Anne feels lonely despite family — no true friend to confide in" },
          { title: "Irony: diary written for 'posterity' — Anne didn't know it would be published" },
          { title: "Mrs Kuperus (class teacher) — Anne's relationship with authority/school" },
          { title: "Anne was talkative, punished, wrote essay 'A Chatterbox' as punishment" },
        ],
      },
      {
        sectionNumber: "Poem",
        title: "Amanda! – Robin Klein",
        microConcepts: [
          { title: "Amanda daydreams while her mother nags her about posture, eating, homework" },
          { title: "Amanda imagines being a mermaid, Rapunzel, an orphan — free from instructions" },
          { title: "Irony: mother says Amanda is sulking — but Amanda is lost in dream world" },
          { title: "Theme: freedom vs restraint; childhood imagination; over-parenting" },
          { title: "Brackets indicate Amanda's thoughts vs mother's spoken words" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "Diary: first-person introspective writing; intimate tone",
      "Irony: Amanda is accused of sulking when she's actually daydreaming",
    ],
    examTips: [
      "'Paper has more patience than people' — Anne's most quoted line; explain why she felt this",
      "Anne's loneliness: had family, 30+ adults in hiding but no true friend — explain this paradox",
      "Amanda's escapes: mermaid (freedom), Rapunzel (solitude — but no hair-climbing allowed!), orphan (no nagging)",
      "Amanda's mother is not cruel — just over-concerned; understand dual perspective",
    ],
    exercises: [
      { exerciseNumber: "Thinking about the Text", questionCount: 6, types: ["Short Answer", "Long Answer"] },
      { exerciseNumber: "Thinking about Language", questionCount: 4, types: ["Grammar", "Vocabulary"] },
    ],
  },

  {
    chapterNumber: 5,
    title: "The Hundred Dresses – I & II",
    subject: "English",
    grade: "10",
    board: "CBSE",
    unit: "First Flight",
    examMarks: 5,
    estimatedWeeks: 1,
    overview: "A two-part story by Eleanor Estes about Wanda Petronski, a Polish immigrant who claims to own 100 dresses. She is bullied by Maddie and Peggy. After Wanda moves away, they discover her extraordinary drawings and feel remorse.",
    sections: [
      {
        sectionNumber: "Part I",
        title: "The Hundred Dresses – I",
        microConcepts: [
          { title: "Wanda Petronski: poor, Polish, wears same faded dress daily; claims 100 dresses at home" },
          { title: "Maddie and Peggy tease Wanda daily about her dresses — bullying" },
          { title: "Maddie feels uncomfortable but never speaks up — passive bystander" },
          { title: "Wanda's room in Boggins Heights — poverty and isolation" },
        ],
      },
      {
        sectionNumber: "Part II",
        title: "The Hundred Dresses – II",
        microConcepts: [
          { title: "Wanda wins the drawing contest with 100 dress designs — beautiful, unique" },
          { title: "Wanda's family moves away; letter says Polish names are hard in this country" },
          { title: "Maddie's remorse: she could have stopped the bullying but chose silence" },
          { title: "Wanda's note: gifted her drawings to Peggy and Maddie — forgiveness without bitterness" },
          { title: "Theme: bullying, social exclusion, remorse, kindness, art as expression" },
        ],
      },
      {
        sectionNumber: "Poem",
        title: "Animals – Walt Whitman",
        microConcepts: [
          { title: "Whitman admires animals for their calm, self-contained nature" },
          { title: "Animals don't weep, don't worry about sins, don't obsess over possessions" },
          { title: "'They do not make me sick discussing their duty to God'" },
          { title: "Theme: contrast between human flaws and animal simplicity; critique of civilization" },
          { title: "Whitman hints that humans have 'lost' tokens that animals still hold" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [],
    examTips: [
      "Maddie's character arc: bystander → remorseful → resolved to never stay silent — explain this journey",
      "Wanda's 100 dresses = 100 drawings she had in her mind; 'closet full of dresses' was metaphorical",
      "Wanda's forgiveness through the note shows dignity — never directly confronted bullies",
      "Animals poem: 'placid and self-contained' — know this phrase and what it implies about humans",
    ],
    exercises: [
      { exerciseNumber: "Thinking about the Text", questionCount: 8, types: ["Short Answer", "Long Answer"] },
    ],
  },

  {
    chapterNumber: 6,
    title: "Glimpses of India",
    subject: "English",
    grade: "10",
    board: "CBSE",
    unit: "First Flight",
    examMarks: 5,
    estimatedWeeks: 1,
    overview: "Three short travelogue-style pieces: 'A Baker from Goa' (Lucio Rodrigues), 'Coorg' (Lokesh Abrol), and 'Tea from Assam' (Arup Kumar Datta). Each celebrates a unique facet of Indian culture and geography.",
    sections: [
      {
        sectionNumber: "Part I",
        title: "A Baker from Goa – Lucio Rodrigues",
        microConcepts: [
          { title: "Goan bread tradition inherited from Portuguese — pader (baker) still part of Goan life" },
          { title: "Baker's distinctive dress: a kabai (single-piece long frock)" },
          { title: "Bread essential for Goan celebrations: marriages, feasts, Christmas" },
          { title: "Nostalgic tone — baker's visit a childhood memory" },
        ],
      },
      {
        sectionNumber: "Part II",
        title: "Coorg – Lokesh Abrol",
        microConcepts: [
          { title: "Coorg (Kodagu): smallest district of Karnataka; coffee and spices; misty forests" },
          { title: "People of Coorg: possibly of Arab/Greek descent; brave, hospitable" },
          { title: "Kodava tradition: wearing the kuppia (long black coat); carry a curved knife" },
          { title: "Activities: river rafting, trekking, Brahmagiri peak; India's best coffee" },
          { title: "Wildlife: elephants, kingfishers, squirrels, langurs" },
        ],
      },
      {
        sectionNumber: "Part III",
        title: "Tea from Assam – Arup Kumar Datta",
        microConcepts: [
          { title: "Pranjol and Rajvir visit Pranjol's father's tea estate in Assam" },
          { title: "Tea legends: Chinese emperor, Buddhist monk Bodhidharma (eyelids story)" },
          { title: "Assam: world's largest tea growing area; two main crops (flushes)" },
          { title: "Tea plant description, plucking process — young shoot called 'two leaves and a bud'" },
        ],
      },
      {
        sectionNumber: "Poem",
        title: "The Trees – Adrienne Rich",
        microConcepts: [
          { title: "Trees move from indoors (where they are kept as houseplants) to the forest" },
          { title: "Metaphor: trees = women breaking free from domestic confinement" },
          { title: "Forest is 'empty' without trees — nature reclaims what belongs to it" },
          { title: "Feminist interpretation: liberation from patriarchal constraints" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [],
    examTips: [
      "Know all three Glimpses of India pieces — any may appear in board exam",
      "Baker from Goa: bread items — bol (bread), poie (bun), pão, kakkinhem (sweet bread ring)",
      "Coorg: Cauvery river originates here; General K.M. Cariappa from Coorg — mention in answers",
      "The Trees: Rich uses extended metaphor — trees breaking out = liberation; roots, boughs = parts of women breaking free",
    ],
    exercises: [
      { exerciseNumber: "Thinking about the Text", questionCount: 9, types: ["Short Answer", "Long Answer"] },
    ],
  },

  {
    chapterNumber: 7,
    title: "Mijbil the Otter",
    subject: "English",
    grade: "10",
    board: "CBSE",
    unit: "First Flight",
    examMarks: 5,
    estimatedWeeks: 1,
    overview: "Gavin Maxwell's account of befriending a pet otter named Mijbil in Iraq, transporting it to England, and its playful personality. Explores the bond between humans and animals and responsibility toward wildlife.",
    sections: [
      {
        sectionNumber: "Prose",
        title: "Mijbil the Otter – Gavin Maxwell",
        microConcepts: [
          { title: "Maxwell gets an otter (Lutrinae) from the Tigris marshes in Iraq" },
          { title: "Mijbil's playful personality: invents games with marbles, explores bathroom water" },
          { title: "Air travel challenge: Mij confined in box, escapes into aircraft aisle — chaos" },
          { title: "Mij classified as a new sub-species: Lutrogale perspicillata maxwelli" },
          { title: "Theme: human-animal bond, responsibility, curiosity of animals" },
          { title: "Londoners' ignorant guesses: baby seal, beaver, hippo — shows urban disconnect from nature" },
        ],
      },
      {
        sectionNumber: "Poem",
        title: "The Tale of Custard the Dragon – Ogden Nash",
        microConcepts: [
          { title: "Custard the dragon is cowardly while Belinda, cat, mouse, dog all claim to be brave" },
          { title: "Pirate attacks — only Custard fights; others who boasted run away" },
          { title: "Humour and irony: bravest animal branded as coward; 'cowards' proved useless" },
          { title: "Theme: true courage is shown in action, not words; appearances are deceptive" },
          { title: "Rhyme scheme and childlike rhythm — ballad-style humorous poem" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [],
    examTips: [
      "Mij's habits: rolls ball like a juggler, slides water down the side of the bath — cite specific details",
      "Air travel scene: Maxwell carried Mij in a box but Mij escaped — know the sequence",
      "Custard Dragon: Custard's description — 'realio trulio little pet dragon' with big sharp teeth; everyone else boasts falsely",
      "Theme link: Custard = quiet courage vs Belinda and friends = loud cowardice",
    ],
    exercises: [
      { exerciseNumber: "Thinking about the Text", questionCount: 7, types: ["Short Answer", "Long Answer"] },
    ],
  },

  {
    chapterNumber: 8,
    title: "Madam Rides the Bus",
    subject: "English",
    grade: "10",
    board: "CBSE",
    unit: "First Flight",
    examMarks: 5,
    estimatedWeeks: 1,
    overview: "Valliammai ('Valli'), an eight-year-old Tamil girl, dreams of riding the bus. She saves money secretly and takes a solo bus ride to town and back. Explores themes of childhood wonder, independence, and the first brush with mortality.",
    sections: [
      {
        sectionNumber: "Prose",
        title: "Madam Rides the Bus – Vallikkannan",
        microConcepts: [
          { title: "Valli's character: determined, curious, proud — saves 60 paise over months" },
          { title: "She observes the bus daily and gathers information before planning the trip" },
          { title: "On the bus: refuses to sit with old woman (overcautious), doesn't drink free juice" },
          { title: "Returns to find dead young cow on road — first encounter with death" },
          { title: "Mood shift: same cow she admired going was now dead — joy turns to sadness" },
          { title: "Theme: childhood innocence, curiosity, independence, mortality" },
        ],
      },
      {
        sectionNumber: "Poem",
        title: "For Anne Gregory – W.B. Yeats",
        microConcepts: [
          { title: "Young man tells Anne: men love her for her yellow hair, not her soul" },
          { title: "Anne says she could dye her hair — then would you love me for myself?" },
          { title: "Yeats quotes religious text: only God can love you for yourself, not your appearance" },
          { title: "Theme: physical beauty vs inner worth; human love is superficial" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [],
    examTips: [
      "Valli saved money by resisting: merry-go-round, toys, balloons, peppermints — mention sacrifice",
      "The dead cow scene is the emotional climax — explain how it changes Valli's mood",
      "Valli's mother doesn't know about the trip — keeping a secret is part of Valli's pride",
      "For Anne Gregory: 'only God, my dear, could love you for yourself alone' — key line",
    ],
    exercises: [
      { exerciseNumber: "Thinking about the Text", questionCount: 6, types: ["Short Answer", "Long Answer"] },
    ],
  },

  {
    chapterNumber: 9,
    title: "The Sermon at Benares + The Proposal",
    subject: "English",
    grade: "10",
    board: "CBSE",
    unit: "First Flight",
    examMarks: 5,
    estimatedWeeks: 1,
    overview: "Two pieces: 'The Sermon at Benares' — Buddha teaches Kisa Gotami that death is universal. 'The Proposal' — a farcical one-act play by Anton Chekhov about a quarrelsome marriage proposal.",
    sections: [
      {
        sectionNumber: "Prose",
        title: "The Sermon at Benares – Betty Renshaw",
        microConcepts: [
          { title: "Kisa Gotami's son dies; she seeks medicine from Buddha to revive him" },
          { title: "Buddha asks for mustard seed from a house where no one has died — she finds none" },
          { title: "Kisa realises death is universal; grief turns to acceptance" },
          { title: "Theme: universality of death, acceptance of suffering, Buddhist philosophy" },
          { title: "Buddha's sermon: 'The living are few; the dead are many'" },
        ],
      },
      {
        sectionNumber: "Play",
        title: "The Proposal – Anton Chekhov",
        microConcepts: [
          { title: "Lomov comes to propose to Natalya; they argue about the Oxen Meadows land instead" },
          { title: "Lomov faints from anger; Chubukov panics, calls Natalya" },
          { title: "When Natalya learns it was a proposal visit, she calls Lomov back — they argue about dogs" },
          { title: "Chubukov forces them to kiss and call it an engagement despite ongoing argument" },
          { title: "Theme: farce, petty squabbling, materialistic attitude, marriage of convenience" },
          { title: "Characters: Lomov (hypochondriac, nervous), Natalya (quarrelsome), Chubukov (opportunistic)" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "Farce: exaggerated comedy with absurd situations",
      "Hypochondria: excessive preoccupation with imagined illness",
    ],
    examTips: [
      "Kisa Gotami's journey: grief → denial → search → realisation — know this arc",
      "Buddha's teaching method: experiential — let her discover the truth herself",
      "The Proposal: identify all three quarrels (meadow, dogs, and the proposal itself is interrupted)",
      "Chekhov's satire: the couple can't stop fighting even while getting engaged — irony of 'happy ending'",
    ],
    exercises: [
      { exerciseNumber: "Thinking about the Text", questionCount: 10, types: ["Short Answer", "Long Answer"] },
    ],
  },

  // ══════════════════ FOOTPRINTS WITHOUT FEET ══════════════════
  {
    chapterNumber: 10,
    title: "A Triumph of Surgery",
    subject: "English",
    grade: "10",
    board: "CBSE",
    unit: "Footprints without Feet",
    examMarks: 5,
    estimatedWeeks: 1,
    overview: "James Herriot's humorous account of Tricki, an overindulged dog near death due to over-eating. The vet 'operates' by simply enforcing a strict diet and exercise — a triumph of common sense over excess.",
    sections: [
      {
        sectionNumber: "Story",
        title: "A Triumph of Surgery – James Herriot",
        microConcepts: [
          { title: "Tricki: Mrs Pumphrey's pampered dog — grossly overweight, listless, vomiting" },
          { title: "Herriot hospitalises Tricki, gives only water for two days, then exercise with other dogs" },
          { title: "Tricki's miraculous recovery — the 'surgery' is really just diet and exercise" },
          { title: "Mrs Pumphrey sends food parcels, wine, eggs for Tricki — staff enjoys them" },
          { title: "Theme: overindulgence is harmful; excess love can damage; irony of 'surgery'" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [],
    examTips: [
      "'Triumph of surgery' is ironic — no surgery was performed; just diet and exercise",
      "Mrs Pumphrey's love is misguided — she feeds Tricki malt, cod-liver oil, Horlicks, cream cakes",
      "Herriot's character: practical, humorous, professional — he enjoys the food parcels guiltlessly",
    ],
    exercises: [
      { exerciseNumber: "Read and Find Out", questionCount: 5, types: ["Short Answer", "Long Answer"] },
    ],
  },

  {
    chapterNumber: 11,
    title: "The Thief's Story",
    subject: "English",
    grade: "10",
    board: "CBSE",
    unit: "Footprints without Feet",
    examMarks: 5,
    estimatedWeeks: 1,
    overview: "Ruskin Bond's story of Hari Singh, a young thief who befriends Amir, a writer. Hari steals money but returns it when he realises he'd be destroying the only person who trusted him.",
    sections: [
      {
        sectionNumber: "Story",
        title: "The Thief's Story – Ruskin Bond",
        microConcepts: [
          { title: "Hari Singh (various fake names) befriends Amir, a struggling writer" },
          { title: "Amir trusts Hari completely — 'I know you are a thief but you're also a man'" },
          { title: "Hari steals 600 rupees, plans to flee but hesitates at the railway station" },
          { title: "Hari realises: trust earned is harder to replace than money" },
          { title: "He returns the money, gives Amir's sports team earnings back" },
          { title: "Theme: trust, redemption, moral awakening, friendship transforming character" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [],
    examTips: [
      "Hari's change: greed → guilt → return; identify the turning point (train station hesitation)",
      "Amir's character: trusting, empathetic — never checks his money; writes about 'the makings of a gentleman'",
      "The story is told from Hari's perspective (first person) — note his self-awareness",
    ],
    exercises: [
      { exerciseNumber: "Read and Find Out", questionCount: 6, types: ["Short Answer", "Long Answer"] },
    ],
  },

  {
    chapterNumber: 12,
    title: "The Midnight Visitor",
    subject: "English",
    grade: "10",
    board: "CBSE",
    unit: "Footprints without Feet",
    examMarks: 5,
    estimatedWeeks: 1,
    overview: "Robert Arthur's spy story. Ausable, an unconventional secret agent, cleverly traps the spy Max using a nonexistent balcony. A story of wit triumphing over brawn.",
    sections: [
      {
        sectionNumber: "Story",
        title: "The Midnight Visitor – Robert Arthur",
        microConcepts: [
          { title: "Fowler meets Ausable — disappointed by his ordinary appearance (fat, not suave)" },
          { title: "Max, a rival spy, appears with a pistol to steal secret missile defence papers" },
          { title: "Ausable invents a story about a balcony he claims exists below his window" },
          { title: "When police knock (actually Ausable's ordered waiter), Max jumps to the 'balcony' — falls" },
          { title: "There is no balcony — Max was deceived; Ausable's quick wit saves the day" },
          { title: "Theme: intelligence over brute force; appearance vs reality" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [],
    examTips: [
      "Ausable's genius: invented the balcony story on the spot and made Max believe it under pressure",
      "Fowler's expectation vs reality — contrast between thriller movie spies and real intelligence work",
      "Max's fatal mistake: he believed Ausable's calm, plausible lie (no reason to doubt — seemed routine)",
    ],
    exercises: [
      { exerciseNumber: "Read and Find Out", questionCount: 5, types: ["Short Answer", "Long Answer"] },
    ],
  },

  {
    chapterNumber: 13,
    title: "A Question of Trust",
    subject: "English",
    grade: "10",
    board: "CBSE",
    unit: "Footprints without Feet",
    examMarks: 5,
    estimatedWeeks: 1,
    overview: "Victor Canning's ironic story about Horace Danby, a meticulous thief, who is himself outwitted by a woman pretending to be the owner of the house he's robbing. Irony: thief gets robbed.",
    sections: [
      {
        sectionNumber: "Story",
        title: "A Question of Trust – Victor Canning",
        microConcepts: [
          { title: "Horace Danby: respectable locksmith by day, robs one safe per year to fund rare books" },
          { title: "At Shotover Grange, a charming young woman claims to be the owner's wife" },
          { title: "She asks him to open the safe for her — he does, thinking he'll be forgiven" },
          { title: "She is actually a professional thief — takes the jewels; Horace is arrested" },
          { title: "No one believes him about the woman — Horace is jailed; woman is never caught" },
          { title: "Theme: irony, thieves don't trust each other, crime doesn't pay" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [],
    examTips: [
      "Horace trusted a stranger because she seemed charming and plausible — he was manipulated",
      "Irony: the 'law-abiding' public is fooled by Horace; Horace is fooled by the woman thief",
      "Horace's character: meticulous but gullible when charmed; his love of books is his only indulgence",
    ],
    exercises: [
      { exerciseNumber: "Read and Find Out", questionCount: 5, types: ["Short Answer", "Long Answer"] },
    ],
  },

  {
    chapterNumber: 14,
    title: "Footprints without Feet",
    subject: "English",
    grade: "10",
    board: "CBSE",
    unit: "Footprints without Feet",
    examMarks: 5,
    estimatedWeeks: 1,
    overview: "H.G. Wells' story of Griffin, a scientist who invents an invisibility drug. He becomes a criminal, burns down his landlord's house, steals, and ends up being chased in Iping village.",
    sections: [
      {
        sectionNumber: "Story",
        title: "Footprints without Feet – H.G. Wells",
        microConcepts: [
          { title: "Griffin: brilliant but lawless scientist; swallows drugs to become invisible" },
          { title: "Muddy footprints on London stairs — Griffin becomes visible when covered in mud/snow" },
          { title: "Steals clothes, food; sets fire to landlord's house after being asked to leave" },
          { title: "In Iping: steals vicar's money; Mrs Hall's furniture moves by itself (comic scene)" },
          { title: "Jaffers the constable tries to arrest Griffin — Griffin strips off bandages and escapes" },
          { title: "Theme: science misused by an immoral mind; power without ethics is dangerous" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [],
    examTips: [
      "Griffin's invisibility is a metaphor for anonymity enabling crime — without accountability, morality erodes",
      "Mrs Hall's encounter: she thinks the room is haunted; furniture moving is Griffin hiding his identity",
      "Griffin's moral decline: burns landlord's house → steals food → attacks Jaffers — escalating crimes",
    ],
    exercises: [
      { exerciseNumber: "Read and Find Out", questionCount: 5, types: ["Short Answer", "Long Answer"] },
    ],
  },

  {
    chapterNumber: 15,
    title: "The Making of a Scientist",
    subject: "English",
    grade: "10",
    board: "CBSE",
    unit: "Footprints without Feet",
    examMarks: 5,
    estimatedWeeks: 1,
    overview: "Biographical account of Richard Ebright, who from childhood curiosity about butterflies became a scientist. Shows how passion + hard work + good mentor = scientific achievement.",
    sections: [
      {
        sectionNumber: "Story",
        title: "The Making of a Scientist – Robert W. Peterson",
        microConcepts: [
          { title: "Richard Ebright: collected all 25 butterfly species in Reading, Pennsylvania by grade 2" },
          { title: "Mrs Resmi (mother): encouraged him — sent for butterfly sets, books, telescopes" },
          { title: "Science fair project: testing theory that viceroy butterfly mimics monarch" },
          { title: "Discovery of a new hormone in gold spots of monarch pupae — published in PNAS" },
          { title: "Later: developed cell's ability to make copies of DNA — insight into cancer" },
          { title: "Three qualities: first-rate mind, desire to do best at everything, will to win for right reasons" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [],
    examTips: [
      "Ebright's turning point: Dr Frederick Urquhart's research on monarch butterflies' migration",
      "The gold spots experiment: Ebright discovered they produce hormones for butterfly metamorphosis",
      "His mother's role: crucial — bought him a microscope, telescope, books; drove him to field trips",
    ],
    exercises: [
      { exerciseNumber: "Read and Find Out", questionCount: 6, types: ["Short Answer", "Long Answer"] },
    ],
  },

  {
    chapterNumber: 16,
    title: "The Necklace",
    subject: "English",
    grade: "10",
    board: "CBSE",
    unit: "Footprints without Feet",
    examMarks: 5,
    estimatedWeeks: 1,
    overview: "Guy de Maupassant's classic story of Matilda Loisel who borrows a diamond necklace, loses it, and spends ten years in poverty repaying the debt — only to learn the necklace was fake.",
    sections: [
      {
        sectionNumber: "Story",
        title: "The Necklace – Guy de Maupassant",
        microConcepts: [
          { title: "Matilda: pretty, ambitious; feels born for luxury but lives modestly as a clerk's wife" },
          { title: "Husband gets invitation to Minister's ball; Matilda borrows diamond necklace from Mme Forestier" },
          { title: "She shines at the party; loses the necklace on the way home" },
          { title: "They buy a replacement for 36,000 francs; spend 10 years paying off the debt in poverty" },
          { title: "Matilda aged into a coarse, hard woman; meets Mme Forestier who says necklace was fake — worth only 500 francs" },
          { title: "Theme: vanity, pride, irony, consequences of deception, illusion vs reality" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [],
    examTips: [
      "Matilda's character flaw: vanity — she lies about the lost necklace instead of confessing",
      "The twist ending: 'The necklace was paste. At most worth only five hundred francs!'",
      "Ten years of suffering caused by one night of vanity and one moment of dishonesty — moral of the story",
      "Mme Forestier aged gracefully; Matilda aged harshly — contrast shows effect of honest vs dishonest living",
    ],
    exercises: [
      { exerciseNumber: "Read and Find Out", questionCount: 7, types: ["Short Answer", "Long Answer"] },
    ],
  },

  {
    chapterNumber: 17,
    title: "The Hack Driver",
    subject: "English",
    grade: "10",
    board: "CBSE",
    unit: "Footprints without Feet",
    examMarks: 5,
    estimatedWeeks: 1,
    overview: "Sinclair Lewis' humorous story of a young lawyer sent to serve a summons on Oliver Lutkins. A friendly hack driver helps him search all day — then turns out to be Lutkins himself.",
    sections: [
      {
        sectionNumber: "Story",
        title: "The Hack Driver – Sinclair Lewis",
        microConcepts: [
          { title: "Young lawyer assigned to serve a summons on Oliver Lutkins in New Mullion" },
          { title: "Bill (the hack driver) offers to help find Lutkins for $2 per hour" },
          { title: "They search all day — Lutkins 'always just left'; Bill keeps the lawyer amused" },
          { title: "Lawyer returns with a colleague who identifies Bill as Lutkins himself" },
          { title: "Lutkins and his mother laugh at the fooled lawyer" },
          { title: "Theme: city naivety vs rural cunning; appearance vs reality; self-deception" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [],
    examTips: [
      "The hack driver's charm blinds the lawyer to obvious clues — irony that the 'help' was the target",
      "The lawyer's romanticised view of rural life made him vulnerable — contrast city/country expectations",
      "Lutkins earned money from the lawyer while evading the summons — clever but dishonest",
    ],
    exercises: [
      { exerciseNumber: "Read and Find Out", questionCount: 5, types: ["Short Answer", "Long Answer"] },
    ],
  },

  {
    chapterNumber: 18,
    title: "Bholi + The Book that Saved the Earth",
    subject: "English",
    grade: "10",
    board: "CBSE",
    unit: "Footprints without Feet",
    examMarks: 5,
    estimatedWeeks: 1,
    overview: "Two pieces: 'Bholi' by K.A. Abbas — a simple-minded girl transformed by education who bravely refuses a greedy match. 'The Book that Saved the Earth' — a science fiction play where a Martian invasion is stopped by a nursery rhyme book.",
    sections: [
      {
        sectionNumber: "Story",
        title: "Bholi – K.A. Abbas",
        microConcepts: [
          { title: "Sulekha (Bholi): stammers, plain-faced, considered simpleton after childhood fever" },
          { title: "Her teacher's encouragement transforms her — she grows confident through education" },
          { title: "Family arranges match with Bishamber (old, lame) for a large dowry" },
          { title: "At wedding: Bishamber demands more dowry seeing Bholi's pockmarks; father agrees" },
          { title: "Bholi refuses: 'I will not marry this mean, greedy man' — drops the garland" },
          { title: "Theme: power of education, women's self-respect, social evils — dowry, child marriage" },
        ],
      },
      {
        sectionNumber: "Play",
        title: "The Book that Saved the Earth – Claire Boiko",
        microConcepts: [
          { title: "Martians led by Think-Tank plan to invade Earth in 25th century" },
          { title: "Martians mistake a library for a 'sandwich stand' — eat books" },
          { title: "They translate 'Humpty Dumpty' — Think-Tank believes Earth has 'mighty warriors who make eggs explode'" },
          { title: "Terrified, Martians abandon invasion — Earth is saved by a nursery rhyme book" },
          { title: "Theme: books have great power; humour; satire on arrogance and misunderstanding" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [],
    examTips: [
      "Bholi's transformation: stuttering, ignored → confident woman who defies society — education as empowerment",
      "Teacher's role in Bholi: 'You are my child. I will make you wise and good.' — education as second chance",
      "The Book that Saved the Earth: Think-Tank's arrogance is his downfall — satire on intellectual pride",
      "Both stories celebrate courage — Bholi in real life; books metaphorically in sci-fi",
    ],
    exercises: [
      { exerciseNumber: "Read and Find Out", questionCount: 8, types: ["Short Answer", "Long Answer"] },
    ],
  },

  // ══════════════════ WORDS AND EXPRESSIONS 2 ══════════════════
  {
    chapterNumber: 19,
    title: "Words and Expressions 2 – Unit 1 & 2",
    subject: "English",
    grade: "10",
    board: "CBSE",
    unit: "Words and Expressions 2",
    examMarks: 5,
    estimatedWeeks: 1,
    overview: "Grammar and writing workbook units linked to First Flight chapters. Covers reading comprehension, vocabulary, grammar (tenses, determiners), and writing skills (formal/informal letters, notice writing).",
    sections: [
      {
        sectionNumber: "Grammar",
        title: "Tenses Review + Determiners",
        microConcepts: [
          { title: "Simple, continuous, perfect tenses — active and passive voice" },
          { title: "Determiners: articles (a/an/the), quantifiers (some/any/few/many)" },
          { title: "Exercises linked to A Letter to God and Nelson Mandela passages" },
        ],
      },
      {
        sectionNumber: "Writing",
        title: "Formal Letters + Notice Writing",
        microConcepts: [
          { title: "Formal letter format: sender, date, receiver, subject, salutation, body, closing" },
          { title: "Types: letter of complaint, inquiry, application" },
          { title: "Notice: heading, authority, date, body, signature — max 50 words" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "Notice format: Heading | Name of Organisation | Date | Body | Name/Designation",
      "Formal letter: should be concise, objective, polite",
    ],
    examTips: [
      "Notice writing is 5 marks — stay within word limit, include all format elements",
      "Formal letter: never use contractions (don't → do not); begin 'I am writing to...'",
    ],
    exercises: [
      { exerciseNumber: "Unit 1 & 2 Exercises", questionCount: 12, types: ["Grammar", "Vocabulary", "Writing"] },
    ],
  },

  {
    chapterNumber: 20,
    title: "Words and Expressions 2 – Unit 3 & 4",
    subject: "English",
    grade: "10",
    board: "CBSE",
    unit: "Words and Expressions 2",
    examMarks: 5,
    estimatedWeeks: 1,
    overview: "Grammar: modals, reported speech. Writing: article writing, paragraph writing on topics linked to prose chapters.",
    sections: [
      {
        sectionNumber: "Grammar",
        title: "Modals + Reported Speech",
        microConcepts: [
          { title: "Modals: can/could, may/might, shall/should, will/would, must, ought to" },
          { title: "Reported speech: tense changes, pronoun changes, time/place reference changes" },
          { title: "Direct → Indirect: 'I am happy' → He said that he was happy" },
        ],
      },
      {
        sectionNumber: "Writing",
        title: "Article Writing",
        microConcepts: [
          { title: "Article format: title, by (author), introduction, body (3-4 paras), conclusion" },
          { title: "Tone: informative, persuasive, or descriptive depending on topic" },
          { title: "100-150 words for most board exam articles" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "Reported Speech tense shift: present → past; past → past perfect; will → would",
      "Article: TITLE + Author + Introduction + Body + Conclusion",
    ],
    examTips: [
      "Modals exam tip: 'must' for strong obligation; 'should' for advice; 'might' for remote possibility",
      "Article vs Report: article = personal tone/opinion possible; report = objective, third-person",
    ],
    exercises: [
      { exerciseNumber: "Unit 3 & 4 Exercises", questionCount: 12, types: ["Grammar", "Writing"] },
    ],
  },

  {
    chapterNumber: 21,
    title: "Words and Expressions 2 – Unit 5 & 6",
    subject: "English",
    grade: "10",
    board: "CBSE",
    unit: "Words and Expressions 2",
    examMarks: 5,
    estimatedWeeks: 1,
    overview: "Grammar: subject-verb agreement, prepositions. Writing: debate writing, speech writing for school contexts.",
    sections: [
      {
        sectionNumber: "Grammar",
        title: "Subject-Verb Agreement + Prepositions",
        microConcepts: [
          { title: "S-V agreement rules: collective nouns, indefinite pronouns (everyone = singular)" },
          { title: "Prepositions of time (at/on/in), place, direction" },
          { title: "Common errors: 'data is' vs 'data are'; 'news is' not 'news are'" },
        ],
      },
      {
        sectionNumber: "Writing",
        title: "Debate + Speech Writing",
        microConcepts: [
          { title: "Debate format: address the house, state motion, argue for/against, conclude" },
          { title: "Speech: informal address (students, teachers), personal tone, persuasive devices" },
          { title: "Use of rhetorical questions, repetition, statistics in debate/speech" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [],
    examTips: [
      "Debate: start with 'Honourable judges, respected teachers, dear friends, I am here to speak FOR/AGAINST the motion...'",
      "Subject-verb agreement: neither...nor → verb agrees with the noun closest to it",
    ],
    exercises: [
      { exerciseNumber: "Unit 5 & 6 Exercises", questionCount: 10, types: ["Grammar", "Writing"] },
    ],
  },

  {
    chapterNumber: 22,
    title: "Words and Expressions 2 – Unit 7 & 8",
    subject: "English",
    grade: "10",
    board: "CBSE",
    unit: "Words and Expressions 2",
    examMarks: 5,
    estimatedWeeks: 1,
    overview: "Grammar: clauses (relative, adverb, noun), connectives. Writing: story writing, diary entry.",
    sections: [
      {
        sectionNumber: "Grammar",
        title: "Clauses + Connectives",
        microConcepts: [
          { title: "Relative clauses: who, which, that, whose — defining vs non-defining" },
          { title: "Adverb clauses: time (when, after), condition (if, unless), concession (though, although)" },
          { title: "Connectives: however, therefore, moreover, consequently, nevertheless" },
        ],
      },
      {
        sectionNumber: "Writing",
        title: "Story Writing + Diary Entry",
        microConcepts: [
          { title: "Story: beginning (setting/character), middle (conflict), end (resolution)" },
          { title: "Use of vivid description, dialogue, suspense — 150-200 words" },
          { title: "Diary entry: date, day, address (Dear Diary), personal voice, reflection" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "Diary format: Day, Date | Dear Diary | Body | Signature",
    ],
    examTips: [
      "Non-defining relative clause: comma before 'who/which' — provides extra info, not essential",
      "Story writing: use past tense throughout; give character a name; end with a clear moral or resolution",
    ],
    exercises: [
      { exerciseNumber: "Unit 7 & 8 Exercises", questionCount: 10, types: ["Grammar", "Writing"] },
    ],
  },

  {
    chapterNumber: 23,
    title: "Words and Expressions 2 – Unit 9",
    subject: "English",
    grade: "10",
    board: "CBSE",
    unit: "Words and Expressions 2",
    examMarks: 5,
    estimatedWeeks: 1,
    overview: "Final grammar unit: editing, omission, gap-filling. Writing: formal email, report writing.",
    sections: [
      {
        sectionNumber: "Grammar",
        title: "Editing + Omission + Gap Filling",
        microConcepts: [
          { title: "Editing: identify and correct one error per line (spelling, grammar, punctuation)" },
          { title: "Omission: identify where a word is missing and supply it" },
          { title: "Gap filling: fill blanks with appropriate word (preposition, article, modal, connective)" },
        ],
      },
      {
        sectionNumber: "Writing",
        title: "Report Writing + Formal Email",
        microConcepts: [
          { title: "Report: TITLE (in caps) | By (reporter) | Date | Introduction | Findings | Conclusion" },
          { title: "Email format: To, Subject, Salutation, Body, Closing" },
          { title: "Formal email: professional tone, clear subject line, concise" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "Report format: TITLE | By | Date | Opening para | Body | Conclusion",
      "Editing: read for meaning first, then check grammar rules",
    ],
    examTips: [
      "Editing/omission: worth 4 marks each in board exam — never skip; check tense, articles, prepositions",
      "Report vs Article: report is in third person, objective, dated; article can be first person, opinionated",
    ],
    exercises: [
      { exerciseNumber: "Unit 9 Exercises", questionCount: 10, types: ["Grammar", "Writing"] },
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
    await Chapter.findOneAndUpdate(
      { subject: ch.subject, grade: ch.grade, board: ch.board, chapterNumber: ch.chapterNumber },
      ch,
      { upsert: true, new: true }
    );
    const action = "✓";
    console.log(`  ${action} Ch${ch.chapterNumber} [${ch.unit}] — ${ch.title}`);
    inserted++;
  }

  console.log(`\nDone: ${inserted} chapters seeded`);
  console.log("Chapters by unit:");
  const byUnit = CHAPTERS.reduce((acc, c) => { acc[c.unit] = (acc[c.unit] || 0) + 1; return acc; }, {});
  Object.entries(byUnit).forEach(([u, n]) => console.log(`  ${u}: ${n} chapters`));
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
