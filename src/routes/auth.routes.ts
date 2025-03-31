import { Router } from "express";
import {
  forgotPasswordHandler,
  resetPasswordHandler,
  signinUserHandler,
  signupUserHandler,
  updateUserHandler,
  updateUserPasswordHandler,
} from "../controllers/auth.controllers";
import { authenticate } from "../middlewares/authenticate";
import { ERoles } from "../models/user.model";

const authRouter = Router();

authRouter.post("/signup", signupUserHandler);
authRouter.post("/signin", signinUserHandler);
authRouter.post("/forgot-password", forgotPasswordHandler);
authRouter.post("/reset-password", resetPasswordHandler);
authRouter.patch(
  "/profile",
  authenticate([ERoles.ADMIN, ERoles.USER]),
  updateUserHandler
);
authRouter.patch(
  "/profile/update-password",
  authenticate([ERoles.ADMIN, ERoles.USER]),
  updateUserPasswordHandler
);

export default authRouter;
