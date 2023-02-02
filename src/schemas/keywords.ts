import mongoose from "mongoose";

const { Schema } = mongoose;
const {
  Types: { ObjectId },
} = Schema;

const keywordSchema = new Schema(
  {
    keyword: { type: String, required: true },
    explain: { type: String, required: true },
    category: { type: String, required: true },
    recent: { type: Boolean, required: true },
    news: { type: [String] },
  },
  {
    versionKey: false,
  }
);

export const Keywords = mongoose.model("Keywords", keywordSchema);
