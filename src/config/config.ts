import { config as conf } from "dotenv";
conf();

console.log("Environment PORT:", process.env["PORT"]);

const _config = {
  port: process.env["PORT"] || 3000,
  databaseUrl: process.env["MONGO_DB_STRING"],
};

export const config = Object.freeze(_config);
