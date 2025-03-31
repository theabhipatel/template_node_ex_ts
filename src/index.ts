import mongoose from "mongoose";
import app from "./app";
import { MONGO_DB_URL, PORT } from "./config";
import { connectDb } from "./utils/connectDb";
import { logger } from "./utils/logger";

/** ---> Listening. */
const server = app.listen(PORT, () => {
  logger.info(`✅ Server is running at http://localhost:${PORT}`);
  connectDb(MONGO_DB_URL);
});

const gracefulShutdown = async (signal: string) => {
  logger.warn(`🛑 Received ${signal}. Closing server...`);

  try {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) {
          logger.error("❌ Error while closing server:", error);
          return reject(error);
        }
        logger.info("✅ Server closed.");
        resolve();
      });
    });

    await mongoose.disconnect();

    process.exit(0);
  } catch (error) {
    logger.error("❌ Error during shutdown:", error);
    process.exit(1);
  }
};

/** ---> Graceful shutting down. */
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

/** ---> Handling uncaught exception */
process.on("uncaughtException", (error) => {
  logger.error("❌ Uncaught Exception:", error);
  gracefulShutdown("uncaughtException");
});

/** ---> Handling unhandled promise rejections */
process.on("unhandledRejection", (reason) => {
  logger.error("❌ Unhandled Rejection:", reason);
  gracefulShutdown("unhandledRejection");
});
