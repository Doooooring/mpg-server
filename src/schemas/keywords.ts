import mongoose from "mongoose";

const { Schema } = mongoose;
const {
  Types: { ObjectId },
} = Schema;

const keywordSchema = new Schema({
  keyword: String,
  category: String,
  news: {
    type: [ObjectId],
    ref: "News",
  },
});

export const Keywords = mongoose.model("Keywords", keywordSchema);
