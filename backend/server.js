const express = require("express");

const dbConnect = require("./Database/index.js");

const { PORT } = require("./config/index");

const router = require("./routes/index");

const errorHandler = require("./middlewares/errorHandler");

const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());

app.use(express.json()); //allow to our application that can use data as json for communicate

app.use(router);

dbConnect();

app.use("/storage/", express.static("storage"));  //to visualize the png image in browser

app.use(errorHandler);

app.listen(5000, console.log(`Backend is runnning on port: ${PORT}`));
