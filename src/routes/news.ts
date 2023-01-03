import express, { Request, response, Response } from "express";
import { NewsInf } from "../interface/news";
import { News } from "../schemas/news";

const app = express();
const router = express.Router();

// 기사 목록
router.route("/summary").get(async (req: Request, res: Response) => {
  const { curNum, keyword } = req.query;
  if (keyword === "") {
    try {
      const newsContents = await News.find({})
        .sort({ state: -1, order: -1 })
        .select("title summary keywords")
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
        .select("title summary keywords")
        .skip(Number(curNum))
        .limit(20);
      response.send(JSON.stringify(newsContents));
    } catch (err) {
      console.error(err);
    }
  }
});

// 기사 상세
router
  .route("/:id")
  .get(async (req: Request, res: Response) => {
    const { id } = req.params;
    const contentToSend = await News.findOne({ _id: id });
  })
  .patch(async (req: Request, res: Response) => {
    const { id } = req.params;
    const news = req.body;
    const { newsOrder } = news;
    try {
      await News.findOneAndUpdate({ order: newsOrder }, news);
    } catch (e) {
      res.send(e);
    }
  });

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
  .patch()
  .delete();

export const newsRoute = router;
