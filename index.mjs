import "dotenv/config";
import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import { createServer } from "http";
const app = express();
const usermap = new Map();
const httpserver = createServer(app);
const io = new Server(httpserver, {
  cors: {
    origin: [process.env.FRONTEND],
  },
});
app.use(
  cors({
    origin: process.env.FRONTEND,
  })
);

io.on("connection", (socket) => {
  socket.on("joinroom", ({ name, room }) => {
    socket.join(room);
    usermap.set(socket.id, { room: room, name: name });
    socket.to(room).emit("userjoined", { name, socketid: socket.id });
    socket.to(room).emit("usercount", {
      count: io.sockets.adapter.rooms.get(room)?.size,
    });
  });

  socket.on("drawline", ({ prevpoint, currentpoint, color, room }) => {
    socket.to(room).emit("drawline", { prevpoint, currentpoint, color });
  });

  socket.on("clear", ({ name, room }) => {
    socket.to(room).emit("clear", { name });
  });
  socket.on("message", ({ name, chatinput, room }) => {
    socket.to(room).emit("message", { name, message: chatinput });
  });

  socket.on("canvasdata", ({ data, socketid }) => {
    socket.to(socketid).emit("canvasdata", { data });
  });

  socket.on("disconnect", () => {
    const data = usermap.get(socket.id);
    usermap.delete(socket.id);
    socket.to(data.room).emit("message", {
      name: "",
      message: `${data.name} left the room`,
    });
    io.to(data.room).emit("usercount", {
      count: io.sockets.adapter.rooms.get(data.room)?.size,
    });
  });
});

httpserver.listen(process.env.PORT, () => {
  console.log("app is listening");
});
