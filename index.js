const express = require("express");
const fileUpload = require('express-fileupload');
const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`server up and running at  ${PORT}`));

const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

//IMPORT ROUTES
const authRoute = require("./routes/auth/auth");
const authDashboard = require("./routes/auth/authDashboard");
const imageRoute = require("./routes/image");

//ACCESSING THE ENVIRONMENT VARIABLES
dotenv.config();

//CONNECTION TO DATABASE
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("connected to db  ")
);

//MIDDLEWARE -> DISALBING CORS AND USED FOR JSON OUTPUT
app.use(express.json(), cors());

//MIDDLEWARE -> FILE UPLOAD 
app.use(fileUpload());

// IMAGE FOLDER
app.use("/images", express.static('images'));

//ROUTE MIDDLEWARE
app.use("/api/users", authRoute);
app.use("/api/dashboard", authDashboard);
app.use("/api/upload", imageRoute);
