import mongoose from "mongoose";
import { OTP } from "types/global";

const otpSchema = new mongoose.Schema<OTP>(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("OTP", otpSchema);
