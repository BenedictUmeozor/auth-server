import {
  createUser,
  loginUser,
  sendVerificationCode,
  verifyEmail,
} from "../controllers/auth";
import express from "express";
import { validate } from "../middleware";
import {
  emailResendSchema,
  loginSchema,
  registerSchema,
  verifyEmailSchema,
} from "../utils/schemas";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication related operations
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     description: Registers a new user with the provided email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               name:
 *                 type: string
 *                 example: Benedict Umeozor
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
 *       201:
 *         description: User registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *       400:
 *         description: Email already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email already exists
 */

router.post("/register", validate(registerSchema), createUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     description: Logs in a user with the provided email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: benedict@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 123456789012345678901234
 *                     name:
 *                       type: string
 *                       example: Benedict Umeozor
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: benedict@example.com
 *                     isVerified:
 *                       type: boolean
 *                       example: false
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2021-01-01T00:00:00.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2021-01-01T00:00:00.000Z
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNTUyNjAzMzllNjIwNmU4ZjA3NGY1M2JiZjY3YzQiLCJpYXQiOjE2MDE2MjA4NzgsImV4cCI6MTYxMDg4Mjg3OH0.4Z8Zx8Jq7h4Kw3Qh1FZ4g3q
 */
router.post("/login", validate(loginSchema), loginUser);

/**
 * @swagger
 * /auth/send-verification-code:
 *   post:
 *     summary: Resend verification code
 *     tags: [Auth]
 *     description: Resends the verification code to the user's email
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
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP sent successfully
 */

router.post(
  "/send-verification-code",
  validate(emailResendSchema),
  sendVerificationCode
);

/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *     summary: Verify email
 *     tags: [Auth]
 *     description: Verifies the email address of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: benedict@example.com
 *               otp:
 *                 type: string
 *                 maxLength: 6
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email verified successfully
 */
router.post("/verify-email", validate(verifyEmailSchema), verifyEmail);

export default router;
