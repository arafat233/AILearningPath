import "dotenv/config";
import mongoose from "mongoose";

await mongoose.connect(process.env.MONGO_URI);

const Question = mongoose.model("Question", new mongoose.Schema({}, { strict: false }), "questions");

const rows = await Question.aggregate([
  { $match: { deletedAt: null } },
  { $group: {
      _id: { ch: "$chapterNumber", topic: "$topicId" },
      easy:   { $sum: { $cond: [{ $eq: ["$difficulty","easy"]   }, 1, 0] } },
      medium: { $sum: { $cond: [{ $eq: ["$difficulty","medium"] }, 1, 0] } },
      hard:   { $sum: { $cond: [{ $eq: ["$difficulty","hard"]   }, 1, 0] } },
      total:  { $sum: 1 }
  }},
  { $sort: { "_id.ch": 1, "_id.topic": 1 } }
]);

const chapters = {};
for (const r of rows) {
  const ch = r._id.ch ?? "?";
  if (!chapters[ch]) chapters[ch] = { rows: [], easy: 0, medium: 0, hard: 0, total: 0 };
  chapters[ch].rows.push(r);
  chapters[ch].easy   += r.easy;
  chapters[ch].medium += r.medium;
  chapters[ch].hard   += r.hard;
  chapters[ch].total  += r.total;
}

const CH_NAMES = {
  1:"Real Numbers", 2:"Polynomials", 3:"Pair of Linear Equations",
  4:"Quadratic Equations", 5:"Arithmetic Progressions", 6:"Triangles",
  7:"Coordinate Geometry", 8:"Introduction to Trigonometry",
  9:"Applications of Trigonometry", 10:"Circles", 11:"Areas Related to Circles",
  12:"Surface Areas & Volumes", 13:"Statistics", 14:"Probability"
};

let grandE=0, grandM=0, grandH=0, grandT=0;

for (const [ch, data] of Object.entries(chapters).sort((a,b)=>Number(a[0])-Number(b[0]))) {
  console.log(`\nCh ${ch}: ${CH_NAMES[ch] || "?"} — E=${data.easy} M=${data.medium} H=${data.hard} Total=${data.total}`);
  for (const r of data.rows) {
    const topic = (r._id.topic || "(no topicId)").padEnd(30);
    console.log(`  ${topic} E=${String(r.easy).padStart(2)} M=${String(r.medium).padStart(2)} H=${String(r.hard).padStart(2)}  [${r.total}]`);
  }
  grandE+=data.easy; grandM+=data.medium; grandH+=data.hard; grandT+=data.total;
}

console.log(`\n${"─".repeat(65)}`);
console.log(`GRAND TOTAL                              E=${grandE} M=${grandM} H=${grandH}  [${grandT}]`);
await mongoose.disconnect();
