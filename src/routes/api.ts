import express, { Router } from "express";
import path from "path";

const app = express();
const router = Router();

router.route("/").get((req, res) => {
  const filePath = path.join(__dirname, "..", "apidoc", "index.html");
  console.log(filePath);
  res.sendFile(filePath);
});

export const apiRoute = router;
