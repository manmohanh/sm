import { Router } from "express";
import { addFriend, fetchFriends } from "../controllers/friend.controller";
const router = Router()

router.post("/",addFriend)
router.get("/",fetchFriends)

export default router;