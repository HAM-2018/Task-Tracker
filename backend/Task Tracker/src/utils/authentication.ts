import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
};

export const verifyPassword = async (password: string, hash: string) => {
    return await bcrypt.compare(password, hash);
};

export const generateToken = (payload: {userId: string; username: string}) => {
  return jwt.sign( payload, JWT_SECRET, { expiresIn: "2h" });
};

export function verifyToken (token: string) : {userId: string} {
  try {
    return jwt.verify(token, JWT_SECRET) as {userId: string};
  } catch (error: any) {
    throw new Error("Invalid or expired token");
  }
}