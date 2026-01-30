import bcrypt from "bcrypt";
import { prisma } from "../prisma/prisma";
import type { Response } from "express";
import jwt from "jsonwebtoken";

export async function HashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}
 
export async function ComparePassword(password :string, hashpass : string) {
  return await bcrypt.compare(password,hashpass);
}

export async function generateToken(payload: object) {
  return jwt.sign(payload, process.env.JWT_KEY!);
}

export function VerifyToken(token: string) {
   
   return jwt.verify(token,process.env.JWT_KEY!);
}

export async function EmailExist(res: Response, mail: string) {
  try {
    const check = await prisma.user.findFirst({
      where: {
        email: mail,
      },
    });
    if (check) {
      return res.status(400).json({ error: " Email already exists" });
    }
  } catch (e) {
    res.status(500).send("Internal server error");
  }
}
