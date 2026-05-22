/**
 * Hindi MCQs — additional questions to bring all chapters to ≥4 Qs each
 * Adds 42 questions across ch2-ch31 where counts were low.
 * Safe to re-run (upserts on questionId).
 * Usage: node config/seedHindiQuestionsD.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import { Question } from "../models/index.js";

const questions = [
  // ── Ch 2: तुलसीदास के पद — add q4 ─────────────────────────────────────
  {
    questionId: "hin_ks_ch2_q4",
    topic: "hin_ks_ch2", topicId: "hin_ks_ch2",
    subtopic: "राम-भक्ति",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "तुलसीदास के पदों में 'लक्ष्मण-मूर्छा' प्रसंग में राम की किस भावना का चित्रण है?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "भाई के प्रति असीम प्रेम और विलाप", type: "correct", logicTag: "" },
      { text: "शत्रु के प्रति क्रोध", type: "misinterpretation", logicTag: "wrong_emotion" },
      { text: "ईश्वर के प्रति भक्ति", type: "misinterpretation", logicTag: "wrong_context" },
      { text: "विजय का उल्लास", type: "concept_error", logicTag: "opposite_emotion" },
    ],
    solutionSteps: [
      "लक्ष्मण-मूर्छा प्रसंग में राम लक्ष्मण की मूर्च्छा देखकर विलाप करते हैं।",
      "यह प्रसंग भाई के प्रति राम के गहरे प्रेम को दर्शाता है।",
    ],
    shortcut: "लक्ष्मण-मूर्छा = राम का विलाप = भ्रातृप्रेम",
  },

  // ── Ch 3: देव के पद — add q3, q4 ──────────────────────────────────────
  {
    questionId: "hin_ks_ch3_q3",
    topic: "hin_ks_ch3", topicId: "hin_ks_ch3",
    subtopic: "ऋतु-वर्णन",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "देव के पद में बसंत ऋतु का वर्णन किस रूप में किया गया है?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.4, marks: 1, isAIGenerated: true,
    options: [
      { text: "बसंत को राजा के रूप में — प्रकृति उसकी सेवा में है", type: "correct", logicTag: "" },
      { text: "बसंत को शत्रु के रूप में", type: "concept_error", logicTag: "opposite_image" },
      { text: "बसंत को वर्षा के रूप में", type: "misinterpretation", logicTag: "wrong_season" },
      { text: "बसंत को दुख के प्रतीक के रूप में", type: "misinterpretation", logicTag: "wrong_tone" },
    ],
    solutionSteps: [
      "देव ने बसंत को राजा की तरह चित्रित किया है।",
      "प्रकृति के विभिन्न तत्त्व बसंत राजा की सेवा करते प्रतीत होते हैं।",
    ],
    shortcut: "देव: बसंत = राजा; प्रकृति = सेवक",
  },
  {
    questionId: "hin_ks_ch3_q4",
    topic: "hin_ks_ch3", topicId: "hin_ks_ch3",
    subtopic: "काव्य-शैली",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "देव किस काव्यधारा के कवि हैं?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "रीतिकाल", type: "correct", logicTag: "" },
      { text: "भक्तिकाल", type: "misinterpretation", logicTag: "wrong_era" },
      { text: "छायावाद", type: "misinterpretation", logicTag: "wrong_era" },
      { text: "आदिकाल", type: "misinterpretation", logicTag: "wrong_era" },
    ],
    solutionSteps: [
      "देव रीतिकाल के प्रमुख कवि हैं।",
      "रीतिकाल में श्रृंगार और प्रकृति-वर्णन की प्रधानता थी।",
    ],
    shortcut: "सूर/तुलसी = भक्तिकाल; देव/बिहारी = रीतिकाल",
  },

  // ── Ch 4: जयशंकर प्रसाद — आत्मकथ्य — add q4 ─────────────────────────
  {
    questionId: "hin_ks_ch4_q4",
    topic: "hin_ks_ch4", topicId: "hin_ks_ch4",
    subtopic: "आत्मकथ्य का अस्वीकार",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'आत्मकथ्य' कविता में कवि अपनी आत्मकथा क्यों नहीं लिखना चाहते?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "अपने दुख और असफलताओं को उजागर नहीं करना चाहते", type: "correct", logicTag: "" },
      { text: "उनके पास लिखने का समय नहीं है", type: "misinterpretation", logicTag: "wrong_reason" },
      { text: "उन्हें अपना जीवन साधारण नहीं लगता", type: "misinterpretation", logicTag: "wrong_reason" },
      { text: "वे आत्मकथा की विधा को महत्त्व नहीं देते", type: "misinterpretation", logicTag: "wrong_reason" },
    ],
    solutionSteps: [
      "कवि का जीवन दुखों और असफलताओं से भरा रहा।",
      "वे नहीं चाहते कि उनकी व्यक्तिगत पीड़ा दूसरों के मनोरंजन का विषय बने।",
    ],
    shortcut: "आत्मकथ्य अस्वीकार = निजी पीड़ा को सार्वजनिक न करना",
  },

  // ── Ch 5: निराला — उत्साह, अट नहीं रही — add q4 ──────────────────────
  {
    questionId: "hin_ks_ch5_q4",
    topic: "hin_ks_ch5", topicId: "hin_ks_ch5",
    subtopic: "फागुन की छटा",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'अट नहीं रही है' कविता में किस ऋतु का वर्णन है?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "फागुन (वसंत)", type: "correct", logicTag: "" },
      { text: "वर्षा", type: "misinterpretation", logicTag: "wrong_season" },
      { text: "शरद", type: "misinterpretation", logicTag: "wrong_season" },
      { text: "ग्रीष्म", type: "misinterpretation", logicTag: "wrong_season" },
    ],
    solutionSteps: [
      "'अट नहीं रही है' में फागुन (वसंत) की सुंदरता का चित्रण है।",
      "फागुन की सुंदरता इतनी प्रचण्ड है कि वह 'अट' नहीं रही — रोकी नहीं जा रही।",
    ],
    shortcut: "अट नहीं रही है = फागुन की अप्रतिरोध्य सुंदरता",
  },

  // ── Ch 6: नागार्जुन — add q4 ────────────────────────────────────────────
  {
    questionId: "hin_ks_ch6_q4",
    topic: "hin_ks_ch6", topicId: "hin_ks_ch6",
    subtopic: "फसल — प्रतीकार्थ",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'फसल' कविता में नागार्जुन फसल को किसकी देन मानते हैं?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.4, marks: 1, isAIGenerated: true,
    options: [
      { text: "किसानों के परिश्रम, नदियों के जल, मिट्टी और सूरज सबकी सामूहिक देन", type: "correct", logicTag: "" },
      { text: "केवल किसान के परिश्रम की देन", type: "partial_logic", logicTag: "incomplete_answer" },
      { text: "केवल ईश्वर की कृपा", type: "misinterpretation", logicTag: "wrong_view" },
      { text: "केवल वर्षा और मिट्टी की देन", type: "partial_logic", logicTag: "incomplete_answer" },
    ],
    solutionSteps: [
      "नागार्जुन की 'फसल' कविता बताती है कि फसल किसी एक की नहीं है।",
      "यह किसान के श्रम, अनेक नदियों के जल, मिट्टी और सूर्य की किरणों — सबकी सामूहिक देन है।",
    ],
    shortcut: "फसल = सामूहिक देन (श्रम + जल + मिट्टी + सूरज)",
  },

  // ── Ch 7: फ़िराक़ — add q3, q4 ─────────────────────────────────────────
  {
    questionId: "hin_ks_ch7_q3",
    topic: "hin_ks_ch7", topicId: "hin_ks_ch7",
    subtopic: "रुबाई",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "फ़िराक़ की रुबाइयों में किस काल के चित्रण की प्रधानता है?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "शैशव — माँ और बच्चे के प्रेम का", type: "correct", logicTag: "" },
      { text: "युद्ध का", type: "misinterpretation", logicTag: "wrong_theme" },
      { text: "वृद्धावस्था का", type: "misinterpretation", logicTag: "wrong_age" },
      { text: "देशभक्ति का", type: "misinterpretation", logicTag: "wrong_theme" },
    ],
    solutionSteps: [
      "फ़िराक़ की रुबाइयाँ शिशु-जीवन और माँ के प्रेम का सुंदर चित्रण करती हैं।",
    ],
    shortcut: "फ़िराक़ रुबाई = माँ-बच्चे का शैशव-प्रेम",
  },
  {
    questionId: "hin_ks_ch7_q4",
    topic: "hin_ks_ch7", topicId: "hin_ks_ch7",
    subtopic: "ग़ज़ल",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "फ़िराक़ की ग़ज़ल में 'बरसात की रात' का प्रयोग किस भाव को व्यक्त करता है?",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.7, marks: 1, isAIGenerated: true,
    options: [
      { text: "प्रिय की याद और विरह-वेदना", type: "correct", logicTag: "" },
      { text: "भय और अंधकार", type: "misinterpretation", logicTag: "wrong_mood" },
      { text: "ख़ुशी और उत्सव", type: "concept_error", logicTag: "opposite_mood" },
      { text: "प्राकृतिक आपदा", type: "misinterpretation", logicTag: "wrong_context" },
    ],
    solutionSteps: [
      "उर्दू और हिंदी काव्य परंपरा में बरसात की रात विरह का प्रतीक है।",
      "फ़िराक़ की ग़ज़ल में यह प्रिय की याद और विरह-वेदना को तीव्र करती है।",
    ],
    shortcut: "बरसात की रात उर्दू शायरी में = विरह का प्रतीक",
  },

  // ── Ch 8: मंगलेश डबराल — संगतकार — add q3, q4 ─────────────────────
  {
    questionId: "hin_ks_ch8_q3",
    topic: "hin_ks_ch8", topicId: "hin_ks_ch8",
    subtopic: "संगतकार का महत्त्व",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'संगतकार' कविता में संगतकार की आवाज़ धीमी क्यों रहती है?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "ताकि मुख्य गायक की आवाज़ प्रमुख बनी रहे — वह स्वयं पीछे रहकर सहयोग करता है", type: "correct", logicTag: "" },
      { text: "उसकी आवाज़ कमज़ोर है", type: "misinterpretation", logicTag: "wrong_reason" },
      { text: "वह गाना नहीं जानता", type: "misinterpretation", logicTag: "wrong_reason" },
      { text: "उसे डर लगता है", type: "misinterpretation", logicTag: "wrong_reason" },
    ],
    solutionSteps: [
      "संगतकार जान-बूझकर अपनी आवाज़ धीमी रखता है।",
      "यह उसकी विनम्रता और सहयोग की भावना है — मुख्य कलाकार को आगे रखना।",
    ],
    shortcut: "संगतकार = सहयोग + विनम्रता; आवाज़ धीमी = जानबूझकर",
  },
  {
    questionId: "hin_ks_ch8_q4",
    topic: "hin_ks_ch8", topicId: "hin_ks_ch8",
    subtopic: "सामाजिक संदेश",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'संगतकार' कविता के माध्यम से कवि किस व्यापक सत्य को उजागर करता है?",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.7, marks: 1, isAIGenerated: true,
    options: [
      { text: "समाज में पीछे रहकर सहयोग देने वाले लोगों की भूमिका भी महत्त्वपूर्ण है", type: "correct", logicTag: "" },
      { text: "संगीत में सहयोगी की ज़रूरत नहीं होती", type: "concept_error", logicTag: "opposite_message" },
      { text: "मुख्य कलाकार ही सब कुछ होता है", type: "misinterpretation", logicTag: "wrong_message" },
      { text: "संगतकार को अभ्यास करना चाहिए", type: "misinterpretation", logicTag: "wrong_message" },
    ],
    solutionSteps: [
      "कविता का व्यापक अर्थ: समाज में कई लोग पीछे रहकर काम करते हैं।",
      "उनके बिना 'मुख्य' लोगों की सफलता संभव नहीं — उनका योगदान अदृश्य पर अनिवार्य है।",
    ],
    shortcut: "संगतकार = समाज के गुमनाम सहयोगी — अदृश्य पर अनिवार्य",
  },

  // ── Ch 9: नेताजी का चश्मा — add q4 ────────────────────────────────────
  {
    questionId: "hin_ks_ch9_q4",
    topic: "hin_ks_ch9", topicId: "hin_ks_ch9",
    subtopic: "देशभक्ति का प्रतीक",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "कहानी के अंत में बच्चों द्वारा सरकंडे का चश्मा लगाना क्या दर्शाता है?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "देशभक्ति की भावना पीढ़ी-दर-पीढ़ी जीवित रहती है", type: "correct", logicTag: "" },
      { text: "बच्चों को खिलौने पसंद हैं", type: "misinterpretation", logicTag: "literal_meaning" },
      { text: "कैप्टन का काम खत्म हो गया", type: "concept_error", logicTag: "wrong_conclusion" },
      { text: "मूर्ति को नया चश्मा मिल गया", type: "partial_logic", logicTag: "literal_meaning" },
    ],
    solutionSteps: [
      "कैप्टन के जाने के बाद चश्मा कोई नहीं लगाता।",
      "बाद में बच्चे सरकंडे का चश्मा लगाते हैं — यह देशभक्ति की अमर भावना का प्रतीक है।",
    ],
    shortcut: "सरकंडे का चश्मा = देशभक्ति अमर है, पीढ़ी बदलती है भावना नहीं",
  },

  // ── Ch 10: बालगोबिन भगत — add q3, q4 ─────────────────────────────────
  {
    questionId: "hin_ks_ch10_q3",
    topic: "hin_ks_ch10", topicId: "hin_ks_ch10",
    subtopic: "बेटे की मृत्यु",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "बेटे की मृत्यु पर भगत ने जो किया, वह समाज की परिपाटी से किस प्रकार अलग था?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "शोक के बजाय संगीत गाया — मृत्यु को मुक्ति माना", type: "correct", logicTag: "" },
      { text: "बहुत रोए और विलाप किया", type: "concept_error", logicTag: "opposite_action" },
      { text: "पूजा-पाठ बंद कर दिया", type: "misinterpretation", logicTag: "wrong_action" },
      { text: "गाँव छोड़ दिया", type: "misinterpretation", logicTag: "wrong_action" },
    ],
    solutionSteps: [
      "बेटे की मृत्यु पर भगत ने शोक नहीं मनाया।",
      "वे गाते रहे — उनके लिए मृत्यु आत्मा की परमात्मा से मुक्ति थी, शोक का नहीं, उत्सव का समय।",
    ],
    shortcut: "भगत: मृत्यु = मुक्ति → गीत गाया (शोक नहीं)",
  },
  {
    questionId: "hin_ks_ch10_q4",
    topic: "hin_ks_ch10", topicId: "hin_ks_ch10",
    subtopic: "पुत्रवधू का पुनर्विवाह",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "बालगोबिन भगत ने बेटे की मृत्यु के बाद पुत्रवधू के बारे में क्या निर्णय लिया?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.4, marks: 1, isAIGenerated: true,
    options: [
      { text: "उसे मायके भेज दिया और पुनर्विवाह के लिए प्रेरित किया", type: "correct", logicTag: "" },
      { text: "उसे अपने साथ रहने दिया", type: "misinterpretation", logicTag: "conventional_choice" },
      { text: "उसे आश्रम में भेज दिया", type: "misinterpretation", logicTag: "wrong_action" },
      { text: "उससे घर का काम करवाते रहे", type: "concept_error", logicTag: "opposite_decision" },
    ],
    solutionSteps: [
      "भगत ने पुत्रवधू को मायके भेजा।",
      "उन्होंने कहा — तुम जवान हो, तुम्हें पुनर्विवाह करना चाहिए। यह उनकी प्रगतिशील सोच थी।",
    ],
    shortcut: "भगत = विधवा पुनर्विवाह का समर्थक (1940 के दशक में क्रांतिकारी विचार)",
  },

  // ── Ch 11: यशपाल — लखनवी अंदाज़ — add q3, q4 ──────────────────────────
  {
    questionId: "hin_ks_ch11_q3",
    topic: "hin_ks_ch11", topicId: "hin_ks_ch11",
    subtopic: "नवाबी संस्कृति पर व्यंग्य",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'लखनवी अंदाज़' में नवाब सीट पर अकेले होने के बावजूद खीरा क्यों नहीं खाते?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "नवाबी 'नफ़ासत' के कारण — खीरा 'तहज़ीब' के विरुद्ध समझते हैं", type: "correct", logicTag: "" },
      { text: "उन्हें खीरा पसंद नहीं", type: "misinterpretation", logicTag: "wrong_reason" },
      { text: "खीरा महँगा था", type: "misinterpretation", logicTag: "wrong_reason" },
      { text: "वे बीमार थे", type: "misinterpretation", logicTag: "wrong_reason" },
    ],
    solutionSteps: [
      "नवाब खीरा खरीद लाए पर खाते नहीं — क्योंकि तहज़ीब के अनुसार 'नफ़ासत' से रहना है।",
      "यशपाल इस पर व्यंग्य करते हैं — असल में यह दिखावटी संस्कृति है।",
    ],
    shortcut: "खीरा न खाना = नवाबी दिखावे का व्यंग्य",
  },
  {
    questionId: "hin_ks_ch11_q4",
    topic: "hin_ks_ch11", topicId: "hin_ks_ch11",
    subtopic: "लेखक का उद्देश्य",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'लखनवी अंदाज़' कहानी में यशपाल का मुख्य लक्ष्य क्या है?",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.6, marks: 1, isAIGenerated: true,
    options: [
      { text: "नवाबी दिखावे और पुरानी रईसी का व्यंग्यात्मक चित्रण करना", type: "correct", logicTag: "" },
      { text: "लखनऊ की तारीफ़ करना", type: "misinterpretation", logicTag: "wrong_purpose" },
      { text: "रेलयात्रा का वर्णन करना", type: "misinterpretation", logicTag: "wrong_purpose" },
      { text: "नवाब की प्रशंसा करना", type: "concept_error", logicTag: "opposite_purpose" },
    ],
    solutionSteps: [
      "यशपाल प्रगतिशील लेखक हैं।",
      "वे दिखाते हैं कि नवाबी 'तहज़ीब' असल में खोखला दिखावा है।",
    ],
    shortcut: "यशपाल = प्रगतिशील; लक्ष्य = नवाबी दिखावे का भंडाफोड़",
  },

  // ── Ch 12: एक कहानी यह भी — add q3, q4 ───────────────────────────────
  {
    questionId: "hin_ks_ch12_q3",
    topic: "hin_ks_ch12", topicId: "hin_ks_ch12",
    subtopic: "पिता का प्रभाव",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "मन्नू भंडारी के पिता का उनके जीवन पर क्या प्रभाव था?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "पिता राष्ट्रवादी थे जिनसे लेखिका में समाज-सेवा और आंदोलन की भावना जागी", type: "correct", logicTag: "" },
      { text: "पिता ने उन्हें पढ़ाई से रोका", type: "concept_error", logicTag: "opposite_influence" },
      { text: "पिता का कोई प्रभाव नहीं था", type: "misinterpretation", logicTag: "wrong_answer" },
      { text: "पिता चाहते थे वे घर पर रहें", type: "misinterpretation", logicTag: "wrong_influence" },
    ],
    solutionSteps: [
      "मन्नू भंडारी के पिता स्वतंत्रता सेनानी थे।",
      "उनके राष्ट्रवाद से लेखिका में सामाजिक चेतना और आंदोलन की प्रेरणा जागी।",
    ],
    shortcut: "पिता = राष्ट्रवादी → लेखिका में सामाजिक चेतना",
  },
  {
    questionId: "hin_ks_ch12_q4",
    topic: "hin_ks_ch12", topicId: "hin_ks_ch12",
    subtopic: "स्त्री-जागरण",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'एक कहानी यह भी' में लेखिका की आत्मकथा का मुख्य विषय क्या है?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "एक मध्यवर्गीय लड़की का आत्म-खोज और स्वाधीन व्यक्तित्व बनाने की यात्रा", type: "correct", logicTag: "" },
      { text: "पारिवारिक झगड़े", type: "misinterpretation", logicTag: "wrong_theme" },
      { text: "राजनीतिक आंदोलन का इतिहास", type: "misinterpretation", logicTag: "wrong_theme" },
      { text: "लेखन की तकनीक सीखना", type: "misinterpretation", logicTag: "wrong_theme" },
    ],
    solutionSteps: [
      "लेखिका एक मध्यवर्गीय परिवार से हैं।",
      "आत्मकथा में वे अपनी पहचान, आत्म-विश्वास और स्वाधीन व्यक्तित्व गढ़ने की यात्रा बताती हैं।",
    ],
    shortcut: "मन्नू भंडारी = स्त्री-आत्मकथा → आत्म-खोज की यात्रा",
  },

  // ── Ch 14: मीरा के पद — add q4 ─────────────────────────────────────────
  {
    questionId: "hin_sp_ch14_q4",
    topic: "hin_sp_ch14", topicId: "hin_sp_ch14",
    subtopic: "विरह-भक्ति",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "मीरा के पदों में कृष्ण के प्रति उनकी भावना को क्या कहते हैं?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.4, marks: 1, isAIGenerated: true,
    options: [
      { text: "माधुर्य भक्ति (प्रेमी-प्रेमिका का भाव)", type: "correct", logicTag: "" },
      { text: "दास्य भक्ति", type: "concept_error", logicTag: "wrong_type" },
      { text: "सख्य भक्ति", type: "misinterpretation", logicTag: "wrong_type" },
      { text: "वात्सल्य भक्ति", type: "misinterpretation", logicTag: "wrong_type" },
    ],
    solutionSteps: [
      "मीरा ने कृष्ण को अपना पति-प्रेमी माना।",
      "यह माधुर्य भक्ति है — जहाँ भक्त और भगवान के बीच प्रेमी-प्रेमिका का भाव होता है।",
    ],
    shortcut: "मीरा = माधुर्य भक्ति (प्रेम-भाव); सूर = वात्सल्य; तुलसी = दास्य",
  },

  // ── Ch 15: बिहारी के दोहे — add q4 ────────────────────────────────────
  {
    questionId: "hin_sp_ch15_q4",
    topic: "hin_sp_ch15", topicId: "hin_sp_ch15",
    subtopic: "बिहारी की विशेषता",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "बिहारी के दोहों की सबसे बड़ी विशेषता क्या है?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "गागर में सागर — थोड़े शब्दों में गहरा अर्थ", type: "correct", logicTag: "" },
      { text: "लंबे-लंबे छंद", type: "concept_error", logicTag: "opposite_style" },
      { text: "केवल धार्मिक विषय", type: "misinterpretation", logicTag: "wrong_feature" },
      { text: "वीर रस की प्रधानता", type: "misinterpretation", logicTag: "wrong_feature" },
    ],
    solutionSteps: [
      "'गागर में सागर भरना' बिहारी की प्रसिद्ध उक्ति है।",
      "दोहा केवल दो पंक्तियों का होता है पर बिहारी उसमें गहरा अर्थ भर देते हैं।",
    ],
    shortcut: "बिहारी = गागर में सागर = कम शब्द, गहरा अर्थ",
  },

  // ── Ch 16: मैथिलीशरण गुप्त — मनुष्यता — add q4 ────────────────────────
  {
    questionId: "hin_sp_ch16_q4",
    topic: "hin_sp_ch16", topicId: "hin_sp_ch16",
    subtopic: "मनुष्यता का आदर्श",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'मनुष्यता' कविता में कवि के अनुसार सच्चा मनुष्य कौन है?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.4, marks: 1, isAIGenerated: true,
    options: [
      { text: "जो दूसरों के लिए जीता है और परोपकार करता है", type: "correct", logicTag: "" },
      { text: "जो केवल अपने लिए जीता है", type: "concept_error", logicTag: "opposite_answer" },
      { text: "जो धनवान है", type: "misinterpretation", logicTag: "wrong_criterion" },
      { text: "जो युद्ध में वीर है", type: "misinterpretation", logicTag: "wrong_criterion" },
    ],
    solutionSteps: [
      "गुप्त जी कहते हैं — 'यही पशु-प्रवृत्ति है कि आप आप ही चरे।'",
      "सच्चा मनुष्य वह है जो दूसरों के लिए जीता है और परोपकार करता है।",
    ],
    shortcut: "केवल अपने लिए जीना = पशु-प्रवृत्ति; दूसरों के लिए = मनुष्यता",
  },

  // ── Ch 17: पंत — पर्वत प्रदेश में पावस — add q3, q4 ──────────────────
  {
    questionId: "hin_sp_ch17_q3",
    topic: "hin_sp_ch17", topicId: "hin_sp_ch17",
    subtopic: "प्रकृति-वर्णन",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'पर्वत प्रदेश में पावस' कविता में झरनों की तुलना किससे की गई है?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "मोतियों की लड़ियों से", type: "correct", logicTag: "" },
      { text: "साँप से", type: "misinterpretation", logicTag: "wrong_image" },
      { text: "बिजली से", type: "misinterpretation", logicTag: "wrong_image" },
      { text: "दर्पण से", type: "misinterpretation", logicTag: "wrong_image" },
    ],
    solutionSteps: [
      "पंत ने पर्वतीय झरनों की सुंदरता को मोतियों की लड़ियों से उपमा दी है।",
    ],
    shortcut: "झरना = मोतियों की लड़ी (पंत की उपमा)",
  },
  {
    questionId: "hin_sp_ch17_q4",
    topic: "hin_sp_ch17", topicId: "hin_sp_ch17",
    subtopic: "छायावाद",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "सुमित्रानंदन पंत किस काव्यधारा के प्रमुख कवि हैं?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "छायावाद", type: "correct", logicTag: "" },
      { text: "भक्तिकाल", type: "misinterpretation", logicTag: "wrong_era" },
      { text: "प्रगतिवाद", type: "misinterpretation", logicTag: "wrong_movement" },
      { text: "रीतिकाल", type: "misinterpretation", logicTag: "wrong_era" },
    ],
    solutionSteps: [
      "पंत, निराला, प्रसाद और महादेवी वर्मा छायावाद के चार प्रमुख स्तंभ हैं।",
    ],
    shortcut: "छायावाद चतुष्टय = प्रसाद + निराला + पंत + महादेवी",
  },

  // ── Ch 18: महादेवी — मधुर-मधुर मेरे दीपक जल — add q3, q4 ───────────
  {
    questionId: "hin_sp_ch18_q3",
    topic: "hin_sp_ch18", topicId: "hin_sp_ch18",
    subtopic: "दीपक का प्रतीक",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'मधुर-मधुर मेरे दीपक जल' में दीपक किसका प्रतीक है?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "कवयित्री की आत्मा और भक्ति का", type: "correct", logicTag: "" },
      { text: "घर के दीये का", type: "misinterpretation", logicTag: "literal_meaning" },
      { text: "सूरज का", type: "misinterpretation", logicTag: "wrong_symbol" },
      { text: "अग्नि का", type: "misinterpretation", logicTag: "wrong_symbol" },
    ],
    solutionSteps: [
      "महादेवी वर्मा में भक्ति-भावना प्रबल थी।",
      "दीपक आत्मा और भक्ति का प्रतीक है — जो ईश्वर की खोज में स्वयं को जलाता है।",
    ],
    shortcut: "दीपक = आत्मा/भक्ति; जलना = आत्म-समर्पण",
  },
  {
    questionId: "hin_sp_ch18_q4",
    topic: "hin_sp_ch18", topicId: "hin_sp_ch18",
    subtopic: "विरह-वेदना",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "महादेवी वर्मा की काव्य-रचनाओं में किस भावना की प्रधानता है?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.3, marks: 1, isAIGenerated: true,
    options: [
      { text: "विरह और मिलन की कसक", type: "correct", logicTag: "" },
      { text: "वीर रस", type: "misinterpretation", logicTag: "wrong_rasa" },
      { text: "हास्य", type: "misinterpretation", logicTag: "wrong_rasa" },
      { text: "रौद्र रस", type: "misinterpretation", logicTag: "wrong_rasa" },
    ],
    solutionSteps: [
      "महादेवी वर्मा को 'आधुनिक मीरा' कहा जाता है।",
      "उनकी कविताओं में विरह-वेदना, मिलन की तड़प और आत्मिक प्रेम प्रमुख है।",
    ],
    shortcut: "महादेवी = आधुनिक मीरा = विरह-वेदना",
  },

  // ── Ch 19: वीरेन डंगवाल — तोप — add q3, q4 ────────────────────────────
  {
    questionId: "hin_sp_ch19_q3",
    topic: "hin_sp_ch19", topicId: "hin_sp_ch19",
    subtopic: "तोप का स्थान",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'तोप' कविता में तोप कहाँ रखी हुई है?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "कंपनी बाग में — प्रदर्शनी के रूप में", type: "correct", logicTag: "" },
      { text: "किले में", type: "misinterpretation", logicTag: "wrong_place" },
      { text: "संग्रहालय में", type: "misinterpretation", logicTag: "wrong_place" },
      { text: "युद्धक्षेत्र में", type: "misinterpretation", logicTag: "wrong_context" },
    ],
    solutionSteps: [
      "तोप कंपनी बाग में रखी है — यह 1857 के विद्रोह की याद दिलाती है।",
      "यह अब एक प्रदर्शनी वस्तु बन गई है, जिस पर चिड़ियाँ बैठती हैं।",
    ],
    shortcut: "तोप = कंपनी बाग में; पहले हथियार, अब सजावट",
  },
  {
    questionId: "hin_sp_ch19_q4",
    topic: "hin_sp_ch19", topicId: "hin_sp_ch19",
    subtopic: "व्यंग्य",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'तोप' कविता में चिड़ियों का तोप की नाल पर बैठना किसका प्रतीक है?",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.7, marks: 1, isAIGenerated: true,
    options: [
      { text: "साम्राज्यवादी शक्ति की निरर्थकता — जो डराती थी वह अब निष्क्रिय है", type: "correct", logicTag: "" },
      { text: "प्रकृति-प्रेम का", type: "misinterpretation", logicTag: "wrong_symbol" },
      { text: "शांति का संदेश", type: "partial_logic", logicTag: "incomplete_answer" },
      { text: "ब्रिटिश शक्ति की महानता", type: "concept_error", logicTag: "opposite_meaning" },
    ],
    solutionSteps: [
      "कभी जो तोप हजारों को मारती थी...",
      "आज उस पर छोटी-छोटी चिड़ियाँ बेफिक्र बैठती हैं।",
      "यह व्यंग्य है — साम्राज्यवादी शक्ति आज निष्क्रिय और निरर्थक है।",
    ],
    shortcut: "चिड़िया + तोप = साम्राज्यवाद की हार का प्रतीक",
  },

  // ── Ch 20: बड़े भाई साहब — add q4 ─────────────────────────────────────
  {
    questionId: "hin_sp_ch20_q4",
    topic: "hin_sp_ch20", topicId: "hin_sp_ch20",
    subtopic: "अनुभव vs किताबी ज्ञान",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'बड़े भाई साहब' कहानी में प्रेमचंद किस सत्य को उजागर करते हैं?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "केवल किताबी ज्ञान नहीं, जीवन का अनुभव भी आवश्यक है", type: "correct", logicTag: "" },
      { text: "छोटे भाई को हमेशा बड़े की बात माननी चाहिए", type: "partial_logic", logicTag: "incomplete_answer" },
      { text: "परीक्षा में पास होना ज़रूरी नहीं", type: "misinterpretation", logicTag: "wrong_message" },
      { text: "खेलना पढ़ाई से ज़्यादा ज़रूरी है", type: "misinterpretation", logicTag: "wrong_message" },
    ],
    solutionSteps: [
      "छोटा भाई हर परीक्षा में पास होता है बिना पढ़े।",
      "बड़े भाई साहब कड़ी मेहनत के बावजूद फेल हैं।",
      "प्रेमचंद कहते हैं: जीवन का व्यावहारिक अनुभव भी उतना ही ज़रूरी है।",
    ],
    shortcut: "छोटा = पास बिना पढ़े; बड़ा = फेल खूब पढ़कर → अनुभव = ज्ञान",
  },

  // ── Ch 21: डायरी का एक पन्ना — add q3, q4 ─────────────────────────────
  {
    questionId: "hin_sp_ch21_q3",
    topic: "hin_sp_ch21", topicId: "hin_sp_ch21",
    subtopic: "ऐतिहासिक घटना",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'डायरी का एक पन्ना' में 26 जनवरी 1931 को कलकत्ता में क्या हुआ?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.4, marks: 1, isAIGenerated: true,
    options: [
      { text: "स्वाधीनता दिवस मनाया गया — तिरंगा फहराया और ब्रिटिश सरकार ने दमन किया", type: "correct", logicTag: "" },
      { text: "भारत को आज़ादी मिली", type: "misinterpretation", logicTag: "wrong_event" },
      { text: "नमक आंदोलन शुरू हुआ", type: "misinterpretation", logicTag: "wrong_event" },
      { text: "असहयोग आंदोलन शुरू हुआ", type: "misinterpretation", logicTag: "wrong_event" },
    ],
    solutionSteps: [
      "26 जनवरी 1931 को कलकत्ता में स्वाधीनता दिवस मनाने का निर्णय था।",
      "ब्रिटिश सरकार ने दमन किया — लाठियाँ चलाईं, पर जनता ने तिरंगा फहराया।",
    ],
    shortcut: "26 जनवरी 1931 = पहला स्वाधीनता दिवस (स्वतंत्रता से पहले का)",
  },
  {
    questionId: "hin_sp_ch21_q4",
    topic: "hin_sp_ch21", topicId: "hin_sp_ch21",
    subtopic: "लेखक-परिचय",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'डायरी का एक पन्ना' के लेखक कौन हैं?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "सीताराम सेकसरिया", type: "correct", logicTag: "" },
      { text: "प्रेमचंद", type: "misinterpretation", logicTag: "wrong_author" },
      { text: "मंटो", type: "misinterpretation", logicTag: "wrong_author" },
      { text: "हबीब तनवीर", type: "misinterpretation", logicTag: "wrong_author" },
    ],
    solutionSteps: [
      "'डायरी का एक पन्ना' सीताराम सेकसरिया द्वारा लिखी डायरी का अंश है।",
    ],
    shortcut: "डायरी का एक पन्ना = सीताराम सेकसरिया",
  },

  // ── Ch 22: तताँरा-वामीरो — add q3, q4 ─────────────────────────────────
  {
    questionId: "hin_sp_ch22_q3",
    topic: "hin_sp_ch22", topicId: "hin_sp_ch22",
    subtopic: "द्वीप-विभाजन",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "तताँरा की तलवार के प्रहार से क्या हुआ?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "द्वीप दो टुकड़ों में बँट गया — लिटिल अंडमान और कार निकोबार", type: "correct", logicTag: "" },
      { text: "समुद्र में तूफ़ान आया", type: "misinterpretation", logicTag: "wrong_event" },
      { text: "गाँव वाले भाग गए", type: "misinterpretation", logicTag: "wrong_event" },
      { text: "तताँरा मर गया", type: "partial_logic", logicTag: "incomplete_answer" },
    ],
    solutionSteps: [
      "तताँरा ने क्रोध में तलवार ज़मीन पर मारी।",
      "इससे द्वीप दो हिस्सों में बँट गया — यही लिटिल अंडमान और कार निकोबार के बनने की लोककथा है।",
    ],
    shortcut: "तलवार प्रहार → द्वीप विभाजन = अंडमान + कार निकोबार",
  },
  {
    questionId: "hin_sp_ch22_q4",
    topic: "hin_sp_ch22", topicId: "hin_sp_ch22",
    subtopic: "सामाजिक बाधा",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "तताँरा और वामीरो के प्रेम में बाधा क्या थी?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.3, marks: 1, isAIGenerated: true,
    options: [
      { text: "दोनों अलग-अलग गाँवों के थे और परंपरा के अनुसार यह विवाह वर्जित था", type: "correct", logicTag: "" },
      { text: "वे एक-दूसरे को पसंद नहीं करते थे", type: "concept_error", logicTag: "opposite_fact" },
      { text: "तताँरा गरीब था", type: "misinterpretation", logicTag: "wrong_reason" },
      { text: "वामीरो का विवाह हो चुका था", type: "misinterpretation", logicTag: "wrong_reason" },
    ],
    solutionSteps: [
      "दोनों प्यार करते थे।",
      "पर परंपरा थी: एक गाँव का व्यक्ति दूसरे गाँव की लड़की से विवाह नहीं कर सकता।",
    ],
    shortcut: "प्रेम में बाधा = गाँव की सामाजिक परंपरा/वर्जना",
  },

  // ── Ch 23: तीसरी कसम — add q3, q4 ─────────────────────────────────────
  {
    questionId: "hin_sp_ch23_q3",
    topic: "hin_sp_ch23", topicId: "hin_sp_ch23",
    subtopic: "शैलेंद्र का योगदान",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "फ़िल्म 'तीसरी कसम' किस मूल कहानी पर आधारित है?",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.7, marks: 1, isAIGenerated: true,
    options: [
      { text: "फणीश्वरनाथ रेणु की कहानी 'मारे गए गुलफ़ाम'", type: "correct", logicTag: "" },
      { text: "प्रेमचंद की कहानी", type: "misinterpretation", logicTag: "wrong_source" },
      { text: "शैलेंद्र की मूल पटकथा", type: "misinterpretation", logicTag: "wrong_source" },
      { text: "राही मासूम रज़ा का उपन्यास", type: "misinterpretation", logicTag: "wrong_source" },
    ],
    solutionSteps: [
      "फ़िल्म 'तीसरी कसम' फणीश्वरनाथ रेणु की कहानी 'मारे गए गुलफ़ाम' पर आधारित है।",
      "शैलेंद्र ने इसे फ़िल्म के रूप में प्रस्तुत किया।",
    ],
    shortcut: "तीसरी कसम → मूल कहानी: 'मारे गए गुलफ़ाम' (रेणु)",
  },
  {
    questionId: "hin_sp_ch23_q4",
    topic: "hin_sp_ch23", topicId: "hin_sp_ch23",
    subtopic: "व्यावसायिक असफलता",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "फ़िल्म 'तीसरी कसम' व्यावसायिक रूप से सफल क्यों नहीं हुई?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "फ़िल्म में कला और साहित्यिक गहराई थी जो व्यावसायिक दर्शकों को नहीं भाई", type: "correct", logicTag: "" },
      { text: "अभिनेता कमज़ोर थे", type: "misinterpretation", logicTag: "wrong_reason" },
      { text: "फ़िल्म का प्रचार नहीं हुआ", type: "misinterpretation", logicTag: "wrong_reason" },
      { text: "फ़िल्म हिंदी में नहीं थी", type: "misinterpretation", logicTag: "wrong_reason" },
    ],
    solutionSteps: [
      "शैलेंद्र ने इस फ़िल्म में अपनी पूँजी लगाई।",
      "फ़िल्म साहित्यिक थी — दर्शकों ने इसे व्यावसायिक मसाला फ़िल्म की तरह नहीं देखा।",
      "फ़िल्म फ्लॉप हुई और शैलेंद्र की मृत्यु हो गई।",
    ],
    shortcut: "कला vs व्यापार → कलात्मक फ़िल्म = व्यावसायिक असफलता",
  },

  // ── Ch 24: मंटो — add q2, q3, q4 ──────────────────────────────────────
  {
    questionId: "hin_sp_ch24_q2",
    topic: "hin_sp_ch24", topicId: "hin_sp_ch24",
    subtopic: "मंटो का संदेश",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "पाठ में मंटो मनुष्य के किस गुण के लोप पर चिंता व्यक्त करते हैं?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "दूसरे के दुख में दुखी होने की क्षमता — सहानुभूति का लोप", type: "correct", logicTag: "" },
      { text: "शारीरिक बल का लोप", type: "misinterpretation", logicTag: "wrong_concern" },
      { text: "धन का लोप", type: "misinterpretation", logicTag: "wrong_concern" },
      { text: "बुद्धि का लोप", type: "misinterpretation", logicTag: "wrong_concern" },
    ],
    solutionSteps: [
      "मंटो का शीर्षक पूछता है: अब कहाँ दूसरे के दुख से दुखी होने वाले?",
      "आधुनिक मनुष्य स्वकेंद्रित हो गया है — सहानुभूति और करुणा घट रही है।",
    ],
    shortcut: "मंटो: सहानुभूति का लोप = आधुनिक संकट",
  },
  {
    questionId: "hin_sp_ch24_q3",
    topic: "hin_sp_ch24", topicId: "hin_sp_ch24",
    subtopic: "समुद्र का दुख",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "पाठ में 'समुद्र का सिकुड़ना' किसका प्रतीक है?",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.7, marks: 1, isAIGenerated: true,
    options: [
      { text: "मानव के प्रकृति पर अतिक्रमण और उसके दुष्परिणामों का", type: "correct", logicTag: "" },
      { text: "बाढ़ का", type: "misinterpretation", logicTag: "literal_meaning" },
      { text: "वर्षा की कमी का", type: "misinterpretation", logicTag: "wrong_symbol" },
      { text: "समुद्री जीवों के मरने का", type: "misinterpretation", logicTag: "wrong_symbol" },
    ],
    solutionSteps: [
      "मंटो लिखते हैं कि मनुष्य के अतिक्रमण से समुद्र का जगह कम होती जा रही है।",
      "यह पर्यावरण विनाश और मानव लालच का प्रतीक है।",
    ],
    shortcut: "समुद्र का सिकुड़ना = मानवीय अतिक्रमण का दुष्परिणाम",
  },
  {
    questionId: "hin_sp_ch24_q4",
    topic: "hin_sp_ch24", topicId: "hin_sp_ch24",
    subtopic: "विभाजन की पीड़ा",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "मंटो का यह पाठ किस ऐतिहासिक पृष्ठभूमि से प्रभावित है?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "भारत-पाकिस्तान विभाजन (1947) की पीड़ा", type: "correct", logicTag: "" },
      { text: "प्रथम विश्वयुद्ध", type: "misinterpretation", logicTag: "wrong_event" },
      { text: "गाँधी जी की हत्या", type: "misinterpretation", logicTag: "wrong_event" },
      { text: "जलियाँवाला बाग हत्याकांड", type: "misinterpretation", logicTag: "wrong_event" },
    ],
    solutionSteps: [
      "मंटो 1947 के विभाजन से गहरे प्रभावित थे।",
      "उनका लेखन विभाजन की त्रासदी, सांप्रदायिकता और मानवीय पीड़ा का दस्तावेज़ है।",
    ],
    shortcut: "मंटो = 1947 विभाजन का साक्षी और दर्दनाक दस्तावेज़ लेखक",
  },

  // ── Ch 25: पतझर में टूटी पत्तियाँ — add q3, q4 ─────────────────────
  {
    questionId: "hin_sp_ch25_q3",
    topic: "hin_sp_ch25", topicId: "hin_sp_ch25",
    subtopic: "ज़ेन दर्शन",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'पतझर में टूटी पत्तियाँ' के 'ज़ेन की देन' भाग में जापानी टी-सेरेमनी का क्या महत्त्व बताया गया है?",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.7, marks: 1, isAIGenerated: true,
    options: [
      { text: "मन को शांत करना और वर्तमान क्षण में जीना सिखाती है", type: "correct", logicTag: "" },
      { text: "चाय बनाने की विधि सिखाती है", type: "misinterpretation", logicTag: "literal_meaning" },
      { text: "जापानी संस्कृति का प्रचार", type: "misinterpretation", logicTag: "wrong_purpose" },
      { text: "धन कमाना", type: "misinterpretation", logicTag: "wrong_purpose" },
    ],
    solutionSteps: [
      "जापानी टी-सेरेमनी केवल चाय पीने की नहीं — ध्यान और शांति की प्रक्रिया है।",
      "यह मन को वर्तमान में लाती है — भूत-भविष्य की चिंता नहीं, केवल 'अभी'।",
    ],
    shortcut: "टी-सेरेमनी = ज़ेन दर्शन = वर्तमान में जीना",
  },
  {
    questionId: "hin_sp_ch25_q4",
    topic: "hin_sp_ch25", topicId: "hin_sp_ch25",
    subtopic: "आधुनिक मानव की समस्या",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "लेखक के अनुसार जापान में भागती-दौड़ती ज़िंदगी का क्या दुष्परिणाम है?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "दिमाग़ पर अत्यधिक बोझ — लोग मानसिक रोगी बन रहे हैं", type: "correct", logicTag: "" },
      { text: "लोग धनवान हो रहे हैं", type: "concept_error", logicTag: "opposite_result" },
      { text: "लोग खुश हैं", type: "misinterpretation", logicTag: "wrong_result" },
      { text: "परिवार मज़बूत हो रहे हैं", type: "misinterpretation", logicTag: "wrong_result" },
    ],
    solutionSteps: [
      "जापान में विकास के साथ जीवन की गति बढ़ गई।",
      "लेखक बताते हैं कि दिमाग़ को आराम न मिलने से मानसिक रोग बढ़ रहे हैं।",
    ],
    shortcut: "तेज़ जीवन → दिमाग़ थका → मानसिक रोग (ज़ेन इसका उपाय)",
  },

  // ── Ch 26: कारतूस — add q4 ─────────────────────────────────────────────
  {
    questionId: "hin_sp_ch26_q4",
    topic: "hin_sp_ch26", topicId: "hin_sp_ch26",
    subtopic: "वज़ीर अली का साहस",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "वज़ीर अली ने सिपाहियों के घेरे में आकर कर्नल से कारतूस क्यों माँगे?",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.7, marks: 1, isAIGenerated: true,
    options: [
      { text: "अपनी निडरता और क्रांतिकारी भावना दिखाने के लिए", type: "correct", logicTag: "" },
      { text: "उन्हें कारतूसों की वास्तव में ज़रूरत थी", type: "partial_logic", logicTag: "incomplete_answer" },
      { text: "वे आत्मसमर्पण करना चाहते थे", type: "concept_error", logicTag: "opposite_motive" },
      { text: "वे डरे हुए थे", type: "concept_error", logicTag: "opposite_character" },
    ],
    solutionSteps: [
      "वज़ीर अली अकेले अंग्रेज़ों के कैंप में आए।",
      "यह उनकी अदम्य निडरता और क्रांतिकारी भावना का प्रदर्शन था।",
      "कर्नल भी उनकी हिम्मत को सलाम करता है।",
    ],
    shortcut: "अकेले कैंप में = निडरता का चरम; कर्नल की सलामी",
  },

  // ── Ch 28: जॉर्ज पंचम की नाक — add q4 ─────────────────────────────────
  {
    questionId: "hin_kr_ch28_q4",
    topic: "hin_kr_ch28", topicId: "hin_kr_ch28",
    subtopic: "रानी एलिज़ाबेथ की यात्रा",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'जॉर्ज पंचम की नाक' में नाक टूटने की समस्या किस अवसर पर उजागर होती है?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "रानी एलिज़ाबेथ द्वितीय की भारत-यात्रा के समय", type: "correct", logicTag: "" },
      { text: "स्वतंत्रता दिवस पर", type: "misinterpretation", logicTag: "wrong_event" },
      { text: "गाँधी जयंती पर", type: "misinterpretation", logicTag: "wrong_event" },
      { text: "गणतंत्र दिवस पर", type: "misinterpretation", logicTag: "wrong_event" },
    ],
    solutionSteps: [
      "रानी एलिज़ाबेथ द्वितीय की भारत-यात्रा की तैयारी में मूर्ति की टूटी नाक की समस्या सामने आती है।",
    ],
    shortcut: "नाक समस्या → रानी एलिज़ाबेथ की यात्रा का अवसर",
  },

  // ── Ch 29: साना-साना हाथ जोड़ि — add q4 ───────────────────────────────
  {
    questionId: "hin_kr_ch29_q4",
    topic: "hin_kr_ch29", topicId: "hin_kr_ch29",
    subtopic: "पहाड़ी लोगों का जीवन",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "पाठ में पहाड़ी महिलाओं के परिश्रम का किस प्रकार वर्णन है?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.4, marks: 1, isAIGenerated: true,
    options: [
      { text: "वे कठिन ऊँचाइयों पर काम करती हैं पर उनके चेहरे पर सुकून है", type: "correct", logicTag: "" },
      { text: "वे आराम से रहती हैं", type: "concept_error", logicTag: "opposite_fact" },
      { text: "वे शहर जाना चाहती हैं", type: "misinterpretation", logicTag: "wrong_fact" },
      { text: "वे दुखी हैं", type: "misinterpretation", logicTag: "wrong_mood" },
    ],
    solutionSteps: [
      "पहाड़ी महिलाएँ कठिन जीवन जीती हैं — ऊँचाई पर काम, कठिन रास्ते।",
      "पर उनके चेहरे पर शांति और सुकून है — प्रकृति के करीब जीवन की संतुष्टि।",
    ],
    shortcut: "पहाड़ी महिला = कठिन श्रम + चेहरे पर सुकून",
  },

  // ── Ch 31: सपनों के से दिन — add q4 ────────────────────────────────────
  {
    questionId: "hin_sy_ch31_q4",
    topic: "hin_sy_ch31", topicId: "hin_sy_ch31",
    subtopic: "अध्यापक का चरित्र",
    subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "पाठ में 'मास्टर प्रीतम चंद' का चरित्र-चित्रण किस रूप में है?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.4, marks: 1, isAIGenerated: true,
    options: [
      { text: "कठोर अनुशासनप्रिय अध्यापक जो बच्चों को डंडे से पढ़ाते थे", type: "correct", logicTag: "" },
      { text: "दयालु और सौम्य अध्यापक", type: "concept_error", logicTag: "opposite_character" },
      { text: "बच्चों के मित्र", type: "misinterpretation", logicTag: "wrong_character" },
      { text: "अनुपस्थित रहने वाले अध्यापक", type: "misinterpretation", logicTag: "wrong_character" },
    ],
    solutionSteps: [
      "मास्टर प्रीतम चंद पुराने ज़माने के कठोर अध्यापक थे।",
      "वे बच्चों को डंडे से पढ़ाते थे — पर यह पुराने दौर की शिक्षा पद्धति का हिस्सा था।",
    ],
    shortcut: "मास्टर प्रीतम चंद = कठोर + डंडे से अनुशासन",
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

  console.log(`\nHindi Questions D: ${created} created, ${updated} updated (${questions.length} total)`);
  await mongoose.disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
