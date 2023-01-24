import express, { Request, Response } from "express";
import bodyParser from "body-parser";

import { News } from "../schemas/news";
import { Keywords } from "../schemas/keywords";

import { NewsInf } from "../interface/news";
import { KeywordInf } from "../interface/keyword";
import { RequestListener } from "http";
import { Console } from "console";

const app = express();
app.use(bodyParser.json());

const router = express.Router();
//키워드만 불러오기

router.route("/delete").delete(async (req: Request, res: Response) => {
  const response = await Keywords.deleteMany({});
  res.send(response);
});

router
  .route("/keyword")
  .get(async (req: Request, res: Response) => {
    const response = await Keywords.find({}).select("keyword");
    console.log(response);
    res.send(response);
  })
  .patch();

//특정 카테고리의 키워드 불러오기
router
  .route("/:category")
  .get(async (req: Request, res: Response) => {
    const { category } = req.params;
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
    const recent = await Keywords.find({ recent: true })
      .select("keyword category recent")
      .limit(10);
    const other = await Keywords.aggregate([
      {
        $group: {
          _id: "$category",
          top: {
            $topN: {
              n: 10,
              sortBy: { keyword: -1 },
              output: {
                _id: "$_id",
                keyword: "$keyword",
                category: "$category",
                recent: "$recent",
              },
            },
          },
        },
      },
    ]);
    const response = {
      recent: recent,
      other: other,
    };
    res.send(JSON.stringify(response));
  })
  .post(async (req: Request, res: Response) => {
    console.log("here");
    const newKeyword = req.body;
    const { keyword, news } = newKeyword;
    if (news === "") {
      newKeyword["news"] = [];
    } else {
      newKeyword["news"] = news.split(",");
    }

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
      console.log(response1);
      res.send(response1);
    } catch (e) {
      console.error("here");
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
