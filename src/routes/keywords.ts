import express, { Request, Response } from "express";

import { News } from "../schemas/news";
import { Keywords } from "../schemas/keywords";

import { NewsInf } from "../interface/news";
import { KeywordInf } from "../interface/keyword";
import { RequestListener } from "http";

const app = express();

const router = express.Router();

//키워드만 불러오기
router
  .route("/keyword")
  .get(async (req: Request, res: Response) => {
    const response = await Keywords.find({}).select("keyword");
    res.send(response);
  })
  .patch();

//특정 카테고리의 키워드 불러오기
router
  .route("/:category")
  .get(async (req: Request, res: Response) => {
    const category = req.params;
    const { curnum } = req.query;
    const response = await Keywords.find({ category: category })
      .skip(Number(curnum))
      .limit(20);
    res.send(JSON.stringify(response));
  })
  .post()
  .patch()
  .delete();

router
  .route("/")
  .get(async (req: Request, res: Response) => {
    const response = await Keywords.aggregate([
      { $group: { _id: "$category", keywords: { $push: "$$ROOT" } } },
    ]);
    res.send(JSON.stringify(response));
  })
  .post(async (req: Request, res: Response) => {
    const newKeyword: KeywordInf = req.body;
    const { keyword, news } = newKeyword;
    const checkNull = await Keywords.find({ keyword: keyword });
    if (checkNull.length !== 0) {
      res.send(Error("Keyword already added"));
      return;
    }
    try {
      const response1 = await Keywords.create(newKeyword);
      if (news.length !== 0) {
        const response2 = await News.updateMany(
          { order: { $in: news } },
          { keywords: { $push: keyword } }
        );
      }
      res.send(true);
    } catch (e) {
      res.send(e);
    }
  })
  .patch(async (req: Request, res: Response) => {
    const newObj: KeywordInf = req.body;
    const { keyword, news } = newObj;
    const beforeObj = await Keywords.findOne({
      keyword: keyword,
    });
    if (!beforeObj) {
      res.send(Error("Not existed"));
      return;
    }
    try {
      const keyResponse = await Keywords.replaceOne(
        { keyword: keyword },
        newObj
      );

      const curNews = newObj["news"];
      const beforeNews = beforeObj["news"];

      const deleteNews = beforeNews.filter((key) => {
        return !curNews.includes(key);
      });
      const addNews = curNews.filter((key) => {
        return !beforeNews.includes(key);
      });

      if (deleteNews.length !== 0) {
        try {
          const response = await News.updateMany(
            { _id: { $in: deleteNews } },
            { keywords: { $pull: keyword } }
          );
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
              keywords: { $push: keyword },
            }
          );
        } catch (e) {
          console.log(e);
        }
      }

      news.forEach(async (newsOrder) => {
        await Keywords.findOneAndUpdate(
          { order: newsOrder },
          { $push: { keyword: keyword } }
        );
        res.send(true);
      });
    } catch (e) {
      res.send(e);
    }
  });

export const keywordRoute = router;
