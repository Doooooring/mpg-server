import { ObjectId } from "mongoose";

export enum categories {}

export interface KeywordInf {
  keyword: String;
  explain: String;
  category: String;
  recent: Boolean;
  news: Array<ObjectId>;
}
