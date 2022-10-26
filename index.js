const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
const orderRoute = require("./routes/order");
const logger = require("./utils/logger");

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Routes

app.use("/api/order", orderRoute);

//connect db
mongoose.connect(process.env.DB_CONNECTION);
let db = mongoose.connection;
db.on("error", logger.error.bind(logger, "MongoDB connection error:"));
db.once("open", () => {
  logger.info("Connected to MongoDB");
});

//listening port
app.listen(process.env.PORT_SERVER, () => {
  logger.info(`Server running on port ${process.env.PORT_SERVER}`);
});

module.exports = app;
