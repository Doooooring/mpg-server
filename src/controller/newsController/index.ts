import { Request, Response } from "express";
import mongoose from "mongoose";
import { News } from "../..//schemas/news";
import { NewsInf, commentType } from "../../interface/news";
import { VoteInf } from "../../interface/vote";
import { Keywords } from "../../schemas/keywords";
import { Vote } from "../../schemas/vote";
import { updateKeywordsState } from "../keywordController";

export const getNewsPreviewList = async (req: Request, res: Response) => {
  const { page, keyword } = req.query;
  if (Number(page) === -1) {
    res.send({
      success: false,
      result: {
        news: [],
      },
    });
    return;
  }
  if (keyword === "") {
    try {
      const newsContents = await News.find({})
        .sort({ state: -1, order: -1 })
        .select("order title summary keywords state")
        .skip(Number(page) * 20)
        .limit(20);
      res.send({
        success: true,
        result: {
          news: newsContents,
        },
      });
    } catch (err) {
      res.send({
        success: false,
        result: {
          news: [],
        },
      });
      console.log(err);
    }
  } else {
    try {
      const response = await Keywords.findOne({
        keyword: keyword,
      }).select("news");
      if (response === null) {
        res.send({
          success: false,
          result: {
            news: [],
          },
        });
        return;
      }
      const { news } = response;
      const newsContents = await News.find({
        _id: { $in: news },
      })
        .sort({ state: -1, order: -1 })
        .select("order title summary keywords state")
        .skip(Number(page))
        .limit(20);
      res.send({
        success: true,
        result: {
          news: newsContents,
        },
      });
    } catch (err) {
      res.send({
        success: false,
        result: {
          news: [],
        },
      });
      console.log(err);
    }
  }
};

export const getNewsById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const response = await News.findOne({
      _id: id,
    }).select("title summary news journals state opinions keywords");
    res.send({
      success: true,
      result: {
        news: response,
      },
    });
  } catch (e) {
    console.log(e);
    res.send({
      success: false,
      result: {
        news: null,
      },
    });
  }
};

export const getNewsTitle = async (req: Request, res: Response) => {
  const search = (req.query.search as string).trim();
  try {
    if (search === "") {
      const response = await News.find({}).select("order title");
      res.send({
        success: true,
        result: {
          news: response,
        },
      });
    } else {
      const response = await News.find({
        title: {
          $regex: `${search}`,
        },
      }).select("order title");
      res.send({
        success: true,
        result: {
          news: response,
        },
      });
    }
  } catch (e) {
    res.send({
      success: false,
      result: {
        news: [],
      },
    });
  }
};

export const getNewsByIdWithVote = async (req: Request, res: Response) => {
  const { id } = req.query;
  const token = req.headers.authorization;
  const contentToSend = await News.findOne({ _id: id });
  console.log(contentToSend);
  if (token === null) {
    res.send({
      success: true,
      result: { response: null, news: contentToSend },
    });
  } else {
    const user: VoteInf | null = await Vote.findOne({ user: token });
    if (user === null) {
      res.send({
        success: true,
        result: {
          response: null,
          news: contentToSend,
        },
      });
    } else {
      const userVote = user.vote;
      const curNews = userVote.filter((comp) => {
        return comp.news === id;
      });

      const response = curNews.length !== 0 ? curNews[0].response : null;
      res.send({
        success: true,
        result: {
          response: response,
          news: contentToSend,
        },
      });
    }
  }
};

export const getNewsByKeyword = async (req: Request, res: Response) => {
  const { keyword } = req.params;
  try {
    const keywordData = await Keywords.findOne({ keyword: keyword });
    const NewsList = keywordData?.news;
    const response = await News.find({ _id: { $in: NewsList } });
    res.send({
      success: true,
      result: {
        news: response,
      },
    });
  } catch {
    res.send({
      success: false,
      result: {
        news: [],
      },
    });
  }
};

export const setKeywordsById = async (req: Request, res: Response) => {
  const { _id, keywords } = req.body;
  try {
    const checkExists = await Keywords.find({ keyword: { $in: keywords } });
    if (checkExists.length === 0) {
      Error("Not exists");
    }

    const response1 = await News.findOneAndUpdate(
      { _id: _id },
      { keywords: keywords }
    );

    const response2 = await Keywords.updateMany(
      {
        keyword: { $in: keywords },
      },
      {
        $push: { news: _id },
      }
    );
    res.send({
      success: true,
      result: {
        news: response1,
        keywords: response2,
      },
    });
  } catch (e) {
    console.error(e);
    res.send({
      success: false,
      result: {
        news: [],
        keywords: [],
      },
    });
  }
};

export const updateKeywordsById = async (req: Request, res: Response) => {
  interface reqBody {
    _id: mongoose.Types.ObjectId;
    keywords: string[];
  }
  const { _id, keywords }: reqBody = req.body;
  try {
    const response = await News.findOne({ _id: _id }).select("keywords");

    if (response) {
      const { keywords: beforeKeywords } = response;
      const deleteKeys = beforeKeywords.filter((keyword) => {
        return !keywords.includes(keyword);
      });
      const addKeys = keywords.filter((keyword) => {
        return !beforeKeywords.includes(keyword);
      });
      const deleteResponse = await Keywords.updateMany(
        {
          keyword: { $in: deleteKeys },
        },
        {
          $pull: {
            news: _id,
          },
        }
      );
      const addResponse = await Keywords.updateMany(
        {
          keyword: { $in: addKeys },
        },
        {
          $push: {
            news: _id,
          },
        }
      );
      res.send({
        success: true,
        result: {},
      });
    }
  } catch (e) {
    res.send({
      success: false,
      result: {},
    });
    console.error(e);
  }
};

export const getNewsComment = async (req: Request, res: Response) => {
  const { id, type, page: pageStr } = req.query;
  try {
    const newsContents = await News.findOne({
      _id: id,
    }).select("comments");
    if (newsContents === null) {
      Error("news contents doesn't exist");
      return;
    }
    const page = parseInt(pageStr as string);
    const comments = newsContents["comments"][type as commentType].splice(
      page,
      page + 10
    );
    res.send({
      success: true,
      result: { comments },
    });
  } catch (e) {
    console.log(e);
    res.send({
      success: false,
      result: {},
    });
  }
};

export const addNewsData = async (req: Request, res: Response) => {
  try {
    const totalNum = await News.estimatedDocumentCount();
    const news: NewsInf = {
      order: totalNum + 1,
      votes: {
        left: 0,
        right: 0,
        none: 0,
      },
      ...req.body,
    };

    const keywordList = news["keywords"];

    const checkKeywordExisted = await Keywords.find({
      keyword: {
        $in: keywordList,
      },
    });

    if (keywordList.length != checkKeywordExisted.length) {
      throw new Error("The keyword that doesn't exist is here");
    }

    const response = await News.create(news);

    const keywordState = news["state"];
    if (keywordState) {
      const keywordResponse = await Keywords.updateMany(
        {
          keyword: {
            $in: keywordList,
          },
        },
        {
          recent: true,
        }
      );

      const keywordResponse2 = await Keywords.updateMany(
        {
          keyword: {
            $in: keywordList,
          },
        },
        {
          $push: {
            news: response["_id"],
          },
        }
      );
    }

    res.send({
      success: true,
      result: {},
    });
  } catch (e) {
    console.log(e);
    res.send({
      success: false,
      result: {},
    });
  }
};

export const updateNewsData = async (req: Request, res: Response) => {
  const news: NewsInf = req.body;
  const newsId = news["_id"];
  try {
    const beforeNews = await News.findOne({
      _id: newsId,
    });

    const responseToSend = {
      newsUpdateResponse: {},
      keywordResponse: {},
    };

    if (beforeNews === null) {
      throw new Error("It doesn't exist. Post it");
    }

    const newsUpdateResponse = await News.updateOne(
      {
        _id: newsId,
      },
      news
    );

    responseToSend["newsUpdateResponse"] = newsUpdateResponse;

    const keywordList = news["keywords"];
    const keywordListBefore = beforeNews["keywords"];

    const keywordResponse = {
      responseAdd: {},
      responseDeleted: {},
    };

    const keywordDeleted = keywordListBefore.filter((keyword) => {
      return !keywordList.includes(keyword);
    });

    const keywordAdded = keywordList.filter((keyword) => {
      return !keywordListBefore.includes(keyword);
    });

    const responseAdd = await Keywords.updateMany(
      {
        keyword: {
          $in: keywordAdded,
        },
      },
      {
        $push: {
          news: newsId,
        },
      }
    );

    const responseDeleted = await Keywords.updateMany(
      {
        keyword: {
          $in: keywordDeleted,
        },
      },
      {
        $pull: {
          news: newsId,
        },
      }
    );

    keywordResponse["responseAdd"] = responseAdd;
    keywordResponse["responseDeleted"] = responseDeleted;

    if (!beforeNews["state"] && news["state"]) {
      const keywordResponse = await Keywords.updateMany(
        {
          keyword: {
            $in: keywordList,
          },
        },
        {
          recent: true,
        }
      );
      // res.send(responseToSend);
      res.send({
        success: true,
        result: {},
      });
    } else if (beforeNews["state"]) {
      if (!news["state"]) {
        await updateKeywordsState(keywordListBefore);
        res.send(responseToSend);
      } else {
        const newsResponse = await Keywords.updateMany(
          {
            keyword: {
              $in: keywordAdded,
            },
          },
          {
            recent: true,
          }
        );
        // console.log(newsResponse);

        await updateKeywordsState(keywordDeleted);
        // res.send(responseToSend);
        res.send({
          success: true,
          result: {},
        });
      }
    }
  } catch (e) {
    // res.send(e);
    console.log(e);
    res.send({
      success: false,
      result: {},
    });
  }
};

export const deleteNewsData = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    const curNews = await News.findOne({
      _id: id,
    });

    if (curNews === null) {
      Error("news not exist");
      res.send({
        success: false,
        result: {},
      });
      return;
    }

    const curKeywords = curNews!["keywords"];

    const response = await News.deleteOne({
      _id: id,
    });

    const responseDeleted = await Keywords.updateMany(
      {
        keyword: {
          $in: curKeywords,
        },
      },
      {
        $pull: {
          news: id,
        },
      }
    );

    await updateKeywordsState(curKeywords);

    res.send({
      success: true,
      result: {},
    });
  } catch {
    res.send({
      success: false,
      result: {},
    });
  }
};

export const deleteNewsAll = async (req: Request, res: Response) => {
  try {
    const response = await News.deleteMany({});
    res.send({
      success: true,
      result: {},
    });
    return;
  } catch (e) {
    res.send({
      success: false,
      result: {},
    });
  }
};
