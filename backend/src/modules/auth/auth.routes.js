import express from "express";

import { signupController } from "./auth.controller.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
*/

router.post("/signup", signupController);

export default router;