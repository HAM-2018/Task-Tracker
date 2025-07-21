import { Request, Response, NextFunction } from "express";
import { StatusCodes, getReasonPhrase } from "http-status-codes";

interface Iresponse {
  status: "success" | "error";
  statusCode: number;
  message: string;
  data?: any;
  error?: any;
  meta?: any;
}

export function responseFormatter(req: Request, res: Response, next: NextFunction) {
  const originalJson = res.json.bind(res);

  res.json = (data: any): Response => {
    // Prevent sending multiple responses
    if (res.headersSent) {
      console.warn("Headers already sent. Skipping second response.");
      return res;
    }

    const statusCode = res.statusCode || StatusCodes.OK;
    const isObject = data && typeof data === "object";

    const response: Iresponse = {
      status: statusCode >= 200 && statusCode < 300 ? "success" : "error",
      statusCode,
      message: getReasonPhrase(statusCode),
    };

    if (statusCode >= 200 && statusCode < 300) {
      response.data = isObject && "meta" in data ? data.data : data;
    }

    if (statusCode >= 300) {
      response.error = data;
    }

    if (isObject && "meta" in data) {
      response.meta = data.meta;
    }

    return originalJson(response);
  };

  next();
}
