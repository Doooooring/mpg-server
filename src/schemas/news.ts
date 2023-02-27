import mongoose from "mongoose";
import { NewsInf } from "../interface/news";

const { Schema } = mongoose;
const newsSchema = new Schema<NewsInf>(
  {
    order: { type: Number, require: true, unique: true },
    title: { type: String, require: true },
    summary: { type: String, require: true },
    news: {
      type: [{ date: String, title: String, link: String }],
      require: true,
    },
    journals: {
      type: [{ press: String, title: String, link: String }],
      require: true,
    },
    keywords: { type: [String], require: true },
    state: { type: Boolean, require: true },
    opinions: {
      type: {
        left: String,
        right: String,
      },
      require: true,
    },
    votes: {
      type: {
        left: Number,
        right: Number,
        none: Number,
      },
      default: {
        left: 1,
        right: 1,
        none: 1,
      },
    },
  },
  {
    versionKey: false,
  }
);

export const News = mongoose.model<NewsInf>("News", newsSchema);



