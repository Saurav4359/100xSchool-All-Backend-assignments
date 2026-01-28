import type { Request, Response } from "express";
import { Course, Signin, Signup } from "../types/Zod";
import { prisma } from "../Database/prisma";
import { CheckEmail, generateToken, HashPassword } from "../Services/Services";
import type { AuthRequest } from "../Middlewares/Authmiddleware";

export const signup = async (req: Request, res: Response) => {
  const { success, data, error } = Signup.safeParse(req.body);

  if (!success) {
    return res.status(400).json({
      success: false,
      data: null,
      error: "InValid Input",
    });
  }
  try {
    if (await CheckEmail(data.email)) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: await HashPassword(data.password),
        role: data.role,
      },
    });

    res.status(200).json({
      message: "User created successfully",
    });
  } catch (e) {
    res.send("Error Occured ");
  }
};

export const signin = async (req: Request, res: Response) => {
  const { success, data } = Signin.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      success: false,
      data: null,
      error: "InValid Input",
    });
  }
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: data.email,
      },
      omit: {
        password: true,
      },
    });
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    const token = generateToken({ userId: user.id, role: user.role });

    res.status(200).json({
      token,
    });
  } catch (e) {
    console.log("Error occured !");
  }
};

export const course = async (req: Request, res: Response) => {
  console.log((req as AuthRequest).id);
  const { success, data } = Course.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      success: false,
      data: null,
      error: "InValid Input",
    });
  }
  try {
    const course = await prisma.course.create({
      data: {
        title: data.title,
        description: data.description,
        amount: data.amount,
        adminId: (req as AuthRequest).id,
      },
    });
    res.status(200).json({
      id: course.id,
      title: course.title,
    });
  } catch (e) {
    console.log("Error Occured ");
  }
};

export const getCourse = async (req: Request, res: Response) => {
  const course = await prisma.course.findMany({
    include: {
     
      Admin: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    omit: {
      description: true,
      amount: true,
      adminId :true
    },
  });
  res.status(201).json(course);
};
