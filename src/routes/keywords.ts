import bodyParser from "body-parser";
import express from "express";

import {
  addKeyword,
  deleteKeywordAll,
  getKeywordWithNewsData,
  getKeywords,
  getKeywordsByCategory,
  getKeywordsForCategories,
  updateKeyword,
} from "../controller/keywordController";

const app = express();
app.use(bodyParser.json());

const router = express.Router();
//키워드만 불러오기

router.route("/delete").delete(deleteKeywordAll);

router.route("/keyword").get(getKeywords).patch();

// router.route("/id").get(getKeywoa)

router.route("/detail").get(getKeywordWithNewsData);

//특정 카테고리의 키워드 불러오기
router.route("/:category").get(getKeywordsByCategory).post().patch().delete();

router
  .route("/")
  .get(getKeywordsForCategories)
  .post(addKeyword)
  .patch(updateKeyword);

export const keywordRoute = router;
