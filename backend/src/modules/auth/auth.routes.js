import express from "express";


import {
  signupController,
  verifySignupOTPController,
  loginController
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
export default router;