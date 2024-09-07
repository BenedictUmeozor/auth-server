import { resetPasswordSchema } from "../utils/schemas";
import z from "zod";

export type ResetPasswordRequest = z.infer<typeof resetPasswordSchema>;
