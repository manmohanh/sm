import { Request, Response } from "express";
import UserModel from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import moment from "moment";
import { catchError, TryError } from "../utils/error";
import {
  PayloadInterface,
  SessionInterface,
} from "../middlewares/auth.middleware";
import { downloadObject } from "../utils/s3";

const accessTokenExpiry = "10m";
const tenMinutesInMs = 7 * 1000 * 60 * 60 * 10;
const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;

type TokenType = "at" | "rt";

const generateToken = (payload: PayloadInterface) => {
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: accessTokenExpiry,
  });
  const refreshToken = uuid();
  return {
    accessToken,
    refreshToken,
  };
};

const getOptions = (tokenType: TokenType) => {
  return {
    httpOnly: true,
    maxAge: tokenType === "at" ? tenMinutesInMs : sevenDaysInMs,
    secure: process.env.NODE_ENV === "production",
    domain: "localhost",
  };
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

    const image = user.image;
    const payload = {
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      mobile: user.mobile,
      image,
    };
    const { accessToken, refreshToken } = generateToken(payload);

    await UserModel.updateOne(
      { _id: user._id },
      {
        $set: {
          refreshToken,
          expiry: moment().add(7, "days").toDate(),
        },
      }
    );

    res.cookie("accessToken", accessToken, getOptions("at"));
    res.cookie("refreshToken", refreshToken, getOptions("rt"));
    res.json({ message: "Login successful" });
  } catch (error: unknown) {
    catchError(error, res);
  }
};

export const refreshToken = async (req: SessionInterface, res: Response) => {
  try {
    if (!req.session) throw TryError("Failed to refresh token", 401);

  
    const { accessToken, refreshToken } = generateToken(req.session);
    await UserModel.updateOne(
      { _id: req.session.id },
      {
        $set: {
          refreshToken,
          expiry: moment().add(7, "days").toDate(),
        },
      }
    );
    res.cookie("accessToken", accessToken, getOptions("at"));
    res.cookie("refreshToken", refreshToken, getOptions("rt"));
    res.json({ message: "Token Refreshed" });
  } catch (error) {
    catchError(error, res, "Failed to refresh token");
  }
};

export const getSession = async (req: Request, res: Response) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) throw TryError("Invalid Session", 401);

    const session = await jwt.verify(accessToken, process.env.JWT_SECRET!);
    res.json(session);
  } catch (error) {
    catchError(error, res, "Invalid Session");
  }
};

export const updateProfilePicture = async (
  req: SessionInterface,
  res: Response
) => {
  try {
    const path = `${process.env.S3_URL}/${req.body.path}`;
    if (!path || !req.session)
      throw TryError("Failed to update profile picture", 400);

    await UserModel.findOneAndUpdate(
      { _id: req.session.id },
      { $set: { image: path } }
    );

    
    res.json({ image: path });
  } catch (error) {
    catchError(error, res, "Failed to update Profile picture");
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const options = {
      httpOnly: true,
      maxAge: 0,
      secure: process.env.NODE_ENV === "production",
      domain: "localhost",
    };
    res.clearCookie("accessToken", options);
    res.clearCookie("refreshToken", options);
    res.json({ message: "Logged out" });
  } catch (error) {
    catchError(error, res, "Failed to logout");
  }
};
