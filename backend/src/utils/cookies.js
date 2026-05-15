import env from "../config/env.js";

/*
|----------------
| Cookie Options
|----------------
*/

const baseCookieOptions = {
  httpOnly: true,

  secure: env.NODE_ENV === "production",

  sameSite: "strict",
};

/*
|---------------------
| Access Token Cookie
|---------------------
*/

export const accessTokenCookieOptions = {
  ...baseCookieOptions,

  maxAge: 1000 * 60 * 15,
};

/*
|----------------------
| Refresh Token Cookie
|----------------------
*/

export const refreshTokenCookieOptions = {
  ...baseCookieOptions,

  maxAge: 1000 * 60 * 60 * 24 * 7,
};