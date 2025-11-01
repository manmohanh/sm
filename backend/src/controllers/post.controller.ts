import { Request, Response } from "express";
import { catchError } from "../utils/error";
import PostModel from "../models/post.model";
import { SessionInterface } from "../middlewares/auth.middleware";

export const createPost = async (req: SessionInterface, res: Response) => {
  try {
    req.body.user = req.session?.id
    const post = await PostModel.create(req.body)
    res.json(post)
  } catch (error) {
    catchError(error, res, "Failed to create post.");
  }
};

export const fetchPosts = async (req: SessionInterface, res: Response) => {
  try {
    // req.body.user = req.session?.id
    const posts = await PostModel.find().sort({createdAt:-1})
    res.json(posts)
  } catch (error) {
    catchError(error, res, "Failed to fetch post.");
  }
};