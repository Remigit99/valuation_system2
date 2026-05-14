import "dotenv/config";

import app from "./app.js";
import env from "./config/env.js";
import connectDB from "./config/db.js";
import { connectRedis } from "./config/redis.js";
// import User from "./modules/users/user.model.js";
// import {
//   generateAccessToken,
//   verifyAccessToken,
// } from "./utils/token.js";


const PORT = env.PORT || 5000;


await connectDB();

await connectRedis();

/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------*/


// console.log(User.modelName, "model loaded"); // Debugging line to confirm model is loaded

// const token = generateAccessToken({
//   userId: "123456",
//   role: "crm",
// });

// console.log("TOKEN:", token);

// const decoded = verifyAccessToken(token);

// console.log("DECODED:", decoded);


app.listen(PORT, () => {  
    console.log(`Server is running on port ${PORT}`);  
});

process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down server gracefully...");

  process.exit(0);
});