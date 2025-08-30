import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { User } from "./userTypes.ts";
import { config } from "../config/config.ts";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      const error = createHttpError(400, "All fields are Required");
      return next(error);
    }

    try {
      const user = await userModel.findOne({ email });

      if (user) {
        const error = createHttpError(
          400,
          "User already exists with this email"
        );
        return next(error);
      }
    } catch {
      return next(createHttpError(500, "Error while getting User"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser: User;
    try {
      newUser = await userModel.create({
        name,
        email,
        password: hashedPassword,
      });
    } catch {
      return next(createHttpError(500, "Error while creating user"));
    }

    const token = jwt.sign({ sub: newUser._id }, config.jwtSecret as string, {
      expiresIn: "7d",
    });

    res.json({ accessToken: token });
  } catch (error) {
    return next(error);
  }
};

export { createUser };
