import { RequestHandler } from "express";
import UserModel from "../models/user.model";
import RazerAccountModel from "../models/razerAccount.model";

export const getUserProfileHandler: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const user = await UserModel.findById(userId).select("-password");

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User profile fetched successfully.",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const getRazerPayDetailsHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const userId = req.user.userId;

    const razerDetails = await RazerAccountModel.find({
      userId,
      isDeleted: false,
    });

    res.status(200).json({
      success: true,
      message: "User's razer pay details fetched successfully.",
      razerDetails,
    });
  } catch (error) {
    next(error);
  }
};

export const createRazerPayDetailHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const userId = req.user.userId;
    const { email, password, authenticatorKey } = req.body;

    await RazerAccountModel.create({
      userId,
      email,
      password,
      authenticatorKey,
    });

    res.status(200).json({
      success: true,
      message: "User's razer pay details created successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const updateRazerPayDetailHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const razerDetailId = req.params.id;
    const { email, password, authenticatorKey } = req.body;

    const razerDetail = await RazerAccountModel.findByIdAndUpdate(
      razerDetailId,
      {
        email,
        password,
        authenticatorKey,
      }
    );

    if (!razerDetail) {
      res.status(404).json({
        success: false,
        message: "Razer Detail not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User's razer pay details updated successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const softDeleteRazerPayDetailHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const razerDetailId = req.params.id;

    const razerDetail = await RazerAccountModel.findById(razerDetailId);

    if (!razerDetail) {
      res.status(404).json({
        success: false,
        message: "Razer Detail not found.",
      });
      return;
    }

    razerDetail.isDeleted = true;
    await razerDetail.save();

    res.status(200).json({
      success: true,
      message: "User's razer  detail deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
