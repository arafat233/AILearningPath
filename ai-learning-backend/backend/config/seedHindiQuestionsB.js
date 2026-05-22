/**
 * Hindi MCQs — Sparsh Bhaag 2 (Ch 13–26)
 * topicIds: hin_sp_ch13 … hin_sp_ch26
 * All questions in Hindi. Safe to re-run (skips duplicates on questionId).
 * Usage: node config/seedHindiQuestionsB.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import { Question } from "../models/index.js";

const Q = [
  // ── hin_sp_ch13: कबीर की साखियाँ ─────────────────────────────────────────
  {
    topic: "hin_sp_ch13", topicId: "hin_sp_ch13", questionId: "hin_sp_ch13_q1",
    subtopic: "भक्ति", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "कबीर किस भक्ति शाखा के कवि हैं?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "निर्गुण भक्ति — ज्ञानमार्गी", type: "correct", logicTag: "" },
      { text: "सगुण भक्ति — कृष्णभक्ति", type: "concept_error", logicTag: "confused_with_surdas" },
      { text: "सगुण भक्ति — रामभक्ति", type: "concept_error", logicTag: "confused_with_tulsi" },
      { text: "शक्ति भक्ति", type: "guessing", logicTag: "surface_guess" },
    ],
    solutionSteps: ["कबीर निर्गुण ज्ञानमार्गी भक्ति के प्रमुख कवि हैं — वे निराकार ईश्वर को मानते हैं।", "सूरदास = सगुण + कृष्णभक्ति; तुलसी = सगुण + रामभक्ति।"],
    shortcut: "कबीर = निर्गुण + ज्ञानमार्गी।",
  },
  {
    topic: "hin_sp_ch13", topicId: "hin_sp_ch13", questionId: "hin_sp_ch13_q2",
    subtopic: "भाषा", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "कबीर की भाषा को क्या कहते हैं?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "सधुक्कड़ी", type: "correct", logicTag: "" },
      { text: "अवधी", type: "concept_error", logicTag: "confused_with_tulsi" },
      { text: "ब्रजभाषा", type: "concept_error", logicTag: "confused_with_surdas" },
      { text: "खड़ी बोली", type: "concept_error", logicTag: "modern_hindi" },
    ],
    solutionSteps: ["कबीर की भाषा को 'सधुक्कड़ी' कहते हैं — यह अवधी, ब्रजभाषा, राजस्थानी, पंजाबी आदि का मिश्रण है।", "इसे 'खिचड़ी भाषा' भी कहते हैं।"],
    shortcut: "कबीर की भाषा = सधुक्कड़ी = कई भाषाओं का मिश्रण।",
  },
  {
    topic: "hin_sp_ch13", topicId: "hin_sp_ch13", questionId: "hin_sp_ch13_q3",
    subtopic: "साखी", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'बुरा जो देखन मैं चला, बुरा न मिलिया कोय' — इस साखी का संदेश क्या है?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "दूसरों में बुराई ढूँढने से पहले खुद को देखो — आत्म-परीक्षण करो", type: "correct", logicTag: "" },
      { text: "दुनिया में कोई बुरा नहीं है", type: "concept_error", logicTag: "oversimplification" },
      { text: "बुरे लोगों से दूर रहो", type: "partial_logic", logicTag: "misread_message" },
      { text: "यात्रा करना अच्छा है", type: "concept_error", logicTag: "literal_misread" },
    ],
    solutionSteps: ["कबीर कहते हैं: जब मैं दूसरों में बुराई खोजने निकला तो कोई बुरा नहीं मिला।", "जब अपने मन को खोजा तो पाया — मुझसे बुरा कोई नहीं। यह आत्म-परीक्षण का संदेश है।"],
    shortcut: "साखी का केंद्र = आत्म-परीक्षण; पहले खुद को सुधारो।",
  },
  {
    topic: "hin_sp_ch13", topicId: "hin_sp_ch13", questionId: "hin_sp_ch13_q4",
    subtopic: "छंद", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "कबीर की 'साखी' किस छंद में होती है?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "दोहा", type: "correct", logicTag: "" },
      { text: "चौपाई", type: "concept_error", logicTag: "confused_with_tulsi" },
      { text: "सवैया", type: "concept_error", logicTag: "riti_form" },
      { text: "रुबाई", type: "concept_error", logicTag: "urdu_form" },
    ],
    solutionSteps: ["कबीर की साखियाँ दोहा छंद में हैं।", "दोहा = दो पंक्तियाँ, मात्रिक छंद — 13+11 मात्राएँ।"],
    shortcut: "साखी = दोहा; सबद = पद (गाया जाता)।",
  },

  // ── hin_sp_ch14: मीरा के पद ──────────────────────────────────────────────
  {
    topic: "hin_sp_ch14", topicId: "hin_sp_ch14", questionId: "hin_sp_ch14_q1",
    subtopic: "भक्ति", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "मीरा 'गिरिधर गोपाल' किसे कहती हैं?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "श्रीकृष्ण को", type: "correct", logicTag: "" },
      { text: "शिवजी को", type: "concept_error", logicTag: "wrong_deity" },
      { text: "राम को", type: "concept_error", logicTag: "confused_with_tulsi" },
      { text: "विष्णु को (अलग रूप में)", type: "partial_logic", logicTag: "technically_correct_but_imprecise" },
    ],
    solutionSteps: ["गिरिधर = गिरि (गोवर्धन पर्वत) धर (उठाने वाले) = कृष्ण।", "मीरा कृष्ण को ही 'गिरिधर गोपाल' कहकर पुकारती हैं।"],
    shortcut: "गिरिधर = गोवर्धन उठाने वाले = कृष्ण।",
  },
  {
    topic: "hin_sp_ch14", topicId: "hin_sp_ch14", questionId: "hin_sp_ch14_q2",
    subtopic: "भाव", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "मीरा की भक्ति का मुख्य भाव क्या है?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "माधुर्य भाव (प्रिय-प्रेम)", type: "correct", logicTag: "" },
      { text: "दास्य भाव", type: "concept_error", logicTag: "confused_with_tulsi" },
      { text: "शांत भाव", type: "concept_error", logicTag: "wrong_bhav" },
      { text: "सख्य भाव", type: "concept_error", logicTag: "wrong_bhav" },
    ],
    solutionSteps: ["मीरा कृष्ण को प्रिय/पति मानती हैं — यह माधुर्य (मधुर प्रेम) भाव है।", "तुलसी = दास्य; मीरा = माधुर्य।"],
    shortcut: "मीरा = माधुर्य भाव = कृष्ण को पति मानना।",
  },
  {
    topic: "hin_sp_ch14", topicId: "hin_sp_ch14", questionId: "hin_sp_ch14_q3",
    subtopic: "साहित्यिक महत्त्व", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "महादेवी वर्मा को 'आधुनिक मीरा' क्यों कहा जाता है?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "उनकी कविता में भी मीरा जैसी विरह-भावना और आध्यात्मिक प्रेम है", type: "correct", logicTag: "" },
      { text: "वे भी कृष्ण की भक्त थीं", type: "partial_logic", logicTag: "incomplete" },
      { text: "उनका जीवन मीरा जैसा था", type: "partial_logic", logicTag: "incomplete" },
      { text: "उन्होंने मीरा के पदों का अनुवाद किया", type: "concept_error", logicTag: "wrong_reason" },
    ],
    solutionSteps: ["महादेवी की कविता में भी आध्यात्मिक विरह और प्रेम की पीड़ा है।", "इसीलिए उन्हें 'आधुनिक मीरा' की उपाधि मिली।"],
    shortcut: "महादेवी = आधुनिक मीरा = विरह + आध्यात्मिक प्रेम।",
  },

  // ── hin_sp_ch15: बिहारी के दोहे ─────────────────────────────────────────
  {
    topic: "hin_sp_ch15", topicId: "hin_sp_ch15", questionId: "hin_sp_ch15_q1",
    subtopic: "रचना", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "बिहारी की प्रसिद्ध रचना का नाम क्या है?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "बिहारी सतसई", type: "correct", logicTag: "" },
      { text: "दोहावली", type: "concept_error", logicTag: "confused_with_tulsi" },
      { text: "पद्मावत", type: "concept_error", logicTag: "wrong_author" },
      { text: "रामचरितमानस", type: "concept_error", logicTag: "wrong_author" },
    ],
    solutionSteps: ["बिहारी की रचना 'बिहारी सतसई' है जिसमें लगभग 700 दोहे हैं।", "सतसई = सात सौ = 700।"],
    shortcut: "बिहारी → सतसई (700 दोहे)।",
  },
  {
    topic: "hin_sp_ch15", topicId: "hin_sp_ch15", questionId: "hin_sp_ch15_q2",
    subtopic: "विशेषता", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "बिहारी की काव्य-विशेषता को किस कहावत से जाना जाता है?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "'गागर में सागर'", type: "correct", logicTag: "" },
      { text: "'सरल शब्दों में गहरी बात'", type: "partial_logic", logicTag: "incomplete" },
      { text: "'जितना कहा उससे अधिक छोड़ा'", type: "partial_logic", logicTag: "vague" },
      { text: "'शब्दों में जादू'", type: "guessing", logicTag: "surface_guess" },
    ],
    solutionSteps: ["बिहारी कम शब्दों (गागर) में बड़ा अर्थ (सागर) भरते हैं।", "'गागर में सागर' = बिहारी की संक्षिप्तता में गहराई।"],
    shortcut: "बिहारी = गागर में सागर = कम शब्दों में अधिक अर्थ।",
  },
  {
    topic: "hin_sp_ch15", topicId: "hin_sp_ch15", questionId: "hin_sp_ch15_q3",
    subtopic: "अलंकार", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'सोहत ओढ़े पीत पट' दोहे में 'मनो नीलमनि सैल पर आतप परयौ प्रभात' — यहाँ कौन-सा अलंकार है?",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 1, isAIGenerated: true,
    options: [
      { text: "उत्प्रेक्षा", type: "correct", logicTag: "" },
      { text: "उपमा", type: "concept_error", logicTag: "similar_but_wrong" },
      { text: "अनुप्रास", type: "concept_error", logicTag: "different_alankaar" },
      { text: "रूपक", type: "concept_error", logicTag: "similar_but_wrong" },
    ],
    solutionSteps: ["'मनो' (मानो/जैसे) शब्द उत्प्रेक्षा अलंकार का संकेत है।", "उत्प्रेक्षा = जहाँ उपमेय में उपमान की संभावना की जाए ('मनो', 'मानो', 'जानो')।"],
    shortcut: "'मनो' = उत्प्रेक्षा अलंकार का संकेतक शब्द।",
  },

  // ── hin_sp_ch16: मैथिलीशरण गुप्त — मनुष्यता ──────────────────────────
  {
    topic: "hin_sp_ch16", topicId: "hin_sp_ch16", questionId: "hin_sp_ch16_q1",
    subtopic: "उपाधि", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "मैथिलीशरण गुप्त को क्या कहा जाता है?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "राष्ट्रकवि", type: "correct", logicTag: "" },
      { text: "महाकवि", type: "concept_error", logicTag: "generic_title" },
      { text: "जनकवि", type: "concept_error", logicTag: "confused_with_nagarjun" },
      { text: "आधुनिक तुलसी", type: "partial_logic", logicTag: "informal_title" },
    ],
    solutionSteps: ["मैथिलीशरण गुप्त को 'राष्ट्रकवि' की उपाधि प्रदान की गई है।", "उनकी कविता में भारतीय संस्कृति और राष्ट्रीयता का भाव है।"],
    shortcut: "मैथिलीशरण गुप्त = राष्ट्रकवि।",
  },
  {
    topic: "hin_sp_ch16", topicId: "hin_sp_ch16", questionId: "hin_sp_ch16_q2",
    subtopic: "भाव", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'मनुष्यता' कविता में सच्चा मनुष्य कौन है?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "जो दूसरों के लिए जीए और मृत्यु के बाद भी याद किया जाए", type: "correct", logicTag: "" },
      { text: "जो धनी और ताकतवर हो", type: "concept_error", logicTag: "material_definition" },
      { text: "जो केवल धर्म का पालन करे", type: "partial_logic", logicTag: "incomplete" },
      { text: "जो विद्वान हो", type: "concept_error", logicTag: "incomplete_definition" },
    ],
    solutionSteps: ["कवि कहते हैं — परोपकार करने वाला, जो दूसरों के लिए जीता-मरता है, वही सच्चा मनुष्य है।", "ऐसे व्यक्ति की याद मृत्यु के बाद भी जीवित रहती है।"],
    shortcut: "सच्चा मनुष्य = परोपकार + मृत्यु के बाद स्मरणीय।",
  },
  {
    topic: "hin_sp_ch16", topicId: "hin_sp_ch16", questionId: "hin_sp_ch16_q3",
    subtopic: "सूक्ति", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'वसुधैव कुटुम्बकम्' का अर्थ क्या है?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "सारी पृथ्वी एक परिवार है", type: "correct", logicTag: "" },
      { text: "परिवार सर्वोपरि है", type: "concept_error", logicTag: "limited_scope" },
      { text: "वसुधा माँ के समान है", type: "partial_logic", logicTag: "incomplete" },
      { text: "विश्व में भाईचारा हो", type: "partial_logic", logicTag: "incomplete" },
    ],
    solutionSteps: ["वसुधैव = वसुधा (पृथ्वी) + एव (ही); कुटुम्बकम् = परिवार।", "अर्थ: सारी पृथ्वी ही एक परिवार है — यह सार्वभौमिक मानव-एकता का विचार है।"],
    shortcut: "वसुधैव कुटुम्बकम् = सारी पृथ्वी एक परिवार।",
  },

  // ── hin_sp_ch17: सुमित्रानंदन पंत ────────────────────────────────────────
  {
    topic: "hin_sp_ch17", topicId: "hin_sp_ch17", questionId: "hin_sp_ch17_q1",
    subtopic: "शब्दार्थ", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'पर्वत प्रदेश में पावस' में 'पावस' का क्या अर्थ है?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "वर्षा ऋतु", type: "correct", logicTag: "" },
      { text: "वसंत ऋतु", type: "concept_error", logicTag: "wrong_season" },
      { text: "ग्रीष्म ऋतु", type: "concept_error", logicTag: "wrong_season" },
      { text: "शरद ऋतु", type: "guessing", logicTag: "surface_guess" },
    ],
    solutionSteps: ["'पावस' = वर्षा ऋतु (मानसून)।", "कविता वर्षा ऋतु में पर्वतीय क्षेत्र की प्राकृतिक सुंदरता का वर्णन करती है।"],
    shortcut: "पावस = वर्षा ऋतु।",
  },
  {
    topic: "hin_sp_ch17", topicId: "hin_sp_ch17", questionId: "hin_sp_ch17_q2",
    subtopic: "अलंकार", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "पंत की कविता 'पर्वत प्रदेश में पावस' में मुख्यतः कौन-सा अलंकार है?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "मानवीकरण (Personification)", type: "correct", logicTag: "" },
      { text: "यमक", type: "concept_error", logicTag: "different_alankaar" },
      { text: "श्लेष", type: "concept_error", logicTag: "different_alankaar" },
      { text: "विरोधाभास", type: "concept_error", logicTag: "different_alankaar" },
    ],
    solutionSteps: ["पंत ने पर्वत को इंसान की तरह चित्रित किया है ('अपने सहस्र दृग सुमन फाड़, अवलोक रहा')।", "यह मानवीकरण अलंकार है — निर्जीव को सजीव की तरह प्रस्तुत करना।"],
    shortcut: "पंत = मानवीकरण; पर्वत को इंसान जैसा चित्रित किया।",
  },

  // ── hin_sp_ch18: महादेवी वर्मा ──────────────────────────────────────────
  {
    topic: "hin_sp_ch18", topicId: "hin_sp_ch18", questionId: "hin_sp_ch18_q1",
    subtopic: "प्रतीक", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'मधुर-मधुर मेरे दीपक जल' में 'दीपक' किसका प्रतीक है?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "आत्मा का", type: "correct", logicTag: "" },
      { text: "घर के दीपक का (शाब्दिक)", type: "concept_error", logicTag: "literal_meaning" },
      { text: "सूरज का", type: "concept_error", logicTag: "wrong_symbol" },
      { text: "प्रेम का", type: "partial_logic", logicTag: "incomplete" },
    ],
    solutionSteps: ["दीपक = आत्मा; तेल = जीवन-शक्ति; प्रकाश = ज्ञान/प्रेम।", "कविता में आत्मा को जलते रहने का आह्वान है — यह आत्म-समर्पण की भावना है।"],
    shortcut: "दीपक = आत्मा; प्रकाश = ज्ञान/प्रेम।",
  },
  {
    topic: "hin_sp_ch18", topicId: "hin_sp_ch18", questionId: "hin_sp_ch18_q2",
    subtopic: "उपाधि", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "महादेवी वर्मा को छायावाद में किस नाम से जाना जाता है?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "आधुनिक मीरा", type: "correct", logicTag: "" },
      { text: "महिला निराला", type: "guessing", logicTag: "invented_title" },
      { text: "हिंदी की सरस्वती", type: "partial_logic", logicTag: "informal_title" },
      { text: "प्रेम की देवी", type: "guessing", logicTag: "surface_guess" },
    ],
    solutionSteps: ["महादेवी वर्मा को 'आधुनिक मीरा' कहा जाता है।", "कारण: उनकी विरह-भावना और आध्यात्मिक प्रेम मीरा की भक्ति जैसी है।"],
    shortcut: "महादेवी = आधुनिक मीरा = विरह + आत्म-समर्पण।",
  },

  // ── hin_sp_ch19: वीरेन डंगवाल — तोप ────────────────────────────────────
  {
    topic: "hin_sp_ch19", topicId: "hin_sp_ch19", questionId: "hin_sp_ch19_q1",
    subtopic: "प्रतीक", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'तोप' कविता में तोप किसका प्रतीक है?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "ब्रिटिश औपनिवेशिक शक्ति और उसकी क्रूरता का", type: "correct", logicTag: "" },
      { text: "आधुनिक सैन्य शक्ति का", type: "concept_error", logicTag: "wrong_context" },
      { text: "भारतीय शक्ति का", type: "concept_error", logicTag: "opposite_symbol" },
      { text: "शांति का", type: "concept_error", logicTag: "opposite_meaning" },
    ],
    solutionSteps: ["तोप = 1857 की क्रांति में इस्तेमाल ब्रिटिश हथियार = औपनिवेशिक क्रूरता का प्रतीक।", "कविता व्यंग्यात्मक है — अब यही तोप बच्चों का खिलौना बन गई है।"],
    shortcut: "तोप = ब्रिटिश क्रूरता का प्रतीक; अब निष्क्रिय = शक्ति का पतन।",
  },
  {
    topic: "hin_sp_ch19", topicId: "hin_sp_ch19", questionId: "hin_sp_ch19_q2",
    subtopic: "भाव", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "कविता में तोप अब क्या करती है?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "बच्चों के खेलने और गिलहरियों के घर बनाने का साधन बन गई है", type: "correct", logicTag: "" },
      { text: "अभी भी गोले दागती है", type: "concept_error", logicTag: "wrong_state" },
      { text: "संग्रहालय में सुरक्षित है", type: "concept_error", logicTag: "wrong_location" },
      { text: "कबाड़ में बिक गई", type: "concept_error", logicTag: "wrong_fate" },
    ],
    solutionSteps: ["अब बच्चे तोप पर चढ़ते हैं, गिलहरियाँ उसमें घोंसले बनाती हैं।", "यह शक्तिशाली हथियार का पतन और जीवन की जिजीविषा दिखाता है।"],
    shortcut: "तोप अब = बच्चों का खिलौना + गिलहरियों का घर।",
  },

  // ── hin_sp_ch20: प्रेमचंद — बड़े भाई साहब ──────────────────────────────
  {
    topic: "hin_sp_ch20", topicId: "hin_sp_ch20", questionId: "hin_sp_ch20_q1",
    subtopic: "पात्र", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'बड़े भाई साहब' कहानी में परीक्षा में कौन फेल होता है?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "बड़े भाई साहब", type: "correct", logicTag: "" },
      { text: "छोटा भाई", type: "concept_error", logicTag: "opposite" },
      { text: "दोनों", type: "concept_error", logicTag: "wrong" },
      { text: "कोई नहीं फेल होता", type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: ["बड़े भाई साहब खूब पढ़ते हैं पर परीक्षा में फेल होते हैं।", "छोटा भाई कम मेहनत से भी पास हो जाता है — यही विडंबना है।"],
    shortcut: "बड़े भाई = पढ़ते हैं + फेल होते हैं; छोटे = कम पढ़ते + पास।",
  },
  {
    topic: "hin_sp_ch20", topicId: "hin_sp_ch20", questionId: "hin_sp_ch20_q2",
    subtopic: "संदेश", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'बड़े भाई साहब' कहानी का मुख्य संदेश क्या है?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "किताबी ज्ञान और जीवन-अनुभव दोनों ज़रूरी हैं", type: "correct", logicTag: "" },
      { text: "पढ़ाई ज़रूरी नहीं है", type: "concept_error", logicTag: "misread_message" },
      { text: "बड़े भाई हमेशा सही होते हैं", type: "partial_logic", logicTag: "oversimplification" },
      { text: "परीक्षा में फेल होना ठीक है", type: "concept_error", logicTag: "wrong_message" },
    ],
    solutionSteps: ["कहानी में किताबी ज्ञान और व्यावहारिक जीवन-अनुभव दोनों की ज़रूरत बताई गई है।", "बड़े भाई में अनुभव है, छोटे में परीक्षाई बुद्धि — दोनों अपूर्ण हैं।"],
    shortcut: "बड़े भाई साहब = किताब + जीवन दोनों चाहिए।",
  },
  {
    topic: "hin_sp_ch20", topicId: "hin_sp_ch20", questionId: "hin_sp_ch20_q3",
    subtopic: "दृश्य", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "कहानी के अंत में बड़े भाई साहब क्या करते हैं जो छोटे को चौंका देता है?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "पतंग की डोर खुद थाम लेते हैं", type: "correct", logicTag: "" },
      { text: "छोटे को माफ़ कर देते हैं", type: "concept_error", logicTag: "different_action" },
      { text: "रो पड़ते हैं", type: "concept_error", logicTag: "wrong_action" },
      { text: "घर छोड़ देते हैं", type: "concept_error", logicTag: "wrong_action" },
    ],
    solutionSteps: ["जब छोटा भाई पतंग उड़ाते पकड़ा जाता है और बड़े भाई डाँटने आते हैं।", "लेकिन बड़े भाई खुद पतंग की डोर थाम लेते हैं — यह उनके चरित्र की मानवीय जटिलता है।"],
    shortcut: "बड़े भाई = उपदेश देते + खुद पतंग उड़ाते = मानवीय विडंबना।",
  },

  // ── hin_sp_ch21: सीताराम सेकसरिया — डायरी का एक पन्ना ──────────────────
  {
    topic: "hin_sp_ch21", topicId: "hin_sp_ch21", questionId: "hin_sp_ch21_q1",
    subtopic: "घटना", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'डायरी का एक पन्ना' किस तारीख की घटना का वर्णन करता है?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "26 जनवरी 1931", type: "correct", logicTag: "" },
      { text: "15 अगस्त 1947", type: "concept_error", logicTag: "independence_day" },
      { text: "26 जनवरी 1950", type: "concept_error", logicTag: "republic_day" },
      { text: "2 अक्टूबर 1930", type: "guessing", logicTag: "surface_guess" },
    ],
    solutionSteps: ["यह पाठ 26 जनवरी 1931 को कोलकाता में तिरंगा फहराने के आंदोलन का वर्णन है।", "15 अगस्त 1947 = स्वतंत्रता; 26 जनवरी 1950 = गणतंत्र दिवस — ये 1931 की घटना नहीं।"],
    shortcut: "डायरी का एक पन्ना = 26 जनवरी 1931 कोलकाता।",
  },
  {
    topic: "hin_sp_ch21", topicId: "hin_sp_ch21", questionId: "hin_sp_ch21_q2",
    subtopic: "विधा", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "डायरी-विधा की मुख्य विशेषता क्या है?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "दिनांक सहित लेखक का प्रत्यक्ष अनुभव और व्यक्तिगत विचार", type: "correct", logicTag: "" },
      { text: "तीसरे व्यक्ति में लिखना", type: "concept_error", logicTag: "wrong_feature" },
      { text: "काल्पनिक घटनाओं का वर्णन", type: "concept_error", logicTag: "fiction_not_diary" },
      { text: "केवल ऐतिहासिक तथ्य लिखना", type: "partial_logic", logicTag: "incomplete" },
    ],
    solutionSteps: ["डायरी = दिनांक + प्रथम पुरुष में लेखन + प्रत्यक्ष अनुभव + व्यक्तिगत भावनाएँ।", "यह आत्मकथा से अलग है — डायरी रोज़ाना लिखी जाती है।"],
    shortcut: "डायरी = दिनांक + प्रत्यक्ष अनुभव + व्यक्तिगत विचार।",
  },

  // ── hin_sp_ch22: लीलाधर मंडलोई — तताँरा-वामीरो कथा ─────────────────────
  {
    topic: "hin_sp_ch22", topicId: "hin_sp_ch22", questionId: "hin_sp_ch22_q1",
    subtopic: "स्थान", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "तताँरा-वामीरो की कथा किस द्वीप समूह की लोककथा है?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "अंडमान-निकोबार द्वीप समूह", type: "correct", logicTag: "" },
      { text: "लक्षद्वीप", type: "concept_error", logicTag: "wrong_islands" },
      { text: "मालदीव", type: "concept_error", logicTag: "foreign_islands" },
      { text: "श्रीलंका", type: "guessing", logicTag: "surface_guess" },
    ],
    solutionSteps: ["तताँरा-वामीरो अंडमान-निकोबार द्वीप समूह की लोककथा है।", "यह कथा लिटिल अंडमान और कार-निकोबार के अलग होने की पौराणिक व्याख्या है।"],
    shortcut: "तताँरा-वामीरो = अंडमान-निकोबार की लोककथा।",
  },
  {
    topic: "hin_sp_ch22", topicId: "hin_sp_ch22", questionId: "hin_sp_ch22_q2",
    subtopic: "संघर्ष", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "तताँरा और वामीरो के प्रेम में क्या बाधा थी?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "अलग-अलग कबीलों का होना — परंपरा के अनुसार अंतर-कबीला विवाह वर्जित था", type: "correct", logicTag: "" },
      { text: "तताँरा का गरीब होना", type: "concept_error", logicTag: "wrong_reason" },
      { text: "उम्र का अंतर", type: "concept_error", logicTag: "wrong_reason" },
      { text: "भाषा की भिन्नता", type: "concept_error", logicTag: "invented_reason" },
    ],
    solutionSteps: ["उस समय की परंपरा: अलग-अलग कबीलों में विवाह वर्जित था।", "यही बाधा प्रेम और सामाजिक नियम का टकराव बनती है — कहानी का मूल संघर्ष।"],
    shortcut: "तताँरा-वामीरो = अलग कबीले = विवाह वर्जित = प्रेम-समाज संघर्ष।",
  },

  // ── hin_sp_ch23: प्रहलाद अग्रवाल — तीसरी कसम के शिल्पकार शैलेंद्र ────────
  {
    topic: "hin_sp_ch23", topicId: "hin_sp_ch23", questionId: "hin_sp_ch23_q1",
    subtopic: "फिल्म", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "फिल्म 'तीसरी कसम' किस कहानी पर आधारित है?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "फणीश्वरनाथ रेणु की 'मारे गए गुलफाम'", type: "correct", logicTag: "" },
      { text: "प्रेमचंद की 'पूस की रात'", type: "concept_error", logicTag: "wrong_story" },
      { text: "गुलेरी की 'उसने कहा था'", type: "concept_error", logicTag: "wrong_story" },
      { text: "मंटो की 'टोबा टेक सिंह'", type: "concept_error", logicTag: "wrong_story" },
    ],
    solutionSteps: ["'तीसरी कसम' (1966) फणीश्वरनाथ रेणु की कहानी 'मारे गए गुलफाम' पर आधारित है।", "फिल्म में राज कपूर और वहीदा रहमान थे; निर्माता शैलेंद्र थे।"],
    shortcut: "तीसरी कसम = रेणु की 'मारे गए गुलफाम' + शैलेंद्र (निर्माता)।",
  },
  {
    topic: "hin_sp_ch23", topicId: "hin_sp_ch23", questionId: "hin_sp_ch23_q2",
    subtopic: "संदेश", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "शैलेंद्र की 'तीसरी कसम' पाठ का मुख्य संदेश क्या है?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "सच्ची कला व्यावसायिक असफलता के बावजूद कालजयी होती है", type: "correct", logicTag: "" },
      { text: "फिल्म बनाना घाटे का काम है", type: "concept_error", logicTag: "wrong_message" },
      { text: "व्यावसायिक सफलता ही असली कला है", type: "concept_error", logicTag: "opposite_message" },
      { text: "शैलेंद्र को फिल्म नहीं बनानी चाहिए थी", type: "concept_error", logicTag: "wrong_message" },
    ],
    solutionSteps: ["फिल्म बॉक्स ऑफिस पर फ्लॉप हुई पर राष्ट्रपति पुरस्कार मिला।", "संदेश: कला बनाम व्यवसाय में कला की जीत होती है — कालजयी कृति टिकती है।"],
    shortcut: "तीसरी कसम = फ्लॉप + राष्ट्रपति पुरस्कार = कला > व्यापार।",
  },

  // ── hin_sp_ch24: मंटो — अब कहाँ दूसरे के दुख से दुखी होने वाले ─────────────
  {
    topic: "hin_sp_ch24", topicId: "hin_sp_ch24", questionId: "hin_sp_ch24_q1",
    subtopic: "विषय", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "इस पाठ में मुख्य चिंता किस बारे में व्यक्त की गई है?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "मानव द्वारा प्रकृति और जीव-जंतुओं के सहअस्तित्व का विनाश", type: "correct", logicTag: "" },
      { text: "आर्थिक असमानता", type: "concept_error", logicTag: "wrong_theme" },
      { text: "राजनीतिक भ्रष्टाचार", type: "concept_error", logicTag: "wrong_theme" },
      { text: "धार्मिक कट्टरता", type: "concept_error", logicTag: "wrong_theme" },
    ],
    solutionSteps: ["पाठ में शहरीकरण के कारण मानव-प्रकृति सहअस्तित्व के नष्ट होने की चिंता है।", "जब इंसान का लालच बढ़ता है, तो पशु-पक्षियों की जगह खत्म होती है।"],
    shortcut: "मंटो पाठ = प्रकृति + जीव + मानव सहअस्तित्व का नाश।",
  },

  // ── hin_sp_ch25: सर्वेश्वरदयाल सक्सेना — पतझर में टूटी पत्तियाँ ───────────
  {
    topic: "hin_sp_ch25", topicId: "hin_sp_ch25", questionId: "hin_sp_ch25_q1",
    subtopic: "रूपक", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'गिन्नी का सोना' में गिन्नी क्या होती है?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "ताँबा मिला हुआ सोने का सिक्का (जो आभूषण बनाने योग्य होता है)", type: "correct", logicTag: "" },
      { text: "शुद्ध सोने का सिक्का", type: "concept_error", logicTag: "opposite" },
      { text: "चाँदी का सिक्का", type: "concept_error", logicTag: "wrong_metal" },
      { text: "सस्ती धातु", type: "concept_error", logicTag: "wrong_metal" },
    ],
    solutionSteps: ["गिन्नी = सोने में ताँबा मिला हुआ सिक्का।", "शुद्ध सोना बहुत मुलायम होता है — थोड़ा ताँबा मिलाने से वह टिकाऊ बनता है।"],
    shortcut: "गिन्नी = सोना + ताँबा = व्यावहारिक सोना।",
  },
  {
    topic: "hin_sp_ch25", topicId: "hin_sp_ch25", questionId: "hin_sp_ch25_q2",
    subtopic: "संदेश", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'झेन की देन' में 'टी-सेरेमनी' का मुख्य उद्देश्य क्या है?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "मन को शांत और एकाग्र करना", type: "correct", logicTag: "" },
      { text: "चाय की तारीफ करना", type: "concept_error", logicTag: "literal_purpose" },
      { text: "जापानी संस्कृति दिखाना", type: "partial_logic", logicTag: "incomplete" },
      { text: "मेहमानों का स्वागत करना", type: "partial_logic", logicTag: "secondary_purpose" },
    ],
    solutionSteps: ["टी-सेरेमनी = धीरे-धीरे, ध्यानपूर्वक चाय पीने की परंपरा।", "यह भागदौड़ भरे जापानी जीवन में मन को शांत और केंद्रित करने का उपाय है।"],
    shortcut: "टी-सेरेमनी = माइंडफुलनेस + मन की शांति।",
  },

  // ── hin_sp_ch26: हबीब तनवीर — कारतूस ────────────────────────────────────
  {
    topic: "hin_sp_ch26", topicId: "hin_sp_ch26", questionId: "hin_sp_ch26_q1",
    subtopic: "वीरता", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'कारतूस' एकांकी में वज़ीर अली की वीरता का सबसे बड़ा प्रमाण क्या है?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "वह स्वयं दुश्मन के शिविर में जाकर कारतूस माँग लाया", type: "correct", logicTag: "" },
      { text: "उसने अनेक सैनिकों को मारा", type: "concept_error", logicTag: "wrong_act" },
      { text: "उसने अंग्रेज़ों से संधि की", type: "concept_error", logicTag: "opposite_act" },
      { text: "वह जेल से भाग निकला", type: "concept_error", logicTag: "wrong_act" },
    ],
    solutionSteps: ["वज़ीर अली खुद कर्नल के तंबू में आकर कारतूस माँगता है और कर्नल को पहचाने बिना चला जाता है।", "यह अदम्य साहस और बुद्धिमत्ता दोनों का प्रमाण है।"],
    shortcut: "वज़ीर अली = दुश्मन के शिविर में कारतूस माँगना = अपराजेय साहस।",
  },
  {
    topic: "hin_sp_ch26", topicId: "hin_sp_ch26", questionId: "hin_sp_ch26_q2",
    subtopic: "काव्य-रूप", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'एकांकी' नाटक किसे कहते हैं?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "एक अंक वाला छोटा नाटक", type: "correct", logicTag: "" },
      { text: "एक अभिनेता का नाटक", type: "concept_error", logicTag: "wrong_definition" },
      { text: "एक घंटे का नाटक", type: "concept_error", logicTag: "wrong_definition" },
      { text: "एकल गायन", type: "concept_error", logicTag: "wrong_form" },
    ],
    solutionSteps: ["एकांकी = एक + अंक = एक अंक वाला नाटक।", "पूर्ण नाटक में कई अंक होते हैं; एकांकी छोटा और केंद्रित होता है।"],
    shortcut: "एकांकी = 1 अंक; नाटक = कई अंक।",
  },
  {
    topic: "hin_sp_ch26", topicId: "hin_sp_ch26", questionId: "hin_sp_ch26_q3",
    subtopic: "नाटकीय विधा", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'कारतूस' में नाटकीय विडंबना का उदाहरण कौन-सा है?",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 1, isAIGenerated: true,
    options: [
      { text: "दर्शक जानते हैं कि आया व्यक्ति वज़ीर अली है, पर कर्नल नहीं पहचानता", type: "correct", logicTag: "" },
      { text: "वज़ीर अली का जंगल में रहना", type: "concept_error", logicTag: "wrong_example" },
      { text: "कर्नल का डरना", type: "concept_error", logicTag: "wrong_example" },
      { text: "सिपाहियों की संख्या", type: "guessing", logicTag: "surface_guess" },
    ],
    solutionSteps: ["नाटकीय विडंबना (Dramatic Irony) = जब दर्शक कुछ जानें पर पात्र न जाने।", "यहाँ दर्शक को पता है वज़ीर अली आया है, पर कर्नल पहचान नहीं पाता।"],
    shortcut: "नाटकीय विडंबना = दर्शक जाने, पात्र न जाने।",
  },
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10_000 });
  console.log("MongoDB connected");

  let inserted = 0;
  let skipped  = 0;

  for (const q of Q) {
    const exists = await Question.findOne({ questionId: q.questionId });
    if (exists) { skipped++; continue; }
    await Question.create(q);
    inserted++;
  }

  console.log(`\nHindi Questions B: ${inserted} inserted, ${skipped} already existed (${Q.length} total)`);
  await mongoose.disconnect();
}

run().catch((err) => { console.error(err); process.exit(1); });
