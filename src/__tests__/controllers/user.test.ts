import {
  passwordResetRequest,
  resetPassword,
  verifyPasswordRequest,
} from "../../controllers/user";
import {
  requestPasswordReset,
  resetUserPassword,
  verifyRequest,
} from "../../services/user";

jest.mock("../../services/user", () => ({
  requestPasswordReset: jest.fn(),
  resetUserPassword: jest.fn(),
  verifyRequest: jest.fn(),
}));

describe("User Controllers", () => {
  afterEach(() => {
    jest.clearAllMocks();
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
