import { Router } from "express";
import AuthMiddleware from "../middlewares/auth.middleware";
import { fetchChats } from "../controllers/chat.controller";

const router = Router();

router.get("/:to", AuthMiddleware, fetchChats);

export default router;
