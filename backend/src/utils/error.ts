import { Response } from "express";

interface ErrorMessage extends Error {
  status?: number;
}

export const TryError = (message: string, status: number = 500) => {
  const err: ErrorMessage = new Error(message);
  err.status = status;
  return err;
};

export const catchError = (
  error: unknown,
  res: Response,
  message: string = "internal server error"
) => {
  if (error instanceof Error) {
    const msg = process.env.NODE_ENV === "dev" ? error.message : message;
    const status = (error as ErrorMessage).status || 500;
    res.status(status).json({
      message: msg,
    });
  }
};
