import { Types } from "mongoose";

export interface NewsInf {
  order: Number;
  title: String;
  summary: String;
  news: Array<{ date: Date; title: String; link: String }>;
  journals: Array<{ press: String; title: String; link: String }>;
  keywords: Array<String>;
  state: Boolean;
  opinions: {
    left: String;
    right: String;
  };
  votes: {
    left: Number;
    right: Number;
  };
}
