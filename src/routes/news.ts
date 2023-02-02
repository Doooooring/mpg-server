import express, { Request, response, Response } from "express";
import { RequestListener } from "http";
import mongoose from "mongoose";
import { NewsInf } from "../interface/news";
import { Keywords } from "../schemas/keywords";
import { News } from "../schemas/news";

const app = express();
const router = express.Router();

router.route("/test").get(async (req: Request, res: Response) => {
  console.log("herehre");
  const response = await News.findOne({
    "journals.press": "조선",
  }).select("journals.press");
  console.log(response);
  res.send(response);
});

// 기사 목록
router.route("/preview").get(async (req: Request, res: Response) => {
  const { curNum, keyword } = req.query;
  console.log(curNum);
  console.log(keyword);
  if (keyword === "null") {
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
    console.log(keywords);
    try {
      const checkExists = await Keywords.find({ keyword: { $in: keywords } });
      console.log(checkExists);
      if (checkExists.length === 0) {
        console.log("here");
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
    const contentToSend = await News.findOne({ _id: id });
    res.send(contentToSend);
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
