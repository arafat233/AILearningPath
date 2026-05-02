import "dotenv/config";

const config = {
  mongodb: {
    url: process.env.MONGO_URI || "mongodb://localhost:27017",
    databaseName: process.env.MONGO_DB_NAME || "ai_learning",
    options: { useNewUrlParser: true, useUnifiedTopology: true },
  },
  migrationsDir: "migrations",
  changelogCollectionName: "changelog",
  migrationFileExtension: ".js",
  useFileHash: false,
  moduleSystem: "esm",
};

export default config;
