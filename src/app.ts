import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import { errorHandler } from "./middlewares/errorHandler";
import router from "./routes";
import { httpLogger } from "./utils/httpLogger";

const app = express();

/** ---> Registering middlewares. */
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later.",
  })
);
app.use(httpLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
app.use(compression());

/** ---> Handling home route. */
app.get("/", async (req, res) => {
  res.status(200).json({
    success: true,
    message: `Welcome to ${process.env.NODE_ENV} home route.`,
  });
  return;
});

/** ---> Handling all routes. */
app.use("/api/v1", router);

/** ---> Handling 404 not found route. */
app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
  return;
});

/** ---> Registering Global error handler. */
app.use(errorHandler);

export default app;
