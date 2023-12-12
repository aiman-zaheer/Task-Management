const mongoose = require("mongoose");

// Define environment variables
const dotenv = require("dotenv");
dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
const connection = () =>
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log("Database Connected......"))
    .catch((error) => console.log("Fail Connection....", error));

module.exports = connection;