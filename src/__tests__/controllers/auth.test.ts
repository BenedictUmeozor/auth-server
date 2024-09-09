import {
  createUser,
  loginUser,
  sendVerificationCode,
  verifyEmail,
} from "../../controllers/auth";
import {
  registerUser,
  loginUserIn,
  sendCode,
  verifyCode,
} from "../../services/auth";

jest.mock("../../services/auth", () => ({
  registerUser: jest.fn(),
  loginUserIn: jest.fn(),
  sendCode: jest.fn(),
  verifyCode: jest.fn(),
}));

describe("Auth Controllers", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createUser", () => {
    it("should register a user successfully", async () => {
      const mockUser = { id: "1", name: "John Doe", email: "john@example.com" };
      const mockToken = "fake-jwt-token";

      (registerUser as jest.Mock).mockResolvedValue({
        user: mockUser,
        token: mockToken,
      });

      const req = {
        body: {
          name: "John Doe",
          email: "john@example.com",
          password: "password123",
          confirmPassword: "password123",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const next = jest.fn();

      await createUser(req as any, res as any, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "User created successfully",
        user: mockUser,
        token: mockToken,
      });
      expect(registerUser).toHaveBeenCalledWith(
        "John Doe",
        "john@example.com",
        "password123"
      );
    });

    it("should call next with error if registration fails", async () => {
      const error = new Error("Registration failed");
      (registerUser as jest.Mock).mockRejectedValue(error);

      const req = {
        body: {
          name: "John Doe",
          email: "john@example.com",
          password: "password123",
          confirmPassword: "password123",
        },
      };

      const res = {
        status: jest.fn(),
        json: jest.fn(),
      };

      const next = jest.fn();

      await createUser(req as any, res as any, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("loginUser", () => {
    it("should log in a user successfully", async () => {
      const mockUser = { id: "1", name: "John Doe", email: "john@example.com" };
      const mockToken = "fake-jwt-token";

      (loginUserIn as jest.Mock).mockResolvedValue({
        user: mockUser,
        token: mockToken,
      });

      const req = {
        body: {
          email: "john@example.com",
          password: "password123",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const next = jest.fn();

      await loginUser(req as any, res as any, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Login successful",
        user: mockUser,
        token: mockToken,
      });
      expect(loginUserIn).toHaveBeenCalledWith(
        "john@example.com",
        "password123"
      );
    });

    it("should call next with error if login fails", async () => {
      const error = new Error("Login failed");
      (loginUserIn as jest.Mock).mockRejectedValue(error);

      const req = {
        body: {
          email: "john@example.com",
          password: "password123",
        },
      };

      const res = {
        status: jest.fn(),
        json: jest.fn(),
      };

      const next = jest.fn();

      await loginUser(req as any, res as any, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("sendVerificationCode", () => {
    it("should send a verification code successfully", async () => {
      (sendCode as jest.Mock).mockResolvedValue({ message: "Code sent" });

      const req = {
        body: {
          email: "john@example.com",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const next = jest.fn();

      await sendVerificationCode(req as any, res as any, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Code sent" });
      expect(sendCode).toHaveBeenCalledWith("john@example.com");
    });

    it("should call next with error if sending code fails", async () => {
      const error = new Error("Sending code failed");
      (sendCode as jest.Mock).mockRejectedValue(error);

      const req = {
        body: {
          email: "john@example.com",
        },
      };

      const res = {
        status: jest.fn(),
        json: jest.fn(),
      };

      const next = jest.fn();

      await sendVerificationCode(req as any, res as any, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("verifyEmail", () => {
    it("should verify email successfully", async () => {
      (verifyCode as jest.Mock).mockResolvedValue({
        message: "Email verified",
      });

      const req = {
        body: {
          email: "john@example.com",
          otp: "123456",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const next = jest.fn();

      await verifyEmail(req as any, res as any, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Email verified" });
      expect(verifyCode).toHaveBeenCalledWith("john@example.com", "123456");
    });

    it("should call next with error if verification fails", async () => {
      const error = new Error("Verification failed");
      (verifyCode as jest.Mock).mockRejectedValue(error);

      const req = {
        body: {
          email: "john@example.com",
          otp: "123456",
        },
      };

      const res = {
        status: jest.fn(),
        json: jest.fn(),
      };

      const next = jest.fn();

      await verifyEmail(req as any, res as any, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
