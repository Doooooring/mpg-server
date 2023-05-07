import bodyParser from "body-parser";
import express, { Request, Response } from "express";

import { Keywords } from "../schemas/keywords";
import { News } from "../schemas/news";

import { KeywordInf } from "../interface/keyword";

const app = express();
app.use(bodyParser.json());

const router = express.Router();
//키워드만 불러오기

router.route("/delete").delete(async (req: Request, res: Response) => {
  const response = await Keywords.deleteMany({});
  res.send(JSON.stringify(response));
});

router
  .route("/keyword")
  .get(async (req: Request, res: Response) => {
    const response = await Keywords.find({}).select("keyword");
    const keywordToSend = response.map((keyInfo) => {
      return keyInfo.keyword;
    });
    res.send(JSON.stringify(keywordToSend));
  })
  .patch();

router.route("/detail").get(async (req: Request, res: Response) => {
  const { curNum, keyName } = req.query;
  const keyword = await Keywords.findOne({ keyword: keyName }).select(
    "keyword explain news"
  );
  if (keyword === null) {
    res.send("none");
    return;
  }
  const { news } = keyword;
  const previews = await News.find({
    _id: {
      $in: news,
    },
  })
    .sort({ state: -1, order: -1 })
    .select("order title summary keywords state")
    .skip(Number(curNum))
    .limit(20);
  const response = {
    keyword: keyword,
    previews: previews,
  };
  res.send(JSON.stringify(response));
});

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
          keywords: {
            $topN: {
              n: 80,
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
    console.log(other);
    const response = {
      recent: recent,
      other: other,
    };
    res.send(JSON.stringify(response));
  })
  .post(async (req: Request, res: Response) => {
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
            {
              $pull: {
                keywords: keyword,
              },
            }
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
              $push: {
                keywords: keyword,
              },
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
