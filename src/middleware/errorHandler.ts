import { Request, Response, NextFunction } from "express";

// Request logger
export function requestLogger(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
}

// Centralized error handler
interface AppError extends Error {
  statusCode?: number;
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const error = err instanceof Error ? err : new Error("Unknown error");
  const statusCode = (err as AppError).statusCode ?? 500;

  console.error(`[${new Date().toISOString()}] Error:`, error.message);

  res.status(statusCode).json({ error: error.message });
}
