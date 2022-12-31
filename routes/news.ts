import { Request, Response } from "express";
import { NewsInf } from "../interface/news";

const express = require("express");

const News = require("../schemas/news.ts");

const appNews = express();
const routerNews = express.Router();

routerNews.get("/summary", async (req: Request, res: Response) => {
  const { curNum, keyword } = req.query;
  if (keyword === "") {
    try {
      const contentsContinuing: Array<NewsInf> = await News.find({
        state: true,
      });
      const contentsEnd = await News.find({ state: false });

      const totalContents = [
        ...contentsContinuing.reverse(),
        ...contentsEnd.reverse(),
      ];
    } catch (err) {
      console.error(err);
    }
  } else {
    try {
      const contentsContinuing = await News.find({ state: true });
      const contentsEnd = await News.find({ state: false });

      const totalContents = [...contentsContinuing.reverse(), ...contentsEnd()];
    } catch (err) {
      console.error(err);
    }
  }
});

routerNews.get("/contents/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const contentToSend = await News.find({ id: id });
});

routerNews.get("/");
