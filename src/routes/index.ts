import { Router } from "express";
import authRouter from "./auth.routes";
import adminRouter from "./admin.routes";
import { authenticate } from "../middlewares/authenticate";
import { ERoles } from "../models/user.model";
import userRouter from "./user.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/admin", authenticate([ERoles.ADMIN]), adminRouter);
router.use("/users", authenticate([ERoles.USER]), userRouter);

export default router;
