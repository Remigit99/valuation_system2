import jwt from "jsonwebtoken";
import env from "../config/env.js";
import User from "../modules/users/user.model.js";
import asyncHandler from "../utils/errors/asyncHandler.js";
import AppError from "../utils/errors/AppError.js";

/*
|--------------------
| Protect Middleware
|--------------------
*/

export const protect = asyncHandler(
  async (req, res, next) => {
    let token;

    /*
    |----------------------
    | Extract Bearer Token
    |----------------------
    */

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    /*
    |----------
    | No Token
    |----------
    */

    if (!token) {
      throw new AppError("Not authorized", 401);
    }

    /*
    |--------------
    | Verify Token
    |--------------
    */

    const decoded = jwt.verify(
      token,
      env.JWT_ACCESS_SECRET
    );

    /*
    |-----------
    | Find User
    |-----------
    */

    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new AppError("User no longer exists", 401);
    }

    /*
    |---------------
    | Inactive User
    |--------------
    */

    if (!user.isActive) {
      throw new AppError(
        "Account has been disabled",
        403
      );
    }

    /*
    |------------------------
    | Attach User To Request
    |------------------------
    */

    req.user = user;
    next();
  }
);


/*
|-------------------------------
| Role Authorization Middleware
|-------------------------------
*/

export const authorizedRoles = (...roles) => {
  return (req, res, next) => {
    /*
    |-----------------
    | Check User Role
    |-----------------
    */

    if (!roles.includes(req.user.role)) {
      throw new AppError(
        "You do not have permission to perform this action",
        403
      );
    }

    next();
  };
};