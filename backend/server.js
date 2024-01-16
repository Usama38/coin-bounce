const express = require("express");

const dbConnect = require("./Database/index.js");

const { PORT } = require("./config/index");

const router = require("./routes/index");

const errorHandler = require("./middlewares/errorHandler");

const cookieParser = require("cookie-parser");

const cors = require("cors");

// const corsOptions = {
//   //we set cors cofig here bcz we have separte indeoendent frontend and backend
//   credentials: true,
//   origin: ["http://localhost:3001"],
// };
const corsOptions = {
  credentials: true,
  origin: ["http://localhost:3000"],
};
const app = express();

app.use(cookieParser());

app.use(cors(corsOptions));

app.use(express.json()); //allow to our application that can use data as json for communicate

app.use(router);

dbConnect();

app.use("/storage/", express.static("storage")); //to visualize the png image in browser

app.use(errorHandler);

app.listen(5000, console.log(`Backend is runnning on port: ${PORT}`));
