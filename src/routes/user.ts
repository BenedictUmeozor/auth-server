import {
  passwordResetRequest,
  resetPassword,
  verifyPasswordRequest,
} from "../controllers/user";
import express from "express";
import { validate } from "../middleware";
import {
  emailResendSchema as passwordResetRequestSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "../utils/schemas";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: User management operations
 */

/**
 * @swagger
 * /user/request-password-reset:
 *   post:
 *     summary: Request password reset
 *     tags: [User]
 *     description: Requests a password reset for the user with the provided email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: benedict@example.com
 *     responses:
 *       200:
 *         description: Password reset email sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset email sent. Check your email for the next steps
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 */

router.post(
  "/request-password-reset",
  validate(passwordResetRequestSchema),
  passwordResetRequest
);

/**
 * @swagger
 * /user/verify-password-reset:
 *   post:
 *     summary: Verify password reset
 *     tags: [User]
 *     description: Verifies the OTP sent to the user's email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *               - email
 *             properties:
 *               otp:
 *                 type: string
 *                 maxLength: 6
 *                 example: 123456
 *               email:
 *                 type: string
 *                 format: email
 *                 example: benedict@example.com
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP verified successfully
 *       404:
 *         description: OTP is invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP is invalid
 */
router.post(
  "/verify-password-reset",
  validate(verifyEmailSchema),
  verifyPasswordRequest
);

/**
 * @swagger
 * /user/password-reset:
 *   patch:
 *     summary: Reset password
 *     tags: [User]
 *     description: Resets the password for the user with the provided email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: benedict@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset successfully
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 */
router.patch("/password-reset", validate(resetPasswordSchema), resetPassword);

export default router;
