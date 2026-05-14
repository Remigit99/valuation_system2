import { z } from "zod";

/*
|--------------------------------------------------------------------------
| Environment Variable Schema
|--------------------------------------------------------------------------
*/

// console.log("--- DEBUGGING PROCESS.ENV ---");
// console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
// console.log("JWT_ACCESS_SECRET value:", process.env.JWT_ACCESS_SECRET);
// console.log("-----------------------------");



const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),

  PORT: z.coerce.number().default(5000).optional(),

  MONGO_URI: z.string().min(1),

  REDIS_URL: z.string().min(1),

  JWT_ACCESS_SECRET: z.string().min(32),

  JWT_REFRESH_SECRET: z.string().min(32),
});


/*
|--------------------------------------------------------------------------
| Validate Environment Variables
|--------------------------------------------------------------------------
*/

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid Environment Variables");

  console.error(parsedEnv.error.flatten().fieldErrors);

  process.exit(1);
}

/*
|--------------------------------------------------------------------------
| Export Validated Env
|--------------------------------------------------------------------------
*/

const env = parsedEnv.data;

export default env;