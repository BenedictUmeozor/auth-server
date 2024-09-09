import express from "express";
import {
  EmailResendRequest as PasswordResetRequest,
  VerifyEmailRequest,
} from "../types/auth";
import { ResetPasswordRequest } from "../types/user";
import {
  requestPasswordReset,
  resetUserPassword,
  verifyRequest,
} from "../services/user";

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
