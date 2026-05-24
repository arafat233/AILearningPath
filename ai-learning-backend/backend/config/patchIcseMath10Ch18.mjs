/**
 * Patch: Add 2 missing long_answer questions to icse_math10_ch18_tangent_properties
 * Brings the topic from 14 → 16 questions (matching all other ch18 sub-topics).
 * Run: node config/patchIcseMath10Ch18.mjs
 */
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });
import mongoose from 'mongoose';

await mongoose.connect(process.env.MONGO_URI);
const db = mongoose.connection.db;
const col = db.collection('questions');

// Safety: check current count
const before = await col.countDocuments({ topicId: 'icse_math10_ch18_tangent_properties' });
console.log(`Before: ${before} questions for icse_math10_ch18_tangent_properties`);

if (before >= 16) {
  console.log('Already at 16+. Nothing to patch.');
  await mongoose.disconnect();
  process.exit(0);
}

const now = new Date();

const newQuestions = [
  {
    questionId:     'icse_math10_ch18_tangent_properties_c1',
    topicId:        'icse_math10_ch18_tangent_properties',
    subject:        'Mathematics',
    topic:          'Tangents and Intersecting Chords',
    subtopic:       'Properties of Tangents from External Point',
    grade:          '10',
    examBoard:      'ICSE',
    chapterNumber:  18,
    questionType:   'long_answer',
    difficulty:     'hard',
    difficultyScore: 0.65,
    bloomLevel:     'analyse',
    marks:          5,
    negativeMarks:  0,
    expectedTime:   20,
    isPYQ:          true,
    pyqYear:        2018,
    isAIGenerated:  true,
    isFlagged:      false,
    deletedAt:      null,
    conceptTested:  'Prove two tangents equal; OP bisects AB; symmetry of tangent kite',
    approachTags:   ['pyq', 'proof'],
    questionText:   'From an external point P, PA and PB are tangents to a circle with centre O. Chord AB is drawn. Prove: (i) PA = PB, (ii) ∠PAO = ∠PBO, (iii) PO bisects chord AB at right angles. (ICSE 2018)',
    options:        [],
    solutionSteps:  [
      '(i) In △OAP and △OBP: OA = OB (radii); OP = OP (common); ∠OAP = ∠OBP = 90° (radius ⊥ tangent). By RHS congruence △OAP ≅ △OBP. Hence PA = PB.',
      '(ii) From the same congruence △OAP ≅ △OBP, corresponding angles are equal: ∠PAO = ∠PBO.',
      '(iii) Since △OAP ≅ △OBP, ∠APO = ∠BPO (OP bisects ∠APB). Let M be the intersection of OP and AB. In △PAM and △PBM: PA = PB; ∠APM = ∠BPM; PM = PM (common). By SAS, △PAM ≅ △PBM. So AM = BM (OP bisects AB) and ∠PMA = ∠PMB = 90° (supplementary equal angles). Hence PO ⊥ AB and bisects it.'
    ],
    shortcut:       'RHS congruence for △OAP ≅ △OBP gives all three results in sequence.',
    hintLevels:     [],
    stepByStep:     [],
    prerequisites:  [],
    placementRole:  null,
    createdAt:      now,
    updatedAt:      now,
    __v:            0,
  },
  {
    questionId:     'icse_math10_ch18_tangent_properties_c2',
    topicId:        'icse_math10_ch18_tangent_properties',
    subject:        'Mathematics',
    topic:          'Tangents and Intersecting Chords',
    subtopic:       'Properties of Tangents from External Point',
    grade:          '10',
    examBoard:      'ICSE',
    chapterNumber:  18,
    questionType:   'long_answer',
    difficulty:     'hard',
    difficultyScore: 0.62,
    bloomLevel:     'apply',
    marks:          6,
    negativeMarks:  0,
    expectedTime:   20,
    isPYQ:          true,
    pyqYear:        2022,
    isAIGenerated:  true,
    isFlagged:      false,
    deletedAt:      null,
    conceptTested:  'Tangent length using Pythagoras; full kite angle calculation when PO = 2r',
    approachTags:   ['pyq'],
    questionText:   'From an external point P, tangents PA and PB are drawn to a circle with centre O and radius 6 cm. If PO = 12 cm, find: (i) length PA, (ii) ∠OPA, (iii) ∠APB, (iv) ∠AOB. (ICSE 2022)',
    options:        [],
    solutionSteps:  [
      '(i) In right △OAP: ∠OAP = 90° (radius ⊥ tangent). PA² = PO² − OA² = 144 − 36 = 108. PA = 6√3 cm.',
      '(ii) sin(∠OPA) = OA/PO = 6/12 = 1/2 → ∠OPA = 30°.',
      '(iii) ∠APB = 2 × ∠OPA = 2 × 30° = 60° (OP is axis of symmetry).',
      '(iv) In kite OAPB: ∠OAP + ∠OBP = 180° and ∠APB + ∠AOB = 180°. ∠AOB = 180° − 60° = 120°.'
    ],
    shortcut:       'PO = 2r → sin(∠OPA) = r/2r = 1/2 → ∠OPA = 30° always. Memorise this special case.',
    hintLevels:     [],
    stepByStep:     [],
    prerequisites:  [],
    placementRole:  null,
    createdAt:      now,
    updatedAt:      now,
    __v:            0,
  }
];

const result = await col.insertMany(newQuestions);
console.log(`Inserted ${result.insertedCount} documents.`);

const after = await col.countDocuments({ topicId: 'icse_math10_ch18_tangent_properties' });
console.log(`After: ${after} questions for icse_math10_ch18_tangent_properties`);

const total = await col.countDocuments({ topicId: { $regex: /^icse_math10_/ } });
console.log(`Total icse_math10_* questions in DB: ${total}`);

await mongoose.disconnect();
console.log('Done.');
