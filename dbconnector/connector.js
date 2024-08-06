const mongoose = require("mongoose");

const DB_URL = process.env.DB_URL;

const connect = () => {
  return mongoose.connect(DB_URL);
};

module.exports = {
  connect,
};
