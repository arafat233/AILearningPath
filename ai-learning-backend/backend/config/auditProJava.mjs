import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { ProModule, ProTopic, ProExercise } from '../models/proModels.js';

dotenv.config();

async function auditProJava() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const trackKey = 'pro_java';
    console.log(`📊 Auditing Pro Java Track (${trackKey})\n`);

    // Verify 46 modules
    const modules = await ProModule.find({ trackKey }).lean();
    console.log(`📦 Modules: ${modules.length} (expected 46)`);
    if (modules.length !== 46) {
      console.error(`  ❌ Expected 46 modules, found ${modules.length}`);
    }

    let totalTopics = 0;
    let totalExercises = 0;
    let topicsWithoutExercises = [];
    let exercisesWithoutTestCases = [];
    let moduleGaps = [];

    // For each module: check topics and exercises
    for (const mod of modules) {
      const topics = await ProTopic.find({ moduleId: mod.moduleId }).lean();
      totalTopics += topics.length;

      if (topics.length === 0) {
        moduleGaps.push(`${mod.moduleId}: 0 topics`);
        continue;
      }

      for (const topic of topics) {
        const exercises = await ProExercise.find({ topicId: topic.topicId }).lean();
        totalExercises += exercises.length;

        if (exercises.length === 0) {
          topicsWithoutExercises.push(topic.topicId);
        }

        for (const ex of exercises) {
          if (!ex.testCases || ex.testCases.length === 0) {
            exercisesWithoutTestCases.push(ex.exerciseId);
          }
        }
      }
    }

    console.log(`📚 Topics: ${totalTopics} (expected 232)`);
    console.log(`🎯 Exercises: ${totalExercises} (expected 3311)\n`);

    // Report gaps
    let hasGaps = false;

    if (moduleGaps.length > 0) {
      console.error(`❌ Modules without topics (${moduleGaps.length}):`);
      moduleGaps.forEach(gap => console.error(`   - ${gap}`));
      hasGaps = true;
    }

    if (topicsWithoutExercises.length > 0) {
      console.error(`❌ Topics without exercises (${topicsWithoutExercises.length}):`);
      topicsWithoutExercises.slice(0, 10).forEach(id => console.error(`   - ${id}`));
      if (topicsWithoutExercises.length > 10) {
        console.error(`   ... and ${topicsWithoutExercises.length - 10} more`);
      }
      hasGaps = true;
    }

    if (exercisesWithoutTestCases.length > 0) {
      console.error(`❌ Exercises without test cases (${exercisesWithoutTestCases.length}):`);
      exercisesWithoutTestCases.slice(0, 10).forEach(id => console.error(`   - ${id}`));
      if (exercisesWithoutTestCases.length > 10) {
        console.error(`   ... and ${exercisesWithoutTestCases.length - 10} more`);
      }
      hasGaps = true;
    }

    if (!hasGaps) {
      console.log('✅ All checks passed!\n');
      console.log('Summary:');
      console.log(`  ✅ 46/46 modules present`);
      console.log(`  ✅ ${totalTopics}/232 topics`);
      console.log(`  ✅ ${totalExercises}/3311 exercises`);
      console.log(`  ✅ All exercises have test cases\n`);
    } else {
      console.log('\n⚠️  Audit found gaps. Fix before deploying to production.\n');
    }

    await mongoose.disconnect();
    process.exit(hasGaps ? 1 : 0);
  } catch (err) {
    console.error('❌ Audit failed:', err.message);
    process.exit(1);
  }
}

auditProJava();
