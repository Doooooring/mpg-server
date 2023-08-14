import { NewsInf } from "../../interface/news";
import { News } from "../../schemas/news";

class NewsRepositories {
  getNewsCount = async () => {
    return News.estimatedDocumentCount();
  };

  getNewsInShortByIdList = async (
    page: number,
    news: string[],
    limit: number
  ) => {
    return News.find({
      _id: { $in: news },
    })
      .sort({ state: -1, order: -1 })
      .select("order title summary keywords state")
      .skip(page)
      .limit(limit);
  };

  getNewsInShort = async (page: number, limit: number) => {
    return News.find({})
      .sort({ state: -1, order: -1 })
      .select("order title summary keywords state")
      .skip(page)
      .limit(limit);
  };

  getNewsByIdList = async (news: Array<string>) => {
    return News.find({ _id: { $in: news } });
  };

  getNewsById = async (id: string) => {
    return News.findOne({
      _id: id,
    });
  };

  getNewsByIdAndState = async (news: string[], state: boolean) => {
    return News.find({
      _id: {
        $in: news,
      },
      state: state,
    });
  };

  getNewsByIdWithoutVote = async (id: string) => {
    return News.findOne({
      _id: id,
    }).select("title summary timeline comments state opinions keywords");
  };

  getNewsTitle = async (title: string) => {
    const query =
      title === ""
        ? {}
        : {
            title: {
              $regex: `${title}`,
            },
          };
    return News.find(query).select("order title");
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

  deleteNewsById = async (id: string) => {
    return News.deleteOne({
      _id: id,
    });
  };

  pushKeywordToNews = async (news: string[], keyword: string) => {
    return News.updateMany(
      { _id: { $in: news } },
      {
        $push: {
          keywords: keyword,
        },
      }
    );
  };
  pullKeywordFromNews = async (news :string[], keyword: string) => {
    return News.updateMany(
        { _id: { $in: news } },
        {
          $pull: {
            keywords: keyword,
          },
        }
      );
  }
}

export const newsRepositories = new NewsRepositories();
