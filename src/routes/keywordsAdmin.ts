import bodyParser from "body-parser";
import express, { Request, Response } from "express";

import { category } from "../interface/keyword";
import { Keywords } from "../schemas/keywords";
import { News } from "../schemas/news";

const app = express();
app.use(bodyParser.json());

const router = express.Router();

router.route("/keyname").get(async (req: Request, res: Response) => {
  const { keyname } = req.query;
  const response = await Keywords.findOne({
    keyword: keyname,
  });
  res.send(
    JSON.stringify({
      result: {
        keyword: response,
      },
    })
  );
});

router.route("/titles").get(async (req: Request, res: Response) => {
  const { search } = req.query;

  if (search === "") {
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
      result: {
        newsList: response,
      },
    });
  }
});

router
  .route("/")
  .post(async (req: Request, res: Response) => {
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
  })
  .patch(async (req, res) => {
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
    console.log("is here");
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
  });

export const keywordAdminRoute = router;
