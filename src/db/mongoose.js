const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/progressPoint", {
  useNewUrlParser: true,
  useCreateIndex: true,
});
// "mongodb://127.0.0.1:27017/progressPoint"
//mongodb://localhost:27017/progressPoint
