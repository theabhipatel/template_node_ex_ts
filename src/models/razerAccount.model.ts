import { Document, Schema, model } from "mongoose";

interface IBaseRazerAccount {
  userId: string;
  email: string;
  password: string;
  authenticatorKey: string;
  isDeleted: boolean;
}

interface IRazerAccountSchema extends Document, IBaseRazerAccount {}

const razerAccountSchema = new Schema<IRazerAccountSchema>(
  {
    userId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    authenticatorKey: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const RazerAccountModel = model<IRazerAccountSchema>(
  "razer_account",
  razerAccountSchema
);
export default RazerAccountModel;
