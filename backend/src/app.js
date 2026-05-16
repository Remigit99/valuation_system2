import dns from "node:dns";

import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

import errorMiddleware from "./middleware/errorMiddleware.js";
import AppError from "./utils/errors/AppError.js";
import asyncHandler from "./utils/errors/asyncHandler.js";

import authRoutes from "./modules/auth/auth.routes.js";

dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

// Add this right at the top of your server.js / app.js




const app = express();

app.disable("x-powered-by");
/*
|---------------------
| Security Middleware
|----------------------------------------------------------
| Helmet helps secure Express apps by setting HTTP headers.
|----------------------------------------------------------
*/

app.use(helmet());

/*
|--------------------
| CORS Configuration
|------------------------
| Allows frontend access.
| credentials: true is important for cookies/auth later.
|--------------------------------------------------------
*/

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );

app.use(cors({ origin: '*' }));

/*
|--------------------------
| Body Parsing Middleware
|--------------------------
*/

// Parse JSON request bodies
app.use(express.json({ limit: "10kb" }));

// Parse cookies
app.use(cookieParser());

/*
|--------------------
| Health Check Route
|---------------------
| Used for:
| - uptime monitoring
| - load balancers
| - API checks
|---------------------
*/


/*---------------------------------------------
| Mounts route handlers for different modules.
|----------------------------------------------
*/

app.use("/api/v1/auth", authRoutes);


app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running successfully",
  });
});



/*
|---------------------
| 404 Route Handler
|-------------------------
| Handles unknown routes.
|-------------------------
*/

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/*
|----------------------------------
| Global Error Handling Middleware
|----------------------------------
*/
app.get(
  "/api/v1/error",
  asyncHandler(async (req, res) => {
    throw new AppError("Test error route", 400);
  })
);



app.use(AppError);
app.use(asyncHandler);
app.use(errorMiddleware);


export default app;