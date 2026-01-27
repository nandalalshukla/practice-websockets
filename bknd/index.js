import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";


const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  }),
);
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});


app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});