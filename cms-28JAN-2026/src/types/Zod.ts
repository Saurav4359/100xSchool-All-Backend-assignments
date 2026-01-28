import z from "zod";

export const Signup = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
  role: z.enum(["USER", "ADMIN"]),
});

export const Signin = z.object({
  email: z.email(),
  password: z.string(),
});

export const Course = z.object({
  title: z.string(),
  description: z.string(),
  amount: z.number(),
});

export const Lesson = z.object({
  title: z.string(),
  videoUrl: z.string(),
  order: z.number(),
});

export const subscribe = z.object({
  amount: z.number(),
});
