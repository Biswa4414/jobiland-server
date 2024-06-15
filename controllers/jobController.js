const catchASyncErrors = require("../middlewares/catchAsyncErrors");
const { ErrorHandler } = require("../middlewares/error");
const Job = require("../models/jobSchema");
const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");


//GET JOB ROUTE
const getAllJobs = catchASyncErrors(async (req, res, next) => {
  try {
    const jobs = await Job.find({ expired: false });
    return res.send({
      status: 200,
      success: true,
      data: jobs,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Database Loading Error", 500));
  }
});

//POST JOB ROUTE
const postJob = catchASyncErrors(async (req, res, next) => {
  // const { Token } = req.cookies; //we get token from cookies
  // const token = Token;
  // const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  // const role = User.findById(decoded.role);

  // console.log(role);
 
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  }

  const {
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo,
  } = req.body;

  if (!title || !description || !category || !country || !city || !location) {
    return next(new ErrorHandler("Missing Credentials", 400));
  }

  if ((!salaryFrom || !salaryTo) && !fixedSalary) {
    return next(
      new ErrorHandler(
        "Please either provide fixed salary or ranged salary.",
        400
      )
    );
  }

  if (salaryFrom && salaryTo && fixedSalary) {
    return next(
      new ErrorHandler("Cannot Enter Fixed and Ranged Salary together.", 400)
    );
  }

  const postedBy = req.user._id;
  const jobObj = new Job({
    title: title,
    description: description,
    category: category,
    country: country,
    city: city,
    location: location,
    fixedSalary: fixedSalary,
    salaryFrom: salaryFrom,
    salaryTo: salaryTo,
    postedBy: postedBy,
  });
  const job = await jobObj.save();
  return res.send({
    status: 200,
    success: true,
    message: "Job Posted Successfully",
  });
});

//MY JOB ROUTE
const getMyJobs = catchASyncErrors(async (req, res, next) => {
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  }

  const myJobs = await Job.find({ postedBy: req.user._id });
  res.status(200).json({
    success: true,
    myJobs,
  });
});

module.exports = { getAllJobs, postJob, getMyJobs };
