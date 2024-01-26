import jwt from "jsonwebtoken";
import { Platform } from "../../interface/common";
import { userRepositories } from "../../service/user";

const SECRET = "YVOTEJwTSecret";

export const upsertUsers = async (
  email: string,
  name: string,
  platform: Platform
) => {
  const user = userRepositories.getUserInfoByEmailAndPlatform(email, platform);
  if (!user) {
    const response = await userRepositories.postUser(email, name, platform);
  }
  return;
};

export const issueYVoteToken = (email: string, platform: Platform) => {
  const payload = {
    email,
    platform,
  };

  const yVoteToken = jwt.sign(payload, SECRET, {
    algorithm: "HS256",
    expiresIn: "3h",
    issuer: "yVote",
  });
  return yVoteToken;
};

export const verifyYVoteToken = (token: string) => {
  try {
    const data = jwt.verify(token, SECRET);

    return {
      state: true,
      payload: data as {
        token: string;
        platform: Platform;
      },
    };
  } catch (e) {
    return {
      state: false,
      payload: {},
    };
  }
};

export const issueRefreshToken = () => {};
