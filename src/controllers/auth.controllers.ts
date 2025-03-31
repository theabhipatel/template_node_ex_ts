import { RequestHandler } from "express";
import UserModel, { ERoles, EStatus } from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { FRONTEND_URL, JWT_SECRET } from "../config";
import { sendEMail } from "../utils/sendEmail";

export const signupUserHandler: RequestHandler = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      res
        .status(403)
        .json({ success: false, message: "User already registered." });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await UserModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: ERoles.ADMIN,
    });

    res.status(201).json({
      success: true,
      message: "Admin registered successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const signinUserHandler: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email }).lean();
    if (!user) {
      res.status(401).json({ success: false, message: "Invalid credantials." });
      return;
    }

    if (user.status === EStatus.INACTIVE) {
      res.status(401).json({
        success: false,
        message: "User is inactive, please contact to support.",
      });
      return;
    }
    if (user.isDeleted) {
      res.status(403).json({
        success: false,
        message: "This account is deleted, Please contact to support.",
      });
      return;
    }

    const isPasswordMatched = await bcrypt.compare(
      password,
      user.password ?? ""
    );
    if (!isPasswordMatched) {
      res.status(401).json({ success: false, message: "Invalid credantials." });
      return;
    }

    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET
    );

    const { password: _password, ...userFields } = user;

    res.status(200).json({
      success: true,
      message: "User logged in successfully.",
      accessToken,
      user: {
        ...userFields,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPasswordHandler: RequestHandler = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });
      return;
    }

    if (user.status === EStatus.INACTIVE) {
      res.status(403).json({
        success: false,
        message: "User is inactive, please contact to support.",
      });
      return;
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "2m",
    });
    const testMessageUrl = await sendEMail({
      mailTo: email,
      subject: "Reset your password",
      html: `<h1>Hello ${user.firstName}, </h1> <p> please click on the link below and forget your password. 
      </p> <br/> <a target="_blank" href="${FRONTEND_URL}/auth/reset-password?token=${token}">Reset Password</a>`,
    });

    res.status(200).json({
      success: true,
      message: "Forgot password email sent successfully.",
      testMessageUrl,
    });
  } catch (error) {
    next(error);
  }
};

export const resetPasswordHandler: RequestHandler = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const userInfo = jwt.verify(token, JWT_SECRET) as { userId: string };
    if (!userInfo) {
      res.status(403).json({
        success: false,
        message: "Reset password link is invalid or expired.",
      });
      return;
    }
    const user = await UserModel.findById(userInfo.userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      res.status(403).json({
        success: false,
        message: "Reset password link is invalid or expired.",
      });
      return;
    }
    next(error);
  }
};

export const updateUserHandler: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { firstName, lastName } = req.body;

    const user = await UserModel.findByIdAndUpdate(userId, {
      firstName,
      lastName,
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserPasswordHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const userId = req.user.userId;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      res.status(422).json({
        success: false,
        message: "Old and New Password are required to update.",
      });
      return;
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });
      return;
    }

    const isOldPasswordMatch = await bcrypt.compare(
      oldPassword,
      user?.password
    );
    if (!isOldPasswordMatch) {
      res.status(404).json({
        success: false,
        message: "Invalid password.",
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User's password updated successfully.",
    });
  } catch (error) {
    next(error);
  }
};
