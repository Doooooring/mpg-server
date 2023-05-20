import bodyParser from "body-parser";
import express, { Request, Response } from "express";

import { Keywords } from "../schemas/keywords";
import { News } from "../schemas/news";

import { NewsInf } from "../interface/news";

const app = express();
app.use(bodyParser.json());

const router = express.Router();

router.route("/kmj/deleteAll").delete(async (req: Request, res: Response) => {
  const response = await News.deleteMany({});
  return;
});

router.route("/newstitle").get(async (req: Request, res: Response) => {
  console.log(req.query);
  const search = (req.query.search as string).trim();

  if (search === "") {
    const response = await News.find({}).select("order title");
    res.send({
      result: {
        newsList: response,
      },
    });
  } else {
    const response = await News.find({
      title: {
        $regex: `${search}`,
      },
    }).select("order title");
    res.send({
      result: {
        newsList: response,
      },
    });
  }
});

router.route("/id").get(async (req: Request, res: Response) => {
  const { id } = req.query;

  const response = await News.findOne({
    _id: id,
  }).select("title summary news journals state opinions keywords");
  res.send({
    result: {
      news: response,
    },
  });
});

router
  .route("/")
  .post(async (req: Request, res: Response) => {
    console.log("here");
    try {
      const totalNum = await News.estimatedDocumentCount();
      const news: NewsInf = {
        order: totalNum + 1,
        votes: {
          left: 0,
          right: 0,
          none: 0,
        },
        ...req.body.news,
      };
      console.log(news);

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
      if (keywordState && keywordList.length > 0) {
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

      res.send(response);
    } catch (e) {
      console.log(e);
      res.send(e);
    }
  })
  .patch(async (req: Request, res: Response) => {
    console.log("is here");
    const news: NewsInf = req.body.news;
    console.log(news);
    const newsId = news["_id"];
    console.log(newsId);
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
        res.send(responseToSend);
      } else if (beforeNews["state"]) {
        if (!news["state"]) {
          await checkIsStilRecent(keywordListBefore);
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
          console.log(newsResponse);

          await checkIsStilRecent(keywordDeleted);
          res.send(responseToSend);
        }
      }
    } catch (e) {
      console.log(e);
      res.send(e);
    }
  })
  .delete(async (req, res) => {
    try {
      const { id } = req.query;

      const curNews = await News.findOne({
        _id: id,
      });

      if (curNews === null) {
        res.send(Error);
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

      await checkIsStilRecent(curKeywords);

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
  });

export const newsAdminRoute = router;

async function checkIsStilRecent(keywordList: String[]) {
  try {
    for (let keyword of keywordList) {
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
    }
  } catch (e) {
    throw new Error("check is still error");
  }
}
