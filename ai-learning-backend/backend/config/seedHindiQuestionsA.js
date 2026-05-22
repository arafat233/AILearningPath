/**
 * Hindi MCQs — Kshitij Bhaag 2 (Ch 1–12)
 * topicIds: hin_ks_ch1 … hin_ks_ch12
 * All questions in Hindi. Safe to re-run (skips duplicates on questionId).
 * Usage: node config/seedHindiQuestionsA.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import { Question } from "../models/index.js";

const Q = [
  // ── hin_ks_ch1: सूरदास के पद ─────────────────────────────────────────────
  {
    topic: "hin_ks_ch1", topicId: "hin_ks_ch1", questionId: "hin_ks_ch1_q1",
    subtopic: "भक्ति", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "सूरदास के 'भ्रमरगीत' में गोपियाँ किसकी उपासना को अस्वीकार करती हैं?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "निर्गुण ब्रह्म की", type: "correct", logicTag: "" },
      { text: "सगुण ब्रह्म की", type: "concept_error", logicTag: "opposite_answer" },
      { text: "राधा की", type: "concept_error", logicTag: "wrong_reference" },
      { text: "इंद्र की", type: "guessing", logicTag: "surface_guess" },
    ],
    solutionSteps: ["गोपियाँ उद्धव के निर्गुण ज्ञान-योग को अस्वीकार करती हैं।", "वे कृष्ण की सगुण भक्ति को श्रेष्ठ मानती हैं — निर्गुण ब्रह्म की उपासना उनके लिए असंभव है।"],
    shortcut: "भ्रमरगीत = गोपियाँ उद्धव के निर्गुण योग को नकारती हैं; सगुण प्रेम-भक्ति को स्वीकार करती हैं।",
  },
  {
    topic: "hin_ks_ch1", topicId: "hin_ks_ch1", questionId: "hin_ks_ch1_q2",
    subtopic: "भाषा", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "सूरदास की भाषा कौन-सी है?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "ब्रजभाषा", type: "correct", logicTag: "" },
      { text: "अवधी", type: "concept_error", logicTag: "confused_with_tulsi" },
      { text: "मैथिली", type: "concept_error", logicTag: "wrong_dialect" },
      { text: "खड़ी बोली", type: "concept_error", logicTag: "modern_hindi" },
    ],
    solutionSteps: ["सूरदास की रचनाएँ ब्रजभाषा में हैं जो मथुरा-वृंदावन क्षेत्र की भाषा है।", "तुलसीदास अवधी में लिखते थे — यह सामान्य भ्रम है।"],
    shortcut: "सूरदास = ब्रजभाषा; तुलसीदास = अवधी।",
  },
  {
    topic: "hin_ks_ch1", topicId: "hin_ks_ch1", questionId: "hin_ks_ch1_q3",
    subtopic: "भाव", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'ऊधो, मन न भए दस-बीस' — इस पंक्ति में गोपियाँ क्या कह रही हैं?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "उनका एक ही मन था जो कृष्ण के साथ गया, योग के लिए मन बचा नहीं", type: "correct", logicTag: "" },
      { text: "उनके पास दस-बीस मन हैं", type: "concept_error", logicTag: "literal_misread" },
      { text: "वे उद्धव को दस-बीस मन देना चाहती हैं", type: "concept_error", logicTag: "wrong_direction" },
      { text: "मन की गिनती नहीं होती", type: "partial_logic", logicTag: "vague_answer" },
    ],
    solutionSteps: ["गोपियाँ व्यंग्य में कहती हैं — हमारे पास एक ही मन था, वह कृष्ण के साथ चला गया।", "अब योग-साधना के लिए कोई मन बचा ही नहीं — यह उपालंभ की शैली है।"],
    shortcut: "एक मन = कृष्ण के साथ गया → योग के लिए मन नहीं = उपालंभ।",
  },
  {
    topic: "hin_ks_ch1", topicId: "hin_ks_ch1", questionId: "hin_ks_ch1_q4",
    subtopic: "प्रतीक", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "भ्रमरगीत में 'भ्रमर' (काला भँवरा) किसका प्रतीक है?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "उद्धव का", type: "correct", logicTag: "" },
      { text: "सूरदास का", type: "concept_error", logicTag: "wrong_person" },
      { text: "कृष्ण का", type: "concept_error", logicTag: "confused_symbol" },
      { text: "राधा का", type: "guessing", logicTag: "surface_guess" },
    ],
    solutionSteps: ["भ्रमर = उद्धव का प्रतीक।", "काला भँवरा उद्धव जैसा होशियार पर ज्ञान-गर्वित है — गोपियाँ भ्रमर के बहाने उद्धव पर व्यंग्य करती हैं।"],
    shortcut: "भ्रमर = उद्धव; गोपियाँ भ्रमर से बात करके उद्धव पर व्यंग्य करती हैं।",
  },
  {
    topic: "hin_ks_ch1", topicId: "hin_ks_ch1", questionId: "hin_ks_ch1_q5",
    subtopic: "भक्ति", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "सूरदास किस भक्ति धारा के कवि हैं?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "सगुण भक्ति — कृष्णभक्ति शाखा", type: "correct", logicTag: "" },
      { text: "निर्गुण भक्ति — ज्ञानमार्गी", type: "concept_error", logicTag: "confused_with_kabir" },
      { text: "सगुण भक्ति — रामभक्ति शाखा", type: "concept_error", logicTag: "confused_with_tulsi" },
      { text: "शैव भक्ति", type: "guessing", logicTag: "surface_guess" },
    ],
    solutionSteps: ["सूरदास कृष्ण भक्ति शाखा के सर्वश्रेष्ठ सगुण भक्त कवि हैं।", "कबीर = निर्गुण; तुलसीदास = रामभक्ति — सूरदास दोनों से अलग हैं।"],
    shortcut: "सूरदास = सगुण + कृष्णभक्ति; कबीर = निर्गुण; तुलसी = सगुण + रामभक्ति।",
  },

  // ── hin_ks_ch2: तुलसीदास के पद ──────────────────────────────────────────
  {
    topic: "hin_ks_ch2", topicId: "hin_ks_ch2", questionId: "hin_ks_ch2_q1",
    subtopic: "रचना", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "तुलसीदास की प्रमुख रचना कौन-सी है?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "रामचरितमानस", type: "correct", logicTag: "" },
      { text: "सूरसागर", type: "concept_error", logicTag: "confused_with_surdas" },
      { text: "पद्मावत", type: "concept_error", logicTag: "wrong_author" },
      { text: "कामायनी", type: "concept_error", logicTag: "modern_work" },
    ],
    solutionSteps: ["रामचरितमानस तुलसीदास की सर्वाधिक प्रसिद्ध रचना है।", "सूरसागर = सूरदास; पद्मावत = जायसी; कामायनी = प्रसाद।"],
    shortcut: "तुलसी → रामचरितमानस (अवधी) + विनय पत्रिका (ब्रजभाषा)।",
  },
  {
    topic: "hin_ks_ch2", topicId: "hin_ks_ch2", questionId: "hin_ks_ch2_q2",
    subtopic: "भाषा", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "तुलसीदास ने रामचरितमानस किस भाषा में लिखा?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "अवधी", type: "correct", logicTag: "" },
      { text: "ब्रजभाषा", type: "concept_error", logicTag: "confused_with_surdas" },
      { text: "खड़ी बोली", type: "concept_error", logicTag: "modern_hindi" },
      { text: "मैथिली", type: "guessing", logicTag: "surface_guess" },
    ],
    solutionSteps: ["रामचरितमानस अवधी भाषा में लिखा गया है।", "विनय पत्रिका ब्रजभाषा में है — दोनों तुलसी की रचनाएँ हैं पर अलग-अलग भाषाओं में।"],
    shortcut: "रामचरितमानस = अवधी; विनय पत्रिका = ब्रजभाषा।",
  },
  {
    topic: "hin_ks_ch2", topicId: "hin_ks_ch2", questionId: "hin_ks_ch2_q3",
    subtopic: "भक्ति", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "तुलसीदास की भक्ति का मुख्य भाव क्या है?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "दास्य भाव", type: "correct", logicTag: "" },
      { text: "माधुर्य भाव", type: "concept_error", logicTag: "confused_with_meera" },
      { text: "सख्य भाव", type: "concept_error", logicTag: "wrong_bhav" },
      { text: "शांत भाव", type: "guessing", logicTag: "surface_guess" },
    ],
    solutionSteps: ["तुलसीदास दास्य भाव के भक्त हैं — वे स्वयं को राम का दास मानते हैं।", "मीरा = माधुर्य भाव (प्रेम); सूरदास = वात्सल्य + सख्य।"],
    shortcut: "तुलसी = दास्य भाव; मीरा = माधुर्य; सूर = वात्सल्य।",
  },

  // ── hin_ks_ch3: देव के पद ─────────────────────────────────────────────
  {
    topic: "hin_ks_ch3", topicId: "hin_ks_ch3", questionId: "hin_ks_ch3_q1",
    subtopic: "काल", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "देव किस काल के कवि हैं?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "रीतिकाल", type: "correct", logicTag: "" },
      { text: "भक्तिकाल", type: "concept_error", logicTag: "previous_period" },
      { text: "आदिकाल", type: "concept_error", logicTag: "earliest_period" },
      { text: "आधुनिककाल", type: "concept_error", logicTag: "too_recent" },
    ],
    solutionSteps: ["देव रीतिकाल (1643-1843) के प्रमुख कवि हैं।", "रीतिकाल में श्रृंगार रस और अलंकार-प्रधान कविता की परंपरा थी।"],
    shortcut: "रीतिकाल = 1643-1843; देव, बिहारी, केशव — तीनों रीतिकालीन।",
  },
  {
    topic: "hin_ks_ch3", topicId: "hin_ks_ch3", questionId: "hin_ks_ch3_q2",
    subtopic: "छंद", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "देव किस छंद के लिए विशेष रूप से जाने जाते हैं?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "सवैया और कवित्त", type: "correct", logicTag: "" },
      { text: "दोहा और सोरठा", type: "concept_error", logicTag: "confused_with_bihari" },
      { text: "चौपाई और रोला", type: "concept_error", logicTag: "confused_with_tulsi" },
      { text: "रुबाई और गज़ल", type: "concept_error", logicTag: "urdu_forms" },
    ],
    solutionSteps: ["देव सवैया और कवित्त छंदों के उस्ताद माने जाते हैं।", "बिहारी = दोहा; तुलसी = चौपाई; फ़िराक़ = रुबाई।"],
    shortcut: "देव = सवैया + कवित्त; बिहारी = दोहा।",
  },

  // ── hin_ks_ch4: जयशंकर प्रसाद — आत्मकथ्य ────────────────────────────
  {
    topic: "hin_ks_ch4", topicId: "hin_ks_ch4", questionId: "hin_ks_ch4_q1",
    subtopic: "काव्यधारा", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "जयशंकर प्रसाद किस काव्य-आंदोलन के कवि हैं?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "छायावाद", type: "correct", logicTag: "" },
      { text: "प्रगतिवाद", type: "concept_error", logicTag: "different_movement" },
      { text: "रीतिकाल", type: "concept_error", logicTag: "wrong_period" },
      { text: "प्रयोगवाद", type: "concept_error", logicTag: "later_movement" },
    ],
    solutionSteps: ["प्रसाद छायावाद के चार प्रमुख कवियों में से एक हैं।", "छायावाद के चार स्तंभ: प्रसाद, निराला, पंत, महादेवी वर्मा।"],
    shortcut: "छायावाद 4: प्रसाद + निराला + पंत + महादेवी।",
  },
  {
    topic: "hin_ks_ch4", topicId: "hin_ks_ch4", questionId: "hin_ks_ch4_q2",
    subtopic: "भाव", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'आत्मकथ्य' कविता में प्रसाद क्या करने से इनकार करते हैं?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "आत्मकथा लिखने से", type: "correct", logicTag: "" },
      { text: "कविता लिखने से", type: "concept_error", logicTag: "wrong_activity" },
      { text: "प्रेम करने से", type: "concept_error", logicTag: "misreading" },
      { text: "भगवान की पूजा से", type: "guessing", logicTag: "surface_guess" },
    ],
    solutionSteps: ["'आत्मकथ्य' में प्रसाद आत्मकथा लिखने से विनम्रतापूर्वक इनकार करते हैं।", "इनकार के माध्यम से जीवन की क्षणभंगुरता और प्रेम-पीड़ा का चित्रण होता है।"],
    shortcut: "आत्मकथ्य = आत्मकथा न लिखने का कारण बताने वाली कविता।",
  },
  {
    topic: "hin_ks_ch4", topicId: "hin_ks_ch4", questionId: "hin_ks_ch4_q3",
    subtopic: "प्रतीक", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'आत्मकथ्य' में 'मधुप गुन-गुना कर' — यहाँ 'मधुप' किसका प्रतीक है?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "मन का", type: "correct", logicTag: "" },
      { text: "समय का", type: "concept_error", logicTag: "wrong_symbol" },
      { text: "प्रेम का", type: "partial_logic", logicTag: "partially_right" },
      { text: "मृत्यु का", type: "concept_error", logicTag: "wrong_symbol" },
    ],
    solutionSteps: ["'मधुप' (भ्रमर) यहाँ मन का प्रतीक है जो गुनगुनाते हुए कहानी कह जाता है।", "मन की चंचलता और स्मृतियों को भ्रमर के रूपक से व्यक्त किया गया है।"],
    shortcut: "मधुप = मन = चंचल, गुनगुनाता, कहानी कहता।",
  },

  // ── hin_ks_ch5: निराला ─────────────────────────────────────────────────
  {
    topic: "hin_ks_ch5", topicId: "hin_ks_ch5", questionId: "hin_ks_ch5_q1",
    subtopic: "प्रतीक", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'उत्साह' कविता में बादल किसका प्रतीक है?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "क्रांति और नवजीवन का", type: "correct", logicTag: "" },
      { text: "केवल वर्षा का", type: "concept_error", logicTag: "literal_only" },
      { text: "डर और संकट का", type: "concept_error", logicTag: "opposite_meaning" },
      { text: "शांति और आराम का", type: "concept_error", logicTag: "wrong_mood" },
    ],
    solutionSteps: ["निराला की 'उत्साह' में बादल क्रांति और नई चेतना का प्रतीक है।", "कवि बादल से गर्जन करने और नव-जीवन लाने का आह्वान करते हैं।"],
    shortcut: "उत्साह: बादल = क्रांति + नव-चेतना; वर्षा = परिवर्तन।",
  },
  {
    topic: "hin_ks_ch5", topicId: "hin_ks_ch5", questionId: "hin_ks_ch5_q2",
    subtopic: "ऋतु", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'अट नहीं रही है' किस ऋतु का वर्णन करती है?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "फागुन (वसंत)", type: "correct", logicTag: "" },
      { text: "सावन (वर्षा)", type: "concept_error", logicTag: "wrong_season" },
      { text: "शरद", type: "concept_error", logicTag: "wrong_season" },
      { text: "ग्रीष्म", type: "guessing", logicTag: "surface_guess" },
    ],
    solutionSteps: ["'अट नहीं रही है' में फागुन (वसंत ऋतु) का सौंदर्य चित्रित है।", "'आभा फागुन की' — फागुन का उल्लेख सीधे कविता में है।"],
    shortcut: "अट नहीं रही = फागुन की अपार आभा; वसंत ऋतु।",
  },
  {
    topic: "hin_ks_ch5", topicId: "hin_ks_ch5", questionId: "hin_ks_ch5_q3",
    subtopic: "काव्यशैली", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "निराला ने हिंदी कविता में किसे प्रतिष्ठित किया?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "मुक्त-छंद को", type: "correct", logicTag: "" },
      { text: "दोहा छंद को", type: "concept_error", logicTag: "classical_form" },
      { text: "सवैया को", type: "concept_error", logicTag: "riti_form" },
      { text: "रुबाई को", type: "concept_error", logicTag: "urdu_form" },
    ],
    solutionSteps: ["निराला ने हिंदी में मुक्त-छंद (free verse) को प्रचलित किया — यह उनकी सबसे बड़ी काव्य-क्रांति थी।", "मुक्त-छंद में पारंपरिक मात्रा-नियम नहीं होते, पर आंतरिक लय होती है।"],
    shortcut: "निराला = मुक्त-छंद के प्रणेता; छायावाद में सबसे विद्रोही।",
  },

  // ── hin_ks_ch6: नागार्जुन ─────────────────────────────────────────────
  {
    topic: "hin_ks_ch6", topicId: "hin_ks_ch6", questionId: "hin_ks_ch6_q1",
    subtopic: "शब्दार्थ", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'यह दंतुरित मुस्कान' में 'दंतुरित' का क्या अर्थ है?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "जिसमें नए दाँत निकल रहे हों (शिशु की)", type: "correct", logicTag: "" },
      { text: "टूटे हुए दाँत वाला", type: "concept_error", logicTag: "opposite_meaning" },
      { text: "झूठी मुस्कान", type: "concept_error", logicTag: "wrong_meaning" },
      { text: "बड़े दाँत वाला", type: "concept_error", logicTag: "wrong_meaning" },
    ],
    solutionSteps: ["'दंतुरित' = जिसमें (नए छोटे) दाँत निकल रहे हों।", "यह शिशु के दाँत निकलने के समय की वह प्यारी मुस्कान है।"],
    shortcut: "दंतुरित = नए दाँत निकलते शिशु की मुस्कान।",
  },
  {
    topic: "hin_ks_ch6", topicId: "hin_ks_ch6", questionId: "hin_ks_ch6_q2",
    subtopic: "भाव", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'फसल' कविता में फसल का निर्माण किसके योगदान से बताया गया है?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "किसान, जल, मिट्टी, सूरज, हवा सबके सामूहिक योगदान से", type: "correct", logicTag: "" },
      { text: "केवल किसान की मेहनत से", type: "partial_logic", logicTag: "incomplete_answer" },
      { text: "केवल भगवान की कृपा से", type: "concept_error", logicTag: "religious_misread" },
      { text: "केवल वर्षा और मिट्टी से", type: "partial_logic", logicTag: "incomplete_factors" },
    ],
    solutionSteps: ["नागार्जुन बताते हैं कि फसल किसान + नदियाँ + मिट्टी + सूरज + हवा सबके योगदान से बनती है।", "यह सामूहिक सृजन का संदेश है — अकेला कोई नहीं बनाता।"],
    shortcut: "फसल = किसान + जल + मिट्टी + सूरज + वायु = सामूहिक सृजन।",
  },
  {
    topic: "hin_ks_ch6", topicId: "hin_ks_ch6", questionId: "hin_ks_ch6_q3",
    subtopic: "काव्यधारा", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "नागार्जुन किस काव्यधारा के कवि हैं?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "प्रगतिवाद (जनकवि)", type: "correct", logicTag: "" },
      { text: "छायावाद", type: "concept_error", logicTag: "earlier_movement" },
      { text: "प्रयोगवाद", type: "concept_error", logicTag: "different_movement" },
      { text: "रहस्यवाद", type: "concept_error", logicTag: "wrong_stream" },
    ],
    solutionSteps: ["नागार्जुन प्रगतिशील काव्यधारा के कवि हैं जिन्हें 'जनकवि' कहते हैं।", "उनकी भाषा सरल है और विषय जन-जीवन से जुड़े हैं।"],
    shortcut: "नागार्जुन = प्रगतिवादी जनकवि।",
  },

  // ── hin_ks_ch7: फ़िराक़ गोरखपुरी ─────────────────────────────────────
  {
    topic: "hin_ks_ch7", topicId: "hin_ks_ch7", questionId: "hin_ks_ch7_q1",
    subtopic: "काव्य-रूप", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "रुबाई में कितनी पंक्तियाँ होती हैं?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "चार", type: "correct", logicTag: "" },
      { text: "दो", type: "concept_error", logicTag: "confused_with_sher" },
      { text: "छह", type: "guessing", logicTag: "surface_guess" },
      { text: "आठ", type: "guessing", logicTag: "surface_guess" },
    ],
    solutionSteps: ["रुबाई = 4 पंक्तियों (मिसरों) का उर्दू/फ़ारसी काव्य-रूप।", "शेर = 2 पंक्तियाँ; रुबाई = 4 पंक्तियाँ; मसनवी = लंबी नज़्म।"],
    shortcut: "रुबाई = 4 पंक्तियाँ; तुकबंदी = आआबा।",
  },
  {
    topic: "hin_ks_ch7", topicId: "hin_ks_ch7", questionId: "hin_ks_ch7_q2",
    subtopic: "बिम्ब", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "फ़िराक़ की रुबाइयों में 'चाँद के टुकड़े' किसके लिए प्रयुक्त हुआ है?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "सुंदर बच्चे के लिए", type: "correct", logicTag: "" },
      { text: "चाँदनी के लिए", type: "concept_error", logicTag: "literal_meaning" },
      { text: "प्रेमिका के लिए", type: "concept_error", logicTag: "adult_context" },
      { text: "रात के लिए", type: "guessing", logicTag: "surface_guess" },
    ],
    solutionSteps: ["माँ अपने बच्चे को 'चाँद के टुकड़े' कहती है — यह बच्चे के सौंदर्य की उपमा है।", "रुबाइयों में घरेलू जीवन के बिम्ब हैं — माँ-बच्चे का रिश्ता केंद्र में है।"],
    shortcut: "चाँद के टुकड़े = बच्चे की सुंदरता; माँ-बच्चे का प्रेम।",
  },

  // ── hin_ks_ch8: मंगलेश डबराल — संगतकार ─────────────────────────────
  {
    topic: "hin_ks_ch8", topicId: "hin_ks_ch8", questionId: "hin_ks_ch8_q1",
    subtopic: "भाव", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'संगतकार' कविता में संगतकार अपनी आवाज़ धीमी क्यों करता है?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "मुख्य गायक की आवाज़ उभरे इसलिए — यह उसका सहयोग और त्याग है", type: "correct", logicTag: "" },
      { text: "वह थक जाता है", type: "concept_error", logicTag: "wrong_reason" },
      { text: "दर्शकों के कहने पर", type: "concept_error", logicTag: "invented_reason" },
      { text: "उसे अपनी आवाज़ अच्छी नहीं लगती", type: "concept_error", logicTag: "wrong_reason" },
    ],
    solutionSteps: ["संगतकार जानबूझकर पीछे रहता है ताकि मुख्य गायक उभर सके।", "यह कमज़ोरी नहीं, बल्कि विनम्रता, त्याग और सहयोग की भावना है।"],
    shortcut: "संगतकार = आवाज़ धीमी → मुख्य गायक उभरे → त्याग + सहयोग।",
  },
  {
    topic: "hin_ks_ch8", topicId: "hin_ks_ch8", questionId: "hin_ks_ch8_q2",
    subtopic: "प्रतीक", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'संगतकार' कविता में संगतकार किसका प्रतीक है?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "उन सभी लोगों का जो दूसरों को आगे बढ़ाने के लिए पीछे रहते हैं", type: "correct", logicTag: "" },
      { text: "केवल संगीत के सहायक कलाकारों का", type: "partial_logic", logicTag: "literal_only" },
      { text: "कायर और डरपोक लोगों का", type: "concept_error", logicTag: "wrong_interpretation" },
      { text: "गुमनाम व्यक्तियों का", type: "partial_logic", logicTag: "incomplete" },
    ],
    solutionSteps: ["संगतकार का व्यापक अर्थ है — वे सभी जो दूसरों की सफलता में योगदान देते हुए खुद पर्दे के पीछे रहते हैं।", "यह परार्थता और विनम्रता का महिमागान है।"],
    shortcut: "संगतकार = समाज के सहयोगी, त्यागी लोगों का प्रतीक।",
  },

  // ── hin_ks_ch9: स्वयं प्रकाश — नेताजी का चश्मा ──────────────────────
  {
    topic: "hin_ks_ch9", topicId: "hin_ks_ch9", questionId: "hin_ks_ch9_q1",
    subtopic: "कथावस्तु", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'नेताजी का चश्मा' में मूर्ति पर चश्मा क्यों नहीं था?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "मूर्तिकार चश्मा बनाना भूल गया", type: "correct", logicTag: "" },
      { text: "चश्मा टूट गया था", type: "concept_error", logicTag: "wrong_reason" },
      { text: "नेताजी को चश्मा नहीं लगता था", type: "concept_error", logicTag: "factual_error" },
      { text: "चश्मा चोरी हो गया", type: "concept_error", logicTag: "wrong_reason" },
    ],
    solutionSteps: ["मूर्तिकार नेताजी की मूर्ति बनाते समय चश्मा बनाना भूल गया।", "इसीलिए कैप्टन चश्मेवाला अपनी दुकान से चश्मा लाकर मूर्ति पर लगाता था।"],
    shortcut: "मूर्तिकार भूला → कैप्टन अपना चश्मा लगाता था।",
  },
  {
    topic: "hin_ks_ch9", topicId: "hin_ks_ch9", questionId: "hin_ks_ch9_q2",
    subtopic: "प्रतीक", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "कहानी में 'चश्मा' किसका प्रतीक है?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "देशभक्ति की दृष्टि और भावना का", type: "correct", logicTag: "" },
      { text: "आँख की बीमारी का", type: "concept_error", logicTag: "literal_meaning" },
      { text: "अमीरी का", type: "concept_error", logicTag: "wrong_symbol" },
      { text: "शिक्षा का", type: "concept_error", logicTag: "wrong_symbol" },
    ],
    solutionSteps: ["चश्मा = दृष्टि = देशभक्ति की भावना।", "मूर्ति पर चश्मा लगाना = नेताजी की देशभक्ति की दृष्टि को जीवित रखना।"],
    shortcut: "चश्मा = देशभक्ति की नज़र; सरकंडे का चश्मा = बच्चों की भोली देशभक्ति।",
  },
  {
    topic: "hin_ks_ch9", topicId: "hin_ks_ch9", questionId: "hin_ks_ch9_q3",
    subtopic: "अंत", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "कैप्टन की मृत्यु के बाद मूर्ति पर कैसा चश्मा लगाया गया?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "सरकंडे का चश्मा (बच्चों द्वारा)", type: "correct", logicTag: "" },
      { text: "सोने का चश्मा", type: "guessing", logicTag: "surface_guess" },
      { text: "कोई चश्मा नहीं लगाया गया", type: "concept_error", logicTag: "wrong_ending" },
      { text: "काँच का चश्मा सरकार ने लगाया", type: "concept_error", logicTag: "wrong_ending" },
    ],
    solutionSteps: ["कैप्टन की मृत्यु के बाद बच्चों ने सरकंडे (घास) का चश्मा बनाकर मूर्ति पर लगाया।", "यह कहानी का सबसे मार्मिक दृश्य है — देशभक्ति बच्चों में भी जीवित है।"],
    shortcut: "कैप्टन की मृत्यु → बच्चों का सरकंडे का चश्मा = देशभक्ति जीवित।",
  },

  // ── hin_ks_ch10: रामवृक्ष बेनीपुरी — बालगोबिन भगत ─────────────────
  {
    topic: "hin_ks_ch10", topicId: "hin_ks_ch10", questionId: "hin_ks_ch10_q1",
    subtopic: "आदर्श", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "बालगोबिन भगत किसके आदर्शों पर जीवन जीते हैं?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "कबीर के", type: "correct", logicTag: "" },
      { text: "गाँधीजी के", type: "concept_error", logicTag: "modern_figure" },
      { text: "तुलसीदास के", type: "concept_error", logicTag: "wrong_saint" },
      { text: "बुद्ध के", type: "concept_error", logicTag: "wrong_tradition" },
    ],
    solutionSteps: ["बालगोबिन भगत कबीर के अनुयायी हैं और कबीरपंथी हैं।", "सत्य बोलना, किसी का नहीं लेना, गाना-बजाना — यही उनके कबीरी आदर्श हैं।"],
    shortcut: "बालगोबिन भगत = कबीर के अनुयायी = कबीरपंथी।",
  },
  {
    topic: "hin_ks_ch10", topicId: "hin_ks_ch10", questionId: "hin_ks_ch10_q2",
    subtopic: "विधा", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'बालगोबिन भगत' पाठ की साहित्यिक विधा क्या है?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "रेखाचित्र", type: "correct", logicTag: "" },
      { text: "उपन्यास", type: "concept_error", logicTag: "too_long" },
      { text: "कहानी", type: "partial_logic", logicTag: "related_but_wrong" },
      { text: "नाटक", type: "concept_error", logicTag: "wrong_form" },
    ],
    solutionSteps: ["रेखाचित्र = किसी व्यक्ति का संक्षिप्त, जीवंत चित्रण।", "'बालगोबिन भगत' रेखाचित्र विधा में है — लेखक बेनीपुरी ने इसे लिखा है।"],
    shortcut: "बालगोबिन भगत = रेखाचित्र विधा।",
  },

  // ── hin_ks_ch11: यशपाल — लखनवी अंदाज़ ──────────────────────────────
  {
    topic: "hin_ks_ch11", topicId: "hin_ks_ch11", questionId: "hin_ks_ch11_q1",
    subtopic: "कथावस्तु", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'लखनवी अंदाज़' में नवाब साहब ने खीरे के साथ क्या किया?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "सूँघकर खिड़की से फेंक दिया और कहा पेट भर गया", type: "correct", logicTag: "" },
      { text: "स्वाद लेकर खाया", type: "concept_error", logicTag: "opposite_action" },
      { text: "कथाकार को दे दिया", type: "concept_error", logicTag: "wrong_action" },
      { text: "नमक लगाकर रख लिया", type: "concept_error", logicTag: "wrong_action" },
    ],
    solutionSteps: ["नवाब साहब ने खीरे को छीला, सुंघा, और फिर खिड़की से बाहर फेंक दिया।", "फिर कहा — 'खीरे की तासीर से पेट भर गया' — यह लखनवी दिखावे का उत्कृष्ट उदाहरण है।"],
    shortcut: "नवाब = खीरा सूँघा + फेंका + 'तासीर से पेट भरा' = खोखली नज़ाकत।",
  },
  {
    topic: "hin_ks_ch11", topicId: "hin_ks_ch11", questionId: "hin_ks_ch11_q2",
    subtopic: "शैली", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'लखनवी अंदाज़' किस शैली में लिखी गई कहानी है?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "व्यंग्यात्मक", type: "correct", logicTag: "" },
      { text: "भावनात्मक/करुण", type: "concept_error", logicTag: "wrong_tone" },
      { text: "रहस्यमय", type: "concept_error", logicTag: "wrong_tone" },
      { text: "वीरतापूर्ण", type: "concept_error", logicTag: "wrong_tone" },
    ],
    solutionSteps: ["यशपाल की 'लखनवी अंदाज़' व्यंग्यात्मक शैली की कहानी है।", "लखनऊ की नकली नज़ाकत और दिखावे पर इसमें करारा व्यंग्य किया गया है।"],
    shortcut: "लखनवी अंदाज़ = यशपाल का व्यंग्य = दिखावे पर प्रहार।",
  },

  // ── hin_ks_ch12: मन्नू भंडारी — एक कहानी यह भी ──────────────────────
  {
    topic: "hin_ks_ch12", topicId: "hin_ks_ch12", questionId: "hin_ks_ch12_q1",
    subtopic: "विधा", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "'एक कहानी यह भी' पाठ की साहित्यिक विधा क्या है?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "आत्मकथात्मक संस्मरण", type: "correct", logicTag: "" },
      { text: "काल्पनिक कहानी", type: "concept_error", logicTag: "fiction_not_memoir" },
      { text: "नाटक", type: "concept_error", logicTag: "wrong_form" },
      { text: "निबंध", type: "concept_error", logicTag: "wrong_form" },
    ],
    solutionSteps: ["'एक कहानी यह भी' मन्नू भंडारी की आत्मकथात्मक रचना है।", "इसमें उनके बचपन, पिता का प्रभाव और लेखकीय पहचान बनाने की यात्रा है।"],
    shortcut: "एक कहानी यह भी = आत्मकथात्मक संस्मरण।",
  },
  {
    topic: "hin_ks_ch12", topicId: "hin_ks_ch12", questionId: "hin_ks_ch12_q2",
    subtopic: "मुख्य विषय", subject: "Hindi", grade: "10", examBoard: "CBSE",
    questionText: "मन्नू भंडारी की इस रचना का मुख्य विषय क्या है?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "स्त्री-पहचान और परिवार-प्रभाव के बीच संघर्ष", type: "correct", logicTag: "" },
      { text: "केवल प्रेम-कहानी", type: "concept_error", logicTag: "misread_theme" },
      { text: "युद्ध और वीरता", type: "concept_error", logicTag: "wrong_theme" },
      { text: "धार्मिक आस्था", type: "concept_error", logicTag: "wrong_theme" },
    ],
    solutionSteps: ["यह रचना एक लेखिका की अपनी पहचान बनाने की यात्रा है।", "पिता का प्रभाव, परिवार की अपेक्षाएँ और अपनी लेखकीय स्वतंत्रता — इनके बीच संघर्ष मुख्य विषय है।"],
    shortcut: "मन्नू भंडारी = स्त्री-पहचान + परिवार + लेखकीय आज़ादी।",
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

  console.log(`\nHindi Questions A: ${inserted} inserted, ${skipped} already existed (${Q.length} total)`);
  await mongoose.disconnect();
}

run().catch((err) => { console.error(err); process.exit(1); });
