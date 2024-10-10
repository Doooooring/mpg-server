"use strict";

import { Sequelize } from "sequelize-typescript";
import { config as cof } from "../config";
import { Comment } from "./comment";
import { Keyword } from "./keyword";
import { MongoMq } from "./mongoMq";
import { News } from "./news";
import { NewsKeyword } from "./newskeyword";
import { Timeline } from "./timeline";
import { User } from "./user";
import { Vote } from "./vote";

enum envType {
  development = "development",
  test = "test",
  production = "production",
}

const env = (process.env.NODE_ENV as envType | undefined) || "development";
var config = cof[env];

export const sequelize = new Sequelize({
  database: config.database,
  username: config.username,
  password: config.password,
  host: config.host,
  dialect: "mysql",
  models: [News, Keyword, NewsKeyword, User, Vote, Comment, Timeline, MongoMq], // Add models in the `models` property
  logging: console.log, // Optional: to see SQL logs
});
