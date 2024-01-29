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

io.on("connection", (socket) => {});

httpserver.listen(3001, () => {
  console.log("app is listening");
});
