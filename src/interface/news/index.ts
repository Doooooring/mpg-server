import { Types } from "mongoose";

export interface NewsInf {
  _id: Types.ObjectId;
  order: number;
  title: string;
  summary: string;
  news: Array<{ date: Date; title: string; link: string }>;
  journals: Array<{ press: string; title: string; link: string }>;
  keywords: Array<string>;
  state: Boolean;
  opinions: {
    left: string;
    right: string;
  };
  votes: {
    left: number;
    right: number;
    none: number;
  };
}
