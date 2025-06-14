import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import messageModel from "../models/messageModel.js";
import { v4 as uuidv4 } from "uuid";

let io;

const setupSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        "https://ecommerce-frontend-murex-two.vercel.app",                // User FE
        "https://mern-ecommerce-admin-beta.vercel.app",                  // Admin FE
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
    const { role, user_id: userId, name } = socket.user;
    const adminId = process.env.admin_id;
    
    //user id -> socket.id mapping and agent.id -> socket.id mapping
    userId
      ? (userSocketMap[userId] = socket.id)
      : (agentSocketMap[adminId] = socket.id);
    socket.on("join-room", (userId) => {
      const roomId = [adminId, userId].sort().join("-");

      socket.join(roomId);
      console.log(`${ name ? name : 'admin' } joined on room`, roomId);
      socket.emit("joined-room", roomId); // joined one-on-one room
    });
    socket.on("send-message-to-admin", async ({ roomId, message }) => {
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
        
        io.to(roomId).emit("receive-message-from-admin", msg);
        await msg.save();
      }
    );
    socket.on("typing", ({ roomId, userId, name }) => {
      socket.to(roomId).emit("userTyping", { userId, name });
    });

    socket.on("stopTyping", ({ roomId, userId }) => { 
      socket.to(roomId).emit("userStoppedTyping", userId);
    });

    socket.on("disconnect", () => {
      role === "user"
        ? delete userSocketMap[userId]
        : delete agentSocketMap[adminId];
      console.log(`${socket.name ? socket.name : "agent"} disconnected:`);
    });
  });
};

export default setupSocket;
