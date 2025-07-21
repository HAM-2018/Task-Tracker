import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../interfaces/authenticate.user.interface";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export interface JwtPayload {
  userId: string;
  exp: number;
  username: string,
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
   console.log("authenticate() called");
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
     console.warn("No token provided or bad format");
    res.status(401).json({ error: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    console.log("Token decoded:", decoded);
    (req as AuthenticatedRequest<any>).user= decoded; // attach user to request
    next();
  } catch (err) {
    console.error("Token invalid or expired:", err);
    res.status(401).json({ error: "Token expired or invalid" });
    return;
  }
};
