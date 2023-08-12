import { Types } from "mongoose";

export enum commentType {
  전략가 = "전략가",
  지도자 = "지도자",
  예술가 = "예술가",
  감시자 = "감시자",
  운영자 = "운영자",
  공화주의자 = "공화주의자",
  관찰자 = "관찰자",
  개혁가 = "개혁가",
  이론가 = "이론가",
  자유주의자 = "자유주의자",
  민주당 = "민주당",
  국민의힘 = "국민의힘",
  청와대 = "청와대",
}

export interface NewsInf {
  _id: Types.ObjectId;
  order: number;
  title: string;
  summary: string;
  keywords: Array<string>;
  state: Boolean;
  opinions: {
    left: string;
    right: string;
  };
  timeline: Array<{
    date: string;
    title: string;
  }>;
  comments: {
    [key in commentType]: Array<{
      title: string;
      comment: string;
    }>;
  };
  votes: {
    left: number;
    right: number;
    none: number;
  };
}
