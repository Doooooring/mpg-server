import mongoose from "mongoose";

const { Schema } = mongoose;

const voteSchema = new Schema(
  {
    user: { type: String, required: true },
    news: { type: String, required: true },
    response: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

export const Vote = mongoose.model("Vote", voteSchema);
