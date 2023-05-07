import bodyParser from "body-parser";
import express, { Request, Response } from "express";

import { News } from "../schemas/news";

const app = express();
app.use(bodyParser.json());

const router = express.Router();

router.route("/newstitle").get(async (req: Request, res: Response) => {
  const { search } = req.query;

  if (search === "") {
    console.log("is nothing");
    const response = await News.find({}).select("order title");
    res.send({
      result: {
        newsList: response,
      },
    });
  } else {
    const response = await News.find({
      title: {
        $regex: `/${search}/`,
      },
    }).select("order title");
    res.send({
      result: {
        newsList: response,
      },
    });
  }
});

export const newsAdminRoute = router;
