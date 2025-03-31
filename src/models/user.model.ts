import { Document, Schema, model } from "mongoose";

export enum ERoles {
  ADMIN = "admin",
  USER = "user",
}

export enum EStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

interface IBaseUser {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
  razerPayEmail: string;
  razerPayPassword: string;
  authenticatorKey: string;
  role: ERoles;
  status: EStatus;
  isDeleted: boolean;
}

interface IUserSchema extends Document, IBaseUser {}

const userSchema = new Schema<IUserSchema>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    mobile: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    razerPayEmail: {
      type: String,
    },
    razerPayPassword: {
      type: String,
    },
    authenticatorKey: {
      type: String,
    },
    role: {
      type: String,
      enum: ERoles,
      default: ERoles.USER,
    },
    status: {
      type: String,
      enum: EStatus,
      default: EStatus.ACTIVE,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const UserModel = model<IUserSchema>("user", userSchema);
export default UserModel;
