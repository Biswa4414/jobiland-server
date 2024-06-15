const jwt = require("jsonwebtoken");
const catchAsyncError = require("./catchAsyncErrors.js");
const { ErrorHandler } = require("./error.js");
const User = require("../models/userSchema.js");

const isAuthenticated = catchAsyncError((req, res, next) => {
  const { Token } = req.cookies; //we get token from cookies
  const token = Token;
  // console.log(req.cookies);
  if (!token) {
    return next(new ErrorHandler("User Not Authorized", 401));
  } else {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = User.findById(decoded.id);
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }
      req.user = user;
      //If the token is successfully decoded, it extracts the user ID
      next();
    } catch (error) {
      console.log("bye");
      return next(new ErrorHandler("Token is invalid: " + error.message, 401));
    }
  }
});

module.exports = isAuthenticated;
