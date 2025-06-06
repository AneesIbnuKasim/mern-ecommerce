import { Server } from "socket.io";

let io;

const setupSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // frontend URL
      methods: ["GET", "POST"],
    }, 
  });

  io.on("connection", socket => {
    console.log("User connected:", socket.id);

    socket.on("sendMessage", (data) => {
      console.log("Message received:", data);
      io.emit("receiveMessage", data); // broadcast to all
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

export default setupSocket