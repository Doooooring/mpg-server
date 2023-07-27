import bodyParser from "body-parser";
import express from "express";

import {
  addKeyword,
  deleteKeyword,
  deleteKeywordAll,
  getKeywordInfoByKeyword,
  getKeywords,
  updateKeyword,
} from "../controller/keywordController";

const app = express();
app.use(bodyParser.json());

const router = express.Router();

router.route("kmj123/deleteAll").delete(deleteKeywordAll);

router.route("/keyword").get(getKeywords);

router.route("/:keyword").get(getKeywordInfoByKeyword);

router.route("/").post(addKeyword).patch(updateKeyword).delete(deleteKeyword);

export const keywordAdminRoute = router;
