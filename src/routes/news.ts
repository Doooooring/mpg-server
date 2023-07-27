import express, { Request, Response } from "express";
import {
  addNewsData,
  getNewsByIdWithVote,
  getNewsByKeyword,
  getNewsComment,
  getNewsPreviewList,
  setKeywordsById,
  updateKeywordsById,
  updateNewsData,
} from "../controller/newsController";
import { News } from "../schemas/news";

const app = express();
const router = express.Router();

router.route("/test").get(async (req: Request, res: Response) => {
  const response = await News.findOne({
    "journals.press": "조선",
  }).select("journals.press");
  console.log(response);
  res.send(response);
});

router.route("/delete").delete(async (req: Request, res: Response) => {
  const response = await News.deleteMany({});
  res.send(response);
});

// 기사 목록
router.route("/preview").get(getNewsPreviewList);

router
  .route("/keyword")
  .get(getNewsByKeyword)
  .post(setKeywordsById)
  .patch(updateKeywordsById);

// 기사 상세
router.route("/detail").get(getNewsByIdWithVote).patch();

router.route("/comment").get(getNewsComment);

// 기사 등록
router.route("/").get().post(addNewsData).patch(updateNewsData);

export const newsRoute = router;
