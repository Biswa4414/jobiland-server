const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
require("dotenv").config();
const dbConnection = require("./database/dbConnection");
const { errorMiddleware } = require("./middlewares/error");

//IMPORT FILES
const userRouter = require("./routes/userRouter");
const jobRouter = require("./routes/jobRouter");
const applicationRouter = require("./routes/applicationRouter");

//MIDDLEWARE
app.use(cookieParser()); //to get cookie data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);
app.use(
  cors({
    origin: [process.env.CLIENT_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use("/api/user", userRouter);
app.use("/api/application", applicationRouter);
app.use("/api/job", jobRouter);

dbConnection();
//error middleware always used in last
app.get("/", (req, res) => {
  return res.send("Server");
});
app.use(errorMiddleware);

module.exports = app;
