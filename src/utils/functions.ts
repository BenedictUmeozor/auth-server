export const generateOTP = (): { otp: string; expiresAt: Date } => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes in milliseconds

  return { otp, expiresAt };
};

export const validateOTP = (
  inputOtp: string,
  storedOtp: string,
  expiresAt: Date
): boolean => {
  const currentTime = new Date();
  if (inputOtp === storedOtp && currentTime <= expiresAt) {
    return true;
  }
  return false;
};
