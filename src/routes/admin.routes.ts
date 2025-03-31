import { Router } from "express";
import {
  getAllUsersHandler,
  inviteUserHandler,
  softDeleteUserHandler,
  toggleUserStatusHandler,
  updateUserByIdHandler,
} from "../controllers/admin.controllers";

const adminRouter = Router();

adminRouter.post("/users/invite", inviteUserHandler);
adminRouter.get("/users", getAllUsersHandler);
adminRouter.patch("/users/:id", updateUserByIdHandler);
adminRouter.delete("/users/:id", softDeleteUserHandler);
adminRouter.patch("/users/status/:id", toggleUserStatusHandler);

export default adminRouter;
