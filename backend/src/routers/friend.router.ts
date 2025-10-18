import { Router } from "express";
import { addFriend, deleteFriend, fetchFriends, friendRequests, suggestedFriends, updateFriendStatus } from "../controllers/friend.controller";
const router = Router()

router.post("/",addFriend)
router.get("/",fetchFriends)
router.get("/suggestion",suggestedFriends)
router.get("/request",friendRequests)
router.put("/:id",updateFriendStatus)
router.delete("/:id",deleteFriend)

export default router;