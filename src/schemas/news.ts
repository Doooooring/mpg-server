import mongoose from "mongoose";
import { NewsInf } from "../interface/news";

const { Schema } = mongoose;

const newsSchema = new Schema<NewsInf>(
  {
    order: { type: Number, require: true, unique: true },
    title: { type: String, require: true },
    summary: { type: String, require: true },
    keywords: { type: [String], require: true },
    state: { type: Boolean, require: true },
    isPublished: {
      type: Boolean,
      require: true,
    },
    opinions: {
      type: {
        left: String,
        right: String,
      },
      require: true,
    },
    timeline: {
      type: [{ date: String, title: String }],
    },
    comments: {
      type: {},
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

newsSchema.virtual("lastTimelineDate").get(function () {
  const lastTimelineEntry = this.timeline[this.timeline.length - 1] as {
    date: String;
    title: String;
  };
  return lastTimelineEntry ? lastTimelineEntry.date : "0000.00";
});

newsSchema.index({});

export const News = mongoose.model<NewsInf>("News", newsSchema);
