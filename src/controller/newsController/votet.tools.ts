import { voteRepositories } from "../../service/vote";

export const getVoteCountByNewsId = async (id: string) => {
  try {
    const promiseArr = [
      voteRepositories.getVoteCount(id, "left"),
      voteRepositories.getVoteCount(id, "right"),
      voteRepositories.getVoteCount(id, "none"),
    ];

    const [left, right, none] = await Promise.all(promiseArr);
    return {
      left,
      right,
      none,
    };
  } catch {
    return {
      left: 0,
      right: 0,
      none: 0,
    };
  }
};
