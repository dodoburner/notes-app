import { RequestHandler } from "express";
import createHttpError from "http-errors";
import User from "../models/user";
import bcrypt from "bcrypt";

interface UserParams {
  username?: string;
  email?: string;
  password?: string;
}

export const signUp: RequestHandler<unknown, unknown, UserParams, unknown> = async (
  req,
  res,
  next
) => {
  try {
    const { username, email, password: rawPassword } = req.body;

    if (!username || !email || !rawPassword) {
      throw createHttpError(400, "Misssing paramaters");
    }

    const prevUser = await User.findOne({ username }).exec();

    if (prevUser) {
      throw createHttpError(409, "Username already taken");
    }

    const prevEmail = await User.findOne({ email }).exec();

    if (prevEmail) {
      throw createHttpError(409, "An account with that email already exists");
    }

    const password = await bcrypt.hash(rawPassword, 10);

    const user = await User.create({ username, email, password });

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};
