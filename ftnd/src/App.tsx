import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

interface Message {
  username: string;
  message: string;
  socketId: string;
}

socket.on("connect", () => {
  console.log("Connected to socket server:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("Socket connection error:", err.message);
});

function App() {
  const [username, setUsername] = useState("");
  const [isNameSet, setIsNameSet] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [mySocketId, setMySocketId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Store our own socket ID
    const handleConnect = () => {
      console.log("Connected with socket ID:", socket.id);
      setMySocketId(socket.id || "");
    };

    if (socket.connected && socket.id) {
      setMySocketId(socket.id);
    }

    socket.on("connect", handleConnect);

    const handler = (msg: Message) => {
      console.log("Received:", msg);
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("chat message", handler);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("chat message", handler);
    };
  }, []);

  function handleNameSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (username.trim() !== "") {
      socket.emit("set username", username);
      setIsNameSet(true);
    }
  }

  function handleSend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (message.trim() !== "") {
      socket.emit("chat message", { username, message });
      setMessage("");
    }
  }


  // Name input modal
  if (!isNameSet) {
    return (
      <div className="bg-white flex items-center justify-center">
        <div className="border border-black p-2">
          <h2 className="text-black mb-4 text-center text-lg font-bold">
            Enter your name
          </h2>
          <form onSubmit={handleNameSubmit}>
            <input
              className="w-full border border-black text-black mb-3"
              type="text"
              placeholder="Your name..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              maxLength={20}
            />
            <button
              className="w-full bg-black text-white py-2 hover:bg-gray-800"
              type="submit"
            >
              Join Chat
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Main chat interface
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="border border-black max-w-4xl w-full h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-black text-white p-3 border-b border-black">
          <h1 className="text-lg font-bold">Chat - {username}</h1>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              <p>No messages yet</p>
            </div>
          ) : (
            messages.map((msg, i) => {
              const isOwnMessage = msg.username === username;
              console.log(
                `Message from ${msg.username}, my username: ${username}, isOwn: ${isOwnMessage}`,
              );
              return (
                <div
                  key={i}
                  className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-2`}
                >
                  <div
                    className={`max-w-xs ${isOwnMessage ? "text-right" : "text-left"}`}
                  >
                    <div className="text-xs text-black mb-1">
                      {isOwnMessage ? "You" : msg.username}
                    </div>
                    <div
                      className={`px-3 py-2 border border-black ${
                        isOwnMessage
                          ? "bg-black text-white"
                          : "bg-white text-black"
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          className="p-3 bg-white border-t border-black flex gap-2"
          onSubmit={handleSend}
        >
          <input
            className="flex-1 px-3 py-2 border border-black text-black"
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            className="bg-black text-white px-4 py-2 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={!message.trim()}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
