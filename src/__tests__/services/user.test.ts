import User from "../../models/user";
import OTP from "../../models/otp";
import { generateOTP, validateOTP } from "../../utils/functions";
import { sendMail } from "../../lib/sendgrid";
import bcrypt from "bcryptjs";
import createHttpError from "http-errors";
import {
  requestPasswordReset,
  resetUserPassword,
  verifyRequest,
} from "../../services/user";

jest.mock("../../lib/sendgrid");
jest.mock("../../utils/functions");
jest.mock("../../models/user");
jest.mock("../../models/otp");
jest.mock("bcryptjs");
jest.mock("http-errors");

const mockVariable = (value: unknown) => {
  return value as jest.Mock;
};

const mockEmail = "example@gmail.com";
const mockName = "Benedict";
const mockPassword = "password";
const mockToken = "fake-jwt-token";
const mockOTP = {
  otp: "123456",
  expiresAt: new Date(),
};
const mockUser = {
  _id: "userId",
  name: mockName,
  email: mockEmail,
  password: mockPassword,
};

describe("requestPasswordReset", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should send mail successfully", async () => {
    mockVariable(User.exists).mockResolvedValue(true);
    mockVariable(OTP.deleteMany).mockResolvedValue(true);
    mockVariable(generateOTP).mockReturnValue(mockOTP);
    mockVariable(OTP.create).mockResolvedValue(mockOTP);
    mockVariable(sendMail).mockResolvedValue(undefined);

    const result = await requestPasswordReset(mockEmail);

    expect(User.exists).toHaveBeenCalledWith({ email: mockEmail });
    expect(OTP.deleteMany).toHaveBeenCalledWith({ email: mockEmail });
    expect(sendMail).toHaveBeenCalled();
    expect(result).toEqual({ message: "OTP sent successfully" });
  });

  it("should throw an error when user does not exist", async () => {
    mockVariable(User.exists).mockResolvedValue(false);

    try {
      await requestPasswordReset(mockEmail);
      fail("Function did not throw an error");
    } catch (error) {
      expect(error).toEqual(createHttpError(404, "User not found"));
    }
  });
});

describe("verifyRequest", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should verify request successfully", async () => {
    mockVariable(User.exists).mockResolvedValue(true);
    mockVariable(OTP.findOne).mockResolvedValue(mockOTP);
    mockVariable(validateOTP).mockReturnValue(true);

    const result = await verifyRequest(mockEmail, mockOTP.otp);

    expect(User.exists).toHaveBeenCalledWith({ email: mockEmail });
    expect(OTP.findOne).toHaveBeenCalledWith({
      email: mockEmail,
      otp: mockOTP.otp,
    });
    expect(OTP.deleteMany).toHaveBeenCalledWith({ email: mockEmail });
    expect(result).toEqual({ message: "OTP verified successfully" });
  });

  it("should not run if email does not exist", async () => {
    mockVariable(User.exists).mockResolvedValue(false);

    try {
      await verifyRequest(mockEmail, mockOTP.otp);
      fail("Function did not throw an error");
    } catch (error) {
      expect(error).toEqual(createHttpError(404, "User not found"));
    }
  });

  it("should not run if otp is not found", async () => {
    mockVariable(User.exists).mockResolvedValue(true);
    mockVariable(OTP.findOne).mockResolvedValue(null);

    try {
      await verifyRequest(mockEmail, mockOTP.otp);
      fail("Function did not throw an error");
    } catch (error) {
      expect(error).toEqual(createHttpError(404, "Invalid OTP"));
    }
  });
});

describe("resetUserPassword", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should reset password successfully", async () => {
    mockVariable(User.findOneAndUpdate).mockResolvedValue({
      email: mockEmail,
    });
    mockVariable(bcrypt.hash).mockResolvedValue(mockPassword);
    const result = await resetUserPassword(mockEmail, mockPassword);

    expect(bcrypt.hash).toHaveBeenCalledWith(mockPassword, 10);
    expect(result).toEqual({ message: "Password reset successfully" });
  });

  it("should throw an error if user is not found", async () => {
    mockVariable(User.findOneAndUpdate).mockResolvedValue(null);

    try {
      await resetUserPassword(mockEmail, mockPassword);
      fail("Function did not throw an error");
    } catch (error) {
      expect(error).toEqual(createHttpError(404, "User not found"));
    }
  });
});
