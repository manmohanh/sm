import { Router } from "express";
import AuthMiddleware from "../middlewares/auth.middleware";
import { createPost, fetchPosts } from "../controllers/post.controller";

const router = Router()

router.post("/",createPost)
router.get("/",fetchPosts)

export default router;