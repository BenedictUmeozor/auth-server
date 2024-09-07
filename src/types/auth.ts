import {
  emailResendSchema,
  loginSchema,
  registerSchema,
  verifyEmailSchema,
} from "utils/schemas";
import z from "zod";

export type RegisterRequest = z.infer<typeof registerSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export type EmailResendRequest = z.infer<typeof emailResendSchema>;
export type VerifyEmailRequest = z.infer<typeof verifyEmailSchema>;
