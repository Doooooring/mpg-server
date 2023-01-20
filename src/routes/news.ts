import express, { Request, response, Response } from "express";
import { RequestListener } from "http";
import mongoose from "mongoose";
import { NewsInf } from "../interface/news";
import { Keywords } from "../schemas/keywords";
import { News } from "../schemas/news";

const app = express();
const router = express.Router();

// 기사 목록
router.route("/summary").get(async (req: Request, res: Response) => {
  const { curNum, keyword } = req.query;
  if (keyword === undefined) {
    try {
      const newsContents = await News.find({})
        .sort({ state: -1, order: -1 })
        .select("order title summary keywords state")
        .skip(Number(curNum))
        .limit(20);
      res.send(JSON.stringify(newsContents));
    } catch (err) {
      console.error(err);
    }
  } else {
    try {
      const newsContents = await News.find({
        keywords: { $regex: `${keyword}` },
      })
        .sort({ state: -1, order: -1 })
        .select("order title summary keywords state")
        .skip(Number(curNum))
        .limit(20);
      response.send(JSON.stringify(newsContents));
    } catch (err) {
      console.error(err);
    }
  }
});

router
  .route("/keyword")
  .post(async (req: Request, res: Response) => {
    interface reqBody {
      _id: mongoose.Types.ObjectId;
      keywords: string[];
    }
    const { _id, keywords } = req.body;
    try {
      for (const keyword of keywords) {
        const response = await Keywords.findOne({ keyword: keyword });
        if (response === null) {
          Error("Not exists");
        }
      }
      const response = await News.findOneAndUpdate(
        { _id: _id },
        { keywords: keywords }
      );
      await Keywords.updateMany(
        {
          keyword: { $in: keywords },
        },
        {
          news: { $push: _id },
        }
      );
    } catch (e) {
      res.send(e);
    }
  })
  .patch(async (req: Request, res: Response) => {
    interface reqBody {
      _id: mongoose.Types.ObjectId;
      keywords: string[];
    }
    const { _id, keywords }: reqBody = req.body;

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
        { news: { $pull: _id } }
      );
      const addResponse = await Keywords.updateMany(
        {
          keyword: { $in: addKeys },
        },
        {
          news: { $push: _id },
        }
      );
      res.send(true);
    }
  });

// 기사 상세
router
  .route("/:id")
  .get(async (req: Request, res: Response) => {
    const { id } = req.params;
    const contentToSend = await News.findOne({ _id: id });
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
      const response = await News.create(news);
      res.send(response);
    } catch (e) {
      res.send(e);
    }
  })
  .patch(async (req: Request, res: Response) => {
    const { _id } = req.body;
  })
  .delete();

export const newsRoute = router;
