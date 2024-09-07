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
