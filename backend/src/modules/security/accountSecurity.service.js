import { createAuditLog } from "../audit/audit.service";

const MAX_FAILED_ATTEMPTS = 5;

const LOCK_DURATION_MS = 15 * 60 * 1000;

/*
|--------------------
| Check Account Lock
|--------------------
*/

export const checkAccountLock = (user) => {
  if (user.lockUntil && user.lockUntil > Date.now()) {
    const minutesRemaining = Math.ceil(
      (user.lockUntil - Date.now()) / (1000 * 60),
    );

    return {
      locked: true,
      minutesRemaining,
    };
  }

  return {
    locked: false,
  };
};

/*
|---------------------
| Handle Failed Login
|---------------------
*/

export const handleFailedLogin = async (user) => {
  user.failedLoginAttempts += 1;

  /*
  |--------------
  | Lock Account
  |--------------
  */

  if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
    user.lockUntil = new Date(Date.now() + LOCK_DURATION_MS);

    await createAuditLog({
      userId: user._id,

      action: "ACCOUNT_LOCKED",

      status: "FAILED",

      metadata: {
        reason: "Too many failed login attempts",
      },
    });
  }

  await user.save();
};

/*
|--------------------------------------------------------------------------
| Reset Login State
|--------------------------------------------------------------------------
*/

export const resetLoginState = async (user) => {
  user.failedLoginAttempts = 0;

  user.lockUntil = null;

  await user.save();
};

/*
|--------------------
| Progressive Delay
|--------------------
*/

export const applyProgressiveDelay = async (attempts) => {
  /*
  |------------------------
  | Cap delay at 8 seconds
  |------------------------
  */

  const delaySeconds = Math.min(Math.pow(2, Math.max(attempts - 1, 0)), 8);

  await new Promise((resolve) => setTimeout(resolve, delaySeconds * 1000));
};
