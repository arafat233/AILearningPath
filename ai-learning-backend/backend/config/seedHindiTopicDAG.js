/**
 * Hindi TopicDAG — all 32 chapters
 * Safe to re-run (upserts on topicId).
 * Usage: node config/seedHindiTopicDAG.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import { Topic } from "../models/index.js";

const HIN_TOPICS = {
  // ── Kshitij Bhaag 2 ──────────────────────────────────────────────────────
  hin_ks_ch1:  { name: "सूरदास के पद",                              level: 0, prerequisites: [] },
  hin_ks_ch2:  { name: "तुलसीदास के पद",                            level: 0, prerequisites: [] },
  hin_ks_ch3:  { name: "देव के पद",                                 level: 0, prerequisites: [] },
  hin_ks_ch4:  { name: "जयशंकर प्रसाद — आत्मकथ्य",                level: 0, prerequisites: [] },
  hin_ks_ch5:  { name: "निराला — उत्साह, अट नहीं रही है",          level: 0, prerequisites: [] },
  hin_ks_ch6:  { name: "नागार्जुन — यह दंतुरित मुस्कान, फसल",    level: 0, prerequisites: [] },
  hin_ks_ch7:  { name: "फ़िराक़ गोरखपुरी — रुबाइयाँ, गज़ल",       level: 0, prerequisites: [] },
  hin_ks_ch8:  { name: "मंगलेश डबराल — संगतकार",                  level: 0, prerequisites: [] },
  hin_ks_ch9:  { name: "स्वयं प्रकाश — नेताजी का चश्मा",          level: 0, prerequisites: [] },
  hin_ks_ch10: { name: "रामवृक्ष बेनीपुरी — बालगोबिन भगत",        level: 0, prerequisites: [] },
  hin_ks_ch11: { name: "यशपाल — लखनवी अंदाज़",                    level: 0, prerequisites: [] },
  hin_ks_ch12: { name: "मन्नू भंडारी — एक कहानी यह भी",           level: 0, prerequisites: [] },
  // ── Sparsh Bhaag 2 ───────────────────────────────────────────────────────
  hin_sp_ch13: { name: "कबीर की साखियाँ",                          level: 0, prerequisites: [] },
  hin_sp_ch14: { name: "मीरा के पद",                               level: 0, prerequisites: [] },
  hin_sp_ch15: { name: "बिहारी के दोहे",                           level: 0, prerequisites: [] },
  hin_sp_ch16: { name: "मैथिलीशरण गुप्त — मनुष्यता",             level: 0, prerequisites: [] },
  hin_sp_ch17: { name: "सुमित्रानंदन पंत — पर्वत प्रदेश में पावस", level: 0, prerequisites: [] },
  hin_sp_ch18: { name: "महादेवी वर्मा — मधुर-मधुर मेरे दीपक जल", level: 0, prerequisites: [] },
  hin_sp_ch19: { name: "वीरेन डंगवाल — तोप",                      level: 0, prerequisites: [] },
  hin_sp_ch20: { name: "प्रेमचंद — बड़े भाई साहब",                level: 0, prerequisites: [] },
  hin_sp_ch21: { name: "सीताराम सेकसरिया — डायरी का एक पन्ना",   level: 0, prerequisites: [] },
  hin_sp_ch22: { name: "लीलाधर मंडलोई — तताँरा-वामीरो कथा",      level: 0, prerequisites: [] },
  hin_sp_ch23: { name: "प्रहलाद अग्रवाल — तीसरी कसम के शिल्पकार शैलेंद्र", level: 0, prerequisites: [] },
  hin_sp_ch24: { name: "मंटो — अब कहाँ दूसरे के दुख से दुखी होने वाले", level: 0, prerequisites: [] },
  hin_sp_ch25: { name: "सर्वेश्वरदयाल — पतझर में टूटी पत्तियाँ", level: 0, prerequisites: [] },
  hin_sp_ch26: { name: "हबीब तनवीर — कारतूस",                     level: 0, prerequisites: [] },
  // ── Kritika Bhaag 2 ──────────────────────────────────────────────────────
  hin_kr_ch27: { name: "शिवपूजन सहाय — माता का आँचल",             level: 0, prerequisites: [] },
  hin_kr_ch28: { name: "कमलेश्वर — जॉर्ज पंचम की नाक",           level: 0, prerequisites: [] },
  hin_kr_ch29: { name: "मधु कांकरिया — साना-साना हाथ जोड़ि",     level: 0, prerequisites: [] },
  // ── Sanchayan Bhaag 2 ────────────────────────────────────────────────────
  hin_sy_ch30: { name: "मिथिलेश्वर — हरिहर काका",                 level: 0, prerequisites: [] },
  hin_sy_ch31: { name: "गुरदयाल सिंह — सपनों के से दिन",          level: 0, prerequisites: [] },
  hin_sy_ch32: { name: "राही मासूम रज़ा — टोपी शुक्ला",           level: 0, prerequisites: [] },
};

async function run() {
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10_000 });
  console.log("MongoDB connected");

  let inserted = 0;
  let already  = 0;

  for (const [topicId, meta] of Object.entries(HIN_TOPICS)) {
    const exists = await Topic.findOne({ topicId });
    if (exists) { already++; continue; }

    await Topic.create({
      topicId,
      name:          meta.name,
      subject:       "Hindi",
      grade:         "10",
      board:         "CBSE",
      level:         meta.level,
      prerequisites: meta.prerequisites,
      chapterId:     topicId.split("_").slice(0, 3).join("_"),
    });
    inserted++;
    console.log(`  ✓ ${topicId}`);
  }

  console.log(`\nHindi TopicDAG: ${inserted} inserted, ${already} already existed (${Object.keys(HIN_TOPICS).length} total)`);
  await mongoose.disconnect();
}

run().catch((err) => { console.error(err); process.exit(1); });
