import asyncHandler from "../../utils/errors/asyncHandler.js";

import { signupSchema } from "../users/user.validation.js";

import { signupService } from "./auth.service.js";

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