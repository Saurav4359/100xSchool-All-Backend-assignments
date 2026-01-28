import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { Response } from "express";
import { prisma } from "../Database/prisma";
import type { AuthRequest } from "../Middlewares/Authmiddleware";

export const HashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const CheckEmail = async (email: string) => {
  const check = await prisma.user.findFirst({
    where: {
      email: email,
    },
    omit: {
      password: true,
    },
  });

  if (!check) {
    return false;
  } else {
    return true;
  }
};

export const generateToken = (payload: object) => {
  return jwt.sign(payload, process.env.JWT_KEY!);
};

interface payload {
  userId: string;
  role: string;
}
export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_KEY!) as payload;
};

export const checkCourse_AdminExist = async (
  adminId: string,
  res: Response,
  courseId: string,
) => {
  const checkAdmin = await prisma.course.findFirst({
    where: {
      adminId,
    },
  });
  if (!checkAdmin) {
    return res.status(404).json({
      message: "Not course admin",
    });
  }

  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
    },
  });
  if (!course) {
    return res.status(404).json({
      message: "Course not found",
    });
  }
};

export const checkCourse = async (res: Response, courseId: string) => {
  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
    },
  });
  if (!course) {
    return res.status(404).json({
      message: "Course not found",
    });
  }
};

export const checkEnrollment = async (
  res: Response,
  courseId: string,
  userId: string,
) => {
  const enroll = await prisma.enrollment.findFirst({
    where: {
      courseId: courseId,
      userId: userId,
    },
  });
  if (enroll) {
    return res.status(400).json({ message: "Already enrolled" });
  }
};
