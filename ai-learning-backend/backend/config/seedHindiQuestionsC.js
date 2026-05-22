/**
 * Hindi MCQs — Kritika Bhaag 2 (Ch 27–29) + Sanchayan Bhaag 2 (Ch 30–32)
 * topicIds: hin_kr_ch27–29, hin_sy_ch30–32
 * All questions in Hindi. Safe to re-run (upserts on questionId).
 * Usage: node config/seedHindiQuestionsC.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import { Question } from "../models/index.js";

const questions = [
  // ── Ch 27: माता का आँचल ──────────────────────────────────────────────
  {
    questionId: "hin_kr_ch27_q1",
    topic: "hin_kr_ch27", topicId: "hin_kr_ch27",
    subtopic: "पात्र-परिचय",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'माता का आँचल' पाठ का मुख्य पात्र किस नाम से जाना जाता है?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "भोलानाथ", type: "correct", logicTag: "" },
      { text: "रामलाल", type: "misinterpretation", logicTag: "wrong_name" },
      { text: "हरिराम", type: "misinterpretation", logicTag: "wrong_name" },
      { text: "मोहन", type: "misinterpretation", logicTag: "wrong_name" },
    ],
    solutionSteps: [
      "पाठ का मुख्य पात्र 'तारकेश्वरनाथ' है।",
      "घर में उसे प्यार से 'भोलानाथ' कहा जाता है।",
    ],
    shortcut: "तारकेश्वरनाथ = घर का नाम → भोलानाथ",
  },
  {
    questionId: "hin_kr_ch27_q2",
    topic: "hin_kr_ch27", topicId: "hin_kr_ch27",
    subtopic: "माँ की ममता",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "भोलानाथ डर जाने पर किसके पास भागता है?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "माँ के पास", type: "correct", logicTag: "" },
      { text: "पिता के पास", type: "concept_error", logicTag: "opposite_answer" },
      { text: "दोस्तों के पास", type: "misinterpretation", logicTag: "wrong_person" },
      { text: "दादा के पास", type: "misinterpretation", logicTag: "wrong_person" },
    ],
    solutionSteps: [
      "पिता से गहरा लगाव होने के बावजूद...",
      "जब भोलानाथ को साँप दिखता है और डर जाता है, वह माँ के आँचल में छुप जाता है।",
      "यही पाठ का मूल भाव है — संकट में माँ ही अंतिम शरण है।",
    ],
    shortcut: "खेल = पिता के साथ; डर = माँ के आँचल में",
  },
  {
    questionId: "hin_kr_ch27_q3",
    topic: "hin_kr_ch27", topicId: "hin_kr_ch27",
    subtopic: "विधा",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'माता का आँचल' किस साहित्यिक विधा में लिखी गई है?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.4, marks: 1, isAIGenerated: true,
    options: [
      { text: "आत्मकथात्मक संस्मरण", type: "correct", logicTag: "" },
      { text: "उपन्यास", type: "misinterpretation", logicTag: "wrong_genre" },
      { text: "कहानी", type: "misinterpretation", logicTag: "wrong_genre" },
      { text: "नाटक", type: "misinterpretation", logicTag: "wrong_genre" },
    ],
    solutionSteps: [
      "'माता का आँचल' शिवपूजन सहाय की आत्मकथात्मक संस्मरण-शैली की रचना है।",
      "लेखक अपने बचपन की स्मृतियाँ सुनाते हैं।",
    ],
    shortcut: "शिवपूजन सहाय → संस्मरण",
  },
  {
    questionId: "hin_kr_ch27_q4",
    topic: "hin_kr_ch27", topicId: "hin_kr_ch27",
    subtopic: "प्रतीक",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "पाठ का शीर्षक 'माता का आँचल' किसका प्रतीक है?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.4, marks: 1, isAIGenerated: true,
    options: [
      { text: "माँ की ममता और सुरक्षा का", type: "correct", logicTag: "" },
      { text: "माँ के कपड़े के टुकड़े का", type: "concept_error", logicTag: "literal_meaning" },
      { text: "परंपरागत पहनावे का", type: "misinterpretation", logicTag: "wrong_symbol" },
      { text: "घर की छत का", type: "misinterpretation", logicTag: "wrong_symbol" },
    ],
    solutionSteps: [
      "आँचल = साड़ी का पल्लू।",
      "साहित्य में आँचल माँ के प्रेम, ममता और सुरक्षा का प्रतीक है।",
      "संकट में बच्चे की सबसे पहली शरण माँ का आँचल होता है।",
    ],
    shortcut: "आँचल = ममता + सुरक्षा (literal नहीं, प्रतीक)",
  },

  // ── Ch 28: जॉर्ज पंचम की नाक ──────────────────────────────────────────
  {
    questionId: "hin_kr_ch28_q1",
    topic: "hin_kr_ch28", topicId: "hin_kr_ch28",
    subtopic: "व्यंग्य",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'जॉर्ज पंचम की नाक' कहानी का मुख्य व्यंग्य किस पर है?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "औपनिवेशिक मानसिकता और नौकरशाही पर", type: "correct", logicTag: "" },
      { text: "पर्यटन व्यवस्था पर", type: "misinterpretation", logicTag: "wrong_target" },
      { text: "जनता की मूर्खता पर", type: "misinterpretation", logicTag: "wrong_target" },
      { text: "मूर्तिकला पर", type: "misinterpretation", logicTag: "wrong_target" },
    ],
    solutionSteps: [
      "कहानी आज़ाद भारत में उस मानसिकता पर व्यंग्य करती है...",
      "जो अभी भी औपनिवेशिक प्रतीकों (जॉर्ज पंचम की मूर्ति) को संरक्षित करने में व्यस्त है।",
      "नौकरशाही का समय और ऊर्जा इस व्यर्थ कार्य में बर्बाद होता है।",
    ],
    shortcut: "नाक = प्रतिष्ठा → गुलाम मानसिकता का व्यंग्य",
  },
  {
    questionId: "hin_kr_ch28_q2",
    topic: "hin_kr_ch28", topicId: "hin_kr_ch28",
    subtopic: "चरमबिंदु",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "अंत में जॉर्ज पंचम की मूर्ति पर नाक कैसे लगाई जाती है?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.4, marks: 1, isAIGenerated: true,
    options: [
      { text: "किसी जीवित भारतीय की नाक काटकर", type: "correct", logicTag: "" },
      { text: "नया पत्थर तराशकर", type: "misinterpretation", logicTag: "wrong_ending" },
      { text: "विदेश से मँगाकर", type: "misinterpretation", logicTag: "wrong_ending" },
      { text: "मूर्ति ही बदल दी जाती है", type: "misinterpretation", logicTag: "wrong_ending" },
    ],
    solutionSteps: [
      "जब देश में कोई पत्थर काम नहीं आया...",
      "तो किसी जीवित भारतीय की नाक काटने का प्रस्ताव आता है।",
      "यह गुलाम मानसिकता की पराकाष्ठा है — जीवित इंसान की क़ीमत पर विदेशी राजा की नाक बचाना।",
    ],
    shortcut: "जीवित भारतीय की नाक = कहानी का चरमबिंदु और व्यंग्य की पराकाष्ठा",
  },
  {
    questionId: "hin_kr_ch28_q3",
    topic: "hin_kr_ch28", topicId: "hin_kr_ch28",
    subtopic: "लेखक-परिचय",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "कमलेश्वर किस साहित्यिक आंदोलन से जुड़े थे?",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.7, marks: 1, isAIGenerated: true,
    options: [
      { text: "नई कहानी आंदोलन", type: "correct", logicTag: "" },
      { text: "छायावाद", type: "concept_error", logicTag: "wrong_era" },
      { text: "प्रयोगवाद", type: "misinterpretation", logicTag: "wrong_movement" },
      { text: "प्रगतिवाद", type: "misinterpretation", logicTag: "wrong_movement" },
    ],
    solutionSteps: [
      "कमलेश्वर, मोहन राकेश और राजेंद्र यादव 1950-60 के दशक के 'नई कहानी' आंदोलन के प्रमुख लेखक थे।",
    ],
    shortcut: "कमलेश्वर + मोहन राकेश + राजेंद्र यादव → नई कहानी त्रयी",
  },

  // ── Ch 29: साना-साना हाथ जोड़ि ──────────────────────────────────────────
  {
    questionId: "hin_kr_ch29_q1",
    topic: "hin_kr_ch29", topicId: "hin_kr_ch29",
    subtopic: "शब्दार्थ",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'साना-साना हाथ जोड़ि' में 'साना-साना' का अर्थ क्या है?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "छोटे-छोटे", type: "correct", logicTag: "" },
      { text: "बड़े-बड़े", type: "concept_error", logicTag: "opposite_meaning" },
      { text: "कोमल-कोमल", type: "misinterpretation", logicTag: "wrong_meaning" },
      { text: "मीठे-मीठे", type: "misinterpretation", logicTag: "wrong_meaning" },
    ],
    solutionSteps: [
      "'साना-साना' नेपाली शब्द है।",
      "अर्थ: छोटे-छोटे।",
      "'साना-साना हाथ जोड़ि' = छोटे-छोटे हाथ जोड़कर प्रार्थना करना।",
    ],
    shortcut: "नेपाली: साना = छोटा",
  },
  {
    questionId: "hin_kr_ch29_q2",
    topic: "hin_kr_ch29", topicId: "hin_kr_ch29",
    subtopic: "यात्रा-स्थल",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "यह यात्रा-वृत्तांत किस राज्य की यात्रा पर आधारित है?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "सिक्किम", type: "correct", logicTag: "" },
      { text: "हिमाचल प्रदेश", type: "misinterpretation", logicTag: "wrong_state" },
      { text: "उत्तराखंड", type: "misinterpretation", logicTag: "wrong_state" },
      { text: "अरुणाचल प्रदेश", type: "misinterpretation", logicTag: "wrong_state" },
    ],
    solutionSteps: [
      "यह पाठ सिक्किम के गंगटोक और यूमथांग की यात्रा का वर्णन करता है।",
    ],
    shortcut: "गंगटोक + यूमथांग = सिक्किम",
  },
  {
    questionId: "hin_kr_ch29_q3",
    topic: "hin_kr_ch29", topicId: "hin_kr_ch29",
    subtopic: "पर्यावरण",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "पाठ में पर्यावरण के संदर्भ में क्या चिंता व्यक्त की गई है?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.4, marks: 1, isAIGenerated: true,
    options: [
      { text: "ग्लेशियरों का पिघलना और बर्फ का कम होना", type: "correct", logicTag: "" },
      { text: "वायु प्रदूषण", type: "misinterpretation", logicTag: "wrong_issue" },
      { text: "जंगलों की कटाई", type: "misinterpretation", logicTag: "wrong_issue" },
      { text: "नदियों का सूखना", type: "misinterpretation", logicTag: "wrong_issue" },
    ],
    solutionSteps: [
      "स्थानीय गाइड बताती है कि पहले अधिक बर्फ पड़ती थी, अब कम होती जा रही है।",
      "यह जलवायु परिवर्तन के कारण ग्लेशियरों के पिघलने का संकेत है।",
    ],
    shortcut: "गाइड की बात → बर्फ कम हो रही है → ग्लेशियर पिघल रहे हैं",
  },

  // ── Ch 30: हरिहर काका ────────────────────────────────────────────────────
  {
    questionId: "hin_sy_ch30_q1",
    topic: "hin_sy_ch30", topicId: "hin_sy_ch30",
    subtopic: "केंद्रीय समस्या",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "हरिहर काका की मुख्य समस्या क्या है?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "वे निःसंतान हैं और उनकी संपत्ति के लिए परिवार व महंत दोनों लालायित हैं", type: "correct", logicTag: "" },
      { text: "वे बीमार हैं", type: "misinterpretation", logicTag: "wrong_problem" },
      { text: "उनका घर जल गया", type: "misinterpretation", logicTag: "wrong_problem" },
      { text: "वे अकेले गाँव में हैं", type: "misinterpretation", logicTag: "wrong_problem" },
    ],
    solutionSteps: [
      "हरिहर काका के कोई संतान नहीं है।",
      "उनकी जमीन-जायदाद के लिए भाइयों के परिवार और मंदिर के महंत दोनों दबाव डालते हैं।",
    ],
    shortcut: "निःसंतान + संपत्ति = दोहरा शोषण (परिवार + महंत)",
  },
  {
    questionId: "hin_sy_ch30_q2",
    topic: "hin_sy_ch30", topicId: "hin_sy_ch30",
    subtopic: "लेखक-परिचय",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "मिथिलेश्वर किस भाषा के लेखक हैं?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "हिंदी", type: "correct", logicTag: "" },
      { text: "बंगाली", type: "misinterpretation", logicTag: "wrong_language" },
      { text: "मराठी", type: "misinterpretation", logicTag: "wrong_language" },
      { text: "गुजराती", type: "misinterpretation", logicTag: "wrong_language" },
    ],
    solutionSteps: [
      "मिथिलेश्वर हिंदी के प्रमुख कथाकार हैं जो ग्रामीण जीवन और सामाजिक समस्याओं पर लिखते हैं।",
    ],
    shortcut: "मिथिलेश्वर = हिंदी, ग्रामीण कथाकार",
  },
  {
    questionId: "hin_sy_ch30_q3",
    topic: "hin_sy_ch30", topicId: "hin_sy_ch30",
    subtopic: "महंत की भूमिका",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "कहानी में महंत की भूमिका क्या है?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.4, marks: 1, isAIGenerated: true,
    options: [
      { text: "धर्म का डर दिखाकर संपत्ति दान करवाना", type: "correct", logicTag: "" },
      { text: "हरिहर काका की मदद करना", type: "concept_error", logicTag: "opposite_answer" },
      { text: "उन्हें न्याय दिलाना", type: "misinterpretation", logicTag: "wrong_role" },
      { text: "उनकी देखभाल करना", type: "misinterpretation", logicTag: "wrong_role" },
    ],
    solutionSteps: [
      "मंदिर के महंत धर्म और मुक्ति का लालच देते हैं।",
      "वे हरिहर काका को संपत्ति मंदिर को दान करने के लिए मजबूर करना चाहते हैं।",
    ],
    shortcut: "महंत = धार्मिक शोषण का प्रतीक",
  },
  {
    questionId: "hin_sy_ch30_q4",
    topic: "hin_sy_ch30", topicId: "hin_sy_ch30",
    subtopic: "सामाजिक संदेश",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'हरिहर काका' कहानी का मुख्य सामाजिक संदेश क्या है?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "संपत्ति के लोभ में लोग रिश्ते और धर्म दोनों भूल जाते हैं", type: "correct", logicTag: "" },
      { text: "धार्मिक आस्था ज़रूरी है", type: "misinterpretation", logicTag: "wrong_message" },
      { text: "बुजुर्गों को मंदिर में रहना चाहिए", type: "misinterpretation", logicTag: "wrong_message" },
      { text: "शहर में जाना बेहतर है", type: "misinterpretation", logicTag: "wrong_message" },
    ],
    solutionSteps: [
      "परिवार रिश्ते का उपयोग संपत्ति के लिए करता है।",
      "महंत धर्म का उपयोग संपत्ति के लिए करता है।",
      "संदेश: लोभ सब कुछ नष्ट कर देता है।",
    ],
    shortcut: "लोभ > रिश्ता AND लोभ > धर्म",
  },

  // ── Ch 31: सपनों के से दिन ────────────────────────────────────────────────
  {
    questionId: "hin_sy_ch31_q1",
    topic: "hin_sy_ch31", topicId: "hin_sy_ch31",
    subtopic: "लेखक-परिचय",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'सपनों के से दिन' पाठ के लेखक कौन हैं?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "गुरदयाल सिंह", type: "correct", logicTag: "" },
      { text: "मिथिलेश्वर", type: "misinterpretation", logicTag: "same_chapter_author" },
      { text: "राही मासूम रज़ा", type: "misinterpretation", logicTag: "same_book_author" },
      { text: "सआदत हसन मंटो", type: "misinterpretation", logicTag: "wrong_author" },
    ],
    solutionSteps: [
      "'सपनों के से दिन' गुरदयाल सिंह द्वारा पंजाबी में लिखे उपन्यास का हिंदी अनुवाद है।",
    ],
    shortcut: "पंजाबी → हिंदी अनुवाद; लेखक = गुरदयाल सिंह",
  },
  {
    questionId: "hin_sy_ch31_q2",
    topic: "hin_sy_ch31", topicId: "hin_sy_ch31",
    subtopic: "भावना",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "स्कूल के प्रति लेखक की भावना का सबसे सही वर्णन कौन-सा है?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.4, marks: 1, isAIGenerated: true,
    options: [
      { text: "स्कूल कठोर था पर वे दिन सपने जैसे सुंदर लगते हैं", type: "correct", logicTag: "" },
      { text: "स्कूल बुरा था इसलिए वे नफ़रत करते हैं", type: "concept_error", logicTag: "partial_fact" },
      { text: "स्कूल में बहुत मज़ा था", type: "misinterpretation", logicTag: "wrong_feeling" },
      { text: "लेखक को स्कूल याद नहीं", type: "misinterpretation", logicTag: "wrong_feeling" },
    ],
    solutionSteps: [
      "स्कूल में कठोर अनुशासन था।",
      "पर अब लेखक को वे दिन सपने जैसे सुंदर लगते हैं।",
      "बचपन की मासूमियत हर कठिनाई को सुंदर बना देती है।",
    ],
    shortcut: "कठोरता + मासूमियत = सपनों जैसे दिन",
  },
  {
    questionId: "hin_sy_ch31_q3",
    topic: "hin_sy_ch31", topicId: "hin_sy_ch31",
    subtopic: "विधा",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "पाठ 'सपनों के से दिन' की साहित्यिक विधा क्या है?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.4, marks: 1, isAIGenerated: true,
    options: [
      { text: "उपन्यास का अंश (संस्मरणात्मक)", type: "correct", logicTag: "" },
      { text: "कहानी", type: "misinterpretation", logicTag: "wrong_genre" },
      { text: "कविता", type: "misinterpretation", logicTag: "wrong_genre" },
      { text: "नाटक", type: "misinterpretation", logicTag: "wrong_genre" },
    ],
    solutionSteps: [
      "'सपनों के से दिन' गुरदयाल सिंह के पंजाबी उपन्यास 'मढ़ी दा दीवा' का अंश है।",
      "यह संस्मरणात्मक शैली में लिखा गया है।",
    ],
    shortcut: "मूल: 'मढ़ी दा दीवा' (पंजाबी उपन्यास) → उपन्यास का अंश",
  },

  // ── Ch 32: टोपी शुक्ला ─────────────────────────────────────────────────
  {
    questionId: "hin_sy_ch32_q1",
    topic: "hin_sy_ch32", topicId: "hin_sy_ch32",
    subtopic: "लेखक-परिचय",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'टोपी शुक्ला' उपन्यास के लेखक कौन हैं?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "राही मासूम रज़ा", type: "correct", logicTag: "" },
      { text: "प्रेमचंद", type: "misinterpretation", logicTag: "wrong_author" },
      { text: "यशपाल", type: "misinterpretation", logicTag: "wrong_author" },
      { text: "मन्नू भंडारी", type: "misinterpretation", logicTag: "wrong_author" },
    ],
    solutionSteps: [
      "'टोपी शुक्ला' उपन्यास राही मासूम रज़ा ने लिखा है।",
      "वे हिंदी और उर्दू दोनों के प्रसिद्ध लेखक थे।",
    ],
    shortcut: "राही मासूम रज़ा = 'टोपी शुक्ला' + 'आधा गाँव'",
  },
  {
    questionId: "hin_sy_ch32_q2",
    topic: "hin_sy_ch32", topicId: "hin_sy_ch32",
    subtopic: "मित्रता का संदेश",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "टोपी और इफ्फन की दोस्ती किस बात की मिसाल है?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.4, marks: 1, isAIGenerated: true,
    options: [
      { text: "धार्मिक भेदभाव से ऊपर बचपन की निश्छल दोस्ती की", type: "correct", logicTag: "" },
      { text: "आर्थिक समानता की", type: "misinterpretation", logicTag: "wrong_theme" },
      { text: "एक जाति के लोगों की दोस्ती की", type: "concept_error", logicTag: "opposite_theme" },
      { text: "शहरी जीवन की", type: "misinterpretation", logicTag: "wrong_theme" },
    ],
    solutionSteps: [
      "टोपी हिंदू है, इफ्फन मुस्लिम।",
      "उनकी दोस्ती धर्म, जाति और सामाजिक भेदभाव से परे है।",
      "यही इस रचना का केंद्रीय संदेश है।",
    ],
    shortcut: "हिंदू + मुस्लिम → धर्म से ऊपर बचपन की दोस्ती",
  },
  {
    questionId: "hin_sy_ch32_q3",
    topic: "hin_sy_ch32", topicId: "hin_sy_ch32",
    subtopic: "पारिवारिक संबंध",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "टोपी को अपने घर में कौन प्यार नहीं करता?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.3, marks: 1, isAIGenerated: true,
    options: [
      { text: "दादी", type: "correct", logicTag: "" },
      { text: "माँ", type: "misinterpretation", logicTag: "wrong_person" },
      { text: "पिता", type: "misinterpretation", logicTag: "wrong_person" },
      { text: "भाई", type: "misinterpretation", logicTag: "wrong_person" },
    ],
    solutionSteps: [
      "टोपी की दादी उसे पसंद नहीं करतीं।",
      "विडंबना: इफ्फन की दादी टोपी को प्यार करती हैं।",
      "संदेश: खून के रिश्ते हमेशा प्यार का रिश्ता नहीं होते।",
    ],
    shortcut: "अपनी दादी नफ़रत ↔ इफ्फन की दादी प्यार → विडंबना",
  },
  {
    questionId: "hin_sy_ch32_q4",
    topic: "hin_sy_ch32", topicId: "hin_sy_ch32",
    subtopic: "वियोग",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "इफ्फन के परिवार के जाने के बाद टोपी की स्थिति क्या हो जाती है?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.4, marks: 1, isAIGenerated: true,
    options: [
      { text: "वह फिर से अकेला और अनाथ-सा हो जाता है", type: "correct", logicTag: "" },
      { text: "वह खुश हो जाता है", type: "concept_error", logicTag: "opposite_answer" },
      { text: "वह नए दोस्त बना लेता है", type: "misinterpretation", logicTag: "wrong_outcome" },
      { text: "वह पढ़ाई में लग जाता है", type: "misinterpretation", logicTag: "wrong_outcome" },
    ],
    solutionSteps: [
      "इफ्फन का परिवार शहर छोड़ देता है।",
      "टोपी का एकमात्र सहारा चला जाता है।",
      "वह फिर अकेला हो जाता है — जैसे अनाथ।",
    ],
    shortcut: "इफ्फन जाना = टोपी का अकेलापन लौटना",
  },
];

async function main() {
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10_000 });
  console.log("MongoDB connected");

  let created = 0;
  let updated = 0;

  for (const q of questions) {
    const existing = await Question.findOne({ questionId: q.questionId });
    if (existing) {
      await Question.updateOne({ questionId: q.questionId }, { $set: q });
      updated++;
    } else {
      await Question.create(q);
      created++;
    }
  }

  console.log(`\nDone: ${created} created, ${updated} updated (${questions.length} total)`);
  await mongoose.disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
