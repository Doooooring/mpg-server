import mongoose from "mongoose";
import { NewsInf, commentType } from "../interface/news";

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
    comments: {
      type: {
        [commentType.감시자]: [
          {
            title: String,
            comment: String,
          },
        ],
        [commentType.개혁가]: [
          {
            title: String,
            comment: String,
          },
        ],
        [commentType.공화주의자]: [
          {
            title: String,
            comment: String,
          },
        ],
        [commentType.관찰자]: [
          {
            title: String,
            comment: String,
          },
        ],
        [commentType.국민의힘]: [
          {
            title: String,
            comment: String,
          },
        ],
        [commentType.민주당]: [
          {
            title: String,
            comment: String,
          },
        ],
        [commentType.예술가]: [
          {
            title: String,
            comment: String,
          },
        ],
        [commentType.운영자]: [
          {
            title: String,
            comment: String,
          },
        ],
        [commentType.이론가]: [
          {
            title: String,
            comment: String,
          },
        ],

        [commentType.자유주의자]: [
          {
            title: String,
            comment: String,
          },
        ],
        [commentType.지도자]: [
          {
            title: String,
            comment: String,
          },
        ],
        [commentType.전략가]: [
          {
            title: String,
            comment: String,
          },
        ],
        [commentType.청와대]: [
          {
            title: String,
            comment: String,
          },
        ],
      },
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
