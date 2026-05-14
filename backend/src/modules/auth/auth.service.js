import User from "../users/user.model.js";

import AppError from "../../utils/errors/AppError.js";

import { hashPassword } from "../../utils/password.js";

import { sendSignupOTP } from "../otp/otp.service.js";
import { verifySignupOTP } from "../otp/otp.service.js";

import { verifyPassword } from "../../utils/password.js";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from "../../utils/token.js";

import { v7 as uuidv7 } from "uuid";

import { createSession, getSession, deleteSession } from "./session.service.js";

import { redisClient } from "../../config/redis.js";

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

  await sendSignupOTP(phone);

  return {
    success: true,
    message: "Account created successfully",
    userId: user._id,
  };
};


/*
|--------------------------------------------------------------------------
| Verify Signup OTP Service
|--------------------------------------------------------------------------
*/

export const verifySignupOTPService = async (payload) => {
  const { phone, otp } = payload;

  /*
  |--------------------------------------------------------------------------
  | Find User
  |--------------------------------------------------------------------------
  */

  const user = await User.findOne({ phone });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  /*
  |--------------------------------------------------------------------------
  | Verify OTP
  |--------------------------------------------------------------------------
  */

  await verifySignupOTP(phone, otp);

  /*
  |--------------------------------------------------------------------------
  | Activate User
  |--------------------------------------------------------------------------
  */

  user.isPhoneVerified = true;

  await user.save();

  return {
    success: true,
    message: "Phone number verified successfully",
  };
};


/*
|--------------------------------------------------------------------------
| Login Service
|--------------------------------------------------------------------------
*/

export const loginService = async (payload) => {
  const { username, password } = payload;

  /*
  |--------------------------------------------------------------------------
  | Normalize Username
  |--------------------------------------------------------------------------
  */

  const normalizedUsername = username.toLowerCase();

  /*
  |--------------------------------------------------------------------------
  | Find User
  |--------------------------------------------------------------------------
  */

  const user = await User.findOne({
    username: normalizedUsername,
  }).select("+passwordHash");

  /*
  |--------------------------------------------------------------------------
  | Invalid Credentials
  |--------------------------------------------------------------------------
  */

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  /*
  |--------------------------------------------------------------------------
  | Verify Password
  |--------------------------------------------------------------------------
  */

  const isPasswordValid = await verifyPassword(
    user.passwordHash,
    password
  );

  if (!isPasswordValid) {
    throw new AppError("Invalid credentials", 401);
  }

  /*
  |--------------------------------------------------------------------------
  | Check Phone Verification
  |--------------------------------------------------------------------------
  */

  if (!user.isPhoneVerified) {
    throw new AppError(
      "Please verify your phone number",
      403
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Check Account Status
  |--------------------------------------------------------------------------
  */

  if (!user.isActive) {
    throw new AppError(
      "Account has been disabled",
      403
    );
  }


  /*
|--------------------------------------------------------------------------
| Create Session ID
|--------------------------------------------------------------------------
*/

const sessionId = uuidv7();


await createSession({
  sessionId,
  userId: user._id,

  userAgent: "unknown",
  ipAddress: "unknown",
});


  /*
  |--------------------------------------------------------------------------
  | Generate Tokens
  |--------------------------------------------------------------------------
  */

  const accessToken = generateAccessToken({
    userId: user._id,
    role: user.role,
    sessionId,
  });

  const refreshToken = generateRefreshToken({
    userId: user._id,
    role: user.role,
    sessionId,
  });

  /*
  |--------------------------------------------------------------------------
  | Update Last Login
  |--------------------------------------------------------------------------
  */

  user.lastLoginAt = new Date();

  await user.save();

  /*
  |--------------------------------------------------------------------------
  | Response
  |--------------------------------------------------------------------------
  */

  return {
    success: true,
    message: "Login successful",

    data: {
      accessToken,
      refreshToken,

      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        role: user.role,
      },
    },
  };
};


/*
|--------------------------------------------------------------------------
| Refresh Access Token Service
|--------------------------------------------------------------------------
*/

export const refreshAccessTokenService = async (
  refreshToken
) => {
  /*
  |--------------------------------------------------------------------------
  | Verify Refresh Token
  |--------------------------------------------------------------------------
  */

  const decoded =
    verifyRefreshToken(refreshToken);

  /*
  |--------------------------------------------------------------------------
  | Check Session
  |--------------------------------------------------------------------------
  */

  const session = await getSession(
    decoded.sessionId
  );

  if (!session) {
    throw new AppError(
      "Session expired or invalid",
      401
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Generate New Access Token
  |--------------------------------------------------------------------------
  */

  const newAccessToken =
    generateAccessToken({
      userId: decoded.userId,
      role: decoded.role,
      sessionId: decoded.sessionId,
    });

  return {
    success: true,
    accessToken: newAccessToken,
  };
};


/*
|--------------------------------------------------------------------------
| Logout Service
|--------------------------------------------------------------------------
*/

export const logoutService = async (
  refreshToken
) => {
  /*
  |--------------------------------------------------------------------------
  | Verify Refresh Token
  |--------------------------------------------------------------------------
  */

  const decoded =
    verifyRefreshToken(refreshToken);

  /*
  |--------------------------------------------------------------------------
  | Delete Redis Session
  |--------------------------------------------------------------------------
  */

  await deleteSession(decoded.sessionId);

  return {
    success: true,
    message: "Logged out successfully",
  };
};


/*
|--------------------------------------------------------------------------
| Request CRM Login OTP Service
|--------------------------------------------------------------------------
*/

export const requestCRMLoginOTPService =
  async (payload) => {
    const { username, password } =
      payload;

    /*
    |--------------------------------------------------------------------------
    | Normalize Username
    |--------------------------------------------------------------------------
    */

    const normalizedUsername =
      username.toLowerCase();

    /*
    |--------------------------------------------------------------------------
    | Find User
    |--------------------------------------------------------------------------
    */

    const user = await User.findOne({
      username: normalizedUsername,
    }).select("+passwordHash");

    if (!user) {
      throw new AppError(
        "Invalid credentials",
        401
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Verify Role
    |--------------------------------------------------------------------------
    */

    if (user.role !== "crm") {
      throw new AppError(
        "Unauthorized role",
        403
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Verify Password
    |--------------------------------------------------------------------------
    */

    const isPasswordValid =
      await verifyPassword(
        user.passwordHash,
        password
      );

    if (!isPasswordValid) {
      throw new AppError(
        "Invalid credentials",
        401
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Phone Verification Check
    |--------------------------------------------------------------------------
    */

    if (!user.isPhoneVerified) {
      throw new AppError(
        "Phone number not verified",
        403
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Generate Login Challenge
    |--------------------------------------------------------------------------
    */

    const challengeId = uuidv4();

    /*
    |--------------------------------------------------------------------------
    | Store Challenge In Redis
    |--------------------------------------------------------------------------
    */

    await redisClient.set(
      `crm-login:${challengeId}`,
      JSON.stringify({
        userId: user._id,
      }),
      {
        EX: 300,
      }
    );

    /*
    |--------------------------------------------------------------------------
    | Send OTP
    |--------------------------------------------------------------------------
    */

    await sendSignupOTP(user.phone);

    return {
      success: true,
      message: "OTP sent successfully",
      challengeId,
    };
  };