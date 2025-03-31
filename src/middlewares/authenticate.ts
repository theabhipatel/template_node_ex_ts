import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { ERoles } from "../models/user.model";

declare global {
  namespace Express {
    interface Request {
      user: {
        userId: string;
        role: ERoles;
      };
    }
  }
}

export const authenticate = (roles: ERoles[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader) {
        const [bearer, token] = authHeader.split(" ");
        if (bearer !== "Bearer") {
          res.status(401).json({
            success: false,
            message: "Please signin first then try again.",
          });
          return;
        }
        if (token) {
          const userInfo = jwt.verify(token, JWT_SECRET) as {
            userId: string;
            role: ERoles;
          };
          if (roles.includes(userInfo.role)) {
            req.user = userInfo;
            next();
            return;
          } else {
            res.status(401).json({
              success: false,
              message: "You are not allowed to access this resource.",
            });
            return;
          }
        }
      }
      res.status(401).json({
        success: false,
        message: "Please signin first then try again.",
      });
      return;
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        res
          .status(401)
          .json({
            success: false,
            message: "Please signin first then try again.",
          });
      }
      console.log(error);
    }
  };
};
