import express, { Request, response, Response } from "express";
import { RequestListener } from "http";
import mongoose from "mongoose";
import { VoteInf } from "../interface/vote";
import { NewsInf } from "../interface/news";
import { Keywords } from "../schemas/keywords";
import { News } from "../schemas/news";
import { Vote } from "../schemas/vote";

const app = express();
const router = express.Router();

router.route("/delete").delete(async (req: Request, res: Response) => {
  const response = await News.deleteMany({});
  res.send(response);
});

router.route("/test").get(async (req: Request, res: Response) => {
  const response = await News.findOne({
    "journals.press": "조선",
  }).select("journals.press");
  console.log(response);
  res.send(response);
});

// 기사 목록
router.route("/preview").get(async (req: Request, res: Response) => {
  const { curNum, keyword } = req.query;
  if (keyword === "null") {
    try {
      const newsContents = await News.find({})
        .sort({ state: -1, order: -1 })
        .select("order title summary keywords state")
        .skip(Number(curNum) * 20)
        .limit(20);
      res.send(JSON.stringify(newsContents));
    } catch (err) {
      console.error(err);
    }
  } else {
    try {
      const response = await Keywords.findOne({
        keyword: keyword,
      }).select("news");
      if (response === null) {
        res.send("Nothings");
        return;
      }
      const { news } = response;
      const newsContents = await News.find({
        _id: { $in: news },
      })
        .sort({ state: -1, order: -1 })
        .select("order title summary keywords state")
        .skip(Number(curNum))
        .limit(20);
      res.send(JSON.stringify(newsContents));
    } catch (err) {
      console.error(err);
    }
  }
});

router
  .route("/keyword")
  .get(async (req: Request, res: Response) => {
    const { keyword } = req.params;
    try {
      const NewsList = await Keywords.findOne({ keyword: keyword });
      const response = await News.find({ _id: { $in: NewsList } });
      res.send(response);
    } catch {
      res.send("no");
    }
  })
  .post(async (req: Request, res: Response) => {
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
        news: response1,
        keywords: response2,
      });
    } catch (e) {
      console.error(e);
      res.send("Not good ");
    }
  })
  .patch(async (req: Request, res: Response) => {
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
        res.send(true);
      }
    } catch (e) {
      res.send(e);
      console.error(e);
    }
  });

// 기사 상세
router
  .route("/detail")
  .get(async (req: Request, res: Response) => {
    const { id } = req.query;
    const token = req.headers.authorization;
    const contentToSend = await News.findOne({ _id: id });
    console.log(contentToSend);
    if (token === null) {
      res.send({
        response: null,
        news: contentToSend,
      });
    } else {
      const user: VoteInf | null = await Vote.findOne({ user: token });
      if (user === null) {
        res.send({
          response: null,
          news: contentToSend,
        });
      } else {
        console.log("here");
        const userVote = user.vote;
        const curNews = userVote.filter((comp) => {
          return comp.news === id;
        });

        const response = curNews.length !== 0 ? curNews[0].response : null;
        res.send({
          response: response,
          news: contentToSend,
        });
      }
    }
  })
  .patch();

// 기사 등록
router
  .route("/")
  .get((req: Request, res: Response) => {
    res.send("here");
  })
  .post(async (req: Request, res: Response) => {
    const totalNum = await News.estimatedDocumentCount();
    const news: NewsInf = { order: totalNum + 1, ...req.body };
    try {
      const keywordState = news["state"];
      const keywordList = news["keywords"];
      if (keywordState) {
        const keywordResponse = await Keywords.updateMany(
          {
            keyword: {
              $in: keywordList,
            },
          },
          {
            recent: true,
            $push: {
              news: news["_id"],
            },
          }
        );
      }
      const response = await News.create(news);

      res.send(response);
    } catch (e) {
      res.send("Keyword Post Error");
    }
  })
  .patch(async (req: Request, res: Response) => {
    const news: NewsInf = req.body;
    const newsId = news["_id"];
    try {
      const beforeNews = await News.findOne({
        _id: newsId,
      });

      if (beforeNews === null) {
        Error("It doesn't exist. Post it");
        return;
      }

      const newsUpdateResponse = await News.updateOne(
        {
          _id: newsId,
        },
        news
      );

      if (beforeNews["state"] !== news["state"]) {
        const keywordList = news["keywords"];
        const keywordListBefore = beforeNews["keywords"];
        if (news["state"]) {
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
        } else {
          const keywordAdded = keywordListBefore.map((keyword) => {
            return !keywordList.includes(keyword);
          });

          const keywordDeleted = keywordList.map((keyword) => {
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
                news: news,
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
                news: news,
              },
            }
          );

          for (let keywordBefore of keywordListBefore) {
            const newsList = await Keywords.find({
              keyword: keywordBefore,
            }).select("news");
            const newsRecent = await News.find({
              _id: {
                $in: newsList,
              },
              recent: true,
            });
            if (newsRecent.length == 0) {
              const response = await Keywords.updateOne(
                {
                  keyword: keywordBefore,
                },
                {
                  state: false,
                }
              );
            }
          }
        }
      }
      res.send(newsUpdateResponse);
    } catch (e) {
      res.send(e);
    }
  })
  .delete();

export const newsRoute = router;
