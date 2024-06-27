"use strict";

import { Sequelize } from "sequelize";
import { config as cof } from "../config";

enum envType {
  development = "development",
  test = "test",
  production = "production",
}

const env = (process.env.NODE_ENV as envType | undefined) || "development";
var config = cof[env];

export const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: "mysql",
  }
);
