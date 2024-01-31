import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
const app = express();
const httpserver = createServer(app);
const io = new Server(httpserver, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

io.on("connection", (socket) => {
  socket.on("joinroom", ({ name, room }) => {
    socket.join(room);
    socket.to(room).emit("userjoined", { name, socketid: socket.id });
  });

  socket.on("drawline", ({ prevpoint, currentpoint, color, room }) => {
    socket.to(room).emit("drawline", { prevpoint, currentpoint, color });
  });

  socket.on("clear", ({ name, room }) => {
    socket.to(room).emit("clear", { name });
  });

  socket.on("canvasdata", ({ data, socketid }) => {
    socket.to(socketid).emit("canvasdata", { data });
  });
});

httpserver.listen(3001, () => {
  console.log("app is listening");
});
