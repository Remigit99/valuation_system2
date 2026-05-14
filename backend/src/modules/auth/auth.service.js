import User from "../users/user.model.js";

import AppError from "../../utils/errors/AppError.js";

import { hashPassword } from "../../utils/password.js";

/*
|--------------------------------------------------------------------------
| Signup Service
|--------------------------------------------------------------------------
*/

export const signupService = async (payload) => {
  const {
    firstName,
    lastName,
    username,
    phone,
    password,
  } = payload;

  /*
  |--------------------------------------------------------------------------
  | Normalize Username
  |--------------------------------------------------------------------------
  */

  const normalizedUsername = username.toLowerCase();

  /*
  |--------------------------------------------------------------------------
  | Check Existing Username
  |--------------------------------------------------------------------------
  */

  const existingUsername = await User.findOne({
    username: normalizedUsername,
  });

  if (existingUsername) {
    throw new AppError("Username already exists", 409);
  }

  /*
  |--------------------------------------------------------------------------
  | Check Existing Phone Number
  |--------------------------------------------------------------------------
  */

  const existingPhone = await User.findOne({
    phone,
  });

  if (existingPhone) {
    throw new AppError("Phone number already exists", 409);
  }

  /*
  |--------------------------------------------------------------------------
  | Hash Password
  |--------------------------------------------------------------------------
  */

  const passwordHash = await hashPassword(password);

  /*
  |--------------------------------------------------------------------------
  | Create User
  |--------------------------------------------------------------------------
  */

  const user = await User.create({
    firstName,
    lastName,
    username: normalizedUsername,
    phone,
    passwordHash,
  });

  return {
    success: true,
    message: "Account created successfully",
    userId: user._id,
  };
};