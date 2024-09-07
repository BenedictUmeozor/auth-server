import express from "express";
import createHttpError from "http-errors";
import { z, ZodError, ZodSchema } from "zod";

export const logger = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  console.log(`${req.method} ${req.path}`);
  next();
};

export const validate =
  <T extends ZodSchema>(schema: T) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(
          createHttpError(400, {
            message: "Validation error",
            details: error.errors,
          })
        );
      }
      next(error);
    }
  };

export const notFound = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const error = createHttpError.NotFound(`not found - ${req.originalUrl}`);
  next(error);
};

export const errorHandler = (
  error: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  let statusCode = 500;
  let message = error.message || "Internal server error";

  if (error instanceof createHttpError.HttpError) {
    statusCode = error.status;
    message = error.message;
    if (error?.details) {
      res.status(statusCode).json({ message, details: error.details });
      return;
    }
  }

  res.status(statusCode).json({ message });
};
