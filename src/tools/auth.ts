import jwt from "jsonwebtoken";
import { Platform } from "../interface/common";

const ACCESS_SECRET = "YVOTEAccEsSecret";
const REFRESH_SECRET = "YVOTERefrESHSecret";

export const issueYVoteToken = (email: string, platform: Platform) => {
  const payload = {
    email,
    platform,
  };

  const yVoteToken = jwt.sign(payload, ACCESS_SECRET, {
    algorithm: "HS256",
    expiresIn: "3h",
    issuer: "yVote",
  });
  return yVoteToken;
};

export const verifyYVoteToken = (token: string) => {
  try {
    const data = jwt.verify(token, ACCESS_SECRET);

    return {
      state: true,
      payload: data as {
        email: string;
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

export const issueRefreshToken = (email: string, platform: Platform) => {
  const refreshToken = jwt.sign({ email, platform }, REFRESH_SECRET, {
    algorithm: "HS256",
    expiresIn: 60 * 60 * 24 * 30,
    issuer: "yVote",
  });
  return refreshToken;
};

export const veriyRefreshToken = (token: string) => {
  try {
    const data = jwt.verify(token, REFRESH_SECRET);
    return {
      state: true,
      payload: data as {
        email: string;
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
