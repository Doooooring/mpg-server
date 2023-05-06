import bodyParser from "body-parser";
import express, { Request, Response } from "express";

import { Keywords } from "../schemas/keywords";

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

export const keywordAdminRoute = router;
