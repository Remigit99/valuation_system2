import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
dotenv.config();

const PORT = process.env.PORT || 5000;


await connectDB();

app.listen(PORT, () => {  
    console.log(`Server is running on port ${PORT}`);  
});

process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down server gracefully...");

  process.exit(0);
});