import bodyParser from "body-parser";
import express from "express";
import multer from "multer";

import {
  addNewsData,
  deleteNewsAll,
  getNewsById,
  getNewsTitle,
  postNewsImageById,
  updateNewsData,
} from "../controller/newsController";

const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.use(bodyParser.json());

const router = express.Router();

router.route("/kmj123/deleteAll").delete(deleteNewsAll);

router.route("/title").get(getNewsTitle);

router.route("/img/:id").get().post(upload.single("img"), postNewsImageById);

router.route("/:id").get(getNewsById);

router.route("/").post(addNewsData).patch(updateNewsData);
// .delete(deleteNewsData);

export const newsAdminRoute = router;
