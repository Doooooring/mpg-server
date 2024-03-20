import express from "express";
import {
  adminLogin,
  appleLogin,
  googleLogin,
  kakaoLogin,
  logout,
  tokenRefresh,
} from "../controller/authController";
const app = express();
const router = express.Router();

router.route("/kakao/login").post(kakaoLogin);
router.route("/google/login").post(googleLogin);
router.route("/apple/login").post(appleLogin);
router.route("/admin/login").post(adminLogin);

router.route("/logout").post(logout);
router.route("/refresh").post(tokenRefresh);

router.route("/");

export const authRoute = router;
