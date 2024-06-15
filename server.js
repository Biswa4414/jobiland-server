const app = require("./app");
require("dotenv").config();

const PORT = process.env.PORT;
const cloudinary = require("cloudinary");
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret_key: process.env.CLOUDINARY_CLIENT_SECRET,
});

//LISTENING
app.listen(PORT, () => {
  console.log(`listening to PORT:${PORT}`);
});
