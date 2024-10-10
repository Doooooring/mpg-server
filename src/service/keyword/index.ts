import mongoose from "mongoose";
import { KeywordInf } from "../../interface/keyword";
import { Keywords } from "../../schemas/keywords";
const ObjectId = mongoose.Types.ObjectId;
const INF = 10 ** 9;

class KeywordRepositories {
  getNewsInKeyword = async (keyword: string) => {
    return Keywords.findOne({
      keyword: keyword,
    }).select("news");
  };

  getKeywordsAll = async () => {
    return Keywords.find();
  };

  getKeywordByKey = async (keyword: string) => {
    return Keywords.findOne({ keyword: keyword });
  };

  getKeywordById = async (id: string) => {
    const _id = new ObjectId(id);
    return Keywords.findOne({
      _id: _id,
    });
  };

  getKeywords = async (keywords: string[]) => {
    return Keywords.find({ keyword: { $in: keywords } });
  };

  getKeywordsWithNews = async (keyword: string) => {
    return Keywords.findOne({ keyword: keyword }).select(
      "keyword explain news"
    );
  };

  getKeywordsWithNewsById = async (id: string) => {
    const _id = new ObjectId(id);
    return Keywords.findOne({ _id: _id }).select("keyword explain news");
  };

  getKeywordTitlesInShort = async (
    search: string,
    offset?: number,
    limit?: number
  ) => {
    const query =
      search === ""
        ? {}
        : {
            keyword: {
              $regex: `${search}`,
            },
          };
    return Keywords.find(query)
      .select("_id keyword")
      .skip(offset ?? 0)
      .limit(limit ?? INF);
  };

  getKeywordsInShortByCategory = async (
    category: string,
    page: number,
    limit: number
  ) => {
    return Keywords.find({ category: category })
      .select("keyword category recent")
      .skip(page)
      .limit(limit);
  };

  getKeywordByState = async (state: boolean, page: number) => {
    return Keywords.find({ recent: state })
      .select("keyword category recent")
      .limit(page);
  };

  getKeywordsInShortWithEachCateogory = async (page: number) => {
    return Keywords.aggregate([
      {
        $group: {
          _id: "$category",
          keywords: {
            $topN: {
              n: page,
              sortBy: { keyword: -1 },
              output: {
                _id: "$_id",
                keyword: "$keyword",
                category: "$category",
                recent: "$recent",
              },
            },
          },
        },
      },
    ]);
  };

  postKeyword = async (keyword: any) => {
    return Keywords.create(keyword);
  };

  updateKeywordById = async (id: string, keyword: KeywordInf) => {
    const _id = new ObjectId(id);
    return Keywords.updateOne(
      {
        _id: _id,
      },
      keyword
    );
  };

  updateKeywordsState = async (keywords: string[], state: boolean) => {
    return Keywords.updateMany(
      {
        keyword: {
          $in: keywords,
        },
      },
      {
        recent: state,
      }
    );
  };

  updateNewsInfoAndState = async (
    keywords: string[],
    state: boolean,
    news: string
  ) => {
    return Keywords.updateMany(
      {
        keyword: {
          $in: keywords,
        },
      },
      {
        $set: {
          recent: state,
        },
        $push: {
          news: news,
        },
      }
    );
  };

  deleteKeywordById = async (id: string) => {
    const _id = new ObjectId(id);
    return Keywords.deleteOne({
      _id: _id,
    });
  };

  deleteKeywordAll = async () => {
    return Keywords.deleteMany({});
  };

  pullNewsInfoToKeywords = async (keywords: string[], news: string) => {
    return Keywords.updateMany(
      {
        keyword: {
          $in: keywords,
        },
      },
      {
        $pull: {
          news: news,
        },
      }
    );
  };

  pushNewsInfoToKeywords = async (keywords: string[], news: string) => {
    return Keywords.updateMany(
      {
        keyword: { $in: keywords },
      },
      {
        $push: { news: news },
      }
    );
  };
}

export const keywordRepositories = new KeywordRepositories();
