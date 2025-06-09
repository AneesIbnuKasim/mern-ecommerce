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
  const [selectedUser, setSelectedUser] = useState("");
  const [roomId, setRoomId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingName, setTypingName] = useState("");
  const messagesContainerRef = useRef(null);
  const selectedUserRef = useRef("");

  const typingTimeoutRef = useRef(null);
  const adminId = import.meta.env.VITE_ADMIN_ID;

  // Live Updating slectedUserRef.current when selectedUser change
  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  //scroll to latetst message
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "auto",
      });
    }
  }, [messages]);

  //fetch users
  useEffect(() => {
    axios
      .get(backendUrl + "/api/messages/users")
      .then((res) => {
        setUsers(res.data.users);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // Receive messages
  useEffect(() => {
    socket.on("receive-message-from-user", ({ fromUserId, message }) => {
      setMessages((prev) => [...prev, { fromUserId: fromUserId, message }]);
      setUsers((prev) =>
        prev.includes(fromUserId) ? prev : [...prev, fromUserId]
      );
    });

    socket.on("userTyping", ({ userId, name }) => {
      setTypingName(name);
      if (userId === selectedUserRef.current) setIsTyping(true);
    });

    socket.on("userStoppedTyping", (userId) => {
      if (userId === selectedUserRef.current) setIsTyping(false);
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

    socket.emit("join-room", userId);
    socket.on("joined-room", (roomId) => {
      setRoomId(roomId);
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
    setMessages((prev) => [...prev, { fromUserId: adminId, message }]);
    setMessage("");
    socket.emit("stopTyping", { roomId, userId: adminId });
  };

  // typing... notification
  const handleTyping = (e) => {
    setMessage(e.target.value);
    socket.emit("typing", { roomId, userId: adminId, name: "admin" });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { roomId, userId: adminId });
    }, 1000);
  };

  return (
    <div className="flex h-[70vh]">
      {/* Users List */}
      <div className="w-[200px] border-r border-gray-300 p-4">
        <h3 className="border text-white bg-black text-center">Users</h3>
        {users.map((user) => (
          <div
            key={user}
            className={`cursor-pointer font-bold text-center mb-[10px] ${
              selectedUser === user ? "font-bold" : "font-normal"
            }`}
            onClick={() => handleJoin(user._id)}
          >
            {user.name}
          </div>
        ))}
      </div>

      {/* Chat Box */}
      <div className="flex-1 p-4 flex flex-col h-[70vh]">
        <h3>Chat with: {selectedUser || "Select a user"}</h3>
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto border border-gray-300 p-4 flex flex-col"
        >
          {/* Message List */}
          <div className="flex flex-col gap-2 flex-grow">
            {messages.map((msg, id) => (
              <div
                key={id}
                className={`inline-block rounded-[10px] px-[10px] py-[5px] my-[5px] break-words ${
                  msg.fromUserId === adminId ? "text-right" : "text-left"
                } `}
              >
                <span className={`${msg.fromUserId === adminId ? "bg-[#dcf8c6]" : "bg-[#f1f0f0]"} p-3 rounded-[20px]`}>{msg.message}</span>
              </div>
            ))}
          </div>

          {/* Typing Indicator */}
          {isTyping && (
            <div className="text-sm text-gray-500 italic mt-2">
              {typingName} is typing...
            </div>
          )}
        </div>

        {/* Input Box */}
        {selectedUser && (
          <div className="flex mt-[1rem]">
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
