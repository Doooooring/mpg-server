const mongoose = require("mongoose");

const connectMongoose = () => {
  mongoose.connect("mongodb://localhost:27017/ddog", (error: Error) => {
    if (error) {
      console.log("아");
    } else {
      console.log("good");
    }
  });
};

module.exports = connectMongoose;
