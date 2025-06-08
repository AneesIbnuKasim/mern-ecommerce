import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import {jwtDecode} from "jwt-decode";

const socket = io("http://localhost:3001", {
  auth: {
    token: localStorage.getItem("token"), //send jwt for auth verification
  },
});
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomId, setRoomId] = useState("");
  const bottomRef = useRef(null);
  let botRun = useRef(false);
  let userId;
  //set userId from jwt
  const token = localStorage.getItem("token");
if (token) {
  const decoded = jwtDecode(token);
  userId = decoded.user_id;
  console.log('jwt userId',userId);
}
  

  //recieve messages
  useEffect(() => {
    socket.on("receive-message-from-admin", ({ fromUserId, toUserId, roomId, message }) => {
      console.log('admin msg hit',fromUserId);
      
      setMessages((prev) => [...prev, {fromUserId:fromUserId,message}]);
    });

    socket.on("userTyping", ({ userId }) => {
      if (userId) setIsTyping(true);
    });

    socket.on("userStoppedTyping", ({ userId }) => {
      if (userId) setIsTyping(false);
    });

    return () => {
      socket.off("recive-message-from-admin");
      socket.off("joined-room");
      socket.off("userTyping");
      socket.off("userStoppedTyping");
    };
  }, []);
  //Toggle chat and recieving roomId from backend
  const toggleChat = () => {
    socket.emit("join-room",userId);
    socket.on("joined-room", (roomId) => {
      console.log("user join in room:", roomId);
      console.log(
        "Fetching messages from:",
        `${backendUrl}/api/messages/${roomId}`
      );
      axios
        .get(`${backendUrl}/api/messages/${roomId}`)
        .then((res) => setMessages(res.data))
        .catch(console.error);
      setRoomId(roomId);
    });

    setIsOpen(!isOpen);
  };
  //scroll messages to latest
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages, toggleChat]);

  //send message to admin
  const sendMessage = () => {
    if (!message.trim()) return;
    const msg = {
      roomId,
      fromUserId: userId,
      message,
    };
    console.log('send msg to admin',msg);
    
    socket.emit("send-message-to-admin", msg );
    setMessages([...messages, { fromUserId: userId, message }]);
    setMessage("");

    // Simulate bot/help reply
    if (!botRun.current) {
      botRun.current = true;
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { fromUserId: "bot", message: "Hey! How can I help You?" },
        ]);
      }, 1000);
    }
  };

  return (
    <div>
      {/* Floating button */}
      <button
        onClick={toggleChat}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#0f62fe",
          color: "white",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          fontSize: "24px",
          border: "none",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        💬
      </button>

      {/* Popup Chat Box */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "300px",
            height: "400px",
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            zIndex: 1000,
          }}
        >
          <div style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
            <strong>Help Chat</strong>
            <button
              onClick={toggleChat}
              style={{ float: "right", border: "none", background: "none" }}
            >
              ✖
            </button>
          </div>

          <div style={{ flex: 1, padding: "10px", overflowY: "auto" }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{ textAlign: msg.fromUserId === userId ? "right" : "left" }}
              >
                <div
                  style={{
                    display: "inline-block",
                    backgroundColor:
                      msg.fromUserId === userId ? "#dcf8c6" : "#f1f0f0",
                    borderRadius: "10px",
                    padding: "5px 10px",
                    margin: "5px 0",
                  }}
                >
                  {msg.message}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div style={{ display: "flex", borderTop: "1px solid #eee" }}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ flex: 1, border: "none", padding: "10px" }}
              placeholder="Type your message"
            />
            <button
              onClick={sendMessage}
              style={{
                border: "none",
                background: "#0f62fe",
                color: "white",
                padding: "10px",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
