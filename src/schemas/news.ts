import mongoose from "mongoose";
import { NewsInf } from "../interface/news";

const { Schema } = mongoose;
const newsSchema = new Schema<NewsInf>({
  order: { type: Number, require: true, unique: true },
  title: { type: String, require: true },
  summary: { type: String, require: true },
  news: { type: [{ date: Date, title: String, link: String }], require: true },
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
    },
    require: true,
  },
});

export const News = mongoose.model<NewsInf>("News", newsSchema);
