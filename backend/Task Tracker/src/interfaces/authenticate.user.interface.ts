import { Request } from "express";

export interface AuthenticatedRequest<T = any> extends Request {
  user?: {
    userId: string;
    exp: number;
  };
  body: T;
}
