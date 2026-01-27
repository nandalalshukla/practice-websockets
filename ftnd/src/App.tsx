import { useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

function App() {
  const [message, setMessage] = useState("");
  function handleSend(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
        if (message.trim() !== "") {
          socket.emit("chat message", message);
          setMessage("");
        }
  }

  return (
    <>
      <form
        className="flex flex-row gap-2 items-center justify-center max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md"
        onSubmit={handleSend}
      >         
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="message"
          >
            Message
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="message"
            type="text"
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-1 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Send
          </button>
        </div>
      </form>
    </>
  );
}

export default App;
