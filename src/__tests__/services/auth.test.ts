import User from "../../models/user";
import OTP from "../../models/otp";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendMail } from "../../lib/sendgrid";
import { generateOTP, validateOTP } from "../../utils/functions";
import {
  loginUserIn,
  registerUser,
  sendCode,
  verifyCode,
} from "../../services/auth";
import createHttpError from "http-errors";

jest.mock("../../lib/sendgrid");
jest.mock("../../utils/functions");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../../models/user");
jest.mock("../../models/otp");

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

describe("Auth Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("registerUser", () => {
    it("should create a new user", async () => {
      (User.exists as jest.Mock).mockResolvedValue(false);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
      (User.create as jest.Mock).mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);
      (generateOTP as jest.Mock).mockReturnValue(mockOTP);
      (OTP.create as jest.Mock).mockResolvedValue(mockOTP);
      (sendMail as jest.Mock).mockResolvedValue(undefined);

      const result = await registerUser(mockName, mockEmail, mockPassword);

      expect(User.exists).toHaveBeenCalledWith({ email: mockEmail });
      expect(bcrypt.hash).toHaveBeenCalledWith(mockPassword, 10);
      expect(jwt.sign).toHaveBeenCalled();
      expect(generateOTP).toHaveBeenCalled();
      expect(sendMail).toHaveBeenCalled();
      expect(result).toEqual({
        user: mockUser,
        token: mockToken,
      });
    });

    it("should throw an error if the user already exists", async () => {
      (User.exists as jest.Mock).mockResolvedValue(true);

      await expect(
        registerUser("John Doe", "johndoe@example.com", "password123")
      ).rejects.toThrow(
        createHttpError(409, "User with this email already exists")
      );
    });
  });

  describe("loginUserIn", () => {
    it("should login a user successfully", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      const result = await loginUserIn(mockEmail, mockPassword);

      expect(User.findOne).toHaveBeenCalledWith({ email: mockEmail });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        mockPassword,
        mockUser.password
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: "userId" },
        process.env.SECRET_KEY!,
        { expiresIn: "1d" }
      );
      expect(result).toEqual({
        user: mockUser,
        token: mockToken,
      });
    });

    it("should not run if user is not found", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(loginUserIn(mockEmail, mockPassword)).rejects.toThrow(
        createHttpError(401, "Invalid email or password")
      );
      expect(User.findOne).toHaveBeenCalledWith({ email: "example@gmail.com" });
    });

    it("should not run if password is incorrect", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(loginUserIn(mockEmail, mockPassword)).rejects.toThrow(
        createHttpError(401, "Invalid email or password")
      );
    });
  });

  describe("sendCode", () => {
    it("should send code", async () => {
      (User.exists as jest.Mock).mockResolvedValue(true);
      (generateOTP as jest.Mock).mockResolvedValue(mockOTP);
      (OTP.create as jest.Mock).mockResolvedValue(mockOTP);
      (sendMail as jest.Mock).mockResolvedValue(undefined);

      const result = await sendCode(mockEmail);

      expect(User.exists).toHaveBeenCalledWith({ email: mockEmail });
      expect(OTP.deleteMany).toHaveBeenCalledWith({ email: mockEmail });
      expect(sendMail).toHaveBeenCalled();
      expect(result).toEqual({ message: "OTP sent successfully" });
    });

    it("should not run if user is not found", async () => {
      (User.exists as jest.Mock).mockResolvedValue(false);

      await expect(sendCode(mockEmail)).rejects.toThrow(
        createHttpError(404, "User not found")
      );
    });
  });

  describe("VerifyCode", () => {
    it("should verify code", async () => {
      (User.exists as jest.Mock).mockResolvedValue(true);
      (OTP.findOne as jest.Mock).mockResolvedValue(mockOTP);
      (validateOTP as jest.Mock).mockReturnValue(true);
      const result = await verifyCode(mockEmail, mockOTP.otp);

      expect(User.exists).toHaveBeenCalledWith({ email: mockEmail });
      expect(OTP.findOne).toHaveBeenCalledWith({ email: mockEmail });
      expect(validateOTP).toHaveBeenCalledWith(
        mockOTP.otp,
        mockOTP.otp,
        expect.any(Date)
      );
      expect(result).toEqual({ message: "Email verified successfully" });
    });

    it("should fail if user is not found", async () => {
      (User.exists as jest.Mock).mockResolvedValue(false);

      await expect(verifyCode(mockEmail, mockOTP.otp)).rejects.toThrow(
        createHttpError(404, "User not found")
      );
    });

    it("should fail if otp is not found", async () => {
      (User.exists as jest.Mock).mockResolvedValue(true);
      (OTP.findOne as jest.Mock).mockResolvedValue(null);

      await expect(verifyCode(mockEmail, mockOTP.otp)).rejects.toThrow(
        createHttpError(401, "OTP is not valid")
      );
    });

    it("should fail if otp is not valid", async () => {
      (User.exists as jest.Mock).mockResolvedValue(true);
      (OTP.findOne as jest.Mock).mockResolvedValue({
        email: expect.any(String),
        otp: "123456",
        expiresAt: new Date(),
      });
      (validateOTP as jest.Mock).mockReturnValue(false);

      await expect(verifyCode(mockEmail, mockOTP.otp)).rejects.toThrow(
        createHttpError(401, "OTP is not valid")
      );
    });
  });
});
