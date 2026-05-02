import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongod;

export async function connectTestDB() {
  if (process.env.MONGO_URI) {
    await mongoose.connect(process.env.MONGO_URI);
  } else {
    mongod = await MongoMemoryServer.create({ instance: { dbName: "testdb" } });
    await mongoose.connect(mongod.getUri());
  }
}

export async function disconnectTestDB() {
  if (mongod) {
    await mongoose.disconnect();
    await mongod.stop();
  }
}

export async function clearCollections() {
  for (const collection of Object.values(mongoose.connection.collections)) {
    await collection.deleteMany({});
  }
}
