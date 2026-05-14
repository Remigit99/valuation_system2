

const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;

  let message = err.message || "Internal Server Error";

  /*
  |--------------------------------------------------------------------------
  | Mongoose Bad ObjectId
  |--------------------------------------------------------------------------
  */

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource ID";
  }

  /*
  |--------------------------------------------------------------------------
  | Mongoose Duplicate Key Error
  |--------------------------------------------------------------------------
  */

  if (err.code === 11000) {
    statusCode = 409;
    message = "Duplicate field value entered";
  }

  /*
  |--------------------------------------------------------------------------
  | JWT Errors
  |--------------------------------------------------------------------------
  */

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  /*
  |--------------------------------------------------------------------------
  | Final Error Response
  |--------------------------------------------------------------------------
  */

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
};

export default errorMiddleware;