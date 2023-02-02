import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import crypto from "crypto";

import VoteService from "../utils/vote";

import { News } from "../schemas/news";
import { Vote } from "../schemas/vote";

const app = express();
app.use(bodyParser.json());

const router = express.Router();

router.route("/:userId").get((req: Request, res: Response) => {
  const { userId } = req.params;
});

interface VoteRequestBody {
  id: string | null;
  news: string;
  response: "left" | "right" | "none";
}

async function updateNews(
  id: string,
  choice: "left" | "right" | "none",
  upDown: 1 | -1
) {
  let response;
  switch (choice) {
    case "left":
      response = await News.updateOne(
        { _id: id },
        {
          $inc: {
            left: upDown,
          },
        }
      );

    case "right":
      response = await News.updateOne(
        {
          _id: id,
        },
        {
          $inc: {
            right: upDown,
          },
        }
      );
    case "none":
      response = await News.updateOne(
        {
          _id: id,
        },
        {
          $inc: {
            none: upDown,
          },
        }
      );
  }
  return response;
}

interface HaveVoted {
  user: string;
  vote: Array<{
    news: string;
    response: "left" | "right" | "none";
  }>;
}

router.route("/").post(async (req: Request, res: Response) => {
  const requestBody: VoteRequestBody = req.body;
  const authorization = req.headers.authorization;
  const { news, response } = requestBody;

  if (authorization !== null && authorization !== undefined) {
    const id = authorization.split("Bearer ")[1];
    const existed = await Vote.findOne({ user: id });
    if (existed === null) {
      try {
        const today = new Date();
        const shasum = crypto.createHash("sha1");
        shasum.update(today.toLocaleTimeString());
        const userId = shasum.digest("hex");
        const token = VoteService.sign(userId);
        const newsUpdate = await updateNews(news, response, 1);
        const voteUpdate = await Vote.create({
          user: userId,
          vote: [
            {
              news: `${response}`,
            },
          ],
        });
        res.send({ state: true, token: token });
      } catch (e) {
        res.send(e);
      }
    } else {
      try {
        const haveVoted: HaveVoted | null = await Vote.findOne({
          user: id,
          "vote.news": news,
        });
        if (haveVoted === null) {
          const newsUpdate = await updateNews(news, response, 1);
          const voteupdate = await Vote.updateOne(
            {
              user: id,
            },
            {
              vote: {
                $push: {
                  news: news,
                  response: response,
                },
              },
            }
          );
          res.send({
            state: true,
            token: id,
          });
        } else {
          if (haveVoted.vote === undefined) {
            return;
          }
          const oldComp = haveVoted.vote.filter((comp) => {
            return comp.news === news;
          });
          const oldResponse = oldComp[0].response;
          const oldNewsUpdate = await updateNews(news, oldResponse, -1);
          const newsUpdate = await updateNews(news, response, 1);
          const voteUpdate = await Vote.updateOne(
            { user: id },
            {
              vote: {
                $pull: {
                  news: news,
                },
                $push: {
                  news: news,
                  response: response,
                },
              },
            }
          );
          res.send({
            state: true,
            token: id,
          });
        }
      } catch (e) {
        res.send(e);
      }
    }
  } else {
    try {
      const today = new Date();
      const shasum = crypto.createHash("sha1");
      shasum.update(today.toLocaleTimeString());
      const userId = shasum.digest("hex");
      const token = VoteService.sign(userId);
      const newsUpdate = await updateNews(news, response, 1);
      const voteUpdate = await Vote.create({
        user: userId,
        vote: [
          {
            news: `${response}`,
          },
        ],
      });
      res.send({ state: true, token: token });
    } catch (e) {
      res.send(e);
    }
  }
});

setInterval(async () => {
  await Vote.deleteMany({});
  console.log("Vote cleared");
}, 24 * 60 * 60 * 1000);

export const voteRoute = router;
