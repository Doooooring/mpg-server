export interface VoteInf {
  user: string;
  vote: Array<{
    news: string;
    response: string;
  }>;
}
