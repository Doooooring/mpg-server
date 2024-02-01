import { Request, Response } from "express";

import { Platform } from "../../interface/common";
import { googleRepositories } from "../../service/auth/google";
import { kakaoRepositories } from "../../service/auth/kakao";
import {
  issueRefreshToken,
  issueYVoteToken,
  veriyRefreshToken,
} from "../../tools/auth";
import { upsertUsers } from "./auth.tools";

export const kakaoLogin = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      Error("User token is not defined");
      return;
    }

    const properties = [
      "kakao_account.name",
      "kakao_account.email",
      "kakao_account.profile",
    ];

    const data = await kakaoRepositories.getUserInfoByToken(token, properties);

    const { name, email } = data.kakao_account;

    upsertUsers(email, name, Platform.KAKAO);

    const yVoteToken = issueYVoteToken(email, Platform.KAKAO);
    const refreshToken = issueRefreshToken(email, Platform.KAKAO);

    res.send({
      success: true,
      result: {
        access: yVoteToken,
        refresh: refreshToken,
        name,
        email,
      },
    });
  } catch (e) {
    console.log("kakao login error", e);
    res.send(e);
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      Error("User token is not defined");
      return;
    }

    const data = await googleRepositories.getUserInfoByToken(token);

    const { name, email } = data;

    upsertUsers(email, name, Platform.GOOGLE);

    const yVoteToken = issueYVoteToken(email, Platform.GOOGLE);
    const refreshToken = issueRefreshToken(email, Platform.GOOGLE);

    res.send({
      success: true,
      result: {
        access: yVoteToken,
        refresh: refreshToken,
        name,
        email,
      },
    });
  } catch (e) {
    console.log("kakao login error", e);
    res.send(e);
  }
};

export const logout = (req: Request, res: Response) => {
  try {
    const { access, refresh } = req.body;
    if (!access) {
      Error("User access token is not defined");
      return;
    }

    if (!refresh) {
      Error("User refresh token is not defined");
      return;
    }
    /**
     * add token to the blacklist (redis)
     */
    res.send({
      success: true,
      result: {},
    });
  } catch (e) {
    console.log("logout error", e);
    res.send({
      success: false,
      result: {
        error: e,
      },
    });
  }
};

export const tokenRefresh = (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      Error("User token is not defined");
      return;
    }
    const response = veriyRefreshToken(token as string);
    if (!response.state) {
      Error("Refresh Expired");
      return;
    }

    const { email, platform } = response.payload as {
      email: string;
      platform: Platform;
    };

    const accessToken = issueYVoteToken(email, platform);
    res.send({
      state: true,
      result: {
        access: accessToken,
      },
    });
  } catch (e) {
    res.status(401).send({
      state: false,
      result: {
        error: e,
      },
    });
  }
};
