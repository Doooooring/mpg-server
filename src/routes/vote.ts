import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import crypto from "crypto";

import { News } from "../schemas/news";
import { Vote } from "../schemas/vote";

const app = express();
app.use(bodyParser.json());

const router = express.Router();

router.route("/:userId").get((req: Request, res: Response) => {
  const { userId } = req.params;
});

interface VoteRequestBody {
  news: string;
  response: "left" | "right" | "none";
}

async function updateNews(
  id: string,
  choice: "left" | "right" | "none",
  upDown: 1 | -1
) {
  if (choice === "left") {
    const response = await News.updateOne(
      { _id: id },
      {
        $inc: {
          "votes.left": upDown,
        },
      }
    );
    return response;
  } else if (choice === "right") {
    const response = await News.updateOne(
      {r
        _id: id,
      },
      {
        $inc: {
          "votes.right": upDown,
        },
      }
    );
    return response;
  } else {
    const response = await News.updateOne(
      {
        _id: id,
      },
      {
        $inc: {
          "votes.none": upDown,
        },
      }
    );
    return response;
  }
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
    const id = authorization;
    const existed = await Vote.findOne({ user: id });
    if (existed === null) {
      try {
        const today = new Date();
        const shasum = crypto.createHash("sha1");
        shasum.update(today.toLocaleTimeString());
        const token = shasum.digest("hex");
        const newsUpdate = await updateNews(news, response, 1);

        const voteUpdate = await Vote.create({
          user: token,
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
              $addToSet: {
                vote: {
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
          const votePull = await Vote.updateOne(
            { user: id },
            {
              $pull: {
                vote: {
                  news: news,
                },
              },
            }
          );
          const votePush = await Vote.updateOne(
            { user: id },
            {
              $push: {
                vote: { news: news, response: response },
              },
            }
          );
          res.send({
            state: true,
            token: id,
          });
        }
      } catch (e) {
        console.error(e);
        res.send(e);
      }
    }
  } else {
    try {
      const today = new Date();
      const shasum = crypto.createHash("sha1");
      shasum.update(today.toLocaleTimeString());
      const token = shasum.digest("hex");
      const newsUpdate = await updateNews(news, response, 1);
      const voteUpdate = await Vote.create({
        user: token,
        vote: [
          {
            news: news,
            response: `${response}`,
          },
        ],
      });
      res.send({ state: true, token: token });
    } catch (e) {
      console.error(e);
      res.send(e);
    }
  }
});

setInterval(async () => {
  await Vote.deleteMany({});
  console.log("Vote cleared");
}, 24 * 60 * 60 * 1000);

export const voteRoute = router;
