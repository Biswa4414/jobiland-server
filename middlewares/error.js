//CREATING ERROR HANDLER CLASS
class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// ERROR-MIDDLEWARE FUNC
const errorMiddleware = (err, req, res, next) => {
  //This line checks if the error object has a msg or statusCode
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  if (err.name === "CastError") {
    const message = `Resource not found. Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  if (err.code === 11000) {
    const message = `Duplicate${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  if (err.name === "JsonWebTokenError") {
    const message = `JWT is Invalid,Try Again`;
    err = new ErrorHandler(message, 400);
  }

  if (err.name === "TokenExpiredError") {
    const message = `JWT is expired,Try Again`;
    err = new ErrorHandler(message, 400);
  }
  return res.send({
    status: err.statusCode,
    success: false,
    message: err.message,
  });
};

module.exports = { ErrorHandler, errorMiddleware };

