import React, { useEffect, useState, useRef } from "react";
import { backendUrl } from "../App";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:3001", {
  auth: {
    token: localStorage.getItem("token"),
  },
}); // backend URL

const AdminChat = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [roomId, setRoomId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const typingTimeoutRef = useRef(null);
  const adminId = import.meta.env.admin_id;

  // Join room and fetch history when user selected
  useEffect(() => {
    if (!selectedUser) return;
  }, [selectedUser]);

  //fetch users
  useEffect(() => {
    axios
      .get(backendUrl + "/api/messages/users")
      .then((res) => {
        console.log("users admin:", res);
        setUsers(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // Receive messages
  useEffect(() => {
    socket.on("receive-message-from-user", ({fromUserId, message}) => {
      console.log("FROM USER ID:", fromUserId);
      setMessages((prev) => [...prev, {fromUserId:fromUserId, message}]);
      setUsers((prev) =>
        prev.includes(fromUserId) ? prev : [...prev, fromUserId]
      );
    });

    socket.on("userTyping", ({ userId }) => {
      if (userId === selectedUser) setIsTyping(true);
    });

    socket.on("userStoppedTyping", ({ userId }) => {
      if (userId === selectedUser) setIsTyping(false);
    });

    return () => {
      socket.off("receive-message-from-user");
      socket.off("userTyping");
      socket.off("userStoppedTyping");
    };
  }, []);

  // handle Join
  const handleJoin = (userId) => {
    setSelectedUser(userId);

    socket.emit("join-room",userId);
    socket.on("joined-room", (roomId) => {
      setRoomId(roomId);
      console.log("adminroom", roomId);
      console.log(
        "Fetching messages from:",
        `${backendUrl}/api/messages/${roomId}`
      );
      // Load message history
      axios
        .get(`${backendUrl}/api/messages/${roomId}`)
        .then((res) => setMessages(res.data))
        .catch(console.error);
    });
  };

  // Send message to user
  const handleSend = () => {
    if (!message.trim()) return;
    const msg = {
      roomId,
      fromUserId: adminId,
      toUserId: selectedUser,
      message,
    };
    socket.emit("send-message-to-user", msg);
    console.log('admin sended msg',msg);
    
    setMessages(prev=>[...prev,{fromUserId:adminId, message}])
    setMessage("");
    socket.emit("stopTyping", { roomId, userId: adminId });
  };

  // typing... notification
  const handleTyping = (e) => {
    setMessage(e.target.value);
    socket.emit("typing", { roomId, userId: adminId });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { roomId, userId: adminId });
    }, 1000);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Users List */}
      <div className="w-[200px] border-r border-gray-300 p-4">
        <h3 className="border text-white bg-black text-center">Users</h3>
        {users.map((user) => (
          <div
            key={user}
            className={`cursor-pointer font-bold text-center mb-[10px] ${
              selectedUser === user ? "font-bold" : "font-normal"
            }`}
            onClick={() => handleJoin(user)}
          >
            {user}
          </div>
        ))}
      </div>

      {/* Chat Box */}
      <div
        style={{
          flex: 1,
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          height: "70vh",
        }}
      >
        <h3>Chat with: {selectedUser || "Select a user"}</h3>
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            border: "1px solid #ccc",
            padding: "1rem",
          }}
        >
          {messages.map((msg) => (
            <div
              key={msg.messageId}
              className={`mb-2 ${
                msg.fromUserId === adminId ? "text-right" : "text-left"
              }`}
            >
              <span>{msg.message}</span>
            </div>
          ))}
          {isTyping && (
            <p>
              <em>{selectedUser} is typing...</em>
            </p>
          )}
        </div>

        {/* Input Box */}
        {selectedUser && (
          <div style={{ marginTop: "1rem", display: "flex" }}>
            <input
              type="text"
              value={message}
              onChange={handleTyping}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message"
              className="flex-1 p-2"
            />
            <button
              onClick={handleSend}
              className="rounded-lg bg-green-400 px-[1rem] ml-1"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChat;
