import mongoose from "mongoose";
import { Vote } from "../../schemas/vote";

const ObjectId = mongoose.Types.ObjectId;

class VoteRepositories {
  getVoteCount = async (news: string, response: "left" | "right" | "none") => {
    return Vote.countDocuments({
      news,
      response: response,
    });
  };

  getVoteInfo = async (info: { user?: string; news?: string }) => {
    return Vote.findOne(info).select("user news response");
  };
  postVoteToNews = async (
    user: string,
    news: string,
    response: "left" | "right" | "none" | null
  ) => {
    return Vote.create({
      user,
      news,
      response,
    });
  };
  updateVoteInfo = async (user: string, news: string, response: string) => {
    return Vote.updateOne(
      {
        user,
        news,
      },
      {
        response,
      }
    );
  };
  deleteVote = async (user: string, news: string) => {
    return Vote.deleteOne({
      user,
      news,
    });
  };
}

export const voteRepositories = new VoteRepositories();
