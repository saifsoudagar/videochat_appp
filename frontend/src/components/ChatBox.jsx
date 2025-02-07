import { useState, useEffect } from "react";

const ChatBox = ({ socket, partnerSocketId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (data) => {
      console.log("ChatBox received message:", data);
      if (data && data.message) {
        setMessages((prev) => [...prev, { from: data.from, text: data.message }]);
      }
    };

    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [socket]);

  const sendMessage = () => {
    if (!partnerSocketId) {
      console.error("No partnerSocketId defined.");
      return;
    }
    if (message.trim() === "") return;

    console.log("Sending message:", message, "to:", partnerSocketId);
    socket.emit("send-message", { target: partnerSocketId, message });

    setMessages((prev) => [...prev, { from: "me", text: message }]);
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="bg-[#212121] rounded-lg w-full max-w-md flex flex-col h-[450px]">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-gray-100">Chat Box</h2>
      </div>

      {/* Chat messages (Scrollable) */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#1E1E1E] h-[350px]">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
            <div
              className={`px-4 py-2 rounded-lg max-w-xs break-words ${
                msg.from === "me"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-700 text-gray-100 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex">
          <input
            type="text"
            className="flex-1 border border-gray-700 rounded-l-lg px-4 py-2 bg-transparent text-gray-100 focus:outline-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg px-4 py-2 focus:outline-none"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
