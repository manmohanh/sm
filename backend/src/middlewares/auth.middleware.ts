import { NextFunction, Request, Response } from "express";
import { catchError, TryError } from "../utils/error";
import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";

export interface PayloadInterface {
  id: mongoose.Types.ObjectId;
  fullname: string;
  email: string;
  mobile: string;
  image: string | null;
}

export interface SessionInterface extends Request {
  session?: PayloadInterface;
}

const AuthMiddleware = async (
  req: SessionInterface,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) throw TryError("Unauthorized", 401);

    const payload = (await jwt.verify(
      accessToken,
      process.env.JWT_SECRET!
    )) as JwtPayload;
    
    
    req.session = {
      id: payload.id,
      fullname: payload.fullname,
      mobile: payload.mobile,
      email: payload.email,
      image:payload.image
    };
    next();
  } catch (error) {
    catchError(error, res, "Unauthorized");
  }
};

export default AuthMiddleware;
