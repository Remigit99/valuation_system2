import asyncHandler from "../../utils/errors/asyncHandler.js";

import { signupSchema, verifySignupOTPSchema, loginSchema } from "../users/user.validation.js";



import {
  signupService,
  verifySignupOTPService,
  loginService,
  refreshAccessTokenService
} from "./auth.service.js";

/*
|--------------------------------------------------------------------------
| Signup Controller
|--------------------------------------------------------------------------
*/

export const signupController = asyncHandler(async (req, res) => {
  /*
  |--------------------------------------------------------------------------
  | Validate Request Body
  |--------------------------------------------------------------------------
  */

  const validatedData = signupSchema.parse(req.body);

  /*
  |--------------------------------------------------------------------------
  | Create User
  |--------------------------------------------------------------------------
  */

  const result = await signupService(validatedData);

  /*
  |--------------------------------------------------------------------------
  | Response
  |--------------------------------------------------------------------------
  */

  res.status(201).json(result);
});


/*
|--------------------------------------------------------------------------
| Verify Signup OTP Controller
|--------------------------------------------------------------------------
*/

export const verifySignupOTPController = asyncHandler(
  async (req, res) => {
    /*
    |--------------------------------------------------------------------------
    | Validate Request Body
    |--------------------------------------------------------------------------
    */

    const validatedData =
      verifySignupOTPSchema.parse(req.body);

    /*
    |--------------------------------------------------------------------------
    | Verify OTP
    |--------------------------------------------------------------------------
    */

    const result =
      await verifySignupOTPService(validatedData);

    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

    res.status(200).json(result);
  }
);


/*
|--------------------------------------------------------------------------
| Login Controller
|--------------------------------------------------------------------------
*/

export const loginController = asyncHandler(
  async (req, res) => {
    /*
    |--------------------------------------------------------------------------
    | Validate Request Body
    |--------------------------------------------------------------------------
    */

    const validatedData = loginSchema.parse(req.body);

    /*
    |--------------------------------------------------------------------------
    | Login
    |--------------------------------------------------------------------------
    */

    const result = await loginService(validatedData);

    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

    res.status(200).json(result);
  }
);

/*
|--------------------------------------------------------------------------
| Refresh Access Token Controller
|--------------------------------------------------------------------------
*/

export const refreshAccessTokenController =
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError(
        "Refresh token is required",
        400
      );
    }

    const result =
      await refreshAccessTokenService(
        refreshToken
      );

    res.status(200).json(result);
  });