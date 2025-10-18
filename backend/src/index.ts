import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
mongoose
  .connect(process.env.DB as string)
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log("Mongodb Error", err);
  });

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routers/auth.router";
import storageRouter from "./routers/storage.router";
import AuthMiddleware from "./middlewares/auth.middleware";
import friendRouter from "./routers/friend.router"
import SwaggerConfig from "./utils/swagger";
import { serve, setup } from "swagger-ui-express";

const app = express();
const port = process.env.PORT || 8080;

app.use(
  cors({
    origin: process.env.CLIENT,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api-docs",serve,setup(SwaggerConfig))
app.use("/auth", authRouter);
app.use("/storage",AuthMiddleware,storageRouter)
app.use("/friend",AuthMiddleware,friendRouter)

app.listen(port, () => {
  console.log(`Server is running on port:${port}`);
});
