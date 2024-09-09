import User from "../models/user";
import OTP from "../models/otp";
import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendMail } from "../lib/sendgrid";
import { generateOTP, validateOTP } from "../utils/functions";

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const exists = !!(await User.exists({ email }));

  if (exists) {
    throw createHttpError(409, "User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    isVerified: false,
  });

  const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY!, {
    expiresIn: "1d",
  });

  const { otp, expiresAt } = generateOTP();

  const userOtp = await OTP.create({
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

  return { user, token };
};

export const loginUserIn = async (email: string, password: string) => {
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

  return { user, token };
};

export const sendCode = async (email: string) => {
  const exists = !!(await User.exists({ email }));

  if (!exists) {
    throw createHttpError(404, "User not found");
  }

  await OTP.deleteMany({ email });

  const { expiresAt, otp } = generateOTP();

  const userOtp = await OTP.create({
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

  const message = "OTP sent successfully";
  return { message };
};

export const verifyCode = async (email: string, otp: string) => {
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

  const message = "Email verified successfully";
  return { message };
};
