import express from "express";
import http from "http";

import { Server } from "socket.io";
import cors from "cors";


const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

//app.use(express.static("../frontend"));

io.on("connection", socket => {
    socket.on("offer", o => 
socket.broadcast.emit("offer", o));
    socket.on("answer", a =>
socket.broadcast.emit("answer", a));
    socket.on("ice", c =>
socket.broadcast.emit("ice", c));
    socket.on("chat", m => io.emit("chat", m));
});

server.listen(3000, () =>
console.log("server running on 3000"));


module.exports = app; 
