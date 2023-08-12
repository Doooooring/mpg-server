import { Keywords } from "../../schemas/keywords";

class KeywordRepositories {
  getNewsInKeyword = async (keyword: string) => {
    return Keywords.findOne({
      keyword: keyword,
    }).select("news");
  };

  getKeyword = async (keyword: string) => {
    return Keywords.findOne({ keyword: keyword });
  };

  getKeywords = async (keywords: string[]) => {
    return Keywords.find({ keyword: { $in: keywords } });
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
