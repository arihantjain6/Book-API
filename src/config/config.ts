import { config as conf } from "dotenv";
conf();

console.log("Environment PORT:", process.env["PORT"]);

const _config = {
  port: parseInt(process.env["PORT"] || "3000"),
  databaseUrl: process.env["MONGO_DB_STRING"],
  env: process.env["NODE_ENV"] || "development",
  jwtSecret: process.env["JWT_SECRET"],
};

export const config = Object.freeze(_config);
