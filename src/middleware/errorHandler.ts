import { Request, Response, NextFunction } from "express";

export function requestLogger(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

  next();
}

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(`[${new Date().toISOString()}] Error:`, err.message);

  res.status(500).json({
    error: err.message,
  });
}
