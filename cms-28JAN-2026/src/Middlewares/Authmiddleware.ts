import type { Request, Response, NextFunction } from "express";

import { verifyToken } from "../Services/Services";

export interface AuthRequest extends Request {
  id: string;
  role: "ADMIN" | "USER";
}

export const AuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers["authorization"]!;
  if (!token) {
    return res.status(400).json({
      error: "Token not found",
    });
  }
  const decode = verifyToken(token);
  if (!decode) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }
   
  (req as AuthRequest).id = decode.userId;
  (req as AuthRequest).role = decode.role as "USER" | "ADMIN";
   next()
};
