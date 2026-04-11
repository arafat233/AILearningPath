// PM2 cluster config — run with: pm2 start ecosystem.config.cjs
// Uses all available CPU cores. Each worker is an independent Node process
// that shares the same port (OS load-balances between them).
// Requires REDIS_URL in production so session state is shared across workers.
module.exports = {
  apps: [
    {
      name:      "ai-learning-api",
      script:    "./backend/server.js",
      instances: "max",          // one worker per CPU core
      exec_mode: "cluster",
      watch:     false,
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
        LOG_LEVEL: "info",
      },
      // Restart if memory exceeds 500MB (memory leak safety net)
      max_memory_restart: "500M",
      // Graceful shutdown: let in-flight requests finish (30s max)
      kill_timeout: 30000,
      // Wait 1s before marking a restart as failed (avoid restart loops)
      min_uptime: "1s",
      max_restarts: 10,
    },
  ],
};
