import { Request, Response } from "express";
import UserModel from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { catchError, TryError } from "../utils/error";

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
  } catch (error: unknown) {
    catchError(error, res);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user)
      throw TryError("User not found, please try to signup first", 404);

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) throw TryError("Invalid email or password", 401);

    const payload = {
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      mobile: user.mobile,
    };

    const accessToken = generateToken(payload);
    const options = {
      httpOnly: true,
      maxAge: 1000 * 60 * 10,
      secure: process.env.NODE_ENV === "production",
      domain: "localhost",
    };
    res.cookie("accessToken", accessToken, options);
    res.json({ message: "Login successful" });
  } catch (error: unknown) {
    catchError(error, res);
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
  } catch (error) {}
};

export const getSession = async (req:Request,res:Response) => {
  try {
    const accessToken = req.cookies.accessToken
    if(!accessToken)
      throw TryError("Invalid Session",401)

    const session = await jwt.verify(accessToken,process.env.JWT_SECRET!)
    res.json(session)
  } catch (error) {
    catchError(error,res,"Invalid Session")
  }
}