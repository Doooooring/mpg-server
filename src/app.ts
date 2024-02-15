import bodyParser from "body-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";

import { authRoute } from "./routes/auth";
import { keywordRoute } from "./routes/keywords";
import { keywordAdminRoute } from "./routes/keywordsAdmin";
import { newsRoute } from "./routes/news";
import { newsAdminRoute } from "./routes/newsAdmin";
import { userRoute } from "./routes/user";
import { voteRoute } from "./routes/vote";
import { Connect } from "./schemas/index";
//import { voteRoute } from "./routes/vote";

const app = express();

app.set("port", process.env.PORT || 3000);
app.use(cors());

Connect();
app.use(
  bodyParser.json({
    limit: "50mb",
  })
);
app.use(
  express.urlencoded({
    extended: false,
    limit: "50mb",
  })
);

app.use("/api", express.static("src/apidoc"));

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
// app.use("/api", apiRoute);

app.use("/news", newsRoute);
app.use("/keywords", keywordRoute);

app.use("/user", userRoute);
app.use("/auth", authRoute);

app.use("/vote", voteRoute);

app.use("/admin/news", newsAdminRoute);
app.use("/admin/keywords", keywordAdminRoute);

app.use("*", (req: Request, res: Response) => {
  res.send("not existing paths");
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});

// fixTheKeywords();
