import { ObjectId } from "mongoose";

export enum category {
  human = "인물",
  politics = "정치",
  policy = "정책 및 제도",
  economy = "경제",
  social = "사회",
  organizatioin = "단체",
  etc = "기타",
}
export interface KeywordInf {
  keyword: String;
  explain: String;
  category: String;
  recent: Boolean;
  news: Array<ObjectId>;
}
