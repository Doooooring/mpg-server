import express, { Request, Response } from "express";

import bodyParser from "body-parser";
import cors from "cors";

import { Connect } from "./schemas/index";
import { newsRoute } from "./routes/news";
import { keywordRoute } from "./routes/keywords";
import { voteRoute } from "./routes/vote";
//import { voteRoute } from "./routes/vote";

const app = express();

app.set("port", process.env.PORT || 3000);
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
Connect();

app.use(express.urlencoded({ extended: false })); //x-mmm? 인가 하는 거 받는거
app.use("/news", newsRoute);
app.use("/keywords", keywordRoute);
app.use("/vote", voteRoute);

app.use("*", (req: Request, res: Response) => {
  res.send("asdkfklafls");
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});
