import "dotenv/config";

import app from "./app.js";
import env from "./config/env.js";
import connectDB from "./config/db.js";
// import { connectRedis } from "./config/redis.js";

const PORT = env.PORT || 5000;


await connectDB();

// await connectRedis();

/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------*/

app.listen(PORT, () => {  
    console.log(`Server is running on port ${PORT}`);  
});

process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down server gracefully...");

  process.exit(0);
});