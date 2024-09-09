import {
  getUser,
  getUsers,
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
 * /user:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     description: Returns all users in the system
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  results:
 *                     type: array
 *                     items:
 *                     $ref: '#/components/schemas/User'
 *                  count:
 *                     type: number
 *                  success:
 *                     type: boolean
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the user
 *         name:
 *           type: string
 *           description: The user's name
 *         email:
 *           type: string
 *           description: The user's email address
 *         isVerified:
 *           type: boolean
 *           description: Indicates if the user's email has been verified
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The time the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The time the user was last updated
 *       example:
 *         id: "60f7c39a93b9d60017d9d5a4"
 *         name: "Benedict Umeozor"
 *         email: "benedict@example.com"
 *         isVerified: false
 *         createdAt: "2024-09-07T09:21:30.123Z"
 *         updatedAt: "2024-09-07T09:21:30.123Z"
 */

router.get("/", getUsers);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [User]
 *     description: Returns a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the user to retrieve
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: A user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", getUser);

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
