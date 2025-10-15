import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";


const userSchema = new Schema(
  {
    image: {
      type: String,
      default: null,
    },
    fullname: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    refreshToken: {
      type: String,
    },
    expiry: {
      type: Date,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password.toString(), 12);
  next();
});

userSchema.pre("save", async function (next) {
  this.refreshToken = null
  this.expiry = null
  next()
});

const UserModel = model("User", userSchema);
export default UserModel;
