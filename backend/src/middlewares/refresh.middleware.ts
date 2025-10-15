import { NextFunction, Request, Response } from "express";
import { catchError, TryError } from "../utils/error";
import UserModel from "../models/user.model";
import moment from "moment";
import { SessionInterface } from "./auth.middleware";

const RefreshToken = async (
  req: SessionInterface,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) throw TryError("Failed to refresh token", 401);

    const user = await UserModel.findOne({ refreshToken });

    if (!user) throw TryError("Failed to refresh token", 401);

    const today = moment();
    const expiry = moment(user.expiry);

    const isExpired = today.isAfter(expiry);
    if (isExpired) throw TryError("Failed to refresh token", 401);

    req.session = {
      id: user.id,
      fullname: user.fullname,
      mobile: user.mobile,
      email: user.email,
      image: user.image,
    };

    next();
  } catch (error) {
    catchError(error, res, "Failed to refresh token");
  }
};

export default RefreshToken;
