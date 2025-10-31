import { Server } from "socket.io";

const VideoSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log(`Connected user`);

    socket.on("offer", ({ offer, to, from }) => {
      io.to(to).emit("offer", { offer, from });
    });

    socket.on("candidate", ({ candidate, to }) => {
      io.to(to).emit("candidate", { candidate, from: socket.id });
    });

    socket.on("answer", ({ answer, to }) => {
      io.to(to).emit("answer", { answer, from: socket.id });
    });

    socket.on("end", ({ to }) => {
      io.to(to).emit("end", { from: socket.id });
    });
  });
};
export default VideoSocket;
