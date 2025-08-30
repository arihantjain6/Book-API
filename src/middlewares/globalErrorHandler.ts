import type { Response } from "express";
import type { HttpError } from "http-errors";
import { config } from "../config/config.ts";

const globalErrorHandler = (err: HttpError, res: Response) => {
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    message: err.message,
    errorStack: config.env === "development" ? err.stack : "",
  });
};

export default globalErrorHandler;