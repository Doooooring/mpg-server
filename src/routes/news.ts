import express, { Request, response, Response } from "express";
import { NewsInf } from "../interface/news";
import { Keywords } from "../schemas/keywords";
import { News } from "../schemas/news";

const appNews = express();
const routerNews = express.Router();

// 기사 목록
routerNews
  .route("/summary")
  .get(async (req: Request, res: Response) => {
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
  })
  .post((req: Request, res: Response) => {
    res.send(0);
  });

// 기사 상세
routerNews.route("/:id").get(async (req: Request, res: Response) => {
  const { id } = req.params;
  const contentToSend = await News.find({ _id: id });
});

// 기사 등록
routerNews.post("/", async (req: Request, res: Response) => {
  const totalNum = await News.estimatedDocumentCount();
  const news: NewsInf = { order: totalNum + 1, ...req.body };
  try {
    const response = await mongoose.create(news);
    res.send(response);
  } catch (e) {
    res.send(e);
  }
});

routerNews.get("/");
