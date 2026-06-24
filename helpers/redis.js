const Redis = require("ioredis");

const client = new Redis({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT, username: process.env.REDIS_USERNAME, password: process.env.REDIS_PASSWORD });

// Event listener for when the client is ready
client.on("ready", () => {
  console.log("Redis client is ready");
});
client.on("connect", () => {
  console.log("Redis client connected");
});
client.on("error", (err) => {
  console.error("Redis client error:", err);
});
client.on("close", () => {
  console.log("Redis client connection closed");
});

module.exports = client;
