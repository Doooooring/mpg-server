const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

const connectMongoose = () => {
  mongoose.connect("mongodb://localhost:27017/ddog", (error: Error) => {
    if (error) {
      console.log("아");
    } else {
      console.log("good");
    }
  });
};

export const Connect = connectMongoose;
