import { Server } from "socket.io";
import * as cookie from "cookie";
import jwt, { JwtPayload } from "jsonwebtoken";

const onlineUsers = new Map();

const StatusSocket = (io: Server) => {
  io.on("connection", (socket) => {
    try {
      const rawCookie = socket.handshake.headers.cookie || "";
      const cookies = cookie.parse(rawCookie);

      const accessToken = cookies.accessToken;
      if (!accessToken) throw new Error("Access Token not found");

      const user = jwt.verify(accessToken, process.env.JWT_SECRET!) as JwtPayload
      onlineUsers.set(socket.id, user);
      socket.join(user.id)

      io.emit("online", Array.from(onlineUsers.values()));

      socket.on("get-online", () => {
        io.emit("online", Array.from(onlineUsers.values()));
      });

      socket.on("disconnect", () => {
        onlineUsers.delete(socket.id);
        io.emit("online", Array.from(onlineUsers.values()));
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        socket.disconnect();
      }
    }
  });
};

export default StatusSocket;
