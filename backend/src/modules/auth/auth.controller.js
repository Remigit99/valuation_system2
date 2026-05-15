import asyncHandler from "../../utils/errors/asyncHandler.js";

import {
  signupSchema,
  verifySignupOTPSchema,
  loginSchema,
} from "../users/user.validation.js";

import {
  signupService,
  verifySignupOTPService,
  loginService,
  refreshAccessTokenService,
  logoutService,
  verifyCRMLoginOTPService,
  requestCRMLoginOTPService
} from "./auth.service.js";

import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} from "../../utils/cookies.js";


import { generateTOTPSetup, verifyTOTPSetup } from "../otp/otp.service.js";



/*
|-------------------
| Signup Controller
|-------------------
*/

export const signupController = asyncHandler(async (req, res) => {
  /*
  |-----------------------
  | Validate Request Body
  |-----------------------
  */

  const validatedData = signupSchema.parse(req.body);

  /*
  |-------------
  | Create User
  |-------------
  */

  const result = await signupService(validatedData);

  /*
  |----------
  | Response
  |----------
  */

  res.status(201).json(result);
});



/*
|------------------------------
| Verify Signup OTP Controller
|------------------------------
*/

export const verifySignupOTPController = asyncHandler(async (req, res) => {
  /*
    |-----------------------
    | Validate Request Body
    |-----------------------
    */

  const validatedData = verifySignupOTPSchema.parse(req.body);

  /*
    |------------
    | Verify OTP
    |------------
    */

  const result = await verifySignupOTPService(validatedData);

  /*
    |----------
    | Response
    |----------
    */

  res.status(200).json(result);
});



/*
|------------------
| Login Controller
|------------------
*/

export const loginController = asyncHandler(async (req, res) => {
  /*
    |-----------------------
    | Validate Request Body
    |-----------------------
    */

  const validatedData = loginSchema.parse(req.body);

  /*
    |-------
    | Login
    |-------
    */

  const result = await loginService(validatedData);

  /*
    |----------
    | Response
    |----------
    */

  res
    .cookie("accessToken", result.data.accessToken, accessTokenCookieOptions)
    .cookie("refreshToken", result.data.refreshToken, refreshTokenCookieOptions)
    .status(200)
    .json({
      success: true,
      message: result.message,

      data: {
        user: result.data.user,
      },
    });
});



/*
|---------------------------------
| Refresh Access Token Controller
|---------------------------------
*/

export const refreshAccessTokenController = asyncHandler(async (req, res) => {
  const refreshToken  = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new AppError("Refresh token is required", 400);
  }

  const result = await refreshAccessTokenService(refreshToken);

  res
  .cookie(
    "accessToken",
    result.accessToken,
    accessTokenCookieOptions
  )
  .status(200)
  .json({
    success: true,
    message: "Access token refreshed",
  });
});

/*
|--------------------
| Logout Controller
|--------------------
*/

export const logoutController = asyncHandler(async (req, res) => {
  const refreshToken  = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new AppError("Refresh token is required", 400);
  }

  const result = await logoutService(refreshToken);

  res
  .clearCookie("accessToken")
  .clearCookie("refreshToken")
  .status(200)
  .json(result);
});

/*
|---------------------------------
| Verify CRM Login OTP Controller
|---------------------------------
*/

export const verifyCRMLoginOTPController =
  asyncHandler(async (req, res) => {
    /*
    |-----------------------
    | Validate Request Body
    |-----------------------
    */

    const validatedData =
      verifyCRMLoginOTPSchema.parse(
        req.body
      );

    /*
    |------------------
    | Verify Login OTP
    |------------------
    */

    const result =
      await verifyCRMLoginOTPService(
        validatedData
      );

    /*
    |--------------------
    | Set Secure Cookies
    |--------------------
    */

    res
      .cookie(
        "accessToken",
        result.data.accessToken,
        accessTokenCookieOptions
      )
      .cookie(
        "refreshToken",
        result.data.refreshToken,
        refreshTokenCookieOptions
      )
      .status(200)
      .json({
        success: true,
        message: result.message,

        data: {
          user: result.data.user,
        },
      });
  });

  /*
|----------------------------------
| Request CRM Login OTP Controller
|----------------------------------
*/

export const requestCRMLoginOTPController =
  asyncHandler(async (req, res) => {
    /*
    |------------------------
    | Validate Request Body
    |------------------------
    */

    const validatedData =
      requestCRMLoginOTPSchema.parse(
        req.body
      );

    /*
    |-------------
    | Request OTP
    |-------------
    */

    const result =
      await requestCRMLoginOTPService(
        validatedData
      );

    res.status(200).json(result);
  });


  /*
|--------------------------------
| Generate TOTP Setup Controller
|--------------------------------
*/

export const generateTOTPSetupController =
  asyncHandler(async (req, res) => {
    const result =
      await generateTOTPSetup(
        req.user
      );

    res.status(200).json(result);
  });



  /*
|------------------------------
| Verify TOTP Setup Controller
|------------------------------
*/

export const verifyTOTPSetupController =
  asyncHandler(async (req, res) => {
    const { token } = req.body;

    const result =
      await verifyTOTPSetup({
        user: req.user,
        token,
      });

    res.status(200).json(result);
  });



