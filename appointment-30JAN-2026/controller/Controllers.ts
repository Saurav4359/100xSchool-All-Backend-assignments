import type { Request, Response } from "express";
import { service, signin, signup } from "../types/Zod";
import { prisma } from "../prisma/prisma";
import {
  ComparePassword,
  EmailExist,
  generateToken,
  HashPassword,
} from "../services/services";
import type { Authreq } from "../Middlewares/AuthMiddleware";

export const Signup = async (req: Request, res: Response) => {
  const { success, data } = signup.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ error: " Invalid input" });
  }
  await EmailExist(res, data.email);

  try {
    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: await HashPassword(data.password),
        role: data.role,
      },
    });
    res.status(200).json({
      message: "User created Successfully ",
    });
  } catch (e) {
    res.send("Error Occured");
  }
};

export const Signin = async (req: Request, res: Response) => {
  const { success, data } = signin.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ error: " Invalid input" });
  }
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (!(await ComparePassword(data.password, user.password))) {
      return res.status(401).json({ message: "Wrong password" });
    }
    const token = await generateToken({ userId: user.id, role: user.role });
    res.status(200).json({ token: token });
  } catch (e) {
    res.status(500).send("Internal server error");
  }
};

export const Service = async (req: Request, res: Response) => {
  const { success, data } = service.safeParse(req.body);
  console.log((req as Authreq).id);
  if (!success) {
    return res.status(400).json({ error: " Invalid input" });
  }

  try {
     
    const service = await prisma.service.create({
      data: {
        name: data.name,
        type: data.type,
        durationMinutes: data.durationMinutes,
        providerId: (req as Authreq).id,
      },
    });
    res.status(200).json({
      id: service.id,
      name: service.name,
      type: service.type,
      durationMinutes: service.durationMinutes,
    });
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
  }
};
