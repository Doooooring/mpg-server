import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { News } from "../..//schemas/news";
import { NewsInf, commentType } from "../../interface/news";
import { keywordRepositories } from "../../service/keyword";
import { newsRepositories } from "../../service/news";
import { voteRepositories } from "../../service/vote";
import { TokenPayload, verifyYVoteToken } from "../../tools/auth";
import { clone } from "../../utils/common/index";
import { updateKeywordsState } from "../keywordController";

export const getNewsIds = async (req: Request, res: Response) => {
  const response = await newsRepositories.getNewsIds();
  res.send({ success: true, result: { data: response } });
};

export const getNewsPreviewList = async (req: Request, res: Response) => {
  const { page = 0, limit = 20, keyword = "" } = req.query;
  if (Number(page) === -1) {
    res.send({
      success: false,
      result: {
        news: [],
      },
    });
    return;
  }
  if (keyword === "" || keyword === null) {
    try {
      const newsContents = await newsRepositories.getNewsInShort(
        Number(page),
        Number(limit)
      );
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
      const response = await keywordRepositories.getNewsInKeyword(
        keyword as string
      );
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
      const newsContents = await newsRepositories.getNewsInShortByIdList(
        Number(page),
        news,
        Number(limit)
      );
      res.send({
        success: true,
        result: {
          news: newsContents,
        },
      });
    } catch (err) {
      res.status(500).send({
        success: false,
        result: {
          news: [],
        },
      });
      console.log(err);
    }
  }
};

export const getImageById = async (req: Request, res: Response) => {
  res.send();
};

export const getNewsById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const response = await newsRepositories.getNewsByIdWithoutVote(id);
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

export const getNewsByIdClient = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const response = await newsRepositories.getNewsByIdWithoutVote(id);
    const contentToSend = clone(response) as any;
    contentToSend.comments =
      Object.keys((contentToSend as NewsInf)?.comments ?? {}) ?? [];
    res.send({
      success: true,
      result: {
        news: contentToSend,
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
    const response = await newsRepositories.getNewsTitle(search);
    res.send({
      success: true,
      result: {
        news: response,
      },
    });
  } catch (e) {
    res.send({
      success: false,
      result: {
        news: [],
      },
    });
  }
};

export const getNewsByKeyword = async (req: Request, res: Response) => {
  const { keyword } = req.params;
  try {
    const keywordData = await keywordRepositories.getKeywordByKey(keyword);
    const newsList = keywordData?.news;
    const response = await newsRepositories.getNewsByIdList(newsList!);
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
    const checkExists = await keywordRepositories.getKeywords(keywords);
    if (checkExists.length === 0) {
      Error("Not exists");
    }

    const response1 = await newsRepositories.updateKeywordsById(_id, keywords);
    const response2 = await keywordRepositories.pushNewsInfoToKeywords(
      keywords,
      _id
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
    _id: string;
    keywords: string[];
  }
  const { _id, keywords }: reqBody = req.body;
  try {
    const response = await newsRepositories.getKeywordsById(_id);

    if (response) {
      const { keywords: beforeKeywords } = response;
      const deleteKeys = beforeKeywords.filter((keyword) => {
        return !keywords.includes(keyword);
      });
      const addKeys = keywords.filter((keyword) => {
        return !beforeKeywords.includes(keyword);
      });
      const deleteResponse = await keywordRepositories.pushNewsInfoToKeywords(
        deleteKeys,
        _id
      );
      const addResponse = await keywordRepositories.pushNewsInfoToKeywords(
        addKeys,
        _id
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
  const { id } = req.params;
  const { type, page: pageStr, limit = "10" } = req.query;
  try {
    const newsContents = await newsRepositories.getCommentsById(id as string);
    if (newsContents === null) {
      Error("news contents doesn't exist");

      return;
    }
    const page = parseInt(pageStr as string);

    /**
     * @FIXME comments error
     */

    if ((type as string) in newsContents["comments"]) {
      const comments = newsContents["comments"][type as commentType]
        .reverse()
        .slice(page, page + parseInt(limit as string));
      res.send({
        success: true,
        result: { comments },
      });
    } else {
      res.send({
        success: true,
        result: { comments: [] },
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

export const addNewsData = async (req: Request, res: Response) => {
  try {
    // const totalNum = await newsRepositories.getNewsCount();
    const maxOrder = await newsRepositories.getOrderMaximum();

    const news: NewsInf = {
      order: maxOrder + 1,
      votes: {
        left: 0,
        right: 0,
        none: 0,
      },
      ...req.body.news,
    };

    const keywordList = news.keywords;
    const checkKeywordExisted = await keywordRepositories.getKeywords(
      keywordList
    );

    if (keywordList.length != (checkKeywordExisted?.length ?? 0)) {
      throw new Error("The keyword that doesn't exist is here");
    }

    const response = await newsRepositories.postNews(news);

    const keywordState = news["state"];
    if (keywordState) {
      const keywordResponse2 = await keywordRepositories.updateNewsInfoAndState(
        keywordList,
        true,
        JSON.stringify(response["_id"])
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

export const postNewsImageById = async (req: Request, res: Response) => {
  try {
    const img = req.file?.buffer;
    if (img === undefined) {
      Error("image doesn't exist");
      return;
    }
    const id = req.params.id;
    console.log(img);

    // let buffer = Buffer.from(img, "base64");
    const filePath = path.join(__dirname, "../../images/news", id);

    fs.writeFileSync(filePath, img);
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
    return;
  }
};

export const updateNewsData = async (req: Request, res: Response) => {
  const news = req.body.news;
  const newsId = news["_id"] as string;
  try {
    const beforeNews = await newsRepositories.getNewsById(newsId as string);

    if (beforeNews === null) {
      throw new Error("It doesn't exist. Post it");
    }

    const newsUpdateResponse = await newsRepositories.updateNewsById(
      newsId,
      news
    );

    const keywordList = news["keywords"];
    const keywordListBefore = beforeNews["keywords"];

    const keywordResponse = {
      responseAdd: {},
      responseDeleted: {},
    };

    const keywordDeleted = keywordListBefore.filter((keyword) => {
      return !keywordList.includes(keyword);
    });

    const keywordAdded = (keywordList as NewsInf["keywords"]).filter(
      (keyword) => {
        return !keywordListBefore.includes(keyword);
      }
    );

    const responseAdd = await keywordRepositories.pushNewsInfoToKeywords(
      keywordAdded,
      newsId
    );

    const responseDeleted = await keywordRepositories.pullNewsInfoToKeywords(
      keywordDeleted,
      newsId
    );

    keywordResponse["responseAdd"] = responseAdd;
    keywordResponse["responseDeleted"] = responseDeleted;

    if (!beforeNews["state"] && news["state"]) {
      const keywordResponse = await keywordRepositories.updateKeywordsState(
        keywordList,
        true
      );

      res.send({
        success: true,
        result: {},
      });
    } else if (beforeNews["state"]) {
      if (!news["state"]) {
        await updateKeywordsState(keywordListBefore);
        res.send({
          success: true,
          result: {},
        });
      } else {
        const newsResponse = await keywordRepositories.updateKeywordsState(
          keywordAdded,
          true
        );

        await updateKeywordsState(keywordDeleted);

        res.send({
          success: true,
          result: {},
        });
      }
    }
  } catch (e) {
    console.log(e);
    res.send({
      success: false,
      result: {},
    });
  }
};

export const voteByNewsData = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const token = req.headers.authorization;
  const response = req.body.response as "left" | "right" | "none";
  try {
    const {
      payload: { email },
    } = verifyYVoteToken(token as string) as {
      state: boolean;
      payload: TokenPayload;
    };

    const prevVote = await voteRepositories.getVoteInfo({
      user: email,
      news: id,
    });

    if (!prevVote) {
      const voteRes = await voteRepositories.postVoteToNews(
        email,
        id,
        response
      );
    } else {
      Error("VoteDuplicated");
    }
  } catch (e: any) {
    if (e.message == "VoteDuplicated") {
      res.status(400).send({
        success: false,
        result: {},
      });
    } else {
      res.status(401).send({
        success: false,
        result: {
          error: e,
        },
      });
    }
  }
};

export const deleteNewsVoteInfo = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const token = req.headers.authorization;
  try {
    const { state, payload } = verifyYVoteToken(token as string);
    if (!state) {
      Error("TokenNotValidated");
      return;
    }
    const { email } = payload as TokenPayload;

    await voteRepositories.deleteVote(email, id);

    res.send({
      state: true,
      result: {},
    });
  } catch (e) {
    res.status(401).send({
      success: false,
      result: {
        error: e,
      },
    });
  }
};

export const deleteNewsData = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    const curNews = await newsRepositories.getNewsById(id as string);

    if (curNews === null) {
      Error("news not exist");
      res.send({
        success: false,
        result: {},
      });
      return;
    }

    const curKeywords = curNews!["keywords"];

    const response = await newsRepositories.deleteNewsById(id as string);
    const responseDeleted = await keywordRepositories.pullNewsInfoToKeywords(
      curKeywords,
      id as string
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

// export const getNewsByIdWithVote = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.query;
//     const token = req.headers.authorization;
//     const response = await newsRepositories.getNewsById(id as string);
//     if (response === null) {
//       res.send({
//         success: false,
//         result: {},
//       });
//       return;
//     }
//     const contentToSend = clone(response) as any;
//     contentToSend.comments =
//       Object.keys((contentToSend as NewsInf)?.comments ?? {}) ?? [];

//     if (token === null) {
//       res.send({
//         success: true,
//         result: { response: null, news: contentToSend },
//       });
//     } else {
//       const user: VoteInf | null = await Vote.findOne({ user: token });
//       if (user === null) {
//         res.send({
//           success: true,
//           result: {
//             response: null,
//             news: contentToSend,
//           },
//         });
//       } else {
//         const userVote = user.vote;
//         const curNews = userVote.filter((comp) => {
//           return comp.news === id;
//         });

//         const response = curNews.length !== 0 ? curNews[0].response : null;
//         res.send({
//           success: true,
//           result: {
//             response: response,
//             news: contentToSend,
//           },
//         });
//       }
//     }
//   } catch (e) {
//     console.log(e);
//     res.send({
//       success: false,
//       result: {},
//     });
//   }
// };
