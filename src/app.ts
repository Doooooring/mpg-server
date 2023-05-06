import express, { Request, Response } from "express";

import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";
import path from "path";

import { keywordRoute } from "./routes/keywords";
import { keywordAdminRoute } from "./routes/keywordsAdmin";
import { newsRoute } from "./routes/news";
import { newsAdminRoute } from "./routes/newsAdmin";
import { voteRoute } from "./routes/vote";
import { Connect } from "./schemas/index";
//import { voteRoute } from "./routes/vote";

const app = express();

app.set("port", process.env.PORT || 3000);
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
Connect();

app.use(express.urlencoded({ extended: false }));

//image static service
//keyword image
app.use(
  "/images/keyword",
  function (req, res, next) {
    var imagePath = path.join(__dirname, "images", "keyword", req.path);
    fs.access(imagePath, fs.constants.F_OK, function (err) {
      if (err) {
        res.status(500).send("Image not found");
      } else {
        next();
      }
    });
  },
  express.static("src/images/keyword")
);

//news image
app.use(
  "/images/news",
  function (req, res, next) {
    var imagePath = path.join(__dirname, "images", "news", req.path);
    fs.access(imagePath, fs.constants.F_OK, function (err) {
      if (err) {
        res.status(500).send("Image not found");
      } else {
        next();
      }
    });
  },
  express.static("src/images/news")
);

//repository router
app.use("/news", newsRoute);
app.use("/keywords", keywordRoute);
app.use("/admin/news", newsAdminRoute);
app.use("admin/keywords", keywordAdminRoute);
app.use("/vote", voteRoute);

app.use("*", (req: Request, res: Response) => {
  res.send("not existing paths");
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});
