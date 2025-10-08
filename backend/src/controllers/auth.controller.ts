import { Request, Response } from "express";
import UserModel from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const accessTokenExpiry = "10m";

interface PayloadInterface {
  id: mongoose.Types.ObjectId;
  fullname: string;
  email: string;
  mobile: string;
}

const generateToken = (payload: PayloadInterface) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: accessTokenExpiry,
  });
  return token;
};

export const signup = async (req: Request, res: Response) => {
  try {
    await UserModel.create(req.body);
    res.json({ messsage: "Success" });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) throw new Error("User not found, please try to signup first");

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) throw new Error("Invalid email or password");

    const payload = {
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      mobile: user.mobile,
    };

    const accessToken = generateToken(payload);
    const options = {
        httpOnly:true,
        maxAge:(10*60)
    }
    res.cookie("accessToken",accessToken,options)
    res.json({ message:"Login successful" });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
  } catch (error) {}
};
