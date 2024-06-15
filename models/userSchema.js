const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const jwt = require("jsonwebtoken");

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please enter your Name"],
    minLength: [3, "Name must contain at least 3 Characters"],
    maxLength: [30, "Name can't exceed 30 Characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter your Email"],
    validate: [validator.isEmail, "Please enter a valid Email"],
    unique: true,
  },
  phone: {
    type: String,
    required: [true, "Please enter your Phone Number"],
    minLength: [10, "Phone Number must contain at least 10 Numbers"],
    maxLength: [30, "Phone Number must contain at least 10 Numbers"],
  },
  password: {
    type: String,
    required: [true, "Please enter your Password"],
    minLength: [6, "Password must contain at least 6 characters!"],
    maxLength: [60, "Password cannot exceed 60 characters!"],
    select: false,
  },
  role: {
    type: String,
    required: [true, "Please select a role"],
    enum: ["Job Seeker", "Employer"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = mongoose.model("User", userSchema);
