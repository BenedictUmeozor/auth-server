import User from "../models/user";
import OTP from "../models/otp";
import createHttpError from "http-errors";
import { generateOTP, validateOTP } from "../utils/functions";
import { sendMail } from "../lib/sendgrid";
import bcrypt from "bcryptjs";

export const requestPasswordReset = async (email: string) => {
  const exists = !!(await User.exists({ email }));

  if (!exists) {
    throw createHttpError(404, "User not found");
  }

  await OTP.deleteMany({ email });

  const { otp, expiresAt } = generateOTP();

  const userOTP = await OTP.create({
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

export const verifyRequest = async (email: string, otp: string) => {
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
  const message = "OTP verified successfully";
  return { message };
};

export const resetUserPassword = async (email: string, password: string) => {
  const user = await User.findOneAndUpdate(
    { email },
    { password: await bcrypt.hash(password, 10) },
    { new: true }
  );

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  return { message: "Password reset successfully" };
};
