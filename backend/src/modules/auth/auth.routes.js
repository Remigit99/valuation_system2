import express from "express";


import {
  signupController,
  verifySignupOTPController,
  loginController,
  refreshAccessTokenController,
  logoutController
} from "./auth.controller.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
*/

router.post("/signup", signupController);
router.post("/verify-signup-otp", verifySignupOTPController);
router.post("/login", loginController);
router.post("/refresh-access-token", refreshAccessTokenController);
router.post("/logout", logoutController);
export default router;