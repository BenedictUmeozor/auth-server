import bcrypt from "bcryptjs";
import express from "express";
import createHttpError from "http-errors";
import User from "../models/user";
import OTP from "../models/otp";
import {
  EmailResendRequest as PasswordResetRequest,
  VerifyEmailRequest,
} from "../types/auth";
import { generateOTP, validateOTP } from "../utils/functions";
import { sendMail } from "../lib/sendgrid";
import { ResetPasswordRequest } from "../types/user";

export const passwordResetRequest = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { email } = req.body as PasswordResetRequest;
    const exists = !!(await User.exists({ email }));

    if (!exists) {
      throw createHttpError(404, "User not found");
    }

    await OTP.deleteMany({ email });

    const { otp, expiresAt } = generateOTP();

    const userOTP = new OTP({
      email,
      otp,
      expiresAt,
    });

    await userOTP.save();

    await sendMail({
      from: process.env.EMAIL_ADDRESS!,
      to: email,
      subject: "Email verification",
      html: `
          <h1>Your OTP for Verification</h1>
          <p>Dear User,</p>
          <p>Your OTP is <strong>${otp}</strong>. Please use this code to verify your email address. It expires in 10 minutes</p>
          <p>If you didn't request this OTP, please ignore this email.</p>
          <p>Thank you!</p>`,
    });

    res.status(200).json({ message: "OTP sent successfully" });
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

    const exists = !!(await User.exists({ email }));

    if (!exists) {
      throw createHttpError(404, "User not found");
    }

    const userOtp = await OTP.findOne({ email, otp });

    if (!userOtp) {
      throw createHttpError(404, "Invalid OTP");
    }

    const otpIsValid = validateOTP(otp, userOtp.otp, userOtp.expiresAt);

    if (!otpIsValid) {
      throw createHttpError(404, "Invalid OTP");
    }

    await OTP.deleteMany({ email });

    res.status(200).json({ message: "OTP verified successfully" });
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

    const user = await User.findOne({ email });

    if (!user) {
      throw createHttpError(404, "User not found");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    await user.save();
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    next(error);
  }
};
