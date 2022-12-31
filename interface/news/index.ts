export interface NewsInf {
  id: number;
  title: String;
  summary: String;
  news: Array<{ date: Date; title: String }>;
  journals: Array<{ press: String; title: String }>;
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
