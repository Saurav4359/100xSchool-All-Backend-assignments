import type { NextFunction, Request, Response } from "express";
import { VerifyToken } from "../services/services";

export interface Authreq extends Request {
  id: string;
  role: "USER" | "SERVICE_PROVIDER";
}

export function AuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.headers["authorization"] as string;
  if (!token) {
    res.status(400).send("Token not found");
  }
  const decode = VerifyToken(token) as {
    userId: string;
    role: "USER" | "SERVICE_PROVIDER";
  };
  console.log(decode);
  (req as Authreq).id = decode.userId;
  (req as Authreq).role = decode.role;
  next();
}
