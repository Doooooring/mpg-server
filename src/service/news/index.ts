import mongoose from "mongoose";
import { NewsInf } from "../../interface/news";
import { News } from "../../schemas/news";
const ObjectId = mongoose.Types.ObjectId;

class NewsRepositories {
  getNewsCount = async () => {
    return News.estimatedDocumentCount();
  };

  getOrderMaximum = async () => {   
    const response =  await News.find({}).sort({order : -1}).select("order").limit(1)
    const maxOrderObj = response[0]
    return maxOrderObj?.order ?? 0

  }

  getNewsInShortByIdList = async (
    page: number,
    news: string[],
    limit: number
  ) => {
    const newsIdList = news.map((id) => {
      const _id = new ObjectId(id);
      return _id;
    });
    return News.find({
      _id: { $in: newsIdList },
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
    const _id = new ObjectId(id);
    return News.findOne({
      _id: _id,
    });
  };

  getNewsByIdAndState = async (news: string[], state: boolean) => {
    const newsIdList = news.map((id) => {
      const _id = new ObjectId(id);
      return _id;
    });
    return News.find({
      _id: {
        $in: newsIdList,
      },
      state: state,
    });
  };

  getNewsByIdWithoutVote = async (id: string) => {
    const _id = new ObjectId(id);
    return News.findOne({
      _id: _id,
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
    const _id = new ObjectId(id);
    return News.findOne({
      _id: _id,
    }).select("comments");
  };

  getKeywordsById = async (id: string) => {
    const _id = new ObjectId(id);
    return News.findOne({ _id: _id }).select("keywords");
  };
  postNews = async (news: NewsInf) => {
    return News.create(news);
  };

  updateKeywordsById = async (id: string, keywords: string[]) => {
    const _id = new ObjectId(id);
    return News.findOneAndUpdate({ _id: _id }, { keywords: keywords });
  };

  updateNewsById = async (id: string, news: NewsInf) => {
    const _id = new ObjectId(id);
    return News.updateOne(
      {
        _id: _id,
      },
      news
    );
  };

  deleteNewsById = async (id: string) => {
    const _id = new ObjectId(id);
    return News.deleteOne({
      _id: _id,
    });
  };

  pushKeywordToNews = async (news: string[], keyword: string) => {
    const newsIdList = news.map((id) => {
      const _id = new ObjectId(id);
      return _id;
    });
    return News.updateMany(
      { _id: { $in: newsIdList } },
      {
        $push: {
          keywords: keyword,
        },
      }
    );
  };
  pullKeywordFromNews = async (news: string[], keyword: string) => {
    const newsIdList = news.map((id) => {
      const _id = new ObjectId(id);
      return _id;
    });
    return News.updateMany(
      { _id: { $in: newsIdList } },
      {
        $pull: {
          keywords: keyword,
        },
      }
    );
  };
}

export const newsRepositories = new NewsRepositories();
