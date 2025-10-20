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
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routers/auth.router";
import storageRouter from "./routers/storage.router";
import AuthMiddleware from "./middlewares/auth.middleware";
import friendRouter from "./routers/friend.router";
import SwaggerConfig from "./utils/swagger";
import { serve, setup } from "swagger-ui-express";
import StatusSocket from "./socket/status.socket";
import corsConfig from "./utils/cors";
import ChatSocket from "./socket/chat.socket";
import chatRouter from "./routers/chat.router";

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: corsConfig });

StatusSocket(io);
ChatSocket(io);

//Middlwares
app.use(cors(corsConfig));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Endpoints
app.use("/api-docs", serve, setup(SwaggerConfig));
app.use("/auth", authRouter);
app.use("/storage", AuthMiddleware, storageRouter);
app.use("/friend", AuthMiddleware, friendRouter);
app.use("/chat", chatRouter);

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`Server is running on port:${port}`);
});
