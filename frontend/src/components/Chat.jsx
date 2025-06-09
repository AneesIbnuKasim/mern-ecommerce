import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify"
const socket = io("https://ecommerce-backend-4pcs.onrender.com", {
  auth: {
    token : localStorage.getItem("token"), //send jwt for auth verification
  },
});
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [typingName, setTypingName] = useState("Anees");
  const [roomId, setRoomId] = useState("");
  const bottomRef = useRef(null);
  const nameRef = useRef("");
  const typingTimeoutRef = useRef(null);
  const selectedAdminRef = useRef("");
  let botRun = useRef(false);
  let userId;

  //Updates ref for selectedAdmin change
  useEffect(() => {
    selectedAdminRef.current = selectedAdmin;
  }, [selectedAdmin]);

  //set userId from jwt
  const token = localStorage.getItem("token");
  if (token) {
    const decoded = jwtDecode(token);
    userId = decoded.user_id;
    nameRef.current = decoded.name;
  }

  //recieve messages
  useEffect(() => {

    // Listen messages from admin
    socket.on("receive-message-from-admin", ({ fromUserId, message }) => {
      setSelectedAdmin(fromUserId);
      setMessages((prev) => [...prev, { fromUserId: fromUserId, message }]);
    });
    //listen for typing notifications
    socket.on("userTyping", ({ userId, name }) => {
      setTypingName(name);
      if (userId === selectedAdminRef.current) setIsTyping(true);
    });
    //listen for StopTyping notifications
    socket.on("userStoppedTyping", (userId) => {
      if (userId === selectedAdminRef.current) setIsTyping(false);
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
    socket.emit("join-room", userId);
    socket.on("joined-room", (roomId) => {
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

  //clear message on close button
  const handleClose = async () => {
    try {
      await axios.post(`${backendUrl}/api/messages/deleteChat/${roomId}`);
    } catch (error) {
      console.log(error);
    }
  };

  // typing... notification
  const handleTyping = (e) => {
    setMessage(e.target.value);
    socket.emit("typing", { roomId, userId, name: nameRef.current });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { roomId, userId });
    }, 1000);
  };

  //send message to admin
  const sendMessage = () => {
    if (!message.trim()) return;
    else if (!socket.connected) {
      toast.error("Please login to connect with Agent")
       setMessage('')
      return
    }
    
    const msg = {
      roomId,
      fromUserId: userId,
      message,
    };

    socket.emit("send-message-to-admin", msg);
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
        className="fixed bottom-5 w-[60px] h-[60px] right-5 bg-blue-600 rounded-full text-2xl border-none cursor-pointer z-[1000]"
      >
        💬
      </button>

      {/* Popup Chat Box */}
      {isOpen && (
        <div className="fixed bottom-[90px] right-5 w-[300px] h-[400px] bg-[#f2f2f2] border border-[#ccc] rounded-[10px] flex flex-col justify-between z-[1000]">
          <div className="p-[10px] border-b border-gray-200">
            <strong>Help Chat</strong>
            <button
              onClick={() => {
                toggleChat();
                handleClose();
              }}
              className="float-right border-none bg-none"
            >
              ✖
            </button>
          </div>

          <div className="flex-1 p-[10px] overflow-y-auto flex flex-col hide-scrollbar">
            <div className="flex flex-col gap-2 flex-grow">
              {messages.map((msg, idx) => (
                <div key={idx}
                  className={`inline-block rounded-[10px] px-[10px] py-[5px] my-[5px]
                  ${
                    msg.fromUserId === userId ? "text-right" : "text-left"
                  }`}
                >
                  <span className={`${msg.fromUserId === userId ? "bg-[#dcf8c6]" : "bg-[#f1f0f0]"} p-3 rounded-[20px]`}>{msg.message}</span>
                </div>
              ))}
            </div>
            {/* ---------------Typing notifications*---------------*/}
            {isTyping && (
              <div className="text-sm text-gray-500 italic mt-2">
                {typingName} is typing...
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="flex mt-[1rem]">
            <input
              type="text"
              value={message}
              onChange={handleTyping}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 p-2 border border-gray-400 rounded-lg"
              placeholder="Type your message"
            />
            <button
              onClick={sendMessage}
              className="border-none rounded-lg bg-blue-600 ml-1 text-white px-4 py-2"
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
