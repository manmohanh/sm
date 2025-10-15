import { Request, Response } from "express";
import { catchError } from "../utils/error";
import FriendModel from "../models/friend.model";
import { SessionInterface } from "../middlewares/auth.middleware";

export const addFriend = async (req:SessionInterface,res:Response) => {
    try {
        req.body.user = req.session?.id
        const friend = await FriendModel.create(req.body)
        res.json(friend)
    } catch (error) {
        catchError(error,res,"Failed to send friend request")
    }
}

export const fetchFriends = async (req:SessionInterface,res:Response) => {
    try {
        const user = req.session?.id
        const friends = await FriendModel.find({user})
        res.json(friends)
    } catch (error) {
        catchError(error,res,"Failed to send friend request")
    }
}