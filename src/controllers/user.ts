import express from "express";
import {
  EmailResendRequest as PasswordResetRequest,
  VerifyEmailRequest,
} from "../types/auth";
import { ResetPasswordRequest } from "../types/user";
import {
  getAllUsers,
  getParticularUser,
  requestPasswordReset,
  resetUserPassword,
  verifyRequest,
} from "../services/user";
import createHttpError from "http-errors";

export const getUsers = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const users = await getAllUsers();

    const result = {
      users: users,
      count: users.length,
      success: true,
    };

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params as { id: string };
    if (!id) {
      throw createHttpError(500, "id is missing");
    }

    const user = await getParticularUser(id);

    const result = {
      user,
      success: true,
    };

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const passwordResetRequest = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { email } = req.body as PasswordResetRequest;

    const { message } = await requestPasswordReset(email);

    res.status(200).json({ message });
  } catch (error) {
    next(error);
  }
};

export const verifyPasswordRequest = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { email, otp } = req.body as VerifyEmailRequest;

    const { message } = await verifyRequest(email, otp);

    res.status(200).json({ message });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { password, confirmPassword, email } =
      req.body as ResetPasswordRequest;

    const { message } = await resetUserPassword(email, password);
    res.status(200).json({ message });
  } catch (error) {
    next(error);
  }
};
