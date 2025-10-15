import { Router } from "express";
import {
  refreshToken,
  getSession,
  login,
  signup,
  updateProfilePicture,
  logout,
} from "../controllers/auth.controller";
import AuthMiddleware from "../middlewares/auth.middleware";
import RefreshToken from "../middlewares/refresh.middleware";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/refresh-token",RefreshToken, refreshToken);
router.get("/session", getSession);
router.put("/profile-picture",AuthMiddleware , updateProfilePicture);

export default router;
