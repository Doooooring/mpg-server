import { ObjectId } from "mongoose";

export enum categories {
  human = "인물",
  politics = "정치",
  policy = "정책",
  economy = "경제",
}

export interface KeywordInf {
  keyword: String;
  explain: String;
  category: String;
  recent: Boolean;
  news: Array<ObjectId>;
}
