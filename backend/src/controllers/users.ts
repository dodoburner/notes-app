import { RequestHandler } from "express";
import createHttpError from "http-errors";
import User from "../models/user";
import bcrypt from "bcrypt";

interface UserParams {
  username?: string;
  email?: string;
  password?: string;
}

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
  const authenticatedUserId = req.session.userId;
  try {
    if (!authenticatedUserId) {
      throw createHttpError(401, "User not authenticated");
    }

    const user = await User.findById(authenticatedUserId)
      .select("+email")
      .exec();

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const signup: RequestHandler<
  unknown,
  unknown,
  UserParams,
  unknown
> = async (req, res, next) => {
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

    req.session.userId = user._id;

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

interface LoginParams {
  username?: string;
  password?: string;
}

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw createHttpError(400, "Missing paramaters");
    }

    const user = await User.findOne({ username })
      .select("+password +email")
      .exec();

    if (!user) {
      throw createHttpError(401, "Invalid credentials");
    }

    const matchedPassword = await bcrypt.compare(password, user.password);

    if (!matchedPassword) {
      throw createHttpError(401, "Invalid credentials");
    }

    req.session.userId = user._id;
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
    } else {
      res.sendStatus(200);
    }
  });
};
