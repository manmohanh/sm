import { Router } from "express";
import { createOrder, webhook } from "../controllers/payment.controller";

const router = Router();

router.post("/order", createOrder);
router.post("/webhook", webhook);

export default router;
