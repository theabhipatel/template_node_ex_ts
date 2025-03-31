import { Router } from "express";
import {
  createRazerPayDetailHandler,
  getRazerPayDetailsHandler,
  getUserProfileHandler,
  softDeleteRazerPayDetailHandler,
  updateRazerPayDetailHandler,
} from "../controllers/user.controllers";

const userRouter = Router();

userRouter.get("/me", getUserProfileHandler);
userRouter.get("/razer-pay-details", getRazerPayDetailsHandler);
userRouter.post("/razer-pay-details", createRazerPayDetailHandler);
userRouter.patch("/razer-pay-details/:id", updateRazerPayDetailHandler);
userRouter.delete("/razer-pay-details/:id", softDeleteRazerPayDetailHandler);

export default userRouter;
