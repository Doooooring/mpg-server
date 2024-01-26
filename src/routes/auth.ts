import express from "express";
import {
  googleLogin,
  googleLogout,
  kakaoLogin,
  kakaoLogout,
} from "../controller/authController";
const app = express();
const router = express.Router();

router.route("/kakao/logout").post(kakaoLogout);
router.route("/kakao/login").post(kakaoLogin);

router.route("/google/logout").post(googleLogout);
router.route("/google/login").post(googleLogin);

router.route("/");

export const authRoute = router;
