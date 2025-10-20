import { Server } from "socket.io";
import { createChat } from "../controllers/chat.controller";

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
  });
};

export default ChatSocket;
