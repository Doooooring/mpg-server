import bodyParser from "body-parser";
import express from "express";

import multer from "multer";
import {
  addKeyword,
  deleteKeyword,
  getKeywordInfoByKeyword,
  getKeywords,
  postKeywordImageById,
  updateKeyword,
} from "../controller/keywordController";

const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.use(bodyParser.json());

const router = express.Router();

// router.route("/kmj123/deleteAll").delete(deleteKeywordAll);

router.route("/keyword").get(getKeywords);

router.route("/img/:id").get().post(upload.single("img"), postKeywordImageById);

router.route("/:keyword").get(getKeywordInfoByKeyword);

router.route("/").post(addKeyword).patch(updateKeyword).delete(deleteKeyword);

export const keywordAdminRoute = router;
