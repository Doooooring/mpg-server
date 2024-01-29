import { Request, Response } from "express";

import { Platform } from "../../interface/common";
import { googleRepositories } from "../../service/auth/google";
import { kakaoRepositories } from "../../service/auth/kakao";
import { issueRefreshToken, issueYVoteToken } from "../../tools/auth";
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
    const refreshToken = issueRefreshToken();


    res.send({
      success: true,
      result: {
        yVoteToken,
        name,
        email,
      },
    });
  } catch (e) {
    console.log("kakao login error", e);
    res.send(e);
  }
};

export const kakaoLogout = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      Error("User token is not defined");
      return;
    }
    const data = await kakaoRepositories.kakaoLogout(token);
    res.send({
      success: true,
      result: {
        id: data.id,
      },
    });
  } catch (e) {
    console.log("kakao logout error", e);
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
    const refreshToken = issueRefreshToken();

    res.send({
      success: true,
      result: {
        yVoteToken,
        name,
        email,
      },
    });
  } catch (e) {
    console.log("kakao login error", e);
    res.send(e);
  }
};

export const googleLogout = (req: Request, res: Response) => {};
