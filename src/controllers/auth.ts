import express from "express";
import { RegisterRequest } from "types/auth";
import jwt from "jsonwebtoken";
import User from "models/user";
import createHttpError from "http-errors";
import bcrypt from "bcryptjs";

export const createUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { name, email, password, confirmPassword } =
      req.body as RegisterRequest;

    const exists = !!(await User.exists({ email }));

    if (exists) {
      throw createHttpError(409, "User with this email already exists");
    }
  } catch (error) {
    next(error);
  }
};
