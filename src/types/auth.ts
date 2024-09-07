import { registerSchema } from "utils/schemas";
import z from "zod";

export type RegisterRequest = z.infer<typeof registerSchema>;
