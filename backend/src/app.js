import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.disable("x-powered-by");
/*
|--------------------------------------------------------------------------
| Security Middleware
|--------------------------------------------------------------------------
| Helmet helps secure Express apps by setting HTTP headers.
|--------------------------------------------------------------------------
*/

app.use(helmet());

/*
|--------------------------------------------------------------------------
| CORS Configuration
|--------------------------------------------------------------------------
| Allows frontend access.
| credentials: true is important for cookies/auth later.
|--------------------------------------------------------------------------
*/

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

/*
|--------------------------------------------------------------------------
| Body Parsing Middleware
|--------------------------------------------------------------------------
*/

// Parse JSON request bodies
app.use(express.json({ limit: "10kb" }));

// Parse cookies
app.use(cookieParser());

/*
|--------------------------------------------------------------------------
| Health Check Route
|--------------------------------------------------------------------------
| Used for:
| - uptime monitoring
| - load balancers
| - API checks
|--------------------------------------------------------------------------
*/

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running successfully",
  });
});

/*
|--------------------------------------------------------------------------
| 404 Route Handler
|--------------------------------------------------------------------------
| Handles unknown routes.
|--------------------------------------------------------------------------
*/

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;