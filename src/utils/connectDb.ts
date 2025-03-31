import mongoose from "mongoose";
import { logger } from "./logger";

export const connectDb = async (url: string) => {
  try {
    await mongoose.connect(url);
    logger.info("✅ Database connected successfully ...");
  } catch (error) {
    logger.error("❌ Database not connected !!!");
    logger.error(error);
  }
};
