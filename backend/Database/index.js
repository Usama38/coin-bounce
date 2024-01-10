const mongoose = require("mongoose");

const { MONGO_DB_CONNECTION_STRING } = require("../config/index");

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(MONGO_DB_CONNECTION_STRING);
    console.log(`Database coonect to host: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error in db: ${error}`);
  }
};

module.exports = dbConnect;
