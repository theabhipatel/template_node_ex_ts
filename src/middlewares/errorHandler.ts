import { ErrorRequestHandler } from "express";
import { logger } from "../utils/logger";

export const errorHandler: ErrorRequestHandler = async (
  err,
  req,
  res,
  next
) => {
  logger.error(
    `🚨 Error on [${req.method}] [${req.url}] : ${err.message}`,
    err
  );

  res.status(500).json({ success: false, message: "Something went wrong." });
  return;
};
