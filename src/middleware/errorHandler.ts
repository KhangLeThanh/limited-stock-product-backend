import { Request, Response, NextFunction } from "express";

// Structured logger for requests
export function requestLogger(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
}

// Custom error interface (optional: include status code)
interface AppError extends Error {
  statusCode?: number;
}

// Centralized error handler
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Type guard to check if err is AppError
  const error = err instanceof Error ? err : new Error("Unknown error");

  // If err has statusCode, use it, otherwise default to 500
  const statusCode = (err as AppError).statusCode ?? 500;

  console.error(`[${new Date().toISOString()}] Error:`, error.message);

  res.status(statusCode).json({
    error: error.message,
  });
}
