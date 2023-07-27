import bodyParser from "body-parser";
import express from "express";

import {
  addNewsData,
  deleteNewsAll,
  deleteNewsData,
  getNewsById,
  getNewsTitle,
  updateNewsData,
} from "../controller/newsController";

const app = express();
app.use(bodyParser.json());

const router = express.Router();

router.route("/kmj123/deleteAll").delete(deleteNewsAll);

router.route("/title").get(getNewsTitle);

router.route("/:id").get(getNewsById);

router
  .route("/")
  .post(addNewsData)
  .patch(updateNewsData)
  .delete(deleteNewsData);

export const newsAdminRoute = router;
