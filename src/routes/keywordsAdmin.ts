import bodyParser from "body-parser";
import express, { Request, Response } from "express";

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
      keyword: response,
    })
  );
});

router.route("/").post(async (req: Request, res: Response) => {
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
    const isRecent = await News.find({
      order: {
        $in: news,
      },
      state: true,
    });

    const response1 = await Keywords.create({
      ...newKeyword,
      recent: isRecent.length > 0,
    });
    if (news.length !== 0) {
      const response2 = await News.updateMany(
        { order: { $in: news } },
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
});

export const keywordAdminRoute = router;
