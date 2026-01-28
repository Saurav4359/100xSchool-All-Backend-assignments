import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../Database/prisma";

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


export const generateToken= (payload: object)=> {
  return jwt.sign(payload,process.env.JWT_KEY!)
}

interface payload {
    userId :string
    role : string
}
export const verifyToken=(token :string)=> {
    return jwt.verify(token,process.env.JWT_KEY!) as payload
}

 