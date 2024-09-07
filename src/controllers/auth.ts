import express from "express";
import {
  EmailResendRequest,
  LoginRequest,
  RegisterRequest,
  VerifyEmailRequest,
} from "../types/auth";
import jwt from "jsonwebtoken";
import User from "../models/user";
import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import { generateOTP, validateOTP } from "../utils/functions";
import OTP from "../models/otp";
import { sendMail } from "../lib/sendgrid";

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
    });

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY!, {
      expiresIn: "1d",
    });

    const { otp, expiresAt } = generateOTP();

    const userOtp = new OTP({
      email,
      otp,
      expiresAt,
    });

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

    await Promise.all([user.save(), userOtp.save()]);

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

    const user = await User.findOne({ email });

    if (!user) {
      throw createHttpError(401, "Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw createHttpError(401, "Invalid email or password");
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY!, {
      expiresIn: "1d",
    });

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

    const exists = !!(await User.exists({ email }));

    if (!exists) {
      throw createHttpError(404, "User not found");
    }

    await OTP.deleteMany({ email });

    const { expiresAt, otp } = generateOTP();

    const userOtp = new OTP({
      email,
      otp,
      expiresAt,
    });

    await userOtp.save();

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

export const verifyEmail = async (
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

    const userOtp = await OTP.findOne({ email });

    if (!userOtp) {
      throw createHttpError(404, "OTP is not valid");
    }

    const otpIsValid = validateOTP(otp, userOtp.otp, userOtp.expiresAt);

    if (!otpIsValid) {
      throw createHttpError(401, "OTP is not valid");
    }

    await Promise.all([
      await User.findOneAndUpdate({ email }, { isVerified: true }),
      await OTP.deleteMany({ email }),
    ]);

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    next(error);
  }
};
