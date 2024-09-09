import express from "express";

export interface User {
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
}

export interface OTP {
  email: string;
  otp: string;
  expiresAt: Date;
}

export interface RequestWithUser extends express.Request {
  user: unknown;
}
