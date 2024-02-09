import { Request, Response } from "express";

import { Platform } from "../../interface/common";
import { googleRepositories } from "../../service/auth/google";
import { kakaoRepositories } from "../../service/auth/kakao";
import {
  issueRefreshToken,
  issueYVoteToken,
  verifyYVoteToken,
  veriyRefreshToken,
} from "../../tools/auth";
import { upsertUsers } from "./auth.tools";

export const adminLogin = async (req: Request, res: Response) => {
  const admin = {
    email: "admin",
    name: "admin",
    platform: Platform.ADMIN,
  };

  const yVoteToken = issueYVoteToken(admin.email, Platform.ADMIN);
  const refreshToken = issueRefreshToken(admin.email, Platform.ADMIN);

  res.send({
    success: true,
    result: {
      access: yVoteToken,
      refresh: refreshToken,
      name: admin.email,
      email: admin.name,
    },
  });
};

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

export const auth = (req: Request, res: Response, next: any) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      Error("TokenExpiredError");
      return;
    }

    const { state, payload } = verifyYVoteToken(token);
    if (!state) {
      Error("JsonWebTokenError");
    }
    next();
  } catch (e: any) {
    if (e === "TokenExpiredError") {
      return res.status(419).send({
        success: false,
        result: {
          message: "토큰이 만료되었습니다.",
        },
      });
    }
    // 토큰의 비밀키가 일치하지 않는 경우
    if (e === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        result: {
          message: "유효하지 않은 토큰입니다.",
        },
      });
    }
  }
};
