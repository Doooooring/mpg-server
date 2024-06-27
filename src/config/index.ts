const dotenv = require("dotenv");

dotenv.config();

export const config = {
  development: {
    username: process.env.DB_USER_NAME || "",
    password: process.env.DB_PASSWORD || "",
    database: "test1",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  test: {
    username: process.env.DB_USER_NAME || "",
    password: process.env.DB_PASSWORD || "",
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: process.env.DB_USER_NAME || "",
    password: process.env.DB_PASSWORD || "",
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};
