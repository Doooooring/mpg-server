import mongoose from "mongoose";

const { Schema } = mongoose;

const voteSchema = new Schema(
  {
    user: { type: String, required: true },
    vote: {
      type: Array<{
        news: String;
        response: String;
      }>,
      default: [],
    },
  },
  {
    versionKey: false,
  }
);

export const Vote = mongoose.model("Vote", voteSchema);
