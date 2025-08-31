import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { User } from "./userTypes.ts";
import { config } from "../config/config.ts";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are Required");
    return next(error);
  }

  try {
    const user = await userModel.findOne({ email });

    if (user) {
      const error = createHttpError(400, "User already exists with this email");
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

  try {
    const token = jwt.sign({ sub: newUser._id }, config.jwtSecret as string, {
      expiresIn: "7d",
    });
    res.status(201).json({ accessToken: token });
  } catch {
    return next(createHttpError(500, "Error while signing in jwt token"));
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(createHttpError(400, "All fields are Required"));
  }

  let user;
  try {
    user = await userModel.findOne({ email });

    if (!user) {
      return next(createHttpError(404, "User not found"));
    }
  } catch {
    return next(createHttpError(500, "Error while finding user"));
  }

  try {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(createHttpError(400, "Username or Password is incorrect!"));
    }
  } catch {
    return next(createHttpError(500, "Error while comparing password"));
  }

  try {
    const token = jwt.sign({ sub: user._id }, config.jwtSecret as string, {
      expiresIn: "7d",
    });

    res.json({ accessToken: token });
  } catch {
    return next(createHttpError(500, "Error while signing JWT token"));
  }
};

export { createUser, loginUser };
