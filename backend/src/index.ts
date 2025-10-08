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
import cookieParser from "cookie-parser"
import authRouter from "./routers/auth.router"

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth",authRouter)

app.listen(port, () => {
  console.log(`Server is running on port:${port}`);
});
