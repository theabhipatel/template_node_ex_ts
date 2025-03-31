import { RequestHandler } from "express";
import UserModel, { ERoles, EStatus } from "../models/user.model";
import bcrypt from "bcryptjs";

import { sendEMail } from "../utils/sendEmail";
import { generatePassword } from "../utils/generatePassword";
import { FRONTEND_URL } from "../config";

export const inviteUserHandler: RequestHandler = async (req, res, next) => {
  try {
    const { firstName, lastName, email } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      res
        .status(403)
        .json({ success: false, message: "User already registered." });
      return;
    }

    const password = generatePassword();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await UserModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: ERoles.USER,
    });

    const testUrl = await sendEMail({
      mailTo: email,
      subject: "Welcome to Razer bot",
      html: `<h1>Hello ${firstName}, </h1> <p> Welcome to Razer bot platform, <br/> please find below your login credentials.</p>  <br/>
      <p><b>Email : </b>${email} </p>
      <p><b>Password : </b>${password} </p>
      <a target="_theabhi" href="${FRONTEND_URL}/auth/signin">Sign in</a>`,
    });

    res.status(201).json({
      success: true,
      message: "Invitation sent successfully.",
      testUrl,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsersHandler: RequestHandler = async (req, res, next) => {
  try {
    /** ---> Pagination. */
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;

    /** ---> Basic query. */
    const query: Record<string, any> = {
      _id: { $ne: req.user.userId },
      isDeleted: { $ne: true },
    };

    /** ---> Search query with firstName, lastName and Email. */
    if (req.query.search) {
      query.$or = [
        { firstName: { $regex: req.query.search, $options: "i" } },
        { lastName: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
      ];
    }

    /** ---> Filter user with status. */
    if ("status" in req.query) {
      query.status = req.query.status === "active" ? "active" : "inactive";
    }

    /** ---> Filter data based on Start and End Date. */

    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    if (startDate || endDate) {
      const dateQuery: any = {};

      if (startDate) {
        dateQuery.$gte = new Date(startDate + "T00:00:00Z");
      }

      if (endDate) {
        dateQuery.$lte = new Date(endDate + "T23:59:59Z");
      }

      query.createdAt = dateQuery;
    }

    /** ---> Sorting with firstName, lastName, email and createdAt. */
    type SortOrder = 1 | -1;

    const sortOptions: Record<string, Record<string, SortOrder>> = {
      firstName: { asc: 1, desc: -1 },
      lastName: { asc: 1, desc: -1 },
      email: { asc: 1, desc: -1 },
      age: { asc: 1, desc: -1 },
      createdAt: { asc: 1, desc: -1 },
    };

    let sortQuery: Record<string, SortOrder> = {
      createdAt: -1,
    };

    if (req.query.sortBy && req.query.sortOrder) {
      const column = String(req.query.sortBy);
      const order = String(req.query.sortOrder);

      if (sortOptions[column] && sortOptions[column][order]) {
        sortQuery = { [column]: sortOptions[column][order] };
      }
    }

    const users = await UserModel.find(query)
      .select("-password -__v")
      .sort(sortQuery)
      .skip(skip)
      .limit(limit);

    const totalUsers = await UserModel.find(query).countDocuments();

    res.status(200).json({
      success: true,
      message: "Users fetched successfully.",
      users,
      meta: {
        page,
        limit,
        total: totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
        sortBy: req.query.sortBy ?? "",
        sortOrder: req.query.sortOrder ?? "",
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserByIdHandler: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.params.id;
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

export const softDeleteUserHandler: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const user = await UserModel.findByIdAndUpdate(userId, { isDeleted: true });
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Users deleted successfully.",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleUserStatusHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const userId = req.params.id;
    const { status } = req.body;

    const user = await UserModel.findById(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });
      return;
    }

    user.status = status;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Users status updated successfully.",
      user,
    });
    return;
  } catch (error) {
    next(error);
  }
};
