import express from "express";
import {
  EmailResendRequest,
  LoginRequest,
  RegisterRequest,
  VerifyEmailRequest,
} from "../types/auth";
import {
  loginUserIn,
  registerUser,
  sendCode,
  verifyCode,
} from "../services/auth";

export const createUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { name, email, password, confirmPassword } =
      req.body as RegisterRequest;

    const { token, user } = await registerUser(name, email, password);

    res.status(201).json({ message: "User created successfully", user, token });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { email, password } = req.body as LoginRequest;

    const { token, user } = await loginUserIn(email, password);

    res.status(201).json({ message: "Login successful", user, token });
  } catch (error) {
    next(error);
  }
};

export const sendVerificationCode = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { email } = req.body as EmailResendRequest;

    const { message } = await sendCode(email);

    res.status(200).json({ message });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { email, otp } = req.body as VerifyEmailRequest;

    const { message } = await verifyCode(email, otp);

    res.status(200).json({ message });
  } catch (error) {
    next(error);
  }
};
