import createServer from "../../utils/server";
import {
  getUser,
  getUsers,
  passwordResetRequest,
  resetPassword,
  verifyPasswordRequest,
} from "../../controllers/user";
import {
  getAllUsers,
  getParticularUser,
  requestPasswordReset,
  resetUserPassword,
  verifyRequest,
} from "../../services/user";
import request from "supertest";
import createHttpError from "http-errors";

jest.mock("../../services/user", () => ({
  requestPasswordReset: jest.fn(),
  resetUserPassword: jest.fn(),
  verifyRequest: jest.fn(),
  getAllUsers: jest.fn(),
  getParticularUser: jest.fn(),
}));

const app = createServer();

const mockUsers = [
  {
    _id: "1",
    email: "ben@example.com",
    password: "fake-password",
    name: "Ben",
  },
  {
    _id: "2",
    email: "john@example.com",
    password: "fake-password",
    name: "John",
  },
];

const mockUser = {
  _id: "1",
  email: "ben@example.com",
  password: "fake-password",
  name: "Ben",
};

describe("User Controllers", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GetUsers", () => {
    it("should get users successfully", async () => {
      (getAllUsers as jest.Mock).mockResolvedValue(mockUsers);

      const response = await request(app).get("/api/user");

      expect(response.status).toBe(200);
      expect(getAllUsers).toHaveBeenCalled();
      expect(response.body).toEqual({
        users: mockUsers,
        success: true,
        count: mockUsers.length,
      });
    });

    it("should call next if error fails", async () => {
      const error = new Error("Failed to get users");
      (getAllUsers as jest.Mock).mockRejectedValue(error);

      const req = jest.fn();
      const res = jest.fn();
      const next = jest.fn();

      await getUsers(req as any, res as any, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("GetUser", () => {
    it("should get user successfully", async () => {
      const mockId = "1";

      (getParticularUser as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app).get(`/api/user/${mockId}`);

      expect(response.status).toBe(200);
      expect(getParticularUser).toHaveBeenCalledWith(mockId);
      expect(response.body).toEqual({
        user: mockUser,
        success: true,
      });
    });

    it("should throw error if id is missing", async () => {
      const req = {
        params: {
          id: "",
        },
      };

      const res = jest.fn();
      const next = jest.fn();

      await getUser(req as any, res as any, next);

      expect(next).toHaveBeenCalledWith(createHttpError(500, "id is missing"));
    });

    it("should call next if user is not found", async () => {
      const error = new Error("User not found");
      (getParticularUser as jest.Mock).mockRejectedValue(error);

      const req = {
        params: {
          id: "1",
        },
      };

      const res = jest.fn();
      const next = jest.fn();

      await getUser(req as any, res as any, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("PasswordResetRequest", () => {
    it("should send a password reset request successfully", async () => {
      const mockEmail = "ben@example.com";
      const mockMessage = "Password reset request sent successfully";

      (requestPasswordReset as jest.Mock).mockResolvedValue({
        message: mockMessage,
      });

      const req = {
        body: {
          email: "ben@example.com",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const next = jest.fn();

      await passwordResetRequest(req as any, res as any, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: mockMessage });
      expect(requestPasswordReset).toHaveBeenCalledWith(mockEmail);
    });

    it("should call next if error fails", async () => {
      const mockEmail = "john@example.com";
      const error = new Error("Password reset request failed");

      (requestPasswordReset as jest.Mock).mockRejectedValue(error);

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

      await passwordResetRequest(req as any, res as any, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(requestPasswordReset).toHaveBeenCalledWith(mockEmail);
    });
  });

  describe("VerifyPasswordRequest", () => {
    it("should verify password request successfully", async () => {
      const mockMessage = "verified successfully";
      const mockEmail = "ben@example.com";
      const mockOTP = "123456";

      (verifyRequest as jest.Mock).mockResolvedValue({
        message: mockMessage,
      });

      const req = {
        body: {
          email: "ben@example.com",
          otp: "123456",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const next = jest.fn();

      await verifyPasswordRequest(req as any, res as any, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: mockMessage });
      expect(verifyRequest).toHaveBeenCalledWith(mockEmail, mockOTP);
    });

    it("should call next if error fails", async () => {
      const mockEmail = "john@example.com";
      const mockOTP = "123456";
      const error = new Error("Verification failed");
      (verifyRequest as jest.Mock).mockRejectedValue(error);

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

      await verifyPasswordRequest(req as any, res as any, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(verifyRequest).toHaveBeenCalledWith(mockEmail, mockOTP);
    });
  });

  describe("ResetPassword", () => {
    it("should reset password successfully", async () => {
      const mockEmail = "ben@example.com";
      const mockMessage = "Password reset successfully";
      const mockPassword = "fake-pass";
      (resetUserPassword as jest.Mock).mockResolvedValue({
        message: mockMessage,
      });

      const req = {
        body: {
          email: "ben@example.com",
          password: mockPassword,
          confirmPassword: mockPassword,
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const next = jest.fn();

      await resetPassword(req as any, res as any, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: mockMessage });
      expect(resetUserPassword).toHaveBeenCalledWith(mockEmail, mockPassword);
    });
  });

  it("should call next if error fails", async () => {
    const error = new Error("Password reset failed");
    const mockEmail = "ben@example.com";
    const mockPassword = "fake-pass";

    (resetUserPassword as jest.Mock).mockRejectedValue(error);

    const req = {
      body: {
        email: "ben@example.com",
        password: mockPassword,
        confirmPassword: mockPassword,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    await resetPassword(req as any, res as any, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(resetUserPassword).toHaveBeenCalledWith(mockEmail, mockPassword);
  });
});
