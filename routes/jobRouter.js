const express = require("express");
const router = express.Router();
const { getAllJobs, postJob } = require("../controllers/jobController");
const isAuthenticated = require("../middlewares/auth");

router.get("/getjobs",isAuthenticated, getAllJobs);
router.post("/postjob", isAuthenticated, postJob);

module.exports = router;
