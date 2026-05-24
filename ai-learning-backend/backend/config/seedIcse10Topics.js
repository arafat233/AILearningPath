/**
 * Seed Topic documents for ICSE Math Class 10.
 * Creates one Topic per distinct topicId from existing ICSE questions,
 * tagged examBoard: "ICSE" so the practice page filters them correctly.
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const { Topic, Question } = await import('../models/index.js');
await mongoose.connect(process.env.MONGO_URI);

// Derive topics directly from what's in the Question collection
const rows = await Question.aggregate([
  { $match: { examBoard: 'ICSE', topicId: /^icse_math10_/ } },
  { $group: {
      _id: { topicId: '$topicId', topic: '$topic', subject: '$subject', grade: '$grade' },
      examFrequency: { $avg: '$difficultyScore' },   // use avg difficulty as proxy for frequency
  }},
  { $sort: { '_id.topicId': 1 } }
]);

// Chapter number map from topicId prefix
function chapterFromTopicId(tid) {
  const m = tid.match(/ch(\d+)_/);
  return m ? parseInt(m[1]) : 0;
}

// Chapter display names
const chapterNames = {
  ch1:  'Taxation',
  ch2:  'Banking',
  ch3:  'Shares and Dividends',
  ch4:  'Linear Inequations',
  ch5:  'Quadratic Equations',
  ch6:  'Quadratic Problems',
  ch7:  'Ratio and Proportion',
  ch8:  'Remainder and Factor Theorem',
  ch9:  'Matrices',
  ch10: 'Arithmetic Progression',
  ch11: 'Geometric Progression',
  ch12: 'Reflection',
  ch13: 'Section and Midpoint Formula',
  ch14: 'Equation of a Line',
  ch15: 'Similarity',
  ch16: 'Loci',
  ch17: 'Circles',
  ch18: 'Tangents and Intersecting Chords',
};

let inserted = 0, skipped = 0;
for (const row of rows) {
  const { topicId, topic, subject, grade } = row._id;
  const chKey = topicId.match(/_(ch\d+)_/)?.[1];
  const chapterName = chKey ? chapterNames[chKey] : topic;
  const chapterNumber = chapterFromTopicId(topicId);

  const exists = await Topic.findOne({ topicId }).lean();
  if (exists) { skipped++; continue; }

  await Topic.create({
    name:          topic,
    subject:       subject || 'Mathematics',
    grade:         grade || '10',
    examBoard:     'ICSE',
    topicId,
    examFrequency: 0.7,
    estimatedHours: 2,
    examMarks:     5,
    realWorldUse:  '',
    whyMatters:    '',
    prerequisites: [],
    level:         chapterNumber,
  });
  inserted++;
}

console.log(`\nICse Math 10 Topics — inserted: ${inserted}  skipped: ${skipped}`);

// Verify
const total = await Topic.countDocuments({ examBoard: 'ICSE' });
console.log(`Total ICSE topics in collection: ${total}`);

await mongoose.disconnect();
