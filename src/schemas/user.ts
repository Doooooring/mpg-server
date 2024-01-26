import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    platform: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

export const User = mongoose.model("User", userSchema);
