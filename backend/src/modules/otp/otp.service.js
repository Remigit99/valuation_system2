import crypto from "crypto";

import { redisClient } from "../../config/redis.js";

import AppError from "../../utils/errors/AppError.js";

/*
|--------------------------------------------------------------------------
| OTP Configuration
|--------------------------------------------------------------------------
*/

const OTP_EXPIRATION_SECONDS = 300;

const OTP_RESEND_COOLDOWN_SECONDS = 60;

/*
|--------------------------------------------------------------------------
| Generate Numeric OTP
|--------------------------------------------------------------------------
*/

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/*
|--------------------------------------------------------------------------
| Hash OTP
|--------------------------------------------------------------------------
*/

const hashOTP = (otp) => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};

/*
|--------------------------------------------------------------------------
| Send Signup OTP
|--------------------------------------------------------------------------
*/

export const sendSignupOTP = async (phone) => {
  /*
  |--------------------------------------------------------------------------
  | Cooldown Check
  |--------------------------------------------------------------------------
  */

  const cooldownKey = `otp:cooldown:${phone}`;

  const existingCooldown = await redisClient.get(cooldownKey);

  if (existingCooldown) {
    throw new AppError(
      "Please wait before requesting another OTP",
      429
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Generate OTP
  |--------------------------------------------------------------------------
  */

  const otp = generateOTP();

  const hashedOTP = hashOTP(otp);

  /*
  |--------------------------------------------------------------------------
  | Redis Keys
  |--------------------------------------------------------------------------
  */

  const otpKey = `otp:signup:${phone}`;

  /*
  |--------------------------------------------------------------------------
  | Store OTP Hash
  |--------------------------------------------------------------------------
  */

  await redisClient.set(otpKey, hashedOTP, {
    EX: OTP_EXPIRATION_SECONDS,
  });

  /*
  |--------------------------------------------------------------------------
  | Store Cooldown
  |--------------------------------------------------------------------------
  */

  await redisClient.set(cooldownKey, "true", {
    EX: OTP_RESEND_COOLDOWN_SECONDS,
  });

  /*
  |--------------------------------------------------------------------------
  | Send SMS (TEMPORARY)
  |--------------------------------------------------------------------------
  */

  console.log(`📱 OTP for ${phone}: ${otp}`);

  return {
    success: true,
    message: "OTP sent successfully",
  };
};


export const verifySignupOTP = async (phone, otp) => {
  /*
  |--------------------------------------------------------------------------
  | Redis Key
  |--------------------------------------------------------------------------
  */

  const otpKey = `otp:signup:${phone}`;

  /*
  |--------------------------------------------------------------------------
  | Get Stored OTP Hash
  |--------------------------------------------------------------------------
  */

  const storedOTPHash = await redisClient.get(otpKey);

  if (!storedOTPHash) {
    throw new AppError("OTP expired or invalid", 400);
  }

  /*
  |--------------------------------------------------------------------------
  | Compare OTP
  |--------------------------------------------------------------------------
  */

  const hashedOTP = hashOTP(otp);

  if (hashedOTP !== storedOTPHash) {
    throw new AppError("Invalid OTP", 400);
  }

  /*
  |--------------------------------------------------------------------------
  | Delete OTP After Verification
  |--------------------------------------------------------------------------
  */

  await redisClient.del(otpKey);

  return true;
};