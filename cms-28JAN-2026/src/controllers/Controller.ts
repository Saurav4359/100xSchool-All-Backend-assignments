import type { Request, Response } from "express";
import { Course, Lesson, Signin, Signup, subscribe } from "../types/Zod";
import { prisma } from "../Database/prisma";
import {
  checkCourse,
  checkCourse_AdminExist,
  CheckEmail,
  checkEnrollment,
  generateToken,
  HashPassword,
} from "../Services/Services";
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
    res.send("Error Occured ");
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
    res.send("Error Occured ");
  }
};

export const getCourse = async (req: Request, res: Response) => {
  try {
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
        adminId: true,
      },
    });
    res.status(201).json(course);
  } catch (e) {
    res.send("Error Occured ");
  }
};

export const lesson = async (req: Request, res: Response) => {
  const courseId = req.params.courseId as string;
  await checkCourse(res, courseId);
  await checkCourse_AdminExist((req as AuthRequest).id, res);
  const { success, data } = Lesson.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      success: false,
      data: null,
      error: "InValid Input",
    });
  }
  try {
    await prisma.lecture.create({
      data: {
        title: data.title,
        videoUrl: data.videoUrl,
        order: data.order,
        courseId: courseId,
      },
    });

    res.status(200).json({
      message: "Lecture added successfully",
    });
  } catch (e) {
    res.send("Error Occured ");
  }
};

export const getLesson = async (req: Request, res: Response) => {
  const courseId = req.params.courseId as string;
  try {
    const lecture = await prisma.lecture.findMany({
      where: {
        courseId,
      },
    });
    if (!lecture) {
      return res.status(404).json({
        message: "Lectures not available",
      });
    }
    res.status(200).json(lecture);
  } catch (e) {
    res.send("Error Occured ");
  }
};

export const Purchase = async (req: Request, res: Response) => {
  const courseId = req.params.courseId as string;
  await checkEnrollment(res, courseId, (req as AuthRequest).id);
  await checkCourse(res, courseId);
  const { success, data } = subscribe.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      success: false,
      data: null,
      error: "InValid Input",
    });
  }
  try {
    const subscription = prisma.subscription.create({
      data: {
        userId: (req as AuthRequest).id,
        courseId: courseId,
        amount: data.amount,
        status: "SUCCESS",
      },
    });

    const Enroll = prisma.enrollment.create({
      data: {
        userId: (req as AuthRequest).id,
        courseId: courseId,
      },
    });
    const transactions = await prisma.$transaction([subscription, Enroll]);
    console.log(transactions);
    if (!transactions) {
      await prisma.subscription.create({
        data: {
          userId: (req as AuthRequest).id,
          courseId: courseId,
          amount: data.amount,
          status: "FAILED",
        },
      });
      return res.status(500).json({
        message: "Transaction failed",
      });
    }

    res.status(200).json({
      message: "Course purchased successfully",
    });
  } catch (e) {
    res.send("Error Occured !");
  }
};

export const getEnroll = async (req: Request, res: Response) => {
  const getEnroll = await prisma.enrollment.findMany({
    where: {
      userId: (req as AuthRequest).id,
    },
    include: {
      Course: {
        select: {
          title: true,
        },
      },
    },
    omit: {
      userId: true,
      id: true,
    },
  });
  res.send(getEnroll);
};


export const getSubscriptions= async (req: Request, res: Response) =>{
  const subs= await prisma.subscription.findMany({
    where :{
       userId: (req as AuthRequest).id,
    },omit: {
      id: true,
      userId :true
    }
  })

  res.status(200).json(subs);
}