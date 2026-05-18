import rateLimit from "express-rate-limit";

/*
|--------------------------------------------------------------------------
| General API Limiter
|--------------------------------------------------------------------------
*/

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 500,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many requests. Please try again later.",
  },
});

/*
|--------------------------------------------------------------------------
| Login Limiter
|--------------------------------------------------------------------------
*/

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 5,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many login attempts. Try again in 15 minutes.",
  },
});

/*
|--------------------------------------------------------------------------
| OTP Limiter
|--------------------------------------------------------------------------
*/

export const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,

  max: 3,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many OTP requests. Try again later.",
  },
});