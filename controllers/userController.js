const bcrypt = require("bcrypt");
const User = require("../models/userSchema");
const { ErrorHandler } = require("../middlewares/error");
const sendToken = require("../utils/jwtToken");
const catchASyncErrors = require("../middlewares/catchAsyncErrors");

//REGISTER ROUTER
const register = catchASyncErrors(async (req, res, next) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !phone || !password || !role) {
      return next(new ErrorHandler("Missing Credentials"));
    }

    //email and usernames are unique
    const userEmailsExist = await User.findOne({ email: email });

    if (userEmailsExist) {
      return next(new ErrorHandler("Email already exist"));
    }

    const isUserPhoneExist = await User.findOne({ phone });
    if (isUserPhoneExist) {
      return next(new ErrorHandler("Phone Number already exist"));
    }

    //hashing the password

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT)
    );

    //store data in DB
    const userObj = new User({
      //schema key : value
      name: name,
      email: email,
      phone: phone,
      password: hashedPassword,
      role: role,
    });
    const user = await userObj.save();
    sendToken(user, 201, res, "Register Successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

//LOGIN ROUTER
const login = catchASyncErrors(async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return next(new ErrorHandler("Missing Credentials"));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandler("Email Doesn't Exist", 400));
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid Password", 400));
    }
    if (user.role !== role) {
      return next(new ErrorHandler("Role not found", 404));
    }
    sendToken(user, 201, res, "Login Successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

//LOGOUT ROUTER
const logout = catchASyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("Token", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Logout Successfully",
    });
});

//GET USER ROUTER
const getUser = catchASyncErrors((req, res, next) => {
  try {
    const user = req.user;
    console.log(user);

    if (!user) {
      return next(new ErrorHandler("User not found in request"));
    }

    // Extract necessary fields to avoid circular structure
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    console.log(userResponse);
    res.send({
      status: 200,
      user: userResponse,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: 500,
      error: "DB error",
    });
  }
});

module.exports = { register, login, logout, getUser };
