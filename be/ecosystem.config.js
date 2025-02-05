module.exports = {
  apps: [
    {
      name: "gol-be",
      script: "index.js",
      instances: "1",
      exec_mode: "fork",
      watch: true,
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
