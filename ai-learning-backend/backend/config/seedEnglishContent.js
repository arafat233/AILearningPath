/**
 * Seed: English NcertTopicContent — 35 topics
 * Books: First Flight (9 prose + 8 poems = 17) | Footprints Without Feet (9) | Workbook (9)
 * Source: CBSE Class 10 NCERT textbooks (2026-27 edition)
 * Usage: node config/seedEnglishContent.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const TOPICS = [

  // ═══════════════════════════════════════════════════════════════════════════
  // FIRST FLIGHT — PROSE
  // ═══════════════════════════════════════════════════════════════════════════

  {
    topicId: "eng_ff_ch1_prose",
    name: "A Letter to God — G.L. Fuentes",
    subject: "English",
    chapterNumber: 1,
    prerequisite_knowledge: ["Basic reading comprehension", "Understanding of irony"],
    key_formulas: [
      "Irony: when an outcome is opposite to what is expected",
      "Dramatic irony: reader/audience knows what a character does not",
      "Theme of blind faith vs reality",
      "Lencho wrote 'To God' on envelope — postmaster's role as compassionate human",
    ],
    teaching_content: {
      intuition: "A deeply faithful farmer loses everything to a hailstorm and turns to God for help — but the human help he receives makes him angrier, not more grateful. The story asks: is unshakeable faith a virtue or a blindspot?",
      process_explanation: "Lencho is a Mexican farmer whose corn and bean crops are destroyed by a hailstorm. He writes a letter to God asking for 100 pesos. The postmaster, moved by Lencho's faith, collects 70 pesos from employees and friends, stamps the envelope and sends it. When Lencho receives only 70 pesos, he assumes the post office employees stole 30 pesos from God, and writes another angry letter. Key literary technique: dramatic irony — the reader knows where the money came from but Lencho does not.",
      worked_example: "Board-style question: 'What did Lencho mean when he wrote that the rest of the money must not have come through the post office employees?' Answer: Lencho had absolute faith in God and believed God had sent the 100 pesos. Since he received only 70, he assumed the honest post office workers (who in fact were the givers) had stolen the remaining 30 pesos. This is the story's central irony.",
      common_misconceptions: [
        "Lencho's faith is admirable — the story actually critiques blind faith that ignores human kindness",
        "The postmaster was Lencho's friend — they had no prior relationship; the postmaster acted out of compassion for a stranger",
        "God actually sent the money — the money came from the postmaster and his employees collecting it",
      ],
      shortcuts_and_tricks: [
        "Remember: 100 pesos asked → 70 pesos sent (postmaster collected from employees) → Lencho thinks 30 stolen",
        "Character trio: Lencho (faith), Postmaster (compassion), Employees (kindness)",
        "Theme keywords: faith, irony, kindness, ingratitude",
        "Lencho's character: hardworking + deeply faithful + ultimately ungrateful",
      ],
      diagram_description: "none",
      key_takeaway: "Human kindness can be mistaken for divine intervention when faith overrides reason. The story explores irony, blind faith, and the generosity of ordinary people through Lencho's misplaced anger at his benefactors.",
    },
  },

  {
    topicId: "eng_ff_ch2_prose",
    name: "Nelson Mandela: Long Walk to Freedom",
    subject: "English",
    chapterNumber: 2,
    prerequisite_knowledge: ["Knowledge of apartheid in South Africa", "Autobiography as a literary form"],
    key_formulas: [
      "Apartheid: racial segregation policy in South Africa (1948–1994)",
      "ANC: African National Congress — led freedom struggle",
      "Inauguration: 10 May 1994 — Mandela became first black president",
      "Twin obligations: obligations to family AND to people/country",
    ],
    teaching_content: {
      intuition: "Nelson Mandela's inauguration speech describes the end of apartheid and the birth of a new democratic South Africa. The excerpt captures the historic moment when Mandela became President and reflects on the long struggle for freedom.",
      process_explanation: "The excerpt is from Mandela's autobiography 'Long Walk to Freedom'. It describes the inauguration ceremony on 10 May 1994 in Pretoria. Three deputy presidents were sworn in before Mandela. Mandela reflects on the meaning of freedom — first as a personal desire, then as a desire for all people. He distinguishes between the courage of heroes (ANC leaders) and the cowardice of oppressors. Key idea: freedom is indivisible — the oppressor is also not free.",
      worked_example: "Board question: 'What does Mandela mean by twin obligations?' Answer: Every man has twin obligations — one to his family (parents, wife, children), and one to his people, his community, and his country. Under apartheid, fulfilling either obligation was impossible for a Black man. Mandela could not fulfil his family obligations without being a criminal, and could not live as a human being without violating the law.",
      common_misconceptions: [
        "Mandela was in prison for 27 years — he was in prison on Robben Island for 27 years, not 30",
        "Apartheid ended when Mandela was released — it ended with the 1994 elections when he became president",
        "Mandela talks only about his own freedom — the text explicitly says freedom of the people is more important",
      ],
      shortcuts_and_tricks: [
        "Three deputy presidents: Thabo Mbeki, F.W. de Klerk — remember the ceremony details",
        "Key distinction: courage (ANC fighters) vs cowardice (oppressors) — opposite to what society said",
        "Mandela's definition of freedom evolved: personal freedom → freedom for all",
        "The brightest ray of hope mentioned: seeing South African military generals salute him — former enemies",
      ],
      diagram_description: "none",
      key_takeaway: "Mandela's inauguration speech marks the birth of democratic South Africa. He redefines freedom as not merely personal liberty but as collective dignity for all people, oppressed and oppressor alike — because an oppressor who denies freedom to others is also enslaved by hatred.",
    },
  },

  {
    topicId: "eng_ff_ch3_prose",
    name: "Two Stories about Flying",
    subject: "English",
    chapterNumber: 3,
    prerequisite_knowledge: ["Understanding of theme and symbolism", "Narrative structure"],
    key_formulas: [
      "His First Flight: fear → temptation → action → triumph",
      "Black Aeroplane: mystery, unreliable narrator, unknown saviour",
      "Both stories share theme of overcoming challenges through courage/help",
    ],
    teaching_content: {
      intuition: "Two very different flying stories united by a common theme: facing the unknown. The first is about a young seagull overcoming fear of flight; the second is a mysterious encounter of a pilot with an unknown aircraft.",
      process_explanation: "Story 1 — His First Flight (Liam O'Flaherty): A young seagull is alone on a ledge, too afraid to fly while his siblings have already flown. His mother tempts him with a piece of fish but withdraws it as he lunges — forcing him to spread his wings and fly. The seagull overcomes fear through hunger/temptation. Story 2 — Black Aeroplane (Frederick Forsyth): A pilot flying from Paris to England at night sees storm clouds and diverts. A mysterious black aeroplane appears in the clouds and guides him to safety. At the control room, there is no record of any other plane — the identity of the pilot who saved him remains unknown.",
      worked_example: "Board question: 'What was the 'black aeroplane' and who was the pilot?' Answer: This is left mysterious — there is no answer in the story. The control room had no record of any other aircraft. The story leaves the question open, suggesting the mysterious pilot may have been a guardian angel, an illusion, or something beyond explanation. The story explores the mystery of the unknown saviour.",
      common_misconceptions: [
        "The seagull was pushed off the ledge — his mother tempted him with fish and withheld it; he lunged and flew on his own",
        "The black aeroplane pilot is identified — the story deliberately leaves the identity mysterious",
        "The two stories are by the same author — His First Flight is by Liam O'Flaherty; Black Aeroplane by Frederick Forsyth",
      ],
      shortcuts_and_tricks: [
        "Seagull story: fear → hunger → temptation → lunge → flight → triumph (celebrated by family)",
        "Black Aeroplane: Paris → storm → mystery aircraft → safe landing → no record at control",
        "Theme: courage, overcoming fear, mysterious help",
        "Authors: O'Flaherty (seagull), Forsyth (aeroplane)",
      ],
      diagram_description: "none",
      key_takeaway: "Both stories explore how facing the unknown leads to growth. The seagull's flight teaches that courage often needs a push; the Black Aeroplane story reminds us that some help comes from mysterious, unexplained sources.",
    },
  },

  {
    topicId: "eng_ff_ch4_prose",
    name: "From the Diary of Anne Frank",
    subject: "English",
    chapterNumber: 4,
    prerequisite_knowledge: ["World War II context", "Diary as a literary form", "Holocaust"],
    key_formulas: [
      "Anne Frank: German-born Jewish girl, born 12 June 1929",
      "Diary named 'Kitty' — Anne's imaginary friend and confidante",
      "Hid in Amsterdam for 25 months during Nazi occupation",
      "Theme: loneliness, self-expression, the power of writing",
    ],
    teaching_content: {
      intuition: "Anne Frank's diary is one of the most powerful personal documents of World War II. The NCERT excerpt focuses on why she kept a diary and her loneliness — revealing a thoughtful, creative girl hidden from the world.",
      process_explanation: "The excerpt begins with Anne explaining why she started a diary: she had no real friend to confide in — she had many acquaintances but no true friend. She names her diary 'Kitty'. She reflects on why people write diaries (paper is more patient than people). Anne then writes about the essay on 'Chatterbox' she had to write as punishment for talking in class — she wrote three essays using increasingly creative arguments. Anne's writing shows her intelligence, wit, and resilience despite living in hiding.",
      worked_example: "Board question: 'Why does Anne think she can confide more in her diary than in people?' Answer: Anne felt that paper is more patient than people. She did not have a true friend or confidante. Though she had many acquaintances, none could be a real friend. She decided to write in her diary because she could express herself fully without fear of judgment or misunderstanding.",
      common_misconceptions: [
        "The excerpt is about the Holocaust directly — it focuses on Anne's personal reflections and her relationship with writing/diary",
        "Kitty was Anne's real friend — Kitty is the name Anne gave her diary, an imaginary friend",
        "Anne was rescued — Anne died in Bergen-Belsen concentration camp in early 1945",
      ],
      shortcuts_and_tricks: [
        "Three essays on 'Chatterbox': 1st in prose, 2nd as poem, 3rd as a dialogue — increasing creativity to avoid punishment",
        "Anne's character: witty, intelligent, lonely, introspective, creative",
        "Theme: the diary as a companion and self-expression tool for a lonely girl",
        "Anne's father Otto Frank survived and published the diary",
      ],
      diagram_description: "none",
      key_takeaway: "Anne Frank's diary reveals how writing can be a refuge and a companion for those who feel misunderstood. Her intellect and humour shine through even in the darkest of circumstances — the diary became her truest friend.",
    },
  },

  {
    topicId: "eng_ff_ch5_prose",
    name: "Glimpses of India",
    subject: "English",
    chapterNumber: 5,
    prerequisite_knowledge: ["India's regional diversity", "Portuguese influence in Goa", "Tea cultivation"],
    key_formulas: [
      "Baker from Goa: paders — Portuguese heritage, bread is central to Goan life",
      "Coorg: Scotland of India, coffee estates, martial tradition, Alexander the Great theory",
      "Tea from Assam: Rajvir and Pranjol, origin legends of tea (China and India), tea estates",
    ],
    teaching_content: {
      intuition: "Three short pieces paint India's cultural diversity through specific regional identities: Goa's Portuguese bread heritage, Coorg's martial landscape, and Assam's tea culture.",
      process_explanation: "Part I — A Baker from Goa (Lucio Rodrigues): Describes the bread-seller (pader) of Goa, a Portuguese legacy. Bakers wore a distinctive dress (kabai — long frock) and carried a bamboo staff to announce their arrival. Bread is central to Goan celebrations and daily life. Part II — Coorg (Lokesh Abrol): Coorg (Kodagu) is a district of Karnataka, called the Scotland of India. Coffee and spice plantations, river Kaveri origins, martial tradition of Kodavas. Theory that Coorg people are descendants of Alexander's army. Part III — Tea from Assam (Arup Kumar Datta): Rajvir goes to his friend Pranjol's home in Assam. Rajvir is fascinated by tea. Two legends about tea's origin: Chinese emperor (boiled water, tea leaf fell in) and Indian monk Bodhidharma (cut off eyelids, tea plant grew). Assam produces 6.8 billion kg of tea per year.",
      worked_example: "Board question: 'Why is Coorg called the Scotland of India?' Answer: Coorg resembles Scotland in its lush, green landscape, mist-covered hills, coffee and spice plantations, and rolling topography. It is also known for its brave, martial people (like Scottish highlanders) and its connection to river origins (Kaveri, like Scottish rivers). The region's misty, dramatic scenery and army tradition complete the comparison.",
      common_misconceptions: [
        "Paders are called bakers everywhere in India — pader is a Goan-Portuguese word specific to Goa",
        "Coorg is in Goa — Coorg (Kodagu) is in Karnataka",
        "Tea originated only in China — the text gives two legends: Chinese (emperor) and Indian (monk Bodhidharma)",
      ],
      shortcuts_and_tricks: [
        "Baker from Goa: kabai (long frock), bamboo staff, bread essential for births/marriages/festivals",
        "Coorg: Scotland of India, Kaveri origin, martial tradition, Alexander theory, coffee estates",
        "Tea origin: China (emperor's boiling water) + India (Bodhidharma's eyelids)",
        "Assam: 6.8 billion kg tea/year, Rajvir and Pranjol characters",
      ],
      diagram_description: "none",
      key_takeaway: "India's regional cultures carry their own unique histories and traditions. Goa's Portuguese bread, Coorg's warrior heritage, and Assam's tea plantations are glimpses into the country's extraordinary diversity.",
    },
  },

  {
    topicId: "eng_ff_ch6_prose",
    name: "Mijbil the Otter",
    subject: "English",
    chapterNumber: 6,
    prerequisite_knowledge: ["Understanding of autobiographical writing", "Animal behaviour"],
    key_formulas: [
      "Maxwell's otter came from the marshes of Iraq (Tigris river)",
      "Mijbil named after an Iraqi family, called Mij for short",
      "Mij invented his own game with a marble on the bath rim — shows intelligence",
      "Maxwell coined 'Maxwell's Otter' as a new otter species",
    ],
    teaching_content: {
      intuition: "Gavin Maxwell's account of his otter Mijbil is a warm, humorous piece about forming an unexpected bond with a wild animal. It explores how animals develop distinct personalities through play and interaction.",
      process_explanation: "Maxwell went to Iraq (Basra) in 1956 and was given an otter by a friend. The otter was unfamiliar in appearance — later identified as a new subspecies 'Maxwell's Otter'. He names it Mijbil (Mij). In Basra, Mij loved the bathtub and invented a game rolling a marble around the bath rim. Maxwell had to travel to England — the airline initially refused Mij, then allowed him in a canvas bag. In the aircraft, Mij escaped from the box and caused chaos before settling. In London, Mij attracted curious people who tried to identify it (a 'baby seal', a 'squirrel', etc.) — Maxwell concluded that keeping an otter in a city requires explaining the animal to every passerby.",
      worked_example: "Board question: 'What happened on the flight from Basra to Paris?' Answer: Maxwell had bought a ticket for Mij to travel in a small suitcase in the cabin. As the plane took off, Mij tore open the box and disappeared. Maxwell searched frantically while passengers screamed. Mij eventually emerged from under a woman's skirt and climbed up Maxwell himself. After this initial chaos, Mij settled quietly and caused no more trouble.",
      common_misconceptions: [
        "Mij was a dog — Mij was an otter, a semi-aquatic mammal",
        "Maxwell found Mij in England — Maxwell got Mij in the Tigris marshes of Iraq (Basra)",
        "Londoners correctly identified Mij — they guessed 'baby seal', 'squirrel', 'beaver', 'a hippo' — none were correct",
      ],
      shortcuts_and_tricks: [
        "Maxwell's Otter = new subspecies; Mijbil/Mij = individual otter's name",
        "Mij's games: bathtub frolics, marble rolling on bath rim (self-invented)",
        "Flight chaos: box torn open, otter vanished, emerged from under woman's skirt",
        "London reactions: people's wrong guesses about Mij's species",
      ],
      diagram_description: "none",
      key_takeaway: "Mijbil the Otter shows how animals can form genuine bonds with humans and develop individual personalities. Maxwell's account is both comic and tender, celebrating the joy and challenge of forming a relationship with a wild creature.",
    },
  },

  {
    topicId: "eng_ff_ch7_prose",
    name: "Madam Rides the Bus",
    subject: "English",
    chapterNumber: 7,
    prerequisite_knowledge: ["Short story comprehension", "Symbolism of childhood and growing up"],
    key_formulas: [
      "Valli: eight-year-old girl fascinated by the bus passing her street",
      "She saved 60 paise for the 30-paise one-way bus fare to the town",
      "She saw a dead cow on the road — her first encounter with death",
      "Theme: loss of innocence, the transition from childhood wonder to adult reality",
    ],
    teaching_content: {
      intuition: "A curious eight-year-old saves up her pocket money to ride the bus to town — a small adventure that brings her face to face with mortality for the first time. The story is a gentle, moving portrait of childhood's end.",
      process_explanation: "Valli watches the bus passing her street every hour with great fascination. She gathers information about fares (30 paise one way) and saves up. She boards the bus alone to the town, interacting with the conductor and passengers (who call her 'madam'). On the way there, she sees a young cow prancing on the road and finds it funny. On the return journey, she sees the same cow lying dead, struck by a vehicle. The sight deeply disturbs Valli — her earlier laughter becomes sadness. She returns home quietly and avoids telling her mother about the trip. The story suggests that her adventure changed her: she now understands that life contains loss and death alongside joy.",
      worked_example: "Board question: 'Why does Valli refuse the conductor's offer of cold drinks?' Answer: Valli had carefully saved exactly 60 paise for the return bus journey. She had no extra money and did not want to spend what she had carefully saved. She was proud of her independence and planning, and accepting the gift would have felt like charity or a loss of her self-sufficiency.",
      common_misconceptions: [
        "Valli told her mother about the trip — she kept the journey completely secret",
        "Valli was upset throughout the journey — she was excited and happy on the way there; the dead cow disturbed her on the way back",
        "The cow is a minor detail — the dead cow is the story's central symbol of death and lost innocence",
      ],
      shortcuts_and_tricks: [
        "Valli's savings: pocket money + resisted peppermints + toys + merry-go-round = 60 paise",
        "Going trip: excited, laughed at cow prancing | Return trip: sees dead cow, becomes sad and quiet",
        "Conductor calls her 'madam' — irony; she is a child acting grown-up",
        "Theme: Childhood innocence → first encounter with death → quiet maturity",
      ],
      diagram_description: "none",
      key_takeaway: "Valli's bus ride is a metaphor for growing up. Her first taste of independence brings her face to face with death, transforming her innocent excitement into quiet, thoughtful sorrow — the bittersweet end of childhood's blissful ignorance.",
    },
  },

  {
    topicId: "eng_ff_ch8_prose",
    name: "The Sermon at Benares",
    subject: "English",
    chapterNumber: 8,
    prerequisite_knowledge: ["Buddhism basics", "Sermon as a literary form"],
    key_formulas: [
      "Kisa Gotami: young mother, baby dies, seeks medicine to revive him",
      "Buddha asks for mustard seed from house with NO death — impossible",
      "Lesson: death is universal; grief must be endured, not escaped",
      "Sermon on the Mount (Biblical) vs Sermon at Benares (Buddhist) — compare",
    ],
    teaching_content: {
      intuition: "The Buddha's sermon to a grieving mother is one of the most compassionate teachings in world literature — he doesn't lecture her about death; instead, he sends her on a journey that lets her discover the universal truth of mortality herself.",
      process_explanation: "Prince Siddhartha Gautama left his palace after seeing suffering (old age, illness, death) and became the Buddha. The text focuses on his sermon to Kisa Gotami. Kisa Gotami's only son died. Grief-stricken, she carried the dead child and asked for medicine. Someone suggested she go to the Buddha. The Buddha asked her to bring a mustard seed from a house where no one had ever died. She went from house to house and found that every family had experienced death. She understood that death is universal and that grief must be accepted. She buried her child and returned to the Buddha. The Buddha's sermon: the selfish man does not find peace, but the wise person who understands impermanence finds peace.",
      worked_example: "Board question: 'What is the teaching of the Buddha in this story?' Answer: The Buddha's teaching is that death is universal and inevitable. Grief at the loss of a loved one is natural, but clinging to the dead and refusing to accept loss brings only more suffering. Kisa Gotami's journey from house to house taught her that every family has known death — she was not alone in her grief. Peace comes from accepting impermanence, not from avoiding it.",
      common_misconceptions: [
        "The Buddha gave Kisa Gotami medicine — he sent her on a quest; no medicine was given",
        "Kisa Gotami found a house with no death — she did not; she realised death is universal",
        "The Buddha lectured Kisa Gotami harshly — he was compassionate; he used the quest to teach gently",
      ],
      shortcuts_and_tricks: [
        "Mustard seed = universal symbol; no house had never seen death",
        "Buddha's method: experiential learning through the quest, not direct lecture",
        "Stages: grief → quest → realisation → acceptance → burial → peace",
        "Key quote: 'Not from weeping nor from grieving will any one obtain peace of mind'",
      ],
      diagram_description: "none",
      key_takeaway: "The Buddha's compassionate method — sending the grieving Kisa Gotami to find an impossible mustard seed — teaches that grief is universal and that wisdom comes from accepting mortality, not from magical remedies.",
    },
  },

  {
    topicId: "eng_ff_ch9_prose",
    name: "The Proposal — Anton Chekhov",
    subject: "English",
    chapterNumber: 9,
    prerequisite_knowledge: ["One-act play format", "Comic techniques — farce, exaggeration"],
    key_formulas: [
      "Ivan Lomov comes to propose to Natalya — both families approve",
      "Quarrel #1: ownership of Oxen Meadows (Lomov vs Natalya)",
      "Quarrel #2: whose dog is better — Squeezer (Lomov) vs Guess (Chubukov)",
      "Theme: satire on the landed gentry, human pettiness, love vs property",
    ],
    teaching_content: {
      intuition: "Chekhov's brilliant one-act farce shows two people who want to get married but can't stop arguing long enough to say so. It satirises the Russian landed gentry's obsession with property and status over genuine human connection.",
      process_explanation: "Ivan Lomov, 35, nervous and sickly, arrives at neighbour Chubukov's house in formal attire intending to propose to his daughter Natalya. Chubukov misunderstands and thinks Lomov wants a loan. When Natalya realises Lomov came to propose, the mood changes — but then they argue about Oxen Meadows (each family claims the land). Chubukov joins in against Lomov. Lomov leaves with palpitations. Natalya learns Lomov came to propose and insists Chubukov bring him back. Lomov returns but soon they argue about dogs — whose dog Squeezer or Guess is better. During this second quarrel, Lomov collapses. Natalya panics thinking he's dead, but Lomov revives. In the chaos, Chubukov puts their hands together and declares them engaged — even as they resume arguing.",
      worked_example: "Board question: 'What are the two main quarrels in 'The Proposal' and what do they reveal?' Answer: (1) Oxen Meadows — Lomov claims it belongs to his family; Natalya says it belongs to hers. (2) Dogs — Lomov says his dog Squeezer is better; Natalya argues Guess is superior. Both quarrels reveal how petty property disputes and ego can override genuine affection. Despite clearly caring for each other enough to want marriage, neither can resist arguing about trivial matters. Chekhov satirises the landed gentry's absurd priorities.",
      common_misconceptions: [
        "Lomov and Natalya dislike each other — they clearly want to marry; the quarrels are about ego and property, not dislike",
        "The play ends with genuine love — it ends with them arguing even as they are engaged; Chekhov's irony is intact",
        "Lomov is confident — he is extremely nervous, has palpitations, and nearly faints",
      ],
      shortcuts_and_tricks: [
        "Structure: Arrival → Misunderstanding → Meadows quarrel → Lomov leaves → brought back → Dogs quarrel → faint → engagement",
        "Characters: Lomov (nervous, 35, sickly), Natalya (argumentative but wants marriage), Chubukov (hot-tempered father)",
        "Farce elements: exaggerated reactions, fainting, rapid reversals, comic repetition",
        "Theme: satire on property obsession, pettiness, love despite quarrelling",
      ],
      diagram_description: "none",
      key_takeaway: "Chekhov's 'The Proposal' uses farce and exaggeration to satirise how human pettiness — arguments over land and dogs — can overshadow genuine affection. The couple gets engaged while still arguing, a perfect comic image of love among the Russian gentry.",
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // FIRST FLIGHT — POEMS
  // ═══════════════════════════════════════════════════════════════════════════

  {
    topicId: "eng_ff_ch1_poem",
    name: "Dust of Snow + Fire and Ice — Robert Frost",
    subject: "English",
    chapterNumber: 1,
    prerequisite_knowledge: ["Basic poetry analysis", "Symbolism", "Tone and mood"],
    key_formulas: [
      "Dust of Snow: crow, hemlock tree → negative symbols → unexpected positive effect",
      "Fire and Ice: fire = desire/passion; ice = hatred/indifference; both destroy the world",
      "Frost's minimalist style: few words, deep meaning",
    ],
    teaching_content: {
      intuition: "Two short Frost poems about how small, dark things (a crow, a wintry tree, fire, ice) can carry enormous symbolic weight about human emotions and human destruction.",
      process_explanation: "Dust of Snow: A crow shakes snow off a hemlock tree onto the poet. This trivial moment changes the poet's mood — from regret and gloom to joy. Negative symbols (crow = bad omen, hemlock = poisonous tree) produce a positive outcome. Poem suggests nature's power to shift human emotions unexpectedly. Fire and Ice: In just 9 lines, Frost asks whether the world will end in fire or ice. Fire represents desire/passion/greed; ice represents hatred/cold indifference. He states he has experienced both (desire for fire; hatred enough for ice). Either would suffice for destruction. The poem parallels scientific debates (sun expanding = fire) with emotional/moral ones.",
      worked_example: "Board question: 'What does 'fire' and 'ice' symbolise in Frost's poem?' Answer: In the poem 'Fire and Ice', fire symbolises desire, passion, and greed — the consuming, destructive force of unfulfilled human wants. Ice symbolises hatred, coldness, and indifference — equally capable of destruction but through a different means. Frost suggests that human vices (both excessive passion and cold hatred) are as capable of ending the world as any natural disaster.",
      common_misconceptions: [
        "Dust of Snow is a sad poem — it ends positively: the snow shower changes the poet's mood for the better",
        "The crow and hemlock are positive symbols — they are traditionally negative (crow = bad omen, hemlock = death) but used ironically to produce good",
        "Fire and Ice is only about science — it is primarily about human emotions and moral failings",
      ],
      shortcuts_and_tricks: [
        "Dust of Snow = 2 stanzas × 4 lines; crow + hemlock = dark symbols with bright outcome",
        "Fire and Ice = fire (desire), ice (hate), world ends either way",
        "Frost's style: simple language, complex meaning, nature as emotional mirror",
        "Key words: 'rued' = felt regret; 'suffice' = be enough",
      ],
      diagram_description: "none",
      key_takeaway: "Frost uses ordinary nature imagery — a crow, snow, fire, ice — to explore the deepest human emotions and our capacity for self-destruction. Simple moments carry profound truths about desire, hatred, and the way unexpected small events can rescue a mood.",
    },
  },

  {
    topicId: "eng_ff_ch2_poem",
    name: "A Tiger in the Zoo — Leslie Norris",
    subject: "English",
    chapterNumber: 2,
    prerequisite_knowledge: ["Imagery", "Contrast", "Freedom and captivity themes"],
    key_formulas: [
      "Contrast: tiger in forest (natural, free) vs tiger in zoo (caged, stripped of dignity)",
      "Stanza structure: alternates between what the tiger should be doing and what it is doing",
      "Mood: anger → resignation → silent suffering",
    ],
    teaching_content: {
      intuition: "The poem is a meditation on captivity through the eyes of a tiger — comparing the wild, powerful life the tiger should lead to the restricted, undignified reality of a zoo cage.",
      process_explanation: "Leslie Norris's poem contrasts two states: (1) The tiger in the wild — stalking prey at forest's edge, terrorising villages, swimming in water, sliding through reeds. (2) The tiger in the zoo — pacing a few steps behind bars, ignoring visitors, looking at stars at night. The poem suggests the zoo strips the tiger of its natural purpose and dignity. The tiger's quiet at night (staring at stars) is interpreted as longing for freedom. The poem uses soft imagery (velvet quiet) for captivity and forceful imagery (snarling, baring fangs) for the wild. No direct protest — the contrast itself makes the argument against captivity.",
      worked_example: "Board question: 'How does the poet contrast the tiger in the zoo with the tiger in the wild?' Answer: In the wild, the tiger stalks prey near the village's edge, shows its 'strength behind bars' through growling, slides through water and lurks in shadow — powerful, purposeful, fearsome. In the zoo, the tiger paces a cage in 'few steps of his cage', is ignored by visitors, and at night stares quietly at stars. The contrast emphasises the loss of dignity and freedom, turning a creature of power into an exhibit.",
      common_misconceptions: [
        "The poem is sympathetic to zoos — it clearly criticises captivity through contrast",
        "The tiger is content in the zoo — the poem shows quiet suffering; staring at stars suggests longing",
        "The poem is written in the tiger's voice — it is written in third person, describing the tiger",
      ],
      shortcuts_and_tricks: [
        "Stanza 1: tiger should stalk deer near village | Stanza 2: tiger in cage, ignoring visitors",
        "Stanza 3: should swim/lurk in wild | Stanza 4: stares at brilliant stars at night — longing",
        "Key contrast: velvet quiet (captivity) vs terrorising village (freedom)",
        "Theme: freedom, dignity, captivity, human vs animal rights",
      ],
      diagram_description: "none",
      key_takeaway: "Leslie Norris's poem indicts captivity without melodrama — simply by contrasting the tiger's natural power and freedom with its quiet, undignified pacing in a zoo. The tiger's midnight gaze at stars becomes a silent protest for lost freedom.",
    },
  },

  {
    topicId: "eng_ff_ch3_poem",
    name: "How to Tell Wild Animals + The Ball Poem",
    subject: "English",
    chapterNumber: 3,
    prerequisite_knowledge: ["Humour and irony in poetry", "Tone", "Coming-of-age themes"],
    key_formulas: [
      "How to Tell Wild Animals (Carolyn Wells): satirical, humorous poem — identify animals by how they attack you",
      "The Ball Poem (John Berryman): loss of ball = first experience of loss; learning to cope with loss",
      "Humour vs gravity: two very different tones in the same unit",
    ],
    teaching_content: {
      intuition: "Two contrasting poems: one is delightfully absurd (identify tigers by being attacked), the other is quietly profound (a boy learns about loss through a bouncing ball).",
      process_explanation: "How to Tell Wild Animals: Carolyn Wells satirises guidebooks and field manuals. She describes how to identify animals 'if you see an animal of the jungle, it will maul you — so you'll know it's a Bengal Tiger'. The humour comes from reversing the normal order: instead of identification leading to encounter, the encounter itself identifies the animal. Animals: Bengal Tiger, lion (Asian), bear, hyena (laughs), chameleon, croc, etc. Each stanza is comic, ending with 'if you're still alive — that's a (specific animal)'. The Ball Poem: A boy loses his ball and watches it disappear into the water. The poet says we should not retrieve it — the loss is the lesson. The ball represents all things lost in life. The boy must learn that 'epistemology of loss' — how to stand up after losing what you love. A meditation on growing up.",
      worked_example: "Board question: 'What does the ball in 'The Ball Poem' symbolise?' Answer: The ball symbolises the boy's innocence, carefree childhood, and the things we cherish but inevitably lose. The loss of the ball is the boy's first lesson in accepting that some things cannot be recovered. The poem argues that allowing the boy to feel and process this loss (not buying him another ball) teaches him how to cope with all the future losses of life — money, loved ones, opportunities.",
      common_misconceptions: [
        "How to Tell Wild Animals is a serious nature poem — it is purely comic and satirical",
        "The poet should rescue the ball for the boy — the poem explicitly says we should not; the loss is the point",
        "The Ball Poem is about a specific boy — it is universal; 'I am not there' means the narrator steps back to let the boy learn",
      ],
      shortcuts_and_tricks: [
        "Wells: Bengal Tiger (stripes, awful bellow), lion (doesn't discriminate, falls on you), croc (weeps with tears), chameleon (no ears, tail)",
        "Berryman: ball bounces → into water → gone → boy stands rigid → must learn 'epistemology of loss'",
        "Ball = childhood possessions + innocence + things we lose as we grow",
        "Key phrase: 'the world of possessions' — the boy enters it by learning loss",
      ],
      diagram_description: "none",
      key_takeaway: "Two tones, one truth: Carolyn Wells makes us laugh at how we encounter the wild; Berryman makes us grieve with a boy who learns his first lesson in loss. Poetry can be both comic and profound.",
    },
  },

  {
    topicId: "eng_ff_ch4_poem",
    name: "Amanda! — Robin Klein",
    subject: "English",
    chapterNumber: 4,
    prerequisite_knowledge: ["Dramatic monologue", "Child psychology", "Freedom and imagination"],
    key_formulas: [
      "Structure: adult's instructions (in brackets?) and Amanda's inner world alternating",
      "Amanda imagines: mermaid, orphan, Rapunzel — all involve freedom from authority",
      "Theme: childhood imagination as escape from adult control and nagging",
    ],
    teaching_content: {
      intuition: "An adult nags Amanda to stop slouching, stop biting nails, stop eating chocolate, clean her room — while Amanda retreats deeper and deeper into a fantasy world of mermaids and orphans where no one controls her.",
      process_explanation: "The poem alternates between an adult's instructions/corrections and Amanda's imagined responses. The adult: Don't hunch your shoulders; Don't bite your nails; Don't eat chocolate; Did you finish your homework? Clean your room. Amanda imagines: being a mermaid in a calm, bright sea; being an orphan roaming free; being Rapunzel in a tower (who would never let her hair down). The irony in the Rapunzel verse: Rapunzel's tower is normally a prison but Amanda imagines it as freedom — because it has no adult nagging. The poem ends with the adult accusing Amanda of 'sulking' when she is actually in her imagination. Theme: children need space, not constant correction; excessive parenting can stifle rather than nurture.",
      worked_example: "Board question: 'What does Amanda's silence indicate?' Answer: Amanda's silence is not sulking as the adult claims — it is her retreat into imagination. She has learned to create an inner world of freedom (mermaids, orphans, towers) as an escape from constant adult instructions. Her silence represents quiet resilience and imagination as a coping mechanism. The adult's accusation of sulking shows a lack of understanding of the child's inner world.",
      common_misconceptions: [
        "Amanda is being disobedient — she is not rebelling; she is quietly retreating into imagination",
        "Rapunzel's tower is a prison — in Amanda's imagination it is freedom because no adult is there",
        "The poem blames parents — it gently critiques excessive nagging; it is not a harsh condemnation",
      ],
      shortcuts_and_tricks: [
        "Amanda's three fantasies: mermaid (calm sea) → orphan (free roads) → Rapunzel (tower = no nagging)",
        "Adult instructions: slouching, nails, chocolate, homework, room, acne, attention",
        "Irony: Rapunzel's tower as freedom (normally imprisonment)",
        "Theme: children's need for imagination and freedom from over-correction",
      ],
      diagram_description: "none",
      key_takeaway: "Robin Klein's poem speaks for every child who has tuned out adult nagging to live inside a richer inner world. Amanda's imagined freedom — as mermaid, orphan, or Rapunzel — shows the power of imagination when external space is denied.",
    },
  },

  {
    topicId: "eng_ff_ch5_poem",
    name: "The Trees — Adrienne Rich",
    subject: "English",
    chapterNumber: 5,
    prerequisite_knowledge: ["Extended metaphor", "Feminist literary theory (optional)", "Symbolism"],
    key_formulas: [
      "Trees inside house → moving out to forest overnight",
      "Trees = women / oppressed groups (feminist reading)",
      "The house = domestic space of confinement; forest = freedom and natural purpose",
      "Rich: American feminist poet; trees as metaphor for liberation",
    ],
    teaching_content: {
      intuition: "On the surface, trees in a house are deciding to leave for the forest. Below the surface, Adrienne Rich — a feminist poet — describes the quiet, determined movement of the oppressed toward freedom.",
      process_explanation: "The poem describes trees that have been living inside a house (roots working free of cramped conditions, boughs straining toward the glass). The poet is writing letters in another room while this happens. By morning, the trees have gone — the house is empty, open to the forest. The moon shines through empty boughs into the house. The last stanza: the poet sees new leaves and branches in the new sky. On one level: a literal naturalistic description of trees. On another level (Rich's feminist reading): trees = women who have been kept indoors, denied natural growth, domesticated. Their 'departure' is an act of reclaiming natural space and purpose. The night movement is quiet, determined, unstoppable.",
      worked_example: "Board question: 'What is the central message of the poem 'The Trees'?' Answer: On the surface, the poem describes trees moving from indoors to the forest overnight. At a deeper level, the poem symbolises the movement of the oppressed (particularly women, in Rich's feminist reading) from confinement to freedom. The trees — cramped, stunted, their roots working free — represent people who have been kept in limited spaces and are quietly but powerfully reclaiming their natural purpose and freedom.",
      common_misconceptions: [
        "The poem is only about actual trees — it is an extended metaphor for liberation",
        "The trees are running away — they are slowly, determinedly moving; it is a metaphor for quiet persistence",
        "The house is described negatively — the house itself is neutral; it is the confinement that is the issue",
      ],
      shortcuts_and_tricks: [
        "Trees = confined beings (women/oppressed); house = confinement; forest = freedom",
        "Night imagery: quiet, unstoppable movement; moon = witness to liberation",
        "Rich is a feminist poet — this context enriches the reading but is not required for board answers",
        "Key images: roots working loose, boughs straining, empty house, new sky with branches",
      ],
      diagram_description: "none",
      key_takeaway: "Adrienne Rich's 'The Trees' operates on two levels — a literal naturalistic scene and a feminist metaphor for liberation. The trees' quiet departure from the house to the forest represents the unstoppable movement toward freedom that no confinement can permanently hold.",
    },
  },

  {
    topicId: "eng_ff_ch6_poem",
    name: "Fog — Carl Sandburg",
    subject: "English",
    chapterNumber: 6,
    prerequisite_knowledge: ["Imagism in poetry", "Extended metaphor", "Short poems"],
    key_formulas: [
      "Fog compared to a cat — sits, looks, moves on",
      "Imagism: concrete image to evoke emotion/idea without explanation",
      "Sandburg: American modernist poet; free verse, no rhyme",
    ],
    teaching_content: {
      intuition: "Six lines. A city harbour. Fog that arrives, sits, and leaves — just like a cat. Carl Sandburg captures the essence of fog through a single, perfect comparison.",
      process_explanation: "The poem compares fog to a cat. The fog 'comes on little cat feet' — quiet, soft arrival. It 'sits looking over harbour and city on silent haunches' — the way a cat sits, surveying everything. Then it 'moves on' — the fog dissipates, just as a cat eventually leaves. The poem is a masterpiece of imagism: one extended metaphor, no rhyme, no moralising, no explanation. The power is in the compression. Sandburg captures exactly how fog moves — silently, slowly, lingering then gone. The comparison makes the abstract (fog) tangible (cat behaviour).",
      worked_example: "Board question: 'What comparison does Sandburg make in the poem Fog, and what effect does it create?' Answer: Sandburg compares fog to a cat. Like a cat, fog arrives silently ('little cat feet'), settles quietly and observingly ('sits on silent haunches'), and then departs without announcement ('moves on'). The comparison makes the fog seem alive, purposeful, and mysterious — giving what is an impersonal weather phenomenon a personality. It also captures the silence and gradual nature of both fog and cats perfectly.",
      common_misconceptions: [
        "The poem has a deep philosophical meaning — it is primarily imagistic; the beauty is in the precise comparison, not hidden meaning",
        "Sandburg is describing a cat — the cat is the vehicle of metaphor; the subject is fog",
        "The poem is too short to have literary value — brevity is its strength; imagism prizes compression",
      ],
      shortcuts_and_tricks: [
        "6 lines, free verse, one extended metaphor",
        "Cat actions: arrives quietly → sits and watches → moves on",
        "Fog actions: arrives quietly → lingers over harbour/city → dissipates",
        "Key phrases: 'little cat feet', 'silent haunches'",
      ],
      diagram_description: "none",
      key_takeaway: "Sandburg's 'Fog' is a perfect imagist poem — six lines that capture the precise movement and feeling of fog through a single luminous comparison to a cat. Its power lies entirely in the accuracy and economy of its central image.",
    },
  },

  {
    topicId: "eng_ff_ch7_poem",
    name: "The Tale of Custard the Dragon — Ogden Nash",
    subject: "English",
    chapterNumber: 7,
    prerequisite_knowledge: ["Ballad form", "Irony and satire", "Comic verse"],
    key_formulas: [
      "Custard: cowardly dragon who begs for a 'nice safe cage' but defeats the pirate",
      "Irony: the brave characters (Belinda, cat, mouse) all flee the pirate; cowardly Custard fights",
      "Ballad structure: repeated refrain, simple rhyme (AABB), comic tone",
    ],
    teaching_content: {
      intuition: "A supposedly cowardly dragon who cries for a safe cage turns out to be the only one brave enough to fight a pirate — while all the 'brave' companions run away. Nash's poem is a gentle satire on how we judge courage and cowardice.",
      process_explanation: "Belinda lives in a little white house with her pets: Ink (black kitten), Blink (grey mouse), Mustard (yellow dog), and Custard (the dragon). Custard is mocked by all for always wanting a 'nice safe cage' and calling for help. He is called a coward while all others boast of bravery. A pirate arrives — he has a pistol and a sword. All the brave ones (Belinda, Ink, Blink, Mustard) run away. Custard the coward gobbles up the pirate. Everyone then claims they too were brave (Mustard: as brave as a tiger; Ink: as brave as a lion). Only Custard admits he was afraid. The irony: real bravery was Custard's; the boasters' 'bravery' is retrospective cowardice.",
      worked_example: "Board question: 'What is the central irony in The Tale of Custard the Dragon?' Answer: The central irony is that Custard, who is mocked by all as a coward for asking for a 'safe cage', is the only one who actually fights the pirate. Belinda, the brave cat (Ink), the brave mouse (Blink), and the brave dog (Mustard) — who all boasted of their courage — flee in terror. After Custard defeats the pirate, they all resume their claims to bravery. True courage is shown by the supposedly cowardly dragon; the 'brave' companions are revealed as cowards.",
      common_misconceptions: [
        "Custard is a villain — Custard is the hero; he is the most courageous character",
        "The poem is critical of Custard — it celebrates Custard's genuine courage and satirises the others' false bravery",
        "Mustard the dog is yellow = cowardly — 'yellow' in Nash's poem refers to his fur; the irony is that mustard (yellow) dog runs away despite boasting bravery",
      ],
      shortcuts_and_tricks: [
        "Characters: Belinda (girl), Ink (cat), Blink (mouse), Mustard (dog), Custard (dragon)",
        "Pirate: pistols in both hands, a sword by his side, a black beard",
        "Refrain: Belinda is as brave as a barrel of bears (but she runs)",
        "Theme: real courage vs boasted courage; cowardice labelled can hide true bravery",
      ],
      diagram_description: "none",
      key_takeaway: "Nash's charming ballad proves that labels of bravery and cowardice can be entirely wrong. The 'cowardly' dragon who begs for a safe cage is the only character who acts when it matters — a delightful reminder not to judge by self-proclaimed courage.",
    },
  },

  {
    topicId: "eng_ff_ch8_poem",
    name: "For Anne Gregory — W.B. Yeats",
    subject: "English",
    chapterNumber: 8,
    prerequisite_knowledge: ["Love poetry", "Physical beauty vs inner beauty", "Dialogue in poetry"],
    key_formulas: [
      "Anne Gregory's yellow hair — her defining physical beauty that men love",
      "Anne says she can dye her hair brown, black, carrot — to be loved for herself",
      "Yeats: only God can love Anne for herself alone, not her yellow hair",
      "Theme: superficial love vs true love; appearance vs essence",
    ],
    teaching_content: {
      intuition: "A conversation between Yeats and Anne Gregory about whether it is possible to be loved for who you truly are — not for your beautiful yellow hair. Yeats concludes that only God is capable of this kind of pure love.",
      process_explanation: "The poem is a dialogue. Yeats tells Anne that young men are 'thrown into despair' by her yellow hair — they cannot see past her physical beauty to love her as a person. Anne responds that she could change her hair colour (brown, black, carrot) to make men love her real self. Yeats replies that he found proof that only God can love Anne 'for herself alone and not her yellow hair' — suggesting human love is inherently superficial, attracted to the physical. The poem questions whether purely selfless love is possible for humans, or if it is reserved for the divine.",
      worked_example: "Board question: 'What does the poem 'For Anne Gregory' say about human love?' Answer: The poem suggests that human love is inherently superficial — men love Anne for her beautiful yellow hair, not for who she truly is. When Anne proposes changing her hair colour to be loved for her inner self, Yeats replies that he found an old religious text proving that only God is capable of loving a person 'for herself alone and not her yellow hair'. The poem concludes that truly selfless love — based on the essence of a person rather than physical appearance — is a divine rather than human quality.",
      common_misconceptions: [
        "The poem is a love poem by Yeats for Anne — it is a philosophical dialogue about the nature of love",
        "Anne Gregory is unhappy with her beauty — she seems to wish she could be loved beyond her appearance",
        "The poem endorses physical love — it critiques it; only God's love transcends appearance",
      ],
      shortcuts_and_tricks: [
        "3 stanzas: Man speaking (hair causes despair) → Anne speaks (can change hair) → Yeats conclusion (only God loves soul)",
        "Yellow hair = physical beauty symbol; changing hair = desire to be loved for inner self",
        "Key line: 'only God... could love you for yourself alone and not your yellow hair'",
        "Theme: appearance vs essence in love; divine vs human love",
      ],
      diagram_description: "none",
      key_takeaway: "Yeats's brief, elegant poem poses a profound question: can human beings love purely, beyond physical appearance? His answer — drawn from an 'old religious text' — is that only God can love a person for herself alone. It is a meditation on the limits of human love.",
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // FOOTPRINTS WITHOUT FEET
  // ═══════════════════════════════════════════════════════════════════════════

  {
    topicId: "eng_fw_ch1",
    name: "A Triumph of Surgery — James Herriot",
    subject: "English",
    chapterNumber: 10,
    prerequisite_knowledge: ["Humour in prose", "Character analysis"],
    key_formulas: [
      "Tricki: obese dog belonging to rich owner Mrs Pumphrey",
      "Herriot's treatment: no medicine — exercise, diet, company of other dogs",
      "Mrs Pumphrey's hampers: brandy, wines, food keep arriving for Herriot's staff",
      "Triumph: Tricki recovers completely; irony in Mrs Pumphrey's gratitude",
    ],
    teaching_content: {
      intuition: "A vet takes in an obese dog, does nothing medical but gives it exercise and less food — while its rich owner unwittingly sends him brandy and food. The 'triumph of surgery' is actually just common sense.",
      process_explanation: "James Herriot (narrator) is worried about Tricki, a pampered Pekingese belonging to wealthy Mrs Pumphrey. Tricki has become obese because Mrs Pumphrey overfeeds him out of love (malt, cod-liver oil, Horlicks at night). Herriot convinces her to hospitalise Tricki. For two days Tricki lies listless, refusing food. Then he joins the other dogs, plays, and begins eating. Mrs Pumphrey sends hampers of food, wine, and brandy — supposedly for Tricki — which Herriot and his colleagues enjoy. Tricki is completely recovered after two weeks. Mrs Pumphrey calls it 'a triumph of surgery'. Irony: there was no surgery; just diet and exercise. The story gently satirises overindulgent pet owners.",
      worked_example: "Board question: 'Why does the author call his account 'A Triumph of Surgery'?' Answer: The story title is deeply ironic. Mrs Pumphrey calls Tricki's recovery 'a triumph of surgery' — but there was no surgery at all. Herriot's treatment was simply to hospitalise Tricki, restrict his food, and let him exercise with other dogs. The 'triumph' was achieved by common sense and natural recovery. Herriot uses the ironic title to gently mock the overindulgent attitude of Mrs Pumphrey, who believes a medical miracle was performed.",
      common_misconceptions: [
        "Herriot performed an operation on Tricki — there was no surgery; the treatment was just diet and exercise",
        "Mrs Pumphrey knew the hampers were for Herriot's staff — she sent them for Tricki; Herriot's staff kept them",
        "Tricki was seriously ill medically — Tricki was simply obese from overfeeding",
      ],
      shortcuts_and_tricks: [
        "Tricki's problem: overfeeding by Mrs Pumphrey (malt, cod-liver oil, Horlicks, cream cakes)",
        "Treatment: hospitalise → rest → diet → exercise → recovery",
        "Irony: no surgery; Mrs Pumphrey's hampers (brandy, wine) enjoyed by Herriot's staff",
        "Theme: irony, pet ownership responsibilities, humorous satire",
      ],
      diagram_description: "none",
      key_takeaway: "James Herriot's story is a warm, comic satire on overindulgent pet ownership. The 'triumph' of Tricki's recovery is achieved by common sense — and the real beneficiaries of Mrs Pumphrey's lavish concern are Herriot and his colleagues who enjoy her hampers.",
    },
  },

  {
    topicId: "eng_fw_ch2",
    name: "The Thief's Story — Ruskin Bond",
    subject: "English",
    chapterNumber: 11,
    prerequisite_knowledge: ["Character development", "Trust and morality"],
    key_formulas: [
      "Hari Singh: young thief (15), changes name to avoid detection",
      "Anil: young, careless writer who trusts Hari completely despite knowing he is a thief",
      "Hari steals Anil's money but returns it — trust and guilt overcome greed",
      "Theme: the transformative power of trust, redemption",
    ],
    teaching_content: {
      intuition: "A young thief steals from the one person who trusted him — and returns the money. Not from fear of being caught, but because trust is harder to steal from than pockets.",
      process_explanation: "Hari Singh (assumed name) is a 15-year-old thief who befriends Anil, a young writer. Anil employs Hari as a cook, teaches him to write, and trusts him completely — even though he suspects Hari is dishonest. One night Hari finds Anil's cash (600 rupees) under the mattress. He steals it and heads for the train station. But at the station, as he watches the train leave, guilt and something deeper stop him — he thinks about what he will lose: Anil's trust, the education Anil was giving him, his chance to become something more. He returns the money, slips it back. The next morning Anil gives Hari the money saying he will be paid regularly. Anil's eyes show that he knows — but says nothing. Theme: trust as a transformative force; Anil's trust saved Hari from a life of crime.",
      worked_example: "Board question: 'Why did Hari Singh return the money?' Answer: Hari Singh returned the money not primarily because of fear of getting caught, but because Anil's trust affected him deeply. He realised that stealing from Anil meant losing more than he gained — he would lose Anil's trust, the chance to learn reading and writing, and his path to a better future. Ruskin Bond suggests that genuine trust has the power to redeem even a hardened thief, making Hari choose his relationship with Anil over 600 rupees.",
      common_misconceptions: [
        "Anil did not know Hari was a thief — Anil suspected it from the beginning; he gave Hari a chance anyway",
        "Hari was caught returning the money — Anil noticed the wet money (from rain) but said nothing",
        "The story has a moral lesson about theft being wrong — it is more about the power of trust and human connection",
      ],
      shortcuts_and_tricks: [
        "Hari Singh = assumed name; he changes names to avoid detection",
        "Anil teaches Hari to write — this is what Hari most values and fears losing",
        "Key moment: train station → guilt → decision to return → slips money back",
        "Anil's response: gives Hari money next morning, eyes tell that he knows, says nothing — trust preserved",
      ],
      diagram_description: "none",
      key_takeaway: "Ruskin Bond's story shows that trust is the most powerful deterrent to crime — more powerful than law or punishment. Anil's unconditional trust in Hari creates a bond strong enough to reform a thief without a single accusation.",
    },
  },

  {
    topicId: "eng_fw_ch3",
    name: "The Midnight Visitor — Robert Arthur",
    subject: "English",
    chapterNumber: 12,
    prerequisite_knowledge: ["Suspense and thriller genre", "Dramatic irony", "Plot twists"],
    key_formulas: [
      "Ausable: fat, American-accented secret agent — not the conventional spy",
      "Max: villain, holds Ausable at gunpoint demanding the secret document",
      "The nonexistent balcony: Ausable invents it; Max falls to his death thinking police are at the door",
      "Theme: intelligence and quick thinking over physical action",
    ],
    teaching_content: {
      intuition: "A spy thriller that subverts every expectation — the spy is fat and speaks with an accent, he has no gadgets, and he defeats the villain using only his quick wit and a fictional balcony.",
      process_explanation: "Fowler, a writer, visits Ausable (a secret agent) expecting adventure. Ausable is disappointing — fat, speaks French poorly despite living in Paris. In the hotel room, Max appears with a pistol, demanding secret documents about missiles. Ausable casually mentions a balcony below his window — claiming it is a nuisance because someone keeps breaking in through it (this balcony doesn't exist). When police knock (actually a waiter with drinks Ausable had ordered), Max — believing the police will arrest him — steps out the window onto the 'balcony' and falls. Ausable's quick thinking created a scenario that Max believed.",
      worked_example: "Board question: 'How does Ausable outwit Max?' Answer: Ausable outwits Max by inventing a nonexistent balcony. He casually mentions that someone had broken into his room through the balcony recently, making Max believe there is a balcony outside the window. When there is a knock at the door (actually just a waiter), Ausable tells Max it is the police. Max, trapped and not wanting to be arrested, steps onto the supposed balcony — and falls to his death or injury below since no balcony exists. Ausable defeats the villain through quick, creative thinking rather than physical force.",
      common_misconceptions: [
        "There was a real balcony — Ausable invented it; the balcony does not exist",
        "The knock at the door was police — it was a waiter delivering drinks Ausable had ordered",
        "Ausable was a conventional spy — the story subverts that; he is fat, speaks with an accent, and uses only his mind",
      ],
      shortcuts_and_tricks: [
        "Ausable's intelligence: creates fictional scenario (balcony) + uses real event (waiter knock) to trap Max",
        "Max's mistake: he believed Ausable's story completely; stepped out and fell",
        "Theme: brains over brawn; real intelligence vs spy-movie clichés",
        "Fowler's disillusionment: expected adventure spy → got a fat, accented man → then amazed by his brilliance",
      ],
      diagram_description: "none",
      key_takeaway: "Robert Arthur's story celebrates wit over conventional heroism. Ausable — fat, unimpressive, no gadgets — defeats an armed villain using nothing but a perfectly timed lie about a balcony. True intelligence is more powerful than any weapon.",
    },
  },

  {
    topicId: "eng_fw_ch4",
    name: "A Question of Trust — Victor Canning",
    subject: "English",
    chapterNumber: 13,
    prerequisite_knowledge: ["Irony", "Plot twist", "Moral ambiguity"],
    key_formulas: [
      "Horace Danby: steals rare books to feed his obsession; locks-expert thief",
      "The woman: a fellow thief who pretends to be the house owner",
      "Horace breaks the safe for her; she takes the jewels; he is arrested",
      "Theme: honour among thieves, irony, trust betrayed",
    ],
    teaching_content: {
      intuition: "A meticulous, book-loving thief is outsmarted by a more cunning female thief — she convinces him she owns the house and gets him to crack the safe for her. He ends up arrested while she walks free.",
      process_explanation: "Horace Danby is 50, unmarried, a locksmith who steals once a year from large houses to fund his rare-books habit. He is meticulous, detailed, nearly caught before but always escaped. He breaks into Shotover Grange when he thinks it is empty. A young woman appears — says she is the owner's wife and has forgotten the combination of the safe. She plays on his fear of being caught: help me get into the safe or I'll call the police. He opens the safe, she takes the jewels. She turns out to be a thief herself. Horace is arrested by the real owners; the woman is never found. He serves time in prison. The police think he had an accomplice — he insists it was a lady in red but no one believes him.",
      worked_example: "Board question: 'What is the twist in 'A Question of Trust'?' Answer: The twist is that the woman who convinces Horace to crack the safe is herself a thief, not the house owner as she claimed. Horace assumes she is the legitimate owner and helps her access the jewels to avoid arrest. She takes the jewels and escapes while Horace is caught by the real owners. The story's irony: a careful, experienced thief is deceived by a more cunning thief using his own fear as a weapon.",
      common_misconceptions: [
        "The woman was the real house owner — she was a thief posing as the owner",
        "Horace was foolish — he was careful and experienced; he was simply outmanoeuvred by a better manipulator",
        "Horace got away — he was arrested; the woman escaped",
      ],
      shortcuts_and_tricks: [
        "Horace's profile: 50s, locksmith, rare-book obsessive, steals once/year from large houses",
        "Woman's tactic: poses as owner → exploits Horace's fear → escapes with jewels",
        "Horace's mistake: he trusted someone as dishonest as himself",
        "Theme: 'there is honour among thieves' — story disproves it; criminals deceive each other",
      ],
      diagram_description: "none",
      key_takeaway: "Victor Canning's story delivers a satisfying irony: a thief who prides himself on careful planning is deceived by a cleverer thief. The 'question of trust' is answered — there is no honour among thieves, and assumption is every criminal's greatest vulnerability.",
    },
  },

  {
    topicId: "eng_fw_ch5",
    name: "Footprints Without Feet — H.G. Wells",
    subject: "English",
    chapterNumber: 14,
    prerequisite_knowledge: ["Science fiction", "Invisible Man concept", "Ethics of science"],
    key_formulas: [
      "Griffin: scientist invents invisibility drug; swallowed it, destroyed clothes to be fully invisible",
      "Footprints without feet: visible muddy footprints but no visible body — story's opening image",
      "Griffin is eventually discovered at Iping; must steal food and clothes",
      "Theme: science without ethics, the dangers of unchecked scientific power",
    ],
    teaching_content: {
      intuition: "H.G. Wells' invisible man starts as a brilliant scientist and becomes a desperate, angry criminal — not because he wanted to, but because invisibility, far from being a superpower, makes ordinary life impossible.",
      process_explanation: "Two boys in London notice fresh muddy footprints appearing on steps with no visible person making them. The footprints disappear when the invisible man steps onto a clean pavement. Griffin (the invisible man) is a scientist who discovered how to make the human body transparent. He became invisible by swallowing a rare drug. He is homeless (can't be seen to rent a house) and hungry (must steal food). Griffin burned his landlord's house after being evicted. He steals from a department store and from a theatrical company for disguise. He goes to the village of Iping to hide and reverse the invisibility process. He terrorises the village, gets discovered, escapes. Becomes increasingly violent.",
      worked_example: "Board question: 'How does Griffin's invisibility become a disadvantage?' Answer: Though invisibility seems like a power, it becomes a serious disadvantage for Griffin. He cannot enter shops normally, cannot pay for food or shelter, must steal everything he needs. He is cold because he cannot wear clothes without becoming visible. In winter, his bare footprints reveal him. He must remain entirely naked to be fully invisible — an enormous practical challenge. He becomes desperate and increasingly criminal, turning from scientist to outlaw.",
      common_misconceptions: [
        "Griffin's invisibility is entirely positive — it creates enormous practical problems: cold, hunger, no shelter",
        "Griffin is the hero — he is the antagonist; he terrorises people and destroys property",
        "The story is about a specific crime — it is about the ethical consequences of science used without moral consideration",
      ],
      shortcuts_and_tricks: [
        "Opening: boys see footprints without feet → brilliant hook for the story",
        "Griffin's problems: can't rent room, can't eat, can't wear clothes, gets cold, leaves footprints in snow",
        "His escalating crimes: burns landlord's house → steals clothing/food → terrorises Iping village",
        "Theme: science without ethics is dangerous; power without morality corrupts",
      ],
      diagram_description: "none",
      key_takeaway: "H.G. Wells uses the invisibility concept to explore what happens when scientific power is divorced from morality. Griffin's 'gift' becomes a prison — he cannot live normally, must steal and hide, and grows steadily more violent. Unchecked science creates not superheroes but desperate criminals.",
    },
  },

  {
    topicId: "eng_fw_ch6",
    name: "The Making of a Scientist — Robert W. Peterson",
    subject: "English",
    chapterNumber: 15,
    prerequisite_knowledge: ["Biography", "Scientific process", "Curiosity and discovery"],
    key_formulas: [
      "Richard Ebright: collected 25 butterfly species by age of 12 using book 'Travels of Monarch X'",
      "Key discovery: cells use DNA blueprint — wins a science fair award at age 22",
      "Three elements of success: first-rate mind + curiosity/willingness to work hard + will to win",
      "Richard's mother: key catalyst — gave him books, took him on trips, encouraged him",
    ],
    teaching_content: {
      intuition: "Richard Ebright didn't just collect butterflies — his childhood curiosity eventually led him to discover a fundamental secret about how cells work. This is the story of how genuine scientific curiosity grows.",
      process_explanation: "Richard Ebright's scientific journey began with a childhood interest in collecting butterflies (25 species by age 12). His mother gave him a book 'The Travels of Monarch X' which described tagging monarchs for study. This sparked deeper curiosity. He tagged monarchs for research. In eighth grade, he tried to find the purpose of gold spots on monarch chrysalises — initially failed but showed originality. In high school, he discovered monarch butterflies make a hormone (through the gold spots) that was essential for growth. He won several science fair prizes. At 22, he and his roommate built a model showing how cells read genetic information (DNA). This was a major contribution to cellular biology. Richard also excelled at debate, canoeing, and chess — a well-rounded achiever.",
      worked_example: "Board question: 'What factors contributed to Richard Ebright's success as a scientist?' Answer: Three key factors contributed: (1) A first-rate mind — natural intelligence and analytical ability; (2) Curiosity and willingness to work hard — from childhood butterfly collecting to complex molecular research; (3) The will to win for the right reasons — not just for prizes but genuine love of knowledge. Additionally, his mother was crucial — she provided books, took him on educational trips, and consistently encouraged his curiosity from a young age.",
      common_misconceptions: [
        "Richard won science fairs in early grades — his early projects didn't win; he learnt from failures and improved",
        "The discovery about DNA was his only achievement — he had multiple science fair wins and was accomplished in multiple areas",
        "His success was natural talent alone — the text emphasises hard work, curiosity, and maternal support alongside talent",
      ],
      shortcuts_and_tricks: [
        "Timeline: butterfly collection (12) → book 'Travels of Monarch X' → tagging → gold spots research → hormone discovery → DNA cell model (22)",
        "Three keys: first-rate mind + curiosity + will to win",
        "Mother's role: books, trips, encouragement — essential to his development",
        "Richard's all-around excellence: debate, canoeing, chess, nature photography",
      ],
      diagram_description: "none",
      key_takeaway: "Richard Ebright's story shows that great scientific discoveries grow from childhood curiosity nurtured by loving encouragement. Intelligence alone is insufficient — it takes genuine curiosity, hard work, and the courage to keep pursuing questions that don't yield easy answers.",
    },
  },

  {
    topicId: "eng_fw_ch7",
    name: "The Necklace — Guy de Maupassant",
    subject: "English",
    chapterNumber: 16,
    prerequisite_knowledge: ["Irony and plot twist", "Social class themes", "Realist fiction"],
    key_formulas: [
      "Mme Loisel: beautiful but poor, married to a clerk, dreams of wealth",
      "Borrows a diamond necklace from Mme Forestier for a party",
      "Loses the necklace; replaces it with real diamonds; works 10 years to pay off debt",
      "Twist: the original necklace was fake (worth only 500 francs, not 36,000)",
    ],
    teaching_content: {
      intuition: "One of the most famous twist endings in literature: a woman sacrifices ten years of her life to repay a debt for losing a necklace that was never real. Maupassant's devastating irony about vanity, social aspiration, and the randomness of fate.",
      process_explanation: "Mathilde Loisel is beautiful but lives modestly, married to a minor clerk. She is miserable, dreams of a wealthy life. Her husband gets an invitation to a ministry ball. She demands a gown (400 francs) and then a piece of jewellery. She borrows what she believes is a diamond necklace from her rich friend Mme Forestier. She dances brilliantly at the party and feels she belongs among the wealthy. Returning home, she discovers the necklace is lost. After a desperate search, they buy a replacement diamond necklace for 36,000 francs, going into debt. They work for 10 years of grinding poverty to repay the loans. Mathilde becomes old and haggard. When she meets Mme Forestier and explains, Mme Forestier reveals the original necklace was fake paste worth at most 500 francs.",
      worked_example: "Board question: 'What is the central irony in The Necklace?' Answer: The central irony is that the Loisels sacrifice 10 years of their lives, going into heavy debt to replace what they believed was a priceless diamond necklace — only to discover at the end that the original necklace was made of fake paste and worth only 500 francs. The suffering was entirely unnecessary. The story uses this devastating twist to comment on vanity, social aspiration, and the cruel randomness of fate.",
      common_misconceptions: [
        "The original necklace was real diamonds — Mme Forestier reveals it was fake paste (costume jewellery)",
        "Mme Forestier was rich and kind throughout — she did not know about the loss; Mathilde avoided her out of shame",
        "The Loisels could have simply told Mme Forestier the truth — their pride and shame prevented this, which is part of the story's critique",
      ],
      shortcuts_and_tricks: [
        "Key sequence: invitation → dress (400 francs) → borrow necklace → party → lose necklace → replace (36,000 francs) → 10 years debt → twist",
        "Mme Loisel's character flaw: vanity and social ambition",
        "Maupassant's message: vanity and pretense lead to real tragedy; pride can destroy lives",
        "Mathilde's transformation: beautiful dreamer → haggard, aged woman after 10 years of hardship",
      ],
      diagram_description: "none",
      key_takeaway: "Maupassant's story is a masterclass in irony: Mathilde Loisel's vanity and social pretension lead her to suffer exactly the poverty she wanted to escape — and the cruelest twist is that all her suffering was for nothing. The story is a timeless warning about the destructive power of vanity.",
    },
  },

  {
    topicId: "eng_fw_ch8",
    name: "Bholi — K.A. Abbas",
    subject: "English",
    chapterNumber: 17,
    prerequisite_knowledge: ["Social issues: disability and stigma", "Women's empowerment", "Education as transformation"],
    key_formulas: [
      "Bholi: Sulekha, mentally slow after childhood fever and fall; stammers; pockmarked",
      "Father sends her to school to 'get her off his hands' — not out of love",
      "Teacher's encouragement transforms Bholi — she gains confidence and education",
      "Bholi refuses Bishamber's marriage (demands dowry, ugly old man) — asserts herself",
    ],
    teaching_content: {
      intuition: "A girl labelled a 'simpleton' and written off by her own family discovers dignity and courage through education — and uses that education to stand up for herself when it matters most.",
      process_explanation: "Sulekha (Bholi = simpleton) is the youngest of Ramlal's children. A childhood fever and fall left her mentally slow and with a stammer. She has smallpox scars (pockmarks) on her face. Her family considers her unmarriageable. Her father sends her to school not out of care but to get her out of the house. In school, her teacher treats her with warmth and encouragement — for the first time, someone believes in her. Bholi begins to change: her stammer reduces, she becomes confident. Years later, Bishamber Nath (old, lame, greedy) proposes to marry Bholi but demands a dowry and stops the wedding seeing her pockmarked face, only proceeding if Ramlal pays more. Bholi — educated and confident — refuses to marry this shameful man, embarrassing her family. She decides to teach in her old school instead.",
      worked_example: "Board question: 'How does education transform Bholi?' Answer: Before education, Bholi was fearful, stammering, and resigned to being overlooked. Her teacher was the first person to treat her with kindness and confidence, assuring her that she would speak better than others one day. This encouragement transformed Bholi — her stammer reduced, her confidence grew, and she developed a sense of her own dignity and worth. This transformation is what enables her to refuse Bishamber's humiliating marriage proposal and choose independence over a shameful compromise.",
      common_misconceptions: [
        "Bholi's father sent her to school out of love — he sent her partly to 'get her off his hands'; the teacher provided what her family did not",
        "Bholi was actually mentally disabled — she was slow after an illness/fall, not permanently disabled; education brought out her potential",
        "Her refusal to marry was rebellion — it was courage born from self-respect gained through education",
      ],
      shortcuts_and_tricks: [
        "Bholi's arc: overlooked simpleton → school → teacher's encouragement → confidence → refuses humiliating marriage → independence",
        "Bishamber's flaws: old, lame, greedy, demands dowry, tries to accept pockmarked bride only for money",
        "Teacher's method: encouragement, promise of improvement, treating Bholi with dignity",
        "Theme: education as empowerment; women's self-respect; social stigma of disability",
      ],
      diagram_description: "none",
      key_takeaway: "Bholi is a story about the transformative power of education and kindness. A girl written off by her family as a simpleton finds her voice and dignity in a classroom — and uses both to refuse a degrading marriage, choosing self-respect over social conformity.",
    },
  },

  {
    topicId: "eng_fw_ch9",
    name: "The Book That Saved the Earth — Claire Boiko",
    subject: "English",
    chapterNumber: 18,
    prerequisite_knowledge: ["Science fiction", "Play format", "Satire"],
    key_formulas: [
      "Set in 25th century: historian recounts 20th century Martian invasion thwarted by a book",
      "Think-Tank: Martian leader with huge head, obsessed with power and flattery",
      "Mother Goose: nursery rhyme book misread by Think-Tank as instructions for war",
      "Theme: books as symbols of human culture and wisdom; satire on militarism and arrogance",
    ],
    teaching_content: {
      intuition: "A hilarious sci-fi play where an alien invasion of Earth is stopped by a misread nursery rhyme book. Think-Tank's inability to understand human humour and culture leads to a panic retreat — proving that culture can be a stronger defence than weapons.",
      process_explanation: "Set in a museum in the 25th century, a historian tells a student about the Great Invasion Scare of 2000. Think-Tank, Supreme Commander of Mars, sends an invasion crew to Earth. The crew lands in a library and finds books (they call them 'sandwiches' — thin, layered, rectangular). Think-Tank orders them to 'eat' a book. One crew member reads from Mother Goose. Think-Tank misinterprets nursery rhymes as war instructions: 'Mistress Mary, how does your garden grow?' = Earth grows weapons; 'Humpty Dumpty sat on a wall' = Martian spies have infiltrated the army; 'Little Miss Muffet sat on a tuffet / Along came a spider' = Earthlings tame dangerous creatures (spiders). Panicked, Think-Tank orders immediate retreat from Earth. The invasion never happens. The book that saved the Earth: Mother Goose.",
      worked_example: "Board question: 'How does Think-Tank misinterpret the nursery rhyme about Mistress Mary?' Answer: When a crew member reads 'Mistress Mary, how does your garden grow? / With cockle shells and silver bells and pretty maids all in a row', Think-Tank interprets it as a military message. He concludes that Earthlings are growing 'weapons' (silver bells = bombs) in their gardens in rows — suggesting they are militarily prepared. This ridiculous misreading panics Think-Tank into calling off the invasion.",
      common_misconceptions: [
        "The crew was foolish — Think-Tank was the one who made ridiculous interpretations; the crew was just following orders",
        "The story is anti-books — it is pro-books; a book saved the Earth; it celebrates the power of culture",
        "The play is set in the present — it is set in the 25th century, looking back at a fictional 21st century event",
      ],
      shortcuts_and_tricks: [
        "Think-Tank: megalomaniac leader, requires constant flattery ('Oh mighty and wise Think-Tank')",
        "Three misreadings: Mary's garden = weapons lab; Humpty Dumpty = spy network; Miss Muffet = taming creatures",
        "Result of panic: Think-Tank orders fleet to Pluto to avoid Earth",
        "Theme: human culture (even nonsense rhymes) is incomprehensible to those without context; books preserve civilisation",
      ],
      diagram_description: "none",
      key_takeaway: "Claire Boiko's play is a warm, comic celebration of books and culture. Mother Goose's nonsense rhymes, misread as terrifying military intelligence, save the Earth from invasion — proving that cultural wisdom, even in its most playful form, is more powerful than any weapon.",
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // WORKBOOK — WORDS AND EXPRESSIONS 2 (Grammar + Writing)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    topicId: "eng_wb_grammar1",
    name: "Grammar & Writing — Unit 1 (A Letter to God)",
    subject: "English",
    chapterNumber: 19,
    prerequisite_knowledge: ["Simple past tense", "Reading comprehension basics"],
    key_formulas: [
      "Sequencing events: first, then, after, finally — arranging jumbled story sentences",
      "Descriptive writing: graphic description, setting description",
      "Money order form format: sender, receiver, amount, postal address",
      "Active voice simple past: Lencho wrote → worked",
    ],
    teaching_content: {
      intuition: "Grammar practised through 'A Letter to God' contexts — sequencing, tense use, and descriptive writing tied to what students just read.",
      process_explanation: "Unit 1 grammar topics: (1) Reading comprehension — answering questions about A Letter to God. (2) Sequencing: rearranging jumbled sentences in correct story order (first hailstorm, then Lencho writes letter, then postmaster collects money, then Lencho receives letter). (3) Descriptive writing: creating a graphic description of scenes from the story (Lencho in his field). (4) Formal letter writing — understanding how to write an informal personal letter. (5) Simple past tense usage in narrative — regular verbs (-ed) and irregular verbs (wrote, ran, fell). (6) Prepositions in context.",
      worked_example: "Task: Rearrange these sentences in the correct sequence of events in 'A Letter to God': (a) Lencho received money from the post office. (b) Lencho's crops were destroyed by hail. (c) Lencho wrote an angry second letter to God. (d) The postmaster collected money from employees. Correct order: b → Lencho wrote first letter → d → a → c.",
      common_misconceptions: [
        "Sequencing is just about time order — it also requires understanding cause-and-effect (why events happen in that order)",
        "Descriptive writing needs to be long — a graphic description should be precise and vivid, not just long",
        "Simple past is always -ed — irregular verbs (wrote, ran, fell) are also simple past and must be memorised",
      ],
      shortcuts_and_tricks: [
        "Sequencing words: first, then, next, after that, finally — use these in retelling",
        "Informal letter format: Date / Dear [name] / Body paragraphs / Yours affectionately / Signature",
        "Board exam format for comprehension: answer in full sentences; reuse words from the question",
        "Common irregular past tense: write→wrote, destroy→destroyed, send→sent, receive→received",
      ],
      diagram_description: "none",
      key_takeaway: "Unit 1 practises narrative sequencing, simple past tense, and descriptive writing using the familiar context of A Letter to God. Connecting grammar practice to literature makes both richer.",
    },
  },

  {
    topicId: "eng_wb_grammar2",
    name: "Grammar & Writing — Unit 2 (Nelson Mandela)",
    subject: "English",
    chapterNumber: 20,
    prerequisite_knowledge: ["Verb forms and tenses", "Report writing basics"],
    key_formulas: [
      "Verb forms: base, past, past participle, present participle (-ing form)",
      "Freedom and responsibility — opinion writing and argumentative paragraphs",
      "Report writing format: Title / By [reporter name] / Date / Body / Conclusion",
    ],
    teaching_content: {
      intuition: "Grammar through Mandela's language — strong verbs, formal registers, and the connection between language choices and persuasive power.",
      process_explanation: "Unit 2 activities: (1) Reading comprehension questions based on Mandela's text. (2) Discussion and opinion writing: freedom and responsibility — how they go hand in hand. (3) Verb forms table: irregular verbs used in the text (fight→fought→fought, make→made→made, see→saw→seen). (4) Matching meanings, vocabulary from the text (inauguration, oppression, apartheid, confer). (5) Report writing: how to write a factual report about a historical event (Mandela's inauguration) — third person, past tense, structured paragraphs. (6) Editing exercises: find grammatical errors in passages.",
      worked_example: "Report writing task: Write a report on Nelson Mandela's inauguration. Title: MANDELA SWORN IN AS SOUTH AFRICA'S FIRST BLACK PRESIDENT. Date. Reporter name. Paragraph 1: Historic inauguration on 10 May 1994. Paragraph 2: Three deputy presidents sworn in. Paragraph 3: Mandela's speech — freedom and obligations. Conclusion: significance of the event.",
      common_misconceptions: [
        "Reports and articles are the same — reports are objective (3rd person, no opinion); articles can be first-person and opinionated",
        "All past tenses need -ed — irregular verbs must be individually memorised",
        "Opinion paragraphs don't need evidence — even in English, support opinions with reasons and examples",
      ],
      shortcuts_and_tricks: [
        "Report format: who, what, when, where, why — answer all five in the body",
        "Irregular verb groups: i→a→u (ring→rang→rung), a→o→a (fall→fell→fallen)",
        "Freedom + responsibility argument: freedom without responsibility = chaos; responsibility without freedom = oppression",
        "Third person in reports: he, she, they, the president — never 'I' or 'we'",
      ],
      diagram_description: "none",
      key_takeaway: "Unit 2 builds report writing skills and verb form accuracy through the powerful context of Mandela's story — showing that grammar and ideas are inseparable in effective writing.",
    },
  },

  {
    topicId: "eng_wb_grammar3",
    name: "Grammar & Writing — Unit 3 (Two Stories about Flying)",
    subject: "English",
    chapterNumber: 21,
    prerequisite_knowledge: ["Reading comprehension MCQs", "Editing and proofreading"],
    key_formulas: [
      "Multiple choice reading comprehension format — one correct answer with elimination strategy",
      "Integrated grammar exercises: tense, articles (a/an/the), prepositions, subject-verb agreement",
      "Notice writing format: formal short document with title, date, key details",
    ],
    teaching_content: {
      intuition: "Grammar in Unit 3 focuses on precision — choosing the right word, article, or tense in context. The flying stories provide vivid passages for editing practice.",
      process_explanation: "Unit 3 activities: (1) MCQ comprehension about both flying stories (seagull and black aeroplane). (2) Integrated grammar: fill in gaps in passages with correct article/preposition/tense. (3) Editing practice: find and correct errors in a passage (missing articles, wrong tense, wrong preposition). (4) Notice writing: structured short document. Notice format: Title (NOTICE) / Name of organisation / Date / Subject / Body / Name of writer / Designation. (5) Vocabulary matching and context use.",
      worked_example: "Editing task: Identify errors and correct them. 'The young seagull was stand on a ledge. He was afraid to flew. His mother was gives him a fish.' Corrections: stand→standing; flew→fly; was gives→gave (or was giving). Corrected: The young seagull was standing on a ledge. He was afraid to fly. His mother gave him a fish.",
      common_misconceptions: [
        "Articles (a/an/the) are optional — they change meaning significantly; incorrect use loses marks",
        "Editing only means spelling errors — grammar, articles, tense, prepositions are all checked",
        "Notice and advertisement are the same — notice is for a specific community/organisation; advertisement is commercial",
      ],
      shortcuts_and_tricks: [
        "Article rule: 'a' before consonant sounds, 'an' before vowel sounds, 'the' for specific/previously mentioned",
        "Notice format memory: NORTH (Name of org, Object/subject, Relevant details, Time/date, Hostname/writer)",
        "Editing trick: read each sentence separately; check subject-verb agreement, then tense, then articles",
        "MCQ strategy: eliminate clearly wrong answers first; look for key words in the passage",
      ],
      diagram_description: "none",
      key_takeaway: "Accurate grammar depends on noticing the details — correct articles, tenses, and prepositions. Unit 3's editing exercises build the precision skills essential for CBSE board exam grammar sections.",
    },
  },

  {
    topicId: "eng_wb_grammar4",
    name: "Grammar & Writing — Unit 4 (From the Diary of Anne Frank)",
    subject: "English",
    chapterNumber: 22,
    prerequisite_knowledge: ["Editing exercises", "Diary and letter writing"],
    key_formulas: [
      "Gap-filling: articles, prepositions, conjunctions in context",
      "Letter writing: formal and informal — structure, register, vocabulary",
      "Rearranging jumbled paragraphs into a coherent text",
    ],
    teaching_content: {
      intuition: "Anne Frank's diary teaches us that precise language creates intimacy and voice. Unit 4 uses diary and letter writing as the core practice forms.",
      process_explanation: "Unit 4 activities: (1) Reading comprehension — questions based on Anne Frank's diary excerpt and an additional passage about a teenage girl in WWII. (2) Gap-filling exercises: completing passages using articles, conjunctions (and/but/because/although), prepositions (in/on/at/by/with). (3) Formal letter format: how to write a letter requesting information or expressing an opinion. Formal letter format: Sender's address / Date / Receiver's address / Salutation (Dear Sir/Madam) / Subject / Body / Closing (Yours faithfully) / Signature. (4) Jumbled paragraph exercise: rearranging paragraphs in logical order to make a coherent text. (5) Diary entry writing: first person, emotional, conversational register, date at top.",
      worked_example: "Diary entry task: Write a diary entry as Anne Frank after her first day of hiding. Include: feelings of fear, small space, gratitude for helpers, hope for the future. Sample: '12 July 1942, Dear Kitty, Today was the most terrifying day of my life. We arrived at the Secret Annexe at last...'",
      common_misconceptions: [
        "Formal and informal letter formats are interchangeable — they have different salutations, closings, and registers",
        "Diary entries need complex sentences — they are personal and can be conversational, fragmented, emotional",
        "Conjunctions are only 'and' and 'but' — CBSE also tests 'although', 'since', 'unless', 'whereas'",
      ],
      shortcuts_and_tricks: [
        "Formal letter closing: Yours faithfully (when Madam/Sir) vs Yours sincerely (when name is known)",
        "Informal letter closing: Yours affectionately / Yours lovingly / Best wishes",
        "Preposition rules: in (months/years/countries), on (days/dates/streets), at (times/specific places)",
        "Paragraph coherence: topic sentence → development → concluding sentence; each para = one idea",
      ],
      diagram_description: "none",
      key_takeaway: "Unit 4 develops letter and diary writing skills — important for the writing section of the CBSE board exam. Different types of letters require different registers, and recognising those differences is key to scoring well.",
    },
  },

  {
    topicId: "eng_wb_grammar5",
    name: "Grammar & Writing — Unit 5 (Glimpses of India)",
    subject: "English",
    chapterNumber: 23,
    prerequisite_knowledge: ["Gap-filling grammar", "Article and descriptive writing"],
    key_formulas: [
      "Article writing format: Title / By (author) / Hook paragraph / Body / Conclusion",
      "Tense consistency in narrative and descriptive writing",
      "Vocabulary in context: regional words (pader, kabai, coorg, etc.)",
    ],
    teaching_content: {
      intuition: "India's diversity is a natural subject for descriptive writing. Unit 5 uses regional vocabulary and places from Glimpses of India to practise articles, vocabulary, and descriptive essay writing.",
      process_explanation: "Unit 5 activities: (1) Discussion — India's regional diversity (food, dance, music, art). (2) Gap-filling using vocabulary from Glimpses of India. (3) Article writing: writing an informative article about a place in India (its culture, food, traditions). Article format: TITLE (catchy) / By [Name] / Introduction (hook) / Body (3-4 paragraphs with facts) / Conclusion. Articles are written in third person, may include first-person observations, are slightly informal in tone. (4) Map work: identifying regions of India. (5) Vocabulary: matching words to meanings (plantation, pader, martial, etc.).",
      worked_example: "Article writing task: Write an article titled 'The Land of Tea' about Assam for your school magazine. Opening: 'If your morning begins with a cup of tea, you have Assam to thank.' Body: history of tea cultivation, two legends, geographical features of Assam, tea tourism. Conclusion: invitation to visit.",
      common_misconceptions: [
        "Articles and essays are the same — articles have a sharper hook, are slightly less formal, and more reader-focused",
        "Articles must always be third person — travel/experience articles can use first person",
        "A catchy title is not important — in article writing, the title is part of the marks criterion",
      ],
      shortcuts_and_tricks: [
        "Article title types: question ('Can Goa be More Than Beaches?'), alliteration ('Coorg: Cool, Calm, Captivating'), statistic ('6.8 Billion Kilos of Bliss')",
        "Hook paragraph types: surprising fact, anecdote, question, quotation",
        "Article vs report: article = writer's voice + descriptive language; report = factual + objective + third person",
        "Body paragraph structure: topic sentence → 2-3 supporting details → transition to next paragraph",
      ],
      diagram_description: "none",
      key_takeaway: "Unit 5 develops descriptive article writing rooted in India's regional diversity. A well-structured article with a compelling hook, rich body, and strong conclusion can score full marks in the CBSE writing section.",
    },
  },

  {
    topicId: "eng_wb_grammar6",
    name: "Grammar & Writing — Unit 6 (Mijbil the Otter)",
    subject: "English",
    chapterNumber: 24,
    prerequisite_knowledge: ["Relative clauses", "Paragraph structure", "Animal descriptions"],
    key_formulas: [
      "Relative clauses: who/which/that + clause to add information",
      "Defining vs non-defining relative clauses",
      "Report writing on current events; note-making from a passage",
    ],
    teaching_content: {
      intuition: "Maxwell's vivid descriptions of Mij's behaviour make Unit 6 a natural playground for relative clauses (who did X, which was Y) and descriptive animal writing.",
      process_explanation: "Unit 6 activities: (1) Discussion about pet ownership responsibility (from Mijbil the Otter). (2) Grammar: relative clauses. Defining relative clause: 'The otter that Maxwell found became his pet' — identifies which otter. Non-defining relative clause: 'Mij, who came from Iraq, was a new species' — adds extra information (comma used). 'Who' for people; 'which' for things; 'that' for both in defining clauses. (3) Note-making: reading a passage and making structured notes (title, main points in bullet form, abbreviations). (4) Report writing: writing a factual report about a current event or local news. (5) Comprehension questions about Mijbil.",
      worked_example: "Relative clause task: Combine these sentences using a relative clause. 'Maxwell found an otter. The otter was a new species.' → 'Maxwell found an otter which/that was a new species.' OR 'The otter that Maxwell found was a new species.' Test: 'Maxwell's otter, [who/which], played with a marble.' Answer: 'which' (non-defining; the otter is specific = Mij, non-defining clause with comma).",
      common_misconceptions: [
        "Who and which are always interchangeable — 'who' is for people; 'which' is for things; 'that' can substitute in defining clauses",
        "Commas are optional in relative clauses — non-defining clauses MUST use commas; defining clauses do NOT use commas",
        "Note-making means writing full sentences — notes use abbreviations, bullet points, and fragments",
      ],
      shortcuts_and_tricks: [
        "Relative clause memory: WHO (people), WHICH (things), THAT (people or things in defining clauses only)",
        "Defining: no commas, essential information; Non-defining: commas, extra information (can be removed)",
        "Note-making abbreviations: e.g. = for example; i.e. = that is; esp. = especially; dept. = department",
        "Report structure: Headline / byline / date / lead paragraph (who-what-when-where-why) / body / conclusion",
      ],
      diagram_description: "none",
      key_takeaway: "Relative clauses allow writers to create complex, information-rich sentences. Understanding when to use who/which/that and when to add commas is essential for both grammar marks and writing quality.",
    },
  },

  {
    topicId: "eng_wb_grammar7",
    name: "Grammar & Writing — Unit 7 (Madam Rides the Bus)",
    subject: "English",
    chapterNumber: 25,
    prerequisite_knowledge: ["Passive voice", "Story writing", "Narrative perspective"],
    key_formulas: [
      "Active to passive: Subject + verb + object → Object + be + past participle + by + subject",
      "Passive voice tenses: is/am/are + pp (present); was/were + pp (past); will be + pp (future)",
      "Story writing: hook → rising action → climax → resolution",
    ],
    teaching_content: {
      intuition: "Valli's story is told from a child's perspective — perfect for exploring narrative voice and passive voice constructions that shift focus from actor to action.",
      process_explanation: "Unit 7 activities: (1) Discussion: Valli's bus journey — what she saw, her excitement, her sadness. (2) Grammar: Passive voice transformation. Active: 'The conductor called Valli madam' → Passive: 'Valli was called madam by the conductor'. Rules: identify subject/object, use appropriate form of 'be', use past participle. Passive voice is used when: the actor is unknown/unimportant, or when the action/result matters more than the actor. (3) Story writing: writing a short narrative from a child's perspective, including sensory details, dialogue, and an emotional turning point. (4) Gap-filling: passive voice in context. (5) Reading comprehension: identifying passive constructions in a text.",
      worked_example: "Passive voice transformation: 'The conductor checked Valli's ticket.' → 'Valli's ticket was checked by the conductor.' Identify: subject = conductor; verb = checked; object = Valli's ticket. Passive: [object] + was/were + [pp of verb] + by + [subject]. Test: 'A bus hit the cow on the road.' Passive: 'The cow was hit by a bus on the road.'",
      common_misconceptions: [
        "Passive voice means past tense — passive voice exists in all tenses (is eaten, was eaten, will be eaten, has been eaten)",
        "You must always include 'by + agent' in passive — when agent is unknown or unimportant, 'by + agent' is omitted",
        "Active voice is always better — passive is appropriate when the action matters more than the actor (scientific writing, news)",
      ],
      shortcuts_and_tricks: [
        "Passive formula: [Object] + [be in correct tense] + [Past participle] + (by + [subject])",
        "Be forms by tense: am/is/are (present), was/were (past), will be (future), has/have been (perfect)",
        "Irregular past participles: write→written, eat→eaten, hit→hit, break→broken, take→taken",
        "Story structure: Situation → Complication → Climax → Resolution (SCCR)",
      ],
      diagram_description: "none",
      key_takeaway: "Passive voice shifts the focus from who acts to what happens — essential for formal writing. Mastering the active-to-passive transformation across tenses is one of the key grammar skills tested in CBSE board exams.",
    },
  },

  {
    topicId: "eng_wb_grammar8",
    name: "Grammar & Writing — Unit 8 (The Sermon at Benares)",
    subject: "English",
    chapterNumber: 26,
    prerequisite_knowledge: ["Conditionals", "Speech and debate writing", "Formal language"],
    key_formulas: [
      "Conditionals: Zero (if + present + present), First (if + present + will), Second (if + past + would), Third (if + past perfect + would have)",
      "Speech writing format: salutation / introduction / body / conclusion / thank you",
      "Formal vs informal register in written English",
    ],
    teaching_content: {
      intuition: "The Buddha's sermon is itself a masterpiece of persuasive speech — an ideal text for learning how to structure a speech and use conditional sentences to argue about possibility and hypothetical situations.",
      process_explanation: "Unit 8 activities: (1) Discussion: meaning of 'sermon'. (2) Grammar: Conditional sentences. Zero conditional: 'If you heat water, it boils' — universal truth. First conditional: 'If it rains, we will cancel the trip' — real future possibility. Second conditional: 'If I were the Buddha, I would teach patience' — unreal present. Third conditional: 'If Kisa Gotami had accepted death, she would have found peace sooner' — unreal past. (3) Speech writing: writing a formal speech on a given topic (on acceptance of loss, or on the importance of education). Speech format: respectful salutation → engaging opening → body (3 points) → conclusion → thank you. (4) Comprehension: identifying conditional forms in the story text.",
      worked_example: "Identify the conditional type: 'If Kisa Gotami had gone to fewer houses, she might not have understood the universality of death.' Type: Third conditional (past perfect + would/might have + past participle). It refers to an unreal past situation and its unreal past consequence.",
      common_misconceptions: [
        "All 'if' sentences are conditionals — relative clauses and time clauses also use 'if' and 'when'",
        "Second conditional uses 'was' for all subjects — formal English uses 'were' for all subjects in second conditional (If I were you...)",
        "Speech must be very formal — speeches use formal language but also connect emotionally; avoid being robotic",
      ],
      shortcuts_and_tricks: [
        "Zero: if + present, present (always true); First: if + present, will (likely future)",
        "Second: if + past, would (unreal now); Third: if + had + pp, would have + pp (unreal past)",
        "Speech opening: greeting + personal connection to topic + thesis statement",
        "Speech ending: call to action or memorable closing line + thank you",
      ],
      diagram_description: "none",
      key_takeaway: "Conditional sentences express possibility, hypothetical thinking, and regret — fundamental to both formal argumentation and daily English. Speech writing tests the ability to organise ideas persuasively in formal language, a key board exam skill.",
    },
  },

  {
    topicId: "eng_wb_grammar9",
    name: "Grammar & Writing — Unit 9 (The Proposal)",
    subject: "English",
    chapterNumber: 27,
    prerequisite_knowledge: ["Reported speech", "Script/dialogue writing", "Play conventions"],
    key_formulas: [
      "Reported speech: tense shifts, pronoun changes, time/place word changes",
      "Direct: He said, 'I am coming.' → Reported: He said that he was coming.",
      "Questions in reported: He asked if/whether + [reported form]",
      "Commands in reported: She told him to come immediately.",
    ],
    teaching_content: {
      intuition: "The Proposal is full of reported speech — 'she said he was', 'he asked whether' — making it the perfect text to master one of the most commonly tested grammar items in CBSE board exams.",
      process_explanation: "Unit 9 activities: (1) Facial expressions and non-verbal communication discussion. (2) Grammar: Reported speech (Indirect speech). Rules: (a) Tense shift: present→past, will→would, can→could, may→might. (b) Pronoun changes: I→he/she, we→they, you→he/she/they. (c) Time/place changes: today→that day, now→then, here→there, this→that. Statements: He said, 'I am busy.' → He said that he was busy. Questions: She asked, 'Are you coming?' → She asked if he was coming. Commands: He said, 'Go home.' → He told them to go home. (3) Script writing: writing a short dramatic dialogue. (4) Character analysis of The Proposal. (5) Comprehension questions.",
      worked_example: "Convert to reported speech: Natalya said, 'The meadows belong to us.' → Natalya said that the meadows belonged to them. Lomov asked, 'Will you marry me?' → Lomov asked her if she would marry him. Chubukov said, 'Come back immediately!' → Chubukov told him to come back immediately.",
      common_misconceptions: [
        "Present tense always shifts to past in reported speech — this is true when the reporting verb is in past tense (said, told, asked)",
        "All reported sentences use 'that' — statements use 'that'; questions use 'if/whether'; commands use 'to + infinitive'",
        "Pronouns don't change — pronouns change based on who is speaking and who is being spoken to",
      ],
      shortcuts_and_tricks: [
        "Tense backshift table: am/is→was, are→were, have/has→had, will→would, can→could, may→might",
        "Time word changes: now→then, today→that day, yesterday→the previous day, tomorrow→the next day",
        "Three reported speech types: statement (that), yes/no question (if/whether), wh-question (wh-word + reported)",
        "Command structure: told/asked/ordered + object + to + infinitive",
      ],
      diagram_description: "none",
      key_takeaway: "Reported speech is one of the most tested grammar points in CBSE board exams, appearing in both grammar sections and reading comprehension. Mastering the three types — statements, questions, and commands — with correct tense shifts and pronoun changes is essential.",
    },
  },
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10_000 });
  console.log("MongoDB connected");

  let created = 0;
  let updated = 0;

  for (const topic of TOPICS) {
    const existing = await NcertTopicContent.findOne({ topicId: topic.topicId });
    if (existing) {
      await NcertTopicContent.updateOne({ topicId: topic.topicId }, { $set: topic });
      updated++;
    } else {
      await NcertTopicContent.create(topic);
      created++;
    }
    console.log(`  ✓ ${topic.topicId} — ${topic.name}`);
  }

  console.log(`\n✅ English content: ${created} created, ${updated} updated (${TOPICS.length} total)`);
  await mongoose.disconnect();
}

run().catch((e) => { console.error(e); process.exit(1); });
