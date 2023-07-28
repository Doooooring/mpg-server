import { Request, Response } from "express";
import { category } from "../../interface/keyword";
import { Keywords } from "../../schemas/keywords";
import { News } from "../../schemas/news";

export const deleteKeywordAll = async (req: Request, res: Response) => {
  const response = await Keywords.deleteMany({});
  res.send(JSON.stringify(response));
};

export const getKeywords = async (req: Request, res: Response) => {
  const { search } = req.query;
  try {
    if (search === "" || search === undefined || search === null) {
      const response = await Keywords.find({}).select("_id keyword");
      res.send({
        result: {
          keywordList: response,
        },
      });
    } else {
      const response = await Keywords.find({
        keyword: {
          $regex: `/${search}/`,
        },
      }).select("_id keyword");
      res.send({
        success: true,
        result: {
          keywords: response,
        },
      });
    }
  } catch (e) {
    console.log(e);
    res.send({
      success: false,
      result: {},
    });
  }
};

export const getKeywordInfoByKeyword = async (req: Request, res: Response) => {
  const { keyword } = req.params;
  try {
    const response = await Keywords.findOne({
      keyword: keyword,
    });
    res.send({
      success: true,
      result: {
        keyword: response,
      },
    });
  } catch (e) {
    console.log(e);
    res.send({
      success: false,
      result: {},
    });
  }
};

export const getKeywordsByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const { page } = req.query;
    const response = await Keywords.find({ category: category })
      .select("keyword category recent")
      .skip(Number(page))
      .limit(20);
    res.send({
      success: true,
      result: {
        keywords: response,
      },
    });
  } catch (e) {
    console.log(e);
    res.send({
      success: false,
      result: {},
    });
  }
};

export const getKeywordsForCategories = async (req: Request, res: Response) => {
  try {
    const recent = await Keywords.find({ recent: true })
      .select("keyword category recent")
      .limit(10);
    const other = await Keywords.aggregate([
      {
        $group: {
          _id: "$category",
          keywords: {
            $topN: {
              n: 80,
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

    const response = {
      recent: recent,
      other: other,
    };
    res.send({
      success: true,
      result: {
        keywords: response,
      },
    });
  } catch (e) {
    console.log(e);
    res.send({
      success: false,
      result: {},
    });
  }
};

export const getKeywordWithNewsData = async (req: Request, res: Response) => {
  const { page, keyword: keyname } = req.query;
  const keyword = await Keywords.findOne({ keyword: keyname }).select(
    "keyword explain news"
  );
  if (keyword === null) {
    res.send("none");
    return;
  }
  const { news } = keyword;
  const previews = await News.find({
    _id: {
      $in: news,
    },
  })
    .sort({ state: -1, order: -1 })
    .select("order title summary keywords state")
    .skip(Number(page))
    .limit(20);
  const response = {
    keyword: keyword,
    previews: previews,
  };
  res.send(JSON.stringify(response));
};

export const addKeyword = async (req: Request, res: Response) => {
  const newKeyword = req.body.keyword;
  const { keyword, news } = newKeyword;
  if (typeof news === "string") {
    if (news === "") {
      newKeyword["news"] = [];
    } else {
      newKeyword["news"] = news.split(".");
    }
  }

  const checkNull = await Keywords.find({ keyword: keyword });
  if (checkNull.length !== 0) {
    res.send(Error("Keyword already added"));
    return;
  }
  try {
    const isRecent = await News.find({
      _id: {
        $in: news,
      },
      state: true,
    });

    console.log(isRecent);

    const response1 = await Keywords.create({
      ...newKeyword,
      recent: isRecent.length > 0,
    });
    if (news.length !== 0) {
      const response2 = await News.updateMany(
        { _id: { $in: news } },
        {
          $push: {
            keywords: keyword,
          },
        }
      );
    }
    console.log(response1);
    res.send(response1);
  } catch (e) {
    console.error("here");
    res.send(e);
  }
};

export const updateKeyword = async (req: Request, res: Response) => {
  const {
    _id,
    keyword,
    explain,
    category,
    news,
  }: {
    _id: string;
    keyword: string;
    explain: string;
    category: category;
    news: Array<string>;
  } = req.body.keyword;

  const beforeObj = await Keywords.findOne({ _id: _id });
  if (!beforeObj) {
    res.send(Error("is not existed"));
    return;
  }
  try {
    const isRecent = await News.find({
      _id: {
        $in: news,
      },
      state: true,
    });
    console.log("is recent");
    console.log(isRecent);
    const response1 = await Keywords.updateOne(
      {
        _id: _id,
      },
      {
        keyword: keyword,
        explain: explain,
        category: category,
        news: news,
        recent: isRecent.length > 0,
      }
    );

    const curNews = news;
    const beforeNews = beforeObj["news"];

    const deleteNews = beforeNews.filter((key) => {
      return !curNews.includes(key);
    });
    const addNews = curNews.filter((key) => {
      return !beforeNews.includes(key);
    });
    console.log("is changed");
    console.log(beforeNews);
    console.log(deleteNews);
    if (deleteNews.length !== 0) {
      try {
        const response = await News.updateMany(
          { _id: { $in: deleteNews } },
          {
            $pull: {
              keywords: keyword,
            },
          }
        );
        console.log(response);
      } catch (e) {
        console.log(e);
      }
    }

    if (addNews.length !== 0) {
      try {
        const response = await News.updateMany(
          {
            _id: { $in: addNews },
          },
          {
            $push: {
              keywords: keyword,
            },
          }
        );
      } catch (e) {
        console.log(e);
      }
    }

    res.send(response1);
  } catch (e) {
    console.log(e);
    res.send(Error("get some error"));
  }
};

export const deleteKeyword = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const deleteKeyword = await Keywords.findOne({
      _id: id,
    });
    const keyword = deleteKeyword!["keyword"];
    const deleteNews = deleteKeyword!["news"];

    const response = await Keywords.deleteOne({
      id: id,
    });

    if (deleteNews.length !== 0) {
      try {
        const response = await News.updateMany(
          { _id: { $in: deleteNews } },
          {
            $pull: {
              keywords: keyword,
            },
          }
        );
        console.log(response);
      } catch (e) {
        console.log(e);
      }
    }

    res.send({
      result: {
        state: true,
      },
    });
  } catch {
    res.send({
      result: {
        state: false,
      },
    });
  }
};

export const updateKeywordsState = async (keywords: string[]) => {
  try {
    await Promise.all(
      keywords.map(async (keyword) => {
        updateKeywordState(keyword);
      })
    );
    return true;
  } catch (e) {
    console.log("keyword update error!");
    console.log(e);
    return e;
  }
};

export const updateKeywordState = async (keyword: string) => {
  const responseWithNews = await Keywords.findOne({
    keyword: keyword,
  }).select("news");

  if (responseWithNews === null) {
    throw new Error("none");
  }

  const newsList = responseWithNews["news"];

  const newsRecent = await News.find({
    _id: {
      $in: newsList,
    },
    state: true,
  });
  if (newsRecent.length == 0) {
    const response = await Keywords.updateOne(
      {
        keyword: keyword,
      },
      {
        recent: false,
      }
    );
  }
};
