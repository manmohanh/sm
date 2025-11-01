import { Request, Response } from "express";
import Razorpay from "razorpay";
import { catchError, TryError } from "../utils/error";
import crypto from "crypto"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req: Request, res: Response) => {
  try {
    const amount = req.body?.amount;
    if (!amount) throw TryError("Amount is required", 400);

    const payload = {
      amount: amount * 100,
      currency: process.env.CURRENCY as string,
      receipt: `rcp_${Date.now()}`,
    };
    const order = await razorpay.orders.create(payload);
    res.json(order);
  } catch (error) {
    catchError(error, res, "Failed to create order");
  }
};

export const webhook = async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-razorpay-signature']
    
    if(!signature)
      throw TryError("Invalid request",400)

    const payload = JSON.stringify(req.body)

    const generatedSignature = crypto.createHmac("sha256",process.env.WEBHOOK_SECRET!).update(payload).digest("hex")

    if(signature !== generatedSignature)
      throw TryError("Invalid request",400)

    res.json("payment success")
  } catch (error) {
    catchError(error,res,"Failed to process webhook")
  }
};
