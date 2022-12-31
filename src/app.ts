import { Request, Response } from "express";

const express = require("express");
const app = express();
const morgan = require("morgan"); //rest api 기록 찍어줌

const Connect = require("./schema/index");
const newsRoute = require("./routes/news.ts");
const keywordRoute = require("./routes/keywords.ts");

app.set("port", process.env.PORT || 3000);
Connect();

app.use(express.urlencoded({ extened: false })); //x-mmm? 인가 하는 거 받는거
app.use("/news", newsRoute);
app.use("/keywords", keywordRoute);

app.use("*", (req: Request, res: Response) => {
  res.send("asdkfklafls");
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});
