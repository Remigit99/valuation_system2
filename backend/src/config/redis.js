import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

/*
|--------------------------------------------------------------------------
| Redis Event Listeners
|--------------------------------------------------------------------------
*/

redisClient.on("connect", () => {
  console.log("🟡 Connecting to Redis...");
});

redisClient.on("ready", () => {
  console.log("✅ Redis Connected");
});

redisClient.on("error", (error) => {
  console.error("❌ Redis Error:", error.message);
});

redisClient.on("end", () => {
  console.log("🔴 Redis Connection Closed");
});

/*
|--------------------------------------------------------------------------
| Connect Redis
|--------------------------------------------------------------------------
*/

const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error("❌ Failed to connect to Redis");
    console.error(error.message);

    process.exit(1);
  }
};

export { redisClient, connectRedis };