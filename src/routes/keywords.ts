import express, { Request, Response } from "express";

import { News } from "../schemas/news";
import { Keywords } from "../schemas/keywords";

import { NewsInf } from "../interface/news";
import { KeywordInf } from "../interface/keyword";

const app = express();

const router = express.Router();

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
    const newObj: KeywordInf = req.body;
    const { keyword, news } = newObj;
    const checkUniqueness = await Keywords.find({ keyword: keyword });
    if (checkUniqueness.length === 0) {
      res.send(false);
      return;
    }
    try {
      const keyResponse = await Keywords.create(newObj);
      news.forEach( async (newsOrder) => {
        await Keywords.findOneAndUpdate({order: newsOrder}, {$push : {keyword : keyword}})
        res.send(true)
      })
    } catch (e) {
      res.send(e);
    }
  });

export const keywordRoute = router;
