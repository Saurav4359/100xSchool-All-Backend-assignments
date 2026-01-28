import type { Request, Response, NextFunction } from "express";
import type { AuthRequest } from "./Authmiddleware";

export const AdminCheck = (user: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log("admin Check");
    if ((req as AuthRequest).role != user) {
      return res.status(401).json({
        error: " Unauthorized",
      });
    }
    next()
  };
};
