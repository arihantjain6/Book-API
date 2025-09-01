import type { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { config } from "../config/config.ts";

interface AuthRequest extends Request {
  userId?: string;
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");
  if (!token) {
    return next(createHttpError(401, "Authoriztion token is required"));
  }

  try {
    const parsedToken = token.split(" ")[1];

    if (!parsedToken) {
      return next(createHttpError(401, "Invalid token"));
    }

    const decoded = jwt.verify(parsedToken, config.jwtSecret as string) as {
      userId?: string;
      sub?: string;
    };

    const userId = decoded.userId || decoded.sub;
    if (userId) {
      (req as AuthRequest).userId = userId;
    }

    next();
  } catch {
    return next(createHttpError(401, "Invalid token"));
  }
};

export default authenticate;
