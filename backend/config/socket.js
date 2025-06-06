import jwt  from "jsonwebtoken";
import { Server } from "socket.io";
import messageModel from "../models/messageModel";

let io;

const setupSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // frontend URL
      methods: ["GET", "POST"],
    }, 
  });
  io.use((socket, next)=>{
    const token = socket.handshake.auth?.token;
    if (!token) return next( new Error("Authentciation Error: You are not logged in"));
    try {
      const user = jwt.verify(token,process.env.jwt_secret);
      socket.user = user;
      next();
    } catch (error) {
      return next( new Error("Authentcation Error: Invalid Token"));
    }
  })
  const userSocketMap = {}
  io.on("connection", socket => {
    console.log("User connected:", socket.id, socket.user);
    const userId = socket.user.id;
    userSocketMap[userId] = socket.id;
    console.log(`user connected: ${userId}`);
   
    
    socket.on("join room", () => {
      const roomId = `room-${userId}`
      socket.emit("joined room",roomId); // broadcast to user
    });
    socket.on('send message',async({ roomId, message , toUserId })=>{
      const newMessage = new messageModel({
        formUserId : userId,
        toUSerId : toUserId,
        message : message
      })
      await newMessage.save();
    })

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

export default setupSocket