import express from "express";

import { protect, authorizedRoles } from "../../middleware/authMiddleware.js";

import {
  signupController,
  verifySignupOTPController,
  loginController,
  refreshAccessTokenController,
  logoutController,
  verifyCRMLoginOTPController,
  requestCRMLoginOTPController,
} from "./auth.controller.js";

import {
  generateTOTPSetupController,
  verifyTOTPSetupController,
} from "./auth.controller.js";

const router = express.Router();

/*
|-------------
| Auth Routes
|-------------
*/

// SIGNUP CONTROLLER
router.post("/signup", signupController);

// VERIFY SIGNUP OTP CONTROLLER
router.post("/verify-signup-otp", verifySignupOTPController);

// LOGIN CONTROLLER
router.post("/login", loginController);

// REFRESH ACCESS TOKEN CONTROLLER
router.post("/refresh-access-token", refreshAccessTokenController);

// LOGOUT CONTROLLER
router.post("/logout", logoutController);

// VERIFY CRM LOGIN OTP CONTROLLER
router.post("/verify-crm-login-otp", verifyCRMLoginOTPController);

// REQUEST CRM LOGIN OTP CONTROLLER
router.post("/request-crm-login-otp", requestCRMLoginOTPController);

// GENERATE TOTP SETUP CONTROLLER
router.post(
  "/totp/setup",
  protect,
  authorizedRoles("crm", "admin"),
  generateTOTPSetupController,
);

// VERIFY TOTP SETUP CONTROLLER
router.post(
  "/totp/verify-setup",
  protect,
  authorizedRoles("crm", "admin"),
  verifyTOTPSetupController,
);
export default router;
