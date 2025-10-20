import mongoose from "mongoose";
import ChatModel from "../models/chat.model";
import { Request, Response } from "express";
import { catchError } from "../utils/error";
import { SessionInterface } from "../middlewares/auth.middleware";

interface PayloadInterface {
  from: string;
  to: string;
  message: string;
  file?: {
    path: string;
    type: string;
  };
}

export const createChat = (payload: PayloadInterface) => {
  ChatModel.create(payload).catch((error) => {
    console.log(error.message);
  });
};

export const fetchChats = async (req: SessionInterface, res: Response) => {
  try {
    const chats = await ChatModel.find({
      $or: [
        {
          from: req.session?.id,
          to: req.params.to,
        },
        {
          from: req.params.to,
          to: req.session?.id,
        },
      ],
    }).populate("from","fullname email mobile image")
    res.json(chats);
  } catch (error) {
    catchError(error, res, "Failed to fetch chats");
  }
};
