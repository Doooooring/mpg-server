import express, { Request, Response } from "express";
import { Keywords } from "../schemas/keywords";

const app = express();

const router = express.Router();

router
  .route("/:category")
  .get(async (req: Request, res: Response) => {
    const category = req.params;
    const { curnum } = req.query;
    const response = Keywords.find({ category: category })
      .skip(Number(curnum))
      .limit(20);
    res.send(JSON.stringify(response));
  })
  .post()
  .patch()
  .delete();
