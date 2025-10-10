import { Router } from "express";
import { forgotPassword, getSession, login, signup } from "../controllers/auth.controller";
const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.get("/session",getSession)

export default router;
