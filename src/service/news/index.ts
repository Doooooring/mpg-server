import { NewsInf } from "../../interface/news";
import { News } from "../../schemas/news";

class NewsRepositories {
  getNewsCount = async () => {
    return News.estimatedDocumentCount();
  };

  getNewsInShortByIdList = async (page: number, news: string[]) => {
    return News.find({
      _id: { $in: news },
    })
      .sort({ state: -1, order: -1 })
      .select("order title summary keywords state")
      .skip(Number(page))
      .limit(20);
  };

  getNewsInShort = async (page: number) => {
    return News.find({})
      .sort({ state: -1, order: -1 })
      .select("order title summary keywords state")
      .skip(page * 20)
      .limit(20);
  };

  getNewsByIdList = async (news: Array<string>) => {
    return News.find({ _id: { $in: news } });
  };

  getNewsById = async (id: string) => {
    return News.findOne({
      _id: id,
    });
  };

  getNewsByIdWithoutVote = async (id: string) => {
    return News.findOne({
      _id: id,
    }).select("title summary timeline comments state opinions keywords");
  };

  getNewsTitle = async (title: string) => {
    return News.find({
      title: {
        $regex: `${title}`,
      },
    }).select("order title");
  };

  getCommentsById = async (id: string) => {
    return News.findOne({
      _id: id,
    }).select("comments");
  };

  getKeywordsById = async (id: string) => {
    return News.findOne({ _id: id }).select("keywords");
  };
  postNews = async (news: NewsInf) => {
    return News.create(news);
  };

  updateKeywordsById = async (id: string, keywords: string[]) => {
    return News.findOneAndUpdate({ _id: id }, { keywords: keywords });
  };

  updateNewsById = async (id: string, news: NewsInf) => {
    return News.updateOne(
      {
        _id: id,
      },
      news
    );
  };

  deleteNewsById = async (id : string) => {
    return News.deleteOne({
        _id: id,
      });
  
  }
}

export const newsRepositories = new NewsRepositories();
