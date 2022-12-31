import { Request, Response } from "express";

const expressK = require("express");
const appK = expressK();
const routerK = expressK.Router();
const Keywords = require("../schemas/news.ts");

routerK.get("/", async (req: Request, res: Response) => {
    
});
