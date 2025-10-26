import { Server } from "socket.io";
import { createChat } from "../controllers/chat.controller";
import { downloadObject } from "../utils/s3";

const ChatSocket = (io: Server) => {
  io.on("connection", (socket) => {
    socket.on("message", (payload) => {
      console.log(payload);
      createChat({
        ...payload,
        from: payload.from.id,
      });
      io.to(payload.to).emit("message", {
        from: payload.from,
        message: payload.message,
      });
    });

    socket.on("attachment", async (payload) => {
      createChat({
        ...payload,
        from: payload.from.id,
      });
      io.to(payload.to).emit("attachment", {
        from: payload.from,
        message: payload.message,
        file: {
          path: await downloadObject(payload.file.path),
          type: payload.file.type,
        },
      });
    });
  });
};

export default ChatSocket;
