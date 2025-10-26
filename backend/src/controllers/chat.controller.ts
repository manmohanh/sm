import mongoose from "mongoose";
import ChatModel from "../models/chat.model";
import { Request, Response } from "express";
import { catchError, TryError } from "../utils/error";
import { SessionInterface } from "../middlewares/auth.middleware";
import { downloadObject } from "../utils/s3";

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
  });
};

// export const fetchChats = async (req: SessionInterface, res: Response) => {
//   try {
//     if (!req.session) throw TryError("Unauthorized", 401);

//     const chats = await ChatModel.find({
//       $or: [
//         {
//           from: req.session?.id,
//           to: req.params.to,
//         },
//         {
//           from: req.params.to,
//           to: req.session?.id,
//         },
//       ],
//     }).populate("from", "fullname email mobile image");
//     res.json(chats);
//   } catch (error) {
//     catchError(error, res, "Failed to fetch chats");
//   }
// };



export const fetchChats = async (req: SessionInterface, res: Response) => {
  try {
    if (!req.session || !req.session.id) {
      throw TryError("Unauthorized", 401);
    }

    const { to } = req.params;
    if (!to) {
      throw TryError("Recipient ID (to) is required", 400);
    }

    const chats = await ChatModel.find({
      $or: [
        { from: req.session.id, to },
        { from: to, to: req.session.id },
      ],
    })
      .populate("from", "fullname email mobile image")
      .populate("to", "fullname email mobile image")
      .sort({ createdAt: 1 }).lean(); 

      const modifiedChats = await Promise.all(
        chats.map(async (item)=>{
          if(item.file){
            return {
              ...item,
              file:{
                path:item.file.path  && await downloadObject(item.file.path),
                type:item.file.type
              }
            }
          }else{
            return item
          }
        })
      )

    res.status(200).json(modifiedChats);
  } catch (error) {
    catchError(error, res, "Failed to fetch chats");
  }
};
