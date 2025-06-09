import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import messageModel from "../models/messageModel.js";
import { v4 as uuidv4 } from "uuid";

let io;

const setupSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173", // user chat
        "http://localhost:5174", // admin chat
      ],
      methods: ["GET", "POST"],
    },
  });
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token)
      return next(new Error("Authentciation Error: You are not logged in"))
    try {
      const user = jwt.verify(token, process.env.jwt_secret);
      socket.user = user;
      next();
    } catch (error) {
      return next(new Error("Authentcation Error: Invalid Token"));
    }
  });

  const userSocketMap = {};
  const agentSocketMap = {};
  //listen for new user connections
  io.on("connection", (socket) => {
    const { role, user_id: userId } = socket.user;
    const adminId = process.env.admin_id;
    
    //user id -> socket.id mapping and agent.id -> socket.id mapping
    userId
      ? (userSocketMap[userId] = socket.id)
      : (agentSocketMap[adminId] = socket.id);

    console.log(`${role ? role : "agent"} connected`);
    socket.on("join-room", (userId) => {
      console.log('user id',userId);
      console.log(userSocketMap);
      
      
      const roomId = [adminId, userId].sort().join("-");

      socket.join(roomId);
      console.log(`${ role ? role : 'admin' } joined on room`, roomId);
      socket.emit("joined-room", roomId); // joined one-on-one room
    });
    socket.on("send-message-to-admin", async ({ roomId, message }) => {
      console.log(`for user ${userId}`,message);
      
      const msg = new messageModel({
        messageId: uuidv4(),
        roomId,
        fromUserId: userId,
        toUserId: adminId,
        message,
      });
      io.to(roomId).emit("receive-message-from-user", msg);
      await msg.save();
    });
    socket.on(
      "send-message-to-user",
      async ({ roomId, fromUserId, toUserId, message }) => {
        const msg = new messageModel({
          messageId: uuidv4(),
          roomId,
          fromUserId,
          toUserId,
          message,
        });
        console.log('rooooom id',roomId);
        
        io.to(roomId).emit("receive-message-from-admin", msg);
        await msg.save();
      }
    );
    socket.on("typing", ({ roomId, userId, name }) => {
      console.log(`[TYPING] ${name} typing in room ${roomId}`);
      
      socket.to(roomId).emit("userTyping", { userId, name });
    });

    socket.on("stopTyping", ({ roomId, userId }) => {
     console.log("Received stopTyping for", userId, "Current selection:");
      
      socket.to(roomId).emit("userStoppedTyping", userId);
    });

    socket.on("disconnect", () => {
      role === "user"
        ? delete userSocketMap[userId]
        : delete agentSocketMap[adminId];
      console.log(`${role === "user" ? "user" : "agent"} disconnected:`);
    });
  });
};

export default setupSocket;
