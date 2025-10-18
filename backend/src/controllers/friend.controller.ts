import { Request, Response } from "express";
import { catchError, TryError } from "../utils/error";
import FriendModel from "../models/friend.model";
import { SessionInterface } from "../middlewares/auth.middleware";
import UserModel from "../models/user.model";
import mongoose from "mongoose";

export const addFriend = async (req: SessionInterface, res: Response) => {
  try {
    req.body.user = req.session?.id;
    const friend = await FriendModel.create(req.body);
    res.json(friend);
  } catch (error) {
    catchError(error, res, "Failed to send friend request");
  }
};

export const fetchFriends = async (req: SessionInterface, res: Response) => {
  try {
    if(!req.session)
      throw TryError("Unauthorized",401)
    const user = req.session?.id;
    const friends = await FriendModel.find({ user }).populate("friend");
    res.json(friends);
  } catch (error) {
    catchError(error, res, "Failed to send friend request");
  }
};

export const deleteFriend = async (req: Request, res: Response) => {
  try {
    await FriendModel.deleteOne({ _id: req.params.id });
    res.json({ message: "Friend deleted" });
  } catch (error) {
    catchError(error, res, "Failed to delete friend");
  }
};

export const suggestedFriends = async (
  req: SessionInterface,
  res: Response
) => {
  try {
    if (!req.session?.id) throw TryError("Unauthorized", 401);

    const friends = await UserModel.aggregate([
      {
        $match: {
          _id: { $ne: new mongoose.Types.ObjectId(req.session.id) },
        },
      },
      { $sample: { size: 5 } },
      { $project: { fullname: 1, email: 1, image: 1 } },
    ]);

    const modified = await Promise.all(
      friends.map(async (item) => {
        const count = await FriendModel.countDocuments({ friend: item._id });
        return count === 0 ? item : null;
      })
    );

    const filtered = modified.filter((item) => item !== null);
    res.json(filtered);
  } catch (error) {
    catchError(error, res, "Failed to send friend request");
  }
};

export const friendRequests = async (req: SessionInterface, res: Response) => {
  try {
    if (!req.session) throw TryError("Unauthorized", 401);

    const friends = await FriendModel.find({ friend: req.session.id,status:"requested" }).populate(
      "user",
      "fullname image email"
    );
    res.json(friends);
  } catch (error) {
    catchError(error, res, "Failed to fetch friend request");
  }
};

export const updateFriendStatus = async (
  req: SessionInterface,
  res: Response
) => {
  try {
    if (!req.session) throw TryError("Unauthorized", 401);

    await FriendModel.updateOne(
      { _id: req.params.id },
      { $set: { status: req.body.status } }
    );
    res.json({message:"Friend status updated"});
  } catch (error) {
    catchError(error, res, "Failed to update friend status");
  }
};
