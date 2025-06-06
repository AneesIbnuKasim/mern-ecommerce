import jwt  from "jsonwebtoken";
import { Server } from "socket.io";
import messageModel from "../models/messageModel.js";

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
  const agentSocketMap = {}

  io.on("connection", socket => {
    console.log("User connected:", socket.id, socket.user);
    const {role, _id:userId} = socket.user._id;
    const agentId = process.env.admin_id;
    userId ? userSocketMap[userId] = socket.id : agentSocketMap[agentId] = socket.id;
    console.log(`${role ? role : 'agent'} connected`);
    socket.on("join room", () => {
      const roomId = `room-${userId}`
      socket.emit("joined room",roomId); // joined one-on-one room
    });
    socket.on('send-message-to-agent',async({ roomId, message })=>{
      io.to(roomId).emit('recieve-message-from-user',{fromUserId:userId,message})
      const newMessage = new messageModel({
        fromUserId : userId,
        toUSerId : agentId,
        message : message
      })
      await newMessage.save();
    })
    socket.on('send-message-to-user',async({roomId , message})=>{
      io.to(roomId).emit('recive-message-from-agent',{agentId, message});
      const newMessage = new messageModel({
        fromUserId : userId,
        toUSerId : agentId,
        message : message
      })
      await newMessage.save();
    })

    socket.on("disconnect", () => {
      role === 'user' ? delete userSocketMap[userId] : agentSocketMap[agentId];
      console.log(`${role=== 'user' ? 'user' : 'agent'} disconnected:`);
    });
  });
};

export default setupSocket